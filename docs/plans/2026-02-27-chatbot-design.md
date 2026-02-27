# AIPF Chat Assistant - Design Document

## Summary

Add a floating chatbot to the AIPF website that qualifies leads through a hybrid guided/free-form conversation, powered by OpenRouter (arcee-ai/trinity-large-preview:free) with the AIPF framework as its knowledge base.

## Architecture

```
Browser (React)  →  Vercel Edge Function (/api/chat)  →  OpenRouter API
                    (holds API key, injects system prompt)
```

- **Frontend:** Custom React chat component matching glass-morphism design
- **Backend:** Vercel Edge Function as secure proxy (API key server-side)
- **Model:** arcee-ai/trinity-large-preview:free via OpenRouter
- **Streaming:** SSE from OpenRouter → Edge Function → Browser

## Components

### 1. ChatBubble (UI)
- Floating button, bottom-right corner (fixed position)
- Cyan gradient icon, glass background
- Click toggles ChatWindow open/closed
- Subtle pulse animation when closed to draw attention
- Hidden on mobile when keyboard is open

### 2. ChatWindow (UI)
- 380px wide x 520px tall (desktop), full-width on mobile
- Glass-morphism: `backdrop-blur`, `bg-slate-900/90`, `border-slate-700/50`
- Header: "Assistente AIPF" + close button, cyan-violet gradient accent
- Message list: bot left (slate-800 bg), user right (cyan bg)
- Quick-reply chips below bot messages for guided questions
- Text input + send button at bottom
- Typing indicator (animated dots) while awaiting response
- Slide-up animation on open/close

### 3. /api/chat (Vercel Edge Function)
- Accepts POST with `{ messages: [{role, content}] }`
- Prepends system prompt with AIPF knowledge base
- Forwards to OpenRouter `/chat/completions` with streaming
- Streams response back to client via SSE
- API key stored in Vercel environment variable `OPENROUTER_API_KEY`

## Conversation Flow (Hybrid)

Guided qualification flow with free-form allowed at any point:

1. **Greeting** - Introduces bot, asks about business area
2. **Business area** - Quick-reply buttons: Operations, Customer Service, Sales, Legal, Finance, Tech
3. **AI maturity** - Exploring, Pilots, Production, Scale
4. **Main challenge** - Cost, Reliability, Governance, ROI, Speed
5. **Insight** - LLM provides tailored AIPF-based insight using answers
6. **Lead capture** - Asks for name, email, company to send personalized analysis

If user types a free-form question at any step, bot answers using AIPF knowledge, then gently returns to the next guided question.

## System Prompt Strategy

- Persona: AIPF consultant assistant (knowledgeable, professional, friendly)
- Knowledge: Full AIPF-Documento-Completo.txt content embedded
- Language: Always Brazilian Portuguese
- Flow: Follow guided qualification, but answer free-form questions when asked
- Guardrails: Stay on topic, don't invent data, suggest scheduling a call for complex needs
- Lead capture: Naturally transition to collecting contact info after providing value

## Tech Decisions

- **No external chat library** - Custom component for full design control
- **Vercel Edge Function** - Secure API key, low latency, same deployment
- **Streaming** - Better UX than waiting for full response
- **Local state only** - No persistence, conversation resets on page reload
- **No message history storage** - Privacy-friendly, no database needed for MVP
