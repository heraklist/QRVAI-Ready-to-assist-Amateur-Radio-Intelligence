import unittest
from pathlib import Path
from scripts.v0.validate import validate_skill
from scripts.v0.catalog import extract_domain_ids, extract_subcapability_ids, validate_family_reference

ROOT = Path(__file__).resolve().parents[2]
FAM = ROOT / "qrvai/skills/qrvai-engineering-support"


class TestFamilyB(unittest.TestCase):
    def test_all_eight_domains_and_24_subcapabilities(self):
        text = (FAM / "references/family-b.md").read_text(encoding="utf-8")
        domains = {f"B{x:02d}" for x in range(6, 14)}
        subs = {f"SC-{d}-{j}" for d in domains for j in (1, 2, 3)}
        self.assertEqual(extract_domain_ids(text), domains)
        self.assertEqual(extract_subcapability_ids(text), subs)
        self.assertEqual(validate_family_reference(FAM / "references/family-b.md", "B", domains, subs), [])
        self.assertEqual(validate_skill(FAM / "SKILL.md"), [])

    def test_no_phantom_engine_manual_or_rig_action(self):
        text = (FAM / "SKILL.md").read_text(encoding="utf-8").lower()
        for phrase in ["not implemented", "no ptt", "no cat write",
                       "manual revision", "no fabricated", "no numerical engine"]:
            self.assertIn(phrase, text)


if __name__ == "__main__":
    unittest.main()
