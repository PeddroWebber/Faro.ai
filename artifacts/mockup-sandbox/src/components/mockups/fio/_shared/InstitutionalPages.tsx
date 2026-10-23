import { ArrowLeft, ArrowRight, BadgeCheck, Database, LockKeyhole, MessageCircle, Sparkles, Users, Workflow } from 'lucide-react';
import { Brand } from './ui';

export type SitePage = 'produto' | 'vendedores' | 'gestores' | 'dados' | 'assistente' | 'seguranca';
const items: { id: SitePage; label: string }[] = [
  { id: 'produto', label: 'Produto' }, { id: 'vendedores', label: 'Vendedores' },
  { id: 'gestores', label: 'Gestores' }, { id: 'dados', label: 'Dados e integrações' },
  { id: 'assistente', label: 'Assistente' }, { id: 'seguranca', label: 'Segurança' }
];
const content: Record<SitePage, { eyebrow: string; title: string; lead: string; icon: typeof Sparkles; sections: { heading: string; body: string; detail: string }[] }> = {
  produto: {
    eyebrow: 'O PRODUTO · CONTEXTO ATÉ A AÇÃO',
    title: 'Uma venda, com menos peças soltas.',
    lead: 'Faro IA reúne o contexto comercial permitido, explica por que uma conversa pode merecer atenção e ajuda a preparar o próximo passo — sem tirar a decisão das pessoas.',
    icon: Sparkles,
    sections: [
      { heading: 'Veja o que sustenta a sugestão', body: 'Sinais, origem, atualização e lacunas aparecem ao lado da oportunidade.', detail: 'O índice de aquecimento organiza atenção. Não é chance de fechar nem previsão de receita.' },
      { heading: 'Prepare sem começar do zero', body: 'Leve histórico, manual autorizado e objetivo da conversa para um só espaço.', detail: 'Respostas são rascunhos revisáveis; compromissos e condições precisam de confirmação humana.' },
      { heading: 'Registre depois de revisar', body: 'Resuma o que aconteceu, escolha o próximo passo e confira os campos do CRM.', detail: 'Uma conversa não altera dados nem envia mensagens sem uma confirmação explícita.' }
    ]
  },
  vendedores: {
    eyebrow: 'PARA QUEM VENDE · UMA PRÓXIMA AÇÃO',
    title: 'Abra o dia sabendo por onde começar.',
    lead: 'Uma fila de foco simples ajuda a retomar conversas, entender o contexto e manter os retornos organizados — com espaço para conduzir cada relação no seu ritmo.',
    icon: Users,
    sections: [
      { heading: 'Meu dia, sem trilha forçada', body: 'Comece pela oportunidade útil agora, adie sem marcar como feito e volte quando fizer sentido.', detail: 'Progresso representa contatos registrados, não cliques ou tarefas de treinamento.' },
      { heading: 'Converse com o Faro', body: 'Pergunte livremente, compartilhe texto, uma imagem ou áudio e informe qual cliente é relevante.', detail: 'A amostra de CRM é fictícia. O assistente deve sinalizar quando não encontrar evidência.' },
      { heading: 'Você controla o CRM', body: 'Revise o resumo e confirme o cliente, a etapa e o próximo passo antes de salvar.', detail: 'Mensagens a clientes e integrações externas não são simuladas como entregues.' }
    ]
  },
  gestores: {
    eyebrow: 'PARA QUEM LIDERA · DADOS PARA DECIDIR',
    title: 'Inteligência comercial com evidência.',
    lead: 'Entenda a origem das oportunidades, o trabalho que está acumulando e os comportamentos que ajudam conversas a avançar. Use os dados para orientar, não vigiar.',
    icon: Workflow,
    sections: [
      { heading: 'Origem não é causalidade', body: 'Separe oportunidades identificadas pela IA, assistidas e trazidas pela equipe.', detail: 'Atribuição de assistência não prova que a IA causou uma venda ou gerou receita incremental.' },
      { heading: 'Capacidade, não leitura emocional', body: 'Observe prazos, pendências e carga de trabalho para apoiar uma distribuição mais saudável.', detail: 'Não inferimos humor, esforço individual ou “energia” psicológica a partir de atividades.' },
      { heading: 'Reuniões que ajudam o time', body: 'Leve evidências, perguntas e oportunidades de apoio para conversas de gestão.', detail: 'Destaques e comparações devem incluir período, fonte e limites da amostra.' }
    ]
  },
  dados: {
    eyebrow: 'DADOS E INTEGRAÇÕES · ORIGEM À VISTA',
    title: 'Contexto útil começa com permissão.',
    lead: 'A arquitetura prevê fontes comerciais autorizadas e adaptadores de CRM. Cada informação precisa manter sua origem, data de atualização e finalidade de uso.',
    icon: Database,
    sections: [
      { heading: 'Fontes que a operação autoriza', body: 'Conversas comerciais, e-mail selecionado, planilhas, CRM e materiais de atendimento podem compor o contexto.', detail: 'Não há rastreamento universal por cookies, acesso livre a sites ou leitura de conversas privadas.' },
      { heading: 'Proveniência para revisar', body: 'Mostre qual fonte sustenta um dado e deixe conflitos e campos ausentes visíveis.', detail: 'Uma sugestão só passa ao cadastro depois da revisão de quem conhece o cliente.' },
      { heading: 'Conectores em desenvolvimento', body: 'CRM Faro IA, FaroIA API, Salesforce e Pipedrive fazem parte da visão do produto.', detail: 'Esses conectores ainda não estão disponíveis neste protótipo.' }
    ]
  },
  assistente: {
    eyebrow: 'FARO CHAT · ASSISTENTE CONECTADO',
    title: 'Pergunte do seu jeito. Revise a resposta.',
    lead: 'O espaço de conversa integra um assistente OpenAI pela API do produto. Perguntas gerais são bem-vindas; o contexto comercial demonstrativo só entra quando você o seleciona.',
    icon: MessageCircle,
    sections: [
      { heading: 'Conversa aberta', body: 'Peça ajuda para organizar uma abordagem, pensar em perguntas ou entender os dados da amostra.', detail: 'As respostas não são um registro do CRM nem promessa de recomendação certa.' },
      { heading: 'Multimodal, com clareza', body: 'Envie texto, uma imagem ou áudio compatível para pedir contexto ao assistente.', detail: 'Anexos são enviados à API para análise, não guardados no histórico local.' },
      { heading: 'OpenAI, sem chave no navegador', body: 'A integração é feita pelo servidor do produto; a interface não expõe credenciais.', detail: 'O modo live depende da disponibilidade do endpoint. Se houver falha, ela aparece sem resposta simulada.' }
    ]
  },
  seguranca: {
    eyebrow: 'SEGURANÇA E PRIVACIDADE · EM CONSTRUÇÃO',
    title: 'Ter contexto não é saber tudo.',
    lead: 'Princípios de permissão, minimização, transparência e controle humano orientam o desenvolvimento. Requisitos de privacidade precisam ser comprovados, não usados como selo.',
    icon: LockKeyhole,
    sections: [
      { heading: 'Permissão por fonte e finalidade', body: 'Conecte somente fontes aprovadas para uma finalidade comercial definida.', detail: 'Não compartilhe dados sensíveis ou pessoais reais na demonstração.' },
      { heading: 'Minimização e retenção', body: 'Planeje acesso por função, retenção adequada e caminhos claros de exclusão.', detail: 'Controles operacionais e políticas finais ainda dependem da implementação.' },
      { heading: 'Sem certificação presumida', body: 'A interface não afirma conformidade ou certificação como fato já comprovado.', detail: 'A adequação à LGPD precisa ser validada no produto e na operação reais.' }
    ]
  }
};
const routes: Record<SitePage, string> = {
  produto: '/preview/fio/Vendedor', vendedores: '/preview/fio/Vendedor',
  gestores: '/preview/fio/Gestor', dados: '/preview/fio/Dados',
  assistente: '/preview/fio/Vendedor#chat', seguranca: '/preview/fio/Dados#governanca'
};

export function InstitutionalPages({ page }: { page: SitePage }) {
  const pageData = content[page];
  const Icon = pageData.icon;
  return <div className="fi-site fi-inner-page">
    <header className="fi-header"><div className="fi-wrap fi-nav">
      <a href="#home" aria-label="Faro IA · início"><Brand/></a>
      <nav className="fi-navlinks fi-open" aria-label="Navegação principal">
        <a href="#home">Início</a>{items.map(item => <a href={`#${item.id}`} key={item.id} aria-current={item.id === page ? 'page' : undefined}>{item.label}</a>)}
      </nav>
    </div></header>
    <main className="fi-wrap fi-page-main">
      <a className="fi-link" href="#home"><ArrowLeft size={15}/> Voltar à página inicial</a>
      <section className="fi-page-hero"><div><span className="fi-label">{pageData.eyebrow}</span><h1>{pageData.title}</h1><p>{pageData.lead}</p><div className="fi-page-badges"><span className="fi-pill"><i/> Em desenvolvimento</span>{page === 'assistente'&&<span className="fi-pill"><Sparkles size={14}/> Assistente por OpenAI · via API</span>}</div></div><div className="fi-page-icon"><Icon size={38}/></div></section>
      <section className="fi-page-grid" aria-label={`${pageData.title} detalhes`}>{pageData.sections.map((section,index)=><article className="fi-page-card" key={section.heading}><span className="fi-page-number">0{index+1}</span><h2>{section.heading}</h2><p>{section.body}</p><small>{section.detail}</small></article>)}</section>
      <section className="fi-page-cta"><div><span className="fi-label">EXPLORE A DEMONSTRAÇÃO</span><h2>Experimente o espaço comercial.</h2><p>Cenário local com dados fictícios. Ações da demo não se conectam a canais ou CRMs externos.</p></div><a className="fi-btn" href={routes[page]}>Abrir {page === 'gestores' ? 'visão do gestor' : page === 'dados' || page === 'seguranca' ? 'dados e fontes' : page === 'assistente' ? 'Faro Chat' : 'visão do vendedor'} <ArrowRight size={15}/></a></section>
      <footer className="fi-page-foot"><BadgeCheck size={16}/> Faro IA em desenvolvimento · WhatsApp próprio planejado, número ainda não ativo. Nenhum número foi inventado.</footer>
    </main>
  </div>;
}
