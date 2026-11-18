/** QRVAI Academy — static/offline, no fetch, storage, analytics or RF equipment control. */
import {ACADEMY_MODULES,LESSON_BY_ID,ACADEMY_LESSONS} from "./data.mjs";
const I={
  en:{
    eyebrow:"QRVAI / Amateur Radio Intelligence",title:"International Academy",
    subtitle:"Learn the amateur-radio hobby from original short lessons. No licensing exam, login or transmitter required.",
    home:"RF Workbench",rules:"Rules & Sources",learn:"Learn",search:"Search the hobby",searchHint:"Search module titles or learning outcomes",
    level:"Level",all:"All levels",beginner:"Beginner",intermediate:"Intermediate",advanced:"Advanced",
    modules:"Modules",topicCount:"topics",resultCount:"matching modules",
    lessons:"Lessons",selected:"Lesson",outcome:"Learning outcome",concept:"Concept",
    practice:"Safe practice",answer:"Self-check answer",showAnswer:"Show self-check answer",
    noResults:"No modules match. Try another topic or level.",
    safety:"TRAINING ONLY — receive-only or simulated practice. A lesson does not grant permission to transmit; local rules and authorizations apply.",
    footer:"Offline preview · English / Ελληνικά · No accounts, user tracking, stored answers, station control or external providers.",
    kind:{CALCULATION:"Paper calculation",SIMULATION_ONLY:"Simulation only",RECEIVE_ONLY:"Receive-only",SAFETY_DESK_CHECK:"Safety desk check"}
  },
  el:{
    eyebrow:"QRVAI / Ραδιοερασιτεχνική Ευφυΐα",title:"Διεθνής Academy",
    subtitle:"Μάθε το ραδιοερασιτεχνικό hobby μέσα από πρωτότυπα μικρομαθήματα. Χωρίς εξετάσεις αδειοδότησης, σύνδεση ή πομπό.",
    home:"Εργαλεία RF",rules:"Κανονισμοί & Πηγές",learn:"Μάθηση",search:"Αναζήτηση στο hobby",searchHint:"Αναζήτησε τίτλους ενοτήτων ή μαθησιακούς στόχους",
    level:"Επίπεδο",all:"Όλα τα επίπεδα",beginner:"Αρχάριο",intermediate:"Μεσαίο",advanced:"Προχωρημένο",
    modules:"Ενότητες",topicCount:"θέματα",resultCount:"ενότητες βρέθηκαν",
    lessons:"Μαθήματα",selected:"Μάθημα",outcome:"Μαθησιακός στόχος",concept:"Θεωρία",
    practice:"Ασφαλής άσκηση",answer:"Απάντηση αυτοελέγχου",showAnswer:"Προβολή απάντησης",
    noResults:"Δεν βρέθηκε ενότητα. Δοκίμασε άλλο θέμα ή επίπεδο.",
    safety:"ΜΟΝΟ ΕΚΠΑΙΔΕΥΣΗ — ασκήσεις λήψης ή προσομοίωσης. Το μάθημα δεν αποτελεί άδεια εκπομπής· ισχύουν οι τοπικοί κανόνες.",
    footer:"Offline preview · English / Ελληνικά · Χωρίς λογαριασμούς, παρακολούθηση, αποθήκευση απαντήσεων, έλεγχο σταθμού ή εξωτερικές πηγές.",
    kind:{CALCULATION:"Υπολογισμός στο χαρτί",SIMULATION_ONLY:"Μόνο προσομοίωση",RECEIVE_ONLY:"Μόνο λήψη",SAFETY_DESK_CHECK:"Έλεγχος ασφάλειας"}
  }
};
const els={
  language:document.querySelector("#language"),
  filter:document.querySelector("#level"),
  search:document.querySelector("#query"),
  cards:document.querySelector("#module-list"),
  detail:document.querySelector("#detail"),
  count:document.querySelector("#module-count"),
  tagline:document.querySelector("#tagline"),
  title:document.querySelector("#page-title"),
  home:document.querySelector("#nav-workbench"),
  rules:document.querySelector("#nav-regulations"),
  searchLabel:document.querySelector("#search-label"),
  levelLabel:document.querySelector("#level-label"),
  modulesHeading:document.querySelector("#modules-heading"),
  safety:document.querySelector("#safety"),
  footer:document.querySelector("#footer"),
};
let lang="en",activeModule="radio-fundamentals",activeLesson="radio-fundamentals-1";
const elem=(tag,className,textValue)=>{
  const e=document.createElement(tag);
  if(className)e.className=className;
  if(textValue!==undefined)e.textContent=textValue;
  return e;
};
function chooseLesson(moduleId,id){
  activeModule=moduleId;
  activeLesson=id;
  draw();
  const head=els.detail.querySelector("h2");
  if(head){head.setAttribute("tabindex","-1");head.focus();}
}
function draw(){
  const t=I[lang];
  document.documentElement.lang=lang;
  els.title.textContent=t.title; els.tagline.textContent=t.subtitle;
  els.home.textContent=t.home;els.rules.textContent=t.rules;els.searchLabel.textContent=t.search;
  els.levelLabel.textContent=t.level;els.search.placeholder=t.searchHint;
  els.modulesHeading.textContent=t.modules; els.safety.textContent=t.safety;els.footer.textContent=t.footer;
  const options=[["",t.all],["beginner",t.beginner],["intermediate",t.intermediate],["advanced",t.advanced]];
  const original=els.filter.value;
  els.filter.replaceChildren(...options.map(([value,label])=>{
    const x=elem("option","",label);x.value=value;return x;
  }));
  els.filter.value=original;
  const query=els.search.value.trim().toLocaleLowerCase(lang);
  const shown=ACADEMY_MODULES.filter(m=>
    (!els.filter.value||m.level===els.filter.value)&&
    (!query||[m.id,m.name[lang],m.outcome[lang],...m.lessons.map(l=>l[lang])]
      .some(x=>x.toLocaleLowerCase(lang).includes(query))));
  els.count.textContent=`${shown.length} ${t.resultCount} · ${ACADEMY_LESSONS.length} ${t.topicCount}`;
  els.cards.replaceChildren();
  if(!shown.length)els.cards.append(elem("p","empty",t.noResults));
  for(const m of shown){
    const card=elem("button","module-card");
    card.type="button";
    card.setAttribute("aria-pressed",String(m.id===activeModule));
    card.append(elem("span","module-title",m.name[lang]));
    card.append(elem("small","module-meta",`${t[m.level]} · 3 ${t.topicCount}`));
    card.addEventListener("click",()=>chooseLesson(m.id,m.id+"-1"));
    els.cards.append(card);
  }
  const module=ACADEMY_MODULES.find(x=>x.id===activeModule)??ACADEMY_MODULES[0];
  const lesson=LESSON_BY_ID.get(activeLesson)??LESSON_BY_ID.get(module.id+"-1");
  els.detail.replaceChildren();
  const header=elem("div","detail-head");
  header.append(elem("h2","",module.name[lang]),elem("p","",`${t.outcome}: ${module.outcome[lang]}`));
  els.detail.append(header);
  const lessonNav=elem("nav","lesson-nav");
  lessonNav.setAttribute("aria-label",t.lessons);
  module.lessons.forEach((l,i)=>{
    const id=module.id+"-"+(i+1),button=elem("button","lesson-nav-button",`${i+1}. ${l[lang]}`);
    button.type="button";
    button.setAttribute("aria-pressed",String(id===activeLesson));
    button.addEventListener("click",()=>chooseLesson(module.id,id));
    lessonNav.append(button);
  });
  els.detail.append(lessonNav);
  if(!lesson)return;
  const article=elem("article","lesson-article");
  article.append(elem("h3","",module.lessons.find((_,i)=>module.id+"-"+(i+1)===lesson.id)?.[lang]??t.selected));
  article.append(elem("span","practice-kind",t.kind[lesson.practice_kind]));
  article.append(elem("h4","",t.concept),elem("p","",lesson.explanation[lang]));
  article.append(elem("h4","",t.practice),elem("p","",lesson.practice[lang]));
  const details=elem("details","selfcheck");
  details.append(elem("summary","",t.showAnswer),elem("p","",lesson.answer[lang]));
  article.append(details);
  els.detail.append(article);
}
els.language.addEventListener("change",()=>{lang=els.language.value==="el"?"el":"en";draw();});
els.filter.addEventListener("change",draw);
els.search.addEventListener("input",draw);
draw();
