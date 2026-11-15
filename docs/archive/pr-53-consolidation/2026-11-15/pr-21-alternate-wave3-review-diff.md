# Historical divergent PR #21 — complete path-identified review patch excerpts

Snapshot: 2026-11-15
Original PR: https://github.com/heraklist/QRVAI-Ready-to-assist-Amateur-Radio-Intelligence/pull/21
Original HEAD: ba2f5c638dd94455805c6cd53312947a62eb7d1e
Compared to: original PR base feat/mcp-wave2-public-education-20261015; **not** a direct patch against #53.
Status: **archive only; DO NOT apply or execute directly**. Historical code API differs from canonical #53. This file preserves every file patch returned by GitHub for the PR for audit and manual selective porting.

## docs/architecture/mcp-implementation-register.md (modified; 46 lines changed)

```diff
@@ -1,53 +1,53 @@
- SOURCE IMPLEMENTED IN DRAFT | `academy_exercise` | SOURCE IMPLEMENTED IN DRAFT | `emcomm_readiness` | SOURCE IMPLEMENTED IN DRAFT | `emcomm_drill` | SOURCE IMPLEMENTED IN DRAFT | `packet_route_preview` | SOURCE IMPLEMENTED IN DRAFT | `geo_bearing` | SOURCE IMPLEMENTED IN DRAFT | `power_autonomy` | SOURCE IMPLEMENTED IN DRAFT | `station_signal_path` | SOURCE IMPLEMENTED IN DRAFT | `rf_filter_response` | SOURCE IMPLEMENTED IN DRAFT | `antenna_matching` | SOURCE IMPLEMENTED IN DRAFT | `antenna_geometry` | SOURCE IMPLEMENTED IN DRAFT | `core_capabilities` |# QRVAI MCP implementation register — 2026-10-15
+# QRVAI MCP implementation register — 2026-10-15
 
 **Runtime policy:** Vercel Node.js Functions only; no Cloudflare runtime, fallback or connector.
 
-**Implemented in this draft source chain:** fifteen RF/core, simulation and education tools in `mcp/qrvai-rf-worker/src/mcp/register.ts`, available through the `/api/mcp` source adapter, gated by Bearer authentication. All remaining candidate catalog contracts are proposals, **NOT registered endpoints**, **NOT deployed**. Exact registered names deliberately differ from the conceptual dotted M07–M10 names; consumer code must use only the registered names. M09 implementation accepts user-provided bounded profiles rather than the proposed vendor cable-ID database.
+**Implemented in this draft source chain:** twenty bounded RF/core and public educational tools in `mcp/qrvai-rf-worker/src/mcp/register.ts`, available through the `/api/mcp` source adapter, gated by Bearer authentication. All remaining candidate catalog contracts are proposals, **NOT registered endpoints**, **NOT deployed**. Exact registered names deliberately differ from the conceptual dotted M07–M10 names; consumer code must use only the registered names. M09 implementation accepts user-provided bounded profiles rather than the proposed vendor cable-ID database.
 
 **Real deployment status:** protected Vercel feature-branch preview READY; HTTPS no-token request returns 503 (expected fail-closed). Real credentialed tools/list, tools/call, production and ChatGPT @QRVAI host acceptance remain blocked/unverified.
 
 | Candidate ID | Concept method | Engine | Access class | Implementation | Registered MCP name |
 |---|---|---|---|---|---|
-| M01 | `qrvai.core.capabilities` | E18 | public | NOT IMPLEMENTED | — |
+| M01 | `qrvai.core.capabilities` | E18 | public | SOURCE IMPLEMENTED IN DRAFT | `core_capabilities` |
 | M02 | `qrvai.source.lookup` | E06/E18 | public | NOT IMPLEMENTED | — |
 | M03 | `qrvai.station.get_profile` | E18 | profile.read | NOT IMPLEMENTED | — |
 | M04 | `qrvai.regulatory.check_operation` | E01 | public | NOT IMPLEMENTED | — |
 | M05 | `qrvai.spectrum.band_segments` | E02 | public | NOT IMPLEMENTED | — |
 | M06 | `qrvai.spectrum.find_repeaters` | E02 | public | NOT IMPLEMENTED | — |
-| M07 | `qrvai.rf.convert_power` | E03 | public | SOURCE IMPLEMENTED | `rf_power_convert` |
-| M08 | `qrvai.rf.link_budget` | E03 | public | SOURCE IMPLEMENTED | `rf_link_budget` |
-| M09 | `qrvai.rf.feedline_loss` | E03 | public | SOURCE IMPLEMENTED | `rf_feedline_loss` |
-| M10 | `qrvai.rf.impedance` | E03 | public | SOURCE IMPLEMENTED | `rf_impedance` |
-| M11 | `qrvai.antenna.geometry` | E04 | public | NOT IMPLEMENTED | — |
-| M12 | `qrvai.antenna.matching` | E03 | public | NOT IMPLEMENTED | — |
-| M13 | `qrvai.rf.filter_response` | E03 | public | NOT IMPLEMENTED | — |
+| M07 | `qrvai.rf.convert_power` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `rf_power_convert` |
+| M08 | `qrvai.rf.link_budget` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `rf_link_budget` |
+| M09 | `qrvai.rf.feedline_loss` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `rf_feedline_loss` |
+| M10 | `qrvai.rf.impedance` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `rf_impedance` |
+| M11 | `qrvai.antenna.geometry` | E04 | public | SOURCE IMPLEMENTED IN DRAFT | `antenna_geometry` |
+| M12 | `qrvai.antenna.matching` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `antenna_matching` |
+| M13 | `qrvai.rf.filter_response` | E03 | public | SOURCE IMPLEMENTED IN DRAFT | `rf_filter_response` |
 | M14 | `qrvai.rf.exposure_screen` | E01/E03 | public | NOT IMPLEMENTED | — |
 | M15 | `qrvai.measurements.inspect_trace` | E05 | user.file.read | NOT IMPLEMENTED | — |
 | M16 | `qrvai.sdr.inspect_iq` | E05 | user.file.read | NOT IMPLEMENTED | — |
 | M17 | `qrvai.manual.find` | E06 | public | NOT IMPLEMENTED | — |
 | M18 | `qrvai.manual.answer_cited` | E06 | public/user.file.read | NOT IMPLEMENTED | — |
 | M19 | `qrvai.equipment.diagnose` | E06/E07 | public | NOT IMPLEMENTED | — |
-| M20 | `qrvai.station.signal_path` | E07 | public | NOT IMPLEMENTED | — |
+| M20 | `qrvai.station.signal_path` | E07 | public | SOURCE IMPLEMENTED IN DRAFT | `station_signal_path` |
 | M21 | `qrvai.station.read_status` | E07 | device.read | NOT IMPLEMENTED | — |
-| M22 | `qrvai.power.autonomy` | E08 | public | NOT IMPLEMENTED | — |
+| M22 | `qrvai.power.autonomy` | E08 | public | SOURCE IMPLEMENTED IN DRAFT | `power_autonomy` |
 | M23 | `qrvai.spaceweather.indices` | E11 | public | NOT IMPLEMENTED | — |
 | M24 | `qrvai.propagation.path` | E09/E10 | public | NOT IMPLEMENTED | — |
-| M25 | `qrvai.geo.bearing` | E09 | public | NOT IMPLEMENTED | — |
+| M25 | `qrvai.geo.bearing` | E09 | public | SOURCE IMPLEMENTED IN DRAFT | `geo_bearing` |
 | M26 | `qrvai.satellite.pass` | E13 | public | NOT IMPLEMENTED | — |
 | M27 | `qrvai.dx.reception_reports` | E11 | public/provider.auth | NOT IMPLEMENTED | — |
-| M28 | `qrvai.digital.setup_guide` | E07/E12 | public | NOT IMPLEMENTED | — |
-| M29 | `qrvai.packet.route_preview` | E12 | public | NOT IMPLEMENTED | — |
-| M30 | `qrvai.repeater.channel_preview` | E02/E12 | public | NOT IMPLEMENTED | — |
+| M28 | `qrvai.digital.setup_guide` | E07/E12 | public | SOURCE IMPLEMENTED IN DRAFT | `digital_setup_guide` |
+| M29 | `qrvai.packet.route_preview` | E12 | public | SOURCE IMPLEMENTED IN DRAFT | `packet_route_preview` |
+| M30 | `qrvai.repeater.channel_preview` | E02/E12 | public | SOURCE IMPLEMENTED IN DRAFT | `repeater_channel_preview` |
 | M31 | `qrvai.log.adif_validate` | E14 | user.file.read | NOT IMPLEMENTED | — |
 | M32 | `qrvai.log.award_progress` | E14 | logs.read | NOT IMPLEMENTED | — |
-| M33 | `qrvai.contest.plan` | E14/E08 | public | NOT IMPLEMENTED | — |
-| M34 | `qrvai.emcomm.drill` | E15 | public | NOT IMPLEMENTED | — |
-| M35 | `qrvai.emcomm.readiness` | E15/E08 | public | NOT IMPLEMENTED | — |
-| M36 | `qrvai.academy.exercise` | E16 | public | NOT IMPLEMENTED | — |
-| M37 | `qrvai.maker.project_review` | E17/E03 | public | NOT IMPLEMENTED | — |
-| M38 | `qrvai.club.workshop_plan` | E17 | public/club.data.read | NOT IMPLEMENTED | — |
+| M33 | `qrvai.contest.plan` | E14/E08 | public | SOURCE IMPLEMENTED IN DRAFT | `contest_plan` |
+| M34 | `qrvai.emcomm.drill` | E15 | public | SOURCE IMPLEMENTED IN DRAFT | `emcomm_drill` |
+| M35 | `qrvai.emcomm.readiness` | E15/E08 | public | SOURCE IMPLEMENTED IN DRAFT | `emcomm_readiness` |
+| M36 | `qrvai.academy.exercise` | E16 | public | SOURCE IMPLEMENTED IN DRAFT | `academy_exercise` |
+| M37 | `qrvai.maker.project_review` | E17/E03 | public | SOURCE IMPLEMENTED IN DRAFT | `maker_project_review` |
+| M38 | `qrvai.club.workshop_plan` | E17 | public/club.data.read | SOURCE IMPLEMENTED IN DRAFT | `club_workshop_plan` |
 
-**Completion count (dependent draft branches, not main):** 15/38 catalog capabilities mapped to actual source MCP registrations; 23 remain unimplemented. Counts do not certify authenticated live endpoint or production integration.
+**Completion count (dependent draft branches, not main):** 20/38 catalog capabilities mapped to actual source MCP registrations; 18 remain unimplemented. Counts do not certify authenticated live endpoint or production integration.
 
 **Readiness gates:** reproducible tests and precise source SHA → authenticated real preview HTTPS protocol proof → Vercel quotas, firewall, token/OAuth fit and safe operations → authorized production release → first new clean Plugin Creator identity and deferred host end-to-end. No fake data, licensed feed substitutions or dummy tools are allowed to fill gaps.
 
```

## docs/superpowers/specs/2026-10-15-qrvai-wave3-offline-operator-tools.md (added; 19 lines changed)

```diff
@@ -0,0 +1,19 @@
+# QRVAI Wave 3 — bounded offline operator helpers
+
+Date: 2026-10-15. Base: Wave 2 PR #19 at SHA 256eaf097693762ae2c7e3618aa94781fdac09fe. Delivery: Draft PR dependent on #19, #18 and #17; Vercel preview only; no production merge.
+
+## Scope decision
+Introduce five of the remaining candidate methods without source fetching, privacy-sensitive log access or radio/device mutation:
+- M28 **digital_setup_guide**: abstract generic CAT/audio software connection checklist based on user-supplied operating system, rig and software identifiers. Return *no model-specific commands* and no fictional citations.
+- M30 **repeater_channel_preview**: only generate memory settings from *explicit operator-supplied frequency/offset/tone*; cannot lookup repeater IDs, assert legal permissions or program a radio. Distinguish it from conceptual repeater_id/provider directory contract.
+- M33 **contest_plan**: generic session/duty schedule using explicit operator-supplied start UTC, event title and minutes; do not assert contest rules without verified source.
+- M37 **maker_project_review**: bounded, offline informational BOM review and safe bench checklist with a mandatory unverified warnings field; never certify a build.
+- M38 **club_workshop_plan**: offline generic amateur-radio training agenda from explicit topic and participants, no participant identities or club private inventory.
+
+## Acceptance and guardrails
+1. Strict versioned Zod inputSchema/outputSchema, data-independent bounded arrays and strings, readOnlyHint, no network/file/device access. Clear simulated/user-supplied status.
+2. Explicitly reject misleading operation claims (provider data, legal approval, rig-specific guidance, dispatch); optionally return UNVERIFIED where information is insufficient.
+3. Before source implementation, execute failing unit tests via GitHub Actions (RED); fix failing compilation-only tests until meaningful missing-function RED evidence is recorded.
+4. Verify in-memory SDK `listTools` names/order, count 20, typed tool calls and invalid paths. Verify Node, Python, TypeScript and Preview READY for exact head SHA.
+5. Fix the broken implementation-register table replacement in Wave 2: reconstruct rows from candidate documentation, updating only actually implemented names and marking remaining entries NOT IMPLEMENTED. Wave 3 canonical count 20/38, remaining 18, **source only**.
+6. Deployment remains a Vercel protected preview with bearer gate. No ChatGPT connector or production deployment authorized.
```

## mcp/qrvai-rf-worker/package.json (modified; 2 lines changed)

```diff
@@ -4,7 +4,7 @@
   "private": true,
   "type": "module",
   "scripts": {
-    "test": "node --experimental-strip-types --test test/power.spec.ts test/link-budget.spec.ts test/impedance.spec.ts test/feedline.spec.ts test/validation.spec.ts test/register.spec.ts test/protocol.spec.ts test/http-limits.spec.ts test/source-boundary.spec.ts test/release-gates.spec.ts test/vercel-protocol.spec.ts test/wave1.spec.ts test/wave2.spec.ts",
+    "test": "node --experimental-strip-types --test test/power.spec.ts test/link-budget.spec.ts test/impedance.spec.ts test/feedline.spec.ts test/validation.spec.ts test/register.spec.ts test/protocol.spec.ts test/http-limits.spec.ts test/source-boundary.spec.ts test/release-gates.spec.ts test/vercel-protocol.spec.ts test/wave1.spec.ts test/wave2.spec.ts test/wave3.spec.ts",
     "typecheck": "tsc --noEmit",
     "verify:https": "node scripts/verify-https.mjs"
   },
```

## mcp/qrvai-rf-worker/src/mcp/register.ts (modified; 46 lines changed)

```diff
@@ -1,5 +1,6 @@
 import { McpServer } from "@modelcontextprotocol/server";
 import { z } from "zod/v4";
+import {digitalSetupGuide,repeaterChannelPreview,contestPlan,makerProjectReview,clubWorkshopPlan} from "../rf/wave3.ts";
 import {stationSignalPath,packetRoutePreview,emcommDrill,emcommReadiness,academyExercise} from "../rf/wave2.ts";
 import {describeWave1,antennaGeometry,antennaMatching,filterResponse,powerAutonomy,geoBearing} from "../rf/wave1.ts";
 import { convertPower, PowerInputError } from "../rf/power.ts";
@@ -159,7 +160,7 @@ export function createServer(): McpServer {
   function response(output:Record<string,unknown>){return {content:[{type:"text" as const,text:JSON.stringify(output)}],structuredContent:output};}
   function failed(error:unknown){return {content:[{type:"text" as const,text:error instanceof Error?error.message:"INVALID_INPUT"}],isError:true};}
   server.registerTool("core_capabilities",{
-    title:"Implemented QRVAI MCP tools",description:"Discover ten implemented read-only RF/core MCP tools; never claims unimplemented candidates.",
+    title:"Implemented QRVAI MCP tools",description:"Discover twenty implemented read-only RF/core and educational MCP tools; never claims unimplemented candidates.",
     inputSchema:z.strictObject({}),
     outputSchema:z.strictObject({tools:z.array(z.strictObject({candidate_id:z.string(),name:z.string(),scope:z.string()})),implemented_count:z.number().int().positive()}),
     annotations:ro
@@ -232,5 +233,48 @@ export function createServer(): McpServer {
     annotations:w2ro
   },async(args)=>{try{return w2response(academyExercise(args))}catch(e){return w2error(e)}});
 
+
+  const w3ro={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
+  const title=z.string().regex(/^[A-Za-z0-9_][A-Za-z0-9_ .-]{0,63}$/);
+  const w3number=z.number().finite();
+  const w3list=z.array(z.string());
+  function w3response(output:Record<string,unknown>){return {content:[{type:"text" as const,text:JSON.stringify(output)}],structuredContent:output};}
+  function w3error(error:unknown){return {content:[{type:"text" as const,text:error instanceof Error?error.message:"INVALID_INPUT"}],isError:true};}
+  server.registerTool("digital_setup_guide",{
+    title:"Generic read-only digital interface checklist",
+    description:"Offline device-UNVERIFIED CAT/audio educational checklist. No actual rig commands, manufacturer facts, PTT or external manuals.",
+    inputSchema:z.strictObject({rig:title,software:title,os:z.enum(["linux","windows","macos"])}),
+    outputSchema:z.strictObject({rig:title,software:title,os:z.enum(["linux","windows","macos"]),steps:w3list,manual_citations:w3list,verified_for_device:z.literal(false),warnings:w3list,formula_revision:z.literal("M28-v1")}),
+    annotations:w3ro
+  },async(args)=>{try{return w3response(digitalSetupGuide(args))}catch(e){return w3error(e)}});
+  server.registerTool("repeater_channel_preview",{
+    title:"User-supplied channel frequency preview",
+    description:"No directory lookup, transmit permission determination, CAT/radio programming or device access. From explicit operator-provided channel only.",
+    inputSchema:z.strictObject({frequency_hz:w3number.int().min(100_000).max(10_000_000_000),offset_hz:w3number.int().min(-100_000_000).max(100_000_000),tone_hz:w3number.min(0).max(300)}),
+    outputSchema:z.strictObject({rx_frequency_hz:w3number,tx_frequency_hz:w3number,offset_hz:w3number,tone_hz:w3number,verified_directory:z.literal(false),programmed:z.literal(false),warnings:w3list,formula_revision:z.literal("M30-v1")}),
+    annotations:w3ro
+  },async(args)=>{try{return w3response(repeaterChannelPreview(args))}catch(e){return w3error(e)}});
+  server.registerTool("contest_plan",{
+    title:"Generic hypothetical contest session schedule",
+    description:"Only user-given event title and UTC window; no rules retrieval, licensing or official contest schedule assertion.",
+    inputSchema:z.strictObject({event_name:title,start_utc:z.string().regex(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$/),duration_minutes:z.number().int().min(30).max(1440)}),
+    outputSchema:z.strictObject({event_name:title,blocks:z.array(z.strictObject({start_utc:z.string(),end_utc:z.string(),activity:z.string()})).length(3),rules_verified:z.literal(false),warnings:w3list,formula_revision:z.literal("M33-v1")}),
+    annotations:w3ro
+  },async(args)=>{try{return w3response(contestPlan(args))}catch(e){return w3error(e)}});
+  server.registerTool("maker_project_review",{
+    title:"Unverified maker BOM learning checklist",
+    description:"Offline educational review of user-supplied components, no electrical certification, powered operations or radio control.",
+    inputSchema:z.strictObject({goal:title,components:z.array(z.strictObject({name:title,quantity:z.number().int().min(1).max(1000)})).min(1).max(24)}),
+    outputSchema:z.strictObject({goal:title,components:z.array(z.strictObject({name:title,quantity:z.number().int()})),component_count:z.number().int().positive(),verified_safe:z.literal(false),test_plan:w3list,warnings:w3list,formula_revision:z.literal("M37-v1")}),
+    annotations:w3ro
+  },async(args)=>{try{return w3response(makerProjectReview(args))}catch(e){return w3error(e)}});
+  server.registerTool("club_workshop_plan",{
+    title:"Privacy-safe offline workshop agenda",
+    description:"Generic educational club workshop template; no club member information, inventory retrieval or private records.",
+    inputSchema:z.strictObject({topic:title,participants:z.number().int().min(1).max(100),locale:z.enum(["el","en"])}),
+    outputSchema:z.strictObject({topic:title,participants:z.number().int().min(1).max(100),locale:z.enum(["el","en"]),agenda:w3list,materials:w3list,club_inventory_accessed:z.literal(false),privacy_notes:w3list,formula_revision:z.literal("M38-v1")}),
+    annotations:w3ro
+  },async(args)=>{try{return w3response(clubWorkshopPlan(args))}catch(e){return w3error(e)}});
+
   return server;
 }
```

## mcp/qrvai-rf-worker/src/rf/wave1.ts (modified; 7 lines changed)

```diff
@@ -14,7 +14,12 @@ export const IMPLEMENTED_TOOLS:readonly ToolDescriptor[] = Object.freeze([
   {candidate_id:"M29",name:"packet_route_preview",scope:"Simulated AX25/APRS path"},
   {candidate_id:"M34",name:"emcomm_drill",scope:"Classroom-only emergency exercise"},
   {candidate_id:"M35",name:"emcomm_readiness",scope:"Hypothetical emergency-training resource gaps"},
-  {candidate_id:"M36",name:"academy_exercise",scope:"Fixed educational questions"}
+  {candidate_id:"M36",name:"academy_exercise",scope:"Fixed educational questions"},
+  {candidate_id:"M28",name:"digital_setup_guide",scope:"Generic offline digital setup notes"},
+  {candidate_id:"M30",name:"repeater_channel_preview",scope:"User-supplied unverified channel preview"},
+  {candidate_id:"M33",name:"contest_plan",scope:"Generic schedule without contest rule claims"},
+  {candidate_id:"M37",name:"maker_project_review",scope:"Unverified maker BOM and review checklist"},
+  {candidate_id:"M38",name:"club_workshop_plan",scope:"Privacy-safe generic club agenda"}
 ]);
 export function describeWave1():ToolDescriptor[]{return IMPLEMENTED_TOOLS.map(x=>({...x}));}
 const C=299792458;
```

## mcp/qrvai-rf-worker/src/rf/wave3.ts (added; 32 lines changed)

```diff
@@ -0,0 +1,32 @@
+const token=(s:string,label:string)=>{if(typeof s!=="string"||! /^[A-Za-z0-9_][A-Za-z0-9_ .-]{0,63}$/.test(s))throw new RangeError("Invalid "+label);return s;};
+const integer=(n:number,min:number,max:number,label:string)=>{if(!Number.isInteger(n)||n<min||n>max)throw new RangeError("Invalid "+label);return n;};
+const finite=(n:number,label:string)=>{if(typeof n!=="number"||!Number.isFinite(n))throw new RangeError("Invalid "+label);return n;};
+export function digitalSetupGuide(x:{rig:string;software:string;os:"linux"|"windows"|"macos"}){
+ const rig=token(x.rig,"rig"),software=token(x.software,"software");
+ if(!["linux","windows","macos"].includes(x.os))throw new RangeError("Unsupported OS");
+ return {rig,software,os:x.os,steps:["Confirm the radio is powered OFF before connecting cables","Read manufacturer-specific radio and interface manuals for approved audio/CAT connections","Configure generic port permissions and sample-rate agreement according to trusted manuals","Perform receive-only dry-run; do not key PTT or send control commands"],manual_citations:[] as string[],verified_for_device:false,warnings:["UNVERIFIED generic steps; no manufacturer, firmware or software version data was fetched"],formula_revision:"M28-v1"} as const;
+}
+export function repeaterChannelPreview(x:{frequency_hz:number;offset_hz:number;tone_hz:number}){
+ const rx=finite(x.frequency_hz,"frequency"),offset=finite(x.offset_hz,"offset"),tone=finite(x.tone_hz,"tone");
+ if(rx<100_000||rx>10_000_000_000||Math.abs(offset)>100_000_000||tone<0||tone>300)throw new RangeError("Out of bounds");
+ const tx=rx+offset;if(!Number.isSafeInteger(tx)||tx<=0||!Number.isSafeInteger(rx)||!Number.isSafeInteger(offset))throw new RangeError("Invalid TX frequency");
+ return {rx_frequency_hz:rx,tx_frequency_hz:tx,offset_hz:offset,tone_hz:tone,verified_directory:false,programmed:false,warnings:["Only user-supplied hypothetical channel parameters; check local regulatory authorizations and independently verify repeater data"],formula_revision:"M30-v1"} as const;
+}
+export function contestPlan(x:{event_name:string;start_utc:string;duration_minutes:number}){
+ const event_name=token(x.event_name,"event"),mins=integer(x.duration_minutes,30,1440,"duration");if(typeof x.start_utc!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(x.start_utc))throw new RangeError("UTC timestamp required");
+ const start=Date.parse(x.start_utc);if(!Number.isFinite(start)||new Date(start).toISOString().slice(0,19)+"Z"!==x.start_utc)throw new RangeError("Invalid UTC timestamp");
+ const boundaries=[0,Math.floor(mins/3),Math.floor(mins*2/3),mins],phases=["Preparation and rules self-check","Receive-only equipment check / operator rest","Operator debrief and log self-review"];
+ const blocks=phases.map((activity,i)=>({start_utc:new Date(start+boundaries[i]!*60_000).toISOString(),end_utc:new Date(start+boundaries[i+1]!*60_000).toISOString(),activity}));
+ return {event_name,blocks,rules_verified:false,warnings:["Illustrative time boxes only: does not validate actual contest dates, rules or on-air permissions"],formula_revision:"M33-v1"} as const;
+}
+export function makerProjectReview(x:{goal:string;components:{name:string;quantity:number}[]}){
+ const goal=token(x.goal,"goal");if(!Array.isArray(x.components)||x.components.length<1||x.components.length>24)throw new RangeError("Invalid BOM length");
+ const components=x.components.map(c=>({name:token(c.name,"component"),quantity:integer(c.quantity,1,1000,"quantity")}));if(new Set(components.map(c=>c.name.toLowerCase())).size!==components.length)throw new RangeError("Duplicate BOM component");
+ const component_count=components.reduce((sum,c)=>sum+c.quantity,0);
+ return {goal,components,component_count,verified_safe:false,test_plan:["Keep all electrical power off during initial assembly review","Check wiring, mechanical strain relief and insulation against verified component datasheets","Do not transmit or energize before a qualified review and applicable tests"],warnings:["BOM is unverified user input; no electrical ratings, design conformity or safety certification"],formula_revision:"M37-v1"} as const;
+}
+export function clubWorkshopPlan(x:{topic:string;participants:number;locale:"el"|"en"}){
+ const topic=token(x.topic,"topic"),participants=integer(x.participants,1,100,"participants");if(x.locale!=="el"&&x.locale!=="en")throw new RangeError("Invalid locale");
+ const agenda=x.locale==="el"?["Εισαγωγή και στόχοι","Θεωρητική παρουσίαση και ασφαλής επίδειξη χωρίς εκπομπή","Ερωτήσεις, ανακεφαλαίωση και αξιολόγηση"]:["Introduction and learning objectives","Theory and non-transmitting, safety-first demonstration","Questions, recap and learning check"];
+ return {topic,participants,locale:x.locale,agenda,materials:["Whiteboard and printed public-domain learning notes","Receive-only sample diagrams"],club_inventory_accessed:false,privacy_notes:["Do not provide attendance lists, individual identities or private club inventories"],formula_revision:"M38-v1"} as const;
+}
```

## mcp/qrvai-rf-worker/test/protocol.spec.ts (modified; 2 lines changed)

```diff
@@ -2,7 +2,7 @@ import { test } from "node:test";
 import assert from "node:assert/strict";
 import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
 const secret="protocol-test-only-secure-token-123456789";
-const names=["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss","core_capabilities","antenna_geometry","antenna_matching","rf_filter_response","power_autonomy","geo_bearing","station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","academy_exercise"];
+const names=["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss","core_capabilities","antenna_geometry","antenna_matching","rf_filter_response","power_autonomy","geo_bearing","station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","academy_exercise","digital_setup_guide","repeater_channel_preview","contest_plan","maker_project_review","club_workshop_plan"];
 async function fetchMcp(url: URL|string, init?: RequestInit): Promise<Response> {
   const {handleMcpRequest}=await import("../api/mcp.ts");
   const request=new Request(url,init);
```

## mcp/qrvai-rf-worker/test/register.spec.ts (modified; 2 lines changed)

```diff
@@ -11,7 +11,7 @@ test("a real SDK v2 server exposes four RF calculators and returns 50 dBm", asyn
     await server.connect(serverTransport);
     await client.connect(clientTransport);
     const result=await client.listTools();
-    assert.deepEqual(result.tools.map(t=>t.name),["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss","core_capabilities","antenna_geometry","antenna_matching","rf_filter_response","power_autonomy","geo_bearing","station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","academy_exercise"]);
+    assert.deepEqual(result.tools.map(t=>t.name),["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss","core_capabilities","antenna_geometry","antenna_matching","rf_filter_response","power_autonomy","geo_bearing","station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","academy_exercise","digital_setup_guide","repeater_channel_preview","contest_plan","maker_project_review","club_workshop_plan"]);
     assert.ok(result.tools[0]?.annotations?.readOnlyHint);
     const good=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
     assert.notEqual(good.isError,true);
```

## mcp/qrvai-rf-worker/test/source-boundary.spec.ts (modified; 4 lines changed)

```diff
@@ -12,9 +12,9 @@ test("V0 Skills source stays unchanged and has no premature mcp.json",()=>{
     assert.equal(existsSync(file("qrvai/skills/"+name+"/SKILL.md")),true);
   }
 });
-test("fifteen approved stateless read-only RF/core and exercise tools",()=>{
+test("twenty approved stateless read-only RF/core and exercise tools",()=>{
   const source=readFileSync(file("mcp/qrvai-rf-worker/src/mcp/register.ts"),"utf8");
-  assert.equal((source.match(/registerTool\(/g)||[]).length,15);
+  assert.equal((source.match(/registerTool\(/g)||[]).length,20);
   assert.match(source,/rf_power_convert/);
   assert.match(source,/rf_link_budget/);
   assert.match(source,/rf_impedance/);
```

## mcp/qrvai-rf-worker/test/vercel-protocol.spec.ts (modified; 2 lines changed)

```diff
@@ -23,7 +23,7 @@ test("Vercel MCP API exposes all four registered read-only RF tools through Stre
   try {
     await client.connect(transport);
     const list=await client.listTools();
-    assert.deepEqual(list.tools.map(t=>t.name),["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss","core_capabilities","antenna_geometry","antenna_matching","rf_filter_response","power_autonomy","geo_bearing","station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","academy_exercise"]);
+    assert.deepEqual(list.tools.map(t=>t.name),["rf_power_convert","rf_link_budget","rf_impedance","rf_feedline_loss","core_capabilities","antenna_geometry","antenna_matching","rf_filter_response","power_autonomy","geo_bearing","station_signal_path","packet_route_preview","emcomm_drill","emcomm_readiness","academy_exercise","digital_setup_guide","repeater_channel_preview","contest_plan","maker_project_review","club_workshop_plan"]);
     const power=await client.callTool({name:"rf_power_convert",arguments:{value:100,unit:"W"}});
     assert.equal((power.structuredContent as {dBm:number}).dBm,50);
     const line=await client.callTool({name:"rf_feedline_loss",arguments:{profile:{id:"synthetic-coax",revision:"fixture-1",points:[{frequency_hz:10_000_000,loss_db_per_100m:4},{frequency_hz:1_000_000_000,loss_db_per_100m:8}]},frequency_hz:100_000_000,length_m:20,connector_loss_db:0.5,interpolation_method:"log_frequency"}});
```

## mcp/qrvai-rf-worker/test/wave1.spec.ts (modified; 2 lines changed)

```diff
@@ -1,7 +1,7 @@
 import {test} from "node:test";
 import assert from "node:assert/strict";
 import {describeWave1, antennaGeometry, antennaMatching, filterResponse, powerAutonomy, geoBearing} from "../src/rf/wave1.ts";
-test("M01 catalog reports precisely fifteen implemented tools",()=>{const v=describeWave1();assert.equal(v.length,15);assert.equal(new Set(v.map(x=>x.name)).size,15);assert.equal(v.find(x=>x.candidate_id==="M25")?.name,"geo_bearing")});
+test("M01 catalog reports precisely twenty implemented tools",()=>{const v=describeWave1();assert.equal(v.length,20);assert.equal(new Set(v.map(x=>x.name)).size,20);assert.equal(v.find(x=>x.candidate_id==="M25")?.name,"geo_bearing")});
 test("M11 ideal free-space halfwave dipole at 100 MHz",()=>{const v=antennaGeometry({kind:"halfwave_dipole",frequency_hz:100e6,velocity_factor:1});assert.ok(Math.abs(v.total_length_m-1.49896229)<1e-7);assert.ok(Math.abs(v.element_length_m-.749481145)<1e-7)});
 test("M12 ideal transformer for 50 and 200 ohm real loads",()=>{const v=antennaMatching({source_resistance_ohm:50,load_resistance_ohm:200,frequency_hz:100e6,velocity_factor:1});assert.equal(v.transformer_z0_ohm,100);assert.ok(Math.abs(v.quarter_wave_length_m-.749481145)<1e-7)});
 test("M13 one-pole lowpass magnitude at cutoff equals -3.0103 dB",()=>{const v=filterResponse({kind:"lowpass",frequency_hz:1/(2*Math.PI*.001),resistance_ohm:1000,capacitance_f:1e-6});assert.ok(Math.abs(v.magnitude-1/Math.sqrt(2))<1e-12);assert.ok(Math.abs(v.gain_db+3.0102999566)<1e-7)});
```

## mcp/qrvai-rf-worker/test/wave3.spec.ts (added; 13 lines changed)

```diff
@@ -0,0 +1,13 @@
+import {test} from "node:test";
+import assert from "node:assert/strict";
+import {digitalSetupGuide,repeaterChannelPreview,contestPlan,makerProjectReview,clubWorkshopPlan} from "../src/rf/wave3.ts";
+test("M28 only provides generic CAT/audio checklist, no fabricated model instructions",()=>{const v=digitalSetupGuide({rig:"Example_Rig",software:"Example_App",os:"linux"});assert.equal(v.verified_for_device,false);assert.ok(v.steps.length>=3);assert.equal(v.manual_citations.length,0);assert.match(v.warnings.join(" "),/unverified/i)});
+test("M28 rejects unexpected system and external control requests",()=>{assert.throws(()=>digitalSetupGuide({rig:"rig",software:"app",os:"dos" as "linux"}))});
+test("M30 uses explicit frequency, offset and tone and never claims live repeater lookup",()=>{const v=repeaterChannelPreview({frequency_hz:145_600_000,offset_hz:-600_000,tone_hz:88.5});assert.equal(v.tx_frequency_hz,145_000_000);assert.equal(v.rx_frequency_hz,145_600_000);assert.equal(v.verified_directory,false);assert.equal(v.programmed,false)});
+test("M30 rejects invalid negative transmit frequency",()=>assert.throws(()=>repeaterChannelPreview({frequency_hz:100_000,offset_hz:-200_000,tone_hz:88.5})));
+test("M33 makes a generic operator schedule without contest rules",()=>{const v=contestPlan({event_name:"ExampleContest",start_utc:"2026-10-15T18:00:00Z",duration_minutes:90});assert.equal(v.blocks.length,3);assert.equal(v.rules_verified,false);assert.equal(v.blocks[0]?.start_utc,"2026-10-15T18:00:00.000Z")});
+test("M33 rejects impossible timestamps and overflow windows",()=>{assert.throws(()=>contestPlan({event_name:"X",start_utc:"tomorrow",duration_minutes:60}));assert.throws(()=>contestPlan({event_name:"X",start_utc:"2026-10-15T18:00:00Z",duration_minutes:3000}))});
+test("M37 reviews a public bill of materials without electrical certification",()=>{const v=makerProjectReview({goal:"passive antenna",components:[{name:"wire",quantity:3},{name:"insulator",quantity:2}]});assert.equal(v.verified_safe,false);assert.equal(v.component_count,5);assert.ok(v.test_plan.some((s:string)=>/power off/i.test(s)))});
+test("M37 rejects duplicate BOM components and zero quantities",()=>{assert.throws(()=>makerProjectReview({goal:"test",components:[{name:"x",quantity:1},{name:"x",quantity:2}]}));assert.throws(()=>makerProjectReview({goal:"test",components:[{name:"x",quantity:0}]}))});
+test("M38 workshop has privacy-safe generic agenda, no member data",()=>{const v=clubWorkshopPlan({topic:"radio basics",participants:10,locale:"el"});assert.equal(v.club_inventory_accessed,false);assert.equal(v.participants,10);assert.ok(v.agenda.length>=3);assert.ok(v.privacy_notes.length>0)});
+test("M38 participant count bounded",()=>assert.throws(()=>clubWorkshopPlan({topic:"radio basics",participants:9999,locale:"en"})));
```
