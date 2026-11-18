"""P1.4 arithmetic and safety-claim goldens. These are offline characterizations, not physics providers."""
from pathlib import Path
import math,unittest
ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/"staging/p1-domain-skills/skills"
class CFamilyNumericalAndSafetyTests(unittest.TestCase):
    def test_ideal_free_space_loss_not_ionosphere(self):
        fspl_db=32.44+20*math.log10(100)+20*math.log10(10)
        self.assertAlmostEqual(fspl_db,92.44,places=8)
        t=(STAGE/"propagation/SKILL.md").read_text(encoding="utf8")
        self.assertIn("real_world_prediction:false",t)
        self.assertIn("No guaranteed path opening",t)

    def test_signed_repeater_offset_not_legality(self):
        self.assertEqual(145_600_000-600_000,145_000_000)
        t=(STAGE/"repeaters-dvoice/SKILL.md").read_text(encoding="utf8")
        self.assertIn("verified:false",t)
        self.assertIn("No invented tones",t)

    def test_sampled_elevation_not_sgp4_or_doppler(self):
        samples=[-8.0,30.0,5.0]
        self.assertEqual(len([x for x in samples if x>0]),2)
        self.assertEqual(max(samples),30.0)
        s=(STAGE/"satellites-weak-signal/SKILL.md").read_text(encoding="utf8")
        for claim in ("orbit_computed:false","No computed Doppler","No SGP4","OMM"):
            self.assertIn(claim,s)

    def test_adif_unicode_bytes_are_not_codepoints(self):
        self.assertEqual(len("Ω"),1)
        self.assertEqual(len("Ω".encode("utf8")),2)
        t=(STAGE/"logbook-awards/SKILL.md").read_text(encoding="utf8")
        for label in ("ADIF 3.1.8","NOT_IMPLEMENTED","saved:false","award_certified:false","No LoTW upload"):
            self.assertIn(label,t)

    def test_utc_slots_need_dates_for_midnight(self):
        sorted_times=sorted(["23:45","00:15"])
        self.assertEqual(sorted_times,["00:15","23:45"])
        s=(STAGE/"contests-portable/SKILL.md").read_text(encoding="utf8")
        self.assertIn("official_schedule:false",s)
        self.assertIn("cross-midnight",s)
        self.assertIn("No PTT",s)

    def test_all_c_owners_are_offline_and_do_not_promise_live_services(self):
        pairs={
            "operating-dx":"provider_authenticated:false",
            "propagation":"live_feed:false",
            "digital-modes":"simulated:true",
            "packet-networks":"simulated:true",
            "repeaters-dvoice":"live_status_known:false",
            "satellites-weak-signal":"orbit_computed:false",
            "logbook-awards":"saved:false",
            "contests-portable":"official_schedule:false",
        }
        self.assertEqual(len(pairs),8)
        for slug,marker in pairs.items():
            text=(STAGE/slug/"SKILL.md").read_text(encoding="utf8")
            self.assertIn(marker,text,slug)
            self.assertTrue(any(x in text for x in ("NOT_IMPLEMENTED","INDETERMINATE","USER_SUPPLIED_UNVERIFIED")),slug)
