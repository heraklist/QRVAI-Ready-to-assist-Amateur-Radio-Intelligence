"""Review Family A bilingual routing expectations; never a host-model accuracy metric."""
import copy
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

ROOT=Path(__file__).resolve().parents[2]
CASES=ROOT/"qa/p1/family-a-routing-and-safety-cases.json"
DOMAIN_IDS={"A01","A02","A03","A04","A05"}
OWNERS=DOMAIN_IDS|{"B07","B08"}
IDS={f"SS-A{n:02d}-{k}" for n in range(1,6) for k in (1,2,3)}
OUTCOMES={"TRAINING_ONLY","INDETERMINATE","PARTIAL","REFUSE","NOT_IMPLEMENTED","SYNTHETIC_ALLOWED","SYNTHETIC_NOT_ALLOWED"}
SOURCES={"TRAINING_TEMPLATE","USER_SUPPLIED_UNVERIFIED","UNREVIEWED_SOURCE","SYNTHETIC_RULE","IDEAL_MODEL"}

def validate_cases(path):
    try:
        rows=json.loads(path.read_text(encoding="utf8"))
    except (OSError,ValueError,UnicodeError):
        return ["missing/invalid Family A case data"]
    if not isinstance(rows,list) or len(rows)<30: return ["minimum 30 cases required"]
    errors=[];seen=set()
    for i,r in enumerate(rows):
        if not isinstance(r,dict) or set(r)!={"id","domain","procedure_id","prompt_el","prompt_en","expected_domains","risk_class","expected_outcome","source_kind","must_not_claim","fixture_basis"}:
            errors.append(f"{i}: invalid fields");continue
        if not isinstance(r["id"],str) or not r["id"] or r["id"] in seen: errors.append(f"{i}: duplicate ID")
        seen.add(r["id"])
        if r["domain"] not in DOMAIN_IDS or r["procedure_id"] not in IDS or not r["procedure_id"].startswith("SS-"+r["domain"]+"-"):
            errors.append(f"{i}: wrong original procedure ownership")
        if not isinstance(r["expected_domains"],list) or not 1<=len(r["expected_domains"])<=3 or len(set(r["expected_domains"]))!=len(r["expected_domains"]) or any(x not in OWNERS for x in r["expected_domains"]) or r["domain"] not in r["expected_domains"]:
            errors.append(f"{i}: unknown/missing route owner")
        if any(not isinstance(r[x],str) or not r[x].strip() for x in ("prompt_el","prompt_en","risk_class","fixture_basis")):
            errors.append(f"{i}: empty bilingual/source context")
        if r["expected_outcome"] not in OUTCOMES or r["source_kind"] not in SOURCES:
            errors.append(f"{i}: invalid outcome or provenance")
        if not isinstance(r["must_not_claim"],list) or not r["must_not_claim"] or any(not isinstance(x,str) or not x.strip() for x in r["must_not_claim"]):
            errors.append(f"{i}: no explicit prohibited claim")
            continue
        words=" ".join(r["must_not_claim"]).lower()
        if r["domain"] in ("A01","A02") and not ("ptt" in words and "dispatch" in words):
            errors.append(f"{i}: mock drills must refuse PTT and live dispatch")
        if r["domain"] in ("A03","A04") and not ("authorization" in words or "licence permission" in words):
            errors.append(f"{i}: rule source cannot grant TX")
        if r["domain"]=="A05" and not ("certification" in words and "mains" in words):
            errors.append(f"{i}: no RF certification/electrical bypass")
        if r["expected_outcome"].startswith("SYNTHETIC_") and (r["source_kind"]!="SYNTHETIC_RULE" or r["domain"]!="A04"):
            errors.append(f"{i}: legal allowance only in synthetic A04 rule fixtures")
        if r["domain"] in ("A03","A04") and r["source_kind"] in ("UNREVIEWED_SOURCE","USER_SUPPLIED_UNVERIFIED") and r["expected_outcome"] not in ("INDETERMINATE","REFUSE","NOT_IMPLEMENTED"):
            errors.append(f"{i}: unreviewed source cannot prove legal permission")
        if r["risk_class"]=="repeater" and not any("live" in x.lower() for x in r["must_not_claim"]):
            errors.append(f"{i}: no fake live repeater status")
        if r["risk_class"]=="rf_exposure" and not any("certification" in x.lower() for x in r["must_not_claim"]):
            errors.append(f"{i}: no false exposure clearance")
    for dom in DOMAIN_IDS:
        if sum(r.get("domain")==dom for r in rows if isinstance(r,dict))<6:
            errors.append(f"{dom}: fewer than six cases")
    if {r.get("procedure_id") for r in rows if isinstance(r,dict)}!=IDS:
        errors.append("not all 15 procedures covered")
    needed={("A01","A02"),("A03","A04"),("A05","B07")}
    found={tuple(r["expected_domains"]) for r in rows if isinstance(r,dict) and isinstance(r.get("expected_domains"),list)}
    if not needed.issubset(found): errors.append("mixed domain routes missing")
    return errors

class FamilyACaseTests(unittest.TestCase):
    def test_thirty_bilingual_cases_cover_all_original_fifteen_procedures(self):
        self.assertEqual(validate_cases(CASES),[])
        r=json.loads(CASES.read_text(encoding="utf8"))
        self.assertGreaterEqual(len(r),30)

    def test_mutations_fail_closed(self):
        source=json.loads(CASES.read_text(encoding="utf8"))
        with TemporaryDirectory() as tmp:
            p=Path(tmp)/"cases.json"
            changes=[
                (1,lambda x:x.__setitem__("id",source[0]["id"])),
                (0,lambda x:x.__setitem__("prompt_el","")),
                (0,lambda x:x.__setitem__("expected_domains",["X99"])),
                (18,lambda x:x.__setitem__("expected_outcome","SYNTHETIC_ALLOWED")),
                (12,lambda x:x.__setitem__("must_not_claim",["verified official rules"])),
                (24,lambda x:x.__setitem__("must_not_claim",["site safe"])),
            ]
            for idx,mutate in changes:
                copyrows=copy.deepcopy(source);mutate(copyrows[idx])
                p.write_text(json.dumps(copyrows,ensure_ascii=False),encoding="utf8")
                self.assertTrue(validate_cases(p))
