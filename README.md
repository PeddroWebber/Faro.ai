# Faro IA

**Painel de oportunidades comerciais guiado por IA, com a OpenAI como motor.**

Projeto desenvolvido no **OpenAI DevDay Exchange Community Hackathon: São Paulo** (23/10/2026).

🔗 **Demo:** https://sales-quest-dashboard.vercel.app/preview/fio/Institucional

---

## O problema

Em times de vendas, o contexto do cliente fica espalhado entre WhatsApp, e-mail, planilhas, respostas anteriores e CRM. O vendedor perde tempo juntando peças e o gestor não enxerga o que realmente gera venda.

## A solução

### Para o vendedor
Uma experiência inspirada no Duolingo: cada oportunidade vira uma trilha curta.

**entender o cliente → preparar a conversa → registrar → definir o próximo passo**

- Índice de interesse do lead, com a origem de cada sinal
- Resposta sugerida com base no manual de atendimento da empresa
- Proposta de ligação e agendamento quando vale uma ação mais ativa
- Entrada por texto, áudio ou imagem
- Atualização do CRM em um clique (nativo ou externo, como Salesforce e Pipedrive)
- Um número de WhatsApp do Faro como assistente de vendas no bolso

### Para o gestor
- Oportunidades trazidas pela IA e quanto de venda veio delas
- Eficiência do time: quem está performando e por quê
- Pautas de reunião geradas a partir dos dados

### Princípio
Toda recomendação mostra **de onde veio a informação e por que ela importa**. A IA sugere, quem decide é a pessoa.

## Como a OpenAI entra

O assistente do Faro (`api/faro/chat.js`) usa a API da OpenAI:

| Uso | Modelo |
|---|---|
| Conversa, análise de contexto e imagem | `gpt-5-mini` |
| Entrada e resposta por voz | `gpt-audio` |

O assistente recebe apenas a carteira de demonstração como contexto, trata esse contexto como dado (nunca como instrução) e não executa ações por conta própria: prepara rascunhos para o vendedor confirmar.

## Telas

| Tela | Caminho |
|---|---|
| Site institucional | `/preview/fio/Institucional` |
| Espaço do vendedor | `/preview/fio/Vendedor` |
| Chat com o Faro | `/preview/fio/Vendedor#chat` |
| Área do gestor | `/preview/fio/Gestor` |
| Dados e integrações | `/preview/fio/Dados` |

## Estrutura

- `artifacts/mockup-sandbox` — app React + Vite + Tailwind com as telas
- `artifacts/faro-design-system` — tokens e componentes do design system Faro
- `api/faro/chat.js` — função serverless que conversa com a OpenAI
- `lib/*` — contratos de API e cliente para a evolução do produto

## Rodar local

```bash
pnpm install
pnpm --filter @workspace/mockup-sandbox run dev
```

## Deploy (Vercel)

O `vercel.json` já define build e saída. Configure `OPENAI_API_KEY` nas variáveis de ambiente do projeto para ativar o assistente. Nunca commite a chave.

## Time

- **Pietro Mauro Macera** — [LinkedIn](https://www.linkedin.com/in/pietro-mauro/) · [X](https://x.com/piemauro)
- **Pedro Webber** — [LinkedIn](https://www.linkedin.com/in/pedrowebber/)
- **Gabriel Costa** — [LinkedIn](https://www.linkedin.com/in/leiemici/)

---

> Protótipo com **dados fictícios de demonstração**. Nenhum dado real de cliente é usado.
