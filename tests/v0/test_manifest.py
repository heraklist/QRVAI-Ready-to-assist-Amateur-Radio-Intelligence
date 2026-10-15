import json
from pathlib import Path
import unittest

from scripts.v0.validate import validate_manifest, validate_manifest_data

ROOT = Path(__file__).resolve().parents[2]


class TestManifest(unittest.TestCase):
    def test_valid_identity_and_absent_integrations(self):
        path = ROOT / "qrvai/plugin.json"
        self.assertEqual(validate_manifest(path), [])
        doc = json.loads(path.read_text(encoding="utf-8"))
        self.assertEqual(doc["name"], "qrvai")
        self.assertEqual(doc["version"], "0.1.0")
        ui = doc["extensions"]["com.openai"]["interface"]
        self.assertEqual(ui["displayName"], "QRVAI")
        self.assertLessEqual(len(ui["shortDescription"]), 30)
        self.assertNotIn("mcpServers", doc)
        self.assertFalse((ROOT / "qrvai/mcp.json").exists())

    def test_official_schema_snapshot_uses_2020_12_and_expected_id(self):
        from scripts.v0.validate import CANONICAL_SCHEMA_PATH
        schema = json.loads(CANONICAL_SCHEMA_PATH.read_text(encoding="utf-8"))
        self.assertEqual(schema["$schema"], "https://json-schema.org/draft/2020-12/schema")
        self.assertEqual(schema["$id"], "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json")
        self.assertEqual(schema["required"], ["$schema", "name"])

    def test_official_schema_validation_rejects_invalid_plugin_name(self):
        valid = json.loads((ROOT / "qrvai/plugin.json").read_text(encoding="utf-8"))
        changed = dict(valid, name="invalid--slug")
        errors = validate_manifest_data(changed)
        self.assertTrue(any("canonical schema" in err.lower() for err in errors), errors)

    def test_official_schema_is_executed_not_just_documented(self):
        valid = json.loads((ROOT / "qrvai/plugin.json").read_text(encoding="utf-8"))
        changed = dict(valid, homepage=42)
        errors = validate_manifest_data(changed)
        self.assertTrue(any("canonical schema" in err.lower() for err in errors), errors)

    def test_rejects_invalid_display_name_and_overlong_subtitle(self):
        doc = {"$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
               "name": "qrvai", "version": "0.1.0", "author": {"name": "heraklist"},
               "extensions": {"com.openai": {"interface": {
                   "displayName": "", "shortDescription": "x" * 31,
                   "longDescription": "Amateur radio guidance", "developerName": "QRVAI",
                   "category": "Education", "capabilities": []}}}}
        errors = validate_manifest_data(doc)
        self.assertTrue(any("displayName" in e for e in errors))
        self.assertTrue(any("shortDescription" in e for e in errors))


    def test_invalid_extensions_fail_closed(self):
        original = json.loads((ROOT / "qrvai/plugin.json").read_text(encoding="utf-8"))
        bad_cases = [
            ({"com.openai": "not-an-object"}, "extensions.com.openai"),
            ({"com.openai": {"interface": original["extensions"]["com.openai"]["interface"]},
              "unapproved.vendor": {}}, "unapproved.vendor"),
            ("not-an-object", "extensions"),
        ]
        for extensions, reason in bad_cases:
            with self.subTest(reason=reason):
                altered = dict(original, extensions=extensions)
                errors = validate_manifest_data(altered)
                self.assertTrue(any(reason in error for error in errors), errors)

    def test_rejects_bad_default_prompt_type_and_empty_entries(self):
        original = json.loads((ROOT / "qrvai/plugin.json").read_text(encoding="utf-8"))
        import copy
        for invalid in ([], ["", "available"], ["one", "two", "three", "four"], 123):
            with self.subTest(value=invalid):
                altered = copy.deepcopy(original)
                altered["extensions"]["com.openai"]["interface"]["defaultPrompt"] = invalid
                errors = validate_manifest_data(altered)
                self.assertTrue(any("defaultPrompt" in error for error in errors), errors)


    def test_malformed_author_fields_fail_portable_schema(self):
        source = json.loads((ROOT / "qrvai/plugin.json").read_text(encoding="utf-8"))
        for bad_author in (
            {"name": ["not", "text"]},
            {"name": "heraklist", "email": 123},
            {"name": "heraklist", "unexpected": "metadata"},
        ):
            with self.subTest(author=bad_author):
                changed = dict(source, author=bad_author)
                errs = validate_manifest_data(changed)
                self.assertTrue(any("author" in e for e in errs), errs)


if __name__ == "__main__":
    unittest.main()
