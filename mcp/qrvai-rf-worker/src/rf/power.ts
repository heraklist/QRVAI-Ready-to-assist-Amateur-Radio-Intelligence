export type PowerUnit = "W" | "mW" | "dBm" | "dBW";
export type PowerConversion = {
  W: number;
  mW: number;
  dBm: number;
  dBW: number;
  convention: string;
  precisionNote: string;
};
export class PowerInputError extends Error {
  readonly code: "INVALID_INPUT" | "OUT_OF_RANGE";
  constructor(message: string, code: "INVALID_INPUT" | "OUT_OF_RANGE") {
    super(message);
    this.name = "PowerInputError";
    this.code = code;
  }
}

/** A pure unit conversion: no measurements, regulatory decisions, or network access. */
export function convertPower(input: unknown): PowerConversion {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new PowerInputError("power input must be an object", "INVALID_INPUT");
  }
  const proto = Object.getPrototypeOf(input);
  if (proto !== Object.prototype && proto !== null) {
    throw new PowerInputError("unsupported object prototype", "INVALID_INPUT");
  }
  const keys = Reflect.ownKeys(input);
  if (keys.length !== 2 || !keys.includes("value") || !keys.includes("unit")) {
    throw new PowerInputError("power input requires exactly value and unit", "INVALID_INPUT");
  }
  const valueProperty = Object.getOwnPropertyDescriptor(input, "value");
  const unitProperty = Object.getOwnPropertyDescriptor(input, "unit");
  if (!valueProperty || !unitProperty || !("value" in valueProperty) || !("value" in unitProperty)) {
    throw new PowerInputError("accessors are not valid input", "INVALID_INPUT");
  }
  const value: unknown = valueProperty.value;
  const unit: unknown = unitProperty.value;
  if (typeof value !== "number" || !Number.isFinite(value) ||
      !["W","mW","dBm","dBW"].includes(unit as string)) {
    throw new PowerInputError("finite numeric power and recognized unit required", "INVALID_INPUT");
  }
  if ((unit === "W" || unit === "mW") && value <= 0) {
    throw new PowerInputError("linear RF power must be positive", "OUT_OF_RANGE");
  }
  let dBm: number;
  switch (unit) {
    case "W": dBm = 10 * Math.log10(value) + 30; break;
    case "mW": dBm = 10 * Math.log10(value); break;
    case "dBm": dBm = value; break;
    case "dBW": dBm = value + 30; break;
    default: throw new PowerInputError("unsupported unit", "INVALID_INPUT");
  }
  if (!Number.isFinite(dBm) || dBm < -270 || dBm > 270) {
    throw new PowerInputError("power outside supported finite domain", "OUT_OF_RANGE");
  }
  const W = 10 ** ((dBm - 30) / 10);
  const mW = 10 ** (dBm / 10);
  if (!Number.isFinite(W) || !Number.isFinite(mW) || W <= 0 || mW <= 0) {
    throw new PowerInputError("converted power outside finite domain", "OUT_OF_RANGE");
  }
  return {
    W,
    mW,
    dBm,
    dBW: dBm - 30,
    convention: "dBm is referenced to 1 mW; dBW is referenced to 1 W",
    precisionNote: "Finite IEEE-754 double precision; not a physical measurement."
  };
}
