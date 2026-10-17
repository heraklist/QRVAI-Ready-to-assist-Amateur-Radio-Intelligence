# SS-B12-2 — Battery Runtime

**Owner:** SK-B12
**Responsibility:** estimate usable capacity and autonomy with degradation range
**Required input:** Battery label in Wh or Ah with exact nominal V, usable_fraction 0..1, hypothetical average W, losses/duty/temperature, chemistry and age context.
**Procedure:** Use `power_autonomy` for ideal Wh×usable fraction/constant W. Example 240Wh×0.8/20W=9.6h. Show limits from unmodelled inverter efficiency, battery aging, depth of discharge and chemistry. Do not claim a full discharge curve or predict real device survival.
**Output:** IDEAL_MODEL runtime and sensitivity if input bounds supplied, explicit no actual battery measurement and uncertainty.
**Error/stop:** No battery certification, lithium thermal/charger engineering, guaranteed 9.6h, Ah→Wh without voltage, energized high-current servicing.

**Status:** IDEAL_MODEL, not physical measurement, battery certification or power installation approval.
