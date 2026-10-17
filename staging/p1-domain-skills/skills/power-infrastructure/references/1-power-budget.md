# SS-B12-1 — Power Budget

**Owner:** SK-B12
**Responsibility:** sum station loads with duty cycle and conversions
**Required input:** Device-specific RX, TX, standby power in W and nonnegative duty cycle fractions summing to one; optional peripheral draw and efficiency.
**Procedure:** Compute average_power_w = Σ(device_power_w×time_fraction), check W and Wh dimensional consistency, note assumed transmit duty is a hypothetical planning input only. Example 10W×0.8+60W×0.2=20W ideal mean load; do not infer operating conditions from current frequency.
**Output:** Illustrative W breakdown, verified vs supplied/assumed conditions, missing load terms, source provenance IDEAL_MODEL.
**Error/stop:** No invented power meter reading, actual radio transmission, negative loads/duty >1 or unsafe electrical modification.

**Status:** IDEAL_MODEL, not physical measurement, battery certification or power installation approval.
