---
name: rf-engineering
description: Use for reproducible offline RF power, link budget, impedance, noise and margin calculations with explicit units and uncertainty; never for connected radio control or compliance certification.
---
# SK-B07 — RF Engineering

**Trigger:** A Greek- or English-language request for RF unit conversions, link-budget arithmetic, impedance/mismatch, or qualified noise and sensitivity estimates, using bounded supplied numerical inputs.

**Required context:** Physical input values with units, assumed signal/propagation model, requested quantity and, for noise, bandwidth, reference temperature, noise figure and detection SNR. Do not guess loss, gain, receiver thresholds or legal authorization.

**Output contract:** Explain the applicable equation and reference convention, normalized SI units, actual calculated value where supported, assumptions, precision/tolerance, source type and uncertainty; disclose missing inputs as MISSING_CONTEXT or INDETERMINATE.

**Refusal/stop condition:** No invented mathematical results or automatic compliance claim. No automatic transmission. No verified physical measurements. No CAT/PTT/TX or RF exposure/operating authorization. If no tool or primary source is available, use transparent educational formulas only; do not claim a live measurement or provider.

Choose only the relevant internal procedures (never independent Skills):
- [SS-B07-1 RF Unit Algebra](references/1-rf-unit-algebra.md)
- [SS-B07-2 Link Budget Analysis](references/2-link-budget-analysis.md)
- [SS-B07-3 Mismatch and Noise Metrics](references/3-mismatch-and-noise-metrics.md)

**Source/tool eligibility:** Source-registered draft MCP names `rf_power_convert`, `rf_link_budget`, `rf_impedance` are callable **only if actually exposed and authorized by the host**. Do not treat this staged Markdown as a connection or permission. The tool contract and formula version must be verified before making a call. B08 owns antenna geometry and feedline models. Respond in the user's language; report unavailable capabilities honestly.
