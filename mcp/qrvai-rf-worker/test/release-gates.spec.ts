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
  assert.ok(errors.some(x=>x.includes("vercelPlanVerified")),errors.join("; "));
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


/** Synthetic test-only receipt set. NONE of these URLs represent an observed release. */
function syntheticCompleteReport(): Record<string, any> {
  const result: Record<string,any> = fixture();
  const receipt=()=>({passed:true,evidenceUrl:"https://example.invalid/not-a-real-receipt",observedAt:"2026-10-15T10:00:00Z"});
  for(const name of ["vercelPlanVerified","vercelQuotaVerified","vercelFunctionObserved","vercelPreviewTargetVerified","authCompatibilityVerified",
    "deployedEndpointVerified","oldCreatorRecordAbsent","qrvaiNamespaceAvailable",
    "freshPluginCreateAuthorized","newPluginIdDistinct","hostInvocationObserved","observedFollowUp"]){
      result[name]=receipt();
  }
  result.simulated=false; // Exercise documentary checks as though the input were not marked simulation.
  result.status="EXECUTED_PASS";
  result.exactSourceSha="a".repeat(40);
  result.newPluginIdDistinct.newPluginId="plugins_synthetic_new_identity";
  result.vercelFunctionObserved.durationMs=25;
  result.vercelPreviewTargetVerified.target="preview";
  result.authCompatibilityVerified.method="oauth-or-owner-approved";
  result.hostInvocationObserved.conversationAlreadyOpen=true;
  result.hostInvocationObserved.client="synthetic-test-client";
  result.hostInvocationObserved.conversationId="synthetic-session-A";
  result.observedFollowUp.conversationId="synthetic-session-A";
  return result;
}
test("review: complete-looking receipts cannot pass when status is NOT_EXECUTED",async()=>{
  const {checkReleaseGates}=await readGate();
  const report=syntheticCompleteReport();
  report.status="NOT_EXECUTED";
  assert.ok(checkReleaseGates(report).some(x=>x.includes("status")), "offline verifier must reject contradictory completion status");
});
test("review: follow-up conversation ID must match original @QRVAI session",async()=>{
  const {checkReleaseGates}=await readGate();
  const report=syntheticCompleteReport();
  report.observedFollowUp.conversationId="synthetic-session-B";
  assert.ok(checkReleaseGates(report).some(x=>x.includes("conversation")), "different conversations cannot satisfy same-session E2E gate");
});
