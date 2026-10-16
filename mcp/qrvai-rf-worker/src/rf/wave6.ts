const str=(v:string,max=120)=>{if(typeof v!=="string"||v.length<1||v.length>max||!v.trim())throw new RangeError("invalid text");return v};
const freq=(v:number)=>{if(typeof v!=="number"||!Number.isFinite(v)||v<=0||v>1e12)throw new RangeError("invalid frequency");return v};
const call=(s:string)=>{if(!/^[A-Z0-9/]{3,16}$/i.test(str(s,16)))throw new RangeError("invalid callsign");return s.toUpperCase()};
const entity=(s:string)=>{if(!/^[A-Z0-9-]{1,8}$/i.test(str(s,8)))throw new RangeError("invalid entity");return s.toUpperCase()};
const uniq=(a:string[])=>{if(new Set(a).size!==a.length)throw new RangeError("duplicate values")};
const meta={provenance:"USER_SUPPLIED_UNVERIFIED" as const,verified:false as const};
export function stationGetProfile(x:{callsign:string;grid_square:string;antenna_note:string}){
 const profile={callsign:call(x.callsign),grid_square:str(x.grid_square,12),antenna_note:str(x.antenna_note,200)};
 return {profile,...meta,profile_connected:false as const,disclaimer:"Input only; no authenticated station profile retrieved",formula_revision:"M03-v1" as const};
}
export function stationReadStatus(x:{mode:"RX"|"TX"|"STANDBY";frequency_hz:number;status_note:string}){
 const status={mode:x.mode,frequency_hz:freq(x.frequency_hz),status_note:str(x.status_note,200)};
 if(!["RX","TX","STANDBY"].includes(status.mode))throw new RangeError("invalid mode");
 return {status,...meta,live_device_connected:false as const,disclaimer:"Only a user-supplied status snapshot; no live device connection or transmission",formula_revision:"M21-v1" as const};
}
export function spaceweatherIndices(x:{observed_at:string;kp_index:number;source_label:string}){
 const {observed_at,kp_index}=x;
 if(typeof observed_at!=="string"||observed_at.length>40||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(observed_at)||!Number.isFinite(Date.parse(observed_at)))throw new RangeError("invalid timestamp");
 if(typeof kp_index!=="number"||!Number.isFinite(kp_index)||kp_index<0||kp_index>9)throw new RangeError("invalid Kp");
 return {observed_at,kp_index,source_label:str(x.source_label,120),...meta,live_feed:false as const,disclaimer:"Kp supplied by user, NOT live space weather or validated provider data",formula_revision:"M23-v1" as const};
}
export function dxReceptionReports(x:{band:string;reports:{id:string;band:string;station:string;report:string}[]}){
 const band=str(x.band,12);
 if(!Array.isArray(x.reports)||x.reports.length>24)throw new RangeError("invalid report collection");
 const reports=x.reports.map(r=>({id:str(r.id,40),band:str(r.band,12),station:call(r.station),report:str(r.report,20)}));
 uniq(reports.map(r=>r.id));
 return {matches:reports.filter(r=>r.band===band),...meta,provider_authenticated:false as const,disclaimer:"User-supplied reports only; no DX cluster or third-party provider validation",formula_revision:"M27-v1" as const};
}
export function logAwardProgress(x:{target_entities:string[];confirmed_entities:string[]}){
 if(!Array.isArray(x.target_entities)||!Array.isArray(x.confirmed_entities)||x.target_entities.length>100||x.confirmed_entities.length>100)throw new RangeError("invalid award inputs");
 const target_entities=x.target_entities.map(entity),confirmed_entities=x.confirmed_entities.map(entity);uniq(target_entities);uniq(confirmed_entities);
 const confirmed=new Set(confirmed_entities);const matched=target_entities.filter(e=>confirmed.has(e)),missing_entities=target_entities.filter(e=>!confirmed.has(e));
 return {confirmed_count:matched.length,target_count:target_entities.length,missing_entities,...meta,award_certified:false as const,disclaimer:"User-supplied entity overlap only; no QSL validation, logbook connection or official award certification",formula_revision:"M32-v1" as const};
}
