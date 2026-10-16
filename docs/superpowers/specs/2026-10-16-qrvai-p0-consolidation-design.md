# QRVAI P0 — Source Integration & Architecture Reconciliation Design

**Date:** 2026-10-16  
**Status:** Design for owner review; implementation and merge NOT authorized by this document.  
**Owner intent:** Build a complete offline-testable QRVAI source/product candidate before any installation in the user's personal Marketplace. No ChatGPT connection for now.  
**Canonical input:** PR #36, SHA `73feb5789d7830b4d47ea6100a971d864db8fb28`, based on the Vercel-only cumulative development lineage.  
**Related decisions:** `docs/architecture/ADR-0003-mcp-integration-consolidation.md`, `ADR-0004-mcp-security-auth-boundaries.md`, `mcp-implementation-register.md`.

## 1. Decision and boundaries

Choose **canonical-first, selective reconciliation**. The cumulative source lineage consists of PRs **#17, #18, #19, #20, #22, #24, #25, #26, #27, #28, #29, #30, #31, #32, #33, #34, #35, #36**, not PR #21 or #23. As observed on 2026-10-16, PR #36 is ahead of `main` by 169 commits, behind by zero, and changes 69 paths. GitHub ancestry is not a functional review, merge approval, or production-readiness certification.

Three approaches considered:
1. **Recommended: canonical-first + per-behavior regression selection.** Preserve published candidate interfaces; port only compatible and independently testable assertions, update stale documentation and traceability. Minimal regression risk.
2. Merge or cherry-pick #21 and #23 wholesale. **Rejected:** competing schemas and same-path changes; test failures from different contracts, not necessarily genuine bugs.
3. Rewrite all 38 methods into a new normalized interface now. **Rejected for P0:** breaks downstream code without a versioned migration; belongs to later capabilities/engine work.

P0 is a **development baseline and source consolidation**, not an account integration, live service, regulatory certification, full capability implementation, or release to consumers. All implementation changes must be on separately reviewable Draft GitHub branch(es); they do not target `main` until independently authorized.

## 2. Alternative PR review — exact compatibility disposition

### #21: Wave3 alternative to canonical #20

The five overlapping names are `digital_setup_guide` (M28), `repeater_channel_preview` (M30), `contest_plan` (M33), `maker_project_review` (M37), `club_workshop_plan` (M38). **Do not transplant the alternative `register.ts` or `wave3.ts`.**

| Method | Canonical source contract | Alternative #21 | P0 decision |
|---|---|---|---|
| M28 | `mode: FT8/APRS, locale: el/en` -> simulated receive-only learning steps | `rig, software, os` -> unverified CAT/audio checklist | Retain canonical; preserve device-verification false / no PTT as safety expectation; defer model/OS workflow to a versioned new feature. |
| M30 | `rx_frequency_hz, offset_hz` -> hypothetical TX arithmetic, `verified:false` | `frequency_hz, offset_hz, tone_hz` -> channel/tone preview | Retain canonical; negative/invalid resulting TX test already exists; reject automatic addition of tone and schema change. |
| M33 | user-supplied UTC `slots[]` -> deterministic sorted slots | event name, RFC3339 UTC start and duration -> three time blocks | Retain canonical; alternative belongs to separately versioned event planner. |
| M37 | low-voltage project name, voltage, component labels -> `certified:false` | goal, BOM quantities -> `verified_safe:false` | Retain canonical; consider quantity/dedup BOM improvements only as separately specified backward-compatible behavior. |
| M38 | fixed topic, participants and duration -> bounded offline agenda | free-form topic, locale -> privacy-safe agenda | Retain canonical; do not claim club inventory access; bilingual expansion belongs to P1 or a versioned UI contract. |

The alternative's unit tests assert different signatures. They cannot be pasted into the canonical test suite unchanged. Canonical test cases already cover receive-only safeguards, offset bounds, slot determinism, low-voltage limits and participant bounds. If a compatibility-safe assertion adds meaningful coverage, demonstrate a failing baseline test before code changes or document that it is a pure supplementary test.

### #23: Wave5 alternative to canonical #24

PR #23 contributes **test-only** changes and assumes a different interface, whereas canonical #24 contains `wave5.ts`, registrations and tests. Preserve canonical `measurements_inspect_trace` (M15), `sdr_inspect_iq` (M16), `equipment_diagnose` (M19), `adif_validate` (M31) and Wave6 `log_award_progress` (M32).

| Method | Alternative assumption | P0 disposition |
|---|---|---|
| M15 | `points/power_dbm`, sorted peak and mean dBm | Reject direct port: canonical uses `samples/magnitude_db`, returns minimum/maximum and deepest dip. Log future versioned metrics extension. |
| M16 | normalized IQ samples, RMS and clipping hint | Reject direct port: canonical accepts bounded arbitrary IQ numbers and computes mean power/peak magnitude. Normalization/clipping requires a specified scale. |
| M19 | `no_receive` symptom and `checks` field | Reject direct port: canonical uses `no_receive_audio` and `steps`. Maintain safe non-invasive diagnostic tests. |
| M31 | `logAdifValidate`, `record_count` | Reject direct port: canonical exposes `adifValidate`, `records`, `fields`. **Add a compatible no-raw-callsign-leak regression assertion**, because canonical responses contain only field labels, not user values. |
| M32 | QSO `dxcc` IDs and distinct-count | Reject direct port: canonical Wave6 `logAwardProgress` computes user-supplied target/confirmed entity overlap, `award_certified:false`. Do not claim QSO-derived awards; schedule separate versioned feature. |

The proposed compatible M31 test must use `adifValidate({adif:"<EOH><CALL:4>SV1A<BAND:3>20M<EOR>"})`; expect `valid:true`, `records:1`, and no `SV1A` substring in serialized result. Also cover a bad length and the existing 4096-character bound. This test is privacy-focused and does not imply full ADIF specification compliance.

## 3. Consolidation units and ownership

1. **Lineage and registry:** pin current head SHA; verify all 38 distinct registered MCP names map to one of M01–M38 and `src/rf/wave1.ts` inventory, `docs/architecture/mcp-implementation-register.md`, `src/mcp/register.ts`, and `src/authz/policy.ts` (inspect exact existing path first) agree. No broad claims of live services; source-only input-variants remain clearly labeled.
2. **Alternative test resolution:** encode approved compatible assertions in existing `mcp/qrvai-rf-worker/test/wave5.spec.ts` and, only if needed, `test/wave3.spec.ts`; never silently replace Zod MCP input/output schemas. Record rejected/deferred changes by M ID.
3. **Truthful documentation:** reconcile stale claims in root `README.md`, `docs/README.md`, `docs/architecture/ADR-0002-first-fresh-mcp-private-release.md`, and roadmap/status sections to differentiate `main`, cumulative Draft source, CI, protected Vercel Preview, live MCP integration and Marketplace host acceptance. Keep historical design documents as dated records; annotate rather than erase past decisions. The canonical backend is **Vercel-only** (no Cloudflare fallback).
4. **Quality:** inspect pinned workflow and package tests, full input/output contract checks, malformed inputs, scope isolation, parallel client isolation, security logging/no-secrets policy, deterministic arithmetic and the updated test request `Accept: application/json, text/event-stream`. Avoid SDK private internals.
5. **Handoff:** issue an auditable P0 evidence ledger (source SHA, 38-name bijection, alternative decision matrix, tests, known blockers) and an explicit final development status. Only after evidence and owner review propose closing obsolete draft PRs; **do not automatically close/merge** branches.

## 4. Architecture and execution invariants

- Preserve MCP TypeScript SDK `2.3.1`, Zod `4.2.1`, Node `>=22.0.0`, current SDK registration semantics and user-facing method names unless a separate versioned spec is approved.
- Keep `/api/mcp` gated and fail-closed; isolated JWT/JWKS verifier and verified-principal HTTP seam remain **not wired into live endpoint**. Do not introduce issuer, keys, credentials or faux OAuth metadata.
- Vercel protected Preview is allowed as a build signal, not proof of authenticated HTTP MCP or ChatGPT support. No new production deployment, shared auth changes, token leakage or deployment-protection relaxation.
- No hardware CAT/PTT/TX, live emergency dispatch, misleading official frequency permission, unlicensed manual ingestion, provider feed invention or implicit logbook storage.
- Core and four Family Skills exist; the 24 Domain Skills, 72 procedural Sub-skills, 18 conceptual engines, four orchestrators, 36 proposed UIs and full external providers are later scope. Never mark them delivered due to tool registration alone.
- Old inactive Plugin Creator record remains untouched; no new plugin identity, update, publishing, installation, `@QRVAI` E2E or Marketplace activation in P0.

## 5. Acceptance and evidence matrix

| Gate | Required fresh evidence | Passing threshold |
|---|---|---|
| G0 Source identity | GitHub compare PR #36 ancestry/working branch to `main`, no unintended changes | One declared exact baseline SHA and no missing lineage |
| G1 Contracts | Automated MCP `tools/list` and registry inventory tests; per-ID trace | Exactly 38 unique M IDs/names; no unannounced schema changes |
| G2 Wave3/5 parity | Diff review #21/#23 and compatible red/green assertions | Signed-off per-method disposition, all compatible tests green |
| G3 Security | 401/403/406/413, JWT negative cases, scope and parallel-tenant tests | No new auth bypass or cross-tenant/tool leakage |
| G4 Full CI | `npm ci --ignore-scripts`, `npm run typecheck`, `npm test` from `mcp/qrvai-rf-worker`; Python `python -m unittest discover -s tests/v0 -p 'test_*.py' -v` after dependencies from `requirements-v0-dev.txt` | 0 failures on the **final exact implementation SHA**, not inherited from #36 |
| G5 Packaging and documentation | Build package/validator check, review diff of source status and disabled integrations | Correct advertised implementation state; no account or host readiness claim |
| G6 Delivery | Final review ledger, deliberate Draft PR decision | P0 can be declared **development-baseline complete** without merge to `main`; no publication |

Some doc-only PRs do not trigger the RF-specific workflow due to path filters. A green V0 run or Vercel READY state on a documentation commit does not substitute for a fresh full RF suite; trigger or execute it deliberately for G4 and preserve exact-SHA evidence.

## 6. Sequencing and stop gates

**Stage A (this document):** complete read-only audit and commit reviewed architectural design to its own Draft PR based on PR #36; do not change runtime code.

**Stage B (after owner reviews/approves this written spec):** write a task-level TDD implementation plan in `docs/superpowers/plans/2026-10-16-qrvai-p0-consolidation.md`, covering exact files and tests; seek plan review and execution method.

**Stage C (after plan approval):** perform the approved code/doc reconciliation on a cumulative Draft branch, capture red/green and same-SHA full CI and source/contract/security review; publish findings in ledger.

**Stage D (separate owner choice):** decide whether and when to merge to `main`, mark alternative PRs superseded/closed, and later start P1. No Plugin Creator or ChatGPT activation.

**Out-of-scope host gate:** real OAuth provider onboarding, protected HTTPS credentialed acceptance and ChatGPT host installation are explicitly deferred. Their tests can remain mocked/source-level, with release status OPEN.
