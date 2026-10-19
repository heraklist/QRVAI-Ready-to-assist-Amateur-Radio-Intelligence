"""Family D educational numerical goldens — ideal examples, not CW receiver or equipment measurements."""
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/"staging/p1-domain-skills/skills"

class FamilyDCharacterizationTests(unittest.TestCase):
    def test_d22_cw_wpm_formula_not_audio_scoring(self):
        for wpm,dot in ((20,0.06),(12,0.1),(30,0.04)):
            self.assertAlmostEqual(1.2/wpm,dot,places=10)
        src=(STAGE/"radio-academy/SKILL.md").read_text(encoding="utf8")
        self.assertIn("CW audio NOT_IMPLEMENTED",src)
        self.assertIn("TRAINING_ONLY",src)
        self.assertNotIn("HAREC_CERTIFIED",src)

    def test_d23_30v_preview_never_certifies_or_flashes(self):
        doc=(STAGE/"radio-maker/SKILL.md").read_text(encoding="utf8")
        for token in ("<=30","certified:false","No firmware flashing","No CAT/PTT","NOT_IMPLEMENTED"):
            self.assertIn(token,doc)

    def test_d24_roster_calendar_and_minors_fail_closed(self):
        doc=(STAGE/"clubs-mentoring/SKILL.md").read_text(encoding="utf8")
        for token in ("simulated:true","No personal roster","No calendar write","NOT_PERSISTED"):
            self.assertIn(token,doc)
        self.assertNotIn("real member names",doc.lower())
