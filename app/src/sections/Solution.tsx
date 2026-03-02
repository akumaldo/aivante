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
        {/* Opening */}
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

        {/* Journey: Entendimento → Piloto → Escala */}
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

        {/* AIPF Framework: 5 Pillars */}
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

        {/* FrontierOps */}
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
