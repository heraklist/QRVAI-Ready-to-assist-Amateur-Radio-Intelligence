# QRVAI MCP — Vercel-only host acceptance / release runbook

> **CURRENT SOURCE TRUTH — 2026-11-16.** Historical notes dated 2026-10-15 and 2026-11-14 below are preserved for audit only; they are not current instructions to publish or relax Deployment Protection. The [consolidated source Draft PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53) remains unmerged. The bounded HTTPS verifier regression is reviewed separately in [Draft PR #54](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/54).

## Active V1 source contract — NOT host accepted

- Vercel-only backend: `mcp/qrvai-rf-worker/api/mcp.ts`, path `/api/mcp`; **54 source-registered read-only MCP descriptors = 38 canonical P0 + 14 V1 + 2 international offline**. The latter may depend on third-party providers; registration is not provider availability, freshness, quota approval or licensing.
- Build/runtime: `mcp/qrvai-rf-worker/package.json` requires **Node.js 24.x**, because `unpdf@2.1.0` requires Node >=24. GitHub RF/P1 CI uses Node 24. The *effective* deployed Vercel Function runtime and successful extraction of real Greek Gazette PDFs are **NOT VERIFIED** by this.
- **Current source auth mode**: `PUBLIC_UNAUTHENTICATED=false`, fail-closed HTTP 503 without a configured Bearer secret (and 401 on absent/invalid Bearer when configured). The legacy optional public mode exists only as a test-injected transport parameter. Do not disable Vercel SSO, set public domains, change Firewall or use production without separate security/owner approval. Source contains privileged-tool authentication foundations but no verified per-user identity binding on the public endpoint.
- Latest inspected deployment at source SHA `e2739d75c78b2cec0e6941924b6345f33b248881` was a **READY protected Vercel preview**, target `null` in provider listing. It proves neither public HTTPS `initialize` nor `tools/list`, live tool calls, regulatory accuracy or ChatGPT host acceptance. GitHub CI is isolated from live providers.
- Vercel Firewall/rate-limiting state **not established**: previous provider inspection returned access denied/not_found; do not infer present or absent protections. Confirm effective WAF, request-size/concurrency/time bounds, provider quotas and metering in an authorized owner-scoped session. Keep private test access protected until measured.
- Deferral decision: user login, OAuth/IdP, tenant administration and personal club records follow *after* a separately approved private V1 host pilot. This does not waive transport or read-only, scope, privacy and quota controls.

> **International implementation receipt:** [2026-11-16 evidence ledger](../implementation/2026-11-16-qrvai-international-implementation-ledger.md). `regulatory_context` returns country source coverage and `INDETERMINATE` (no automatic TX decision); `academy_catalog` serves nine bilingual hobby modules. Neither needs external providers. Every new tool extends the SDK inventory and requires exact-SHA CI and protected host acceptance. Source changes are not proof of deployed runtime behavior.

## Operator verification sequence — future gated actions

1. **Exact SHA:** Confirm reviewed GitHub commit and relevant RF/P1/V0/V1/UI workflow outcomes. A `READY` preview or green unit tests cannot be substituted for protocol acceptance.
2. **Protected preview first:** With separate owner security approval, establish access to a protected nonproduction Vercel deployment; verify actual Node 24 runtime logs and bounded successful `unpdf` extraction of an official Greek Gazette PDF with page/provenance, and safe refusal on PDF/source failures. Do not bypass SSO to make a smoke check pass.
3. **Real HTTPS MCP:** From an authorized client only, set `QRVAI_MCP_URL` to the clean HTTPS `.vercel.app/api/mcp` endpoint and a mandatory preview-scoped Bearer token **in private secret storage**. From `mcp/qrvai-rf-worker`, run `npm ci` and `npm run verify:https`. The opt-in script now expects **54 read-only tools**, checks SDK initialization/list, first four deterministic RF calls and invalid Origin/oversized/unknown tool. It is **NOT** a full 52-tool live call smoke and does not itself authenticate through Vercel SSO. If the caller cannot pass deployment protection, report `BLOCKED`; do not remove protection.
4. **Provider/legal negative matrix:** Validate 14 new provider-connected tools, 15 live smoke scenarios with controlled quotas and date/SHA evidence, HTTPS method/batch/path failures, safe `PROVIDER_UNAVAILABLE`, synthetic-only private-data behavior, effective-date/pinpoint legal citations and `INDETERMINATE` for unverified rights. No provider writes or on-air/device operations.
5. **Release gate:** independent security/legal review, explicit owner sign-off on quotas, protected endpoint mode, host pilot and rollback. Private Plugin Creator identity/installation and real ChatGPT `@QRVAI` E2E are **separately authorized future work**. No `main` merge or production promotion is implied by this runbook.

## Historical instructions and 2026-10-15 stage evidence — NOT CURRENT RELEASE PROCEDURE

The sections below record previous four-tool, Bearer-only, Node-22 experiments; their assertions and proposed actions have been superseded. Use the active V1 contract above for all new verification and do not carry over historical exposure advice.

## Scope
Node.js Vercel Function `/api/mcp` serves the four implemented read-only RF tools from a single registry: `rf_power_convert`, `rf_link_budget`, `rf_impedance`, `rf_feedline_loss`. The remaining candidate MCP tools are not implemented and must not be advertised as available. No Cloudflare runtime, Worker, account, or fallback forms part of the selected deployment architecture.

## Security
Set `QRVAI_MCP_BEARER_TOKEN` in Vercel encrypted/sensitive project environment variables; use a unique cryptographically generated secret (at least 24 characters). Never commit or log it. Without a configured token the API responds 503; requests without matching `Authorization: Bearer ...` respond 401. The endpoint rejects hostile Origin values and caps POST bodies at 64 KiB. The static token is an integration credential, **not** an interactive ChatGPT OAuth flow. Validate the target client's authentication compatibility before connecting it. Add Vercel Firewall rate limiting and spending controls before production exposure.

## Deployment gates
1. GitHub Actions TypeScript and Node+Python suites PASS on the exact deployment SHA.
2. Vercel project uses the monorepo root `mcp/qrvai-rf-worker`, configured Node.js 22 (provider logs may report Node.js 24 runtime; verify compatibility), framework `Other` (null), and no Cloudflare dependencies.
3. Configure a private token for the intended environment and verify absent token produces 503. Protect previews through Vercel authentication when available.
4. Build the specific commit in a Vercel preview, confirm build READY, then conduct HTTPS MCP SDK `initialize`, `tools/list`, and `tools/call` with a valid credential, unauthorized/hostile-origin/oversized-payload negative cases and repeat requests.
5. Confirm provider logs and quota guardrails; production promotion requires a separate verified release gate. A build that is READY with a 503 security response does NOT prove authenticated MCP protocol operation.

## ChatGPT scope
No `qrvai/mcp.json`, new Plugin Creator release, actual `@QRVAI` host invocation or end-to-end claim is included in this backend implementation.

## Observed preview evidence — 2026-10-15
- Vercel team: `team_ct4GFO7f5D2BxLfZ7qBsU9BR` (Hobby); project: `prj_4c6IeOARTJOqEIaLlMx1rCDTGLKa` (`qrvai-rf-mcp`); GitHub-linked feature branch, protected by Vercel Authentication.
- Commit `d11d8ff485ff6fcb19c96b97cf1e8ff03b1a1c1c`, deployment `dpl_8RdtQxDZcvjFFHkqaefwK3BDeMPN`, provider state `READY`. Actual runtime logs identify `environment=preview`; the generic deployments API represented the target as `null`, so this must not be confused with a production rollout.
- HTTPS GET `/api/mcp` returned HTTP **503**, `MCP authentication not configured`, `cache-control: no-store`, proving fail-closed routing and module load. This does **not** prove authorized `initialize`, `tools/list`, or `tools/call` over Vercel HTTPS.
- Prior deployed runtime errors (missing TS source in bundle, Node-style handler receiving non-Web Request) were fixed with `includeFiles` and a Web Standard `fetch` function export; current SHA passed GitHub CI. Two manually submitted deployments with unclear/wrong targeting were canceled; Git-linked feature-branch previews built automatically afterward.
- **AUTHENTICATED HTTPS MCP: NOT VERIFIED; PRODUCTION MCP RELEASE: BLOCKED; PLUGIN/CHATGPT E2E: NOT EXECUTED.**

## Stage 01 live security verification ledger — 2026-10-15

- **Provider:** Vercel only; project `prj_4c6IeOARTJOqEIaLlMx1rCDTGLKa`, Hobby team `team_ct4GFO7f5D2BxLfZ7qBsU9BR`.
- **Provider truth:** project API `live:false`; `ssoProtection.enabled:true`, deploymentType `all_except_custom_domains`; protected Git feature-branch preview builds READY. The latest preview URL is not a verified client-ready authenticated MCP integration.
- **Credentials:** API attempt to list environment-variable metadata returned **403 forbidden**. No claim that `QRVAI_MCP_BEARER_TOKEN` exists; fail-closed 503 was observed earlier. Do not log/commit/disclose credential values. Provision an isolated cryptographically strong Preview-only secret through authorized secure dashboard/CLI and redeploy exact reviewed SHA.
- **Firewall:** GET active firewall config returned 404 `Seawall Config not found`; no published rate-limit rule evidenced. Vercel docs say Hobby has **one WAF rate-limiting rule per project**, IP/JA4 keys, fixed windows 10s–10min. There can be metered allowed-request costs, so review provider usage terms and explicit owner spend controls before enabling.
- **Negative regression suite:** exact Git SHA `9d2e2128fbaa83926e6f04a7ffb3e2696b35a067`, RF CI `38758139346` SUCCESS, 77/77 Node PASS, 49 Python PASS; V0 CI `38758140030` SUCCESS. Tests cover query token smuggling rejection, invalid credentials, hostile Origin, Host mismatch, 64KiB overrun, missing path and unsupported HTTP method.
- **Real HTTPS protocol checklist still OPEN:** authorized MCP initialize, tools/list, calls of all four RF functions, unsupported-tool rejection, invalid-token HTTP 401 and valid-token response headers; repeat via protected exact SHA preview. A normal URL GET `503` without env token is proof of deny-by-default only.
- **Hobby guardrails:** official documentation says Hobby stops service beyond certain allocation limits rather than simply charging overages, but usage, billing eligibility and future upgrade options must still be checked in team dashboard. No automatic plan upgrade, paid WAF purchase or production promotion.
- **Release state:** Stage 01 NOT COMPLETE, PR #17 remains DRAFT; no production and no ChatGPT Plugin Creator mutation authorized here. Credential environment access/permissions is an operational blocker requiring a team account with the appropriate privileges.

## Reproducible live HTTPS acceptance — operator-only

An opt-in harness exists at `mcp/qrvai-rf-worker/scripts/verify-https.mjs`. It requires a REAL deployed Preview Bearer secret and a complete HTTPS endpoint. It cannot be run successfully against a fail-closed deployment reporting 503. From a private terminal on an authorized client machine:

```sh
cd mcp/qrvai-rf-worker
npm ci
# Provide QRVAI_MCP_URL and QRVAI_MCP_BEARER_TOKEN from private secret storage.
# Do not put literal secret values in shell history, GitHub Actions logs or chat.
npm run verify:https
```

The script rejects non-HTTPS, unexpected paths, query-string credentials and non-Vercel hostnames. It verifies missing/invalid token 401, hostile Origin 403, oversized body 413; runs real MCP initialize via SDK, tools/list with four read-only annotations, numeric calls to all four RF functions, and unknown-tool denial. It never prints the credential. Note: Vercel Authentication deployment protection must be satisfied separately by the caller (for example authenticated `vercel curl` or appropriately scoped trusted identity). Neither a 503 nor a READY build passes these checks.

**Connector permission diagnosis:** A team-member lookup confirms one member with role `OWNER`, while the app's project-env metadata read still fails 403. This is evidence of a **connection/API authorization discrepancy**, not evidence the human owner lacks team permissions. Do not assume a successful owner lookup grants environment-variable access. Check or reconnect Vercel plugin permissions and use a securely authenticated owner-side dashboard/CLI if the connector cannot access them. Firewall active configuration still responds 404; do not assume a rule is present.

**Operational safeguard:** Never include a bearer token in a URL, a PR, test fixtures, an issue comment, or a Vercel shareable link. Preview-only secret creation and full protected-transport verification remain release blockers.


## 2026-11-14 — HISTORICAL public-first design note (not public-exposure approval)

Owner decision: deploy on Vercel **without authentication first**; authentication follows in a later phase. `api/mcp.ts` exports `PUBLIC_UNAUTHENTICATED = true`. With no `QRVAI_MCP_BEARER_TOKEN` the endpoint serves MCP to any caller; a configured token is still enforced, and a weak token answers 503 rather than falling back to public. At that date 38 canonical source tools were registered; the current V1 registry has **52 at that historical time**. Source read-only annotations and stateless behavior alone do **not** establish production safety, provider quotas, legal correctness or data-access guarantees. The earlier sections of this runbook describing a mandatory Bearer token are historical.

Remaining steps before ChatGPT can reach it, none executed yet (**NOT VERIFIED**):

1. **Superseded historical suggestion:** making MCP publicly reachable is NOT approved. Keep SSO/preview protections until an owner-approved security and quota acceptance.
2. Verify actual Firewall/rate-limit state and owner-approved provider-quota policy before proposing any rule change; no mutation is authorized by this historical note.
3. Run `QRVAI_MCP_URL=https://<host>/api/mcp npm run verify:https` (no token = public-mode checks).
4. Only after separate owner approval, secure host proof and Plugin Creator acceptance may a private plugin reference the endpoint.
