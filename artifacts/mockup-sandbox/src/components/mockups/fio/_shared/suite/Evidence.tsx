import { type Opportunity } from './state';

export function evidenceFor(o:Opportunity){
 if(!/^o[1-6]$/.test(o.id))return [{source:o.sector==='Importado CSV'?'CSV fornecido localmente':'Cadastro manual no Faro CRM demo',at:'14/05/2026 · sessão local',quality:'Declarado · ainda não confirmado',text:o.notes||'Registro sem contexto. Pergunte ao contato antes de criar suposições.'}];
 const messages:Record<string,string>={o1:'“Conseguimos os 24 kits antes do dia 30? Podemos conversar hoje?”',o2:'“Recebi a proposta. Quais são as condições para a segunda unidade?”',o3:'“Quero entender a reposição e a personalização.”',o4:'“Ainda preciso definir o mix com a equipe.”',o5:'Pedido confirmado no registro comercial de 12/05/2026.',o6:'Compra confirmada no registro comercial de 13/05/2026.'};
 return [
 {source:'WhatsApp Business · canal comercial autorizado (amostra)',at:'14/05/2026 · 09:12',quality:'Alta · informação explícita fictícia',text:messages[o.id]},
 {source:'Planilha · pedidos_maio.csv (amostra)',at:'14/05/2026 · 08:45',quality:'Média · confirmar com contato',text:o.id==='o1'?'Quantidade registrada: 18 kits. Telefone alternativo: (11) 90000-0188. Diverge dos 24 kits da conversa.':'Cadastro demonstrativo com dados comerciais. Não há telefone alternativo validado.'},
 {source:'E-mail comercial · caixa autorizada (amostra)',at:'13/05/2026 · 16:40',quality:'Alta · trecho fictício',text:'“Preciso confirmar internamente as opções e o prazo.” A amostra não representa uma caixa conectada.'},
 {source:'Formulário web · consentimento demonstrativo',at:'12/05/2026 · 10:05',quality:'Média · autodeclarada',text:`Interesse no catálogo · perfil de amostra ${o.type}. Sem rastreamento universal por cookies.`},
 {source:'Histórico de compra · CRM fictício',at:'02/04/2026 · 14:20',quality:'Alta · registro de amostra',text:'Pedido anterior registrado. Não implica satisfação ou intenção atual.'}
 ];
}
export function EvidencePanel({o,compact=false}:{o:Opportunity;compact?:boolean}){const rows=evidenceFor(o);return <div>{rows.slice(0,compact?2:undefined).map(e=><article className="path-evidence" key={e.source}><strong style={{fontSize:12}}>{e.source}</strong><p>{e.text}</p><small>{e.at} · {e.quality}</small></article>)}<small>{/^o[1-6]$/.test(o.id)?'Amostras fixas, não mensagens reais. Fontes desconectadas não recebem novos dados.':'Nenhuma conversa, e-mail ou compra foi inventada para este cadastro.'}</small></div>;}
