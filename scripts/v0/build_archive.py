"""Strict deterministic clean QRVAI V0 ZIP; no account or network mutations."""
from __future__ import annotations

import json
import posixpath
from urllib.parse import unquote, urlsplit
from pathlib import Path
import stat
import zipfile

from scripts.v0.validate import validate_manifest_data
from scripts.v0.audit_content import _LINK

ALLOWLIST = (
    "plugin.json",
    "skills/qrvai-core/SKILL.md",
    "skills/qrvai-core/references/product-scope.md",
    "skills/qrvai-core/references/routing.md",
    "skills/qrvai-safety-regulations/SKILL.md",
    "skills/qrvai-safety-regulations/references/family-a.md",
    "skills/qrvai-engineering-support/SKILL.md",
    "skills/qrvai-engineering-support/references/family-b.md",
    "skills/qrvai-operating-intelligence/SKILL.md",
    "skills/qrvai-operating-intelligence/references/family-c.md",
    "skills/qrvai-education-community/SKILL.md",
    "skills/qrvai-education-community/references/family-d.md",
)
FIXED_DATE = (2020, 1, 1, 0, 0, 0)
MAX_FILE = 1_048_576


def expected_package_paths() -> tuple[str, ...]:
    return ALLOWLIST


def _validate_root(plugin_root: Path) -> None:
    if plugin_root.name != "qrvai":
        raise ValueError("plugin root must be named qrvai")
    observed: set[str] = set()
    for file in plugin_root.rglob("*"):
        if file.is_symlink():
            raise ValueError(f"symlink not allowed: {file}")
        if file.is_file():
            rel = file.relative_to(plugin_root).as_posix()
            observed.add(rel)
            if file.stat().st_size > MAX_FILE:
                raise ValueError(f"oversized package file: {rel}")
    expected = set(ALLOWLIST)
    if observed != expected:
        raise ValueError(f"package allowlist mismatch: missing={sorted(expected-observed)}, extra={sorted(observed-expected)}")


def build_archive(plugin_root: Path, output_zip: Path) -> Path:
    _validate_root(plugin_root)
    output_zip.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for rel in sorted(ALLOWLIST):
            member = zipfile.ZipInfo("qrvai/" + rel, FIXED_DATE)
            member.create_system = 3
            member.external_attr = (stat.S_IFREG | 0o644) << 16
            member.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(member, (plugin_root / rel).read_bytes(), compresslevel=9)
    issues = validate_archive(output_zip)
    if issues:
        output_zip.unlink(missing_ok=True)
        raise ValueError("invalid archive: " + "; ".join(issues))
    return output_zip


def validate_archive(archive: Path) -> list[str]:
    errors: list[str] = []
    try:
        with zipfile.ZipFile(archive) as z:
            members = z.infolist()
            actual = [x.filename for x in members]
            expected = {"qrvai/" + rel for rel in ALLOWLIST}
            if len(actual) != len(set(actual)):
                errors.append("duplicate archive members")
            if set(actual) != expected:
                errors.append("archive paths do not match strict V0 allowlist")
            if any(x.startswith("/") or ".." in x.split("/") for x in actual):
                errors.append("archive path traversal")
            if any(stat.S_IFMT(x.external_attr >> 16) == stat.S_IFLNK for x in members):
                errors.append("archive symlink")
            if any(x.file_size > MAX_FILE for x in members) or sum(x.file_size for x in members) > 5 * MAX_FILE:
                errors.append("archive size limit exceeded")
            if "qrvai/plugin.json" in actual:
                try:
                    manifest = json.loads(z.read("qrvai/plugin.json"))
                    errors.extend(validate_manifest_data(manifest))
                except (ValueError, KeyError):
                    errors.append("unreadable manifest JSON")
            for entry in sorted(expected):
                if not entry.endswith(".md") or entry not in actual:
                    continue
                try:
                    body = z.read(entry).decode("utf-8")
                except UnicodeDecodeError:
                    errors.append(f"invalid UTF-8 reference document: {entry}")
                    continue
                skill_root = "/".join(entry.split("/")[:3])
                for match in _LINK.finditer(body):
                    raw = unquote(match.group(1)).strip()
                    if raw.startswith("#"):
                        continue
                    try:
                        parsed = urlsplit(raw)
                    except ValueError:
                        errors.append(f"malformed archive reference URL in {entry}: {raw}")
                        continue
                    if parsed.scheme:
                        if parsed.scheme != "https":
                            errors.append(f"unsafe archive reference in {entry}: {raw}")
                        continue
                    if parsed.netloc or raw.startswith("//") or not parsed.path:
                        errors.append(f"unsafe archive reference in {entry}: {raw}")
                        continue
                    target = posixpath.normpath(posixpath.join(posixpath.dirname(entry), parsed.path))
                    if not target.startswith(skill_root + "/"):
                        errors.append(f"escaping archive reference in {entry}: {raw}")
                    elif target not in actual:
                        errors.append(f"missing archive reference in {entry}: {raw}")
            import yaml
            for entry in sorted(expected):
                if entry.endswith("/SKILL.md") and entry in actual:
                    try:
                        text = z.read(entry).decode("utf-8")
                        if not text.startswith("---\n") or "\n---\n" not in text[4:]:
                            errors.append(f"missing YAML Skill frontmatter: {entry}")
                            continue
                        front = yaml.safe_load(text.split("\n---\n", 1)[0][4:])
                        slug = entry.split("/")[2]
                        if not isinstance(front, dict) or front.get("name") != slug or not front.get("description"):
                            errors.append(f"Skill identity missing: {entry}")
                    except (UnicodeDecodeError, yaml.YAMLError):
                        errors.append(f"invalid Skill encoding/frontmatter: {entry}")
    except (OSError, zipfile.BadZipFile):
        return ["invalid or unreadable ZIP"]
    return errors
