# QRVAI RF MCP — Vercel-only backend

The single supported runtime is a Node.js Vercel Function at `/api/mcp`. There is **no Cloudflare deployment, fallback, or dependency**. The RF registry currently implements four read-only tools: `rf_power_convert`, `rf_link_budget`, `rf_impedance`, and `rf_feedline_loss`. The proposed larger MCP catalog is not yet implemented.

## Local verification

```sh
npm ci --ignore-scripts
npm run typecheck
npm test
```

Set `QRVAI_MCP_BEARER_TOKEN` only as a Vercel protected project environment secret (unique, high entropy, >=24 characters). Missing secret blocks the endpoint with 503. All requests require `Authorization: Bearer <token>`. The MCP SDK uses stateless Streamable HTTP, rejecting unauthorized clients, hostile Origins, invalid methods, and oversized requests. Token-based authentication may not meet every ChatGPT client OAuth expectation; verify the host contract independently.

`rf_feedline_loss` interpolates exclusively user-supplied, unverified cable profiles within their supplied frequency domain; no manufacturer certification, cable database, or extrapolation is implied. RF calculations are mathematical tools, not live radio hardware integrations. No CAT/PTT, devices, logs, or live propagation.

See [Vercel release gates](../../docs/runbooks/qrvai-rf-mcp-vercel.md). **Deployment/host invocation are NOT VERIFIED** until separately observed; four tools are implemented, not 38.
