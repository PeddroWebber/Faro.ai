export type Client = {id:number;name:string;company:string;sector:string;city:string;potential:number;days:number;interest:'alto'|'médio'|'baixo';evidence:string;action:string;tint:string;contacted?:boolean;rejected?:boolean};
export const initialClients:Client[] = [
  {id:1,name:'Marina Azevedo',company:'Casa Aurora',sector:'Decoração',city:'Curitiba, PR',potential:18500,days:18,interest:'alto',evidence:'Pediu uma proposta para 3 unidades e perguntou sobre prazo de entrega.',action:'Retomar a proposta e confirmar o prazo das 3 unidades.',tint:'coral'},
  {id:2,name:'Rafael Nogueira',company:'Estúdio Vértice',sector:'Arquitetura',city:'São Paulo, SP',potential:12400,days:12,interest:'alto',evidence:'Solicitou o catálogo técnico para um projeto residencial.',action:'Perguntar se o catálogo atende ao projeto atual.',tint:'sage'},
  {id:3,name:'Camila Reis',company:'Ponto do Grão',sector:'Alimentação',city:'Belo Horizonte, MG',potential:8600,days:21,interest:'médio',evidence:'Comentou sobre a reforma da segunda loja; ainda não pediu proposta.',action:'Entender em que fase está a reforma da segunda loja.',tint:'lilac'},
  {id:4,name:'Bruno Tavares',company:'Oficina Horizonte',sector:'Mobiliário',city:'Campinas, SP',potential:15200,days:5,interest:'médio',evidence:'Recebeu uma amostra e combinou de avaliar com a equipe.',action:'Confirmar a avaliação da amostra com a equipe.',tint:'sage'},
  {id:5,name:'Luísa Ferraz',company:'Ateliê Mormaço',sector:'Design',city:'Recife, PE',potential:4900,days:8,interest:'baixo',evidence:'Aceitou receber o portfólio, sem projeto definido no momento.',action:'Perguntar se há algum novo projeto no ateliê.',tint:'coral'},
];
export function breakdown(c:Client) { return {potential:c.potential>=15000?40:c.potential>=8000?28:16, recency:c.contacted?0:c.days>=15?30:c.days>=7?20:8, interest:c.interest==='alto'?30:c.interest==='médio'?18:6}; }
export function score(c:Client) {const b=breakdown(c);return b.potential+b.recency+b.interest;}
export function priority(c:Client) {const n=score(c);return n>=80?'Alta prioridade':n>=55?'Boa oportunidade':'No seu tempo';}
export const currency=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
export const sampleCsv='nome,empresa,potencial,dias,interesse\nBeatriz Lopes,Forma Solar,13200,16,alto\nDiego Moura,Armazém do Vale,7800,9,médio';
export function parseCsv(text:string):Client[] {
 const lines=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/);const sep=lines[0]?.includes(';')?';':',';
 if(lines[0]?.toLowerCase().trim()!==['nome','empresa','potencial','dias','interesse'].join(sep))throw new Error('O cabeçalho precisa ser: nome,empresa,potencial,dias,interesse.');
 if(lines.length<2)throw new Error('Inclua ao menos um cliente abaixo do cabeçalho.');
 return lines.slice(1).filter(l=>l.trim()).map((line,i)=>{const p=line.split(sep).map(s=>s.trim());if(p.length!==5||!p[0]||!p[1]||!p[2]||!p[3]||!Number.isFinite(Number(p[2]))||Number(p[2])<0||!Number.isInteger(Number(p[3]))||Number(p[3])<0||!['alto','médio','baixo'].includes(p[4]))throw new Error(`Linha ${i+2}: confira nome, empresa, potencial positivo, dias inteiros e interesse (alto, médio ou baixo).`);return {id:Date.now()+i,name:p[0],company:p[1],potential:Number(p[2]),days:Number(p[3]),interest:p[4] as Client['interest'],sector:'Importado do CSV',city:'Não informada',evidence:`Interesse ${p[4]} informado no arquivo. Sem observações adicionais.`,action:'Confirmar o contexto e combinar um próximo passo.',tint:'sage'};});
}
