import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from scripts.v1 import build_plugin as bp

URL = "https://qrvai-rf-mcp.vercel.app/api/mcp"


class TestV1Plugin(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.specs = bp.load_specs()

    def test_sources_are_consistent_with_registries(self):
        self.assertEqual(bp.audit_sources(self.specs), [])
        self.assertEqual(len(bp.registered_tool_names()), 52)
        self.assertEqual(len(self.specs), 24)

    def test_release_archive_has_core_24_domain_skills_and_real_mcp_endpoint(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = bp.build_plugin(Path(tmp) / "qrvai.zip", URL)
            with zipfile.ZipFile(path) as z:
                names = z.namelist()
                config = json.loads(z.read("qrvai/mcp.json"))
                manifest = json.loads(z.read("qrvai/plugin.json"))
            self.assertEqual(len(names), 1 + 1 + 3 + 24 * 4)
            self.assertEqual(sum(n.endswith("/SKILL.md") for n in names), 25)
            self.assertEqual(config, {"$schema": bp.MCP_SCHEMA, "mcpServers": {"qrvai": {"type": "streamable-http", "url": URL}}})
            self.assertEqual(manifest["version"], "1.0.0")
            self.assertEqual(bp.validate_plugin_zip(path, self.specs), [])

    def test_build_is_reproducible(self):
        with tempfile.TemporaryDirectory() as tmp:
            a = bp.build_plugin(Path(tmp) / "a.zip", URL).read_bytes()
            b = bp.build_plugin(Path(tmp) / "b.zip", URL).read_bytes()
        self.assertEqual(a, b)

    def test_skills_only_draft_has_no_mcp_json(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = bp.build_plugin(Path(tmp) / "draft.zip", None)
            with zipfile.ZipFile(path) as z:
                self.assertNotIn("qrvai/mcp.json", z.namelist())

    def test_placeholder_or_unsafe_endpoints_are_refused(self):
        for bad in (
            "http://qrvai-rf-mcp.vercel.app/api/mcp",
            "https://qrvai-rf-mcp.vercel.app/mcp",
            "https://qrvai-rf-mcp.vercel.app/api/mcp?token=x",
            "https://user:pw@qrvai-rf-mcp.vercel.app/api/mcp",
            "https://example.com/api/mcp",
            "https://localhost/api/mcp",
            "https://qrvai.invalid/api/mcp",
            "not a url",
        ):
            with self.subTest(bad=bad):
                self.assertNotEqual(bp.validate_mcp_url(bad), [])
                with tempfile.TemporaryDirectory() as tmp:
                    with self.assertRaises(ValueError):
                        bp.build_plugin(Path(tmp) / "x.zip", bad)

    def test_tampered_archive_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = bp.build_plugin(Path(tmp) / "ok.zip", URL)
            bad = Path(tmp) / "bad.zip"
            with zipfile.ZipFile(path) as src, zipfile.ZipFile(bad, "w", zipfile.ZIP_DEFLATED) as dst:
                for info in src.infolist():
                    dst.writestr(info, src.read(info))
                dst.writestr("qrvai/skills/extra/SKILL.md", "x")
            self.assertNotEqual(bp.validate_plugin_zip(bad, self.specs), [])

    def test_core_skill_tells_the_model_to_use_tools_and_keeps_boundaries(self):
        text = (bp.V1_ROOT / bp.CORE_FILES[0]).read_text(encoding="utf-8")
        for phrase in ("call the matching tool", "INDETERMINATE", "No transmitting", "Never claim a tool ran"):
            self.assertIn(phrase, text)
        self.assertNotIn("not implemented", text.lower())


if __name__ == "__main__":
    unittest.main()
