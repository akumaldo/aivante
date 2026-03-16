import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
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

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="py-24 md:py-36 border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={contentRef} className="max-w-2xl mx-auto text-center opacity-0">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-8 justify-center">
            <span className="w-8 h-px bg-gold" />
            Primeiro passo
            <span className="w-8 h-px bg-gold" />
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white leading-tight mb-6">
            Vamos entender seu cenário
          </h2>

          <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg mx-auto">
            Converse com nosso assistente para descobrir como IA estruturada
            pode gerar resultados reais no seu negócio.
          </p>

          <button
            onClick={openChat}
            className="group inline-flex items-center gap-3 bg-white text-warm-black px-8 py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-gold hover:text-warm-black transition-all duration-300"
          >
            Iniciar conversa
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-sm text-text-muted mt-6">
            Sem formulários. Uma conversa rápida e personalizada.
          </p>
        </div>
      </div>
    </section>
  );
}
