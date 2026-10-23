import { useMemo, useState, type ReactNode, type CSSProperties } from 'react';
import designTokens from '../../../../../faro-design-system/tokens.json';
import { LayoutDashboard, GitBranch, Users, Sparkles, ClipboardList, Database, Settings2, ArrowUpRight, ArrowDownRight, ArrowRight, ChevronRight, Check, Download, ArrowLeft, ShieldCheck, CalendarDays, Target, AlertCircle, FlaskConical, Info, ChartNoAxesCombined } from 'lucide-react';
import { Button } from '../../../../../faro-design-system/src/components/actions';
import { Brand } from '../../../../../faro-design-system/src/components/identity';
import { Input, Textarea } from '../../../../../faro-design-system/src/components/fields';
import { Notice } from '../../../../../faro-design-system/src/components/feedback';
import { SuiteProvider, useSuite, money, type Opportunity } from './_shared/suite/state';
import '../../../../../faro-design-system/src/components/faro.css';
import './Gestor.css';

const sections = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'pipeline', label: 'Funil e resultados', icon: GitBranch },
  { id: 'team', label: 'Desempenho do time', icon: Users },
  { id: 'ai', label: 'Impacto da IA', icon: Sparkles },
  { id: 'meeting', label: 'Pautas e decisões', icon: ClipboardList },
  { id: 'sources', label: 'Qualidade dos dados', icon: Database },
  { id: 'settings', label: 'Preferências', icon: Settings2 },
];
// The package's generated theme is stale; resolve its source tokens without editing shared files.
const colors = designTokens.color.light;
const managerTheme = {
  '--paper': colors.background.$value, '--surface': colors.card.$value,
  '--ink': colors.foreground.$value, '--muted': colors.mutedForeground.$value,
  '--line': colors.border.$value, '--accent': colors.primary.$value,
  '--teal': colors.secondaryForeground.$value, '--mint': colors.secondary.$value,
  '--peach': colors.accent.$value, '--sand': colors.muted.$value,
} as CSSProperties;
const people = ['Lia Martins', 'Caio Freitas', 'Nina Alves'];
const targets: Record<string, number> = { '7 dias': 18000, '30 dias': 65000, '90 dias': 180000 };
// Explicit historical fixture, not a claimed server measurement.
const previous: Record<string, { revenue: number; won: number; contacts: number; label: string }> = {
  '7 dias': { revenue: 9800, won: 1, contacts: 2, label: '30 abr–06 mai' },
  '30 dias': { revenue: 10400, won: 2, contacts: 4, label: '15 mar–13 abr' },
  '90 dias': { revenue: 15800, won: 3, contacts: 5, label: '16 nov–13 fev' },
};
const ranges: Record<string, string> = { '7 dias': '08–14 mai 2026', '30 dias': '15 abr–14 mai 2026', '90 dias': '14 fev–14 mai 2026' };
function Panel({ title, eyebrow, action, children, className = '' }: { title: string; eyebrow?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`gm-panel ${className}`}><div className="gm-panel-title"><div>{eyebrow && <p className="gm-kicker">{eyebrow}</p>}<h2>{title}</h2></div>{action}</div>{children}</section>;
}
function Metric({ label, value, baseline, hint, delta }: { label: string; value: string; baseline: string; hint: string; delta?: number }) {
  return <article className="gm-metric"><p>{label}</p><strong>{value}</strong><div className="gm-metric-bottom">{delta !== undefined && <span className={`gm-delta ${delta < 0 ? 'down' : ''}`}>{delta < 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{Math.abs(delta).toFixed(1).replace('.', ',')}%</span>}<small>{baseline}</small></div><small className="gm-muted">{hint}</small></article>;
}
function wilsonBand(successes: number, total: number) {
  const z = 1.96;
  const p = successes / total;
  const denominator = 1 + z * z / total;
  const center = (p + z * z / (2 * total)) / denominator;
  const radius = z * Math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / denominator;
  return [Math.max(0, center - radius), Math.min(1, center + radius)] as const;
}
const percent = (value: number) => `${value.toFixed(1).replace('.', ',')}%`;
const percentagePoints = (value: number) => `${value.toFixed(1).replace('.', ',')} p.p.`;
function IncrementalityLab({ onPlan }: { onPlan: (text: string) => void }) {
  const [nPerArm, setNPerArm] = useState(160);
  const [controlRate, setControlRate] = useState(17);
  const [assistedRate, setAssistedRate] = useState(23);
  const [marginPerWin, setMarginPerWin] = useState(5000);
  const [investment, setInvestment] = useState(12000);
  const successesControl = Math.round(nPerArm * controlRate / 100);
  const successesAssisted = Math.round(nPerArm * assistedRate / 100);
  const actualControl = successesControl / nPerArm;
  const actualAssisted = successesAssisted / nPerArm;
  const effect = actualAssisted - actualControl;
  const [controlLow, controlHigh] = wilsonBand(successesControl, nPerArm);
  const [assistedLow, assistedHigh] = wilsonBand(successesAssisted, nPerArm);
  // Newcombe-Wilson interval for a difference in independent proportions.
  const low = effect - Math.sqrt((actualAssisted - assistedLow) ** 2 + (controlHigh - actualControl) ** 2);
  const high = effect + Math.sqrt((assistedHigh - actualAssisted) ** 2 + (actualControl - controlLow) ** 2);
  const addedWins = effect * nPerArm;
  const lowWins = low * nPerArm;
  const highWins = high * nPerArm;
  const contribution = addedWins * marginPerWin - investment;
  const lowContribution = lowWins * marginPerWin - investment;
  const highContribution = highWins * marginPerWin - investment;
  const inconclusive = low <= 0 && high >= 0;
  const status = low > 0 ? 'Sinal positivo no cenário simulado' : high < 0 ? 'Sinal negativo no cenário simulado' : 'Ainda inconclusivo neste cenário';
  const formatContribution = (value: number) => `${value < 0 ? '−' : ''}${money(Math.abs(value))}`;
  return <div className="gm-lab">
    <div className="gm-lab-intro"><span className="gm-lab-icon"><FlaskConical size={20} /></span><div><strong>Simule se a IA gerou resultado adicional.</strong><p>Compare grupos equivalentes: assistência habilitada vs. não habilitada. Cada ajuste recalcula o cenário fictício.</p></div></div>
    <div className="gm-fixture gm-lab-banner"><Info size={15} /> Números editáveis para explorar o método. Não são resultados, previsão nem evidência de impacto do Faro IA.</div>
    <div className="gm-lab-grid">
      <div className="gm-lab-controls">
        <h3>Defina os grupos</h3>
        <label className="gm-range-field" htmlFor="gm-sample-size"><span className="gm-range-heading"><span>Contas por grupo</span><strong>{nPerArm}</strong></span><input id="gm-sample-size" type="range" min="30" max="2000" step="10" value={nPerArm} onChange={event => setNPerArm(Number(event.target.value))} aria-describedby="gm-sample-help" /><small id="gm-sample-help">A mesma população é dividida aleatoriamente em dois grupos.</small></label>
        <label className="gm-range-field gm-control-arm" htmlFor="gm-control-rate"><span className="gm-range-heading"><span>Grupo sem assistência</span><strong>{successesControl} de {nPerArm} · {percent(actualControl * 100)}</strong></span><input id="gm-control-rate" type="range" min="0" max="60" step="1" value={controlRate} onChange={event => setControlRate(Number(event.target.value))} /><small>Resultado observado no controle fictício.</small></label>
        <label className="gm-range-field gm-assisted-arm" htmlFor="gm-assisted-rate"><span className="gm-range-heading"><span>Grupo com assistência</span><strong>{successesAssisted} de {nPerArm} · {percent(actualAssisted * 100)}</strong></span><input id="gm-assisted-rate" type="range" min="0" max="60" step="1" value={assistedRate} onChange={event => setAssistedRate(Number(event.target.value))} /><small>Resultado observado no grupo assistido fictício.</small></label>
        <Input label="Margem de contribuição por venda incremental (R$)" type="number" min="0" step="500" value={marginPerWin} onChange={event => setMarginPerWin(Math.max(0, Number(event.target.value) || 0))} />
        <Input label="Custo total do programa de IA (R$)" type="number" min="0" step="500" value={investment} onChange={event => setInvestment(Math.max(0, Number(event.target.value) || 0))} />
      </div>
      <div className="gm-lab-results" aria-live="polite">
        <div className="gm-lab-result-head"><div><p className="gm-kicker">EFEITO NA CONVERSÃO</p><strong className="gm-lab-effect">{effect >= 0 ? '+' : '−'}{percentagePoints(Math.abs(effect * 100))}</strong><small>diferença absoluta em pontos percentuais</small></div><span className={`gm-lab-status ${inconclusive ? 'uncertain' : 'directional'}`}>{inconclusive && <AlertCircle size={14} />}{status}</span></div>
        <div className="gm-compare-arms"><div><span>Sem IA · controle</span><strong>{percent(actualControl * 100)}</strong></div><ArrowRight size={17} className="gm-lab-arrow" aria-hidden="true" /><div><span>Com IA · assistido</span><strong>{percent(actualAssisted * 100)}</strong></div></div>
        <div className="gm-lab-estimates"><div><small>Vendas incrementais estimadas na amostra</small><strong>{addedWins > 0 ? '+' : ''}{addedWins.toFixed(1).replace('.', ',')}</strong></div><div><small>Margem incremental líquida simulada</small><strong className={contribution < 0 ? 'gm-negative' : ''}>{formatContribution(contribution)}</strong></div></div>
        <div className="gm-lab-interval"><span>Intervalo exploratório de 95% (Newcombe–Wilson)</span><strong>{percentagePoints(low * 100)} a {percentagePoints(high * 100)}</strong><small>{lowWins.toFixed(1).replace('.', ',')} a {highWins.toFixed(1).replace('.', ',')} vendas · margem líquida {formatContribution(lowContribution)} a {formatContribution(highContribution)}</small></div>
        {inconclusive ? <Notice>O intervalo inclui zero; esta amostra ainda não distingue um ganho de nenhuma diferença. Não chame vendas assistidas de incremento.</Notice> : <Notice>O cenário mostra um sinal, não uma garantia causal. Confira execução, perdas de acompanhamento e desenho antes de qualquer conclusão.</Notice>}
      </div>
    </div>
    <div className="gm-lab-plan">
      <div><p className="gm-kicker">ANTES DE UM TESTE REAL</p><strong>Defina um controle comparável.</strong><p>Sorteie contas antes da abordagem; mantenha período, elegibilidade, definição de venda e acompanhamento iguais. Avalie por grupo sorteado (intenção de tratar).</p><small>Evite compartilhar contas entre braços, parar cedo ou mudar o indicador após começar. Tamanho da amostra deve refletir a diferença mínima que importa.</small></div>
      <Button variant="secondary" onClick={() => onPlan('Planejar teste controlado de incrementalidade da IA: definir hipótese, indicador primário, amostra mínima, período, grupo sorteado e responsável pela análise.')}>Adicionar plano à pauta</Button>
    </div>
  </div>;
}
export function Gestor() { return <SuiteProvider initialPage="gestor"><ManagerSpace /></SuiteProvider>; }
function ManagerSpace() {
  const { data, setData } = useSuite();
  const [page, setPage] = useState(() => typeof window !== 'undefined' && ['#impacto', '#ai'].includes(window.location.hash) ? 'ai' : 'overview');
  const [period, setPeriod] = useState('7 dias');
  const [seller, setSeller] = useState('Todos');
  const [segment, setSegment] = useState('Todos');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detail, setDetail] = useState<Opportunity | null>(null);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [pauta, setPauta] = useState(data.pauta);
  const [goal, setGoal] = useState('18000');
  const [savedGoal, setSavedGoal] = useState(18000);
  const [onlyRisk, setOnlyRisk] = useState(false);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Todos');
  const scope = useMemo(() => data.opps.filter(o => (seller === 'Todos' || o.owner === seller) && (segment === 'Todos' || o.type === segment)), [data.opps, seller, segment]);
  const won = scope.filter(o => o.stage === 'Fechado');
  const open = scope.filter(o => o.stage !== 'Fechado');
  const revenue = won.reduce((s, o) => s + o.value, 0);
  const pipeline = open.reduce((s, o) => s + o.value, 0);
  const risk = open.filter(o => !o.contacted);
  const assisted = won.filter(o => o.origin !== 'Manual').reduce((s, o) => s + o.value, 0);
  const contacts = scope.filter(o => o.contacted).length;
  const compare = previous[period];
  const comparisonAvailable = seller === 'Todos' && segment === 'Todos';
  const target = period === '7 dias' ? savedGoal : targets[period];
  const percentage = Math.min(100, Math.round(revenue / target * 100));
  const title = sections.find(s => s.id === page)?.label || 'Visão geral';
  const navigate = (id: string) => { setPage(id); setDetail(null); setMessage(''); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const feedback = (text: string) => setMessage(text);
  const addToAgenda = (text: string) => {
    const next = `${data.pauta}${data.pauta ? '\n\n' : ''}• ${text}`;
    setData(d => ({ ...d, pauta: next })); setPauta(next); feedback('Tema adicionado à pauta de gestão. Abra “Pautas e decisões” para revisar.');
  };
  const exportCsv = () => {
    const csv = '\uFEFFEmpresa;Responsável;Etapa;Valor;Origem\n' + scope.map(o => [o.company, o.owner, o.stage, o.value, o.origin].map(v => `"${String(v).replaceAll('"', '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'faro-gestao-demo.csv'; a.click(); URL.revokeObjectURL(url); feedback('Relatório CSV exportado com os filtros atuais e dados demonstrativos.');
  };
  const openDetail = (o: Opportunity) => { setDetail(o); setNote(''); setMessage(''); };
  const displayed = scope.filter(o => (!onlyRisk || (!o.contacted && o.stage !== 'Fechado')) && (tab === 'Todos' || o.stage === tab) && `${o.company} ${o.owner}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="fio gm" style={managerTheme}>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900;1000&family=Nunito+Sans:wght@400;500;600;700;800&display=swap" />
    <aside className="gm-sidebar"><div><Brand /><div className="gm-workspace-label"><span className="gm-status-dot" />ESPAÇO DA GESTÃO</div></div>
      <div className="gm-team-name"><div className="gm-avatar">A</div><div><strong>{data.team}</strong><small>Operação comercial</small></div></div>
      <p className="gm-nav-label">DECISÕES, NÃO RUÍDO</p><nav aria-label="Menu do gestor">{sections.map(({ id, label, icon: Icon }) => <Button key={id} variant="quiet" aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={18} />{label}{id === 'sources' && <span className="gm-nav-count">{data.sources.filter(s => s.status === 'Erro').length}</span>}</Button>)}</nav>
      <div className="gm-sidebar-bottom"><div className="gm-private"><ShieldCheck size={18} /><div><strong>Visão exclusiva do gestor</strong><small>Indicadores, equipe e decisões em um só lugar.</small></div></div><div className="gm-profile"><div className="gm-avatar">AC</div><div><strong>Ana Costa</strong><small>Gestora comercial · Demo</small></div></div><small className="gm-muted">Inteligência comercial · by OpenAI<br />Provedor previsto; IA não conectada.</small></div>
    </aside>
    <div className="gm-main"><header className="gm-topbar"><div><span className="gm-muted">Gestão comercial</span><ChevronRight size={14} /><strong>{title}</strong></div><div><span className="gm-demo">DEMO INTERATIVA</span><span className="gm-top-date">14 de maio, 2026</span></div></header>
      <main className="gm-content"><div className="gm-page-head"><div><p className="gm-kicker">SEU NEGÓCIO, COM MAIS CLAREZA</p><h1>{page === 'overview' ? 'O que precisa da sua decisão hoje?' : title}</h1><p className="gm-muted">{page === 'overview' ? 'Resultados à vista. Desvios explicados. Próximas decisões no lugar certo.' : 'Contexto e evidências para conduzir a operação comercial.'}</p></div><Button variant="secondary" onClick={exportCsv}><Download size={16} />Exportar</Button></div>
        <div className="gm-filterbar"><div className="gm-period" role="group" aria-label="Período">{['7 dias', '30 dias', '90 dias'].map(p => <Button key={p} variant={period === p ? 'primary' : 'quiet'} aria-pressed={period === p} onClick={() => setPeriod(p)}>{p}</Button>)}</div><span className="gm-muted">{ranges[period]}</span><Button variant="secondary" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}><Settings2 size={15} />{seller === 'Todos' ? 'Toda a equipe' : seller} · {segment === 'Todos' ? 'B2B + B2C' : segment}</Button></div>
        {filtersOpen && <Panel title="Recorte da análise"><div className="gm-filter-options"><div><strong>Responsável</strong><div className="gm-chip-row">{['Todos', ...people].map(p => <Button key={p} variant={seller === p ? 'primary' : 'secondary'} onClick={() => setSeller(p)} aria-pressed={seller === p}>{p}</Button>)}</div></div><div><strong>Segmento</strong><div className="gm-chip-row">{['Todos', 'B2B', 'B2C'].map(p => <Button key={p} variant={segment === p ? 'primary' : 'secondary'} onClick={() => setSegment(p)} aria-pressed={segment === p}>{p}</Button>)}</div></div></div></Panel>}
        <p className="gm-fixture">Dados demonstrativos compartilhados com o painel. A amostra atual é a mesma nos períodos; metas e bases históricas ilustrativas variam. Sem histórico por vendedor, não exibimos variação individual.</p>
        {message && <Notice>{message}</Notice>}
        {detail ? <Panel title={detail.company} eyebrow="CONTEXTO PARA DECIDIR" action={<Button variant="quiet" onClick={() => setDetail(null)}><ArrowLeft size={16} />Voltar</Button>}><div className="gm-detail-grid"><div><p className="gm-lead">{detail.notes || 'Sem contexto registrado.'}</p><div className="gm-detail-facts"><span>Responsável<strong>{detail.owner}</strong></span><span>Potencial<strong>{money(detail.value)}</strong></span><span>Momento<strong>{detail.stage}</strong></span><span>Origem<strong>{detail.origin}</strong></span></div><div className="gm-insight"><Sparkles size={20} /><div><strong>{detail.contacted ? 'Acompanhar o próximo compromisso.' : 'Confirmar contexto e próximo contato.'}</strong><p>Índice de prioridade: {detail.heat}/100. Não representa probabilidade de venda. Dados de amostra, sem leitura de canais reais.</p></div></div></div><div><Textarea label="Orientação para a equipe" value={note} placeholder="Ex.: confirmar quantidade e prazo antes de negociar." onChange={e => setNote(e.target.value)} /><Button onClick={() => { if (note.trim().length < 10) { feedback('Escreva uma orientação com pelo menos 10 caracteres.'); return; } addToAgenda(`${detail.company} · ${detail.owner}: ${note.trim()}`); setNote(''); }}>Adicionar orientação à pauta</Button></div></div></Panel> : <>
        {(page === 'overview' || page === 'ai') && <div className="gm-metrics"><Metric label="Receita fechada" value={money(revenue)} baseline={comparisonAvailable ? `vs. ${money(compare.revenue)} no anterior` : 'Histórico do recorte indisponível'} hint={`${won.length} negócios fechados · amostra atual`} delta={comparisonAvailable ? (revenue - compare.revenue) / compare.revenue * 100 : undefined} /><Metric label="Pipeline aberto" value={money(pipeline)} baseline={`${open.length} oportunidades em andamento`} hint="Potencial cadastrado, não previsão" /><Metric label="Atingimento da meta" value={`${percentage}%`} baseline={`Meta ilustrativa: ${money(target)}`} hint={`${money(Math.max(0, target - revenue))} para a meta`} /><Metric label="Receita assistida por IA" value={money(assisted)} baseline={`${won.filter(o => o.origin !== 'Manual').length} negócios com apoio registrado`} hint="Atribuição não comprova incrementalidade" /></div>}
        {scope.length === 0 && page !== 'sources' && page !== 'settings' && page !== 'meeting' ? <Panel title="Ainda não há dados neste recorte"><p className="gm-muted">Troque os filtros para voltar à visão completa da operação.</p><Button onClick={() => { setSeller('Todos'); setSegment('Todos'); }}>Limpar filtros</Button></Panel> : <>
        {page === 'overview' && <section className="gm-incrementality-preview" aria-label="Medição de incrementalidade">
          <span className="gm-preview-icon"><ChartNoAxesCombined size={21} /></span>
          <div><span className="gm-kicker">IMPACTO DA IA · PRÓXIMA PERGUNTA</span><strong>Assistida não quer dizer incremental.</strong><p>Veja como comparar os grupos e estimar o efeito adicional — incluindo a incerteza.</p></div>
          <Button variant="secondary" onClick={() => navigate('ai')}>Simular incrementalidade<ChevronRight size={16} /></Button>
        </section>}
        {page === 'overview' && <>
          <div className="gm-decision-strip"><span className="gm-decision-icon"><Target size={22} /></span><div><strong>{risk.length ? `${risk.length} oportunidades com interesse ainda precisam de contato.` : 'Os contatos deste recorte estão em dia.'}</strong><p>{risk.length ? `${money(risk.reduce((s, o) => s + o.value, 0))} de potencial cadastrado. Comece conferindo os sinais e alinhando responsáveis.` : 'Acompanhe os próximos compromissos e a qualidade dos registros.'}</p></div><Button variant="secondary" onClick={() => { setOnlyRisk(true); navigate('pipeline'); }}>Revisar oportunidades<ArrowUpRight size={16} /></Button></div>
          <div className="gm-two"><Panel title="Resultado em perspectiva" eyebrow="COMPARATIVO DE PERÍODO" action={<span className="gm-pill">Receita fechada</span>}><p className="gm-muted">Atual vs. anterior · {ranges[period]}</p><div className="gm-compare-row"><div><span className="gm-dot" />Atual · amostra</div><strong>{money(revenue)}</strong></div><div className="gm-value-track"><div style={{ width: `${Math.min(100, revenue / Math.max(revenue, compare.revenue, 1) * 100)}%` }} /></div>{comparisonAvailable ? <><div className="gm-compare-row"><div><span className="gm-dot previous" />Anterior · {compare.label}</div><strong>{money(compare.revenue)}</strong></div><div className="gm-value-track previous"><div style={{ width: `${compare.revenue / Math.max(revenue, compare.revenue, 1) * 100}%` }} /></div><div className="gm-panel-foot"><span><strong>{contacts}</strong> contatos com registro</span><span><strong>{compare.contacts}</strong> no período anterior</span></div></> : <p className="gm-fixture">Comparativo não disponível para este recorte.</p>}<Button variant="quiet" onClick={() => navigate('pipeline')}>Explorar resultados<ChevronRight size={14} /></Button></Panel>
          <Panel title="Onde o funil precisa de atenção" eyebrow="MOVIMENTO COMERCIAL" action={<Button variant="quiet" onClick={() => navigate('pipeline')}>Ver funil<ArrowUpRight size={15} /></Button>}><Funnel opportunities={scope} /><div className="gm-insight"><AlertCircle size={18} /><p>Distribuição atual, não taxa de conversão entre etapas. {risk.length} oportunidades abertas não têm contato registrado.</p></div></Panel></div>
          <div className="gm-two"><Panel title="Pessoas por trás dos resultados" eyebrow="DESEMPENHO DO TIME" action={<Button variant="quiet" onClick={() => navigate('team')}>Ver equipe<ArrowUpRight size={15} /></Button>}><TeamTable opportunities={scope} onSelect={name => { setSeller(name); navigate('team'); }} compact /></Panel><Panel title="Sua próxima decisão" eyebrow="RECOMENDAÇÕES DO FARO"><div className="gm-recommend"><span className="gm-number">01</span><div><strong>Destravar oportunidades em aberto</strong><p>{risk.length} contas sem contato no recorte. Valide os dados com os responsáveis antes de avançar.</p><Button variant="quiet" onClick={() => addToAgenda(`Revisar ${risk.length} oportunidades sem contato e definir responsáveis.`)}>Levar para a reunião<ChevronRight size={14} /></Button></div></div><div className="gm-recommend"><span className="gm-number">02</span><div><strong>Resolver a qualidade das fontes</strong><p>{data.sources.filter(s => s.status === 'Erro').length} fonte(s) com falha simulada. Recomendações podem usar contexto incompleto.</p><Button variant="quiet" onClick={() => navigate('sources')}>Verificar dados<ChevronRight size={14} /></Button></div></div></Panel></div>
        </>}
        {page === 'pipeline' && <><div className="gm-two"><Panel title="Distribuição do funil"><Funnel opportunities={scope} /></Panel><Panel title="Cobertura de oportunidades"><p className="gm-big-number">{money(pipeline)}</p><p className="gm-muted">{open.length} abertas · {won.length} fechadas</p><div className="gm-insight"><Target size={20} /><p>Priorize dados validados e próximos passos. Potencial aberto não é compromisso de receita.</p></div><Button onClick={() => { setOnlyRisk(!onlyRisk); }}>{onlyRisk ? 'Mostrar todas' : 'Ver sem contato'}</Button></Panel></div><Panel title="Oportunidades sob gestão" action={<span className="gm-pill">{displayed.length} registros</span>}><Input label="Buscar empresa ou vendedor" value={query} placeholder="Ex.: Casa Aurora" onChange={e => setQuery(e.target.value)} /><div className="gm-chip-row">{['Todos', 'Novo sinal', 'Em conversa', 'Proposta', 'Fechado'].map(p => <Button key={p} variant={tab === p ? 'primary' : 'quiet'} onClick={() => setTab(p)}>{p}</Button>)}</div>{onlyRisk && <Notice>Filtro ativo: oportunidades abertas sem contato registrado. <Button variant="quiet" onClick={() => setOnlyRisk(false)}>Limpar</Button></Notice>}<OpportunityTable opportunities={displayed} onOpen={openDetail} /></Panel></>}
        {page === 'team' && <><Panel title="Resultados com contexto, não um ranking cego" eyebrow="EQUIPE E CAPACIDADE"><p className="gm-muted">Compare receita, cobertura de contatos e volume em aberto. Carteiras diferentes não permitem concluir quem “é melhor”.</p><TeamTable opportunities={scope} onSelect={name => { setSeller(name); }} /></Panel><div className="gm-three">{people.filter(p => seller === 'Todos' || seller === p).map(p => { const ops = scope.filter(o => o.owner === p); const pending = ops.filter(o => !o.contacted && o.stage !== 'Fechado'); return <Panel key={p} title={p} eyebrow="CARGA OPERACIONAL"><div className="gm-person-summary"><span className="gm-avatar">{p.split(' ').map(n => n[0]).join('')}</span><strong>{pending.length} contatos pendentes</strong></div><p className="gm-muted">{ops.length} oportunidades · {money(ops.filter(o => o.stage === 'Fechado').reduce((s, o) => s + o.value, 0))} fechados.</p><div className="gm-insight"><p>{pending.length >= 2 ? 'Concentrar o foco antes de distribuir novas contas. Confirme a disponibilidade na reunião.' : 'Revisar acompanhamentos e capacidade antes de redistribuir contas.'}</p></div><Button variant="secondary" onClick={() => addToAgenda(`Alinhar capacidade de ${p}: ${pending.length} contatos pendentes; revisar distribuição.`)}>Preparar conversa</Button></Panel>; })}</div><p className="gm-fixture">“Energia” representa carga operacional observável. Não inferimos emoção, saúde ou motivação pessoal.</p></>}
        {page === 'ai' && <><Panel title="Incrementalidade: o que a IA realmente acrescentou?" eyebrow="LABORATÓRIO DE IMPACTO"><IncrementalityLab onPlan={addToAgenda} /></Panel><div className="gm-two"><Panel title="De onde vieram as oportunidades?" eyebrow="ORIGEM E CONTRIBUIÇÃO">{['IA', 'Assistida', 'Manual'].map(origin => { const items = scope.filter(o => o.origin === origin); return <div className="gm-origin" key={origin}><span className="gm-origin-icon">{origin === 'Manual' ? <Users size={18} /> : <Sparkles size={18} />}</span><div><strong>{origin === 'IA' ? 'Originadas por IA' : origin === 'Assistida' ? 'Com apoio da IA' : 'Cadastradas pelo time'}</strong><small>{items.length} oportunidades · {money(items.reduce((s, o) => s + o.value, 0))} de valor cadastrado</small></div></div>; })}</Panel><Panel title="Apoio não é causalidade" eyebrow="LEITURA RESPONSÁVEL"><p className="gm-lead">A IA participou. Isso não prova que gerou a venda.</p><p className="gm-muted">O demo registra origem e assistência. Para medir incrementalidade, seria necessário um experimento com comparação controlada e critérios definidos.</p><div className="gm-insight"><ShieldCheck size={20} /><p>Não apresentamos ganho incremental, horas economizadas ou probabilidade de fechamento sem evidência.</p></div><Button variant="secondary" onClick={() => addToAgenda('Definir hipótese e grupo de comparação para medir incrementalidade da IA.')}>Discutir plano de medição</Button></Panel></div><Panel title="Rastreie a contribuição por oportunidade"><OpportunityTable opportunities={scope.filter(o => o.origin !== 'Manual')} onOpen={openDetail} /></Panel></>}
        {page === 'meeting' && <Panel title="Uma reunião que termina em decisões" eyebrow="PAUTA COM CONTEXTO" action={<span className="gm-pill"><CalendarDays size={13} />Gestão semanal</span>}><p className="gm-muted">Monte a pauta com os sinais atuais. Revise os pontos antes de compartilhar com a equipe.</p><div className="gm-chip-row"><Button variant="secondary" onClick={() => { setPauta(`REUNIÃO COMERCIAL · ${ranges[period]}\n\n1. Resultados: ${money(revenue)} fechados; meta ilustrativa ${money(target)}.\n2. Acompanhamento: ${risk.length} oportunidades sem contato. Definir responsável e prazo.\n3. Capacidade: alinhar distribuição de carteira por vendedor.\n4. Dados: revisar ${data.sources.filter(s => s.status === 'Erro').length} fonte(s) em erro.\n5. IA: revisar exemplos de assistência sem assumir causalidade.\n\nDECISÕES\n• Responsável:\n• Ação combinada:\n• Prazo:`); feedback('Rascunho montado com dados do recorte. Revise antes de salvar.'); }}><Sparkles size={16} />Montar pauta demonstrativa</Button></div><Textarea label="Pauta e decisões" rows={15} value={pauta} onChange={e => setPauta(e.target.value)} placeholder="Adicione temas pelo dashboard ou monte um rascunho." /><div className="gm-chip-row"><Button onClick={() => { if (!pauta.trim()) { feedback('Adicione um tema antes de salvar.'); return; } setData(d => ({ ...d, pauta })); feedback('Pauta salva localmente neste demo.'); }}><Check size={15} />Salvar pauta</Button><Button variant="secondary" onClick={() => { if (!pauta.trim()) { feedback('Escreva uma pauta antes de copiar.'); return; } navigator.clipboard?.writeText(pauta).then(() => feedback('Pauta copiada.'), () => feedback('Cópia não autorizada. Selecione e copie o texto manualmente.')); }}>Copiar texto</Button></div>{data.pauta && <div className="gm-saved"><strong>Última versão salva</strong><pre>{data.pauta}</pre></div>}</Panel>}
        {page === 'sources' && <><div className="gm-metrics"><Metric label="Fontes de contexto" value={String(data.sources.length)} baseline="Canais e arquivos cadastrados" hint="Sem conexão externa neste demo" /><Metric label="Fontes em falha" value={String(data.sources.filter(s => s.status === 'Erro').length)} baseline="Exigem revisão" hint="Falhas simuladas" /><Metric label="Amostras disponíveis" value={String(data.sources.filter(s => s.status === 'Demo').length)} baseline="Contexto demonstrativo" hint="Não representa sincronização real" /><Metric label="Base de conhecimento" value={String(data.docs.length)} baseline="Manuais, instruções e respostas" hint="Conteúdo revisável pela operação" /></div><Panel title="A confiança começa na origem"><div className="gm-source-list">{data.sources.map(s => <div className="gm-source" key={s.id}><Database size={19} /><div><strong>{s.name}</strong><p>{s.scope}</p><small>{s.fresh}</small></div><span className={`gm-pill ${s.status === 'Erro' ? 'warning' : ''}`}>{s.status}</span>{s.status === 'Erro' && <Button variant="secondary" onClick={() => { setData(d => ({ ...d, sources: d.sources.map(item => item.id === s.id ? { ...item, status: 'Demo', fresh: '14/05/2026 · nova tentativa simulada' } : item) })); feedback('Nova tentativa simulada concluída. Nenhum canal real foi conectado.'); }}>Simular nova tentativa</Button>}</div>)}</div></Panel></>}
        {page === 'settings' && <Panel title="Preferências da gestão" eyebrow="SEU ESPAÇO"><div className="gm-settings"><Input label="Meta de receita · 7 dias (R$)" type="number" min="1" value={goal} onChange={e => setGoal(e.target.value)} help="Premissa ilustrativa da gestão; não é uma previsão." /><Button onClick={() => { const value = Number(goal); if (!Number.isFinite(value) || value <= 0) { feedback('Informe uma meta válida maior que zero.'); return; } setSavedGoal(value); feedback('Meta atualizada nesta sessão. Veja o atingimento no dashboard.'); }}>Aplicar meta</Button></div><div className="gm-insight"><ShieldCheck size={20} /><p>Este espaço usa uma persona fixa de gestora, sem menu ou troca para vendedor. A autenticação e as permissões reais deverão ser implementadas no produto; este demo não restringe acesso.</p></div></Panel>}
        </>}
        </>}
        <footer className="gm-footer"><span><span className="gm-status-dot" />Demo local · dados fictícios · sem envio de mensagens</span><span>Faro IA · Decisões com contexto.</span></footer>
      </main></div>
  </div>;
}
function Funnel({ opportunities }: { opportunities: Opportunity[] }) {
  return <div className="gm-funnel">{['Novo sinal', 'Em conversa', 'Proposta', 'Fechado'].map((stage, i) => { const items = opportunities.filter(o => o.stage === stage); return <div className="gm-funnel-row" key={stage}><span className="gm-stage-number">{i + 1}</span><span>{stage}<small>{items.length} oportunidades</small></span><strong>{money(items.reduce((s, o) => s + o.value, 0))}</strong></div>; })}</div>;
}
function TeamTable({ opportunities, onSelect, compact = false }: { opportunities: Opportunity[]; onSelect: (name: string) => void; compact?: boolean }) {
  const members = people.map(name => { const items = opportunities.filter(o => o.owner === name); return { name, items, closed: items.filter(o => o.stage === 'Fechado').reduce((s, o) => s + o.value, 0), contacts: items.filter(o => o.contacted).length }; }).filter(p => p.items.length).sort((a, b) => b.closed - a.closed);
  return <div className="gm-table-scroll"><table><thead><tr><th>Vendedor</th><th>Fechados</th><th>{compact ? 'Contatos' : 'Cobertura de contatos'}</th>{!compact && <th>Leitura do contexto</th>}<th><span className="gm-sr">Detalhes</span></th></tr></thead><tbody>{members.map(p => <tr key={p.name}><td><div className="gm-table-person"><span className="gm-avatar">{p.name.split(' ').map(n => n[0]).join('')}</span><strong>{p.name}</strong></div></td><td><strong>{money(p.closed)}</strong></td><td>{p.contacts}/{p.items.length}</td>{!compact && <td>{p.contacts === p.items.length ? 'Cobertura em dia; acompanhar próximos passos.' : `${p.items.length - p.contacts} conta(s) sem registro de contato.`}</td>}<td><Button variant="quiet" onClick={() => onSelect(p.name)} aria-label={`Analisar ${p.name}`}><ArrowUpRight size={16} /></Button></td></tr>)}</tbody></table></div>;
}
function OpportunityTable({ opportunities, onOpen }: { opportunities: Opportunity[]; onOpen: (o: Opportunity) => void }) {
  return opportunities.length ? <div className="gm-table-scroll"><table><thead><tr><th>Oportunidade</th><th>Responsável</th><th>Etapa</th><th>Potencial</th><th>Situação</th><th /></tr></thead><tbody>{opportunities.map(o => <tr key={o.id}><td><strong>{o.company}</strong><small>{o.type} · {o.origin}</small></td><td>{o.owner}</td><td>{o.stage}</td><td>{money(o.value)}</td><td><span className={`gm-pill ${!o.contacted ? 'warning' : ''}`}>{o.contacted ? 'Contato registrado' : 'Sem contato'}</span></td><td><Button variant="quiet" onClick={() => onOpen(o)} aria-label={`Revisar ${o.company}`}><ArrowUpRight size={16} /></Button></td></tr>)}</tbody></table></div> : <div className="gm-empty"><GitBranch size={28} /><h3>Nenhuma oportunidade neste recorte.</h3><p>Ajuste a busca ou os filtros para continuar a análise.</p></div>;
}
export default Gestor;
