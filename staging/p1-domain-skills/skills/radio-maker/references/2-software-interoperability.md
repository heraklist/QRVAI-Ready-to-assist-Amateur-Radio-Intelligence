# SS-D23-2 — Software Interoperability

**Owner:** SK-D23
**Responsibility:** review open-source radio interfaces and test strategy
**Required input:** User-selected open-source radio software/library names, source repository commit/version, supported OS, license text and expected desired *receive-only* integration.
**Procedure:** Compare conceptual API/protocol capability and read-only data shapes using checked documentation; propose isolated mock and negative permission tests for a future opt-in connection. Do not execute downloaded code, ask for tokens or connect to serial port; manufacturer/license verification UNREVIEWED until done.
**Output:** Version-scoped interoperability matrix and acceptance test plan with NOT_IMPLEMENTED runtime adapter and explicit unverified rights.
**Error/stop:** No real CAT write, transceiver PTT, file install, shell command on the user's computer, authentication secrets or unauthorized network scanning.

**Status:** source-only electrical/research notes; maker_project_review yields certified:false, not measured device state. Actual hardware integration NOT_IMPLEMENTED.
