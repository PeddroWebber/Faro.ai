import { useState } from 'react';
import { ArrowRight, Check, Compass, UsersRound, Database, Sprout } from 'lucide-react';
import { Btn, Confirm, Heading } from './common';
import { completedJourneys } from './journey-model';
import { useSuite, type Page, type Scenario } from './state';

const scenarios:{id:Scenario;title:string;description:string;icon:typeof Compass}[]=[
 {id:'padrao',title:'Vendedor · começar pelo contexto',description:'Seis oportunidades fictícias; Lia tem três contatos para trabalhar. Caminhos ainda não concluídos.',icon:Compass},
 {id:'retorno',title:'Vendedor que está voltando',description:'Retome Casa Aurora na etapa de registro, com resposta aprovada. Ainda falta confirmar contato e retorno.',icon:ArrowRight},
 {id:'gestao',title:'Gestão · revisar equipe e pauta',description:'Revise origens, assistência, carga do time, justificativas e uma pauta editável.',icon:UsersRound},
 {id:'falha',title:'Fonte com erro de ingestão',description:'WhatsApp e CRM em erro demonstrativo. Teste retry, permissões e desativação sem autenticação.',icon:Database},
 {id:'vazio',title:'Começar sem dados',description:'Sem clientes, agenda ou manuais. Teste estados vazios, criação manual e importação CSV.',icon:Sprout}
];
export function Validation(){
 const {data,loadScenario,go}=useSuite();const [choice,setChoice]=useState<Scenario>(data.scenario),[confirm,setConfirm]=useState(false);
 const completed=Array.from(new Set(data.opps.map(o=>o.owner))).reduce((n,owner)=>n+completedJourneys(data,owner),0);
 const checklist:{title:string;description:string;page:Page;status:string}[]=[
  {title:'Caminho do vendedor',description:'Entender → preparar → registrar contexto útil → confirmar retorno. Volte, feche a página e retome.',page:'hoje',status:`${completed} concluídos no time`},
 {title:'Pipeline e Cliente 360',description:'Crie, edite, busque B2B/B2C, mude etapas e revise origens. Na Casa Aurora, aceite ou rejeite o enriquecimento.',page:'pipeline',status:`${data.opps.length} registros`},
 {title:'Assistente multimodal',description:'Teste texto e arquivo local. Áudio/imagem só têm prévia; o exemplo fixo nunca analisa seu arquivo.',page:'assistente',status:'Demo local'},
 {title:'Agenda e histórico',description:'Crie, edite e remova um compromisso. Confira a atualização do CRM e o registro do caminho concluído.',page:'agenda',status:`${data.meetings.length} compromissos`},
 {title:'Gestão e capacidade',description:'Filtre período/vendedor, inspecione razões dos destaques e diferencie atribuição de causalidade.',page:'gestor',status:'Medidas de amostra'},
 {title:'Pauta de reunião',description:'Gere a partir do cenário, edite, salve e leia novamente a versão persistida.',page:'pauta',status:data.pauta?'Pauta salva':'Ainda não salva'},
 {title:'Fontes e consentimento',description:'Simule escopos, retry de erro, desativação e remoção. Nenhum OAuth ou serviço real.',page:'fontes',status:`${data.sources.filter(s=>s.status==='Erro').length} erros demo`},
 {title:'CSV com revisão',description:'Use o exemplo com duplicata, corrija colunas, confirme linhas válidas e confira o pipeline.',page:'importar',status:`${data.opps.filter(o=>o.sector==='Importado CSV').length} importados`},
 {title:'Manuais e respostas aprovadas',description:'Crie, edite, remova ou leia texto .txt/.md local; confira versões e uso no rascunho.',page:'conhecimento',status:`${data.docs.length} conteúdos`},
 {title:'FaroIA API',description:'Explore entradas, saídas, proveniência e limites do enriquecimento planejado; sem chaves ou chamadas.',page:'api',status:'Não integrada'},
 {title:'Governança e preferências',description:'Altere retenção demonstrativa, equipe e meta. Teste exclusão dos dados e restauração do cenário.',page:'governanca',status:`Retenção: ${data.retention}`}
 ];
 return <><Heading eyebrow="Laboratório de validação · tudo local" title="Uma demo para experimentar de verdade." description="Escolha um ponto de partida e percorra os fluxos. As marcações abaixo são estado do cenário, não resultados de testes automáticos."/ ><div className="grid split"><section className="card"><h2>Escolher cenário</h2><p className="muted">Carregar substitui os dados e o progresso deste navegador, inclusive nas outras visões abertas.</p><div className="grid" style={{gap:12}}>{scenarios.map(s=><label className="path-scenario" key={s.id}><input type="radio" name="scenario" checked={choice===s.id} onChange={()=>setChoice(s.id)}/><s.icon size={18}/><span><strong>{s.title}</strong><p>{s.description}</p></span></label>)}</div><div className="form-footer"><Btn onClick={()=>setConfirm(true)}>Carregar cenário demo<ArrowRight size={14}/></Btn></div></section><aside className="card" style={{alignSelf:'start'}}><span className="tag">Cenário atual</span><h2 style={{marginTop:14}}>{scenarios.find(s=>s.id===data.scenario)?.title||'Cenário em exploração'}</h2><p className="muted">O progresso do caminho é salvo por oportunidade. Só concluir o retorno, com contexto e contato revisados, soma uma unidade útil.</p><div className="notice warn">Sem integração, autenticação, servidor ou envio. Não use dados reais de clientes. Os arquivos de áudio e imagem nunca são interpretados neste protótipo.</div><Btn kind="secondary" onClick={()=>go('hoje')}>Retomar meu caminho</Btn></aside></div><section className="card stack"><h2>Mapa dos fluxos para validar</h2><div className="validation-list">{checklist.map(item=><div className="validation-row" key={item.title}><Check size={16} color="var(--teal)" style={{marginTop:4,flexShrink:0}}/><div style={{flex:1}}><button className="text-link" onClick={()=>go(item.page)}>{item.title} →</button><p>{item.description}</p><span className="tag neutral">{item.status}</span></div></div>)}</div><small>Acesso livre: todas as telas continuam disponíveis na navegação secundária. Nenhum cenário exige integração.</small></section>{confirm&&<Confirm title="Carregar novo cenário demonstrativo?" description="Substitui dados, rascunhos e caminhos salvos das visões abertas neste navegador. Esta ação não afeta serviços externos." onClose={()=>setConfirm(false)} onConfirm={()=>loadScenario(choice)}/>}</>;
}
