import {cached, fetchJson, ProviderError, HOUR} from "./http.ts";
import {sourceRef} from "./sources.ts";
import {bandOf} from "./bands.ts";

const HEARHAM_URL = "https://hearham.com/api/repeaters/v1";
type Row = Record<string, unknown>;

export type Repeater = {
  callsign: string; frequency_mhz: number; offset_mhz: number; input_mhz: number; band: string | null; mode: string;
  tone_encode: string | null; tone_decode: string | null; city: string; network: string | null; node: string | null;
  lat: number; lon: number; operational: boolean; restriction: string | null;
};

export function parseHearham(raw: unknown): Repeater[] {
  if (!Array.isArray(raw)) throw new ProviderError("unexpected HearHam format");
  const out: Repeater[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const x = r as Row;
    const f = Number(x.frequency), off = Number(x.offset), lat = Number(x.latitude), lon = Number(x.longitude);
    if (!Number.isFinite(f) || f <= 0 || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const text = (v: unknown, max = 80) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
    out.push({
      callsign: text(x.callsign, 16) ?? "?", frequency_mhz: f / 1e6, offset_mhz: Number.isFinite(off) ? off / 1e6 : 0,
      input_mhz: (f + (Number.isFinite(off) ? off : 0)) / 1e6, band: bandOf(f / 1e6), mode: text(x.mode, 16) ?? "?",
      tone_encode: text(x.encode, 16), tone_decode: text(x.decode, 16), city: text(x.city, 100) ?? "", network: text(x.group, 24),
      node: text(x.internet_node, 24), lat, lon, operational: Number(x.operational) === 1, restriction: text(x.restriction, 60),
    });
  }
  return out;
}

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = Math.PI / 180, dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
}
export function bearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = Math.PI / 180, y = Math.sin((lon2 - lon1) * r) * Math.cos(lat2 * r);
  const x = Math.cos(lat1 * r) * Math.sin(lat2 * r) - Math.sin(lat1 * r) * Math.cos(lat2 * r) * Math.cos((lon2 - lon1) * r);
  return (Math.atan2(y, x) / r + 360) % 360;
}

export function nearby(list: Repeater[], f: {lat_deg: number; lon_deg: number; radius_km: number; band?: string; mode?: string; include_non_operational: boolean; limit: number}) {
  const mode = f.mode?.toUpperCase();
  return list
    .filter(r => (f.include_non_operational || r.operational) && (!f.band || r.band === f.band) && (!mode || r.mode.toUpperCase().includes(mode)))
    .map(r => ({...r, distance_km: Math.round(distanceKm(f.lat_deg, f.lon_deg, r.lat, r.lon) * 10) / 10, bearing_deg: Math.round(bearingDeg(f.lat_deg, f.lon_deg, r.lat, r.lon))}))
    .filter(r => r.distance_km <= f.radius_km)
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, f.limit);
}

export async function repeatersNear(f: {lat_deg: number; lon_deg: number; radius_km: number; band?: string; mode?: string; include_non_operational: boolean; limit: number}) {
  const list = await cached("hearham:all", 12 * HOUR, async () => parseHearham(await fetchJson(HEARHAM_URL, {maxBytes: 30_000_000, timeoutMs: 15000})));
  const repeaters = nearby(list.value, f);
  return {
    repeaters, count: repeaters.length,
    note: "Community-maintained list with approximate locations. Confirm frequency, tone and status with the repeater owner or national society before use; listing is not permission to transmit.",
    source: sourceRef("hearham"), fetched_at: list.fetched_at, from_cache: list.from_cache, cache_age_s: list.cache_age_s,
  };
}
