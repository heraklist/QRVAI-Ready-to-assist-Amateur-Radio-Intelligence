"""Validate reviewed EL/EN routing fixture expectations; never execute a model."""
from __future__ import annotations
import json
from pathlib import Path
from scripts.p1.registry import DomainSpec

RISK = frozenset(("numerical","legal","emergency","hardware","privacy","source","education","cross_domain"))
OUTCOMES = frozenset(("DIRECT","PARTIAL","INDETERMINATE","REFUSE","NOT_IMPLEMENTED"))
FIELDS = frozenset(("id","prompt_el","prompt_en","expected_domains","risk_class","expected_outcome","must_not_claim"))

def validate_routing_cases(path: Path, specs: tuple[DomainSpec, ...]) -> list[str]:
    errors: list[str] = []
    try:
        cases = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, ValueError):
        return ["missing or invalid routing fixture JSON"]
    if not isinstance(cases, list) or len(cases) < 16:
        return ["at least 16 bilingual routing cases required"]
    domains = {d.id for d in specs}
    seen: set[str] = set()
    coverage: set[str] = set()
    families: set[str] = set()
    for index, case in enumerate(cases):
        key = f"case {index}"
        if not isinstance(case, dict) or set(case) != FIELDS:
            errors.append(f"{key}: invalid case fields")
            continue
        identifier = case["id"]
        if not isinstance(identifier, str) or not identifier.strip() or identifier in seen:
            errors.append(f"{key}: duplicate or empty ID")
        else:
            seen.add(identifier)
        if any(not isinstance(case[f], str) or not case[f].strip() for f in ("prompt_el","prompt_en")):
            errors.append(f"{key}: both EL and EN prompts required")
        owners = case["expected_domains"]
        if (not isinstance(owners, list) or not 1 <= len(owners) <= 3 or
                any(not isinstance(x, str) or x not in domains for x in owners) or
                len(set(owners)) != len(owners)):
            errors.append(f"{key}: invalid domain owners")
        else:
            families.update(x[0] for x in owners)
        risk, outcome = case["risk_class"], case["expected_outcome"]
        if not isinstance(risk,str) or risk not in RISK or not isinstance(outcome,str) or outcome not in OUTCOMES:
            errors.append(f"{key}: invalid risk/outcome")
            continue
        coverage.add(risk)
        prohibitions = case["must_not_claim"]
        if not isinstance(prohibitions,list) or not prohibitions or any(not isinstance(x,str) or not x.strip() for x in prohibitions):
            errors.append(f"{key}: empty prohibitions")
            continue
        words = " ".join(prohibitions).lower()
        if risk == "legal" and outcome not in ("INDETERMINATE","REFUSE"):
            errors.append(f"{key}: unverified legal permission must fail closed")
        if risk == "emergency" and not ("dispatch" in words and "ptt" in words):
            errors.append(f"{key}: exercise must forbid live dispatch and PTT")
        if risk == "hardware" and not all(x in words for x in ("cat","ptt","tx")):
            errors.append(f"{key}: hardware fixture missing CAT/PTT/TX guard")
        if risk == "privacy" and not any(x in words for x in ("callsign","roster")):
            errors.append(f"{key}: privacy fixture missing protected-data guard")
        if risk == "source" and outcome == "DIRECT":
            errors.append(f"{key}: cannot mark unverified provider case DIRECT")
    if coverage != RISK:
        errors.append("missing risk class coverage")
    if families != set("ABCD"):
        errors.append("missing Family coverage")
    return errors
