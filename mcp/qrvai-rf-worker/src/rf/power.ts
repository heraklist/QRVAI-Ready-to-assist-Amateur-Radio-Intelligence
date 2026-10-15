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
  const { value, unit } = input as {value: number; unit: PowerUnit};
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
  return {
    W: 10 ** ((dBm - 30) / 10),
    mW: 10 ** (dBm / 10),
    dBm,
    dBW: dBm - 30,
    convention: "dBm is referenced to 1 mW; dBW is referenced to 1 W",
    precisionNote: "Finite IEEE-754 double precision; not a physical measurement."
  };
}
