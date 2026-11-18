# QRVAI — OAuth / ChatGPT MCP go-live gates

**Checkpoint:** 2026-11-18; Draft [PR #53](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/53), [issue #58](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/58).

**Invariant:** keep the single existing private ChatGPT plugin `plugins_6acf47f502dc8191bf542fe040d484d8`; never create a second plugin. No autonomous production enablement, Vercel SSO bypass, secrets in Git, public sign-up, private station/log tools or proof claims from synthetic tokens.

## Verified completed (actual DB and CI)

- The dedicated Supabase Auth project `ujhkqfvxpgpkearukvmh` is available. Migrations **20261118032317**, **20261118032948**, **20261118033100** applied. Effective `public.qrvai_mcp_grants` is empty, RLS ENABLE + FORCE, zero client policies, no anon/authenticated access, `service_role` SELECT only, and explicit issuer+subject+client_id binding with read-only grant lookup.
- An **inert** SQL custom access-token hook function exists and has `supabase_auth_admin` EXECUTE only. It is **not selected/configured in Supabase Auth**. PostgreSQL live regression retained original `aud=authenticated` for seven no-grant/wrong-identity client scenarios. A pinned audience in a hook is **not** RFC 8707 resource processing.
- Source-level ES256/JWKS verifier and pilot principal adapter require exact `iss`, exact `aud=https://qrvai-rf-mcp.vercel.app/api/mcp`, cryptographically signed OAuth `client_id` and active matching server-owned grant. QRVAI tool grants never come from OIDC scope/claims, including when the JWT omits a scope claim. 54 tools have reviewed explicit classification; station and log operations remain blocked.
- GitHub automated checks passed 5/5 on the source checkpoint; Vercel builds only READY protected previews. This is **not** real production, host, login or access-token acceptance.

## Hard release blockers (not waived)

1. **RFC 8707:** [Supabase Auth #2610](https://github.com/supabase/auth/issues/2610) remains OPEN (checked 2026-11-18). The upstream report says OAuth `resource` is ignored and `aud=authenticated` minted. An auth hook setting a fixed audience after a grant is NOT independent evidence of requested-resource validation at **both authorize and token**. Do not accept a regular `aud=authenticated` token, silently downgrade or infer authorization from `openid`.
2. **Consent path:** [Supabase Auth #2820](https://github.com/supabase/auth/issues/2820) remains OPEN (checked 2026-11-18); users report `GET /oauth/authorizations/{authorization_id}` may HTTP 400 for `resource`, `offline_access` or a public client. Reproduce/test with the exact ChatGPT public client, scopes and callback before depending on the provider; do not treat report as a local confirmed repro.
3. **Client identity:** Supabase [#2850](https://github.com/supabase/auth/issues/2850) is OPEN and requests CIMD support. Use approved pre-registered public client or DCR *only if supported in actual project discovery and client management*. ChatGPT's exact callback URL and client ID **must come from its management UI**, not be guessed. Do not open DCR globally for private use without review.
4. **Real account and consent:** the project still has 0 `auth.users` and 0 `auth.oauth_clients`; no invited identity or verified consent UX. Build login+Approve+Deny flow with Supabase `getAuthorizationDetails(authorization_id)`, `approveAuthorization`, `denyAuthorization`; protect authorization_id and CSRF/state, display request client and scope, and do not log codes/tokens.
5. **Host:** canonical verified Vercel project domain `qrvai-rf-mcp.vercel.app` currently has no verified public deployed production MCP resource. Protected Preview (`target:null`) is not ChatGPT-reachable. Keep production promotion, domain changes and SSO bypass behind separate release review.
6. **Runtime:** `api/mcp.ts` still uses a shared bearer only (or 503). `api/oauth-protected-resource.ts` hardcodes `OAUTH_MCP_HTTP_WIRED=false`. The composed `createSupabaseOAuthPilotHandler` remains source-only. No backend `sb_secret_*` configured or live grant row; no production resource JWT yet.
7. **ChatGPT acceptance:** no end-to-end OpenAI OAuth/PKCE callback, per-user JWKS/audience/client verification, exact URL `WWW-Authenticate` discovery, MCP `tools/list`, `academy_catalog` invocation or same-session follow-up proven. Existing plugin remains skills-only, unmodified.

## Controlled activation sequence (all evidence required)

**A — Provider decision:** Verify a real Supabase authorize+token+resource flow after upstream fixes; record *redacted* authorize/token request resource URIs, parsed verified `aud`, issuer, signed `client_id`, approved scope, S256 and a second-resource negative attempt. Do not save codes, access or refresh tokens. If unavailable, independently review a standards-compliant managed issuer or broker with Supabase as the identity store; preserve exact resource binding and consent. No acceptance of `aud=authenticated`.

**B — ChatGPT registration:** In the existing QRVAI plugin management UI, obtain the exact OAuth callback and supported registration mode. Configure the registered public client and exact redirect in Supabase Auth (no invented client ID); keep the connection PRIVATE. The [OpenAI auth guide](https://developers.openai.com/plugins/build/auth) describes callback-ID-specific `https://chatgpt.com/connector/oauth/{callback_id}` when issuer identification is not supported and the stable callback only when its requirements are met.

**C — Consent and user:** In Supabase Authentication > OAuth Server, validate enabled server, exact site URL/authorization path and client redirect. Deploy a properly session-protected consent page and create one expressly invited pilot identity. Confirm Approve and Deny in separate end-to-end tests including `resource` and any requested `offline_access` before activation.

**D — Grants and signing:** Only after verified user/client IDs exist, set a narrowly scoped expiring server-owned grant using a reviewed administrator path. Confirm live RLS and grant revocation. Configure the Auth hook only with documented, observed `authentication_method`, claims and refresh behavior, if retained in approved architecture. Keep server-only `sb_secret_*` as an environment secret, send it as the Supabase API `apikey`, not Bearer or client-side JavaScript. Never provision a secret in Git.

**E — HTTP wiring and hosting:** Only after A–D pass, mount the reviewed verifier in the existing canonical `/api/mcp` and enable RFC 9728 metadata/401 challenge **atomically**, not by an unreviewed runtime feature flag. Maintain per-request grant checks, tenant isolation, origin checks, request limits, no shared-bearer fallback in OAuth mode. Approve/verify public canonical HTTPS reachability without weakening unrelated Vercel preview protection.

**F — ChatGPT proof and release:** Run real authorization code+PKCE S256 and login/consent with a test account; verify exact resource audience and signed client; two-user isolation; revoke and check 401; verify `tools/list` filtering, `academy_catalog` and same ChatGPT conversation follow-up. Save timestamped non-secret host-receipts against the exact commit, keep PR Draft until gates pass, then review production promotion and connect **only the same existing private QRVAI plugin**.

### No-go results

Any missing real user, consent, registered callback, signed audience, unavailable resource handler, public host, backend secret or grant makes OAuth/MCP runtime **BLOCKED**. Offline tests, OAuth discovery, migration success or Vercel READY preview can never be substituted for real ChatGPT acceptance.

References: [OpenAI MCP auth](https://developers.openai.com/plugins/build/auth), [Supabase OAuth server](https://supabase.com/docs/guides/auth/oauth-server/getting-started), [Supabase OAuth flows](https://supabase.com/docs/guides/auth/oauth-server/oauth-flows), [ADR-0014](../architecture/ADR-0014-supabase-oauth-mcp-compatibility.md).
