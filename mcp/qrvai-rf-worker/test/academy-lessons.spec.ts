import {test} from "node:test";
import assert from "node:assert/strict";
import {ACADEMY_LESSONS,academyLesson} from "../src/academy/lessons.ts";
import {ACADEMY_MODULES,academyCatalog} from "../src/academy/catalog.ts";
import {Client,InMemoryTransport} from "@modelcontextprotocol/client";
import {createServer} from "../src/mcp/register.ts";
test("all 27 catalog lesson IDs have original EN/EL training text and safe practice",()=>{
  const ids=ACADEMY_MODULES.flatMap(m=>m.lessons.map((_,i)=>m.id+"-"+(i+1)));
  assert.equal(ids.length,27);
  assert.equal(ACADEMY_LESSONS.length,27);
  assert.equal(new Set(ACADEMY_LESSONS.map(l=>l.id)).size,27);
  assert.deepEqual(ACADEMY_LESSONS.map(l=>l.id),ids);
  const kinds=new Set(["CALCULATION","RECEIVE_ONLY","SIMULATION_ONLY","SAFETY_DESK_CHECK"]);
  for(const id of ids){
    const en=academyLesson(id,"en"), el=academyLesson(id,"el");
    assert.ok(en&&el,id);
    assert.ok(kinds.has(en.practice_kind));
    for(const x of [en,el]){
      assert.ok(x.explanation.length>50,id);
      assert.ok(x.practical_activity.length>20,id);
      assert.ok(x.self_check_answer.length>5,id);
      assert.equal(x.training_only,true);
      assert.equal(x.transmission_required,false);
      assert.equal(x.country_licence_exam_prep,false);
      assert.equal(x.session_data_collected,false);
    }
    assert.notEqual(en.explanation,el.explanation);
  }
  assert.equal(academyLesson("not-real-1","en"),null);
});
test("catalog returns a selected, in-scope lesson and fails safely on mismatch",()=>{
  const selected=academyCatalog({language:"el",module_id:"morse-and-cw",lesson_id:"morse-and-cw-1"});
  assert.equal(selected.count,1);
  assert.equal(selected.authored_micro_lessons_count,27);
  assert.equal(selected.selected_lesson?.lesson_id,"morse-and-cw-1");
  assert.equal(selected.requested_lesson_found,true);
  const mismatch=academyCatalog({language:"en",module_id:"propagation",lesson_id:"morse-and-cw-1"});
  assert.equal(mismatch.selected_lesson,null);
  assert.equal(mismatch.requested_lesson_found,false);
});
test("MCP SDK lists exactly 54 tools and delivers bilingual authored Academy micro-lesson",async()=>{
  const [c,s]=InMemoryTransport.createLinkedPair();
  const server=createServer(),client=new Client({name:"qrvai-academy-lesson-test",version:"1.0"});
  try{
    await server.connect(s); await client.connect(c);
    assert.equal((await client.listTools()).tools.length,54);
    const response=await client.callTool({name:"academy_catalog",arguments:{language:"en",lesson_id:"digital-modes-3"}});
    assert.notEqual(response.isError,true);
    const doc=response.structuredContent as {selected_lesson?:{lesson_id:string;transmission_required:boolean}};
    assert.equal(doc.selected_lesson?.lesson_id,"digital-modes-3");
    assert.equal(doc.selected_lesson?.transmission_required,false);
    const invalid=await client.callTool({name:"academy_catalog",arguments:{language:"en",lesson_id:"../../../etc/passwd"}});
    assert.equal(invalid.isError,true);
  }finally{await client.close();await server.close();}
});
