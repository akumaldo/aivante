import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

const useCases = [
  {
    title: 'Marketing & Conteúdo',
    description:
      'Pipelines que monitoram tendências, roteirizam campanhas, garantem compliance de marca e entregam material pronto para aprovação.',
    metrics: ['Volume de conteúdo', 'Tempo de aprovação', 'Consistência de marca'],
  },
  {
    title: 'Legal & Contratos',
    description:
      'Esteiras automatizadas de triagem jurídica. Agentes que leem PDFs complexos, cruzam com política interna e entregam pareceres sumarizados.',
    metrics: ['Contratos triados/semana', 'Tempo até revisão', 'Taxa de falso positivo'],
  },
  {
    title: 'Operações & Backoffice',
    description:
      'Agentes de roteamento que extraem dados não estruturados de e-mails ou formulários e alimentam o core do sistema corporativo.',
    metrics: ['Tempo de fechamento', 'Retrabalho eliminado', 'Custo evitado'],
  },
  {
    title: 'Atendimento Técnico',
    description:
      'Sistemas RAG integrados à documentação técnica privada, auxiliando analistas a resolverem incidentes complexos em minutos.',
    metrics: ['Tempo de resolução', 'Taxa de escalonamento', 'Satisfação'],
  },
  {
    title: 'Comercial & Propostas',
    description:
      'Automação de pipeline comercial: qualificação de leads, geração de propostas personalizadas e follow-up automatizado.',
    metrics: ['Taxa de conversão', 'Ciclo comercial', 'Custo por proposta'],
  },
  {
    title: 'Compliance & Regulatório',
    description:
      'Monitoramento contínuo de alterações regulatórias, análise de impacto e geração de alertas para equipes responsáveis.',
    metrics: ['Custo por alerta', 'Tempo até parecer', 'Cobertura'],
  },
];

export default function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
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

      const cards = cardsRef.current?.querySelectorAll('.usecase-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
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
      className="py-20 md:py-28 border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={titleRef} className="mb-14 opacity-0">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-6">
            <span className="w-8 h-px bg-gold" />
            Áreas de aplicação
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white max-w-xl">
            Onde a orquestração gera maior impacto
          </h2>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-px bg-warm-border rounded-lg overflow-hidden">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="usecase-card bg-warm-black p-8 opacity-0 group hover:bg-warm-surface transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                {useCase.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                {useCase.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {useCase.metrics.map((metric, i) => (
                  <span
                    key={i}
                    className="text-xs text-text-muted border border-warm-border rounded-full px-3 py-1"
                  >
                    {metric}
                  </span>
                ))}
              </div>
              <button
                onClick={() => scrollToSection('cta')}
                className="inline-flex items-center gap-1.5 text-sm text-text-muted group-hover:text-gold transition-colors"
              >
                Saiba mais
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
