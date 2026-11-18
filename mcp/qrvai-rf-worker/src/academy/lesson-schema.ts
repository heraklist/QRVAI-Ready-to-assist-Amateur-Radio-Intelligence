/** Original, offline, country-neutral educational material. No exam syllabus or TX operation. */
export type L={en:string;el:string};
export type Kind="CALCULATION"|"SIMULATION_ONLY"|"RECEIVE_ONLY"|"SAFETY_DESK_CHECK";
export type LessonSeed={id:string;explanation:L;practice:L;answer:L;practice_kind:Kind};
export const mk=(id:string,practice_kind:Kind,en:string,el:string,pen:string,pel:string,aen:string,ael:string):LessonSeed=>({id,practice_kind,explanation:{en,el},practice:{en:pen,el:pel},answer:{en:aen,el:ael}});
