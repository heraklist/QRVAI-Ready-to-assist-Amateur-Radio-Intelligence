# SS-A03-2 — Band Plan Overlay

**Owner:** SK-A03
**Responsibility:** overlay IARU recommendations distinctly from binding law
**Required input:** Versioned national allocation/rule and independent IARU Region 1 band plan edition, frequency_hz, emission/mode, licence category, jurisdiction and date.
**Procedure:** Produce two labelled overlays: BINDING_INSTRUMENT only when actually reviewed in-force, and TECHNICAL_RECOMMENDATION for voluntary IARU recommendations. Compare only source-present facts; highlight conflicts, version gaps and nonbinding suggested segments.
**Output:** Separate recommendation from law with source URL, revision and effective/freshness uncertainty; if either decisive official source is absent mark INDETERMINATE.
**Error/stop:** IARU recommendations not legal authorization and must never override domestic licence conditions. No source-based live TX permission.

**Provenance:** Source entrypoints under `docs/research/2026-10-17-qrvai-p1-2-family-a-authority-survey.md` are candidates, not already reviewed operative rules. USER_SUPPLIED_UNVERIFIED ≠ state-authorized. No live source API or verified frequency access.
