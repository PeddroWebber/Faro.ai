import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioLines, Bot, Camera, ChevronLeft, CircleStop, Mic, Plus, Send, Trash2, X } from 'lucide-react';
import { Btn } from './common';
import { Mascot } from '../ui';
import { money, useSuite } from './state';
import './chat.css';

type Turn = { role: 'user' | 'assistant'; content: string; image?: string; audio?: string; audioFormat?: 'wav' | 'mp3' };
type Thread = { id: string; title: string; updated: number; turns: Turn[] };
type Attachment = { kind: 'image' | 'audio'; name: string; data: string; format?: 'wav' | 'mp3'; preview?: string };
const STORE = 'faro-chat-history-v1';
const freshThread = (): Thread => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: 'Nova conversa', updated: Date.now(), turns: [] });
const dataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Não foi possível ler o arquivo.'));
  reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
  reader.readAsDataURL(file);
});

export function ChatFaro() {
  const { data, assistantTarget, go } = useSuite();
  const [threads, setThreads] = useState<Thread[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || '[]') as Thread[];
      return Array.isArray(saved) ? saved.slice(0, 30) : [];
    } catch { return []; }
  });
  const [activeId, setActiveId] = useState('');
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState('');
  const [recordingSec, setRecordingSec] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState(assistantTarget || '');
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recorderRef = useRef<{ stream: MediaStream; context: AudioContext; source: MediaStreamAudioSourceNode; processor: ScriptProcessorNode; chunks: Float32Array[]; timer: number; elapsed: number } | null>(null);
  const active = useMemo(() => threads.find(thread => thread.id === activeId) || null, [threads, activeId]);
  const target = data.opps.find(opportunity => opportunity.id === selectedClientId);

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(threads.map(({ id, title, updated, turns }) => ({ id, title, updated, turns: turns.slice(-40).map(({ role, content }) => ({ role, content: content.slice(0, 5000) })) })).slice(0, 30))); }
    catch { setError('Não foi possível salvar o histórico neste navegador.'); }
  }, [threads]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [active?.turns.length, loading]);
  useEffect(() => () => { abortRef.current?.abort(); stopRecording(); }, []);
  useEffect(() => () => { if (attachment?.preview) URL.revokeObjectURL(attachment.preview); }, [attachment?.preview]);
  const ensureThread = () => {
    if (active) return active;
    const next = freshThread();
    setThreads(previous => [next, ...previous].slice(0, 30));
    setActiveId(next.id);
    return next;
  };
  const updateThread = (id: string, updater: (thread: Thread) => Thread) => setThreads(previous => previous.map(thread => {
    if (thread.id !== id) return thread;
    const updated = updater(thread);
    return { ...updated, turns: updated.turns.slice(-40) };
  }));
  const attachFile = async (file?: File, kind?: 'image' | 'audio') => {
    if (!file || !kind) return;
    setError('');
    const isImage = kind === 'image';
    const valid = isImage
      ? ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && /\.(jpe?g|png|webp)$/i.test(file.name)
      : ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3'].includes(file.type) && /\.(wav|mp3)$/i.test(file.name);
    if (!valid) { setError(isImage ? 'Use uma imagem JPG, PNG ou WebP.' : 'Use um áudio WAV ou MP3. Outros formatos não são aceitos pela API.'); return; }
    const maxBytes = isImage ? 3 * 1024 * 1024 : 8 * 1024 * 1024;
    if (!file.size || file.size > maxBytes) { setError(`O arquivo deve ter até ${isImage ? '3 MB' : '8 MB'}.`); return; }
    try {
      const encoded = await dataUrl(file);
      setAttachment({ kind, name: file.name, data: encoded, format: isImage ? undefined : file.type.includes('mpeg') || file.type.includes('mp3') ? 'mp3' : 'wav', preview: isImage ? URL.createObjectURL(file) : undefined });
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao preparar o arquivo.'); }
  };
  const discardAttachment = () => { if (attachment?.preview) URL.revokeObjectURL(attachment.preview); setAttachment(null); };

  function stopRecording() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    window.clearInterval(recorder.timer);
    recorder.processor.disconnect();
    recorder.source.disconnect();
    recorder.stream.getTracks().forEach(track => track.stop());
    void recorder.context.close();
    recorderRef.current = null;
    setRecording(false);
  }
  function finishRecording() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    const length = recorder.chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const samples = new Float32Array(length);
    let offset = 0;
    recorder.chunks.forEach(chunk => { samples.set(chunk, offset); offset += chunk.length; });
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const write = (position: number, text: string) => [...text].forEach((char, index) => view.setUint8(position + index, char.charCodeAt(0)));
    write(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true); write(8, 'WAVE'); write(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, recorder.context.sampleRate, true); view.setUint32(28, recorder.context.sampleRate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, samples.length * 2, true);
    samples.forEach((sample, index) => view.setInt16(44 + index * 2, Math.max(-1, Math.min(1, sample)) * 0x7fff, true));
    stopRecording();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    discardAttachment();
    setAttachment({ kind: 'audio', name: 'Gravação de voz.wav', format: 'wav', data: `data:audio/wav;base64,${btoa(binary)}` });
  }
  async function toggleRecording() {
    if (recording) {
      finishRecording();
      return;
    }
    try {
      discardAttachment();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
      const chunks: Float32Array[] = [];
      processor.onaudioprocess = event => { chunks.push(new Float32Array(event.inputBuffer.getChannelData(0))); event.outputBuffer.getChannelData(0).fill(0); };
      source.connect(processor); processor.connect(context.destination);
      const timer = window.setInterval(() => {
        const current = recorderRef.current;
        if (!current) return;
        current.elapsed += 1;
        setRecordingSec(current.elapsed);
        if (current.elapsed >= 30) { finishRecording(); setRecordError('Gravação encerrada em 30 segundos. Revise o áudio antes de enviar.'); }
      }, 1000);
      recorderRef.current = { stream, context, source, processor, chunks, timer, elapsed: 0 };
      setRecordingSec(0); setRecording(true); setRecordError('');
    } catch { setRecordError('Microfone indisponível. Confira a permissão do navegador e tente novamente.'); }
  }

  async function send(text = draft, selectedAttachment = attachment, requestVoice = voice, retry = false) {
    if (loading || (!text.trim() && !selectedAttachment)) return;
    const thread = ensureThread();
    if (retry && thread.turns.at(-1)?.role === 'user' && (thread.turns.at(-1)?.image || thread.turns.at(-1)?.audio)) {
      setError('Para tentar novamente com um anexo, selecione o arquivo outra vez. Anexos não são guardados no histórico.');
      return;
    }
    const userTurn: Turn = { role: 'user', content: text.trim() || (selectedAttachment?.kind === 'image' ? 'Descreva esta imagem e ajude a relacioná-la ao contexto selecionado.' : 'Ouça este áudio e me ajude a organizar o próximo passo.'), image: selectedAttachment?.kind === 'image' ? selectedAttachment.data : undefined, audio: selectedAttachment?.kind === 'audio' ? selectedAttachment.data.split(',')[1] : undefined, audioFormat: selectedAttachment?.format };
    const nextTurns = retry ? thread.turns : [...thread.turns, userTurn];
    if (!retry) updateThread(thread.id, item => ({ ...item, title: item.turns.length ? item.title : (text.trim().slice(0, 44) || 'Conversa com anexo'), updated: Date.now(), turns: nextTurns }));
    setDraft('');
    if (!retry) discardAttachment();
    setLoading(true); setError('');
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 60_000);
    const context = JSON.stringify({
      selectedClient: target ? { id: target.id, company: target.company, name: target.name } : null,
      opportunities: data.opps.slice(0, 12).map(({ id, name, company, type, stage, owner, heat, notes, nextAction, value }) => ({ id, name, company, type, stage, owner, heat, notes, nextAction, value: money(value) })),
      meetings: data.meetings.slice(0, 12).map(({ client, date, time, kind, owner, notes }) => ({ client, date, time, kind, owner, notes })),
      note: 'Dados fictícios da demonstração. Nunca trate os registros como fatos reais. Cite os nomes dos clientes apenas quando houver correspondência nesta lista. Não afirme que alterações foram salvas.'
    }).slice(0, 24_000);
    const payload: Record<string, unknown> = {
      message: userTurn.content,
      history: nextTurns.slice(0, -1).slice(-16).map(turn => ({ role: turn.role, content: turn.content.slice(0, 6000) })),
      context,
      voice: requestVoice
    };
    if (userTurn.image) payload.image = userTurn.image;
    if (userTurn.audio) { payload.audio = { data: userTurn.audio, format: userTurn.audioFormat }; payload.voice = true; }
    try {
      const response = await fetch('/api/faro/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal, credentials: 'include' });
      const result = await response.json() as { reply?: string; error?: string; mode?: string; audio?: { data: string; format: 'wav' } };
      if (!response.ok) throw new Error(result.error || `Não foi possível falar com o assistente (HTTP ${response.status}).`);
      if (result.mode !== 'live' || !result.reply?.trim()) throw new Error('A resposta do assistente não veio em modo live. Nenhuma resposta simulada será exibida.');
      const assistantTurn: Turn = { role: 'assistant', content: result.reply, audio: result.audio?.data, audioFormat: result.audio?.format };
      updateThread(thread.id, item => ({ ...item, updated: Date.now(), turns: [...(retry ? item.turns : nextTurns), assistantTurn] }));
    } catch (reason) {
      setError(controller.signal.aborted ? 'A solicitação levou mais de 60 segundos ou foi cancelada. Tente novamente.' : reason instanceof Error ? reason.message : 'Falha de conexão. Tente novamente.');
    } finally { window.clearTimeout(timeout); setLoading(false); abortRef.current = null; }
  }
  function newConversation() { setActiveId(''); setError(''); setDraft(''); discardAttachment(); }
  function removeThread(id: string) { setThreads(previous => previous.filter(thread => thread.id !== id)); if (activeId === id) setActiveId(''); }

  return <section className="faro-chat-page">
    <header className="chat-topline"><div><span className="eyebrow">ASSISTENTE FARO IA · by OpenAI</span><h1>Fale sobre o que você precisa.</h1><p>Perguntas abertas, contexto da carteira e apoio para a próxima decisão.</p></div><span className="tag warm">Assistente real · depende da API</span></header>
    <div className="chat-shell">
      <aside className="chat-history">
        <Btn onClick={newConversation}><Plus size={16}/>Nova conversa</Btn>
        <span className="mini-label">HISTÓRICO NESTE NAVEGADOR</span>
        {threads.length ? threads.map(thread => <div className={`chat-history-row ${thread.id === activeId ? 'active' : ''}`} key={thread.id}><button onClick={() => setActiveId(thread.id)}>{thread.title}</button><button className="icon-button" aria-label={`Excluir conversa ${thread.title}`} onClick={() => removeThread(thread.id)}><Trash2 size={14}/></button></div>) : <p className="muted">Suas conversas aparecem aqui. Anexos não são armazenados.</p>}
        <button className="text-link chat-workflow-link" onClick={() => go('assistente')}><ChevronLeft size={15}/>Fluxo de revisão de CRM</button>
      </aside>
      <main className="chat-main">
        {!active?.turns.length ? <div className="chat-welcome"><Mascot pose="wave"/><div className="chat-welcome-icon"><Bot size={28}/></div><h2>Como posso ajudar?</h2><p>Pergunte livremente. Posso usar a amostra fictícia da sua carteira; quando faltarem dados, vou dizer.</p><div className="chat-suggestions">{['O que devo confirmar com a Casa Aurora?', 'Quais retornos estão na agenda?', 'Me ajude a estruturar uma conversa de descoberta.'].map(prompt => <button key={prompt} onClick={() => { setDraft(prompt); void send(prompt, null, false); }}>{prompt}<Send size={14}/></button>)}</div></div> : <div className="chat-turns" aria-live="polite">{active.turns.map((turn, index) => <article className={`chat-turn ${turn.role}`} key={`${active.id}-${index}`}><span className="chat-role">{turn.role === 'assistant' ? 'Faro IA' : 'Você'}</span>{turn.image&&<img className="chat-image" src={turn.image} alt="Imagem enviada nesta conversa"/>}{turn.audio&&<span className="chat-audio-chip"><AudioLines size={15}/> Áudio enviado · {turn.audioFormat?.toUpperCase()}</span>}<p>{turn.content}</p>{turn.audio&&turn.role==='assistant'&&<audio controls src={`data:audio/${turn.audioFormat || 'wav'};base64,${turn.audio}`} aria-label="Resposta falada do assistente"/>}{turn.role==='assistant'&&index===active.turns.length-1&&<Mascot pose="happy"/>}</article>)}{loading&&<div className="chat-loading" role="status"><Mascot pose="front"/><span/><span/><span/> Faro está preparando uma resposta…</div>}<div ref={endRef}/></div>}
        {error&&<div className="notice error chat-error" role="alert">{error}<div className="actions"><Btn kind="secondary" onClick={() => void send(active?.turns.at(-1)?.content || draft, null, voice, true)}>Tentar novamente</Btn><Btn kind="quiet" onClick={() => setError('')}>Fechar</Btn></div></div>}
        {recordError&&<div className="notice error" role="alert">{recordError}<button className="text-link" onClick={() => setRecordError('')}>Fechar</button></div>}
        {attachment&&<div className="chat-attachment">{attachment.preview?<img src={attachment.preview} alt={`Prévia de ${attachment.name}`}/>:<AudioLines size={20}/>}<span>{attachment.name} · anexo será enviado ao assistente OpenAI, não salvo no histórico.</span><button aria-label="Remover anexo" onClick={discardAttachment}><X size={16}/></button></div>}
        <div className="chat-composer"><textarea aria-label="Mensagem para Faro IA" maxLength={6000} placeholder="Escreva uma mensagem… Perguntas gerais também são bem-vindas." value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send(); } }} rows={3}/><div className="chat-composer-controls"><div className="chat-tools"><button aria-label="Anexar imagem" onClick={() => {discardAttachment();fileRef.current?.click();}}><Camera size={17}/><span>Imagem</span></button><button aria-label="Anexar áudio WAV ou MP3" onClick={() => {discardAttachment();audioInputRef.current?.click();}}><AudioLines size={17}/><span>Áudio</span></button><button aria-label={recording?'Parar gravação':'Gravar áudio'} className={recording?'recording':''} onClick={() => void toggleRecording()}>{recording?<CircleStop size={17}/>:<Mic size={17}/>}<span>{recording?`Parar · ${recordingSec}s`:'Gravar'}</span></button><label className="chat-voice-toggle"><input type="checkbox" checked={voice} onChange={event => setVoice(event.target.checked)}/> Ouvir resposta</label></div><Btn disabled={loading||(!draft.trim()&&!attachment)} onClick={() => void send()}>{loading?<CircleStop size={16}/>:<Send size={16}/>} {loading?'Enviando':'Enviar'}</Btn></div><small className="chat-attachment-note">{attachment ? 'Um anexo por envio; troque a imagem ou o áudio removendo o atual.' : 'Imagem JPG/PNG/WebP até 3 MB · áudio WAV/MP3 · gravação até 30 s.'}</small></div>
        <input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={event => {const file=event.target.files?.[0];event.target.value='';void attachFile(file,'image');}}/>
        <input ref={audioInputRef} hidden type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" onChange={event => {const file=event.target.files?.[0];event.target.value='';void attachFile(file,'audio');}}/>
        <div className="chat-footnote">As mensagens são enviadas a /api/faro/chat. Não inclua dados pessoais reais. O contexto enviado é limitado à amostra demonstrativa.</div>
        {loading&&<button className="text-link chat-cancel" onClick={() => abortRef.current?.abort()}>Cancelar solicitação</button>}
      </main>
      <aside className="chat-context"><span className="eyebrow">CONTEXTO DO CLIENTE</span><h3>{target?.company || 'Carteira demonstrativa'}</h3><label>Incluir contexto de<select value={selectedClientId || 'all'} onChange={event => setSelectedClientId(event.target.value === 'all' ? '' : event.target.value)}><option value="all">toda a amostra</option>{data.opps.map(opportunity => <option key={opportunity.id} value={opportunity.id}>{opportunity.company}</option>)}</select></label>{target?<><p>{target.name} · {target.type} · {target.stage}</p><p>{target.notes}</p></>:<p>Até {Math.min(12,data.opps.length)} oportunidades fictícias e próximos compromissos serão fornecidos como contexto para esta conversa.</p>}<small>Somente dados de demonstração. Respostas não alteram o CRM. Revise e confirme mudanças no fluxo apropriado.</small>{target&&<div className="tag neutral">{target.heat}/100 · índice demonstrativo, não chance de venda</div>}</aside>
    </div>
  </section>;
}
