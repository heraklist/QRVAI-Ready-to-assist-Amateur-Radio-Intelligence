"""Conservative, pure fresh-plugin identity gates. No account mutations."""
from __future__ import annotations

from pathlib import Path
from scripts.v0.validate import validate_manifest

LEGACY_ID = "plugins_6acf47f502dc8191bf542fe040d484d8"


def evaluate_identity_gate(old_record_present: bool, old_plugin_id: str,
                           candidate_package_name: str,
                           candidate_backend_id: str | None) -> str:
    """Never treat uninstall as source record deletion or update as a clean create."""
    if old_record_present or candidate_package_name != "qrvai":
        return "BLOCKED"
    if not old_plugin_id or old_plugin_id != LEGACY_ID:
        return "BLOCKED"
    if candidate_backend_id is None:
        return "READY_FOR_CREATION"
    if candidate_backend_id == old_plugin_id or not candidate_backend_id.strip():
        return "BLOCKED"
    return "CREATED_DISTINCT"


def verify_release_preflight(manifest_path: Path, evidence: dict) -> list[str]:
    """Return missing prerequisites. A passing local preflight does not create a plugin."""
    errors = validate_manifest(manifest_path)
    requirements = (
        "old_record_absent",
        "namespace_available",
        "source_review_passed",
        "fresh_package_hash_verified",
        "owner_plan_approved",
        "owner_create_authorized",
    )
    for key in requirements:
        if evidence.get(key) is not True:
            errors.append(f"{key}: verified true required")
    if evidence.get("old_plugin_id") != LEGACY_ID:
        errors.append("old_plugin_id: expected original verified record ID")
    stamp = evidence.get("checked_at")
    if not isinstance(stamp, str) or not stamp.strip():
        errors.append("checked_at: fresh account check timestamp required")
    return errors
