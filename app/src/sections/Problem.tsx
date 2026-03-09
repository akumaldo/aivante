import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BarChart3, DollarSign, ShieldAlert, FlaskConical, Compass } from 'lucide-react';

const problems = [
  {
    icon: BarChart3,
    title: 'Investimos em IA, mas não temos como medir se está dando resultado',
    description:
      'Ferramentas contratadas, APIs rodando, equipe usando — mas nenhuma métrica que conecte uso a impacto no negócio. Sem KPIs, é impossível saber se a IA está gerando valor ou apenas atividade.',
    stat: '61% das PMEs brasileiras não têm orçamento real ou KPIs definidos para IA.',
  },
  {
    icon: DollarSign,
    title: 'Os custos com IA só crescem e ninguém sabe justificar',
    description:
      'Cada nova ferramenta, cada API, cada modelo premium se acumula. O orçamento aumenta mês a mês, mas ninguém consegue apontar o retorno proporcional — porque ninguém mede custo por resultado.',
    stat: 'Setup e manutenção de IA consomem 30-50% do investimento total, além do custo das ferramentas.',
  },
  {
    icon: ShieldAlert,
    title: 'A equipe não confia na IA — ou usa por conta própria sem controle',
    description:
      'De um lado, funcionários que ignoram as ferramentas de IA por desconfiança. Do outro, colaboradores usando ChatGPT com dados confidenciais da empresa sem que TI saiba. Os dois cenários são perigosos.',
    stat: 'Apenas 20% das PMEs brasileiras têm políticas de governança de dados para IA.',
  },
  {
    icon: FlaskConical,
    title: 'Fizemos pilotos, mas nunca passaram de experimento',
    description:
      'O piloto funcionou no PowerPoint. Na prática, ninguém sabe como integrar com os sistemas existentes, medir resultado real ou decidir se vale escalar. O piloto morre na PoC.',
    stat: '62% das empresas experimentam com agentes de IA, mas só 23% passaram de piloto para produção.',
  },
  {
    icon: Compass,
    title: 'Sabemos que precisamos de IA, mas não sabemos por onde começar',
    description:
      'A pressão existe — concorrentes adotando, diretoria perguntando, mercado mudando. Mas são tantas opções, fornecedores e promessas que a paralisia é o resultado mais comum.',
    stat: '75% dos líderes de PMEs estão otimistas sobre IA, mas a maioria não tem estratégia definida.',
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
          <span className="text-gold text-sm font-semibold tracking-wider uppercase mb-4 block">
            O cenário que você reconhece
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif font-normal text-white leading-tight mb-6">
            Sua empresa usa IA. Mas sabe se está funcionando?
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            88% das organizações brasileiras já usam IA no dia a dia. Apenas 39%
            viram impacto real no lucro. O problema não é a tecnologia — é o que
            acontece entre a adoção e o resultado.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;

            return (
              <div
                key={index}
                className="problem-card card-warm rounded-2xl p-6 opacity-0 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-muted flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {problem.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {problem.description}
                </p>
                <div className="flex items-start gap-2 pt-3 border-t border-warm-border">
                  <span className="text-xs text-gold-dark leading-relaxed">
                    {problem.stat}
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
