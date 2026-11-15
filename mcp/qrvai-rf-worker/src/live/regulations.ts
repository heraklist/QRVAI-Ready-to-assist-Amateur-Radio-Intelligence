import {extractText, getDocumentProxy} from "unpdf";
import {cached, fetchBytes, fetchJson, fetchText, ProviderError, HOUR} from "./http.ts";
import {sourceRef} from "./sources.ts";
import {INSTRUMENTS, JURISDICTIONS, REVIEW, gazettePdfUrl, gazetteStubUrl, type GazetteRef, type Instrument} from "./regulatory-registry.ts";

const DISCLAIMER = "Legal text and change signals only. QRVAI does not give legal advice or permission to transmit; confirm with the competent authority.";
const EETT_PAGE = "https://www.eett.gr/parochoi/fasma-radiosychnotiton/nomothetiko-kanonistiko-plaisio/?_sft_plaisio_cat=fasma-radiosychnotiton";
const CEPT_LIST = "https://docdb.cept.org/document/category/ECC_Recommendations?status=ACTIVE";
const FR_URL = "https://www.federalregister.gov/api/v1/documents.json?conditions%5Bcfr%5D%5Btitle%5D=47&conditions%5Bcfr%5D%5Bpart%5D=97&order=newest&per_page=8";

/** Accent- and case-insensitive form for Greek and Latin search, with final sigma folded. */
export function fold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ς/g, "σ");
}

/** Re-join words that the gazette hyphenates across lines, and tidy whitespace. */
export function cleanPdfText(s: string): string {
  return s.replace(/[‐‑−-]\s*\n\s*/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function articleOutline(pages: string[]): {article: string; title: string; page: number}[] {
  const out: {article: string; title: string; page: number}[] = [];
  pages.forEach((text, i) => {
    const lines = text.split("\n").map(l => l.trim());
    lines.forEach((line, k) => {
      const m = line.match(/^Άρθρο\s+(\d+[α-ω]?)\s*$/);
      if (m) out.push({article: m[1], title: (lines[k + 1] ?? "").slice(0, 140), page: i + 1});
    });
  });
  return out;
}

export function findPassages(pages: string[], query: string, max: number, radius = 600) {
  const terms = fold(query).split(/\s+/).filter(t => t.length >= 3);
  if (terms.length === 0) throw new ProviderError("query needs at least one word of 3+ letters");
  const out: {page: number; text: string; matched: string[]}[] = [];
  pages.forEach((page, i) => {
    const folded = fold(page);
    // A position is a hit when every term occurs within the window around the first term.
    let from = 0;
    while (out.length < max) {
      const pos = folded.indexOf(terms[0], from);
      if (pos < 0) break;
      const start = Math.max(0, pos - radius), end = Math.min(page.length, pos + radius);
      const window = folded.slice(start, end);
      if (terms.every(t => window.includes(t))) {
        out.push({page: i + 1, text: page.slice(start, end), matched: terms});
        from = end;
      } else {
        from = pos + terms[0].length;
      }
    }
  });
  return out.slice(0, max);
}

async function pdfPages(url: string, key: string): Promise<{pages: string[]; fetched_at: string; from_cache: boolean}> {
  const doc = await cached(key, 7 * 24 * HOUR, async () => {
    const {bytes} = await fetchBytes(url, {maxBytes: 30_000_000, timeoutMs: 20000});
    if (bytes.length < 5 || new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") throw new ProviderError("source did not return a PDF");
    try {
      const pdf = await getDocumentProxy(bytes);
      const {text} = await extractText(pdf, {mergePages: false});
      return (text as string[]).map(cleanPdfText);
    } catch {
      throw new ProviderError("could not extract text from the PDF");
    }
  });
  return {pages: doc.value, fetched_at: doc.fetched_at, from_cache: doc.from_cache};
}

const EETT_UPLOAD = /^https:\/\/www\.eett\.gr\/wp-content\/uploads\/\d{4}\/\d{2}\/[^?#]+\.pdf$/i;

export async function regulationText(input: {
  document_id?: string; gazette?: GazetteRef; eett_pdf_url?: string; us_section?: string; query?: string; page?: number; max_passages: number;
}) {
  const chosen = [input.document_id, input.gazette, input.eett_pdf_url, input.us_section].filter(v => v !== undefined);
  if (chosen.length !== 1) throw new ProviderError("give exactly one of document_id, gazette, eett_pdf_url or us_section");

  if (input.us_section !== undefined) return usSection(input.us_section, input.query, input.max_passages);

  let instrument: Instrument | undefined;
  let url: string, sourceId: "greek_gazette" | "eett", citation: string;
  if (input.document_id !== undefined) {
    instrument = INSTRUMENTS.find(i => i.id === input.document_id);
    if (!instrument) throw new ProviderError("unknown document_id; list them with regulatory_sources");
    if (instrument.jurisdiction === "US") throw new ProviderError("for 47 CFR Part 97 use us_section, e.g. 97.301");
    if (instrument.gazette) { url = gazettePdfUrl(instrument.gazette); sourceId = "greek_gazette"; }
    else if (instrument.pdf_url) { url = instrument.pdf_url; sourceId = "eett"; }
    else throw new ProviderError("this document has no machine-readable text; open its url");
    citation = instrument.title;
  } else if (input.gazette !== undefined) {
    url = gazettePdfUrl(input.gazette); sourceId = "greek_gazette";
    citation = `ΦΕΚ ${input.gazette.issue === "A" ? "Α'" : "Β'"} ${input.gazette.number}/${input.gazette.year}`;
  } else {
    const u = input.eett_pdf_url!;
    if (!EETT_UPLOAD.test(u)) throw new ProviderError("eett_pdf_url must be an EETT document URL from regulation_changes");
    url = u; sourceId = "eett"; citation = decodeURI(u.split("/").pop()!);
  }
  const doc = await pdfPages(url, "pdf:" + url);
  const base = {
    citation, document_id: instrument?.id ?? null, total_pages: doc.pages.length, source_url: url,
    source: sourceRef(sourceId), fetched_at: doc.fetched_at, from_cache: doc.from_cache, disclaimer: DISCLAIMER,
  };
  if (input.query) return {...base, passages: findPassages(doc.pages, input.query, input.max_passages)};
  if (input.page !== undefined) {
    if (input.page < 1 || input.page > doc.pages.length) throw new ProviderError(`page must be 1..${doc.pages.length}`);
    return {...base, page: input.page, text: doc.pages[input.page - 1].slice(0, 8000)};
  }
  return {...base, outline: articleOutline(doc.pages).slice(0, 80), first_page: doc.pages[0]?.slice(0, 2500) ?? ""};
}

async function ecfrDate(): Promise<string> {
  const titles = await cached("ecfr:titles", 6 * HOUR, async () => fetchJson("https://www.ecfr.gov/api/versioner/v1/titles.json", {maxBytes: 500_000}));
  const t47 = (titles.value as {titles?: {number: number; up_to_date_as_of?: string}[]}).titles?.find(t => t.number === 47);
  if (!t47?.up_to_date_as_of || !/^\d{4}-\d{2}-\d{2}$/.test(t47.up_to_date_as_of)) throw new ProviderError("eCFR did not report a current date");
  return t47.up_to_date_as_of;
}

export function xmlToText(xml: string): string {
  return xml.replace(/<\/(P|HEAD|ROW|TR|FP)>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&#x2014;|&#8212;/g, "—").replace(/&#xA7;|&#167;/g, "§").replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").trim();
}

async function usSection(section: string, query: string | undefined, max: number) {
  if (!/^97\.\d{1,3}[a-z]?$/.test(section)) throw new ProviderError("us_section must look like 97.301");
  const date = await ecfrDate();
  const url = `https://www.ecfr.gov/api/versioner/v1/full/${date}/title-47.xml?part=97&section=${section}`;
  const doc = await cached("ecfr:" + url, 12 * HOUR, async () => xmlToText(await fetchText(url, {maxBytes: 2_000_000, headers: {accept: "application/xml"}})));
  const base = {citation: `47 CFR §${section}`, up_to_date_as_of: date, source_url: `https://www.ecfr.gov/current/title-47/section-${section}`,
    source: sourceRef("ecfr"), fetched_at: doc.fetched_at, from_cache: doc.from_cache, disclaimer: DISCLAIMER};
  if (query) return {...base, passages: findPassages([doc.value], query, max)};
  return {...base, text: doc.value.slice(0, 12000), truncated: doc.value.length > 12000};
}

export function parseEettDocuments(html: string) {
  const seen = new Set<string>();
  const docs: {title: string; url: string; uploaded: string}[] = [];
  for (const m of html.matchAll(/<a[^>]+href="(https:\/\/www\.eett\.gr\/wp-content\/uploads\/(\d{4})\/(\d{2})\/[^"]+\.pdf)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const title = m[4].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&#8211;/g, "–").replace(/&#8220;|&#8221;|&laquo;|&raquo;/g, '"')
      .replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    docs.push({title: title.slice(0, 240), url: m[1], uploaded: `${m[2]}-${m[3]}`});
  }
  if (docs.length === 0) throw new ProviderError("EETT page layout changed; no documents found");
  return docs.sort((a, b) => b.uploaded.localeCompare(a.uploaded));
}

/** Matched against fold(title), so patterns are written without accents and with σ for final sigma. */
const RELEVANT = /ερασιτεχν|ραδιοερασιτ|κατανομησ\s+ζωνων|εκκζσ|ορων\s+χρησησ\s+ραδιοφασματοσ/;

export function parseCeptStatus(html: string, refs: string[]) {
  return refs.map(ref => {
    const row = html.split(/<tr/i).find(r => r.includes(ref));
    if (!row) return {reference: ref, found: false as const};
    const text = row.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const date = text.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
    const doc = row.match(/href="(\/document\/\d+)"/)?.[1];
    return {reference: ref, found: true as const, active: /\bActive\b/.test(text), latest_update: date,
      description: text.slice(text.indexOf(ref), text.indexOf(ref) + 220).trim(), url: doc ? "https://docdb.cept.org" + doc : null,
      changed_since_review: date !== null && date > (REVIEW.cept[ref] ?? "")};
  });
}

export function summarizeFederalRegister(raw: unknown) {
  const results = (raw as {results?: unknown})?.results;
  if (!Array.isArray(results)) throw new ProviderError("unexpected Federal Register format");
  return results.map(r => {
    const x = r as Record<string, unknown>;
    const str = (v: unknown, n = 300) => (typeof v === "string" ? v.slice(0, n) : null);
    return {title: str(x.title), type: str(x.type, 40), publication_date: str(x.publication_date, 10), effective_on: str(x.effective_on, 10),
      document_number: str(x.document_number, 20), url: str(x.html_url), abstract: str(x.abstract, 500)};
  });
}

export async function regulationChanges(input: {jurisdiction: "GR" | "CEPT" | "US"; limit: number}) {
  const review = {reviewed_on: REVIEW.date};
  if (input.jurisdiction === "GR") {
    const page = await cached("eett:legal", 6 * HOUR, async () => parseEettDocuments(await fetchText(EETT_PAGE, {maxBytes: 3_000_000, timeoutMs: 12000})));
    const docs = page.value.map(d => ({...d, newer_than_review: d.uploaded > REVIEW.eett_latest_upload, likely_relevant_to_amateurs: RELEVANT.test(fold(d.title))}));
    const gazette = await Promise.all(INSTRUMENTS.filter(i => i.gazette).map(async i => {
      try { await fetchText(gazetteStubUrl(i.gazette!), {maxBytes: 50_000}); return {id: i.id, title: i.title, available: true}; }
      catch { return {id: i.id, title: i.title, available: false}; }
    }));
    return {
      jurisdiction: "GR", ...review,
      eett_documents: docs.slice(0, input.limit),
      new_since_review: docs.filter(d => d.newer_than_review).length,
      registry_gazette_documents: gazette,
      limits: "The gazette API has no keyword search, so a new ministerial amendment is only seen here once EETT lists it. Search search.et.gr for \"ερασιτεχνικών σταθμών\" to be sure.",
      source: [sourceRef("eett"), sourceRef("greek_gazette")], fetched_at: page.fetched_at, from_cache: page.from_cache, disclaimer: DISCLAIMER,
    };
  }
  if (input.jurisdiction === "CEPT") {
    const page = await cached("cept:ecc-recs", 12 * HOUR, async () => fetchText(CEPT_LIST, {maxBytes: 3_000_000, timeoutMs: 12000}));
    const status = parseCeptStatus(page.value, ["T/R 61-01", "T/R 61-02"]);
    if (status.every(s => !s.found)) throw new ProviderError("CEPT list layout changed; recommendations not found");
    return {jurisdiction: "CEPT", ...review, recommendations: status, source: sourceRef("cept_docdb"), fetched_at: page.fetched_at, from_cache: page.from_cache, disclaimer: DISCLAIMER};
  }
  const [fr, versions] = await Promise.all([
    cached("fr:part97", 6 * HOUR, async () => summarizeFederalRegister(await fetchJson(FR_URL, {maxBytes: 1_000_000}))),
    cached("ecfr:versions97", 6 * HOUR, async () => fetchJson("https://www.ecfr.gov/api/versioner/v1/versions/title-47.json?part=97", {maxBytes: 2_000_000})),
  ]);
  const cv = (versions.value as {content_versions?: {amendment_date?: string; identifier?: string; name?: string}[]}).content_versions;
  if (!Array.isArray(cv)) throw new ProviderError("unexpected eCFR versions format");
  const latest = cv.reduce((m, v) => (v.amendment_date && v.amendment_date > m ? v.amendment_date : m), "");
  const latestSections = cv.filter(v => v.amendment_date === latest).map(v => v.name ?? v.identifier).slice(0, 20);
  return {
    jurisdiction: "US", ...review,
    part97_latest_amendment: latest, changed_since_review: latest > REVIEW.us_part97_latest_amendment, sections_in_latest_amendment: latestSections,
    federal_register_documents: fr.value.slice(0, input.limit),
    source: [sourceRef("ecfr"), sourceRef("federal_register")], fetched_at: fr.fetched_at, from_cache: fr.from_cache, disclaimer: DISCLAIMER,
  };
}

export function regulatorySources(jurisdiction?: string) {
  const j = jurisdiction?.toUpperCase();
  const list = JURISDICTIONS.filter(x => !j || x.code === j);
  if (j && list.length === 0) throw new ProviderError("jurisdiction not covered; covered: " + JURISDICTIONS.map(x => x.code).join(", "));
  return {
    jurisdictions: list.map(x => ({...x, documents: INSTRUMENTS.filter(i => i.jurisdiction === x.code)})),
    reviewed_on: REVIEW.date,
    how_to_stay_current: "Call regulation_changes for GR, CEPT or US to compare today's official sources with this review.",
    disclaimer: DISCLAIMER,
  };
}
