# QRVAI Architecture Documentation Index

**As of:** 2026-10-14 · **State:** REVIEW DRAFT (not an implemented plugin)

## Start here

**Current V0 plan: [NEW QRVAI Clean-Slate Installation Design](superpowers/specs/2026-10-14-qrvai-v0-clean-install-design.md)** — owner explicitly rejected old-package migration. Build one independent plugin with fresh Skills and no legacy data. The previous [in-place proposal](superpowers/specs/2026-10-14-qrvai-v0-in-place-migration-design.md) is **SUPERSEDED, DO NOT IMPLEMENT**.


1. [v0.5 Architecture Audit and Research](reviews/2026-10-14-architecture-audit-v0.5.md) — gaps in v0.3–v0.4, severity, verified official references and remediation priorities.
2. [ChatGPT-first Experience & @QRVAI](architecture/chatgpt-first-experience-v0.5.md) — product's primary conversational path, plugin mention vs resource mention, cross-host proof needed.
3. [Capability and Sub-capability Register](architecture/capability-register-v0.5.md) — 4 families, 24 domains, 72 sub-capabilities and explicitly bounded outcomes.
4. [Skill and Sub-skill Registry](architecture/skill-and-subskill-registry-v0.5.md) — 24 candidate Skill packages and 72 internal procedures; none packaged yet.
5. [Orchestrator Control Contracts](architecture/orchestrator-control-contracts-v0.5.md) — main router, OR-ENG, OR-DIAG, OR-REG, OR-EMCOMM.
6. [Engine and MCP Tool Contract Register](architecture/engine-and-mcp-tool-contracts-v0.5.md) — 18 proposed engines and 38 candidate tool endpoints (NOT deployed).
7. [v0.5 Research, UX and Delivery Gates](roadmap/2026-10-14-qrvai-review-gates-v0.5.md) — review order and vertical slice exit checks.

## Earlier approved conceptual direction / supplementary references

- [Master Capability Design v0.3](superpowers/specs/2026-10-14-qrvai-capability-design.md)
- [Domain Orchestration v0.4](superpowers/specs/2026-10-14-qrvai-domain-orchestration-design.md)
- [Interactive Catalog: 36 UI candidates](architecture/interactive-tools-catalog.md)
- [Hybrid Architecture ADR-0001](architecture/ADR-0001-hybrid-mcp.md)
- [Source Registry](research/source-registry.md)
- [Strategic Roadmap M0–M8](roadmap/2026-10-14-qrvai-master-roadmap.md)

## Design-vs-implementation status

The domain names, tool IDs, engines, Skill names and orchestration contracts are **proposed specification artifacts**; only the documents exist. They cannot be invoked in ChatGPT until a real private plugin is packaged, installed, connected to actual published Skills/MCP endpoints, and verified in the target host. A ChatGPT @ mention is a primary requirement, not an already passing acceptance test.

Read-only inspection located an EXISTING private QRVAI plugin preview (21 Skills, 25 Academy JSON, 53 JPEG, version 0.1.0-preview.2). The architecture review has **not updated this release**, produced executable code, run host tests or installed MCP engines/server. The existing installation predates this documentation.

**Next:** owner reviews proposed architecture and clarifies incomplete "@..." wording; then create a focused implementation specification and test-first plan for the first approved vertical slice. Changes, merges and publication remain separate review/authorization decisions.
