import unittest
from pathlib import Path
from scripts.v0.validate import validate_skill
from scripts.v0.catalog import extract_domain_ids, extract_subcapability_ids, validate_family_reference

ROOT = Path(__file__).resolve().parents[2]
FAM = ROOT / "qrvai/skills/qrvai-operating-intelligence"


class TestFamilyC(unittest.TestCase):
    def test_eight_domains_and_24_subcapabilities(self):
        ref = (FAM / "references/family-c.md").read_text(encoding="utf-8")
        domains = {f"C{i:02d}" for i in range(14, 22)}
        subs = {f"SC-{domain}-{n}" for domain in domains for n in range(1, 4)}
        self.assertEqual(extract_domain_ids(ref), domains)
        self.assertEqual(extract_subcapability_ids(ref), subs)
        self.assertEqual(validate_family_reference(FAM / "references/family-c.md", "C", domains, subs), [])
        self.assertEqual(validate_skill(FAM / "SKILL.md"), [])

    def test_no_fake_live_propagation_or_satellite_pass(self):
        skill = (FAM / "SKILL.md").read_text(encoding="utf-8").lower()
        for phrase in ["no fabricated live", "timestamped", "satellite",
                       "no silent upload", "no providers", "licence"]:
            self.assertIn(phrase, skill)


if __name__ == "__main__":
    unittest.main()
