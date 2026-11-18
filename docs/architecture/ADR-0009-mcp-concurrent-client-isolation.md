# ADR-0009 — Concurrent MCP client isolation

Phase 4.2.7 test-only security hardening. Two independent SDK Clients and Streamable HTTP transports are connected in parallel with distinct trusted synthetic principals and scopes, then challenged to discover and invoke each other's tools. A third principal without subject/scopes sees no tools. Catalogues are checked again after denied calls to detect scope bleed.

**Coverage limit:** these are local in-process SDK transport fixtures, not an OAuth issuer, not two authenticated Internet clients, and not a test of shared stateful Streamable HTTP sessions behind Vercel. Never use caller-provided identity in deployed transport. Production auth remains unchanged. Real issuer/JWKS/aud/scope verification, principal binding, server-side resource ownership, session affinity, replay and revocation tests remain prerequisites. No production, main or Vercel deployment protection changes.
