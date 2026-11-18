# SS-A01-2 — Resilience Design

**Owner:** SK-A01
**Responsibility:** compare station and power backups; explicitly mark simulated outages
**Required input:** Two or more hypothetical battery/power paths, equipment load W, capacity Wh, usable fraction, backup options and explicitly simulated outage durations.
**Procedure:** Compare independent reserve options and redundancy under assumed conditions. When power arithmetic is requested, estimated hours = battery Wh × usable_fraction / constant W; ask for each missing input and show the ideal-model assumptions. Treat failed repeater or mains as a simulation inject, not real telemetry.
**Output:** Exercise-only fallback matrix listing hypothetical runtime, single points of failure, alternative tasks and unresolved risks. No real power restoration claim.
**Error/stop:** Reject live station switching, high-voltage repair, electrical-mains instructions and guaranteed outage survival. Refer hazardous work to qualified staff.

**Evidence status:** USER_SUPPLIED_UNVERIFIED or clearly modelled TRAINING ONLY / ΑΣΚΗΣΗ. No live official dispatch authority, no real incident activation, no PTT.
