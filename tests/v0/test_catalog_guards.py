import json
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


if __name__ == "__main__":
    unittest.main()
