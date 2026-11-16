/** Offline official-source explorer. NOT live statutory text or TX permission. */
import {COUNTRY_PACKS,COUNTRY_BY_CODE,SOURCE_DISCOVERY_ONLY} from "./data.mjs";
const I={
 en:{title:"International Rules & Sources",intro:"Official pointers for research, never a radio transmit licence. Select the country where the station operates.",academy:"Academy",workbench:"RF Workbench",
 country:"Country of operation",choose:"Select operating country",other:"Other / unsupported country",visitor:"I am visiting or operating away from home",national:"National source pointers",international:"International and regional context",status:"Permission status",uncertain:"INDETERMINATE — not verified",unsupported:"No reviewed national source pack. Consult the competent authority of the actual operating country.",coverage:"Source coverage",regulator:"Administration / regulator",checked:"Source page observed",access:"Retrieval status",requiresReview:"Effective legal text, amendments, licence class, visitor recognition, permitted frequencies, power and operating site remain UNVERIFIED.",visitorNote:"Home licence and CEPT arrangements are not automatic permission in the visited country.",sourceNotes:"Publisher / source context",open:"Open official source",global:"ITU Radio Regulations — international framework, not individual permission",iaru:"IARU regional band plans — generally voluntary guidance",cept:"CEPT T/R 61-01 — participating countries and visitor conditions require checking",safety:"LEGAL RESEARCH ONLY. Nothing shown authorizes a transmission or certifies current national law.",footer:"Offline preview. No IP/callsign/GPS-based country inference, data retention, logbook, licence check, payment or radio transmission.",unknown:"Source not reviewed",partial:"Partial official adapter",manual:"Official source pointers only"},
 el:{title:"Διεθνείς Κανονισμοί και Πηγές",intro:"Επίσημες παραπομπές για έρευνα, ποτέ άδεια εκπομπής. Επίλεξε τη χώρα όπου λειτουργεί ο σταθμός.",academy:"Academy",workbench:"Εργαλεία RF",
 country:"Χώρα λειτουργίας",choose:"Επιλογή χώρας λειτουργίας",other:"Άλλη / μη υποστηριζόμενη χώρα",visitor:"Είμαι επισκέπτης ή λειτουργώ εκτός χώρας μου",national:"Εθνικές επίσημες πηγές",international:"Διεθνές και περιφερειακό πλαίσιο",status:"Κατάσταση δικαιώματος",uncertain:"ΑΠΡΟΣΔΙΟΡΙΣΤΟ — δεν επαληθεύτηκε",unsupported:"Δεν υπάρχει ελεγμένο country pack. Συμβουλεύσου την αρμόδια εθνική αρχή στη χώρα λειτουργίας.",coverage:"Κάλυψη πηγών",regulator:"Διοίκηση / ρυθμιστική αρχή",checked:"Έλεγχος σελίδας πηγής",access:"Κατάσταση πρόσβασης",requiresReview:"Το ισχύον κείμενο, οι τροποποιήσεις, η κατηγορία άδειας, η αναγνώριση επισκέπτη, συχνότητες, ισχύς και τόπος λειτουργίας ΔΕΝ ΕΧΟΥΝ ΕΠΑΛΗΘΕΥΤΕΙ.",visitorNote:"Η άδεια της χώρας καταγωγής και το CEPT δεν εξασφαλίζουν αυτόματα δικαιώματα στη χώρα επίσκεψης.",sourceNotes:"Εκδότης / πληροφορίες πηγής",open:"Άνοιγμα επίσημης πηγής",global:"ITU Radio Regulations — διεθνές πλαίσιο, όχι προσωπική άδεια",iaru:"IARU band plans — συνήθως μη δεσμευτική καθοδήγηση",cept:"CEPT T/R 61-01 — έλεγξε χώρες συμμετοχής και όρους επισκέπτη",safety:"ΜΟΝΟ ΕΡΕΥΝΑ ΝΟΜΟΘΕΣΙΑΣ. Καμία πληροφορία εδώ δεν επιτρέπει εκπομπή ούτε πιστοποιεί το ισχύον εθνικό δίκαιο.",footer:"Offline preview. Δεν γίνεται εξαγωγή χώρας από IP/διακριτικό/GPS, αποθήκευση δεδομένων, έλεγχος άδειας, πληρωμή ή εκπομπή.",unknown:"Πηγή χωρίς αξιολόγηση",partial:"Μερικός επίσημος adapter",manual:"Μόνο επίσημες παραπομπές"}
};
const approvedHosts=new Set(["www.gesetze-im-internet.de","www.ofcom.org.uk","www.acma.gov.au","ised-isde.canada.ca","www.rsm.govt.nz","www.tele.soumu.go.jp","www.ecfr.gov","www.eett.gr","api.et.gr","www.itu.int","www.iaru.org","docdb.cept.org"]);
const verifiedLink=(url)=>{
  try{const u=new URL(url);return u.protocol==="https:"&&approvedHosts.has(u.hostname)?u.href:null;}catch{return null;}
};
const elem=(tag,cls,value)=>{
  const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e;
};
const nodes={
  language:document.querySelector("#language"),country:document.querySelector("#country"),
  visitor:document.querySelector("#visitor"),content:document.querySelector("#national"),
  list:document.querySelector("#global"),title:document.querySelector("#page-title"),
  intro:document.querySelector("#intro"),safety:document.querySelector("#safety"),
  footer:document.querySelector("#footer"),countryLabel:document.querySelector("#country-label"),
  visitorLabel:document.querySelector("#visitor-label"),globalHeading:document.querySelector("#global-heading"),
  nationalHeading:document.querySelector("#national-heading"),
  academy:document.querySelector("#nav-academy"),workbench:document.querySelector("#nav-workbench")
};
let lang="en";
function officialAnchor(url,label){
  const safe=verifiedLink(url);
  if(!safe)return elem("span","blocked-link","Unverified link / Μη επαληθευμένος σύνδεσμος");
  const a=elem("a","official-link",label);a.href=safe;a.target="_blank";a.rel="noopener noreferrer";return a;
}
function render(){
  const t=I[lang];
  document.documentElement.lang=lang;
  nodes.title.textContent=t.title;nodes.intro.textContent=t.intro;
  nodes.safety.textContent=t.safety;nodes.footer.textContent=t.footer;
  nodes.countryLabel.textContent=t.country;
  nodes.visitorLabel.textContent=t.visitor;
  nodes.academy.textContent=t.academy;nodes.workbench.textContent=t.workbench;
  nodes.globalHeading.textContent=t.international;nodes.nationalHeading.textContent=t.national;
  const selected=nodes.country.value;
  nodes.country.replaceChildren();
  const options=[["",t.choose],...COUNTRY_PACKS.map(p=>[p.country_code,p.canonical_country_name+" · "+p.country_code]),["OTHER",t.other]];
  for(const [value,label] of options){const o=elem("option","",label);o.value=value;nodes.country.append(o);}
  nodes.country.value=selected;
  nodes.list.replaceChildren();
  const globalSources=[
    ["https://www.itu.int/pub/R-REG-RR/en",t.global],
    ["https://www.iaru.org/on-the-air/band-plans/",t.iaru],
    ["https://docdb.cept.org/document/925",t.cept],
  ];
  const ul=elem("ul","source-list");
  for(const [url,label] of globalSources){const li=elem("li");li.append(officialAnchor(url,label));ul.append(li);}
  nodes.list.append(ul);
  nodes.content.replaceChildren();
  if(!selected){nodes.content.append(elem("p","empty",t.choose));return;}
  const pack=COUNTRY_BY_CODE.get(selected);
  const status=elem("div","status");
  status.append(elem("span","status-title",t.status),elem("strong","",t.uncertain));
  nodes.content.append(status);
  if(nodes.visitor.checked)nodes.content.append(elem("p","visitor-warning",t.visitorNote));
  if(!pack){nodes.content.append(elem("p","empty",t.unsupported));return;}
  const dl=elem("dl","metadata");
  const entries=[[t.regulator,pack.regulator],[t.coverage,pack.coverage==="PARTIAL_OFFICIAL_SOURCE_ADAPTER"?t.partial:t.manual]];
  for(const [k,v] of entries){dl.append(elem("dt","",k),elem("dd","",v));}
  nodes.content.append(dl);
  const sources=elem("ul","source-list");
  for(const source of pack.national_sources){
    const item=elem("li","national-source");
    item.append(elem("strong","",source.title),elem("small","",source.publisher));
    item.append(elem("span","source-note",t.checked+": "+source.discovery_checked_on));
    item.append(elem("span","source-note",t.access+": "+source.retrieval));
    item.append(elem("p","",source.provenance_note));
    item.append(officialAnchor(source.url,t.open));
    sources.append(item);
  }
  nodes.content.append(sources,elem("p","warning",t.requiresReview));
}
nodes.language.addEventListener("change",()=>{lang=nodes.language.value==="el"?"el":"en";render();});
nodes.country.addEventListener("change",render);
nodes.visitor.addEventListener("change",render);
if(SOURCE_DISCOVERY_ONLY!==true)throw Error("Legal interface must not present permission claims");
render();
