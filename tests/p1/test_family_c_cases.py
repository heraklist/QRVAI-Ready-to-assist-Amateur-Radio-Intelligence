"""P1.4 Family C bilingual offline routing fixtures: coverage, not measured LLM routing."""
from pathlib import Path
from tempfile import TemporaryDirectory
from collections import Counter
import json,copy,re,unittest
ROOT=Path(__file__).resolve().parents[2]
CASES=ROOT/"qa/p1/family-c-operating-scenarios.json"
OWNERS={f"C{i}" for i in range(14,22)}
ALL={f"A{i:02d}" for i in range(1,6)}|{f"B{i:02d}" for i in range(6,14)}|OWNERS|{f"D{i:02d}" for i in range(22,25)}
EXPECTED={f"SS-C{i}-{n}" for i in range(14,22) for n in (1,2,3)}
REQ={"id","domain","procedure_id","prompt_el","prompt_en","expected_domains","risk_class","expected_outcome","source_kind","fixture_basis","must_not_claim"}
OUTCOMES={"PARTIAL","INDETERMINATE","NOT_IMPLEMENTED","REFUSE","IDEAL_MODEL"}
SOURCES={"USER_SUPPLIED_UNVERIFIED","FORMAT_SPEC_PUBLIC_REFERENCE","SOURCE_CANDIDATE_UNREVIEWED","IDEAL_MODEL","TRAINING_TEMPLATE"}
DENIALS={
"C14":("live dx","ptt"),"C15":("live noaa","guarantee"),"C16":("cat write","ptt"),
"C17":("aprs-is write","private location"),"C18":("live repeater","authorized tx"),
"C19":("sgp4","doppler"),"C20":("adif certified","lotw upload"),"C21":("official schedule","activation approval")
}
FAIL_CLOSED={"cat_ptt","packet_send","private_location","provider_write","live_device","interception"}
def validate_family_c_cases(path: Path)->list[str]:
    try: rows=json.loads(path.read_text(encoding="utf8"))
    except (OSError,ValueError,UnicodeError):return ["missing/invalid Family C bilingual corpus"]
    if not isinstance(rows,list) or len(rows)!=48:return ["48 exact bilingual cases required"]
    errors=[];seen=set();counts=Counter();sscount=Counter();mixed=0
    for i,r in enumerate(rows):
        if not isinstance(r,dict) or set(r)!=REQ:errors.append(f"{i}: schema");continue
        if not isinstance(r["id"],str) or not r["id"] or r["id"] in seen:errors.append(f"{i}: duplicate id")
        seen.add(r["id"]);d=r["domain"];p=r["procedure_id"]
        if d not in OWNERS or p not in EXPECTED or not p.startswith(f"SS-{d}-"):errors.append(f"{i}: wrong owner")
        counts[d]+=1;sscount[p]+=1
        for key in ("prompt_el","prompt_en","risk_class","fixture_basis"):
            if not isinstance(r[key],str) or not r[key].strip():errors.append(f"{i}: blank {key}")
        if r["prompt_el"]==r["prompt_en"] or not re.search(r"[\u0370-\u03FF]",r["prompt_el"]):errors.append(f"{i}: non-Greek or identical prompts")
        route=r["expected_domains"]
        if not isinstance(route,list) or not 1<=len(route)<=3 or len(route)!=len(set(route)) or d not in route or any(z not in ALL for z in route):errors.append(f"{i}: route")
        elif len(route)>1:mixed+=1
        if r["expected_outcome"] not in OUTCOMES or r["source_kind"] not in SOURCES:errors.append(f"{i}: unsupported evidence status")
        if r["risk_class"] in FAIL_CLOSED and r["expected_outcome"] not in ("REFUSE","NOT_IMPLEMENTED"):errors.append(f"{i}: unsafe action authorized")
        denial=r["must_not_claim"]
        if not isinstance(denial,list) or not denial or any(not isinstance(x,str) or not x for x in denial):errors.append(f"{i}: no denials");continue
        labels="; ".join(denial).lower()
        if d in DENIALS and any(word not in labels for word in DENIALS[d]):errors.append(f"{i}: missing domain safety claims")
        if re.search(r"(?:sk-proj-[A-Za-z0-9]+|core:geolocation=|core:author=|home exact|SV1[A-Z0-9]{3})",r["prompt_el"]+" "+r["prompt_en"],re.I):
            errors.append(f"{i}: sensitive fixture")
        if r["expected_outcome"]=="IDEAL_MODEL" and r["source_kind"] not in ("IDEAL_MODEL","TRAINING_TEMPLATE"):
            errors.append(f"{i}: false empirical proof")
    if set(counts)!=OWNERS or any(counts[d]!=6 for d in OWNERS):errors.append("need six per owner")
    if set(sscount)!=EXPECTED or any(sscount[p]!=2 for p in EXPECTED):errors.append("need two per all 24 procedures")
    if mixed<6:errors.append("need at least six mixed ownership cases")
    required={("C14","C15"),("C16","B11"),("C17","A04"),("C18","A04"),("C19","C15"),("C20","C21"),("C21","B12")}
    actual={tuple(r["expected_domains"]) for r in rows if isinstance(r,dict) and isinstance(r.get("expected_domains"),list)}
    if not required<=actual:errors.append("required mixed tuple missing")
    return errors

class CFamilyCaseTests(unittest.TestCase):
    def test_48_bilingual_cases_cover_all_24_c_procedures(self):
        self.assertEqual(validate_family_c_cases(CASES),[])
    def test_mutations_fail_no_hidden_privilege(self):
        if not CASES.exists():self.skipTest("deliberately RED: corpus absent until GREEN")
        records=json.loads(CASES.read_text(encoding="utf8"))
        changes=((0,"id",records[1]["id"]),(0,"prompt_el",""),
                 (0,"expected_domains",["Q99"]),(0,"procedure_id","SS-C21-1"),
                 (0,"must_not_claim",["ok"]),(6,"risk_class","packet_send"),
                 (12,"expected_outcome","VERIFIED"),(30,"source_kind","LIVE_NOAA"),
                 (36,"prompt_en","sk-proj-abcd"),(42,"expected_domains",["C21"]))
        with TemporaryDirectory() as tmp:
            path=Path(tmp)/"invalid.json"
            for i,k,v in changes:
                r=copy.deepcopy(records);r[i][k]=v
                path.write_text(json.dumps(r,ensure_ascii=False),encoding="utf8")
                self.assertTrue(validate_family_c_cases(path),f"mutated case {i}:{k}")
