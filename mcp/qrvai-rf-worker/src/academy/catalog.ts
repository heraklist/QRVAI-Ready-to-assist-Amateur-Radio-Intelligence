/** International, hobby-first Academy catalogue (ADR-0012).
 * Offline learning content, independent of national licences and examination syllabi.
 */
export type AcademyLanguage = "en" | "el";
type Localized = {en: string; el: string};
type Module = {id: string; level: "beginner" | "intermediate" | "advanced"; name: Localized; outcome: Localized; lessons: readonly Localized[]};
const t = (en: string, el: string): Localized => ({en, el});
export const ACADEMY_MODULES: readonly Module[] = Object.freeze([
  {id:"radio-fundamentals",level:"beginner",name:t("Radio & RF fundamentals","Βασικές αρχές ραδιοκυμάτων και RF"),outcome:t("Explain frequency, wavelength, modulation and receiver fundamentals.","Εξήγησε συχνότητα, μήκος κύματος, διαμόρφωση και βασικές αρχές λήψης."),lessons:[t("Frequency, wavelength and spectrum","Συχνότητα, μήκος κύματος και φάσμα"),t("AM, FM, SSB and modulation","AM, FM, SSB και διαμόρφωση"),t("Receiving signals and noise","Λήψη σημάτων και θόρυβος")]},
  {id:"electronics-and-measurement",level:"beginner",name:t("Electronics & measurement","Ηλεκτρονικά και μετρήσεις"),outcome:t("Interpret simple circuits and use instruments safely.","Κατανόησε απλά κυκλώματα και ασφαλή χρήση οργάνων."),lessons:[t("Voltage, current and impedance","Τάση, ρεύμα και σύνθετη αντίσταση"),t("Multimeter and spectrum display","Πολύμετρο και οπτικοποίηση φάσματος"),t("Electrical and RF safety","Ηλεκτρική ασφάλεια και ασφάλεια RF")]},
  {id:"antennas-and-feedlines",level:"beginner",name:t("Antennas & feedlines","Κεραίες και γραμμές μεταφοράς"),outcome:t("Reason about antennas, matching, coax loss and SWR.","Κατανόησε κεραίες, προσαρμογή, απώλειες ομοαξονικών και SWR."),lessons:[t("Dipoles, verticals and polarization","Δίπολα, κατακόρυφες και πόλωση"),t("Impedance, SWR and matching","Σύνθετη αντίσταση, SWR και προσαρμογή"),t("Cable attenuation and station losses","Απώλειες καλωδίων και σταθμού")]},
  {id:"propagation",level:"intermediate",name:t("Propagation & space weather","Διάδοση και διαστημικός καιρός"),outcome:t("Interpret propagation mechanisms and observed space-weather indicators.","Ερμήνευσε μηχανισμούς διάδοσης και παρατηρούμενους δείκτες διαστημικού καιρού."),lessons:[t("Groundwave, skywave and line of sight","Κύμα εδάφους, ιονοσφαιρικό κύμα και οπτική επαφή"),t("Solar flux, Kp and ionospheric effects","Ηλιακή ροή, Kp και ιονοσφαιρικές επιδράσεις"),t("Reading reception reports","Ανάγνωση αναφορών λήψης")]},
  {id:"operating-practice",level:"beginner",name:t("Operating practice & QSOs","Λειτουργική πρακτική και QSO"),outcome:t("Describe courteous, efficient on-air exchanges without treating lessons as transmit authorization.","Περιέγραψε ευγενικές και αποδοτικές επαφές χωρίς να θεωρείται το μάθημα άδεια εκπομπής."),lessons:[t("Listening first and clear exchanges","Πρώτα ακρόαση και σαφείς ανταλλαγές"),t("Phonetic alphabet and signal reports","Φωνητικό αλφάβητο και αναφορές σήματος"),t("Logging a practice QSO","Καταγραφή εικονικού QSO")]},
  {id:"morse-and-cw",level:"beginner",name:t("Morse & CW practice","Εξάσκηση Morse και CW"),outcome:t("Build comfortable rhythm with letters, numbers and short QSO practice.","Ανάπτυξε ρυθμό με γράμματα, αριθμούς και εξάσκηση σύντομων QSO."),lessons:[t("Morse timing and sound patterns","Χρονισμός Morse και ηχητικά μοτίβα"),t("Callsign copy and abbreviations","Αντιγραφή διακριτικών και συντομογραφίες"),t("Simulated CW exchange","Προσομοιωμένη επαφή CW")]},
  {id:"digital-modes",level:"intermediate",name:t("Digital modes & data","Ψηφιακές διαμορφώσεις και δεδομένα"),outcome:t("Understand common digital workflows and decoding without uncontrolled transmission.","Κατανόησε ψηφιακές λειτουργίες και αποκωδικοποίηση χωρίς ανεξέλεγκτη εκπομπή."),lessons:[t("Audio interfaces and decoding","Συνδέσεις ήχου και αποκωδικοποίηση"),t("FT8, WSPR and operating trade-offs","FT8, WSPR και επιλογές λειτουργίας"),t("Packet, APRS and data privacy","Packet, APRS και ιδιωτικότητα δεδομένων")]},
  {id:"sdr-and-satellites",level:"intermediate",name:t("SDR & amateur satellites","SDR και ραδιοερασιτεχνικοί δορυφόροι"),outcome:t("Explore spectrum displays, satellite passes and receiver-side experiments.","Εξερεύνησε φάσμα, διελεύσεις δορυφόρων και πειράματα λήψης."),lessons:[t("Waterfall and signal analysis","Waterfall και ανάλυση σημάτων"),t("Orbital passes and Doppler effect","Διελεύσεις και φαινόμενο Doppler"),t("Receive-only SDR experiment","Πείραμα SDR μόνο λήψης")]},
  {id:"field-maker-community",level:"intermediate",name:t("Portable, maker & community","Φορητή λειτουργία, κατασκευές και κοινότητα"),outcome:t("Plan safe hobby projects, portable practice and club mentoring.","Οργάνωσε ασφαλείς κατασκευές, φορητές δραστηριότητες και συνεργασία συλλόγων."),lessons:[t("Field-station safety checklist","Λίστα ασφάλειας υπαίθριου σταθμού"),t("Build and document a receive-only antenna","Κατασκευή και τεκμηρίωση κεραίας λήψης"),t("Club workshops and mentoring","Εργαστήρια συλλόγων και καθοδήγηση")]},
]);
export function academyCatalog(input: {language: AcademyLanguage; module_id?: string; level?: "beginner" | "intermediate" | "advanced"}) {
  const {language, module_id, level} = input;
  const modules = ACADEMY_MODULES.filter(m => (!module_id || m.id === module_id) && (!level || m.level === level));
  return {
    catalog_version: "2026-11-16-v1",
    scope: "INTERNATIONAL_HOBBY_LEARNING",
    language,
    country_specific_licensing_or_exam_prep: false,
    learning_confers_operating_privileges: false,
    exercises: "offline, simulated, receive-only or performed under locally applicable authorization",
    count: modules.length,
    modules: modules.map(m => ({
      id: m.id, level: m.level, title: m.name[language],
      learning_outcome: m.outcome[language],
      lessons: m.lessons.map((l, i) => ({id: `${m.id}-${i + 1}`, title: l[language]})),
    })),
    requested_module_found: module_id === undefined ? null : modules.some(m => m.id === module_id),
    disclaimer: language === "el"
      ? "Τα μαθήματα αφορούν το hobby, όχι εθνικές εξετάσεις ή αδειοδότηση. Η εκπομπή υπόκειται στην τοπική νομοθεσία."
      : "Hobby lessons, not national licence/exam preparation. Transmitting remains subject to applicable local rules.",
  };
}
