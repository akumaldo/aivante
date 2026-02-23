import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TrendingDown, DollarSign, ShieldAlert, Brain, Workflow, Gauge } from 'lucide-react';

const problems = [
  {
    icon: Brain,
    title: 'Agentes que alucinam dados',
    description: 'IA gerando informações incorretas sem validação, comprometendo decisões de negócio.',
    solution: 'Orquestração',
  },
  {
    icon: DollarSign,
    title: 'Custos de API fora de controle',
    description: 'Usar modelos premium para tarefas simples destrói o ROI corporativo.',
    solution: 'Ambos',
  },
  {
    icon: Gauge,
    title: 'Sem visibilidade de performance',
    description: 'Não saber onde a IA está gerando valor ou apenas gerando atividade.',
    solution: 'Framework',
  },
  {
    icon: Workflow,
    title: 'Loops infinitos de correções',
    description: 'Fluxos mal desenhados que exigem retrabalho constante da equipe.',
    solution: 'Orquestração',
  },
  {
    icon: ShieldAlert,
    title: 'Governança entrando tarde',
    description: 'Riscos e compliance tratados apenas após problemas acontecerem.',
    solution: 'Ambos',
  },
  {
    icon: TrendingDown,
    title: 'Perda de confiança da equipe',
    description: 'Falta de confiabilidade na operação de IA desmotiva adoção.',
    solution: 'Ambos',
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      const cards = cardsRef.current?.querySelectorAll('.problem-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'back.out(1.4)',
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

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div ref={titleRef} className="max-w-3xl mb-16 opacity-0">
          <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            O Desafio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            A intenção vaga é o maior risco da automação com IA
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Muitas empresas tentam automatizar processos complexos dando instruções amplas 
            a um modelo de linguagem e esperando o melhor. Sistemas de IA são probabilísticos. 
            Eles precisam de limites, arquiteturas rígidas de validação e roteamento inteligente.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            const solutionColor = problem.solution === 'Framework' ? 'cyan' : 
                                  problem.solution === 'Orquestração' ? 'violet' : 'gradient';
            
            return (
              <div
                key={index}
                className="problem-card glass-card rounded-2xl p-6 opacity-0 hover:border-red-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {problem.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Solução:</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    solutionColor === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                    solutionColor === 'violet' ? 'bg-violet-500/20 text-violet-400' :
                    'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-slate-300'
                  }`}>
                    {problem.solution}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
