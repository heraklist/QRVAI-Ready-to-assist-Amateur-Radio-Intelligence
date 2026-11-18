---
name: power-infrastructure
description: Explain station duty-weighted power budgets, ideal battery runtime and explicitly hypothetical backup scenarios with electrical-safety boundaries.
---
# SK-B12 — Power Systems & Infrastructure

**Trigger:** User asks for station energy consumption, hypothetical portable autonomy or non-operational battery/backup scenario planning.
**Required context:** RX/TX power in W, transmit duty cycle and listening/rest fractions summing to one, battery capacity in Wh (or Ah and measured/nominal V), usable fraction, chemistry/aging/temperature if warranted, solar input only from sourced forecast assumptions.
**Output contract:** Clearly assumed duty cycle and weighted average W, usable Wh and IDEAL_MODEL runtime hours, ranges only when ranges supplied, unknown SOC/temperature/degradation acknowledged. Never treat a simulated TX duty cycle as a command or right to transmit.
**Refusal/stop condition:** No mains repairs, high-voltage diagnostics, lithium pack repair/charging modification, energized wiring, rooftop/tower electrical work or electrical installation approval. No battery certification, no promise of uptime, CAT/PTT/TX or actual station measurements.

**Tool boundary:** `power_autonomy` is a constant-load arithmetic model: battery_wh × usable_fraction ÷ average_load_w. It cannot monitor battery SOC, inverter efficiency, safe chemistry, temperature, current draw or irradiance. Any real electrical design needs qualified personnel and official applicable rules. Wh cannot be inferred from Ah without voltage.

- [SS-B12-1 Power Budget](references/1-power-budget.md)
- [SS-B12-2 Battery Runtime](references/2-battery-runtime.md)
- [SS-B12-3 Backup Scenario](references/3-backup-scenario.md)
