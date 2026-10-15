"""Read-only exact identity and package-content traceability audit."""
from __future__ import annotations
import json
import re
from urllib.parse import unquote, urlsplit
from pathlib import Path
from scripts.v0.catalog import extract_domain_ids, extract_subcapability_ids
from scripts.v0.validate import validate_skill, validate_manifest

FAMILY = {"A": range(1, 6), "B": range(6, 14), "C": range(14, 22), "D": range(22, 25)}
SKILLS = {
    "qrvai-core": None,
    "qrvai-safety-regulations": "A",
    "qrvai-engineering-support": "B",
    "qrvai-operating-intelligence": "C",
    "qrvai-education-community": "D",
}


_LINK = re.compile(r'(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
# This validator intentionally supports simple inline Markdown links in portable Skills.
# Nonstandard links should be reviewed or rewritten in the source before packaging.


def validate_local_references(skill_root: Path) -> list[str]:
    """Reject references that are missing, unsafe, or leave this Skill's package."""
    errors: list[str] = []
    base = skill_root.resolve()
    for source in sorted(skill_root.rglob("*.md")):
        try:
            body = source.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            errors.append(f"unreadable reference source: {source}")
            continue
        for match in _LINK.finditer(body):
            raw = unquote(match.group(1)).strip()
            if raw.startswith("#"):
                continue
            try:
                parts = urlsplit(raw)
            except ValueError:
                errors.append(f"malformed reference URL in {source.name}: {raw}")
                continue
            if parts.scheme:
                if parts.scheme != "https":
                    errors.append(f"unsafe reference scheme in {source.name}: {raw}")
                continue
            if parts.netloc or raw.startswith("//") or not parts.path:
                errors.append(f"unsafe reference target in {source.name}: {raw}")
                continue
            target = (source.parent / parts.path).resolve()
            if not target.is_relative_to(base):
                errors.append(f"escaping Skill reference in {source.name}: {raw}")
            elif not target.is_file():
                errors.append(f"missing Skill reference in {source.name}: {raw}")
    return errors


def audit_catalog(root: Path) -> dict[str, object]:
    violations: list[str] = []
    all_domains: set[str] = set()
    all_subs: set[str] = set()
    all_skills = {p.parent.name for p in root.glob("skills/*/SKILL.md")}
    if all_skills != set(SKILLS):
        violations.append(f"skill set mismatch: {sorted(all_skills ^ set(SKILLS))}")
    violations.extend(validate_manifest(root / "plugin.json"))
    for slug, family in SKILLS.items():
        errors = validate_skill(root / f"skills/{slug}/SKILL.md")
        violations.extend(errors)
        violations.extend(validate_local_references(root / f"skills/{slug}"))
        if family is None:
            continue
        ref = root / f"skills/{slug}/references/family-{family.lower()}.md"
        try:
            text = ref.read_text(encoding="utf-8")
        except OSError:
            violations.append(f"missing reference {ref}")
            continue
        domains = extract_domain_ids(text)
        subs = extract_subcapability_ids(text)
        expected_domains = {f"{family}{i:02d}" for i in FAMILY[family]}
        expected_subs = {f"SC-{d}-{i}" for d in expected_domains for i in (1, 2, 3)}
        if domains != expected_domains:
            violations.append(f"{family}: domain IDs mismatched: {sorted(domains ^ expected_domains)}")
        if subs != expected_subs:
            violations.append(f"{family}: sub-capability IDs mismatched: {sorted(subs ^ expected_subs)}")
        if all_domains & domains or all_subs & subs:
            violations.append(f"{family}: duplicate catalog ownership")
        all_domains.update(domains)
        all_subs.update(subs)
    unsafe = (".env", "mcp.json", ".mcp.json", ".app.json", "SOURCE_RECEIPT.json", "w21_bank.py")
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        rel = p.relative_to(root).as_posix()
        if any(rel == bad or rel.endswith("/" + bad) for bad in unsafe):
            violations.append(f"prohibited package file {rel}")
        if p.suffix.lower() in (".jpeg", ".jpg", ".png", ".py", ".json") and rel != "plugin.json":
            violations.append(f"non-V0 package data file {rel}")
        if p.is_symlink():
            violations.append(f"symlink in package {rel}")
    return {"domain_ids": all_domains, "subcapability_ids": all_subs,
            "skill_names": all_skills, "family_ids": set(FAMILY),
            "violations": violations}


def validate_qa_cases(path: Path) -> list[str]:
    """Require type-safe bilingual QA cases and known V0 risk categories."""
    try:
        cases = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, ValueError):
        return ["QA corpus unreadable"]
    if not isinstance(cases, list):
        return ["QA corpus must be an array"]
    risks = {
        "mention", "missing_engine", "legal", "safety", "manual_injection",
        "device", "live", "education", "privacy", "legacy",
    }
    errors: list[str] = []
    seen: set[str] = set()
    for ix, case in enumerate(cases):
        if not isinstance(case, dict):
            errors.append(f"case {ix} must be object")
            continue
        for key in ("id", "prompt_el", "prompt_en", "risk_class"):
            value = case.get(key)
            if not isinstance(value, str) or not value.strip():
                errors.append(f"case {ix}: {key} must be a nonblank string")
        ident = case.get("id")
        if isinstance(ident, str):
            if ident in seen:
                errors.append(f"duplicate id: {ident}")
            seen.add(ident)
        family = case.get("expected_family")
        if not isinstance(family, str) or family not in FAMILY:
            errors.append(f"case {ix}: expected_family must be A, B, C or D")
        risk = case.get("risk_class")
        if not isinstance(risk, str) or risk not in risks:
            errors.append(f"case {ix}: risk_class not supported in V0")
        claims = case.get("must_not_claim")
        if (
            not isinstance(claims, list) or not claims
            or not all(isinstance(item, str) and item.strip() for item in claims)
        ):
            errors.append(f"case {ix}: must_not_claim requires nonblank strings")
    if len(cases) < 12:
        errors.append("QA corpus must contain at least 12 scenarios")
    return errors
