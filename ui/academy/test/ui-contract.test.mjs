import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const app=readFileSync(new URL("../app.mjs",import.meta.url),"utf8");

test("offline Academy HTML includes both languages and accessible interactions",()=>{
  assert.match(html,/<html lang="en">/);
  for(const id of ["language","level","query","module-list","module-count","detail","page-title","tagline","search-label","level-label","safety","footer"]){
    assert.match(html,new RegExp('id="'+id+'"'));
  }
  assert.match(html,/<option value="en">English<\/option>/);
  assert.match(html,/<option value="el">Ελληνικά<\/option>/);
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/href="#main"/);
  assert.match(html,/@media\(max-width:740px\)/);
  assert.match(html,/prefers-reduced-motion/);
});
test("Academy user interactions do not fetch or persist user data",()=>{
  assert.doesNotMatch(app,/\bfetch\s*\(/);
  assert.doesNotMatch(app,/XMLHttpRequest|localStorage|sessionStorage|navigator\.geolocation|navigator\.mediaDevices/);
  assert.doesNotMatch(html,/src="https?:|href="https?:|action="https?:/);
  assert.doesNotMatch(app,/\.innerHTML\s*=/);
  assert.match(app,/\.textContent\s*=/);
  assert.match(app,/setAttribute\("aria-pressed"/);
  assert.match(app,/language\.addEventListener\("change"/);
  assert.match(html,/TRAINING ONLY/);
});
