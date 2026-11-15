import { convertPower, feedlineLoss, linkBudget } from "./calculations.mjs";
const forms = {
  power: document.getElementById("power-form"),
  cable: document.getElementById("cable-form"),
  link: document.getElementById("link-form")
};
let lastCableResult = null;

function getNumber(form, name) {
  const control = form.elements.namedItem(name);
  if (!(control instanceof HTMLInputElement) || !control.value.trim()) {
    throw new RangeError(`Συμπλήρωσε το πεδίο ${name}.`);
  }
  const value = Number(control.value);
  if (!Number.isFinite(value)) throw new RangeError(`Μη έγκυρη αριθμητική τιμή: ${name}.`);
  return value;
}
const n = (value, digits = 3) => Math.abs(value) > 0 && (Math.abs(value) < 0.00001 || Math.abs(value) >= 1e9)
  ? value.toExponential(4)
  : new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(value);

function present(targetId, lines, error = false) {
  const output = document.getElementById(targetId);
  output.textContent = lines.join("\n");
  output.dataset.status = error ? "error" : "ok";
}
function run(event, callback, id) {
  event.preventDefault();
  try { present(id, callback()); }
  catch (error) { present(id, [error instanceof Error ? error.message : "Αποτυχία εισόδου."], true); }
}

forms.power.addEventListener("submit", (e) => run(e, () => {
  const v = convertPower({ value: getNumber(forms.power, "value"), unit: forms.power.elements.namedItem("unit").value });
  return [`Ισχύς: ${n(v.watts, 9)} W`, `${n(v.milliwatts, 6)} mW · ${n(v.dBm)} dBm · ${n(v.dBW)} dBW`];
}, "power-result"));

forms.cable.addEventListener("submit", (e) => run(e, () => {
  lastCableResult = null;
  const v = feedlineLoss(Object.fromEntries(["frequencyMHz","lowMHz","highMHz","lowLossDbPer100m","highLossDbPer100m","lengthM","connectorLossDb"].map(k => [k, getNumber(forms.cable, k)])));
  lastCableResult = v;
  document.getElementById("apply-cable").disabled = false;
  return [`Απώλεια καλωδίου: ${n(v.cableLossDb)} dB · Συνδέσμων: ${n(v.connectorLossDb)} dB`,
    `Συνολικά: ${n(v.totalLossDb)} dB (${n(v.dbPer100m)} dB/100 m)`,
    "Εντός των δύο δηλωμένων σημείων · δεδομένα χρήστη, μη επαληθευμένα."];
}, "cable-result"));

document.getElementById("apply-cable").addEventListener("click", () => {
  if (!lastCableResult) return;
  forms.link.elements.namedItem("txLossDb").value = String(lastCableResult.totalLossDb);
  forms.link.elements.namedItem("frequencyMHz").value = forms.cable.elements.namedItem("frequencyMHz").value;
  present("link-result", ["Η απώλεια καλωδίου και η συχνότητα μεταφέρθηκαν από το παραπάνω εργαλείο. Υπολόγισε για ενημέρωση."]);
  forms.link.elements.namedItem("txLossDb").focus();
});

forms.link.addEventListener("submit", (e) => run(e, () => {
  const v = linkBudget(Object.fromEntries(["txWatts","frequencyMHz","distanceKm","txGainDbi","rxGainDbi","txLossDb","rxLossDb","receiverSensitivityDbm"].map(k => [k, getNumber(forms.link, k)])));
  return [`EIRP: ${n(v.eirpDbm)} dBm · Απώλεια ελεύθερου χώρου: ${n(v.fsplDb)} dB`,
    `Εκτιμώμενο επίπεδο λήψης: ${n(v.receivedDbm)} dBm`,
    `Περιθώριο ως προς τη δηλωμένη ευαισθησία: ${n(v.marginDb)} dB`,
    "Ιδανικός ελεύθερος χώρος μόνο. Δεν προβλέπει πραγματική κάλυψη ή νόμιμη άδεια εκπομπής."];
}, "link-result"));
