import {test} from "node:test";
import assert from "node:assert/strict";
import {Client,StreamableHTTPClientTransport} from "@modelcontextprotocol/client";
import {createAuthorizedServer} from "../src/mcp/scoped-server.ts";
import {WebStandardStreamableHTTPServerTransport} from "@modelcontextprotocol/server";
const principal={subject:"user-a",tenantId:"tenant-a",scopes:["qrvai:tools:read"]};
async function fixture(identity:typeof principal|null,fn:(client:Client)=>Promise<void>){
 const transport=new StreamableHTTPClientTransport(new URL("https://qrvai.example/api/mcp"),{fetch:async(url,init)=>{
  const server=createAuthorizedServer(identity);
  const wire=new WebStandardStreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
  await server.connect(wire);
  try{return await wire.handleRequest(new Request(url,init));}finally{await server.close();}
 }});
 const client=new Client({name:"authz-fixture",version:"0.1"});
 try{await client.connect(transport);await fn(client);}finally{await client.close();}
}
test("actual SDK ListTools result hides station and data tools",async()=>fixture(principal,async(client)=>{
 const result=await client.listTools();
 assert.ok(result.tools.some(t=>t.name==="rf_power_convert"));
 assert.ok(!result.tools.some(t=>t.name==="station_get_profile"));
 assert.ok(!result.tools.some(t=>t.name==="adif_validate"));
}));
test("actual CallTool prevents access to excluded tool",async()=>fixture(principal,async(client)=>{
 await assert.rejects(client.callTool({name:"station_get_profile",arguments:{}}));
}));
test("missing verified identity shows no registered tools",async()=>fixture(null,async(client)=>{
 const result=await client.listTools();assert.equal(result.tools.length,0);
}));
test("data-scoped account sees ADIF but not station tools",async()=>fixture({...principal,scopes:["qrvai:user-data:process"]},async(client)=>{
 const names=(await client.listTools()).tools.map(t=>t.name);
 assert.ok(names.includes("adif_validate"));
 assert.ok(!names.includes("station_get_profile"));
 assert.ok(!names.includes("rf_power_convert"));
}));
