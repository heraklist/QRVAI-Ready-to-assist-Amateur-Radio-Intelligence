# SS-B06-3 — Safe Troubleshooting

**Owner:** SK-B06
**Responsibility:** test likely causes in reversible, observable steps
**Required input:** One of no_receive_audio, high_swr_reading, unstable_power; externally observable symptoms, existing user-measured facts and qualified help context.
**Procedure:** Choose a bounded `equipment_diagnose` symptom and provide a reversible checklist: verify selected input or volume settings without commanding the rig, check disconnected cable condition without live power, log observed changes and seek qualified repair for hazardous faults.
**Output:** Safe check order with explicit no-certified-repair warning, assumptions and remaining hypotheses.
**Error/stop:** No energized chassis/service cover disassembly, live mains/lithium battery repair, RF TX/SWR test, firmware flashing or guaranteed diagnosis.

**Provenance:** USER_SUPPLIED_UNVERIFIED until verified; manual pages must match exact manufacturer, model and revision. Read-only informational development source.
