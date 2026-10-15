# QRVAI Orchestrators & Routing Control Contracts v0.5

**Date:** 2026-10-14. **Status:** PROPOSED. Four candidate domain orchestrators + one minimal main router, not independently deployed agents. Extends [v0.4 orchestration spec](../superpowers/specs/2026-10-14-qrvai-domain-orchestration-design.md).

## Architectural invariant

A user-facing Domain Module is a **capability/ownership boundary**, a Skill is a **host-discoverable instruction package**, a Sub-skill is an **internal procedure**, an Engine is an **execution library**, an MCP Tool is a **typed callable interface**, and an Orchestrator is a **bounded cross-tool workflow**. None imply a separate LLM agent. **Main Router** chooses the simplest valid path.

## Shared workflow state machine and contracts

**Input:** task_id; intent; locale; validated context; selected domain ids; declared input unit/precision; approved tool allowlist; effective auth scopes; source freshness requirements; task-specific stop criteria.

**States:** NEW → CONTEXT_VALIDATION → SOURCES_READY → EXECUTION → RESULT_VALIDATION → COMPLETED / PARTIAL / INDETERMINATE / BLOCKED / FAILED / CANCELLED.

**Invariant:** each state transition is declared, logged with redacted personal context and idempotently replayable where appropriate. A subprocedure never inherits a broader scope than the parent request. Tool output is treated as untrusted until schema/source/permission validation. A model-produced suggestion cannot change jurisdiction, permission grade, radio hardware capability or simulation flag.

**Output:** structured answer status; task_id; validated result and units; per-source identity/version/effective_at/observed_at; assumption/warnings; invoked engine/tool IDs; proposed visualization ID; missing data; user-visible safe next step.

**Routing policy:** DIRECT if single published tool suffices; WORKFLOW for multi-step checks and state; ORCHESTRATOR for cross-domain dependencies, strict evidence synthesis, multiple tool outputs; OPTIONAL SPECIALIST MODEL only if measured advantage on a set of held-out tests. Specialist agents are never created per domain by default.

## OR-ENG — RF Engineering

**Owns:** cross-subcapability engineering design involving B07/B08/B09/B10/B12 and A05 as required.  
**Triggers:** link-budget + feedline + antenna matching; measurement-based troubleshooting; multiple engineering alternatives.  
**Inputs:** station goal, frequency, power, antenna/ground model, impedances, cable profile, instrument/source revision, unit constraints, desired performance.  
**Steps:** confirm exact quantities → select E03 RF Maths and E04 solver where available → compute M07–M13 and parse M15 only for uploaded evidence → independently check dimensional coherence and solver presence → present validated UI-01 to UI-09 charts → provide measured/modelled distinction.  
**Output:** scenario alternatives, numbered calculations and tolerances, Smith/attenuation/geometry plots only from true computed series, test suggestions and missing model flags.  
**Stop conditions:** missing quantitative reference, impossible impedance/negative attenuation convention, absent NEC adapter for requested radiation pattern, unsafe RF exposure/electrical intervention. No fabricated pattern.  
**Tests:** 100 W = 50 dBm; loss sign; mismatch extremes; solver unavailable; numerical/visual parity.

## OR-DIAG — Equipment Diagnostics

**Owns:** B06/B10/B11/C16 multi-component radio setup and signal-path diagnostics.  
**Triggers:** symptom spans rig/firmware/PC/audio/CAT/USB/measurement, or a multistage manual-backed checklist.  
**Inputs:** exact vendor/model, firmware and software versions (or explicit unknown), OS/interface/topology, observed/expected condition, manual rights.  
**Steps:** locate exact documented hardware profile via E06/E07 → cite manual by edition/page → build reversible stepper using M17–M20/M28 → process user-confirmed observations → list supported hypotheses and escalation to service technician.  
**Output:** safe diagnostic sequence, model/version/page citations, expected observation per step, no-risk stop note.  
**Stop conditions:** ambiguous manual revision, undocumented menu, unsafe high-voltage repair, action would invoke transmit/firmware write.  
**Tests:** mismatched revision, invented option prohibited, manual prompt injection, absent rig, unsupported platform.

## OR-REG — Regulatory Compliance

**Owns:** A03/A04/A05 decision pathway; links relevant operating domains without delegating legal permission to a model.  
**Triggers:** user's question could imply a frequency/mode/power/transmit permission or national compliance judgement.  
**Inputs:** jurisdiction/country, precise QTH, licence class, operating date, frequency and bandwidth, emission/mode, power and any relevant exceptions.  
**Steps:** retrieve verified current official legal sources via E01 and source registry → filter effective dates and permit/exception facts → evaluate deterministic rules through M04 → show separate IARU recommendation overlay M05 → apply precedence → explain sources/uncertainties.  
**Output:** ALLOWED / NOT_ALLOWED / INDETERMINATE, exact rule IDs, effective date, missing facts, localized caution. **This is an informational rules-engine result, not a government authorization.**  
**Stop conditions:** absence of official rule, conflicting current texts, unknown credential, unresolved power metric (ERP vs EIRP vs transmitter), ambiguous location/date. Return INDETERMINATE and source links, not "probably legal."  
**Tests:** band boundary, conflicting advisory, outdated law, unknown region, permission class mismatch.

## OR-EMCOMM — Civil Protection / Emergency Training

**Owns:** A01/A02, with B12/C17 support for training scenarios. **Never operates a real incident.**  
**Triggers:** planning a preparedness exercise, volunteer training/net, hypothetical failure and backup paths, message forms.  
**Inputs:** simulation scenario, jurisdiction, exercise role, team assets, power and communication topology, officially approved protocol references where relevant.  
**Steps:** mark simulation prominently → select training templates and roles → generate hypothetical exercise with M34/M35 → estimate backup resilience with M22/M29 → provide debrief and explicit legal/agency prerequisites.  
**Output:** exercise-only resource checklist, training messages, debrief and after-action metrics.  
**Stop conditions:** user requests autonomous official dispatch, real emergency priority channel control, unsupported net authority, unauthorized message broadcast or PTT. Redirect to official channels and human operators for genuine incidents.  
**Tests:** spoofed agency permission, confusing live vs drill, missing approved frequency, no radio bridge access.

## Main Router

**Inputs:** intent, locale, safety and auth context, available published Skills/Tools, host UI capabilities, valid selected file resources.  
**Decision:** choose one direct Skill/Tool for specific task; follow specialized workflow only for multi-stage state; prefer OR-ENG/DIAG/REG/EMCOMM when triggers above are met; no unrestricted multi-agent chain.  
**Outputs:** chosen domain IDs; strategy DIRECT/WORKFLOW/ORCHESTRATED; minimum necessary context; read-only allowlist; reasoning *summary* of selection (not hidden reasoning); tool/result provenance.  
**Stops:** invalid permission, stale legal data, provider rights denial, unexpected hardware action request, or unsupported client.  
**Tests:** simple conversion bypasses orchestrators, complex Yagi invokes OR-ENG, Greek legal question invokes OR-REG, protected log doesn't invoke without scopes, injected manual doesn't escalate rights.

## Escalation and role evaluation

A true standalone model specialist is permissible only after a comparative experiment:
- Baseline deterministic/router workflow and frozen test cases.
- Candidate specialist strict input/output schema and bounded tools, maximum calls/latency/cost.
- Measured improvement in task correctness or user experience with *no regression* in sensitive data, legal permissions or device safety.
- Owner approval of any new external model service/secret handling, plus independent review for high-impact routing changes.
- No inter-agent autonomous re-spawning, hidden private-data forwarding, or assertion that model consensus verifies mathematical/legal truth.

## Implementation phasing

Build no orchestration runtime during the documentation review. M1 direct deterministic engine and MCP tools first; then OR-ENG only when cross-tool task verified. OR-REG depends on legally reviewed Greek rules; OR-DIAG depends on rights-aware manuals; OR-EMCOMM depends on training-only source validation. These are separate vertical slices, not one bulk multi-agent launch.

**Status:** conceptual contracts, not implemented agents or tests.
