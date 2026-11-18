"""Family D bilingual static routing and privacy: contract checks, not real LLM accuracy."""
from pathlib import Path
from tempfile import TemporaryDirectory
from collections import Counter
import re,json,copy,unittest
ROOT=Path(__file__).resolve().parents[2]
CASES=ROOT/"qa/p1/family-d-education-community-cases.json"
OWNERS={"D22","D23","D24"}
PROCS={f"SS-{d}-{i}" for d in OWNERS for i in range(1,4)}
ALL={f"A{x:02d}" for x in range(1,6)}|{f"B{x:02d}" for x in range(6,14)}|{f"C{x:02d}" for x in range(14,22)}|OWNERS
KEYS={"id","domain","procedure_id","prompt_el","prompt_en","expected_domains","risk_class","expected_outcome","source_kind","fixture_basis","must_not_claim"}
OUTCOMES={"PARTIAL","INDETERMINATE","NOT_IMPLEMENTED","REFUSE","IDEAL_MODEL"}
SOURCES={"USER_SUPPLIED_UNVERIFIED","FORMAT_SPEC_PUBLIC_REFERENCE","SOURCE_CANDIDATE_UNREVIEWED","IDEAL_MODEL","TRAINING_TEMPLATE"}
SENSITIVE=r"(?:sk-proj-[A-Za-z0-9]+|core:author=|core:geolocation=|(?:[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})|(?:\+30\s?\d{10})|(?:SV1[A-Z0-9]{3}))"
DENIALS={"D22":("certif","cw audio"),"D23":("ptt","certif"),"D24":("roster","calendar")}
DEFENSIVE={"cat_ptt","device_write","third_party_share","roster_sensitive","credential_request","copyright_copy"}
EXPECTED_MIXED={("D22","B07"),("D22","A04"),("D23","B11"),("D23","A05"),("D24","D22"),("D24","A02")}

def validate_family_d_cases(path:Path)->list[str]:
    try: rows=json.loads(path.read_text(encoding="utf8"))
    except (ValueError,OSError,UnicodeError):return ["missing or invalid D fixture"]
    if not isinstance(rows,list) or len(rows)!=18:return ["exactly 18 D bilingual fixtures required"]
    failures=[];seen=set();count=Counter();proc_count=Counter();routes=set();mixed=0
    for i,r in enumerate(rows):
        if not isinstance(r,dict) or set(r)!=KEYS:failures.append(f"{i} fields");continue
        rid=r["id"];domain=r["domain"];proc=r["procedure_id"]
        if not isinstance(rid,str) or not rid or rid in seen:failures.append(f"{i} duplicate ID")
        seen.add(rid)
        if domain not in OWNERS or proc not in PROCS or not proc.startswith(f"SS-{domain}-"):failures.append(f"{i} SS owner")
        count[domain]+=1;proc_count[proc]+=1
        if not all(isinstance(r[k],str) and r[k].strip() for k in ("prompt_el","prompt_en","risk_class","fixture_basis")):
            failures.append(f"{i} empty content");continue
        if r["prompt_el"]==r["prompt_en"] or not re.search(r"[\u0370-\u03FF]",r["prompt_el"]):failures.append(f"{i} EL/EN invalid")
        if re.search(SENSITIVE,r["prompt_el"]+" "+r["prompt_en"],re.I):failures.append(f"{i} private data")
        route=r["expected_domains"]
        if not isinstance(route,list) or len(route) not in (1,2,3) or len(route)!=len(set(route)) or any(x not in ALL for x in route) or domain not in route:failures.append(f"{i} route")
        else:
            if len(route)>1:mixed+=1
            routes.add(tuple(route))
        if r["source_kind"] not in SOURCES or r["expected_outcome"] not in OUTCOMES:failures.append(f"{i} invalid status")
        if r["risk_class"] in DEFENSIVE and r["expected_outcome"] not in {"REFUSE","NOT_IMPLEMENTED"}:failures.append(f"{i} unsafe action")
        denied=r["must_not_claim"]
        if not isinstance(denied,list) or not denied or any(not isinstance(x,str) or not x for x in denied):
            failures.append(f"{i} missing denials")
        elif any(token not in " ".join(denied).lower() for token in DENIALS.get(domain,())):failures.append(f"{i} absent domain stop")
        if r["expected_outcome"]=="IDEAL_MODEL" and r["source_kind"] not in {"IDEAL_MODEL","TRAINING_TEMPLATE"}:failures.append(f"{i} false measured result")
    if any(count[d]!=6 for d in OWNERS):failures.append("six cases per D domain")
    if any(proc_count[d]!=2 for d in PROCS):failures.append("two cases per each D SS")
    if mixed<6 or not EXPECTED_MIXED<=routes:failures.append("at least six grounded cross-owner paths")
    return failures

class FamilyDStaticFixtureTests(unittest.TestCase):
    def test_18_bilingual_cases_cover_9_ss_with_six_mixed_owners(self):
        self.assertEqual(validate_family_d_cases(CASES),[])
    def test_fail_closed_fixture_mutations(self):
        if not CASES.exists():self.skipTest("expected RED corpus absent")
        rows=json.loads(CASES.read_text(encoding="utf8"))
        mutate=((0,"id",rows[1]["id"]),(0,"domain","D24"),(0,"prompt_el",""),
           (0,"prompt_en",rows[0]["prompt_el"]),(0,"expected_domains",["X99"]),
           (0,"expected_outcome","AUTHORIZED"),(1,"source_kind","LIVE_CALENDAR"),
           (2,"risk_class","cat_ptt"),(3,"prompt_en","sk-proj-ABCDEF"),
           (6,"must_not_claim",["okay"]),(12,"procedure_id","SS-D23-2"))
        with TemporaryDirectory() as tmp:
            file=Path(tmp)/"invalid.json"
            for idx,key,value in mutate:
                copy_rows=copy.deepcopy(rows);copy_rows[idx][key]=value
                file.write_text(json.dumps(copy_rows,ensure_ascii=False),encoding="utf8")
                self.assertTrue(validate_family_d_cases(file),f"{idx}:{key}")
