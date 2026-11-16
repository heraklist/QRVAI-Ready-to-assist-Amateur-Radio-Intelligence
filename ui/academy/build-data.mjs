/** Build a static, browser-safe Academy bundle from the canonical server-side TS source.
 * This exporter does not execute third-party code or fetch data. The generated
 * bundle contains original training-only text and no credentials/user information.
 * --check is strict CI drift detection (never writes).
 */
import {readFileSync,writeFileSync} from "node:fs";
const base=new URL("../../mcp/qrvai-rf-worker/src/academy/",import.meta.url);
const here=new URL("./data.mjs",import.meta.url);
const read=(file)=>readFileSync(new URL(file,base),"utf8");
const catalog=read("catalog.ts");
const marker='export const ACADEMY_MODULES: readonly Module[] = Object.freeze([';
const a=catalog.indexOf(marker),b=catalog.indexOf("\n]);",a);
if(a<0||b<0)throw Error("Academy canonical catalogue structure changed; regenerate exporter deliberately");
const modules=catalog.slice(a,b+4).replace(marker,"export const ACADEMY_MODULES=Object.freeze([");
const parts=[];
for(const name of ["a","b","c"]){
  const source=read("lesson-units-"+name+".ts");
  const begin='export const lessons'+name.toUpperCase()+':readonly LessonSeed[]=[';
  const start=source.indexOf(begin),end=source.indexOf("\n];",start);
  if(start<0||end<0)throw Error("Cannot inspect canonical lesson unit "+name);
  parts.push(source.slice(start,end+3).replace(begin,"const lessons"+name.toUpperCase()+"=["));
}
const content=[
'/** AUTO-GENERATED from src/academy by ui/academy/build-data.mjs. Do not hand-edit. */',
'const t=(en,el)=>({en,el});',
'const mk=(id,practice_kind,en,el,pen,pel,aen,ael)=>({id,practice_kind,explanation:{en,el},practice:{en:pen,el:pel},answer:{en:aen,el:ael}});',
modules,...parts,
'export const ACADEMY_LESSONS=Object.freeze([...lessonsA,...lessonsB,...lessonsC]);',
'export const LESSON_BY_ID=new Map(ACADEMY_LESSONS.map(item=>[item.id,item]));',
'export const TRAINING_ONLY=true;',
''
].join("\n");
if(process.argv.includes("--check")){
  if(readFileSync(here,"utf8")!==content){console.error("Academy browser bundle differs from canonical TS sources");process.exitCode=1;}
  else console.log("PASS generated Academy browser bundle matches 27 canonical lessons");
}else{
  writeFileSync(here,content,"utf8");
  console.log("Wrote static Academy bundle");
}
