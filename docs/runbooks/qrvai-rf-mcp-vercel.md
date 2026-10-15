# QRVAI MCP — Vercel-only release procedure

## Scope
Node.js Vercel Function `/api/mcp` serves the four implemented read-only RF tools from a single registry: `rf_power_convert`, `rf_link_budget`, `rf_impedance`, `rf_feedline_loss`. The remaining candidate MCP tools are not implemented and must not be advertised as available. No Cloudflare runtime, Worker, account, or fallback forms part of the selected deployment architecture.

## Security
Set `QRVAI_MCP_BEARER_TOKEN` in Vercel encrypted/sensitive project environment variables; use a unique cryptographically generated secret (at least 24 characters). Never commit or log it. Without a configured token the API responds 503; requests without matching `Authorization: Bearer ...` respond 401. The endpoint rejects hostile Origin values and caps POST bodies at 64 KiB. The static token is an integration credential, **not** an interactive ChatGPT OAuth flow. Validate the target client's authentication compatibility before connecting it. Add Vercel Firewall rate limiting and spending controls before production exposure.

## Deployment gates
1. GitHub Actions TypeScript and Node+Python suites PASS on the exact deployment SHA.
2. Vercel project uses the monorepo root `mcp/qrvai-rf-worker`, Node.js 22, framework `Other` (null), and no Cloudflare dependencies.
3. Configure a private token for the intended environment and verify absent token produces 503. Protect previews through Vercel authentication when available.
4. Build the specific commit in a Vercel preview, confirm build READY, then conduct HTTPS MCP SDK `initialize`, `tools/list`, and `tools/call` with a valid credential, unauthorized/hostile-origin/oversized-payload negative cases and repeat requests.
5. Confirm provider logs and quota guardrails; production promotion requires a separate verified release gate. **NOT_DEPLOYED / NOT VERIFIED until evidence exists.**

## ChatGPT scope
No `qrvai/mcp.json`, new Plugin Creator release, actual `@QRVAI` host invocation or end-to-end claim is included in this backend implementation.
