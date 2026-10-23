/** Pure, deterministic demo workflow. No network or browser APIs. */
export const JOURNEY_DATE='2026-05-14';
export type Journey={
 step:number;understood:boolean;reply:string;replyApproved:boolean;notes:string;nextAction:string;stage:string;
 contactConfirmed:boolean;contactSaved:boolean;savedSnapshot:string;date:string;time:string;kind:string;
 completedAt?:string;meetingId?:string;replyTouched?:boolean;
};
export type JourneyOpp={id:string;company:string;name:string;owner:string;stage:string;notes:string;contacted:boolean;approved?:string;nextAction?:string;activityDate?:string};
export type JourneyMeeting={id:string;client:string;date:string;time:string;kind:string;owner:string;notes:string;opportunityId?:string};
type JourneyLog={id:string;text:string;at:string};
export type JourneyStore={opps:JourneyOpp[];journeys:Record<string,Journey>;meetings:JourneyMeeting[];logs:JourneyLog[];activeJourney:string|null};
export function newJourney(o:JourneyOpp,reply=''):Journey{const marker='\nPróximo passo: ',split=o.notes.lastIndexOf(marker);return {step:0,understood:false,reply,replyApproved:false,notes:o.contacted?(split>=0?o.notes.slice(0,split):o.notes):'',nextAction:o.contacted?(o.nextAction||(split>=0?o.notes.slice(split+marker.length):'')):'',stage:o.stage,contactConfirmed:false,contactSaved:false,savedSnapshot:'',date:'2026-05-15',time:'10:00',kind:'Ligação'};}
export function usefulContact(j:Journey){return j.notes.trim().length>=20&&j.nextAction.trim().length>=8&&j.contactConfirmed;}
export function snapshot(j:Journey){return JSON.stringify([j.notes.trim(),j.nextAction.trim(),j.stage,j.contactConfirmed]);}
export function maxJourneyStep(j:Journey){return j.completedAt?4:!j.understood?0:!j.replyApproved?1:!j.contactSaved?2:3;}
export function contactError(j:Journey):string{if(!j.understood)return 'Primeiro confira o contexto e a origem das informações.';if(!j.replyApproved||j.reply.trim().length<20)return 'Revise e aprove um rascunho útil antes de registrar o contato.';if(j.notes.trim().length<20)return 'Conte o que aconteceu: use ao menos 20 caracteres de contexto útil.';if(j.nextAction.trim().length<8)return 'Escreva uma próxima ação clara, com ao menos 8 caracteres.';if(!j.contactConfirmed)return 'Confirme que a conversa aconteceu no cenário demonstrativo. Aprovar texto não é contato.';return '';}
export function scheduleError(j:Pick<Journey,'date'|'time'>){const d=new Date(`${j.date}T12:00:00Z`);if(!/^\d{4}-\d{2}-\d{2}$/.test(j.date)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==j.date||j.date<JOURNEY_DATE)return 'Escolha uma data válida a partir de 14/05/2026.';if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(j.time))return 'Escolha um horário válido.';return '';}
function checksum(text:string){let n=0;for(const c of text)n=(n*31+c.charCodeAt(0))|0;return Math.abs(n).toString(36);}
export function saveJourneyContact<T extends JourneyStore>(data:T,id:string):{data:T;error:string;changed:boolean}{
 const o=data.opps.find(o=>o.id===id),j=data.journeys[id];
 if(!o||!j)return {data,error:'Oportunidade não disponível. Volte à sua lista.',changed:false};
 if(j.completedAt)return {data,error:'',changed:false};
 const error=contactError(j);if(error)return {data,error,changed:false};
 const revision=snapshot(j),notes=`${j.notes.trim()}\nPróximo passo: ${j.nextAction.trim()}`,same=revision===j.savedSnapshot&&o.notes===notes&&o.stage===j.stage&&o.contacted;
 const next={...data,opps:data.opps.map(o=>o.id===id?{...o,notes,nextAction:j.nextAction.trim(),stage:j.stage,contacted:true,activityDate:JOURNEY_DATE}:o),journeys:{...data.journeys,[id]:{...j,step:3,contactSaved:true,savedSnapshot:revision}},logs:same?data.logs:[{id:`path-contact-${id}-${checksum(revision)}-${data.logs.length}`,text:`Caminho: contato útil de ${o.company} revisado no Faro CRM demo. Contexto: ${j.notes.trim()} Próximo passo: ${j.nextAction.trim()}`,at:'14/05/2026 · sessão local'},...data.logs]} as T;
 return {data:next,error:'',changed:!same};
}
export function finishJourney<T extends JourneyStore>(data:T,id:string):{data:T;error:string;changed:boolean}{
 const o=data.opps.find(o=>o.id===id),j=data.journeys[id];
 if(!o||!j)return {data,error:'Oportunidade não disponível.',changed:false};
 if(j.completedAt)return {data,error:'',changed:false};
 const error=contactError(j)||(!j.contactSaved||j.savedSnapshot!==snapshot(j)?'Revise e salve o contexto e a próxima ação no CRM antes de concluir.':'')||scheduleError(j);
 if(error)return {data,error,changed:false};
 const meetingId=`path-meeting-${id}-${JOURNEY_DATE}`;
 if(data.meetings.some(m=>m.id!==meetingId&&m.owner===o.owner&&m.date===j.date&&m.time===j.time))return {data,error:`${o.owner} já tem um compromisso neste horário. Escolha outro horário.`,changed:false};
 const meeting:JourneyMeeting={id:meetingId,opportunityId:id,client:o.company,date:j.date,time:j.time,kind:j.kind,owner:o.owner,notes:j.nextAction.trim()};
 const next={...data,journeys:{...data.journeys,[id]:{...j,step:4,completedAt:JOURNEY_DATE,meetingId}},meetings:[...data.meetings.filter(m=>m.id!==meetingId),meeting],logs:[{id:`path-done-${id}-${JOURNEY_DATE}`,text:`Caminho concluído: ${o.company}. ${j.kind} confirmada para ${j.date.split('-').reverse().join('/')} às ${j.time}; contexto útil + próxima ação registrados.`,at:'14/05/2026 · sessão local'},...data.logs]} as T;
 return {data:next,error:'',changed:true};
}
export function completedJourneys(data:JourneyStore,owner='Lia Martins'){return data.opps.filter(o=>o.owner===owner&&data.journeys[o.id]?.completedAt===JOURNEY_DATE).length;}
