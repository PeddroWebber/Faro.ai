# Faro.ia

Protótipo do painel comercial **Faro IA**: espaço do vendedor, área do gestor, dados e integrações, site institucional e um assistente de vendas com IA (texto, imagem e voz) sobre uma carteira fictícia.

**Demo:** https://sales-quest-dashboard.vercel.app

## Estrutura

- `artifacts/mockup-sandbox` — app React + Vite + Tailwind com as telas (`/preview/fio/<Tela>`)
- `artifacts/faro-design-system` — tokens e componentes do design system Faro
- `api/faro/chat.js` — função serverless que conversa com a OpenAI (usada pelo chat da demo)
- `lib/*` — contratos de API e cliente (não usados pela demo estática)

## Rodar local

```bash
pnpm install
pnpm --filter @workspace/mockup-sandbox run dev
```

## Deploy (Vercel)

O `vercel.json` já define build e saída. Configure a variável de ambiente `OPENAI_API_KEY` no projeto da Vercel para ativar o assistente. Nunca commite a chave.
