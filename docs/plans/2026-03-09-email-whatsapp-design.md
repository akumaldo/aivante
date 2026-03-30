# Design: Email de Lead + WhatsApp no Bot

**Data:** 2026-03-09
**Status:** Aprovado

## Contexto

O bot do site AIPF qualifica leads (coleta nome, email, empresa, área, maturidade) mas não faz nada com os dados ao final da conversa. Precisamos:
1. Enviar email automático com resumo da conversa ao finalizar qualificação
2. Oferecer opção de contato direto via WhatsApp dentro do bot

## Decisões

- **Email**: Resend (API moderna, gratuito até 100/dia, compatível com Vercel Edge Functions)
- **WhatsApp**: Link direto wa.me (zero custo, zero setup)
- Todas as configurações via variáveis de ambiente para facilitar mudança futura

## Fluxo de Email

### Arquitetura

```
ChatWindow (frontend)
  → Conversa finalizada (bot coletou nome/email/empresa)
  → Frontend monta payload: { leadData, conversationSummary }
  → POST /api/send-email (nova Edge Function)
  → Edge Function usa Resend SDK para enviar email
  → Email chega em NOTIFICATION_EMAIL (env var)
```

### Detecção de conversa finalizada

- Instrução no system prompt para o bot retornar JSON estruturado embutido na última mensagem ao finalizar qualificação
- JSON contém: nome, email, empresa, área, maturidade, resumo
- Frontend detecta esse JSON, extrai dados, dispara POST para `/api/send-email`

### Formato do email

- **Assunto:** `Novo Lead AIPF — {nome} ({empresa})`
- **Corpo:** Nome, email, empresa, área de interesse, maturidade em IA, resumo da conversa, timestamp

### Nova Edge Function: `/api/send-email`

- Recebe payload do frontend
- Valida campos obrigatórios
- Usa Resend SDK para enviar
- Retorna 200 OK ou erro

## Fluxo de WhatsApp

### Comportamento

1. **Reativo (a qualquer momento):** Se o cliente pedir para falar com alguém ou demonstrar urgência, o bot responde com link do WhatsApp
2. **Proativo (no final):** Após qualificação e coleta de dados, o bot oferece o WhatsApp como opção de contato direto

### Link

```
https://wa.me/5511973582931?text=Olá! Vim pelo site da AIPF e gostaria de conversar.
```

### Implementação

- Mudança no system prompt do bot (`api/chat.ts`)
- ChatWindow já renderiza links clicáveis — funciona automaticamente
- Zero componentes novos

## Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `RESEND_API_KEY` | Chave da API do Resend | (obrigatória) |
| `NOTIFICATION_EMAIL` | Email destino das notificações | akumaldo@gmail.com |
| `WHATSAPP_NUMBER` | Número WhatsApp sem formatação | 5511973582931 |

## Arquivos impactados

- `api/chat.ts` — atualizar system prompt (JSON de lead + WhatsApp)
- `api/send-email.ts` — nova Edge Function
- `app/src/components/chat/ChatWindow.tsx` — detectar JSON de lead + disparar email
- `app/.env.example` — adicionar novas variáveis
