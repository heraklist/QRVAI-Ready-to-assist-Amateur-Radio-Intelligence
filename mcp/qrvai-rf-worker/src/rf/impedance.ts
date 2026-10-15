const NAMES = ["r_ohm","x_ohm","z0_ohm"] as const;
type Field = typeof NAMES[number];

export type ImpedanceResult = {
  gamma_re: number; gamma_im: number; gamma_magnitude: number; gamma_phase_deg: number;
  vswr: number | null; return_loss_db: number | null;
  vswr_status: "FINITE" | "INFINITE" | "NUMERICAL_LIMIT";
  return_loss_status: "FINITE" | "INFINITE";
  formula_revision: "M10-v1"; assumptions: string;
};
export class ImpedanceInputError extends Error {
  readonly code: "INVALID_INPUT" | "OUT_OF_RANGE";
  constructor(message: string, code: "INVALID_INPUT" | "OUT_OF_RANGE" = "INVALID_INPUT") {
    super(message); this.name = "ImpedanceInputError"; this.code = code;
  }
}
function parse(input: unknown): Record<Field,number> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new ImpedanceInputError("impedance input must be an object");
  }
  const proto = Object.getPrototypeOf(input);
  if (proto !== Object.prototype && proto !== null) throw new ImpedanceInputError("unsupported prototype");
  const keys = Reflect.ownKeys(input);
  if (keys.length !== NAMES.length || !NAMES.every(k=>keys.includes(k))) {
    throw new ImpedanceInputError("exactly r_ohm, x_ohm, z0_ohm are required");
  }
  const values:Record<string,number>={};
  for (const field of NAMES){
    const prop=Object.getOwnPropertyDescriptor(input,field);
    if (!prop || !("value" in prop) || typeof prop.value !== "number" || !Number.isFinite(prop.value)) {
      throw new ImpedanceInputError("all impedances must be finite numbers");
    }
    if (Math.abs(prop.value)>1e150) throw new ImpedanceInputError("outside safe numerical range","OUT_OF_RANGE");
    values[field]=prop.value;
  }
  if (values.z0_ohm<=0) throw new ImpedanceInputError("reference impedance must be positive");
  if (values.r_ohm<0) throw new ImpedanceInputError("passive load must have nonnegative resistance");
  return values as Record<Field,number>;
}

/** Passive load Z=R+jX and positive real Z0, no measurements or permissions. */
export function calculateImpedance(input:unknown):ImpedanceResult {
  const {r_ohm:r,x_ohm:x,z0_ohm:z0}=parse(input);
  const denominator=(r+z0)*(r+z0)+x*x;
  if (!(denominator>0) || !Number.isFinite(denominator)) {
    throw new ImpedanceInputError("unstable impedance denominator","OUT_OF_RANGE");
  }
  // (Z-Z0)/(Z+Z0) by complex conjugation.
  const gamma_re=((r-z0)*(r+z0)+x*x)/denominator;
  const gamma_im=2*x*z0/denominator;
  const gamma_magnitude=Math.hypot(gamma_re,gamma_im);
  if (!Number.isFinite(gamma_magnitude)||gamma_magnitude>1+1e-12) {
    throw new ImpedanceInputError("unphysical reflection coefficient","OUT_OF_RANGE");
  }
  // Numeric rounding can make |Gamma| exactly 1 near a near-open load.
  const g=Math.min(1,gamma_magnitude);
  const vswr_status: ImpedanceResult["vswr_status"] =
    g<1 ? "FINITE" : r===0 ? "INFINITE" : "NUMERICAL_LIMIT";
  const vswr=g<1?(1+g)/(1-g):null;
  const return_loss_status: ImpedanceResult["return_loss_status"] =
    g===0 ? "INFINITE" : "FINITE";
  const return_loss_db=g===0?null:-20*Math.log10(g);
  const gamma_phase_deg=Math.atan2(gamma_im,gamma_re)*180/Math.PI;
  if (!Number.isFinite(gamma_re)||!Number.isFinite(gamma_im)||
      !Number.isFinite(gamma_phase_deg)||
      (vswr!==null&&!Number.isFinite(vswr))||
      (return_loss_db!==null&&!Number.isFinite(return_loss_db))) {
    throw new ImpedanceInputError("unrepresentable impedance result","OUT_OF_RANGE");
  }
  return {
    gamma_re,gamma_im,gamma_magnitude:g,gamma_phase_deg,
    vswr, return_loss_db, vswr_status, return_loss_status,
    formula_revision:"M10-v1",
    assumptions:"Passive load R>=0 ohm and real Z0>0 ohm; no VNA measurement. Null means a stated mathematical or precision limit."
  };
}
