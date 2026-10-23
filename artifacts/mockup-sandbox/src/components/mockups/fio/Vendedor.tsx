import { useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCheck, ChevronRight, Clock3, Compass, History as HistoryIcon, Kanban, MessageCircle, Mic, MoreHorizontal, Sparkles, Target } from 'lucide-react';
import { Brand, Mascot } from '../../../../../faro-design-system/src/components/identity';
import { Button } from '../../../../../faro-design-system/src/components/actions';
import { Textarea } from '../../../../../faro-design-system/src/components/fields';
import { Notice } from '../../../../../faro-design-system/src/components/feedback';
import tokens from '../../../../../faro-design-system/tokens.json';
import { SuiteProvider, useSuite, demoDate, displayDate, money, uid, type Opportunity, type Page } from './_shared/suite/state';
import { Agenda, ClientDetail, History, Pipeline } from './_shared/suite/Sales';
import { Assistant } from './_shared/suite/Assistant';
import { ChatFaro } from './_shared/suite/ChatFaro';
import { Validation } from './_shared/suite/Validation';
import { APIScreen, Governance, Settings, Sources } from './_shared/suite/Data';
import { CSVImport, Knowledge } from './_shared/suite/Knowledge';
import { RespostaCliente } from './RespostaCliente';
import './_shared/suite/suite.css';
import '../../../../../faro-design-system/src/components/faro.css';
import './Vendedor.css';

const navigation = [
  { page:'hoje', label:'Meu dia', icon:Compass },
  { page:'chat', label:'Faro Chat', icon:MessageCircle },
  { page:'pipeline', label:'Oportunidades', icon:Kanban },
  { page:'agenda', label:'Agenda', icon:CalendarDays },
  { page:'historico', label:'Contatos feitos', icon:HistoryIcon },
] as const;
const colors = tokens.color.light;
const sellerTheme = {
  '--paper':colors.background.$value,'--surface':colors.card.$value,
  '--ink':colors.foreground.$value,'--line':colors.border.$value,
  '--muted':colors.mutedForeground.$value,'--teal':colors.secondaryForeground.$value,
  '--mint':colors.secondary.$value,'--peach':colors.accent.$value,
  '--accent':colors.primary.$value,
} as CSSProperties;

function taskFor(o: Opportunity) {
  if (o.stage === 'Proposta') return { title:'Retomar a proposta', action:'Confirmar a dúvida e combinar um retorno.', outcome:'Sair da conversa com um próximo passo combinado.', channel:'E-mail ou ligação' };
  if (o.type === 'B2C') return { title:'Responder ao interesse', action:'Confirmar o que o cliente procura antes de indicar uma opção.', outcome:'Entender a necessidade e orientar a escolha.', channel:'WhatsApp' };
  return { title:'Confirmar os detalhes do pedido', action:'Conferir quantidade e prazo antes de confirmar a proposta.', outcome:'Evitar uma proposta com informação incompleta.', channel:'WhatsApp ou ligação' };
}

function SellerShell() {
  const { page, go, data, storageIssue } = useSuite();
  const current = navigation.find(item => item.page === page)?.label || (page === 'cliente' ? 'Contexto do cliente' : 'Cenários de validação');
  const content = page === 'hoje' ? <Today/> : page === 'chat' ? <ChatFaro/> : page === 'assistente' ? <Assistant/> : page === 'pipeline' ? <Pipeline/> : page === 'cliente' ? <><OpportunityPager/><ClientDetail/></> : page === 'agenda' ? <Agenda/> : page === 'validar' ? <Validation/> : page === 'fontes' ? <Sources/> : page === 'importar' ? <CSVImport/> : page === 'conhecimento' ? <Knowledge/> : page === 'api' ? <APIScreen/> : page === 'governanca' ? <Governance/> : page === 'ajustes' ? <Settings/> : ['gestor','equipe','pauta'].includes(page) ? <Notice>Esse cenário é da gestão. <Button variant="quiet" onClick={()=>{window.location.href='/preview/fio/Gestor';}}>Abrir área do gestor <ArrowRight size={14}/></Button></Notice> : <History/>;
  return <div className={`fio faro-suite seller80 ${page === 'chat' ? 'seller-chat-focus' : ''}`} style={sellerTheme}><div className="s80-layout">
    <aside className="s80-side"><Brand/><span className="s80-team">{data.team} · vendedor</span>
      <nav aria-label="Área do vendedor">{navigation.map(item => <Button key={item.page} variant={page === item.page ? 'secondary' : 'quiet'} aria-current={page === item.page ? 'page' : undefined} onClick={() => go(item.page)}><item.icon size={19}/>{item.label}</Button>)}</nav>
      <div className="s80-side-note"><span className="s80-avatar">LM</span><div><strong>Lia Martins</strong><small>Sua carteira. Seu ritmo.</small></div></div>
    </aside>
    <div className="s80-main"><header className="s80-top"><span>Seu espaço de vendas <ChevronRight size={13}/> <strong>{current}</strong></span><span className="s80-demo">DEMO · dados fictícios</span></header>
      {storageIssue && <Notice error>O navegador não permitiu salvar. Suas alterações ficam apenas nesta sessão.</Notice>}
      <main className="s80-content">{page !== 'hoje' && page !== 'chat' && page !== 'cliente' && <Button variant="quiet" onClick={() => go('hoje')}><ArrowLeft size={15}/> Voltar ao meu dia</Button>}{content}</main>
      {page !== 'chat' && <footer className="s80-footer"><span>IA sugere. Você decide. Nenhuma mensagem para clientes é enviada nesta demo.</span><span>by OpenAI · Faro Chat usa a API do assistente.</span><Button variant="quiet" onClick={() => go('validar')}>Testar outros cenários <ArrowRight size={13}/></Button></footer>}
    </div>
  </div></div>;
}

function OpportunityPager() {
  const { data, selected, openClient } = useSuite();
  const ordered = [...data.opps].sort((a,b) => Number(a.stage === 'Fechado') - Number(b.stage === 'Fechado') || b.heat - a.heat);
  const index = Math.max(0, ordered.findIndex(o => o.id === selected));
  const current = ordered[index];
  const next = ordered.slice(index + 1).find(o => o.owner === current?.owner) || ordered.slice(index + 1)[0];
  const previous = ordered.slice(0, index).reverse().find(o => o.owner === current?.owner) || ordered.slice(0, index).reverse()[0];
  if (!current || ordered.length < 2) return null;
  return <nav className="seller-opportunity-pager" aria-label="Navegação pelas oportunidades">
    <Button variant="quiet" disabled={!previous} onClick={() => previous && openClient(previous.id)}><ArrowLeft size={15}/> Anterior</Button>
    <div><span className="s80-label">OPORTUNIDADE {index + 1} DE {ordered.length} · POR PRIORIDADE</span><strong>{current.company}</strong><small>Ao terminar de revisar, siga para o próximo cliente relevante.</small></div>
    <Button onClick={() => next && openClient(next.id)} disabled={!next}>Próxima oportunidade <ArrowRight size={16}/></Button>
  </nav>;
}

function Today() {
  const { data, setData, openAssistant, openClient, go, notify } = useSuite();
  const [selected, setSelected] = useState<string | null>(null);
  const [deferred, setDeferred] = useState<string[]>([]);
  const [mode, setMode] = useState<'ready' | 'record'>('ready');
  const [showDraft, setShowDraft] = useState(() => typeof window !== 'undefined' && window.location.hash === '#responder');
  const [showSources, setShowSources] = useState(false);
  const [result, setResult] = useState('');
  const [next, setNext] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<Opportunity | null>(null);
  const [lastSaved, setLastSaved] = useState<Opportunity | null>(null);
  const taskHeading = useRef<HTMLHeadingElement>(null);
  const mine = data.opps.filter(o => o.owner === 'Lia Martins');
  const open = mine.filter(o => o.stage !== 'Fechado');
  const pending = open.filter(o => !o.contacted && !deferred.includes(o.id)).sort((a,b) => b.heat - a.heat);
  const active = pending.find(o => o.id === (selected || data.activeJourney)) || pending[0];
  const completed = mine.filter(o => o.contacted && o.activityDate === demoDate).length;
  const goal = Math.max(1, data.goal);
  const upcoming = data.meetings.filter(m => m.owner === 'Lia Martins' && m.date >= demoDate).sort((a,b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];
  const task = active ? taskFor(active) : null;
  const progress = Math.min(completed / goal, 1);

  function choose(o: Opportunity) {
    setSelected(o.id); setMode('ready'); setShowDraft(false); setShowSources(false); setError(''); setResult(''); setNext(''); setSuccess(null); setDraft('');
    requestAnimationFrame(() => taskHeading.current?.focus({preventScroll:true}));
  }
  function prepare() {
    if (!active) return;
    const name = active.name.split(' ')[0];
    setDraft(active.approved || `Olá, ${name}! ${active.type === 'B2C' ? 'Para eu te orientar melhor, pode me contar o que você procura e para quando precisa?' : active.stage === 'Proposta' ? 'Conseguiu olhar a proposta? Posso esclarecer alguma dúvida e combinar um próximo retorno com você?' : 'Podemos confirmar a quantidade e a data desejada para o pedido? Vou conferir as condições antes de confirmar.'}`);
    setShowDraft(true);
  }
  function save() {
    if (!active) return;
    if (result.trim().length < 10 || next.trim().length < 6) {
      setError('Conte o resultado da conversa (ao menos 10 caracteres) e o próximo passo (ao menos 6).');
      return;
    }
    const before = active;
    const note = result.trim(); const nextAction = next.trim();
    setData(d => ({ ...d, opps:d.opps.map(o => o.id === before.id ? {...o, contacted:true, activityDate:demoDate, notes:note, nextAction} : o), logs:[{id:uid(), text:`Contato registrado com ${before.company}: ${note} Próximo passo: ${nextAction}`, at:'14/05/2026 · sessão local'}, ...d.logs] }));
    setLastSaved(before); setSuccess(before); setMode('ready'); setShowDraft(false); setError(''); setResult(''); setNext('');
  }
  function undo() {
    if (!lastSaved) return;
    const before = lastSaved;
    setData(d => ({...d,opps:d.opps.map(o => o.id === before.id ? before : o), logs:[{id:uid(),text:`Registro de ${before.company} desfeito pelo vendedor.`,at:'14/05/2026 · sessão local'},...d.logs]}));
    setSuccess(null);setLastSaved(null);setSelected(before.id);notify('Registro desfeito. A oportunidade voltou para sua lista.');
  }
  return <>
    <div className="s80-heading"><div><span className="s80-eyebrow">QUINTA, 14 DE MAIO · BOM DIA, LIA</span><h1>O que vale fazer agora?</h1><p>Seu 80/20: menos decisões, mais boas conversas.</p></div><div className="s80-daily"><span><CheckCheck size={17}/> {completed} de {goal} contatos úteis hoje</span><div className="s80-track" role="progressbar" aria-label="Contatos úteis registrados hoje" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(completed,goal)}><div style={{transform:`scaleX(${progress})`}}/></div></div></div>
    {success && <section className="s80-success" role="status"><Mascot pose="happy"/><div><strong>Boa conversa. Menos uma pendência.</strong><p>{success.company}: resultado e próximo passo salvos no Faro CRM da demo.{completed >= goal ? ' Sua meta de hoje foi alcançada!' : ' Você já pode seguir para o próximo cliente.'}</p></div><Button variant="quiet" onClick={undo}>Desfazer</Button></section>}
    <div className="s80-columns"><div className="s80-focus-column">
      {active && task ? <section className={`s80-focus ${showDraft ? 'is-replying' : ''}`} key={active.id}>
        <div className="s80-focus-top"><span className="s80-label"><span className="s80-dot"/> SEU PRÓXIMO BOM CONTATO</span><span className="s80-type">{active.type} · {active.stage}</span></div>
        <div className="s80-task-title"><span className="s80-person">{active.name.split(' ').slice(0,2).map(n=>n[0]).join('')}</span><div><span className="s80-client">{active.company} <span>· {active.name}</span></span><h2 ref={taskHeading} tabIndex={-1}>{task.title}</h2></div></div>
        <div className="s80-why"><span><Sparkles size={16}/> POR QUE ESTE CONTATO?</span><p>{active.notes || 'Faltam informações para orientar a conversa. Confirme a necessidade diretamente com o cliente.'}</p><small>Contexto demonstrativo do cadastro · não é uma previsão de venda.</small></div>
        {mode === 'ready' ? <>
          <div className="s80-next"><span className="s80-label">O QUE FAZER</span><p>{task.action}</p><span className="s80-channel"><MessageCircle size={14}/>{active.phone.trim() ? 'WhatsApp disponível no cadastro' : active.email.trim() ? 'E-mail disponível no cadastro' : 'Cadastre um canal para responder'} · envio demonstrativo</span></div>
          <div className="s80-primary"><Button onClick={() => {setMode('record');setNext(active.nextAction || '');}}>Já fiz o contato. Registrar <ArrowRight size={17}/></Button><small>Salve o resultado e o próximo passo de uma vez.</small></div>
          <div className="s80-help"><Button variant="quiet" onClick={() => showDraft ? setShowDraft(false) : prepare()}><MessageCircle size={16}/>{showDraft ? 'Fechar resposta' : 'Me ajude a responder'}</Button><Button variant="quiet" onClick={() => openAssistant(active.id)}><Mic size={16}/> Contar por áudio ou imagem</Button></div>
          {showDraft && <RespostaCliente key={active.id} client={active} initialText={draft || active.approved || `Olá, ${active.name.split(' ')[0]}! Podemos confirmar os detalhes do pedido e a data desejada? Vou conferir as condições antes de confirmar.`} onClose={()=>setShowDraft(false)} onRecord={text=>{setResult(text);setNext(active.nextAction || '');setMode('record');setShowDraft(false);}}/>}
        </> : <form className="s80-record" onSubmit={e=>{e.preventDefault();save();}}>
          <span className="s80-label">UM REGISTRO, SEM RETRABALHO</span><h3>O que ficou combinado?</h3><Textarea label="Resultado do contato" value={result} onChange={e=>setResult(e.target.value)} placeholder="Ex.: conversei com Marina; são 24 kits para o dia 30." autoFocus/><Textarea label="Próximo passo" value={next} onChange={e=>setNext(e.target.value)} placeholder="Ex.: enviar proposta revisada até amanhã de manhã."/>
          {error && <Notice error>{error}</Notice>}<p className="s80-save-help">Ao salvar, você confirma que fez este contato. O resultado e o próximo passo vão para o Faro CRM desta demo. Não enviaremos mensagens nem criaremos reuniões automaticamente.</p><div className="s80-form-actions"><Button type="submit">Salvar contato e continuar <Check size={17}/></Button><Button type="button" variant="quiet" onClick={()=>{setMode('ready');setError('');}}>Voltar</Button></div>
        </form>}
        <div className="s80-context-actions"><Button variant="quiet" onClick={() => setShowSources(!showSources)}><MoreHorizontal size={16}/>{showSources?'Ocultar detalhes':'Ver contexto e prioridade'}</Button><Button variant="quiet" onClick={() => {setDeferred(d=>[...d,active.id]);setMode('ready');setShowDraft(false);notify(`${active.company} ficou para depois. Nada foi marcado como feito.`);}}>Deixar para depois</Button></div>
        {showSources && <div className="s80-expanded"><p><strong>{active.heat}/100 em prioridade.</strong> Ordem da amostra demonstrativa; não é chance de conversão. Dados de origem e sinais podem estar incompletos.</p><p>{task.outcome}</p><Button variant="secondary" onClick={() => openClient(active.id)}>Abrir histórico e dados do cliente <ArrowRight size={14}/></Button></div>}
      </section> : <section className="s80-empty"><Mascot pose={open.length ? 'happy' : 'wave'}/><h2>{open.length ? 'Seu foco está em dia.' : 'Sua primeira oportunidade começa aqui.'}</h2><p>{deferred.length ? 'Você deixou contatos para depois. Eles não contam como concluídos.' : open.length ? 'Os contatos pendentes já foram registrados. Confira retornos ou cuide de uma nova oportunidade.' : 'Abra suas oportunidades para criar um contato ou importar uma lista na demo.'}</p>{deferred.length>0?<Button onClick={()=>setDeferred([])}>Rever contatos deixados para depois</Button>:<Button onClick={()=>go('pipeline')}>Abrir oportunidades <ArrowRight size={16}/></Button>}</section>}
      <section className="s80-queue"><div className="s80-section-title"><h2>Na sequência</h2><span>{pending.filter(o=>o.id!==active?.id).length} para depois deste</span></div>{pending.filter(o=>o.id!==active?.id).slice(0,2).map(o=><div className="s80-queue-row" key={o.id}><span className="s80-person">{o.name.split(' ').slice(0,2).map(n=>n[0]).join('')}</span><div><strong>{o.company}</strong><p>{taskFor(o).title}</p></div><Button variant="quiet" aria-label={`Priorizar ${o.company}`} onClick={()=>choose(o)}>Escolher <ArrowRight size={15}/></Button></div>)}{pending.length<=1&&<p className="s80-muted">Nada para disputar sua atenção agora.</p>}<div className="s80-queue-footer"><Button variant="quiet" onClick={()=>go('pipeline')}>Ver minha carteira <ArrowRight size={14}/></Button>{deferred.length>0&&<Button variant="quiet" onClick={()=>setDeferred([])}>{deferred.length} para depois · rever</Button>}</div></section>
    </div><aside className="s80-support">
      <section className="s80-assistant"><Mascot pose="wave"/><h2>Travou na conversa?</h2><p>Conte ao Faro. Uma dúvida, um áudio ou uma imagem do atendimento.</p><Button variant="secondary" onClick={()=>openAssistant(active?.id)}>Pedir ajuda ao Faro <ArrowRight size={15}/></Button><small>Texto, áudio e imagem são enviados à API do assistente. Nada é salvo como anexo.</small></section>
      <section className="s80-agenda"><span className="s80-label"><CalendarDays size={15}/> SEU PRÓXIMO RETORNO</span>{upcoming?<><strong>{upcoming.client}</strong><p><Clock3 size={14}/>{displayDate(upcoming.date)} às {upcoming.time}</p><small>{upcoming.notes}</small></>:<><strong>Sem retorno agendado.</strong><p>Se combinar uma ligação, marque depois do contato.</p></>}<Button variant="quiet" onClick={()=>go('agenda')}>{upcoming?'Ver minha agenda':'Agendar um retorno'} <ArrowRight size={14}/></Button></section>
      <div className="s80-principle"><Target size={17}/><p><strong>Contato útil, não clique.</strong><br/>Seu progresso conta quando você registra o que aconteceu e o que vem depois.</p></div>
    </aside></div>
    <div className="s80-disclaimer">80/20 é foco nas prioridades, não promessa de que estes contatos geram 80% das vendas. Valores e sinais são demonstrativos.{active && <span> Oportunidade atual: {money(active.value)}.</span>}</div>
  </>;
}

import { useLeadConnectorAgent } from './_shared/useLeadConnectorAgent';

export function Vendedor() {
  useLeadConnectorAgent();
  const hash = typeof window !== 'undefined' ? window.location.hash : '';
  const initialPage: Page = hash === '#assistente' ? 'assistente' : hash === '#chat' ? 'chat' : hash === '#agenda' ? 'agenda' : hash === '#cliente' ? 'cliente' : hash === '#pipeline' ? 'pipeline' : hash === '#validar' ? 'validar' : 'hoje';
  return <SuiteProvider initialPage={initialPage}><SellerShell/></SuiteProvider>;
}
export default Vendedor;
