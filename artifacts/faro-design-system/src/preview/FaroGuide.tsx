import { useState } from 'react';
import { Brand, Mascot } from '../components/identity';
import { Button } from '../components/actions';
import { Input, Textarea } from '../components/fields';
import { Priority } from '../components/priority';
import { Notice } from '../components/feedback';
import '../components/faro.css';
import './faro-guide.css';

const pages = ['Visão geral', 'Cores', 'Tipografia e espaço', 'Marca e mascote', 'Botões', 'Campos', 'Prioridades', 'Feedback', 'Voz e movimento', 'Origem e escopo'];
const palette = [['Linha', '#243E3B', 'Texto e títulos'], ['Barro', '#CE5135', 'Ação principal'], ['Papel', '#FAF8F3', 'Fundo'], ['Pêssego', '#FFE9DC', 'Foco'], ['Encontro', '#216458', 'Confirmação'], ['Respiro', '#E6F0E6', 'Feedback positivo']];

export function FaroGuide() {
  const [page, setPage] = useState('Visão geral');
  const [dark, setDark] = useState(false);
  const [message, setMessage] = useState('');
  return <div className={dark ? 'dark' : ''}><div className="fio ds-guide">
    <aside><Brand/><p className="small muted">SISTEMA DE DESIGN · EXTRAÇÃO</p><nav aria-label="Biblioteca visual">{pages.map(name => <button key={name} aria-current={page === name ? 'page' : undefined} onClick={() => {setPage(name); setMessage('');}}>{name}</button>)}</nav><Button variant="secondary" onClick={() => setDark(!dark)}>{dark ? 'Tema claro original' : 'Tema escuro derivado'}</Button></aside>
    <main><header><span className="eyebrow">FARO IA / BIBLIOTECA VISUAL</span><span className="badge low">Extração independente</span></header><h1>{page}</h1><p className="muted">Clareza para agir. Leveza para continuar.</p>
      {dark && <Notice>Tema escuro derivado. O mockup selecionado fornece apenas o tema claro.</Notice>}
      <div className="ds-content">
        {page === 'Visão geral' && <><section className="ds-hero"><div><span className="eyebrow">DO GUIA À BIBLIOTECA</span><h2>Um bom próximo passo.<br/>Em qualquer tela.</h2><p>Identidade acolhedora, controles táteis e feedback perto da ação. Extraídos do guia visual selecionado.</p></div><Mascot/></section><div className="ds-grid"><article><h2>Ações com resposta</h2><Button onClick={() => setMessage('Boa! Seu foco avançou.')}>Começar contato</Button><p>Resposta imediata. Um próximo passo claro.</p></article><article><h2>Contexto compreensível</h2><Input label="Buscar cliente" placeholder="Nome ou empresa"/><Priority/></article></div><Notice>Primeiro conjunto extraído: marca, botões, campos, prioridades e feedback. As demais famílias estão inventariadas para continuação.</Notice></>}
        {page === 'Cores' && <div className="ds-grid">{palette.map(([name, color, role]) => <article key={name}><div style={{background: color, height: 86, borderRadius: 12, border: '1px solid #ddd'}}/><h2>{name}</h2><p>{color} · {role}</p></article>)}</div>}
        {page === 'Tipografia e espaço' && <><h2 style={{fontSize: 32}}>Bons contatos.</h2><p>Nunito · display 32/37 · peso 900</p><h2>Seu próximo passo</h2><p>Nunito · título 24/29 · peso 900</p><p>Nunito Sans · corpo 14/21 · peso 500–600</p><span className="eyebrow">SINAIS, NÃO CERTEZAS · 11/16</span><div className="ds-grid">{[4,8,12,16,24,32].map(n => <article key={n}><div style={{width:n,height:n,background:'var(--teal)'}}/>{n} px</article>)}</div><p>Raios: 8 px nos badges, 12–13 px nos controles, 20 px nos cartões. Base tátil de 3–4 px.</p></>}
        {page === 'Marca e mascote' && <><Brand/><Mascot/><h2>Faro para boas oportunidades.</h2><p>O cão farejador, com focinho marcante, orelhas caídas e lenço verde, dá personalidade ao produto. O símbolo F e a assinatura IA permanecem reconhecíveis.</p></>}
        {page === 'Botões' && <><Button onClick={() => setMessage('Bom começo! Você está no controle.')}>Começar contato</Button><Button variant="secondary" onClick={() => setMessage('Sua versão vem primeiro.')}>Editar sugestão</Button><Button variant="quiet" onClick={() => setMessage('Tudo bem. Você escolhe o ritmo.')}>Agora não</Button><Button className="pressed">Estado pressionado</Button><Button disabled>Indisponível — aguardando dados</Button><p>Alvo de 46 px. Hover eleva 2 px, pressionar desloca 3 px.</p></>}
        {page === 'Campos' && <><Input label="Buscar cliente" placeholder="Nome ou empresa" help="Rótulos permanecem visíveis."/><Textarea label="Resultado do contato" placeholder="O que vocês combinaram?"/><Input label="Campo indisponível" disabled value="Aguardando autorização"/></>}
        {page === 'Prioridades' && <><Priority/><Priority level="medium"/><Priority level="low"/><p>Texto, símbolo e cor. A pontuação indica prioridade, nunca chance de venda.</p></>}
        {page === 'Feedback' && <><Notice>Boa conversa! Contato registrado.</Notice><Notice error>O arquivo precisa de um ajuste. Confira a linha 3.</Notice><Button variant="secondary" onClick={() => setMessage('Exemplo corrigido. Você pode seguir.')}>Corrigir exemplo</Button></>}
        {page === 'Voz e movimento' && <><h2>Incentivar, não cobrar.</h2><p>“Seu Faro encontrou 3 oportunidades para hoje.”</p><p>“Uma conversa de cada vez. Você escolhe o ritmo.”</p><p>“O arquivo precisa de um ajuste. Vamos conferir?”</p><ul><li>Uma ação principal evidente e feedback perto da ação.</li><li>Movimentos de 160–400 ms, sem depender de som.</li><li>Foco visível de 3 px; alvos de 44 px ou mais.</li><li>Respeitar redução de movimento.</li><li>IA sugere. A pessoa revisa, edita ou descarta.</li></ul></>}
        {page === 'Origem e escopo' && <><h2>Extração, não redesenho.</h2><p>Fonte: SistemaVisual.tsx, _group.css e _shared/ui.tsx do mockup selecionado.</p><p>Tokens e cinco famílias extraídos. Diálogo, cartão de oportunidade e estados vazio/carregando aguardam a continuação do catálogo.</p><p>Não aplicamos esta extração às telas existentes. A migração depende da sua aprovação.</p></>}
        {message && <Notice>{message}</Notice>}
      </div><footer>Faro IA · Guia vivo · Primeiro conjunto extraído da referência</footer>
    </main>
  </div></div>;
}
