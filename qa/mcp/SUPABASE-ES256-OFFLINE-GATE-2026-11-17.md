# QRVAI — Supabase ES256 verifier offline gate (2026-11-17)

**Status:** cryptographic adapter tested offline; **OAuth/MCP host integration BLOCKED**. Applies to Draft PR #53 only. Neither public release nor production routing is approved.

## Facts checked against the dedicated qrvai-auth project

- Supabase project ID: ujhkqfvxpgpkearukvmh; issuer exactly https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1.
- OAuth authorization-server discovery: HTTP 200 at https://ujhkqfvxpgpkearukvmh.supabase.co/.well-known/oauth-authorization-server/auth/v1; advertises authorization_code, refresh_token and PKCE S256.
- Issuer JWKS: HTTP 200 at https://ujhkqfvxpgpkearukvmh.supabase.co/auth/v1/.well-known/jwks.json; observed an EC / P-256 / ES256 signing key. Do not pin a time-varying kid in source.
- Discovery currently does not advertise registration_endpoint or authorization_response_iss_parameter_supported. ChatGPT may require the callback-ID-specific redirect URI and a pre-registered client; use the exact values displayed by the host.
- The Auth settings API returned disable_signup=true and mailer_autoconfirm=false; the Supabase project reported no Auth users or OAuth clients during the prior read-only inspection.
- Supabase OAuth supports OIDC scopes (openid, email, profile, phone) but not custom QRVAI scopes. Standard scopes are not the QRVAI tool authorization policy.

## Source changes under this gate

- src/http/oauth-verify.ts now accepts acceptedAlgorithm ES256 only if explicitly configured. The existing default remains RS256; algorithm is never selected from untrusted JWT headers.
- For ES256 the verifier requires exactly one issuer-owned EC / P-256 / verify-eligible key matching kid, and checks a 64-byte JOSE ECDSA signature using IEEE P1363 encoding.
- It checks HTTPS issuer and same-origin JWKS URL, exact signed issuer, one exact resource audience (no multi-audience or generic authenticated token), expiration, not-before, non-empty subject and an explicitly required scope. Unknown critical JOSE headers are refused.
- test/oauth-es256.spec.ts contains only synthetic signing keys and offline JWKS fixtures. No private keys, bearer tokens, users or secrets are stored in the repo.
- The existing test/oauth-signed.spec.ts RS256 tests remain as a backwards-compatibility gate.

**Local TDD evidence:** Before the change, the new ES256 tests produced four failures from the unsupported algorithm. After implementation, 9/9 new tests + 5/5 pre-existing RS256 tests passed locally on Node 22.16.0. Full repo CI on the configured Node 24 workflow must be checked independently after the GitHub commit.

## Hard no-go conditions

1. **No OAuth wiring to /api/mcp yet.** The HTTP route still uses its configured shared Bearer secret and fails closed without it; the verifier is not called by the route. A synthetic verified token does not authorize an MCP tool.
2. **Resource binding not demonstrated.** ChatGPT sends resource in authorization and token requests. Verify that Supabase returns a signed access token restricted to the exact QRVAI MCP audience before OAuth resource access; never accept aud=authenticated.
3. **No client/user permission mapper yet.** Require a trusted OAuth client_id, verified identity and server-owned grants/tenant membership before granting internal qrvai:tools:read or qrvai:user-data:process permission. An external openid/email scope grants no private station/log data.
4. **No completed consent path.** An invited user must see who requests what, approve or deny, and return through the exact ChatGPT callback; do not auto-consent or enable public signup.
5. **No unprotected host connectivity.** Keep Vercel preview authentication and production protections; no permanent bypass links, publication, DNS switch, secret rotation or production deployment is authorized by this change.
6. **No ChatGPT MCP acceptance claim.** The private skills-only plugin does not expose the 54 backend tools. Live OAuth + tools/list + authorized action still require isolated host acceptance and exact deployment SHA evidence.

## Sources

- Supabase OAuth 2.1 flows / scopes: https://supabase.com/docs/guides/auth/oauth-server/oauth-flows
- Supabase MCP authentication: https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication
- OpenAI Plugins OAuth contract: https://developers.openai.com/plugins/build/auth
- Existing design: docs/architecture/ADR-0014-supabase-oauth-mcp-compatibility.md
