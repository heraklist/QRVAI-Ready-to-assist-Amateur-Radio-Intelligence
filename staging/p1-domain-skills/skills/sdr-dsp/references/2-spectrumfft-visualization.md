# SS-B13-2 — Spectrum/FFT Visualization

**Owner:** SK-B13
**Responsibility:** transform authorized IQ into labeled spectral estimates
**Required input:** Anonymized and rights-authorized IQ metadata, explicit sample_rate, N, window and target display axes; user-supplied limited samples where allowed.
**Procedure:** Explain DFT/bin spacing, window leakage tradeoff and complex baseband sign/frequency interpretation in examples; use `sdr_inspect_iq` only for amplitude statistics, not to compute an FFT. A real waterfall/FFT plotted from SigMF bytes remains NOT_IMPLEMENTED. SigMF schema is a reference, not decoded file content.
**Output:** Theory-only spectrum/FFT visualization schema or narrative without falsely claiming computed dataset; label unknowns, no downloaded IQ.
**Error/stop:** No live SDR receiver, private core:author or geolocation, intercepted audio, FFT fabricated output, signal attribution or decryption.

**Evidence:** IDEAL_MODEL for math; USER_SUPPLIED_UNVERIFIED for IQ samples and metadata. No live SDR or computed FFT by the draft MCP method.
