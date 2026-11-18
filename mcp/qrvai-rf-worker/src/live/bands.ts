/** IARU amateur band edges (widest worldwide), used only to label a frequency, never to grant permission. */
const BANDS: [string, number, number][] = [
  ["2200m", 0.1357, 0.1378], ["630m", 0.472, 0.479], ["160m", 1.8, 2.0], ["80m", 3.5, 4.0], ["60m", 5.25, 5.45],
  ["40m", 7.0, 7.3], ["30m", 10.1, 10.15], ["20m", 14.0, 14.35], ["17m", 18.068, 18.168], ["15m", 21.0, 21.45],
  ["12m", 24.89, 24.99], ["10m", 28.0, 29.7], ["6m", 50.0, 54.0], ["4m", 70.0, 70.5], ["2m", 144.0, 148.0],
  ["1.25m", 219.0, 225.0], ["70cm", 420.0, 450.0], ["33cm", 902.0, 928.0], ["23cm", 1240.0, 1300.0], ["13cm", 2300.0, 2450.0],
];
export const BAND_NAMES = BANDS.map(b => b[0]) as readonly string[];

export function bandOf(mhz: number): string | null {
  for (const [name, lo, hi] of BANDS) if (mhz >= lo && mhz <= hi) return name;
  return null;
}
export function bandRange(name: string): [number, number] | null {
  const b = BANDS.find(x => x[0] === name);
  return b ? [b[1], b[2]] : null;
}
