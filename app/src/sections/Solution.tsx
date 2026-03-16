import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

const journeyPhases = [
  {
    number: '01',
    title: 'Entendimento',
    description:
      'Mapeamos seus processos, identificamos onde IA gera resultado real e desenhamos a arquitetura.',
  },
  {
    number: '02',
    title: 'Piloto',
    description:
      'Colocamos o primeiro workflow em produção com controle, validação e métricas desde o dia 1.',
  },
  {
    number: '03',
    title: 'Escala',
    description:
      'Expandimos para novos processos com governança, otimização de custos e monitoramento contínuo.',
  },
];

const frameworkPillars = [
  {
    title: 'Vazão de Inteligência',
    description: 'Quanto trabalho útil a IA está realmente completando.',
  },
  {
    title: 'Custo por Resultado',
    description: 'Eficiência econômica real — não custo por token, mas por entrega.',
  },
  {
    title: 'Conversão em Valor',
    description: 'Quanto do que a IA produz se converte em impacto no negócio.',
  },
  {
    title: 'Confiabilidade Operacional',
    description: 'A operação com IA é estável e previsível no dia a dia.',
  },
  {
    title: 'Governança e Compliance',
    description: 'Rastreabilidade, auditoria e conformidade para escalar com segurança.',
  },
];

const frontierOpsConcepts = [
  {
    title: 'Calibração',
    description:
      'Mantemos um mapa atualizado do que a IA pode e não pode fazer no seu contexto — e recalibramos a cada evolução.',
  },
  {
    title: 'Arquitetura de Fluxos',
    description:
      'Desenhamos workflows onde humanos e agentes colaboram sem atrito — cada um no que faz melhor.',
  },
  {
    title: 'Gestão de Atenção',
    description:
      'Direcionamos a atenção humana para onde ela realmente importa — revisão profunda onde há risco, automação onde há confiança.',
  },
];

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.solution-block').forEach((block) => {
        gsap.fromTo(
          block,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="py-20 md:py-28 border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Opening */}
        <div className="solution-block mb-20 opacity-0">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-6">
            <span className="w-8 h-px bg-gold" />
            Nossa abordagem
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-6 max-w-xl">
            Como transformamos IA em resultado
          </h2>
          <p className="text-text-secondary max-w-2xl leading-relaxed">
            Não vendemos tecnologia. Operamos IA como infraestrutura de
            performance — com processo, medição e calibração contínua.
          </p>
        </div>

        {/* Journey: 3 phases */}
        <div className="solution-block mb-24 opacity-0">
          <h3 className="text-sm tracking-[0.15em] uppercase text-text-muted font-medium mb-10">
            A Jornada
          </h3>
          <div className="grid md:grid-cols-3 gap-px bg-warm-border rounded-lg overflow-hidden">
            {journeyPhases.map((phase) => (
              <div
                key={phase.number}
                className="bg-warm-black p-8 group hover:bg-warm-surface transition-colors duration-300"
              >
                <span className="text-xs font-mono text-gold tracking-wider mb-4 block">
                  FASE {phase.number}
                </span>
                <h4 className="text-xl font-serif font-light text-white mb-3">
                  {phase.title}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {phase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance Framework */}
        <div className="solution-block mb-24 opacity-0">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-4">
                <span className="w-8 h-px bg-gold" />
                AI Performance Framework
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-4">
                Medimos o que importa
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Nosso Framework avalia resultados em 5 dimensões — não adoção,
                não volume de uso, mas impacto real no negócio.
              </p>
            </div>
            <div className="space-y-0">
              {frameworkPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex gap-6 py-5 border-t border-warm-border group"
                >
                  <span className="text-xs font-mono text-text-muted pt-0.5 w-6 flex-shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-1 group-hover:text-gold transition-colors duration-300">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FrontierOps */}
        <div className="solution-block opacity-0">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-4">
              <span className="w-8 h-px bg-gold" />
              Frontier Operations
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-4 max-w-lg">
              Operando na fronteira da IA
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
              Modelos de IA evoluem a cada trimestre. O que funcionava ontem pode
              ser insuficiente amanhã. FrontierOps mantém sua operação calibrada
              com o que há de mais avançado — continuamente.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {frontierOpsConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="border border-warm-border rounded-lg p-8 hover:border-warm-border-light transition-colors duration-300 group"
              >
                <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {concept.title}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {concept.description}
                </p>
                <button
                  onClick={() => scrollToSection('cta')}
                  className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-gold transition-colors"
                >
                  Saiba mais
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
