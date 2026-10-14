"""Typed extraction and verification of QRVAI domain/reference identifiers."""
from pathlib import Path
import re

_DOMAIN = re.compile(r"(?<![A-Za-z0-9-])([A-D][0-9]{2})(?![0-9-])")
_SUB = re.compile(r"\b(SC-[A-D][0-9]{2}-[123])\b")


def extract_domain_ids(text: str) -> set[str]:
    return set(_DOMAIN.findall(text))


def extract_subcapability_ids(text: str) -> set[str]:
    return set(_SUB.findall(text))


def validate_family_reference(path: Path, family: str, domain_ids: set[str], subcapability_ids: set[str]) -> list[str]:
    if family not in "ABCD":
        return ["unknown family"]
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return [f"missing family reference: {path}"]
    errors: list[str] = []
    actual_domains = extract_domain_ids(text)
    actual_subs = extract_subcapability_ids(text)
    if actual_domains != domain_ids:
        errors.append(f"domain set mismatch for {family}: {sorted(actual_domains ^ domain_ids)}")
    if actual_subs != subcapability_ids:
        errors.append(f"sub-capability set mismatch for {family}: {sorted(actual_subs ^ subcapability_ids)}")
    if any(x[0] != family for x in actual_domains):
        errors.append("references domain outside owner family")
    return errors
