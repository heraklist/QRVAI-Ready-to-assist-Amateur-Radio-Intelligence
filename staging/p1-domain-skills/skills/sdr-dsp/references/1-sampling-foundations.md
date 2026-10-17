# SS-B13-1 — Sampling Foundations

**Owner:** SK-B13
**Responsibility:** check Nyquist, aliasing, sample rate and decimation
**Required input:** Complex/real sampling convention, explicit positive sample_rate Hz, number of samples and quantization context, whether sample is a theory example or supplied data.
**Procedure:** Show Nyquist/alias relationship for stated real vs complex sampling, frequency bin Δf=f_s/N for ideal DFT and effect of decimation on effective sample rate. Example f_s=1e6Hz, N=1024 ⇒ Δf=976.5625 Hz. Do not infer sample_rate from a bare list of IQ numbers.
**Output:** IDEAL_MODEL sampling table, alias ambiguity notes and input validation; no observed RF signal claims.
**Error/stop:** No invented sample rate, source identification, live DSP execution, port scan, PTT or protected-signal monitoring.

**Evidence:** IDEAL_MODEL for math; USER_SUPPLIED_UNVERIFIED for IQ samples and metadata. No live SDR or computed FFT by the draft MCP method.
