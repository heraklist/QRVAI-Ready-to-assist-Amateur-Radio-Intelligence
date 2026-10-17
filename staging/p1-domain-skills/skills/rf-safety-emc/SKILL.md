---
name: rf-safety-emc
description: Use for bounded ideal RF flux comparisons and non-invasive EMC troubleshooting, with mandatory uncertainty and referrals for hazardous electrical or structural work.
---
# SK-A05 — RF Safety, EMC & Interference

**Trigger:** User asks about prospective station RF exposure *screening*, qualitative interference isolation, or safe review of installation risks in Greece or another documented jurisdiction.
**Required context:** For theoretical flux: positive finite mean_power_w, linear_gain (not dBi without conversion), distance_m and **user-supplied** reference_flux_w_m2 plus antenna type and duty/exposure constraints. For RFI: synthetic or observed symptoms, equipment, time correlations, safe non-invasive changes. For site risk: equipment/mains/roof/tower/lightning context and qualified expertise.
**Output contract:** Explain formula, normalized units, explicit IDEAL_MODEL provenance, assumptions/uncertainties and screening-only comparison if all input values are given. Always state compliance_established:false; *not RF exposure certification*. Provide non-invasive symptom checklist and referrals to qualified personnel for structural/electrical hazards. No live measurements.
**Refusal/stop condition:** A comparison with a user-provided limit does not establish legally safe exposure. No mains repairs, rooftop/tower modifications, lightning protection design or grounding rewiring by unqualified personnel. No CAT/PTT/TX, no direct station/device action, no promise of field strength measured or official regulatory compliance. Missing local standards, antenna near-field geometry or operator class => INDETERMINATE.

Select only the relevant internal procedure:
- [SS-A05-1 RF Exposure Worksheet](references/1-rf-exposure-worksheet.md)
- [SS-A05-2 Interference Troubleshooting](references/2-interference-troubleshooting.md)
- [SS-A05-3 Installation Risk Review](references/3-installation-risk-review.md)

**Tool boundary:** Source-registered `rf_exposure_screen` accepts `mean_power_w`, `linear_gain`, `distance_m`, `reference_flux_w_m2` (all positive finite); outputs ideal far-field estimated flux and comparison with a **USER_SUPPLIED_UNVERIFIED reference**, with compliance_established:false. This draft method does not certify Greek/EU RF exposure; no reviewed Greek threshold was established in the P1.2 source survey. Real exposure compliance requires current applicable official methodology, instrument-level limits, proper measurements and qualified review outside this stage.
