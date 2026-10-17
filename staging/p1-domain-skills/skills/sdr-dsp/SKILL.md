---
name: sdr-dsp
description: Source-only education on sampling, illustrative FFT bin resolution and DSP filtering, and bounded statistics on user-supplied IQ pairs with consent/privacy constraints.
---
# SK-B13 — SDR & Digital Signal Processing

**Trigger:** User asks about received IQ numerical examples, sampling/aliasing, spectral windowing or DSP filter theory without any requirement to control radios.
**Required context:** sample_rate in Hz, complex-vs-real sample interpretation, N samples and format/bit depth for theoretical FFT; authorized bounded (i,q) values for available statistics; documented rights and anonymized SigMF metadata if provided.
**Output contract:** Distinguish exact analytic formulas and IDEAL_MODEL examples (Nyquist and Δf=sample_rate/N) from data-derived mean_power/peak_magnitude only when supplied. Missing sampling rate => INDETERMINATE. Actual FFT, waterfall rendering, receiver capture and SigMF binary parsing are NOT_IMPLEMENTED by `sdr_inspect_iq`.
**Refusal/stop condition:** No live SDR devices, station receiver connections, intercepting protected communications, private signal decoding/identification, revealing SigMF core:author or geolocation, or unconsented capture. No CAT/PTT/TX. Source snippets are USER_SUPPLIED_UNVERIFIED. Do not claim FFT visualization already ran.

**Tool boundary:** `sdr_inspect_iq` computes sample_count, mean_power and peak_magnitude for up to 32 user-supplied IQ pairs; device_connected:false. No sample-rate inference, FFT engine, digital filter execution, demodulation, SigMF parser, live network or SDR driver.

- [SS-B13-1 Sampling Foundations](references/1-sampling-foundations.md)
- [SS-B13-2 Spectrum/FFT Visualization](references/2-spectrumfft-visualization.md)
- [SS-B13-3 DSP Filter Analysis](references/3-dsp-filter-analysis.md)
