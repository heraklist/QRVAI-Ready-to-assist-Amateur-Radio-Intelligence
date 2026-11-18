const identifier=(s:string)=>{if(typeof s!=="string"||!/^[a-zA-Z0-9_ -]{1,48}$/.test(s)||!s.trim())throw new RangeError("invalid text");return s.trim()};
const positive=(n:number,max:number)=>{if(typeof n!=="number"||!Number.isFinite(n)||n<=0||n>max)throw new RangeError("invalid positive number");return n};
export function digitalSetupGuide(x:{mode:"FT8"|"APRS";locale:"el"|"en"}){
 if(x.mode!=="FT8"&&x.mode!=="APRS")throw new RangeError("unsupported mode");
 if(x.locale!=="el"&&x.locale!=="en")throw new RangeError("unsupported locale");
 const el=x.locale==="el";
 const steps=x.mode==="FT8"?(el?["Μελέτησε τη λήψη και το φάσμα στο εγχειρίδιο","Σύνδεσε δοκιμαστική είσοδο ήχου χωρίς εκπομπή","Επιβεβαίωσε αποκωδικοποίηση υποθετικών δειγμάτων"]:["Review receive-only documentation","Select simulated audio input without transmitting","Verify a sample decoded message"]):(el?["Μελέτησε τη μορφή πλαισίου APRS","Προσομοίωσε δοκιμαστική διαδρομή χωρίς RF","Εξήγησε περιορισμούς και έλεγξε την εγκυρότητα των δεδομένων"]:["Review APRS frame structure","Simulate a packet path without RF","Inspect assumptions and source data"]);
 return {mode:x.mode,locale:x.locale,steps,simulated:true,disclaimer:"Educational receive-only or simulated workflow; no RF activation or device-specific setup",formula_revision:"M28-v1"} as const;
}
export function repeaterChannelPreview(x:{rx_frequency_hz:number;offset_hz:number}){
 const rx=positive(x.rx_frequency_hz,1e12),off=x.offset_hz;
 if(typeof off!=="number"||!Number.isFinite(off)||Math.abs(off)>1e10)throw new RangeError("invalid offset");
 const tx=rx+off;positive(tx,1e12);
 return {rx_frequency_hz:rx,tx_frequency_hz:tx,offset_hz:off,verified:false,disclaimer:"Hypothetical user-supplied arithmetic; no repeater existence, band permissions or transmit authorization",formula_revision:"M30-v1"} as const;
}
export function contestPlan(x:{slots:{utc:string;band:string}[]}){
 if(!Array.isArray(x.slots)||x.slots.length<1||x.slots.length>24)throw new RangeError("invalid slots");
 const slots=x.slots.map(s=>{if(typeof s.utc!=="string"||!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(s.utc))throw new RangeError("invalid UTC time");const band=identifier(s.band);return {utc:s.utc,band};});
 const keys=slots.map(s=>s.utc+"|"+s.band);if(new Set(keys).size!==keys.length)throw new RangeError("duplicate slot");
 slots.sort((a,b)=>a.utc.localeCompare(b.utc)||a.band.localeCompare(b.band));
 return {slots,official_schedule:false,disclaimer:"User-defined planning only; no contest dates, rulebook or event validity verified",formula_revision:"M33-v1"} as const;
}
export function makerProjectReview(x:{project_name:string;supply_voltage_v:number;components:string[]}){
 const project_name=identifier(x.project_name),voltage=positive(x.supply_voltage_v,30);
 if(!Array.isArray(x.components)||x.components.length<1||x.components.length>24)throw new RangeError("invalid components");
 const components=x.components.map(identifier);
 return {project_name,supply_voltage_v:voltage,components,certified:false,warnings:["Conceptual low-voltage exercise only; inspect current limits, polarity, thermal loading and applicable safety rules separately","No electrical or EMC certification, schematic verification, or build approval"],formula_revision:"M37-v1"} as const;
}
export function clubWorkshopPlan(x:{topic:"antenna_basics"|"digital_modes";participants:number;duration_minutes:number}){
 if(x.topic!=="antenna_basics"&&x.topic!=="digital_modes")throw new RangeError("invalid topic");
 if(!Number.isInteger(x.participants)||x.participants<1||x.participants>100)throw new RangeError("invalid attendance");
 const d=x.duration_minutes;if(!Number.isInteger(d)||d<30||d>240)throw new RangeError("invalid duration");
 const opening=Math.floor(d/6),exercise=Math.floor(d/2),closing=d-opening-exercise;
 return {topic:x.topic,participants:x.participants,agenda:[{section:"Introduction and scope",minutes:opening},{section:"Instructor-led classroom exercise",minutes:exercise},{section:"Review, safety and questions",minutes:closing}],simulated:true,disclaimer:"Draft agenda only; no real club booking, member roster or official training accreditation",formula_revision:"M38-v1"} as const;
}
