# ADR-0001: Hybrid Skills + MCP Tools + MCP Apps

**Date:** 2026-10-14  
**Status:** PROPOSED — design-review decision, not authorized implementation  
**Context:** QRVAI is intended to cover 24 radio-amateur specialties while delivering accurate RF numbers, traceable legal guidance and valuable interactive instruments. Current repository contains documentation only.

## Context and options

1. **Skills-only ChatGPT plugin:** ideal for curated conceptual knowledge and guided workflows; poor at fresh external data, deterministic calculations and dynamic graphics.
2. **Hybrid Skills + MCP Tools + MCP Apps:** rules, calculations, source retrieval, operating context and interactive views behind reusable typed domain services. Optional local bridge later.
3. **Local desktop radio-control application:** strongest direct device access and offline capability, but large install/distribution/security costs and weak ChatGPT-first experience.

## Proposed decision

Use option 2. Keep a single coherent QRVAI ChatGPT/plugin identity with capabilities expressed as Skills and explicit MCP tool endpoints backed by shared domain engines. Offer accessible MCP Apps for user tasks requiring direct manipulation of engineering inputs, visual data or guided troubleshooting. Do not create one plugin, server or database for every domain.

### Logical components

- **Specialist Skills:** instruction-level domain guidance, workflows, precise tool selection and refusal conditions.
- **MCP Gateway:** authentication/authorization, tool schema verification, service selection, audit of sensitive actions.
- **Policy/Regulatory Core:** dated, jurisdiction-specific rules backed by primary official sources; deterministic legal-decision structure and INDETERMINATE default.
- **RF Engineering Core:** unit-aware calculators and versioned numerical regression fixtures.
- **Knowledge Core:** manual/source registry, citations with edition/page anchoring, prompt-injection defense, rights-aware retrieval.
- **Dynamic Data Adapters:** NOAA and future providers, typed schemas, source timestamps, quotas, retries and degradation.
- **Context Store:** optional user-consented station profile, radio inventory and logs, segregated by identity.
- **MCP Apps UI:** charts, engineering canvases, drill simulations, searchable manuals and step-by-step guidance.
- **Local Station Bridge (future):** separate opt-in on-device process, read-only CAT/measurement access first, never default PTT or TX.

### Trust and data-flow boundary

ChatGPT/host → Skills orchestrate → MCP permission gate → typed engine/adapter → normalized result with provenance → explanation and interactive view.

- LLM prose cannot set legal compliance without the authoritative rules engine.
- Untrusted retrieved manuals and third-party payloads are data, not executable instructions.
- External network adapters never inherit arbitrary workstation or radio control access.
- Source metadata, units and uncertainty travel with the data through the full response.
- High-risk physical actions are entirely excluded from initial scopes.
- Host-specific UI affordances are optional; all critical results must be readable as text.

## Selective domain orchestration

The [Domain & Orchestration Design v0.4](../superpowers/specs/2026-10-14-qrvai-domain-orchestration-design.md) defines how 24 capabilities route through simple Skills/Tools, stateful workflows, and only four candidate specialized orchestrators (RF Engineering, Equipment Diagnostics, Regulatory Compliance and EmComm Training). This is **not** a commitment to 24 agents or one agent per module. The preferred default is a deterministic tool or workflow; model-driven specialists require explicit later performance and safety justification.

## Trade-offs and consequences

**Benefits:** correct-by-construction numerical primitives; reusable widgets; provider independence; explicit permissions; domain expansion without duplication; ChatGPT-first UX.

**Costs:** backend hosting, schema compatibility, privacy design, adapter maintenance, higher QA burden and host-specific interface verification. Manage by delivering a small slice first.

**Rejected for MVP:** complex microservices, always-on telemetry ingestion, broad manual scraping, transmitting device control, emergency live network coordination.

## Technology selection status

- Python-backed numerical/rules tools and a TypeScript MCP Apps UI are **candidates**, not binding dependencies.
- Prefer official MCP server and Apps SDK guidance at implementation time; SDK versions, hosting runtime, schema format and authentication shall be pinned only in an approved implementation specification.
- Hosting/deployment/vendor choices are not made by this ADR.

## Review gates

- Verify source terms and regulatory rules before consuming them.
- Run numerical and UI tests against an exact implementation before declaring any tool accurate.
- Obtain design owner approval before an implementation plan, and separate authorization for plugin publication, external account access or radio/device control.
- Revisit ADR if offline-first operation becomes the dominant requirement.

**Linked:** [Master Design](../superpowers/specs/2026-10-14-qrvai-capability-design.md) · [Interactive Catalog](interactive-tools-catalog.md) · [Roadmap](../roadmap/2026-10-14-qrvai-master-roadmap.md).
