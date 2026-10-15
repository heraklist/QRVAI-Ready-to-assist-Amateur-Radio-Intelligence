# Family B — Engineering, Equipment & Technical Support (V0)

This newly written reference reuses *only* the owner-approved current public QRVAI architecture text in GitHub. It is not an old preview plugin asset, a live RF numerical engine or vendor manual corpus.

## Guidance boundaries

Explain equations with declared units and assumptions, but do not assert a QRVAI engine or NEC solver was called. A specific rig menu setting needs identified manufacturer, model, firmware and **manual revision**, plus actually checked manufacturer documentation. No fabricated page references, VNA traces, radiation patterns, current operating states, firmware operations, CAT writes or PTT. Safety and legal checks route to Family A when applicable.

## Canonical B06–B13 Domain and Sub-capability contracts

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



---

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



---

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



---

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



---

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



---

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



---

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



---

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


