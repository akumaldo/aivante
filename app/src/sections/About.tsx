import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MessageCircle, Calendar, BarChart3, Sparkles } from 'lucide-react';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div
          ref={contentRef}
          className="max-w-4xl mx-auto card-warm rounded-3xl p-8 md:p-12 opacity-0"
        >
          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
            {/* Photo */}
            <div className="mx-auto md:mx-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-gold/30 via-gold-dark/30 to-gold-light/30 p-1">
                <img
                  src="/bruno-lunardi.png"
                  alt="Bruno Lunardi"
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-gold text-sm font-semibold tracking-wider uppercase mb-4 block">
                Quem está por trás
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Bruno Lunardi
              </h2>
              <p className="text-sm text-text-muted mb-4">Fundador da AIPF | Engenharia e Performance em IA</p>
              <p className="text-text-secondary leading-relaxed mb-6">
                A experiência lidando com sistemas de alta complexidade moldou a forma como
                enxergo a Inteligência Artificial: ela precisa de base sólida e dar retorno claro.
                Não sou um integrador de APIs. Construo e gerencio fluxos de IA focados em resolver
                gargalos reais de negócio através do framework AIPF. O resultado é uma arquitetura
                desenhada para oferecer precisão, controle de custos e impacto operacional imediato.
              </p>

              {/* Services */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-warm-surface-raised rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-white">Engenharia de IA</span>
                  </div>
                  <p className="text-xs text-text-muted">Do entendimento ao piloto em produção</p>
                </div>
                <div className="p-4 bg-warm-surface-raised rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-white">AI Performance Framework</span>
                  </div>
                  <p className="text-xs text-text-muted">Gate entre piloto e escala — 5 pilares</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/5511973582931?text=Olá! Vim pelo site da AIPF e gostaria de conversar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-warm-surface-raised text-text-secondary hover:bg-warm-surface-hover hover:text-text-primary transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href="#cta"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-muted text-gold hover:bg-gold/20 transition-colors text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Agendar conversa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
