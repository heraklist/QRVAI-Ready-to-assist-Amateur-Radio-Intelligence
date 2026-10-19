# QRVAI RF MCP — Vercel-only host acceptance (NOT EXECUTED)

**Purpose:** gated acceptance for the *first new* QRVAI private plugin after a verified Vercel HTTPS MCP endpoint is available. This is a runbook, not execution evidence.

1. Verify exact source SHA and clean GitHub CI; the Node.js Vercel Function is the only deployment backend at `/api/mcp`. Do not deploy, configure, or invoke Cloudflare.
2. Verify the Vercel team's plan and usage controls, Vercel project and nonproduction deployment protection; preview deployment MUST be reported with `target: preview`. An unexpected production target must be canceled. Validate protected `QRVAI_MCP_BEARER_TOKEN` storage and fail-closed 503 without secret; 401 with invalid authorization.
3. Establish supported real ChatGPT/plugin MCP client authentication method (including OAuth if required). Bearer integration credentials alone do not demonstrate ChatGPT client compatibility. Record observed evidence, not presumed support.
4. Verify actual TLS and MCP initialize, tools/list and tools/call against the Vercel URL using a valid test credential. Check all four implemented read-only RF tools, 100 W = 50 dBm, 1 mW = 0 dBm, malformed requests, hostile Origin, request size and rate limiting; capture redacted response status, duration, and audit logs.
5. Only after verified HTTPS, quotas and distinct-ID account clearance, create the new Plugin Creator record with the five V0 Skills and actual MCP descriptor. Never reuse the historical `qrvai` creator record or publish dummy URLs. Installation and real `@QRVAI` invocation remain deferred until separately authorized.
6. Verify the first `@QRVAI` invocation and follow-up occur in the **same previously opened conversation**; retain redacted receipts outside the public repo.
7. If any gate fails, record BLOCKED / NOT_EXECUTED. A passing offline receipt-shape check never proves real deployment or client execution.

`qa/mcp/host-report.example.json` is intentionally NOT_EXECUTED, and `scripts/check-release-gates.mjs` must reject it. Historical Cloudflare specifications are archival design history, not active deployment requirements.
