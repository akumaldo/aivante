import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Headphones,
  Briefcase,
  Scale,
  Calculator,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';

const useCases = [
  {
    icon: Megaphone,
    title: 'Marketing & Conteúdo em Escala',
    description: 'Pipelines que monitoram tendências de concorrentes, roteirizam campanhas, garantem compliance de marca e entregam material pronto para aprovação.',
    metrics: ['Volume de conteúdo gerado', 'Tempo de aprovação', 'Consistência de marca'],
    color: 'cyan',
  },
  {
    icon: Scale,
    title: 'Legal & Contratos',
    description: 'Esteiras automatizadas de triagem jurídica. Agentes que leem PDFs complexos, cruzam com política interna e entregam pareceres sumarizados.',
    metrics: ['Contratos triados/semana', 'Tempo até revisão final', 'Taxa de falso positivo'],
    color: 'violet',
  },
  {
    icon: Calculator,
    title: 'Operações & Backoffice (SAP/ERP)',
    description: 'Agentes de roteamento que extraem dados não estruturados de e-mails ou formulários e alimentam o core do sistema corporativo.',
    metrics: ['Tempo de fechamento', 'Retrabalho eliminado', 'Custo evitado'],
    color: 'emerald',
  },
  {
    icon: Headphones,
    title: 'Atendimento Técnico Nível 2',
    description: 'Sistemas RAG integrados à documentação técnica privada, auxiliando analistas a resolverem incidentes complexos em minutos.',
    metrics: ['Tempo médio de resolução', 'Taxa de escalonamento', 'Satisfação do cliente'],
    color: 'blue',
  },
  {
    icon: Briefcase,
    title: 'Comercial & Propostas',
    description: 'Automação de pipeline comercial: qualificação de leads, geração de propostas personalizadas e follow-up automatizado.',
    metrics: ['Taxa de conversão', 'Tempo de ciclo comercial', 'Custo por proposta aprovada'],
    color: 'amber',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & Regulatório',
    description: 'Monitoramento contínuo de alterações regulatórias, análise de impacto e geração de alertas para equipes responsáveis.',
    metrics: ['Custo por alerta útil', 'Tempo até parecer', 'Cobertura de rastreabilidade'],
    color: 'rose',
  },
];

const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  violet: { border: 'border-violet-500/30', text: 'text-violet-400', bg: 'bg-violet-500/10' },
  emerald: { border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  blue: { border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  rose: { border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-500/10' },
};

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.usecase-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Aplicações
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Onde a orquestração gera maior impacto
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Casos de uso reais onde Agentic Workflows transformam operações 
            manuais em pipelines autônomos com governança.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => {
            const colors = colorMap[useCase.color];
            const Icon = useCase.icon;

            return (
              <div
                key={index}
                className={`usecase-card glass-card rounded-2xl p-6 border ${colors.border} opacity-0 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{useCase.title}</h3>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {useCase.description}
                </p>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500 mb-2">Métricas-chave:</p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.metrics.map((metric, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
