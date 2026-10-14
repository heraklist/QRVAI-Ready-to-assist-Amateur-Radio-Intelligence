import unittest
from pathlib import Path
from scripts.v0.validate import validate_skill
from scripts.v0.catalog import extract_domain_ids, extract_subcapability_ids, validate_family_reference

ROOT = Path(__file__).resolve().parents[2]
FAM = ROOT / "qrvai/skills/qrvai-education-community"


class TestFamilyD(unittest.TestCase):
    def test_three_domains_and_nine_subcapabilities(self):
        text = (FAM / "references/family-d.md").read_text(encoding="utf-8")
        domains = {"D22", "D23", "D24"}
        subs = {f"SC-{d}-{j}" for d in domains for j in (1, 2, 3)}
        self.assertEqual(extract_domain_ids(text), domains)
        self.assertEqual(extract_subcapability_ids(text), subs)
        self.assertEqual(validate_family_reference(FAM / "references/family-d.md", "D", domains, subs), [])
        self.assertEqual(validate_skill(FAM / "SKILL.md"), [])

    def test_no_legacy_exam_assets_or_official_certification(self):
        text = (FAM / "SKILL.md").read_text(encoding="utf-8").lower()
        for phrase in ["no legacy", "no exam bank", "not a certification", "consent", "no owner images"]:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
