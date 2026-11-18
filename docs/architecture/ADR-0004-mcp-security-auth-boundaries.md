# ADR-0004 — QRVAI MCP authentication & authorization boundaries

Date: 2026-10-16 · Status: **Proposed / gated** · Depends on Draft PR #27 · Vercel-only

## Observed baseline (not a security certification)

At parent SHA `3b48a3813110540821c2c264df30d39ea91ea034`, the HTTP adapter in `mcp/qrvai-rf-worker/api/mcp.ts` accepts only POST /api/mcp, rejects missing server secret with HTTP 503, uses constant-time comparison for one shared static bearer token, checks Origin and request limits, and returns a stateless JSON Streamable HTTP MCP response. No OAuth authorization server, dynamic client registration, authorization code + PKCE flow, per-user consent, signed/scoped access tokens, refresh-token rotation, or issuer discovery is present in the reviewed adapter. `test/vercel-protocol.spec.ts` locally exercises the 38 registered tools through a test-supplied secret; that does not establish public ChatGPT-host interoperability. The implementation is a **private service-key gateway**, not end-user OAuth.

Vercel SSO/Deployment Protection is a *different layer* from MCP client authentication. A deployment reaching READY does not prove that a ChatGPT host can navigate protected preview access. Never turn off deployment protection merely to make host validation pass.

## Target boundaries and approach (not implemented yet)

1. **Resource server:** keep the MCP adapter on Vercel. Require issuer-bound bearer access tokens, JWT signature validation via cached JWKS, strict algorithms, `iss`, `aud` (canonical HTTPS resource URL), `exp`, `nbf`, and clock-skew bounds. Reject bearer from query strings and never log token values. Introduce token version/rotation and auditable key IDs.
2. **Authorization server:** choose a verified OAuth 2.1/OIDC-compatible provider or explicitly implemented authorization server. ChatGPT compatibility must be independently demonstrated against the host's current requirements; an OIDC ID token is **not** an MCP access token. Implement Protected Resource Metadata discovery and Authorization Server Metadata with actual registered endpoint URLs, only after provider selection.
3. **Client onboarding:** support authorization code + PKCE S256, state, redirect URI allowlisting, per-client consent, access-token expiry, and revocation. Investigate whether ChatGPT integration requires Dynamic Client Registration or Client ID Metadata Documents. Do not assert these requirements without host acceptance evidence.
4. **Authorization per tool:** classification matrix: public-input deterministic offline calculations, user-provided datasets, private station/device state, external provider credentials, and irreversible/high-impact actions. Map scope checks at `tools/list` and `tools/call`; deny by default for station/device/profile/log read/write, not just in the UI. Avoid implying that read-only means public or non-sensitive.
5. **Tenancy:** require a real principal and tenancy identity for profile/status/log/provider integrations; never multiplex all users through the shared `QRVAI_MCP_BEARER_TOKEN`. Prevent confused-deputy and cross-tenant reads; invalidate deleted/revoked user sessions promptly.
6. **Traffic safety:** preserve Host/Origin verification, 64KiB body ceiling and no-store, add Vercel edge/WAF throttling and structured error telemetry without user secrets. Model CORS/preflight separately from bearer authentication; no permissive `*` + credentials.
7. **Secrets:** supply only via Vercel encrypted/sensitive project environment variables and correct environment scopes; do not commit, echo, or paste secrets in PRs or conversations. Prefer least-privilege provider credentials, documented rotation, immediate revocation.
8. **Fail closed:** do not enable new access paths, OAuth discovery, or public deployment before token validation and integration tests cover malformed signatures, wrong issuer/audience/scope, expired/not-before tokens, cross-tenant access, key rotation, invalid Origin, 413 oversized payloads, and denial of unconfigured auth.

## Proposed phases and evidence

| Step | Required evidence | State |
|---|---|---|
| 4.2.1 Current auth boundary audit | Actual adapter and protocol test reviewed | **DOCUMENTED** |
| 4.2.2 Provider/host auth contract | Real host compatibility research; provider tenancy, redirect and DCR choice | **OPEN** |
| 4.2.3 Secure resource-server implementation | TDD RED→GREEN and locally verified signature/scope tests | **OPEN** |
| 4.2.4 Encrypted secrets and preview | Env configuration verified without disclosing values; protected HTTPS test | **OPEN** |
| 4.2.5 Real ChatGPT connection | OAuth authorization, list 38 tools and call representative tools with a real test account | **OPEN** |
| 4.2.6 Independent security review | Dependency, logging, abuse/rate-limit and authorization matrix sign-off | **OPEN** |

**Release rule:** PR remains Draft. Neither merge to `main`, production promotion, deployment-protection relaxation, nor claims of ChatGPT/OAuth readiness are authorized by this decision record.

## 4.2.2 Protocol contract verification (2026-10-16)

The following are **normative integration requirements**, not claims of completed QRVAI functionality. References: MCP TypeScript SDK authorization guide (https://ts.sdk.modelcontextprotocol.io/v2/serving/authorization), MCP 2026-07-28 spec release (https://blog.modelcontextprotocol.io/posts/2026-07-28/), Vercel MCP OAuth deployment guide (https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel).

1. **OAuth discovery:** publish the RFC 9728 document on the *MCP resource origin* at `/.well-known/oauth-protected-resource/api/mcp` (or the path advertised by the SDK challenge, verified in tests), declaring the canonical HTTPS `resource`, trusted `authorization_servers`, available `scopes_supported`, and Bearer header transport. A 401 challenge must point to this resource metadata using `WWW-Authenticate: Bearer resource_metadata="..."`. Metadata is publicly readable even when MCP tool methods require authorization; do not set a fake issuer.
2. **Authorization Server Metadata:** issuer serves real RFC 8414 discovery with supported authorization code grant, S256 PKCE, real `authorization_endpoint`, `token_endpoint`, and public JWKS URL; client metadata/DCR support is selected only after measuring host compatibility. **Do not mirror bogus OAuth metadata from the resource server.** The 2026-07-28 MCP spec strengthens authorization issuer mix-up defense and DCR metadata.
3. **Resource indicator:** clients send RFC 8707 `resource` for the canonical MCP URL; the issuer binds access tokens to that resource. MCP resource server validates `iss`, `aud`, `exp`, `nbf`, signature/algorithm, and resource-specific scopes; never accept an OIDC ID token in place of an access token.
4. **Client onboarding decision gate:** test ChatGPT against both current client-id metadata (CIMD) and DCR/preregistered-client options; whitelist redirect URIs and review consent/refresh semantics. Do not treat a generic MCP TypeScript SDK client result as a successful ChatGPT hosted-connection test.
5. **Provider selection decision:** choose an authorization server that demonstrably supports **OAuth protected resource access tokens with resource audience**, stable JWKS, consent, rotating/expiring tokens, and the client-registration path accepted by ChatGPT. Compatible provider choice **OPEN**; neither a Vercel deployment OIDC token nor Vercel SSO substitutes for user OAuth login.
6. **Vercel caveat:** Vercel documentation illustrates a public `/.well-known/oauth-protected-resource` route. Our repository uses a Web Standard adapter rooted at `/api/mcp`; implement the **path-aware metadata** and preflight routing suitable for that adapter, verified against the deployed URL, rather than copying Next.js route-handler code into the wrong framework. Preserve deployment protection until an explicitly authorized protected-preview integration plan exists.

### Test-first acceptance cases for 4.2.3

`401` + correct resource-metadata challenge; anonymous GET metadata + OPTIONS; reject issuer/audience mismatch, unsigned or weak algorithms, expired/not-yet-valid tokens, token missing scope, and user A trying tenant B; allow valid scoped tokens for a harmless representative read-only tool; disallow discovery metadata with unconfigured issuer. Ensure authorization is enforced at both HTTP and tool invocation boundaries, and no secret/token lands in errors or logs.

**Result 4.2.2:** current normative protocol contract **documented**; **actual provider selection / ChatGPT-host acceptance still open**. Therefore 4.2.3 implementation is blocked from exposing OAuth endpoints until issuer/client details are validated; local contract tests can be developed without weakening the existing bearer gateway.
