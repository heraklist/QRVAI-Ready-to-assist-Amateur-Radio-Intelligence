import {test} from "node:test";
import assert from "node:assert/strict";
import {handleVerifiedMcpRequest} from "../src/http/verified-mcp.ts";
const url="https://qrvai.example/api/mcp";
const body={jsonrpc:"2.0",id:1,method:"tools/list"};
const req=(authorization?:string)=>new Request(url,{method:"POST",headers:{"content-type":"application/json","accept":"application/json, text/event-stream",...(authorization?{authorization}:{})},body:JSON.stringify(body)});
const cfg={issuer:"https://issuer.example/",audience:"https://qrvai.example/api/mcp"};
test("reject missing token without invoking verifier",async()=>{
 let called=0;
 const res=await handleVerifiedMcpRequest(req(),async()=>{called++;return null;},cfg);
 assert.equal(res.status,401);assert.equal(called,0);
});
test("reject unverified token and never fall back to shared bearer",async()=>{
 const res=await handleVerifiedMcpRequest(req("Bearer invalid"),async()=>null,cfg);
 assert.equal(res.status,401);
});
test("reject principal with mismatched issuer or audience",async()=>{
 const res=await handleVerifiedMcpRequest(req("Bearer sample"),async()=>({subject:"a",tenantId:"t",scopes:["qrvai:tools:read"],issuer:"https://other/",audience:cfg.audience}),cfg);
 assert.equal(res.status,401);
});
test("deny invalid principal scopes before MCP handler",async()=>{
 const res=await handleVerifiedMcpRequest(req("Bearer sample"),async()=>({subject:"a",tenantId:"t",scopes:["untrusted"],issuer:cfg.issuer,audience:cfg.audience}),cfg);
 assert.equal(res.status,403);
});
test("verified read-scope identity receives filtered SDK tools/list",async()=>{
 const res=await handleVerifiedMcpRequest(req("Bearer sample"),async()=>({subject:"a",tenantId:"t",scopes:["qrvai:tools:read"],issuer:cfg.issuer,audience:cfg.audience}),cfg);
 assert.equal(res.status,200);
 const result=await res.json();
 assert.ok(result.result.tools.some((tool:{name:string})=>tool.name==="rf_power_convert"));
 assert.ok(!result.result.tools.some((tool:{name:string})=>tool.name==="adif_validate"));
 assert.ok(!result.result.tools.some((tool:{name:string})=>tool.name==="station_get_profile"));
});
