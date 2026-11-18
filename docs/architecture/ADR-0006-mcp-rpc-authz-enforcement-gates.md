# Phase 4.2.4 — MCP RPC authorization pre-dispatch guard (DRAFT)

This wave adds a **pure testable request gate** for OAuth-mode JSON-RPC requests. It **does not yet activate OAuth mode** on `/api/mcp`, and does not change the existing private shared Bearer token entrypoint. It deliberately denies station/log calls until an issuer-validated principal and **server-resolved resource ownership** are available; never trusts `tenantId` in tool arguments. It classifies `tools/list` and `tools/call`; JSON-RPC batches, unknown methods and malformed payloads are denied in this scoped prototype.

**Security gate remaining:** a pre-dispatch allow decision for `tools/list` is insufficient unless the actual list response is filtered server-side. The new `allowedToolNames` output must be enforced in the SDK tool-list handler or transformed safely before enabling OAuth-mode traffic. Do not expose this path before implementing that enforcement and tests for real MCP ListTools/CallTool handlers, stream transport, session isolation, identity binding and denied tool invocation. MCP initialize/ping remain protocol setup only.

Provider approval, RFC9728 discovery, client registration/PKCE, production issuer/audience settings, stable tenant mapping, token revocation, and live ChatGPT OAuth handshake remain open. This PR is intentionally a **tested non-wired seam**, not a deployable OAuth solution.
