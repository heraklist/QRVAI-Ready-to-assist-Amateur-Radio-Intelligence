# QRVAI v0.5 Research, Specification & Delivery-Gate Roadmap

**Original date:** 2026-10-14. **Status update 2026-10-15:** This remains a **future program-level roadmap**, while the separate owner-approved V0 plan was executed as Skills-only GitHub source and tested via CI. The V0 account plugin is **not created/installed**; host E2E remains NOT_EXECUTED.

## Primary mission

Build a ChatGPT-first QRVAI plugin, discoverable and usable through the host's supported plugin @ selection, serving Greek and English amateur radio needs with progressively validated technical tools, authoritative source lookup and meaningful interactive MCP Apps. The product retains **24 domain-capability IDs across four families** without claiming all 24 are present in the initial install.

## Design outputs and confidence

| Stage | Description | Artifact | Completion / review gate |
|---|---|---|---|
| R0 | Audit architectural and source gaps | docs/reviews/2026-10-14-architecture-audit-v0.5.md | Existing six files read and findings classified |
| R1 | Define 4 families, 24 modules, 72 sub-capabilities | docs/architecture/capability-register-v0.5.md | No missing/duplicate stable ID, bounded outcomes |
| R2 | Map 24 candidate Skills and 72 internal procedural Sub-skills | docs/architecture/skill-and-subskill-registry-v0.5.md | Each SC has parent Skill + subprocedure + trigger and stop rule |
| R3 | Map 18 logical engines and 38 prospective MCP tools | docs/architecture/engine-and-mcp-tool-contracts-v0.5.md | Every method has typed proposal, owner, permissions and error/fallback policy |
| R4 | Formalize four orchestrators and main routing | docs/superpowers/specs/2026-10-14-qrvai-domain-orchestration-design.md | Direct tool before orchestrator, bounded authority and workload state |
| R5 | Define ChatGPT-first and @-invocation | docs/architecture/chatgpt-first-experience-v0.5.md | Explicit platform test matrix and text-first fallback |
| R6 | Final product-owner design review | GitHub PR #1 | Owner approved V0 clean-slate spec, implementation plan and Native execution; source merge and account install are separate gates |

## Proposed implementation program — subject to separate approvals

### V0 — Minimal ChatGPT-first plugin discovery and baseline skills (NEW prerequisite)

**Goal:** validate genuine plugin identity and invocation in the user's preferred ChatGPT surface before a large backend investment. If the host supports a mention, record its actual behavior and plugin token; where not supported use the host's plugin selector. No fake live tools.

**Slice:** package minimally useful verified Skills, maybe a public terminology/operator workflow and a small unit-safe calculation if runtime ready. Deliver a versioned minimal plugin only after an implementation spec and tests, **not as part of the present review**.

**Source progress (2026-10-15):** five Core/Family Skills, 24 Domain/72 sub-capability references, manifest, security validators and ZIP builder implemented in GitHub; [PR #4](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/4) and [PR #5](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/5) merged into the architectural branch. [40 CI tests](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/actions/runs/38687772301) passed; packaging is a review-only build, not a Plugin Creator release.

**Gate still outstanding:** an actual installed request must reach the *new* QRVAI, show a correct bounded answer and a second follow-up without mandatory external UI; unsupported clients need documented fallback. **Not tested** because the legacy creator-source record deletion/name collision is unresolved.

### V1 — First deterministic engineering workbench (legacy roadmap M1)

Implement M07 RF power conversion, M08 link budget, M09 feedline and M10 impedance, plus at least one accessible interactive instrument when a host supports MCP Apps. Keep methods stateless, schema-bound and independently testable.

**Gate:** independent golden mathematical fixtures, invalid-unit failures, chart/text parity and actual host UI verification. Ship no Smith simulation claims until solver proven.

### V2 — Source-controlled national regulation (legacy M2)

Authoritative primary Greek licensing/band allocation sources, effective-date versioned rules, review owner, typed INDETERMINATE decision engine and advisory overlay. No blanket permission from IARU guidance.

**Gate:** boundary-value legal test matrix with qualified expert verification and stale-rule fail-closed behavior.

### V3 — Manufacturer manuals and equipment troubleshooting (legacy M3)

Rights-aware manual index, source/version/page-cited retrieval, model-specific setup workflows, safe diagnostic trees; optional supported firmware context.

**Gate:** vendor revision mismatch tests, prompt-injection isolation, no unlicensed large-scale indexing, no CAT hardware actions.

### V4 — Dynamic providers, propagation and geospatial (legacy M4)

Authorized NOAA read-only data, timestamped space-weather observations, named propagation models, Maidenhead bearings, optional verified external provider adapters.

**Gate:** 429/outage/cache freshness/provider terms and real vs modeled distinctions.

### V5 — Logs, portable and digital networks (legacy M5)

ADIF v3.1.8 and backward compatibility, privacy/permission scopes, read-only analytics, digital-mode support and consent-bound integrations.

**Gate:** malformed record, idempotent parsing, QSO privacy isolation, no implicit uploads.

### V6 — Civil Protection training-only suite (legacy M6)

EmComm tabletop drills, documented message forms, readiness boards, backup communications/power simulations aligned to relevant official guidance.

**Gate:** never acts as authority/dispatch, no real emergency channel use or radio keying, simulation clearly marked.

### V7 — Advanced RF/SDR and read-only bridge (legacy M7)

Verified antennas/Smith Charts, VNA imports, DSP viewers, orbit/passes and opt-in read-only station telemetry.

**Gate:** numerical/measurement reconciliation, sample validity, orbital element currency, disconnected/unauthorized device tests.

### V8 — Academy and clubs (legacy M8)

CW learning, quizzes, Maker project review, consented club workshop and asset planning.

**Gate:** question/rights compliance, training validity and privacy-scoped club data.

## Security, quality and release gates for every vertical slice

1. **Spec gate:** one accepted executable behavior and its input/output/error/permissions contract — do not implement all 38 candidate MCP tools simultaneously.
2. **Data-rights gate:** upstream official source identity/dated revision/license, or postpone adapter.
3. **Auth gate:** backend enforced scopes and tests for access denial and sensitive storage.
4. **Safety gate:** frequency permission requires official primary law; no transmission/dispatch/automatic CAT PTT.
5. **Tests gate:** deterministic golden/negative/fuzz/property-based tests as appropriate, security and regression review.
6. **UX gate:** QRVAI plugin reachable from supported tested host; prose/text fallback for unsupported UI; actual accessibility tests.
7. **Evidence gate:** code, test reports and tested client version/protocol pinned to exact build/release, no inherited certification.
8. **Promotion gate:** GitHub merge, public/plugin deployment and rights/licensed data release separately authorized by project owner.

## Risk register and enhancements

| Priority | Improvement | Owner boundary | Success signal |
|---|---|---|---|
| P0 | Real @ invocation before rich dashboards | Plugin identity/host | Recorded real E2E on target surface |
| P0 | National-rule provenance and uncertainty | E01 | No false ALLOWED in fixtures |
| P0 | Typed tool schemas, SDK version pinning | MCP gateway | Conformance/host schema tests |
| P0 | Manual permissions and source versions | E06 | Citation+rights audit passing |
| P0 | Emergency simulation authority boundary | E15 | No dispatch/PTT test |
| P1 | Sub-skill lazy loading instead of 72 top-level skills | SK- registry | Routed trigger tests and bounded context |
| P1 | Deterministic routes before model agents | Router | Cost/latency/quality baseline |
| P1 | Reusable interactive UI, not per-domain clones | UI catalog | Common unit input + fallback |
| P1 | Portable Greek/English corpus | Localization | Bilingual technical regression set |

## Formal deliverables for the next approved engineering plan

For V0 or V1, record: target host/version and protocol, exact plugin manifest, actual Skill entrypoints, engine interfaces and full JSON Schemas, golden-reference examples, detailed steps/tests, security ownership, provider licensing status, and defined rollback. That **implementation plan** is created only after the owner reviews the written v0.5 design.

**Change management (2026-10-15):** V0 design/implementation approval and Native TDD execution are recorded. The V0 source branches have been merged internally; [PR #1](https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/1) is the separate `main` integration gate. No new private QRVAI account/plugin creation, installation or real ChatGPT `@QRVAI` E2E has occurred; keep D1/D2 account gates and owner authorization separate from a GitHub code merge.
