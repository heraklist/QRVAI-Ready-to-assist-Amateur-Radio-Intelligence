# QRVAI Domain & Orchestration Architecture v0.4

**Date:** 2026-10-14  
**Status:** DRAFT FOR OWNER REVIEW — approved conceptual direction, written architecture pending review  
**Scope:** Domain topology, coordination model, specialist responsibilities, data contracts, safety, interactive workbenches and validation. No runtime or agent is implemented.  
**Related design:** [Master Capability Design v0.3](2026-10-14-qrvai-capability-design.md) · [Interactive Tools Catalog](../../architecture/interactive-tools-catalog.md) · [ADR-0001](../../architecture/ADR-0001-hybrid-mcp.md) · [Roadmap](../../roadmap/2026-10-14-qrvai-master-roadmap.md)

## 1. Agreed direction and definitions

Build **one QRVAI Plugin**, organized into four capability families and 24 domain capabilities. Use selective orchestration only for tasks that need coordination across sources, tools, policies or persistent workflow state. Interactive tools are first-class experiences attached to domain workflows but implemented using reusable numerical/data services.

| Term | Meaning in QRVAI | Is it its own agent/server? |
|---|---|---|
| Plugin | User-facing product packaging/identity and integrations | One product, not one per domain |
| Capability family | Product taxonomy grouping domains | No |
| Domain capability/module | Bounded expertise, workflows, owned contracts and tests | Not necessarily |
| Sub-capability | Narrow function inside a domain, such as impedance matching | No |
| Skill | Versioned instructions/procedures and domain boundaries used by AI | No |
| Deterministic engine | Reproducible computational/rules code | No AI agent required |
| Tool | Typed MCP operation exposing an engine or provider | Not an agent |
| Workflow | Explicit, potentially stateful stages with retries/checkpoints | Can be code-driven |
| Orchestrator | Responsible for selecting/ordering bounded capabilities and merging evidence | Usually a workflow; may selectively contain an agent |
| Specialist agent | Separate model-driven worker with scoped instructions, tools and output schema | Yes, only when justified |
| MCP App | Interactive view/controls over typed tool results | UI, not an agent |
| Source adapter | Contract to official docs/feeds or user-authorized providers | No |

**Invariant:** 24 domain capabilities do NOT imply 24 LLM agents, 24 orchestrators, 24 MCP servers or 24 deployments.

## 2. Architecture choices and trade-offs

| Option | Strength | Risk | Decision |
|---|---|---|---|
| Separate specialist agent for every domain | Clear topical boundaries | Cost, latency, conflicting answers, unnecessary handoffs, policy duplication | Reject as default |
| Monolithic generic orchestrator for all user tasks | Simple first prototype | Becomes fragile, poorly testable, blends legal and quantitative boundaries | Reject as end-state |
| Shared engines + routed skills + selective, bounded domain workflows | Reusable tools, measurable outputs, incremental adoption, consistent policy | Requires formal contracts and good routing tests | **Adopt for proposed architecture** |

A **lightweight main router** initially delegates to direct tools, skills or workflow handlers. Four optional specialized orchestrators cover multi-stage classes of work. Add a separately model-driven specialist only if deterministic coordination plus existing host tool calling demonstrably underperforms on a measurable task.

OpenAI's Agents documentation distinguishes manager/agents-as-tools (manager owns final response) from handoffs (specialist takes over). **Manager ownership** is the preferred pattern where an independent model specialist is eventually necessary. Framework selection is deferred; do not assume an Agents SDK agent is automatically available inside a basic MCP plugin.

## 3. Conceptual topology

~~~text
ChatGPT User
    |
    v
QRVAI Plugin: Skills + MCP Tool/Apps entrypoints
    |
    +--> Intent/Context Router [read-only, no implicit privilege]
              |
              +--> Simple Skill + Tool (single-step)
              +--> Stateful Workflow (deterministic)
              +--> Selective Domain Orchestrator (complex, bounded)
                       |
                       +--> RF Engineering Orchestrator [OR-ENG]
                       +--> Equipment Diagnostics Orchestrator [OR-DIAG]
                       +--> Regulatory Compliance Orchestrator [OR-REG]
                       +--> EmComm Training Orchestrator [OR-EMCOMM]
              |
              v
      Shared Typed Service Layer
      RF Math | National Rules | Manual Search | Source Registry
      Propagation | Geospatial | Provider Adapters | Profile Store
              |
              +--> MCP Apps (visualize approved tool outputs)
              +--> Optional read-only local device bridge (future)
~~~

Cross-domain questions can invoke more than one workflow. Their results are collected through common contracts; there is **no agent-to-agent uncontrolled tool authority, no arbitrary recursive delegation, and no implicit hardware control**.

## 4. Domain ownership and routing matrix

**Routing type legend:**  
**D** = direct Skill + Tool/Engine (stateless unless user profile explicitly needed)  
**W** = structured workflow (multi-step/stateful; usually deterministic coordinator)  
**O** = eligible specialized orchestration for complex requests, not required on every question  
**F** = future or conditional advanced model specialist only after separate evaluation  

A domain can offer direct responses and complex orchestrated flows. The routing value below specifies the **primary** path for non-trivial tasks; the router should always choose the least complex sufficient path.

| ID | Domain module | Primary route | Specialist owner / shared dependency | Related interactive tools |
|---|---|---|---|---|
| A01 | Civil Protection & Disaster Preparedness | W/O | OR-EMCOMM; source registry, training templates | UI-26, UI-28 |
| A02 | Emergency Communications & Traffic Handling | W/O | OR-EMCOMM; authorized protocol library, simulation state | UI-27, UI-28 |
| A03 | Frequency & Spectrum Intelligence | D/W/O | OR-REG for permission requests; allocation/versioned directory | UI-17, UI-19 |
| A04 | Regulatory & Licensing Intelligence | W/O | OR-REG; official versioned legal sources | UI-18 |
| A05 | RF Safety, EMC & Interference | W/O | OR-ENG for calculations; OR-REG for requirements; safe diagnostics | UI-15, UI-16 |
| B06 | Equipment Support & Manuals Intelligence | W/O | OR-DIAG; versioned/manual-specific source index | UI-12, UI-13 |
| B07 | RF Engineering & Calculations | D/O | OR-ENG only for complex design; numerical engine | UI-01, UI-02, UI-04 |
| B08 | Antennas & Transmission Lines | D/W/O | OR-ENG; RF/NEC modeling, impedance | UI-03, UI-05, UI-06, UI-07 |
| B09 | Radio Electronics & Circuits | D/W/O | OR-ENG; RLC/filter analysis; safe circuit guidance | UI-08 |
| B10 | Test Equipment & Diagnostics | W/O | OR-DIAG and OR-ENG; measurement parser | UI-09, UI-10 |
| B11 | Station Control & Integration | W/O | OR-DIAG; device profiles, local read-only bridge | UI-11 |
| B12 | Power Systems & Infrastructure | D/W | Numerical power engine; OR-EMCOMM for readiness scenarios | UI-14 |
| B13 | SDR & Digital Signal Processing | D/W/F | DSP/spectrum engines; specialist only if separately justified | UI-10 |
| C14 | Operating & DX Intelligence | D/W | Operating Skills, valid spots/providers, optional route planner | UI-25 |
| C15 | Propagation & Space Weather | D/W | Weather/propagation service; time-aware source adapters | UI-20, UI-21, UI-22 |
| C16 | Digital Modes & Computer Radio | W/O | OR-DIAG for software/CAT/audio troubleshooting | UI-31 |
| C17 | Packet, APRS, Winlink & Mesh | D/W | Digital network models; OR-EMCOMM for drills only | UI-29 |
| C18 | Repeaters & Digital Voice | D/W | Verified directory, frequency engine, device-specific settings | UI-19, UI-30 |
| C19 | Satellites, EME & Weak Signal | D/W | Ephemerides/geometry/weak-signal engines | UI-24 |
| C20 | Logbook, QSL & Awards | D/W | ADIF/award engines; consent and identity boundary | UI-32 |
| C21 | Contests, Portable & Outdoor Radio | W | Rules/profile/logbook; power/locator tools | UI-33 |
| D22 | Amateur Radio Academy & CW | D/W | Curriculum, CW/training engine | UI-34 |
| D23 | Maker, Research & Software Development | D/W/F | Circuit/firmware Skills and validated design aids | UI-35 |
| D24 | Clubs, Community & Mentoring | D/W | Club-authorized inventory/calendar data; privacy | UI-36 |

**Note:** A domain module is a product contract/ownership boundary. Its implementation can call common engines also used by other domains. No standalone deployment is implied.

## 5. Proposed orchestrators: responsibilities, triggers, guarantees

### OR-ENG — RF Engineering Orchestrator

**Trigger:** Design/diagnostic request spans two or more RF disciplines (antenna + impedance + feedline + link budget + measurement).  
**Allowed actions:** Gather validated parameters; invoke deterministic RF maths; compare model/scenario variants; optionally request antenna simulation when an approved engine and geometry are available; assemble provenance and plots.  
**Sub-capabilities:** antenna geometry, matching, link budget, RF safety worksheet, instruments, losses, filter response.  
**Mandatory guards:** Unit semantics (dBi vs dBd, W vs dBm), calibration, loss direction, reference impedance, assumption tracing; computed values must cite model/equation revision.  
**Output:** structured design options, calculation trace, uncertainty/assumptions, validated plot data, build/test caveats.  
**Disallowed:** Guessing NEC patterns without simulation; interpreting calculator as installation/radiation certification.

### OR-DIAG — Equipment Diagnostics Orchestrator

**Trigger:** Multi-component problem across radio, PC, audio, CAT, firmware, modes, cables or test instruments.  
**Allowed actions:** Identify exact radio/model/firmware; obtain authorized manual/version; route question through evidence-backed diagnostic decision tree; suggest safe checks; compare observed symptoms to expected signals.  
**Sub-capabilities:** manufacturer manuals, CAT/audio path, digital modes, measurement diagnostics, device settings.  
**Mandatory guards:** Do not invent menu numbers; model-specific instructions require sourced manual, exact version or explicit uncertainty. Avoid unsafe servicing and unauthorized codeplug/writes.  
**Output:** ordered safe diagnostic steps with source/page references, expected observations and recommended stop conditions.  
**Disallowed:** Issuing hardware writes, PTT or firmware update automatically.

### OR-REG — Regulatory Compliance Orchestrator

**Trigger:** "May I transmit?" / "Which frequencies and modes are authorized?" / comparison across national/CEPT/IARU frameworks.  
**Allowed actions:** Validate jurisdiction, station/operator context, frequency, emission/mode, power, date; retrieve official effective rules; resolve rule precedence; return traceable conclusion.  
**Sub-capabilities:** country license rules, frequency allocation, IARU band-plan recommendations, permit restrictions, RF exposure requirements.  
**Mandatory guards:** Binding law > advice; version and temporal checks; if essential inputs, current authoritative rules or interpretation are missing, return **INDETERMINATE**, not an invented "ALLOWED". Legal ambiguities flagged for human/legal verification.  
**Output:** ALLOWED / NOT_ALLOWED / INDETERMINATE, applied sources and dates, explanation of limits, unresolved facts.  
**Disallowed:** Making permits or authorizing transmission; legal certification.

### OR-EMCOMM — Emergency Communications Training Orchestrator

**Trigger:** Preparedness/drills and resilience plans involving teams, radio net, message routing, dependencies or fallback links.  
**Allowed actions:** Build **simulated** exercise and readiness checklists; generate approved message-training templates; model hypothetical net outages and resource inventories; present sources and organizational prerequisites.  
**Sub-capabilities:** emergency communications instruction, station readiness, power plans, network topology, formal message drills, local voluntary procedures.  
**Mandatory guards:** Simulation clearly marked; no impersonation of government, no official dispatch claims; distinguish training from live emergency; never assume use permission on a frequency or shared official channel.  
**Output:** drill plan, test scenario, operational prerequisites and training after-action record.  
**Disallowed:** Live incident command, public alert issuance, remote radio activation, autonomous priority routing into actual emergency services.

### Global Router — not necessarily an LLM agent

Initial solution: declarative capabilities, stable tool descriptions, light intent classification and a typed workflow selector. Avoid complex model-driven orchestration when the user asks a direct unit conversion or a specific manual lookup. A true multi-agent runtime remains an **opt-in future architectural choice**, not a prerequisite.

## 6. Selection and escalation policy

The router applies these ordered rules:
1. Resolve requested outcome and whether the task implicates legal authorization, physical RF hazards, personal data or emergency operations.
2. Select **D** for a bounded one-step question; no state or LLM delegation needed.
3. Select **W** when a structured multi-step diagnostic, import or training flow needs checkpoints and resumability.
4. Select **O** only when multiple independent sub-capabilities must be coordinated and the user benefits from a synthesized answer.
5. Consider model-driven specialist **F** only after evaluation shows improvement beyond a regular workflow and the user/product team accepts costs and guardrails.
6. Do not parallelize tasks with data or authority dependencies; do not delegate compliance authority to a model.
7. Every tool permission is checked by the server for the specific operation and identity; routing never adds permissions.

**Default decision:** Direct tool > deterministic workflow > bounded orchestration > optional separate AI specialist. No agent fan-out by domain count.

## 7. Workflow and agent contracts

### Context contract

- request_id; locale (el/en); task_intent; selected_domain_ids
- input_context: operator QTH/country, license class if relevant, radio model/version, dates, frequency, mode, power, units
- permission_context: anonymous / user-authorized profile read / user-authorized log write / **future** local read-only device access
- no sensitive context attached to irrelevant tools; minimize logging

### Invocation contract (conceptual)

- workflow_id and version; normalized inputs and strict input schema
- declared outputs, required data sources, allowed tool set
- action_grade: INFO_READ / SIMULATION / AUTHORIZED_USER_DATA_WRITE / FUTURE_DEVICE_READ
- budget: bounded number of tool calls, model specialist calls, time and cost ceiling (values finalized during implementation planning)
- cancellation and retry/replay policy with idempotency where relevant
- safety policy and validation requirements inherited, not weakened, by child workers

### Result contract

- outcome_status: COMPLETE / PARTIAL / INDETERMINATE / BLOCKED / FAILED
- domain_results[]: source_id, source_version, checked_at/effective_at/observed_at, units, values, uncertainty and method
- warnings[], assumptions[], unresolved_questions[]
- ui_payload[] with validated series and accessibility fallback
- no claims of measured or live values from simulated/example data

**Specialist output:** structured findings with evidence references, no authoritative final response, and no privileged actions. The parent/router verifies schema and merges only compatible conclusions.

### State contract

Keep only the minimum state needed for the current workflow and explicitly consented user profiles. Mark each step NOT_STARTED / RUNNING / WAITING_FOR_USER / COMPLETED / FAILED / CANCELED. Never keep PTT/transmit intent as resumable background work. Disconnected hardware, missing profile or invalid external source produce safe, explicit states.

## 8. End-to-end workflow scenarios

### E2E-01 — 144 MHz Yagi design with Smith Chart

1. Router identifies B07/B08/B09 and selects OR-ENG (not 3 agents).
2. Validate antenna goals, frequency, boom/elements geometry and feedline parameters.
3. Invoke deterministic geometry/impedance calculators; optional modeled pattern only if an antenna simulation engine is genuinely available.
4. Invoke matching and feedline tools with exact reference impedance and loss units.
5. Show UI-05 Smith Chart, UI-06 geometry, UI-03 coax loss and UI-07 actual/sourced modeled pattern if available.
6. Reconcile mismatch, bounds and missing simulation data; return a build/test plan without asserting verified field performance.

**Fail-closed:** If NEC model unavailable, report calculated geometry and omit invented radiation pattern.

### E2E-02 — Radio + WSJT-X transmit audio not working

1. Router identifies B06/B11/C16 and invokes OR-DIAG.
2. Validate rig model/firmware, OS/interface, software versions and symptoms.
3. Retrieve permitted and versioned manual instructions with page citations.
4. Show UI-31 signal-path diagnosis and UI-12 guided checks; ask for only missing essential settings.
5. Recommend bounded observation/test steps; never activate PTT from the plugin.
6. Return likely causes, evidence and next checks; stop when procedure could involve dangerous maintenance or unsupported firmware action.

### E2E-03 — Amateur-band legal check in Greece

1. Router identifies A03/A04/A05 and invokes OR-REG.
2. Ask for exact country/location, license class, frequency, modulation, bandwidth, power and operating date if necessary.
3. Fetch official rule version and contrast IARU recommendations separately.
4. Produce UI-17 band explorer and UI-18 permission matrix; clear legal source/temporal trace.
5. Return only substantiated permission status, otherwise INDETERMINATE.

### E2E-04 — Civil Protection communications exercise

1. Router identifies A01/A02/B12/C17; select OR-EMCOMM with training-only status.
2. Build exercise roles, safe hypothetical radio links, capacity assumptions and contingency planning.
3. Use UI-26 station readiness board, UI-27 message-trainer, UI-28 resilience simulation.
4. Distinguish official authority from volunteer activity, identify agency-specific approval prerequisites and limits.
5. Produce printable training plan and after-action checklist; no real dispatch or autonomous transmissions.

## 9. MCP Apps / interactive contract

The **UI is a view, not a source of truth**. Every complex chart requires reproducible typed output from services. 
- Use common widgets: unit-aware inputs, plot renderer, band overlays, source/version panel, approval dialogs, diagnostic steppers and accessible chart tables.
- Distinguish sample, modeled, observed and current data visually and textually.
- Input changes request a recalculation or cached deterministic transform; no false claim of a live source.
- Every widget has a mobile and keyboard-accessible fallback, and a full text explanation.
- Respect host capabilities and tested MCP Apps version; dynamically unsupported views degrade safely.

Reusable examples: UI-02 link budget can support B07, B12 and readiness planning; UI-17 frequency explorer can serve A03, A04, C18 and C21; UI-13 manuals can serve B06, B11 and C16. Implement a tool once, expose it where useful.

## 10. Separation of authority / threat model

- **Untrusted content:** Manuals, website pages, community repeaters, IQ files and external tool responses are untrusted data; never executable policy or instructions.
- **Regulatory:** No model can override official rule validation, license, jurisdiction or effective date.
- **Emergency:** No status as an officially mandated emergency service, no autonomous public alerts, dispatch or channel reservation.
- **Radio hardware:** No remote keying, PTT, automatic TX or configuration writes. A future read-only bridge must use explicit opt-in and capability allow-list.
- **Privacy:** Callsigns/QTH/logs can identify users. Require consent, minimum retention and domain-scoped tool access.
- **External APIs:** Every source has licensing, subscription, freshness, rate-limit and access terms verified before production use.
- **Agent guardrails:** Domain specialists cannot spawn unbounded specialist trees or expand tool grants. One parent owns the final synthesized response, factual trace and user-facing uncertainty.

## 11. Integration and observability

Each major workflow should expose inspectable events: routing decision, selected domains, tool inputs (redacted), schema validation, source IDs/versions, elapsed time, fallback triggers, blocked actions and outcome status. Never record secrets, private logs or full manual content in operational traces without explicit policy. Preserve deterministic replay fixtures and isolate synthetic test records from personal QSOs.

**Fallback:** Tool timeout or source outage → report PARTIAL/INDETERMINATE. Model specialist error → revert to straightforward diagnostic workflow or stop safely. UI failure → textual result and table. No speculative fix for legal eligibility or emergency authorization.

## 12. Acceptance criteria

### Taxonomy/routing
- [ ] All 24 domain IDs map to owners, source classes, direct tools, at least one representative workflow and intended UI.
- [ ] Single-step dBm calculation never invokes an orchestrator or LLM specialist needlessly.
- [ ] Complex Yagi design invokes bounded OR-ENG and makes no simulated-pattern claim without actual simulator output.
- [ ] Cross-domain routing preserves user consent and source provenance.

### Workflow reliability
- [ ] Contract schema rejects missing units, unsupported modes, invalid state transitions, unauthorized tool requests and malformed provider payloads.
- [ ] Retried steps are safe/idempotent as specified; cancellations cannot trigger work after stop.
- [ ] Agent/tool call caps, latency budgets, cost reporting and tracing can be verified with observed runs.
- [ ] Specialist contradictory findings are resolved as unresolved or BLOCKED, not silently merged.

### High-risk regressions
- [ ] OR-REG yields INDETERMINATE on unknown Greek license, stale/contradictory law, unspecified region or no authoritative primary source.
- [ ] OR-EMCOMM activities display simulation status, do not contact authorities and cannot transmit.
- [ ] OR-DIAG never runs PTT, firmware flashing or unsafe equipment repair.
- [ ] External prompt injection cannot alter permissions, policy, router selection or source trust.

### Interactive engineering
- [ ] Numerical engines pass reference/golden tests and preserve units; a visual chart displays exactly the validated series.
- [ ] UI shows source timestamp, model/simulation status, fallback for offline/no provider and accessibility alternatives.
- [ ] Real-client compatibility and security reviews occur before claiming plugin usability.

## 13. Phasing, risks and deferred decisions

**M0 (now):** Draft and review this document as part of PR #1. No code, framework choice or plugin publication.  
**M1:** Build deterministic RF engines and first UI-01–04; direct tool invocation first. Add OR-ENG orchestration only to demonstrate a genuinely cross-subsystem scenario.  
**M2:** Regulatory rules and source governance; OR-REG only after primary legal-source fixtures exist.  
**M3:** Manuals/supported rigs and safe diagnostic workflow; OR-DIAG when evidence and interactive steps are reliable.  
**M6:** Emergency training workflow; OR-EMCOMM as an explicit simulated, authority-aware domain boundary.

**Do not build:** a separate AI agent per domain, cross-agent message bus, microservices fleet, production CAT write actions, autonomous emergency coordination or high-cost agent orchestration without a clear case.

**Review decisions still required before implementation:** first production vertical slice (M1 RF or M2 regulations); official legal-review owner; whether plugin is open source/community/commercial; target MCP host runtime and supported UI; specialist-model budget thresholds.

## 14. Reference documents

- [OpenAI: Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration) — managers versus handoffs.
- [OpenAI: Agent definitions](https://developers.openai.com/api/docs/guides/agents/define-agents) — specialist responsibilities and tools.
- [MCP server/tools specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx) — typed tools and discovery.
- [MCP Apps](https://apps.extensions.modelcontextprotocol.io/) — interactive view protocol, version/host support to be rechecked.
- [QRVAI Master Capability Design](2026-10-14-qrvai-capability-design.md) — domain definitions and provenance requirements.
- [QRVAI Interactive Catalog](../../architecture/interactive-tools-catalog.md) — UI-01 through UI-36.

**Evidence/authorization statement:** This written specification is a proposed architecture artifact and has not been implemented or tested. Its publication on a documentation review branch does not authorize an implementation, merge, remote deployment, radio control or public plugin release.
