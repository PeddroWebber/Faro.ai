import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { finishJourney, newJourney, saveJourneyContact, type Journey } from './journey-model';

export type Page = 'hoje'|'resumo'|'validar'|'assistente'|'chat'|'pipeline'|'cliente'|'agenda'|'historico'|'gestor'|'equipe'|'pauta'|'fontes'|'importar'|'conhecimento'|'api'|'governanca'|'ajustes';
export const stages = ['Novo sinal','Em conversa','Proposta','Fechado'] as const;
export type Opportunity = {id:string;name:string;company:string;type:'B2B'|'B2C';value:number;stage:string;owner:string;heat:number;email:string;phone:string;origin:'IA'|'Assistida'|'Manual';contacted:boolean;sector:string;notes:string;review:'pendente'|'aceita'|'rejeitada';approved?:string;nextAction?:string;activityDate?:string};
export type Source = {id:string;name:string;status:'Demo'|'Não conectado'|'Desativado'|'Erro';scope:string;fresh:string};
export type RecordDoc = {id:string;kind:'Manual'|'Resposta aprovada'|'Instrução';title:string;body:string;version:number;updatedAt?:string};
export type Meeting = {id:string;client:string;date:string;time:string;kind:string;owner:string;notes:string;opportunityId?:string};
export type Log = {id:string;text:string;at:string};
export type Scenario='padrao'|'retorno'|'gestao'|'falha'|'vazio';
export type DemoState={opps:Opportunity[];sources:Source[];docs:RecordDoc[];meetings:Meeting[];logs:Log[];goal:number;team:string;retention:string;pauta:string;onboard:string[];journeys:Record<string,Journey>;activeJourney:string|null;scenario:Scenario};
export const money=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
export const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
export const demoDate='2026-05-14';
export const displayDate=(date:string)=>date.split('-').reverse().join('/');
export function initialState():DemoState{return {
 opps:[
 {id:'o1',name:'Marina Costa',company:'Casa Aurora',type:'B2B',value:18400,stage:'Em conversa',owner:'Lia Martins',heat:87,email:'marina@aurora.example',phone:'(11) 90000-0142',origin:'IA',contacted:false,sector:'Hotelaria',notes:'Renovação de 24 kits de boas-vindas. Confirmar prazo e unidades.',review:'pendente'},
 {id:'o2',name:'Rafael Nunes',company:'Estúdio Nunes',type:'B2B',value:7600,stage:'Proposta',owner:'Lia Martins',heat:74,email:'rafael@nunes.example',phone:'',origin:'Assistida',contacted:false,sector:'Arquitetura',notes:'Proposta enviada. Solicita condições para segunda unidade.',review:'pendente'},
 {id:'o3',name:'Beatriz Leme',company:'Beatriz Leme',type:'B2C',value:1280,stage:'Novo sinal',owner:'Lia Martins',heat:68,email:'bia@exemplo.example',phone:'(11) 90000-0236',origin:'IA',contacted:false,sector:'Pessoa física',notes:'Perguntou sobre reposição e personalização.',review:'pendente'},
 {id:'o4',name:'Pedro Reis',company:'Oliva Mercado',type:'B2B',value:12350,stage:'Em conversa',owner:'Caio Freitas',heat:61,email:'pedro@oliva.example',phone:'',origin:'Manual',contacted:true,sector:'Varejo',notes:'Aguardando definição do mix.',review:'pendente'},
 {id:'o5',name:'Luiza Prado',company:'Prado Ateliê',type:'B2B',value:9320,stage:'Fechado',owner:'Nina Alves',heat:81,email:'luiza@prado.example',phone:'',origin:'Assistida',contacted:true,sector:'Design',notes:'Pedido confirmado em 12/05.',review:'aceita'},
 {id:'o6',name:'Daniel Melo',company:'Daniel Melo',type:'B2C',value:2460,stage:'Fechado',owner:'Caio Freitas',heat:72,email:'daniel@exemplo.example',phone:'',origin:'IA',contacted:true,sector:'Pessoa física',notes:'Compra confirmada em 13/05.',review:'aceita'}
 ],
 sources:[
 {id:'whatsapp',name:'WhatsApp Business',status:'Demo',scope:'Somente canal comercial autorizado; leitura de conversas e metadados.',fresh:'14/05/2026 · 09:12'},
 {id:'email',name:'E-mail comercial',status:'Não conectado',scope:'Leitura apenas da caixa comercial selecionada. Sem permissão de envio.',fresh:'Amostra · 13/05/2026 · 16:40'},
 {id:'csv',name:'Planilhas CSV / XLSX',status:'Demo',scope:'Arquivos fornecidos pela empresa. CSV local; XLSX planejado.',fresh:'14/05/2026 · 08:45'},
 {id:'replies',name:'Respostas aprovadas',status:'Demo',scope:'Textos revisados pela equipe. Uso apenas para sugerir rascunhos.',fresh:'13/05/2026 · 14:20'},
 {id:'manual',name:'Manuais de atendimento',status:'Demo',scope:'Arquivos e instruções autorizados para consulta contextual.',fresh:'12/05/2026 · 10:15'},
 {id:'api',name:'FaroIA API',status:'Não conectado',scope:'Recebe identificadores permitidos e devolve sugestões com proveniência.',fresh:'Sem ingestão'},
 {id:'crm',name:'CRM e outros arquivos',status:'Erro',scope:'Dados comerciais autorizados. Salesforce/Pipedrive são adaptadores planejados.',fresh:'Falha simulada · 14/05/2026 · 08:30'},
 ],
 docs:[
 {id:'d1',kind:'Manual',title:'Manual de atendimento · Aurora',body:'Atender pelo primeiro nome. Para pedidos corporativos, confirmar quantidade, prazo e entrega. Prazo padrão: 12 dias úteis após aprovação. Não prometer descontos sem aprovação da gestão.',version:2},
 {id:'d2',kind:'Resposta aprovada',title:'Pedido corporativo e prazo',body:'Obrigada pelo interesse! Para confirmar o prazo, me conte a quantidade e a data desejada. Nosso prazo padrão é de 12 dias úteis após aprovação.',version:1},
 {id:'d3',kind:'Instrução',title:'Tom de voz da empresa',body:'Seja próximo, objetivo e transparente. Nunca invente estoque ou condições. Convide para uma conversa, sem pressionar.',version:1}
 ],
 meetings:[{id:'m1',client:'Oliva Mercado',date:demoDate,time:'11:00',kind:'Ligação',owner:'Caio Freitas',notes:'Definir mix e próximo passo.'},{id:'m2',client:'Prado Ateliê',date:'2026-05-15',time:'14:30',kind:'Reunião',owner:'Nina Alves',notes:'Acompanhar implantação do pedido.'}],
 logs:[{id:'l1',text:'Amostra carregada: seis oportunidades fictícias e sete fontes demonstrativas.',at:'14/05/2026 · 09:15'},{id:'l2',text:'Manual de atendimento revisado para versão 2.',at:'12/05/2026 · 10:15'}],
 goal:3,team:'Equipe Aurora',retention:'90 dias',pauta:'',onboard:['perfil'],journeys:{},activeJourney:null,scenario:'padrao'
};}
const key='faro-suite-demo-v3';
type ContextValue={data:DemoState;setData:React.Dispatch<React.SetStateAction<DemoState>>;page:Page;go:(p:Page)=>void;selected:string;openClient:(id:string)=>void;assistantTarget:string|null;openAssistant:(id?:string)=>void;openJourney:(id:string)=>void;patchJourney:(id:string,patch:Partial<Journey>)=>void;journeyAction:(id:string,action:'contact'|'finish')=>string;loadScenario:(scenario:Scenario)=>void;storageIssue:boolean;role:string;setRole:(r:string)=>void;notify:(m:string)=>void;updateOpp:(id:string,patch:Partial<Opportunity>,message?:string)=>void;log:(text:string)=>void;reset:(empty?:boolean)=>void};
const Ctx=createContext<ContextValue|null>(null);
function hydrate(value:unknown):DemoState{
 if(!value||typeof value!=='object')return initialState();
 const raw=value as Partial<DemoState>;
 if(!Array.isArray(raw.opps)||!Array.isArray(raw.sources)||!Array.isArray(raw.docs)||!Array.isArray(raw.logs)||!Array.isArray(raw.meetings))return initialState();
 const base={...initialState(),...raw} as DemoState;
 base.journeys=raw.journeys&&typeof raw.journeys==='object'?raw.journeys:{};
 base.activeJourney=typeof raw.activeJourney==='string'?raw.activeJourney:null;
 return base;
}
export function SuiteProvider({children,initialPage}:{children:ReactNode;initialPage:Page}){
 const [data,setData]=useState<DemoState>(()=>{try{const raw=localStorage.getItem(key);return raw?hydrate(JSON.parse(raw)):initialState();}catch{return initialState();}});
 const [storageIssue,setStorageIssue]=useState(false);
 const [page,setPage]=useState<Page>(initialPage),[selected,setSelected]=useState('o1'),[assistantTarget,setAssistantTarget]=useState<string|null>(null),[role,setRole]=useState(initialPage==='gestor'?'Gestor':'Vendedor'),[toast,setToast]=useState('');
 const timeout=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(data));setStorageIssue(false);}catch{setStorageIssue(true);}},[data]);
 useEffect(()=>{const sync=(e:StorageEvent)=>{if(e.key===key&&e.newValue){try{setData(hydrate(JSON.parse(e.newValue)));}catch{/* Ignore malformed demo storage. */}}};window.addEventListener('storage',sync);return()=>{window.removeEventListener('storage',sync);clearTimeout(timeout.current);};},[]);
 const notify=(m:string)=>{setToast(m);clearTimeout(timeout.current);timeout.current=setTimeout(()=>setToast(''),4500);};
 const log=(text:string)=>setData(d=>({...d,logs:[{id:uid(),text,at:'14/05/2026 · sessão local'},...d.logs]}));
 const updateOpp=(id:string,patch:Partial<Opportunity>,message='Oportunidade atualizada no demo.')=>{setData(d=>{const before=d.opps.find(o=>o.id===id);if(!before)return d;return {...d,opps:d.opps.map(o=>o.id===id?{...o,...patch,activityDate:demoDate}:o),meetings:patch.company?d.meetings.map(m=>m.opportunityId===id||(!m.opportunityId&&m.client===before.company)?{...m,client:patch.company!,opportunityId:id}:m):d.meetings,logs:[{id:uid(),text:message,at:'14/05/2026 · sessão local'},...d.logs]};});notify(message);};
  const go=(p:Page)=>{setPage(p);if(p==='chat'||p==='assistente'||p==='agenda')window.history.replaceState(null,'',`#${p}`);window.scrollTo({top:0,behavior:'instant'});};
 const patchJourney=(id:string,patch:Partial<Journey>)=>setData(d=>{const o=d.opps.find(o=>o.id===id);if(!o)return d;const old=d.journeys[id]||newJourney(o,o.approved||'');if(old.completedAt)return d;return {...d,activeJourney:id,journeys:{...d.journeys,[id]:{...old,...patch}}};});
 const openJourney=(id:string)=>{setData(d=>{const o=d.opps.find(o=>o.id===id);if(!o)return d;return {...d,activeJourney:id,journeys:{...d.journeys,[id]:d.journeys[id]||newJourney(o,o.approved||'')}};});go('hoje');};
 const journeyAction=(id:string,action:'contact'|'finish')=>{const fn=action==='contact'?saveJourneyContact<DemoState>:finishJourney<DemoState>;const check=fn(data,id);if(check.error)return check.error;setData(d=>fn(d,id).data);return '';};
 const loadScenario=(scenario:Scenario)=>{const next=initialState();next.scenario=scenario;if(scenario==='retorno'){const o=next.opps[0];const reply=`Olá, Marina! Vamos confirmar a quantidade e a data desejada? Vou verificar o prazo antes de confirmar.`;next.journeys[o.id]={...newJourney(o,reply),step:2,understood:true,replyApproved:true,notes:'Marina pediu 24 kits. A planilha registra 18; quantidade ainda não foi confirmada.',nextAction:'Ligar para confirmar quantidade e prazo.'};next.activeJourney=o.id;o.approved=reply;}if(scenario==='falha'){next.sources=next.sources.map(s=>s.id==='whatsapp'?{...s,status:'Erro',fresh:'Falha simulada · 14/05/2026 · 09:12'}:s);}if(scenario==='vazio'){next.opps=[];next.docs=[];next.meetings=[];next.logs=[];next.onboard=[];next.sources=next.sources.map(s=>({...s,status:'Não conectado',fresh:'Sem amostras carregadas'}));}setData(next);setRole(scenario==='gestao'?'Gestor':'Vendedor');go(scenario==='gestao'?'gestor':scenario==='falha'?'fontes':'hoje');notify('Cenário local carregado. Nenhuma conexão externa.');};
 const reset=(empty=false)=>{const next=initialState();if(empty){next.opps=[];next.docs=[];next.logs=[];next.meetings=[];next.sources=next.sources.map(s=>({...s,status:'Não conectado',fresh:'Sem dados'}));next.onboard=[];next.pauta='';}setData(next);notify(empty?'Dados demonstrativos apagados neste navegador.':'Cenário demonstrativo restaurado.');go(empty?'fontes':'hoje');};
  return <Ctx.Provider value={{data,setData,page,go,selected,openClient:(id)=>{setSelected(id);go('cliente');},assistantTarget,openAssistant:(id)=>{setAssistantTarget(id||null);go('chat');},openJourney,patchJourney,journeyAction,loadScenario,storageIssue,role,setRole,notify,updateOpp,log,reset}}>{children}{toast&&<div className="faro-suite"><div className="toast" role="status">{toast}</div></div>}</Ctx.Provider>;
}
export function useSuite(){const c=useContext(Ctx);if(!c)throw new Error('SuiteProvider ausente');return c;}
