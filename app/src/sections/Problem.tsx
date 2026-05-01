import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const problems = [
  {
    number: '01',
    title: 'Sem métricas de impacto',
    description:
      'Ferramentas contratadas, APIs rodando, equipe usando — mas nenhuma métrica que conecte uso a impacto no negócio.',
    stat: '61% das PMEs brasileiras não têm orçamento real ou KPIs definidos para IA.',
  },
  {
    number: '02',
    title: 'Custos sem justificativa',
    description:
      'Cada nova ferramenta se acumula. O orçamento cresce mês a mês, mas ninguém consegue apontar o retorno — porque ninguém mede custo por resultado.',
    stat: 'Setup e manutenção consomem 30–50% do investimento total.',
  },
  {
    number: '03',
    title: 'Confiança frágil',
    description:
      'Funcionários ignoram as ferramentas por desconfiança — ou usam ChatGPT com dados confidenciais sem que TI saiba. Os dois cenários são perigosos.',
    stat: 'Apenas 20% das PMEs têm políticas de governança de dados para IA.',
  },
  {
    number: '04',
    title: 'Pilotos que nunca escalam',
    description:
      'O piloto funcionou no PowerPoint. Na prática, ninguém sabe como integrar, medir resultado real ou decidir se vale escalar.',
    stat: '62% experimentam com agentes de IA, mas só 23% passaram de piloto para produção.',
  },
  {
    number: '05',
    title: 'Paralisia estratégica',
    description:
      'A pressão existe — concorrentes adotando, diretoria perguntando. Mas são tantas opções e promessas que a paralisia é o resultado mais comum.',
    stat: '75% dos líderes estão otimistas sobre IA, mas a maioria não tem estratégia.',
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

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

      const items = itemsRef.current?.querySelectorAll('.problem-item');
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: itemsRef.current,
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
      id="problem"
      ref={sectionRef}
      className="py-24 md:py-36 bg-warm-surface"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={titleRef} className="max-w-3xl mb-20 opacity-0">
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-sans font-bold text-white leading-[1.1] tracking-tight mb-8">
            Sua empresa usa IA.
            <br />
            <span className="text-text-secondary font-light">Mas sabe se está funcionando?</span>
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
            88% das organizações brasileiras já usam IA no dia a dia. Apenas 39%
            viram impacto real no lucro. O problema não é a tecnologia; é o que
            acontece entre a adoção e o resultado.
          </p>
        </div>

        <div ref={itemsRef} className="space-y-0">
          {problems.map((problem) => (
            <div
              key={problem.number}
              className="problem-item opacity-0 grid md:grid-cols-[4rem_1fr_1fr] gap-4 md:gap-10 py-10 border-t border-warm-border group"
            >
              <span className="text-2xl font-mono text-sage/60 self-start font-light">
                {problem.number}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-sage-light transition-colors duration-300">
                  {problem.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {problem.description}
                </p>
              </div>
              <p className="text-sm text-text-muted leading-relaxed italic md:text-right md:pt-1">
                {problem.stat}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
