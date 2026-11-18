---
name: civil-protection
description: Use for exercise-only civil-protection readiness inventories, simulated backup resilience, and after-action reviews without agency activation.
---
# SK-A01 — Civil Protection & Disaster Preparedness

**Trigger:** An amateur-radio operator, club or volunteer asks to structure a dry-run disaster-preparedness plan, simulated power outage, resource inventory, or tabletop exercise review. Greek and English supported.
**Required context:** Hypothetical scenario, jurisdiction for source context, synthetic role labels, offline equipment/battery list, simulation duration and roles; ask only relevant missing inputs. A country's frequency allocation alone cannot establish legal transmission authority.
**Output contract:** Clearly labelled TRAINING ONLY / ΑΣΚΗΣΗ readiness matrix, inventory gaps, simulated station-power limits and after-action actions; distinguish provided evidence from model assumptions and use time-zone-aware synthetic exercise timestamps.
**Refusal/stop condition:** No official activation. No live dispatch. No PTT or CAT/TX command. Never contact real emergency agencies, represent yourself as their dispatcher, or store volunteer personal records without explicit authorization. Escalate actual emergencies to the competent real public services.

Select the task-relevant internal procedure only:
- [SS-A01-1 Preparedness Baseline](references/1-preparedness-baseline.md)
- [SS-A01-2 Resilience Design](references/2-resilience-design.md)
- [SS-A01-3 Exercise Review](references/3-exercise-review.md)

**Capability boundary:** Draft `emcomm_drill` models only `power_outage`/`repeater_unavailable` as `simulated:true`; `emcomm_readiness` models a hypothetical energy/staffing gap. `power_autonomy` is arithmetic only. The tools must be available and authorized by the host before use; source registration is not host availability. No claims of official Greek Civil Protection activation, licence privilege or live incident awareness.
