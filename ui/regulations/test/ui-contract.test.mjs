import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const app=readFileSync(new URL("../app.mjs",import.meta.url),"utf8");
test("official-source browser requires explicit operating country, visitor flag and safe bilingual status",()=>{
  for(const id of ["language","country","visitor","global-heading","national-heading","global","national","safety","footer"]){
    assert.match(html,new RegExp('id="'+id+'"'));
  }
  assert.match(html,/LEGAL RESEARCH ONLY/);
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/@media\(max-width:760px\)/);
  assert.match(html,/href="#main"/);
  assert.match(app,/INDETERMINATE/);
  assert.match(app,/ΑΠΡΟΣΔΙΟΡΙΣΤΟ/);
  assert.match(app,/if\(!pack\)/, "Unsupported country must take an explicit non-permission fallback");
  assert.doesNotMatch(app,/navigator\.geolocation|localStorage|sessionStorage|navigator\.userAgent/);
});
test("external source navigation is explicit HTTPS allowlist, not background requests",()=>{
  assert.doesNotMatch(app,/\bfetch\s*\(|XMLHttpRequest|\.innerHTML\s*=/);
  assert.match(app,/approvedHosts=new Set/);
  assert.match(app,/u\.protocol==="https:"/);
  assert.match(app,/\.rel="noopener noreferrer"/);
  assert.match(app,/\.target="_blank"/);
  assert.doesNotMatch(html,/src="https?:|href="https?:/);
});
