# SS-B08-1 — Antenna Geometry

**Owner:** SK-B08
**Responsibility:** estimate physical geometry and expose ground/velocity caveats
**Required input:** Declared positive frequency in Hz, ideal antenna `kind` equal to `halfwave_dipole` or `quarterwave_monopole`, and a finite positive `velocity_factor` ≤1, plus real-world environment details when physical design advice is sought.
**Procedure:** For ideal length use λ=c/f with c=299792458 m/s, effective guided wavelength λ×velocity_factor, ideal half-wave dipole *total* length L=c×vf/(2f), each of two symmetrical elements L/2; quarter-wave monopole length L=c×vf/(4f). The source-registered `antenna_geometry` calculator accepts exactly `{"kind":"halfwave_dipole","frequency_hz":14200000,"velocity_factor":0.95}`; it is educational geometry only. Distinguish wire conductor end effect, ground radial system, nearby objects, frequency detuning and feedpoint impedance as unmodeled.
**Output:** At 14.2 MHz and vf=0.95, ideal half-wave dipole total length ≈10.0283 m, each arm ≈5.0142 m; this is not measured resonance or a guaranteed physical cut length. State topology, c constant, ideal assumptions and units.
**Error/stop:** Nonpositive frequency, unknown antenna kind, invalid vf, absent geometry/environment for performance claims => OUT_OF_RANGE or MISSING_CONTEXT. No fabricated NEC radiation diagram or guaranteed real-world gain; use an accredited simulator only after separate verified provision, never invent a result.
