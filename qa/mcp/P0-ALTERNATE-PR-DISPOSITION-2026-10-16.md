# QRVAI P0 — Alternative PR Disposition Ledger

**Prepared:** 2026-10-17 · **Status:** DRAFT/P0 engineering evidence, not owner merge authorization.  
**Parent baseline:** PR #37, `e094dc8d73b57ed6bc7ab09d2c0ebe2100129557` (cumulative PR #36 source `73feb5789d7830b4d47ea6100a971d864db8fb28`).  
**Owner approval:** Native TDD on isolated Draft implementation branch only, 2026-10-17.  
**Decisions:** P0 spec `docs/superpowers/specs/2026-10-16-qrvai-p0-consolidation-design.md`, ADR-0003, and master roadmap/P0 crosswalk.

## Canonical history

The cumulative Draft lineage **#17 → #18 → #19 → #20 → #22 → #24 → #25 → #26 → #27 → #28 → #29 → #30 → #31 → #32 → #33 → #34 → #35 → #36** reaches the same 38 source-registered MCP method names as the descriptor registry at the #37 parent. PR #21 (parallel Wave3) and PR #23 (parallel Wave5) are *not* members of that ancestry; a prior comparison found both divergent. For every implementation change, re-check live heads and preserve exact-SHA evidence, rather than treating an ahead/behind number as a list of features to port.

## Alternative Wave3 PR #21

| MCP ID | Canonical registered method | Canonical input contract | Parallel input/expectation | Decision |
|---|---|---|---|---|
| M28 | `digital_setup_guide` | `mode,locale`; FT8/APRS simulation | `rig,software,os` live-rig setup checklist | **KEEP_CANONICAL**; device-oriented checks **DEFER_VERSIONED_FEATURE**. No PTT/CAT. |
| M30 | `repeater_channel_preview` | `rx_frequency_hz,offset_hz` | `frequency_hz,offset_hz,tone_hz` | **KEEP_CANONICAL**; tone data **DEFER_VERSIONED_FEATURE**, no claim of legally permitted transmission. |
| M33 | `contest_plan` | `slots` UTC HH:MM band entries | event name, date and block duration | **KEEP_CANONICAL**; event planner **DEFER_VERSIONED_FEATURE**. |
| M37 | `maker_project_review` | `project_name,supply_voltage_v,components` | goal/BOM quantities | **KEEP_CANONICAL**; BOM dedup **DEFER_VERSIONED_FEATURE** and no safety certification. |
| M38 | `club_workshop_plan` | `topic,participants,duration_minutes` | free-text topic/locale | **KEEP_CANONICAL**; localization expansion **DEFER_VERSIONED_FEATURE**, no club roster access. |

**Decision:** Do not wholesale merge/cherry-pick #21 `wave3.ts`, `register.ts` or its incompatible tests. Existing canonical tests cover receive-only simulations, offset arithmetic, bounded slots, low-voltage safety and participant bounds. Characterization of SDK schemas is performed in P0 Task 2.

## Alternative Wave5 PR #23

| MCP ID | Canonical registered method | Canonical input/output expectation | Parallel assumption | Decision |
|---|---|---|---|---|
| M15 | `measurements_inspect_trace` | `samples:{frequency_hz,magnitude_db}[]`, extrema/deepest dip | `points/power_dbm`, peak and average dBm | **KEEP_CANONICAL**; new metrics **DEFER_VERSIONED_FEATURE**. |
| M16 | `sdr_inspect_iq` | `samples:{i,q}[]`, mean power/peak magnitude | normalized IQ, clipping/RMS | **KEEP_CANONICAL**; normalize-scale contract **DEFER_VERSIONED_FEATURE**. |
| M19 | `equipment_diagnose` | `symptom:no_receive_audio`, `steps` | `no_receive`, `checks` | **KEEP_CANONICAL**; non-invasive no-service checks retained. |
| M31 | `adif_validate` | `adif` input, `valid,records,fields,saved:false` | `logAdifValidate` and `record_count` | **PORT_COMPATIBLE_TEST** only: assert `<EOH><CALL:4>SV1A<BAND:3>20M<EOR>` does not echo `SV1A` and is not saved. |
| M32 | `log_award_progress` | user-supplied `target_entities,confirmed_entities`, `award_certified:false` | QSO-derived `dxcc` distinct counts | **KEEP_CANONICAL**; QSO award calculation **DEFER_VERSIONED_FEATURE**. |

**Decision:** #23 is a test-oriented alternate whose tests target different names and schemas. Do not port conflicting fixtures or invent QSO data. Add the bounded M31 privacy case without claiming ADIF standard certification or persistent logging.

## Risks and exit requirements

- **Contract drift:** preserve Zod strict input keys, MCP tool names and output safety flags; future feature upgrades require independently reviewed versioning.
- **Privacy:** no leakage of ADIF raw callsign in structured content or durable log; only user-supplied text processed in memory.
- **Authorization:** read-only tool descriptions are not a guarantee of valid principal/scope/tenant. Preserve existing isolated verification/authorization negative tests and do not wire the unverified seam to deployed handler.
- **Verification:** count 38 distinct M01–M38 IDs by actual SDK `tools/list` and registry lookup, not by a substring count alone; record same-final-SHA RF and V0 CI. No CI result is asserted by this document.
- **State:** leave all original PRs open and Draft unless the owner separately authorizes closure/merges. Never create/install an account plugin in P0.

**Ruling:** The existing GitHub connector supports versioned Draft branch writes, while no network-reachable local repository checkout exists in this execution environment. Use protected GitHub PR and actual GitHub Actions for observable RED/GREEN and same-SHA proof; do not report local tests as executed.
