# QRVAI Architecture Documentation Index

**Updated:** 2026-10-17 · **Current development:** five V0 Skills are in `main`; **38 source-registered** MCP methods are present on cumulative **Draft** branches. Intended backend is **Vercel-only**. Actual production MCP, issuer/OAuth, Plugin Creator installation, and ChatGPT host E2E are **NOT CONNECTED** or verified. Source registration does not imply provider integration.

## Current development status (2026-10-17)

The present architectural record is the [P0 Master Roadmap crosswalk](roadmap/2026-10-17-qrvai-master-plan-p0-crosswalk.md), the [P0 implementation plan](superpowers/plans/2026-10-16-qrvai-p0-consolidation.md), and [Draft PR #38](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/38). Five V0 Skills remain a Skills-only portable package with no root `mcp.json`; 38 source-registered MCP names on development branches include user-supplied/simulated tools, not 38 independently proven operational provider services. This new status supersedes the dated 2026-10-15 counts in the historical section below, without claiming a merge to `main` or an installation.

## Start here

**Current planning reconciliation (2026-10-17):** [Master Roadmap ↔ P0 source-consolidation crosswalk](roadmap/2026-10-17-qrvai-master-plan-p0-crosswalk.md) connects the original **M0–M8** strategy and **V0–V8** review gates to [Draft PR #37](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/37). This is a development-only overlay. The source and CI claims in the historical 2026-10-15 snapshot below are date-scoped; status reconciliation remains an explicit P0 implementation task.


**Current V0 plan: [NEW QRVAI Clean-Slate Installation Design](superpowers/specs/2026-10-14-qrvai-v0-clean-install-design.md)** — owner explicitly rejected old-package migration. Build one independent plugin with fresh Skills and no legacy data. The previous [in-place proposal](superpowers/specs/2026-10-14-qrvai-v0-in-place-migration-design.md) is **SUPERSEDED, DO NOT IMPLEMENT**.


1. [v0.5 Architecture Audit and Research](reviews/2026-10-14-architecture-audit-v0.5.md) — gaps in v0.3–v0.4, severity, verified official references and remediation priorities.
2. [ChatGPT-first Experience & @QRVAI](architecture/chatgpt-first-experience-v0.5.md) — product's primary conversational path, plugin mention vs resource mention, cross-host proof needed.
3. [Capability and Sub-capability Register](architecture/capability-register-v0.5.md) — 4 families, 24 domains, 72 sub-capabilities and explicitly bounded outcomes.
4. [Skill and Sub-skill Registry](architecture/skill-and-subskill-registry-v0.5.md) — 24 **future independent Domain Skill candidates** and 72 procedural proposals; none of those 24 domain-specific packages are shipped as such in V0 (which has five Core/Family Skills).
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

## Design vs. implementation — verified status (2026-10-15)

**V0 source exists in this repository:** [`qrvai/plugin.json`](../qrvai/plugin.json), five independently authored instruction Skills (one core + four Family Skills), supporting reference files, Python 3.11 validators, a bilingual QA fixture set and a strict reproducible ZIP builder. Canonical references cover **4 Families, 24 Domain IDs and 72 sub-capability IDs**. They do not imply 24 deployed domain-specific Skill packages, 72 executable agents, live data providers or ready MCP tools.

**Build evidence:** [GitHub Actions #38687772301](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38687772301) on the combined V0 tree passed **40 unit tests**, source QA validation and a clean **12-file** archive build. Source hardening was integrated via [PR #5](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/5), the full V0 foundation via [PR #4](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4). Evidence: [Native review ledger](../qa/v0/NATIVE-REVIEW-LEDGER.md) and [Hardening ledger](../qa/v0/HARDENING-REVIEW-LEDGER-2026-10-15.md). These are CI/source receipts, **not independent review approval or runtime certification**.

**Still blocked or not executed:** the legacy private creator-record `plugins_6acf47f502dc8191bf542fe040d484d8` remains saved and must not be updated/reused. The owner found no Delete action in personal plugin management; [Issue #3](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/issues/3) tracks record deletion and possible name collision. There has been **no new Plugin Creator `create_plugin` call**, no fresh QRVAI private release, no installation, and no ChatGPT-client end-to-end `@QRVAI` or follow-up routing test.

**2026-10-15 historical snapshot (superseded for Draft source):** 24 Domain Skills, 18 full engines, four orchestrators and 36 MCP Apps were proposals; four RF calculators were present then. The cumulative 2026-10-17 Draft lineage now has **38 source-registered** MCP methods, mostly bounded offline, without equivalent host/provider readiness. V0 itself ships no `mcp.json`, CAT/PTT integration, emergency dispatch, live provider adapter, or private Academy content. The active Vercel-only development branch retains release gates for safe deployment.

**Next gates:** Vercel preview target must be unambiguously verified (two mis-targeted or unspecified build attempts were canceled); then verify real HTTPS protocol, protected authentication compatibility, quotas and provider logs before production. New private ChatGPT plugin creation and `@QRVAI` host acceptance remain separate, deferred gates.
