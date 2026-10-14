# Family D — Amateur Radio Academy, Maker and Community (V0)

This newly authored reference is derived from the QRVAI v0.5 public GitHub capability specifications only. No prior private preview plugin files, exam question JSON, owner JPEG images or scripts are in its provenance.

Guidance includes learning paths and independently written practice, open project design and club event planning. It is **not official state examination certification**, a rights grant for proprietary educational questions, or authorization to access member records. Teaching exercises need source licensing; any private club or mentor data requires consent before use.

## Canonical Domain/Sub-capability contracts

### D22 — Amateur Radio Academy & CW

**Purpose:** Teach progressive radio theory and radio-operating skills.  
**Required context:** learner level, topic, locale, assessment responses.  
**Deliverable:** adaptive lessons, CW drills and explained scores.  
**Non-bypassable boundary:** Do not claim state exam certification or reuse protected questions unlawfully.  
**Owner Skill:** `SK-D22` (planned package `skills/radio-academy/SKILL.md`); *workflow sub-skills* `SS-D22-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-D22-1` — Theory Curriculum | teach syllabus-aligned electrical/RF/regulatory concepts | `SS-D22-1` |
| `SC-D22-2` — CW Practice | provide timing/speed drills and reproducible scoring | `SS-D22-2` |
| `SC-D22-3` — Knowledge Assessment | ask and explain structured questions with source links | `SS-D22-3` |



---

### D23 — Maker, Research & Software Development

**Purpose:** Help safely prototype RF/electronics/software experiments.  
**Required context:** hardware target, scope, component specs, constraints.  
**Deliverable:** reproducible experiment plan, verified software options and BOM.  
**Non-bypassable boundary:** No unsafe high-energy circuit procedures or assumed compatibility.  
**Owner Skill:** `SK-D23` (planned package `skills/radio-maker/SKILL.md`); *workflow sub-skills* `SS-D23-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-D23-1` — Microcontroller Integration | develop station-adjacent Arduino/ESP32/RPi project guidance | `SS-D23-1` |
| `SC-D23-2` — Software Interoperability | review open-source radio interfaces and test strategy | `SS-D23-2` |
| `SC-D23-3` — Experimental RF Prototyping | build a safe bounded research plan with measurement checks | `SS-D23-3` |



---

### D24 — Clubs, Community & Mentoring

**Purpose:** Support authorized educational and logistical club operations.  
**Required context:** club permissions, group context, event/inventory info.  
**Deliverable:** meeting/workshop plans and privacy-scoped shared resource overview.  
**Non-bypassable boundary:** Never reveal non-public members/contact data without consent.  
**Owner Skill:** `SK-D24` (planned package `skills/clubs-mentoring/SKILL.md`); *workflow sub-skills* `SS-D24-1..3`.  
**Validation:** reject missing critical context; return a cited and typed result, otherwise PARTIAL/INDETERMINATE as appropriate.

| Sub-capability ID | Purpose / functional contract | Skill procedure |
|---|---|---|
| `SC-D24-1` — Member Onboarding | prepare skill-based progression for new operators | `SS-D24-1` |
| `SC-D24-2` — Training/Event Planning | coordinate authorized workshops and activity calendars | `SS-D24-2` |
| `SC-D24-3` — Asset/Mentor Governance | maintain consent-based equipment/mentor availability records | `SS-D24-3` |

## 3. Taxonomy and ownership rules

- **Capabilities** describe value and decision boundaries; **Sub-capabilities** enumerate bounded functions; **Skills** activate conditional guidance; **sub-skills** are the procedural sections that implement a sub-capability after the parent Skill is selected.
- Every `SC-Xnn-i` has exactly one primary owner `SK-Xnn` and procedural definition `SS-Xnn-i`. Other domains MAY reuse underlying computational and data engines without duplicating them.
- **Cross-domain orchestration:** simple task → direct Skill + MCP tool; complex task → bounded workflow; orchestrators only when needed.
- **Provenance:** legal outputs include jurisdiction, effective date, primary source and condition status; live observations include observed_at/fetched_at; equations include engine revision and units.
- **Access:** information and simulation tools must not upgrade to data writes or device control. No PTT/transmission in approved design scope.
- **Implementation status:** none of these 24 Skills or 72 sub-skills has been packaged or tested.

## 4. Registry consistency gates

1. Exactly four family IDs A/B/C/D and distinct module IDs A01–A05, B06–B13, C14–C21, D22–D24.
2. Each module has **three** bounded Sub-capabilities SC-Xnn-1/2/3 with matching SS-Xnn-1/2/3 and an owner SK-Xnn; no orphan IDs.
3. Every module has explicit mission, required context, deliverable and stop boundary.
4. Every tool introduced later must map to at least one SC, and every SC intended for executable behavior must eventually map to a justified tool or documented manual-only workflow.
5. In no case may source citation alone be interpreted as validated legal permission, a measured RF quantity or government/agency authority.

**Cross references:** [Skill Registry](skill-and-subskill-registry-v0.5.md) · [Engine/MCP Tool Contracts](engine-and-mcp-tool-contracts-v0.5.md) · [Review Audit](../reviews/2026-10-14-architecture-audit-v0.5.md).

