"""Isolated offline P1 Skill staging audit. No file creation or account API."""
from __future__ import annotations
from pathlib import Path
import re

from scripts.p1.registry import DomainSpec
from scripts.v0.validate import validate_skill
from scripts.v0.audit_content import validate_local_references

SECTIONS = ("Trigger", "Required context", "Output contract", "Refusal/stop condition")
REFERENCE_SECTIONS = ("Required input", "Procedure", "Output", "Error/stop")
FORBIDDEN = re.compile(
    r"(?im)^\s*(?:production_credential|secret_api_key|live_ptt_enabled|automatic_transmission_enabled)\s*:",
)

def audit_stage(root: Path, specs: tuple[DomainSpec, ...], required_ids: frozenset[str]) -> list[str]:
    """Validate precisely approved staged domain files; empty P1.0 root is OK."""
    errors: list[str] = []
    domains = {d.id: d for d in specs}
    if not isinstance(required_ids, frozenset) or any(x not in domains for x in required_ids):
        return ["invalid required Domain IDs"]
    if root.is_symlink():
        return ["symlink staging root"]
    if not root.exists():
        return [] if not required_ids else ["missing stage root with required Skills"]
    if not root.is_dir():
        return ["stage root is not a directory"]
    expected: set[str] = set()
    for domain_id in sorted(required_ids):
        d = domains[domain_id]
        expected.add(f"skills/{d.slug}/SKILL.md")
        expected.update(p.relative_path for p in d.procedures)
    seen: set[str] = set()
    for item in root.rglob("*"):
        if item.is_symlink():
            errors.append(f"symlink forbidden: {item.relative_to(root)}")
        if item.is_file() or item.is_symlink():
            try:
                rel = item.relative_to(root).as_posix()
            except ValueError:
                errors.append("stage file leaves root")
                continue
            if rel.casefold() in seen:
                errors.append(f"case-fold duplicate path: {rel}")
            seen.add(rel.casefold())
            if rel not in expected:
                errors.append(f"unexpected staged path: {rel}")
            if item.is_file() and item.stat().st_size > 1_048_576:
                errors.append(f"oversize staged source: {rel}")
    actual = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file() or p.is_symlink()}
    for rel in sorted(expected - actual):
        errors.append(f"missing canonical path: {rel}")
    if errors:
        return errors
    for domain_id in sorted(required_ids):
        d = domains[domain_id]
        package = root / "skills" / d.slug
        entry = package / "SKILL.md"
        errors.extend(validate_skill(entry))
        errors.extend(validate_local_references(package))
        try:
            text = entry.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            errors.append(f"unreadable SKILL.md: {d.slug}")
            continue
        if FORBIDDEN.search(text):
            errors.append(f"forbidden authority/secret claim: {d.slug}")
        if f"SK-{domain_id}" not in text:
            errors.append(f"missing Skill owner ID: {d.slug}")
        for label in SECTIONS:
            match = re.search(r"^\*\*" + re.escape(label) + r":\*\*[ \t]*(.+)[ \t]*$", text, re.M)
            if not match or not match.group(1).strip():
                errors.append(f"{d.slug}: missing {label}")
        for proc in d.procedures:
            ref = root / proc.relative_path
            if f"({ref.relative_to(package).as_posix()})" not in text:
                errors.append(f"{d.slug}: missing declared reference link {proc.id}")
            try:
                child = ref.read_text(encoding="utf-8")
            except (OSError, UnicodeError):
                errors.append(f"unreadable procedure: {proc.id}")
                continue
            if proc.id not in child or f"SK-{domain_id}" not in child:
                errors.append(f"wrong procedure ownership: {proc.id}")
            if proc.responsibility not in child:
                errors.append(f"missing original responsibility: {proc.id}")
            if FORBIDDEN.search(child):
                errors.append(f"forbidden authority/secret claim: {proc.id}")
            for label in REFERENCE_SECTIONS:
                if not re.search(r"^\*\*" + re.escape(label) + r":\*\*[ \t]*(.+)[ \t]*$", child, re.M):
                    errors.append(f"procedure missing {label}: {proc.id}")
    return errors
