import unittest
from pathlib import Path
from scripts.v0.validate import validate_skill
from scripts.v0.catalog import extract_domain_ids, extract_subcapability_ids, validate_family_reference

ROOT = Path(__file__).resolve().parents[2]
FAM = ROOT / "qrvai/skills/qrvai-safety-regulations"


class TestFamilyA(unittest.TestCase):
    def test_five_domains_and_fifteen_subcapabilities(self):
        document = (FAM / "references/family-a.md").read_text(encoding="utf-8")
        domains = {f"A{x:02d}" for x in range(1, 6)}
        subs = {f"SC-{d}-{i}" for d in domains for i in range(1, 4)}
        self.assertEqual(extract_domain_ids(document), domains)
        self.assertEqual(extract_subcapability_ids(document), subs)
        self.assertEqual(validate_family_reference(FAM / "references/family-a.md", "A", domains, subs), [])
        self.assertEqual(validate_skill(FAM / "SKILL.md"), [])

    def test_unknown_legal_context_is_indeterminate(self):
        text = (FAM / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("INDETERMINATE", text)
        self.assertIn("country", text.lower())
        self.assertIn("licence", text.lower())
        self.assertIn("IARU", text)
        self.assertIn("primary", text.lower())

    def test_emcomm_training_only(self):
        text = (FAM / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("training", text.lower())
        self.assertIn("no dispatch", text.lower())
        self.assertIn("no PTT", text)
        self.assertIn("agency", text.lower())


if __name__ == "__main__":
    unittest.main()
