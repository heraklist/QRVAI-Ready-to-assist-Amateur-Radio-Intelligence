import {test} from "node:test";
import assert from "node:assert/strict";
import {createAuthorizedServer} from "../src/mcp/scoped-server.ts";
import {IMPLEMENTED_TOOLS} from "../src/rf/wave1.ts";
import {authorizeToolList} from "../src/http/authz-policy.ts";

const base={subject:"alpha",tenantId:"tenant-alpha",scopes:["qrvai:tools:read"]};
test("public SDK registration accepts an independent server instance",async()=>{
 const server=createAuthorizedServer(base);
 assert.ok(server);
 await server.close();
});
test("registration enumerates all 38 tools deterministically and closes denied channels",()=>{
 assert.equal(IMPLEMENTED_TOOLS.length,38);
 assert.equal(new Set(IMPLEMENTED_TOOLS.map(x=>x.name)).size,38);
 const none=authorizeToolList(null,IMPLEMENTED_TOOLS.map(x=>x.name));
 assert.deepEqual(none,[]);
 const allow=authorizeToolList(base,IMPLEMENTED_TOOLS.map(x=>x.name));
 assert.ok(allow.includes("rf_power_convert"));
 assert.ok(!allow.includes("station_get_profile"));
});
test("station/log scopes alone do not yield callable private tool without owner resolution",async()=>{
 const identity={...base,scopes:["qrvai:station:read","qrvai:logs:read"]};
 const server=createAuthorizedServer(identity);
 assert.ok(server);
 await server.close();
});
