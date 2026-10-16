# QRVAI — Master Roadmap ↔ P0 Source Consolidation Crosswalk

**As-of:** 2026-10-17 (development planning snapshot)  
**Status:** DRAFT architecture/governance reconciliation for [PR #37](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/37). This document introduces no new product scope or release authorization.  
**Current reference source:** canonical cumulative Draft PR #36 at `73feb5789d7830b4d47ea6100a971d864db8fb28`; PR #37 adds documentation on top. Re-check heads before implementing.

## 1. Authoritative planning hierarchy

| Source of truth | Authority and purpose |
|---|---|
| [Strategic Roadmap v0.3](2026-10-14-qrvai-master-roadmap.md) | Strategic product direction and **M0–M8** milestones; originally marked **PROPOSED**, not a runnable implementation plan. |
| [Research & Review Gates v0.5](2026-10-14-qrvai-review-gates-v0.5.md) | Delivery slices **V0–V8**, review gates **R0–R6** and risk-priority labels. Dated status snapshots remain historical. |
| [Capability Register](../architecture/capability-register-v0.5.md) | Canonical taxonomy: **4 Families / 24 Domain Modules / 72 Sub-capabilities**; stable identifiers `A01`–`D24` / `SC-...`. |
| [Skill Registry](../architecture/skill-and-subskill-registry-v0.5.md) | **24 future Domain Skills and 72 internal Sub-skills**; not equivalent to the five existing V0 Core/Family Skills. |
| [Engine and Tool Contracts](../architecture/engine-and-mcp-tool-contracts-v0.5.md), [Orchestrator Contracts](../architecture/orchestrator-control-contracts-v0.5.md), [UI Catalog](../architecture/interactive-tools-catalog.md) | Intended 18 logical Engines, 38 candidate MCP methods, 4 orchestrators + router, 36 UI concepts. These originally proposed snapshots are **not** proof of deployed functionality. |
| [MCP implementation register](../architecture/mcp-implementation-register.md), [ADR-0003](../architecture/ADR-0003-mcp-integration-consolidation.md) | Date-specific canonical **Draft source** implementation/evidence, GitHub lineage, incompatible alternative PR review and unresolved host/security gates. |
| [P0 consolidation design](../superpowers/specs/2026-10-16-qrvai-p0-consolidation-design.md) → [P0 TDD plan](../superpowers/plans/2026-10-16-qrvai-p0-consolidation.md) | **One scoped development integration prerequisite**, not a replacement for the master roadmap. Runtime implementation requires separate plan review and execution-method selection. |

**Do not conflate namespaces:**
- **M0–M8** = product milestones; **V0–V8** = versioned delivery slices; they align directionally but are not claims of completed releases.
- **P0 Source Consolidation** = present engineering integration prerequisite preceding new work on M1–M8; this is **not** M0, V0, or the **P0 severity** label in the v0.5 risk table.
- **M01–M38** (two-digit identifiers) = MCP method IDs; **M1–M8** (one digit) = roadmap milestones. The names must never be used interchangeably.
- **R0–R6** = research/design review gates; **G0–G6** in the P0 design = current *development-baseline* acceptance gates. **G1–G8** in ADR-0003 = a broader 4.1 integration-to-host checklist, some explicitly deferred.
- An `@QRVAI` host invocation, Plugin Creator release, protected Vercel preview, GitHub source merge, and production runtime are distinct events and require distinct evidence/approval.

## 2. Milestone / delivery-slice crosswalk

| Master milestone | v0.5 delivery slice | Core owner-facing output and exit evidence | State at this review |
|---|---|---|---|
| **M0** architecture and scope | **V0** Skills foundation | 4/24/72 taxonomy, 5 V0 Core/Family Skills, reproducible clean package and owner-reviewed architecture | **Partially demonstrated in source.** Host installation/E2E not tested; v0.5 roadmap still proposed. |
| **M1** deterministic RF workbench | **V1** RF tools + UI | Verified RF calculations, units, numeric fixtures, text/visual parity, user-facing UI01–UI04 | Calculator methods exist in source; actual interactive UI/host acceptance **not established**. |
| **M2** Greece-first rules | **V2** national regulatory sources | Effective-dated official source citations; license/jurisdiction context; fail-closed `INDETERMINATE` | User-input / source-candidate tools are **not** authoritative live legal integrations. |
| **M3** manuals/equipment | **V3** manufacturer material/diagnostics | Rights-aware official manuals, page/version citations, safe model-specific diagnostics | Generic bounded previews exist; official retrieval/device-specific validation **not established**. |
| **M4** propagation/DX/geospatial | **V4** dynamic providers | Provider licensing, timestamps/staleness/outage/429 tests, observational vs model distinction | Mathematical/user-supplied previews, **not** authenticated live data providers. |
| **M5** logging/digital/portable | **V5** user records/workflows | ADIF import privacy, idempotence, consent, QSO/award behavior under scoped access | Bounded user-supplied ADIF/award tools, **not** connected logbook accounts. |
| **M6** emergency preparation | **V6** classroom EmComm | Explicit simulation-only authority, safe fallback, no dispatch or radio keying | Training-only simulations in source, no live public-safety service. |
| **M7** advanced RF/SDR/satellites | **V7** measurements / future bridge | Calibrated source distinction, sample limits, orbit fidelity, read-only disconnected-device testing | Supplied traces/samples and bounded physics; **no** genuine SDR/CAT/rig/orbit bridge. |
| **M8** education/clubs/makers | **V8** academy/community | Pedagogical QA, rights, safety, accessibility and club/member consent | Offline educational templates only; actual community integrations not ready. |

**Roadmap precedence:** where a historic text says "zero implemented MCP tools", "four tools", or implies a legacy Cloudflare runtime, preserve it as a **dated snapshot**. For the current Draft branch use the actual implementation register and the source/CI receipts. Do not silently revise historic decisions or pretend that later source work satisfies all release gates.

## 3. Current measurable development baseline (not release metrics)

| Metric | Definition / method | Observed evidence at canonical PR #36 | P0 exit threshold |
|---|---|---|---|
| **Draft MCP registration coverage** | Unique `M01–M38` descriptors matched to `createServer().tools/list`, source names and registry table; unit = source methods | **38/38 source-registered** according to existing source registry. This is *not* 38 integrated vendor/provider services. | Fresh machine-tested **38 distinct IDs ↔ 38 names ↔ 38 SDK registrations** at exact final SHA. |
| **Implementation-quality reproducibility** | Number of separate CI checks on the exact **final branch SHA**: RF full Node TypeScript suite and V0 Python/ZIP audit | Earlier PR #36 checks passed; **no new final P0 implementation SHA exists yet**. | Both suites `PASS`, no test failures, log/run IDs recorded for same final SHA, security negatives present. |
| **Readiness boundary correctness** | README, docs index, implementation register and P0 ledger distinguish main/Draft/runtime/installed/host and no forbidden activation | Historical README and docs index still contain stale four-tool language | Contradictions corrected, safety/disconnected flags retained, PR diff reviewed; no production/Plugin Creator activity. |

**Supplementary scope indicators (NOT percentages of end-user product completion):**
- `5` V0 Core/Family Skills in source; **0/24 packaged independent Domain Skills** targeted for later work.
- `38/38` candidate MCP names in cumulative Draft source; many methods are offline/user-supplied, and this numerator must **never** be treated as end-to-end feature completeness.
- `18` Engines and `4` orchestrators + main router are design contracts / partial seams, not a proven operational engine/orchestration fleet.
- `36` UI concepts are catalog proposals, not deployed interactive widgets; do not infer a delivered count solely from catalog lines.

For every KPI, record **scope = exact SHA, evidence type = source/CI/host, date, denominator and unresolved gates**. Never aggregate source-registration coverage with production or UX completion.

## 4. Execution order and dependency rules

**Already planned P0:** [six-task TDD plan](../superpowers/plans/2026-10-16-qrvai-p0-consolidation.md). First reconcile canonical GitHub ancestry and the alternative #21/#23 schemas, then lock the 38 public MCP tool registrations and input contracts, add compatible ADIF privacy checks, repair stale status docs, run fresh same-SHA tests and present a Draft review. P0 may be declared **development-baseline complete** with **no merge to `main`** and no host connection, only if its `G0–G6` gates are satisfied.

**Workstreams after P0 (not independently approved implementation plans):**
- **P1** skill taxonomy execution: 24 Domain Skills + 72 internal procedural Sub-skills, routed lazily.
- **P2** 18 Engine contract implementations / explicitly mocked provider adapters.
- **P3** minimal router and four bounded orchestrator state machines.
- **P4** 36 UI catalog implementations by value slice, starting from RF UI01–UI04 where M1 requires them.
- **P5** crosscutting security, source provenance, localization, accessibility and QA hardening.
- **P6** deterministic offline candidate package and review-only Marketplace readiness; **not** publication, account mutation or installation.

These workstreams are **crosscutting build priorities**, not a new sequential replacement for M0–M8/V0–V8. Develop each independent milestone slice with its own approved spec, TDD plan, test evidence and no overclaiming of a provider or UI. The P0 final review must explicitly identify the next approved slice rather than assert that all P1–P6 or M1–M8 are finished.

## 5. Safe state transitions / stop gates

`PLAN/DRAFT DESIGN` → owner reviews written plan & selects execution method → `IMPLEMENTATION DRAFT` → exact-SHA CI and security review → `P0 DEVELOPMENT BASELINE VERIFIED` → **separate owner approval** for any `main` merge. The subsequent `protected Vercel preview` → `credentialed HTTPS MCP` → `production` → `new Plugin Creator account identity` → `installed ChatGPT @QRVAI acceptance` are distinct, currently deferred gates and not implied by prior transitions.

**No actions under this crosswalk:** create/update/reuse any Plugin Creator record, deploy/promote production, set/relax Vercel credentials, enable autonomous CAT/PTT/TX, publish externally, merge/close any PR, or claim Marketplace availability.

## 6. Review checklist for PR #37

- Master M0–M8, v0.5 V0–V8 and P0 source plan are linked **without replacing or reinterpreting original owner decisions**.
- Source status is qualified as a dated Draft observation; no absolute claims about unavailable providers or future host capabilities.
- P0 implementation scope remains the existing six-task TDD plan and preserves alternative #21/#23 per-method decisions.
- The final P0 gate matrix has exact final SHA, 38 method mapping, same-SHA CI, tested security failures, no plugin/host activation.
- The owner reviews the plan and chooses **Native** or **Subagent-driven** separately before product-code work.
