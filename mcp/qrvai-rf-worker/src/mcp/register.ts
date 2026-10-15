import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod/v4";
import { convertPower, PowerInputError } from "../rf/power.ts";
import { calculateLinkBudget, LinkBudgetInputError } from "../rf/link-budget.ts";
import { calculateImpedance, ImpedanceInputError } from "../rf/impedance.ts";

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
  return server;
}
