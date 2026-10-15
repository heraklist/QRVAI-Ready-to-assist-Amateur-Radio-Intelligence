# QRVAI RF MCP — Merged source, Cloudflare deployment not yet verified

First slice of a **private personal QRVAI plugin's proposed tooling**: two **potentially publicly reachable**, read-only RF calculators exposed by a stateless Cloudflare Workers Streamable HTTP MCP server at `/mcp`.

**NOT INSTALLED. NOT DEPLOYED. NO HOST E2E.** The source was merged through [PR #9](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/9). User-approved [spec](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/blob/docs/qrvai-cloudflare-free-authless-mcp-design-20261015/docs/superpowers/specs/2026-10-15-qrvai-cloudflare-free-authless-rf-mcp-design.md) and [plan](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/blob/docs/qrvai-cloudflare-free-authless-mcp-design-20261015/docs/superpowers/plans/2026-10-15-qrvai-cloudflare-free-authless-rf-mcp.md).

## Development checks

Node.js 22 and npm required. At repository root:

```sh
cd mcp/qrvai-rf-worker
npm ci --ignore-scripts
npm run typecheck
npm test
npm run test:worker
npm run build:check
```

`npm run build:check` uses **`wrangler deploy --dry-run` only** and must not upload any Worker or secrets. The test/CI scripts do not call the Cloudflare API or Plugin Creator.

`rf_link_budget` requires all seven explicit link quantities (TX W, TX/RX gains dBi, three loss components dB, receiver sensitivity dBm), returns a stage-by-stage received power and margin. It does not predict propagation, estimate path loss, or certify station performance.\n\n`rf_power_convert` takes `{value,unit}` (units: `W`, `mW`, `dBm`, `dBW`) and returns bounded finite unit conversions, **-270 ≤ dBm ≤ 270**. No callsign, QTH, station details, logs, CAT/PTT, live data, authorization judgement, third-party APIs, storage, OAuth or device access.

## Privacy and plan limits

A **private ChatGPT plugin does NOT make its unauthenticated Cloudflare MCP endpoint private**. Anonymous clients can call any later deployed public endpoint and consume its shared Workers Free quota. Use no personal data. Current Cloudflare Workers Free limits are **100,000 requests/day per account**, **10ms CPU per request**, and **50 external subrequests/invocation**; actual plan/quotas, runtime CPU, rate limiting and abuse controls must be observed in an **authorized** real staging environment before rollout.

No `qrvai/mcp.json` is committed in this slice; the old creator-record identity issue and skills-only→MCP lifecycle compatibility remain [gated](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6).

Source tests are not actual Cloudflare measurements and do not prove working `@QRVAI` host invocation.
