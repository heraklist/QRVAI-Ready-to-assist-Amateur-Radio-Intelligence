# QRVAI M1 — E03 Deterministic RF Math: Test-First Implementation Plan

**Date:** 2026-10-15  
**Status:** PROPOSED FOR REVIEW — no E03 runtime, MCP server, UI deployment, or plugin release implied  
**Baseline:** `main` after PR #1; preserve existing QRVAI V0 five-Skill package and clean-slate account boundaries.

## Mission and boundaries

Deliver an independently testable, deterministic, unit-safe RF power conversion core before exposing MCP endpoints or interactive UI. Primary owner: B07; reusable by B08/B09 and other domains only when relevant. The current V0 Skills remain guidance-only until a separately verified new release. ChatGPT conversation is the primary experience. Do not create, install, update or reuse the legacy QRVAI plugin; no automatic PTT, device writes, radio transmission, emergency dispatch, unlicensed legal clearance, or fabricated measurements.

## Findings from V0 read-only review

- `qrvai-core/SKILL.md` and `references/routing.md` correctly route by outcome, preserve first-class Chat interaction, and identify missing runtime tools.
- Family A correctly distinguishes national law from voluntary band plans; legal permission must remain INDETERMINATE when unverifiable.
- Family B explicitly prohibits claims that RF engines, solvers, CAT control or measurement tools are deployed; future M1 integration must update such copy only after demonstrable release/host testing.
- Family C distinguishes observations from forecasts and prohibits fabricated live data; Family D excludes legacy Academy assets.
- Observed gaps are future implementation/acceptance, not defects proven in the five Skill instructions: no live E03 calculation endpoint, no real MCP or UI, no host invocation E2E.
- Current prompt corpus exercises structural classifications, not model response quality; add genuinely executed host E2E later.

## Vertical slices and strict order

### M1.0 — Core E03 / M07 semantics, local only

1. Freeze API and error semantics in a versioned public-neutral specification.
2. Write RED tests first for all cases below; capture failing test output and exact commit SHA.
3. Implement pure power-conversion functions with no network, device or persistent state.
4. Run GREEN unit/property tests and show actual stdout/exit code, exact SHA and independent reference comparisons.
5. Audit numeric stability, rounding and units; document domain assumptions and unrepresentable conversions.

**M07 candidate inputs:** `value` (finite JSON number), `from_unit`, `to_unit` each in `W | dBW | dBm`.  
**Candidate outputs:** finite numeric value, output unit, formula revision, applied assumptions. Structured error when no finite representable output is possible. Do not return NaN, infinity or guessed defaults.

**Reference formulas:**
- `dBW = 10 log10(P_W)` for `P_W > 0`.
- `dBm = 10 log10(P_W / 0.001)` for `P_W > 0`.
- `dBm = dBW + 30`.
- `P_W = 10^(dBW/10) = 10^((dBm-30)/10)`.

**Required design decision:** zero W has a physically meaningful logarithmic limit of negative infinity, but strict JSON output cannot encode it as a finite number. For M07 V1, return a typed `UNREPRESENTABLE_LOG_POWER` error for zero W → dBm/dBW (unless the reviewed API explicitly defines a nullable/limit representation). Zero W → W remains valid. Negative W is invalid as an absolute nonnegative power quantity. Reject NaN/±Infinity and non-numeric values at the input contract boundary. Reject overflow/underflow when it would silently yield an incorrect finite output or zero; document tolerance and numeric policy. Do not conflate signed dB gains/losses with absolute W/dBm/dBW power conversion.

**Golden fixtures:** `1 W = 0 dBW = 30 dBm`; `0.001 W = -30 dBW = 0 dBm`; `100 W = 20 dBW = 50 dBm`; `10 W = 10 dBW = 40 dBm`. Test reverse roundtrip across safe dynamic ranges; unit identity; rejected invalid enum; boundary overflow/underflow; zero-W logarithmic conversion; negative watt inputs; minuscule/large finite input.

### M1.1 — M08 Link budget

Add typed TX power in W, TX/RX gains in dBi, attenuation/loss in positive dB, path loss in dB, RX sensitivity in dBm. Verify:
`rx_dbm = tx_dbm + tx_gain_dbi - tx_loss_db - path_loss_db + rx_gain_dbi - rx_loss_db`;
`margin_db = rx_dbm - rx_sensitivity_dbm`.
Return ordered arithmetic stages, unit metadata and formula revision. Reject inconsistent sign conventions, missing quantities, nonfinite inputs. Path loss must be explicitly provided or produced by a separately verified model, never inferred silently.

### M1.2 — M09 Feedline loss

Require versioned cable profile source and frequency-range coverage, cable length, explicitly declared interpolation method and connector losses. Return positive attenuation in dB and delivered-power ratio `10^(-loss_db/10)` with provenance. Do not invent cable attenuation values or extrapolate outside source range without a documented opt-in policy. Test length zero, negative length, frequency outside supported range, connector conventions, monotonicity only for model families where justified.

### M1.3 — M10 Impedance and SWR

For `Z = R + jX` and `Z0 > 0` real, `Gamma = (Z-Z0)/(Z+Z0)`; `VSWR=(1+|Gamma|)/(1-|Gamma|)`; `RL=-20 log10(|Gamma|)`. Define typed representations for perfect match (RL → +infinity) and total reflection (VSWR → +infinity), rather than nonfinite JSON numbers. Reject invalid reference impedance and non-passive load conditions when using passive-only assumptions. Test 50+j0 on 50 ohm, 100+j0 on 50 ohm (VSWR 2), zero impedance, reactive loads, numeric stability and near-singularities.

### M1.4 — MCP publication and UI (separate gates)

Only after M1.0–M1.3 pass: publish concrete versioned MCP JSON Schema 2020-12 input/output and error envelopes; security/rate-limit tests; real host-compatible installation path. Verify provider/server lifecycle **before new plugin account creation** because the recorded platform research warns that skills-only-to-MCP upgrade may not be supported by the public submission workflow. Then design UI-01 through UI-04, test numeric/visual parity, mobile/desktop accessibility and conversational text fallback. No UI is accepted as evidence of engine correctness.

## Test and evidence gates

- Unit tests: exact golden fixtures within published precision, dimensional coherence and domain/boundary coverage.
- Property tests: monotonicity for valid power range, safe roundtrip, invariant `dBm-dBW=30`, valid result always finite.
- Packaging: existing V0 validators, 42-test historical baseline must be rerun on exact candidate, not inherited automatically.
- Security: pure function default; no personal data, secrets, file access, device bridge or PTT.
- Source evidence: commit ID, test runner identity, commands, actual RED/GREEN stdout, failures, checksums for any release artifact.
- Host acceptance: actual installed and invoked `@QRVAI` where supported; validate consent, permission boundaries and text fallback on each supported client; until then status NOT_EXECUTED.
- Promotion: branch/PR review and owner authorization, separate from any release, new plugin creation, merge or publication. Legacy account D1/D2 blockers remain.

## Recommended code layout (not yet implemented)

```text
qrvai_engine/
  rf_math/
    __init__.py
    power.py
    link_budget.py
    feedline.py
    impedance.py
tests/rf_math/
  test_power.py
  test_link_budget.py
  test_feedline.py
  test_impedance.py
docs/architecture/
  rf-math-api-v1.md
```

No extra public Skills, agents, orchestrators, endpoints or permissions are automatically authorized by this plan.

## Acceptance record

**Planning:** documented candidate on a separate branch.  
**Implementation:** NOT_EXECUTED.  
**Independent executable verification:** NOT_EXECUTED.  
**MCP host test:** NOT_EXECUTED.  
**QRVAI plugin creation/release:** BLOCKED by existing account and distinct authorization gates.
