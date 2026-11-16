import {test} from "node:test";
import assert from "node:assert/strict";
import {COUNTRY_PACKS,countryPackStatus,countryCode} from "../src/live/country-packs.ts";
import {regulatoryContext} from "../src/live/jurisdiction.ts";

test("national source packs are unique, country-specific and attributable to official publishers",()=>{
  assert.deepEqual(COUNTRY_PACKS.map(p=>p.country_code),["GR","US","DE","GB","AU","CA","NZ","JP"]);
  assert.equal(new Set(COUNTRY_PACKS.map(p=>p.country_code)).size,COUNTRY_PACKS.length);
  for(const p of COUNTRY_PACKS){
    assert.match(p.country_code,/^[A-Z]{2}$/);
    assert.ok(p.regulator.length>3);
    assert.equal(p.allowed_to_transmit_assessment_implemented,false);
    assert.equal(p.legal_effective_date_verified,false);
    assert.equal(p.privileges_by_licence_class_implemented,false);
    assert.equal(p.reciprocal_recognition_implemented,false);
    assert.equal(p.needs_territory_and_site_verification,true);
    assert.ok(p.national_sources.length>0);
    for(const source of p.national_sources){
      assert.ok(source.publisher.length>3);
      assert.equal(new URL(source.url).protocol,"https:");
      assert.equal(source.legal_version_and_effective_date_verified,false);
      assert.equal(source.permission_claims_verified,false);
      assert.match(source.discovery_checked_on,/^2026-11-(15|16)$/);
      assert.ok(source.provenance_note.length>45);
    }
  }
});
test("official-source observations never certify operative legal currentness or permission",()=>{
  for(const country of ["GR","US","DE","GB","AU","CA","NZ","JP","FR","IN","ZA","ZZ"]){
    const p=countryPackStatus(country);
    assert.equal(p.operating_country,country);
    assert.equal(p.permission_status,"INDETERMINATE");
    assert.equal(p.country_pack_complete,false);
    assert.equal(p.site_and_territory_verified,false);
    assert.equal(p.governing_instrument_currentness_verified,false);
    assert.equal(p.national_licence_and_visitor_privileges_verified,false);
    if(["FR","IN","ZA","ZZ"].includes(country)){
      assert.equal(p.coverage,"NO_COUNTRY_PACK");
      assert.deepEqual(p.declared_sources,[]);
    }
  }
});
test("UK alias maps to GB for BOTH home and visited jurisdiction",()=>{
  assert.equal(countryCode(" uk "),"GB");
  const r=regulatoryContext({operating_country:"UK",home_country:"gb"});
  assert.equal(r.operating_country,"GB");
  assert.equal(r.home_country,"GB");
  assert.equal(r.station_context.visiting_operator,false);
  assert.equal(r.country_pack.coverage,"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY");
});
test("source-coverage provenance is emitted from regulatory_context without implicit geographic permission",()=>{
  const result=regulatoryContext({
    operating_country:"DE",home_country:"GR",visiting_operator:true,operation_date:"2026-11-16",
    frequency_mhz:145.5,mode:"FM",power_w:10,licence_class:"visitor",
  });
  assert.equal(result.permission_status,"INDETERMINATE");
  assert.equal(result.permission_assessed,false);
  assert.equal(result.country_pack.declared_sources[0]?.id,"de-afuv");
  assert.equal(result.authorities.national.source_provenance[0]?.publisher,"Bundesministerium der Justiz / Bundesamt für Justiz");
  assert.equal(result.country_pack.national_licence_and_visitor_privileges_verified,false);
  assert.equal(result.country_pack.governing_instrument_currentness_verified,false);
  assert.equal(result.missing_or_unverified_evidence.includes("documented_host_country_visitor_privileges"),true);
});
test("no band plan or CEPT agreement is treated as national law",()=>{
  const x=regulatoryContext({operating_country:"GR",home_country:"DE",frequency_mhz:144.3,
    mode:"SSB",power_w:5,licence_class:"HAREC",operation_date:"2026-11-16"});
  assert.equal(x.authorities.regional.force,"nonbinding_operating_guidance");
  assert.equal(x.authorities.cross_border.force,"participation_and_licence_equivalence_require_host_country_verification");
  assert.equal(x.authorities.national.currentness_and_effective_date_verified,false);
  assert.equal(x.permission_status,"INDETERMINATE");
});
