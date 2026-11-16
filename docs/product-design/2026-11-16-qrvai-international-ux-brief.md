# QRVAI International — product experience brief and three visual directions

Date: 2026-11-16  
Status: **product UX brief plus working unhosted static Academy and Rules/Sources code; no visually verified or deployed MCP Apps prototype**  
Implementation source: `ui/rf-workbench/index.html`, `ui/academy/index.html`, `ui/regulations/index.html`, generated browser bundles tied to canonical Academy/country packs, and MCP `catalog.ts`/`jurisdiction.ts`.  
Product: [ADR-0012](../architecture/ADR-0012-international-first-regulation-and-academy.md).

## Audience and primary jobs

One global, English-first and Greek-enabled radio amateur assistant for new learners, experienced operators, educators and clubs. Make everyday engineering tools useful with inspectable assumptions, teach the hobby without national exam requirements and provide sources for jurisdiction-specific questions without implying a right to transmit. No dependence on country, callsign, paid account or real RF device for core Academy access.

### Journey A — learner / Academy

1. Enter QRVAI and choose `Learn` without national licence or sign-up fields.
2. Pick EN/EL (retained only in current session unless consented), choose topic or level across 9 modules.
3. Read one of 27 original micro-lessons: objective, concept, safe offline/receive-only activity, self-check and answer.
4. Show TRAINING_ONLY in the lesson and a non-transmission boundary. Do not transmit audio into an RF chain.
5. Search another topic, go back, and use accessible keyboard controls and reduced-motion preferences.
6. A future complete course adds editor-reviewed explanations, adaptive quizzes and progress only after consent and privacy review; do not imply it already exists.

### Journey B — operating-country rules

1. Ask for a specific country's legal research, with `operating_country` explicit. Never infer from callsign, UI language or GPS.
2. Show three independently labeled tiers: ITU framework; IARU/CEPT guidance; source-verified national authority pointers.
3. Surface coverage type (partial official adapter / manual pointer / no pack), observed date and access restrictions.
4. Return the status **INDETERMINATE** with missing legal evidence; no green 'allowed to transmit' badge.
5. If visitor or another home country, highlight that host-country recognition is unverified; if overseas territory, prompt for actual territory before guidance.
6. Link only to known official source URLs and distinguish source discovery from checked operative legal text.

### Journey C — RF workbench

Preserve existing `ui/rf-workbench` three calculators: power, coax attenuation and link budget. Display assumptions, units, non-validity for real coverage, and reversible input-to-input transfer. Separate calculations from live provider tools; never display one as an authorization to operate.

## Visual directions for Product Design choice (not yet selected)

**A. Operator cockpit — recommended working concept:** a compact navigation rail with `Tools` / `Academy` / `Sources`; neutral RF-inspired blue; source citations and uncertainty at the point of use; simple card grid. Build on existing workbench look.

**B. Academy-first learning notebook:** wide comfortable bilingual reading column, 9-topic library, lesson progress that is ephemeral by default and an always-visible safety footer. RF calculations open in side panel.

**C. International research explorer:** evidence-forward regulatory table and source chronology, distinct international/regional/national tiers, country and travel-context controls; Academy and RF tools via top tabs.

These were **directional textual concepts**, not three visual mockups or visual QA. A source-based offline browser implementation of the neutral Operator cockpit was subsequently added for RF Workbench + Academy + Rules/Sources, including EN/EL and source-parity tests. Running CI does not verify rendered screenshots or real accessibility. Product Design's full visual exploration, browser capture, design QA and published prototype require the supported Work environment and an actual selected visual target. Do not claim hosted screens or verified screenshots.

## Shared information architecture and UI contracts

- Top-level destinations: **RF Tools**, **Learn**, **Rules & Sources**; secondary **Field Practice**, **Privacy**, **About**. Language choice EN/EL independent of national regulatory country.
- Treat empty, loading, partial-provider-error, no-country-pack, stale-legal-source, authorization-denied, rate-limited and offline states as first-class. Never color INDETERMINATE as success.
- Academy data: `academy_catalog({language, module_id?, level?, lesson_id?})`; content body only when lesson selected; no account or device requirement.
- Regulatory data: `regulatory_context({operating_country, home_country?, visiting_operator?, operation_date?, frequency_mhz?, mode?, power_w?})`; UI must not invent an `ALLOWED` variant.
- No arbitrary HTML rendering of upstream content. Text outputs should be safely escaped; URLs should be provenance-filtered official destinations.
- Mobile at 320px width; responsive at 768/1200px. Keyboard tab order, programmatic labels, meaningful focus and status messages, reduced motion, contrast aimed at WCAG 2.2 AA, screen-reader naming and localization parity. These are requirements pending measured implementation.
- No auto-start of audio, microphone, GPS, CAT, PTT, transmitter, background beacon, account login, online payment or emergency dispatch.
- Browser prototype must not collect/store exact station location or user QSO/learner responses without new explicit consent and retention controls.

## Required UX validation before marking issue #57 complete

- [ ] Choose a visual target from the options and build it in a Product Design-capable Work session.
- [ ] Verify actual rendered desktop/mobile screens and interactions against selected mockup.
- [ ] Keyboard-only and screen-reader passes for English and Greek, including non-Latin text.
- [ ] Exercise unknown country, visitor country, source-challenge/staleness and no-TX-warning states.
- [ ] Test 9×3 lesson navigation, two-language answers, offline behaviour and escape/provenance.
- [ ] Record informed pilot feedback, measured task completion and design QA receipts.
