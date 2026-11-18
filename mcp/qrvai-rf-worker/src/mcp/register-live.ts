import type {McpServer} from "@modelcontextprotocol/server";
import {z} from "zod/v4";
import {ProviderError} from "../live/http.ts";
import {spaceWeatherNow} from "../live/spaceweather.ts";
import {satellitePasses, satelliteTransmitters} from "../live/satellites.ts";
import {potaSpots, wsprSpots} from "../live/spots.ts";
import {callsignInfo} from "../live/callsign.ts";
import {repeatersNear} from "../live/repeaters.ts";
import {contestCalendar} from "../live/contests.ts";
import {regulatorySources, regulationText, regulationChanges} from "../live/regulations.ts";
import {cableCatalog, cableLoss, CableError} from "../live/cables.ts";
import {erpEirp, ErpInputError} from "../rf/erp.ts";
import {BAND_NAMES} from "../live/bands.ts";
import {regulatoryContext} from "../live/jurisdiction.ts";
import {academyCatalog} from "../academy/catalog.ts";

const live = {readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true};
const offline = {readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false};
const lat = z.number().finite().min(-90).max(90), lon = z.number().finite().min(-180).max(180);
const band = z.enum(BAND_NAMES as [string, ...string[]]);
const callsign = z.string().min(3).max(20);

function ok(output: object) {
  return {content: [{type: "text" as const, text: JSON.stringify(output)}], structuredContent: output as Record<string, unknown>};
}
function fail(error: unknown) {
  if (error instanceof ProviderError) return {content: [{type: "text" as const, text: `${error.code}: ${error.message}`}], isError: true};
  if (error instanceof CableError || error instanceof ErpInputError) return {content: [{type: "text" as const, text: `${error.code}: ${error.message}`}], isError: true};
  return {content: [{type: "text" as const, text: "INTERNAL_ERROR: the tool failed; no result is available"}], isError: true};
}
const run = <A,>(f: (a: A) => unknown) => async (args: A) => { try { return ok(await f(args) as object); } catch (e) { return fail(e); } };

export function registerLiveTools(server: McpServer, allowTool: (name: string) => boolean): void {
  if (allowTool("space_weather_now")) server.registerTool("space_weather_now", {
    title: "Space weather now (NOAA SWPC)",
    description: "Current planetary Kp with NOAA G-scale, the highest predicted Kp in the next 24 h, latest 10.7 cm solar flux and GOES X-ray class, with observation times. Indicators only, not a path forecast.",
    inputSchema: z.strictObject({}), annotations: live,
  }, run(async () => spaceWeatherNow()));

  if (allowTool("satellite_passes")) server.registerTool("satellite_passes", {
    title: "Amateur satellite passes (SGP4)",
    description: "Predict passes of amateur satellites over a location from current CelesTrak elements: AOS, maximum elevation and LOS times (UTC) with azimuths. Filter by name or NORAD id; without a filter the window is at most 12 h.",
    inputSchema: z.strictObject({
      lat_deg: lat, lon_deg: lon, alt_m: z.number().finite().min(-500).max(9000).optional(),
      hours: z.number().int().min(1).max(48), min_elevation_deg: z.number().finite().min(0).max(89).default(10),
      satellite: z.string().min(1).max(40).optional(), max_results: z.number().int().min(1).max(50).default(15),
    }), annotations: live,
  }, run(satellitePasses));

  if (allowTool("satellite_transmitters")) server.registerTool("satellite_transmitters", {
    title: "Satellite frequencies (SatNOGS)",
    description: "Uplink and downlink frequencies, modes and status for a satellite by NORAD catalogue id (get it from satellite_passes).",
    inputSchema: z.strictObject({norad_id: z.number().int().min(1).max(999999), include_inactive: z.boolean().default(false)}), annotations: live,
  }, run(satelliteTransmitters));

  if (allowTool("pota_spots")) server.registerTool("pota_spots", {
    title: "Parks on the Air spots",
    description: "Current POTA activator spots, newest first. Filter by band, mode, park reference prefix (e.g. \"GR-\") or location prefix (e.g. \"GR\").",
    inputSchema: z.strictObject({band: band.optional(), mode: z.string().min(2).max(10).optional(), reference_prefix: z.string().min(1).max(10).optional(),
      location_prefix: z.string().min(1).max(10).optional(), limit: z.number().int().min(1).max(50).default(20)}), annotations: live,
  }, run(potaSpots));

  if (allowTool("wspr_spots")) server.registerTool("wspr_spots", {
    title: "WSPR reception reports",
    description: "Recent WSPR spots for a callsign as transmitter (who heard it) or receiver (what it heard), with distance and SNR summary. Up to the last 24 hours.",
    inputSchema: z.strictObject({callsign, role: z.enum(["tx", "rx"]).default("tx"), hours: z.number().int().min(1).max(24).default(6),
      band: band.optional(), limit: z.number().int().min(1).max(50).default(25)}), annotations: live,
  }, run(wsprSpots));

  if (allowTool("callsign_info")) server.registerTool("callsign_info", {
    title: "Callsign country, zones and LoTW activity",
    description: "DXCC entity, continent, CQ/ITU zones and approximate location for a callsign prefix (AD1C cty.dat), plus the date the callsign last uploaded to LoTW. Does not look up names, addresses or licence records.",
    inputSchema: z.strictObject({callsign, include_lotw: z.boolean().default(true)}), annotations: live,
  }, run(callsignInfo));

  if (allowTool("repeaters_near")) server.registerTool("repeaters_near", {
    title: "Repeaters near a location",
    description: "Repeaters within a radius of a point from the HearHam community list: output and input frequency, offset, tone, mode, network, distance and bearing. Verify locally before use.",
    inputSchema: z.strictObject({lat_deg: lat, lon_deg: lon, radius_km: z.number().finite().positive().max(300).default(50), band: band.optional(),
      mode: z.string().min(2).max(16).optional(), include_non_operational: z.boolean().default(false), limit: z.number().int().min(1).max(50).default(20)}), annotations: live,
  }, run(repeatersNear));

  if (allowTool("contest_calendar")) server.registerTool("contest_calendar", {
    title: "Contest calendar (WA7BNM)",
    description: "Upcoming and running amateur radio contests from the WA7BNM Contest Calendar with UTC times and links to the details. Optional name filter.",
    inputSchema: z.strictObject({query: z.string().min(2).max(60).optional(), days: z.number().int().min(1).max(14).default(7)}), annotations: live,
  }, run(contestCalendar));

  if (allowTool("regulatory_sources")) server.registerTool("regulatory_sources", {
    title: "Official amateur-radio legal sources",
    description: "Official laws, regulations and recommendations QRVAI tracks per jurisdiction (GR, CEPT, US, DE, UK, IARU-R1), with document ids for regulation_text and which ones are checked live.",
    inputSchema: z.strictObject({jurisdiction: z.string().min(2).max(8).optional()}), annotations: offline,
  }, run(async (a: {jurisdiction?: string}) => regulatorySources(a.jurisdiction)));

  if (allowTool("regulation_text")) server.registerTool("regulation_text", {
    title: "Official legal text (live)",
    description: "Fetch the official text of a legal source and return matching passages with page numbers, one page, or an article outline. Give exactly one of: document_id (from regulatory_sources), gazette {issue A|B, year, number} for any Greek ΦΕΚ, eett_pdf_url (from regulation_changes) or us_section (e.g. 97.301). Text only, never legal advice or transmit permission.",
    inputSchema: z.strictObject({
      document_id: z.string().min(3).max(60).optional(),
      gazette: z.strictObject({issue: z.enum(["A", "B"]), year: z.number().int().min(1833).max(2100), number: z.number().int().min(1).max(99999)}).optional(),
      eett_pdf_url: z.string().url().max(400).optional(),
      us_section: z.string().max(12).optional(),
      query: z.string().min(3).max(120).optional(), page: z.number().int().min(1).max(2000).optional(),
      max_passages: z.number().int().min(1).max(8).default(4),
    }), annotations: live,
  }, run(regulationText));

  if (allowTool("regulation_changes")) server.registerTool("regulation_changes", {
    title: "Recent regulatory changes (live)",
    description: "Check official sources now for new or amended rules since QRVAI's last review: GR (EETT spectrum documents and ΦΕΚ availability), CEPT (T/R 61-01, T/R 61-02 status) or US (Part 97 amendments and Federal Register documents).",
    inputSchema: z.strictObject({jurisdiction: z.enum(["GR", "CEPT", "US"]), limit: z.number().int().min(1).max(30).default(10)}), annotations: live,
  }, run(regulationChanges));

  if (allowTool("erp_eirp")) server.registerTool("erp_eirp", {
    title: "ERP and EIRP",
    description: "Effective radiated power (dipole reference) and EIRP (isotropic reference) from transmitter power, feedline and other losses and antenna gain in dBi or dBd.",
    inputSchema: z.strictObject({tx_power_w: z.number().finite().positive(), feedline_loss_db: z.number().finite().min(0).default(0),
      other_losses_db: z.number().finite().min(0).default(0), antenna_gain: z.number().finite(), antenna_gain_unit: z.enum(["dBi", "dBd"])}), annotations: offline,
  }, run(erpEirp));

  if (allowTool("cable_catalog")) server.registerTool("cable_catalog", {
    title: "Coax cable catalog (datasheets)",
    description: "Attenuation tables (dB/100 m) of common coax cables copied from manufacturer datasheets, with links. Optional name filter, e.g. \"aircell\" or \"rg213\".",
    inputSchema: z.strictObject({query: z.string().min(2).max(40).optional()}), annotations: offline,
  }, run(async (a: {query?: string}) => cableCatalog(a.query)));

  if (allowTool("cable_loss")) server.registerTool("cable_loss", {
    title: "Feedline loss for a catalogued cable",
    description: "Cable and connector loss, delivered power ratio and optionally delivered watts for a cable from cable_catalog at a frequency inside its datasheet range.",
    inputSchema: z.strictObject({cable_id: z.string().min(2).max(40), frequency_mhz: z.number().finite().positive(), length_m: z.number().finite().min(0).max(10000),
      connector_loss_db: z.number().finite().min(0).max(20).default(0), tx_power_w: z.number().finite().positive().max(1e6).optional()}), annotations: offline,
  }, run(cableLoss));
  // Offline source-scoped cross-border research. Never claims permission to transmit.
  if (allowTool("regulatory_context")) server.registerTool("regulatory_context", {
    title: "International regulatory context (not TX permission)",
    description: "Country-of-operation research router: identifies ITU framework, advisory IARU region, CEPT visitor caveats and available official national sources. Returns INDETERMINATE, never transmit permission. Requires explicit operating country; national coverage is partial.",
    inputSchema: z.strictObject({
      operating_country: z.string().regex(/^[A-Za-z]{2}$/),
      operation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      home_country: z.string().regex(/^[A-Za-z]{2}$/).optional(),
      licence_class: z.string().min(1).max(80).optional(),
      visiting_operator: z.boolean().optional(),
      frequency_mhz: z.number().finite().positive().max(1_000_000).optional(),
      mode: z.string().min(2).max(40).optional(),
      power_w: z.number().finite().nonnegative().max(1_000_000).optional(),
    }), annotations: offline,
  }, run(regulatoryContext));

  // Country-neutral hobby syllabus, with no exam/licence-preparation dependency.
  if (allowTool("academy_catalog")) server.registerTool("academy_catalog", {
    title: "QRVAI Academy international hobby catalogue",
    description: "Browse nine structured amateur-radio hobby modules and 27 authored bilingual original micro-lessons. Supply lesson_id (e.g. radio-fundamentals-1) for a concept, safe practical activity and self-check answer. Does not prepare national licence exams, transmit signals or grant operating privileges.",
    inputSchema: z.strictObject({
      language: z.enum(["en", "el"]).default("en"),
      module_id: z.string().min(3).max(60).optional(),
      lesson_id: z.string().regex(/^[a-z][a-z0-9-]+-[1-3]$/).max(70).optional(),
      level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    }), annotations: offline,
  }, run(academyCatalog));


}
