# SS-B07-2 — Link Budget Analysis

**Owner:** SK-B07
**Responsibility:** calculate transmit chain, path attenuation and receiver margin
**Required input:** Exactly supplied `tx_w`, `tx_gain_dbi`, `tx_loss_db`, `path_loss_db`, `rx_gain_dbi`, `rx_loss_db`, `rx_sensitivity_dbm`, including meaning and units; path_loss_db is never inferred without an explicit approved propagation model.
**Procedure:** Convert Tx W to dBm using the 1 mW reference. Compute Rx dBm = Tx dBm + Tx gain dBi − Tx passive loss dB − supplied propagation path loss dB + Rx antenna gain dBi − Rx passive loss dB; margin dB = Rx dBm − receiver sensitivity dBm. Source-registered `rf_link_budget` requires all seven exact keys above. Reject negative passive/path losses or absent sensitivity. If physical conditions are not modeled, do not state coverage probability.
**Output:** With Tx 1 W (30 dBm), gains 2 dBi each, Tx/Rx losses 1 dB each, supplied path loss 100 dB and receiver sensitivity −100 dBm: Rx = −68 dBm; link margin = 32 dB. State all assumptions, calculation revision if tool used, and that no RF field measurement or reception guarantee was performed.
**Error/stop:** Missing seven-key input, undocumented path loss, unsupported gain references, overflow or negative attenuation => MISSING_CONTEXT, INDETERMINATE or OUT_OF_RANGE; never infer legal operating authorization from positive margin.
