import {test, afterEach} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {json2satrec, propagate, gstime, eciToEcf, ecfToLookAngles, degreesToRadians} from "satellite.js";
import {Client, StreamableHTTPClientTransport} from "@modelcontextprotocol/client";
import {setFetcherForTests, fetchText, cached, ProviderError} from "../src/live/http.ts";
import {parseSpaceWeather, xrayClass, gScale, spaceWeatherNow} from "../src/live/spaceweather.ts";
import {findPasses, parseGp, selectTransmitters} from "../src/live/satellites.ts";
import {filterPota, buildWsprQuery, parseWspr, CALLSIGN} from "../src/live/spots.ts";
import {parseCty, lookupEntity, countryPart, parseLotw} from "../src/live/callsign.ts";
import {parseHearham, nearby, distanceKm} from "../src/live/repeaters.ts";
import {parseContestRss, parseWhen} from "../src/live/contests.ts";
import {fold, cleanPdfText, findPassages, articleOutline, parseEettDocuments, parseCeptStatus, summarizeFederalRegister, xmlToText, regulatorySources, regulationText} from "../src/live/regulations.ts";
import {INSTRUMENTS} from "../src/live/regulatory-registry.ts";
import {cableCatalog, cableLoss, CABLES} from "../src/live/cables.ts";
import {erpEirp} from "../src/rf/erp.ts";
import {LIVE_TOOLS} from "../src/live/tools.ts";
import {bandOf} from "../src/live/bands.ts";

const fx = (name: string) => JSON.parse(readFileSync(new URL("./fixtures/live/" + name, import.meta.url), "utf8"));
const json = (body: unknown) => new Response(JSON.stringify(body), {status: 200, headers: {"content-type": "application/json"}});
afterEach(() => setFetcherForTests(null));

test("fetch layer refuses hosts outside the allowlist and non-HTTPS URLs", async () => {
  setFetcherForTests(async () => { throw new Error("must not be called"); });
  await assert.rejects(fetchText("https://evil.example/x", {maxBytes: 10}), ProviderError);
  await assert.rejects(fetchText("http://services.swpc.noaa.gov/x", {maxBytes: 10}), ProviderError);
});

test("fetch layer enforces the size cap and maps HTTP errors", async () => {
  setFetcherForTests(async () => new Response("x".repeat(100)));
  await assert.rejects(fetchText("https://services.swpc.noaa.gov/a", {maxBytes: 10}), /too large/);
  setFetcherForTests(async () => new Response("no", {status: 503}));
  await assert.rejects(fetchText("https://services.swpc.noaa.gov/a", {maxBytes: 10}), /HTTP 503/);
});

test("cache shares one in-flight load and serves repeats from memory", async () => {
  setFetcherForTests(null);
  let calls = 0;
  const load = async () => { calls++; return 42; };
  const [a, b] = await Promise.all([cached("k", 60_000, load), cached("k", 60_000, load)]);
  const c = await cached("k", 60_000, load);
  assert.equal(calls, 1);
  assert.equal(a.value, 42); assert.equal(b.value, 42); assert.equal(c.from_cache, true);
});

test("fetch layer retries one connection failure but never an HTTP error", async () => {
  let calls = 0;
  setFetcherForTests(async () => { calls++; if (calls === 1) throw new TypeError("reset"); return new Response("ok"); });
  assert.equal(await fetchText("https://services.swpc.noaa.gov/a", {maxBytes: 10}), "ok");
  calls = 0;
  setFetcherForTests(async () => { calls++; return new Response("no", {status: 500}); });
  await assert.rejects(fetchText("https://services.swpc.noaa.gov/a", {maxBytes: 10}));
  assert.equal(calls, 1);
});

test("an expired cache entry covers a provider outage, but only for a while", async () => {
  setFetcherForTests(null);
  const t0 = Date.now();
  const realNow = Date.now;
  try {
    await cached("outage", 1000, async () => "first");
    Date.now = () => t0 + 2000;
    const served = await cached("outage", 1000, async () => { throw new ProviderError("down"); });
    assert.equal(served.value, "first"); assert.equal(served.from_cache, true); assert.ok(served.cache_age_s >= 2);
    Date.now = () => t0 + 10_000;
    await assert.rejects(cached("outage", 1000, async () => { throw new ProviderError("down"); }), ProviderError);
  } finally { Date.now = realNow; }
});

test("space weather: latest Kp, 24 h forecast max, latest F10.7 regardless of order, X-ray class", () => {
  const now = new Date("2026-11-15T09:00:00Z");
  const sw = parseSpaceWeather(fx("swpc-kp.json"), fx("swpc-kp-forecast.json"), fx("swpc-f107.json"), fx("swpc-xray.json"), now);
  assert.equal(sw.kp.observed_at, "2026-11-15T06:00:00Z");
  assert.equal(sw.kp.value, 0.67);
  assert.equal(sw.kp.g_scale, "G0");
  assert.ok(sw.kp_forecast_24h_max && sw.kp_forecast_24h_max.value >= 0);
  assert.equal(sw.f107?.observed_at, "2026-11-14T22:00:00Z");
  assert.equal(sw.f107?.sfu, 125);
  assert.match(sw.xray!.class, /^B\d\.\d$/);
  assert.equal(xrayClass(7.7e-7), "B7.7"); assert.equal(xrayClass(2.3e-5), "M2.3"); assert.equal(xrayClass(1.5e-4), "X1.5");
  assert.equal(gScale(5), "G1"); assert.equal(gScale(9), "G5");
});

test("space weather tool fetches only NOAA and labels its source", async () => {
  const seen: string[] = [];
  setFetcherForTests(async url => {
    seen.push(url);
    if (url.includes("k-index-forecast")) return json(fx("swpc-kp-forecast.json"));
    if (url.includes("k-index")) return json(fx("swpc-kp.json"));
    if (url.includes("f107")) return json(fx("swpc-f107.json"));
    return json(fx("swpc-xray.json"));
  });
  // The fixture's Kp is recent at the declared scenario timestamp, not at CI wall-clock time.
  // cached() stamps fetched_at using Date.now(); isolate this deterministic fixture.
  const originalNow = Date.now;
  Date.now = () => Date.parse("2026-11-15T09:00:00Z");
  try {
    const r = await spaceWeatherNow(new Date("2026-11-15T09:00:00Z"));
    assert.equal(seen.length, 4);
    assert.ok(seen.every(u => u.startsWith("https://services.swpc.noaa.gov/")));
    assert.equal(r.source.id, "noaa_swpc");
    assert.equal(r.kp_stale, false);
  } finally {
    Date.now = originalNow;
  }
});

test("satellite passes: SGP4 passes are ordered, horizon crossings accurate to a fraction of a degree", () => {
  const [iss] = parseGp(fx("celestrak-gp.json"));
  assert.equal(iss.NORAD_CAT_ID, 25544);
  const observer = {lat_deg: 37.98, lon_deg: 23.73, alt_m: 100};
  const passes = findPasses(iss, observer, new Date("2026-11-15T00:00:00Z"), 24, 10);
  assert.ok(passes.length >= 1, "ISS passes over Athens at least once a day above 10°");
  const satrec = json2satrec(iss as never);
  const el = (iso: string) => {
    const t = new Date(iso), pv = propagate(satrec, t);
    const look = ecfToLookAngles({latitude: degreesToRadians(37.98), longitude: degreesToRadians(23.73), height: 0.1}, eciToEcf(pv!.position as never, gstime(t)));
    return look.elevation * 180 / Math.PI;
  };
  for (const p of passes) {
    assert.ok(p.aos < p.tca && p.tca < p.los);
    assert.ok(p.max_elevation_deg >= 10 && p.max_elevation_deg <= 90);
    assert.ok(p.duration_s > 60 && p.duration_s < 15 * 60);
    assert.ok(Math.abs(el(p.aos)) < 0.3, "AOS is at the horizon");
    assert.ok(Math.abs(el(p.los)) < 0.3, "LOS is at the horizon");
    assert.ok(Math.abs(el(p.tca) - p.max_elevation_deg) < 0.2);
  }
});

test("satellite transmitters: only the requested satellite, active by default", () => {
  const raw = [
    {norad_cat_id: 25544, description: "Mode V FM voice", alive: true, status: "active", uplink_low: 145990000, downlink_low: 437800000, mode: "FM"},
    {norad_cat_id: 25544, description: "Old beacon", alive: false, status: "inactive", downlink_low: 145825000, mode: "AFSK"},
    {norad_cat_id: 7530, description: "Other", alive: true, status: "active", downlink_low: 145977500},
  ];
  const active = selectTransmitters(raw, 25544, false);
  assert.equal(active.length, 1);
  assert.equal(active[0].uplink_mhz, 145.99); assert.equal(active[0].downlink_mhz, 437.8);
  assert.equal(selectTransmitters(raw, 25544, true).length, 2);
});

test("POTA: band from kHz frequency, filters and newest first", () => {
  const raw = [
    {activator: "SV1AAA", frequency: "14244", mode: "SSB", reference: "GR-0001", locationDesc: "GR-I", spotTime: "2026-11-15T09:00:00"},
    {activator: "SV2BBB", frequency: "7032", mode: "CW", reference: "GR-0002", locationDesc: "GR-B", spotTime: "2026-11-15T09:05:00"},
    {activator: "K1AAA", frequency: "14062", mode: "CW", reference: "US-0001", locationDesc: "US-MA", spotTime: "2026-11-15T09:10:00"},
  ];
  const gr = filterPota(raw, {location_prefix: "GR", limit: 10});
  assert.deepEqual(gr.map(x => x.activator), ["SV2BBB", "SV1AAA"]);
  assert.equal(gr[1].band, "20m");
  assert.deepEqual(filterPota(raw, {band: "20m", mode: "cw", limit: 10}).map(x => x.activator), ["K1AAA"]);
});

test("WSPR query is built only from validated parts; injection attempts are refused", () => {
  const q = buildWsprQuery({callsign: "sv1abc", role: "tx", hours: 6, band: "20m", limit: 10});
  assert.match(q, /tx_sign = 'SV1ABC' AND band = 14 ORDER BY time DESC LIMIT 10 FORMAT JSON$/);
  for (const bad of ["SV1ABC' OR 1=1 --", "SV1ABC;DROP", "SV 1ABC", "Σ1ABC", "AAAAAAAAAAAAAAAAAAAAA"]) {
    assert.throws(() => buildWsprQuery({callsign: bad, role: "tx", hours: 6, limit: 10}), ProviderError, bad);
  }
  assert.throws(() => buildWsprQuery({callsign: "SV1ABC", role: "tx", hours: 25, limit: 10}));
  assert.ok(CALLSIGN.test("F/SV1ABC") && CALLSIGN.test("SV1ABC/P"));
});

test("WSPR parse summarizes spots", () => {
  const r = parseWspr({data: [
    {time: "2026-11-15 08:00:00", frequency: 14097100, tx_sign: "SV1ABC", tx_loc: "KM18", rx_sign: "DL1X", rx_loc: "JO62", distance: 1800, snr: -12, power: 23},
    {time: "2026-11-15 08:10:00", frequency: 14097120, tx_sign: "SV1ABC", tx_loc: "KM18", rx_sign: "W1Y", rx_loc: "FN42", distance: 7600, snr: -24, power: 23},
  ]});
  assert.equal(r.summary.count, 2); assert.equal(r.summary.max_distance_km, 7600); assert.equal(r.summary.best_snr_db, -12);
  assert.equal(r.spots[0].band, "20m"); assert.equal(r.spots[0].time, "2026-11-15T08:00:00Z");
});

const CTY = [
  "Greece:                   20:  28:  EU:   39.78:   -21.78:    -2.0:  SV:",
  "    J4,SV,SW,SX,SY,SZ,=SV0XAA;",
  "Crete:                    20:  28:  EU:   35.23:   -24.78:    -2.0:  SV9:",
  "    J49,SV9,SW9,SX9,SY9,SZ9;",
  "Cyprus:                   20:  39:  AS:   35.00:   -33.00:    -2.0:  5B:",
  "    5B,C4,H2,P3;",
  "United States:            05:  08:  NA:   37.53:    91.67:     5.0:  K:",
  "    AA,K,N,W,=KH0AA(3)[64];",
  "France:                   14:  27:  EU:   46.00:    -2.00:    -1.0:  F:",
  "    F,HW,TM;",
].join("\n");

test("cty.dat: west-positive longitudes converted, longest prefix wins, exact calls and overrides honoured", () => {
  const idx = parseCty(CTY, 1);
  const sv = lookupEntity(idx, "SV1ABC")!;
  assert.equal(sv[0].name, "Greece"); assert.equal(sv[0].lon, 21.78); assert.equal(sv[0].utc_offset_h, 2);
  assert.equal(lookupEntity(idx, "SV9ABC")![0].name, "Crete");
  assert.equal(lookupEntity(idx, "SV0XAA")!.match, "exact");
  assert.equal(lookupEntity(idx, "KH0AA")![1].cq_zone, 3);
  assert.equal(lookupEntity(idx, "W1AW")![0].lon, -91.67);
  assert.equal(lookupEntity(idx, "F/SV1ABC")![0].name, "France");
  assert.equal(lookupEntity(idx, "SV1ABC/5B")![0].name, "Cyprus");
  assert.equal(lookupEntity(idx, "SV1ABC/P")![0].name, "Greece");
  assert.equal(countryPart("SV1ABC/P"), "SV1ABC");
  assert.equal(lookupEntity(idx, "QQ1ZZZ"), null);
});

test("LoTW activity list parsing", () => {
  const m = parseLotw("SV1ABC,2026-11-01,10:20:30\nK1XX,2019-01-02,00:00:01\nbad line\n", 1);
  assert.equal(m.get("SV1ABC"), "2026-11-01T10:20:30Z");
  assert.equal(m.size, 2);
  assert.throws(() => parseLotw("SV1ABC,2026-11-01,10:20:30\n"), ProviderError);
});

test("repeaters: parse HearHam rows, distance filter and sort", () => {
  const list = parseHearham([
    {callsign: "SR1A", latitude: 37.97, longitude: 23.72, frequency: 145600000, offset: -600000, mode: "FM", encode: "88.5", operational: 1, city: "Athens"},
    {callsign: "SR1B", latitude: 38.05, longitude: 23.86, frequency: 438812500, offset: -7600000, mode: "DMR", operational: 1, city: "Penteli"},
    {callsign: "SR9C", latitude: 35.33, longitude: 25.13, frequency: 145650000, offset: -600000, mode: "FM", operational: 1, city: "Heraklion"},
    {callsign: "SR1D", latitude: 37.98, longitude: 23.73, frequency: 145750000, offset: -600000, mode: "FM", operational: 0, city: "Athens"},
    {callsign: "BAD", latitude: "x", longitude: 23, frequency: 1},
  ]);
  assert.equal(list.length, 4);
  const near = nearby(list, {lat_deg: 37.98, lon_deg: 23.73, radius_km: 50, include_non_operational: false, limit: 10});
  assert.deepEqual(near.map(r => r.callsign), ["SR1A", "SR1B"]);
  assert.equal(near[0].band, "2m"); assert.ok(Math.abs(near[0].input_mhz - 145.0) < 1e-9);
  assert.deepEqual(nearby(list, {lat_deg: 37.98, lon_deg: 23.73, radius_km: 50, band: "70cm", include_non_operational: false, limit: 10}).map(r => r.callsign), ["SR1B"]);
  assert.ok(Math.abs(distanceKm(0, 0, 0, 1) - 111.2) < 0.1);
});

test("contest calendar: parse RSS items and WA7BNM time text", () => {
  const xml = `<rss><channel><lastBuildDate>Sun, 15 Nov 2026 00:00:00 +0000</lastBuildDate>
<item><title>Test Contest A</title><link>https://www.contestcalendar.com/x?ref=1</link><description>0000Z, Nov 14 to 2359Z, Nov 15</description></item>
<item><title>Sprint &amp; Co</title><link>https://www.contestcalendar.com/x?ref=2</link><description>2330Z-0030Z, Nov 18</description></item>
<item><title>Odd</title><link>https://www.contestcalendar.com/x?ref=3</link><description>1300-1500Z, Nov 15 (40m) and 1500-1700Z, Nov 15 (80m)</description></item>
</channel></rss>`;
  const items = parseContestRss(xml);
  assert.equal(items.length, 3);
  assert.equal(items[0].start, "2026-11-14T00:00:00.000Z"); assert.equal(items[0].end, "2026-11-15T23:59:00.000Z");
  assert.equal(items[1].name, "Sprint & Co"); assert.equal(items[1].end, "2026-11-19T00:30:00.000Z");
  assert.equal(items[2].start, "2026-11-15T13:00:00.000Z"); assert.match(items[2].when_utc_text, /40m/);
  assert.deepEqual(parseWhen("See website", new Date("2026-11-15T00:00:00Z")), {start: null, end: null});
  assert.equal(parseWhen("0000Z, Jan 2 to 2359Z, Jan 3", new Date("2026-12-28T00:00:00Z")).start, "2027-01-02T00:00:00.000Z");
});

test("regulation text helpers: accent-insensitive Greek search, hyphen repair, article outline", () => {
  assert.equal(fold("Ερασιτεχνικός Σταθμός"), "ερασιτεχνικοσ σταθμοσ");
  assert.equal(cleanPdfText("ερασιτεχνι−\nκών   σταθμών"), "ερασιτεχνικών σταθμών");
  const pages = ["Άρθρο 1\nΟρισμοί\nΚείμενο...", "Άρθρο 2\nΚατηγορίες αδειών\nΟι κάτοχοι άδειας κατηγορίας 1 (άδεια CEPT) μπορούν..."];
  assert.deepEqual(articleOutline(pages), [{article: "1", title: "Ορισμοί", page: 1}, {article: "2", title: "Κατηγορίες αδειών", page: 2}]);
  const hits = findPassages(pages, "ΑΔΕΙΑ κατηγορίας", 3);
  assert.equal(hits.length, 1); assert.equal(hits[0].page, 2);
  assert.throws(() => findPassages(pages, "a b", 3), ProviderError);
});

test("EETT page parser keeps dated PDF entries newest first", () => {
  const html = `<a href="https://www.eett.gr/wp-content/uploads/2025/08/ΕΚΚΖΣ_2025.pdf">Έγκριση Εθνικού Κανονισμού Κατανομής Ζωνών Συχνοτήτων (ΕΚΚΖΣ)</a>
    <a href="https://www.eett.gr/wp-content/uploads/2026/09/AP-1.pdf"><span>Τροποποίηση</span> &amp; κάτι</a>
    <a href="https://www.eett.gr/wp-content/uploads/2026/09/AP-1.pdf">duplicate</a><a href="https://other.example/a.pdf">x</a>`;
  const docs = parseEettDocuments(html);
  assert.equal(docs.length, 2);
  assert.equal(docs[0].uploaded, "2026-09"); assert.equal(docs[0].title, "Τροποποίηση & κάτι");
  assert.throws(() => parseEettDocuments("<p>nothing</p>"), ProviderError);
});

test("CEPT status rows and change flag against the review baseline", () => {
  const html = `<table><tr><td>2024-10-18</td><td><a href="/document/925">T/R 61-01</a> T/R 61-01 of 1985 on CEPT Radio Amateur Licence</td><td>Active</td></tr>
  <tr><td>2027-03-01</td><td><a href="/document/926">T/R 61-02</a> harmonised examination</td><td>Active</td></tr></table>`;
  const [a, b] = parseCeptStatus(html, ["T/R 61-01", "T/R 61-02"]);
  assert.equal(a.found && a.latest_update, "2024-10-18"); assert.equal(a.found && a.changed_since_review, false);
  assert.equal(b.found && b.changed_since_review, true); assert.equal(b.found && b.url, "https://docdb.cept.org/document/926");
});

test("Federal Register and eCFR helpers", () => {
  const fr = summarizeFederalRegister({results: [{title: "Amateur rule", type: "Rule", publication_date: "2026-01-14", html_url: "https://www.federalregister.gov/d/1"}]});
  assert.equal(fr[0].type, "Rule");
  assert.throws(() => summarizeFederalRegister({}), ProviderError);
  assert.equal(xmlToText("<SECTION><HEAD>&#xA7; 97.1 Basis</HEAD><P>Text &amp; more</P></SECTION>"), "§ 97.1 Basis\nText & more");
});

test("regulatory registry: every Greek gazette entry and source is well-formed", () => {
  const all = regulatorySources();
  assert.ok(all.jurisdictions.some(j => j.code === "GR" && j.documents.length >= 3));
  for (const i of INSTRUMENTS) {
    assert.match(i.url, /^https:\/\//);
    if (i.gazette) assert.match(i.url, new RegExp(`/apiFEK/${i.gazette.issue === "A" ? 1 : 2}/${i.gazette.year}/${i.gazette.number}/html$`));
  }
  assert.throws(() => regulatorySources("XX"), ProviderError);
});

test("regulation_text requires exactly one target and validates EETT URLs", async () => {
  setFetcherForTests(async () => { throw new Error("no network in this test"); });
  await assert.rejects(regulationText({max_passages: 2}), /exactly one/);
  await assert.rejects(regulationText({document_id: "x", us_section: "97.1", max_passages: 2}), /exactly one/);
  await assert.rejects(regulationText({eett_pdf_url: "https://evil.example/a.pdf", max_passages: 2}), /EETT document URL/);
  await assert.rejects(regulationText({us_section: "97.301; DROP", max_passages: 2}), /97\.301/);
  await assert.rejects(regulationText({document_id: "us-47cfr97", max_passages: 2}), /us_section/);
});

test("cable catalog: datasheet tables are ordered and loss uses power-law interpolation", () => {
  assert.ok(CABLES.length >= 7);
  for (const c of CABLES) {
    const f = c.points_mhz_db100m.map(p => p[0]);
    assert.deepEqual(f, [...f].sort((a, b) => a - b));
    assert.match(c.datasheet_url, /^https:\/\/www\.ssb\.de\/media\/.+\.pdf$/);
  }
  const exact = cableLoss({cable_id: "aircell-7-heatex", frequency_mhz: 144, length_m: 20, connector_loss_db: 0.2, tx_power_w: 50});
  assert.ok(Math.abs(exact.cable_loss_db - 7.22 * 0.2) < 1e-9);
  assert.ok(Math.abs(exact.total_loss_db - (1.444 + 0.2)) < 1e-9);
  assert.ok(exact.delivered_power_w! < 50 && exact.delivered_power_w! > 30);
  const mid = cableLoss({cable_id: "ecoflex-10-plus-heatex", frequency_mhz: 70, length_m: 100, connector_loss_db: 0});
  assert.ok(mid.loss_db_per_100m > 2.66 && mid.loss_db_per_100m < 3.8);
  assert.throws(() => cableLoss({cable_id: "aircell-7-heatex", frequency_mhz: 3.6, length_m: 20, connector_loss_db: 0}), /does not extrapolate/);
  assert.throws(() => cableLoss({cable_id: "nope", frequency_mhz: 144, length_m: 1, connector_loss_db: 0}), /unknown cable_id/);
  assert.equal(cableCatalog("rg213").cables.length, 1);
  assert.equal(cableLoss({cable_id: "rg-213-u", frequency_mhz: 50, length_m: 100, connector_loss_db: 0}).cable_loss_db, 3.9);
});

test("ERP/EIRP: 100 W, 2 dB loss, 6 dBd", () => {
  const r = erpEirp({tx_power_w: 100, feedline_loss_db: 2, other_losses_db: 0, antenna_gain: 6, antenna_gain_unit: "dBd"});
  assert.ok(Math.abs(r.erp_dbm - 54) < 1e-9);
  assert.ok(Math.abs(r.eirp_dbm - 56.15) < 1e-9);
  assert.ok(Math.abs(r.erp_w - 251.18864315095797) < 1e-6);
  assert.throws(() => erpEirp({tx_power_w: -1, feedline_loss_db: 0, other_losses_db: 0, antenna_gain: 0, antenna_gain_unit: "dBi"}));
});

test("band labels", () => {
  assert.equal(bandOf(14.2), "20m"); assert.equal(bandOf(145.5), "2m"); assert.equal(bandOf(433.5), "70cm"); assert.equal(bandOf(100), null);
});

test("live tools are reachable over explicitly test-enabled in-memory MCP and handle provider errors", async () => {
  setFetcherForTests(async url => {
    if (url.startsWith("https://services.swpc.noaa.gov/")) {
      if (url.includes("k-index-forecast")) return json(fx("swpc-kp-forecast.json"));
      if (url.includes("k-index")) return json(fx("swpc-kp.json"));
      if (url.includes("f107")) return json(fx("swpc-f107.json"));
      return json(fx("swpc-xray.json"));
    }
    return new Response("down", {status: 503});
  });
  const {handleMcpRequest} = await import("../api/mcp.ts");
  const transport = new StreamableHTTPClientTransport(new URL("https://qrvai.example/api/mcp"), {fetch: (u, init) => handleMcpRequest(new Request(u, init), undefined, true)});
  const client = new Client({name: "live-test", version: "1.0.0"});
  try {
    await client.connect(transport);
    const names = (await client.listTools()).tools.map(t => t.name);
    for (const t of LIVE_TOOLS) assert.ok(names.includes(t.name), t.name);
    const sw = await client.callTool({name: "space_weather_now", arguments: {}});
    assert.notEqual(sw.isError, true);
    assert.equal((sw.structuredContent as {source: {id: string}}).source.id, "noaa_swpc");
    const down = await client.callTool({name: "pota_spots", arguments: {}});
    assert.equal(down.isError, true);
    assert.match((down.content as {text: string}[])[0].text, /^PROVIDER_UNAVAILABLE: api\.pota\.app answered HTTP 503/);
    const loss = await client.callTool({name: "cable_loss", arguments: {cable_id: "h155", frequency_mhz: 432, length_m: 10}});
    assert.ok(Math.abs((loss.structuredContent as {cable_loss_db: number}).cable_loss_db - 1.87) < 1e-9);
    const caps = await client.callTool({name: "core_capabilities", arguments: {}});
    assert.equal((caps.structuredContent as {implemented_count: number}).implemented_count, 54);
  } finally { await client.close(); }
});
