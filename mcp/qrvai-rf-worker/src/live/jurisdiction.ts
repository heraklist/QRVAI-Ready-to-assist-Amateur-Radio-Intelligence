/** International-first, evidence-scoped regulatory context (ADR-0012).
 * This is a research router, NOT an authorization/permission engine.
 * No input or output is persisted, and no provider is contacted.
 */
import {INSTRUMENTS, JURISDICTIONS, REVIEW} from "./regulatory-registry.ts";
import {ProviderError} from "./http.ts";

export type RegulatoryContextInput = {
  operating_country: string;
  operation_date?: string;
  home_country?: string;
  licence_class?: string;
  visiting_operator?: boolean;
  frequency_mhz?: number;
  mode?: string;
  power_w?: number;
};

const GLOBAL = Object.freeze({
  authority: "ITU Radio Regulations",
  force: "international_framework",
  source_url: "https://www.itu.int/pub/R-REG-RR/en",
  note: "International service definitions and allocations are NOT an individual station licence.",
});

const REGIONAL = Object.freeze({
  authority: "International Amateur Radio Union (IARU)",
  force: "nonbinding_operating_guidance",
  source_url: "https://www.iaru.org/on-the-air/band-plans/",
  note: "IARU band plans are generally voluntary unless adopted into national law; national rules prevail.",
});

function iso2(value: string, name: string): string {
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) throw new ProviderError(`${name} must be a two-letter ISO-style country code`);
  return code;
}
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
const REGION: Record<string, "1" | "2" | "3"> = {GR: "1", DE: "1", GB: "1", US: "2"};

/** Conservative, deterministic output. We do not infer location from callsign, IP or language. */
export function regulatoryContext(input: RegulatoryContextInput) {
  const requestedCountry = iso2(input.operating_country, "operating_country");
  // UK is common shorthand; GB is the ISO 3166-1 alpha-2 country code.
  const country = requestedCountry === "UK" ? "GB" : requestedCountry;
  const registryCode = country === "GB" ? "UK" : country;
  const home = input.home_country === undefined ? null : iso2(input.home_country, "home_country");
  if (input.operation_date !== undefined && !validDate(input.operation_date)) throw new ProviderError("operation_date must be a real YYYY-MM-DD date");
  if (input.frequency_mhz !== undefined && (!Number.isFinite(input.frequency_mhz) || input.frequency_mhz <= 0)) throw new ProviderError("frequency_mhz must be positive");
  if (input.power_w !== undefined && (!Number.isFinite(input.power_w) || input.power_w < 0)) throw new ProviderError("power_w must be nonnegative");

  const jurisdiction = JURISDICTIONS.find(x => x.code === registryCode);
  const primary = INSTRUMENTS.filter(x => x.jurisdiction === registryCode).map(x => ({
    id: x.id, title: x.title, url: x.url, kind: x.kind, last_source_review: REVIEW.date,
  }));
  const source_coverage = (country === "GR" || country === "US")
    ? "PARTIAL_OFFICIAL_SOURCE_ADAPTER"
    : jurisdiction ? "MANUAL_OFFICIAL_SOURCE_POINTERS_ONLY" : "NO_COUNTRY_PACK";
  const region = REGION[country] ?? null;
  const visiting = input.visiting_operator === true || (home !== null && home !== country);
  const missing: string[] = [];
  if (!input.operation_date) missing.push("operation_date");
  if (!input.licence_class) missing.push("licence_class_or_verified_visitor_recognition");
  if (input.frequency_mhz === undefined) missing.push("frequency_mhz");
  if (!input.mode) missing.push("mode");
  if (input.power_w === undefined) missing.push("power_w");
  if (visiting) missing.push("documented_host_country_visitor_privileges");

  return {
    operating_country: country,
    home_country: home,
    operating_jurisdiction_used: "EXPLICIT_INPUT",
    operation_date: input.operation_date ?? null,
    station_context: {
      licence_class: input.licence_class ?? null,
      visiting_operator: visiting,
      frequency_mhz: input.frequency_mhz ?? null,
      mode: input.mode ?? null,
      power_w: input.power_w ?? null,
    },
    permission_status: "INDETERMINATE" as const,
    permission_assessed: false,
    source_coverage,
    missing_or_unverified_evidence: missing,
    authorities: {
      international: GLOBAL,
      regional: {...REGIONAL, iaru_region_hint_for_mainland: region, region_verified_for_operating_site: false, region_caveat: "Country-wide mapping cannot establish the ITU/IARU region of an overseas territory or portable operating site."},
      cross_border: {
        authority: "CEPT T/R 61-01 (where implemented)",
        force: "participation_and_licence_equivalence_require_host_country_verification",
        source_url: "https://docdb.cept.org/document/925",
        note: "A home-country licence alone does not establish privileges in a visited jurisdiction.",
      },
      national: {
        regulator_or_jurisdiction: jurisdiction?.name ?? country,
        force: "binding_national_rules_must_be_checked",
        source_coverage,
        curated_primary_sources: primary,
        manual_sources: jurisdiction?.manual_links ?? [],
        last_source_review: REVIEW.date,
        currentness_and_effective_date_verified: false,
      },
    },
    next_step: source_coverage === "NO_COUNTRY_PACK"
      ? "No reviewed national pack exists. Consult the operating country's competent regulator; QRVAI cannot determine permission."
      : "Read current official national rules, amendments, licence privileges and visitor conditions for the operating date; do not infer TX permission from ITU, IARU or CEPT alone.",
    disclaimer: "Research pointers only. No permission to transmit is asserted; confirm privileges with the national administration.",
  };
}
