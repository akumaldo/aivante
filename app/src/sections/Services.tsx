import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ArrowDown, Search, Rocket, TrendingUp, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scrollToSection } from '@/lib/utils';

const services = [
  {
    id: 'entendimento',
    icon: Search,
    title: 'Entendimento',
    subtitle: 'Fase 1',
    color: 'cyan',
    description: 'Mapeamos seu cenário atual, identificamos o processo com maior potencial de impacto e desenhamos a arquitetura do primeiro workflow de IA.',
    features: [
      'Mapeamento de processos e stack atual',
      'Identificação do caso de uso prioritário',
      'Desenho de arquitetura do workflow',
      'Definição de métricas de sucesso',
      'Avaliação de viabilidade técnica e econômica',
    ],
    deliverables: [
      'Mapa de processos candidatos',
      'Proposta de arquitetura do piloto',
      'Critérios de sucesso definidos',
      'Estimativa de custo e timeline',
    ],
    target: 'Para qualquer estágio: desde quem está explorando IA até quem já tem pilotos e quer estruturar.',
  },
  {
    id: 'piloto',
    icon: Rocket,
    title: 'Piloto',
    subtitle: 'Fase 2',
    color: 'violet',
    description: 'Construímos o primeiro workflow em produção com travas de segurança, integrações reais e otimização de custo. Um escopo controlado para provar valor antes de escalar.',
    features: [
      'Engenharia de prompts e Trust Architecture',
      'Human-in-the-Loop e gates de aprovação',
      'Integração com sistemas existentes (ERP, CRM, SAP)',
      'Otimização de Token Economics',
      'Deploy em produção com observabilidade',
    ],
    deliverables: [
      'Workflow de IA em produção',
      'Painel de observabilidade (custos, latência, erros)',
      'Treinamento da equipe interna',
      'Dados de performance do piloto',
    ],
    target: 'Para quem já tem um caso definido ou passou pela Fase 1 e quer ir para produção.',
  },
  {
    id: 'escala',
    icon: TrendingUp,
    title: 'Escala',
    subtitle: 'Fase 3',
    color: 'emerald',
    description: 'Com o piloto validado e os dados do Framework em mãos, expandimos para novos processos com previsibilidade de custo, performance e governança.',
    features: [
      'Expansão para novos casos de uso priorizados pelo Framework',
      'Roteamento inteligente multi-modelo',
      'Governança e compliance em escala',
      'Otimização contínua de custo por resultado',
      'Monitoramento contínuo com o AI Performance Framework',
    ],
    deliverables: [
      'Novos workflows em produção',
      'Scorecard comparativo entre workflows',
      'Roadmap de expansão atualizado',
      'Relatórios executivos de ROI',
    ],
    target: 'Para quem já validou o piloto e tem dados concretos para justificar a expansão.',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string; button: string; dot: string }> = {
  cyan: {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    button: 'bg-cyan-500 hover:bg-cyan-400 text-slate-900',
    dot: 'bg-cyan-500',
  },
  violet: {
    bg: 'from-violet-500/20 to-violet-600/10',
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
    button: 'bg-violet-500 hover:bg-violet-400 text-white',
    dot: 'bg-violet-500',
  },
  emerald: {
    bg: 'from-emerald-500/20 to-emerald-600/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    button: 'bg-emerald-500 hover:bg-emerald-400 text-slate-900',
    dot: 'bg-emerald-500',
  },
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.service-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const gate = cardsRef.current?.querySelector('.framework-gate');
      if (gate) {
        gsap.fromTo(
          gate,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: gate,
              start: 'top 80%',
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
      id="services"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Como Funciona
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Um processo em 3 fases que se adapta ao seu estágio
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Você entra pela fase que faz sentido para o seu momento.
            O piloto prova valor em escopo controlado. O AI Performance Framework
            valida os resultados e serve como gate para a decisão de escalar.
          </p>
        </div>

        <div ref={cardsRef} className="max-w-5xl mx-auto">
          {/* Phase 1 */}
          {(() => {
            const service = services[0];
            const colors = colorMap[service.color];
            const Icon = service.icon;
            return (
              <div
                id={service.id}
                className={`service-card glass-card rounded-2xl p-8 border ${colors.border} opacity-0 hover:scale-[1.005] transition-all duration-300`}
              >
                <div className="lg:flex lg:gap-8">
                  <div className="lg:flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
                          {service.subtitle}
                        </span>
                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      </div>
                    </div>

                    <p className="text-slate-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3">O que inclui:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <Check className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:w-72 lg:flex-shrink-0">
                    <div className="p-4 bg-slate-800/50 rounded-xl mb-4">
                      <h4 className="text-sm font-semibold text-white mb-3">Entregáveis:</h4>
                      <ul className="space-y-1.5">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      {service.target}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Arrow down */}
          <div className="flex justify-center py-4">
            <ArrowDown className="w-5 h-5 text-slate-600 animate-bounce" />
          </div>

          {/* Phase 2 */}
          {(() => {
            const service = services[1];
            const colors = colorMap[service.color];
            const Icon = service.icon;
            return (
              <div
                id={service.id}
                className={`service-card glass-card rounded-2xl p-8 border ${colors.border} opacity-0 hover:scale-[1.005] transition-all duration-300`}
              >
                <div className="lg:flex lg:gap-8">
                  <div className="lg:flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
                          {service.subtitle}
                        </span>
                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      </div>
                    </div>

                    <p className="text-slate-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3">O que inclui:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <Check className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:w-72 lg:flex-shrink-0">
                    <div className="p-4 bg-slate-800/50 rounded-xl mb-4">
                      <h4 className="text-sm font-semibold text-white mb-3">Entregáveis:</h4>
                      <ul className="space-y-1.5">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      {service.target}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ============================================ */}
          {/* FRAMEWORK GATE — between Piloto and Escala   */}
          {/* ============================================ */}
          <div className="framework-gate relative my-8 opacity-0">
            {/* Connecting lines */}
            <div className="absolute left-1/2 -top-8 w-px h-8 bg-gradient-to-b from-violet-500/30 to-cyan-500/50" />
            <div className="absolute left-1/2 -bottom-8 w-px h-8 bg-gradient-to-b from-cyan-500/50 to-emerald-500/30" />

            <div className="relative glass-card rounded-2xl border-2 border-cyan-500/40 p-6 md:p-8 bg-gradient-to-r from-cyan-500/5 via-slate-900/50 to-violet-500/5">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 blur-xl -z-10" />

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-cyan-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      Gate
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      AI Performance Framework
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    Com o piloto em produção, aplicamos o Framework nos 5 pilares — vazão de inteligência,
                    custo por resultado, conversão em valor, confiabilidade e governança — para gerar o
                    scorecard que valida se o piloto entregou resultado e orienta a decisão de escalar.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-cyan-400">
                      Scorecard nos 5 pilares
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-violet-400">
                      KPIs executivos e operacionais
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-emerald-400">
                      Recomendação de escalar ou otimizar
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection('framework')}
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors flex-shrink-0"
                >
                  Ver pilares
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Arrow down */}
          <div className="flex justify-center py-4">
            <ArrowDown className="w-5 h-5 text-slate-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>

          {/* Phase 3 */}
          {(() => {
            const service = services[2];
            const colors = colorMap[service.color];
            const Icon = service.icon;
            return (
              <div
                id={service.id}
                className={`service-card glass-card rounded-2xl p-8 border ${colors.border} opacity-0 hover:scale-[1.005] transition-all duration-300`}
              >
                <div className="lg:flex lg:gap-8">
                  <div className="lg:flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
                          {service.subtitle}
                        </span>
                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      </div>
                    </div>

                    <p className="text-slate-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3">O que inclui:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <Check className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:w-72 lg:flex-shrink-0">
                    <div className="p-4 bg-slate-800/50 rounded-xl mb-4">
                      <h4 className="text-sm font-semibold text-white mb-3">Entregáveis:</h4>
                      <ul className="space-y-1.5">
                        {service.deliverables.map((item, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      {service.target}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Button
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-8 py-5 transition-all duration-300 hover:scale-[1.02]"
            onClick={() => scrollToSection('cta')}
          >
            Iniciar conversa exploratória
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <p className="mt-3 text-xs text-slate-500">
            Entendemos seu contexto e definimos juntos por qual fase começar.
          </p>
        </div>
      </div>
    </section>
  );
}
