import {test} from "node:test";
import assert from "node:assert/strict";
import {authorizeToolCall,authorizeToolList,classifyTool} from "../src/http/authz-policy.ts";
import {IMPLEMENTED_TOOLS} from "../src/rf/wave1.ts";
import {LIVE_TOOLS} from "../src/live/tools.ts";

const reader={subject:"user-a",tenantId:"tenant-a",scopes:["qrvai:tools:read"]};
test("all 54 MCP registry tools have explicitly reviewed classes, with no implicit public fallthrough",()=>{
  assert.equal(IMPLEMENTED_TOOLS.length,38);
  assert.equal(LIVE_TOOLS.length,16);
  const all=[...IMPLEMENTED_TOOLS,...LIVE_TOOLS];
  assert.equal(new Set(all.map(x=>x.name)).size,54);
  assert.deepEqual(all.filter(tool=>classifyTool(tool.name)===null).map(x=>x.name),[]);
  assert.deepEqual(all.reduce((counts,tool)=>{
    const type=classifyTool(tool.name);
    if(type!==null)counts[type]=(counts[type]??0)+1;
    return counts;
  },{} as Record<string,number>),{public:26,user_data:25,station:2,logs:1});
  assert.equal(classifyTool("unknown-tool"),null);
  // A name outside the explicit classification table must stay denied.
  assert.equal(authorizeToolCall({...reader,scopes:["qrvai:tools:read","qrvai:user-data:process"]},"new_unclassified_future_tool"),false);
});
test("every live tool is classified; user-dataset and station boundaries cannot be bypassed",()=>{
  assert.equal(classifyTool("academy_catalog"),"public");
  assert.equal(classifyTool("space_weather_now"),"public");
  assert.equal(classifyTool("adif_validate"),"user_data");
  assert.equal(classifyTool("station_get_profile"),"station");
  assert.equal(classifyTool("log_award_progress"),"logs");
  const visible=authorizeToolList(reader,[...IMPLEMENTED_TOOLS,...LIVE_TOOLS].map(x=>x.name));
  assert.ok(visible.includes("academy_catalog"));
  assert.ok(visible.includes("space_weather_now"));
  assert.ok(!visible.includes("adif_validate"));
  assert.ok(!visible.includes("station_get_profile"));
  assert.ok(!visible.includes("log_award_progress"));
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
