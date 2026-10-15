import json
import shutil
import tempfile
from pathlib import Path
import unittest
from scripts.v0.audit_content import audit_catalog, validate_qa_cases

ROOT = Path(__file__).resolve().parents[2]


class TestCatalogGuards(unittest.TestCase):
    def test_exact_24_72_5_4(self):
        data = audit_catalog(ROOT / "qrvai")
        self.assertEqual(len(data["domain_ids"]), 24)
        self.assertEqual(len(data["subcapability_ids"]), 72)
        self.assertEqual(len(data["skill_names"]), 5)
        self.assertEqual(data["family_ids"], {"A", "B", "C", "D"})
        self.assertEqual(data["violations"], [])

    def test_absent_legacy_identifiers_and_unverified_services(self):
        data = audit_catalog(ROOT / "qrvai")
        self.assertFalse(data["violations"])
        forbidden = ("assets/w21/", "scripts/w21_bank.py", "mcp.json", ".env", "SOURCE_RECEIPT.json")
        paths = [str(p.relative_to(ROOT / "qrvai")) for p in (ROOT / "qrvai").rglob("*") if p.is_file()]
        self.assertFalse(any(any(x in p for x in forbidden) for p in paths))
        self.assertFalse((ROOT / "qrvai/mcp.json").exists())

    def test_bilingual_intent_and_high_risk_cases(self):
        path = ROOT / "qa/v0/prompt-cases.json"
        self.assertEqual(validate_qa_cases(path), [])
        cases = json.loads(path.read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(cases), 12)
        self.assertEqual({c["expected_family"] for c in cases}, {"A", "B", "C", "D"})
        self.assertTrue(all(c["prompt_el"] and c["expected_family"] and c["must_not_claim"] for c in cases))
        self.assertTrue({"legal", "manual_injection", "missing_engine", "legacy", "mention"} <=
                        {c["risk_class"] for c in cases})


    def test_rejects_missing_internal_skill_reference(self):
        with tempfile.TemporaryDirectory() as work:
            staged = Path(work) / "qrvai"
            shutil.copytree(ROOT / "qrvai", staged)
            core = staged / "skills/qrvai-core/SKILL.md"
            core.write_text(core.read_text(encoding="utf-8").replace(
                "references/routing.md", "references/does-not-exist.md"
            ), encoding="utf-8")
            issues = audit_catalog(staged)["violations"]
            self.assertTrue(any("does-not-exist.md" in error for error in issues), issues)

    def test_rejects_escaping_or_unsafe_skill_reference(self):
        for unsafe in ("../../private.md", "%2e%2e/%2e%2e/old-academy.json", "javascript:alert(1)"):
            with self.subTest(reference=unsafe), tempfile.TemporaryDirectory() as work:
                staged = Path(work) / "qrvai"
                shutil.copytree(ROOT / "qrvai", staged)
                core = staged / "skills/qrvai-core/SKILL.md"
                core.write_text(core.read_text(encoding="utf-8").replace(
                    "references/routing.md", unsafe
                ), encoding="utf-8")
                issues = audit_catalog(staged)["violations"]
                self.assertTrue(any("reference" in error.lower() for error in issues), issues)


    def test_rejects_malformed_bilingual_qa_fields(self):
        source = json.loads((ROOT / "qa/v0/prompt-cases.json").read_text(encoding="utf-8"))
        changes = [
            ("prompt_el", ["not a sentence"]),
            ("prompt_en", 42),
            ("risk_class", {"bad": True}),
            ("must_not_claim", ["", 100]),
            ("expected_family", ["A"]),
        ]
        for name, bad in changes:
            with self.subTest(field=name), tempfile.TemporaryDirectory() as work:
                changed = json.loads(json.dumps(source))
                changed[0][name] = bad
                path = Path(work) / "qa.json"
                path.write_text(json.dumps(changed), encoding="utf-8")
                errors = validate_qa_cases(path)
                self.assertTrue(any(name in error for error in errors), errors)

    def test_rejects_unrecognized_qa_risk_and_duplicate_ids(self):
        original = json.loads((ROOT / "qa/v0/prompt-cases.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as work:
            path = Path(work) / "qa.json"
            altered = json.loads(json.dumps(original))
            altered[0]["risk_class"] = "arbitrary-unreviewed-risk"
            path.write_text(json.dumps(altered), encoding="utf-8")
            errors = validate_qa_cases(path)
            self.assertTrue(any("risk_class" in error for error in errors), errors)
            altered[1]["id"] = altered[0]["id"]
            path.write_text(json.dumps(altered), encoding="utf-8")
            self.assertTrue(any("duplicate" in x for x in validate_qa_cases(path)))


if __name__ == "__main__":
    unittest.main()
