# Historical divergent PR #23 — complete path-identified review patch excerpts

Snapshot: 2026-11-15
Original PR: https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/23
Original HEAD: 5426845e2fc75bb3218157be5be5b66dc3418cb1
Compared to: original PR base feat/mcp-wave4-source-grounding-20261015; **not** a direct patch against #53.
Status: **archive only; DO NOT apply or execute directly**. Historical code API differs from canonical #53. This file preserves every file patch returned by GitHub for the PR for audit and manual selective porting.

## docs/superpowers/specs/2026-10-15-qrvai-wave5-user-data.md (added; 12 lines changed)

```diff
@@ -0,0 +1,12 @@
+# Wave 5 — bounded private, user-supplied diagnostics (Vercel only)
+
+Base: PR #22 at bf8d83577bd878531073be9442c20441bd3afbae. PR chain remains Draft. No direct file reads, external services, station devices, automatic RF, or persistence.
+
+Selected planned IDs:
+- M15 measurements_inspect_trace: user-supplied frequency/power measurements, sorted and peak/minimum/mean in dBm; no physical instrument access or signal integrity certification.
+- M16 sdr_inspect_iq: user-supplied tiny interleaved numeric complex I/Q sample arrays; amplitude power estimate and clipping candidate, no access to physical SDR nor spectral claims.
+- M19 equipment_diagnose: explicit symptom enum with bounded classroom troubleshooting suggestions, not a live machine diagnostic.
+- M31 log_adif_validate: strict bounded ADIF subset parser on user-supplied text, no filesystem or remote logbook access; no callsign exposure by default, no upload or storage.
+- M32 log_award_progress: user-supplied QSO band/DXCC simplified distinct counts, NOT official award eligibility.
+
+Security: strict zod schemas, body ceiling inherited, numerical finite bounds, number limits, no logs of raw input, no network or stateful profiles; error outputs are safe and clear. TDD tests first and demonstrated RED on exact SHA; then implementation and output schema registrations, registry/discovery and CI update. Preview READY alone does not establish authenticated MCP or production readiness.
```

## mcp/qrvai-rf-worker/package.json (modified; 2 lines changed)

```diff
@@ -4,7 +4,7 @@
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --experimental-strip-types --test test/power.spec.ts test/link-budget.spec.ts test/impedance.spec.ts test/feedline.spec.ts test/validation.spec.ts test/register.spec.ts test/protocol.spec.ts test/http-limits.spec.ts test/source-boundary.spec.ts test/release-gates.spec.ts test/vercel-protocol.spec.ts test/wave1.spec.ts test/wave2.spec.ts test/wave3.spec.ts test/wave4.spec.ts",
+    "test": "node --experimental-strip-types --test test/power.spec.ts test/link-budget.spec.ts test/impedance.spec.ts test/feedline.spec.ts test/validation.spec.ts test/register.spec.ts test/protocol.spec.ts test/http-limits.spec.ts test/source-boundary.spec.ts test/release-gates.spec.ts test/vercel-protocol.spec.ts test/wave1.spec.ts test/wave2.spec.ts test/wave3.spec.ts test/wave4.spec.ts test/wave5.spec.ts",
     "typecheck": "tsc --noEmit",
     "verify:https": "node scripts/verify-https.mjs"
   },
```

## mcp/qrvai-rf-worker/test/wave5.spec.ts (added; 13 lines changed)

```diff
@@ -0,0 +1,13 @@
+import {test} from "node:test";
+import assert from "node:assert/strict";
+import {measurementsInspectTrace,sdrInspectIq,equipmentDiagnose,logAdifValidate,logAwardProgress} from "../src/rf/wave5.ts";
+test("M15 computes ordered trace peak and average",()=>{const v=measurementsInspectTrace({points:[{frequency_hz:200,power_dbm:-30},{frequency_hz:100,power_dbm:-10}]});assert.equal(v.peak_frequency_hz,100);assert.equal(v.mean_power_dbm,-20);assert.equal(v.points[0].frequency_hz,100);});
+test("M15 rejects nonfinite numbers",()=>assert.throws(()=>measurementsInspectTrace({points:[{frequency_hz:100,power_dbm:NaN}]})));
+test("M16 calculates sample RMS and clipping hints only",()=>{const v=sdrInspectIq({samples:[{i:0.5,q:0},{i:0,q:0.5}]});assert.equal(v.rms_amplitude,0.5);assert.equal(v.clipping_suspected,false);assert.equal(v.device_connected,false);});
+test("M16 bounds sample values",()=>assert.throws(()=>sdrInspectIq({samples:[{i:2,q:0}]})));
+test("M19 returns educational suggestions without hardware diagnosis",()=>{const v=equipmentDiagnose({symptom:"no_receive"});assert.equal(v.device_connected,false);assert.ok(v.checks.length>1);});
+test("M19 rejects unknown symptom",()=>assert.throws(()=>equipmentDiagnose({symptom:"magic" as any})));
+test("M31 validates compact ADIF input without exposing raw callsigns",()=>{const v=logAdifValidate({adif:"<EOH><CALL:4>SV1A<BAND:3>20M<EOR>"});assert.equal(v.record_count,1);assert.equal(v.valid,true);assert.equal(JSON.stringify(v).includes("SV1A"),false);});
+test("M31 rejects malformed ADIF length",()=>{const v=logAdifValidate({adif:"<EOH><CALL:9>ABC<EOR>"});assert.equal(v.valid,false);});
+test("M32 calculates distinct submitted entities without official award claim",()=>{const v=logAwardProgress({qsos:[{band:"20m",dxcc:236},{band:"40m",dxcc:236},{band:"20m",dxcc:291}]});assert.equal(v.unique_dxcc_count,2);assert.equal(v.official_award_verified,false);});
+test("M32 rejects invalid DXCC ids",()=>assert.throws(()=>logAwardProgress({qsos:[{band:"20m",dxcc:-1}]})));
```
