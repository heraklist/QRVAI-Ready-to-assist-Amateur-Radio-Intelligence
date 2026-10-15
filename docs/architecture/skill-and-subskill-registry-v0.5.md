# QRVAI Skill & Sub-skill Registry v0.5
**Date:** 2026-10-14 · **State:** PROPOSED, NOT PACKAGED.
**Inventory:** **24 host-level Skill candidates** (one for each Domain) and **72 dependent procedural Sub-skills** (three each).

## Important platform distinction

A real Skill is a discoverable package with a `skills/<slug>/SKILL.md` entrypoint, machine-readable frontmatter including **name** and **description**, and explicit conditional procedure. A QRVAI **Sub-skill** is project terminology for an internal focused procedure in `skills/<slug>/references/<topic>.md` or an equivalent clearly delimited section; it is **not a second host-discoverable Skill unless it is independently packaged**. Host instruction selection does not grant permissions. No Skill or Sub-skill automatically constitutes an AI agent, MCP tool, or server.

## Skill activation and composition rules

- **Activation:** user intent matches purpose AND required context can be gathered or a safe partial answer is possible. Only the selected Skill loads its relevant procedural sections.
- **Outputs:** cited technical explanation, structured data or tool result, assumptions/warnings and appropriate UI proposal; not unsupported legal clearance.
- **Exclusion:** never run a domain Skill merely because the user's prompt contains a similar word; disambiguate regulatory/emergency/device writes first.
- **Composition:** one primary Skill per user request when sufficient; add another for genuinely different owned sub-capabilities; any shared engine is called once and output reused.
- **Sub-skill input:** validated parent Skill context and only the fields needed. **Sub-skill output:** structured procedure findings, evidence, blockers and next step; not permission escalation.
- **Tool references:** exact names are proposed in the engine/MCP tool catalog and must be revalidated against SDK/schema at implementation.

## 24 Skill definitions and 72 procedural Sub-skills

### SK-A01 — `civil-protection`
**Skill entrypoint:** `skills/civil-protection/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to create a documented, local-authority-aware emergency preparedness plan.  
**Required context:** incident scenario, jurisdiction, team roles, station inventories.  
**Output contract:** exercise-ready readiness matrix and resource shortfall report, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Training and preparedness only; not official activation.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-A01-1` — Preparedness Baseline | inventory go-bags, batteries, frequencies and volunteers; identify unverified legal assumptions | `skills/civil-protection/references/1-preparedness-baseline.md` |
| `SS-A01-2` — Resilience Design | compare station and power backups; explicitly mark simulated outages | `skills/civil-protection/references/2-resilience-design.md` |
| `SS-A01-3` — Exercise Review | produce measurable exercise checks and after-action recommendations | `skills/civil-protection/references/3-exercise-review.md` |

### SK-A02 — `emcomm-traffic`
**Skill entrypoint:** `skills/emcomm-traffic/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to train radio message handling and simulated emergency-network coordination.  
**Required context:** training scenario, team roles, message form, simulated channels.  
**Output contract:** structured training message log and net-exercise plan, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No live agency dispatch, unofficial 'priority' authority or PTT.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-A02-1` — Net Role Training | teach NCS/check-in procedures and distinct message roles | `skills/emcomm-traffic/references/1-net-role-training.md` |
| `SS-A02-2` — Message Integrity Drill | validate structured message headers, repeats, acknowledgements and timestamps | `skills/emcomm-traffic/references/2-message-integrity-drill.md` |
| `SS-A02-3` — Fallback Traffic Simulation | run exercise-only failure and alternative path plan | `skills/emcomm-traffic/references/3-fallback-traffic-simulation.md` |

### SK-A03 — `frequency-intelligence`
**Skill entrypoint:** `skills/frequency-intelligence/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to explain frequency allocation and recommended operating segments with verified temporal context.  
**Required context:** location/country, frequency, mode, license class where required, date.  
**Output contract:** source-layered allocation/band-plan interpretation or insufficient-data result, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Band plan is not a legal authorization.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-A03-1` — Allocation Lookup | retrieve effective national frequency allocation and its legal status | `skills/frequency-intelligence/references/1-allocation-lookup.md` |
| `SS-A03-2` — Band Plan Overlay | overlay IARU recommendations distinctly from binding law | `skills/frequency-intelligence/references/2-band-plan-overlay.md` |
| `SS-A03-3` — Channel/Repeater Reference | filter source-verified repeater/beacon/channel metadata with freshness | `skills/frequency-intelligence/references/3-channelrepeater-reference.md` |

### SK-A04 — `regulatory-licensing`
**Skill entrypoint:** `skills/regulatory-licensing/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to evaluate whether an operator scenario meets documented applicable radio rules.  
**Required context:** country, operating place/date, license class, exact emission, power.  
**Output contract:** ALLOWED/NOT_ALLOWED/INDETERMINATE with rule and exception trace, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Never issue an amateur licence or provide unsupported legal certainty.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-A04-1` — Licence Context | determine credential, class, privileges and portability requirements | `skills/regulatory-licensing/references/1-licence-context.md` |
| `SS-A04-2` — Transmission Rule Evaluation | apply versioned legal rules to a fully specified operating scenario | `skills/regulatory-licensing/references/2-transmission-rule-evaluation.md` |
| `SS-A04-3` — Cross-border Explanation | separate domestic law, CEPT/HAREC mechanisms and recommendations | `skills/regulatory-licensing/references/3-crossborder-explanation.md` |

### SK-A05 — `rf-safety-emc`
**Skill entrypoint:** `skills/rf-safety-emc/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to screen RF exposure and help diagnose unintended interference with verified assumptions.  
**Required context:** station setup, frequencies/power/duty, safety jurisdiction, measured symptoms.  
**Output contract:** risk-scoped screening and non-invasive RFI checklist, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Not exposure certification; not a replacement for electrical safety professional.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-A05-1` — RF Exposure Worksheet | calculate conservative input-dependent exposure screening, cite local threshold | `skills/rf-safety-emc/references/1-rf-exposure-worksheet.md` |
| `SS-A05-2` — Interference Troubleshooting | systematically isolate RFI symptom patterns without unsafe procedures | `skills/rf-safety-emc/references/2-interference-troubleshooting.md` |
| `SS-A05-3` — Installation Risk Review | flag lightning, grounding and mains-electrical situations for qualified personnel | `skills/rf-safety-emc/references/3-installation-risk-review.md` |

### SK-B06 — `equipment-manuals`
**Skill entrypoint:** `skills/equipment-manuals/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to resolve documented manufacturer-specific setup and troubleshooting problems.  
**Required context:** vendor, exact model, manual/firmware version, symptoms, rights to file.  
**Output contract:** manual-section/page-cited setup guide with caveats, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No guessed menu numbers or unauthorized manual redistribution.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B06-1` — Versioned Manual Retrieval | identify permitted official/user manuals by model/revision and quote narrowly | `skills/equipment-manuals/references/1-versioned-manual-retrieval.md` |
| `SS-B06-2` — Configuration Walkthrough | guide model-specific front-panel/menu/port settings with evidence | `skills/equipment-manuals/references/2-configuration-walkthrough.md` |
| `SS-B06-3` — Safe Troubleshooting | test likely causes in reversible, observable steps | `skills/equipment-manuals/references/3-safe-troubleshooting.md` |

### SK-B07 — `rf-engineering`
**Skill entrypoint:** `skills/rf-engineering/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to provide reproducible numeric analysis of RF power, gain, noise and communication margins.  
**Required context:** typed physical values with units and assumptions.  
**Output contract:** validated numbers, formula version, units, plots and tolerances, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No invented mathematical results or automatic compliance claim.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B07-1` — RF Unit Algebra | convert W/dBm/dBW and dBi/dBd correctly with exact references | `skills/rf-engineering/references/1-rf-unit-algebra.md` |
| `SS-B07-2` — Link Budget Analysis | calculate transmit chain, path attenuation and receiver margin | `skills/rf-engineering/references/2-link-budget-analysis.md` |
| `SS-B07-3` — Mismatch and Noise Metrics | compute SWR/return loss, noise figure and sensitivity within assumptions | `skills/rf-engineering/references/3-mismatch-and-noise-metrics.md` |

### SK-B08 — `antenna-feedline`
**Skill entrypoint:** `skills/antenna-feedline/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to design and evaluate documented antenna/feedline alternatives with verified models.  
**Required context:** frequency, geometry, Z0/impedance, feedline length/type and environment.  
**Output contract:** calculations, matching suggestions, optional validated simulation traces, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No fabricated NEC radiation diagram or guaranteed real-world gain.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B08-1` — Antenna Geometry | estimate physical geometry and expose ground/velocity caveats | `skills/antenna-feedline/references/1-antenna-geometry.md` |
| `SS-B08-2` — Matching/Smith Chart | evaluate impedance locus and matching-network feasibility | `skills/antenna-feedline/references/2-matchingsmith-chart.md` |
| `SS-B08-3` — Feedline Performance | calculate attenuation, delivered power and mismatch assumptions | `skills/antenna-feedline/references/3-feedline-performance.md` |

### SK-B09 — `rf-electronics`
**Skill entrypoint:** `skills/rf-electronics/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to explain and calculate bounded radio-electronic networks and RF filter behavior.  
**Required context:** circuit topology, components, power and measurement conditions.  
**Output contract:** transfer curves, resonance estimates and safe educational notes, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No unsupported component ratings or unsafe live repair.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B09-1` — Filter Modeling | calculate cutoff, Q and transfer response for supported topologies | `skills/rf-electronics/references/1-filter-modeling.md` |
| `SS-B09-2` — RF Chain Explanation | trace mixer, oscillator, gain stage and linearity limitations | `skills/rf-electronics/references/2-rf-chain-explanation.md` |
| `SS-B09-3` — Component Selection Checks | compare ratings, tolerances and thermal/voltage conditions from datasheets | `skills/rf-electronics/references/3-component-selection-checks.md` |

### SK-B10 — `rf-measurements`
**Skill entrypoint:** `skills/rf-measurements/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to interpret calibrated RF instrument outputs and guide repeatable measurements.  
**Required context:** instrument/model, calibration state, file type, reference settings.  
**Output contract:** measurement trace, uncertainty notes, action-safe diagnostic workflow, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Never claim calibration or accuracy without evidence.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B10-1` — VNA Trace Interpretation | parse S11/S21, reference impedance and marker readings | `skills/rf-measurements/references/1-vna-trace-interpretation.md` |
| `SS-B10-2` — Spectrum/Test Setup | explain safe analyzer/scope/attenuator configuration and limits | `skills/rf-measurements/references/2-spectrumtest-setup.md` |
| `SS-B10-3` — Measurement Reconciliation | compare expected and observed metrics with uncertainty | `skills/rf-measurements/references/3-measurement-reconciliation.md` |

### SK-B11 — `station-integration`
**Skill entrypoint:** `skills/station-integration/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to map station interconnections and read equipment status with explicit permission.  
**Required context:** radio/interface models, topology, approved local bridge status.  
**Output contract:** signal-path diagram, interoperability constraints and read-only state, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No CAT parameter writes, PTT, remote transmission or hidden device access.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B11-1` — Signal Path Mapping | trace CAT, audio, power, tuner and interlocks in the station | `skills/station-integration/references/1-signal-path-mapping.md` |
| `SS-B11-2` — Compatibility Check | match ports, drivers, protocols and versioned settings | `skills/station-integration/references/2-compatibility-check.md` |
| `SS-B11-3` — Read-only Telemetry | retrieve authorized rig state with connected-device fault handling | `skills/station-integration/references/3-readonly-telemetry.md` |

### SK-B12 — `power-infrastructure`
**Skill entrypoint:** `skills/power-infrastructure/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to estimate station loads and energy resilience for fixed/portable installations.  
**Required context:** RX/TX power and duty cycle, battery chemistry/capacity, solar/efficiency.  
**Output contract:** autonomy range, load table and sensitivity to assumptions, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No electrical installation certification.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B12-1` — Power Budget | sum station loads with duty cycle and conversions | `skills/power-infrastructure/references/1-power-budget.md` |
| `SS-B12-2` — Battery Runtime | estimate usable capacity and autonomy with degradation range | `skills/power-infrastructure/references/2-battery-runtime.md` |
| `SS-B12-3` — Backup Scenario | compare backup topology and resilience under loss scenarios | `skills/power-infrastructure/references/3-backup-scenario.md` |

### SK-B13 — `sdr-dsp`
**Skill entrypoint:** `skills/sdr-dsp/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to teach and analyze permitted IQ and DSP datasets with reproducible parameters.  
**Required context:** sample rate, IQ samples or waterfall, filter configuration.  
**Output contract:** spectrum/filter analysis and classification uncertainty, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No interception of protected communications or unwarranted signal identification.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-B13-1` — Sampling Foundations | check Nyquist, aliasing, sample rate and decimation | `skills/sdr-dsp/references/1-sampling-foundations.md` |
| `SS-B13-2` — Spectrum/FFT Visualization | transform authorized IQ into labeled spectral estimates | `skills/sdr-dsp/references/2-spectrumfft-visualization.md` |
| `SS-B13-3` — DSP Filter Analysis | compare digital filtering and demodulation behavior | `skills/sdr-dsp/references/3-dsp-filter-analysis.md` |

### SK-C14 — `operating-dx`
**Skill entrypoint:** `skills/operating-dx/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to coach correct operating procedure and evidence-backed DX planning.  
**Required context:** band/mode, station context, desired correspondent and source timestamps.  
**Output contract:** operating workflow, conditions and verified DX references, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No fabricated real-time DX spots.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C14-1` — Operating Procedure | teach SSB/CW, calling, split, pileups and etiquette | `skills/operating-dx/references/1-operating-procedure.md` |
| `SS-C14-2` — DX Observation Reading | distinguish verified spot data from predictions | `skills/operating-dx/references/2-dx-observation-reading.md` |
| `SS-C14-3` — Operating Scenario Plan | recommend permissible time/band strategies with uncertainty | `skills/operating-dx/references/3-operating-scenario-plan.md` |

### SK-C15 — `propagation`
**Skill entrypoint:** `skills/propagation/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to compare observed ionospheric/space weather indicators and predictive RF path models.  
**Required context:** date/time, grids, bands, NOAA metrics, model/source versions.  
**Output contract:** model-based windows, observation plot and uncertainty, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Never guarantee path opening or label cached indices as live.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C15-1` — Space Weather Reading | retrieve timestamped solar/geomagnetic measurements and interpretation | `skills/propagation/references/1-space-weather-reading.md` |
| `SS-C15-2` — Propagation Scenario | run bounded path prediction with explicit model assumptions | `skills/propagation/references/2-propagation-scenario.md` |
| `SS-C15-3` — Observation Correlation | compare modeled forecasts with actual authenticated reception reports | `skills/propagation/references/3-observation-correlation.md` |

### SK-C16 — `digital-modes`
**Skill entrypoint:** `skills/digital-modes/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to configure and diagnose amateur-radio digital mode audio/CAT/software workflows.  
**Required context:** rig, OS, interface, program/version, issue, applicable band context.  
**Output contract:** version-cited configuration checklist and safe diagnostic steps, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No hidden PTT activation or transmission.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C16-1` — Mode Basics | explain FT8/FT4/RTTY/PSK/JS8/SSTV and constraints | `skills/digital-modes/references/1-mode-basics.md` |
| `SS-C16-2` — Audio/CAT Diagnostics | trace interfaces, sound devices and handshake checks | `skills/digital-modes/references/2-audiocat-diagnostics.md` |
| `SS-C16-3` — Software Version Guidance | resolve software-specific configuration using official docs | `skills/digital-modes/references/3-software-version-guidance.md` |

### SK-C17 — `packet-networks`
**Skill entrypoint:** `skills/packet-networks/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to plan and explain authorized amateur packet/digital networking.  
**Required context:** protocol, equipment, permitted routing metadata and station context.  
**Output contract:** packet routing visualization and configuration requirements, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No unauthorized forwarding of real traffic or private messages.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C17-1` — Packet Frame/Routing | explain AX.25/TNC, digipeat and packet path behavior | `skills/packet-networks/references/1-packet-framerouting.md` |
| `SS-C17-2` — APRS/Location Ethics | interpret packet paths and privacy limits | `skills/packet-networks/references/2-aprslocation-ethics.md` |
| `SS-C17-3` — Winlink/Mesh Planning | assess authorized infrastructure and link dependencies | `skills/packet-networks/references/3-winlinkmesh-planning.md` |

### SK-C18 — `repeaters-dvoice`
**Skill entrypoint:** `skills/repeaters-dvoice/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to explain, find and prepare verified repeater/memory configurations.  
**Required context:** location, radio/device, repeater source, mode, offset, tones.  
**Output contract:** memory proposal, repeater coverage caveats and digital voice setup, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Directory entries must be marked by source/verification date.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C18-1` — Analog Repeater Settings | calculate split/offset/CTCSS/DCS with source | `skills/repeaters-dvoice/references/1-analog-repeater-settings.md` |
| `SS-C18-2` — Digital Voice Profiles | explain DMR/D-STAR/C4FM, hotspot and codeplug constraints | `skills/repeaters-dvoice/references/2-digital-voice-profiles.md` |
| `SS-C18-3` — Directory Discovery | filter actual verified repeater metadata and freshness | `skills/repeaters-dvoice/references/3-directory-discovery.md` |

### SK-C19 — `satellites-weak-signal`
**Skill entrypoint:** `skills/satellites-weak-signal/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to prepare geometry, Doppler and weak-signal operating scenarios.  
**Required context:** observer QTH/time, spacecraft/orbit revision, radio capabilities.  
**Output contract:** pass window, estimated Doppler with freshness and pointing explanation, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No precise pass calculations from stale elements.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C19-1` — Satellite Metadata | retrieve amateur spacecraft frequency/mode data and date | `skills/satellites-weak-signal/references/1-satellite-metadata.md` |
| `SS-C19-2` — Pass/Doppler Calculation | calculate AOS/LOS/doppler using current appropriate orbit model | `skills/satellites-weak-signal/references/2-passdoppler-calculation.md` |
| `SS-C19-3` — Weak-signal Workflow | teach EME, meteor scatter and VHF propagation limitations | `skills/satellites-weak-signal/references/3-weaksignal-workflow.md` |

### SK-C20 — `logbook-awards`
**Skill entrypoint:** `skills/logbook-awards/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to validate and analyze operator-authorized QSO records.  
**Required context:** ADIF log, format version, permissions, awards definitions.  
**Output contract:** ADIF errors, QSO stats and progress against sourced award rules, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No silent log mutation, upload or third-party confirmation.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C20-1` — ADIF Integrity | parse and round-trip version-aware ADIF with provenance | `skills/logbook-awards/references/1-adif-integrity.md` |
| `SS-C20-2` — QSO Analytics | summarize contact statistics while preserving privacy | `skills/logbook-awards/references/2-qso-analytics.md` |
| `SS-C20-3` — Award/QSL Assessment | compare confirmations to current award criteria and services | `skills/logbook-awards/references/3-awardqsl-assessment.md` |

### SK-C21 — `contests-portable`
**Skill entrypoint:** `skills/contests-portable/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to assist planning documented contest/activation operations.  
**Required context:** event rules, location, station capabilities and permissions.  
**Output contract:** portable checklist, contest plan and reproducible scores, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Follow event/provider data terms; no invented activation approval.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-C21-1` — Contest Rule Preparation | interpret sourced rule revision, category and scoring | `skills/contests-portable/references/1-contest-rule-preparation.md` |
| `SS-C21-2` — Portable Activation Planning | plan antennas/power and access/permission requirements | `skills/contests-portable/references/2-portable-activation-planning.md` |
| `SS-C21-3` — Field Operations Review | assess log quality and activity outcome without external writes | `skills/contests-portable/references/3-field-operations-review.md` |

### SK-D22 — `radio-academy`
**Skill entrypoint:** `skills/radio-academy/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to teach progressive radio theory and radio-operating skills.  
**Required context:** learner level, topic, locale, assessment responses.  
**Output contract:** adaptive lessons, CW drills and explained scores, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Do not claim state exam certification or reuse protected questions unlawfully.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-D22-1` — Theory Curriculum | teach syllabus-aligned electrical/RF/regulatory concepts | `skills/radio-academy/references/1-theory-curriculum.md` |
| `SS-D22-2` — CW Practice | provide timing/speed drills and reproducible scoring | `skills/radio-academy/references/2-cw-practice.md` |
| `SS-D22-3` — Knowledge Assessment | ask and explain structured questions with source links | `skills/radio-academy/references/3-knowledge-assessment.md` |

### SK-D23 — `radio-maker`
**Skill entrypoint:** `skills/radio-maker/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to help safely prototype RF/electronics/software experiments.  
**Required context:** hardware target, scope, component specs, constraints.  
**Output contract:** reproducible experiment plan, verified software options and BOM, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** No unsafe high-energy circuit procedures or assumed compatibility.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-D23-1` — Microcontroller Integration | develop station-adjacent Arduino/ESP32/RPi project guidance | `skills/radio-maker/references/1-microcontroller-integration.md` |
| `SS-D23-2` — Software Interoperability | review open-source radio interfaces and test strategy | `skills/radio-maker/references/2-software-interoperability.md` |
| `SS-D23-3` — Experimental RF Prototyping | build a safe bounded research plan with measurement checks | `skills/radio-maker/references/3-experimental-rf-prototyping.md` |

### SK-D24 — `clubs-mentoring`
**Skill entrypoint:** `skills/clubs-mentoring/SKILL.md` (planned, not present).  
**Trigger:** when a user asks to support authorized educational and logistical club operations.  
**Required context:** club permissions, group context, event/inventory info.  
**Output contract:** meeting/workshop plans and privacy-scoped shared resource overview, including sources, timestamp/model/equation where relevant and explicit uncertainty.  
**Refusal/stop condition:** Never reveal non-public members/contact data without consent.  
**Procedure:** validate intent/context → choose exactly one or more of the named Sub-skills → call approved tools or primary references → validate result → answer and optionally render interactive UI.
| Sub-skill (internal procedure) | Required specific responsibility | Proposed reference file |
|---|---|---|
| `SS-D24-1` — Member Onboarding | prepare skill-based progression for new operators | `skills/clubs-mentoring/references/1-member-onboarding.md` |
| `SS-D24-2` — Training/Event Planning | coordinate authorized workshops and activity calendars | `skills/clubs-mentoring/references/2-trainingevent-planning.md` |
| `SS-D24-3` — Asset/Mentor Governance | maintain consent-based equipment/mentor availability records | `skills/clubs-mentoring/references/3-assetmentor-governance.md` |

## Packaging and activation validation

1. Each of the 24 SK IDs resolves to exactly one future Skill folder and `SKILL.md`; folder slug is unique and stable. Use the installed Plugin Creator manifest/Skill requirements rather than inventing top-level skills fields.
2. Each Sub-skill has an owner, inputs, bounded action and output. Sub-skills in references are **lazy-loaded by the parent Skill**, not automatically discoverable/independently selectable in the host.
3. The first-release plugin need not package 24 empty Skills. **Ship only implemented, verified Skills**, listing other items as planned. An empty stublike Skill must not advertise working RF/legality tools.
4. Validate trigger non-overlap with test utterances in Greek and English; strong overlaps route by outcome rather than keywords; all actions tested under minimum permissions.
5. Avoid recursive delegation: Orchestrators coordinate Skill/tool invocations and retain owner/authority; any additional model worker must have explicit justification, input/output schema, context budget and a measurable quality improvement.
6. Documentation may say **candidate**; public plugin copy must say only what is actually shipped and tested.

**See:** [Canonical Capability Register](capability-register-v0.5.md) · [ChatGPT-first Experience](chatgpt-first-experience-v0.5.md) · [Engine/MCP Tool Contracts](engine-and-mcp-tool-contracts-v0.5.md).