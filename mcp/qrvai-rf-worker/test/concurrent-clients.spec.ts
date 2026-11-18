import {test} from "node:test";
import assert from "node:assert/strict";
import {Client,StreamableHTTPClientTransport} from "@modelcontextprotocol/client";
import {WebStandardStreamableHTTPServerTransport} from "@modelcontextprotocol/server";
import {createAuthorizedServer} from "../src/mcp/scoped-server.ts";

const reader={subject:"reader",tenantId:"tenant-r",scopes:["qrvai:tools:read"]};
const processor={subject:"processor",tenantId:"tenant-p",scopes:["qrvai:user-data:process"]};
function connect(identity:typeof reader){
 const transport=new StreamableHTTPClientTransport(new URL("https://example.invalid/api/mcp"),{fetch:async(url,init)=>{
  const server=createAuthorizedServer(identity);
  const wire=new WebStandardStreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
  await server.connect(wire);
  try{return await wire.handleRequest(new Request(url,init));}finally{await server.close();}
 }});
 const client=new Client({name:"concurrent-authz-test",version:"0.1"});
 return {client,transport};
}
test("parallel clients have isolated tool catalogs and cannot invoke each other's scoped tools",async()=>{
 const a=connect(reader),b=connect(processor);
 try{
  await Promise.all([a.client.connect(a.transport),b.client.connect(b.transport)]);
  const [x,y]=await Promise.all([a.client.listTools(),b.client.listTools()]);
  const readerNames=new Set(x.tools.map(t=>t.name)),processorNames=new Set(y.tools.map(t=>t.name));
  assert.ok(readerNames.has("rf_power_convert"));
  assert.ok(!readerNames.has("adif_validate"));
  assert.ok(processorNames.has("adif_validate"));
  assert.ok(!processorNames.has("rf_power_convert"));
  assert.ok(!readerNames.has("station_get_profile"));
  assert.ok(!processorNames.has("station_get_profile"));
  const results=await Promise.allSettled([
   a.client.callTool({name:"adif_validate",arguments:{}}),
   b.client.callTool({name:"rf_power_convert",arguments:{}}),
  ]);
  assert.deepEqual(results.map(r=>r.status),["rejected","rejected"]);
  const [afterA,afterB]=await Promise.all([a.client.listTools(),b.client.listTools()]);
  assert.deepEqual(afterA.tools.map(t=>t.name),x.tools.map(t=>t.name));
  assert.deepEqual(afterB.tools.map(t=>t.name),y.tools.map(t=>t.name));
 }finally{await Promise.allSettled([a.client.close(),b.client.close()]);}
});
test("scoped instance A and B are isolated from an unauthenticated instance",async()=>{
 const a=connect(reader),b=connect(processor);const guest=connect({...reader,subject:"",scopes:[]});
 try{await Promise.all([a.client.connect(a.transport),b.client.connect(b.transport),guest.client.connect(guest.transport)]);
 const catalogs=await Promise.all([a.client.listTools(),b.client.listTools(),guest.client.listTools()]);
 assert.ok(catalogs[0].tools.length>0);assert.ok(catalogs[1].tools.length>0);
 assert.equal(catalogs[2].tools.length,0);
 }finally{await Promise.allSettled([a.client.close(),b.client.close(),guest.client.close()]);}
});
