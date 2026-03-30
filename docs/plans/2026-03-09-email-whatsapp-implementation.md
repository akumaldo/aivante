# Email de Lead + WhatsApp Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ao finalizar a qualificação no chatbot, enviar email automático com dados do lead + resumo para o dono do negócio, e oferecer contato direto via WhatsApp durante e ao final da conversa.

**Architecture:** Nova Edge Function `/api/send-email` usando Resend SDK. System prompt atualizado para emitir JSON estruturado ao final da qualificação e oferecer WhatsApp. Frontend detecta o JSON, extrai dados, dispara POST para envio do email silenciosamente.

**Tech Stack:** Resend (email), Vercel Edge Functions, React/TypeScript, wa.me links

---

### Task 1: Instalar dependência Resend

**Files:**
- Modify: `app/package.json`

**Step 1: Instalar resend**

Run: `cd /Users/brunolunardi/Downloads/Dev_Projects/AINOVA/app && npm install resend`

**Step 2: Commit**

```bash
git add app/package.json app/package-lock.json
git commit -m "chore: add resend dependency for email notifications"
```

---

### Task 2: Atualizar variáveis de ambiente

**Files:**
- Modify: `app/.env.example`

**Step 1: Adicionar novas variáveis ao .env.example**

Replace the content of `app/.env.example` with:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
RESEND_API_KEY=your_resend_api_key_here
NOTIFICATION_EMAIL=akumaldo@gmail.com
WHATSAPP_NUMBER=5511973582931
```

**Step 2: Adicionar variáveis reais ao .env.local**

Ensure `app/.env.local` has the real values (user must provide RESEND_API_KEY).

**Step 3: Commit**

```bash
git add app/.env.example
git commit -m "chore: add Resend, notification email, and WhatsApp env vars"
```

---

### Task 3: Criar Edge Function `/api/send-email`

**Files:**
- Create: `api/send-email.ts`

**Step 1: Criar o arquivo `api/send-email.ts`**

```typescript
export const config = {
  runtime: 'edge',
};

interface LeadPayload {
  nome: string;
  email: string;
  empresa: string;
  area: string;
  maturidade: string;
  resumo: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'akumaldo@gmail.com';

  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let lead: LeadPayload;
  try {
    lead = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!lead.nome || !lead.email) {
    return new Response(JSON.stringify({ error: 'Missing required fields: nome, email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a1a; padding: 24px; border-radius: 12px; border: 1px solid #C8A45E;">
        <h1 style="color: #C8A45E; margin: 0 0 20px 0; font-size: 22px;">Novo Lead AIPF</h1>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #999; padding: 8px 0; width: 120px; vertical-align: top;">Nome:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.nome}</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Email:</td>
            <td style="color: #f2ede6; padding: 8px 0;"><a href="mailto:${lead.email}" style="color: #C8A45E;">${lead.email}</a></td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Empresa:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.empresa || 'Não informado'}</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Área:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.area || 'Não informado'}</td>
          </tr>
          <tr>
            <td style="color: #999; padding: 8px 0; vertical-align: top;">Maturidade:</td>
            <td style="color: #f2ede6; padding: 8px 0;">${lead.maturidade || 'Não informado'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #333;">
          <h2 style="color: #C8A45E; font-size: 16px; margin: 0 0 8px 0;">Resumo da Conversa</h2>
          <p style="color: #f2ede6; line-height: 1.6; margin: 0;">${lead.resumo || 'Sem resumo disponível'}</p>
        </div>

        <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #333; color: #666; font-size: 12px;">
          Recebido em ${timestamp}
        </div>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AIPF <onboarding@resend.dev>',
        to: [notificationEmail],
        subject: `Novo Lead AIPF — ${lead.nome}${lead.empresa ? ` (${lead.empresa})` : ''}`,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return new Response(JSON.stringify({ error: 'Failed to send email', details: errorData }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

**Step 2: Commit**

```bash
git add api/send-email.ts
git commit -m "feat: add send-email Edge Function using Resend API"
```

---

### Task 4: Atualizar system prompt do bot

**Files:**
- Modify: `api/chat.ts:5-69` (SYSTEM_PROMPT)

**Step 1: Adicionar instruções de JSON de lead + WhatsApp ao system prompt**

Append the following to the end of the SYSTEM_PROMPT (before the closing backtick on line 69), after the existing rules:

```
WHATSAPP:
- Se o visitante pedir para falar com alguém, demonstrar urgência, ou preferir contato direto, ofereça o link do WhatsApp: https://wa.me/5511973582931?text=Olá! Vim pelo site da AIPF e gostaria de conversar.
- Use uma frase natural como: "Claro! Se preferir, pode falar direto com nosso time pelo WhatsApp: https://wa.me/5511973582931?text=Olá! Vim pelo site da AIPF e gostaria de conversar."
- Ao final da qualificação, depois de coletar os dados, também ofereça o WhatsApp como alternativa

CAPTURA DE LEAD (CRÍTICO — siga exatamente):
Quando o visitante fornecer nome e e-mail (etapa 6 do fluxo de qualificação), você DEVE incluir no final da sua resposta um bloco JSON oculto no seguinte formato exato:

<!--LEAD_DATA:{"nome":"Nome do Lead","email":"email@exemplo.com","empresa":"Nome da Empresa","area":"Área identificada","maturidade":"Estágio identificado","resumo":"Resumo em 2-3 frases do que foi discutido, incluindo área de interesse, desafio principal e insight oferecido"}:LEAD_DATA-->

Regras do bloco LEAD_DATA:
- Inclua APENAS UMA VEZ, na resposta em que o visitante confirma nome e e-mail
- O resumo deve ser objetivo e útil para a equipe comercial entender o contexto
- Após o bloco JSON, continue a mensagem normalmente agradecendo e mencionando que a equipe retornará em até 24h
- Também ofereça o WhatsApp: "Se preferir, pode falar direto com nosso time pelo WhatsApp: https://wa.me/5511973582931?text=Olá! Vim pelo site da AIPF e gostaria de conversar."
```

**Step 2: Commit**

```bash
git add api/chat.ts
git commit -m "feat: update system prompt with lead JSON capture and WhatsApp instructions"
```

---

### Task 5: Atualizar ChatWindow para detectar lead data e enviar email

**Files:**
- Modify: `app/src/components/chat/ChatWindow.tsx`

**Step 1: Adicionar função de extração de lead data e envio de email**

Add after the `AREA_REPLIES` constant (line 27), before the component function:

```typescript
const LEAD_DATA_REGEX = /<!--LEAD_DATA:(.*?):LEAD_DATA-->/s;

function extractLeadData(content: string): { leadData: Record<string, string> | null; cleanContent: string } {
  const match = content.match(LEAD_DATA_REGEX);
  if (!match) return { leadData: null, cleanContent: content };

  try {
    const leadData = JSON.parse(match[1]);
    const cleanContent = content.replace(LEAD_DATA_REGEX, '').trim();
    return { leadData, cleanContent };
  } catch {
    return { leadData: null, cleanContent: content };
  }
}

async function sendLeadEmail(leadData: Record<string, string>) {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
  } catch {
    // Silent fail — email sending should not disrupt user experience
  }
}
```

**Step 2: Adicionar state para rastrear se email já foi enviado**

Inside the component, after existing useState declarations (around line 34), add:

```typescript
const [emailSent, setEmailSent] = useState(false);
```

**Step 3: Modificar o streaming loop para detectar lead data**

In the `sendMessage` function, after the streaming while loop ends (after line 121, inside the try block), add logic to check the final assistant message for lead data:

```typescript
      // After streaming completes, check for lead data
      const { leadData, cleanContent } = extractLeadData(assistantContent);
      if (leadData && !emailSent) {
        setEmailSent(true);
        sendLeadEmail(leadData);
        // Update message to show clean content (without the hidden JSON)
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: cleanContent,
          };
          return updated;
        });
      }
```

**Step 4: Commit**

```bash
git add app/src/components/chat/ChatWindow.tsx
git commit -m "feat: detect lead data in bot response and send email notification"
```

---

### Task 6: Atualizar dev-server para suportar /api/send-email

**Files:**
- Modify: `app/dev-server.js`
- Modify: `app/vite.config.ts`

**Step 1: Adicionar rota /api/send-email no dev-server.js**

In `dev-server.js`, add a new route handler for `/api/send-email` inside the createServer callback. After the existing `/api/chat` handler (line 101, before the `else` block):

```javascript
  } else if (req.method === 'POST' && req.url === '/api/send-email') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const leadData = JSON.parse(body);
        const resendApiKey = process.env.RESEND_API_KEY;
        const notificationEmail = process.env.NOTIFICATION_EMAIL || 'akumaldo@gmail.com';

        if (!resendApiKey) {
          console.log('[Dev] Email would be sent (RESEND_API_KEY not set):');
          console.log(JSON.stringify(leadData, null, 2));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, dev: true }));
          return;
        }

        const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AIPF <onboarding@resend.dev>',
            to: [notificationEmail],
            subject: `Novo Lead AIPF — ${leadData.nome}${leadData.empresa ? ` (${leadData.empresa})` : ''}`,
            html: `<pre>${JSON.stringify(leadData, null, 2)}</pre><p>Recebido em ${timestamp}</p>`,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to send email', details: errText }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
```

**Step 2: Adicionar proxy para /api/send-email no vite.config.ts**

In `app/vite.config.ts`, add the new proxy route alongside the existing one:

```typescript
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/send-email': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
```

**Step 3: Commit**

```bash
git add app/dev-server.js app/vite.config.ts
git commit -m "feat: add send-email route to dev server and vite proxy"
```

---

### Task 7: Garantir que links são clicáveis no ChatWindow

**Files:**
- Modify: `app/src/components/chat/ChatWindow.tsx`

**Step 1: Verificar se links são renderizados como clicáveis**

The current ChatWindow renders message content as plain text inside a `<div>` with `whitespace-pre-wrap`. Links from the bot (wa.me URLs) won't be clickable.

Add a helper function to render text with clickable links. Add before the component function:

```typescript
function renderMessageContent(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      // Reset regex lastIndex since we're reusing it
      urlRegex.lastIndex = 0;
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-2 hover:text-gold-light transition-colors break-all"
        >
          {part.includes('wa.me') ? 'Falar pelo WhatsApp' : part}
        </a>
      );
    }
    return part;
  });
}
```

**Step 2: Usar a função no render de mensagens**

Replace the plain `{msg.content}` in the message rendering (around line 194) with:

```tsx
{renderMessageContent(msg.content)}
```

**Step 3: Commit**

```bash
git add app/src/components/chat/ChatWindow.tsx
git commit -m "feat: render URLs as clickable links in chat messages, with WhatsApp label"
```

---

### Task 8: Teste manual end-to-end

**Step 1: Iniciar o dev server**

Run: `cd /Users/brunolunardi/Downloads/Dev_Projects/AINOVA/app && npm run dev:api`

**Step 2: Iniciar o Vite**

Run (em outro terminal): `cd /Users/brunolunardi/Downloads/Dev_Projects/AINOVA/app && npm run dev`

**Step 3: Testar o fluxo completo**

1. Abrir http://localhost:5173
2. Clicar no chat bubble
3. Seguir o fluxo de qualificação completo (área → maturidade → desafio → insight)
4. Fornecer nome e email quando solicitado
5. Verificar no terminal do dev-server que o lead data foi logado (se sem RESEND_API_KEY)
6. Verificar que o link do WhatsApp aparece clicável
7. Verificar que o JSON oculto NÃO aparece na mensagem visível

**Step 4: Testar WhatsApp mid-conversation**

1. Iniciar nova conversa
2. Digitar "quero falar com alguém" ou "prefiro conversar direto"
3. Verificar que o bot oferece o link do WhatsApp

**Step 5: Commit final**

```bash
git add -A
git commit -m "feat: complete email notification + WhatsApp contact flow"
```

---

## Notas importantes

- **Resend free tier**: Usa o remetente `onboarding@resend.dev` enquanto não verificar um domínio próprio. Funciona para receber emails em `akumaldo@gmail.com` sem problemas.
- **Segurança**: O `/api/send-email` roda server-side, a API key do Resend nunca é exposta no frontend.
- **Fallback**: Se o email falhar, a experiência do cliente não é afetada — o envio é silencioso.
- **WhatsApp number**: Hardcoded no system prompt por ora. Para tornar dinâmico, seria necessário injetar a env var no prompt em runtime (já acontece no Edge Function, mas o dev-server extrai o prompt via regex do arquivo estático).
