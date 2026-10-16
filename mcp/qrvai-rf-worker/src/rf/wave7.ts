const positive=(v:number,name:string,max:number)=>{if(typeof v!=="number"||!Number.isFinite(v)||v<=0||v>max)throw new RangeError("invalid "+name);return v};
const bounded=(v:number,name:string,max:number)=>{if(typeof v!=="number"||!Number.isFinite(v)||Math.abs(v)>max)throw new RangeError("invalid "+name);return v};
const safe=(v:number)=>{if(!Number.isFinite(v))throw new RangeError("nonfinite result");return v};
export function rfExposureScreen(x:{mean_power_w:number;linear_gain:number;distance_m:number;reference_flux_w_m2:number}){
 const p=positive(x.mean_power_w,"mean_power_w",1e7),g=positive(x.linear_gain,"linear_gain",1e5),r=positive(x.distance_m,"distance_m",1e6),reference=positive(x.reference_flux_w_m2,"reference_flux_w_m2",1e6);
 const estimated_flux_w_m2=safe(p*g/(4*Math.PI*r*r));
 return {estimated_flux_w_m2,below_user_reference:estimated_flux_w_m2<reference,compliance_established:false as const,source:"USER_SUPPLIED_INPUTS" as const,disclaimer:"Ideal far-field free-space estimate only. This is not a regulatory compliance or personal RF safety determination; near-field, reflections, averaging, antenna patterns and applicable limits are not assessed.",formula_revision:"M14-v1" as const};
}
export function propagationPath(x:{frequency_mhz:number;from_lat_deg:number;from_lon_deg:number;to_lat_deg:number;to_lon_deg:number}){
 const f=positive(x.frequency_mhz,"frequency_mhz",1e6),lat1=bounded(x.from_lat_deg,"from_lat_deg",90),lat2=bounded(x.to_lat_deg,"to_lat_deg",90),lon1=bounded(x.from_lon_deg,"from_lon_deg",180),lon2=bounded(x.to_lon_deg,"to_lon_deg",180);
 const deg=Math.PI/180,a=lat1*deg,b=lat2*deg,dlat=(lat2-lat1)*deg,dlon=(lon2-lon1)*deg;
 const h=Math.sin(dlat/2)**2+Math.cos(a)*Math.cos(b)*Math.sin(dlon/2)**2;
 const central=2*Math.atan2(Math.sqrt(Math.max(0,h)),Math.sqrt(Math.max(0,1-h)));
 const distance_km=safe(6371.0088*central);
 if(distance_km<0.000001)throw new RangeError("path must have nonzero distance");
 const free_space_path_loss_db=safe(32.44+20*Math.log10(f)+20*Math.log10(distance_km));
 return {distance_km,free_space_path_loss_db,real_world_prediction:false as const,source:"USER_SUPPLIED_INPUTS" as const,disclaimer:"Spherical great circle and ideal FSPL only; no terrain, ionosphere, horizon, weather or reception probability modeled.",formula_revision:"M24-v1" as const};
}
export function satellitePass(x:{samples:{observed_at:string;elevation_deg:number}[]}){
 if(!Array.isArray(x.samples)||x.samples.length<1||x.samples.length>32)throw new RangeError("invalid sample count");
 let previous=-Infinity;
 const samples=x.samples.map(s=>{if(typeof s.observed_at!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s.observed_at))throw new RangeError("invalid UTC timestamp");const millis=Date.parse(s.observed_at);if(!Number.isFinite(millis)||new Date(millis).toISOString().slice(0,19)+"Z"!==s.observed_at||millis<=previous)throw new RangeError("invalid ordered timestamps");previous=millis;const elevation_deg=bounded(s.elevation_deg,"elevation_deg",90);return {observed_at:s.observed_at,elevation_deg};});
 const above=samples.filter(s=>s.elevation_deg>0);const peak=above.length?Math.max(...above.map(s=>s.elevation_deg)):null;
 return {above_horizon_sample_count:above.length,peak_sample_elevation_deg:peak,window_start:above.length?above[0].observed_at:null,window_end:above.length?above[above.length-1].observed_at:null,orbit_computed:false as const,source:"USER_SUPPLIED_ELEVATION_SAMPLES" as const,disclaimer:"Summarizes supplied elevation samples only. Not a TLE/SGP4 orbital propagation, actual satellite pass forecast, visibility guarantee or Doppler prediction.",formula_revision:"M26-v1" as const};
}
