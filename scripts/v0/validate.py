"""Pure portable-plugin manifest and Skill validation for QRVAI V0."""
from __future__ import annotations

import json
from pathlib import Path
import re

SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
ROOT_ALLOWED = {"$schema", "name", "version", "description", "author", "repository", "extensions"}
INTERFACE_REQUIRED = ("displayName", "shortDescription", "longDescription", "developerName", "category")


def validate_manifest_data(data: dict) -> list[str]:
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["manifest must be an object"]
    if data.get("$schema") != SCHEMA:
        errors.append("invalid $schema")
    if data.get("name") != "qrvai":
        errors.append("name must be qrvai for approved V0")
    if data.get("version") != "0.1.0":
        errors.append("version must be 0.1.0 for first clean release")
    if not isinstance(data.get("author"), dict) or not data["author"].get("name"):
        errors.append("missing author.name")
    for key in sorted(set(data) - ROOT_ALLOWED):
        errors.append("unapproved root key: " + key)
    exts = data.get("extensions", {})
    if not isinstance(exts, dict):
        exts = {}
    ui = exts.get("com.openai", {}).get("interface", {}) if isinstance(exts.get("com.openai"), dict) else {}
    if not isinstance(ui, dict):
        ui = {}
    for key in INTERFACE_REQUIRED:
        if not isinstance(ui.get(key), str) or not ui[key].strip():
            errors.append(key + " must be nonblank string")
    if ui.get("displayName") != "QRVAI":
        errors.append("displayName must be QRVAI")
    if isinstance(ui.get("shortDescription"), str) and len(ui["shortDescription"]) > 30:
        errors.append("shortDescription exceeds 30 characters")
    if not isinstance(ui.get("capabilities"), list):
        errors.append("capabilities must be list")
    elif ui["capabilities"]:
        errors.append("V0 must not advertise interactive app capabilities")
    if "mcpServers" in data or "apps" in exts.get("com.openai", {}):
        errors.append("V0 cannot advertise MCP or App connections")
    return errors


def validate_manifest(path: Path) -> list[str]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        return [f"manifest unreadable: {type(exc).__name__}"]
    return validate_manifest_data(data)
