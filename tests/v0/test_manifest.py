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


if __name__ == "__main__":
    unittest.main()
