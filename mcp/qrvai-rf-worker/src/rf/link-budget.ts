import { convertPower, PowerInputError } from "./power.ts";

const FIELD_NAMES = [
  "tx_w", "tx_gain_dbi", "tx_loss_db", "path_loss_db",
  "rx_gain_dbi", "rx_loss_db", "rx_sensitivity_dbm"
] as const;

type Fields = typeof FIELD_NAMES[number];
export type LinkBudgetStage = { name: string; value_dbm: number };
export type LinkBudgetResult = {
  tx_dbm: number; rx_dbm: number; margin_db: number;
  stages: LinkBudgetStage[]; formula_revision: "M08-v1";
  assumptions: string;
};
export class LinkBudgetInputError extends Error {
  readonly code: "INVALID_INPUT" | "OUT_OF_RANGE";
  constructor(message: string, code: "INVALID_INPUT" | "OUT_OF_RANGE" = "INVALID_INPUT") {
    super(message);
    this.name = "LinkBudgetInputError";
    this.code = code;
  }
}

function parse(input: unknown): Record<Fields, number> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new LinkBudgetInputError("link-budget input must be an object");
  }
  const proto = Object.getPrototypeOf(input);
  if (proto !== Object.prototype && proto !== null) {
    throw new LinkBudgetInputError("unsupported input prototype");
  }
  const actualKeys = Reflect.ownKeys(input);
  if (actualKeys.length !== FIELD_NAMES.length ||
      !FIELD_NAMES.every(key => actualKeys.includes(key))) {
    throw new LinkBudgetInputError("exactly the seven documented fields are required");
  }
  const values: Record<string, number> = {};
  for (const key of FIELD_NAMES) {
    const field = Object.getOwnPropertyDescriptor(input, key);
    if (!field || !("value" in field) ||
        typeof field.value !== "number" || !Number.isFinite(field.value)) {
      throw new LinkBudgetInputError("all fields must contain finite numbers");
    }
    values[key] = field.value;
  }
  if (values.tx_w <= 0) throw new LinkBudgetInputError("transmitter power must be positive", "OUT_OF_RANGE");
  for (const loss of ["tx_loss_db", "path_loss_db", "rx_loss_db"] as const) {
    if (values[loss] < 0) throw new LinkBudgetInputError("losses must be nonnegative");
  }
  return values as Record<Fields, number>;
}

/** Pure RF arithmetic; the path loss is an explicit input, never guessed. */
export function calculateLinkBudget(input: unknown): LinkBudgetResult {
  const data = parse(input);
  let tx_dbm: number;
  try {
    tx_dbm = convertPower({value: data.tx_w, unit: "W"}).dBm;
  } catch (error) {
    if (error instanceof PowerInputError) {
      throw new LinkBudgetInputError(error.message, error.code);
    }
    throw error;
  }
  const stages: LinkBudgetStage[] = [];
  let power = tx_dbm;
  const stage = (name: string, value: number): void => {
    if (!Number.isFinite(value)) throw new LinkBudgetInputError("unrepresentable result", "OUT_OF_RANGE");
    power = value;
    stages.push({name, value_dbm: value});
  };
  stage("tx_power", tx_dbm);
  stage("tx_antenna_gain", power + data.tx_gain_dbi);
  stage("tx_path_loss", power - data.tx_loss_db);
  stage("propagation_path_loss", power - data.path_loss_db);
  stage("rx_antenna_gain", power + data.rx_gain_dbi);
  stage("rx_path_loss", power - data.rx_loss_db);
  const rx_dbm = power;
  const margin_db = rx_dbm - data.rx_sensitivity_dbm;
  if (!Number.isFinite(margin_db)) throw new LinkBudgetInputError("unrepresentable margin", "OUT_OF_RANGE");
  stages.push({name: "receiver_sensitivity", value_dbm: data.rx_sensitivity_dbm});
  return {
    tx_dbm, rx_dbm, margin_db, stages, formula_revision: "M08-v1",
    assumptions: "Power W; gains dBi; all three loss fields nonnegative dB; sensitivity dBm. No inferred propagation model or measurement."
  };
}
