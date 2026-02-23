import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Coins,
  TrendingUp,
  Server,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

const pillars = [
  {
    id: 'throughput',
    number: '01',
    title: 'Intelligence Throughput',
    subtitle: 'Vazão de Inteligência',
    icon: Zap,
    color: 'cyan',
    description:
      'Capacidade de converter agentes, modelos e tokens em trabalho útil concluído, com prioridade clara, desenho operacional e qualidade aceitável.',
    questions: [
      'A IA está aumentando capacidade real de execução?',
      'O fluxo está fluindo ou apenas gerando mais atividade?',
      'A validação humana virou gargalo?',
    ],
    metrics: [
      'Tarefas concluídas por workflow (dia/semana/mês)',
      '% de itens resolvidos por IA + revisão humana',
      'Taxa de aceitação em primeira passada',
      'Tempo médio de fila por tipo de tarefa',
      'Retrabalho por workflow/agente/modelo',
      'Capacidade simultânea efetiva (concurrency)',
    ],
    examples: [
      'Atendimento: mais tickets processados por semana sem aumento de headcount, preservando SLA.',
      'Jurídico: contratos de baixo risco triados e sumarizados antes da revisão final.',
      'Operações: solicitações repetitivas fluem com IA + revisão humana, reduzindo backlog.',
    ],
    antipattern: 'Medir volume de prompts/tokens e não trabalho concluído com qualidade.',
  },
  {
    id: 'token-roi',
    number: '02',
    title: 'Token ROI',
    subtitle: 'Custo por Resultado',
    icon: Coins,
    color: 'violet',
    description:
      'Eficiência econômica do uso de IA: otimização do custo total por resultado entregue, e não apenas do custo unitário por token.',
    questions: [
      'Estamos usando o modelo certo para cada tarefa?',
      'O custo está otimizado no processo completo (incluindo revisão humana)?',
      'Onde a IA está cara e sem retorno proporcional?',
    ],
    metrics: [
      'Cost per Outcome (custo por resultado aceito)',
      'Custo por tarefa concluída (ticket, proposta, análise, parecer)',
      'Mix de modelos por workflow (leve/intermediário/premium)',
      'Taxa de escalonamento para modelo premium',
      'Custo de retrabalho',
      'Custo total do processo (IA + revisão humana + correções)',
    ],
    examples: [
      'Comercial: modelos leves para triagem; premium apenas para casos complexos e exceções.',
      'Regulatório: triagem econômica, sumário intermediário, análise crítica apenas com impacto material.',
      'Backoffice: roteamento por complexidade reduz custo sem perda de qualidade.',
    ],
    antipattern: 'Otimizar custo por token e piorar custo por resultado (retrabalho, erro, latência).',
  },
  {
    id: 'value-conversion',
    number: '03',
    title: 'Value Conversion Rate',
    subtitle: 'Taxa de Conversão em Valor',
    icon: TrendingUp,
    color: 'blue',
    description:
      'Taxa de conversão entre consumo de inteligência e impacto econômico real (receita, margem, capacidade liberada, redução de ciclo, custo evitado).',
    questions: [
      'A IA está gerando valor de negócio ou apenas artefatos?',
      'O ganho operacional está sendo capturado?',
      'O uso de IA está se convertendo em resultado mensurável?',
    ],
    metrics: [
      '% de saídas de IA efetivamente utilizadas',
      '% de tarefas assistidas que chegam ao fim do workflow',
      'Redução de tempo de ciclo convertida em capacidade',
      'Receita incremental atribuível',
      'Cost avoidance (custo evitado)',
      'Impacto em backlog, SLA, conversão, retenção ou margem',
    ],
    examples: [
      'Vendas: drafts só geram valor quando viram propostas enviadas, fechamentos e receita.',
      'Operação interna: resumos só capturam valor quando viram ações executadas, com responsável e prazo.',
      'Atendimento: redução de tempo só vira valor quando melhora SLA, retenção ou NPS.',
    ],
    antipattern: 'Parar na adoção sem fechar a ponte até resultado econômico.',
  },
  {
    id: 'reliability',
    number: '04',
    title: 'Operational Reliability',
    subtitle: 'Confiabilidade Operacional',
    icon: Server,
    color: 'emerald',
    description:
      'Confiabilidade da operação em produção: qualidade, latência, fallback, observabilidade, escalabilidade e previsibilidade.',
    questions: [
      'O negócio pode depender dessa operação de IA no dia a dia?',
      'A solução se mantém estável sob carga?',
      'Existe plano de contingência quando há falha?',
    ],
    metrics: [
      'Disponibilidade/uptime',
      'Latência p50/p95/p99',
      'Taxa de sucesso por etapa do workflow',
      'Fallback rate e fallback success rate',
      'Taxa de incidentes e regressões',
      'MTTR (tempo médio de recuperação)',
    ],
    examples: [
      'Atendimento digital: em picos, mantém latência aceitável e aciona contingência quando integração falha.',
      'Operação regulada: updates entram com testes de regressão, logs e runbooks.',
      'Produtos internos: alertas evitam descoberta de falhas apenas por reclamação do usuário final.',
    ],
    antipattern: 'Produção com mentalidade de experimento — sem SLO, sem observabilidade, sem owner.',
  },
  {
    id: 'governance',
    number: '05',
    title: 'Governance & Compliance',
    subtitle: 'Governança e Compliance',
    icon: ShieldCheck,
    color: 'amber',
    description:
      'Capacidade de escalar IA com rastreabilidade, responsabilização, gestão de risco, políticas de uso e aderência regulatória.',
    questions: [
      'Quem responde por quê?',
      'O processo é auditável?',
      'Os controles são proporcionais ao risco do caso de uso?',
    ],
    metrics: [
      '% de workflows com trilha de auditoria completa',
      '% de prompts/templates versionados',
      '% de workflows com revisão humana definida',
      'Cobertura de classificação de dados sensíveis',
      'Taxa de violações de uso/política',
      'Catálogo de modelos/agentes aprovados',
    ],
    examples: [
      'RH: regras claras, revisão humana mandatória e critérios documentados.',
      'Jurídico/Financeiro: rastrear origem, versão de modelo/prompt, validação humana e dados processados.',
      'Compliance: casos de uso classificados por risco com controles proporcionais.',
    ],
    antipattern: 'Adicionar governança apenas depois da expansão (dívida de risco).',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  violet: { bg: 'from-violet-500/20 to-violet-600/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  blue: { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  amber: { bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400', border: 'border-amber-500/30' },
};

export default function Framework() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll('.pillar-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const togglePillar = (id: string) => {
    setExpandedPillar(expandedPillar === id ? null : id);
  };

  return (
    <section
      id="framework"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div ref={titleRef} className="text-center mb-12 opacity-0">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            O Gate entre Piloto e Escala
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            O mercado não tinha uma linguagem executiva para medir IA. Nós criamos.
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            O AI Performance Framework é aplicado quando a IA já está em produção.
            Ele mede o resultado real do piloto nos 5 pilares e gera o scorecard
            que valida se faz sentido escalar — com dados, não com opinião.
          </p>
        </div>

        <div ref={cardsRef} className="space-y-3 max-w-4xl mx-auto">
          {pillars.map((pillar) => {
            const colors = colorMap[pillar.color];
            const isExpanded = expandedPillar === pillar.id;
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.id}
                className={`pillar-card glass-card rounded-xl overflow-hidden border ${colors.border} opacity-0`}
              >
                <button
                  onClick={() => togglePillar(pillar.id)}
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-slate-800/30 transition-colors"
                >
                  <span className={`text-2xl font-bold ${colors.text} opacity-50`}>
                    {pillar.number}
                  </span>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                    <p className={`text-sm ${colors.text}`}>{pillar.subtitle}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-2 border-t border-white/5 space-y-5">
                        {/* Definição */}
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {pillar.description}
                        </p>

                        {/* Perguntas executivas */}
                        <div>
                          <h4 className={`text-xs font-semibold uppercase tracking-wider ${colors.text} mb-2`}>
                            Perguntas executivas
                          </h4>
                          <ul className="space-y-1">
                            {pillar.questions.map((q, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                <span className={`${colors.text} mt-0.5 flex-shrink-0`}>•</span>
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Como medir */}
                        <div>
                          <h4 className={`text-xs font-semibold uppercase tracking-wider ${colors.text} mb-2`}>
                            Como medir
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {pillar.metrics.map((metric, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2.5 py-1 rounded-full bg-slate-800/80 ${colors.text}`}
                              >
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Exemplos práticos */}
                        <div>
                          <h4 className={`text-xs font-semibold uppercase tracking-wider ${colors.text} mb-2`}>
                            Exemplos práticos
                          </h4>
                          <ul className="space-y-1.5">
                            {pillar.examples.map((ex, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                <span className={`${colors.text} mt-0.5 flex-shrink-0`}>→</span>
                                {ex}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Erro comum */}
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                          <span className="text-red-400 text-xs font-semibold uppercase tracking-wider flex-shrink-0 mt-0.5">
                            Erro comum:
                          </span>
                          <span className="text-sm text-red-300/80">
                            {pillar.antipattern}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
