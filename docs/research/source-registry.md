# QRVAI Source & Integration Register v0.3

**Research timestamp:** 2026-10-14 (Europe/Athens)  
**Status:** Initial primary-source review. Links verified for presence and broad purpose; this is **not** proof of access rights, stable APIs, completeness, current legal interpretation or permission to reuse content.

## Source classes / precedence

1. **Binding national regulation and official decisions** for operator permissions, valid in the actual jurisdiction and on the operating date.
2. **International binding framework, where applicable** and domestic implementation.
3. **Advisory recommendations** (IARU band plans, ITU-R recommendations) identified as non-binding when they are.
4. **Manufacturer technical documentation** with manual/version/page and license restrictions.
5. **Live observations/data feeds** with observation time and stale/expired behavior.
6. **Community-sourced data** marked unverified, especially repeater/status entries.

Never merge source types into one unlabelled 'allowed frequency' lookup. A published emergency centre of activity is not automatically a protected/authorizing transmit channel.

## Verified official and upstream sources

| Key | Source / purpose | URL | Integration posture | Review needed |
|---|---|---|---|---|
| SRC-001 | Greece: Gov.gr amateur-radio license issuance, official process | https://www.gov.gr/el/services/1001878/ekdose-adeias-radioerasitekhne | Link/cite; account interaction out of scope | Actual legal rights and changes; jurisdiction |
| SRC-002 | Greece: EETT spectrum legal framework | https://www.eett.gr/parochoi/fasma-radiosychnotiton/nomothetiko-kanonistiko-plaisio/?_sft_plaisio_cat=fasma-radiosychnotiton | Source registry, official documents only | Current operative texts/amendments |
| SRC-003 | Greece: EKΚΖΣ national frequency allocation decision (24549 ΕΞ 2025, FEK 4230/B/04-08-2025) | https://www.eett.gr/nomiko-plaisio/egkrisi-ethnikou-kanonismou-katanomis-zonon-sychnotiton-ekkzs/ | Parse official decision only after review, not 'ham permissions' by itself | Current amendments, actual licensing rules |
| SRC-004 | IARU Region 1 band plans | https://www.iaru-r1.org/on-the-air/band-plans/ | Advisory; keep original effective date/version | Exact current HF/VHF+ plan and exceptions |
| SRC-005 | IARU emergency communications centres of activity | https://www.iaru-r1.org/about-us/committees-and-working-groups/emcomm/emergency-communications-frequencies/ | Education / advisory only; NOT automatically exclusive frequencies | Local policy and permissions |
| SRC-006 | IARU emergency operating procedures / training guide | https://www.iaru-r1.org/about-us/committees-and-working-groups/emcomm/emergency-operating-procedures/ | Source-cited reference material; inspect reuse rights | Version and reuse rules |
| SRC-007 | ITU-R Recommendation M.1042-4 (02/2026), amateur disaster communications | https://www.itu.int/rec/R-REC-M.1042-4-202602-I/en | Official recommendation; policy context for preparedness | National adoption and applicability |
| SRC-008 | Greece: Civil Protection volunteer register (EMEPP) | https://civilprotection.gov.gr/ethelontismos/emepp | Official organizational eligibility context | Procedures and current decisions |
| SRC-009 | Greece: Civil Protection volunteer legal framework | https://civilprotection.gov.gr/ethelontismos/thesmiko-plaisio-ethelontismoy-pp | Source of current government instruments | Exact conditions and amendments |
| SRC-010 | ADIF Developers Group: ADIF specification | https://www.adif.org.uk/ | Version-aware parser compatibility; current site showed 3.1.8 at research date | Revision/future releases and licensing |
| SRC-011 | NOAA SWPC JSON datasets | https://services.swpc.noaa.gov/json/ | Candidate read-only adapter with timestamps, cache and null handling | Stable endpoints, attribution, rate limits, types |
| SRC-012 | QRZ XML specification | https://www.qrz.com/docs/xml/current_spec.html | **Credentialed/subscription-dependent** callsign integration only | Commercial rights, user auth, terms, quota |
| SRC-013 | Hamlib documentation | https://github.com/Hamlib/Hamlib/wiki/Documentation | Future local **read-only** radio status adapter | Device support and security sandboxing |
| SRC-014 | MCP Apps upstream specification and SDK | https://github.com/modelcontextprotocol/ext-apps | Author host-aware interactive MCP views, with fallback | Host compatibility and installed SDK versions |

**Supporting observation:** IARU Region 1 emergency centres of activity are described as activity focal points, not absolute exclusive frequencies. The ITU-R M.1042-4 recommendation is reported in force as of 2026-10-14; recommendations do not replace actual national permissions. Official Greek sources have changes during 2025/2026; the regulatory engine must not freeze rules at repo creation date.

## Candidate adapters requiring dedicated assessment before selection

| Candidate | Intended function | Decision status |
|---|---|---|
| PSK Reporter | Reception reports and maps | Unapproved: confirm present API format, rate limits, storage and permitted automated use |
| LoTW / ARRL | QSO confirmations | Unapproved: verify authentication, signed records, usage terms and privacy |
| SOTA / POTA / IOTA | Activations and awards | Unapproved: separate provider contracts and AI/commercial restrictions; do not scrape |
| Satellite ephemerides / AMSAT | Pass predictions, mode/frequency data | Unapproved: licensing, update frequency and orbital precision required |
| Repeater directories | Locating and programming repeaters | Unapproved: structured data licensing, verification and freshness |
| Equipment-manual providers | Model/version documentation | Unapproved: link first, index/reproduce only with appropriate rights |
| Radio-manufacturer CAT docs | Per-model commands | Unapproved: future bridge with explicit operator confirmation; read-only first |

## Source governance / proposed schema

For each document/feed record:
- source_id, publisher, jurisdiction, classification (LAW / RECOMMENDATION / MANUAL / STANDARD / OBSERVATION / COMMUNITY)
- original URL, owner, license/access policy, redistribution permission, attribution
- source title, language, version, publication_date, effective_from/effective_until
- fetched_at, last_verified_at, checksum/source hash, replacement/supersession link
- intended use, parsing approach, refresh cadence, API throttling and privacy implications
- review_owner, trust_status (CANDIDATE / VERIFIED_SOURCE / VERIFIED_RULE / RETIRED), caveats

**Important distinction:** VERIFIED_SOURCE only means source identity was reviewed; VERIFIED_RULE additionally requires validation of legal interpretation and temporal applicability. All source statuses here remain 'initial research candidate' until normalized/reviewed for integration.

## Operational policies

- Do not cache dynamic data indefinitely or claim current state from a cached response.
- Do not assert transmit permission unless rule inputs and a current authoritative legal source support it.
- Do not copy all manual pages, protected artwork, diagrams or licensed databases into a redistributable repository without rightsholder approval.
- Do not send station QTH, callsign, logbook entries or other personal data to a provider without defined purpose/consent and disclosure.
- Keep source documents as citation links and metadata initially; no automated download pipeline has been built.
- Unavailable source/network/API should degrade to honest and marked incomplete guidance.

## Research-to-implementation gate

Before building any adapter, produce a provider brief: source identity; endpoints; authentication; quota and fees; license/redistribution; schema and data quality; refresh requirements; retention/privacy; error handling; tests; and go/no-go signoff. No entries in this file authorize fetching, redistribution or remote writes.
