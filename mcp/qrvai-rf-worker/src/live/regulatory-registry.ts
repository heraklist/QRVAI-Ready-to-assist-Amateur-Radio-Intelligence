/**
 * Curated list of official amateur-radio legal sources. Each entry was checked against the live source on REVIEW.date.
 * The live tools compare today's sources with these baselines and report anything newer, so the list cannot silently go stale.
 */
export const REVIEW = Object.freeze({
  date: "2026-11-15",
  eett_latest_upload: "2026-09",
  us_part97_latest_amendment: "2026-02-13",
  cept: {"T/R 61-01": "2024-10-18", "T/R 61-02": "2024-02-16"} as Record<string, string>,
});

export type GazetteRef = {issue: "A" | "B"; year: number; number: number};
export type Instrument = {
  id: string; jurisdiction: string; title: string; kind: string; gazette?: GazetteRef; url: string; pdf_url?: string;
  relation?: string; verified: string;
};

export const ISSUE_CODE: Record<GazetteRef["issue"], number> = {A: 1, B: 2};
export const gazettePdfUrl = (g: GazetteRef) => `https://api.et.gr/apiFEK/${ISSUE_CODE[g.issue]}/${g.year}/${g.number}/pdf`;
export const gazetteStubUrl = (g: GazetteRef) => `https://api.et.gr/apiFEK/${ISSUE_CODE[g.issue]}/${g.year}/${g.number}/html`;

export const INSTRUMENTS: readonly Instrument[] = Object.freeze([
  {id: "gr-ya-38200-1136-2011", jurisdiction: "GR", kind: "ministerial decision",
    title: "Υ.Α. 38200/1136/2011 — Κανονισμός λειτουργίας ερασιτεχνικών σταθμών ασυρμάτου",
    gazette: {issue: "B", year: 2011, number: 1969}, url: "https://api.et.gr/apiFEK/2/2011/1969/html",
    relation: "Base regulation for amateur stations, licences and examinations; replaced Υ.Α. 68000/763/2002.",
    verified: "Text retrieved from api.et.gr on 2026-11-15; contains decision 38200/1136."},
  {id: "gr-ya-10800-310-2013", jurisdiction: "GR", kind: "ministerial decision (amendment)",
    title: "Υ.Α. 10800/310/2013 — Τροποποίηση του κανονισμού λειτουργίας ερασιτεχνικών σταθμών ασυρμάτου",
    gazette: {issue: "B", year: 2013, number: 648}, url: "https://api.et.gr/apiFEK/2/2013/648/html",
    relation: "Amends Υ.Α. 38200/1136/2011.",
    verified: "Text retrieved from api.et.gr on 2026-11-15; contains decision 10800/310."},
  {id: "gr-eett-ekkzs-2025", jurisdiction: "GR", kind: "national frequency allocation table",
    title: "Εθνικός Κανονισμός Κατανομής Ζωνών Συχνοτήτων (ΕΚΚΖΣ) — έκδοση 2025",
    url: "https://www.eett.gr/parochoi/fasma-radiosychnotiton/nomothetiko-kanonistiko-plaisio/?_sft_plaisio_cat=fasma-radiosychnotiton",
    pdf_url: "https://www.eett.gr/wp-content/uploads/2025/08/ΕΚΚΖΣ_2025.pdf",
    relation: "Allocations of frequency bands to services in Greece, including the amateur and amateur-satellite services.",
    verified: "Listed on the EETT spectrum legal-framework page on 2026-11-15."},
  {id: "cept-tr-61-01", jurisdiction: "CEPT", kind: "recommendation",
    title: "CEPT T/R 61-01 — CEPT Radio Amateur Licence", url: "https://docdb.cept.org/document/925",
    relation: "Lets holders of a CEPT licence operate temporarily in other participating countries.",
    verified: "Active, latest update 2024-10-18 per CEPT docdb on 2026-11-15."},
  {id: "cept-tr-61-02", jurisdiction: "CEPT", kind: "recommendation",
    title: "CEPT T/R 61-02 — Harmonised Amateur Radio Examination Certificate (HAREC)", url: "https://docdb.cept.org/document/926",
    relation: "Harmonised examination syllabus and certificate recognised across participating countries.",
    verified: "Active, latest update 2024-02-16 per CEPT docdb on 2026-11-15."},
  {id: "us-47cfr97", jurisdiction: "US", kind: "federal regulation",
    title: "47 CFR Part 97 — Amateur Radio Service", url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97",
    relation: "Complete US amateur rules; §97.301 lists authorized bands per licence class.",
    verified: "Latest amendment 2026-02-13 per eCFR on 2026-11-15."},
]);

export type Jurisdiction = {code: string; name: string; live: string[]; manual_links: {title: string; url: string; note: string}[]};

export const JURISDICTIONS: readonly Jurisdiction[] = Object.freeze([
  {code: "GR", name: "Ελλάδα / Greece",
    live: ["ΦΕΚ text via the National Printing Office API (api.et.gr)", "EETT spectrum legal-framework page: new and amended documents"],
    manual_links: [
      {title: "Αναζήτηση ΦΕΚ (search.et.gr)", url: "https://search.et.gr/el/", note: "Search for amendments that QRVAI cannot discover automatically."},
      {title: "Δημόσιες διαβουλεύσεις (opengov.gr)", url: "https://www.opengov.gr/digitalandbrief/", note: "Draft rules under consultation; blocks automated access, check manually."},
    ]},
  {code: "CEPT", name: "CEPT (Europe and participating countries)",
    live: ["Status and update date of T/R 61-01 and T/R 61-02 from CEPT docdb"],
    manual_links: [{title: "ECO Frequency Information System (EFIS)", url: "https://efis.cept.org/", note: "National frequency tables of CEPT countries."}]},
  {code: "US", name: "United States",
    live: ["Current text of any 47 CFR §97 section (eCFR)", "New rules and proposals affecting Part 97 (Federal Register)"],
    manual_links: []},
  {code: "DE", name: "Deutschland / Germany", live: [],
    manual_links: [{title: "Amateurfunkverordnung (AFuV)", url: "https://www.gesetze-im-internet.de/afuv_2005/", note: "Official consolidated text; not fetched automatically."}]},
  {code: "UK", name: "United Kingdom", live: [],
    manual_links: [{title: "Ofcom — Amateur radio", url: "https://www.ofcom.org.uk/spectrum/radio-equipment/amateur-radio", note: "Licence conditions; the site refuses automated access."}]},
  {code: "IARU-R1", name: "IARU Region 1 band plans (advisory)", live: [],
    manual_links: [{title: "IARU Region 1", url: "https://www.iaru-r1.org/", note: "Band plans are recommendations, never legal permission."}]},
]);
