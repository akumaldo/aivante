# Website Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the AIPF website to hide methodology details, add FrontierOps, expand Insights, and rewrite the chatbot prompt — following the "what we do, not how" principle.

**Architecture:** Single-page React app (Vite + Tailwind + GSAP). Merge 4 sections into 1 new "Solucao" section. Expand Blog with 4 articles. Rewrite chatbot system prompt with market data. No backend changes beyond the prompt.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 3, GSAP + ScrollTrigger, Framer Motion, Lucide React icons, Vercel Edge Functions (chatbot)

**Design doc:** `docs/plans/2026-03-02-website-restructure-design.md`

---

### Task 1: Update Navigation (RightRailNav)

**Files:**
- Modify: `app/src/components/navigation/RightRailNav.tsx`

**Step 1: Update navItems array (line 10-21)**

Replace the current `navItems` array with the new 8-item structure:

```tsx
const navItems: NavItem[] = [
  { id: 'hero', label: 'Início' },
  { id: 'problem', label: 'Desafio' },
  { id: 'solution', label: 'Solução' },
  { id: 'use-cases', label: 'Casos' },
  { id: 'insights', label: 'Insights' },
  { id: 'cta', label: 'Contato' },
  { id: 'faq', label: 'FAQ' },
  { id: 'about', label: 'Sobre' },
];
```

**Step 2: Update mobileNavItems (line 23)**

Replace with 5-item mobile nav:

```tsx
const mobileNavItems = ['hero', 'solution', 'insights', 'cta', 'about'];
```

**Step 3: Verify the app builds**

Run: `cd app && npm run build`
Expected: Build succeeds (navigation updates don't depend on removed sections yet)

**Step 4: Commit**

```bash
git add app/src/components/navigation/RightRailNav.tsx
git commit -m "feat: update navigation for restructured site (8 desktop, 5 mobile items)"
```

---

### Task 2: Rewrite Solution.tsx as the New Merged "Solucao" Section

This is the largest task — it replaces Services.tsx + Solution.tsx + Framework.tsx + DeliveryCycle.tsx with one unified section.

**Files:**
- Rewrite: `app/src/sections/Solution.tsx` (currently 149 lines, will become ~350-400 lines)

**Step 1: Write the new Solution.tsx**

Replace the entire contents of `app/src/sections/Solution.tsx` with:

```tsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Search,
  Rocket,
  TrendingUp,
  Zap,
  Coins,
  BarChart3,
  Server,
  ShieldCheck,
  Compass,
  GitBranch,
  Focus,
} from 'lucide-react';

const journeyPhases = [
  {
    number: '01',
    title: 'Entendimento',
    description:
      'Mapeamos seus processos, identificamos onde IA gera resultado real e desenhamos a arquitetura.',
    icon: Search,
    color: 'cyan',
  },
  {
    number: '02',
    title: 'Piloto',
    description:
      'Colocamos o primeiro workflow em produção com controle, validação e métricas desde o dia 1.',
    icon: Rocket,
    color: 'violet',
  },
  {
    number: '03',
    title: 'Escala',
    description:
      'Expandimos para novos processos com governança, otimização de custos e monitoramento contínuo.',
    icon: TrendingUp,
    color: 'emerald',
  },
];

const frameworkPillars = [
  {
    icon: Zap,
    title: 'Vazão de Inteligência',
    description: 'Quanto trabalho útil a IA está realmente completando.',
    color: 'cyan',
  },
  {
    icon: Coins,
    title: 'Custo por Resultado',
    description:
      'Eficiência econômica real — não custo por token, mas por entrega.',
    color: 'violet',
  },
  {
    icon: BarChart3,
    title: 'Conversão em Valor',
    description:
      'Quanto do que a IA produz se converte em impacto no negócio.',
    color: 'blue',
  },
  {
    icon: Server,
    title: 'Confiabilidade Operacional',
    description:
      'A operação com IA é estável e previsível no dia a dia.',
    color: 'emerald',
  },
  {
    icon: ShieldCheck,
    title: 'Governança e Compliance',
    description:
      'Rastreabilidade, auditoria e conformidade para escalar com segurança.',
    color: 'amber',
  },
];

const frontierOpsConcepts = [
  {
    icon: Compass,
    title: 'Calibração',
    description:
      'Mantemos um mapa atualizado do que a IA pode e não pode fazer no seu contexto — e recalibramos a cada evolução.',
    color: 'cyan',
  },
  {
    icon: GitBranch,
    title: 'Arquitetura de Fluxos',
    description:
      'Desenhamos workflows onde humanos e agentes colaboram sem atrito — cada um no que faz melhor.',
    color: 'violet',
  },
  {
    icon: Focus,
    title: 'Gestão de Atenção',
    description:
      'Direcionamos a atenção humana para onde ela realmente importa — revisão profunda onde há risco, automação onde há confiança.',
    color: 'emerald',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
};

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate sub-sections on scroll
      gsap.utils.toArray<HTMLElement>('.solution-block').forEach((block) => {
        gsap.from(block, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Stagger cards within each sub-section
      gsap.utils
        .toArray<HTMLElement>('.solution-card')
        .forEach((card, i) => {
          gsap.from(card, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          });
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Opening ── */}
        <div className="solution-block text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
            Nossa Abordagem
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Como Transformamos IA em Resultado
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Não vendemos tecnologia. Operamos IA como infraestrutura de
            performance — com processo, medição e calibração contínua.
          </p>
        </div>

        {/* ── Journey: Entendimento → Piloto → Escala ── */}
        <div className="solution-block mb-24">
          <h3 className="text-xl md:text-2xl font-semibold text-white text-center mb-12">
            A Jornada
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {journeyPhases.map((phase) => {
              const colors = colorMap[phase.color];
              const Icon = phase.icon;
              return (
                <div
                  key={phase.number}
                  className={`solution-card glass-card rounded-2xl p-8 border ${colors.border} hover:border-opacity-50 transition-all duration-300`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <span
                        className={`text-xs font-mono ${colors.text} tracking-wider`}
                      >
                        FASE {phase.number}
                      </span>
                      <h4 className="text-lg font-semibold text-white">
                        {phase.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── AIPF Framework: 5 Pillars ── */}
        <div className="solution-block mb-24">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4">
              AI Performance Framework
            </span>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Medimos o que importa
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Nosso AI Performance Framework avalia resultados em 5 dimensões —
              não adoção, não volume de uso, mas impacto real no negócio.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frameworkPillars.map((pillar, idx) => {
              const colors = colorMap[pillar.color];
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className={`solution-card glass-card rounded-xl p-6 border ${colors.border} hover:border-opacity-50 transition-all duration-300`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FrontierOps ── */}
        <div className="solution-block">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              Frontier Operations
            </span>
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Operando na Fronteira da IA
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Modelos de IA evoluem a cada trimestre. O que funcionava ontem pode
              ser insuficiente amanhã. FrontierOps é nossa prática de manter sua
              operação calibrada com o que há de mais avançado — continuamente.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {frontierOpsConcepts.map((concept, idx) => {
              const colors = colorMap[concept.color];
              const Icon = concept.icon;
              return (
                <div
                  key={idx}
                  className={`solution-card glass-card rounded-2xl p-8 border ${colors.border} hover:border-opacity-50 transition-all duration-300`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {concept.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {concept.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Verify the component renders correctly**

Run: `cd app && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/src/sections/Solution.tsx
git commit -m "feat: rewrite Solution section — merge journey, framework pillars, and FrontierOps into one section"
```

---

### Task 3: Update App.tsx — Remove Old Sections, Reorder

**Files:**
- Modify: `app/src/App.tsx` (76 lines)

**Step 1: Update imports (lines 5-20)**

Remove imports for: `Services`, `Framework`, `DeliveryCycle`
Keep all others. The new `Solution` import already exists.

Remove these lines:
```tsx
import Services from './sections/Services';
import Framework from './sections/Framework';
import DeliveryCycle from './sections/DeliveryCycle';
```

**Step 2: Update section render order in JSX (lines 54-67)**

Replace the `<main>` contents with the new order:

```tsx
<main>
  <Hero />
  <Problem />
  <Solution />
  <UseCases />
  <Blog />
  <CTA />
  <FAQ />
  <About />
  <Footer />
</main>
```

This removes `<Services />`, `<Framework />`, and `<DeliveryCycle />` from the render.

**Step 3: Update the accessibility skip link (line 40-45)**

The current skip link targets `#services`. Change it to `#solution`:

```tsx
<a href="#solution" className="sr-only focus:not-sr-only ...">
```

**Step 4: Verify the app builds**

Run: `cd app && npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add app/src/App.tsx
git commit -m "feat: update App.tsx — remove Services/Framework/DeliveryCycle, reorder to new structure"
```

---

### Task 4: Update Hero.tsx — Adjust Copy and References

**Files:**
- Modify: `app/src/sections/Hero.tsx` (157 lines)

**Step 1: Update the subheadline (lines 80-86)**

The current subheadline references "3 fases" and "AI Performance Framework como gate". Simplify to not over-explain:

Replace lines 80-86 with a subheadline that mentions the high-level value without framework details. Example:

```tsx
<h2 ref={subheadlineRef} className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
  Operamos IA como infraestrutura de performance — com processo estruturado,
  medição de resultados e calibração contínua na fronteira.
</h2>
```

**Step 2: Update the body copy (lines 88-95)**

Simplify to not expose the framework structure. Example:

```tsx
<p ref={bodyRef} className="text-base text-slate-400 max-w-xl mx-auto">
  Do entendimento do seu cenário ao primeiro workflow em produção,
  medimos resultado real antes de escalar.
</p>
```

**Step 3: Update "Como funciona" button target (line 113)**

Change `scrollToSection('services')` to `scrollToSection('solution')`:

```tsx
onClick={() => scrollToSection('solution')}
```

**Step 4: Update the framework highlight card (lines 122-147)**

The current card has "AI Performance Framework" detail and links to `#framework`. Simplify to reference the new solution section. Change `scrollToSection('framework')` to `scrollToSection('solution')` and simplify the card text. Remove pillar-specific text, keep it as a brief teaser.

**Step 5: Update the badge text (lines 65-70)**

The badge says "Entendimento → Piloto → Escala" which is fine — keep it.

**Step 6: Verify build**

Run: `cd app && npm run build`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add app/src/sections/Hero.tsx
git commit -m "feat: update Hero copy — simplify messaging, reference FrontierOps, link to new solution section"
```

---

### Task 5: Update Blog.tsx — Add 4 New FrontierOps Articles

**Files:**
- Modify: `app/src/sections/Blog.tsx` (253 lines)

**Step 1: Add new icon imports (line 3)**

Add `Compass` and `Target` to the lucide-react imports (or reuse existing icons):

```tsx
import { ArrowRight, TrendingUp, Shield, Users, DollarSign, Brain, AlertTriangle, Compass, Target, RefreshCw, Eye } from 'lucide-react';
```

**Step 2: Add 4 new articles to the `articles` array (after line 101)**

Add these 4 new article objects before the closing `]`:

```tsx
  {
    id: 'frontierops-operar',
    icon: Compass,
    color: 'emerald' as const,
    tag: 'FrontierOps',
    title: 'O que separa quem usa IA de quem opera com IA',
    lead: 'A diferença entre "usar uma ferramenta" e "operar um sistema" define quem captura valor de verdade. Operadores calibram continuamente — não aprendem uma vez e aplicam para sempre.',
    highlights: [
      'Usar IA é reagir; operar com IA é antecipar e recalibrar',
      'Operadores constroem modelos mentais atualizados das capacidades e limitações',
      'A vantagem competitiva está na prática contínua, não no conhecimento pontual',
    ],
    insight:
      'IA não é um projeto com começo e fim — é uma operação contínua que exige calibração constante.',
  },
  {
    id: 'frontierops-failure',
    icon: Target,
    color: 'amber' as const,
    tag: 'FrontierOps',
    title: 'Failure Models: por que "a IA pode errar" não é um modelo de risco',
    lead: 'Dizer que "a IA pode errar" é tão útil quanto dizer que "o mercado pode cair". Operadores de fronteira constroem mapas precisos de onde, como e quando a IA falha no seu contexto específico.',
    highlights: [
      'Erros modernos da IA são sutis — parecem certos mas não são',
      'Um Failure Model precisa ser específico por domínio, tarefa e modelo',
      'A verificação cirúrgica substitui a revisão total — velocidade com segurança',
    ],
    insight:
      'Um operador de fronteira sabe exatamente onde confiar e onde verificar — essa precisão é o que gera velocidade com segurança.',
  },
  {
    id: 'frontierops-calibracao',
    icon: RefreshCw,
    color: 'cyan' as const,
    tag: 'FrontierOps',
    title: 'A cada atualização de modelo, seus workflows precisam ser recalibrados',
    lead: 'Modelos de IA evoluem trimestralmente. O que você validou em novembro pode ser obsoleto em fevereiro. Sub-calibrar desperdiça energia humana; sobre-calibrar cria riscos invisíveis.',
    highlights: [
      'Capacidades de IA mudam a cada release — o mapa de ontem não serve hoje',
      'Sub-calibração: você ainda faz manualmente o que a IA já domina',
      'Sobre-calibração: você confia na IA em áreas onde ela introduziu novas falhas',
    ],
    insight:
      'Calibração não é um evento — é uma prática. Quem não recalibra está operando com um mapa desatualizado.',
  },
  {
    id: 'frontierops-atencao',
    icon: Eye,
    color: 'violet' as const,
    tag: 'FrontierOps',
    title: 'O desafio não é a IA produzir mais — é saber onde colocar atenção humana',
    lead: 'Com agentes produzindo 10x mais output, o gargalo não é mais a produção — é a atenção humana. Revisar tudo com a mesma profundidade é o sintoma de quem não calibrou.',
    highlights: [
      'A razão output-para-atenção é a nova métrica de produtividade',
      'Atenção humana deve ser alocada por risco, não distribuída uniformemente',
      'Sucesso se mede pelo resultado entregue por unidade de atenção investida',
    ],
    insight:
      'Sucesso não se mede por horas trabalhadas, mas pela razão entre resultado entregue e atenção investida.',
  },
```

**Step 3: Update the `colorMap` to ensure `emerald` has a `dot` key (line 104-109)**

Check that the existing colorMap has entries for all colors used (cyan, violet, emerald, amber). The current map already has these 4 colors — verify `emerald` has `dot` entry.

**Step 4: Update the section id from `blog` to `insights` (line ~155)**

Change `<section id="blog"` to `<section id="insights"` so navigation links correctly.

**Step 5: Verify build**

Run: `cd app && npm run build`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add app/src/sections/Blog.tsx
git commit -m "feat: add 4 FrontierOps insight articles, rename section id to insights"
```

---

### Task 6: Simplify FAQ.tsx

**Files:**
- Modify: `app/src/sections/FAQ.tsx` (117 lines)

**Step 1: Replace the `faqs` data array (lines 10-51)**

Replace with simplified versions:

```tsx
const faqs = [
  {
    question: 'Como funciona o processo?',
    answer:
      'Nossa jornada segue três fases: Entendimento, Piloto e Escala. Na conversa inicial, mapeamos seu cenário e definimos juntos o ponto de entrada — você entra pela fase que faz sentido para o seu momento.',
  },
  {
    question: 'Quando o AI Performance Framework é aplicado?',
    answer:
      'O Framework é aplicado após o piloto, quando a IA já está em produção. Ele mede o resultado real e gera um scorecard que orienta a decisão de escalar — com dados, não com suposições.',
  },
  {
    question: 'Quanto tempo leva para ter um resultado?',
    answer:
      'O piloto leva aproximadamente 6 semanas, da arquitetura ao deploy. O tempo pode variar dependendo da complexidade do processo e das integrações necessárias.',
  },
  {
    question: 'Como vocês garantem a qualidade das respostas da IA?',
    answer:
      'Usamos uma arquitetura de validação com gates de aprovação humana em fluxos críticos. A IA pesquisa, analisa e rascunha, mas o sistema exige verificação antes de avançar.',
  },
  {
    question: 'Como controlam os custos?',
    answer:
      'Otimizamos o custo por resultado — não por token. Usamos roteamento inteligente entre modelos para que cada tarefa use o recurso adequado à sua complexidade.',
  },
  {
    question: 'Quais sistemas vocês integram?',
    answer:
      'Integramos com os principais sistemas corporativos: ERPs (SAP, Oracle), CRMs (Salesforce, HubSpot), plataformas de dados (Snowflake, Databricks), clouds (AWS, Azure, GCP) e ferramentas de produtividade (Slack, Teams, Jira). Cada integração é avaliada durante a fase de entendimento.',
  },
  {
    question: 'Serve para empresas que ainda não têm IA?',
    answer:
      'Sim. O processo foi desenhado para isso. A fase de Entendimento mapeia seu cenário e identifica o melhor caso de uso para começar. Você avalia o resultado concreto antes de decidir qualquer expansão.',
  },
  {
    question: 'O que acontece depois do piloto?',
    answer:
      'Aplicamos o AI Performance Framework para medir os resultados. Com o scorecard em mãos, decidimos juntos se faz sentido escalar para novos processos — sempre baseados em dados reais.',
  },
];
```

**Step 2: Verify build**

Run: `cd app && npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add app/src/sections/FAQ.tsx
git commit -m "feat: simplify FAQ — remove technical details (HITL, Token Economics, Trust Architecture)"
```

---

### Task 7: Rewrite Chatbot System Prompt

**Files:**
- Modify: `api/chat.ts` (lines 5-82: SYSTEM_PROMPT constant)

**Step 1: Replace SYSTEM_PROMPT (lines 5-82)**

Replace the entire `SYSTEM_PROMPT` constant with a new version that includes market data from the "IA no Brasil" document and high-level concepts only:

```typescript
const SYSTEM_PROMPT = `Você é o assistente da AIPF — AI Performance Framework. Seu papel é ajudar visitantes a entenderem o cenário de IA no Brasil, como a AIPF pode ajudar, e guiá-los até uma conversa exploratória com a equipe.

SOBRE A AIPF:
A AIPF oferece engenharia de IA com processo estruturado. Não vendemos tecnologia — operamos IA como infraestrutura de performance.

Nossa jornada tem 3 fases:
- Entendimento: mapeamos processos e identificamos onde IA gera resultado real
- Piloto: primeiro workflow em produção com controle e métricas
- Escala: expansão com governança, otimização e monitoramento contínuo

Medimos resultados com o AI Performance Framework em 5 dimensões:
- Vazão de Inteligência: quanto trabalho útil a IA está completando
- Custo por Resultado: eficiência econômica por entrega, não por token
- Conversão em Valor: quanto do output da IA vira impacto no negócio
- Confiabilidade Operacional: estabilidade e previsibilidade no dia a dia
- Governança e Compliance: rastreabilidade e conformidade para escalar

Praticamos Frontier Operations (FrontierOps) — manter a operação calibrada com o que há de mais avançado:
- Calibração: mapa atualizado do que a IA pode e não pode fazer no contexto do cliente
- Arquitetura de Fluxos: workflows onde humanos e agentes colaboram sem atrito
- Gestão de Atenção: atenção humana direcionada para onde realmente importa

FUNDADOR: Bruno Lunardi
Experiência em gestão de sistemas complexos corporativos (Oil&Gas, SAP, Bancos). Traduz problemas reais de negócio em operações de IA com resultados mensuráveis.
Contato: contato@aipf.com.br

DADOS DE MERCADO (fontes públicas — IBR, Brasscom, Gartner, Adobe, Microsoft, 2024-2026):
- 80% das empresas brasileiras de médio porte vão aumentar investimento em TI — Brasil é 2o global em intenção de investimento
- R$ 774 bilhões projetados em transformação digital até 2028 (Brasscom)
- 78% das empresas planejam investir mais em IA em 2025
- 88% das organizações já usam IA no dia a dia, mas apenas 39% viram impacto real no lucro
- Custo de processamento de LLMs caiu 95% desde 2022
- 62% das empresas experimentam com agentes de IA; 23% já implementaram em escala
- 75% dos líderes de PMEs estão otimistas sobre IA; 73% planejam investir
- 61% das PMEs não têm orçamento real ou KPIs definidos para IA
- 84% das empresas relatam dificuldade para contratar profissionais de TI
- Déficit de 30% entre demanda e oferta de profissionais de TI no Brasil
- PMEs com IA pragmática reportam economia média de R$ 25.000/ano
- Break-even de projetos focados: 1-3 meses para deployments simples
- Faixas de investimento de mercado: R$ 100-500/mês (básico), R$ 300-1.500/mês (intermediário), R$ 2.000-15.000/mês (avançado)
- Apenas 20% das PMEs têm políticas de governança de dados
- Shadow AI (uso não autorizado de IA por funcionários) é o principal vetor de risco para LGPD
- PL 2338/2023 avança para regulamentar uso de IA no Brasil
- Agentes conversacionais resolvem aproximadamente 80% das demandas comuns de suporte
- Hiperpersonalização com IA gera aumento de 20-35% no ticket médio

REGRAS DE COMPORTAMENTO:
1. Sempre responda em português brasileiro
2. Não use markdown (sem asteriscos, sem hashtags, sem formatação especial)
3. Não invente dados além do que está neste prompt
4. Respostas concisas: 2-4 frases para perguntas, 1-2 para transições
5. Use os dados de mercado para contextualizar conversas e dar exemplos concretos
6. Quando o visitante perguntar sobre detalhes da metodologia, métricas específicas, ou como funciona internamente, responda com conceitos de alto nível e sugira agendar uma conversa exploratória para aprofundar
7. Nunca revele detalhes internos de como o framework funciona, quais métricas específicas são usadas, ou como os processos são implementados
8. Para perguntas muito técnicas ou específicas, diga algo como: "Esse é exatamente o tipo de pergunta que exploramos na conversa inicial — cada contexto tem suas particularidades"

FLUXO DE QUALIFICAÇÃO (siga esta sequência naturalmente):
1. Cumprimento: apresente-se brevemente e pergunte sobre a área de atuação do visitante
2. Área: identifique o segmento (Operações, Atendimento, Comercial, Jurídico, Financeiro, Tecnologia)
3. Maturidade: entenda o estágio (Explorando IA, Pilotos em andamento, IA em produção, Escalando)
4. Desafio: identifique a dor principal (Custo, Confiabilidade, Governança, ROI, Velocidade, Integração)
5. Insight: ofereça um insight personalizado usando dados de mercado relevantes para o contexto do visitante
6. Contato: sugira agendar uma conversa exploratória e peça nome e e-mail

Quando o visitante fornecer nome e e-mail, agradeça e informe que a equipe retornará em até 24h com uma análise personalizada.`;
```

**Step 2: Verify build**

Run: `cd app && npm run build`
Expected: Build succeeds (chat.ts is a separate Vercel function, but ensure no syntax errors)

**Step 3: Commit**

```bash
git add api/chat.ts
git commit -m "feat: rewrite chatbot system prompt — market data focus, remove methodology details"
```

---

### Task 8: Update Footer.tsx Links

**Files:**
- Modify: `app/src/sections/Footer.tsx` (64 lines)

**Step 1: Update nav links (lines 19-52)**

Change `#framework` to `#solution` and `#services` to `#solution`. Update labels if needed.

**Step 2: Commit**

```bash
git add app/src/sections/Footer.tsx
git commit -m "feat: update footer nav links to match new section structure"
```

---

### Task 9: Clean Up — Delete Unused Section Files

**Files:**
- Delete: `app/src/sections/Services.tsx`
- Delete: `app/src/sections/Framework.tsx`
- Delete: `app/src/sections/DeliveryCycle.tsx`

**Step 1: Delete the files**

```bash
rm app/src/sections/Services.tsx
rm app/src/sections/Framework.tsx
rm app/src/sections/DeliveryCycle.tsx
```

**Step 2: Verify the app still builds**

Run: `cd app && npm run build`
Expected: Build succeeds with no import errors (these were removed from App.tsx in Task 3)

**Step 3: Commit**

```bash
git add -u app/src/sections/Services.tsx app/src/sections/Framework.tsx app/src/sections/DeliveryCycle.tsx
git commit -m "chore: delete old Services, Framework, DeliveryCycle sections (merged into Solution)"
```

---

### Task 10: Visual QA and Final Verification

**Step 1: Start dev server**

Run: `cd app && npm run dev`

**Step 2: Verify each section visually**

Check the following in the browser:
- [ ] Hero: copy updated, "Como funciona" button scrolls to #solution
- [ ] Problem: unchanged
- [ ] Solution: 4 sub-sections render (Opening, Journey, Framework pillars, FrontierOps)
- [ ] Use Cases: unchanged
- [ ] Insights: 10 articles visible (6 original + 4 FrontierOps), section id is "insights"
- [ ] CTA: chatbot opens correctly
- [ ] FAQ: 8 questions with simplified answers
- [ ] About: unchanged
- [ ] Footer: links point to correct sections
- [ ] Desktop nav: 8 dots, active state works on scroll
- [ ] Mobile nav: 5 items at bottom
- [ ] Chat: open chatbot, test qualification flow, verify it doesn't reveal methodology details
- [ ] No broken scroll links (all section IDs match)

**Step 3: Build for production**

Run: `cd app && npm run build`
Expected: Clean build, no warnings

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: visual QA adjustments"
```
