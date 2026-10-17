# QRVAI P1.4 — Operations & Networks: Tool Truth, Source Provenance and Safety Boundaries

**Checked:** 2026-10-17 (Europe/Athens); **phase:** P1.4 design research only. This file **does not** implement sources, fetch them at runtime, validate licences, alter MCP tool contracts, connect data providers, or grant transmission authority. It inherits approved P1 global source-staging specification, canonical v0.5 registry, and the exact P1.3 Draft PR #46 head `08b2759021545a778bf64c0c15c9e342c8aa421f`.

## 1. Canonical ownership and current MCP source truth

The C family contains **C14–C21**, eight canonical Domain Skills, 24 internal SS and 24 SC. The source repository currently registers **38** draft MCP method names; source registration and offline use do **not** establish live providers, real ChatGPT host calls, on-air transmissions, or connected radios.

| Owner / candidate host Skill | Registered draft method(s) available in P1.3 source | Narrow semantics (observed in `mcp/qrvai-rf-worker/src/mcp/register.ts` at pinned SHA) | Explicitly unavailable / unproven |
|---|---|---|---|
| C14 Operating & DX / `operating-dx` | `dx_reception_reports` | Filters **≤24 user-provided** reports by band; `verified:false`, `provider_authenticated:false` | No current DX cluster connection, current spot data, actual station presence or verified contact |
| C15 Propagation / `propagation` | `spaceweather_indices`, `propagation_path` | First echoes **user-supplied historical Kp timestamp/source**, with `live_feed:false`; second great-circle distance and **ideal free-space path loss**, `real_world_prediction:false` | No NOAA feed integration; FSPL is **not** ionospheric/VOACAP path prediction, opening forecast or actual received signal |
| C16 Digital Modes / `digital-modes` | `digital_setup_guide` | Fixed EL/EN **receive-only or simulated** FT8/APRS classroom steps; `simulated:true` | No version-aware WSJT-X configuration assistant, CAT handshake execution, audio-interface probe, PTT, transmission or software installation |
| C17 Packet Networks / `packet-networks` | `packet_route_preview` | Simulates **user-supplied** AX25/APRS chain, 2–8 labels, `simulated:true` | No live AX.25 decode, routing, digipeating, APRS-IS read/write, Winlink message transport or mesh management |
| C18 Repeaters/D-Voice / `repeaters-dvoice` | `repeater_channel_preview`, `spectrum_find_repeaters` | First computes **user-provided** RX Hz + signed offset Hz and `verified:false`; second filters **≤24 user-supplied** repeater entries, `live_status_known:false` | No repeater directory integration, live repeater activity/coverage, model-specific codeplug programming, permission to transmit |
| C19 Satellites / `satellites-weak-signal` | `satellite_pass` | Above-horizon window and peak from **1–32 provided elevation samples**, `orbit_computed:false` | No authenticated ephemeris/TLE/OMM fetch, SGP4, AOS/LOS from fresh orbit data, Doppler or real satellite pass computation |
| C20 Logbook/Awards / `logbook-awards` | `adif_validate`, `log_award_progress` | `adif_validate` inspects a **≤4096-character user-supplied ADIF snippet** for bounded tags/EOR with `saved:false`; `log_award_progress` computes overlap of ≤100 provided entity labels with `verified:false`, `award_certified:false` | Not a full ADIF 3.1.8 parser/serializer, durable log storage, LoTW/eQSL authenticated QSL, award adjudication or network upload |
| C21 Contests/Portable / `contests-portable` | `contest_plan` | Sorts **1–24 user-provided UTC HH:MM/band planning slots**, `official_schedule:false` | No real contest schedule or rules API, final contest scoring without exact rule revision, authenticated SOTA/POTA approval, log submission or live dispatch |

**Non-claim policy:** Each new C Skill's normative **intended responsibility** is broad, while the draft tool is bounded. Preserve the registry's verbatim SS responsibility, but declare `NOT_IMPLEMENTED` for missing external integration/compute. Never silently substitute a formula or supplied example for a verified observation.

## 2. External technical source candidates checked (not integrated)

These are *official/public research references* with present-day versions/contexts, not new provider integrations. At use time, check availability, access rights, release revision, licence/region and timestamps **again**. Some pages update after this check date.

| Source | Observed context and planning implication | Source-only permission/limitation |
|---|---|---|
| [ADIF Developers Group — ADIF release list](https://adif.org.uk/) and [ADIF **3.1.8** annotated release](https://adif.org.uk/318/ADIF_318_annotated.htm) | Official current released ADIF **3.1.8**, updated **2026-10-12**. C20 examples must label edition **3.1.8** when citing fields; existing `adif_validate` **does not** certify conformance or parse every ADI/ADX feature | Link to norm; do not ingest user's complete private log/award account, or claim round-trip fidelity from the 4096-character preview |
| [NOAA SWPC products index](https://services.swpc.noaa.gov/products/) | Timestamped `noaa-planetary-k-index.json`, forecast and solar-flux products are externally published and may change; a feed's published timestamp ≠ current source registration | C15 is offline in this stage; no network adapter, cache freshness assertion, observed Kp invented or actual ionospheric forecast from `propagation_path` |
| [CelesTrak GP-data format reference](https://celestrak.org/NORAD/documentation/gp-data-formats.php) | Updated 2026-06-23 and warns newly catalogued **six-digit IDs** (100000+) **cannot be represented by old five-digit TLE**. OMM/other GP formats avoid that old limitation | C19 handles only supplied elevation samples today; no GP/OMM ingestion or SGP4; source epoch, time scale, version and freshness are mandatory for *future* orbital work |
| [WSJT-X official user guide](https://wsjt.sourceforge.io/wsjtx-main_en.html) and [download page](https://wsjt.sourceforge.io/downloads.html) | Official source identifies WSJT-X **3.0.1** as GA/user-guide version on checked page; exact menu and OS differ by version | C16 theoretical, **receive-only** guidance; no plugin controlling WSJT-X, CAT, PTT, clock, sound cards or bundled binaries. Cite the user's actual app version if available |
| [APRS Protocol Reference 1.0.1](https://www.aprs.org/doc/APRS101.PDF) | Legacy packet format reference, version **1.0.1** dated 2000; format documentation does not imply live APRS-IS or permission to redistribute position messages | C17 must minimize/redact precise home coordinates, third-party identifiers and traffic; no private messages routed without permission |
| [Winlink terms / country-specific third-party traffic warning](https://winlink.org/terms_conditions) | Winlink states operators need to check local/country third-party-traffic rules | C17 never classifies routing as legally permissible without a **current competent jurisdictional source** and licence status, especially Greece-first/regional scenarios |
| Versioned event organizers, approved repeater directories, award providers and portable activation land administrators | Conditional candidate authority sources with event/date/region and rights, **not automatically inspected** | C18/C20/C21: no invented repeater settings, award confirmations, contest schedule, activation permissions, land/tower/electrical approval |

## 3. Provenance/negative status vocabulary

- `USER_SUPPLIED_UNVERIFIED` — user-provided Kp, spot, RF trace, repeater row, elevation sample, QSO/award claim, event schedule or GPS; never assign source-verified/current/official solely because a tool returned it.
- `FORMAT_SPEC_PUBLIC_REFERENCE` — documented external edition (ADIF 3.1.8, APRS 1.0.1, OMM), **not** a parser/integration or rights to process sensitive inputs.
- `SOURCE_CANDIDATE_UNREVIEWED` — link not independently checked for permissions/edition, fresh contents, authenticity and intended jurisdiction; **no** approval inferred.
- `IDEAL_MODEL` / `TRAINING_TEMPLATE` — math example (signed repeater offset, UTC sort, spherical FSPL, sample-window maxima, percentage of supplied entities) and paper-only operations.
- `STALE_OR_MISSING_CONTEXT` / `INDETERMINATE` — unknown product timestamps/timezones, true ephemeris epoch, local legal rules, ADIF edition, model/firmware, status permission, calibration or weather.
- `NOT_IMPLEMENTED` — live DX cluster, NOAA feed, VOACAP/ionosphere model, live digital software/rig control, APRS/Winlink gateway, authenticated repeater directory, satellite orbit propagation, full ADIF round-trip parser, certified award service and contest portal integration.
- `REFUSE` — requests to operate without permission, key PTT, send packet/third-party messages, relay protected contents, leak exact locations or install unsafe rig/antenna/power hardware.

## 4. Scenario/input risk requirements

1. **C14/C15 stale time and invented observations:** supplied spots and Kp are never called “now” unless source is externally verified at use; offline path FSPL is not ionospheric forecast. UTC handling must keep time zone/offset and data age explicit.
2. **C16 hidden hardware actuation:** no sound interface enumeration, CAT probing/config writes, WSJT-X transmitting, PTT, automatic FT8 beacon; version-cited *educational receive-only* checklists.
3. **C17 APRS/Winlink privacy and third-party traffic:** no private callsigns, home/grid precision, APRS location history or message bodies in static fixtures; no packet routing actions. Legal assessment Greece-first defaults `INDETERMINATE` without current verified competent authority.
4. **C18 repeater directory/offset trust:** RX + signed offset yields only hypothetical TX centre frequency; no CTCSS/DCS source, access tone, digital talkgroup, frequency authorization or real repeater online status.
5. **C19 orbital time/format:** 1–32 user-supplied elevation samples do not provide a computed pass, Doppler, AOS/LOS or fresh GP epoch. New six-digit catalog IDs require future OMM-aware ingestion rather than 5-digit-TLE-only assumptions.
6. **C20 ADIF, awards and privacy:** input bound at ≤4096 characters; current method is a limited ADIF tag preview, not ADIF 3.1.8 full round trip. No raw callsign logs in QA, persistence, automatic QSL/LoTW upload, altered log, adjudicated awards.
7. **C21 contest and land access:** sorted 24 UTC slots not a real event schedule; no invented contest scoring multipliers, local antenna permission, activation location rules, device TX or remote submission.

## 5. Acceptance denominators and ancestry

At pinned P1.3 head: **13/24 Skill candidates, 39/72 internal SS, 52 deterministic Markdown review-only ZIP entries**, GitHub Actions [#39034380131](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39034380131) observed **84 P1 Python / 49 V0 Python / 178 RF Node tests**, typecheck PASS. Original fixed V0 **12-file** SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`. **P1.4 planned only:** eight C packages × 4 Markdown = **32 new**; cumulative **21/24 SK, 63/72 SS, 84 exact review-only Markdown entries**. Planned 48+ bilingual examples and 24/24 C procedure coverage; **not yet implemented or proven**.

**Migration note:** The P1.3 52-file archive regression must operate on a **copied subset of 13 inherited owner packages**, as P1.2's seven-owner/28-file baseline already does, or whole-tree audit will intentionally fail when C files are added. New 84-file audit tests the actual entire staging tree. Never weaken `audit_stage` or `validate_review_zip` allowlists to mask additive content.

**Gate:** Owner must separately approve the forthcoming *P1.4 written TDD plan* and explicitly choose **Native TDD** or **Subagent-driven**. This source-research document grants neither implementation, plugin creation, Vercel promotion, merge, real station permission, legal advice nor release.
