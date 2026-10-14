"""Validate real host acceptance receipts; this does not run ChatGPT or create plugins."""
from __future__ import annotations

from datetime import datetime
import re

LEGACY_ID = "plugins_6acf47f502dc8191bf542fe040d484d8"
STATES = {"PASS", "FAIL", "BLOCKED", "UNSUPPORTED"}


def validate_host_report(report: dict, expected_case_ids: set[str]) -> list[str]:
    errors: list[str] = []
    if not isinstance(report, dict):
        return ["report must be object"]
    required = ("plugin_id", "release_id", "package_sha256", "host_client",
                "host_version", "observed_at", "operator", "creation_status",
                "execution_status", "actual_outcome")
    for key in required:
        if not isinstance(report.get(key), str) or not report[key].strip():
            errors.append(f"{key} missing")
    if report.get("plugin_id") == LEGACY_ID:
        errors.append("plugin_id must differ from legacy record")
    if report.get("creation_status") != "created":
        errors.append("creation_status must be created with new backend identity")
    if not re.fullmatch(r"[0-9a-f]{64}", str(report.get("package_sha256", ""))):
        errors.append("package_sha256 invalid")
    if report.get("execution_status") != "EXECUTED":
        errors.append("execution_status: NOT_EXECUTED cannot pass host acceptance")
    if report.get("actual_outcome") not in STATES:
        errors.append("actual_outcome invalid")
    elif report.get("actual_outcome") != "PASS":
        errors.append("actual_outcome must be PASS for release acceptance")
    try:
        seen_at = datetime.fromisoformat(str(report.get("observed_at")).replace("Z", "+00:00"))
        if seen_at.tzinfo is None:
            errors.append("observed_at must contain timezone")
    except ValueError:
        errors.append("observed_at must be ISO timestamp")
    cases = report.get("cases")
    if not isinstance(cases, list):
        return errors + ["cases must be list"]
    if not expected_case_ids:
        errors.append("expected_case_ids must be non-empty for release acceptance")
    seen: set[str] = set()
    for case in cases:
        if not isinstance(case, dict):
            errors.append("case must be object")
            continue
        name = case.get("id")
        if not isinstance(name, str) or name in seen:
            errors.append(f"invalid or duplicate case id: {name}")
            continue
        seen.add(name)
        if case.get("actual_outcome") != "PASS":
            errors.append(f"case {name}: result not PASS ({case.get('actual_outcome')})")
        if case.get("observed_invocation") is not True:
            errors.append(f"case {name}: observed_invocation missing or false")
        if not isinstance(case.get("observed_response"), str) or not case["observed_response"].strip():
            errors.append(f"case {name}: observed_response missing")
        if not case.get("risk_class"):
            errors.append(f"case {name}: risk_class missing")
    if seen != expected_case_ids:
        errors.append(f"case id mismatch: {sorted(seen ^ expected_case_ids)}")
    if report.get("actual_outcome") == "PASS" and errors:
        errors.append("PASS outcome cannot be accepted with missing/failed evidence")
    return errors
