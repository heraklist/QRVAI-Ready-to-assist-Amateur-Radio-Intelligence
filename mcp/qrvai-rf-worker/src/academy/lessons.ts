/** Bilingual content index; all lessons work offline, are simulated or receive-only. */
import {lessonsA} from "./lesson-units-a.ts";
import {lessonsB} from "./lesson-units-b.ts";
import {lessonsC} from "./lesson-units-c.ts";
export const ACADEMY_LESSONS=[...lessonsA,...lessonsB,...lessonsC] as const;
export function academyLesson(lesson_id:string,language:"en"|"el"){
  const lesson=ACADEMY_LESSONS.find(l=>l.id===lesson_id);
  if(!lesson) return null;
  return {
    lesson_id,language,practice_kind:lesson.practice_kind,
    explanation:lesson.explanation[language],
    practical_activity:lesson.practice[language],
    self_check_answer:lesson.answer[language],
    training_only:true,country_licence_exam_prep:false,transmission_required:false,
    session_data_collected:false,
    disclaimer:language==="el"
      ? "Εκπαιδευτικό υλικό μόνο. Χωρίς εκπομπή, χωρίς εθνική προετοιμασία εξετάσεων και χωρίς παροχή άδειας."
      : "Educational only. No transmission, no national exam preparation and no operating permission.",
  };
}
