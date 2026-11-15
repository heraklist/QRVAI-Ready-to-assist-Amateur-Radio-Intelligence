import {cached, fetchText, ProviderError, HOUR} from "./http.ts";
import {sourceRef} from "./sources.ts";
import {CALLSIGN} from "./spots.ts";

const CTY_URL = "https://www.country-files.com/cty/cty.dat";
const LOTW_URL = "https://lotw.arrl.org/lotw-user-activity.csv";

export type Entity = {name: string; cq_zone: number; itu_zone: number; continent: string; lat: number; lon: number; utc_offset_h: number; primary_prefix: string};
type Override = Partial<Pick<Entity, "cq_zone" | "itu_zone" | "continent" | "lat" | "lon" | "utc_offset_h">>;
export type CtyIndex = {prefixes: Map<string, [Entity, Override]>; exact: Map<string, [Entity, Override]>; maxPrefix: number};

/** Parse AD1C cty.dat. Longitudes in the file are positive WEST; they are converted to the usual east-positive sign. */
export function parseCty(text: string, minPrefixes = 300): CtyIndex {
  const prefixes = new Map<string, [Entity, Override]>(), exact = new Map<string, [Entity, Override]>();
  const records = text.replace(/\r/g, "").split(";").map(r => r.trim()).filter(Boolean);
  let maxPrefix = 0;
  for (const record of records) {
    const colon = record.split(":");
    if (colon.length < 9) continue;
    const [name, cq, itu, cont, lat, lon, utc, primary] = colon.slice(0, 8).map(x => x.trim());
    const entity: Entity = {name, cq_zone: Number(cq), itu_zone: Number(itu), continent: cont, lat: Number(lat), lon: -Number(lon), utc_offset_h: -Number(utc), primary_prefix: primary.replace(/^\*/, "")};
    if (![entity.cq_zone, entity.itu_zone, entity.lat, entity.lon].every(Number.isFinite)) continue;
    for (const raw of colon.slice(8).join(":").split(",")) {
      const token = raw.trim();
      if (!token) continue;
      const override: Override = {};
      const cqo = token.match(/\((\d+)\)/), ituo = token.match(/\[(\d+)\]/), conto = token.match(/\{([A-Z]{2})\}/), lato = token.match(/<([-\d.]+)\/([-\d.]+)>/), utco = token.match(/~([-\d.]+)~/);
      if (cqo) override.cq_zone = Number(cqo[1]);
      if (ituo) override.itu_zone = Number(ituo[1]);
      if (conto) override.continent = conto[1];
      if (lato) { override.lat = Number(lato[1]); override.lon = -Number(lato[2]); }
      if (utco) override.utc_offset_h = -Number(utco[1]);
      const key = token.replace(/\(.*?\)|\[.*?\]|\{.*?\}|<.*?>|~.*?~/g, "").trim().toUpperCase();
      if (!key) continue;
      if (key.startsWith("=")) exact.set(key.slice(1), [entity, override]);
      else { prefixes.set(key, [entity, override]); maxPrefix = Math.max(maxPrefix, key.length); }
    }
  }
  if (prefixes.size < minPrefixes) throw new ProviderError("cty.dat looks incomplete");
  return {prefixes, exact, maxPrefix};
}

const SUFFIXES = new Set(["P", "M", "MM", "AM", "QRP", "A", "B", "LH", "J"]);

/** The part of a callsign that identifies the country: "SV1ABC/P" -> "SV1ABC", "F/SV1ABC" -> "F", "SV1ABC/5B" -> "5B". */
export function countryPart(call: string): string {
  const parts = call.toUpperCase().split("/");
  if (parts.length === 1) return parts[0];
  const meaningful = parts.filter(p => !SUFFIXES.has(p) && !/^\d$/.test(p));
  if (meaningful.length === 0) return parts[0];
  if (meaningful.length === 1) return meaningful[0];
  return meaningful.reduce((a, b) => (b.length < a.length ? b : a));
}

export function lookupEntity(index: CtyIndex, call: string) {
  const upper = call.toUpperCase();
  const hit = index.exact.get(upper);
  if (hit) return {match: "exact" as const, matched: upper, ...hit};
  const part = countryPart(upper);
  for (let len = Math.min(part.length, index.maxPrefix); len > 0; len--) {
    const p = index.prefixes.get(part.slice(0, len));
    if (p) return {match: "prefix" as const, matched: part.slice(0, len), ...p};
  }
  return null;
}

export function parseLotw(text: string, minEntries = 1000): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of text.split("\n")) {
    const [call, date, time] = line.trim().split(",");
    if (call && /^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) map.set(call.toUpperCase(), `${date}T${(time ?? "00:00:00").trim()}Z`);
  }
  if (map.size < minEntries) throw new ProviderError("LoTW activity list looks incomplete");
  return map;
}

export async function callsignInfo(input: {callsign: string; include_lotw: boolean}) {
  const call = input.callsign.trim().toUpperCase();
  if (!CALLSIGN.test(call)) throw new ProviderError("invalid callsign format");
  const cty = await cached("cty:index", 24 * HOUR, async () => parseCty(await fetchText(CTY_URL, {maxBytes: 2_000_000})));
  const hit = lookupEntity(cty.value, call);
  let lotw: {last_upload: string | null; source: ReturnType<typeof sourceRef>; fetched_at: string} | {error: string} | null = null;
  if (input.include_lotw) {
    try {
      const list = await cached("lotw:activity", 24 * HOUR, async () => parseLotw(await fetchText(LOTW_URL, {maxBytes: 20_000_000, timeoutMs: 15000})));
      lotw = {last_upload: list.value.get(call) ?? list.value.get(countryPart(call)) ?? null, source: sourceRef("lotw_activity"), fetched_at: list.fetched_at};
    } catch (e) {
      lotw = {error: e instanceof Error ? e.message : "LoTW list unavailable"};
    }
  }
  const entity = hit ? {...hit[0], ...hit[1]} : null;
  return {
    callsign: call,
    dxcc_entity: entity && {name: entity.name, primary_prefix: entity.primary_prefix, continent: entity.continent, cq_zone: entity.cq_zone, itu_zone: entity.itu_zone,
      approx_lat: entity.lat, approx_lon: entity.lon, utc_offset_h: entity.utc_offset_h},
    match: hit ? {kind: hit.match, matched: hit.matched} : null,
    lotw,
    note: "Country is derived from the callsign prefix (and AD1C exceptions), not from a licence database. Zones and coordinates are entity defaults. No personal data is looked up.",
    source: sourceRef("country_files"),
    fetched_at: cty.fetched_at, from_cache: cty.from_cache, cache_age_s: cty.cache_age_s,
  };
}
