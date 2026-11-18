"""P1.3 candidate technical-source metadata is research, not validated capability."""
from pathlib import Path
from datetime import datetime
import json, unittest, tempfile, copy

ROOT=Path(__file__).resolve().parents[2]
CANDIDATES=ROOT/"qa/p1/family-b-engineering-source-candidates.json"
REQUIRED={"id","kind","canonical_url","source_type","version","checked_at","rights_status","review_state","capability_available","use_boundary"}
ALLOWED={"FORMAT_SPEC","MANUAL_ENTRYPOINT","USER_DATASHEET","INSTRUMENT_DATASHEET"}
def validate_engineering_candidates(path: Path)->list[str]:
    try:
        data=json.loads(path.read_text(encoding="utf8"))
    except (OSError,ValueError,UnicodeError):
        return ["metadata manifest missing or corrupt"]
    if not isinstance(data,list) or len(data)<4:
        return ["at least four candidates needed"]
    errors=[];seen=set()
    for i,r in enumerate(data):
        if not isinstance(r,dict) or set(r)!=REQUIRED:
            errors.append(f"{i}: invalid fields");continue
        if not isinstance(r["id"],str) or not r["id"] or r["id"] in seen:
            errors.append(f"{i}: duplicate or missing candidate id")
        seen.add(r["id"])
        if r["kind"] not in ALLOWED or r["review_state"]!="UNREVIEWED" or r["capability_available"] is not False:
            errors.append(f"{i}: candidate cannot assert implementation")
        if r["rights_status"]!="UNVERIFIED":
            errors.append(f"{i}: cannot grant redistribution rights")
        if r["source_type"] not in ("PUBLIC_REFERENCE","USER_SUPPLIED"):
            errors.append(f"{i}: unsupported source provenance")
        if r["source_type"]=="PUBLIC_REFERENCE" and (not isinstance(r["canonical_url"],str) or not r["canonical_url"].startswith("https://")):
            errors.append(f"{i}: only HTTPS public references")
        if r["source_type"]=="USER_SUPPLIED" and r["canonical_url"] is not None:
            errors.append(f"{i}: fictitious user data must not pretend URL")
        if r["version"] is not None and not isinstance(r["version"],str):
            errors.append(f"{i}: invalid version")
        if not isinstance(r["use_boundary"],str) or not r["use_boundary"]:
            errors.append(f"{i}: missing use restriction")
        try:
            d=datetime.fromisoformat(r["checked_at"].replace("Z","+00:00"))
            if d.tzinfo is None: raise ValueError
        except (ValueError,TypeError,AttributeError):
            errors.append(f"{i}: timezone-aware checked_at required")
    if not any(r.get("id")=="IBIS-TOUCHSTONE-21" and r.get("kind")=="FORMAT_SPEC" for r in data if isinstance(r,dict)):
        errors.append("missing Touchstone format-spec research")
    if not any(r.get("id")=="SIGMF-FORMAT" and r.get("kind")=="FORMAT_SPEC" for r in data if isinstance(r,dict)):
        errors.append("missing SigMF format-spec research")
    return errors

class EngineeringSourceTests(unittest.TestCase):
    def test_only_unreviewed_rights_unknown_source_candidates(self):
        self.assertEqual(validate_engineering_candidates(CANDIDATES),[])

    def test_privilege_escalation_and_misclassified_references_rejected(self):
        rows=json.loads(CANDIDATES.read_text(encoding="utf8"))
        variants=[
            (0,"capability_available",True),
            (0,"review_state","VERIFIED"),
            (0,"rights_status","REDISTRIBUTABLE"),
            (0,"canonical_url","http://example.org"),
            (1,"id",rows[0]["id"]),
            (2,"source_type","EXTERNAL_PROVIDER"),
        ]
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/"altered.json"
            for i,field,value in variants:
                x=copy.deepcopy(rows);x[i][field]=value
                p.write_text(json.dumps(x),encoding="utf8")
                self.assertTrue(validate_engineering_candidates(p),f"{field} bypass")


class EngineeringNumericalBoundaries(unittest.TestCase):
    def test_first_order_rc_is_ideal_not_arbitrary_network(self):
        import math
        r=1000.0;c=1e-6
        cutoff=1/(2*math.pi*r*c)
        self.assertAlmostEqual(cutoff,159.15494309189535,places=10)
        amplitude=1/math.sqrt(2)
        gain_db=20*math.log10(amplitude)
        self.assertAlmostEqual(gain_db,-3.010299956639812,places=10)
        source=(ROOT/"staging/p1-domain-skills/skills/rf-electronics/SKILL.md").read_text()
        self.assertIn("first-order RC",source)
        self.assertIn("NOT_IMPLEMENTED",source)

    def test_scalar_trace_cannot_supply_complex_s11(self):
        samples=[(144e6,-10.),(145e6,-20.),(146e6,-5.)]
        self.assertEqual(min(db for _,db in samples),-20.)
        self.assertEqual(max(db for _,db in samples),-5.)
        self.assertEqual(min(samples,key=lambda t:t[1])[0],145e6)
        source=(ROOT/"staging/p1-domain-skills/skills/rf-measurements/SKILL.md").read_text()
        self.assertIn("Touchstone",source)
        self.assertIn("NOT_IMPLEMENTED",source)
        self.assertIn("No calibrated VNA",source)

    def test_duty_weighted_ideal_runtime(self):
        self.assertEqual(10*0.8+60*0.2,20.)
        self.assertAlmostEqual(240*0.8/20,9.6)
        source=(ROOT/"staging/p1-domain-skills/skills/power-infrastructure/SKILL.md").read_text()
        self.assertIn("No battery certification",source)
        self.assertIn("No mains repairs",source)

    def test_iq_pair_statistics_not_fft_or_signal_identification(self):
        iq=[(1,0),(0,1),(-1,0),(0,-1)]
        power=sum(i*i+q*q for i,q in iq)/len(iq)
        peak=max((i*i+q*q)**0.5 for i,q in iq)
        self.assertEqual(power,1)
        self.assertEqual(peak,1)
        self.assertEqual(1e6/1024,976.5625)
        source=(ROOT/"staging/p1-domain-skills/skills/sdr-dsp/SKILL.md").read_text()
        for claim in ("NOT_IMPLEMENTED","No live SDR","protected communications"):
            self.assertIn(claim,source)

    def test_station_source_only_never_live_ptt_or_cat(self):
        s=(ROOT/"staging/p1-domain-skills/skills/station-integration/SKILL.md").read_text()
        for required in ("live_device_connected:false","No CAT writes","No PTT","NOT_IMPLEMENTED","station_read_status"):
            self.assertIn(required,s)
        # This is a static source-safety check; no live device or host call.
