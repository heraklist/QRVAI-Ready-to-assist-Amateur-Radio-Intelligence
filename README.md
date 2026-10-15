# QRVAI — Ready-to-assist Amateur Radio Intelligence

**Status (2026-10-15):** Five V0 Skills and four read-only RF MCP tools are present in source. The Vercel-only MCP migration is under review in [PR #17](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/17). A protected Vercel project was linked; production rollout and ChatGPT `@QRVAI` host acceptance are **not verified**.
**Languages:** Greek and English · **Initial regulatory jurisdiction:** Greece · **Technical scope:** international amateur radio.

QRVAI is a proposed ChatGPT-first, safety-conscious amateur-radio intelligence plugin ecosystem. Primary product requirement: invoke **@QRVAI inside an existing ChatGPT conversation**, where the host supports it. Its scope includes RF engineering, frequency/regulatory research, operating/DX, propagation, documentation/manuals, emergency *training and preparedness*, logbook workflows, education and future interactive RF instruments.

## Actual source, separate from planned capabilities

- `qrvai/`: exactly **five independently authored V0 Skills** (core plus four Family Skills), no MCP server, App, hardware control, PTT, or sensitive legacy Academy content in the packaged 12-file artifact.
- `docs/architecture/`: conceptual taxonomy of **4 Families / 24 Domains / 72 Sub-capabilities**, 24 future Domain Skills, 18 Engines, 38 MCP tool proposals, four candidate Orchestrators and 36 interactive view concepts; **not deployed**.
- [Merged PR #9](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/9): historical original RF calculator source. [Merged PR #16](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/16) added the fourth read-only calculator. [PR #17](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/17) selects **Vercel as the only MCP runtime**, removing the historical Cloudflare Worker package and deployment configuration. No verified live MCP host endpoint yet.
- [Merged PR #11](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/11): independent V0 hardening covering ZIP validation, routing fixture and SHA-pinned CI.
- [Draft PR #10](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/10): M1 conceptual staged math plan; reconcile with existing PR #9 before any parallel implementation.

## Non-negotiable boundaries

- Binding national law outranks voluntary band-plan recommendations. Do not infer permission to transmit from IARU advice.
- Validate numeric output through versioned deterministic tools, typed units, and actual execution evidence. Never invent measurements, opening/spot observations or simulated propagation patterns.
- Emergency communications support is **training/preparedness**, not live dispatch or official agency authority.
- Device integrations, if separately approved later, start **read-only**; no automatic PTT, transmission, or unapproved writes.
- Third-party manuals, provider APIs and callsign/logbook data require source verification, permission and rights-aware handling.
- The old private QRVAI account-created record is **not** the new plugin identity; do not update/reuse it. [Account blocker #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3); [MCP lifecycle blocker #6](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/6).
- GitHub source merge, Vercel preview/production deployment, Plugin Creator creation, installation and public release are separate approval boundaries.

## Entry points

- [Architecture and actual implementation status](docs/README.md)
- [M09 feedline review candidate](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/16) — versioned user-supplied attenuation, **not yet merged or deployed**
- [ADR-0002: first new plugin includes verified MCP](docs/architecture/ADR-0002-first-fresh-mcp-private-release.md)
- [V0 Clean-Slate Design](docs/superpowers/specs/2026-10-14-qrvai-v0-clean-install-design.md)
- [MCP service and Cloudflare preflight](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/9)
- [Audit remediation evidence](docs/reviews/2026-10-15-v0-audit-hardening-evidence.md) (Draft PR #11 until merged)

**Evidence classification:** passing CI confirms only the exact tested source and checks; it is not Plugin Creator or ChatGPT-host acceptance.
