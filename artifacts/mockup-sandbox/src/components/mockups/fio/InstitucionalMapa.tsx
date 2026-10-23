import { useState } from "react";
import { useLeadConnectorAgent } from "./_shared/useLeadConnectorAgent";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Clock3, Database, FileText, Fingerprint, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import "./institucional-mapa.css";

type Role = "seller" | "manager";
type Step = "context" | "decide" | "record";

const originalReply = "Oi, Marina! Podemos organizar a entrega em duas etapas, como você pediu. Vou confirmar a disponibilidade com a equipe e te enviar uma proposta atualizada.";
const originalNote = "Marina pediu entrega em duas etapas. Próximo passo: confirmar disponibilidade e revisar a proposta.";

export function InstitucionalMapa() {
  useLeadConnectorAgent();
  const [role, setRole] = useState<Role>("seller");
  const [step, setStep] = useState<Step>("context");
  const [expandedSource, setExpandedSource] = useState<string | null>("conversation");
  const [reply, setReply] = useState(originalReply);
  const [note, setNote] = useState(originalNote);
  const [saved, setSaved] = useState(false);
  const [approved, setApproved] = useState(false);

  const reset = () => {
    setStep("context");
    setExpandedSource("conversation");
    setReply(originalReply);
    setNote(originalNote);
    setSaved(false);
    setApproved(false);
  };

  const nextStep = () => setStep(step === "context" ? "decide" : "record");
  const previousStep = () => setStep(step === "record" ? "decide" : "context");
  const currentIndex = ["context", "decide", "record"].indexOf(step);

  return (
    <div className="imv-shell">
      <header className="imv-topbar">
        <a className="imv-brand" href="#inicio" aria-label="Faro IA, início">
          <span className="imv-brand-mark"><Sparkles size={18} strokeWidth={2.6} /></span>
          <span>faro<span className="imv-brand-ia">IA</span></span>
        </a>
        <div className="imv-topbar-center">
          <span className="imv-breadcrumb">Como funciona</span><ChevronRight size={14} /><span className="imv-breadcrumb-current">Uma oportunidade, do sinal ao registro</span>
        </div>
        <div className="imv-topbar-right">
          <span className="imv-demo-status"><i /> Ambiente demonstrativo</span>
          <button className="imv-icon-button" onClick={reset} aria-label="Reiniciar demonstração" title="Reiniciar demonstração"><RotateCcw size={16} /></button>
        </div>
      </header>

      <main className="imv-main" id="inicio">
        <section className="imv-intro">
          <div className="imv-intro-copy">
            <div className="imv-kicker"><span /> Conheça o Faro IA por dentro</div>
            <h1>Do sinal ao próximo passo.<br /><em>Sem perder o cuidado.</em></h1>
            <p>Em vez de mais um painel para explorar, acompanhe uma decisão comercial realista — com contexto autorizado, sugestões explicáveis e você no controle.</p>
          </div>
          <aside className="imv-role-picker" aria-label="Escolher perspectiva">
            <span className="imv-role-label">Explore pela sua perspectiva</span>
            <div className="imv-role-options">
              <button type="button" aria-pressed={role === "seller"} className={role === "seller" ? "imv-role-active" : ""} onClick={() => { setRole("seller"); reset(); }}><MessageCircle size={16} /> Vendo</button>
              <button type="button" aria-pressed={role === "manager"} className={role === "manager" ? "imv-role-active" : ""} onClick={() => { setRole("manager"); reset(); }}><Users size={16} /> Lidero</button>
            </div>
            <p>{role === "seller" ? "Veja como chegar à conversa mais preparado." : "Veja como apoiar o time sem cobrar no escuro."}</p>
          </aside>
        </section>

        <section className="imv-workspace" aria-label="Demonstração interativa">
          <aside className="imv-journey">
            <div className="imv-journey-heading">
              <span className="imv-small-label">CASO FICTÍCIO · ESTÚDIO ARCO</span>
              <h2>Uma conversa<br />com contexto.</h2>
              <p>Conheça os sinais, avalie o que fazer e revise o registro.</p>
            </div>
            <nav className="imv-step-nav" aria-label="Etapas do caso">
              {([
                ["context", "01", "Entender o contexto", "Fontes e permissões"],
                ["decide", "02", "Escolher o próximo passo", "Motivos, sem caixa-preta"],
                ["record", "03", "Revisar o registro", "Sua decisão, sempre"],
              ] as const).map(([key, num, title, caption], index) => (
                <button type="button" key={key} className={`imv-step ${step === key ? "imv-step-current" : ""} ${currentIndex > index ? "imv-step-done" : ""}`} aria-current={step === key ? "step" : undefined} onClick={() => setStep(key)}>
                  <span className="imv-step-number">{currentIndex > index ? <Check size={14} /> : num}</span>
                  <span className="imv-step-copy"><b>{title}</b><small>{caption}</small></span>
                  {step === key && <ChevronRight size={16} className="imv-step-arrow" />}
                </button>
              ))}
            </nav>
            <div className="imv-privacy-note"><ShieldCheck size={17} /><span><b>Privacidade antes da conveniência</b><small>Dados de demonstração. Sem acesso a canais ou CRM reais.</small></span></div>
            <div className="imv-case-progress">
              <div><span>PROGRESSO DO CASO</span><b>{String(currentIndex + 1).padStart(2, "0")} <i>/ 03</i></b></div>
              <div className="imv-progress-track"><i style={{ width: `${((currentIndex + 1) / 3) * 100}%` }} /></div>
            </div>
          </aside>

          <div className="imv-case">
            <div className="imv-case-header">
              <div className="imv-contact">
                <div className="imv-avatar">ML</div>
                <div><span className="imv-small-label">OPORTUNIDADE · PROPOSTA EM ANÁLISE</span><h2>Marina Lima <span>·</span> Estúdio Arco</h2></div>
              </div>
              <span className="imv-case-badge"><i /> Cenário ilustrativo</span>
            </div>

            {step === "context" && <div className="imv-panel-content">
              <div className="imv-step-eyebrow"><span>01</span> O que sabemos — e de onde vem</div>
              <div className="imv-context-heading">
                <div><h3>O contexto em um só lugar.</h3><p>Abra cada fonte para entender sua origem, data e uso permitido.</p></div>
                <span className="imv-source-count"><Fingerprint size={15} /> 3 fontes autorizadas</span>
              </div>
              <div className="imv-sources">
                {[
                  { id: "conversation", icon: <MessageCircle size={17} />, label: "Conversa de atendimento", meta: "Hoje · 09:12 · Canal autorizado", text: "“Conseguimos receber em duas etapas?”", detail: "Mensagem compartilhada pelo canal comercial da empresa. Incluída neste exemplo com permissão de uso para continuidade do atendimento.", color: "terracotta" },
                  { id: "proposal", icon: <Database size={17} />, label: "Proposta em análise", meta: "Ontem · 16:40 · CRM da empresa", text: "Proposta aberta · aguardando retorno", detail: "Registro do pipeline comercial demonstrativo. A atualização do CRM externo ainda não está disponível.", color: "green" },
                  { id: "history", icon: <Clock3 size={17} />, label: "Histórico autorizado", meta: "Atualizado ontem · Sistema da empresa", text: "Uma compra anterior registrada", detail: "Informação de exemplo que representa um histórico disponível com permissão adequada para esta operação.", color: "gold" },
                ].map(item => (
                  <article className={`imv-source ${expandedSource === item.id ? "imv-source-open" : ""}`} key={item.id}>
                    <button className="imv-source-trigger" aria-expanded={expandedSource === item.id} onClick={() => setExpandedSource(expandedSource === item.id ? null : item.id)}>
                      <span className={`imv-source-icon imv-icon-${item.color}`}>{item.icon}</span>
                      <span className="imv-source-info"><b>{item.label}</b><small>{item.meta}</small><strong>{item.text}</strong></span>
                      <ChevronDown size={17} className="imv-source-chevron" />
                    </button>
                    {expandedSource === item.id && <div className="imv-source-detail"><span>ORIGEM E PERMISSÃO</span><p>{item.detail}</p></div>}
                  </article>
                ))}
              </div>
              <div className="imv-panel-footer">
                <p><CircleHelp size={15} /> Fonte ausente ou desatualizada? A sugestão deve dizer isso.</p>
                <button className="imv-primary" onClick={nextStep}>Ver por que isso importa <ArrowRight size={16} /></button>
              </div>
            </div>}

            {step === "decide" && <div className="imv-panel-content">
              <div className="imv-step-eyebrow"><span>02</span> Prioridade com explicação</div>
              <div className="imv-context-heading">
                <div><h3>Vale retomar essa conversa.</h3><p>Uma sugestão com motivos — não um palpite disfarçado de certeza.</p></div>
                <span className="imv-priority"><Target size={15} /> Atenção sugerida</span>
              </div>
              <div className="imv-reason-card">
                <div className="imv-score"><strong>78</strong><span>/ 100<br /><small>ilustrativo</small></span></div>
                <div className="imv-reason-copy"><b>Por que agora?</b><p>Marina perguntou sobre a entrega e a proposta ainda aguarda retorno.</p><span>Índice organiza atenção — não é chance de venda ou garantia de receita.</span></div>
              </div>
              <div className="imv-decision-layout">
                <div className="imv-evidence-list">
                  <span className="imv-small-label">SINAIS QUE SUSTENTAM A SUGESTÃO</span>
                  <div><Check size={15} /><span><b>Interesse explícito</b><small>Perguntou sobre a proposta na conversa autorizada.</small></span></div>
                  <div><Check size={15} /><span><b>Próximo passo em aberto</b><small>Registro comercial indica proposta aguardando retorno.</small></span></div>
                  <div><Check size={15} /><span><b>Limite identificado</b><small>Estoque e prazo não foram confirmados.</small></span></div>
                </div>
                <div className="imv-action-choice">
                  <span className="imv-small-label">UMA POSSIBILIDADE</span>
                  <div className="imv-action-icon"><MessageCircle size={19} /></div>
                  <b>Alinhar a entrega</b>
                  <p>Uma ligação para entender o que é possível — sem prometer prazo ainda.</p>
                  <button className="imv-secondary" onClick={() => setStep("record")}>Preparar resposta <ArrowRight size={15} /></button>
                </div>
              </div>
              <div className="imv-panel-footer">
                <p><ShieldCheck size={15} /> Você decide se esta é a prioridade certa.</p>
                <div className="imv-footer-actions"><button className="imv-back-button" onClick={previousStep}><ArrowLeft size={15} /> Voltar ao contexto</button><button className="imv-primary" onClick={() => setStep("record")}>Preparar resposta <ArrowRight size={16} /></button></div>
              </div>
            </div>}

            {step === "record" && <div className="imv-panel-content">
              <div className="imv-step-eyebrow"><span>03</span> Revisar e registrar</div>
              <div className="imv-context-heading">
                <div><h3>Você dá a palavra final.</h3><p>Edite a resposta e confira o que seria registrado. Nada será enviado.</p></div>
                <span className="imv-human-review"><CheckCheck size={15} /> Revisão humana</span>
              </div>
              <div className="imv-composer">
                <div className="imv-composer-title"><span className="imv-source-icon imv-icon-green"><BookOpen size={17} /></span><span><b>Sugestão baseada no seu manual</b><small>Atendimento · seção 4.2 · trecho fictício</small></span><span className="imv-reference">REFERÊNCIA</span></div>
                <blockquote>“Entregas parciais precisam de confirmação da operação.”</blockquote>
                <label htmlFor="imv-reply">Sua resposta · editável · não será enviada</label>
                <textarea id="imv-reply" value={reply} onChange={event => { setReply(event.target.value); setApproved(false); }} />
                <div className="imv-composer-foot"><span><ShieldCheck size={14} /> Revise antes de aprovar</span><button disabled={!reply.trim()} className={approved ? "imv-approved-button" : "imv-text-approve"} onClick={() => setApproved(true)}>{approved ? <><Check size={15} /> Texto aprovado por você</> : <>Aprovar texto <ArrowRight size={15} /></>}</button></div>
              </div>
              <div className="imv-crm-preview">
                <div className="imv-crm-heading"><span className="imv-source-icon imv-icon-gold"><FileText size={17} /></span><span><b>Prévia do registro no CRM Faro IA</b><small>Revise o resumo da oportunidade</small></span><span className="imv-native-tag">CRM NATIVO · CONCEITO</span></div>
                <textarea aria-label="Resumo da oportunidade para registro demonstrativo" value={note} onChange={event => { setNote(event.target.value); setSaved(false); }} />
                {saved ? <div className="imv-saved-message" role="status"><Check size={15} /> Registro atualizado nesta simulação. Nenhum CRM externo foi alterado.</div> : <div className="imv-crm-foot"><span>Salesforce e Pipedrive: integrações previstas, não implementadas.</span><button disabled={!note.trim()} className="imv-primary imv-save-button" onClick={() => setSaved(true)}>Aprovar registro simulado <Check size={15} /></button></div>}
              </div>
              <div className="imv-panel-footer">
                <p><ShieldCheck size={15} /> Sem envio de mensagem ou alteração externa.</p>
                <button className="imv-back-button" onClick={previousStep}><ArrowLeft size={15} /> Voltar ao próximo passo</button>
              </div>
            </div>}
          </div>
        </section>

        <footer className="imv-disclaimer">
          <div><ShieldCheck size={17} /><p><b>Um protótipo de produto em desenvolvimento.</b><span> Conteúdo demonstrativo, sem dados reais, integrações ativas ou mensagens enviadas.</span></p></div>
          <button onClick={() => window.alert("O Faro IA está em desenvolvimento. Esta demonstração é local e não acessa canais, agenda ou CRM externos.")}>O que é simulado? <ArrowRight size={14} /></button>
        </footer>
      </main>
    </div>
  );
}
