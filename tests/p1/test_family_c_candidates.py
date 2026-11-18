"""C family research candidate contracts: no unreviewed provider counted as connected."""
from datetime import datetime
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest,json,copy
ROOT=Path(__file__).resolve().parents[2]
MANIFEST=ROOT/"qa/p1/family-c-source-candidates.json"
REQUIRED={"id","kind","source_url","source_type","version","checked_at","review_state","rights_state","provider_connected","use_boundary"}
def validate_family_c_candidates(path: Path)->list[str]:
    try: rows=json.loads(path.read_text(encoding="utf8"))
    except (OSError,ValueError,UnicodeError): return ["missing or invalid candidate metadata"]
    if not isinstance(rows,list) or len(rows)<8:return ["at least eight source candidates required"]
    errors=[];seen=set()
    for i,row in enumerate(rows):
        if not isinstance(row,dict) or set(row)!=REQUIRED:errors.append(f"{i}: fields");continue
        if not isinstance(row["id"],str) or not row["id"] or row["id"] in seen:errors.append(f"{i}: id")
        seen.add(row["id"])
        if row["source_type"] not in ("PUBLIC_REFERENCE","USER_SUPPLIED"):errors.append(f"{i}: provenance")
        if row["source_type"]=="PUBLIC_REFERENCE" and (not isinstance(row["source_url"],str) or not row["source_url"].startswith("https://")):errors.append(f"{i}: https required")
        if row["source_type"]=="USER_SUPPLIED" and row["source_url"] is not None:errors.append(f"{i}: false supplied URL")
        if row["review_state"]!="UNREVIEWED" or row["rights_state"]!="UNVERIFIED" or row["provider_connected"] is not False:errors.append(f"{i}: must not grant live rights or connectivity")
        if not isinstance(row["version"],(str,type(None))):errors.append(f"{i}: version")
        if not isinstance(row["use_boundary"],str) or not row["use_boundary"].strip():errors.append(f"{i}: boundary")
        try:
            d=datetime.fromisoformat(row["checked_at"].replace("Z","+00:00"))
            if d.tzinfo is None:raise ValueError("no timezone")
        except (ValueError,AttributeError,TypeError):errors.append(f"{i}: timezone")
    for essential in ("ADIF-318","NOAA-SWPC","CELESTRAK-GP-OMM","WSJTX-GUIDE","APRS101","WINLINK-TERMS"):
        if essential not in seen:errors.append(f"missing {essential}")
    return errors

class CSourceCandidatesTests(unittest.TestCase):
    def test_candidates_are_versioned_no_live_connections(self):
        self.assertEqual(validate_family_c_candidates(MANIFEST),[])
    def test_forged_provider_rights_and_stale_timestamps_rejected(self):
        rows=json.loads(MANIFEST.read_text(encoding="utf8"))
        with TemporaryDirectory() as d:
            p=Path(d)/"test.json"
            for i,k,v in ((0,"provider_connected",True),(0,"rights_state","REDISTRIBUTABLE"),
                          (0,"review_state","APPROVED"),(0,"source_url","http://unsafe"),
                          (1,"id",rows[0]["id"]),(2,"checked_at","2026-10-17")):
                clone=copy.deepcopy(rows);clone[i][k]=v
                p.write_text(json.dumps(clone),encoding="utf8")
                self.assertTrue(validate_family_c_candidates(p),f"{i}:{k}")
