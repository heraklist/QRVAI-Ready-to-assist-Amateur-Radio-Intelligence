/**
 * Calls every live tool against the real providers and prints a one-line result for each.
 * Needs outbound HTTPS to the hosts in src/live/sources.ts. Not part of CI: providers change and can be down.
 *   npm run smoke:live
 */
import {spaceWeatherNow} from "../src/live/spaceweather.ts";
import {satellitePasses, satelliteTransmitters} from "../src/live/satellites.ts";
import {potaSpots, wsprSpots} from "../src/live/spots.ts";
import {callsignInfo} from "../src/live/callsign.ts";
import {repeatersNear} from "../src/live/repeaters.ts";
import {contestCalendar} from "../src/live/contests.ts";
import {regulationText, regulationChanges} from "../src/live/regulations.ts";

const ATHENS = {lat_deg: 37.98, lon_deg: 23.73};
const checks: [string, () => Promise<string>][] = [
  ["space_weather_now", async () => { const r = await spaceWeatherNow(); return `Kp ${r.kp.value} (${r.kp.observed_at}), SFI ${r.f107?.sfu}, X-ray ${r.xray?.class}`; }],
  ["satellite_passes", async () => { const r = await satellitePasses({...ATHENS, hours: 24, min_elevation_deg: 10, satellite: "ISS", max_results: 5}); return `${r.passes.length} ISS passes, first ${r.passes[0]?.aos} max ${r.passes[0]?.max_elevation_deg}°`; }],
  ["satellite_transmitters", async () => { const r = await satelliteTransmitters({norad_id: 25544, include_inactive: false}); return `${r.transmitters.length} active ISS transmitters`; }],
  ["pota_spots", async () => { const r = await potaSpots({limit: 5}); return `${r.count} spots, newest ${r.spots[0]?.activator} ${r.spots[0]?.frequency_mhz} MHz`; }],
  ["wspr_spots", async () => { const r = await wsprSpots({callsign: "DL1GAB", role: "rx", hours: 6, limit: 5}); return `${r.summary.count} spots`; }],
  ["callsign_info", async () => { const r = await callsignInfo({callsign: "SV1ABC", include_lotw: true}); return `${r.dxcc_entity?.name} CQ${r.dxcc_entity?.cq_zone} ITU${r.dxcc_entity?.itu_zone}; LoTW ${"last_upload" in (r.lotw ?? {}) ? "ok" : "unavailable"}`; }],
  ["repeaters_near", async () => { const r = await repeatersNear({...ATHENS, radius_km: 50, include_non_operational: false, limit: 5}); return `${r.count} repeaters, nearest ${r.repeaters[0]?.callsign} ${r.repeaters[0]?.frequency_mhz} MHz`; }],
  ["contest_calendar", async () => { const r = await contestCalendar({days: 7}); return `${r.count} contests, first "${r.contests[0]?.name}"`; }],
  ["regulation_text GR", async () => { const r = await regulationText({document_id: "gr-ya-38200-1136-2011", query: "κατηγορίας 1", max_passages: 2}); return `${"passages" in r ? r.passages.length : 0} passages in ${r.total_pages ?? "?"} pages`; }],
  ["regulation_text GR outline", async () => { const r = await regulationText({gazette: {issue: "B", year: 2011, number: 1969}, max_passages: 2}); return `${"outline" in r ? r.outline.length : 0} articles`; }],
  ["regulation_text EKKZS", async () => { const r = await regulationText({document_id: "gr-eett-ekkzs-2025", query: "ερασιτεχνική", max_passages: 2}); return `${"passages" in r ? r.passages.length : 0} passages in ${r.total_pages ?? "?"} pages`; }],
  ["regulation_text US", async () => { const r = await regulationText({us_section: "97.301", query: "CEPT", max_passages: 2}); return `${"passages" in r ? r.passages.length : 0} passages, eCFR as of ${"up_to_date_as_of" in r ? r.up_to_date_as_of : "?"}`; }],
  ["regulation_changes GR", async () => { const r = await regulationChanges({jurisdiction: "GR", limit: 3}); return "eett_documents" in r ? `${r.eett_documents.length} EETT docs, ${r.new_since_review} new since review, newest ${r.eett_documents[0]?.uploaded}` : "?"; }],
  ["regulation_changes CEPT", async () => { const r = await regulationChanges({jurisdiction: "CEPT", limit: 3}); return "recommendations" in r ? r.recommendations.map(x => `${x.reference} ${x.found ? x.latest_update : "missing"}`).join(", ") : "?"; }],
  ["regulation_changes US", async () => { const r = await regulationChanges({jurisdiction: "US", limit: 3}); return "part97_latest_amendment" in r ? `Part 97 last amended ${r.part97_latest_amendment}, ${r.federal_register_documents.length} FR docs` : "?"; }],
];

let failed = 0;
for (const [name, run] of checks) {
  const t = Date.now();
  try { const line = await run(); console.log(`PASS ${name} (${Date.now() - t} ms): ${line}`); }
  catch (e) { failed++; console.log(`FAIL ${name}: ${e instanceof Error ? e.message : e}`); }
}
process.exitCode = failed ? 1 : 0;
