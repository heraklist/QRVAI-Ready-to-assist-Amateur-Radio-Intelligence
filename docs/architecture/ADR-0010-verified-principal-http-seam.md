# ADR-0010 — Verified OAuth principal MCP transport seam (Draft)

Phase 4.2.8 adds an isolated, dependency-injected `handleVerifiedMcpRequest(request, verify, config)`, exercising a real Streamable HTTP MCP server with filtered tools based on a **trusted verifier result**. The production Vercel `api/mcp.ts` retains its independently authenticated shared Bearer mode unchanged. There is **no JWT decoder, JWKS fetch, token issuer integration, OAuth discovery, client-registration, PKCE or consent flow in this PR**, and the OAuth handler is not deployed as a route.

Security invariants: fail closed on missing/invalid bearer; verifier exceptions; issuer/audience mismatches; empty principal identity; unsupported scopes. No unauthenticated JWT payload is ever interpreted as claims. The verification callback must implement JOSE signature validation and algorithm allowlist, key ID/JWKS rotation, expiry/not-before, issuer and resource audience, granted scopes, revocation and ownership mapping. The test fixture supplies synthetic principals deliberately and does NOT establish that real tokens have been authenticated.

The isolated handler uses scoped registration by trusted principal. Private station and logs tools remain excluded until trusted resource-owner resolution is implemented; requester-provided tenantId is not an ownership proof.

**Release blockers:** Choose and configure OAuth authorization server, issuer discovery and resource metadata (RFC 9728), DCR/client metadata as supported, mandatory PKCE, challenge details and appropriate 401 responses, verified end-to-end ChatGPT MCP handshake, session isolation and denial under real parallel connections, and matching-SHA protected Vercel Preview. No merge, production or protection changes.
