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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 pointer-events-none" />

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">
              Entendimento → Piloto → Escala
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight opacity-0"
          >
            Sua IA precisa de engenharia,{' '}
            <span className="text-gradient">não de tentativa e erro.</span>
          </h1>

          <h2
            ref={subheadlineRef}
            className="mt-6 text-xl sm:text-2xl md:text-3xl font-medium text-slate-300 leading-relaxed opacity-0"
          >
            Da construção do primeiro workflow de IA à gestão de performance
            em escala — com controle de custo, governança e resultado mensurável.
          </h2>

          <p
            ref={bodyRef}
            className="mt-8 text-lg text-slate-400 max-w-2xl leading-relaxed opacity-0"
          >
            Um processo em 3 fases que se adapta ao seu estágio: do entendimento ao piloto,
            e do piloto à escala — com o <strong className="text-slate-300">AI Performance Framework</strong> como
            gate que valida resultados antes de expandir.
          </p>

          <div ref={buttonsRef} className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0">
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-8 py-6 text-base glow-cyan transition-all duration-300 hover:scale-105"
              onClick={() => scrollToSection('cta')}
            >
              Agendar Conversa Exploratória
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-base transition-all duration-300"
              onClick={() => scrollToSection('services')}
            >
              Como funciona
              <ChevronDown className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Conversa inicial de 30 minutos para entender contexto, maturidade atual e prioridades.
          </p>

          {/* Framework highlight */}
          <div ref={servicesRef} className="mt-16 opacity-0">
            <button
              type="button"
              onClick={() => scrollToSection('framework')}
              className="glass-card rounded-xl p-6 cursor-pointer hover:border-cyan-500/40 transition-all group text-left w-full"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Metodologia própria
                  </span>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    AI Performance Framework
                  </h3>
                  <p className="text-sm text-slate-400">
                    O gate entre piloto e escala: 5 pilares executivos que medem IA em produção
                    e validam se o resultado justifica expandir — vazão, custo por resultado,
                    conversão em valor, confiabilidade e governança.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
    </section>
  );
}
