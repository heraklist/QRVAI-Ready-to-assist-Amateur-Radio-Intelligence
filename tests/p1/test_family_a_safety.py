"""P1.2: source-candidate metadata must never masquerade as operating authority."""
import json
from datetime import datetime
from pathlib import Path
import tempfile
import unittest

ROOT=Path(__file__).resolve().parents[2]
SOURCES=ROOT/"qa/p1/family-a-source-evidence-candidates.json"
ALLOWED_LAYERS={"BINDING_INSTRUMENT","ADMINISTRATIVE_GUIDANCE","TECHNICAL_RECOMMENDATION","TRAINING_TEMPLATE"}
REQ={"source_id","canonical_url","issuer","layer","checked_at","instrument","effective_from","legal_review_state","permission_assertion"}

def validate_source_candidates(path):
    try:
        rows=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,UnicodeError,ValueError):
        return ["source candidate manifest unreadable"]
    if not isinstance(rows,list) or len(rows)<6:
        return ["at least six research candidates required"]
    errors=[]
    seen=set()
    for i,row in enumerate(rows):
        if not isinstance(row,dict) or set(row)!=REQ:
            errors.append(f"{i}: invalid metadata fields");continue
        sid=row["source_id"]
        if not isinstance(sid,str) or not sid or sid in seen:
            errors.append(f"{i}: duplicate or empty ID")
        seen.add(sid)
        if row["layer"] not in ALLOWED_LAYERS or row["permission_assertion"] is not False:
            errors.append(f"{i}: cannot infer permission")
        if row["legal_review_state"]!="UNREVIEWED":
            errors.append(f"{i}: no expert review recorded")
        if row["effective_from"] is not None:
            errors.append(f"{i}: survey does not establish effective date")
        if not (isinstance(row["canonical_url"],str) and row["canonical_url"].startswith("https://")):
            errors.append(f"{i}: URL required")
        for field in ("issuer","instrument"):
            if not isinstance(row[field],str) or not row[field].strip():
                errors.append(f"{i}: missing {field}")
        try:
            if not isinstance(row["checked_at"],str) or datetime.fromisoformat(row["checked_at"].replace("Z","+00:00")).tzinfo is None:
                raise ValueError
        except ValueError:
            errors.append(f"{i}: checked_at must be timezone aware")
    return errors

class SourceCandidateTests(unittest.TestCase):
    def test_all_authority_candidates_are_versioned_and_source_layered(self):
        self.assertEqual(validate_source_candidates(SOURCES),[])
    def test_cannot_turn_advisory_or_unreviewed_excerpt_into_permission(self):
        rows=json.loads(SOURCES.read_text(encoding="utf8"))
        self.assertTrue(any(r["layer"]=="TECHNICAL_RECOMMENDATION" for r in rows))
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/"mutated.json"
            for index,mutator in [
                (0,lambda row:row.__setitem__("permission_assertion",True)),
                (0,lambda row:row.__setitem__("legal_review_state","REVIEWED")),
                (1,lambda row:row.__setitem__("effective_from","2026-10-17")),
            ]:
                mutated=[dict(x) for x in rows]
                mutator(mutated[index])
                path.write_text(json.dumps(mutated,ensure_ascii=False),encoding="utf8")
                self.assertTrue(validate_source_candidates(path))
