/**
 * QRVAI national-source discovery packs, versioned independently of regulatory permissions.
 * Provenance is per-source; "accessible" means the official landing page was observed,
 * NEVER that provisions, amendments, licences or individual TX privileges were validated.
 * See ADR-0012 and docs/implementation/2026-11-16-qrvai-international-implementation-ledger.md.
 */
export type SourceKind="binding_instrument_pointer"|"official_consolidation_pointer"|"official_regulator_portal";
export type NationalSource={
  id:string; title:string; publisher:string; url:string; kind:SourceKind;
  discovery_checked_on:string; retrieval:"OFFICIAL_HTML_OBSERVED"|"SOURCE_INDEX_REVIEWED"|"DIRECT_ACCESS_RESTRICTED";
  legal_version_and_effective_date_verified:false;
  permission_claims_verified:false;
  provenance_note:string;
};
export type CountryPack={
  country_code:string;
  canonical_country_name:string;
  regulator:string;
  coverage:"PARTIAL_OFFICIAL_SOURCE_ADAPTER"|"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY";
  region_hint_for_mainland:"1"|"2"|"3";
  needs_territory_and_site_verification:true;
  legal_effective_date_verified:false;
  privileges_by_licence_class_implemented:false;
  reciprocal_recognition_implemented:false;
  allowed_to_transmit_assessment_implemented:false;
  national_sources:readonly NationalSource[];
};

export const COUNTRY_PACKS: readonly CountryPack[]=Object.freeze([
  {country_code:"GR",canonical_country_name:"Greece",regulator:"Hellenic national administration / EETT (spectrum source)",
   coverage:"PARTIAL_OFFICIAL_SOURCE_ADAPTER",region_hint_for_mainland:"1",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[
     {id:"gr-gazette-2011",title:"Ministerial decision 38200/1136/2011",publisher:"Hellenic National Printing Office",url:"https://api.et.gr/apiFEK/2/2011/1969/html",
      kind:"binding_instrument_pointer",discovery_checked_on:"2026-11-15",retrieval:"SOURCE_INDEX_REVIEWED",
      legal_version_and_effective_date_verified:false,permission_claims_verified:false,
      provenance_note:"Official Gazette source identifier; amendments and operative text at the requested date are not consolidated or reviewed by this pack."},
     {id:"gr-eett-spectrum",title:"Spectrum regulatory framework and allocation-table listings",publisher:"EETT",url:"https://www.eett.gr/parochoi/fasma-radiosychnotiton/nomothetiko-kanonistiko-plaisio/?_sft_plaisio_cat=fasma-radiosychnotiton",
      kind:"official_regulator_portal",discovery_checked_on:"2026-11-15",retrieval:"SOURCE_INDEX_REVIEWED",
      legal_version_and_effective_date_verified:false,permission_claims_verified:false,
      provenance_note:"EETT listing is not a station licence or consolidated privilege determination."},
   ]},
  {country_code:"US",canonical_country_name:"United States",regulator:"Federal Communications Commission (FCC)",
   coverage:"PARTIAL_OFFICIAL_SOURCE_ADAPTER",region_hint_for_mainland:"2",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[
     {id:"us-47cfr97",title:"47 CFR Part 97 Amateur Radio Service",publisher:"U.S. eCFR / Office of the Federal Register",url:"https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97",
      kind:"official_consolidation_pointer",discovery_checked_on:"2026-11-16",retrieval:"DIRECT_ACCESS_RESTRICTED",
      legal_version_and_effective_date_verified:false,permission_claims_verified:false,
      provenance_note:"Official eCFR page located in search results; direct browser access challenged. No claim of current point-in-time text or licensed operator privileges."},
   ]},
  {country_code:"DE",canonical_country_name:"Germany",regulator:"Bundesnetzagentur (BNetzA)",
   coverage:"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY",region_hint_for_mainland:"1",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[
     {id:"de-afuv",title:"Amateurfunkverordnung (AFuV)",publisher:"Bundesministerium der Justiz / Bundesamt für Justiz",url:"https://www.gesetze-im-internet.de/afuv_2005/",
      kind:"official_consolidation_pointer",discovery_checked_on:"2026-11-16",retrieval:"OFFICIAL_HTML_OBSERVED",
      legal_version_and_effective_date_verified:false,permission_claims_verified:false,
      provenance_note:"Official index accessible; individual operative clauses, amendments and status for a requested operation date require versioned national review."},
   ]},
  {country_code:"GB",canonical_country_name:"United Kingdom",regulator:"Ofcom",
   coverage:"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY",region_hint_for_mainland:"1",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[
     {id:"gb-ofcom-amateur",title:"Amateur radio licence information",publisher:"Ofcom",url:"https://www.ofcom.org.uk/spectrum/radio-equipment/amateur-radio",
      kind:"official_regulator_portal",discovery_checked_on:"2026-11-16",retrieval:"OFFICIAL_HTML_OBSERVED",
      legal_version_and_effective_date_verified:false,permission_claims_verified:false,
      provenance_note:"Official amateur-radio information landing page observed. This page alone does not establish the current licence schedule, variations or permission at any location."},
   ]},
  {country_code:"AU",canonical_country_name:"Australia",regulator:"Australian Communications and Media Authority (ACMA)",
   coverage:"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY",region_hint_for_mainland:"3",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[{id:"au-acma-amateur",title:"Amateur radio licences",publisher:"ACMA",url:"https://www.acma.gov.au/amateur-radio-licences",
     kind:"official_regulator_portal",discovery_checked_on:"2026-11-16",retrieval:"OFFICIAL_HTML_OBSERVED",
     legal_version_and_effective_date_verified:false,permission_claims_verified:false,
     provenance_note:"ACMA official amateur-service portal verified accessible. Class licence, qualification and visitor restrictions are NOT modelled into operating privileges."}]},
  {country_code:"CA",canonical_country_name:"Canada",regulator:"Innovation, Science and Economic Development Canada (ISED)",
   coverage:"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY",region_hint_for_mainland:"2",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[{id:"ca-ised-certificate",title:"Amateur radio operator certification",publisher:"Innovation, Science and Economic Development Canada",url:"https://ised-isde.canada.ca/site/spectrum-management-telecommunications/en/licences-and-certificates/radio-authorizations/amateur-radio-operator-certification",
     kind:"official_regulator_portal",discovery_checked_on:"2026-11-16",retrieval:"OFFICIAL_HTML_OBSERVED",
     legal_version_and_effective_date_verified:false,permission_claims_verified:false,
     provenance_note:"Official ISED certification information accessible. Operator certification is not automatically proof of a permissible frequency, power, visitor privilege or station authorization."}]},
  {country_code:"NZ",canonical_country_name:"New Zealand",regulator:"Radio Spectrum Management (RSM, MBIE)",
   coverage:"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY",region_hint_for_mainland:"3",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[{id:"nz-rsm-amateur",title:"Amateur radio operator licensing",publisher:"Radio Spectrum Management New Zealand",url:"https://www.rsm.govt.nz/licensing/do-you-need-a-licence/amateur-radio-operator-licensing",
     kind:"official_regulator_portal",discovery_checked_on:"2026-11-16",retrieval:"OFFICIAL_HTML_OBSERVED",
     legal_version_and_effective_date_verified:false,permission_claims_verified:false,
     provenance_note:"Official RSM eligibility/visitor guidance accessible, but the applicable licence category depends on nationality, credentials and stay; none has been adjudicated."}]},
  {country_code:"JP",canonical_country_name:"Japan",regulator:"Ministry of Internal Affairs and Communications (MIC)",
   coverage:"MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY",region_hint_for_mainland:"3",
   needs_territory_and_site_verification:true,legal_effective_date_verified:false,
   privileges_by_licence_class_implemented:false,reciprocal_recognition_implemented:false,allowed_to_transmit_assessment_implemented:false,
   national_sources:[{id:"jp-mic-radio-licensing",title:"MIC Radio Use Portal — station licensing information",publisher:"Japan Ministry of Internal Affairs and Communications",url:"https://www.tele.soumu.go.jp/e/adm/proc/type/aptoli/index.htm",
     kind:"official_regulator_portal",discovery_checked_on:"2026-11-16",retrieval:"OFFICIAL_HTML_OBSERVED",
     legal_version_and_effective_date_verified:false,permission_claims_verified:false,
     provenance_note:"Official English-language MIC radio station licence process page accessible, not a full amateur-only binding rule or current privilege determination."}]},
]); 
export const countryCode=(input:string)=>input.trim().toUpperCase()==="UK"?"GB":input.trim().toUpperCase();
export function countryPackStatus(input:string){
  const code=countryCode(input);
  const pack=COUNTRY_PACKS.find(p=>p.country_code===code);
  return {
    schema_version:"2026-11-16.v1",
    operating_country:code,
    coverage:pack?.coverage??"NO_COUNTRY_PACK",
    region_hint_for_mainland:pack?.region_hint_for_mainland??null,
    declared_sources:pack?.national_sources??[],
    regulator:pack?.regulator??null,
    site_and_territory_verified:false,
    governing_instrument_currentness_verified:false,
    national_licence_and_visitor_privileges_verified:false,
    permission_status:"INDETERMINATE" as const,
    country_pack_complete:false,
    next_review:"A human reviewer must confirm jurisdiction, legal force, operative instrument, amendments, effective date and licence/visitor status.",
  };
}
