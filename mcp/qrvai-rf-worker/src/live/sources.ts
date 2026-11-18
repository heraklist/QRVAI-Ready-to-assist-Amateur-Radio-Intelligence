/** Every external provider QRVAI may contact. Nothing outside this list is ever fetched. */
export type SourceId =
  | "noaa_swpc" | "celestrak" | "satnogs" | "pota" | "wspr_live" | "country_files" | "lotw_activity"
  | "hearham" | "wa7bnm_contests" | "ecfr" | "federal_register" | "greek_gazette" | "eett" | "cept_docdb";

export type SourceInfo = {
  id: SourceId;
  name: string;
  host: string;
  homepage: string;
  attribution: string;
  terms_note: string;
};

export const SOURCES: Readonly<Record<SourceId, SourceInfo>> = Object.freeze({
  noaa_swpc: {id:"noaa_swpc",name:"NOAA Space Weather Prediction Center",host:"services.swpc.noaa.gov",homepage:"https://www.swpc.noaa.gov/",attribution:"Data: NOAA SWPC",terms_note:"US government public data feed."},
  celestrak: {id:"celestrak",name:"CelesTrak GP element sets (amateur group)",host:"celestrak.org",homepage:"https://celestrak.org/",attribution:"Orbital elements: CelesTrak",terms_note:"Cached; CelesTrak asks clients not to download a group more often than it is updated."},
  satnogs: {id:"satnogs",name:"SatNOGS DB transmitters",host:"db.satnogs.org",homepage:"https://db.satnogs.org/",attribution:"Transmitter data: SatNOGS DB (Libre Space Foundation)",terms_note:"Community database; entries can be stale or unconfirmed."},
  pota: {id:"pota",name:"Parks on the Air activator spots",host:"api.pota.app",homepage:"https://pota.app/",attribution:"Spots: Parks on the Air",terms_note:"Public spot feed; spots are user-reported."},
  wspr_live: {id:"wspr_live",name:"wspr.live WSPR spot database",host:"db1.wspr.live",homepage:"https://wspr.live/",attribution:"WSPR data: wspr.live / WSPRnet",terms_note:"Public read-only query service; queries are kept small."},
  country_files: {id:"country_files",name:"AD1C Country Files (cty.dat)",host:"www.country-files.com",homepage:"https://www.country-files.com/",attribution:"Prefix data: AD1C Country Files",terms_note:"Free prefix database for logging software."},
  lotw_activity: {id:"lotw_activity",name:"ARRL LoTW user activity list",host:"lotw.arrl.org",homepage:"https://lotw.arrl.org/",attribution:"LoTW activity: ARRL",terms_note:"Public list of callsigns and their last LoTW upload date; no logbook data."},
  hearham: {id:"hearham",name:"HearHam repeater list",host:"hearham.com",homepage:"https://hearham.com/repeaters",attribution:"Repeater data: HearHam.com",terms_note:"Free to use in applications per HearHam; community-maintained, verify locally."},
  wa7bnm_contests: {id:"wa7bnm_contests",name:"WA7BNM Contest Calendar RSS",host:"www.contestcalendar.com",homepage:"https://www.contestcalendar.com/",attribution:"Contest Calendar: Bruce Horn, WA7BNM",terms_note:"Published RSS feed; titles, times and links only, always with attribution."},
  ecfr: {id:"ecfr",name:"Electronic Code of Federal Regulations",host:"www.ecfr.gov",homepage:"https://www.ecfr.gov/",attribution:"Text: eCFR (US Government Publishing Office / Office of the Federal Register)",terms_note:"Official US government text; eCFR is an editorial compilation, the Federal Register is legally authoritative."},
  federal_register: {id:"federal_register",name:"Federal Register API",host:"www.federalregister.gov",homepage:"https://www.federalregister.gov/",attribution:"Federal Register (National Archives)",terms_note:"Official US government publication."},
  greek_gazette: {id:"greek_gazette",name:"Εθνικό Τυπογραφείο — API ΦΕΚ",host:"api.et.gr",homepage:"https://et.gr/ypiresia-api-gia-fek/",attribution:"ΦΕΚ: Εθνικό Τυπογραφείο",terms_note:"Free public API, limited to 100 requests per minute per IP; documents are cached."},
  eett: {id:"eett",name:"ΕΕΤΤ — Νομοθετικό/Κανονιστικό πλαίσιο φάσματος",host:"www.eett.gr",homepage:"https://www.eett.gr/",attribution:"ΕΕΤΤ (Hellenic Telecommunications & Post Commission)",terms_note:"Official regulator website."},
  cept_docdb: {id:"cept_docdb",name:"CEPT ECO Documentation Database",host:"docdb.cept.org",homepage:"https://docdb.cept.org/",attribution:"CEPT / ECO",terms_note:"Official CEPT document register."},
});

export const ALLOWED_HOSTS: ReadonlySet<string> = new Set(Object.values(SOURCES).map(s => s.host));

export function sourceRef(id: SourceId) {
  const s = SOURCES[id];
  return {id: s.id, name: s.name, homepage: s.homepage, attribution: s.attribution};
}
