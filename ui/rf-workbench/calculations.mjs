// QRVAI RF Workbench — educational, deterministic, offline calculations.
// No network, station control, legal permission check, or external source claims.
export const SPEED_OF_LIGHT_M_S = 299792458;

function numberInRange(label, x, minimum, maximum, excludeMinimum = false) {
  if (typeof x !== "number" || !Number.isFinite(x) ||
    (excludeMinimum ? x <= minimum : x < minimum) || x > maximum) {
    throw new RangeError(`${label}: must be a finite number in ${excludeMinimum ? "(" : "["}${minimum}, ${maximum}]`);
  }
  return x;
}

export function convertPower({ value, unit }) {
  numberInRange("power input", value, -300, 1_000_000_000);
  let watts;
  switch (unit) {
    case "W": watts = value; break;
    case "mW": watts = value / 1000; break;
    case "dBm": watts = 10 ** ((value - 30) / 10); break;
    case "dBW": watts = 10 ** (value / 10); break;
    default: throw new RangeError("Unsupported power unit");
  }
  numberInRange("power (W)", watts, 1e-15, 1e9);
  return { watts, milliwatts: watts * 1000, dBm: 10 * Math.log10(watts * 1000), dBW: 10 * Math.log10(watts) };
}

export function feedlineLoss({
  frequencyMHz, lowMHz, highMHz, lowLossDbPer100m, highLossDbPer100m,
  lengthM, connectorLossDb
}) {
  numberInRange("low frequency (MHz)", lowMHz, 0, 100_000, true);
  numberInRange("high frequency (MHz)", highMHz, lowMHz, 100_000, true);
  numberInRange("frequency (MHz)", frequencyMHz, lowMHz, highMHz);
  numberInRange("low reference loss (dB/100 m)", lowLossDbPer100m, 0, 2000, true);
  numberInRange("high reference loss (dB/100 m)", highLossDbPer100m, 0, 2000, true);
  numberInRange("cable length (m)", lengthM, 0, 100_000);
  numberInRange("connectors (dB)", connectorLossDb, 0, 100);
  // Log-log interpolation only, with no extrapolation outside supplied measurement points.
  const exponent = Math.log(highLossDbPer100m / lowLossDbPer100m) / Math.log(highMHz / lowMHz);
  const dbPer100m = lowLossDbPer100m * (frequencyMHz / lowMHz) ** exponent;
  const cableLossDb = dbPer100m * lengthM / 100;
  return { dbPer100m, cableLossDb, connectorLossDb, totalLossDb: cableLossDb + connectorLossDb, interpolation: "log-log", source: "USER_SUPPLIED_UNVERIFIED" };
}

export function linkBudget({
  txWatts, frequencyMHz, distanceKm, txGainDbi, rxGainDbi, txLossDb,
  rxLossDb, receiverSensitivityDbm
}) {
  numberInRange("TX power (W)", txWatts, 0, 1e9, true);
  numberInRange("frequency (MHz)", frequencyMHz, 0, 100_000, true);
  numberInRange("distance (km)", distanceKm, 0, 1e9, true);
  numberInRange("TX antenna gain (dBi)", txGainDbi, -100, 100);
  numberInRange("RX antenna gain (dBi)", rxGainDbi, -100, 100);
  numberInRange("TX feedline loss (dB)", txLossDb, 0, 300);
  numberInRange("RX feedline loss (dB)", rxLossDb, 0, 300);
  numberInRange("receiver sensitivity (dBm)", receiverSensitivityDbm, -300, 100);
  const txDbm = 10 * Math.log10(txWatts * 1000);
  const eirpDbm = txDbm + txGainDbi - txLossDb;
  const fsplDb = 20 * Math.log10(4 * Math.PI * distanceKm * 1000 * frequencyMHz * 1e6 / SPEED_OF_LIGHT_M_S);
  const receivedDbm = eirpDbm + rxGainDbi - rxLossDb - fsplDb;
  const marginDb = receivedDbm - receiverSensitivityDbm;
  if (![txDbm, eirpDbm, fsplDb, receivedDbm, marginDb].every(Number.isFinite)) throw new RangeError("Numerical overflow");
  return { txDbm, eirpDbm, fsplDb, receivedDbm, marginDb, exceedsSensitivity: marginDb >= 0, model: "IDEAL_FREE_SPACE_ONLY", legalPermissionVerified: false };
}
