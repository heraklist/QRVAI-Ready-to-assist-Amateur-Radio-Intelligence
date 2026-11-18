import {test} from "node:test";
import assert from "node:assert/strict";
import {defineUsage,evaluateUsage} from "../src/http/usage-policy.ts";
import {IMPLEMENTED_TOOLS} from "../src/rf/wave1.ts";
import {LIVE_TOOLS} from "../src/live/tools.ts";
const principal={subject:"synthetic-principal",tenantId:"synthetic-tenant",scopes:["qrvai:tools:read"]};
const sample={requests_in_minute:0,weighted_units_in_day:0,active_concurrency:0};
const caps={max_requests_in_minute:5,max_weighted_units_in_day:10,max_concurrency:2};
test("every registered tool has one estimated budget class, but no billable action",()=>{
  const tools=[...IMPLEMENTED_TOOLS,...LIVE_TOOLS];
  assert.equal(tools.length,54);
  assert.equal(new Set(tools.map(t=>t.name)).size,54);
  for(const t of tools){
    const d=defineUsage(t.name);
    assert.ok(d,t.name);
    assert.equal(d.chargeable_now,false);
    assert.ok(["offline","external_data","private_resource"].includes(d.usage_class));
    assert.ok([1,3,5].includes(d.budget_weight));
  }
  assert.equal(defineUsage("unregistered"),null);
});
test("offline hobby content has lower scheduling weight than external provider calls",()=>{
  const academy=defineUsage("academy_catalog");
  const external=defineUsage("regulation_text");
  assert.equal(academy?.usage_class,"offline");
  assert.equal(external?.usage_class,"external_data");
  assert.ok((external?.budget_weight??0)>(academy?.budget_weight??0));
  assert.equal(evaluateUsage(principal,"academy_catalog",sample,caps).allowed,true);
  assert.equal(evaluateUsage(principal,"space_weather_now",sample,caps).allowed,true);
});
test("denies exhausted per-minute/day/concurrency budgets before expensive calls",()=>{
  assert.equal(evaluateUsage(principal,"academy_catalog",{...sample,requests_in_minute:5},caps).reason,"REQUEST_RATE");
  assert.equal(evaluateUsage(principal,"regulation_text",{...sample,weighted_units_in_day:6},caps).reason,"DAY_WEIGHTED_BUDGET");
  assert.equal(evaluateUsage(principal,"academy_catalog",{...sample,active_concurrency:2},caps).reason,"CONCURRENCY");
  assert.equal(evaluateUsage(principal,"academy_catalog",{...sample,weighted_units_in_day:-1},caps).reason,"INVALID_USAGE_SNAPSHOT");
});
test("unknown, unauthenticated, unscoped and private-resource requests are blocked",()=>{
  assert.equal(evaluateUsage(principal,"not-a-tool",sample,caps).reason,"UNKNOWN_TOOL");
  assert.equal(evaluateUsage(null,"academy_catalog",sample,caps).reason,"UNAUTHENTICATED_OR_FORBIDDEN");
  assert.equal(evaluateUsage({...principal,scopes:[]},"academy_catalog",sample,caps).reason,"UNAUTHENTICATED_OR_FORBIDDEN");
  assert.equal(evaluateUsage(principal,"station_get_profile",sample,caps).reason,"UNAUTHENTICATED_OR_FORBIDDEN");
});
test("quotas are not prices, usage weights are not real costs and no personal data is emitted",()=>{
  const x=evaluateUsage(principal,"academy_catalog",sample,caps);
  assert.equal(x.reason,"OK");
  assert.equal(x.next_weighted_units_in_day,1);
  assert.equal(x.definition?.chargeable_now,false);
  assert.doesNotMatch(JSON.stringify(x),/synthetic-principal|synthetic-tenant|price|currency|card/);
});
