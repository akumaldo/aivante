# Website Restructure: Reduce Framework Exposure + Add FrontierOps

**Date:** 2026-03-02
**Goal:** Restructure the AIPF website to show WHAT we do without revealing HOW. Add FrontierOps as an operational layer. Strengthen Insights section.
**Approach:** Reorganization by Narrative (Approach B)

## Guiding Principle

> "O que fazemos sim, como fazemos? Nao."

## 1. New Site Structure (12 sections -> 8)

| # | Section | ID | Content |
|---|---------|-----|---------|
| 1 | Hero | `hero` | Updated copy referencing FrontierOps |
| 2 | Desafio | `problem` | Kept as-is (shows problem, not solution) |
| 3 | Solucao | `solution` | **MERGED**: Como Funciona + Orquestracao + Framework + FrontierOps |
| 4 | Casos | `use-cases` | Kept as-is (social proof) |
| 5 | Insights | `insights` | Expanded with 4 new FrontierOps articles |
| 6 | Contato | `cta` | Kept with chatbot |
| 7 | FAQ | `faq` | Simplified — remove technical details |
| 8 | Sobre | `about` | Kept as-is |

**Removed sections:**
- `DeliveryCycle` (6-week timeline) — absorbed into Solution
- `Solution` (Trust Architecture) — merged into new Solution
- `Services` (Como Funciona 3 phases) — merged into new Solution

**Navigation:**
- Desktop: Inicio, Desafio, Solucao, Casos, Insights, Contato, FAQ, Sobre (8)
- Mobile: Inicio, Solucao, Insights, Contato, Sobre (5)

## 2. New "Solucao" Section — Internal Structure

### 2.1 Opening
- Title: "Como Transformamos IA em Resultado"
- 2-3 sentences of positioning
- Message: "Nao vendemos tecnologia. Operamos IA como infraestrutura de performance."

### 2.2 The Journey (replaces Como Funciona + DeliveryCycle)
3 simple cards, NO deliverables or sub-steps:

| Phase | Title | Copy |
|-------|-------|------|
| 01 | Entendimento | "Mapeamos seus processos, identificamos onde IA gera resultado real e desenhamos a arquitetura." |
| 02 | Piloto | "Colocamos o primeiro workflow em producao com controle, validacao e metricas desde o dia 1." |
| 03 | Escala | "Expandimos para novos processos com governanca, otimizacao de custos e monitoramento continuo." |

Does NOT mention: Trust Architecture, HITL, Token Economics, System Prompts, specific timelines.

### 2.3 AIPF Framework
- Title: "Medimos o que importa"
- Short paragraph: "Nosso AI Performance Framework avalia resultados em 5 dimensoes — nao adocao, nao volume de uso, mas impacto real no negocio."
- 5 compact cards (name + 1 sentence only):

| Pillar | Sentence |
|--------|----------|
| Vazao de Inteligencia | Quanto trabalho util a IA esta realmente completando |
| Custo por Resultado | Eficiencia economica real — nao custo por token, mas por entrega |
| Conversao em Valor | Quanto do que a IA produz se converte em impacto no negocio |
| Confiabilidade Operacional | A operacao com IA e estavel e previsivel no dia a dia |
| Governanca e Compliance | Rastreabilidade, auditoria e conformidade para escalar com seguranca |

Does NOT include: specific metrics, examples by segment, anti-patterns, diagnostic questions.

### 2.4 FrontierOps
- Title: "Frontier Operations — Operando na Fronteira da IA"
- Positioning: "Modelos de IA evoluem a cada trimestre. O que funcionava ontem pode ser insuficiente amanha. FrontierOps e nossa pratica de manter sua operacao calibrada com o que ha de mais avancado — continuamente."
- 3 compact concept cards:

| Concept | PT-BR Name | Sentence |
|---------|-----------|----------|
| Calibration | Calibracao | "Mantemos um mapa atualizado do que a IA pode e nao pode fazer no seu contexto — e recalibramos a cada evolucao." |
| Architecture | Arquitetura de Fluxos | "Desenhamos workflows onde humanos e agentes colaboram sem atrito — cada um no que faz melhor." |
| Directives | Gestao de Atencao | "Direcionamos a atencao humana para onde ela realmente importa — revisao profunda onde ha risco, automacao onde ha confianca." |

Does NOT include: Failure Models details, Surprise Logs, Sunset Skills, Tiered Attention Allocation, Modular Decomposition, etc.

## 3. Insights — 4 New Articles

Added to existing 6 articles, tagged as "FrontierOps":

**7. "O que separa quem usa IA de quem opera com IA"**
- Concept: Difference between using a tool vs operating a system
- AIPF Insight: "IA nao e um projeto com comeco e fim — e uma operacao continua que exige calibracao constante."

**8. "Failure Models: por que 'a IA pode errar' nao e um modelo de risco"**
- Concept: Difference between generic skepticism and a precise map of where/how AI fails in your specific context
- AIPF Insight: "Um operador de fronteira sabe exatamente onde confiar e onde verificar — essa precisao e o que gera velocidade com seguranca."

**9. "A cada atualizacao de modelo, seus workflows precisam ser recalibrados"**
- Concept: Quarterly model updates make old validations obsolete
- AIPF Insight: "Calibracao nao e um evento — e uma pratica. Quem nao recalibra esta operando com um mapa desatualizado."

**10. "O desafio nao e a IA produzir mais — e saber onde colocar atencao humana"**
- Concept: With 10x more output, the bottleneck is human attention
- AIPF Insight: "Sucesso nao se mede por horas trabalhadas, mas pela razao entre resultado entregue e atencao investida."

## 4. Chatbot — System Prompt Rewrite

### Knowledge base changes:
- **ADD**: Market data from "IA no Brasil" document (public stats: 88% adoption/39% impact gap, 75% SME optimism, R$25k savings, 84% hiring difficulty, 95% cost reduction, WhatsApp 80% resolution, break-even 1-3 months, investment tiers, LGPD/Shadow AI context)
- **ADD**: FrontierOps concepts at high level (Calibration, Architecture, Directives — names and 1-sentence descriptions only)
- **KEEP**: 5 pillar names with 1-sentence descriptions
- **KEEP**: Journey: Entendimento -> Piloto -> Escala
- **KEEP**: Bruno Lunardi bio + contact info
- **KEEP**: 6-step qualification flow
- **REMOVE**: All specific metrics for each pillar
- **REMOVE**: Anti-patterns and detailed examples
- **REMOVE**: Trust Architecture, HITL, Token Economics details
- **REMOVE**: Deliverables per phase
- **REMOVE**: 6-week cycle with per-step details

### New behavioral rule:
"Use market data from the knowledge base to contextualize conversations. When the visitor asks about methodological details, respond with high-level concepts and suggest scheduling an exploratory conversation. Never invent technical details beyond what is in this prompt."

### Architecture: Static system prompt (no RAG). Same mechanism as today.

## 5. FAQ — Simplified

### Keep (simplified):
1. "Como funciona o processo?" -> "Entendimento -> Piloto -> Escala. Na conversa inicial mapeamos seu cenario."
2. "Quando o Framework e aplicado?" -> "Apos o piloto, para medir resultados e orientar a decisao de escalar."
3. "Serve para quem nao tem IA?" -> Keep as-is
4. "O que acontece depois do piloto?" -> "Medimos resultados com o Framework e decidimos juntos se e como escalar."
5. "Quais sistemas integram?" -> Keep as-is (commercial info, not methodological)

### Reformulate (remove technical details):
6. "Como garantem que nao alucina?" -> "Usamos uma arquitetura de validacao com gates de aprovacao humana em fluxos criticos."
7. "Como controlam custos?" -> "Otimizamos o custo por resultado usando roteamento inteligente entre modelos."
8. "Quanto tempo leva?" -> "O piloto leva aproximadamente 6 semanas, da arquitetura ao deploy."

## 6. Files Affected

| File | Action |
|------|--------|
| `app/src/App.tsx` | Remove DeliveryCycle, reorder sections |
| `app/src/sections/Services.tsx` | DELETE (merged into new Solution) |
| `app/src/sections/Solution.tsx` | REWRITE as the new merged "Solucao" section |
| `app/src/sections/Framework.tsx` | DELETE (content merged into Solution) |
| `app/src/sections/DeliveryCycle.tsx` | DELETE |
| `app/src/sections/Hero.tsx` | Update copy to reference FrontierOps |
| `app/src/sections/Blog.tsx` | Add 4 new FrontierOps articles |
| `app/src/sections/FAQ.tsx` | Simplify answers |
| `app/src/components/navigation/RightRailNav.tsx` | Update nav items |
| `api/chat.ts` | Rewrite system prompt |
