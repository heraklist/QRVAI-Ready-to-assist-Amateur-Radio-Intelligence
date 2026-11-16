/** 
 * Pure proposal for identity-scoped access and usage budgets. NOT wired to the
 * shared-bearer gateway, NOT a billing engine, NOT a durable quota store.
 * Requires independently verified principal, atomically stored counters and
 * real provider pricing/rights review before a public paid deployment.
 */
import {classifyTool,authorizeToolCall,type Principal} from "./authz-policy.ts";

export type UsageClass="offline"|"external_data"|"private_resource";
export type UsageDefinition={tool:string;usage_class:UsageClass;budget_weight:number;chargeable_now:false};
export type BudgetSnapshot={
  requests_in_minute:number; weighted_units_in_day:number;active_concurrency:number;
};
export type UsageCaps={max_requests_in_minute:number;max_weighted_units_in_day:number;max_concurrency:number};
export type UsageVerdict={
  allowed:boolean;reason:"OK"|"UNAUTHENTICATED_OR_FORBIDDEN"|"UNKNOWN_TOOL"|"INVALID_USAGE_SNAPSHOT"|"REQUEST_RATE"|"DAY_WEIGHTED_BUDGET"|"CONCURRENCY";
  definition:UsageDefinition|null;next_weighted_units_in_day:number|null;
};
const external=new Set([
  "space_weather_now","satellite_passes","satellite_transmitters","pota_spots","wspr_spots",
  "callsign_info","repeaters_near","contest_calendar","regulation_text","regulation_changes",
]);
const privateResource=new Set(["station_get_profile","station_read_status","log_award_progress"]);
const validWhole=(n:number)=>Number.isSafeInteger(n)&&n>=0;
export function defineUsage(tool:string):UsageDefinition|null{
  const kind=classifyTool(tool);
  if(kind===null)return null;
  const usage_class:UsageClass=privateResource.has(tool)?"private_resource":external.has(tool)?"external_data":"offline";
  return {tool,usage_class,budget_weight:usage_class==="external_data"?5:usage_class==="private_resource"?3:1,chargeable_now:false};
}
export function evaluateUsage(principal:Principal|null,tool:string,current:BudgetSnapshot,caps:UsageCaps):UsageVerdict{
  const definition=defineUsage(tool);
  if(!definition)return {allowed:false,reason:"UNKNOWN_TOOL",definition:null,next_weighted_units_in_day:null};
  if(!authorizeToolCall(principal,tool))return {allowed:false,reason:"UNAUTHENTICATED_OR_FORBIDDEN",definition,next_weighted_units_in_day:null};
  const values=[current.requests_in_minute,current.weighted_units_in_day,current.active_concurrency,
    caps.max_requests_in_minute,caps.max_weighted_units_in_day,caps.max_concurrency];
  if(!values.every(validWhole)||caps.max_requests_in_minute<1||caps.max_weighted_units_in_day<1||caps.max_concurrency<1)
    return {allowed:false,reason:"INVALID_USAGE_SNAPSHOT",definition,next_weighted_units_in_day:null};
  const next=current.weighted_units_in_day+definition.budget_weight;
  if(!Number.isSafeInteger(next))return {allowed:false,reason:"INVALID_USAGE_SNAPSHOT",definition,next_weighted_units_in_day:null};
  if(current.requests_in_minute>=caps.max_requests_in_minute)return {allowed:false,reason:"REQUEST_RATE",definition,next_weighted_units_in_day:next};
  if(next>caps.max_weighted_units_in_day)return {allowed:false,reason:"DAY_WEIGHTED_BUDGET",definition,next_weighted_units_in_day:next};
  if(current.active_concurrency>=caps.max_concurrency)return {allowed:false,reason:"CONCURRENCY",definition,next_weighted_units_in_day:next};
  return {allowed:true,reason:"OK",definition,next_weighted_units_in_day:next};
}
