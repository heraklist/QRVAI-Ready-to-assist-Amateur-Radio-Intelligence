# SS-B07-1 — RF Unit Algebra

**Owner:** SK-B07
**Responsibility:** convert W/dBm/dBW and dBi/dBd correctly with exact references
**Required input:** Positive finite RF power and declared W/mW/dBm/dBW unit, or antenna gain referenced to an isotropic radiator (dBi) or a reference half-wave dipole (dBd). Do not confuse antenna gain with power.
**Procedure:** Check the reference and numeric domain. For positive P in watts, dBW = 10 log10(P / 1 W); dBm = dBW + 30; for positive P in milliwatts, dBm = 10 log10(P / 1 mW). Invert with P(W) = 10^(dBW/10). With ideal reference relation, G(dBi) ≈ G(dBd) + 2.15 dB. Source-registered `rf_power_convert` accepts exactly `{"value":100,"unit":"W"}` (W, mW, dBm or dBW), never a gain input; it has no dBi/dBd conversion. Ask or explain manually for gain reference.
**Output:** Worked ideal conversion 100 W = 50 dBm = 20 dBW; 1 mW = 0 dBm; 1 W = 0 dBW. State dBm reference to 1 mW and dBW reference to 1 W. Ideal algebra, not a measured transmitter output.
**Error/stop:** Zero/negative linear power, NaN, infinite/unsupported units, overflow or undeclared gain reference => OUT_OF_RANGE or MISSING_CONTEXT. No live device reading, no permission to transmit, no automatic compliance certification.
