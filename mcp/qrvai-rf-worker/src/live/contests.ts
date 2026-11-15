import {cached, fetchText, ProviderError, HOUR} from "./http.ts";
import {sourceRef} from "./sources.ts";

const RSS_URL = "https://www.contestcalendar.com/calendar.rss";
const MONTHS: Record<string, number> = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};

const decode = (s: string) => s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
const tag = (item: string, name: string) => { const m = item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`)); return m ? decode(m[1]) : null; };

/** Pick a year for "Nov 14" so the date lands within a few months of the feed's build date. */
function at(hhmm: string, mon: string, day: string, ref: Date): Date | null {
  const m = MONTHS[mon];
  if (m === undefined) return null;
  const h = Number(hhmm.slice(0, 2)), mi = Number(hhmm.slice(2, 4));
  if (h > 24 || mi > 59) return null;
  let best: Date | null = null;
  for (const y of [ref.getUTCFullYear() - 1, ref.getUTCFullYear(), ref.getUTCFullYear() + 1]) {
    const d = new Date(Date.UTC(y, m, Number(day), h, mi));
    if (!best || Math.abs(d.getTime() - ref.getTime()) < Math.abs(best.getTime() - ref.getTime())) best = d;
  }
  return best;
}

/** Parse WA7BNM time text. Only the first period is converted; the original text is always kept. */
export function parseWhen(text: string, ref: Date): {start: string | null; end: string | null} {
  let m = text.match(/^(\d{4})Z?,\s*([A-Z][a-z]{2})\s+(\d{1,2})\s+to\s+(\d{4})Z?,\s*([A-Z][a-z]{2})\s+(\d{1,2})/);
  if (m) {
    const s = at(m[1], m[2], m[3], ref), e = at(m[4], m[5], m[6], ref);
    return {start: s?.toISOString() ?? null, end: e?.toISOString() ?? null};
  }
  m = text.match(/^(\d{4})Z?-(\d{4})Z?,\s*([A-Z][a-z]{2})\s+(\d{1,2})/);
  if (m) {
    const s = at(m[1], m[3], m[4], ref);
    let e = at(m[2], m[3], m[4], ref);
    if (s && e && e <= s) e = new Date(e.getTime() + 86_400_000);
    return {start: s?.toISOString() ?? null, end: e?.toISOString() ?? null};
  }
  return {start: null, end: null};
}

export function parseContestRss(xml: string) {
  if (!xml.includes("<rss")) throw new ProviderError("unexpected contest calendar format");
  const built = tag(xml, "lastBuildDate");
  const ref = built && Number.isFinite(Date.parse(built)) ? new Date(Date.parse(built)) : new Date();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  return items.map(item => {
    const when = tag(item, "description") ?? "";
    return {name: (tag(item, "title") ?? "").slice(0, 160), when_utc_text: when.slice(0, 300), ...parseWhen(when, ref), details_url: tag(item, "link")};
  }).filter(c => c.name);
}

export async function contestCalendar(f: {query?: string; days: number}, now = new Date()) {
  const feed = await cached("wa7bnm:rss", 6 * HOUR, async () => parseContestRss(await fetchText(RSS_URL, {maxBytes: 1_000_000})));
  const q = f.query?.toLowerCase();
  const until = now.getTime() + f.days * 86_400_000;
  const contests = feed.value
    .filter(c => !q || c.name.toLowerCase().includes(q))
    .filter(c => !c.start || (Date.parse(c.end ?? c.start) >= now.getTime() && Date.parse(c.start) <= until));
  return {
    contests, count: contests.length,
    note: "Times are UTC as published. Always read the official rules at the contest sponsor before operating; the feed covers roughly the coming week.",
    source: sourceRef("wa7bnm_contests"), fetched_at: feed.fetched_at, from_cache: feed.from_cache, cache_age_s: feed.cache_age_s,
  };
}
