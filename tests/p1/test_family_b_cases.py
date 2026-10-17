"""Family B bilingual QA case contracts: static routing expectations, not host accuracy."""
from pathlib import Path
from tempfile import TemporaryDirectory
import json,copy,unittest
ROOT=Path(__file__).resolve().parents[2]
CASES=ROOT/"qa/p1/family-b-engineering-cases.json"
OWNERS={"B06","B09","B10","B11","B12","B13"}
ALLOWED=OWNERS|{"A01","A05","B07","B08"}
IDS={f"SS-{id}-{n}" for id in OWNERS for n in (1,2,3)}
REQ={"id","domain","procedure_id","prompt_el","prompt_en","expected_domains","risk_class","expected_outcome","source_kind","fixture_basis","must_not_claim"}
OUTCOMES={"PARTIAL","INDETERMINATE","NOT_IMPLEMENTED","REFUSE","IDEAL_MODEL"}
SOURCES={"IDEAL_MODEL","USER_SUPPLIED_UNVERIFIED","FORMAT_SPEC_UNREVIEWED","TRAINING_TEMPLATE","MANUFACTURER_CANDIDATE_UNVERIFIED"}
SENSITIVE={"callsign","core:author","core:geolocation","live_device_connected:true","cat write","live ptt"}
def validate_family_b_cases(path: Path)->list[str]:
    try: rows=json.loads(path.read_text(encoding="utf8"))
    except (OSError,ValueError,UnicodeError): return ["missing or invalid bilingual case corpus"]
    if not isinstance(rows,list) or len(rows)<36: return ["at least 36 engineering cases required"]
    errors=[];seen=set()
    for i,r in enumerate(rows):
        if not isinstance(r,dict) or set(r)!=REQ: errors.append(f"{i}: fields");continue
        if not isinstance(r["id"],str) or not r["id"] or r["id"] in seen: errors.append(f"{i}: duplicate ID")
        seen.add(r["id"])
        if r["domain"] not in OWNERS or r["procedure_id"] not in IDS or not r["procedure_id"].startswith("SS-"+r["domain"]+"-"):
            errors.append(f"{i}: owner mismatch")
        for label in ("prompt_el","prompt_en","risk_class","fixture_basis"):
            if not isinstance(r[label],str) or not r[label].strip():errors.append(f"{i}: blank {label}")
        if r["prompt_el"]==r["prompt_en"]: errors.append(f"{i}: bilingual duplicate")
        route=r["expected_domains"]
        if not isinstance(route,list) or not 1<=len(route)<=3 or len(route)!=len(set(route)) or r["domain"] not in route or any(x not in ALLOWED for x in route):
            errors.append(f"{i}: invalid route")
        if r["expected_outcome"] not in OUTCOMES or r["source_kind"] not in SOURCES:errors.append(f"{i}: invalid evidence status")
        if r["source_kind"] in ("FORMAT_SPEC_UNREVIEWED","MANUFACTURER_CANDIDATE_UNVERIFIED") and r["expected_outcome"]=="IDEAL_MODEL":
            errors.append(f"{i}: candidate cannot prove physical model")
        denied=r["must_not_claim"]
        if not isinstance(denied,list) or not denied or any(not isinstance(v,str) or not v.strip() for v in denied):
            errors.append(f"{i}: missing negative assertions");continue
        low=" ".join(denied).lower()
        required={
            "B06":["official","page"],
            "B09":["certified","measured"],
            "B10":["calibrated","parser"],
            "B11":["connected","ptt"],
            "B12":["guarantee","mains"],
            "B13":["fft","interception"],
        }
        if any(tag not in low for tag in required.get(r["domain"],[])):
            errors.append(f"{i}: required safety denials")
        if any(key in (r["prompt_el"]+" "+r["prompt_en"]) for key in ("core:author=real","core:geolocation=real","sk-proj-")):
            errors.append(f"{i}: sensitive test input")
        if r["domain"]=="B11" and r["expected_outcome"]=="IDEAL_MODEL":
            errors.append(f"{i}: no live device measurement")
        if r["risk_class"] in ("cat_ptt","live_status","hardware"):
            if not (r["expected_outcome"] in ("REFUSE","NOT_IMPLEMENTED") and "ptt" in low):
                errors.append(f"{i}: live hardware fail-closed")
    for domain in OWNERS:
        if sum(isinstance(r,dict) and r.get("domain")==domain for r in rows)<6:errors.append(f"{domain}: fewer than six")
    found={r.get("procedure_id") for r in rows if isinstance(r,dict)}
    if found!=IDS:errors.append("18/18 SS coverage missing")
    pairs={tuple(r["expected_domains"]) for r in rows if isinstance(r,dict) and isinstance(r.get("expected_domains"),list)}
    for pair in (("B06","B11"),("B09","B10"),("B12","A01"),("B13","B10")):
        if pair not in pairs:errors.append(f"missing mixed route {pair}")
    return errors

class FamilyBCaseTests(unittest.TestCase):
    def test_thirty_six_bilingual_all_eighteen_ss_and_mixed(self):
        self.assertEqual(validate_family_b_cases(CASES),[])
    def test_false_authority_and_missing_context_mutations_are_rejected(self):
        records=json.loads(CASES.read_text(encoding="utf8"))
        mutations=[
            (0,"id",records[1]["id"]),(0,"prompt_el",""),
            (0,"expected_domains",["UNKNOWN"]),(0,"procedure_id","SS-C14-1"),
            (6,"must_not_claim",["mixer"]), (12,"expected_outcome","IDEAL_MODEL"),
            (18,"expected_outcome","IDEAL_MODEL"), (0,"source_kind","NEW_PROVIDER"),
            (30,"must_not_claim",["spectrum"]), (24,"must_not_claim",["good uptime"]),
        ]
        with TemporaryDirectory() as tmp:
            p=Path(tmp)/"mutated.json"
            for i,k,value in mutations:
                altered=copy.deepcopy(records);altered[i][k]=value
                p.write_text(json.dumps(altered,ensure_ascii=False),encoding="utf8")
                self.assertTrue(validate_family_b_cases(p),f"{i}: {k}")
