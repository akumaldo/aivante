import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Linkedin, Mail, Calendar, BarChart3, Sparkles } from 'lucide-react';

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
          className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 opacity-0"
        >
          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
            {/* Avatar */}
            <div className="mx-auto md:mx-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-violet-500/30 to-blue-500/30 flex items-center justify-center">
                <div className="w-28 h-28 md:w-44 md:h-44 rounded-xl bg-slate-800 flex items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold text-gradient tracking-tight">
                    BL
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
                Quem está por trás
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Bruno Lunardi
              </h2>
              <p className="text-sm text-slate-500 mb-4">Fundador da AIVANTE</p>
              <p className="text-slate-400 leading-relaxed mb-6">
                Experiência em gestão de sistemas complexos corporativos (Oil&Gas, SAP, Bancos)
                aplicada à construção de fluxos de IA. Não conecto APIs — traduzo problemas reais
                de negócio em arquiteturas de IA com validação rigorosa, controle de custos
                e resultados mensuráveis desde a primeira entrega.
              </p>

              {/* Services */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">Engenharia de IA</span>
                  </div>
                  <p className="text-xs text-slate-500">Do entendimento ao piloto em produção</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-medium text-white">AI Performance Framework</span>
                  </div>
                  <p className="text-xs text-slate-500">Gate entre piloto e escala — 5 pilares</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://linkedin.com/company/aivante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a
                  href="mailto:contato@aivante.com.br"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  E-mail
                </a>
                <a
                  href="#cta"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm"
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
