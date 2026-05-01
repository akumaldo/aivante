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
      className="py-28 md:py-44"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={contentRef} className="max-w-2xl opacity-0">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white leading-[1.1] mb-8">
            Vamos entender<br />seu cenário
          </h2>

          <p className="text-lg text-text-secondary leading-relaxed mb-12 max-w-md">
            Converse com nosso assistente para descobrir como IA estruturada
            pode gerar resultados reais no seu negócio.
          </p>

          <button
            onClick={openChat}
            className="group inline-flex items-center gap-3 bg-white text-warm-black px-8 py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-gold hover:text-warm-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A08]"
          >
            Iniciar conversa
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-sm text-text-muted mt-8">
            Sem formulários. Uma conversa rápida e personalizada.
          </p>
        </div>
      </div>
    </section>
  );
}
