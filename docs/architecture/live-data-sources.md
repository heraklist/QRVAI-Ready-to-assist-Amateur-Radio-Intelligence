# QRVAI live data and legal sources

**Status (2026-11-15):** implemented in `mcp/qrvai-rf-worker/src/live/`, unit-tested with fixtures, and checked against every real provider with `npm run smoke:live` (15/15 passed on 2026-11-15). Not yet deployed to a public endpoint.

## How live calls work

- Only hosts listed in `src/live/sources.ts` can be fetched (HTTPS only, no redirects, size cap, 8–20 s timeout, one retry on connection failure).
- Results are cached in the function's memory per provider (1 minute for spots, up to 7 days for gazette PDFs). If a provider is down, a cached value up to four times its normal lifetime is served, and `cache_age_s` shows its age.
- Every result carries `source`, `fetched_at`, `from_cache` and `cache_age_s`. A provider failure returns `PROVIDER_UNAVAILABLE: …`, never invented data.

## Providers

| Tool | Provider | Terms checked |
|---|---|---|
| `space_weather_now` | NOAA SWPC JSON feeds | US government public data |
| `satellite_passes` | CelesTrak GP elements (amateur group) + satellite.js SGP4 | Cached 6 h, per CelesTrak's request not to re-download faster than updates |
| `satellite_transmitters` | SatNOGS DB | Community database |
| `pota_spots` | api.pota.app | Public spot feed |
| `wspr_spots` | wspr.live (ClickHouse) | Public read-only queries; QRVAI only sends one fixed query template with a validated callsign |
| `callsign_info` | AD1C cty.dat; ARRL LoTW user-activity list | Public files; no personal data |
| `repeaters_near` | HearHam JSON API | "Free to use in your application" per HearHam |
| `contest_calendar` | WA7BNM Contest Calendar RSS | Published feed; titles, times and links only, with attribution |

## Legal sources

| Jurisdiction | Live text | Live change check |
|---|---|---|
| Greece | Any ΦΕΚ via the National Printing Office API (`api.et.gr`, 100 requests/min/IP); EETT PDFs such as the ΕΚΚΖΣ allocation table | New documents on EETT's spectrum legal-framework page; availability of the tracked ΦΕΚ |
| CEPT | — (links to docdb) | Status and update date of T/R 61-01 and T/R 61-02 |
| United States | Any 47 CFR §97 section from eCFR | Latest Part 97 amendment (eCFR) and newest Federal Register documents |
| Germany, UK, IARU R1 | Links only | — |

Tracked Greek instruments (verified by downloading the gazette on 2026-11-15): Υ.Α. 38200/1136/2011 (ΦΕΚ Β' 1969/2011), its amendment Υ.Α. 10800/310/2013 (ΦΕΚ Β' 648/2013), and the ΕΚΚΖΣ 2025.

**Known limit:** the Greek gazette API retrieves a ΦΕΚ by number but cannot search. A new ministerial amendment is detected only once EETT lists it; the tool says so and points to search.et.gr.

### Refreshing the review baseline

`src/live/regulatory-registry.ts` holds `REVIEW` (date, latest EETT upload month, CEPT dates, latest Part 97 amendment). When `regulation_changes` reports something new, read the new document, add it to `INSTRUMENTS` if it concerns amateur radio, and move the baseline forward.

## Deliberately not included

| Source | Reason |
|---|---|
| SOTA API | Its terms forbid AI-built clients and require API-consumer group membership. |
| HamQSL band conditions | Third-party computed values with banner-specific permissions; QRVAI uses the NOAA data directly. |
| Ofcom, Times Microwave, opengov.gr | Refuse automated access (HTTP 403); linked for manual checking only. |
| LoTW logs, eQSL, Club Log, QRZ | Need the user's own credentials. They wait for the authentication phase so that no password ever passes through a public endpoint or a chat. |
