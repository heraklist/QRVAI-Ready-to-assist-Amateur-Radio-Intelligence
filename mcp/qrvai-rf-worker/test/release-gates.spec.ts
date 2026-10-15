import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

async function readGate() {
  // @ts-expect-error offline CLI is intentionally a plain .mjs module
  return import("../../../scripts/check-release-gates.mjs") as Promise<{checkReleaseGates:(x: unknown)=>string[]}>;
}
const fixture = () => JSON.parse(readFileSync(fileURLToPath(new URL("../../../qa/mcp/host-report.example.json",import.meta.url)),"utf8"));
test("deployment and QRVAI host evidence is BLOCKED by default",async()=>{
  const {checkReleaseGates}=await readGate();
  const errors=checkReleaseGates(fixture());
  assert.ok(errors.some(x=>x.includes("accountFreePlanVerified")),errors.join("; "));
  assert.ok(errors.some(x=>x.includes("hostInvocationObserved")),errors.join("; "));
  assert.ok(errors.some(x=>x.includes("oldCreatorRecordAbsent")),errors.join("; "));
});
test("empty strings and forged state do not pass gate",async()=>{
  const {checkReleaseGates}=await readGate();
  for(const data of [null,{},{"status":"EXECUTED_PASS"}, {"simulated":true,status:"EXECUTED_PASS"}]){
    assert.ok(checkReleaseGates(data).length>0);
  }
});
test("legacy backend ID cannot be submitted as fresh private plugin",async()=>{
  const {checkReleaseGates}=await readGate();
  const data=fixture();
  data.newPluginIdDistinct={passed:true,newPluginId:"plugins_6acf47f502dc8191bf542fe040d484d8",evidenceUrl:"https://github.com/example",observedAt:"2026-10-15T10:00:00Z"};
  assert.ok(checkReleaseGates(data).some(x=>x.includes("newPluginIdDistinct")));
});
test("simulation fixture cannot masquerade as observed host proof",async()=>{
  const {checkReleaseGates}=await readGate();
  const data=fixture();
  data.simulated=true;data.status="EXECUTED_PASS";
  assert.ok(checkReleaseGates(data).some(x=>x.toLowerCase().includes("simulat")));
});
