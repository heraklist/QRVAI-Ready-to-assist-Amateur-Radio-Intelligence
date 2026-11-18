# SS-C16-1 — Mode Basics

**Owner:** SK-C16
**Responsibility:** explain FT8/FT4/RTTY/PSK/JS8/SSTV and constraints
**Required input:** Question about FT8/FT4/RTTY/PSK/JS8/SSTV/APRS; target band, legal licence context and requested behaviour (receive/simulated only).
**Procedure:** Explain modulation, timing and typical activity at a conceptual level; contrast FT8 receive decoder with full auto-TX. digital_setup_guide only handles FT8/APRS, so all other modes get version-independent education and explicitly NOT_IMPLEMENTED for assisted setup/tool calls.
**Output:** Mode comparison annotated as theory, not installed software capability, with licensed operation unknown until checked.
**Error/stop:** Do not enable TX or claim active program/rig connection; no automatic CQ or digital message transmissions.

**Status:** Educational only; digital_setup_guide simulated:true, real CAT/PTT/audio operations NOT_IMPLEMENTED.
