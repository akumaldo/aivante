import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, TrendingUp, Shield, Users, DollarSign, Brain, AlertTriangle } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

interface Article {
  id: string;
  icon: React.ElementType;
  color: string;
  tag: string;
  title: string;
  lead: string;
  highlights: string[];
  insight: string;
}

const articles: Article[] = [
  {
    id: 'investimento',
    icon: TrendingUp,
    color: 'cyan',
    tag: 'Mercado',
    title: '80% das empresas brasileiras de médio porte vão aumentar investimento em TI',
    lead: 'O Brasil ocupa a segunda posição global em intenção de investimento tecnológico. A projeção da Brasscom aponta R$ 774 bilhões em transformação digital até 2028.',
    highlights: [
      '78% das empresas planejam investir mais em IA em 2025',
      'Custo de processamento de LLMs caiu 95% desde 2022',
      '88% das organizações já usam IA no dia a dia',
    ],
    insight: 'A barreira não é mais acesso à tecnologia — é capacidade de orquestrar, integrar dados e medir resultado.',
  },
  {
    id: 'gap',
    icon: AlertTriangle,
    color: 'amber',
    tag: 'Desafio',
    title: 'Apenas 39% das empresas que usam IA viram impacto real no lucro',
    lead: 'O gap entre adoção e resultado é o maior desafio do mercado brasileiro. Empresas de alto desempenho dedicam mais de 20% do orçamento digital exclusivamente para IA, com redesenho completo de fluxos.',
    highlights: [
      '61% das PMEs não têm orçamento real ou KPIs definidos para IA',
      'Setup e higienização de dados consomem 30-50% do investimento',
      'Manutenção anual adiciona 15-25% sobre o investimento inicial',
    ],
    insight: 'O problema não é tecnológico — é de engenharia. Sem processo, medição e disciplina, IA vira custo sem retorno.',
  },
  {
    id: 'agentes',
    icon: Brain,
    color: 'violet',
    tag: 'Tendência',
    title: 'De assistentes passivos a agentes autônomos orquestrados',
    lead: '62% das empresas já experimentam com agentes de IA, e 23% os implementaram em escala. A previsão do Gartner é que 33% das aplicações empresariais usarão agentes até 2028.',
    highlights: [
      'Agentes orquestrados: múltiplos agentes especializados sob um mestre',
      'RAG como padrão para ancorar respostas em dados proprietários',
      'Engenharia de Contexto substitui Engenharia de Prompt',
    ],
    insight: 'O valor não está na IA que responde — está na IA que executa fluxos completos com dados confiáveis.',
  },
  {
    id: 'seguranca',
    icon: Shield,
    color: 'emerald',
    tag: 'Governança',
    title: 'Shadow AI e LGPD: apenas 20% das PMEs têm políticas de governança de dados',
    lead: 'Funcionários submetendo dados confidenciais a plataformas de IA sem aprovação da TI é o maior risco invisível. Zero Trust Architecture e soberania de dados são exigências, não opcionais.',
    highlights: [
      'Shadow AI expõe empresas a violações da LGPD e multas da ANPD',
      'PL 2338/2023 avança para regulamentar uso ético de IA no Brasil',
      'Guardrails nativos bloqueiam exfiltração de PII antes do modelo',
    ],
    insight: 'Governança não é burocracia — é o que separa IA corporativa de IA amadora.',
  },
  {
    id: 'pmes',
    icon: DollarSign,
    color: 'cyan',
    tag: 'PMEs',
    title: 'PMEs alcançam ROI de 100-200% com automações pontuais bem orquestradas',
    lead: '75% dos líderes de PMEs no Brasil estão otimistas sobre IA. O break-even de projetos focados acontece em 1 a 3 meses. Economia média anual reportada: R$ 25.000 por empresa.',
    highlights: [
      'Faixa de entrada: R$ 100-500/mês para ferramentas básicas',
      'Faixa intermediária: R$ 300-1.500/mês para chatbots e CRM',
      'Faixa avançada: R$ 2.000-15.000/mês para analytics preditivo',
    ],
    insight: 'O segredo não é gastar mais — é começar pelo gargalo certo e medir antes de escalar.',
  },
  {
    id: 'talentos',
    icon: Users,
    color: 'violet',
    tag: 'Capital humano',
    title: 'Brasil tem déficit de 30% em profissionais de TI — e isso é uma oportunidade',
    lead: '84% das empresas relatam dificuldade para contratar. A demanda supera a oferta em 200 mil profissionais. AI Literacy em 4 níveis está se tornando o diferencial competitivo.',
    highlights: [
      '52% apontam liderança engajada como fator mais crítico para sucesso',
      'Low-Code/No-Code cresce 30% ao ano, habilitando Citizen Developers',
      'Plataformas como Botpress, n8n e Dify democratizam a construção',
    ],
    insight: 'Você não precisa de um time de engenheiros — precisa de processo e da plataforma certa.',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', dot: 'bg-cyan-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', dot: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
};

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.blog-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
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
      id="blog"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Insights
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            O cenário da IA no Brasil em 2025-2026
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Dados e análises sobre adoção, custos, riscos e oportunidades para empresas
            que querem ir além da experimentação e gerar resultado real com IA.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((article) => {
            const colors = colorMap[article.color];
            const Icon = article.icon;
            const isExpanded = expandedId === article.id;

            return (
              <button
                key={article.id}
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
                className={`blog-card glass-card rounded-2xl p-6 border ${colors.border} opacity-0 text-left transition-all duration-300 hover:scale-[1.02] ${
                  isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg}`}>
                    {article.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                  {article.title}
                </h3>

                {/* Lead */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {article.lead}
                </p>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Dados relevantes:</h4>
                        <ul className="space-y-2">
                          {article.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1.5 flex-shrink-0`} />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                        <h4 className={`text-sm font-semibold ${colors.text} mb-2`}>Visão AIVANTE:</h4>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                          "{article.insight}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Read more indicator */}
                <div className={`flex items-center gap-1 mt-3 text-xs ${colors.text} font-medium`}>
                  {isExpanded ? 'Fechar' : 'Ver mais'}
                  <ArrowRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Source note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-600">
            Dados baseados em pesquisas IBR, Brasscom, Gartner, Adobe e Microsoft (2024-2026).
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => scrollToSection('cta')}
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Quer entender como esses dados se aplicam ao seu negócio?
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
