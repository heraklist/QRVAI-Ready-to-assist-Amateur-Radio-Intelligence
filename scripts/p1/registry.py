"""Canonical QRVAI Skill/SC registry parser: read-only, no shadow manifest."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re


@dataclass(frozen=True)
class ProcedureSpec:
    id: str
    title: str
    responsibility: str
    relative_path: str


@dataclass(frozen=True)
class DomainSpec:
    id: str
    slug: str
    trigger: str
    required_context: str
    output_contract: str
    stop_condition: str
    procedures: tuple[ProcedureSpec, ProcedureSpec, ProcedureSpec]


SK_HEADING = re.compile(r"^### SK-([A-D]\d{2}) — `([a-z][a-z0-9-]+)`\s*$", re.M)
CAP_HEADING = re.compile(r"^### ([A-D]\d{2}) — [^\n]+$", re.M)
SS_ROW = re.compile(
    r"^\|\s*`(SS-[A-D]\d{2}-[1-3])`\s*—\s*([^|\n]+)\|\s*([^|\n]+)\|\s*`(skills/[^`\n]+\.md)`\s*\|\s*$",
    re.M,
)
SC_ROW = re.compile(
    r"^\|\s*`(SC-[A-D]\d{2}-[1-3])`\s*—\s*([^|\n]+)\|\s*([^|\n]+)\|\s*`(SS-[A-D]\d{2}-[1-3])`\s*\|\s*$",
    re.M,
)
EXPECTED = tuple(
    f"{family}{number:02d}"
    for family, start, stop in (("A", 1, 6), ("B", 6, 14), ("C", 14, 22), ("D", 22, 25))
    for number in range(start, stop)
)


def _parts(text: str, headings: list[re.Match[str]]) -> list[str]:
    return [
        text[m.end(): headings[i + 1].start() if i + 1 < len(headings) else len(text)]
        for i, m in enumerate(headings)
    ]


def _field(body: str, label: str, domain: str) -> str:
    line = re.search(r"^\*\*" + re.escape(label) + r":\*\*[ \t]*(.*?)[ \t]*$", body, re.M)
    if not line or not line.group(1).strip():
        raise ValueError(f"{domain}: missing {label}")
    return line.group(1).strip()


def load_registry(skill_registry_path: Path, capability_registry_path: Path) -> tuple[DomainSpec, ...]:
    """Parse and cross-check 24 SK definitions, 72 SS and 72 SC mappings."""
    try:
        skills = skill_registry_path.read_text(encoding="utf-8")
        capabilities = capability_registry_path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        raise ValueError("canonical registry unreadable") from exc
    headings = list(SK_HEADING.finditer(skills))
    cap_headings = list(CAP_HEADING.finditer(capabilities))
    if tuple(m.group(1) for m in headings) != EXPECTED:
        raise ValueError("missing, duplicate or reordered Skill IDs")
    if tuple(m.group(1) for m in cap_headings) != EXPECTED:
        raise ValueError("missing, duplicate or reordered Capability IDs")
    cap_sections = dict(zip(EXPECTED, _parts(capabilities, cap_headings)))
    names: set[str] = set()
    procedures: set[str] = set()
    files: set[str] = set()
    result: list[DomainSpec] = []
    for heading, section in zip(headings, _parts(skills, headings)):
        identifier, slug = heading.groups()
        if slug in names:
            raise ValueError(f"{identifier}: duplicate slug")
        names.add(slug)
        if f"`skills/{slug}/SKILL.md`" not in section:
            raise ValueError(f"{identifier}: Skill entrypoint mismatch")
        trigger = _field(section, "Trigger", identifier)
        context = _field(section, "Required context", identifier)
        output = _field(section, "Output contract", identifier)
        stop = _field(section, "Refusal/stop condition", identifier)
        found = SS_ROW.findall(section)
        expected_ss = [f"SS-{identifier}-{i}" for i in (1, 2, 3)]
        if [x[0] for x in found] != expected_ss:
            raise ValueError(f"{identifier}: incomplete or misplaced SS rows")
        if len(found) != 3:
            raise ValueError(f"{identifier}: expected three procedures")
        proc: list[ProcedureSpec] = []
        for sid, title, duty, path in found:
            expected_prefix = f"skills/{slug}/references/"
            if not path.startswith(expected_prefix) or path.count("/") != 3 or any(p in ("", ".", "..") for p in path.split("/")):
                raise ValueError(f"{sid}: unsafe or wrong owner reference")
            if sid in procedures or path in files:
                raise ValueError(f"{sid}: duplicate procedure or path")
            procedures.add(sid)
            files.add(path)
            if not title.strip() or not duty.strip():
                raise ValueError(f"{sid}: missing title/responsibility")
            proc.append(ProcedureSpec(sid, title.strip(), duty.strip(), path))
        cap_section = cap_sections[identifier]
        if f"`SK-{identifier}`" not in cap_section or f"`skills/{slug}/SKILL.md`" not in cap_section:
            raise ValueError(f"{identifier}: capability owner mismatch")
        mappings = SC_ROW.findall(cap_section)
        if len(mappings) != 3 or [x[0] for x in mappings] != [f"SC-{identifier}-{i}" for i in (1, 2, 3)]:
            raise ValueError(f"{identifier}: incomplete SC mappings")
        for ordinal, row in enumerate(mappings, 1):
            if row[3] != f"SS-{identifier}-{ordinal}" or not row[1].strip() or not row[2].strip():
                raise ValueError(f"{identifier}: SC/SS ownership mismatch")
        result.append(DomainSpec(identifier, slug, trigger, context, output, stop, tuple(proc)))  # type: ignore[arg-type]
    if len(procedures) != 72 or len(files) != 72 or len(names) != 24:
        raise ValueError("incomplete canonical registry")
    return tuple(result)
