# QRVAI M09 — User-supplied Feedline Profile Design

**Date:** 2026-10-15 · **State:** bounded implementation slice of approved M1.2, not real catalogue integration

## Intent and prior constraint
Complete deterministic feedline attenuation for radio amateurs within the ChatGPT-first QRVAI architecture. Reuse the stateless Cloudflare MCP Worker on `main` and its actual SDK v2, existing validation and CI. Existing M1.2 plan mandates versioned profile source, bounded frequency support, explicit interpolation, and separately modelled connector loss. DO NOT invent manufacturer specifications, claim that the profile is independently certified, call external APIs, use station identifiers, send radio commands, or deploy to Cloudflare in this source change.

## Design decision: explicit, untrusted numerical curve
Expose one new read-only `rf_feedline_loss` MCP tool, and pure `calculateFeedlineLoss(input: unknown)`. For this phase, `profile` is supplied *in the request*, not selected via a `cable_id` catalogue lookup. This differs intentionally from the future proposed M09 catalogue contract: absent licensed/upstream manufacturer data, pretending a catalogue exists would violate M1.2.

Input:
- `profile: { id: string, revision: string, points: [{frequency_hz: number, loss_db_per_100m: number}, ...] }` — 2–16 points, ascending unique positive Hz, nonnegative finite attenuation; short generic identifiers, version string; profile is always `USER_SUPPLIED_UNVERIFIED`.
- `frequency_hz` positive finite and **within** the supplied sample range.
- `length_m` and `connector_loss_db` finite nonnegative.
- `interpolation_method: "log_frequency"` required, no implied default.
- Reject all unknown fields, accessor properties, prototypes/hidden or symbol keys and non-finite numbers at the pure-function boundary.

Algorithm: exact sample value at knots; otherwise interpolate attenuation in dB/100m linearly between the log10 frequencies of the bracketing samples. `cable_loss_db = interpolated_db_per_100m * length_m / 100`; `attenuation_db = cable_loss_db + connector_loss_db`; `delivered_ratio = 10 ** (-attenuation_db/10)`. All output numbers must be finite; positive underflow becomes a typed error instead of silently reporting zero. `0 m` remains valid (connector attenuation may still be nonzero). No out-of-range extrapolation, fabricated data or inferred frequency curves.

Output: `attenuation_db`, `cable_loss_db`, `connector_loss_db`, `delivered_ratio`, `interpolated_loss_db_per_100m`, `series` (two bracketing frequency samples or exact one), `profile_id`, `profile_revision`, `profile_trust: "USER_SUPPLIED_UNVERIFIED"`, `interpolation_method`, `formula_revision: "M09-v1"` and assumptions string. Failed inputs return a bounded `FeedlineInputError` / MCP `isError`, not guessed values.

## Verification targets
1. Exact samples and log-frequency midpoint (e.g. 10 MHz 4 dB/100m and 1000 MHz 8 dB/100m yield 6 dB/100m at 100 MHz).
2. Cable 20m + 0.5 dB connector -> 1.7 dB total, ratio `10**(-0.17)`.
3. Zero-length cable, connector only; zero-loss ratio one.
4. Boundary frequencies included; outside range and duplicate/out-of-order points rejected.
5. Negative length, negative loss, nonfinite, malformed, wrong or hidden/extra fields fail closed.
6. Overflow and underflow no nonfinite or false zero results.
7. MCP `initialize`, `tools/list`, `tools/call` with four read-only tools in same Worker, including real Workerd tests; no extra network, secrets, cookies or device access.
8. Full original V0 Python tests, TypeScript check, Node tests, Workerd tests, Wrangler `--dry-run` and exact-commit CI. No cloud deployment or ChatGPT host claim.

**Approval inheritance:** implementation is a bounded part of the previously accepted M1.2 development roadmap and earlier direction to continue implementation. This document records the deliberate narrower no-catalogue interface; future catalogue work still requires rights and source review.
