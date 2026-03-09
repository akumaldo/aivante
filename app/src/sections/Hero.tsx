import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
        .fromTo(
          subheadlineRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          bodyRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          buttonsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          servicesRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A08]/50 pointer-events-none" />

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-warm-border mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-xs text-text-secondary font-medium tracking-wider uppercase">
              Entendimento → Piloto → Escala
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-white leading-tight tracking-tight opacity-0"
          >
            Sua IA precisa de engenharia,{' '}
            <span className="text-gold italic">não de tentativa e erro.</span>
          </h1>

          <h2
            ref={subheadlineRef}
            className="mt-6 text-xl sm:text-2xl md:text-3xl font-medium text-text-secondary leading-relaxed opacity-0"
          >
            Operamos IA como infraestrutura de performance — com processo estruturado, medição de resultados e calibração contínua na fronteira.
          </h2>

          <p
            ref={bodyRef}
            className="mt-8 text-lg text-text-secondary max-w-2xl leading-relaxed opacity-0"
          >
            Do entendimento do seu cenário ao primeiro workflow em produção, medimos resultado real antes de escalar.
          </p>

          <div ref={buttonsRef} className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold-light text-warm-black font-semibold px-8 py-6 text-base glow-gold transition-all duration-300 hover:scale-105"
              onClick={() => scrollToSection('cta')}
            >
              Agendar Conversa Exploratória
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-warm-border-light text-text-primary hover:border-gold hover:text-gold hover:bg-transparent px-8 py-6 text-base transition-all duration-300"
              onClick={() => scrollToSection('solution')}
            >
              Nossa abordagem
              <ChevronDown className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-text-muted">
            Conversa inicial de 30 minutos para entender contexto, maturidade atual e prioridades.
          </p>

          {/* Framework highlight */}
          <div ref={servicesRef} className="mt-16 opacity-0">
            <button
              type="button"
              onClick={() => scrollToSection('solution')}
              className="card-warm rounded-xl p-6 cursor-pointer transition-all group text-left w-full"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    Metodologia própria
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gold transition-colors">
                    AI Performance Framework
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Medimos resultado real com nosso AI Performance Framework — 5 dimensões que separam IA que funciona de IA que apenas gera atividade.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
