# SS-B09-1 — Filter Modeling

**Owner:** SK-B09
**Responsibility:** calculate cutoff, Q and transfer response for supported topologies
**Required input:** Topology type (first-order RC lowpass/highpass), resistor Ω, capacitor F, evaluation Hz, source/load idealization, tolerances.
**Procedure:** For supported RC only compute f_c=1/(2πRC). At cutoff ideal |H|=1/√2 and gain=20log10|H|≈−3.0103 dB. Declare parasitics/source impedance ignored; the draft rf_filter_response tool is first-order RC ONLY. For unsupported LC, active/op-amp, 4-pole Q, respond NOT_IMPLEMENTED and explain data needed.
**Output:** Ideal formula, frequency-response points if specifically calculated from positive inputs, provenance IDEAL_MODEL and uncertainty.
**Error/stop:** No real network analyser curve, LC synthesis, guessed filter Q, unsafe device tuning or unsupported positive range.

**Provenance:** IDEAL_MODEL for maths, USER_SUPPLIED_UNVERIFIED for datasheets and observations; never a certified circuit design.
