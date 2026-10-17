# SS-B09-2 — RF Chain Explanation

**Owner:** SK-B09
**Responsibility:** trace mixer, oscillator, gain stage and linearity limitations
**Required input:** Explicit RF block topology and schematic context: LNA, oscillator, mixer, IF, filtering and amplifier assumptions.
**Procedure:** Trace qualitative signal chain in input→output order, describe gain/noise mixing and nonlinearity dependencies but never invent measured NF, IP3, dynamic range, leakage or insertion loss. Keep RX explanation separate from instructions to transmit.
**Output:** Annotated educational block flow with stated assumed inputs, conversion/linearity limits and verification steps from validated diagrams.
**Error/stop:** No external station control, unexplained certified system performance or live RF power adjustment.

**Provenance:** IDEAL_MODEL for maths, USER_SUPPLIED_UNVERIFIED for datasheets and observations; never a certified circuit design.
