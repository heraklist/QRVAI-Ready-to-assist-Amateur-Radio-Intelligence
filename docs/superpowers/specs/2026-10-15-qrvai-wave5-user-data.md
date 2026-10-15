# Wave 5 — bounded private, user-supplied diagnostics (Vercel only)

Base: PR #22 at bf8d83577bd878531073be9442c20441bd3afbae. PR chain remains Draft. No direct file reads, external services, station devices, automatic RF, or persistence.

Selected planned IDs:
- M15 measurements_inspect_trace: user-supplied frequency/power measurements, sorted and peak/minimum/mean in dBm; no physical instrument access or signal integrity certification.
- M16 sdr_inspect_iq: user-supplied tiny interleaved numeric complex I/Q sample arrays; amplitude power estimate and clipping candidate, no access to physical SDR nor spectral claims.
- M19 equipment_diagnose: explicit symptom enum with bounded classroom troubleshooting suggestions, not a live machine diagnostic.
- M31 log_adif_validate: strict bounded ADIF subset parser on user-supplied text, no filesystem or remote logbook access; no callsign exposure by default, no upload or storage.
- M32 log_award_progress: user-supplied QSO band/DXCC simplified distinct counts, NOT official award eligibility.

Security: strict zod schemas, body ceiling inherited, numerical finite bounds, number limits, no logs of raw input, no network or stateful profiles; error outputs are safe and clear. TDD tests first and demonstrated RED on exact SHA; then implementation and output schema registrations, registry/discovery and CI update. Preview READY alone does not establish authenticated MCP or production readiness.
