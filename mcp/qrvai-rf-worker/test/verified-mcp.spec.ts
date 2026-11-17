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

test("verified MCP binds request URL to exact canonical token audience, never a preview alias",async()=>{
 let calls=0;
 const verify=async()=>{calls++;return {subject:"a",tenantId:"t",scopes:["qrvai:tools:read"],issuer:cfg.issuer,audience:cfg.audience};};
 const requestAt=(url:string)=>new Request(url,{method:"POST",headers:{"content-type":"application/json","authorization":"Bearer sample"},body:JSON.stringify(body)});
 for(const url of ["https://preview-qrvai.example/api/mcp",
                   "https://qrvai.example/api/mcp?alias=preview"]){
  const res=await handleVerifiedMcpRequest(requestAt(url),verify,cfg);
  assert.equal(res.status,403);
 }
 assert.equal(calls,0,"wrong resource URL must never call the token verifier");
});

test("verified MCP produces RFC 9728 discovery challenge only on the verified canonical origin",async()=>{
 const res=await handleVerifiedMcpRequest(req(),async()=>{throw new Error("verifier must not run");},cfg);
 assert.equal(res.status,401);
 assert.equal(res.headers.get("www-authenticate"),'Bearer resource_metadata="https://qrvai.example/.well-known/oauth-protected-resource/api/mcp"');
 assert.equal(res.headers.get("cache-control"),"no-store");
 const invalid=await handleVerifiedMcpRequest(req("Bearer unknown"),async()=>null,cfg);
 assert.equal(invalid.status,401);
 assert.equal(invalid.headers.get("www-authenticate"),res.headers.get("www-authenticate"));
});
test("verified MCP does not advertise OAuth for invalid or missing issuer configuration",async()=>{
 const res=await handleVerifiedMcpRequest(req(),async()=>null,{...cfg,issuer:""});
 assert.equal(res.status,503);
 assert.equal(res.headers.get("www-authenticate"),null);
});
