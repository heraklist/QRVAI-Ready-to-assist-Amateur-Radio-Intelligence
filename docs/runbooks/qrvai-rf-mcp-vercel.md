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
