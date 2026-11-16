import {test} from "node:test";
import assert from "node:assert/strict";
import {Client, InMemoryTransport} from "@modelcontextprotocol/client";
import {academyCatalog, ACADEMY_MODULES} from "../src/academy/catalog.ts";
import {regulatoryContext} from "../src/live/jurisdiction.ts";
import {createServer} from "../src/mcp/register.ts";
import {handleMcpRequest, PUBLIC_UNAUTHENTICATED} from "../api/mcp.ts";

test("international regulatory research always abstains from claiming TX permission", () => {
  for (const country of ["GR", "US", "DE", "UK", "FR", "JP", "AU"]) {
    const r = regulatoryContext({operating_country: country, frequency_mhz: 14.2, mode: "SSB",
      licence_class: "test class", operation_date: "2026-11-16", power_w: 100});
    assert.equal(r.permission_status, "INDETERMINATE");
    assert.equal(r.permission_assessed, false);
    assert.equal(r.operating_country, country === "UK" ? "GB" : country);
    assert.equal(r.operating_jurisdiction_used, "EXPLICIT_INPUT");
    assert.equal(r.authorities.international.force, "international_framework");
    assert.equal(r.authorities.regional.force, "nonbinding_operating_guidance");
    assert.equal(r.authorities.national.currentness_and_effective_date_verified, false);
    assert.doesNotMatch(JSON.stringify(r), /"permission_status":"ALLOWED"/);
  }
});

test("national-source research distinguishes partial, manual and unsupported jurisdictions", () => {
  assert.equal(regulatoryContext({operating_country: "GR"}).source_coverage, "PARTIAL_OFFICIAL_SOURCE_ADAPTER");
  assert.equal(regulatoryContext({operating_country: "US"}).source_coverage, "PARTIAL_OFFICIAL_SOURCE_ADAPTER");
  assert.equal(regulatoryContext({operating_country: "DE"}).source_coverage, "MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY");
  assert.equal(regulatoryContext({operating_country: "GB"}).source_coverage, "MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY");
  assert.equal(regulatoryContext({operating_country: "UK"}).operating_country, "GB");
  assert.equal(regulatoryContext({operating_country: "JP"}).source_coverage, "NO_COUNTRY_PACK");
  assert.equal(regulatoryContext({operating_country: "US"}).authorities.regional.iaru_region, "2");
  assert.equal(regulatoryContext({operating_country: "GR"}).authorities.regional.iaru_region, "1");
  assert.equal(regulatoryContext({operating_country: "JP"}).authorities.regional.iaru_region, null);
});

test("cross-border travel requires separate host-country verification", () => {
  const r = regulatoryContext({operating_country: "US", home_country: "GR",
    licence_class: "home-country class", frequency_mhz: 14.2, mode: "SSB", power_w: 10,
    operation_date: "2026-11-16"});
  assert.equal(r.station_context.visiting_operator, true);
  assert.ok(r.missing_or_unverified_evidence.includes("documented_host_country_visitor_privileges"));
  assert.equal(r.permission_status, "INDETERMINATE");
  assert.match(r.authorities.cross_border.note, /does not establish/);
});

test("country and operating-date validation fail without guessing", () => {
  assert.throws(() => regulatoryContext({operating_country:"GR;DROP"}), /two-letter/);
  assert.throws(() => regulatoryContext({operating_country:"GR",home_country:"XYZ"}), /two-letter/);
  assert.throws(() => regulatoryContext({operating_country:"GR",operation_date:"2026-02-30"}), /real YYYY/);
  assert.throws(() => regulatoryContext({operating_country:"GR",frequency_mhz:-10}), /positive/);
  assert.throws(() => regulatoryContext({operating_country:"GR",power_w:-2}), /nonnegative/);
});

test("Academy has nine international hobby modules without licence exam classes", () => {
  assert.equal(ACADEMY_MODULES.length, 9);
  assert.equal(new Set(ACADEMY_MODULES.map(m=>m.id)).size, 9);
  const en = academyCatalog({language:"en"});
  const el = academyCatalog({language:"el"});
  assert.equal(en.count, 9);
  assert.equal(el.count, 9);
  assert.equal(en.country_specific_licensing_or_exam_prep, false);
  assert.equal(el.learning_confers_operating_privileges, false);
  assert.ok(en.modules.every(m=>m.lessons.length === 3));
  assert.notEqual(en.modules[0].title, el.modules[0].title);
  assert.deepEqual(en.modules.map(m=>m.id), el.modules.map(m=>m.id));
  assert.ok(en.modules.every(m => !/license exam|licence exam|examination preparation/i.test(m.title)));
});

test("Academy lookup is deterministic and does not need location, callsign or licence", () => {
  const r=academyCatalog({language:"el",module_id:"morse-and-cw"});
  assert.equal(r.count,1);
  assert.equal(r.requested_module_found,true);
  assert.equal(r.modules[0].lessons.length,3);
  assert.equal(academyCatalog({language:"en",module_id:"no-such-module"}).requested_module_found,false);
});

test("real MCP SDK exposes both new offline read-only tools and enforces their structured contracts", async () => {
  const [clientEnd, serverEnd]=InMemoryTransport.createLinkedPair();
  const server=createServer();
  const client=new Client({name:"qrvai-international-contract-tests",version:"1.0.0"});
  try {
    await server.connect(serverEnd);
    await client.connect(clientEnd);
    const tools=(await client.listTools()).tools;
    assert.equal(tools.length,54);
    for(const name of ["regulatory_context","academy_catalog"]) {
      const tool=tools.find(t=>t.name===name);
      assert.ok(tool,name);
      assert.equal(tool.annotations?.readOnlyHint,true);
      assert.equal(tool.annotations?.destructiveHint,false);
      assert.equal(tool.annotations?.openWorldHint,false);
    }
    const legal=await client.callTool({name:"regulatory_context",arguments:{
      operating_country:"gr",home_country:"US",operation_date:"2026-11-16",
      licence_class:"unknown",frequency_mhz:7.1,mode:"CW",power_w:50
    }});
    assert.notEqual(legal.isError,true);
    assert.equal((legal.structuredContent as {permission_status:string}).permission_status,"INDETERMINATE");
    const academy=await client.callTool({name:"academy_catalog",arguments:{language:"el",module_id:"morse-and-cw"}});
    assert.notEqual(academy.isError,true);
    assert.equal((academy.structuredContent as {count:number}).count,1);
    const invalid=await client.callTool({name:"regulatory_context",arguments:{operating_country:"US",callsign:"K1ABC"}});
    assert.equal(invalid.isError,true);
  } finally {
    await client.close();
    await server.close();
  }
});

test("deployed handler defaults to fail-closed without a bearer secret", async () => {
  assert.equal(PUBLIC_UNAUTHENTICATED,false);
  const request=new Request("https://qrvai.example/api/mcp",{
    method:"POST",headers:{"content-type":"application/json"},body:"{}",
  });
  const response=await handleMcpRequest(request,undefined);
  assert.equal(response.status,503);
  assert.match(await response.text(),/authentication not configured/);
});
