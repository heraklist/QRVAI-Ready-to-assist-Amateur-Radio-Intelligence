# Family A — Safety, Civil Protection & Regulations (V0)

This is a **newly authored QRVAI reference** derived from the current GitHub QRVAI v0.5 Capability Register. It is an instruction/reference document, not a legal authorization database, live dispatch service or operational MCP tool.

## Task contract

When relevant, ask for country, licence class, frequency, mode, power, operating date and exact location. Never infer a right to transmit from an IARU recommendation. Current binding national legal text outranks nonbinding recommendations; if official effective law has not actually been retrieved and checked, state **INDETERMINATE** rather than ALLOWED. RF exposure advice is screening, not a certification. All EmComm outputs are exercises: never dispatch real messages or activate a station.

## Canonical Domain/Sub-capability descriptions

### A01 — Civil Protection & Disaster Preparedness

**Purpose:** Create a documented, local-authority-aware emergency preparedness plan.  
**Required context:** incident scenario, jurisdiction, team roles, station inventories.  
**Deliverable:** exercise-ready readiness matrix and resource shortfall report.  
**Non-bypassable boundary:** Training and preparedness only; not official activation.  
**Owner Skill:** `SK-A01` (planned package `skills/civil-protection/SKILL.md`); *workflow sub-skills* `SS-A01-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-A01-1` — Preparedness Baseline | inventory go-bags, batteries, frequencies and volunteers; identify unverified legal assumptions | `SS-A01-1` |
| `SC-A01-2` — Resilience Design | compare station and power backups; explicitly mark simulated outages | `SS-A01-2` |
| `SC-A01-3` — Exercise Review | produce measurable exercise checks and after-action recommendations | `SS-A01-3` |



---

### A02 — Emergency Communications & Traffic Handling

**Purpose:** Train radio message handling and simulated emergency-network coordination.  
**Required context:** training scenario, team roles, message form, simulated channels.  
**Deliverable:** structured training message log and net-exercise plan.  
**Non-bypassable boundary:** No live agency dispatch, unofficial 'priority' authority or PTT.  
**Owner Skill:** `SK-A02` (planned package `skills/emcomm-traffic/SKILL.md`); *workflow sub-skills* `SS-A02-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-A02-1` — Net Role Training | teach NCS/check-in procedures and distinct message roles | `SS-A02-1` |
| `SC-A02-2` — Message Integrity Drill | validate structured message headers, repeats, acknowledgements and timestamps | `SS-A02-2` |
| `SC-A02-3` — Fallback Traffic Simulation | run exercise-only failure and alternative path plan | `SS-A02-3` |



---

### A03 — Frequency & Spectrum Intelligence

**Purpose:** Explain frequency allocation and recommended operating segments with verified temporal context.  
**Required context:** location/country, frequency, mode, license class where required, date.  
**Deliverable:** source-layered allocation/band-plan interpretation or insufficient-data result.  
**Non-bypassable boundary:** Band plan is not a legal authorization.  
**Owner Skill:** `SK-A03` (planned package `skills/frequency-intelligence/SKILL.md`); *workflow sub-skills* `SS-A03-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-A03-1` — Allocation Lookup | retrieve effective national frequency allocation and its legal status | `SS-A03-1` |
| `SC-A03-2` — Band Plan Overlay | overlay IARU recommendations distinctly from binding law | `SS-A03-2` |
| `SC-A03-3` — Channel/Repeater Reference | filter source-verified repeater/beacon/channel metadata with freshness | `SS-A03-3` |



---

### A04 — Regulatory & Licensing Intelligence

**Purpose:** Evaluate whether an operator scenario meets documented applicable radio rules.  
**Required context:** country, operating place/date, license class, exact emission, power.  
**Deliverable:** ALLOWED/NOT_ALLOWED/INDETERMINATE with rule and exception trace.  
**Non-bypassable boundary:** Never issue an amateur licence or provide unsupported legal certainty.  
**Owner Skill:** `SK-A04` (planned package `skills/regulatory-licensing/SKILL.md`); *workflow sub-skills* `SS-A04-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-A04-1` — Licence Context | determine credential, class, privileges and portability requirements | `SS-A04-1` |
| `SC-A04-2` — Transmission Rule Evaluation | apply versioned legal rules to a fully specified operating scenario | `SS-A04-2` |
| `SC-A04-3` — Cross-border Explanation | separate domestic law, CEPT/HAREC mechanisms and recommendations | `SS-A04-3` |



---

### A05 — RF Safety, EMC & Interference

**Purpose:** Screen RF exposure and help diagnose unintended interference with verified assumptions.  
**Required context:** station setup, frequencies/power/duty, safety jurisdiction, measured symptoms.  
**Deliverable:** risk-scoped screening and non-invasive RFI checklist.  
**Non-bypassable boundary:** Not exposure certification; not a replacement for electrical safety professional.  
**Owner Skill:** `SK-A05` (planned package `skills/rf-safety-emc/SKILL.md`); *workflow sub-skills* `SS-A05-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-A05-1` — RF Exposure Worksheet | calculate conservative input-dependent exposure screening, cite local threshold | `SS-A05-1` |
| `SC-A05-2` — Interference Troubleshooting | systematically isolate RFI symptom patterns without unsafe procedures | `SS-A05-2` |
| `SC-A05-3` — Installation Risk Review | flag lightning, grounding and mains-electrical situations for qualified personnel | `SS-A05-3` |

