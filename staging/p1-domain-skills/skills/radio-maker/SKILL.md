---
name: radio-maker
description: Safety-bounded source review for hypothetical low-voltage Arduino/ESP32/Raspberry Pi station-adjacent maker work and radio software interoperability, with no device control.
---
# SK-D23 — Radio Maker & Software Research

**Trigger:** User requests review of a hypothetical station-adjacent MCU experiment, open-source rig software interoperability or cautious small-signal RF prototype planning.
**Required context:** Project purpose, user-supplied component aliases (1–24), positive supply <=30 V if asking tool preview, board model/revision and logic level, known vs unverified datasheets, expected power/current, safe measurement environment, code version/license and whether a real device action is requested.
**Output contract:** maker_project_review is a source-registered offline low-voltage conceptual screening only with certified:false; output a source/version-labelled paper-only block diagram, compatibility questions and measurable test hypotheses, marking unknown current/thermal/radio safety INDETERMINATE. Board integration, GPIO access and software installs NOT_IMPLEMENTED.
**Refusal/stop condition:** No firmware flashing, No CAT/PTT or transmission, no real serial/USB/GPIO probing, transceiver configuration, mains/HV/high-current/lithium repairs, soldering instructions for hazardous energized gear or unverified safety certificate. A 29V supply does not make an unknown current or lithium pack intrinsically safe; certified:false stays explicit.

**Tool boundary:** maker_project_review accepts positive supply_voltage_v <=30 and 1..24 supplied component labels and returns certified:false. It does not measure voltage/current, validate a vendor datasheet, change firmware, run commands or provide electrical/RF/EMC certification. No manufacturer/manual provider connected.

- [SS-D23-1 Microcontroller Integration](references/1-microcontroller-integration.md)
- [SS-D23-2 Software Interoperability](references/2-software-interoperability.md)
- [SS-D23-3 Experimental RF Prototyping](references/3-experimental-rf-prototyping.md)
