"""Assemble the QRVAI V1 plugin: V1 core Skill + 24 staged Domain Skills + optional mcp.json.

Pure local build. It never calls Vercel, Plugin Creator or any network service.
"""
from __future__ import annotations

import argparse
import json
import re
import stat
import sys
import zipfile
from hashlib import sha256
from pathlib import Path
from urllib.parse import urlsplit

from scripts.p1.audit_domain_skills import audit_stage
from scripts.p1.registry import EXPECTED, DomainSpec, load_registry
from scripts.v0.validate import _official_schema_validator, validate_skill

ROOT = Path(__file__).resolve().parents[2]
V1_ROOT = ROOT / "qrvai-v1"
STAGE_ROOT = ROOT / "staging" / "p1-domain-skills"
TOOL_REGISTRIES = (
    ROOT / "mcp" / "qrvai-rf-worker" / "src" / "rf" / "wave1.ts",
    ROOT / "mcp" / "qrvai-rf-worker" / "src" / "live" / "tools.ts",
)
MCP_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"
VERSION = "1.0.0"
PREFIX = "qrvai/"
CORE_FILES = (
    "skills/qrvai-core/SKILL.md",
    "skills/qrvai-core/references/routing.md",
    "skills/qrvai-core/references/tools.md",
)
FIXED_TIME = (1980, 1, 1, 0, 0, 0)
MAX_FILE = 1_048_576
SERVER_NAME = "qrvai"
_TOOL = re.compile(r'\{candidate_id:"M\d{2}",name:"([a-z0-9_]+)"')
_TABLE_TOOL = re.compile(r"^\|\s*`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`\s*\|", re.M)
_RESERVED_HOSTS = ("example.com", "example.org", "example.net", "localhost", ".invalid", ".test", ".local")


def load_specs() -> tuple[DomainSpec, ...]:
    return load_registry(
        ROOT / "docs/architecture/skill-and-subskill-registry-v0.5.md",
        ROOT / "docs/architecture/capability-register-v0.5.md",
    )


def registered_tool_names() -> tuple[str, ...]:
    """Tool names come from the MCP source registry, never from a second hand-kept list."""
    names = tuple(n for path in TOOL_REGISTRIES for n in _TOOL.findall(path.read_text(encoding="utf-8")))
    if not names or len(names) != len(set(names)):
        raise ValueError("MCP tool registry unreadable or has duplicate names")
    return names


def validate_mcp_url(url: str) -> list[str]:
    """Only a real HTTPS /api/mcp endpoint may be packaged; never a placeholder."""
    try:
        parts = urlsplit(url)
        host = (parts.hostname or "").lower()
    except ValueError:
        return ["MCP URL is malformed"]
    errors: list[str] = []
    if parts.scheme != "https":
        errors.append("MCP URL must use https")
    if parts.path != "/api/mcp":
        errors.append("MCP URL path must be /api/mcp")
    if parts.query or parts.fragment or parts.username or parts.password or parts.port:
        errors.append("MCP URL must not carry query, fragment, credentials or port")
    if "." not in host or any(host == r or host.endswith(r if r.startswith(".") else "." + r) for r in _RESERVED_HOSTS):
        errors.append("MCP URL host must be a real public hostname")
    return errors


def mcp_config(url: str) -> dict:
    """Portable Agent Plugins MCP config, as documented by OpenAI's plugin build guide (checked 2026-11-15)."""
    return {"$schema": MCP_SCHEMA, "mcpServers": {SERVER_NAME: {"type": "streamable-http", "url": url}}}


def validate_manifest(data: object) -> list[str]:
    if not isinstance(data, dict):
        return ["manifest must be an object"]
    errors = ["canonical schema: " + e.message for e in _official_schema_validator().iter_errors(data)]
    if data.get("name") != "qrvai":
        errors.append("name must be qrvai")
    if data.get("version") != VERSION:
        errors.append(f"version must be {VERSION}")
    ui = data.get("extensions", {}).get("com.openai", {}).get("interface", {})
    if not isinstance(ui, dict) or ui.get("displayName") != "QRVAI":
        errors.append("displayName must be QRVAI")
    else:
        for key in ("shortDescription", "longDescription", "developerName", "category"):
            if not isinstance(ui.get(key), str) or not ui[key].strip():
                errors.append(key + " must be a nonblank string")
        if isinstance(ui.get("shortDescription"), str) and len(ui["shortDescription"]) > 30:
            errors.append("shortDescription exceeds 30 characters")
    return errors


def domain_files(specs: tuple[DomainSpec, ...]) -> tuple[str, ...]:
    return tuple(
        rel
        for spec in specs
        for rel in (f"skills/{spec.slug}/SKILL.md", *(p.relative_path for p in spec.procedures))
    )


def expected_members(specs: tuple[DomainSpec, ...], with_mcp: bool) -> frozenset[str]:
    rels = ("plugin.json", *CORE_FILES, *domain_files(specs), *(("mcp.json",) if with_mcp else ()))
    return frozenset(PREFIX + rel for rel in rels)


def audit_sources(specs: tuple[DomainSpec, ...]) -> list[str]:
    """Check everything that goes into the package before any byte is written."""
    errors = list(audit_stage(STAGE_ROOT, specs, frozenset(EXPECTED)))
    try:
        errors += validate_manifest(json.loads((V1_ROOT / "plugin.json").read_text(encoding="utf-8")))
    except (OSError, ValueError):
        errors.append("V1 manifest unreadable")
    errors += validate_skill(V1_ROOT / CORE_FILES[0])
    observed = {p.relative_to(V1_ROOT).as_posix() for p in V1_ROOT.rglob("*") if p.is_file()}
    if observed != {"plugin.json", *CORE_FILES}:
        errors.append("V1 core source does not match its allowlist")
    if any(p.is_symlink() for p in V1_ROOT.rglob("*")):
        errors.append("symlink in V1 core source")
    if errors:
        return errors
    tools = set(registered_tool_names())
    texts = {rel: (V1_ROOT / rel).read_text(encoding="utf-8") for rel in CORE_FILES}
    listed = set(_TABLE_TOOL.findall(texts[CORE_FILES[2]]))
    if listed != tools:
        errors.append("tools.md differs from MCP registry: " + ", ".join(sorted(listed ^ tools)))
    routing = texts[CORE_FILES[1]]
    for spec in specs:
        if f"`{spec.slug}`" not in routing:
            errors.append(f"routing.md does not mention {spec.slug}")
    for rel in domain_files(specs):
        if rel.endswith("/SKILL.md"):
            errors += [f"{rel}: {e}" for e in validate_skill(STAGE_ROOT / rel)]
    return errors


def validate_plugin_zip(archive: Path, specs: tuple[DomainSpec, ...]) -> list[str]:
    errors: list[str] = []
    try:
        with zipfile.ZipFile(archive) as z:
            infos = z.infolist()
            names = [i.filename for i in infos]
            with_mcp = PREFIX + "mcp.json" in names
            if len(names) != len(set(names)) or set(names) != expected_members(specs, with_mcp):
                errors.append("archive members do not match the V1 allowlist")
            if any(stat.S_IFMT(i.external_attr >> 16) != stat.S_IFREG for i in infos):
                errors.append("archive contains nonregular entries")
            if any(i.file_size > MAX_FILE or i.flag_bits & 1 or i.compress_type != zipfile.ZIP_DEFLATED for i in infos):
                errors.append("archive member size, encryption or compression not allowed")
            if errors:
                return errors
            errors += validate_manifest(json.loads(z.read(PREFIX + "plugin.json")))
            if with_mcp:
                config = json.loads(z.read(PREFIX + "mcp.json"))
                server = config.get("mcpServers", {}).get(SERVER_NAME) if isinstance(config, dict) else None
                if not isinstance(server, dict) or config != mcp_config(str(server.get("url"))):
                    errors.append("mcp.json has unexpected shape")
                else:
                    errors += validate_mcp_url(server["url"])
            for name in names:
                if name.endswith(".md"):
                    z.read(name).decode("utf-8")
    except (OSError, ValueError, KeyError, UnicodeError, zipfile.BadZipFile):
        return ["invalid or unreadable plugin archive"]
    return errors


def build_plugin(output_zip: Path, mcp_url: str | None) -> Path:
    specs = load_specs()
    errors = audit_sources(specs)
    if mcp_url is not None:
        errors += validate_mcp_url(mcp_url)
    if errors:
        raise ValueError("V1 plugin build refused: " + "; ".join(errors))
    payload: dict[str, bytes] = {"plugin.json": (V1_ROOT / "plugin.json").read_bytes()}
    for rel in CORE_FILES:
        payload[rel] = (V1_ROOT / rel).read_bytes()
    for rel in domain_files(specs):
        payload[rel] = (STAGE_ROOT / rel).read_bytes()
    if mcp_url is not None:
        payload["mcp.json"] = (json.dumps(mcp_config(mcp_url), indent=2) + "\n").encode("utf-8")
    output_zip.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as z:
        for rel in sorted(payload):
            info = zipfile.ZipInfo(PREFIX + rel, FIXED_TIME)
            info.create_system = 3
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, payload[rel], compresslevel=9)
    issues = validate_plugin_zip(output_zip, specs)
    if issues:
        output_zip.unlink(missing_ok=True)
        raise ValueError("V1 plugin archive invalid: " + "; ".join(issues))
    return output_zip


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--mcp-url", help="deployed, verified https://<host>/api/mcp endpoint")
    group.add_argument("--skills-only", action="store_true", help="draft without mcp.json, not for release")
    parser.add_argument("--out", type=Path)
    args = parser.parse_args(argv)
    suffix = "" if args.mcp_url else "-skills-only-draft"
    out = args.out or ROOT / "dist" / f"qrvai-{VERSION}{suffix}.zip"
    try:
        path = build_plugin(out, args.mcp_url)
    except ValueError as exc:
        print(exc, file=sys.stderr)
        return 2
    with zipfile.ZipFile(path) as z:
        count = len(z.namelist())
    print(f"{path} files={count} sha256={sha256(path.read_bytes()).hexdigest()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
