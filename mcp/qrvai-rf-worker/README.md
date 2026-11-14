# QRVAI RF MCP — Vercel-only backend

The single supported runtime is a Node.js Vercel Function at `/api/mcp`. There is **no Cloudflare deployment, fallback, or dependency**. The RF registry currently implements four read-only tools: `rf_power_convert`, `rf_link_budget`, `rf_impedance`, and `rf_feedline_loss`. The proposed larger MCP catalog is not yet implemented.

## Local verification

```sh
npm ci --ignore-scripts
npm run typecheck
npm test
```

## Access mode

**First release is public and unauthenticated** (owner decision, 2026-11-14; `PUBLIC_UNAUTHENTICATED` in `api/mcp.ts`). Every tool is a stateless, read-only function of its own request body, so no stored or personal data is reachable. Anyone who knows the URL can call it and consume the Vercel quota; add a Vercel Firewall rate-limit rule before sharing the URL.

If `QRVAI_MCP_BEARER_TOKEN` (unique, high entropy, >=24 characters) is set in the Vercel project, it is always enforced with `Authorization: Bearer <token>`. For the authentication phase, set `PUBLIC_UNAUTHENTICATED` to `false`: the endpoint then answers 503 until a token is configured. In both modes the handler rejects hostile Origins, non-POST methods, unknown paths and bodies over 64 KiB.

`rf_feedline_loss` interpolates (`log_log` power-law, recommended for coax, or the original `log_frequency`) exclusively user-supplied, unverified cable profiles within their supplied frequency domain; no manufacturer certification, cable database, or extrapolation is implied. RF calculations are mathematical tools, not live radio hardware integrations. No CAT/PTT, devices, logs, or live propagation.

See [Vercel release gates](../../docs/runbooks/qrvai-rf-mcp-vercel.md). **Deployment/host invocation are NOT VERIFIED** until separately observed; four tools are implemented, not 38.
