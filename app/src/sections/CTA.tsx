import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
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

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(200,164,94,0.03)] to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        <div
          ref={cardRef}
          className="card-warm rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto opacity-0 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gold-muted flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-gold" />
          </div>

          <span className="text-gold text-sm font-semibold tracking-wider uppercase mb-4 block">
            Primeiro Passo
          </span>

          <h2 className="text-3xl md:text-4xl font-serif font-normal text-white leading-tight mb-4">
            Vamos entender seu cenário
          </h2>

          <p className="text-lg text-text-secondary max-w-lg mx-auto mb-8">
            Converse com nosso assistente para descobrir como IA estruturada
            pode gerar resultados reais no seu negócio.
          </p>

          <Button
            onClick={openChat}
            className="bg-gold hover:bg-gold-light text-warm-black font-semibold px-8 py-6 text-base glow-gold transition-all duration-300"
          >
            Iniciar conversa
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-sm text-text-muted mt-6">
            Sem formulários. Uma conversa rápida e personalizada.
          </p>
        </div>
      </div>
    </section>
  );
}
