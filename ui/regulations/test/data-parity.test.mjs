import {test} from "node:test";
import assert from "node:assert/strict";
import {COUNTRY_PACKS as original,countryPackStatus} from "../../../mcp/qrvai-rf-worker/src/live/country-packs.ts";
import {COUNTRY_PACKS as browser,COUNTRY_BY_CODE,SOURCE_DISCOVERY_ONLY} from "../data.mjs";

test("static official-source discovery browser exactly matches canonical 8-country registry",()=>{
  assert.deepEqual(browser,original);
  assert.deepEqual(browser.map(x=>x.country_code),["GR","US","DE","GB","AU","CA","NZ","JP"]);
  assert.equal(SOURCE_DISCOVERY_ONLY,true);
  assert.equal(COUNTRY_BY_CODE.size,8);
});
test("each displayed official source stays research-only and cannot grant transmit permission",()=>{
  for(const pack of browser){
    assert.equal(COUNTRY_BY_CODE.get(pack.country_code),pack);
    assert.equal(countryPackStatus(pack.country_code).permission_status,"INDETERMINATE");
    assert.equal(pack.allowed_to_transmit_assessment_implemented,false);
    assert.equal(pack.privileges_by_licence_class_implemented,false);
    assert.ok(pack.national_sources.length>0);
    for(const item of pack.national_sources){
      assert.equal(new URL(item.url).protocol,"https:");
      assert.equal(item.permission_claims_verified,false);
      assert.equal(item.legal_version_and_effective_date_verified,false);
    }
  }
  assert.equal(countryPackStatus("FR").coverage,"NO_COUNTRY_PACK");
});
