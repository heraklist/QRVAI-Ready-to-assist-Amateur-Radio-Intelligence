export type ToolDescriptor = {candidate_id:string;name:string;scope:string};
export const IMPLEMENTED_TOOLS:readonly ToolDescriptor[] = Object.freeze([
  {candidate_id:"M07",name:"rf_power_convert",scope:"RF power unit conversion"},
  {candidate_id:"M08",name:"rf_link_budget",scope:"Explicit-budget arithmetic"},
  {candidate_id:"M09",name:"rf_feedline_loss",scope:"User-supplied cable curve"},
  {candidate_id:"M10",name:"rf_impedance",scope:"Passive impedance calculation"},
  {candidate_id:"M01",name:"core_capabilities",scope:"Implemented tool discovery"},
  {candidate_id:"M11",name:"antenna_geometry",scope:"Ideal thin-wire dimensions"},
  {candidate_id:"M12",name:"antenna_matching",scope:"Lossless quarter-wave transformer"},
  {candidate_id:"M13",name:"rf_filter_response",scope:"Ideal first-order RC magnitude"},
  {candidate_id:"M22",name:"power_autonomy",scope:"Idealized battery runtime"},
  {candidate_id:"M25",name:"geo_bearing",scope:"Spherical great-circle azimuth"},
  {candidate_id:"M20",name:"station_signal_path",scope:"User-supplied unverified signal path"},
  {candidate_id:"M29",name:"packet_route_preview",scope:"Simulated AX25/APRS path"},
  {candidate_id:"M34",name:"emcomm_drill",scope:"Classroom-only emergency exercise"},
  {candidate_id:"M35",name:"emcomm_readiness",scope:"Hypothetical emergency-training resource gaps"},
  {candidate_id:"M36",name:"academy_exercise",scope:"Fixed educational questions"},
  {candidate_id:"M28",name:"digital_setup_guide",scope:"Offline simulated digital guide"},
  {candidate_id:"M30",name:"repeater_channel_preview",scope:"Hypothetical unverified frequency offsets"},
  {candidate_id:"M33",name:"contest_plan",scope:"User-supplied contest slots"},
  {candidate_id:"M37",name:"maker_project_review",scope:"Low-voltage educational review"},
  {candidate_id:"M38",name:"club_workshop_plan",scope:"Offline workshop agenda"},
  {candidate_id:"M02",name:"source_lookup",scope:"Search user supplied source snippets"},
  {candidate_id:"M04",name:"regulatory_check_operation",scope:"Compare unverified user supplied rules"},
  {candidate_id:"M05",name:"spectrum_band_segments",scope:"User supplied spectrum records"},
  {candidate_id:"M06",name:"spectrum_find_repeaters",scope:"Filter user supplied repeater records"},
  {candidate_id:"M17",name:"manual_find",scope:"Search user supplied manual excerpts"}
]);
export function describeWave1():ToolDescriptor[]{return IMPLEMENTED_TOOLS.map(x=>({...x}));}
const C=299792458;
function positive(n:number,label:string):number{if(typeof n!=="number"||!Number.isFinite(n)||n<=0)throw new RangeError(label+" must be finite positive");return n;}
function velocity(n:number):number{positive(n,"velocity_factor");if(n>1)throw new RangeError("velocity_factor exceeds one");return n;}
function finite(n:number,label:string):number{if(typeof n!=="number"||!Number.isFinite(n))throw new RangeError(label+" must be finite");return n;}
function safe(n:number):number{if(!Number.isFinite(n)||n<0)throw new RangeError("non-finite calculated quantity");return n;}
export function antennaGeometry(x:{kind:"halfwave_dipole"|"quarterwave_monopole";frequency_hz:number;velocity_factor:number}){
 const wl=C/positive(x.frequency_hz,"frequency_hz")*velocity(x.velocity_factor);const total=safe(wl*(x.kind==="halfwave_dipole"?.5:x.kind==="quarterwave_monopole"?.25:NaN));
 return {total_length_m:total,element_length_m:x.kind==="halfwave_dipole"?total/2:total,formula_revision:"M11-v1",assumptions:"Ideal thin wire; no end effects, ground effects or resonance certification"} as const;
}
export function antennaMatching(x:{source_resistance_ohm:number;load_resistance_ohm:number;frequency_hz:number;velocity_factor:number}){
 const z0=safe(Math.sqrt(positive(x.source_resistance_ohm,"source_resistance_ohm")*positive(x.load_resistance_ohm,"load_resistance_ohm")));positive(z0,"transformer_z0_ohm");
 const quarter=safe(C/positive(x.frequency_hz,"frequency_hz")*velocity(x.velocity_factor)/4);
 return {transformer_z0_ohm:z0,quarter_wave_length_m:quarter,formula_revision:"M12-v1",assumptions:"Real resistive terminations; single lossless quarter-wave section at design frequency"} as const;
}
export function filterResponse(x:{kind:"lowpass"|"highpass";frequency_hz:number;resistance_ohm:number;capacitance_f:number}){
 const f=positive(x.frequency_hz,"frequency_hz"),r=positive(x.resistance_ohm,"resistance_ohm"),c=positive(x.capacitance_f,"capacitance_f");
 const ratio=2*Math.PI*f*r*c;positive(ratio,"normalized frequency");
 const magnitude=x.kind==="lowpass"?1/Math.hypot(1,ratio):x.kind==="highpass"?1/Math.hypot(1,1/ratio):NaN;
 positive(magnitude,"magnitude");const gain=20*Math.log10(magnitude);finite(gain,"gain_db");
 return {magnitude,gain_db:gain,formula_revision:"M13-v1",assumptions:"Ideal single-pole RC circuit; no tolerance, loading or parasitics"} as const;
}
export function powerAutonomy(x:{battery_wh:number;average_load_w:number;usable_fraction:number}){
 const wh=positive(x.battery_wh,"battery_wh"),watts=positive(x.average_load_w,"average_load_w"),fraction=positive(x.usable_fraction,"usable_fraction");
 if(fraction>1)throw new RangeError("usable_fraction exceeds one");
 const runtime=safe(wh/watts*fraction);positive(runtime,"runtime_h");
 return {runtime_h:runtime,formula_revision:"M22-v1",assumptions:"Constant average draw, explicitly supplied usable battery fraction; not measured discharge"} as const;
}
export function geoBearing(x:{from_lat_deg:number;from_lon_deg:number;to_lat_deg:number;to_lon_deg:number}){
 const lat1=finite(x.from_lat_deg,"from_lat_deg"),lon1=finite(x.from_lon_deg,"from_lon_deg"),lat2=finite(x.to_lat_deg,"to_lat_deg"),lon2=finite(x.to_lon_deg,"to_lon_deg");
 if(Math.abs(lat1)>90||Math.abs(lat2)>90||Math.abs(lon1)>180||Math.abs(lon2)>180)throw new RangeError("coordinates outside valid degrees");
 const toRad=Math.PI/180,a=lat1*toRad,b=lat2*toRad,dl=(lon2-lon1)*toRad;
 const yy=Math.sin(dl)*Math.cos(b),xx=Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(dl);
 const central=Math.atan2(Math.hypot(yy,xx),Math.sin(a)*Math.sin(b)+Math.cos(a)*Math.cos(b)*Math.cos(dl));
 if(central<1e-12||Math.abs(Math.PI-central)<1e-12||Math.hypot(yy,xx)<1e-12)throw new RangeError("undefined bearing (coincident or antipodal)");
 return {initial_bearing_deg:((Math.atan2(yy,xx)*180/Math.PI)%360+360)%360,distance_km:safe(central*6371.0088),formula_revision:"M25-v1",assumptions:"Mean-radius spherical Earth; not a WGS84 surveying geodesic"} as const;
}
