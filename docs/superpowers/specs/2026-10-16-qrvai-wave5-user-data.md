# QRVAI Wave 5 — bounded user-input diagnostics and log validation

Parent draft PR #22 head bf8d83577bd878531073be9442c20441bd3afbae; Vercel-only; no Cloudflare runtime or production promotion.

## Five scoped candidates
- **M15** `measurements_inspect_trace`: inspect a small, user-supplied RF magnitude trace (frequency Hz, magnitude dB), compute finite min/max and identify one strongest dip; no uploaded file reading or instrument connection.
- **M16** `sdr_inspect_iq`: bounded real/imag pairs; compute mean power and peak magnitude; no SDR hardware access or transmission.
- **M18** `manual_answer_cited`: answer using matching user-supplied excerpt only; quote exact matching excerpt with source ID and mark as user-supplied unverified, with explicit unknown when no match.
- **M19** `equipment_diagnose`: educational diagnostic checklist from an explicit symptom category, with non-invasive actions only; not a repair certification.
- **M31** `adif_validate`: bounded plain-text ADIF record grammar validation for `<FIELD:LENGTH>value`, exact length checks, recognized EOR/EOH markers and rejection on malformed input. No persistence, file storage, external upload, or logbook access.

## Release constraints
Pure deterministic engines; strict schemas; <=32 datapoints, <=24 excerpts, <=4096 characters ADIF, bounded computation and side effects zero. Frequency finite and positive. Red tests before production code, observe CI RED; then green and typecheck, protocol/discovery count 30, Vercel preview READY for exact SHA. Input-only does not satisfy original user.file.read or provider.auth integration; mark these as **SOURCE IMPLEMENTED IN DRAFT — INPUT ONLY** rather than complete end-to-end integrations. Existing Draft PR dependency remains. No production promotion.
