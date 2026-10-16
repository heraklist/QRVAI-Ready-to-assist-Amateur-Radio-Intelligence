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
test("thirty-five approved stateless read-only RF/core and exercise tools",()=>{
  const source=readFileSync(file("mcp/qrvai-rf-worker/src/mcp/register.ts"),"utf8");
  assert.equal((source.match(/registerTool\(/g)||[]).length,35);
  assert.match(source,/rf_power_convert/);
  assert.match(source,/rf_link_budget/);
  assert.match(source,/rf_impedance/);
  assert.match(source,/rf_feedline_loss/);
  assert.match(source,/readOnlyHint:\s*true/);
});
test("Vercel-only MCP backend has no Cloudflare runtime or dependencies",()=>{
  const pkg=JSON.parse(readFileSync(file("mcp/qrvai-rf-worker/package.json"),"utf8"));
  assert.equal(Object.hasOwn(pkg.scripts,"build:check"),false);
  assert.equal(Object.hasOwn(pkg.scripts,"test:worker"),false);
  assert.equal(Object.hasOwn(pkg.dependencies,"agents"),false);
  assert.equal(existsSync(file("mcp/qrvai-rf-worker/wrangler.jsonc")),false);
  assert.equal(existsSync(file("mcp/qrvai-rf-worker/src/index.ts")),false);
});
test("CI validates V0, type safety and Vercel MCP with read-only permissions",()=>{
  const yaml=readFileSync(file(".github/workflows/qrvai-rf-mcp-ci.yml"),"utf8");
  assert.ok(yaml.includes("permissions:") && yaml.includes("contents: read"));
  assert.match(yaml,/node-version:\s*['"]22['"]/);
  assert.match(yaml,/npm ci/);
  assert.doesNotMatch(yaml,/npm run test:worker/);
  assert.match(yaml,/python -m unittest discover/);
  assert.doesNotMatch(yaml,/npm run build:check/);
  assert.doesNotMatch(yaml,/CLOUDFLARE_API_TOKEN|wrangler deploy(?!.*--dry-run)/);
});
test("numerical fixtures and owner-facing source README exist",()=>{
  assert.equal(existsSync(file("qa/mcp/rf-power-fixtures.json")),true);
  assert.equal(existsSync(file("mcp/qrvai-rf-worker/README.md")),true);
});


test("Vercel-only runbook documents secure MCP endpoint",()=>{
  const contents=readFileSync(file("docs/runbooks/qrvai-rf-mcp-vercel.md"),"utf8");
  assert.match(contents,/Bearer/);
  assert.match(contents,/NOT_DEPLOYED|NOT VERIFIED/);
  assert.match(contents,/Vercel/);
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
  assert.ok(yaml.includes("push:") && yaml.includes("- main"));
});

test("Vercel deployment includes typed MCP source modules needed by runtime",()=>{
  const config=JSON.parse(readFileSync(file("mcp/qrvai-rf-worker/vercel.json"),"utf8"));
  assert.equal(config.functions["api/mcp.ts"].includeFiles,"src/**/*");
});
