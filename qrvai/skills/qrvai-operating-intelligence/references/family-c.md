# Family C — Operating, Networks & Radio Intelligence (V0)

Newly authored from approved, current GitHub QRVAI v0.5 architecture. The 8 domain and 24 sub-capability descriptions below are **guidance scope**, not a working network, dynamic feed or modelled propagation engine.

A user may learn operating procedure, digital modes and expected protocols without private accounts. Live space-weather, DX spots, repeater directory states, current satellite elements, log confirmations, real contest rules and packet traffic require **actually retrieved provider observations** with provider licence, timestamp and provenance. Never invent provider readings, uploaded logs or transmit permissions.

## Canonical Domain/Sub-capability contracts

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



---

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



---

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



---

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



---

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



---

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



---

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



---

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


