# QRVAI tools — 38 read-only MCP tools

All tools are stateless and read-only. Tools marked **(your data)** only check, filter or summarize records the user pastes into the request; they fetch nothing and verify nothing. Pass arguments exactly as each tool's schema requires and report its assumptions with the result.

## Calculations

| Tool | What it computes |
|---|---|
| `rf_power_convert` | W, mW, dBm, dBW conversion |
| `rf_link_budget` | Received power and margin from explicit gains, losses and path loss |
| `rf_impedance` | Reflection coefficient, VSWR and return loss for R + jX against Z0 |
| `rf_feedline_loss` | Cable and connector loss from a supplied attenuation curve; prefer `log_log` interpolation for coax |
| `antenna_geometry` | Ideal thin-wire dipole and monopole dimensions |
| `antenna_matching` | Lossless quarter-wave transformer |
| `rf_filter_response` | Ideal first-order RC magnitude response |
| `power_autonomy` | Idealized battery runtime |
| `geo_bearing` | Great-circle bearing |
| `propagation_path` | Great-circle distance and free-space path loss only, not an ionospheric forecast |
| `rf_exposure_screen` | Ideal far-field power flux, not a compliance assessment |

## Checks on data the user supplies (your data)

| Tool | What it does |
|---|---|
| `source_lookup` | Search supplied source snippets |
| `regulatory_check_operation` | Compare a frequency with supplied rules; never grants permission |
| `spectrum_band_segments` | Match a frequency against supplied band segments |
| `spectrum_find_repeaters` | Filter supplied repeater records |
| `manual_find` | Search supplied manual excerpts |
| `manual_answer_cited` | Exact matches in supplied manual excerpts |
| `measurements_inspect_trace` | Statistics on supplied RF trace samples |
| `sdr_inspect_iq` | Statistics on supplied IQ samples |
| `adif_validate` | Grammar check of a supplied ADIF snippet |
| `station_get_profile` | Normalize a supplied station snapshot |
| `station_read_status` | Inspect a supplied station status snapshot |
| `station_signal_path` | Describe a supplied signal path |
| `spaceweather_indices` | Inspect a supplied Kp record |
| `dx_reception_reports` | Filter supplied reception reports |
| `log_award_progress` | Compare supplied award entity lists |
| `satellite_pass` | Summarize supplied elevation samples, no orbit prediction |
| `contest_plan` | Sort supplied contest time slots |

## Training, simulation and education

| Tool | What it does |
|---|---|
| `emcomm_drill` | Classroom-only emergency exercise |
| `emcomm_readiness` | Hypothetical training resource gaps |
| `packet_route_preview` | Simulated AX.25/APRS path |
| `digital_setup_guide` | Offline digital-mode setup guide |
| `repeater_channel_preview` | Hypothetical repeater offset arithmetic |
| `equipment_diagnose` | Non-invasive diagnostic checklist |
| `academy_exercise` | Fixed educational questions |
| `maker_project_review` | Low-voltage educational project review |
| `club_workshop_plan` | Offline workshop agenda |
| `core_capabilities` | List the implemented tools |
