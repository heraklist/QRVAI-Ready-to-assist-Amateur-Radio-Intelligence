const token=(s:string,label:string)=>{if(typeof s!=="string"||! /^[A-Za-z0-9_][A-Za-z0-9_ .-]{0,63}$/.test(s))throw new RangeError("Invalid "+label);return s;};
const integer=(n:number,min:number,max:number,label:string)=>{if(!Number.isInteger(n)||n<min||n>max)throw new RangeError("Invalid "+label);return n;};
const finite=(n:number,label:string)=>{if(typeof n!=="number"||!Number.isFinite(n))throw new RangeError("Invalid "+label);return n;};
export function digitalSetupGuide(x:{rig:string;software:string;os:"linux"|"windows"|"macos"}){
 const rig=token(x.rig,"rig"),software=token(x.software,"software");
 if(!["linux","windows","macos"].includes(x.os))throw new RangeError("Unsupported OS");
 return {rig,software,os:x.os,steps:["Confirm the radio is powered OFF before connecting cables","Read manufacturer-specific radio and interface manuals for approved audio/CAT connections","Configure generic port permissions and sample-rate agreement according to trusted manuals","Perform receive-only dry-run; do not key PTT or send control commands"],manual_citations:[] as string[],verified_for_device:false,warnings:["UNVERIFIED generic steps; no manufacturer, firmware or software version data was fetched"],formula_revision:"M28-v1"} as const;
}
export function repeaterChannelPreview(x:{frequency_hz:number;offset_hz:number;tone_hz:number}){
 const rx=finite(x.frequency_hz,"frequency"),offset=finite(x.offset_hz,"offset"),tone=finite(x.tone_hz,"tone");
 if(rx<100_000||rx>10_000_000_000||Math.abs(offset)>100_000_000||tone<0||tone>300)throw new RangeError("Out of bounds");
 const tx=rx+offset;if(!Number.isSafeInteger(tx)||tx<=0||!Number.isSafeInteger(rx)||!Number.isSafeInteger(offset))throw new RangeError("Invalid TX frequency");
 return {rx_frequency_hz:rx,tx_frequency_hz:tx,offset_hz:offset,tone_hz:tone,verified_directory:false,programmed:false,warnings:["Only user-supplied hypothetical channel parameters; check local regulatory authorizations and independently verify repeater data"],formula_revision:"M30-v1"} as const;
}
export function contestPlan(x:{event_name:string;start_utc:string;duration_minutes:number}){
 const event_name=token(x.event_name,"event"),mins=integer(x.duration_minutes,30,1440,"duration");if(typeof x.start_utc!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(x.start_utc))throw new RangeError("UTC timestamp required");
 const start=Date.parse(x.start_utc);if(!Number.isFinite(start)||new Date(start).toISOString().slice(0,19)+"Z"!==x.start_utc)throw new RangeError("Invalid UTC timestamp");
 const boundaries=[0,Math.floor(mins/3),Math.floor(mins*2/3),mins],phases=["Preparation and rules self-check","Receive-only equipment check / operator rest","Operator debrief and log self-review"];
 const blocks=phases.map((activity,i)=>({start_utc:new Date(start+boundaries[i]!*60_000).toISOString(),end_utc:new Date(start+boundaries[i+1]!*60_000).toISOString(),activity}));
 return {event_name,blocks,rules_verified:false,warnings:["Illustrative time boxes only: does not validate actual contest dates, rules or on-air permissions"],formula_revision:"M33-v1"} as const;
}
export function makerProjectReview(x:{goal:string;components:{name:string;quantity:number}[]}){
 const goal=token(x.goal,"goal");if(!Array.isArray(x.components)||x.components.length<1||x.components.length>24)throw new RangeError("Invalid BOM length");
 const components=x.components.map(c=>({name:token(c.name,"component"),quantity:integer(c.quantity,1,1000,"quantity")}));if(new Set(components.map(c=>c.name.toLowerCase())).size!==components.length)throw new RangeError("Duplicate BOM component");
 const component_count=components.reduce((sum,c)=>sum+c.quantity,0);
 return {goal,components,component_count,verified_safe:false,test_plan:["Keep all electrical power off during initial assembly review","Check wiring, mechanical strain relief and insulation against verified component datasheets","Do not transmit or energize before a qualified review and applicable tests"],warnings:["BOM is unverified user input; no electrical ratings, design conformity or safety certification"],formula_revision:"M37-v1"} as const;
}
export function clubWorkshopPlan(x:{topic:string;participants:number;locale:"el"|"en"}){
 const topic=token(x.topic,"topic"),participants=integer(x.participants,1,100,"participants");if(x.locale!=="el"&&x.locale!=="en")throw new RangeError("Invalid locale");
 const agenda=x.locale==="el"?["Εισαγωγή και στόχοι","Θεωρητική παρουσίαση και ασφαλής επίδειξη χωρίς εκπομπή","Ερωτήσεις, ανακεφαλαίωση και αξιολόγηση"]:["Introduction and learning objectives","Theory and non-transmitting, safety-first demonstration","Questions, recap and learning check"];
 return {topic,participants,locale:x.locale,agenda,materials:["Whiteboard and printed public-domain learning notes","Receive-only sample diagrams"],club_inventory_accessed:false,privacy_notes:["Do not provide attendance lists, individual identities or private club inventories"],formula_revision:"M38-v1"} as const;
}
