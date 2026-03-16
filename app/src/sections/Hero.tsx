import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      )
        .fromTo(
          headlineRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1 },
          '-=0.5'
        )
        .fromTo(
          subheadlineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.4'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-end overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-cityscape.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-warm-black/90 via-warm-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-warm-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28 pt-32 w-full">
        <div className="max-w-2xl">
          <div ref={badgeRef} className="opacity-0 mb-8">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium">
              <span className="w-8 h-px bg-gold" />
              Entendimento &middot; Piloto &middot; Escala
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-serif font-light text-white leading-[1.1] tracking-tight opacity-0"
          >
            Engenharia de IA
            <br />
            <span className="text-gold italic">para resultados reais</span>
          </h1>

          <p
            ref={subheadlineRef}
            className="mt-8 text-lg lg:text-xl text-text-secondary leading-relaxed max-w-lg opacity-0"
          >
            Operamos IA como infraestrutura de performance — com processo estruturado,
            medição de resultados e calibração contínua na fronteira.
          </p>

          <div ref={ctaRef} className="mt-10 opacity-0">
            <button
              onClick={() => scrollToSection('cta')}
              className="group inline-flex items-center gap-3 bg-white text-warm-black px-8 py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-gold hover:text-warm-black transition-all duration-300"
            >
              Agendar Conversa Exploratória
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
