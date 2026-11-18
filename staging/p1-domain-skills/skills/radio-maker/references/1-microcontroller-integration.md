# SS-D23-1 — Microcontroller Integration

**Owner:** SK-D23
**Responsibility:** develop station-adjacent Arduino/ESP32/RPi project guidance
**Required input:** User-provided board name/revision, Arduino/ESP32/RPi operating voltage and GPIO logic level, station interface use-case and supply-current data from a versioned vendor sheet.
**Procedure:** Sketch an isolated *not connected* low-voltage MCU-to-radio data signal diagram; distinguish 3.3V versus 5V logic and optoisolation conceptually, document missing max-current and protection ratings. State actual MCU GPIO driver/firmware installation NOT_IMPLEMENTED, and flag all CAT/PTT as prohibited operations.
**Output:** Paper-only compatibility checklist with versioned source candidates, unknown-current risk, safety responsibilities and verified-vs-assumed pin ratings.
**Error/stop:** No firmware flashing, No CAT/PTT, no automatic GPIO/serial probing, unsafe mains/battery connections or invented manufacturer pinout.

**Status:** source-only electrical/research notes; maker_project_review yields certified:false, not measured device state. Actual hardware integration NOT_IMPLEMENTED.
