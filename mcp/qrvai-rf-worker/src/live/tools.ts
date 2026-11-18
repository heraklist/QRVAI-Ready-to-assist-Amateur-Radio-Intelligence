import type {ToolDescriptor} from "../rf/wave1.ts";

/** Live-data and catalogue tools added for V1; kept apart from the original 38-tool catalogue. */
export const LIVE_TOOLS: readonly ToolDescriptor[] = Object.freeze([
  {candidate_id:"M39",name:"space_weather_now",scope:"Live NOAA SWPC Kp, Kp forecast, 10.7 cm flux and X-ray class"},
  {candidate_id:"M40",name:"satellite_passes",scope:"Live CelesTrak elements and SGP4 pass prediction"},
  {candidate_id:"M41",name:"satellite_transmitters",scope:"Live SatNOGS uplink/downlink frequencies"},
  {candidate_id:"M42",name:"pota_spots",scope:"Live Parks on the Air activator spots"},
  {candidate_id:"M43",name:"wspr_spots",scope:"Live WSPR reception reports from wspr.live"},
  {candidate_id:"M44",name:"callsign_info",scope:"DXCC entity and zones from AD1C cty.dat, LoTW last upload"},
  {candidate_id:"M45",name:"repeaters_near",scope:"Live HearHam repeater list near a location"},
  {candidate_id:"M46",name:"contest_calendar",scope:"Live WA7BNM contest calendar"},
  {candidate_id:"M47",name:"regulatory_sources",scope:"Official amateur-radio legal sources by jurisdiction"},
  {candidate_id:"M48",name:"regulation_text",scope:"Live official legal text: Greek ΦΕΚ, EETT documents, 47 CFR 97"},
  {candidate_id:"M49",name:"regulation_changes",scope:"Live change check of GR, CEPT and US amateur rules"},
  {candidate_id:"M50",name:"erp_eirp",scope:"ERP and EIRP from power, losses and antenna gain"},
  {candidate_id:"M51",name:"cable_catalog",scope:"Coax attenuation tables from manufacturer datasheets"},
  {candidate_id:"M52",name:"cable_loss",scope:"Feedline loss for a catalogued coax cable"},
  {candidate_id:"M53",name:"regulatory_context",scope:"Explicit operating-country context; authority tiers and INDETERMINATE without local national permission checks"},
  {candidate_id:"M54",name:"academy_catalog",scope:"Global offline hobby curriculum in English and Greek, independent of national licensing exams"},
]);
