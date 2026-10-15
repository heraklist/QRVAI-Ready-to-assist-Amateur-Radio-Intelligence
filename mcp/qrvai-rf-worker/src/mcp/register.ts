import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod/v4";
import {digitalSetupGuide,repeaterChannelPreview,contestPlan,makerProjectReview,clubWorkshopPlan} from "../rf/wave3.ts";
import {stationSignalPath,packetRoutePreview,emcommDrill,emcommReadiness,academyExercise} from "../rf/wave2.ts";
import {describeWave1,antennaGeometry,antennaMatching,filterResponse,powerAutonomy,geoBearing} from "../rf/wave1.ts";
import { convertPower, PowerInputError } from "../rf/power.ts";
import { calculateLinkBudget, LinkBudgetInputError } from "../rf/link-budget.ts";
import { calculateImpedance, ImpedanceInputError } from "../rf/impedance.ts";
import { calculateFeedlineLoss, FeedlineInputError } from "../rf/feedline.ts";

const inputSchema = z.strictObject({
  value: z.number().finite(),
  unit: z.enum(["W","mW","dBm","dBW"])
});
const outputSchema = z.strictObject({
  W: z.number().finite(), mW: z.number().finite(),
  dBm: z.number().finite(), dBW: z.number().finite(),
  convention: z.string(), precisionNote: z.string()
});

const linkInputSchema = z.strictObject({
  tx_w: z.number().finite().positive(),
  tx_gain_dbi: z.number().finite(),
  tx_loss_db: z.number().finite().nonnegative(),
  path_loss_db: z.number().finite().nonnegative(),
  rx_gain_dbi: z.number().finite(),
  rx_loss_db: z.number().finite().nonnegative(),
  rx_sensitivity_dbm: z.number().finite()
});
const linkOutputSchema = z.strictObject({
  tx_dbm: z.number().finite(), rx_dbm: z.number().finite(), margin_db: z.number().finite(),
  stages: z.array(z.strictObject({name:z.string(),value_dbm:z.number().finite()})),
  formula_revision: z.literal("M08-v1"), assumptions:z.string()
});

const impedanceInputSchema = z.strictObject({
  r_ohm: z.number().finite().nonnegative(),
  x_ohm: z.number().finite(),
  z0_ohm: z.number().finite().positive()
});
const impedanceOutputSchema = z.strictObject({
  gamma_re:z.number().finite(), gamma_im:z.number().finite(),
  gamma_magnitude:z.number().finite(),gamma_phase_deg:z.number().finite(),
  vswr:z.number().finite().nullable(),return_loss_db:z.number().finite().nullable(),
  vswr_status:z.enum(["FINITE","INFINITE","NUMERICAL_LIMIT"]),
  return_loss_status:z.enum(["FINITE","INFINITE"]),
  formula_revision:z.literal("M10-v1"),assumptions:z.string()
});

const feedlinePointSchema = z.strictObject({
  frequency_hz: z.number().finite().positive(),
  loss_db_per_100m: z.number().finite().nonnegative()
});
const feedlineInputSchema = z.strictObject({
  profile: z.strictObject({
    id: z.string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/),
    revision: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,39}$/),
    points: z.array(feedlinePointSchema).min(2).max(16)
  }),
  frequency_hz: z.number().finite().positive(),
  length_m: z.number().finite().nonnegative(),
  connector_loss_db: z.number().finite().nonnegative(),
  interpolation_method: z.literal("log_frequency")
});
const feedlineOutputSchema = z.strictObject({
  attenuation_db:z.number().finite(), cable_loss_db:z.number().finite(),
  connector_loss_db:z.number().finite(), delivered_ratio:z.number().finite(),
  interpolated_loss_db_per_100m:z.number().finite(),
  series:z.array(feedlinePointSchema).min(1).max(2),
  profile_id:z.string(), profile_revision:z.string(),
  profile_trust:z.literal("USER_SUPPLIED_UNVERIFIED"),
  interpolation_method:z.literal("log_frequency"), formula_revision:z.literal("M09-v1"),
  assumptions:z.string()
});

export function createServer(): McpServer {
  const server = new McpServer({ name: "qrvai-rf", version: "0.1.0" });
  server.registerTool("rf_power_convert", {
    title: "RF Power Unit Conversion",
    description: "Convert an impersonal, finite RF power value among W, mW, dBm and dBW; not a radio measurement or transmission permission.",
    inputSchema,
    outputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async (args) => {
    try {
      const output = convertPower(args);
      const text = `${output.W} W = ${output.mW} mW = ${output.dBm} dBm = ${output.dBW} dBW. ${output.precisionNote}`;
      return { content: [{type: "text" as const, text}], structuredContent: output };
    } catch (error) {
      if (error instanceof PowerInputError) {
        return {content:[{type:"text" as const, text:`${error.code}: ${error.message}`}],isError:true};
      }
      return {content:[{type:"text" as const,text:"INVALID_INPUT: request failed"}],isError:true};
    }
  });
  server.registerTool("rf_link_budget", {
    title: "RF Link Budget",
    description: "Calculate a deterministic one-way RF link budget from explicit power, antenna gains, passive losses, propagation loss and receiver sensitivity; never infers coverage or transmit permission.",
    inputSchema: linkInputSchema,
    outputSchema: linkOutputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async (args) => {
    try {
      const output = calculateLinkBudget(args);
      return {
        content: [{type:"text" as const, text:`Calculated received power ${output.rx_dbm} dBm and sensitivity margin ${output.margin_db} dB; requires supplied path loss. Not a field measurement.`}],
        structuredContent: output
      };
    } catch (error) {
      if (error instanceof LinkBudgetInputError) {
        return {content:[{type:"text" as const,text:`${error.code}: ${error.message}`}],isError:true};
      }
      return {content:[{type:"text" as const,text:"INVALID_INPUT: link budget failed"}],isError:true};
    }
  });
  server.registerTool("rf_impedance", {
    title:"Complex Impedance and VSWR",
    description:"Compute Gamma, VSWR and return loss for an explicit passive complex impedance and positive real Z0. Mathematical calculator, not VNA data.",
    inputSchema:impedanceInputSchema,
    outputSchema:impedanceOutputSchema,
    annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}
  }, async (args)=>{
    try{
      const output=calculateImpedance(args);
      return {
        content:[{type:"text" as const,text:`Calculated |Gamma| ${output.gamma_magnitude}; VSWR ${output.vswr??output.vswr_status}; return loss ${output.return_loss_db??output.return_loss_status} dB. No measured VNA data.`}],
        structuredContent:output
      };
    }catch(error){
      if(error instanceof ImpedanceInputError){
        return {content:[{type:"text" as const,text:`${error.code}: ${error.message}`}],isError:true};
      }
      return {content:[{type:"text" as const,text:"INVALID_INPUT: impedance calculation failed"}],isError:true};
    }
  });
  server.registerTool("rf_feedline_loss", {
    title: "Feedline Attenuation — Supplied Coax Curve",
    description: "Calculate feedline loss from explicitly supplied versioned cable attenuation points; interpolate in log frequency within coverage. Does not lookup, verify or certify a manufacturer cable profile.",
    inputSchema:feedlineInputSchema,
    outputSchema:feedlineOutputSchema,
    annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}
  }, async (args)=>{
    try{
      const output=calculateFeedlineLoss(args);
      return {
        content:[{type:"text" as const,text:`Calculated ${output.attenuation_db} dB total line/connector loss, delivered power ratio ${output.delivered_ratio}. Supplied profile is UNVERIFIED; this is not a cable measurement.`}],
        structuredContent:output
      };
    }catch(error){
      if(error instanceof FeedlineInputError){
        return {content:[{type:"text" as const,text:`${error.code}: ${error.message}`}],isError:true};
      }
      return {content:[{type:"text" as const,text:"INVALID_INPUT: feedline calculation failed"}],isError:true};
    }
  });

  const positive=z.number().finite().positive();
  const velocity=z.number().finite().positive().max(1);
  const ro={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
  function response(output:Record<string,unknown>){return {content:[{type:"text" as const,text:JSON.stringify(output)}],structuredContent:output};}
  function failed(error:unknown){return {content:[{type:"text" as const,text:error instanceof Error?error.message:"INVALID_INPUT"}],isError:true};}
  server.registerTool("core_capabilities",{
    title:"Implemented QRVAI MCP tools",description:"Discover twenty implemented read-only RF/core and educational MCP tools; never claims unimplemented candidates.",
    inputSchema:z.strictObject({}),
    outputSchema:z.strictObject({tools:z.array(z.strictObject({candidate_id:z.string(),name:z.string(),scope:z.string()})),implemented_count:z.number().int().positive()}),
    annotations:ro
  },async()=>response({tools:describeWave1(),implemented_count:describeWave1().length}));
  server.registerTool("antenna_geometry",{
    title:"Ideal antenna geometry",description:"Ideal halfwave dipole or quarterwave monopole length; no end effects or measured resonance.",
    inputSchema:z.strictObject({kind:z.enum(["halfwave_dipole","quarterwave_monopole"]),frequency_hz:positive,velocity_factor:velocity}),
    outputSchema:z.strictObject({total_length_m:positive,element_length_m:positive,formula_revision:z.literal("M11-v1"),assumptions:z.string()}),
    annotations:ro
  },async(args)=>{try{return response(antennaGeometry(args))}catch(e){return failed(e)}});
  server.registerTool("antenna_matching",{
    title:"Ideal quarter-wave transformer",description:"Lossless impedance transformer for strictly resistive terminations at design frequency.",
    inputSchema:z.strictObject({source_resistance_ohm:positive,load_resistance_ohm:positive,frequency_hz:positive,velocity_factor:velocity}),
    outputSchema:z.strictObject({transformer_z0_ohm:positive,quarter_wave_length_m:positive,formula_revision:z.literal("M12-v1"),assumptions:z.string()}),
    annotations:ro
  },async(args)=>{try{return response(antennaMatching(args))}catch(e){return failed(e)}});
  server.registerTool("rf_filter_response",{
    title:"First-order RC filter response",description:"Ideal single-pole lowpass/highpass magnitude and gain; no network simulation.",
    inputSchema:z.strictObject({kind:z.enum(["lowpass","highpass"]),frequency_hz:positive,resistance_ohm:positive,capacitance_f:positive}),
    outputSchema:z.strictObject({magnitude:positive,gain_db:z.number().finite(),formula_revision:z.literal("M13-v1"),assumptions:z.string()}),
    annotations:ro
  },async(args)=>{try{return response(filterResponse(args))}catch(e){return failed(e)}});
  server.registerTool("power_autonomy",{
    title:"Ideal battery runtime",description:"Estimate constant-load hours from nominal battery Wh, load watts and explicit usable fraction.",
    inputSchema:z.strictObject({battery_wh:positive,average_load_w:positive,usable_fraction:velocity}),
    outputSchema:z.strictObject({runtime_h:positive,formula_revision:z.literal("M22-v1"),assumptions:z.string()}),
    annotations:ro
  },async(args)=>{try{return response(powerAutonomy(args))}catch(e){return failed(e)}});
  server.registerTool("geo_bearing",{
    title:"Spherical azimuth and range",description:"Great-circle initial bearing and approximate spherical range; not precision geodesy.",
    inputSchema:z.strictObject({from_lat_deg:z.number().finite().min(-90).max(90),from_lon_deg:z.number().finite().min(-180).max(180),to_lat_deg:z.number().finite().min(-90).max(90),to_lon_deg:z.number().finite().min(-180).max(180)}),
    outputSchema:z.strictObject({initial_bearing_deg:z.number().finite().min(0).max(360),distance_km:positive,formula_revision:z.literal("M25-v1"),assumptions:z.string()}),
    annotations:ro
  },async(args)=>{try{return response(geoBearing(args))}catch(e){return failed(e)}});


  const w2ro={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
  const ident=z.string().regex(/^[a-zA-Z0-9_-]{1,32}$/);
  const w2positive=z.number().finite().positive();
  function w2response(output:Record<string,unknown>){return {content:[{type:"text" as const,text:JSON.stringify(output)}],structuredContent:output};}
  function w2error(error:unknown){return {content:[{type:"text" as const,text:error instanceof Error?error.message:"INVALID_INPUT"}],isError:true};}
  server.registerTool("station_signal_path",{
    title:"Unverified station signal-path diagram",description:"Validate and display explicit directed user topology; does not certify component, RF or electrical compatibility.",
    inputSchema:z.strictObject({devices:z.array(z.strictObject({id:ident,kind:ident})).min(1).max(16),connections:z.array(z.strictObject({from:ident,to:ident})).max(32)}),
    outputSchema:z.strictObject({nodes:z.array(z.strictObject({id:ident,kind:ident})),edges:z.array(z.strictObject({from:ident,to:ident})),verified:z.literal(false),warnings:z.array(z.string()),formula_revision:z.literal("M20-v1")}),
    annotations:w2ro
  },async(args)=>{try{return w2response(stationSignalPath(args))}catch(e){return w2error(e)}});
  server.registerTool("packet_route_preview",{
    title:"Illustrative AX25/APRS packet path",description:"Simulate a user-supplied path. No packets sent; no live route/relay claims.",
    inputSchema:z.strictObject({protocol:z.enum(["AX25","APRS"]),path:z.array(ident).min(2).max(8)}),
    outputSchema:z.strictObject({protocol:z.enum(["AX25","APRS"]),hops:z.array(z.strictObject({from:ident,to:ident})),hop_count:z.number().int().min(1).max(7),simulated:z.literal(true),assumptions:z.string(),formula_revision:z.literal("M29-v1")}),
    annotations:w2ro
  },async(args)=>{try{return w2response(packetRoutePreview(args))}catch(e){return w2error(e)}});
  server.registerTool("emcomm_drill",{
    title:"Emergency communication classroom exercise",description:"Paper-only simulation; never dispatches or sends communications.",
    inputSchema:z.strictObject({scenario:z.enum(["power_outage","repeater_unavailable"]),roles:z.array(ident).min(1).max(8)}),
    outputSchema:z.strictObject({scenario:z.enum(["power_outage","repeater_unavailable"]),roles:z.array(ident),exercise_steps:z.array(z.string()),simulated:z.literal(true),disclaimer:z.string(),formula_revision:z.literal("M34-v1")}),
    annotations:w2ro
  },async(args)=>{try{return w2response(emcommDrill(args))}catch(e){return w2error(e)}});
  server.registerTool("emcomm_readiness",{
    title:"Hypothetical power and staffing gap",description:"Educational numerical estimate only; not real emergency readiness certification.",
    inputSchema:z.strictObject({battery_wh:w2positive,average_load_w:w2positive,usable_fraction:z.number().finite().positive().max(1),participants:z.number().int().min(0).max(100),required_roles:z.number().int().min(0).max(100)}),
    outputSchema:z.strictObject({estimated_runtime_h:w2positive,staffing_gap:z.number().int().nonnegative(),simulated:z.literal(true),disclaimer:z.string(),formula_revision:z.literal("M35-v1")}),
    annotations:w2ro
  },async(args)=>{try{return w2response(emcommReadiness(args))}catch(e){return w2error(e)}});
  server.registerTool("academy_exercise",{
    title:"Fixed amateur-radio quiz",description:"One deterministic Greek/English educational question with optional answer check; no user profile or stored results.",
    inputSchema:z.strictObject({topic:z.enum(["rf_power","antenna_basics"]),locale:z.enum(["el","en"]),answer_index:z.number().int().min(0).max(2).optional()}),
    outputSchema:z.strictObject({topic:z.enum(["rf_power","antenna_basics"]),locale:z.enum(["el","en"]),question:z.string(),options:z.array(z.string()).length(3),correct:z.boolean().optional(),formula_revision:z.literal("M36-v1"),disclaimer:z.string()}),
    annotations:w2ro
  },async(args)=>{try{return w2response(academyExercise(args))}catch(e){return w2error(e)}});


  const w3ro={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
  const title=z.string().regex(/^[A-Za-z0-9_][A-Za-z0-9_ .-]{0,63}$/);
  const w3number=z.number().finite();
  const w3list=z.array(z.string());
  function w3response(output:Record<string,unknown>){return {content:[{type:"text" as const,text:JSON.stringify(output)}],structuredContent:output};}
  function w3error(error:unknown){return {content:[{type:"text" as const,text:error instanceof Error?error.message:"INVALID_INPUT"}],isError:true};}
  server.registerTool("digital_setup_guide",{
    title:"Generic read-only digital interface checklist",
    description:"Offline device-UNVERIFIED CAT/audio educational checklist. No actual rig commands, manufacturer facts, PTT or external manuals.",
    inputSchema:z.strictObject({rig:title,software:title,os:z.enum(["linux","windows","macos"])}),
    outputSchema:z.strictObject({rig:title,software:title,os:z.enum(["linux","windows","macos"]),steps:w3list,manual_citations:w3list,verified_for_device:z.literal(false),warnings:w3list,formula_revision:z.literal("M28-v1")}),
    annotations:w3ro
  },async(args)=>{try{return w3response(digitalSetupGuide(args))}catch(e){return w3error(e)}});
  server.registerTool("repeater_channel_preview",{
    title:"User-supplied channel frequency preview",
    description:"No directory lookup, transmit permission determination, CAT/radio programming or device access. From explicit operator-provided channel only.",
    inputSchema:z.strictObject({frequency_hz:w3number.int().min(100_000).max(10_000_000_000),offset_hz:w3number.int().min(-100_000_000).max(100_000_000),tone_hz:w3number.min(0).max(300)}),
    outputSchema:z.strictObject({rx_frequency_hz:w3number,tx_frequency_hz:w3number,offset_hz:w3number,tone_hz:w3number,verified_directory:z.literal(false),programmed:z.literal(false),warnings:w3list,formula_revision:z.literal("M30-v1")}),
    annotations:w3ro
  },async(args)=>{try{return w3response(repeaterChannelPreview(args))}catch(e){return w3error(e)}});
  server.registerTool("contest_plan",{
    title:"Generic hypothetical contest session schedule",
    description:"Only user-given event title and UTC window; no rules retrieval, licensing or official contest schedule assertion.",
    inputSchema:z.strictObject({event_name:title,start_utc:z.string().regex(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$/),duration_minutes:z.number().int().min(30).max(1440)}),
    outputSchema:z.strictObject({event_name:title,blocks:z.array(z.strictObject({start_utc:z.string(),end_utc:z.string(),activity:z.string()})).length(3),rules_verified:z.literal(false),warnings:w3list,formula_revision:z.literal("M33-v1")}),
    annotations:w3ro
  },async(args)=>{try{return w3response(contestPlan(args))}catch(e){return w3error(e)}});
  server.registerTool("maker_project_review",{
    title:"Unverified maker BOM learning checklist",
    description:"Offline educational review of user-supplied components, no electrical certification, powered operations or radio control.",
    inputSchema:z.strictObject({goal:title,components:z.array(z.strictObject({name:title,quantity:z.number().int().min(1).max(1000)})).min(1).max(24)}),
    outputSchema:z.strictObject({goal:title,components:z.array(z.strictObject({name:title,quantity:z.number().int()})),component_count:z.number().int().positive(),verified_safe:z.literal(false),test_plan:w3list,warnings:w3list,formula_revision:z.literal("M37-v1")}),
    annotations:w3ro
  },async(args)=>{try{return w3response(makerProjectReview(args))}catch(e){return w3error(e)}});
  server.registerTool("club_workshop_plan",{
    title:"Privacy-safe offline workshop agenda",
    description:"Generic educational club workshop template; no club member information, inventory retrieval or private records.",
    inputSchema:z.strictObject({topic:title,participants:z.number().int().min(1).max(100),locale:z.enum(["el","en"])}),
    outputSchema:z.strictObject({topic:title,participants:z.number().int().min(1).max(100),locale:z.enum(["el","en"]),agenda:w3list,materials:w3list,club_inventory_accessed:z.literal(false),privacy_notes:w3list,formula_revision:z.literal("M38-v1")}),
    annotations:w3ro
  },async(args)=>{try{return w3response(clubWorkshopPlan(args))}catch(e){return w3error(e)}});

  return server;
}
