# QRVAI MCP Wave 1 — six bounded source capabilities

Date: 2026-10-15. Target: Vercel-only MCP source, branch feat/mcp-wave1-core-rf-20261015, based on PR #17's pinned head. No Cloudflare, no changes to hosted secrets, and no production merge.

## Objective
Implement M01, M11, M12, M13, M22 and M25 as deterministic stateless read-only MCP tools, alongside four implemented RF tools. Contract scope is deliberately restricted to explicit inputs: no hidden device state, no live RF measurements, no unverified vendor data, no automatic regulatory permission.

## Tool contracts
- M01 `core_capabilities`: authoritative static registry of **implemented MCP tools** with name, candidate ID and scope. Returns only registered tools, no fake support for other candidates.
- M11 `antenna_geometry`: ideal thin-wire half-wave dipole or quarter-wave monopole length from supplied positive frequency (Hz), propagation factor (0,1], optionally per-side; free-space wavelength speed constant exactly 299792458 m/s. This is starting geometry, *not* final antenna resonance.
- M12 `antenna_matching`: ideal lossless single-section quarter-wave transformer characteristic impedance `sqrt(source_resistance_ohm * load_resistance_ohm)` for positive real resistive terminations; electrical quarter-wavelength at supplied frequency and velocity factor. Explicitly reject complex matching and extrapolated bandwidth claims.
- M13 `rf_filter_response`: ideal single-pole RC low-pass or high-pass magnitude and attenuation at strictly positive frequency/resistance/capacitance; no order >1, no component tolerance, no phase/network simulation.
- M22 `power_autonomy`: idealized battery runtime from nominal Wh or Ah×V and explicit derating factor (0,1], average consumption watts >0; no chemistry or real discharge curves.
- M25 `geo_bearing`: initial great-circle azimuth and approximate spherical arc range from latitude/longitude coordinate pairs, WGS84-independent mean-radius sphere 6371.0088km; not accurate geodesic surveying. Reject coincident/antipodal undefined bearing; normalize heading [0,360).

## Uniform requirements
Strict Zod input/output registration and pure functions, finite numeric constraints, explicit provenance/formula revisions, deterministic outputs, MCP structuredContent, readOnly/no-side-effect annotations, predictable rejection of invalid inputs, no external network. Tests must first fail for missing implementation (RED), then pass (GREEN); capture actual Actions logs on exact SHA. Do not mark 10/38 complete before registry and tests pass.

## Release gates
Branch PR targets the still-draft Vercel-only PR #17, preserving dependency. No production deployment/merge. Protected preview builds do not establish authenticated live MCP support until independently exercised with configured token and host compatibility.
