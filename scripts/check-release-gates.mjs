/* Offline evidence-shape check only; NEVER launches Vercel or a ChatGPT plugin. */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const oldId = "plugins_6acf47f502dc8191bf542fe040d484d8";
const fields = [
  "vercelPlanVerified","vercelQuotaVerified","vercelFunctionObserved","vercelPreviewTargetVerified","authCompatibilityVerified",
  "deployedEndpointVerified","oldCreatorRecordAbsent","qrvaiNamespaceAvailable",
  "freshPluginCreateAuthorized","newPluginIdDistinct","hostInvocationObserved",
  "observedFollowUp"
];
const validReceipt = r => typeof r==="object" && r!==null && !Array.isArray(r)
  && r.passed === true && typeof r.evidenceUrl==="string"
  && /^https:\/\//.test(r.evidenceUrl) && typeof r.observedAt==="string"
  && Number.isFinite(Date.parse(r.observedAt));

/** Check documentary completeness. Passing this does NOT independently verify evidence URLs or cloud actions. */
export function checkReleaseGates(evidence) {
  const errors=[];
  if (evidence===null || typeof evidence!=="object" || Array.isArray(evidence)) {
    return ["evidence must be an object"];
  }
  if (evidence.status!=="EXECUTED_PASS") errors.push("status must be EXECUTED_PASS only after external observations");
  if (evidence.simulated===true) errors.push("simulated evidence can never authorize release");
  if (evidence.status==="EXECUTED_PASS" && evidence.simulated!==false)
    errors.push("EXECUTED_PASS cannot be asserted from simulated or missing provenance");
  if (typeof evidence.exactSourceSha!=="string" || !/^[0-9a-f]{40}$/.test(evidence.exactSourceSha))
    errors.push("exactSourceSha requires the observed full Git SHA");
  for (const name of fields) {
    if (!validReceipt(evidence[name])) errors.push(name+" requires actual observed receipt (passed, URL and timestamp)");
  }
  const id=evidence.newPluginIdDistinct?.newPluginId;
  if (typeof id!=="string" || !/^plugins_[A-Za-z0-9]+$/.test(id) || id===oldId)
    errors.push("newPluginIdDistinct must identify a genuinely distinct new backend ID");
  const host=evidence.hostInvocationObserved;
  if (host?.conversationAlreadyOpen!==true || typeof host?.client!=="string" || !host.client.trim())
    errors.push("hostInvocationObserved needs real named client and already-open ChatGPT conversation proof");
  const follow=evidence.observedFollowUp;
  if (typeof follow?.conversationId!=="string" || !follow.conversationId.trim())
    errors.push("observedFollowUp requires same-session conversation evidence");
  const originalId=host?.conversationId;
  if (typeof originalId!=="string" || !originalId.trim() ||
      typeof follow?.conversationId!=="string" || follow.conversationId!==originalId)
    errors.push("conversation identifiers must match across original host invocation and observed follow-up");
  const observed=evidence.vercelFunctionObserved;
  if (typeof observed?.durationMs!=="number" || !Number.isFinite(observed.durationMs) || observed.durationMs<0)
    errors.push("vercelFunctionObserved requires measured non-negative Vercel function duration");
  if (evidence.vercelPreviewTargetVerified?.target!=="preview")
    errors.push("vercelPreviewTargetVerified must prove preview, never production");
  if (typeof evidence.authCompatibilityVerified?.method!=="string" ||
      !evidence.authCompatibilityVerified.method.trim())
    errors.push("authCompatibilityVerified must identify the observed MCP client authentication method");
  return errors;
}
function main() {
  const file=process.argv[2];
  if (!file) { console.error("BLOCKED: supply an external evidence JSON path");process.exitCode=2;return; }
  try {
    const data=JSON.parse(readFileSync(file,"utf8"));
    const issues=checkReleaseGates(data);
    if(issues.length){console.error("BLOCKED / NOT_EXECUTED\n"+issues.join("\n"));process.exitCode=2;}
    else console.log("DOCUMENTARY CHECK COMPLETE — EXTERNAL HUMAN VERIFICATION STILL REQUIRED");
  } catch {console.error("BLOCKED: invalid evidence report");process.exitCode=2;}
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) main();
