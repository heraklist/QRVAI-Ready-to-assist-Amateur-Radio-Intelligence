import {createHash} from "node:crypto";
/**
 * Best-effort per-isolate burst guard for the private shared-bearer preview.
 * IMPORTANT: Vercel instances are NOT a distributed rate limiter. Do not treat
 * this as per-user quota, billing, entitlement control, or public-release gate.
 */
export type BurstDecision={allowed:boolean;remaining:number;retry_after_seconds:number;limit:number};
export class PreviewBurstLimiter {
  private readonly windows=new Map<string,{start:number;count:number}>();
  readonly limit:number;
  readonly windowMs:number;
  readonly maxKeys:number;
  constructor(limit=60,windowMs=60_000,maxKeys=256){
    if(!Number.isSafeInteger(limit)||limit<1||!Number.isSafeInteger(windowMs)||windowMs<1000||!Number.isSafeInteger(maxKeys)||maxKeys<1)
      throw new RangeError("invalid preview budget");
    this.limit=limit;
    this.windowMs=windowMs;
    this.maxKeys=maxKeys;
  }
  check(secret:string,now=Date.now()):BurstDecision{
    if(!secret||!Number.isFinite(now))return {allowed:false,remaining:0,retry_after_seconds:60,limit:this.limit};
    // The token is never used or logged as a raw map key.
    const key=createHash("sha256").update(secret).digest("hex");
    const previous=this.windows.get(key);
    const fresh=previous===undefined||now<previous.start||now-previous.start>=this.windowMs;
    if(fresh){
      if(!previous&&this.windows.size>=this.maxKeys){
        for(const [name,window] of this.windows)if(now-window.start>=this.windowMs)this.windows.delete(name);
        if(this.windows.size>=this.maxKeys)return {allowed:false,remaining:0,retry_after_seconds:Math.ceil(this.windowMs/1000),limit:this.limit};
      }
      this.windows.set(key,{start:now,count:1});
      return {allowed:true,remaining:this.limit-1,retry_after_seconds:0,limit:this.limit};
    }
    if(previous.count>=this.limit)return {allowed:false,remaining:0,retry_after_seconds:Math.max(1,Math.ceil((previous.start+this.windowMs-now)/1000)),limit:this.limit};
    previous.count++;
    return {allowed:true,remaining:this.limit-previous.count,retry_after_seconds:0,limit:this.limit};
  }
  trackedTokenFingerprints():number{return this.windows.size;}
}
export const previewBurstLimiter=new PreviewBurstLimiter();
