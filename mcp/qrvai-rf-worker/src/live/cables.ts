import {calculateFeedlineLoss} from "../rf/feedline.ts";

/**
 * Attenuation tables copied from the manufacturer's datasheets (retrieved 2026-11-15).
 * "typical" = typical dB/100 m at 20 °C; "maximum" = the datasheet's upper bound ("<").
 */
export type Cable = {
  id: string; name: string; manufacturer: string; datasheet_url: string; value_kind: "typical" | "maximum";
  impedance_ohm: number; velocity_factor: number; points_mhz_db100m: [number, number][];
};
export const CATALOG_RETRIEVED = "2026-11-15";

export const CABLES: readonly Cable[] = Object.freeze([
  {id:"ecoflex-10-plus-heatex",name:"Ecoflex 10 Plus Heatex",manufacturer:"SSB-Electronic",datasheet_url:"https://www.ssb.de/media/60300-de.pdf",value_kind:"typical",impedance_ohm:50,velocity_factor:0.85,points_mhz_db100m:[[5,0.76],[10,1.14],[50,2.66],[100,3.8],[144,4.66],[200,5.51],[300,6.94],[432,8.46],[500,9.12],[800,11.88],[1000,13.49],[1296,15.68],[1500,17.01],[1800,18.91],[2000,20.14],[2400,22.42],[3000,25.37],[4000,29.55],[5000,33.44],[6000,37.05],[8000,44.08]]},
  {id:"ecoflex-15-plus-heatex",name:"Ecoflex 15 Plus Heatex",manufacturer:"SSB-Electronic",datasheet_url:"https://www.ssb.de/media/60400-de.pdf",value_kind:"typical",impedance_ohm:50,velocity_factor:0.85,points_mhz_db100m:[[5,0.6],[10,0.86],[50,1.96],[100,2.81],[144,3.4],[200,4.05],[300,5.0],[432,6.1],[500,6.7],[800,8.6],[1000,9.8],[1296,11.4],[1500,12.4],[1800,13.8],[2000,14.6],[2400,16.2],[3000,18.3],[4000,21.6],[5000,24.6],[6000,27.5],[8000,32.7]]},
  {id:"aircell-5-heatex",name:"Aircell 5 Heatex",manufacturer:"SSB-Electronic",datasheet_url:"https://www.ssb.de/media/6050h-de.pdf",value_kind:"typical",impedance_ohm:50,velocity_factor:0.85,points_mhz_db100m:[[5,1.97],[10,2.78],[50,6.28],[100,8.93],[144,10.76],[200,12.74],[300,15.7],[432,18.99],[500,20.49],[800,26.24],[1000,29.54],[1296,33.92],[1500,36.7],[1800,40.5],[2000,42.88],[2400,47.38],[3000,53.57],[4000,62.88],[5000,71.3],[6000,78.85],[10000,106.4]]},
  {id:"aircell-7-heatex",name:"Aircell 7 Heatex",manufacturer:"SSB-Electronic",datasheet_url:"https://www.ssb.de/media/6070h-de.pdf",value_kind:"typical",impedance_ohm:50,velocity_factor:0.85,points_mhz_db100m:[[5,1.52],[10,2.09],[50,4.29],[100,5.97],[144,7.22],[200,8.59],[300,10.64],[432,12.92],[500,13.98],[800,18.05],[1000,20.44],[1296,23.6],[1500,25.73],[1800,28.5],[2000,30.29],[2400,33.82],[3000,38.84],[4000,46.66],[5000,54.19],[6000,61.66]]},
  {id:"h155",name:"H155",manufacturer:"SSB-Electronic",datasheet_url:"https://www.ssb.de/media/h155ssb-de.pdf",value_kind:"typical",impedance_ohm:50,velocity_factor:0.8,points_mhz_db100m:[[10,3.2],[20,4.4],[50,6.9],[100,9.1],[144,10.55],[200,12.4],[230,13.4],[300,15.3],[400,18.0],[432,18.7],[500,20.0],[800,26.1],[1000,29.6],[1296,33.9],[1500,36.8],[1750,40.3],[1800,40.9],[2000,43.7],[2400,49.1],[3000,56.3],[3600,62.9],[4000,67.0],[4800,75.1],[5000,77.1],[5400,80.8],[6000,86.5]]},
  {id:"rg-58-u",name:"RG-58/U",manufacturer:"SSB-Electronic",datasheet_url:"https://www.ssb.de/media/rg58u-de.pdf",value_kind:"maximum",impedance_ohm:50,velocity_factor:0.66,points_mhz_db100m:[[50,13.1],[100,21.4],[400,55.8],[1000,92.0]]},
  {id:"rg-213-u",name:"RG-213/U",manufacturer:"SSB-Electronic",datasheet_url:"https://www.ssb.de/media/rg213u-de.pdf",value_kind:"maximum",impedance_ohm:50,velocity_factor:0.66,points_mhz_db100m:[[50,3.9],[100,7.5],[400,15.7],[1000,29.5]]},
] as Cable[]);

export class CableError extends Error {
  readonly code: "INVALID_INPUT" | "OUT_OF_RANGE";
  constructor(message: string, code: "INVALID_INPUT" | "OUT_OF_RANGE" = "INVALID_INPUT") { super(message); this.name = "CableError"; this.code = code; }
}

export function cableCatalog(query?: string) {
  const q = query?.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cables = CABLES.filter(c => !q || (c.id + c.name).toLowerCase().replace(/[^a-z0-9]/g, "").includes(q)).map(c => ({
    id: c.id, name: c.name, manufacturer: c.manufacturer, impedance_ohm: c.impedance_ohm, velocity_factor: c.velocity_factor,
    value_kind: c.value_kind, coverage_mhz: [c.points_mhz_db100m[0][0], c.points_mhz_db100m.at(-1)![0]] as [number, number],
    attenuation_db_per_100m: c.points_mhz_db100m.map(([f, db]) => ({frequency_mhz: f, loss_db_per_100m: db})),
    datasheet_url: c.datasheet_url,
  }));
  return {cables, retrieved: CATALOG_RETRIEVED,
    note: "Datasheet values for new cable at 20 °C. Real loss grows with age, moisture and temperature. Other cables: pass their datasheet points to rf_feedline_loss."};
}

/** Loss for a catalogued cable, by power-law interpolation between the two datasheet points around the frequency. */
export function cableLoss(input: {cable_id: string; frequency_mhz: number; length_m: number; connector_loss_db: number; tx_power_w?: number}) {
  const cable = CABLES.find(c => c.id === input.cable_id);
  if (!cable) throw new CableError("unknown cable_id; list cables with cable_catalog");
  const pts = cable.points_mhz_db100m;
  const f = input.frequency_mhz;
  if (!(f >= pts[0][0] && f <= pts.at(-1)![0])) {
    throw new CableError(`${cable.name}: datasheet covers ${pts[0][0]}-${pts.at(-1)![0]} MHz; QRVAI does not extrapolate`, "OUT_OF_RANGE");
  }
  let i = pts.findIndex(p => p[0] >= f);
  if (pts[i][0] === f) i = Math.max(1, i);
  const pair = [pts[i - 1], pts[i]].map(([mhz, db]) => ({frequency_hz: mhz * 1e6, loss_db_per_100m: db}));
  const result = calculateFeedlineLoss({
    profile: {id: cable.id, revision: "datasheet-" + CATALOG_RETRIEVED, points: pair},
    frequency_hz: f * 1e6, length_m: input.length_m, connector_loss_db: input.connector_loss_db, interpolation_method: "log_log",
  });
  const delivered = input.tx_power_w === undefined ? null : input.tx_power_w * result.delivered_ratio;
  return {
    cable: {id: cable.id, name: cable.name, manufacturer: cable.manufacturer, value_kind: cable.value_kind, velocity_factor: cable.velocity_factor},
    frequency_mhz: f, length_m: input.length_m,
    loss_db_per_100m: result.interpolated_loss_db_per_100m, cable_loss_db: result.cable_loss_db, connector_loss_db: result.connector_loss_db,
    total_loss_db: result.attenuation_db, delivered_ratio: result.delivered_ratio,
    delivered_power_w: delivered, power_lost_w: input.tx_power_w === undefined ? null : input.tx_power_w - delivered!,
    datasheet_points_used_mhz: [pts[i - 1][0], pts[i][0]], datasheet_url: cable.datasheet_url,
    formula_revision: "M52-v1",
    assumptions: (cable.value_kind === "maximum" ? "Datasheet gives maximum values, so this is an upper bound. " : "Typical datasheet values at 20 °C. ") +
      "Matched line (no extra mismatch loss); power-law interpolation between the two nearest datasheet frequencies.",
  };
}
