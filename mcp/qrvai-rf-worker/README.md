# QRVAI RF MCP — Merged source, Cloudflare deployment not yet verified

First slice of a **private personal QRVAI plugin's proposed tooling**: four **potentially publicly reachable**, read-only RF calculators (including the M09 review candidate) exposed by a stateless Cloudflare Workers Streamable HTTP MCP server at `/mcp`.

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

`rf_feedline_loss` (M09 candidate) accepts `{profile:{id,revision,points:[{frequency_hz,loss_db_per_100m},...]},frequency_hz,length_m,connector_loss_db,interpolation_method:"log_frequency"}`. It interpolates user-supplied, **unverified** dB/100 m samples inside their frequency limits, returning cable/connector attenuation, delivered-power ratio and the exact supporting series. There is **no** manufacturer profile lookup, external cable database, frequency extrapolation or automatic verification of data rights. Use only data you are entitled to provide. Synthetic test fixtures are not commercial cable specifications.

`rf_impedance` accepts {r_ohm, x_ohm, z0_ohm} and calculates complex Gamma, VSWR and return loss for a passive load. Perfect-match return loss and total-reflection VSWR use typed null/status instead of Infinity in JSON. No VNA hardware data is accessed.\n\n`rf_link_budget` requires all seven explicit link quantities (TX W, TX/RX gains dBi, three loss components dB, receiver sensitivity dBm), returns a stage-by-stage received power and margin. It does not predict propagation, estimate path loss, or certify station performance.\n\n`rf_power_convert` takes `{value,unit}` (units: `W`, `mW`, `dBm`, `dBW`) and returns bounded finite unit conversions, **-270 ≤ dBm ≤ 270**. No callsign, QTH, station details, logs, CAT/PTT, live data, authorization judgement, third-party APIs, storage, OAuth or device access.

## Privacy and plan limits

A **private ChatGPT plugin does NOT make its unauthenticated Cloudflare MCP endpoint private**. Anonymous clients can call any later deployed public endpoint and consume its shared Workers Free quota. Use no personal data. Current Cloudflare Workers Free limits are **100,000 requests/day per account**, **10ms CPU per request**, and **50 external subrequests/invocation**; actual plan/quotas, runtime CPU, rate limiting and abuse controls must be observed in an **authorized** real staging environment before rollout.

No `qrvai/mcp.json` is committed in this slice; the old creator-record identity issue and skills-only→MCP lifecycle compatibility remain [gated](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6).

Source tests are not actual Cloudflare measurements and do not prove working `@QRVAI` host invocation.
