import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Layers, Shield, Coins, LineChart } from 'lucide-react';

const pillars = [
  {
    icon: Layers,
    title: 'Decomposição de Domínio',
    subtitle: 'Domain Translation',
    color: 'cyan',
    description: 'A IA não automatiza "departamentos", automatiza fluxos. Desenhamos a engenharia reversa do seu processo atual, quebrando requisitos de negócios em System Prompts de alta precisão e limites rigorosos de contexto.',
  },
  {
    icon: Shield,
    title: 'Trust Architecture & HITL',
    subtitle: 'Human-in-the-Loop',
    color: 'violet',
    description: 'Implementamos arquiteturas Zero-Trust para agentes. Em fluxos críticos, a IA pesquisa, analisa e rascunha, mas o sistema exige um Gate de aprovação humana antes de avançar, eliminando o risco de alucinações em cascata.',
  },
  {
    icon: Coins,
    title: 'Otimização de Token Economics',
    subtitle: 'Cost per Outcome',
    color: 'emerald',
    description: 'Usar o modelo mais caro para tarefas simples destrói o ROI. Criamos camadas de roteamento: agentes menores e baratos filtram e estruturam dados, enquanto modelos premium atuam apenas no raciocínio complexo.',
  },
  {
    icon: LineChart,
    title: 'Evals & Observabilidade',
    subtitle: 'Telemetria Contínua',
    color: 'blue',
    description: 'Não existe IA em produção sem testes automatizados. Construímos painéis de telemetria para que você veja a Vazão de Inteligência, custos exatos por tarefa e taxa de sucesso da operação em tempo real.',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  violet: { bg: 'from-violet-500/20 to-violet-600/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  blue: { bg: 'from-blue-500/20 to-blue-600/10', text: 'text-blue-400', border: 'border-blue-500/30' },
};

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
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

      const items = pillarsRef.current?.querySelectorAll('.pillar-item');
      if (items) {
        gsap.fromTo(
          items,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 75%',
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
      id="orchestration"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        <div ref={contentRef} className="text-center mb-16 max-w-4xl mx-auto opacity-0">
          <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Orquestração de IA
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Orquestração de Inteligência baseada em{' '}
            <span className="text-gradient">Trust Architecture</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Nós não vendemos "chatbots". Desenvolvemos Integrações de IA e Pipelines Autônomos 
            projetados para ambientes corporativos. Tratamos a IA como um "ator não confiável" 
            que precisa operar dentro de um sistema perfeito.
          </p>
        </div>

        <div ref={pillarsRef} className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => {
            const colors = colorMap[pillar.color];
            const Icon = pillar.icon;

            return (
              <div
                key={index}
                className={`pillar-item glass-card rounded-2xl p-6 border ${colors.border} opacity-0 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${colors.text} uppercase tracking-wider`}>
                      {pillar.subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
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
