import {cached, fetchJson, ProviderError, MINUTE} from "./http.ts";
import {sourceRef} from "./sources.ts";
import {bandOf, bandRange} from "./bands.ts";

const POTA_URL = "https://api.pota.app/spot/activator";

type Row = Record<string, unknown>;
const s = (v: unknown, max = 120) => (typeof v === "string" ? v.slice(0, max) : null);
const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export function filterPota(raw: unknown, f: {band?: string; mode?: string; reference_prefix?: string; location_prefix?: string; limit: number}) {
  if (!Array.isArray(raw)) throw new ProviderError("unexpected POTA format");
  const mode = f.mode?.toUpperCase(), ref = f.reference_prefix?.toUpperCase(), loc = f.location_prefix?.toUpperCase();
  return raw.filter((r): r is Row => r !== null && typeof r === "object")
    .map(r => {
      const khz = Number(r.frequency);
      const mhzValue = Number.isFinite(khz) ? khz / 1000 : null;
      return {
        activator: s(r.activator, 20), frequency_mhz: mhzValue, band: mhzValue === null ? null : bandOf(mhzValue),
        mode: s(r.mode, 12), reference: s(r.reference, 20), park_name: s(r.name), location: s(r.locationDesc, 40),
        grid: s(r.grid6, 8) ?? s(r.grid4, 6), spotted_at: typeof r.spotTime === "string" ? r.spotTime + "Z" : null,
        spotter: s(r.spotter, 20), comments: s(r.comments, 160),
      };
    })
    .filter(x => (!f.band || x.band === f.band) && (!mode || x.mode?.toUpperCase() === mode) &&
      (!ref || x.reference?.toUpperCase().startsWith(ref)) && (!loc || (x.location ?? "").toUpperCase().split(",").some(p => p.trim().startsWith(loc))))
    .sort((a, b) => String(b.spotted_at).localeCompare(String(a.spotted_at)))
    .slice(0, f.limit);
}

export async function potaSpots(f: {band?: string; mode?: string; reference_prefix?: string; location_prefix?: string; limit: number}) {
  const feed = await cached("pota:activator", 1 * MINUTE, async () => fetchJson(POTA_URL, {maxBytes: 3_000_000}));
  const spots = filterPota(feed.value, f);
  return {spots, count: spots.length, note: "User-reported spots; an activator may already be off the air.", source: sourceRef("pota"),
    fetched_at: feed.fetched_at, from_cache: feed.from_cache, cache_age_s: feed.cache_age_s};
}

/** Strict callsign shape: the value is placed inside a SQL string literal, so only these characters may pass. */
export const CALLSIGN = /^[A-Z0-9]{1,4}(?:\/[A-Z0-9]{1,8}){0,2}$|^[A-Z0-9]{3,10}(?:\/[A-Z0-9]{1,4})?$/;

const WSPR_BAND_CODE: Record<string, number> = {"2200m": -1, "630m": 0, "160m": 1, "80m": 3, "60m": 5, "40m": 7, "30m": 10, "20m": 14, "17m": 18, "15m": 21, "12m": 24, "10m": 28, "6m": 50, "4m": 70, "2m": 144};

export function buildWsprQuery(f: {callsign: string; role: "tx" | "rx"; hours: number; band?: string; limit: number}): string {
  const call = f.callsign.toUpperCase();
  if (!CALLSIGN.test(call)) throw new ProviderError("invalid callsign format");
  if (!Number.isInteger(f.hours) || f.hours < 1 || f.hours > 24) throw new ProviderError("hours must be 1..24");
  if (!Number.isInteger(f.limit) || f.limit < 1 || f.limit > 50) throw new ProviderError("limit must be 1..50");
  const column = f.role === "tx" ? "tx_sign" : "rx_sign";
  let band = "";
  if (f.band !== undefined) {
    const code = WSPR_BAND_CODE[f.band];
    if (code === undefined) throw new ProviderError("band not used by WSPR");
    band = ` AND band = ${code}`;
  }
  return `SELECT time, band, tx_sign, tx_loc, rx_sign, rx_loc, distance, snr, power, frequency FROM wspr.rx ` +
    `WHERE time > now() - INTERVAL ${f.hours} HOUR AND ${column} = '${call}'${band} ORDER BY time DESC LIMIT ${f.limit} FORMAT JSON`;
}

export function parseWspr(raw: unknown) {
  const data = raw && typeof raw === "object" ? (raw as {data?: unknown}).data : null;
  if (!Array.isArray(data)) throw new ProviderError("unexpected wspr.live format");
  const spots = data.filter((r): r is Row => r !== null && typeof r === "object").map(r => {
    const hz = Number(r.frequency);
    return {
      time: typeof r.time === "string" ? r.time.replace(" ", "T") + "Z" : null,
      frequency_mhz: Number.isFinite(hz) ? Math.round(hz) / 1e6 : null,
      band: Number.isFinite(hz) ? bandOf(hz / 1e6) : null,
      tx_sign: s(r.tx_sign, 20), tx_locator: s(r.tx_loc, 8), rx_sign: s(r.rx_sign, 20), rx_locator: s(r.rx_loc, 8),
      distance_km: n(Number(r.distance)), snr_db: n(Number(r.snr)), power_dbm: n(Number(r.power)),
    };
  });
  const distances = spots.map(x => x.distance_km ?? 0), snrs = spots.map(x => x.snr_db).filter((x): x is number => x !== null);
  return {
    spots,
    summary: {
      count: spots.length,
      max_distance_km: spots.length ? Math.max(...distances) : null,
      best_snr_db: snrs.length ? Math.max(...snrs) : null,
      unique_counterparts: new Set(spots.map(x => x.tx_sign + "|" + x.rx_sign)).size,
    },
  };
}

export async function wsprSpots(f: {callsign: string; role: "tx" | "rx"; hours: number; band?: string; limit: number}) {
  const query = buildWsprQuery(f);
  const key = "wspr:" + query;
  const res = await cached(key, 2 * MINUTE, async () =>
    fetchJson("https://db1.wspr.live/?query=" + encodeURIComponent(query), {maxBytes: 1_000_000, timeoutMs: 10000}));
  return {...parseWspr(res.value), callsign: f.callsign.toUpperCase(), role: f.role, hours: f.hours,
    note: "Reception reports from the WSPR network; absence of spots is not proof that a signal was not heard.",
    source: sourceRef("wspr_live"), fetched_at: res.fetched_at, from_cache: res.from_cache, cache_age_s: res.cache_age_s};
}

export {bandRange};
