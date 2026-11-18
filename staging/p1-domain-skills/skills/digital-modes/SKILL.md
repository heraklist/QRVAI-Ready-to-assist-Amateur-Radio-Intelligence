---
name: digital-modes
description: Offline receive-only/simulated digital-mode fundamentals and version-dependent setup checklists; never drives CAT, PTT, audio hardware or transmitting software.
---
# SK-C16 — Digital Modes & Computer Radio

**Trigger:** User asks for FT8, FT4, APRS, RTTY, PSK, JS8 or SSTV basics and diagnosis of hypothetical audio/CAT interface, without actual device control.
**Required context:** Radio make/model/firmware, operating system, audio interface isolation, program and exact software version, radio bands and jurisdiction, expected receive-only issue, source documentation edition.
**Output contract:** Mode-dependent educational overview, explicitly source-labelled receive-only checklist, unknown-version questions and NOT_IMPLEMENTED for real WSJT-X configuration/FT4/RTTY/JS8/SSTV tool execution. No authority to use a mode/frequency or transmit.
**Refusal/stop condition:** No PTT, No CAT writes, hidden rig keying, clock changes, automatic transmission, local audio probing/port enumeration, live WSJT-X control, installer, driver edit or real operator credentials. Manufacturer/software menus must come from a matching versioned manual.

**Tool boundary:** digital_setup_guide only supports FT8 or APRS in Greek/English, returns a static receive-only or simulated:true classroom checklist. Other digital modes are educational source explanations, not active executables. Actual rig CAT/PTT or audio handshake NOT_IMPLEMENTED.

- [SS-C16-1 Mode Basics](references/1-mode-basics.md)
- [SS-C16-2 Audio/CAT Diagnostics](references/2-audiocat-diagnostics.md)
- [SS-C16-3 Software Version Guidance](references/3-software-version-guidance.md)
