# SS-A05-1 — RF Exposure Worksheet

**Owner:** SK-A05
**Responsibility:** calculate conservative input-dependent exposure screening, cite local threshold
**Required input:** Positive mean_power_w, positive linear_gain, distance_m>0, a provided reference_flux_w_m2 with issuer/provenance status, and antenna geometry/duty/context; all in declared SI units.
**Procedure:** Compute illustrative isotropic/far-field-like flux = mean_power_w × linear_gain /(4π×distance_m²), explicitly conditional on radiating model. Compare numerically only against reference_flux_w_m2 supplied by user; registered rf_exposure_screen has compliance_established:false. If legal/exposure source unverified or near-field, pattern, multiple sources, public/occupational class unclear, explain that this is not an adequate compliance assessment.
**Output:** Ideal-model flux in W/m² and below_user_reference Boolean labelled USER_SUPPLIED_UNVERIFIED, with compliance_established:false and explicit unknowns. Never phrase comparison as safe or legal clearance.
**Error/stop:** No invented Greek exposure threshold, exposure certification, field measurement, safety distance or real power verification. Missing critical geometry or official methodology => INDETERMINATE.

**Risk and source:** No live measurements, no guaranteed RF safety and no qualified installation certification. No mains repairs or CAT/PTT/TX action; use official qualified reviewers for real compliance.
