import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {Client,InMemoryTransport} from "@modelcontextprotocol/client";
import {createServer} from "../src/mcp/register.ts";
import {IMPLEMENTED_TOOLS} from "../src/rf/wave1.ts";
import {classifyTool} from "../src/http/authz-policy.ts";

const root=fileURLToPath(new URL("../../../",import.meta.url));
const registryPath=resolve(root,"docs/architecture/mcp-implementation-register.md");
const sorted=(values:readonly string[])=>[...values].sort();
type PublicTool={name:string;inputSchema?:{properties?:Record<string,unknown>};outputSchema?:{properties?:Record<string,unknown>}};

async function listedTools(){
 const [clientSide,serverSide]=InMemoryTransport.createLinkedPair();
 const client=new Client({name:"qrvai-p0-contract-fixture",version:"0.1.0"});
 const server=createServer();
 try{
  await server.connect(serverSide);
  await client.connect(clientSide);
  return (await client.listTools()).tools as PublicTool[];
 }finally{
  await client.close();
  await server.close();
 }
}

test("P0 exactly maps 38 distinct M IDs to names, table rows and public SDK tools/list",async()=>{
 assert.equal(IMPLEMENTED_TOOLS.length,38);
 const ids=sorted(IMPLEMENTED_TOOLS.map(x=>x.candidate_id));
 assert.deepEqual(ids,Array.from({length:38},(_,i)=>"M"+String(i+1).padStart(2,"0")));
 const descriptorNames=IMPLEMENTED_TOOLS.map(x=>x.name);
 assert.equal(new Set(descriptorNames).size,38);
 assert.ok(descriptorNames.every(x=>classifyTool(x)!==null));
 const doc=readFileSync(registryPath,"utf8");
 const entries=[...doc.matchAll(/^\|\s*(M\d{2})\s*\|[^\n]*?\|\s*`([a-z0-9_]+)`\s*\|\s*$/gm)].map(x=>[x[1],x[2]]);
 assert.equal(entries.length,38,"implementation register must have exactly 38 ID/name rows");
 assert.deepEqual(sorted(entries.map(x=>x[0])),ids);
 assert.deepEqual(new Map(entries),new Map(IMPLEMENTED_TOOLS.map(x=>[x.candidate_id,x.name])));
 const tools=await listedTools();
 assert.equal(tools.length,38);
 assert.deepEqual(sorted(tools.map(x=>x.name)),sorted(descriptorNames));
});

test("P0 preserves ten competing-PR canonical input contracts and safety output markers",async()=>{
 const tools=new Map((await listedTools()).map(x=>[x.name,x]));
 const keys:Record<string,string[]>={
  digital_setup_guide:["mode","locale"],
  repeater_channel_preview:["rx_frequency_hz","offset_hz"],
  contest_plan:["slots"],
  maker_project_review:["project_name","supply_voltage_v","components"],
  club_workshop_plan:["topic","participants","duration_minutes"],
  measurements_inspect_trace:["samples"],
  sdr_inspect_iq:["samples"],
  equipment_diagnose:["symptom"],
  adif_validate:["adif"],
  log_award_progress:["target_entities","confirmed_entities"]
 };
 const safety:Record<string,string[]>={
  digital_setup_guide:["simulated"],
  repeater_channel_preview:["verified"],
  contest_plan:["official_schedule"],
  maker_project_review:["certified"],
  club_workshop_plan:["simulated"],
  measurements_inspect_trace:["instrument_connected"],
  sdr_inspect_iq:["device_connected"],
  equipment_diagnose:["repair_certified"],
  adif_validate:["saved"],
  log_award_progress:["verified","award_certified"]
 };
 for(const [name,inputs] of Object.entries(keys)){
  const tool=tools.get(name);
  assert.ok(tool,"missing SDK registered tool: "+name);
  assert.deepEqual(sorted(Object.keys(tool.inputSchema?.properties??{})),sorted(inputs),name+" input changed");
  for(const flag of safety[name]){
   assert.ok(Object.hasOwn(tool.outputSchema?.properties??{},flag),name+" missing output safety flag "+flag);
  }
 }
});
