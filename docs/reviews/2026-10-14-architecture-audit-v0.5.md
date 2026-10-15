# QRVAI Architecture Research & Gap Audit v0.5

**Date:** 2026-10-14 · **Status:** READ-ONLY AUDIT FINDINGS + PROPOSED CORRECTIONS.  
**Compared artifacts:** Master capability spec v0.3, selective orchestration v0.4, ADR-0001, interactive catalog (36 UI candidates), roadmap M0–M8, source registry.
**Execution evidence:** GitHub API returned full source of all six documents on branch \`docs/qrvai-capabilities-v0-3\`. This is an audit of DOCUMENTS, not working source code or an operational plugin.

## Goal / working assumptions

Deliver a **ChatGPT-first** amateur radio assistant, discoverable through the plugin and primarily used conversationally. Interpreting owner's truncated phrase "να λειτουργεί πρώτα με το από @" as an intent to invoke the QRVAI plugin with \`@QRVAI\` in a ChatGPT composer. **This interpretation needs confirmation, and actual surface behavior needs testing after installation**; writing \`@QRVAI\` does not itself guarantee plugin resolution on every host.

A full taxonomy must distinguish: Plugin identity; 4 capability families; 24 domain capability modules; 72 explicitly scoped proposed sub-capabilities; 24 proposed Skill packages; 72 Skill-internal procedures (called Sub-skills as project terminology, **not a portable plugin-standard artifact**); 4 candidate orchestrators + simple router; shared engines; and typed MCP tool entrypoints. All proposed elements must link by stable IDs and state, without implying implementation.

## Evidence sources examined

1. [OpenAI MCP Extensions specification](https://github.com/openai/mcp-extensions/blob/main/docs/spec.md), reviewed 2026-10-14: ordinary plugin/MCP-server mention is distinguished from extension **Composer At-Mentions** for **individual resources**. The extension's platform table shows resource at-mentions on Desktop but not Web/iOS/Android. Global/thread entrypoints have broader platform support; test actual host and account behavior.
2. [OpenAI plugin package guidance](https://agent-plugins.org/), with current installed Plugin Creator documentation: single Agent Plugins 1.0 root \`plugin.json\`, Skill entrypoints \`skills/<slug>/SKILL.md\` and optional \`mcp.json\` with verified MCP endpoint. A Skill must have valid YAML frontmatter; skill subdivisions in \`references/\` do not become host-routable Skills automatically.
3. [MCP 2026-07-28 release notes](https://blog.modelcontextprotocol.io/posts/2026-07-28/), reviewed 2026-10-14: 2026-era protocol uses stateless request core and \`server/discover\`, removes legacy session-oriented assumptions; full JSON Schema 2020-12 for tool schemas; task protocol is a separate extension. Do not implement an invented generic MCP version or assume old initialization semantics.
4. [MCP Apps stable 2026-01-26 spec](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) and [overview](https://github.com/modelcontextprotocol/ext-apps/blob/main/docs/overview.md): \`ui://\` resource, \`_meta.ui.resourceUri\`, \`visibility\` app/model, sandbox, text fallback on unsupported hosts.
5. [IARU Region 1 band plans](https://www.iaru-r1.org/on-the-air/band-plans/), reviewed 2026-10-14: operational recommendations, **not legal transmission authorization**. Region 1 HF bandplan page labels its 2020-effective amendments; VHF+ updates are separate.
6. [ITU-R M.1042-4](https://www.itu.int/rec/R-REC-M.1042-4-202602-I/en), published 2026-02 and in force: amateur disaster communications recommendation, not an official emergency dispatch mandate.
7. [ADIF developers](https://adif.org.uk/), reviewed 2026-10-14: current released version 3.1.8, requires version-specific parser fixtures.
8. Existing QRVAI [source registry](../research/source-registry.md) for Greece-specific legal sources; those links are **discovery candidates**, not certified current law interpretations.

## Critical gaps / proposed upgrades

| Finding | Severity | Evidence | Corrective artifact | Gate |
|---|---|---|---|---|
| G01: \`@QRVAI\` user entrypoint undefined and conflated with item mentions | P0 | v0.3/v0.4 have no mention contract | [ChatGPT-first](../architecture/chatgpt-first-experience-v0.5.md) | Installed host UX tests |
| G02: No unique 72-subcapability decomposition | P0 | v0.3 only 24 domain rows | [Capability register](../architecture/capability-register-v0.5.md) | 24 × 3 stable sub-ID checks |
| G03: No real Skill/sub-skill ownership registry | P0 | v0.4 has no Skill packaging/trigger contract | [Skill registry](../architecture/skill-and-subskill-registry-v0.5.md) | Trigger, inputs, sources, outputs for each |
| G04: MCP tools only examples, not exhaustive typed inventory | P0 | v0.3/v0.4 without inputSchema/outputSchema table | [Engine/MCP contracts](../architecture/engine-and-mcp-tool-contracts-v0.5.md) | Cross-reference, auth, validation |
| G05: Orchestrators named but orchestration vs agent budget unclear | P1 | v0.4 addresses selection conceptually only | Explicit lifecycle, inputs and outputs in tool contract and v0.4 | Regression evaluation |
| G06: Model-led compliance conclusion risk | P0 | v0.4 conceptual INDETERMINATE but no enforceable gate | Deterministic rules contract / source provenance | Legal fixtures reviewed by expert |
| G07: No explicit source rights matrix for device manuals/providers | P0 | source registry says candidates only | Provider approval gate; no auto ingestion | Licensing review |
| G08: Interactive UI count can become development anti-pattern | P1 | 36 ideas but no reuse/ownership budget | Widget/engine distinction and prioritization | Minimal successful slice |
| G09: MCP protocol era mismatch and host assumption | P0 | v0.4 not version-pinned | Version compatibility decision in MCP contract | Conformance suite & host tests |
| G10: No explicit tool-side state ownership, audit and idem semantics | P1 | v0.4 workflow contract conceptual | MCP auth/effects/typed errors | Negative tests |
| G11: No high-level security acceptance conditions tied to modules | P0 | v0.3 generic | Domain guards, non-bypassable source/permission layers | Attack/permission tests |
| G12: Emergency volunteers might be mistaken for authorities | P0 | domain exists without binding operational mandate | Mandatory simulation and human authorization gate | Exercise-only E2E |
| G13: Blind trust in uploaded manuals or false vendor menu guidance | P1 | no model/version source test matrix | Manual provenance + injections tests | Version mismatch and injection tests |
| G14: Lack of explicit information freshness semantics | P1 | registry has partial timestamp model | Normalized result envelope and stale rules | Provider 429/timeout/stale tests |
| G15: Distinct MCP tool from local engine sometimes conflated | P1 | terminology ambiguous | Declared engine-to-MCP mapping | Contract review |
| G16: No measurable user-level performance target | P2 | roadmap broad milestones | Chat-first UX gates and baseline tests | M1 pilot |

## Reviewed architectural decision

**Recommended:** one QRVAI identity, 4 Families, 24 Domains, 72 Sub-capabilities, 24 Skill packages with conditional reference workflows (72 Sub-skills), 4 candidate bounded Orchestrators, reusable engines and a small disciplined MCP tool surface. These are **design targets**, not work that must be implemented en masse before a first usable plugin.

**Do not** create 72 separate host-addressable Skills or one agent per sub-capability. The real plugin Skill is discoverable from \`SKILL.md\`; references/sub-skills are loaded only after selection and are not independently discoverable by default.

**Primary UX:** installed plugin \`@QRVAI\` when supported; ordinary mention-free follow-up within the same conversation; direct tool calls for deterministic work; MCP Apps as progressive enhancement. Resource at-mentions can be a later Desktop-specific feature and do **not** replace the plugin entrypoint. A readable answer always exists without interactive UI.

**Protocol:** target an SDK stack supporting MCP core 2026-07-28 where the chosen host supports it; explicitly negotiate/version-test compatibility with 2025-era clients if required. Treat MCP Apps 2026-01-26 as its own extension version. Separate hosting auth from model-driven routing.

## Audit method / confidence

- **Verified observation:** six GitHub documentation files were read and their headings/content inspected; official protocol and standards references above were accessed.
- **Design reasoning:** taxonomy/registers in this PR are newly PROPOSED. Tool signatures/IDs are **candidate API contracts**, not observed server endpoints.
- **Not executed:** builds, schema validators, legal verification of all current Greek permissions, operator interviews, device tests, platform-installed \`@QRVAI\` invocation, server conformance or real emergency integration.

## Remediation and verification order

1. Stabilize the user entrypoint contract before design proliferation; test on actual target host.
2. Approve definitions and ownership boundaries; each capability/Sub-skill maps to exactly one primary Skill.
3. Agree on minimal typed MCP tool inventory and security envelope; do not define duplicate 'calculate' endpoints by visual widget.
4. Implement one testable RF slice (unit conversion, link budget, loss and SWR) after documented spec acceptance.
5. Proceed to Greek regulatory engine only after primary-source rule fixtures and human legal interpretation gate.
6. Expand vendor manual support through verified rights and model-version bindings.
7. Add emergency tabletop training without live dispatch or automatic transmission.
8. Audit external providers and whole-plugin host behavior before user-facing reliability claims.

## Definition of Review Complete

Review completion means: 4 families identified; all 24 modules have exactly 3 scoped sub-capabilities; each has a Skill and matching procedural sub-skill IDs; each skill has trigger and output expectations; all engines have owners; all planned MCP tools have typed inputs/outputs/access level/error envelope; cross-domain orchestration and runtime @-first fallback are testable; unresolved legal/platform/rights issues are explicitly BLOCKED. **It does not mean functioning software.**

Document owner review required prior to any application-code implementation plan or plugin release.
