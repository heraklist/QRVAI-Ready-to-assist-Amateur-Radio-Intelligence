# SS-B07-3 — Mismatch and Noise Metrics

**Owner:** SK-B07
**Responsibility:** compute SWR/return loss, noise figure and sensitivity within assumptions
**Required input:** For mismatch: passive complex load impedance R+jX ohm with R≥0 and real reference Z0>0 ohm. For thermal noise: bandwidth B>0 Hz, temperature T>0 K, noise figure NF in dB and required receiver SNR in dB; all are explicitly provided or clearly labeled defaults.
**Procedure:** For reflection use Γ=(Z−Z0)/(Z+Z0), |Γ|<1 => VSWR=(1+|Γ|)/(1−|Γ|), return loss = −20 log10(|Γ|) dB. At |Γ|=0, return loss is mathematically infinite and must be described as a status, not invented finite output. At |Γ|=1, VSWR is infinite or numerical limit. Registered `rf_impedance` inputs exactly `{"r_ohm":100,"x_ohm":0,"z0_ohm":50}`; it does not measure VNA parameters or compute noise figure. For illustrative thermal noise, P=kTB watts with Boltzmann k=1.380649×10^-23 J/K, noise floor in dBm=10 log10(kTB/0.001 W)+NF(dB), then sensitivity adds required SNR(dB). A noise/sensitivity estimate is conditional on T, B, NF and SNR; do not invent them.
**Output:** Ideal 100+j0 ohm into 50 ohm: |Γ|=1/3, VSWR=2, return loss≈9.542425 dB. If T, B, NF or SNR is missing, explain the formula but report MISSING_CONTEXT without a numerical sensitivity.
**Error/stop:** Reject negative resistance, Z0≤0, unstable denominator, out-of-bounds finite numbers, unknown noise bandwidth or hidden manufacturer assumptions. No verified physical measurements, no SWR certification and no automatic transmission.
