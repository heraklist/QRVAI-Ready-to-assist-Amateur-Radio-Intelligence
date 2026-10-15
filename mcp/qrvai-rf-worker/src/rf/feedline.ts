/** Deterministic feedline attenuation for a USER-SUPPLIED unverified cable curve.
 * No vendor library, network, device access, identity, or implied source authentication.
 */
export type FeedlinePoint = {frequency_hz:number;loss_db_per_100m:number};
export type FeedlineResult = {
  attenuation_db:number; cable_loss_db:number; connector_loss_db:number;
  delivered_ratio:number; interpolated_loss_db_per_100m:number;
  series:FeedlinePoint[]; profile_id:string; profile_revision:string;
  profile_trust:"USER_SUPPLIED_UNVERIFIED";
  interpolation_method:"log_frequency"; formula_revision:"M09-v1";
  assumptions:string;
};
export class FeedlineInputError extends Error {
  readonly code:"INVALID_INPUT" | "OUT_OF_RANGE";
  constructor(message:string,code:"INVALID_INPUT"|"OUT_OF_RANGE"="INVALID_INPUT"){
    super(message); this.name="FeedlineInputError";this.code=code;
  }
}
type StrictRecord=Record<PropertyKey,unknown>;

function record(value:unknown,fields:readonly string[],name:string):StrictRecord{
  if(value===null||typeof value!=="object"||Array.isArray(value)){
    throw new FeedlineInputError(name+" must be an object");
  }
  const proto=Object.getPrototypeOf(value);
  if(proto!==Object.prototype&&proto!==null){
    throw new FeedlineInputError(name+" has unsupported prototype");
  }
  const keys=Reflect.ownKeys(value);
  if(keys.length!==fields.length||!fields.every(field=>keys.includes(field))){
    throw new FeedlineInputError(name+" has missing or extra fields");
  }
  const result:StrictRecord=Object.create(null) as StrictRecord;
  for(const field of fields){
    const descriptor=Object.getOwnPropertyDescriptor(value,field);
    if(!descriptor||!("value" in descriptor)){
      throw new FeedlineInputError(name+" has an unsupported accessor property");
    }
    result[field]=descriptor.value;
  }
  return result;
}
function num(value:unknown,name:string,min:number,strict=false):number{
  if(typeof value!=="number"||!Number.isFinite(value)||
     (strict? value<=min:value<min)){
    throw new FeedlineInputError(name+" requires a finite valid number");
  }
  return value;
}
function identifier(value:unknown,name:string,re:RegExp):string{
  if(typeof value!=="string"||!re.test(value))throw new FeedlineInputError(name+" invalid");
  return value;
}

export function calculateFeedlineLoss(input:unknown):FeedlineResult{
  const data=record(input,["profile","frequency_hz","length_m","connector_loss_db","interpolation_method"],"request");
  if(data.interpolation_method!=="log_frequency"){
    throw new FeedlineInputError("interpolation_method must be log_frequency");
  }
  const frequency=num(data.frequency_hz,"frequency_hz",0,true);
  const length=num(data.length_m,"length_m",0);
  const connector=num(data.connector_loss_db,"connector_loss_db",0);
  const profile=record(data.profile,["id","revision","points"],"profile");
  const id=identifier(profile.id,"profile.id",/^[a-z0-9][a-z0-9_-]{0,63}$/);
  const revision=identifier(profile.revision,"profile.revision",/^[A-Za-z0-9][A-Za-z0-9._-]{0,39}$/);
  if(!Array.isArray(profile.points)||profile.points.length<2||profile.points.length>16){
    throw new FeedlineInputError("points requires 2..16 ordered samples");
  }
  const points:FeedlinePoint[]=[];
  let prior=0;
  for(const [i,value] of profile.points.entries()){
    const item=record(value,["frequency_hz","loss_db_per_100m"],"point "+i);
    const hz=num(item.frequency_hz,"point frequency",0,true);
    const loss=num(item.loss_db_per_100m,"point attenuation",0);
    if(hz<=prior)throw new FeedlineInputError("points must strictly increase in frequency");
    points.push({frequency_hz:hz,loss_db_per_100m:loss});
    prior=hz;
  }
  if(frequency<points[0]!.frequency_hz||frequency>points[points.length-1]!.frequency_hz){
    throw new FeedlineInputError("frequency outside profile coverage; extrapolation prohibited","OUT_OF_RANGE");
  }
  let series:FeedlinePoint[]=[];
  let attenuationPer100:number|undefined;
  for(let i=0;i<points.length;i++){
    if(frequency===points[i]!.frequency_hz){
      attenuationPer100=points[i]!.loss_db_per_100m;
      series=[points[i]!];break;
    }
    if(i>0 && frequency<points[i]!.frequency_hz){
      const a=points[i-1]!,b=points[i]!;
      const low=Math.log10(a.frequency_hz),high=Math.log10(b.frequency_hz);
      const divisor=high-low;
      if(!(divisor>0))throw new FeedlineInputError("frequency knots indistinguishable in log precision","OUT_OF_RANGE");
      const weight=(Math.log10(frequency)-low)/divisor;
      attenuationPer100=a.loss_db_per_100m+weight*(b.loss_db_per_100m-a.loss_db_per_100m);
      series=[a,b];break;
    }
  }
  if(attenuationPer100===undefined||!Number.isFinite(attenuationPer100)||attenuationPer100<0){
    throw new FeedlineInputError("loss interpolation out of finite range","OUT_OF_RANGE");
  }
  const cable=attenuationPer100*(length/100);
  const total=cable+connector;
  const ratio=10**(-total/10);
  if(!Number.isFinite(cable)||!Number.isFinite(total)||!Number.isFinite(ratio)||
     cable<0||total<0||ratio<=0||ratio>1||
     (attenuationPer100>0 && length>0 && cable===0)){
    throw new FeedlineInputError("attenuation outside finite representable range","OUT_OF_RANGE");
  }
  return {
    attenuation_db:total,cable_loss_db:cable,connector_loss_db:connector,
    delivered_ratio:ratio,interpolated_loss_db_per_100m:attenuationPer100,
    series:series.map(p=>({...p})),profile_id:id,profile_revision:revision,
    profile_trust:"USER_SUPPLIED_UNVERIFIED",interpolation_method:"log_frequency",
    formula_revision:"M09-v1",
    assumptions:"User-supplied unverified attenuation in dB/100m; log-frequency interpolation inside profile knots; specified connector loss in dB. No cable identification, measurement or certification."
  };
}
