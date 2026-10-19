/**
 * Execute only against a credentialed, protected Vercel preview.
 * Required: QRVAI_MCP_URL (absolute HTTPS URL ending /api/mcp),
 * QRVAI_MCP_BEARER_TOKEN (secret in caller's private environment).
 * This file never prints the URL's query, Authorization or any secret.
 */
import assert from "node:assert/strict";
import {Client} from "@modelcontextprotocol/client";
import {StreamableHTTPClientTransport} from "@modelcontextprotocol/client";

const urlText=process.env.QRVAI_MCP_URL;
const token=process.env.QRVAI_MCP_BEARER_TOKEN;
if (!urlText || !token || token.length<24) {
  throw new Error("HTTPS acceptance blocked: private URL and strong Bearer token required");
}
const url=new URL(urlText);
if (url.protocol!=="https:" || url.pathname!=="/api/mcp" || url.search || url.hash || url.username || url.password) {
  throw new Error("HTTPS acceptance blocked: expected clean HTTPS /api/mcp URL");
}
if (!url.hostname.endsWith(".vercel.app")) {
  throw new Error("HTTPS acceptance blocked: expected an exact protected Vercel preview hostname");
}
const expected=["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss"];
const headers={"content-type":"application/json","accept":"application/json, text/event-stream"};
const sample=JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/list",params:{}});
function ensureStatus(actual,wanted,label) {
  assert.equal(actual,wanted,`${label}: expected HTTP ${wanted}, received ${actual}`);
}
const noAuth=await fetch(url,{method:"POST",headers,body:sample,redirect:"error"});
ensureStatus(noAuth.status,401,"missing bearer");
const wrong=await fetch(url,{method:"POST",headers:{...headers,authorization:"Bearer not-the-preview-token"},body:sample,redirect:"error"});
ensureStatus(wrong.status,401,"invalid bearer");
const hostileOrigin=await fetch(url,{method:"POST",headers:{...headers,authorization:`Bearer ${token}`,origin:"https://attacker.invalid"},body:sample,redirect:"error"});
ensureStatus(hostileOrigin.status,403,"hostile Origin");
const tooLarge=await fetch(url,{method:"POST",headers:{...headers,authorization:`Bearer ${token}`},body:"x".repeat(65537),redirect:"error"});
ensureStatus(tooLarge.status,413,"oversized body");

const transport=new StreamableHTTPClientTransport(url,{
  requestInit:{headers:{authorization:`Bearer ${token}`}},
});
const client=new Client({name:"qrvai-https-acceptance",version:"0.1.0"});
try {
  await client.connect(transport);
  const list=await client.listTools();
  assert.deepEqual(list.tools.map(x=>x.name),expected);
  for (const tool of list.tools) {
    assert.equal(tool.annotations?.readOnlyHint,true,`${tool.name} must be read-only`);
  }
  const cases=[
    ["rf_power_convert",{value:100,unit:"W"},"dBm",50],
    ["rf_link_budget",{tx_w:1,tx_gain_dbi:0,tx_loss_db:0,path_loss_db:100,rx_gain_dbi:0,rx_loss_db:0,rx_sensitivity_dbm:-120},"rx_dbm",-70],
    ["rf_impedance",{r_ohm:50,x_ohm:0,z0_ohm:50},"gamma_magnitude",0],
    ["rf_feedline_loss",{profile:{id:"synthetic-coax",revision:"fixture-1",points:[{frequency_hz:10000000,loss_db_per_100m:4},{frequency_hz:1000000000,loss_db_per_100m:8}]},frequency_hz:100000000,length_m:20,connector_loss_db:0.5,interpolation_method:"log_frequency"},"attenuation_db",1.7],
  ];
  for (const [name,args,key,want] of cases) {
    const r=await client.callTool({name,arguments:args});
    assert.notEqual(r.isError,true,`${name} must not report error`);
    assert.ok(Math.abs(r.structuredContent?.[key]-want)<1e-9,`${name} numeric output mismatch`);
    console.log(`PASS tools/call ${name}`);
  }
  const missing=await client.callTool({name:"rf_nonexistent",arguments:{}});
  assert.equal(missing.isError,true,"unknown tool should reject");
  console.log("PASS initialize, tools/list, unauthorized/Origin/size matrix, four calls, unknown-tool rejection");
} finally {
  await client.close();
}
