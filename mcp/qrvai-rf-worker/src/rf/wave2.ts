import {powerAutonomy} from "./wave1.ts";
const id=(s:string)=>{if(typeof s!=="string"||!/^[a-zA-Z0-9_-]{1,32}$/.test(s))throw new RangeError("invalid identifier");return s;};
const count=(n:number,max:number)=>{if(!Number.isInteger(n)||n<0||n>max)throw new RangeError("invalid integer count");return n;};
const array=(x:unknown,max:number)=>{if(!Array.isArray(x)||x.length>max)throw new RangeError("invalid array");return x;};
export function stationSignalPath(x:{devices:{id:string;kind:string}[];connections:{from:string;to:string}[]}){
 const devices=array(x.devices,16).map(d=>({id:id(d.id),kind:id(d.kind)}));if(devices.length===0)throw new RangeError("no devices");const ids=new Set(devices.map(d=>d.id));if(ids.size!==devices.length)throw new RangeError("duplicate device");
 const edges=array(x.connections,32).map(e=>({from:id(e.from),to:id(e.to)}));for(const e of edges){if(!ids.has(e.from)||!ids.has(e.to)||e.from===e.to)throw new RangeError("invalid edge");}
 const state=new Map<string,number>();const walk=(node:string)=>{if(state.get(node)===1)throw new RangeError("cycle");if(state.get(node)===2)return;state.set(node,1);for(const e of edges)if(e.from===node)walk(e.to);state.set(node,2);};for(const d of devices)walk(d.id);
 return {nodes:devices,edges,verified:false,warnings:["User-supplied topology only; electrical, mechanical and RF compatibility NOT VERIFIED"],formula_revision:"M20-v1"} as const;
}
export function packetRoutePreview(x:{protocol:"AX25"|"APRS";path:string[]}){
 if(x.protocol!=="AX25"&&x.protocol!=="APRS")throw new RangeError("unsupported protocol");
 const path=array(x.path,8).map(id);if(path.length<2||new Set(path).size!==path.length)throw new RangeError("path must have 2-8 unique nodes");
 return {protocol:x.protocol,hops:path.slice(1).map((to,i)=>({from:path[i]!,to})),hop_count:path.length-1,simulated:true,assumptions:"Illustrative packet path only; no packet sending, route validation or live network discovery",formula_revision:"M29-v1"} as const;
}
export function emcommDrill(x:{scenario:"power_outage"|"repeater_unavailable";roles:string[]}){
 if(!["power_outage","repeater_unavailable"].includes(x.scenario))throw new RangeError("unsupported scenario");const roles=array(x.roles,8).map(id);if(roles.length===0||new Set(roles).size!==roles.length)throw new RangeError("invalid roles");
 const exercise_steps=x.scenario==="power_outage"?["Simulate loss of mains electricity on paper","Estimate station battery runtime without transmitting","Debrief and record training observations"]:["Simulate a hypothetical unavailable repeater","Draw alternate contact paths without transmitting","Debrief and record training observations"];
 return {scenario:x.scenario,roles,exercise_steps,simulated:true,disclaimer:"TRAINING ONLY: no dispatch, field instructions, activation or emergency-service coordination",formula_revision:"M34-v1"} as const;
}
export function emcommReadiness(x:{battery_wh:number;average_load_w:number;usable_fraction:number;participants:number;required_roles:number}){
 const runtime=powerAutonomy({battery_wh:x.battery_wh,average_load_w:x.average_load_w,usable_fraction:x.usable_fraction}).runtime_h;
 const participants=count(x.participants,100),required=count(x.required_roles,100);
 return {estimated_runtime_h:runtime,staffing_gap:Math.max(0,required-participants),simulated:true,disclaimer:"Hypothetical staffing and energy arithmetic; not a readiness certification",formula_revision:"M35-v1"} as const;
}
export function academyExercise(x:{topic:"rf_power"|"antenna_basics";locale:"el"|"en";answer_index?:number}){
 if(x.topic!=="rf_power"&&x.topic!=="antenna_basics")throw new RangeError("unsupported topic");
 if(x.locale!=="el"&&x.locale!=="en")throw new RangeError("unsupported locale");
 const isGreek=x.locale==="el",isAnt=x.topic==="antenna_basics";
 const question=isAnt?(isGreek?"Ποιο είναι περίπου το συνολικό μήκος ενός διπόλου μισού κύματος;":"What is the approximate total length of a half-wave dipole?"):(isGreek?"Πόσα dBm αντιστοιχούν σε 1 W;":"How many dBm equal 1 W?");
 const options=isAnt?(isGreek?["Μήκος κύματος / 2","2 μήκη κύματος","Μήκος κύματος / 10"]:["Wavelength / 2","2 wavelengths","Wavelength / 10"]):(isGreek?["0 dBm","30 dBm","60 dBm"]:["0 dBm","30 dBm","60 dBm"]);
 if(x.answer_index!==undefined&&(!Number.isInteger(x.answer_index)||x.answer_index<0||x.answer_index>2))throw new RangeError("invalid answer");
 return {topic:x.topic,locale:x.locale,question,options,...(x.answer_index===undefined?{}:{correct:x.answer_index===(isAnt?0:1)}),formula_revision:"M36-v1",disclaimer:"Fixed educational example; not an official licensing examination"} as const;
}
