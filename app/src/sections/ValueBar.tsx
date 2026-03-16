import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Target, Gauge, ShieldCheck, LineChart } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Engenharia, não integração',
    description:
      'Construímos fluxos de IA focados em resolver gargalos reais — não apenas conectamos ferramentas.',
  },
  {
    icon: Gauge,
    title: 'Performance mensurável',
    description:
      'Nosso AI Performance Framework mede resultado real em 5 dimensões antes de escalar.',
  },
  {
    icon: ShieldCheck,
    title: 'Governança desde o dia 1',
    description:
      'Rastreabilidade, compliance e controle de custos embarcados na arquitetura, não adicionados depois.',
  },
  {
    icon: LineChart,
    title: 'Calibração contínua',
    description:
      'Modelos evoluem trimestralmente. Mantemos sua operação de IA sempre atualizada com a fronteira.',
  },
];

export default function ValueBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const items = cardsRef.current?.querySelectorAll('.value-item');
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
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
      ref={sectionRef}
      className="py-20 md:py-28 border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={titleRef} className="mb-14 opacity-0">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white">
            Nosso valor, sua vantagem
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10"
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="value-item opacity-0">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-gold flex-shrink-0" strokeWidth={1.5} />
                  <h3 className="text-base font-semibold text-white">
                    {value.title}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
