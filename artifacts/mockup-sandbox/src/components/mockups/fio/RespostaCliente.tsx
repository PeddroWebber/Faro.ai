import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCheck, Copy, Mail, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';
import { Button } from '../../../../../faro-design-system/src/components/actions';
import { Textarea } from '../../../../../faro-design-system/src/components/fields';
import { Notice } from '../../../../../faro-design-system/src/components/feedback';
import { demoDate, uid, useSuite, type Opportunity } from './_shared/suite/state';
import './RespostaCliente.css';

type Channel = 'whatsapp' | 'email';
type Delivery = 'editing' | 'review' | 'sending' | 'sent' | 'error';

// Product-specific composition: source review, recipient check and channel handoff.
// Real dispatch requires an authenticated messaging backend; no external requests here.
export function RespostaCliente({client, initialText, onClose, onRecord}:{
  client:Opportunity; initialText:string; onClose:()=>void; onRecord:(text:string)=>void;
}) {
  const {data,setData} = useSuite();
  const [text,setText] = useState(initialText);
  const [channel,setChannel] = useState<Channel>(client.phone.trim() ? 'whatsapp' : 'email');
  const [status,setStatus] = useState<Delivery>('editing');
  const [feedback,setFeedback] = useState('');
  const [failNext,setFailNext] = useState(false);
  const [copied,setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const destination = channel === 'whatsapp' ? client.phone : client.email;
  const manual = data.docs.find(d=>d.kind === 'Manual');
  const replySource = data.docs.find(d=>d.kind === 'Resposta aprovada');
  const available = channel === 'whatsapp' ? Boolean(client.phone.trim()) : Boolean(client.email.trim());
  const valid = text.trim().length >= 10 && available;
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  useEffect(()=>{heading.current?.focus({preventScroll:true});},[status]);

  function review() {
    if(!valid){setFeedback('Escreva uma resposta com pelo menos 10 caracteres e escolha um canal com destino cadastrado.');return;}
    setFeedback('');setStatus('review');
  }
  function send() {
    if(inFlight.current || !valid)return;
    inFlight.current=true;setStatus('sending');setFeedback('');
    timer.current=setTimeout(()=>{
      inFlight.current=false;
      if(failNext){setFailNext(false);setStatus('error');return;}
      setData(d=>({...d,opps:d.opps.map(o=>o.id===client.id?{...o,approved:text.trim()}:o),
        logs:[{id:uid(),text:`Envio SIMULADO por ${channel==='whatsapp'?'WhatsApp':'e-mail'} para ${client.name} (${destination}): ${text.trim()}. Sem entrega real.`,at:`${demoDate.split('-').reverse().join('/')} · sessão local`},...d.logs]}));
      setStatus('sent');
    },850);
  }
  async function copy() {
    try{await navigator.clipboard.writeText(text);setCopied(true);setFeedback('Resposta copiada. Nenhuma mensagem foi enviada.');}
    catch{setFeedback('A cópia foi bloqueada. Selecione o texto da resposta para copiar manualmente.');}
  }
  return <section className="reply-client" aria-label="Responder pelo canal do cliente">
    <div className="rc-top"><span className="s80-label"><MessageCircle size={15}/> RESPONDER AO CLIENTE</span><Button variant="quiet" aria-label="Fechar ajuda de resposta" onClick={onClose} disabled={status==='sending'}><X size={17}/></Button></div>
    <div className="rc-intro"><h3 ref={heading} tabIndex={-1}>{status==='sent'?'Pronto. Resposta registrada na demo.':status==='review'?'Tudo certo para enviar?':status==='sending'?'Simulando o envio…':status==='error'?'A simulação não concluiu.':'Uma boa resposta. No canal certo.'}</h3><p>{status==='sent'?'O histórico já sabe o que você respondeu. Agora combine o próximo passo.':'Revise o texto. O Faro prepara; você decide quando enviar.'}</p></div>
    <div className="rc-recipient"><span className="s80-person">{client.name.split(' ').slice(0,2).map(n=>n[0]).join('')}</span><div><strong>{client.name}</strong><small>{client.company} · destino do cadastro</small></div><span className="rc-demo">DEMO</span></div>
    {status==='editing' && <>
      <div className="rc-channels"><span className="s80-label">1. CANAL DESTA RESPOSTA</span><div role="group" aria-label="Canal do cliente"><Button variant={channel==='whatsapp'?'secondary':'quiet'} aria-pressed={channel==='whatsapp'} disabled={!client.phone.trim()} onClick={()=>{setChannel('whatsapp');setFeedback('');}}><MessageCircle size={16}/>WhatsApp {!client.phone.trim()&&'· sem número'}</Button><Button variant={channel==='email'?'secondary':'quiet'} aria-pressed={channel==='email'} disabled={!client.email.trim()} onClick={()=>{setChannel('email');setFeedback('');}}><Mail size={16}/>E-mail {!client.email.trim()&&'· não cadastrado'}</Button></div><small>{destination || 'Nenhum destino disponível. Atualize o cadastro antes de responder.'} · sugerido pelo cadastro, não por preferência confirmada.</small></div>
      <div className="rc-editor"><span className="s80-label">2. REVISE COM SEU JEITO</span><Textarea label="Resposta para o cliente" value={text} onChange={e=>{setText(e.target.value);setCopied(false);}}/><div className="rc-text-meta"><span>Exemplo editável · IA não conectada</span><span>{text.trim().length} caracteres</span></div></div>
      <details className="rc-sources"><summary><ShieldCheck size={15}/> De onde vem esta sugestão?</summary><p>Modelo demonstrativo adaptado ao estágio da oportunidade. Os materiais abaixo são referências para sua revisão; o protótipo não os interpreta com IA.</p>{manual?<blockquote><strong>{manual.title} · v{manual.version}</strong><p>{manual.body}</p></blockquote>:<p>Nenhum manual cadastrado. Confira as condições com sua equipe.</p>}{replySource&&<p>Base disponível: {replySource.title} · v{replySource.version}.</p>}<p>Não confirme estoque, preço ou prazo sem verificar.</p></details>
      <div className="rc-actions"><Button onClick={review} disabled={!valid}>Revisar envio <ArrowRight size={16}/></Button><Button variant="quiet" onClick={copy}><Copy size={15}/>{copied?'Copiado':'Copiar texto'}</Button></div>
    </>}
    {(status==='review'||status==='sending'||status==='error') && <>
      <div className="rc-envelope"><div className="rc-address"><span>{channel==='whatsapp'?<MessageCircle size={17}/>:<Mail size={17}/>}</span><strong>{channel==='whatsapp'?'WhatsApp':'E-mail'}</strong><span>{destination}</span></div><p className="rc-message">{text}</p><small>Para {client.name} · somente esta oportunidade</small></div>
      <div className="rc-safety"><ShieldCheck size={16}/><p><strong>Envio demonstrativo.</strong> Nenhuma mensagem sairá do Faro. A integração de {channel==='whatsapp'?'WhatsApp':'e-mail'} ainda não está ativa.</p></div>
      {status==='sending'?<div className="rc-loading" role="status"><span/><span/><small>Conferindo destino e registrando a simulação…</small></div>:<>{status==='error'&&<Notice error>Falha simulada de conexão. Seu texto foi preservado; nada foi enviado. Tente novamente ou volte para editar.</Notice>}<div className="rc-actions"><Button onClick={send}><Send size={16}/>{status==='error'?'Tentar envio novamente':`Enviar por ${channel==='whatsapp'?'WhatsApp':'e-mail'}`} <span className="rc-button-demo">DEMO</span></Button><Button variant="quiet" onClick={()=>setStatus('editing')}><ArrowLeft size={15}/>Voltar e editar</Button></div><details className="rc-test"><summary>Testar falha de envio</summary><Button variant="quiet" onClick={()=>setFailNext(!failNext)} aria-pressed={failNext}>{failNext?'Falha ativada para o próximo envio':'Ativar falha demonstrativa'}</Button></details></>}
    </>}
    {status==='sent'&&<><div className="rc-delivery" role="status"><CheckCheck size={24}/><div><strong>Envio simulado concluído</strong><p>{channel==='whatsapp'?'WhatsApp':'E-mail'} · {client.name}</p><small>Não comprova entrega ou leitura. Não soma contato útil automaticamente.</small></div></div><div className="rc-envelope"><p className="rc-message">{text}</p></div><div className="rc-actions"><Button onClick={()=>onRecord(`Resposta simulada por ${channel==='whatsapp'?'WhatsApp':'e-mail'}: ${text.trim()}`)}>Registrar resultado e próximo passo <Check size={16}/></Button><Button variant="quiet" onClick={onClose}>Voltar ao meu dia</Button></div></>}
    {feedback&&<div className="rc-feedback"><Notice>{feedback}</Notice></div>}
  </section>;
}
