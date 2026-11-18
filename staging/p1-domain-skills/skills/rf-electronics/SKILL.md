---
name: rf-electronics
description: Explain bounded RF/electronic circuits and ideal first-order RC filter response with explicit topology, units, physical component-rating and power-safety caveats.
---
# SK-B09 — RF Electronics & Circuits

**Trigger:** Users ask about passive RF filter response, typical mixer/oscillator/amplifier chains or parts selection.
**Required context:** Circuit topology, resistance ohms, capacitance farads, evaluation frequency Hz, signal level and DC/RF component ratings when relevant; actual datasheets and safe power-off environment for any component discussion.
**Output contract:** Exact equations and assumptions, ideal first-order RC amplitude/gain if supported, separately labeled inferred/nonverified circuit behavior and documented component-rating comparisons. For arbitrary LC higher-order or non-linear component simulation return NOT_IMPLEMENTED and do not pretend it was computed. Distinguish ideal theory from a measured trace.
**Refusal/stop condition:** No live repair of energized equipment, RF amplifiers or mains. No invented ratings, thermal derating, NF/IP3 figures, safe supply limits or certification. No actual hardware command or CAT/PTT/TX. Source material is USER_SUPPLIED_UNVERIFIED unless checked.

**Tool boundary:** `rf_filter_response` computes only ideal first-order RC lowpass/highpass from positive R,C,frequency. It does not solve arbitrary LC networks, Q factor of a multi-stage chain, PCB parasitics or real circuit measurements. Other circuit discussion is educational modelling only.

- [SS-B09-1 Filter Modeling](references/1-filter-modeling.md)
- [SS-B09-2 RF Chain Explanation](references/2-rf-chain-explanation.md)
- [SS-B09-3 Component Selection Checks](references/3-component-selection-checks.md)
