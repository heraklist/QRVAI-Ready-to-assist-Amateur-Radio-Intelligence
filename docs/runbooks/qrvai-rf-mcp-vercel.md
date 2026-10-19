# QRVAI MCP — Vercel-only release procedure

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
