/** ERP and EIRP from transmitter power, losses and antenna gain. ERP is referenced to a half-wave dipole (0 dBd = 2.15 dBi). */
export const DIPOLE_GAIN_DBI = 2.15;

export class ErpInputError extends Error {
  readonly code = "INVALID_INPUT";
  constructor(message: string) { super(message); this.name = "ErpInputError"; }
}

export function erpEirp(input: {tx_power_w: number; feedline_loss_db: number; other_losses_db: number; antenna_gain: number; antenna_gain_unit: "dBi" | "dBd"}) {
  const {tx_power_w: p, feedline_loss_db: fl, other_losses_db: ol, antenna_gain: g, antenna_gain_unit: unit} = input;
  if (!(p > 0) || !Number.isFinite(p) || p > 1e7) throw new ErpInputError("tx_power_w must be a positive finite power up to 10 MW");
  for (const [name, v] of [["feedline_loss_db", fl], ["other_losses_db", ol]] as const) {
    if (!Number.isFinite(v) || v < 0 || v > 200) throw new ErpInputError(`${name} must be 0..200 dB`);
  }
  if (!Number.isFinite(g) || g < -50 || g > 60) throw new ErpInputError("antenna_gain must be -50..60 dB");
  const gainDbi = unit === "dBi" ? g : g + DIPOLE_GAIN_DBI;
  const txDbm = 10 * Math.log10(p) + 30;
  const eirpDbm = txDbm - fl - ol + gainDbi;
  const erpDbm = eirpDbm - DIPOLE_GAIN_DBI;
  const watts = (dbm: number) => 10 ** ((dbm - 30) / 10);
  return {
    tx_power_dbm: txDbm, antenna_gain_dbi: gainDbi, antenna_gain_dbd: gainDbi - DIPOLE_GAIN_DBI, total_loss_db: fl + ol,
    eirp_dbm: eirpDbm, eirp_w: watts(eirpDbm), erp_dbm: erpDbm, erp_w: watts(erpDbm),
    formula_revision: "M50-v1",
    assumptions: "EIRP = P_tx - losses + G(dBi); ERP = EIRP - 2.15 dB. Main-lobe gain, matched system; not an exposure or compliance assessment.",
  };
}
