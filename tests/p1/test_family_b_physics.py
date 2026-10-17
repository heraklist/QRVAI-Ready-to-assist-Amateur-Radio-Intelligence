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
