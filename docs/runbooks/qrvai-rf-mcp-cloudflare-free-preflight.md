# QRVAI RF MCP — Cloudflare Workers Free preflight (NOT_EXECUTED)

**Status:** SOURCE REVIEW ONLY / DEPLOYMENT BLOCKED. This runbook does not create or deploy a Cloudflare Worker and contains no real endpoint or API credential. Requires **separate approval** from the owner before any staging, deployment, or Plugin Creator work.

## Design boundaries

The first remote MCP service is an **anonymous**, publicly accessible, stateless `/mcp` Worker for exactly one read-only `rf_power_convert` tool. **Private ChatGPT plugin access does not make a no-OAuth Cloudflare Worker private.** Anyone able to call the public URL may consume quota; obscuring the endpoint is not authentication.

Never send a callsign, QTH, private contact, ADIF/QSO logbook, station identity or credentials through this tool. No CAT/PTT, remote transmitter action, emergency dispatch, external API fetch, persistence, user profile, database, paid bindings or cached personal conversation data.

## Read-only account and platform preflight — no execution yet

1. Obtain **separate owner approval** to inspect the target Cloudflare account plan/quota. Check account's live Workers plan is actually **Free**; capture a dated screen/read-only API receipt without publishing identifiers or credentials to GitHub.
2. Check current limits, account-wide usage and any other Workers/Pages Functions drawing from the same pool. Official published Free guide (as of October 2026) states **100,000 requests/day across the account**, reset midnight UTC, **10 ms CPU per request**, and **50 external subrequests / 1,000 Cloudflare-service subrequests per invocation**. Those are quotas/ceilings, not measured capacity. An exceeded request budget can return **Cloudflare Error 1027**.
3. Check whether WAF/rate limiting/abuse controls are genuinely offered on this account, and whether any requested rules, WAF plans or services are paid. Apply only specifically owner-approved free protections; do not claim that bot protection or IP-limits guarantee immunity from quota exhaustion.
4. Confirm the proposed Worker has no KV, D1, R2, Durable Objects, Workers AI, browser rendering, AI Gateway, outbound `fetch`, billable integrations or secrets. All currently committed code is **GitHub source/CI preview only**. Verify `npm run build:check` is a Wrangler `--dry-run` preview and not a remote deployment.
5. Review threat model: **Host** and **Origin** protections should follow the supported MCP SDK/Cloudflare defaults; validate any production host allowlist against the actual deployed hostname before allowing real traffic. No permissive wildcard CORS, no credential reflection, no sensitive body logging.
6. Verify the portable preflight rejects oversized bodies (**64 KiB**), invalid types, unknown tool arguments and out-of-range numerical values with bounded errors. Tests are not an external penetration test; a public anonymous endpoint may still be abused.
7. Only **after new, distinct owner authorization for a controlled staging Worker**, deploy a pinned candidate and run actual Streamable HTTP `initialize`, `tools/list`, `tools/call` with correct inputs/negatives; capture real `CPU ms`, handler exceptions, request totals, quotas, source commit, endpoint version and rollback steps. If **CPU >10 ms**, service or rate-limiting unavailable, or quota exceeded: STOP, roll back; do not auto-upgrade to Paid.
8. Before fresh private ChatGPT plugin creation, separately resolve the old plugin source identity and namespace ([Issue #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3)), plus **skills-only→MCP lifecycle** ([Issue #6](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6)). Do not create a dummy MCP endpoint or modify the old creator record. Only an actual verified HTTPS endpoint may be referenced later in an owner-approved plugin package.
9. The future private host acceptance requires `@QRVAI` inside an already-open ChatGPT conversation plus a second follow-up and no repeated OAuth; use the [host acceptance runbook](qrvai-rf-mcp-host-acceptance.md). This is NOT_EXECUTED.

## Recording and stop rules

The offline `qa/mcp/host-report.example.json` starts at `NOT_EXECUTED`. The `scripts/check-release-gates.mjs` validator must report **BLOCKED** until real dated, linked receipts are present. A structure-only validator cannot verify those URLs or claim that a Worker is deployed, a private plugin is created, or `@QRVAI` works. Publish only redacted evidence; never place conversation IDs, account tokens or secrets in the public repo.

This stage authorizes **only code/tests on an unmerged Draft PR**, not Worker creation, Cloudflare dashboard edits, DNS routes, secrets, billing changes, Plugin Creator create/update/install, GitHub merge or public plugin distribution.

## Authoritative resources

- [Cloudflare Workers Free platform limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare stateless MCP transport](https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/)
- [Cloudflare stateless MCP handler](https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/)
- [GitHub Issue #6 — MCP upgrade lifecycle](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6)
