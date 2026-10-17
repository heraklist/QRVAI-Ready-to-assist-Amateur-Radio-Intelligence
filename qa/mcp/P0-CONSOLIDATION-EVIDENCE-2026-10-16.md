# QRVAI P0 — Source Consolidation QA and Release-Boundary Ledger

**Date:** 2026-10-17  
**Status:** DEVELOPMENT-ONLY / Draft PR #38. **The final evidence-ledger commit itself must be retested**; see exact-SHA PR verification comment after it runs.  
**Design:** PR #37, P0 architectural specification and [Master Roadmap crosswalk](../../docs/roadmap/2026-10-17-qrvai-master-plan-p0-crosswalk.md).  
**Implementation:** [Draft PR #38](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/38), base branch `docs/p0-consolidation-design-20261016`.  
**Last tested code/docs snapshot before this ledger commit:** `01baa0f46005fe888a1c7cdfbf4d885923454d6b`.

## Exact-SHA observed runs before final ledger commit

| Test scope | Workflow / observed receipt | Outcome |
|---|---|---|
| RF Node 22 SDK/auth/security + TypeScript `tsc --noEmit` | [QRVAI RF MCP Native TDD run 39006274798](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39006274798) | **PASS**: `npm ci --ignore-scripts`; `npm run typecheck`; **178/178** Node tests, 0 failures. Includes both P0 registry characterization tests, three status tests, and two M31 privacy regressions. |
| V0 Python 3.11 suite, clean QA, ZIP packaging | [QRVAI V0 Tests run 39006274805](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39006274805) | **PASS**: **49/49** tests; `CLEAN_V0_QA_CORPUS=PASS`; `CLEAN_V0_ARCHIVE_FILES=12`; ZIP SHA256 `eb2fb505e1e2ad24b4b5a0aea07137a7e56a8b4888c33017055cb103aba6fe7f`. |

Both runs are at **the same previous SHA** listed above. Neither is a verified credentialed external HTTPS MCP handshake or ChatGPT plugin acceptance.

## TDD receipts (observed GitHub Actions, not simulated)

1. **P0 SDK test early failure:** [RF run 39006099642](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39006099642) at `a2b976b453fd954bf0fc4fd79acfb8903b1f71db`: `TS2769` from a new test's `string[][]` Map constructor (test typing error, not production logic). Fixed by tuple assertion.
2. **Canonical contract characterization GREEN:** [RF run 39006147594](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39006147594) at `9e2f41e560a7d7f74af2c11adc8cfd00dd10283b`, after fixing the typed test. This was a **GREEN characterization** of the existing SDK contracts, not a fabricated failing production behavior.
3. **Document/CI RED:** [RF run 39006171627](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/39006171627) at `64f75f50b7adf45776c9a48e37961ae1f393626c`: **175/178** pass, **3 failures** for stale `README.md`, historical `ADR-0002` addendum and missing V0 `qa/mcp/**` workflow filter. Python V0 tests passed (49/49).
4. **Document/CI GREEN:** both run links above at `01baa0f46005fe888a1c7cdfbf4d885923454d6b`: **178/178** Node and **49/49** Python tests, original public tool contracts unmodified. This RED→GREEN applies to P0 status/CI documentation; ADIF privacy is an added **GREEN characterization** of canonical behavior.

## G0–G6 source development gate matrix

| Gate | Current assessment (pre-ledger-commit) | Evidence or outstanding condition |
|---|---|---|
| **G0** exact source identity | **PASS for pre-ledger snapshot** | P0 branch originates from PR #37 `e094dc8d73b57ed6bc7ab09d2c0ebe2100129557`, a direct documentation descendant of cumulative PR #36 `73feb5789d7830b4d47ea6100a971d864db8fb28`; parent is not `main`. |
| **G1** method registry and SDK contracts | **PASS for pre-ledger snapshot** | New real SDK `tools/list` test maps **M01–M38 ↔ 38 unique names ↔ 38 implementation table rows**, and locks canonical input keys plus output-safety markers for 10 Wave3/Wave5 methods. |
| **G2** alternate PR resolution | **PASS for pre-ledger snapshot** | [Per-method #21/#23 dispositions](P0-ALTERNATE-PR-DISPOSITION-2026-10-16.md) preserve schemas, defer incompatible versioned features, and port only compatible ADIF privacy checks. |
| **G3** security regression coverage | **PASS for existing source-level checks only** | Node suite contains `oauth-security.spec.ts`, `oauth-signed.spec.ts`, `authz-policy.spec.ts`, `rpc-authz.spec.ts`, `scoped-server.spec.ts`, `scoped-server-public-boundary.spec.ts`, `concurrent-clients.spec.ts`, `verified-mcp.spec.ts`, `http-limits.spec.ts`, `protocol.spec.ts` and `vercel-protocol.spec.ts`; covers missing/invalid auth, issuer/audience/scope/time, JWKS rotation, tenant ownership, parallel scopes, oversized body/Origin/Accept cases. It is **not** full production authorization acceptance or external OAuth. |
| **G4** full final-SHA CI | **PENDING on this ledger commit** | Both workflows **PASS on `01baa0f` only**. The new QA ledger file triggers RF and V0 workflows on the next SHA due to the `qa/mcp/**` path filters in both CI configs. Record the resulting final SHA and run URLs in the PR conversation, not in a self-referential Git commit. |
| **G5** packaging/status/provenance | **PASS for pre-ledger snapshot; PENDING final SHA** | Readme/status tests, explicit Draft/non-connected state and V0 QA/strict 12-file ZIP PASS; host credentials, plugin and live providers remain unconnected. |
| **G6** delivery and review | **DRAFT / reviewer gate pending** | Review final PR #38 diff and corresponding final-SHA evidence; leave PR #17–#37 open, do not merge to `main`. |

## Security and host exclusions

- `api/mcp.ts` retains its existing fail-closed static Bearer gate. The isolated verified principal/JWT test adapter is **not** wired to the externally hosted endpoint as a working OAuth provider. No issuer, tokens, env secrets, CORS relaxation or Vercel production promotion is part of this PR.
- `qrvai/` still packages five V0 Core/Family Skills only; there is no premature `qrvai/mcp.json` in the validated 12-file ZIP.
- No Plugin Creator create/update, old legacy record edits, ChatGPT host connection, real `@QRVAI` invocation or actual Marketplace installation was performed or authorized.
- No CAT/PTT/TX, physical rig/SDR connectivity, live emergency dispatch, official Greek rule attestation, licensed manual ingestion or provider-backed live weather/spot/award data is demonstrated by this work.
- **Product roadmap**: 24 domain Skill packages, 72 internal procedural Sub-skills, 18 operational Engines, four runtime Orchestrators/main router, 36 interactive widgets and live data adapters remain later milestones; 38 source method names do **not** demonstrate product completeness.

## Execution rulings and completion condition

- **Ruling — GitHub Actions instead of local checkout:** The execution environment has GitHub connector read/write and real Actions but no network-reachable local repo checkout; GitHub Actions receives authoritative source at precise SHA, and actual job logs are used for verification. Risk if wrong: untested environment-specific behavior outside Linux/Node 22.
- **Ruling — contract fixture typing:** The new registry test originally failed TypeScript compilation due to inferred `string[][]`; typing the pairs `as const` restores intended test fidelity with no runtime or schema mutation. Risk if wrong: fixture misses a registry mismatch; covered by passing direct SDK map/list assertions.
- **Ruling — preserve current source interfaces:** Reject incompatible #21/#23 shape changes rather than attempting a convenience cherry-pick. Risk if wrong: some helpful workflows remain deferred; avoids silently breaking existing callers.
- **Ruling — two distinct evidence commits:** This ledger cannot contain a truthful SHA for its own future commit and future CI result. The final exact-SHA receipt belongs as a GitHub PR #38 comment after both workflows finish; document remains `PENDING` until then. Risk if wrong: incomplete audit trail if the PR comment is lost; track final SHA and Actions links in owner handoff.

**Development-baseline completion rule:** When both RF and V0 workflows pass for the post-ledger final SHA, the PR diff shows only intended test/docs/workflow/QA changes, code review finds no critical/important issue, and the owner has a final receipt, call **P0 development baseline verified**. This status is **not** permission to merge, create a plugin, deploy production or begin host onboarding. Those are separate approvals.
