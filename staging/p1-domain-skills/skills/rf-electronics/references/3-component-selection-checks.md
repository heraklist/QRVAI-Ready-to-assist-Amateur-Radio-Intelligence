# SS-B09-3 — Component Selection Checks

**Owner:** SK-B09
**Responsibility:** compare ratings, tolerances and thermal/voltage conditions from datasheets
**Required input:** Component part IDs, original manufacturer datasheet, specific voltage/current/power/temperature conditions, tolerances and heat sinking context.
**Procedure:** Compare only actually supplied vendor ratings and units, calculate illustrative derating margins when documented and keep operating ambient/thermal resistance assumptions visible. If missing revision, temperature or limits, label INDETERMINATE.
**Output:** Evidence trace table of source revision, nominal vs stress, missing limits and qualified-engineer review recommendation.
**Error/stop:** No invented ratings, component substitution guarantee, energized/high-voltage or mains repair, lithium pack work or safety certification.

**Provenance:** IDEAL_MODEL for maths, USER_SUPPLIED_UNVERIFIED for datasheets and observations; never a certified circuit design.
