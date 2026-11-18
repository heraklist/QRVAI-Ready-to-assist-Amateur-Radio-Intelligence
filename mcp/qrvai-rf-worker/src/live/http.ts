import {ALLOWED_HOSTS} from "./sources.ts";

/** Typed failure for anything that goes wrong with an external provider. */
export class ProviderError extends Error {
  readonly code = "PROVIDER_UNAVAILABLE";
  constructor(message: string) { super(message); this.name = "ProviderError"; }
}

type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;
const realFetch: Fetcher = (url, init) => fetch(url, init);
let fetcher: Fetcher = realFetch;
const cache = new Map<string, {at: number; value: unknown}>();
const inflight = new Map<string, Promise<unknown>>();

/** Tests replace the network; passing null restores it. Always clears the cache. */
export function setFetcherForTests(f: Fetcher | null): void {
  fetcher = f ?? realFetch;
  cache.clear();
  inflight.clear();
}

export type Fetched<T> = {value: T; fetched_at: string; from_cache: boolean; cache_age_s: number};

/**
 * Memoize an expensive provider load for ttlMs; concurrent callers share one request.
 * If the provider fails, a previous value up to 4 × ttlMs old is served instead; cache_age_s shows its age.
 */
export async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<Fetched<T>> {
  const now = Date.now();
  const hit = cache.get(key);
  const fromHit = (h: {at: number; value: unknown}): Fetched<T> =>
    ({value: h.value as T, fetched_at: new Date(h.at).toISOString(), from_cache: true, cache_age_s: Math.round((Date.now() - h.at) / 1000)});
  if (hit && now - hit.at < ttlMs) return fromHit(hit);
  let pending = inflight.get(key) as Promise<T> | undefined;
  if (!pending) {
    pending = load().finally(() => inflight.delete(key));
    inflight.set(key, pending);
  }
  let value: T;
  try {
    value = await pending;
  } catch (error) {
    if (hit && error instanceof ProviderError && now - hit.at < 4 * ttlMs) return fromHit(hit);
    throw error;
  }
  const at = Date.now();
  cache.set(key, {at, value});
  return {value, fetched_at: new Date(at).toISOString(), from_cache: false, cache_age_s: 0};
}

export type FetchOptions = {maxBytes: number; timeoutMs?: number; headers?: Record<string, string>};

/** GET an allowlisted HTTPS URL with a timeout and a hard size cap. */
export async function fetchBytes(url: string, options: FetchOptions): Promise<{bytes: Uint8Array; status: number; headers: Headers}> {
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new ProviderError("invalid provider URL"); }
  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new ProviderError("provider host is not on the QRVAI allowlist");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 8000);
  try {
    let response: Response | undefined;
    // One retry for connection-level failures only; an HTTP error answer is never retried.
    for (let attempt = 0; attempt < 2 && !response; attempt++) {
      try {
        response = await fetcher(url, {
          method: "GET",
          redirect: "error",
          signal: controller.signal,
          headers: {"user-agent": "QRVAI/1.0", ...options.headers},
        });
      } catch {
        if (attempt === 1 || controller.signal.aborted) throw new ProviderError(`${parsed.hostname} did not respond`);
      }
    }
    if (!response) throw new ProviderError(`${parsed.hostname} did not respond`);
    if (!response.ok) throw new ProviderError(`${parsed.hostname} answered HTTP ${response.status}`);
    const declared = Number(response.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > options.maxBytes) throw new ProviderError("provider response too large");
    if (!response.body) return {bytes: new Uint8Array(), status: response.status, headers: response.headers};
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > options.maxBytes) {
          await reader.cancel().catch(() => {});
          throw new ProviderError("provider response too large");
        }
        chunks.push(value);
      }
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      throw new ProviderError(`${parsed.hostname} response was interrupted`);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return {bytes, status: response.status, headers: response.headers};
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchText(url: string, options: FetchOptions): Promise<string> {
  const {bytes} = await fetchBytes(url, options);
  return new TextDecoder("utf-8").decode(bytes);
}

export async function fetchJson(url: string, options: FetchOptions): Promise<unknown> {
  const text = await fetchText(url, {...options, headers: {accept: "application/json", ...options.headers}});
  try { return JSON.parse(text); } catch { throw new ProviderError("provider returned invalid JSON"); }
}

export const HOUR = 3_600_000;
export const MINUTE = 60_000;
