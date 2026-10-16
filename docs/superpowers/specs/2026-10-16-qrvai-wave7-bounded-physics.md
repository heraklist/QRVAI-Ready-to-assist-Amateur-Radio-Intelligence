# Wave7 — bounded physics demonstration engines (M14, M24, M26)

Parent Draft PR #25; Vercel only, no Cloudflare runtime. Three intentionally bounded tools complete catalog registration 38/38, NOT real-world service integration.

- M14 `rf_exposure_screen`: free-space isotropic equivalent power flux density estimate S = P * G / (4 pi r²), where input power is mean W and gain a *linear* dimensionless ratio; compare with user-supplied reference W/m²; never conclude regulatory compliance or safe distance. No near field, reflection, duty-cycle inference, humans, medical implant, or jurisdiction assessment. Output `compliance_established: false`.
- M24 `propagation_path`: spherical great-circle distance + free-space path loss 32.44 + 20log10(f MHz) + 20log10(d km) for bounded geographic endpoints and strictly positive distance. Does not model ionosphere, terrain, diffraction, refraction, weather or actual reception; `real_world_prediction: false`.
- M26 `satellite_pass`: **not** actual pass determination. Given user-supplied elevation samples at timestamped points, filter >0° and return observed/sample-window start/end and peak. No TLE parsing, orbital propagation, satellite ephemerides, Doppler or future prediction; `orbit_computed: false`. Name retained for catalog compatibility, description explicitly sampled-window summary. Never present output as guaranteed real orbital pass.

Strict schemas, finite guards, UTC ISO times, length ≤32 samples, no network access, no storage, pure/read-only, RED tests then GREEN, CI and same-SHA Vercel preview. Mark source-only draft, not production or science/regulatory certification.
