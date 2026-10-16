# QRVAI P0 Source Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one reproducibly tested, reviewable, Vercel-only QRVAI **development source baseline**, preserving the existing 38-tool MCP interfaces while reconciling the divergent Draft PR #21/#23 evidence and eliminating misleading current-status documentation.

**Architecture:** Start from the cumulative canonical lineage at PR #36 and the subsequently approved P0 design in PR #37. Test the public SDK registry, the independently maintained M01–M38 descriptors and source registry for agreement; keep the canonical Wave3/Wave5 interfaces unchanged. Add compatible privacy/safety regression coverage, update current-status documents, then generate an exact-commit verification ledger. No host connection, plugin creation, production action, merge or closure of older PRs.

**Tech Stack:** TypeScript 5.9.3; Node >=22.0.0 built-in test runner with `--experimental-strip-types`; MCP server/client 2.3.1; Zod 4.2.1; Python 3.11 `unittest`/V0 ZIP audit; SHA-pinned GitHub Actions; Vercel as **only** intended backend.

**Spec:** `docs/superpowers/specs/2026-10-16-qrvai-p0-consolidation-design.md` (Draft PR #37, owner approved design for planning in conversation on 2026-10-16). Baseline code SHA before the design PR: `73feb5789d7830b4d47ea6100a971d864db8fb28`. Design PR #37 originally added only the spec at `3ce421cd27037ec5e45e1926e5d2f9f923b0e9c9`.

## Global Constraints

- Implement **only after owner reviews and approves this written plan** and selects execution method; the present commit is planning-only.
- Implementation is a new **Draft development branch based on PR #37's exact reviewed head**; never modify `main`, close PRs, merge, enable auto-merge or release without a separate decision.
- No ChatGPT/Marketplace connection, new/plugin-record changes, production deployment, altered Vercel secrets, OAuth provider registration or preview-protection relaxation.
- Keep `/api/mcp` static Bearer gate fail-closed; the independently verified principal seam in `src/http/verified-mcp.ts` is **not wired** to `api/mcp.ts`.
- Preserve existing exact public MCP tool names, public Zod input/output contracts and the cumulative 38 registered methods. Do **not** cherry-pick PR #21/#23 implementations.
- Maintain Greek-first/English Skills text fallback, no CAT/PTT/TX, simulated-only EmComm, versioned/unknown legal authority, no fabricated official or live feed, no unauthorized private record use.
- Version pins: MCP SDK `2.3.1`, Zod `4.2.1`, TypeScript `5.9.3`, Node `>=22.0.0`, V0 Python `3.11`. Do not silently change dependencies.
- Always distinguish source-implemented from connected, deployed, live, authorized, installed or Marketplace-released. The V0 12-file ZIP has **no** root `mcp.json`.
- Proof requires actual tests on the **final implementation SHA**. Documentation-only commits trigger the V0 workflow but not the RF workflow due to existing path filters; use a final bounded RF test/CI-trigger edit if needed (never fabricate an Actions run).
- If a proposed characterization test passes before any code change, label it **GREEN baseline characterization**; do not manufacture a RED test. For actual bug fixes or contract/doc changes, demonstrate RED→GREEN.

## Review Focus

The following high-risk cases are assigned to the exact owning tasks:

1. **Unauthorized catalog leakage:** `tools/list` after per-principal filtering does not reveal station/log/user-data tools to a read-only principal — Task 1 verifies existing SDK isolation suite; failure blocks the P0 gate.
2. **Changed alternate schemas:** swapping `mode,locale` for `rig,software,os` on M28 (or `samples` for `points` on M15) breaks client compatibility — Task 2 locks input keys from the actual SDK, not just TypeScript source strings.
3. **Callsign disclosure in ADIF result:** `<CALL:4>SV1A` must not appear in serialized `adifValidate` output or MCP `structuredContent` — Task 3 adds a compatible privacy regression, without storing a log.
4. **Stale documentation asserts only four tools:** current-date README/index must describe 38 source-registered Draft tools while clearly denying live/Marketplace readiness — Task 4 creates failing documentation assertions before editing docs.
5. **Silent false CI confidence:** a green V0-only doc-PR run, READY preview or earlier SHA is not the RF test suite on final SHA — Task 5 requires both named workflows or captured equivalent full commands, and a ledger with exact SHA and failures.

---

## File Ownership and Sequence

| Unit | Creates/updates | Responsibility |
|---|---|---|
| T1 | `qa/mcp/P0-ALTERNATE-PR-DISPOSITION-2026-10-16.md` | Per-method decision matrix and canonical lineage evidence |
| T2 | `mcp/qrvai-rf-worker/test/p0-consolidation.spec.ts`, `mcp/qrvai-rf-worker/package.json` | Live public SDK registry/contract invariants against M-ID and documented mapping |
| T3 | `mcp/qrvai-rf-worker/test/wave5.spec.ts` | M31 compatible privacy regression sourced from PR #23 |
| T4 | `mcp/qrvai-rf-worker/test/p0-status-docs.spec.ts`, `README.md`, `docs/README.md`, `docs/architecture/ADR-0002-first-fresh-mcp-private-release.md`, `.github/workflows/v0-ci.yml`, optionally `docs/roadmap/2026-10-14-qrvai-review-gates-v0.5.md` | Current-state accuracy, historical context and final-SHA CI triggers |
| T5 | `qa/mcp/P0-CONSOLIDATION-EVIDENCE-2026-10-16.md` | Exact-SHA test, packaging, security and unresolved-host-gate ledger |
| T6 | GitHub Draft PR metadata only | Explicit review disposition and no promotion |

### Task 1: Freeze the Canonical Lineage and Alternative-PR Decisions

**Files:**
- Create: `qa/mcp/P0-ALTERNATE-PR-DISPOSITION-2026-10-16.md`
- Read-only: `docs/architecture/ADR-0003-mcp-integration-consolidation.md`, the approved P0 spec, PR #21/#23 patches, PR #36/#37 metadata.

**Interfaces:**
- Consumes: exact GitHub `compare_commits(main, #36)`, `get_pr_info` for #17–#37 and `get_pr_diff` for #21/#23.
- Produces: an audit ledger listing each M-ID, canonical v1 input keys, alternative contract incompatibility, accepted coverage and deferred capability. It is evidence, not an executable migration.

- [ ] **Step 1: Re-read GitHub metadata and compare** `main...<reviewed-PR-37-head>`; confirm #37 head still descends from #36, both Draft, and explicitly record any moved heads. Do not write against a changed upstream SHA without reconciling it.
- [ ] **Step 2: Compare both alternative patches**; record Wave3 M28/M30/M33/M37/M38 and Wave5 M15/M16/M19/M31/M32. Clearly note #21 incompatible `register.ts`/schemas and #23 test-only changes with incompatible `wave5.ts` assumptions.
- [ ] **Step 3: Write the ledger** with each row labelled `KEEP_CANONICAL`, `PORT_COMPATIBLE_TEST` (M31 privacy only) or `DEFER_VERSIONED_FEATURE`; include safe no-TX / privacy claims and explicit **no wholesale merges**.
- [ ] **Step 4: Check** the ledger mentions all 10 distinct IDs and both alternate PR numbers, contains no claimed CI result, secret, or assertion that P0 is complete.
- [ ] **Step 5: Commit** `docs(p0): record explicit Wave3 Wave5 alternate-PR dispositions` on the new implementation Draft branch. Open a new Draft PR with base pointing to the reviewed plan/design branch immediately after this first implementation commit so subsequent PR changes trigger CI. Verification is document diff + GitHub branch SHA, not a manufactured RED→GREEN claim.

### Task 2: Enforce All 38 Registrations and Ten Canonical Input Contracts

**Files:**
- Create: `mcp/qrvai-rf-worker/test/p0-consolidation.spec.ts`
- Modify: `mcp/qrvai-rf-worker/package.json` (append new test pathname to the existing `test` script)
- Read-only: `mcp/qrvai-rf-worker/src/rf/wave1.ts`, `src/mcp/register.ts`, `src/http/authz-policy.ts`, `docs/architecture/mcp-implementation-register.md`

**Interfaces:**
- Consumes: `IMPLEMENTED_TOOLS: readonly {candidate_id:string; name:string; scope:string}[]`, `classifyTool(name):ToolClass|null`, `createServer()`, real SDK `Client`, `InMemoryTransport.createLinkedPair()`.
- Produces: tests that fail if the M01–M38 inventory, published registry table, actual SDK `tools/list` or tool input shapes drift.

- [ ] **Step 1: Author test `P0 maps 38 M IDs to exact public SDK registrations`**. Assert `IMPLEMENTED_TOOLS.length===38`, sorted unique IDs equal `M01`…`M38`, and every name is unique and `classifyTool(name)!==null`. Parse `mcp-implementation-register.md` table rows `| Mxx | ... | `registered_name` |` to a `Map<id,name>`; assert exactly 38 and one-to-one with `IMPLEMENTED_TOOLS`. Connect an actual SDK `Client` to `createServer()` over InMemoryTransport; `client.listTools()` names must match the descriptors as an unordered exact set. In `finally` close client and server. This detects a missing/ghost registration rather than counting `registerTool(` strings.
- [ ] **Step 2: Add test `P0 preserves ten canonical alternate-contract input schemas`** against the returned SDK `inputSchema.properties` keys. Exact names and sorted key sets:

  | Method | Expected input keys |
  |---|---|
  | `digital_setup_guide` (M28) | `mode`, `locale` |
  | `repeater_channel_preview` (M30) | `rx_frequency_hz`, `offset_hz` |
  | `contest_plan` (M33) | `slots` |
  | `maker_project_review` (M37) | `project_name`, `supply_voltage_v`, `components` |
  | `club_workshop_plan` (M38) | `topic`, `participants`, `duration_minutes` |
  | `measurements_inspect_trace` (M15) | `samples` |
  | `sdr_inspect_iq` (M16) | `samples` |
  | `equipment_diagnose` (M19) | `symptom` |
  | `adif_validate` (M31) | `adif` |
  | `log_award_progress` (M32) | `target_entities`, `confirmed_entities` |

  Also check `outputSchema.properties` has the existing safety indicators (`verified`, `simulated`, `certified`, `official_schedule`, `instrument_connected`, `device_connected`, `repair_certified`, `saved`, `award_certified`) mapped to their actual tools; exact names are in `src/mcp/register.ts`.
- [ ] **Step 3: Execute characterization tests directly** from `mcp/qrvai-rf-worker`: `node --experimental-strip-types --test test/p0-consolidation.spec.ts`. Expected **GREEN** against the approved canonical source; if RED, investigate a genuine mismatch before changing any implementation.
- [ ] **Step 4: Append test path** to existing `package.json` script (no dependency changes). Run `npm run typecheck` and `npm test`; expected exit 0 and 0 failures. Maintain real SDK behavior and avoid private SDK fields.
- [ ] **Step 5: Commit** `test(p0): lock all 38 source registrations and divergent tool schemas`; verify only the test file and package test script were touched.

### Task 3: Port Compatible Wave5 ADIF Privacy Regression

**Files:**
- Modify: `mcp/qrvai-rf-worker/test/wave5.spec.ts`
- Read-only, change only if actual RED reveals a bug: `mcp/qrvai-rf-worker/src/rf/wave5.ts`, `src/mcp/register.ts`.

**Interfaces:**
- Consumes: `adifValidate({adif:string})`, returns `{valid:boolean;records:number;fields:string[];saved:false;disclaimer:string;formula_revision:"M31-v1"}`; existing `adif_validate` SDK endpoint.
- Produces: regression assertion that raw operator callsigns are never emitted, stored or claimed verified.

- [ ] **Step 1: Append named test `M31 does not echo user callsign or save imported ADIF`** using `const r=adifValidate({adif:"<EOH><CALL:4>SV1A<BAND:3>20M<EOR>"});` assert `r.valid===true`, `r.records===1`, `r.saved===false`, `r.fields` includes `CALL` and `BAND`, and `!JSON.stringify(r).includes("SV1A")`.
- [ ] **Step 2: Append rejection test** with `<EOH><CALL:9>ABC<EOR>`; expect `valid===false`; assert no raw text leaks in serialized error result. Preserve the existing `"x".repeat(4097)` rejection test.
- [ ] **Step 3: Run** `node --experimental-strip-types --test test/wave5.spec.ts`. This is an expected **GREEN characterization/privacy test** on current canonical code. If RED, use the observed failure for a minimal separate RED→GREEN implementation fix only in `src/rf/wave5.ts` and retest; do not change the tool schema.
- [ ] **Step 4: Run** `npm run typecheck && npm test`; 0 failures.
- [ ] **Step 5: Commit** `test(p0): preserve ADIF callsign privacy against alternate Wave5 fixtures`. Do not claim complete ADIF 3.x parsing or live logbook access.

### Task 4: Restore Truthful Development Status Across Entry Documentation

**Files:**
- Create: `mcp/qrvai-rf-worker/test/p0-status-docs.spec.ts`
- Modify: `mcp/qrvai-rf-worker/package.json` (append status-docs test pathname to `test` script)
- Modify: `README.md`, `docs/README.md`, `docs/architecture/ADR-0002-first-fresh-mcp-private-release.md`, `.github/workflows/v0-ci.yml`
- Optional bounded update if contradictory: `docs/roadmap/2026-10-14-qrvai-review-gates-v0.5.md` (dated status addendum only).

**Interfaces:**
- Consumes: reviewed M01–M38 actual registrations, canonical-source lineage, existing V0 ZIP build, PR #37 design.
- Produces: precise dated status language distinguishing `main`, Draft source, Vercel Preview build, auth integration, provider data, Plugin Creator installation and host acceptance.

- [ ] **Step 1: Write failing documentation assertions** in `p0-status-docs.spec.ts` that read repository root by `fileURLToPath(new URL("../../../",import.meta.url))` and `resolve`, following `test/source-boundary.spec.ts`. Assert that root `README.md` and `docs/README.md` contain a heading `Current development status (2026-10-16)` and phrases `38 source-registered`, `Draft`, `Vercel-only`, `five V0 Skills` and `NOT CONNECTED` (case-sensitive constants in edited text). Assert root top status no longer says the currently false `four read-only RF MCP tools` and docs index no longer asserts `34 are still unimplemented` as present truth. Assert ADR-0002 has a dated addendum while keeping its original 2026-10-15 decision context. Assert `.github/workflows/v0-ci.yml` includes the path filter `'qa/mcp/**'` so a final evidence-ledger update triggers its clean ZIP gate as well as RF CI.
- [ ] **Step 2: Run** `node --experimental-strip-types --test test/p0-status-docs.spec.ts`; expected **RED** against old README/index.
- [ ] **Step 3: Update current status in the root and docs README**. State: five V0 Core/Family Skills on `main`; 38 candidate registered MCP tools exist only in cumulative Draft development code; many are user-input-only/educational; live providers, actual OAuth issuer, real ChatGPT connection and production MCP certification absent; docs/spec taxonomies (4/24/72; 18 Engines; 4 orchestrators; 36 UIs) do not imply deployment. Correct historically contradictory links and Cloudflare service entry labels with `historical` qualification, but do not alter archived decision dates or claim an external capability is implemented.
- [ ] **Step 4: Append `2026-10-16 source status addendum`** to ADR-0002: originally four RF tools; cumulative Draft PR #36 has 38 source tool registrations; actual provider and installed host states are separate blockers. Maintain the release gate and Vercel-only decision.
- [ ] **Step 5: Add `'qa/mcp/**'` to `.github/workflows/v0-ci.yml` `pull_request.paths`** without changing other triggers or action SHAs. Add the test path to `package.json`, then run `node --experimental-strip-types --test test/p0-status-docs.spec.ts` (**GREEN**) and `npm run typecheck && npm test`; verify V0 12-file bundle remains unchanged.
- [ ] **Step 6: Commit** `docs(p0): reconcile source draft and activation status with enforced readme checks`.

### Task 5: Fresh Exact-Commit Quality, Security, Packaging and Evidence Ledger

**Files:**
- Create: `qa/mcp/P0-CONSOLIDATION-EVIDENCE-2026-10-16.md`
- Read-only: `mcp/qrvai-rf-worker/test/{authz-policy,oauth-security,oauth-signed,rpc-authz,scoped-server,scoped-server-public-boundary,concurrent-clients,verified-mcp,protocol,vercel-protocol,http-limits}.spec.ts`, `.github/workflows/{qrvai-rf-mcp-ci,v0-ci}.yml`, `qa/mcp/host-report.example.json`.
- Read-only V0 package: `scripts/v0/build_archive.py`, `scripts/v0/audit_content.py`, `qa/v0/prompt-cases.json`.

**Interfaces:**
- Consumes: implementation branch head SHA, GitHub Actions workflow/job logs, full `npm`/Python local or CI exit results.
- Produces: evidence matrix with `PASS`, `FAIL`, `NOT_EXECUTED`, or `BLOCKED` for G0–G6, links to same-SHA logs and explicit known limitations.

- [ ] **Step 1: Run locally or on approved CI for the exact candidate code SHA:** from repo root `python -m pip install -r requirements-v0-dev.txt`, then `python -m unittest discover -s tests/v0 -p 'test_*.py' -v`. From `mcp/qrvai-rf-worker`, `npm ci --ignore-scripts`, `npm run typecheck`, `npm test`. Preserve exit codes and 0 failures. If no local source checkout is available, use a real GitHub Actions run only, not imagined output.
- [ ] **Step 2: Confirm security matrix** by extracting real logs for existing negative cases: unauthenticated/invalid token, scoped tool-list and tool-call denial, issuer/audience/exp/nbf/JWKS rotation, cross-tenant and concurrent-client isolation, malformed Origin, HTTP oversized payload (413) and wrong MCP Accept headers (406). Never infer security certification beyond these tests.
- [ ] **Step 3: Verify V0 ZIP audit on exact SHA** using existing `v0-ci.yml` job's `audit_catalog`, `validate_qa_cases`, `build_archive`, `validate_archive` outputs, including the strict 12-file archive check. No new `mcp.json` or Plugin Creator call.
- [ ] **Step 4: Check both GitHub PR path filters**. The final ledger lives under `qa/mcp/**`, which triggers the existing `qrvai-rf-mcp-ci.yml`; Task 4 adds the same path filter to `v0-ci.yml`, so the final ledger commit triggers **both** tests/ZIP audit on the **same final SHA**. If either workflow does not appear, record G4/G5 as `PENDING` and repair/retrigger deliberately rather than relying on a previous SHA.
- [ ] **Step 5: Write the ledger** with Git SHA, tested tool count, test totals, corresponding CI run IDs and run URLs, test-output excerpts and auth/host/production/Marketplace gates explicitly `NOT_EXECUTED`. If Vercel Preview becomes READY via automatic build, record it only as a preview build state, not a credentialed MCP HTTP check.
- [ ] **Step 6: Commit** `docs(p0): record consolidation verification and deferred host gates` under `qa/mcp/**`. Since a file cannot truthfully record its own future commit SHA and future CI results, the initial ledger records the pre-ledger source SHA and `PENDING` final verification. After this final code/docs commit triggers both workflows and they finish, append exact final SHA, run IDs, job-log links and observed totals to a **GitHub PR comment** (not another source commit). If a workflow fails, fix with a new commit and repeat the checks. Do not assert G4/G5 complete before the last SHA is tested.

### Task 6: Draft PR Review and No-Release Handoff

**Files:** GitHub Draft PR for the future implementation branch; no production files.

**Interfaces:**
- Consumes: Tasks 1–5 checkable receipts; `compare_commits` versus design PR #37 and `main`; source branch comparison #21/#23.
- Produces: a concise PR review record and owner-facing final gate decision.

- [ ] **Step 1: Update the implementation Draft PR opened in Task 1** based on **the reviewed plan/design branch**, with explicit `P0 DEVELOPMENT ONLY` status; never target `main` for automatic merging. Include spec, plan, alternate resolution ledger, test evidence, and any `FAIL/PENDING` blockers.
- [ ] **Step 2: Inspect final diff**: must contain only intended tests, documentation, evidence, and minimal proven fixes. Confirm `/api/mcp` bearer isolation unchanged; no new dependencies, issuer, production configuration, Cloudflare runtime, CAT/PTT, stored private data or Plugin Creator changes.
- [ ] **Step 3: Submit final bounded review**; all G0–G6 must have evidence to call the **development baseline** complete. Never infer actual OAuth/ChatGPT host E2E; flag missing tests or stale SHA as incomplete.
- [ ] **Step 4: Report** the implementation Draft PR URL, exact head SHA, passing tests and outstanding host gates. Leave PR #21/#23/#17–#36 open until a separate, explicit owner choice about closure/merge; do not update their state in this plan.
- [ ] **Step 5: Stop** at owner review before the distinct P1 Domain Skills/72 Sub-skills phase.

## Verification Notes

- TypeScript direct tests run under Node 22 and current `--experimental-strip-types` convention. Keep new files named `*.spec.ts`, explicit package test script entries and repo-relative paths; no testing `src/http/authz-policy.ts` via an incorrectly guessed `src/authz/policy.ts` path.
- For TypeScript tests, script append order does not change MCP registration order. Output tool names should be compared as **sets** for registry-bijection tests; legacy contract order tests remain.
- `source-boundary.spec.ts` presently checks 38 using a source-text occurrence count. Task 2 strengthens this with an actual SDK `tools/list` test and M-ID mapping. Keep the older safety tests intact.
- Current `.github/workflows/qrvai-rf-mcp-ci.yml` runs the full V0 Python and RF Node suites on MCP-source PR changes; current `.github/workflows/v0-ci.yml` runs V0 tests plus a clean archive audit on docs-path changes. These are distinct scopes.
- No new web search, provider selection, station bridge or external service integration is needed to execute the P0 consolidation work.

## Plan Self-Review / Deferred Scope

- Spec §1 decision and §2 alternative resolutions -> Tasks 1–3.
- Spec §3 registry and documentation -> Tasks 2 and 4.
- Spec §4 hard boundaries -> Global Constraints and Tasks 2–6.
- Spec §5 G0–G6 -> Tasks 1–6 and Task 5 evidence ledger. Specifically: **G0** lineage (Task 1), **G1** registry (Task 2), **G2** alternative compatibility (Tasks 1/3), **G3** authorization (Task 5), **G4** exact-SHA tests (Task 5), **G5** package and documentation (Tasks 4/5), and **G6** Draft handoff (Task 6).
- Spec §6 stage handoffs -> owner sign-off **before** implementation and final Draft PR review.

**Intentionally deferred to later independently reviewed plans:** 24 independent Domain Skills and 72 procedural references; 18 full operational engines; four runtime orchestrators; 36 UI Apps; external official legal/manual/weather/DX providers; full OAuth provider registration and host acceptance; all actual local station bridge/hardware access.

**Next required decision:** Owner reviews this written plan and confirms that it matches their goal; execution method: **Native** (recommended for tightly shared GitHub test/doc changes) or **Subagent-driven** (independent task-by-task implementation/review if that execution surface is available). Neither method grants merge or production/plugin activation authority.
