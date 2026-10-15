# QRVAI Cloudflare Free No-OAuth RF MCP — Native TDD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify **one real**, stateless, read-only RF power-conversion MCP tool (`rf_power_convert`) for a Cloudflare Workers Free target, without OAuth, personal data, device controls, deployment or premature QRVAI account changes.

**Architecture:** A self-contained TypeScript package under `mcp/qrvai-rf-worker/` implements a pure RF mathematics function, an exact one-tool MCP registration, and a Cloudflare object-export HTTP entrypoint using `createMcpHandler` from `agents/mcp/server` with `@modelcontextprotocol/server` (SDK v2). Separate unit, transport, Worker-runtime and abuse-boundary tests validate the result without altering the existing five-Skill V0 package. Deployed Worker, new `mcp.json`, Plugin Creator identity and ChatGPT `@QRVAI` acceptance each have **separate release gates**, not automatic effects of code passing.

**Tech Stack:** TypeScript in strict mode; Node.js **22** for dev/CI; current stable `agents`, `@modelcontextprotocol/server` (MCP SDK **v2**), `zod`, `wrangler` **v4**, `vitest`, `@cloudflare/vitest-plugin` (not deprecated `@cloudflare/vitest-pool-workers`), and `typescript`. During Task 1/3 resolve real compatible exact dependency versions from the official Cloudflare sample/registry, install with `--save-exact`, commit `package-lock.json`, and run only `npm ci` thereafter. Never invent SDK versions or compatible API signatures. Pin Worker `compatibility_date` to **2026-10-15** if the installed Wrangler supports that date; otherwise record the supported earlier date and why in the Task 3 review.

**Spec:** [Owner-approved RF MCP design](../specs/2026-10-15-qrvai-cloudflare-free-authless-rf-mcp-design.md) (approved **2026-10-15 for implementation planning**, not implementation or deployment). Related [Issue #6](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6), [ChatGPT-first contract](../../architecture/chatgpt-first-experience-v0.5.md), [legacy plugin blocker #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3).

## Global Constraints

- **Native execution with review after EACH task.** The owner already chose Native. A reviewer gate is a separately documented author second pass unless an actually isolated reviewer worker/person executed and provided an inspectable receipt. Never call author self-review independent.
- **Code-only authorization is not yet granted.** This plan is written now for owner approval. When approved, create a **new implementation branch from the current `main`**, open a **Draft PR**, complete strict RED → observed failure → minimal GREEN → observed passing test → author review → commit progression per task. An initial RED commit and a corresponding GREEN commit are preferred when GitHub Actions is the reliable test executor. Do not continue after a failing reviewer gate.
- **One tool only:** `rf_power_convert` accepts exactly `{value: number, unit: "W"|"mW"|"dBm"|"dBW"}`. Output exactly `{W: number, mW: number, dBm: number, dBW: number, convention: string, precisionNote: string}` in structured form plus a plain-text rendering. Do not add link budget, SWR, network feeds or a second MCP tool in this slice.
- **Mathematics:** `dBm = 10 * log10(mW)`, `dBW = dBm - 30`, `W = 10 ** ((dBm - 30)/10)`, `mW = 10 ** (dBm/10)`. Only finite values, only strictly positive linear power; derived `dBm` must satisfy **-270 ≤ dBm ≤ +270**. No silent clipping, overflow, NaN or infinity. Define numerical tolerance in tests and document rounding, never silently modify user inputs.
- **No credentials or personal data.** No callsign, operator QTH, logbook, cookies, profiles, tokens, network provider adapters, CAT/PTT, transmit, real EmComm or regulatory permission decision. No persistence, outbound `fetch`, KV, D1, Durable Objects, Workers AI or MCP App in first slice.
- **No authentication for this isolated numeric tool.** A public no-OAuth Cloudflare endpoint is not privately accessible just because the future ChatGPT QRVAI plugin is personal. Counter quota exhaustion and bad requests with input caps and verifiable HTTP handling; do not promise genuine exclusivity or reliable anonymity-based rate limits.
- **Cloudflare Free budgets must be proven later:** indicative shared account ceiling **100,000 requests/day**, **10 ms CPU/request**, **50 external / 1,000 Cloudflare-service subrequests** per invocation, subject to current account and platform rules. Test dependency bundle/CPU under real Worker staging only after separate owner authorization. Do not upgrade billing automatically.
- **Respect actual SDK v2 protocol:** use the official `McpServer` factory, `server.registerTool(...)`, and `createMcpHandler(createServer)(request, env, ctx)` through a default-exported object Worker. Use the official modern/legacy compatibility default unless tests justify another explicit setting. Do not use deprecated `McpAgent`, `createLegacyMcpHandler`, HTTP+SSE-only flow or an ad hoc fake MCP JSON endpoint.
- **V0 immutable package boundary:** leave `qrvai/plugin.json`, its **five V0 Skills**, its 12-file ZIP allowlist and old creator backend ID **untouched**. In particular do **not** commit `qrvai/mcp.json` without a real deployed verified endpoint, compatible plugin lifecycle and separate owner consent. Leave old `plugins_6acf47f502dc8191bf542fe040d484d8` unmodified.
- **No Cloudflare mutation in this plan execution:** `wrangler deploy`, account resource creation, secrets, routes, domain, paid subscriptions, Plugin Creator create/update, installation, merge, release and publication are all separate gated operations. `wrangler dev` local simulation and in-process tests are allowed only in later approved source-implementation phase.
- **CI evidence ≠ production evidence.** Source tests, Wrangler local simulation, public HTTPS staging and actual ChatGPT `@QRVAI` end-to-end are different test states. Mark the latter two NOT_EXECUTED until separately authorized and observed.

## Review Focus (five high-risk input classes)

1. **Bad types and unknown fields:** `{value:"100",unit:"W"}`, `{value:true,unit:"W"}`, `{value:100,unit:"W",callsign:"..."}` must fail validation, not coerce or persist data (**Task 2**).
2. **Zero, negative, nonfinite and extreme power:** `0 W`, `-2 mW`, NaN/Infinity in direct calls, inputs mapping beyond ±270 dBm must fail with bounded typed error (**Task 1/2**).
3. **Malformed HTTP/MCP envelopes, oversize bodies and hostile Origin:** bad JSON, unbounded request body, spoofed Host/Origin and unsupported methods must return bounded failures without crashes, SSRF or unexpected permissive CORS (**Task 4/5**).
4. **Free-tier CPU and quota surprises:** do not infer 10 ms CPU compliance from local unit-test timing; account plan/usage and actual staging measurements are required before production (**Task 6/8**).
5. **Identity/permission confusion:** a successful code build, anonymous Worker or V0 ZIP is not a fresh personal QRVAI plugin, and `@QRVAI` in a real existing conversation is not proven by a fixture (**Task 7/8**).

---

## File and package map (decisions locked for execution)

```text
mcp/qrvai-rf-worker/
  package.json                 # exact dependencies, safe scripts (NO deploy shortcut)
  package-lock.json            # npm ci reproducibility
  tsconfig.json                # strict TypeScript
  vitest.config.ts             # isolated unit tests
  vitest.worker.config.ts      # Cloudflare Workers test integration
  wrangler.jsonc               # Worker name, main entry, fixed compatibility date; no secrets
  src/rf/power.ts              # pure validate-and-convert RF mathematics
  src/mcp/register.ts          # register exactly one MCP tool
  src/index.ts                 # Cloudflare fetch handler /mcp; stateless SDK v2
  src/http/limits.ts           # bounded protocol request preflight
  test/power.spec.ts
  test/validation.spec.ts
  test/register.spec.ts
  test/protocol.spec.ts
  test/http-limits.spec.ts
  test/worker.spec.ts
  test/source-boundary.spec.ts
  test/release-gates.spec.ts
  scripts/check-release-gates.mjs
  README.md
.github/workflows/qrvai-rf-mcp-ci.yml
qa/mcp/rf-power-fixtures.json
qa/mcp/host-report.example.json
docs/runbooks/qrvai-rf-mcp-cloudflare-free-preflight.md
docs/runbooks/qrvai-rf-mcp-host-acceptance.md
```

**Architectural API boundary:** `src/rf/power.ts` exports `type PowerUnit = "W" | "mW" | "dBm" | "dBW"`, `type PowerConversion`, `class PowerInputError extends Error` (stable `code: "INVALID_INPUT" | "OUT_OF_RANGE"`), and `convertPower(input: unknown): PowerConversion`. `src/mcp/register.ts` exports `createServer(): McpServer` (SDK v2), with one tool delegating to `convertPower`. `src/index.ts` exposes a Cloudflare Workers object default export with `fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response>` and delegates to the SDK handler after `limitMcpRequest` in `src/http/limits.ts`. `scripts/check-release-gates.mjs` is a developer CLI **not imported into the Worker**. Do not introduce a redundant server-framework abstraction.

**Commands after authorization:** `npm --prefix mcp/qrvai-rf-worker ci`, `npm --prefix mcp/qrvai-rf-worker run typecheck`, `npm --prefix mcp/qrvai-rf-worker test -- --run`, `npm --prefix mcp/qrvai-rf-worker run test:worker`, `npm --prefix mcp/qrvai-rf-worker run build:check`. The implementing engineer must define these npm scripts in Task 1/4/6 and confirm exact command behavior against installed versions. All commands run at repo root; no actual Worker deployment occurs.

### Task 1: Pure RF calculation and reproducible TypeScript toolchain

**Files:**
- Create: `mcp/qrvai-rf-worker/{package.json,package-lock.json,tsconfig.json,vitest.config.ts}`
- Create: `mcp/qrvai-rf-worker/src/rf/power.ts`
- Test: `mcp/qrvai-rf-worker/test/power.spec.ts`
- Fixture: `qa/mcp/rf-power-fixtures.json` with 100 W, 1 W, 1 mW and ±270 dBm reference cases.

**Interfaces:** `convertPower(input: unknown): PowerConversion`; outputs `W,mW,dBm,dBW,convention,precisionNote`. `PowerInputError.code` is `INVALID_INPUT` or `OUT_OF_RANGE`. No SDK or Worker dependency inside `power.ts`.

- [ ] **Step 1 — RED test:** Define `it("converts 100 W to 50 dBm and 20 dBW")` asserting `convertPower({value:100,unit:"W"})` has `W≈100, mW≈100000, dBm≈50, dBW≈20`; test `1 mW→0 dBm/-30 dBW`, `1 W→30 dBm/0 dBW`, and round-trip `convertPower({value: 50,unit:"dBm"}).W≈100` with relative error ≤ 1e-12. Test ±270 dBm produces finite linear values and conversions.
- [ ] **Step 2 — Run RED:** Create the minimal non-executing test harness and run `npm --prefix mcp/qrvai-rf-worker test -- --run test/power.spec.ts`; expect a test failure attributable to missing `convertPower` behavior, not npm/fixture installation errors. Record command/log and test-first commit.
- [ ] **Step 3 — GREEN code:** Implement the pure formulas and typed `PowerInputError`; document valid domain and rounding with no external calls. Add exact compatible stable TypeScript/Vitest development versions to `package.json`, commit lockfile and Node 22 compatibility.
- [ ] **Step 4 — Run GREEN:** Same test passes; run `npm --prefix mcp/qrvai-rf-worker run typecheck`; assert numeric fixtures and output fields. Retain original RED evidence.
- [ ] **Step 5 — Review gate and commit:** Second-pass review confirms mathematical invariants, zero dependencies in pure module, finite output, deliberate precision policy, no user data. Record whether reviewer is author or real independent executor, then commit Task 1 result.

### Task 2: Strict input validation and numerical adversarial cases

**Files:** Modify `src/rf/power.ts`; Test `test/validation.spec.ts`.

**Interfaces:** same `convertPower(input: unknown): PowerConversion`; validation precedes arithmetic; source of truth for type/range checks; `PowerInputError` stable errors, never silent coercion.

- [ ] **Step 1 — RED test:** `it.each` rejects non-objects, arrays, absent `value`/`unit`, boolean/string/null values, unknown units, inherited/extra keys (`callsign`, `qth`), `0 W`, `-2 mW`, `Number.NaN`, infinities, and derived results outside **[-270, +270] dBm**. Verify no numeric clipping. Include `1e-1000` parsed as zero. Test `-270` and `+270` remain valid with finite outputs, using tested tolerance for floating point.
- [ ] **Step 2 — Run RED:** `npm --prefix mcp/qrvai-rf-worker test -- --run test/validation.spec.ts`; expect tests to expose missing fail-closed behavior; preserve failures/commit.
- [ ] **Step 3 — GREEN code:** Enforce plain object with only own enumerable `value` and `unit` keys; exact `number`, `Number.isFinite`, exact case-sensitive unit enum. For linear values reject ≤0; derive dBm safely and reject outside fixed range. Prevent inherited/prototype-polluted or non-finite results from being returned.
- [ ] **Step 4 — Run GREEN:** Targeted tests plus full pure-math tests and `tsc --noEmit` pass. Validate malformed responses contain only stable error codes, not stack traces or internal input echoes.
- [ ] **Step 5 — Review gate and commit:** Audit numeric boundaries and malicious input classes R1/R2; actual red/green receipts and author/independent reviewer identity recorded. Commit.

### Task 3: Exactly one stateless MCP v2 tool

**Files:** Create `src/mcp/register.ts`; modify `package.json` and lockfile; Test `test/register.spec.ts`.

**Interfaces:** `createServer(): McpServer` from `@modelcontextprotocol/server`; `server.registerTool("rf_power_convert", {description,inputSchema,annotations}, handler)`. Use official matching SDK v2 registration shape and typed input schema; adapt to supported SDK types, not old SDK v1. Map `PowerInputError` to bounded MCP `isError` result. Provide `structuredContent` matching `PowerConversion` and a `content` plain-text block. Never issue network or device commands.

- [ ] **Step 1 — RED test:** Against an in-process SDK MCP client or test transport, check `tools/list` returns **only** `rf_power_convert`; tool is read-only; `tools/call({name:"rf_power_convert",arguments:{value:100,unit:"W"}})` yields 50 dBm in structured and text content; invalid `0 W` produces bounded tool-level error.
- [ ] **Step 2 — Run RED:** `npm --prefix mcp/qrvai-rf-worker test -- --run test/register.spec.ts`; expect missing registration/incorrect envelope failure. Commit test evidence.
- [ ] **Step 3 — GREEN code:** Install/pin compatible exact `agents`, `@modelcontextprotocol/server` SDK v2 and `zod` versions confirmed by official Cloudflare `createMcpHandler` example. Implement `createServer` using official typed `registerTool` with enum and `additionalProperties: false` semantics; use exact SDK-supported schema form. No manual ad hoc JSON-RPC parser.
- [ ] **Step 4 — Run GREEN:** Test tools/list, tools/call valid and invalid; inspect text fallback and exactly one published tool. Run TypeScript typecheck and source tests.
- [ ] **Step 5 — Review gate and commit:** Check tool name, capability count, annotation claims, error-data exposure and side-effect absence; record exact npm dependency versions and independent-vs-author reviewer truthfully.

### Task 4: Workers object handler and real stateless MCP transport

**Files:** Create `src/index.ts`, `wrangler.jsonc`, `vitest.worker.config.ts`; Test `test/protocol.spec.ts`, `test/worker.spec.ts`.

**Interfaces:** `createMcpHandler(createServer)(request,env,ctx)` inside `export default { fetch(...) }`; only supported HTTPS `/mcp` protocol, `env` excludes credentials and bindings. The test transport must be real MCP JSON-RPC using supported SDK, not a fake `POST {"value":100}` endpoint.

- [ ] **Step 1 — RED test:** Use official MCP client/HTTP transport and **`@cloudflare/vitest-plugin` v1** where supported: `initialize`, `tools/list`, `tools/call` round-trip on simulated Worker endpoint; repeat calls without a session cookie; route errors for `/unknown`; confirm no fake `/sse` expectation. Cover supported SDK v2 and permitted legacy stateless client behavior.
- [ ] **Step 2 — Run RED:** `npm --prefix mcp/qrvai-rf-worker run test:worker` and `test/protocol.spec.ts`; expect missing Worker route/server failures (after test harness bootstraps), record run/commit.
- [ ] **Step 3 — GREEN code:** Implement one object-export Worker and one stateless MCP SDK v2 handler. Configure `wrangler.jsonc` with `name:"qrvai-rf-mcp"`, `main:"src/index.ts"`, a verified compatibility date, **no `vars`, paid bindings, custom domains or deploy scripts**. If test harness SDK negotiation differs from design, update a bounded compatibility note/review before changing the production contract.
- [ ] **Step 4 — Run GREEN:** Simulated Worker and client tests pass with native MCP response envelopes. Log exact tool schema and actual SDK versions. Check fresh handler/server per request and no persistent session state.
- [ ] **Step 5 — Review gate and commit:** Audit auth none, supported Origin/Host behavior inherited from SDK, absence of side effects, session promises and deprecated APIs; commit.

### Task 5: Strict HTTP/resource protections without breaking MCP negotiation

**Files:** Create `src/http/limits.ts`; modify `src/index.ts`; Test `test/http-limits.spec.ts`, `test/worker.spec.ts`.

**Interfaces:** `limitMcpRequest(request: Request): Promise<Request | Response>` returns either a safely bounded forwarded Request or an explicit HTTP error; it does **not** parse/replace MCP JSON-RPC itself. Limit **64 KiB** request bodies, rejecting over-size Content-Length early and unknown-length streams once 64 KiB actual bytes are read. The handler owns ordinary Content-Type, JSON-RPC and Accept validation. Avoid breaking legitimate POST, OPTIONS/preflight or other SDK-required handshake methods; do not synthesize permissive CORS. Supported Origin, if present, follows SDK v2 security requirements. Validate Host against the actual request URL/allowed preview production host names **without hardcoding future unverified domains**.

- [ ] **Step 1 — RED test:** Oversized declared/streamed bodies → `413` and no handler invocation; malformed JSON and protocol envelopes → bounded SDK error, no crash; unknown path → `404`; malicious Origin/Host → protected error; legitimate SDK POST/headers accepted; two successive stateless calls succeed; no `Access-Control-Allow-Origin: *` introduced. Explicitly test 64 KiB exact boundary and repeated abusive calls.
- [ ] **Step 2 — Run RED:** `npm --prefix mcp/qrvai-rf-worker test -- --run test/http-limits.spec.ts` plus Worker tests; ensure failures are on intended missing protections, not a malformed test client; commit RED.
- [ ] **Step 3 — GREEN code:** Apply streaming-size preflight safely with bounded buffering/reconstruction only when necessary; keep SDK request headers/content intact. Normalize fail-closed status and safe generic error bodies, never reflect request data/secrets. Do not invent IP-based guaranteed rate limiting: document that Cloudflare Free WAF/rules need actual account verification and are outside portable core.
- [ ] **Step 4 — Run GREEN:** Full protocol and body-boundary tests pass; static source test rejects `fetch(`, device APIs, account/user fields and storage bindings except the legitimate Worker `fetch` handler signature. Review CPU/memory consequences of buffering.
- [ ] **Step 5 — Review gate and commit:** Security review of protocol interoperability, 64 KiB cap, Origin/Host, log leakage and actual anonymous abuse risk. Retain limitations and commit; never claim account-level abuse protection from local tests.

### Task 6: Reproducible CI, scope audit and free-plan-safe build

**Files:** Create `.github/workflows/qrvai-rf-mcp-ci.yml`, `test/source-boundary.spec.ts`, `mcp/qrvai-rf-worker/README.md`; modify package scripts/lockfile as required.

**Interfaces:** npm `typecheck`, `test`, `test:worker`, `build:check` scripts, with `build:check` producing only a local/CI bundle preview, **never** uploading to Cloudflare. CI checks both existing `python -m unittest discover -s tests/v0 -p 'test_*.py' -v` and the isolated TypeScript MCP suite.

- [ ] **Step 1 — RED test:** `source-boundary.spec.ts` asserts `qrvai/mcp.json` absent, original five V0 Skill entrypoints present, `mcp/qrvai-rf-worker/wrangler.jsonc` contains no paid binding/secrets/routes, `package.json` has no deploy or auto-publish script, and registered tool count remains exactly one. Add an explicit workflow source check for Node 22, test jobs, npm ci, safe read-only permissions and **no deploy action**.
- [ ] **Step 2 — Run RED:** Run the source checks; expect failure until the CI workflow/scripts are present. Record local/CI red result and commit; preserve existing V0 Python tests.
- [ ] **Step 3 — GREEN configuration:** Add a new GitHub Actions workflow triggered by relevant `mcp/qrvai-rf-worker/**`, this workflow, and MCP QA/runbook paths. Use verified full commit SHA pins for upstream Actions (pin against their official repos at implementation time; **never invent hashes**), `permissions: contents: read`, Node 22, `npm ci`, `npm run typecheck`, tests/Worker tests, Wrangler dry-run/bundle check where supported, plus existing V0 suite. No Cloudflare API token, auth secret or `wrangler deploy`.
- [ ] **Step 4 — Run GREEN:** Fresh GitHub Actions run passes on exact candidate SHA; record test count and build artifact file checksums. Verify a ZIP/package source scope diff has not accidentally added V0 `mcp.json`. Inspect package dependency tree for deprecated `McpAgent`/legacy SDK imports.
- [ ] **Step 5 — Review gate and commit:** Review supply-chain, GitHub permissions, exact lockfile and no-write/no-cost behavior. Reviewer receipt must identify exact CI run, SHA and limitations; commit.

### Task 7: Deployment/host evidence model and explicit release guards

**Files:** Create `scripts/check-release-gates.mjs`, `test/release-gates.spec.ts`, `qa/mcp/host-report.example.json`; create `docs/runbooks/qrvai-rf-mcp-host-acceptance.md`.

**Interfaces:** `checkReleaseGates(evidence: unknown): string[]` as a pure offline validator, with a CLI over a supplied JSON path. Required evidence keys: `exactSourceSha`, `accountFreePlanVerified`, `quotaVerified`, `measuredWorkerCpu`, `deployedEndpointVerified`, `oldCreatorRecordAbsent`, `qrvaiNamespaceAvailable`, `freshPluginCreateAuthorized`, `newPluginIdDistinct`, `hostInvocationObserved`, `observedFollowUp`. Each can carry evidence URL/timestamp, with **false/unverified** values making promotion BLOCKED. Status labels `NOT_EXECUTED`, `BLOCKED`, `EXECUTED_PASS` require actual supporting receipts; this checker cannot create evidence.
- [ ] **Step 1 — RED test:** Feed the supplied template (all external actions **NOT_EXECUTED**) and assert a nonempty blocker list. Reject `PASS` reports with missing URL/host client, no distinct new backend ID, absent CPU/quota observation, real plugin `@QRVAI` not actually used in an **existing** conversation, or no follow-up. A fixture pretending `plugins_6acf47f502dc8191bf542fe040d484d8` is a new ID must fail. Positive schema-valid **test fixtures** must be clearly marked simulated, never a deployment receipt.
- [ ] **Step 2 — Run RED:** `npm --prefix mcp/qrvai-rf-worker test -- --run test/release-gates.spec.ts`; expected missing or incorrectly permissive gate failure; record/commit.
- [ ] **Step 3 — GREEN documentation/tooling:** Implement only the **offline guard** and a clearly non-executed host-report example. Document the user workflow: resolve legacy creator source, confirm private plugin lifecycle and namespace, separately approve staging, deploy a real read-only endpoint, verify fresh anonymous `initialize/tools/list/tools/call` and quotas, separately approve personal plugin creation, then observe `@QRVAI` and the follow-up on the actually used host. Staging and account creation must remain **manual, owner-gated operations**.
- [ ] **Step 4 — Run GREEN:** Targeted offline validator/negative fixtures and all prior suites pass; assert the default example produces BLOCKED, not PASS.
- [ ] **Step 5 — Review gate and commit:** Check no magic auth token, fake installed plugin ID, hidden deployment command or circular account permission. Record reviewer identity and commit.

### Task 8: Cloudflare Free preflight, release decision and whole-branch audit

**Files:** Create `docs/runbooks/qrvai-rf-mcp-cloudflare-free-preflight.md`; modify `mcp/qrvai-rf-worker/README.md`; Test `test/source-boundary.spec.ts` and CI acceptance scripts for docs/runbook presence. No Worker or Plugin Creator mutations.

**Interfaces:** Reviewer checklist `PRE_DEPLOYMENT_BLOCKED` until actual Cloudflare Free account/plan, shared Workers usage, CPU expectation, WAF/rate-limit eligibility, and a **separately authorized staging deployment** are evidenced. No arbitrary Cloudflare backend ID, URL or benchmark numbers are pre-filled.

- [ ] **Step 1 — RED test:** Make scope test fail if Cloudflare preflight runbook is absent, any actual endpoint is claimed without `deployedEndpointVerified`, any in-repo `qrvai/mcp.json` appears prematurely, or a release report marks full host success without actual new Plugin Creator ID and `@QRVAI` follow-up evidence. Verify docs contain explicit public-anonymous endpoint and quota-exhaustion warnings.
- [ ] **Step 2 — Run RED:** `npm --prefix mcp/qrvai-rf-worker test -- --run test/source-boundary.spec.ts`; expected fail before documentation and guard cases; record result.
- [ ] **Step 3 — GREEN documents:** Write exact Cloudflare account preflight: confirm Free plan and any account-wide shared Worker usage via official read-only API; query current Worker Free limits, validate no paid service bindings; record realistic request/CPU test metrics **only after authorized staging** and specify stop-on-exhaustion/rollback. Document public `/mcp` privacy, Origin security, 64 KiB cap, no persistent OAuth need for pure RF math, and the account plugin upgrade-lifecycle issue from [Issue #6](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6). No secrets or real endpoint placeholders are treated as deployed.
- [ ] **Step 4 — Run GREEN and final candidate verification:** Run full TypeScript, Worker, protocol, static V0 Python suites, locked dependency check and build preview on exact commit. Collect signed/linked GitHub Actions evidence. Expected current release status: **CODE_VERIFIED / DEPLOYMENT_NOT_EXECUTED / PLUGIN_BLOCKED / HOST_NOT_EXECUTED**, not a deployed-success claim.
- [ ] **Step 5 — Whole-branch scoped review:** Review all 8 task commits, dependency diffs, numeric fixture results, protocol behavior, no-auth threat model, CPU uncertainty and release barriers. Document outstanding Critical/Important/Minor findings with resolution or blocking status. **An author's separate pass is not an independently executed review.**
- [ ] **Step 6 — Commit & handoff:** Push docs and a final review ledger to the Draft PR; keep it DRAFT and **do not merge** without a later explicit owner request. Present the owner a summary of actual CI evidence and outstanding staging/account gates.

## Milestones and authority handoff

| Stage | Required evidence | Allowed authority |
| --- | --- | --- |
| Written design approved | This spec reviewed/approved on 2026-10-15 | **DONE**, enables *this plan only* |
| Implementation plan approved | Owner reviews this exact new plan, retaining Native + per-task reviews | **PENDING**, no product implementation yet |
| Source candidate implemented | Eight TDD/review gates, stable TypeScript tool, real stateless MCP integration test, exact GitHub CI | **FUTURE** after plan approval; GitHub Draft PR, **no deployment** |
| Cloudflare staging | Owner separately authorizes Worker creation and controlled external traffic; account Free/quota verified | **BLOCKED / NOT_EXECUTED** |
| Public Worker readiness | Genuine tool discovery and calls over real HTTPS, CPU/quotas, abuse boundaries and rollback recorded | **NOT_EXECUTED** until staging |
| New QRVAI personal plugin | Legacy owner-created `qrvai` source actually removed; name available; compatible plugin lifecycle and separate creation authorization | **BLOCKED** |
| Host acceptance | New plugin installed on supported ChatGPT client, real `@QRVAI` in already-open conversation + follow-up without recurring OAuth | **NOT_EXECUTED** |
| GitHub merge / public plugin sharing | Separate promotion authorization and review; private plugin remains personal | **NOT AUTHORIZED** by this plan |

## Plan self-review

- **Spec coverage:** purpose/private-vs-public, one tool/math, no OAuth, no sensitive inputs, SDK v2, Worker Free limits, stateless protocol, input/HTTP safety, reproducibility, release/account and `@QRVAI` gates each map to Tasks 1–8; no MCP Apps, future engines, logbook or CAT/PTT included.
- **Interfaces:** `convertPower` (Task 1/2) → `createServer` (Task 3) → `fetch` and `limitMcpRequest` (Tasks 4/5) → CI/tests (Task 6) → release evidence (Task 7/8). No conflicting module ownership.
- **Five review-focus classes** have explicit test steps and fail-closed behavior; coverage does not masquerade as security testing of a real public endpoint.
- **Review granularity:** eight bounded deliverables, each with an actual failing test, passing test, review receipt and source commit. Independent reviewer receipt only when actually run.
- **Proportion and scope:** tool contract and tests are pinned precisely; no implementation code or deployed URL is fabricated in this plan. Versions determined from real registry/official v2 compatibility and locked at implementation, not guessed.
- **Authority:** no Cloudflare deployment, plugin account creation/overwrite, installation, public plugin publication, repo merge or production `mcp.json` authorized by writing or approving this plan.

## Execution handoff

**Owner-selected method:** **Native with per-task review**, already specified in the project workflow. After owner approves this plan, read Superpowers `executing-plans` and use a new feature branch / Draft PR; perform eight RED→GREEN cycles and preserve observable CI/reviewer evidence. If no independent worker is available, report a separately performed author review accurately and do not call it independent certification. **Do not automatically deploy to Cloudflare, create/modify a Plugin Creator account plugin, or merge.**

**Owner review request:** Please review this exact implementation plan and confirm it captures the desired frictionless, Free-plan, RF-math-only first MCP. Plan approval would authorize only source implementation and tests, **not deployment or ChatGPT installation**.
