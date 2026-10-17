import {test} from "node:test";
import assert from "node:assert/strict";
import {measurementsInspectTrace,sdrInspectIq,manualAnswerCited,equipmentDiagnose,adifValidate} from "../src/rf/wave5.ts";

test("M15 extrema and lowest sample follow supplied RF trace",()=>{const r=measurementsInspectTrace({samples:[{frequency_hz:145000000,magnitude_db:-3},{frequency_hz:146000000,magnitude_db:-25},{frequency_hz:147000000,magnitude_db:-8}]});assert.equal(r.minimum_db,-25);assert.equal(r.deepest_dip_frequency_hz,146000000);assert.equal(r.instrument_connected,false)});
test("M15 rejects nonfinite magnitudes",()=>assert.throws(()=>measurementsInspectTrace({samples:[{frequency_hz:145000000,magnitude_db:Infinity}]})));
test("M16 IQ power and peak calculated deterministically",()=>{const r=sdrInspectIq({samples:[{i:3,q:4},{i:0,q:0}]});assert.equal(r.mean_power,12.5);assert.equal(r.peak_magnitude,5);assert.equal(r.device_connected,false)});
test("M16 rejects empty IQ samples",()=>assert.throws(()=>sdrInspectIq({samples:[]})));
test("M18 answers only with explicit matching source IDs",()=>{const r=manualAnswerCited({question:"battery",excerpts:[{id:"p1",text:"Disconnect battery before servicing."},{id:"p2",text:"Antenna mounted externally."}]});assert.equal(r.citations[0].id,"p1");assert.equal(r.answered,true);assert.equal(r.external_retrieval,false)});
test("M18 abstains when source lacks evidence",()=>{const r=manualAnswerCited({question:"firmware",excerpts:[{id:"p1",text:"Battery operation"}]});assert.equal(r.answered,false);assert.equal(r.citations.length,0)});
test("M19 educational diagnostics are non-invasive",()=>{const r=equipmentDiagnose({symptom:"no_receive_audio"});assert.equal(r.repair_certified,false);assert.ok(r.steps.every(x=>!x.toLowerCase().includes("open chassis")))});
test("M19 rejects unfamiliar symptom",()=>assert.throws(()=>equipmentDiagnose({symptom:"internal_electrocution" as never})));
test("M31 validates correctly sized user supplied ADIF field",()=>{const r=adifValidate({adif:"<CALL:5>SV1AA<EOR>"});assert.equal(r.valid,true);assert.equal(r.records,1);assert.deepEqual(r.fields,["CALL"]);assert.equal(r.saved,false)});
test("M31 rejects truncated ADIF fields",()=>{const r=adifValidate({adif:"<CALL:6>SV1AA<EOR>"});assert.equal(r.valid,false)});
test("M31 rejects oversized input",()=>assert.throws(()=>adifValidate({adif:"x".repeat(4097)})));

test("M31 P0 private ADIF data remains absent from validation output",()=>{const sample="<EOH><CALL:4>SV1A<BAND:3>20M<EOR>";const r=adifValidate({adif:sample});assert.equal(r.valid,true);assert.equal(r.records,1);assert.equal(r.saved,false);assert.deepEqual(r.fields,["CALL","BAND"]);assert.ok(!JSON.stringify(r).includes("SV1A"));});
test("M31 P0 invalid field length omits raw input",()=>{const r=adifValidate({adif:"<EOH><CALL:9>ABC<EOR>"});assert.equal(r.valid,false);assert.equal(r.records,0);assert.ok(!JSON.stringify(r).includes("ABC"));});
