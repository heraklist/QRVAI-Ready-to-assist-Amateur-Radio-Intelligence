import {test} from "node:test";
import assert from "node:assert/strict";
import {ACADEMY_MODULES as canonicalModules} from "../../../mcp/qrvai-rf-worker/src/academy/catalog.ts";
import {ACADEMY_LESSONS as canonicalLessons} from "../../../mcp/qrvai-rf-worker/src/academy/lessons.ts";
import {ACADEMY_MODULES as browserModules,ACADEMY_LESSONS as browserLessons,LESSON_BY_ID,TRAINING_ONLY} from "../data.mjs";

test("static Academy bundle matches canonical server catalogue exactly",()=>{
  assert.deepEqual(browserModules,canonicalModules);
  assert.equal(browserModules.length,9);
  assert.equal(TRAINING_ONLY,true);
});
test("offline Academy browser content has complete canonical micro-lesson parity",()=>{
  assert.deepEqual(browserLessons,canonicalLessons);
  assert.equal(browserLessons.length,27);
  assert.equal(LESSON_BY_ID.size,27);
  const expectedIds=canonicalModules.flatMap(m=>m.lessons.map((_,i)=>m.id+"-"+(i+1)));
  assert.deepEqual(browserLessons.map(l=>l.id),expectedIds);
  for(const l of browserLessons){
    assert.equal(LESSON_BY_ID.get(l.id),l);
    for(const language of ["en","el"]){
      assert.ok(l.explanation[language].length>40);
      assert.ok(l.practice[language].length>20);
      assert.ok(l.answer[language].length>5);
    }
  }
});
