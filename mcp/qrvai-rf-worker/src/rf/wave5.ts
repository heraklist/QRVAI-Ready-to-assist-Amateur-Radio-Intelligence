const text=(s:string,max:number)=>{if(typeof s!=="string"||s.length<1||s.length>max||!s.trim())throw new RangeError("invalid input text");return s};
const finite=(n:number)=>{if(typeof n!=="number"||!Number.isFinite(n))throw new RangeError("nonfinite value");return n};
const points=<T>(a:T[],max=32)=>{if(!Array.isArray(a)||a.length<1||a.length>max)throw new RangeError("invalid sample count");return a};
export function measurementsInspectTrace(x:{samples:{frequency_hz:number;magnitude_db:number}[]}){
 const samples=points(x.samples).map(s=>({frequency_hz:finite(s.frequency_hz),magnitude_db:finite(s.magnitude_db)}));
 for(const s of samples)if(s.frequency_hz<=0||s.frequency_hz>1e12||Math.abs(s.magnitude_db)>500)throw new RangeError("invalid RF trace");
 const deepest=samples.reduce((a,b)=>b.magnitude_db<a.magnitude_db?b:a);
 return {sample_count:samples.length,minimum_db:deepest.magnitude_db,maximum_db:Math.max(...samples.map(s=>s.magnitude_db)),deepest_dip_frequency_hz:deepest.frequency_hz,instrument_connected:false as const,disclaimer:"User supplied trace only; no calibration or instrument verification",formula_revision:"M15-v1" as const};
}
export function sdrInspectIq(x:{samples:{i:number;q:number}[]}){
 const samples=points(x.samples).map(s=>({i:finite(s.i),q:finite(s.q)}));
 const powers=samples.map(s=>s.i*s.i+s.q*s.q);if(powers.some(x=>!Number.isFinite(x)||x>1e12))throw new RangeError("IQ magnitude too large");
 return {sample_count:samples.length,mean_power:powers.reduce((a,b)=>a+b,0)/samples.length,peak_magnitude:Math.sqrt(Math.max(...powers)),device_connected:false as const,disclaimer:"User supplied IQ samples only; no RF hardware or signal authenticity verified",formula_revision:"M16-v1" as const};
}
export function manualAnswerCited(x:{question:string;excerpts:{id:string;text:string}[]}){
 const q=text(x.question,80).toLowerCase();
 if(!Array.isArray(x.excerpts)||x.excerpts.length>24)throw new RangeError("invalid excerpts");
 const excerpts=x.excerpts.map(e=>({id:text(e.id,40),text:text(e.text,2000)}));
 if(new Set(excerpts.map(e=>e.id)).size!==excerpts.length)throw new RangeError("duplicate source IDs");
 const matches=excerpts.filter(e=>e.text.toLowerCase().includes(q));
 const citations=matches.map(e=>({id:e.id,excerpt:e.text}));
 return {answered:citations.length>0,citations,answer:citations.length?citations[0].excerpt:"Insufficient user-provided evidence.",external_retrieval:false as const,disclaimer:"Exact user-supplied excerpts only, not independently verified; not a generated technical conclusion",formula_revision:"M18-v1" as const};
}
export function equipmentDiagnose(x:{symptom:"no_receive_audio"|"high_swr_reading"|"unstable_power"}){
 const steps=x.symptom==="no_receive_audio"?["Check volume and squelch settings without transmitting","Confirm receive mode and user settings","Consult the manufacturer's official manual before service"]:x.symptom==="high_swr_reading"?["Stop transmitting until equipment and antenna system are checked","Inspect external cable and antenna connectors with power disconnected","Seek qualified help and verify safe measurement methods"]:x.symptom==="unstable_power"?["Power down and disconnect before any inspection","Verify external supply rating against the manufacturer's manual","Ask a qualified technician to inspect persistent faults"]:null;
 if(!steps)throw new RangeError("unknown symptom");
 return {symptom:x.symptom,steps,repair_certified:false as const,disclaimer:"Non-invasive educational checklist; no repair certification, hazardous internal work or transmit instruction",formula_revision:"M19-v1" as const};
}
export function adifValidate(x:{adif:string}){
 const adif=text(x.adif,4096);
 const fields:string[]=[];let records=0;let pos=0;let valid=true;
 while(pos<adif.length){
   while(pos<adif.length&&/\s/.test(adif[pos]))pos++;
   if(pos===adif.length)break;
   if(adif[pos]!=="<"){valid=false;break;}
   const end=adif.indexOf(">",pos+1);if(end<0){valid=false;break;}
   const header=adif.slice(pos+1,end).trim();pos=end+1;
   if(/^EOH$/i.test(header))continue;
   if(/^EOR$/i.test(header)){records++;continue;}
   const m=/^([A-Za-z][A-Za-z0-9_]*):(\d{1,4})(?::[A-Za-z])?$/.exec(header);
   if(!m){valid=false;break;}
   const length=Number(m[2]);if(length>1024||pos+length>adif.length){valid=false;break;}
   const value=adif.slice(pos,pos+length);
   if(value.includes("<")){valid=false;break;}
   pos+=length;fields.push(m[1].toUpperCase());
 }
 if(!records)valid=false;
 return {valid,records:valid?records:0,fields:valid?fields:[],saved:false as const,disclaimer:"Bounded user-supplied ADIF grammar preview; not full ADIF specification compliance or persistent log processing",formula_revision:"M31-v1" as const};
}
