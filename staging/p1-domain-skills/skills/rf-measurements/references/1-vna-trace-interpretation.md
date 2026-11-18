# SS-B10-1 — VNA Trace Interpretation

**Owner:** SK-B10
**Responsibility:** parse S11/S21, reference impedance and marker readings
**Required input:** User-provided instrument/model calibration state, frequency_hz, magnitude_db trace, reference Z0 and phase/complex data when specifically available, and format version.
**Procedure:** Explain the distinction: S11 reflection ratio, S21 transmission, reference impedance and complex magnitude/phase. A simple magnitude-dB trace cannot derive port mapping, missing phase or full Touchstone sNp. Consult official IBIS Touchstone 2.1 format reference without falsely reading a file. For actual supported samples, inspect minimum, maximum and deepest dip only.
**Output:** Clearly separate USER_SUPPLIED_UNVERIFIED scalar extrema from a labelled example of complex S-parameter theory; list missing instrument and reference context. Touchstone file parser NOT_IMPLEMENTED.
**Error/stop:** No calibrated VNA reading, automated complex file parser, inferred reference impedance, fabricated insertion loss or physical instrument connection.

**Provenance:** USER_SUPPLIED_UNVERIFIED. No calibrated VNA, live measurements or device access. Touchstone 2.1 reference is not a file parser.
