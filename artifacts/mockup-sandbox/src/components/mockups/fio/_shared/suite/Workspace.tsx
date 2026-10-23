import { LayoutDashboard, MessageCircle, Kanban, CalendarDays, History as HistoryIcon, ChartNoAxesCombined, UsersRound, ClipboardList, Database, FileSpreadsheet, BookOpen, Cable, ShieldCheck, Settings2, Check, Compass, ListChecks } from 'lucide-react';
import { Brand } from '../ui';
import { SuiteProvider, useSuite, type Page } from './state';
import { Agenda, ClientDetail, History, Pipeline, SellerHome } from './Sales';
import { Manager, MeetingBrief } from './Manager';
import { APIScreen, Governance, Settings, Sources } from './Data';
import { CSVImport, Knowledge } from './Knowledge';
import { Assistant } from './Assistant';
import { ChatFaro } from './ChatFaro';
import { JourneyHome } from './Journey';
import { Validation } from './Validation';
import './suite.css';

const nav=[
 {label:'Seu caminho',items:[{id:'hoje',name:'Meu caminho',icon:Compass},{id:'chat',name:'Faro Chat',icon:MessageCircle},{id:'assistente',name:'Revisão CRM',icon:MessageCircle}]},
 {label:'Acesso livre',items:[{id:'resumo',name:'Resumo do dia',icon:LayoutDashboard},{id:'pipeline',name:'Oportunidades',icon:Kanban},{id:'agenda',name:'Agenda',icon:CalendarDays},{id:'historico',name:'Histórico',icon:HistoryIcon}]},
 {label:'Visão da gestão',items:[{id:'gestor',name:'Inteligência',icon:ChartNoAxesCombined},{id:'equipe',name:'Equipe e energia',icon:UsersRound},{id:'pauta',name:'Pauta de reunião',icon:ClipboardList}]},
 {label:'Contexto e controle',items:[{id:'fontes',name:'Fontes de dados',icon:Database},{id:'importar',name:'Importar CSV',icon:FileSpreadsheet},{id:'conhecimento',name:'Conhecimento',icon:BookOpen},{id:'api',name:'FaroIA API',icon:Cable},{id:'governanca',name:'Governança',icon:ShieldCheck},{id:'ajustes',name:'Configurações',icon:Settings2},{id:'validar',name:'Validar a demo',icon:ListChecks}]}
];
function Shell(){
  const {page,go,role,setRole,data,storageIssue,setData}=useSuite();
 const group=page==='cliente'?'Oportunidades':nav.flatMap(g=>g.items).find(i=>i.id===page)?.name;
  const content=()=>{switch(page){case 'hoje':return <JourneyHome/>;case 'resumo':return <SellerHome/>;case 'validar':return <Validation/>;case 'chat':return <ChatFaro/>;case 'assistente':return <Assistant/>;case 'pipeline':return <Pipeline/>;case 'cliente':return <ClientDetail/>;case 'agenda':return <Agenda/>;case 'historico':return <History/>;case 'gestor':return <Manager/>;case 'equipe':return <Manager teamOnly/>;case 'pauta':return <MeetingBrief/>;case 'fontes':return <Sources/>;case 'importar':return <CSVImport/>;case 'conhecimento':return <Knowledge/>;case 'api':return <APIScreen/>;case 'governanca':return <Governance/>;case 'ajustes':return <Settings/>;default:return <JourneyHome/>;}}
  return <div className="faro-suite"><div className="app-layout"><aside className="side"><div><Brand/><div className="workspace-name">{data.team}</div></div><nav className="nav-list" aria-label="Navegação do espaço comercial">{nav.map(g=><div key={g.label} style={{display:'contents'}}><div className="nav-label">{g.label}</div>{g.items.map(i=><button key={i.id} className={`nav-item ${page===i.id||(page==='cliente'&&i.id==='pipeline')?'active':''}`} aria-current={page===i.id?'page':undefined} onClick={()=>go(i.id as Page)}><i.icon size={18} strokeWidth={1.8}/>{i.name}</button>)}</div>)}</nav><div className="side-foot"><div className="person"><span className="avatar">{role==='Gestor'?'RC':'LM'}</span><div><strong>{role==='Gestor'?'Renata Campos':'Lia Martins'}</strong><small>{role} · demonstração</small></div></div></div></aside><main className="main"><div className="topbar"><div className="row"><span className="demo-pill">DEMO INTERATIVA</span><span className="muted">Espaço comercial / <strong>{group}</strong></span></div><div className="row"><small className="row" style={{gap:5}}><Check size={12}/>{storageIssue?'Somente em memória':'Estado local'}</small><label style={{display:'flex',alignItems:'center',gap:7}}><span className="mini-label">Visão</span><select aria-label="Alternar visão da demonstração" value={role} onChange={e=>{setRole(e.target.value);go(e.target.value==='Gestor'?'gestor':'hoje');}}><option>Vendedor</option><option>Gestor</option></select></label></div></div>{storageIssue&&<div className="storage-warning" role="alert">O navegador não permitiu salvar. O demo funciona em memória, mas pode perder alterações ao fechar. <button className="text-link" onClick={()=>setData(d=>({...d}))}>Tentar salvar novamente</button></div>}<div className="content" key={page}>{content()}<footer style={{marginTop:32,borderTop:'1px solid var(--line)',paddingTop:16}}><small>Faro IA · Cenário fictício de 14/05/2026 · Nenhuma mensagem enviada, nenhum serviço externo conectado.<br/><span className="provider">by OpenAI · provedor de IA previsto na arquitetura. Integração não ativa; sem endosso oficial.</span></small></footer></div></main></div></div>;
}
export function Workspace({initialPage='hoje'}:{initialPage?:Page}){return <SuiteProvider initialPage={initialPage}><Shell/></SuiteProvider>;}
