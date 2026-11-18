"""Create and preflight hermetic, review-only P1 Skill source ZIPs."""
from __future__ import annotations
from pathlib import Path
import stat
import zipfile
from scripts.p1.registry import DomainSpec
from scripts.p1.audit_domain_skills import audit_stage

PREFIX = "p1-domain-skills/"
FIXED_TIME = (1980, 1, 1, 0, 0, 0)
MAX_FILE = 1_048_576
MAX_TOTAL = 5 * MAX_FILE
MAX_RATIO = 200

def _expected(specs: tuple[DomainSpec, ...], ids: frozenset[str]) -> frozenset[str]:
    mapping = {d.id: d for d in specs}
    if any(i not in mapping for i in ids):
        raise ValueError("unknown owner ID")
    return frozenset(
        PREFIX + rel
        for i in ids
        for rel in (
            f"skills/{mapping[i].slug}/SKILL.md",
            *(p.relative_path for p in mapping[i].procedures),
        )
    )

def validate_review_zip(archive: Path, expected_paths: frozenset[str]) -> list[str]:
    """Reject ALL hostile ZIP metadata before reading any payload, never extract."""
    errors: list[str] = []
    try:
        with zipfile.ZipFile(archive, "r") as z:
            infos = z.infolist()
            paths = [i.filename for i in infos]
            if not paths or len(paths) != len(set(paths)):
                errors.append("empty or duplicate ZIP members")
            if set(paths) != expected_paths:
                errors.append("ZIP members do not match canonical allowlist")
            if any(not p.startswith(PREFIX+"skills/") or p.startswith("/") or "\\" in p or
                   any(x in ("", ".", "..") for x in p.split("/")) for p in paths):
                errors.append("unsafe ZIP member paths")
            if any(stat.S_IFMT(i.external_attr >> 16) != stat.S_IFREG for i in infos):
                errors.append("ZIP contains nonregular or symlink entries")
            if any(i.file_size > MAX_FILE for i in infos) or sum(i.file_size for i in infos) > MAX_TOTAL:
                errors.append("ZIP expanded size limit exceeded")
            if any(i.compress_type != zipfile.ZIP_DEFLATED for i in infos):
                errors.append("unsupported ZIP compression")
            if any(i.flag_bits & 1 for i in infos):
                errors.append("encrypted ZIP members")
            if any(i.file_size and (i.compress_size <= 0 or i.file_size / i.compress_size > MAX_RATIO) for i in infos):
                errors.append("ZIP compression ratio exceeds bound")
            if errors:
                return errors
            for info in infos:
                try:
                    z.read(info).decode("utf-8")
                except (RuntimeError, UnicodeError, zipfile.BadZipFile, OSError, EOFError):
                    errors.append(f"unreadable UTF-8 source: {info.filename}")
    except (OSError, ValueError, zipfile.BadZipFile, zipfile.LargeZipFile):
        errors.append("invalid ZIP archive")
    return errors

def build_review_zip(
    stage_root: Path,
    output_zip: Path,
    specs: tuple[DomainSpec, ...],
    required_ids: frozenset[str],
) -> Path:
    """Write an offline source bundle only after a successful stage audit."""
    if not required_ids:
        raise ValueError("P1.0 has no approved staged owners to package")
    violations = audit_stage(stage_root, specs, required_ids)
    if violations:
        raise ValueError("stage audit failed: " + "; ".join(violations))
    expected = _expected(specs, required_ids)
    if output_zip.resolve().is_relative_to(stage_root.resolve()):
        raise ValueError("review ZIP must be outside staged input root")
    output_zip.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_zip,"w",zipfile.ZIP_DEFLATED) as z:
        for member in sorted(expected):
            relative = member.removeprefix(PREFIX)
            data = (stage_root / relative).read_bytes()
            info=zipfile.ZipInfo(member, FIXED_TIME)
            info.create_system=3
            info.external_attr=(stat.S_IFREG | 0o644) << 16
            info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info, data, compresslevel=9)
    issues=validate_review_zip(output_zip,expected)
    if issues:
        output_zip.unlink(missing_ok=True)
        raise ValueError("review archive failed: " + "; ".join(issues))
    return output_zip
