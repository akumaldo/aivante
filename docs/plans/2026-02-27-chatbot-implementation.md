# AIPF Chat Assistant Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a floating chatbot to the AIPF website that qualifies leads through a hybrid guided/free-form conversation, powered by OpenRouter with the AIPF framework as its knowledge base.

**Architecture:** React chat component (floating bubble → chat window) calls a Vercel Edge Function that proxies requests to OpenRouter's `arcee-ai/trinity-large-preview:free` model. The system prompt embeds the full AIPF knowledge base. Responses are streamed via SSE for real-time UX.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Vercel Edge Functions, OpenRouter API (OpenAI-compatible), Server-Sent Events (SSE)

---

### Task 1: Create the Vercel API route for OpenRouter proxy

**Files:**
- Create: `app/api/chat/route.ts`

**Step 1: Create the api directory**

Run: `mkdir -p /Users/brunolunardi/Downloads/Dev_Projects/AINOVA/app/api/chat`

**Step 2: Write the Edge Function**

Create `app/api/chat/route.ts`:

```typescript
export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `Você é o Assistente AIPF, um consultor especializado do AI Performance Framework.

Sua função é guiar visitantes do site da AIPF em uma conversa que:
1. Entenda o contexto e necessidades do visitante
2. Ofereça insights relevantes baseados no framework AIPF
3. Qualifique o lead coletando informações de contato

CONHECIMENTO BASE — AIPF (AI Performance Framework):

A AIPF oferece um processo estruturado em 3 fases para implementação de IA corporativa:

FASE 1 - ENTENDIMENTO: Mapeamento de processos, identificação do caso de uso prioritário, desenho de arquitetura, definição de métricas de sucesso. Para qualquer estágio de maturidade.

FASE 2 - PILOTO (6 semanas): Construção do primeiro workflow em produção com Trust Architecture, Human-in-the-Loop, integração com sistemas existentes (ERP, CRM, SAP), otimização de Token Economics. Entregáveis: workflow em produção, painel de observabilidade, treinamento da equipe.

GATE - AI PERFORMANCE FRAMEWORK: Aplicado após o piloto, mede resultados nos 5 pilares e gera scorecard para decisão de escalar — com dados, não opinião.

FASE 3 - ESCALA: Expansão para novos processos com roteamento multi-modelo, governança em escala, otimização contínua.

OS 5 PILARES DO FRAMEWORK:
1. Intelligence Throughput (Vazão de Inteligência) — Capacidade de converter agentes em trabalho útil concluído. Métricas: tarefas concluídas/workflow, taxa de aceitação em primeira passada, retrabalho por agente.
2. Token ROI (Custo por Resultado) — Eficiência econômica: custo por resultado aceito, mix de modelos, custo de retrabalho. Roteamento inteligente: modelos leves para triagem, premium para complexidade.
3. Value Conversion Rate (Taxa de Conversão em Valor) — Taxa de conversão entre consumo de IA e impacto econômico real. Métricas: % saídas utilizadas, redução de ciclo, receita incremental.
4. Operational Reliability (Confiabilidade Operacional) — Qualidade em produção: uptime, latência p50/p95/p99, fallback rate, MTTR.
5. Governance & Compliance (Governança) — Rastreabilidade, auditoria, gestão de risco, aderência regulatória (LGPD).

TRUST ARCHITECTURE (4 pilares de orquestração):
- Decomposição de Domínio: quebrar processos em System Prompts precisos
- Trust Architecture & HITL: gates de aprovação humana em fluxos críticos
- Token Economics: roteamento por complexidade (modelos baratos filtram, premium raciocinam)
- Evals & Observabilidade: telemetria contínua em produção

CASOS DE USO: Marketing & Conteúdo, Legal & Contratos, Operações & Backoffice (SAP/ERP), Atendimento Técnico N2, Comercial & Propostas, Compliance & Regulatório.

DADOS DO MERCADO BRASILEIRO:
- 78% das empresas planejam investir mais em IA em 2025
- Apenas 39% viram impacto real no lucro
- Custo de LLMs caiu 95% desde 2022
- ROI de 100-200% com automações pontuais bem orquestradas
- Break-even de pilotos focados: 1 a 3 meses

REGRAS DE COMPORTAMENTO:
- Sempre responda em português brasileiro
- Seja profissional, direto e empático
- Quando o visitante fizer perguntas, responda com base no conhecimento AIPF
- Após responder, retorne gentilmente ao fluxo de qualificação
- NÃO invente dados ou estatísticas além dos fornecidos
- Para perguntas muito específicas ou técnicas, sugira agendar uma conversa exploratória
- Mantenha respostas concisas (2-4 frases para perguntas, 1-2 frases para transições)

FLUXO DE QUALIFICAÇÃO:
Siga este fluxo, mas permita desvios para perguntas do visitante:

1. Saudação: Apresente-se brevemente e pergunte sobre a área de atuação
2. Área: Entenda em qual área IA teria maior impacto (Operações, Atendimento, Comercial, Jurídico, Financeiro, Tecnologia)
3. Maturidade: Descubra o estágio atual com IA (Explorando, Pilotos, Produção, Escala)
4. Desafio: Identifique o principal desafio (Custo, Confiabilidade, Governança, ROI, Velocidade, Integração)
5. Insight: Com base nas respostas, ofereça um insight personalizado usando o framework AIPF
6. Contato: Sugira que o visitante deixe nome e email para receber uma análise personalizada ou agendar uma conversa

Quando o visitante fornecer dados de contato (nome e email), responda agradecendo e informando que a equipe entrará em contato em até 24h.

FORMATO DAS RESPOSTAS:
- Use texto simples, sem markdown
- Não use asteriscos, hashtags ou formatação especial
- Quebre em parágrafos curtos quando necessário`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response('Server configuration error', { status: 500 });
  }

  const { messages } = await req.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://aipf.com.br',
      'X-Title': 'AIPF Chat Assistant',
    },
    body: JSON.stringify({
      model: 'arcee-ai/trinity-large-preview:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(JSON.stringify({ error: 'Failed to get response' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**Step 3: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "feat: add Vercel Edge Function for OpenRouter chat proxy"
```

---

### Task 2: Create the ChatWindow component

**Files:**
- Create: `app/src/components/chat/ChatWindow.tsx`

**Step 1: Create the chat directory**

Run: `mkdir -p /Users/brunolunardi/Downloads/Dev_Projects/AINOVA/app/src/components/chat`

**Step 2: Write ChatWindow component**

Create `app/src/components/chat/ChatWindow.tsx`:

```tsx
import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, MessageCircle, ArrowDown } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface QuickReply {
  label: string;
  value: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content:
    'Olá! Sou o assistente da AIPF. Posso te ajudar a entender como IA estruturada pode gerar resultados reais no seu negócio.\n\nEm qual área da sua empresa IA teria maior impacto?',
};

const AREA_REPLIES: QuickReply[] = [
  { label: 'Operações', value: 'Operações' },
  { label: 'Atendimento', value: 'Atendimento' },
  { label: 'Comercial', value: 'Comercial' },
  { label: 'Jurídico', value: 'Jurídico / Compliance' },
  { label: 'Financeiro', value: 'Financeiro / Backoffice' },
  { label: 'Tecnologia', value: 'Tecnologia / Dados' },
];

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setShowQuickReplies(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let assistantContent = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Desculpe, tive um problema ao processar sua mensagem. Tente novamente ou entre em contato pelo email contato@aipf.com.br.',
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.value);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] flex flex-col rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/40 animate-slide-up">
      {/* Backdrop blur background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/90" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-violet-500" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">Assistente AIPF</span>
            <span className="text-xs text-slate-400 block">AI Performance Framework</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Fechar chat"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-cyan-500/20 text-cyan-50 border border-cyan-500/30'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700/50'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Quick replies */}
        {showQuickReplies && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {AREA_REPLIES.map((reply) => (
              <button
                key={reply.value}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom indicator */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 p-1.5 rounded-full bg-slate-800 border border-slate-700 shadow-lg z-10"
        >
          <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 px-3 py-2.5 border-t border-slate-700/50"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Enviar mensagem"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/src/components/chat/ChatWindow.tsx
git commit -m "feat: add ChatWindow component with streaming and quick replies"
```

---

### Task 3: Create the ChatBubble component

**Files:**
- Create: `app/src/components/chat/ChatBubble.tsx`

**Step 1: Write ChatBubble component**

Create `app/src/components/chat/ChatBubble.tsx`:

```tsx
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 animate-ping opacity-20" />
        </button>
      )}
    </>
  );
}
```

**Step 2: Commit**

```bash
git add app/src/components/chat/ChatBubble.tsx
git commit -m "feat: add ChatBubble floating button component"
```

---

### Task 4: Add chat animation CSS and integrate ChatBubble into App

**Files:**
- Modify: `app/src/index.css` (add slide-up animation)
- Modify: `app/src/App.tsx` (add ChatBubble import and render)

**Step 1: Add animation to index.css**

Add after the existing `@keyframes gradient-shift` block in `app/src/index.css`:

```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

**Step 2: Add ChatBubble to App.tsx**

In `app/src/App.tsx`, add the import:

```typescript
import ChatBubble from './components/chat/ChatBubble';
```

And render it inside the root div, after `</main>`:

```tsx
      {/* Chat Assistant */}
      <ChatBubble />
```

The resulting App.tsx should look like:

```tsx
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AuroraBackground from './components/background/AuroraBackground';
import RightRailNav from './components/navigation/RightRailNav';
import ChatBubble from './components/chat/ChatBubble';

import Hero from './sections/Hero';
import Services from './sections/Services';
import Problem from './sections/Problem';
import Solution from './sections/Solution';
import Framework from './sections/Framework';
import UseCases from './sections/UseCases';
import DeliveryCycle from './sections/DeliveryCycle';
import Blog from './sections/Blog';
import CTA from './sections/CTA';
import FAQ from './sections/FAQ';
import About from './sections/About';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900">
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-900 focus:rounded-lg focus:font-semibold focus:text-sm"
      >
        Pular para o conteúdo
      </a>

      <AuroraBackground />
      <RightRailNav />

      <main className="relative z-10">
        <Hero />
        <Problem />
        <Services />
        <Solution />
        <Framework />
        <UseCases />
        <Blog />
        <DeliveryCycle />
        <CTA />
        <FAQ />
        <About />
        <Footer />
      </main>

      <ChatBubble />
    </div>
  );
}

export default App;
```

**Step 3: Commit**

```bash
git add app/src/index.css app/src/App.tsx
git commit -m "feat: integrate chat bubble into app with slide-up animation"
```

---

### Task 5: Configure Vercel for the Edge Function

**Files:**
- Create: `vercel.json` (in project root)

**Step 1: Create vercel.json**

Create `vercel.json` in the project root:

```json
{
  "buildCommand": "cd app && npm run build",
  "outputDirectory": "app/dist",
  "installCommand": "cd app && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/chat",
      "destination": "/api/chat"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add vercel.json
git commit -m "feat: add Vercel config with API route rewrite"
```

---

### Task 6: Local development setup

**Files:**
- Create: `app/.env.example`
- Modify: `.gitignore` (ensure .env is ignored)

**Step 1: Create .env.example**

Create `app/.env.example`:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Step 2: Verify .gitignore includes .env**

Check and add to `.gitignore` if needed:

```
.env
.env.local
.env*.local
```

**Step 3: Commit**

```bash
git add app/.env.example .gitignore
git commit -m "feat: add env example and ensure .env is gitignored"
```

---

### Task 7: Add Vite proxy for local development

**Files:**
- Modify: `app/vite.config.ts`

**Step 1: Update vite.config.ts to proxy /api/chat in dev mode**

Since the Edge Function runs on Vercel, for local development we need a dev proxy. Update `app/vite.config.ts`:

```typescript
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://openrouter.ai/api/v1/chat/completions',
        changeOrigin: true,
        rewrite: () => '',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // This is a dev-only proxy; in production the Edge Function handles this
            // For local dev, you need OPENROUTER_API_KEY in app/.env.local
            const apiKey = process.env.OPENROUTER_API_KEY || '';
            proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
            proxyReq.setHeader('HTTP-Referer', 'http://localhost:5173');
            proxyReq.setHeader('X-Title', 'AIPF Chat Assistant (Dev)');
          });
        },
      },
    },
  },
});
```

Actually, the dev proxy approach for streaming with request body rewriting is complex. A simpler approach: create a small dev server script OR use `vercel dev` locally.

**Simpler alternative — use vercel dev:**

Add a script to package.json:

In `app/package.json`, add to scripts:
```json
"dev:vercel": "cd .. && vercel dev"
```

But this requires Vercel CLI. The simplest approach for local dev is to make the ChatWindow fetch URL configurable and point directly to OpenRouter during dev. However, this exposes the key in the browser.

**Best practical approach:** Keep the Edge Function as the production path. For local development, create a simple dev server:

Create `app/dev-server.js`:

```javascript
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
try {
  const envFile = readFileSync(resolve(__dirname, '.env.local'), 'utf-8');
  envFile.split('\n').forEach((line) => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });
} catch {}

const PORT = 3001;

createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const { messages } = JSON.parse(body);
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY not set in .env.local' }));
          return;
        }

        // Read system prompt from the Edge Function file
        const SYSTEM_PROMPT = `Você é o Assistente AIPF, um consultor especializado do AI Performance Framework. Sua função é guiar visitantes do site da AIPF em uma conversa que entenda o contexto e necessidades do visitante, ofereça insights relevantes baseados no framework AIPF, e qualifique o lead coletando informações de contato. Sempre responda em português brasileiro. Seja profissional, direto e empático. Mantenha respostas concisas.`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'AIPF Chat Assistant (Dev)',
          },
          body: JSON.stringify({
            model: 'arcee-ai/trinity-large-preview:free',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
            stream: true,
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        });

        const reader = response.body.getReader();
        const pump = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(value);
          return pump();
        };
        await pump();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Chat API dev server running on http://localhost:${PORT}`);
});
```

Then update `app/vite.config.ts` to proxy to this dev server:

```typescript
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

And add to `app/package.json` scripts:

```json
"dev:api": "node dev-server.js",
"dev:full": "concurrently \"npm run dev\" \"npm run dev:api\""
```

**Step 2: Commit**

```bash
git add app/dev-server.js app/vite.config.ts app/package.json
git commit -m "feat: add local dev server for chat API proxy"
```

---

### Task 8: Test end-to-end locally

**Step 1: Create .env.local with real API key**

Run: `cp app/.env.example app/.env.local` and add your OpenRouter API key.

**Step 2: Start the dev API server**

Run: `cd app && node dev-server.js`

**Step 3: Start Vite dev server (in another terminal)**

Run: `cd app && npm run dev`

**Step 4: Verify**

1. Open `http://localhost:5173`
2. Click the floating chat bubble (bottom-right)
3. Chat window should open with the greeting message
4. Click a quick reply chip or type a message
5. Verify streaming response appears word-by-word
6. Verify conversation flows naturally

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found during local testing"
```

---

### Task 9: Final commit and deployment notes

**Step 1: Create a single final commit if any cleanup is needed**

**Step 2: Deployment checklist**

To deploy on Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `OPENROUTER_API_KEY` = your OpenRouter API key
4. Deploy

The Edge Function at `api/chat/route.ts` will be automatically detected and deployed as a serverless function.
