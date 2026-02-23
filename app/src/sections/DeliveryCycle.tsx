import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Lightbulb, Shield, Rocket, Settings } from 'lucide-react';

const phases = [
  {
    week: 'Semanas 1-2',
    title: 'Arquitetura & MVP',
    description: 'Definição do processo alvo, escolha do stack de IA e construção do primeiro agente isolado em ambiente seguro.',
    icon: Lightbulb,
    color: 'cyan',
    activities: [
      'Mapeamento do processo atual',
      'Definição de System Prompts',
      'Setup do ambiente de desenvolvimento',
      'Primeiro agente funcionando',
    ],
  },
  {
    week: 'Semanas 3-4',
    title: 'Trust & HITL',
    description: 'Conexão do fluxo de ponta a ponta com travas de segurança humana. Testes de estresse e calibração.',
    icon: Shield,
    color: 'violet',
    activities: [
      'Implementação de Gates de aprovação',
      'Testes de alucinação',
      'Calibração de prompts',
      'Documentação de edge cases',
    ],
  },
  {
    week: 'Semanas 5-6',
    title: 'Deploy & Orquestração',
    description: 'Integração com ferramentas reais do time e otimização da economia de tokens para viabilizar a escala.',
    icon: Settings,
    color: 'emerald',
    activities: [
      'Integração com ERP/CRM/SAP',
      'Roteamento inteligente de modelos',
      'Painel de observabilidade',
      'Treinamento da equipe',
    ],
  },
  {
    week: 'Pós-Deploy',
    title: 'Operação Contínua',
    description: 'Monitoramento, refinamento e evolução do workflow. Aqui entra o AI Performance Framework para medir resultado e orientar próximos passos.',
    icon: Rocket,
    color: 'blue',
    activities: [
      'Monitoramento de custos e performance',
      'Ajustes de Token Economics',
      'Expansão para novos casos de uso',
      'Governança e compliance contínuos',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; line: string }> = {
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', line: 'from-cyan-500 to-violet-500' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', line: 'from-violet-500 to-emerald-500' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', line: 'from-emerald-500 to-blue-500' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', line: 'from-blue-500 to-cyan-500' },
};

export default function DeliveryCycle() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = timelineRef.current?.querySelectorAll('.timeline-item');
      if (items) {
        gsap.fromTo(
          items,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
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
      id="delivery"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Metodologia
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Comece com um piloto. Meça resultado. Depois escale.
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Um ciclo de 6 semanas focado em um único processo. Cada fase entrega
            um resultado concreto e mensurável — você avalia o retorno antes de decidir
            se faz sentido expandir.
          </p>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-700/50 transform md:-translate-x-1/2">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-violet-500 to-emerald-500 origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          {/* Phases */}
          <div className="space-y-12">
            {phases.map((phase, index) => {
              const colors = colorMap[phase.color];
              const Icon = phase.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`timeline-item relative flex items-start gap-8 opacity-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-14 h-14 rounded-full ${colors.bg} border-2 ${colors.text.replace('text', 'border')} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-24 md:ml-0 md:w-5/12 ${
                      isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'
                    }`}
                  >
                    <div className="glass-card rounded-2xl p-6">
                      <span className={`text-sm font-semibold ${colors.text} block mb-1`}>
                        {phase.week}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {phase.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        {phase.description}
                      </p>
                      <ul className={`space-y-1 ${isLeft ? 'md:text-right' : ''}`}>
                        {phase.activities.map((activity, i) => (
                          <li
                            key={i}
                            className={`text-xs text-slate-500 flex items-center gap-2 ${
                              isLeft ? 'md:flex-row-reverse' : ''
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${colors.bg.replace('/20', '')}`} />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note about Framework Gate */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="glass rounded-xl p-6 border border-cyan-500/20">
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-cyan-400">E depois?</strong>{' '}
              Com o piloto em produção, aplicamos o AI Performance Framework para medir
              resultado nos 5 pilares. O scorecard valida se faz sentido escalar —
              e direciona os próximos passos com dados concretos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
