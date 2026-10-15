# QRVAI Shared Engines & MCP Tool Contracts v0.5

**Research date:** 2026-10-14. **Status:** Design proposals — **18 engines, 38 MCP tools, zero implementations**. Tool names and signatures are **candidate API contracts**, not actual registered endpoints. At implementation, publish exact JSON Schema 2020-12 `inputSchema`/`outputSchema`, pinned versions and security tests.

## 1. Precise distinctions

An **Engine** performs deterministic data processing, calculation, source retrieval or state control; it is not necessarily its own server. An **MCP tool** is a named remotely callable method that validates inputs, authorizes access and returns a typed result; multiple tools may reuse one Engine. An **MCP App** is a UI bound to a tool's response (or a UI-only resource), not a calculation source. An **Orchestrator** sequences existing tools using explicit workflow rules; it must not bypass engine validation.

## 2. Shared typed interfaces

Fields below use shorthand: `int` = bounded integer, `number` = finite real, `datetime` = offset-aware RFC3339 timestamp, `opaque` = validated user-provided resource identifier, `?` = optional, `[]` = array. SI quantities use explicit suffixes (`_hz`, `_w`, `_km`) and **positive dB attenuation** convention. `enum` values must be versioned and exhaustively documented when implementing.

A successful tool returns a structured envelope (conceptual design):
```json
{
  "status": "COMPLETE",
  "data": {},
  "warnings": [],
  "assumptions": [],
  "sources": [{"source_id":"SRC-001","url":"https://example.org","version":"1","checked_at":"2026-10-14T00:00:00Z","observed_at":null,"effective_at":null}],
  "calculation": {"engine":"E03","version":"proposed"},
  "freshness": "NOT_APPLICABLE",
  "side_effects": "NONE"
}
```

Statuses: COMPLETE / PARTIAL / INDETERMINATE / BLOCKED / FAILED. Domain errors: INVALID_ARGUMENT, MISSING_CONTEXT, UNAUTHORIZED, FORBIDDEN_ACTION, SOURCE_UNVERIFIED, STALE_DATA, PROVIDER_UNAVAILABLE, RATE_LIMITED, UNSUPPORTED_DEVICE, UNSUPPORTED_FILE_FORMAT, MODEL_NOT_AVAILABLE, INTERNAL_ERROR. Backend authorization is mandatory, not dependent on chat text. Third-party rate-limit or legal uncertainty is never silently mapped to success.

### Permission classes

`public`: no personal data. `profile.read`: user's consented station profile. `user.file.read`: explicitly selected file. `logs.read`: user's QSO logbook. `device.read`: explicit local bridge capability. `club.data.read`: scoped club asset data. `provider.auth`: credentialed third-party provider, with approved terms. Mixed entries only access protected data when scopes are actually supplied; otherwise deliver a public-only response or ask permission.

### Protocol versioning

Review official [MCP 2026-07-28 protocol](https://blog.modelcontextprotocol.io/posts/2026-07-28/) before implementation: stateless server core, `server/discover` for discovery, JSON Schema 2020-12; older 2025-era host clients require tested compatibility rather than invented assumptions. [MCP Apps 2026-01-26](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) is a separate stable UI extension. Never assume a working UI without host negotiation, sandbox and text fallback.

## 3. Logical Engine registry

| ID | Engine / shared responsibility | Owner domains | Enforceable boundary |
|---|---|---|---|
| `E01` | **Regulatory Rules** — Temporal national-law evaluation; source precedence; allow/not/indeterminate; no permission guessed | A03,A04,A05 |  no permission guessed |
| `E02` | **Spectrum Directory** — Band-plan overlays, allocations and source-verified repeater directory; advisory distinct from law | A03,C18 | Typed validation, provenance and per-request permissions |
| `E03` | **Deterministic RF Math** — Unit-safe link budgets, return loss, feedline attenuation, network/filter calculations; golden fixtures | B07,B08,B09,A05 | Typed validation, provenance and per-request permissions |
| `E04` | **Antenna Geometry & Solver Adapter** — Geometry approximations and actual simulation traces when approved solver available; no invented patterns | B08 |  no invented patterns |
| `E05` | **Measurement/DSP Parser** — Touchstone/CSV/IQ import, S11/S21/FFT and calibration states; no fabricated measured quantities | B10,B13 |  no fabricated measured quantities |
| `E06` | **Manuals & Rights-aware Retrieval** — Vendor/model/version/page citations and permissible retrieval; no bulk redistribution | B06,C16 |  no bulk redistribution |
| `E07` | **Station Compatibility & Bridge** — Versioned rig interfaces, signal path and opt-in read-only CAT; no PTT/writes | B11,B06,C16 |  no PTT/writes |
| `E08` | **Energy Planner** — Power/duty/usable-capacity estimates, confidence scenarios, safe backup documentation | B12,A01 | Typed validation, provenance and per-request permissions |
| `E09` | **Geospatial** — Maidenhead, geodesic distance/bearing, mapped path assumptions | C14,C15,C19 | Typed validation, provenance and per-request permissions |
| `E10` | **Propagation Models** — Named physical model output, uncertainty and forecast-vs-observed classification | C15,C14 | Typed validation, provenance and per-request permissions |
| `E11` | **Live Provider Adapter** — NOAA and licensed observation feeds, cache/rate limits, timestamps and errors | C15,C14 | Typed validation, provenance and per-request permissions |
| `E12` | **Digital/Packet Network Models** — Mode setups, AX.25/APRS, digital voice and channel previews; no sending | C16,C17,C18 |  no sending |
| `E13` | **Satellite Ephemerides** — Current element-set/date and pass/Doppler calculations with staleness checks | C19 | Typed validation, provenance and per-request permissions |
| `E14` | **ADIF/Logbook/Awards** — Version-aware ADIF validation, read-only analytics, awards based on sourced rules | C20,C21 | Typed validation, provenance and per-request permissions |
| `E15` | **Emergency Training Simulator** — Exercise-only scenarios, message forms and net resilience; no dispatch | A01,A02 |  no dispatch |
| `E16` | **Academy & CW** — Syllabus teaching, Morse drills, reproducible scores and explanation | D22 | Typed validation, provenance and per-request permissions |
| `E17` | **Maker/Clubs** — Safe bill-of-materials review, workshops and authorized club resources | D23,D24 | Typed validation, provenance and per-request permissions |
| `E18` | **Policy/Workflow/Provenance** — Authorization, intent routing, workflow state, structured errors, sources and minimal audit | ALL | Typed validation, provenance and per-request permissions |

These are logical components in a potential modular monolith, not an instruction to deploy 18 services. Each engine has a reproducibility/source-quality test matrix.

## 4. Planned MCP tool registry (complete proposed interface)

| ID / method | Engine | Access | Typed arguments | Structured result | Domains | Responsibility |
|---|---|---|---|---|---|---|
| `M01` `qrvai.core.capabilities` | E18 | public | `locale?:enum(el,en)` | `families[],domains[],available_tools[]` | ALL | Host-exposed inventory, no unimplemented-feature claims |
| `M02` `qrvai.source.lookup` | E06/E18 | public | `query:string;source_type?:enum` | `records[]:source_id,url,version,rights,checked_at` | A03,A04,B06 | Official source identity and rights, not legal conclusion |
| `M03` `qrvai.station.get_profile` | E18 | profile.read | `selector?:enum` | `qth?,licence_class?,rigs[],consent` | B11,B12 | Operator-authorized profile only |
| `M04` `qrvai.regulatory.check_operation` | E01 | public | `country:string;licence:string;frequency_hz:int;mode:string;power_w:number;at_time:datetime;qth?:string;bandwidth_hz?:int` | `decision:enum;rules[];missing_context[]` | A03,A04 | Conservative legal fact evaluation |
| `M05` `qrvai.spectrum.band_segments` | E02 | public | `country:string;from_hz:int;to_hz:int;at_time:datetime` | `segments[]:limits,kind,source` | A03,A04 | National-law vs IARU advisory overlays |
| `M06` `qrvai.spectrum.find_repeaters` | E02 | public | `grid:string;radius_km:number;mode?:string` | `repeaters[]:frequency,offset,tone,provenance` | A03,C18 | Source-dated directory, not availability assertion |
| `M07` `qrvai.rf.convert_power` | E03 | public | `value:number;from_unit:enum(W,dBm,dBW);to_unit:enum(W,dBm,dBW)` | `value:number;unit;formula_revision` | B07 | Logarithmic conversions, invalid domain rejected |
| `M08` `qrvai.rf.link_budget` | E03 | public | `tx_w:number;tx_gain_dbi:number;tx_loss_db:number;path_loss_db:number;rx_gain_dbi:number;rx_loss_db:number;rx_sensitivity_dbm:number` | `rx_dbm:number;margin_db:number;stages[]` | B07,C15 | Full link-budget trace |
| `M09` `qrvai.rf.feedline_loss` | E03 | public | `cable_id:string;length_m:number;frequency_hz:number;connector_db?:number` | `attenuation_db;delivered_ratio;series[]` | B08 | Profile-versioned coax curve |
| `M10` `qrvai.rf.impedance` | E03 | public | `r_ohm:number;x_ohm:number;z0_ohm:number` | `gamma;vswr;return_loss_db` | B07,B08 | Complex impedance and boundary checks |
| `M11` `qrvai.antenna.geometry` | E04 | public | `type:enum;frequency_hz:number;constraints:object` | `geometry[];assumptions[];model_state` | B08 | Geometry estimate, not fabricated gain |
| `M12` `qrvai.antenna.matching` | E03 | public | `load_r:number;load_x:number;z0:number;frequency_hz:number;topology?:enum` | `network_values[];smith_points[]` | B08,B09 | Matching circuit trace, known topology |
| `M13` `qrvai.rf.filter_response` | E03 | public | `topology:enum;components:object;from_hz:number;to_hz:number;points:int` | `frequencies[];gain_db[];phase_deg[]` | B09 | Reproducible frequency response |
| `M14` `qrvai.rf.exposure_screen` | E01/E03 | public | `country:string;frequency_hz:number;eirp_w:number;distance_m:number;duty_fraction:number;at_time:datetime` | `screening_status;warnings[];legal_source` | A05 | Screen only; no safety certificate |
| `M15` `qrvai.measurements.inspect_trace` | E05 | user.file.read | `file_uri:opaque;format:enum(csv,touchstone);z0?:number` | `points[];calibration_state;warnings[]` | B10 | Trace validation, no presumed calibration |
| `M16` `qrvai.sdr.inspect_iq` | E05 | user.file.read | `file_uri:opaque;sample_rate_hz:number;format:string;max_samples?:int` | `spectrum[];fft_settings;quality_flags[]` | B13 | Lawful user-supplied samples only |
| `M17` `qrvai.manual.find` | E06 | public | `manufacturer:string;model:string;revision?:string;type?:enum` | `manuals[]:id,revision,url,rights` | B06,C16 | Exact vendor/model/manual lookup |
| `M18` `qrvai.manual.answer_cited` | E06 | public/user.file.read | `manual_id:string;question:string;page_range?:array` | `answer;page_citations[];unknowns[]` | B06 | Rights-aware manual Q&A |
| `M19` `qrvai.equipment.diagnose` | E06/E07 | public | `model:string;symptoms:string;firmware?:string` | `safe_steps[];expected_checks[];sources[]` | B06,B10 | Non-destructive supported troubleshooting |
| `M20` `qrvai.station.signal_path` | E07 | public | `devices[]:object;connections[]:object` | `nodes[];edges[];warnings[]` | B11,C16 | Connection architecture visualization |
| `M21` `qrvai.station.read_status` | E07 | device.read | `bridge_session_id:string;device_id:string` | `mode?;frequency_hz?;checked_at` | B11 | Future read-only device status; no PTT |
| `M22` `qrvai.power.autonomy` | E08 | public | `loads[]:object;battery_wh:number;usable_fraction:number;reserve_fraction:number` | `runtime_range[];budget[];assumptions[]` | B12,A01 | Modelled station runtime |
| `M23` `qrvai.spaceweather.indices` | E11 | public | `at_time?:datetime;max_age_min?:int` | `observations[];observed_at;stale` | C15 | Timestamped NOAA values |
| `M24` `qrvai.propagation.path` | E09/E10 | public | `from_grid:string;to_grid:string;bands_hz[];at_time:datetime;model_id:string` | `predictions[];uncertainty;model_version` | C15 | Named model prediction only |
| `M25` `qrvai.geo.bearing` | E09 | public | `from_locator:string;to_locator:string` | `distance_km;azimuth_deg;grid_precision` | C14,C19 | Validated Maidenhead/bearing |
| `M26` `qrvai.satellite.pass` | E13 | public | `satellite_id:string;observer_grid:string;start:datetime;end:datetime` | `passes[];doppler[];element_age` | C19 | Reject stale orbital elements |
| `M27` `qrvai.dx.reception_reports` | E11 | public/provider.auth | `callsign_or_grid:string;band_hz?:number;since:datetime;provider:string` | `reports[];observed_at;provider_rules` | C14,C15 | Permitted, time-labeled observations |
| `M28` `qrvai.digital.setup_guide` | E07/E12 | public | `rig:string;software:string;version:string;os?:string;symptoms?:string` | `steps[];manual_citations[];gaps[]` | C16 | CAT/audio/software guided setup |
| `M29` `qrvai.packet.route_preview` | E12 | public | `protocol:enum;nodes[];path[];scenario:enum` | `route_graph;simulation_flag` | C17 | Packet path illustration, no sending |
| `M30` `qrvai.repeater.channel_preview` | E02/E12 | public | `repeater_id:string;rig_profile?:string` | `channel_params;source_date;warnings[]` | C18 | Memory export preview, no programming |
| `M31` `qrvai.log.adif_validate` | E14 | user.file.read | `file_uri:opaque;version?:string;strict?:boolean` | `count;errors[];preview[]` | C20 | Read-only ADIF validation |
| `M32` `qrvai.log.award_progress` | E14 | logs.read | `logbook_id:string;award:string;rules_version?:string` | `worked;confirmed;missing[];rule_source` | C20 | Owner-only awards analysis |
| `M33` `qrvai.contest.plan` | E14/E08 | public | `event_id:string;official_rules_url:string;station_constraints:object` | `plan[];rules_version;assumptions[]` | C21 | Official sourced contest planning |
| `M34` `qrvai.emcomm.drill` | E15 | public | `scenario:enum;roles[];hypothetical_network:object` | `exercise_steps[];messages[];simulated:true` | A02,A01 | Explicit training, never dispatch |
| `M35` `qrvai.emcomm.readiness` | E15/E08 | public | `inventories[];team_roles[];training_case:string` | `gaps[];readiness_table;simulation:true` | A01 | Exercise readiness checklist |
| `M36` `qrvai.academy.exercise` | E16 | public | `topic:string;level:string;locale:enum;answers?:array;cw_wpm?:number` | `questions[];feedback[];score?` | D22 | Educational quiz/Morse exercise |
| `M37` `qrvai.maker.project_review` | E17/E03 | public | `goal:string;components[];safety:object` | `bom_checks[];test_plan[];warnings[]` | D23 | Bounded safe project review |
| `M38` `qrvai.club.workshop_plan` | E17 | public/club.data.read | `topic:string;participants?:int;inventory_scope?:string` | `agenda[];materials[];privacy_notes[]` | D24 | Public plan or authorized club data |

## 5. Required normative behavior for every candidate

1. Each released tool has an exact versioned **JSON Schema**: input root object, exhaustive required fields, bounded optional fields, `additionalProperties:false` where appropriate, correct output `structuredContent` and text explanation. The table above is a **design inventory**, not executable JSON Schema.
2. Every method returns source identity and timestamp when based on dynamic data or statutory material. Technical computations return units and formula/model revision, with user-visible caveats.
3. All values must be finite, in valid ranges, and dimensionally consistent; edge cases include 0 W log conversion, negative feedline length, empty grid, invalid time ranges, singular impedance and unavailable solver.
4. RF model outputs are explicitly labeled **calculated**, not measured; propagation **forecast**, not observed; ADIF parsing **validated input**, not accepted third-party confirmation.
5. `qrvai.regulatory.check_operation` cannot return positive permission without valid nation, licence, exact frequency/mode/power, date and verified current law. Advisory band plans do not grant permission.
6. `qrvai.emcomm.*` is training-only. `qrvai.station.read_status` is a later read-only feature. No PTT, transmitter activation, CAT write, firmware flash, emergency dispatch, public alert or external log upload is present.
7. UI tool results can be associated with `ui://` resources; UI visibility and model visibility differ, and app-only actions require independent backend authorization. Text fallback is mandatory.
8. Schemas, errors, latency budgets and model-worker recursion limits are fixed in the approved detailed implementation plan before code begins.

## 6. Orchestrator-to-tool mapping

| Orchestrator | Trigger | Intended composition | Stop condition |
|---|---|---|---|
| OR-ENG | Cross-discipline RF/antenna/station design | M07–M16 and M22, only supported solvers | No measured/simulated chart without verified engine |
| OR-DIAG | Multi-part equipment setup/diagnosis | M17–M21, M28, M15 | No unsupported menu or device write |
| OR-REG | Is transmit operation allowed under applicable law? | M02, M04, M05, M14 | INDETERMINATE if official rule/required inputs missing |
| OR-EMCOMM | Preparedness drills/resilience training | M22, M29, M34, M35 | Simulation-only; no operational dispatch |
| Main Router | Direct tool vs bounded stateful flow | M01 and selected skills/tools | Never expand authorization on delegation |

## 7. Acceptance criteria / traceability gates

- All 24 domains map to at least one relevant tool or an explicit **manual-only Skill workflow**; all 38 methods map to an engine, owner and permission.
- Every one of 36 planned UI experiences will map to appropriate tool result(s) or remain deferred, not force 36 redundant endpoints.
- Release packages advertise ONLY implemented MCP tools and Skills. Candidate contracts are not discoverable features until deployed and independently tested.
- Unit/property-based reference tests, error injections, permission-negative tests, source freshness tests and host/tool schema negotiation are mandatory.
- API names are not frozen until an owner-reviewed implementation slice; preserve migration mapping if renamed.

**Cross references:** [Capability Registry](capability-register-v0.5.md), [Skill Registry](skill-and-subskill-registry-v0.5.md), [ChatGPT-first entrypoint](chatgpt-first-experience-v0.5.md), [Architecture Audit](../reviews/2026-10-14-architecture-audit-v0.5.md).
