# QRVAI Canonical Capability & Sub-capability Register v0.5
**Date:** 2026-10-14 · **Status:** DESIGN CANDIDATE — no runtime exists.
**Count:** exactly **4 Families**, **24 Domain Modules**, **72 Sub-capabilities**.
**Mapping:** `Family X → Domain Xnn → SC-Xnn-1/2/3 → SK-Xnn + SS-Xnn-1/2/3`. Stable IDs are the architectural identifiers; names may be localized. No new tool/server automatically follows from a new domain.
**Scope:** all listed behaviors are proposed with explicit safety bounds, not observed operational capabilities.

## 1. Capability Family contracts

### Family A — Safety, Civil Protection & Regulations

**Mission:** Provide authority-aware, evidence-dated guidance for radio permission, safety, emergency preparedness and spectrum use.

**Hard boundary:** No dispatch; no grant of transmit rights; official local rules prevail.

**Owned domains:** A01–A05. **Verification:** at least one testable output for each domain and no bypass of shared source/consent/permissions policy.

### Family B — Engineering, Equipment & Technical Support

**Mission:** Analyze, calculate, explain and troubleshoot measurable RF, equipment and station engineering using versioned technical evidence.

**Hard boundary:** No fabricated measurements; no unsafe repairs; no autonomous device writes.

**Owned domains:** B06–B13. **Verification:** at least one testable output for each domain and no bypass of shared source/consent/permissions policy.

### Family C — Operating, Networks & Radio Intelligence

**Mission:** Support lawful on-air practices, observation-based recommendations, logs, operating modes, satellite and portable workflows.

**Hard boundary:** No invented live openings/spots; no write to third-party services without consent.

**Owned domains:** C14–C21. **Verification:** at least one testable output for each domain and no bypass of shared source/consent/permissions policy.

### Family D — Education, Community & Innovation

**Mission:** Teach radio skills, support learning, safe experimentation and consent-based amateur-radio collaboration.

**Hard boundary:** No personal club information leakage or inappropriate transmission instructions.

**Owned domains:** D22–D24. **Verification:** at least one testable output for each domain and no bypass of shared source/consent/permissions policy.

## 2. Domain and Sub-capability contracts
Each Domain declares a non-overlapping user outcome, required context, final output, and rule that cannot be bypassed. Each SC is a **distinct owned operation**, not a Skill or a server by itself.


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

### B06 — Equipment Support & Manuals Intelligence

**Purpose:** Resolve documented manufacturer-specific setup and troubleshooting problems.  
**Required context:** vendor, exact model, manual/firmware version, symptoms, rights to file.  
**Deliverable:** manual-section/page-cited setup guide with caveats.  
**Non-bypassable boundary:** No guessed menu numbers or unauthorized manual redistribution.  
**Owner Skill:** `SK-B06` (planned package `skills/equipment-manuals/SKILL.md`); *workflow sub-skills* `SS-B06-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B06-1` — Versioned Manual Retrieval | identify permitted official/user manuals by model/revision and quote narrowly | `SS-B06-1` |
| `SC-B06-2` — Configuration Walkthrough | guide model-specific front-panel/menu/port settings with evidence | `SS-B06-2` |
| `SC-B06-3` — Safe Troubleshooting | test likely causes in reversible, observable steps | `SS-B06-3` |

### B07 — RF Engineering & Calculations

**Purpose:** Provide reproducible numeric analysis of RF power, gain, noise and communication margins.  
**Required context:** typed physical values with units and assumptions.  
**Deliverable:** validated numbers, formula version, units, plots and tolerances.  
**Non-bypassable boundary:** No invented mathematical results or automatic compliance claim.  
**Owner Skill:** `SK-B07` (planned package `skills/rf-engineering/SKILL.md`); *workflow sub-skills* `SS-B07-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B07-1` — RF Unit Algebra | convert W/dBm/dBW and dBi/dBd correctly with exact references | `SS-B07-1` |
| `SC-B07-2` — Link Budget Analysis | calculate transmit chain, path attenuation and receiver margin | `SS-B07-2` |
| `SC-B07-3` — Mismatch and Noise Metrics | compute SWR/return loss, noise figure and sensitivity within assumptions | `SS-B07-3` |

### B08 — Antennas & Transmission Lines

**Purpose:** Design and evaluate documented antenna/feedline alternatives with verified models.  
**Required context:** frequency, geometry, Z0/impedance, feedline length/type and environment.  
**Deliverable:** calculations, matching suggestions, optional validated simulation traces.  
**Non-bypassable boundary:** No fabricated NEC radiation diagram or guaranteed real-world gain.  
**Owner Skill:** `SK-B08` (planned package `skills/antenna-feedline/SKILL.md`); *workflow sub-skills* `SS-B08-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B08-1` — Antenna Geometry | estimate physical geometry and expose ground/velocity caveats | `SS-B08-1` |
| `SC-B08-2` — Matching/Smith Chart | evaluate impedance locus and matching-network feasibility | `SS-B08-2` |
| `SC-B08-3` — Feedline Performance | calculate attenuation, delivered power and mismatch assumptions | `SS-B08-3` |

### B09 — Radio Electronics & Circuits

**Purpose:** Explain and calculate bounded radio-electronic networks and RF filter behavior.  
**Required context:** circuit topology, components, power and measurement conditions.  
**Deliverable:** transfer curves, resonance estimates and safe educational notes.  
**Non-bypassable boundary:** No unsupported component ratings or unsafe live repair.  
**Owner Skill:** `SK-B09` (planned package `skills/rf-electronics/SKILL.md`); *workflow sub-skills* `SS-B09-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B09-1` — Filter Modeling | calculate cutoff, Q and transfer response for supported topologies | `SS-B09-1` |
| `SC-B09-2` — RF Chain Explanation | trace mixer, oscillator, gain stage and linearity limitations | `SS-B09-2` |
| `SC-B09-3` — Component Selection Checks | compare ratings, tolerances and thermal/voltage conditions from datasheets | `SS-B09-3` |

### B10 — Test Equipment & Diagnostics

**Purpose:** Interpret calibrated RF instrument outputs and guide repeatable measurements.  
**Required context:** instrument/model, calibration state, file type, reference settings.  
**Deliverable:** measurement trace, uncertainty notes, action-safe diagnostic workflow.  
**Non-bypassable boundary:** Never claim calibration or accuracy without evidence.  
**Owner Skill:** `SK-B10` (planned package `skills/rf-measurements/SKILL.md`); *workflow sub-skills* `SS-B10-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B10-1` — VNA Trace Interpretation | parse S11/S21, reference impedance and marker readings | `SS-B10-1` |
| `SC-B10-2` — Spectrum/Test Setup | explain safe analyzer/scope/attenuator configuration and limits | `SS-B10-2` |
| `SC-B10-3` — Measurement Reconciliation | compare expected and observed metrics with uncertainty | `SS-B10-3` |

### B11 — Station Control & Integration

**Purpose:** Map station interconnections and read equipment status with explicit permission.  
**Required context:** radio/interface models, topology, approved local bridge status.  
**Deliverable:** signal-path diagram, interoperability constraints and read-only state.  
**Non-bypassable boundary:** No CAT parameter writes, PTT, remote transmission or hidden device access.  
**Owner Skill:** `SK-B11` (planned package `skills/station-integration/SKILL.md`); *workflow sub-skills* `SS-B11-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B11-1` — Signal Path Mapping | trace CAT, audio, power, tuner and interlocks in the station | `SS-B11-1` |
| `SC-B11-2` — Compatibility Check | match ports, drivers, protocols and versioned settings | `SS-B11-2` |
| `SC-B11-3` — Read-only Telemetry | retrieve authorized rig state with connected-device fault handling | `SS-B11-3` |

### B12 — Power Systems & Infrastructure

**Purpose:** Estimate station loads and energy resilience for fixed/portable installations.  
**Required context:** RX/TX power and duty cycle, battery chemistry/capacity, solar/efficiency.  
**Deliverable:** autonomy range, load table and sensitivity to assumptions.  
**Non-bypassable boundary:** No electrical installation certification.  
**Owner Skill:** `SK-B12` (planned package `skills/power-infrastructure/SKILL.md`); *workflow sub-skills* `SS-B12-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B12-1` — Power Budget | sum station loads with duty cycle and conversions | `SS-B12-1` |
| `SC-B12-2` — Battery Runtime | estimate usable capacity and autonomy with degradation range | `SS-B12-2` |
| `SC-B12-3` — Backup Scenario | compare backup topology and resilience under loss scenarios | `SS-B12-3` |

### B13 — SDR & Digital Signal Processing

**Purpose:** Teach and analyze permitted IQ and DSP datasets with reproducible parameters.  
**Required context:** sample rate, IQ samples or waterfall, filter configuration.  
**Deliverable:** spectrum/filter analysis and classification uncertainty.  
**Non-bypassable boundary:** No interception of protected communications or unwarranted signal identification.  
**Owner Skill:** `SK-B13` (planned package `skills/sdr-dsp/SKILL.md`); *workflow sub-skills* `SS-B13-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-B13-1` — Sampling Foundations | check Nyquist, aliasing, sample rate and decimation | `SS-B13-1` |
| `SC-B13-2` — Spectrum/FFT Visualization | transform authorized IQ into labeled spectral estimates | `SS-B13-2` |
| `SC-B13-3` — DSP Filter Analysis | compare digital filtering and demodulation behavior | `SS-B13-3` |

### C14 — Operating & DX Intelligence

**Purpose:** Coach correct operating procedure and evidence-backed DX planning.  
**Required context:** band/mode, station context, desired correspondent and source timestamps.  
**Deliverable:** operating workflow, conditions and verified DX references.  
**Non-bypassable boundary:** No fabricated real-time DX spots.  
**Owner Skill:** `SK-C14` (planned package `skills/operating-dx/SKILL.md`); *workflow sub-skills* `SS-C14-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C14-1` — Operating Procedure | teach SSB/CW, calling, split, pileups and etiquette | `SS-C14-1` |
| `SC-C14-2` — DX Observation Reading | distinguish verified spot data from predictions | `SS-C14-2` |
| `SC-C14-3` — Operating Scenario Plan | recommend permissible time/band strategies with uncertainty | `SS-C14-3` |

### C15 — Propagation & Space Weather

**Purpose:** Compare observed ionospheric/space weather indicators and predictive RF path models.  
**Required context:** date/time, grids, bands, NOAA metrics, model/source versions.  
**Deliverable:** model-based windows, observation plot and uncertainty.  
**Non-bypassable boundary:** Never guarantee path opening or label cached indices as live.  
**Owner Skill:** `SK-C15` (planned package `skills/propagation/SKILL.md`); *workflow sub-skills* `SS-C15-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C15-1` — Space Weather Reading | retrieve timestamped solar/geomagnetic measurements and interpretation | `SS-C15-1` |
| `SC-C15-2` — Propagation Scenario | run bounded path prediction with explicit model assumptions | `SS-C15-2` |
| `SC-C15-3` — Observation Correlation | compare modeled forecasts with actual authenticated reception reports | `SS-C15-3` |

### C16 — Digital Modes & Computer Radio

**Purpose:** Configure and diagnose amateur-radio digital mode audio/CAT/software workflows.  
**Required context:** rig, OS, interface, program/version, issue, applicable band context.  
**Deliverable:** version-cited configuration checklist and safe diagnostic steps.  
**Non-bypassable boundary:** No hidden PTT activation or transmission.  
**Owner Skill:** `SK-C16` (planned package `skills/digital-modes/SKILL.md`); *workflow sub-skills* `SS-C16-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C16-1` — Mode Basics | explain FT8/FT4/RTTY/PSK/JS8/SSTV and constraints | `SS-C16-1` |
| `SC-C16-2` — Audio/CAT Diagnostics | trace interfaces, sound devices and handshake checks | `SS-C16-2` |
| `SC-C16-3` — Software Version Guidance | resolve software-specific configuration using official docs | `SS-C16-3` |

### C17 — Packet, APRS, Winlink & Mesh

**Purpose:** Plan and explain authorized amateur packet/digital networking.  
**Required context:** protocol, equipment, permitted routing metadata and station context.  
**Deliverable:** packet routing visualization and configuration requirements.  
**Non-bypassable boundary:** No unauthorized forwarding of real traffic or private messages.  
**Owner Skill:** `SK-C17` (planned package `skills/packet-networks/SKILL.md`); *workflow sub-skills* `SS-C17-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C17-1` — Packet Frame/Routing | explain AX.25/TNC, digipeat and packet path behavior | `SS-C17-1` |
| `SC-C17-2` — APRS/Location Ethics | interpret packet paths and privacy limits | `SS-C17-2` |
| `SC-C17-3` — Winlink/Mesh Planning | assess authorized infrastructure and link dependencies | `SS-C17-3` |

### C18 — Repeaters & Digital Voice

**Purpose:** Explain, find and prepare verified repeater/memory configurations.  
**Required context:** location, radio/device, repeater source, mode, offset, tones.  
**Deliverable:** memory proposal, repeater coverage caveats and digital voice setup.  
**Non-bypassable boundary:** Directory entries must be marked by source/verification date.  
**Owner Skill:** `SK-C18` (planned package `skills/repeaters-dvoice/SKILL.md`); *workflow sub-skills* `SS-C18-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C18-1` — Analog Repeater Settings | calculate split/offset/CTCSS/DCS with source | `SS-C18-1` |
| `SC-C18-2` — Digital Voice Profiles | explain DMR/D-STAR/C4FM, hotspot and codeplug constraints | `SS-C18-2` |
| `SC-C18-3` — Directory Discovery | filter actual verified repeater metadata and freshness | `SS-C18-3` |

### C19 — Satellites, EME & Weak Signal

**Purpose:** Prepare geometry, Doppler and weak-signal operating scenarios.  
**Required context:** observer QTH/time, spacecraft/orbit revision, radio capabilities.  
**Deliverable:** pass window, estimated Doppler with freshness and pointing explanation.  
**Non-bypassable boundary:** No precise pass calculations from stale elements.  
**Owner Skill:** `SK-C19` (planned package `skills/satellites-weak-signal/SKILL.md`); *workflow sub-skills* `SS-C19-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C19-1` — Satellite Metadata | retrieve amateur spacecraft frequency/mode data and date | `SS-C19-1` |
| `SC-C19-2` — Pass/Doppler Calculation | calculate AOS/LOS/doppler using current appropriate orbit model | `SS-C19-2` |
| `SC-C19-3` — Weak-signal Workflow | teach EME, meteor scatter and VHF propagation limitations | `SS-C19-3` |

### C20 — Logbook, QSL & Awards

**Purpose:** Validate and analyze operator-authorized QSO records.  
**Required context:** ADIF log, format version, permissions, awards definitions.  
**Deliverable:** ADIF errors, QSO stats and progress against sourced award rules.  
**Non-bypassable boundary:** No silent log mutation, upload or third-party confirmation.  
**Owner Skill:** `SK-C20` (planned package `skills/logbook-awards/SKILL.md`); *workflow sub-skills* `SS-C20-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C20-1` — ADIF Integrity | parse and round-trip version-aware ADIF with provenance | `SS-C20-1` |
| `SC-C20-2` — QSO Analytics | summarize contact statistics while preserving privacy | `SS-C20-2` |
| `SC-C20-3` — Award/QSL Assessment | compare confirmations to current award criteria and services | `SS-C20-3` |

### C21 — Contests, Portable & Outdoor Radio

**Purpose:** Assist planning documented contest/activation operations.  
**Required context:** event rules, location, station capabilities and permissions.  
**Deliverable:** portable checklist, contest plan and reproducible scores.  
**Non-bypassable boundary:** Follow event/provider data terms; no invented activation approval.  
**Owner Skill:** `SK-C21` (planned package `skills/contests-portable/SKILL.md`); *workflow sub-skills* `SS-C21-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-C21-1` — Contest Rule Preparation | interpret sourced rule revision, category and scoring | `SS-C21-1` |
| `SC-C21-2` — Portable Activation Planning | plan antennas/power and access/permission requirements | `SS-C21-2` |
| `SC-C21-3` — Field Operations Review | assess log quality and activity outcome without external writes | `SS-C21-3` |

### D22 — Amateur Radio Academy & CW

**Purpose:** Teach progressive radio theory and radio-operating skills.  
**Required context:** learner level, topic, locale, assessment responses.  
**Deliverable:** adaptive lessons, CW drills and explained scores.  
**Non-bypassable boundary:** Do not claim state exam certification or reuse protected questions unlawfully.  
**Owner Skill:** `SK-D22` (planned package `skills/radio-academy/SKILL.md`); *workflow sub-skills* `SS-D22-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-D22-1` — Theory Curriculum | teach syllabus-aligned electrical/RF/regulatory concepts | `SS-D22-1` |
| `SC-D22-2` — CW Practice | provide timing/speed drills and reproducible scoring | `SS-D22-2` |
| `SC-D22-3` — Knowledge Assessment | ask and explain structured questions with source links | `SS-D22-3` |

### D23 — Maker, Research & Software Development

**Purpose:** Help safely prototype RF/electronics/software experiments.  
**Required context:** hardware target, scope, component specs, constraints.  
**Deliverable:** reproducible experiment plan, verified software options and BOM.  
**Non-bypassable boundary:** No unsafe high-energy circuit procedures or assumed compatibility.  
**Owner Skill:** `SK-D23` (planned package `skills/radio-maker/SKILL.md`); *workflow sub-skills* `SS-D23-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-D23-1` — Microcontroller Integration | develop station-adjacent Arduino/ESP32/RPi project guidance | `SS-D23-1` |
| `SC-D23-2` — Software Interoperability | review open-source radio interfaces and test strategy | `SS-D23-2` |
| `SC-D23-3` — Experimental RF Prototyping | build a safe bounded research plan with measurement checks | `SS-D23-3` |

### D24 — Clubs, Community & Mentoring

**Purpose:** Support authorized educational and logistical club operations.  
**Required context:** club permissions, group context, event/inventory info.  
**Deliverable:** meeting/workshop plans and privacy-scoped shared resource overview.  
**Non-bypassable boundary:** Never reveal non-public members/contact data without consent.  
**Owner Skill:** `SK-D24` (planned package `skills/clubs-mentoring/SKILL.md`); *workflow sub-skills* `SS-D24-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-D24-1` — Member Onboarding | prepare skill-based progression for new operators | `SS-D24-1` |
| `SC-D24-2` — Training/Event Planning | coordinate authorized workshops and activity calendars | `SS-D24-2` |
| `SC-D24-3` — Asset/Mentor Governance | maintain consent-based equipment/mentor availability records | `SS-D24-3` |

## 3. Taxonomy and ownership rules

- **Capabilities** describe value and decision boundaries; **Sub-capabilities** enumerate bounded functions; **Skills** activate conditional guidance; **sub-skills** are the procedural sections that implement a sub-capability after the parent Skill is selected.
- Every `SC-Xnn-i` has exactly one primary owner `SK-Xnn` and procedural definition `SS-Xnn-i`. Other domains MAY reuse underlying computational and data engines without duplicating them.
- **Cross-domain orchestration:** simple task → direct Skill + MCP tool; complex task → bounded workflow; orchestrators only when needed.
- **Provenance:** legal outputs include jurisdiction, effective date, primary source and condition status; live observations include observed_at/fetched_at; equations include engine revision and units.
- **Access:** information and simulation tools must not upgrade to data writes or device control. No PTT/transmission in approved design scope.
- **Implementation status:** none of these 24 Skills or 72 sub-skills has been packaged or tested.

## 4. Registry consistency gates

1. Exactly four family IDs A/B/C/D and distinct module IDs A01–A05, B06–B13, C14–C21, D22–D24.
2. Each module has **three** bounded Sub-capabilities SC-Xnn-1/2/3 with matching SS-Xnn-1/2/3 and an owner SK-Xnn; no orphan IDs.
3. Every module has explicit mission, required context, deliverable and stop boundary.
4. Every tool introduced later must map to at least one SC, and every SC intended for executable behavior must eventually map to a justified tool or documented manual-only workflow.
5. In no case may source citation alone be interpreted as validated legal permission, a measured RF quantity or government/agency authority.

**Cross references:** [Skill Registry](skill-and-subskill-registry-v0.5.md) · [Engine/MCP Tool Contracts](engine-and-mcp-tool-contracts-v0.5.md) · [Review Audit](../reviews/2026-10-14-architecture-audit-v0.5.md).
