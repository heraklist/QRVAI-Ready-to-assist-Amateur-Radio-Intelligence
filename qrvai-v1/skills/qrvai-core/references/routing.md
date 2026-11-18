# QRVAI routing — 24 Domain Skills

Pick the Skill whose row matches the request. Each Skill has three internal procedures in its own `references/` folder.

## A — Safety, civil protection and regulations (highest priority)

| Skill | Use for |
|---|---|
| `civil-protection` | Exercise-only readiness inventories, backup resilience, after-action reviews |
| `emcomm-traffic` | Tabletop emergency-communication drills, message form checks, simulated fallback |
| `frequency-intelligence` | Official-source allocation research for named jurisdictions (current adapters are partial), ITU/IARU overlays, supplied repeater lists |
| `regulatory-licensing` | Jurisdiction-specific regulation and visitor recognition with INDETERMINATE on unsupported coverage |
| `rf-safety-emc` | Ideal RF flux comparisons, non-invasive interference troubleshooting |

## B — Engineering and equipment

| Skill | Use for |
|---|---|
| `equipment-manuals` | Manual-based settings and non-invasive diagnosis when model, firmware and source are known |
| `rf-engineering` | Power units, link budgets, impedance, noise and margin |
| `antenna-feedline` | Antenna dimensions, quarter-wave matching, reflection, feedline loss |
| `rf-electronics` | RF circuits and ideal first-order filter response |
| `rf-measurements` | Reading supplied RF traces, VNA and test-equipment guidance |
| `station-integration` | Station wiring and compatibility explanations, supplied status snapshots |
| `power-infrastructure` | Power budgets, battery runtime, backup scenarios |
| `sdr-dsp` | Sampling, FFT resolution, filtering, statistics on supplied IQ samples |

## C — Operating and radio intelligence

| Skill | Use for |
|---|---|
| `operating-dx` | Operating procedure and DX planning from supplied examples |
| `propagation` | Supplied space-weather data, great-circle distance and free-space loss |
| `digital-modes` | Digital-mode fundamentals and setup checklists |
| `packet-networks` | AX.25/APRS paths, Winlink and mesh planning on paper |
| `repeaters-dvoice` | Repeater offsets, digital voice, filtering supplied directories |
| `satellites-weak-signal` | Satellite and weak-signal education, summaries of supplied pass samples |
| `logbook-awards` | Supplied ADIF snippets, QSO statistics, award progress |
| `contests-portable` | Contest preparation and portable activation checklists |

## D — Education and community

| Skill | Use for |
|---|---|
| `radio-academy` | Worldwide hobby learning: radio theory, CW, operating, SDR, digital modes and original practice; no core national licence/exam prep |
| `radio-maker` | Low-voltage maker projects and radio software interoperability |
| `clubs-mentoring` | Club onboarding, workshop agendas, mentoring templates |

For country-specific regulatory research, call `regulatory_context` to assess evidence scope, then `regulatory_sources` / `regulation_text` only when the operating-country primary source is available. The eight published country packs provide official source discovery, not operative legal privileges; `INDETERMINATE` is mandatory without a checked national basis. IARU bands alone never authorize transmission.

For general Academy enquiries, call `academy_catalog` with `language` (`en` or `el`) to show nine hobby modules. For one of the 27 EN/EL original micro-lessons, call it with `lesson_id` (e.g. `morse-and-cw-1`) to retrieve the explanation, safe practice and self-check answer. Do not misrepresent these micro-lessons as complete editorially reviewed long-form courses. Use offline/receive-only simulation for training, never infer permission to operate.

If nothing fits, answer from general amateur radio knowledge within the boundaries of the core Skill and say which parts are unverified.
