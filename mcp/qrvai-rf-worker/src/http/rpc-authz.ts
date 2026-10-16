import {authorizeToolCall,authorizeToolList,type Principal} from "./authz-policy.ts";
import {IMPLEMENTED_TOOLS} from "../rf/wave1.ts";

export type RpcGateResult={allowed:boolean;allowedToolNames?:string[];method?:string;reason?:string};
/** Pure pre-dispatch check. OAuth mode must supply independently verified principal. */
export async function guardMcpRpcRequest(request:Request,principal:Principal|null):Promise<RpcGateResult>{
 if(!principal)return {allowed:false,reason:"unauthenticated"};
 let input:unknown;
 try{
  const raw=await request.clone().text();
  if(raw.length>65536)return {allowed:false,reason:"oversized"};
  input=JSON.parse(raw);
 }catch{return {allowed:false,reason:"invalid-json"};}
 if(!input||typeof input!=="object"||Array.isArray(input))return {allowed:false,reason:"invalid-envelope"};
 const msg=input as Record<string,unknown>;
 if(msg.jsonrpc!=="2.0"||typeof msg.method!=="string")return {allowed:false,reason:"invalid-rpc"};
 if(msg.method==="tools/list"){
   return {allowed:true,method:"tools/list",allowedToolNames:authorizeToolList(principal,IMPLEMENTED_TOOLS.map(t=>t.name))};
 }
 if(msg.method==="tools/call"){
  if(!msg.params||typeof msg.params!=="object"||Array.isArray(msg.params))return {allowed:false,reason:"invalid-params"};
  const params=msg.params as Record<string,unknown>;
  if(typeof params.name!=="string")return {allowed:false,reason:"invalid-tool"};
  // Tenant ownership must be supplied only by trusted server-side resolution.
  return {allowed:authorizeToolCall(principal,params.name),method:"tools/call",reason:"requires-server-side-ownership-for-private-resources"};
 }
 if(msg.method==="initialize"||msg.method==="notifications/initialized"||msg.method==="ping")return {allowed:true,method:msg.method};
 return {allowed:false,reason:"unsupported-method"};
}
