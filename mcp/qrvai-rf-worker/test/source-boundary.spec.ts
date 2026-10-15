import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const root=fileURLToPath(new URL("../../../",import.meta.url));
const file=(path:string)=>resolve(root,path);

test("V0 Skills source stays unchanged and has no premature mcp.json",()=>{
  assert.equal(existsSync(file("qrvai/mcp.json")),false);
  for(const name of ["qrvai-core","qrvai-safety-regulations","qrvai-engineering-support","qrvai-operating-intelligence","qrvai-education-community"]){
    assert.equal(existsSync(file("qrvai/skills/"+name+"/SKILL.md")),true);
  }
});
test("only the three reviewed non-sensitive read-only RF tools",()=>{
  const source=readFileSync(file("mcp/qrvai-rf-worker/src/mcp/register.ts"),"utf8");
  assert.equal((source.match(/registerTool\(/g)||[]).length,3);
  assert.match(source,/rf_power_convert/);
  assert.match(source,/rf_link_budget/);
  assert.match(source,/rf_impedance/);
  assert.match(source,/readOnlyHint:\s*true/);
});
test("Cloudflare worker contains no paid bindings or secret deployment scripts",()=>{
  const config=JSON.parse(readFileSync(file("mcp/qrvai-rf-worker/wrangler.jsonc"),"utf8"));
  for(const key of ["kv_namespaces","d1_databases","durable_objects","ai","vars","r2_buckets","routes"]){
    assert.equal(Object.hasOwn(config,key),false,key);
  }
  const pkg=JSON.parse(readFileSync(file("mcp/qrvai-rf-worker/package.json"),"utf8"));
  assert.equal(Object.hasOwn(pkg.scripts,"deploy"),false);
  assert.equal(Object.hasOwn(pkg.scripts,"publish"),false);
  assert.ok(pkg.scripts["build:check"]?.includes("--dry-run"));
});
test("CI validates V0, type safety and Cloudflare Worker with read-only permissions",()=>{
  const yaml=readFileSync(file(".github/workflows/qrvai-rf-mcp-ci.yml"),"utf8");
  assert.match(yaml,/permissions:\s*\n\s+contents:\s*read/);
  assert.match(yaml,/node-version:\s*['"]22['"]/);
  assert.match(yaml,/npm ci/);
  assert.match(yaml,/npm run test:worker/);
  assert.match(yaml,/python -m unittest discover/);
  assert.match(yaml,/npm run build:check/);
  assert.doesNotMatch(yaml,/CLOUDFLARE_API_TOKEN|wrangler deploy(?!.*--dry-run)/);
});
test("numerical fixtures and owner-facing source README exist",()=>{
  assert.equal(existsSync(file("qa/mcp/rf-power-fixtures.json")),true);
  assert.equal(existsSync(file("mcp/qrvai-rf-worker/README.md")),true);
});


test("Cloudflare Free runbook makes public/anonymous and quota gates explicit",()=>{
  const contents=readFileSync(file("docs/runbooks/qrvai-rf-mcp-cloudflare-free-preflight.md"),"utf8");
  assert.match(contents,/100,000/);
  assert.match(contents,/10 ms/);
  assert.match(contents,/anonymous|unauthenticated/i);
  assert.match(contents,/separat(e|ely) (owner )?approv/i);
  assert.match(contents,/NOT_EXECUTED|BLOCKED/);
  assert.match(contents,/Origin|Host/);
});
test("host report cannot pretend successful account installation",()=>{
  const report=JSON.parse(readFileSync(file("qa/mcp/host-report.example.json"),"utf8"));
  assert.equal(report.status,"NOT_EXECUTED");
  assert.equal(report.freshPluginCreateAuthorized.passed,false);
  assert.equal(report.hostInvocationObserved.passed,false);
  assert.equal(existsSync(file("qrvai/mcp.json")),false);
});


test("review: MCP CI remains active for future source merges into main",()=>{
  const yaml=readFileSync(file(".github/workflows/qrvai-rf-mcp-ci.yml"),"utf8");
  assert.match(yaml,/push:\s*\n\s+branches:\s*\n\s+- main(?:\n|$)/);
});
