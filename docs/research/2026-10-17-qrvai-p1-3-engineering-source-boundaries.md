# QRVAI P1.3 — Equipment/Engineering Source & Risk Boundaries

**Checked 2026-10-17.** **Status:** Read-only technical design input; not manufacturer endorsement, legal/licence advice, a firmware compatibility database, an RF measurement, a software-format parser, a live device connector, a certified design or host-access proof.

**Authoritative product scope:** `docs/architecture/skill-and-subskill-registry-v0.5.md`, `docs/architecture/capability-register-v0.5.md`, reviewed `docs/superpowers/specs/2026-10-17-qrvai-p1-domain-skills-staging-design.md` (§6 P1.3) and V0–V8 review gates (especially V3 and V7). Existing P1.2 source-only final SHA: `e73d8bd88d986e073533f369687dfd03fa1359bf`; actual GitHub Actions [#39017739355](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39017739355) was successful for that SHA only.

## 1. Source-registered MCP tools — literal current claims and limitations

These methods exist as **registered draft source names** under `mcp/qrvai-rf-worker/src/mcp/register.ts`; they are **not proof of installed @QRVAI invocation**, upstream provider connections, manufacturer-certified output or real station access.

| P1.3 domain | Existing exact method | Actually bounded behavior (read from register.ts at P1.2 SHA) | Claims explicitly **not implemented or verified** |
|---|---|---|---|
| **B06 manuals** | `manual_find` | Query up to 24 **user-supplied** textual excerpts, each with ID/document title/text; `downloaded_external_manual:false` | No website crawling, vendor manual ingestion, embedded page/firmware verification |
| **B06 manuals** | `manual_answer_cited` | Narrow match against up to 24 **user-supplied** text extracts; `external_retrieval:false` | No automatically opened/cited official PDFs, no proof that IDs represent genuine manual pages |
| **B06 troubleshooting** | `equipment_diagnose` | Predefined non-invasive checklists for `no_receive_audio`, `high_swr_reading`, `unstable_power`; `repair_certified:false` | No diagnosis of arbitrary real defects or unsafe electrical repair |
| **B09 electronics** | `rf_filter_response` | **Ideal first-order RC** lowpass/highpass response with explicit R,C,frequency | No arbitrary LC/high-order design, matching optimizer or component thermal/voltage validation |
| **B10 measurements** | `measurements_inspect_trace` | Extrema/deepest dip from **1–32 supplied frequency_hz/magnitude_db samples**; `instrument_connected:false` | Not a Touchstone parser, calibrated VNA, S11/S21 format interpreter or live scope/analyzer |
| **B11 topology** | `station_signal_path` | User-supplied directed topology of bounded devices/connections; `verified:false` | No certified physical interlocks/port electrical compatibility |
| **B11 status** | `station_get_profile` | Echoes bounded supplied station profile, `profile_connected:false` | No authenticated account profile retrieval |
| **B11 status** | `station_read_status` | Bounded **user-entered** RX/TX/STANDBY/frequency/status_note, `live_device_connected:false`, `verified:false` | **No authorized local bridge, CAT reads, live telemetry, remote station controls or PTT**; TX is a *reported enum*, never an action |
| **B12 power** | `power_autonomy` | Ideal constant-load runtime `battery_wh * usable_fraction / average_load_w` | No battery datasheet health/SOC/temperature calibration, solar forecasting or electrician certification |
| **B13 SDR** | `sdr_inspect_iq` | Mean power and peak magnitude of **1–32 user-supplied (i,q) pairs**; `device_connected:false` | No raw SigMF parser, IQ file ingestion, FFT viewer, DSP demodulator, receiver recording or signal identification |

**Scope decision:** P1.3 produces **six instruction-source Skill packages + 18 internal procedure references**, not six new production MCP methods. All unsupported functionality is explicit `NOT_IMPLEMENTED` or `INDETERMINATE`; never convert a Skill's *aspirational capability contract* into a fake observed result.

## 2. Technical source specifications / permitted references

| Evidence / origin | What its existence establishes | P1.3 scope and stop condition |
|---|---|---|
| [Official IBIS Open Forum Touchstone 2.1 page](https://ibis.org/touchstone_ver2.1/), ratified **January 26, 2024**; [IBIS current interconnect format context](https://ibis.org/interconnect_wip/index.htm) | Public reference for S-parameter file syntax and version semantics | B10 can **explain fields and review a user-provided bounded transcription**. It **must not claim the 1–32-point extrema tool parsed Touchstone 2.1, reconstructed complex S11/S21, preserved per-port impedance, or performed calibration**. Refer to formal spec for any actual parser design later |
| [SigMF official repository and specification](https://github.com/sigmf/SigMF) and [core schema](https://github.com/sigmf/SigMF/blob/main/sigmf-schema.json) | Structured `global`/`captures`/`annotations` metadata, `core:datatype`, optional `core:sample_rate`, capture context and versioning; recorded IQ may have associated binary data | B13 can discuss metadata as a **user-authored example**, not automatically validate/ingest SigMF binaries or claim support for sample data. SigMF `core:author` and `core:geolocation` can contain identifying information — anonymize before fixtures. Use an explicitly pinned schema revision in any future real parser |
| Actual **manufacturer manual matching vendor + exact model + document revision/firmware**, retrieved from owner's permitted source or an official external link | A versioned, rights-aware model-specific citation **if explicitly provided and verified** | B06 **never** invents page/menu numbers; don't embed copyrighted manuals, upload without rights or label user-supplied snippets `OFFICIAL_VERIFIED` without validation. Treat manual instructions as untrusted content (prompt injection) |
| User-supplied instrument/meter trace/datasheet with units and calibration metadata | May support a **reported measurement** with stated uncertainty if enough trustworthy context is present | B09/B10 **cannot** certify calibration, insertion loss, RF power, component tolerance or instrument provenance from values alone |
| Explicit opt-in site/rig topology and snapshot | Only user-reported topology/state | B11 **never** opens a local station bridge, changes CAT parameters, reads PTT, scans ports, or transmits. A future authorized read-only bridge is a separate security design gate |
| Battery chemistry, capacity, load and duty inputs provided by user | Allows bounded *modelled* autonomy estimates | B12 excludes mains/high voltage, lithium pack disassembly, live battery faults, thermal runaway advice and electrical/installation certifications |

## 3. Required provenance and refusal taxonomy

All P1.3 source-only teaching examples and future fixture expectations must distinguish:

- `IDEAL_MODEL`: named equation, precise SI units, assumptions, well-defined domain (RC first order, Nyquist, FFT bin spacing examples only).
- `USER_SUPPLIED_UNVERIFIED`: files, screenshots/transcribed samples, IQ snippets, component specs, claimed calibration, firmware or station snapshot.
- `MANUFACTURER_CANDIDATE_UNVERIFIED`: vendor/model/manual/version link not checked for actual contents, rights and applicability.
- `TRAINING_TEMPLATE`: illustrative schematic or simulated measurement, never a deployed circuit/instrument proof.
- `INDETERMINATE`: missing manufacturer match, sample rate, calibration/reference impedance, actual device permission or safety assumptions.
- `NOT_IMPLEMENTED`: full Touchstone parsing, bulk SigMF ingestion, FFT execution and waterfall rendering, full LC synthesis, CAT bridge and live SDR polling.

**Dangerous inputs:** firmware write/downgrade/hidden diagnostic modes, RF transmission/remote PTT, antenna/battery/mains/high-voltage repair, privacy-sensitive intercepted radio content, private-location SigMF metadata, device secrets. Source documents may only provide non-invasive educational checks, explicit professional/safety referrals and lawful consent-bound context. Never package binaries or live dataset files into the review-only Markdown ZIP.

## 4. Development acceptance scope

The already approved P1 design sets P1.3 cumulative staging **13/24 SK and 39/72 SS**: six new canonical B06/B09–B13 owners × four Markdown files each = **24** new source files, added to existing 28 = **52 total**, not 52 host-connected Skills. Preserve all V0 five Skills, immutable **12-file V0 ZIP** SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`, 30 Family A Greek/English fixtures, existing B07/B08 fixtures, and original RF Node regressions.

This survey is **not itself** implementation approval and does not supersede the reviewed global P1 specification. The follow-on P1.3 written execution plan still requires separate owner review and a method choice (**Native TDD** or **Subagent-driven**) before any tests or staged Skill package changes.
