import {cached, fetchJson, ProviderError, MINUTE} from "./http.ts";
import {sourceRef} from "./sources.ts";

const BASE = "https://services.swpc.noaa.gov";
const URLS = {
  kp: BASE + "/products/noaa-planetary-k-index.json",
  kpForecast: BASE + "/products/noaa-planetary-k-index-forecast.json",
  f107: BASE + "/json/f107_cm_flux.json",
  xray: BASE + "/json/goes/primary/xrays-1-day.json",
} as const;

type Row = Record<string, unknown>;
const rows = (v: unknown): Row[] => {
  if (!Array.isArray(v)) throw new ProviderError("unexpected SWPC format");
  return v.filter((r): r is Row => r !== null && typeof r === "object" && !Array.isArray(r));
};
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown): string | null => (typeof v === "string" && v.length <= 40 ? v : null);
const iso = (tag: string) => (tag.endsWith("Z") ? tag : tag + "Z");

export function gScale(kp: number): string {
  if (kp >= 9) return "G5";
  if (kp >= 8) return "G4";
  if (kp >= 7) return "G3";
  if (kp >= 6) return "G2";
  if (kp >= 5) return "G1";
  return "G0";
}

/** GOES 0.1-0.8 nm flux (W/m²) to the conventional flare class, e.g. 7.7e-7 -> B7.7. */
export function xrayClass(flux: number): string {
  if (!(flux > 0) || !Number.isFinite(flux)) return "unknown";
  const bands: [string, number][] = [["X", 1e-4], ["M", 1e-5], ["C", 1e-6], ["B", 1e-7], ["A", 1e-8]];
  for (const [letter, base] of bands) {
    if (flux >= base) return letter + (flux / base).toFixed(1);
  }
  return "A" + (flux / 1e-8).toFixed(1);
}

export type SpaceWeather = {
  kp: {value: number; observed_at: string; g_scale: string};
  kp_forecast_24h_max: {value: number; g_scale: string; until: string} | null;
  f107: {sfu: number; observed_at: string; schedule: string | null} | null;
  xray: {flux_w_m2: number; class: string; observed_at: string} | null;
};

export function parseSpaceWeather(kpRaw: unknown, forecastRaw: unknown, f107Raw: unknown, xrayRaw: unknown, now: Date): SpaceWeather {
  const kpRows = rows(kpRaw).filter(r => num(r.Kp) !== null && str(r.time_tag));
  const lastKp = kpRows.sort((a, b) => String(a.time_tag).localeCompare(String(b.time_tag))).at(-1);
  if (!lastKp) throw new ProviderError("SWPC returned no Kp observations");
  const kpValue = num(lastKp.Kp)!;

  const horizon = now.getTime() + 24 * 3_600_000;
  const predicted = rows(forecastRaw).filter(r => r.observed === "predicted" && num(r.kp) !== null && str(r.time_tag))
    .filter(r => { const t = Date.parse(iso(String(r.time_tag))); return t >= now.getTime() - 3 * 3_600_000 && t <= horizon; });
  const forecastMax = predicted.reduce<Row | null>((best, r) => (!best || num(r.kp)! > num(best.kp)! ? r : best), null);

  const fluxRows = rows(f107Raw).filter(r => num(r.flux) !== null && str(r.time_tag))
    .sort((a, b) => String(a.time_tag).localeCompare(String(b.time_tag)));
  const lastFlux = fluxRows.at(-1);

  const longBand = rows(xrayRaw).filter(r => r.energy === "0.1-0.8nm" && num(r.flux) !== null && str(r.time_tag))
    .sort((a, b) => String(a.time_tag).localeCompare(String(b.time_tag)));
  const lastXray = longBand.at(-1);

  return {
    kp: {value: kpValue, observed_at: iso(String(lastKp.time_tag)), g_scale: gScale(kpValue)},
    kp_forecast_24h_max: forecastMax ? {value: num(forecastMax.kp)!, g_scale: gScale(num(forecastMax.kp)!), until: new Date(horizon).toISOString()} : null,
    f107: lastFlux ? {sfu: num(lastFlux.flux)!, observed_at: iso(String(lastFlux.time_tag)), schedule: str(lastFlux.reporting_schedule)} : null,
    xray: lastXray ? {flux_w_m2: num(lastXray.flux)!, class: xrayClass(num(lastXray.flux)!), observed_at: iso(String(lastXray.time_tag))} : null,
  };
}

const INTERPRETATION =
  "Kp 0-2 quiet, 3-4 unsettled/active, 5+ geomagnetic storm (NOAA G-scale): high-latitude HF paths degrade first. " +
  "Higher 10.7 cm flux (SFI) generally supports higher usable HF frequencies. M/X-class X-ray flares can cause sunlit-side HF fade-outs. " +
  "These are indicators, not a propagation forecast for a specific path.";

export async function spaceWeatherNow(now = new Date()) {
  const opts = {maxBytes: 2_000_000};
  const result = await cached("swpc:summary", 10 * MINUTE, async () => {
    const [kp, kpf, f107, xray] = await Promise.all([
      fetchJson(URLS.kp, opts), fetchJson(URLS.kpForecast, opts), fetchJson(URLS.f107, opts), fetchJson(URLS.xray, opts),
    ]);
    return parseSpaceWeather(kp, kpf, f107, xray, now);
  });
  const ageMinutes = (Date.parse(result.fetched_at) - Date.parse(result.value.kp.observed_at)) / 60_000;
  return {
    ...result.value,
    kp_stale: ageMinutes > 6 * 60,
    interpretation: INTERPRETATION,
    source: sourceRef("noaa_swpc"),
    source_urls: Object.values(URLS),
    fetched_at: result.fetched_at,
    from_cache: result.from_cache,
    cache_age_s: result.cache_age_s,
  };
}
