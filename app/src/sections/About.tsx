import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-28 border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={contentRef} className="opacity-0">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
            {/* Photo */}
            <div>
              <div className="w-48 h-48 lg:w-full lg:h-auto lg:aspect-square rounded-lg overflow-hidden border border-warm-border">
                <img
                  src="/bruno-lunardi.png"
                  alt="Bruno Lunardi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-6">
                <span className="w-8 h-px bg-gold" />
                Quem está por trás
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-2">
                Bruno Lunardi
              </h2>
              <p className="text-sm text-text-muted mb-6">
                Fundador da AINOVA &middot; Engenharia e Performance em IA
              </p>
              <p className="text-text-secondary leading-relaxed mb-8 max-w-xl">
                A experiência lidando com sistemas de alta complexidade moldou a forma como
                enxergo a Inteligência Artificial: ela precisa de base sólida e dar retorno claro.
                Não sou um integrador de APIs. Construo e gerencio fluxos de IA focados em resolver
                gargalos reais de negócio. O resultado é uma arquitetura desenhada para
                oferecer precisão, controle de custos e impacto operacional imediato.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8 max-w-lg">
                <div className="border-l-2 border-gold pl-4">
                  <h3 className="text-sm font-semibold text-white mb-1">Engenharia de IA</h3>
                  <p className="text-xs text-text-muted">Do entendimento ao piloto em produção</p>
                </div>
                <div className="border-l-2 border-warm-border pl-4">
                  <h3 className="text-sm font-semibold text-white mb-1">AI Performance Framework</h3>
                  <p className="text-xs text-text-muted">Gate entre piloto e escala — 5 pilares</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/5511973582931?text=Olá! Vim pelo site da AINOVA e gostaria de conversar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={() => scrollToSection('cta')}
                  className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
                >
                  Agendar conversa
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
