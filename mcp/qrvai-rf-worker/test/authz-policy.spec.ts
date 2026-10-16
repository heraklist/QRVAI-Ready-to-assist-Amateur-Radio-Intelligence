import {test} from "node:test";
import assert from "node:assert/strict";
import {authorizeToolCall,authorizeToolList,classifyTool} from "../src/http/authz-policy.ts";
import {IMPLEMENTED_TOOLS} from "../src/rf/wave1.ts";

const reader={subject:"user-a",tenantId:"tenant-a",scopes:["qrvai:tools:read"]};
test("all 38 MCP tools have explicit classifications",()=>{
  assert.equal(IMPLEMENTED_TOOLS.length,38);
  assert.deepEqual(IMPLEMENTED_TOOLS.filter(tool=>classifyTool(tool.name)===null),[]);
  assert.equal(classifyTool("unknown-tool"),null);
});
test("unauthenticated or absent claims deny tools",()=>{
  assert.equal(authorizeToolCall(null,"rf_power_convert"),false);
  assert.equal(authorizeToolCall(reader,"station_get_profile"),false);
  assert.equal(authorizeToolCall(reader,"adif_validate"),false);
  assert.equal(authorizeToolCall(reader,"station_read_status"),false);
});
test("read scoped principal can run only public impersonal tools",()=>{
  assert.equal(authorizeToolCall(reader,"rf_power_convert"),true);
  assert.equal(authorizeToolCall(reader,"rf_link_budget"),true);
  assert.equal(authorizeToolCall(reader,"not_registered"),false);
});
test("user-provided datasets require distinct explicit scope",()=>{
  const userData={...reader,scopes:[...reader.scopes,"qrvai:user-data:process"]};
  assert.equal(authorizeToolCall(userData,"adif_validate"),true);
  assert.equal(authorizeToolCall(userData,"manual_answer_cited"),true);
});
test("private station and log actions require tenant match and dedicated grant",()=>{
  const station={...reader,scopes:[...reader.scopes,"qrvai:station:read"]};
  assert.equal(authorizeToolCall(station,"station_get_profile",{tenantId:"tenant-b"}),false);
  assert.equal(authorizeToolCall(station,"station_get_profile",{tenantId:"tenant-a"}),true);
  assert.equal(authorizeToolCall(station,"log_award_progress",{tenantId:"tenant-a"}),false);
  const logs={...reader,scopes:[...reader.scopes,"qrvai:logs:read"]};
  assert.equal(authorizeToolCall(logs,"log_award_progress",{tenantId:"tenant-a"}),true);
  assert.equal(authorizeToolCall(logs,"log_award_progress",{tenantId:"tenant-b"}),false);
  assert.equal(authorizeToolCall(logs,"log_award_progress"),false);
});
test("tool discovery cannot reveal unauthorized names",()=>{
  const listed=authorizeToolList(reader,IMPLEMENTED_TOOLS.map(t=>t.name));
  assert.ok(listed.includes("rf_power_convert"));
  assert.ok(!listed.includes("station_get_profile"));
  assert.ok(!listed.includes("adif_validate"));
  assert.deepEqual(authorizeToolList(null,IMPLEMENTED_TOOLS.map(t=>t.name)),[]);
});
