import {IMPLEMENTED_TOOLS} from "../rf/wave1.ts";

/** Declarative policy classification; not yet wired into the MCP HTTP adapter. */
export type ToolClass="public"|"user_data"|"station"|"logs";
export type Principal={subject:string;tenantId:string;scopes:readonly string[]};
const data=new Set(["station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","digital_setup_guide","repeater_channel_preview","contest_plan","maker_project_review","club_workshop_plan","source_lookup","regulatory_check_operation","spectrum_band_segments","spectrum_find_repeaters","manual_find","measurements_inspect_trace","sdr_inspect_iq","manual_answer_cited","equipment_diagnose","adif_validate","spaceweather_indices","dx_reception_reports","rf_exposure_screen","propagation_path","satellite_pass","rf_feedline_loss"]);
const station=new Set(["station_get_profile","station_read_status"]);
const logs=new Set(["log_award_progress"]);
const names=new Set(IMPLEMENTED_TOOLS.map(x=>x.name));
export function classifyTool(name:string):ToolClass|null{
 if(!names.has(name))return null;
 if(station.has(name))return "station";
 if(logs.has(name))return "logs";
 if(data.has(name))return "user_data";
 return "public";
}
export function authorizeToolCall(principal:Principal|null,toolName:string,resource?:{tenantId:string}):boolean{
 const kind=classifyTool(toolName);
 if(!kind||!principal||!principal.subject||!principal.tenantId||!Array.isArray(principal.scopes))return false;
 const scopes=new Set(principal.scopes);
 if(kind==="public")return scopes.has("qrvai:tools:read");
 if(kind==="user_data")return scopes.has("qrvai:user-data:process");
 if(!resource?.tenantId||resource.tenantId!==principal.tenantId)return false;
 return scopes.has(kind==="station"?"qrvai:station:read":"qrvai:logs:read");
}
export function authorizeToolList(principal:Principal|null,tools:readonly string[]):string[]{
 return tools.filter(name=>authorizeToolCall(principal,name));
}
