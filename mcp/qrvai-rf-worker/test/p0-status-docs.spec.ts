import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";

const root=fileURLToPath(new URL("../../../",import.meta.url));
const read=(path:string)=>readFileSync(resolve(root,path),"utf8");

test("P0 current docs distinguish 38 draft source methods from five V0 Skills and host activation",()=>{
 const rootReadme=read("README.md");
 const index=read("docs/README.md");
 for(const [name,value] of [["README.md",rootReadme],["docs/README.md",index]] as const){
  assert.match(value,/Current development status \(2026-10-17\)/,name);
  for(const claim of ["38 source-registered","Draft","Vercel-only","five V0 Skills","NOT CONNECTED"]){
   assert.ok(value.includes(claim),name+" missing dated state marker "+claim);
  }
 }
 assert.doesNotMatch(rootReadme.slice(0,650),/four read-only RF MCP tools/i);
 assert.doesNotMatch(index,/34 are still unimplemented/i);
});

test("P0 historic ADR has dated source-status addendum and does not claim a shipped plugin",()=>{
 const text=read("docs/architecture/ADR-0002-first-fresh-mcp-private-release.md");
 assert.ok(text.includes("2026-10-17 source status addendum"));
 assert.ok(text.includes("38 source-registered"));
 assert.match(text,/2026-10-15/);
 assert.ok(text.includes("not a production release"));
});

test("P0 V0 workflow reruns on the same final qa/mcp evidence commit",()=>{
 const workflow=read(".github/workflows/v0-ci.yml");
 assert.ok(workflow.includes("'qa/mcp/**'"));
 assert.ok(workflow.includes("Audit Skills and build clean draft archive"));
});
