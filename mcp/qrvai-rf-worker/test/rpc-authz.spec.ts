import {test} from "node:test";
import assert from "node:assert/strict";
import {guardMcpRpcRequest} from "../src/http/rpc-authz.ts";
const principal={subject:"user-a",tenantId:"tenant-a",scopes:["qrvai:tools:read"]};
const json=(method:string,params?:Record<string,unknown>)=>new Request("https://qrvai.example/api/mcp",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:1,method,params})});
test("read-only authorization rejects untrusted discovery without identity",async()=>{
 const result=await guardMcpRpcRequest(json("tools/list"),null);
 assert.equal(result.allowed,false);
});
test("verified principal can discover only allowed tools via filtered list",async()=>{
 const result=await guardMcpRpcRequest(json("tools/list"),principal);
 assert.equal(result.allowed,true);
 assert.ok(result.allowedToolNames?.includes("rf_power_convert"));
 assert.ok(!result.allowedToolNames?.includes("station_get_profile"));
});
test("deny unauthorized tool call BEFORE MCP execution",async()=>{
 const result=await guardMcpRpcRequest(json("tools/call",{name:"station_get_profile",arguments:{}}),principal);
 assert.equal(result.allowed,false);
});
test("deny forged tenant IDs provided by client even with station scope",async()=>{
 const station={...principal,scopes:["qrvai:station:read"]};
 const result=await guardMcpRpcRequest(json("tools/call",{name:"station_get_profile",arguments:{tenantId:"tenant-a"}}),station);
 assert.equal(result.allowed,false);
});
test("deny JSON-RPC batches, invalid parse and unknown methods under scoped mode",async()=>{
 for(const body of ["[]","{bad",JSON.stringify([{jsonrpc:"2.0",method:"tools/list"}]),JSON.stringify({jsonrpc:"2.0",id:1,method:"custom/unknown"})]){
  const req=new Request("https://qrvai.example/api/mcp",{method:"POST",headers:{"content-type":"application/json"},body});
  assert.equal((await guardMcpRpcRequest(req,principal)).allowed,false);
 }
});
