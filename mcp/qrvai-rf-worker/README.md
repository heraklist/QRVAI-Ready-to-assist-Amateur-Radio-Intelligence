# QRVAI RF MCP — Vercel-only backend

The single supported runtime is a Node.js Vercel Function at `/api/mcp`. There is **no Cloudflare deployment, fallback, or dependency**. It contains read-only RF/core and live-source tools in the source tree, but source registration is not evidence of tools connected to the ChatGPT host. Providers, terms and limits: [live data and legal sources](../../docs/architecture/live-data-sources.md).

**Runtime compatibility:** Pin **Node.js 24.x** in `package.json`, lockfile and MCP CI because `unpdf@2.1.0` requires Node >=24. Vercel honors `engines.node` for function runtime selection, overriding an older project UI setting; exact deployed runtime and real Greek PDF extraction still need live verification.

## Local verification

```sh
npm ci --ignore-scripts
npm run typecheck
npm test            # unit tests, network mocked
npm run smoke:live  # calls every live provider for real; needs outbound HTTPS
```

Behind an HTTPS proxy (for example a sandbox), run the smoke test with `NODE_USE_ENV_PROXY=1` so Node's `fetch` uses it.

## Access mode — private preview, NOT public release

The active Vercel `/api/mcp` handler is **fail-closed**: `PUBLIC_UNAUTHENTICATED=false`. If `QRVAI_MCP_BEARER_TOKEN` is absent or has fewer than 24 characters, the handler returns 503; a configured strong secret is required on each request. This is a **shared deployment credential**, not a verified user account, OAuth client grant, tenant identity, or completed ChatGPT MCP authentication.

The RFC 9728 metadata helper has offline unit tests; its deployed Vercel adapter intentionally returns **503 even when issuer/resource environment values are present** because the real MCP endpoint has not yet been wired to resource-bound OAuth. Its compile-time `OAUTH_MCP_HTTP_WIRED=false` must remain false until the same reviewed change integrates and verifies the HTTP OAuth authorization boundary. Do not claim the OAuth server/host is available or switch to public/anonymous mode as a workaround.

The handler denies invalid Origins, non-POST methods, unknown paths, and oversize request bodies. The preview throttle is per warm instance, not a distributed production quota. See [OAuth compatibility decision](../../docs/architecture/ADR-0014-supabase-oauth-mcp-compatibility.md) and [resource binding gate](../../qa/mcp/RESOURCE-PARAMETER-GATE-2026-11-17.md).

`rf_feedline_loss` interpolates (`log_log` power-law, recommended for coax, or the original `log_frequency`) exclusively user-supplied, unverified cable profiles within their supplied frequency domain; no manufacturer certification, cable database, or extrapolation is implied. RF calculations are mathematical tools, not live radio hardware integrations. No CAT/PTT, devices or personal logbooks.

See [Vercel release gates](../../docs/runbooks/qrvai-rf-mcp-vercel.md). **Deployment/host invocation are NOT VERIFIED** until separately observed.
