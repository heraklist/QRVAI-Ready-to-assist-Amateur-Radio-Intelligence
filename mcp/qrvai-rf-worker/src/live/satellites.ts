import {json2satrec, propagate, gstime, eciToEcf, ecfToLookAngles, degreesToRadians, type SatRec} from "satellite.js";
import {cached, fetchJson, ProviderError, HOUR} from "./http.ts";
import {sourceRef} from "./sources.ts";

const GP_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=amateur&FORMAT=json";
const SATNOGS_URL = "https://db.satnogs.org/api/transmitters/?format=json";
const R2D = 180 / Math.PI;

type Omm = Record<string, unknown> & {OBJECT_NAME: string; NORAD_CAT_ID: number; EPOCH: string};

export function parseGp(raw: unknown): Omm[] {
  if (!Array.isArray(raw)) throw new ProviderError("unexpected CelesTrak format");
  return raw.filter((r): r is Omm => r && typeof r === "object" && typeof r.OBJECT_NAME === "string" &&
    Number.isInteger(r.NORAD_CAT_ID) && typeof r.EPOCH === "string");
}

async function amateurElements() {
  return cached("celestrak:amateur", 6 * HOUR, async () => parseGp(await fetchJson(GP_URL, {maxBytes: 3_000_000, timeoutMs: 15000})));
}

export type Observer = {lat_deg: number; lon_deg: number; alt_m: number};
type Look = {el: number; az: number; range: number};

function look(satrec: SatRec, observer: Observer, t: Date): Look | null {
  const pv = propagate(satrec, t);
  if (!pv || typeof pv.position !== "object" || !pv.position) return null;
  const ecf = eciToEcf(pv.position, gstime(t));
  const angles = ecfToLookAngles(
    {latitude: degreesToRadians(observer.lat_deg), longitude: degreesToRadians(observer.lon_deg), height: observer.alt_m / 1000},
    ecf,
  );
  return {el: angles.elevation * R2D, az: ((angles.azimuth * R2D) % 360 + 360) % 360, range: angles.rangeSat};
}

export type Pass = {
  satellite: string; norad_id: number;
  aos: string; aos_azimuth_deg: number;
  tca: string; max_elevation_deg: number; tca_azimuth_deg: number;
  los: string; los_azimuth_deg: number;
  duration_s: number;
};

/** Find passes with a coarse scan and bisection on the horizon crossing (accurate to ~1 s). */
export function findPasses(omm: Omm, observer: Observer, start: Date, hours: number, minElevation: number): Pass[] {
  let satrec: SatRec;
  try { satrec = json2satrec(omm as never); } catch { return []; }
  const elev = (ms: number) => look(satrec, observer, new Date(ms))?.el ?? -90;
  const crossing = (lo: number, hi: number, rising: boolean) => {
    for (let i = 0; i < 20 && hi - lo > 1000; i++) {
      const mid = (lo + hi) / 2;
      if ((elev(mid) > 0) === rising) hi = mid; else lo = mid;
    }
    return hi;
  };
  const step = 30_000;
  const end = start.getTime() + hours * 3_600_000;
  const passes: Pass[] = [];
  let prevT = start.getTime();
  let prevEl = elev(prevT);
  let aos: number | null = prevEl > 0 ? prevT : null;
  for (let t = prevT + step; t <= end + step; t += step) {
    const e = elev(t);
    if (prevEl <= 0 && e > 0) aos = crossing(prevT, t, true);
    if (prevEl > 0 && e <= 0 && aos !== null) {
      const los = crossing(prevT, t, false);
      let tcaT = aos, maxEl = -90;
      for (let s = aos; s <= los; s += 5000) { const v = elev(s); if (v > maxEl) { maxEl = v; tcaT = s; } }
      if (maxEl >= minElevation) {
        const a = look(satrec, observer, new Date(aos))!, c = look(satrec, observer, new Date(tcaT))!, l = look(satrec, observer, new Date(los))!;
        passes.push({
          satellite: omm.OBJECT_NAME, norad_id: omm.NORAD_CAT_ID,
          aos: new Date(aos).toISOString(), aos_azimuth_deg: Math.round(a.az),
          tca: new Date(tcaT).toISOString(), max_elevation_deg: Math.round(maxEl * 10) / 10, tca_azimuth_deg: Math.round(c.az),
          los: new Date(los).toISOString(), los_azimuth_deg: Math.round(l.az),
          duration_s: Math.round((los - aos) / 1000),
        });
      }
      aos = null;
    }
    prevT = t; prevEl = e;
  }
  return passes;
}

export async function satellitePasses(input: {lat_deg: number; lon_deg: number; alt_m?: number; hours: number; min_elevation_deg: number; satellite?: string; max_results: number}, now = new Date()) {
  const els = await amateurElements();
  const query = input.satellite?.trim().toUpperCase();
  const candidates = els.value.filter(o => !query || o.OBJECT_NAME.toUpperCase().includes(query) || String(o.NORAD_CAT_ID) === query);
  if (query && candidates.length === 0) throw new ProviderError(`no amateur satellite matching "${input.satellite}" in the CelesTrak amateur group`);
  if (!query && input.hours > 12) throw new ProviderError("without a satellite filter the window is limited to 12 hours");
  const observer = {lat_deg: input.lat_deg, lon_deg: input.lon_deg, alt_m: input.alt_m ?? 0};
  const passes = candidates.flatMap(o => findPasses(o, observer, now, input.hours, input.min_elevation_deg))
    .sort((a, b) => a.aos.localeCompare(b.aos)).slice(0, input.max_results);
  const epochs = candidates.map(o => Date.parse(o.EPOCH.endsWith("Z") ? o.EPOCH : o.EPOCH + "Z")).filter(Number.isFinite);
  const oldestEpochDays = epochs.length ? (now.getTime() - Math.min(...epochs)) / 86_400_000 : null;
  return {
    passes,
    satellites_considered: candidates.length,
    window: {start: now.toISOString(), hours: input.hours},
    oldest_element_age_days: oldestEpochDays === null ? null : Math.round(oldestEpochDays * 10) / 10,
    method: "SGP4 (satellite.js) on CelesTrak GP elements; AOS/LOS at 0° geometric horizon, refined to ~1 s; no terrain or refraction.",
    source: sourceRef("celestrak"),
    fetched_at: els.fetched_at, from_cache: els.from_cache, cache_age_s: els.cache_age_s,
  };
}

type Tx = Record<string, unknown>;
const mhz = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v / 1000) / 1000 : null);

export function selectTransmitters(raw: unknown, noradId: number, includeInactive: boolean) {
  if (!Array.isArray(raw)) throw new ProviderError("unexpected SatNOGS format");
  return raw.filter((t): t is Tx => t && typeof t === "object" && t.norad_cat_id === noradId)
    .filter(t => includeInactive || (t.alive === true && t.status === "active"))
    .map(t => ({
      description: typeof t.description === "string" ? t.description.slice(0, 120) : "",
      type: typeof t.type === "string" ? t.type : null,
      uplink_mhz: mhz(t.uplink_low), uplink_high_mhz: mhz(t.uplink_high),
      downlink_mhz: mhz(t.downlink_low), downlink_high_mhz: mhz(t.downlink_high),
      mode: typeof t.mode === "string" ? t.mode : null,
      uplink_mode: typeof t.uplink_mode === "string" ? t.uplink_mode : null,
      inverted: t.invert === true,
      baud: typeof t.baud === "number" ? t.baud : null,
      status: typeof t.status === "string" ? t.status : null,
      iaru_coordination: typeof t.iaru_coordination === "string" ? t.iaru_coordination : null,
      updated: typeof t.updated === "string" ? t.updated : null,
    }));
}

export async function satelliteTransmitters(input: {norad_id: number; include_inactive: boolean}) {
  const all = await cached("satnogs:transmitters", 12 * HOUR, async () => fetchJson(SATNOGS_URL, {maxBytes: 12_000_000, timeoutMs: 12000}));
  const transmitters = selectTransmitters(all.value, input.norad_id, input.include_inactive);
  return {
    norad_id: input.norad_id, transmitters,
    note: "Community-maintained frequencies; confirm with the satellite operator before transmitting to an uplink.",
    source: sourceRef("satnogs"),
    fetched_at: all.fetched_at, from_cache: all.from_cache, cache_age_s: all.cache_age_s,
  };
}
