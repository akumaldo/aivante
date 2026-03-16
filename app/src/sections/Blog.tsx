import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';

interface Article {
  id: string;
  tag: string;
  title: string;
  lead: string;
  highlights: string[];
  insight: string;
}

const articles: Article[] = [
  {
    id: 'investimento',
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
    tag: 'Desafio',
    title: 'Apenas 39% das empresas que usam IA viram impacto real no lucro',
    lead: 'O gap entre adoção e resultado é o maior desafio do mercado brasileiro. Empresas de alto desempenho dedicam mais de 20% do orçamento digital exclusivamente para IA.',
    highlights: [
      '61% das PMEs não têm orçamento real ou KPIs definidos para IA',
      'Setup e higienização de dados consomem 30-50% do investimento',
      'Manutenção anual adiciona 15-25% sobre o investimento inicial',
    ],
    insight: 'O problema não é tecnológico — é de engenharia. Sem processo, medição e disciplina, IA vira custo sem retorno.',
  },
  {
    id: 'agentes',
    tag: 'Tendência',
    title: 'De assistentes passivos a agentes autônomos orquestrados',
    lead: '62% das empresas já experimentam com agentes de IA, e 23% os implementaram em escala. A previsão é que 33% das aplicações empresariais usarão agentes até 2028.',
    highlights: [
      'Agentes orquestrados: múltiplos agentes especializados sob um mestre',
      'RAG como padrão para ancorar respostas em dados proprietários',
      'Engenharia de Contexto substitui Engenharia de Prompt',
    ],
    insight: 'O valor não está na IA que responde — está na IA que executa fluxos completos com dados confiáveis.',
  },
  {
    id: 'seguranca',
    tag: 'Governança',
    title: 'Shadow AI e LGPD: apenas 20% das PMEs têm políticas de governança',
    lead: 'Funcionários submetendo dados confidenciais a plataformas de IA sem aprovação da TI é o maior risco invisível.',
    highlights: [
      'Shadow AI expõe empresas a violações da LGPD e multas da ANPD',
      'PL 2338/2023 avança para regulamentar uso ético de IA no Brasil',
      'Guardrails nativos bloqueiam exfiltração de PII antes do modelo',
    ],
    insight: 'Governança não é burocracia — é o que separa IA corporativa de IA amadora.',
  },
  {
    id: 'pmes',
    tag: 'PMEs',
    title: 'PMEs alcançam ROI de 100–200% com automações pontuais bem orquestradas',
    lead: '75% dos líderes de PMEs no Brasil estão otimistas sobre IA. O break-even de projetos focados acontece em 1 a 3 meses.',
    highlights: [
      'Faixa de entrada: R$ 100-500/mês para ferramentas básicas',
      'Faixa intermediária: R$ 300-1.500/mês para chatbots e CRM',
      'Faixa avançada: R$ 2.000-15.000/mês para analytics preditivo',
    ],
    insight: 'O segredo não é gastar mais — é começar pelo gargalo certo e medir antes de escalar.',
  },
  {
    id: 'talentos',
    tag: 'Capital humano',
    title: 'Brasil tem déficit de 30% em profissionais de TI — e isso é uma oportunidade',
    lead: '84% das empresas relatam dificuldade para contratar. A demanda supera a oferta em 200 mil profissionais.',
    highlights: [
      '52% apontam liderança engajada como fator mais crítico para sucesso',
      'Low-Code/No-Code cresce 30% ao ano, habilitando Citizen Developers',
      'Plataformas como Botpress, n8n e Dify democratizam a construção',
    ],
    insight: 'Você não precisa de um time de engenheiros — precisa de processo e da plataforma certa.',
  },
  {
    id: 'frontierops-operar',
    tag: 'FrontierOps',
    title: 'O que separa quem usa IA de quem opera com IA',
    lead: 'A diferença entre "usar uma ferramenta" e "operar um sistema" define quem captura valor de verdade.',
    highlights: [
      'Usar IA é reagir; operar com IA é antecipar e recalibrar',
      'Operadores constroem modelos mentais atualizados das capacidades e limitações',
      'A vantagem competitiva está na prática contínua, não no conhecimento pontual',
    ],
    insight: 'IA não é um projeto com começo e fim — é uma operação contínua que exige calibração constante.',
  },
  {
    id: 'frontierops-failure',
    tag: 'FrontierOps',
    title: 'Failure Models: por que "a IA pode errar" não é um modelo de risco',
    lead: 'Dizer que "a IA pode errar" é tão útil quanto dizer que "o mercado pode cair". Operadores constroem mapas precisos de onde e quando a IA falha.',
    highlights: [
      'Erros modernos da IA são sutis — parecem certos mas não são',
      'Um Failure Model precisa ser específico por domínio, tarefa e modelo',
      'A verificação cirúrgica substitui a revisão total — velocidade com segurança',
    ],
    insight: 'Um operador de fronteira sabe exatamente onde confiar e onde verificar.',
  },
  {
    id: 'frontierops-calibracao',
    tag: 'FrontierOps',
    title: 'A cada atualização de modelo, seus workflows precisam ser recalibrados',
    lead: 'Modelos de IA evoluem trimestralmente. O que você validou em novembro pode ser obsoleto em fevereiro.',
    highlights: [
      'Capacidades de IA mudam a cada release — o mapa de ontem não serve hoje',
      'Sub-calibração: você ainda faz manualmente o que a IA já domina',
      'Sobre-calibração: você confia na IA em áreas onde ela introduziu novas falhas',
    ],
    insight: 'Calibração não é um evento — é uma prática. Quem não recalibra está operando com um mapa desatualizado.',
  },
  {
    id: 'frontierops-atencao',
    tag: 'FrontierOps',
    title: 'O desafio não é a IA produzir mais — é saber onde colocar atenção humana',
    lead: 'Com agentes produzindo 10x mais output, o gargalo não é mais a produção — é a atenção humana.',
    highlights: [
      'A razão output-para-atenção é a nova métrica de produtividade',
      'Atenção humana deve ser alocada por risco, não distribuída uniformemente',
      'Sucesso se mede pelo resultado entregue por unidade de atenção investida',
    ],
    insight: 'Sucesso não se mede por horas trabalhadas, mas pela razão entre resultado entregue e atenção investida.',
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
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

      const cards = cardsRef.current?.querySelectorAll('.blog-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
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
      id="insights"
      ref={sectionRef}
      className="py-20 md:py-28 border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={titleRef} className="mb-14 opacity-0">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-6">
            <span className="w-8 h-px bg-gold" />
            Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white max-w-2xl mb-4">
            O cenário da IA no Brasil em 2025–2026
          </h2>
          <p className="text-text-secondary max-w-2xl leading-relaxed">
            Dados e análises sobre adoção, custos, riscos e oportunidades para empresas
            que querem ir além da experimentação.
          </p>
        </div>

        <div ref={cardsRef} className="space-y-0">
          {articles.map((article) => {
            const isExpanded = expandedId === article.id;

            return (
              <button
                key={article.id}
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
                className="blog-card opacity-0 w-full text-left border-t border-warm-border py-6 group transition-colors duration-300 block"
              >
                <div className="grid md:grid-cols-[8rem_1fr] gap-4 md:gap-8">
                  <span className="text-xs tracking-[0.15em] uppercase text-text-muted font-medium pt-1">
                    {article.tag}
                  </span>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2 group-hover:text-gold transition-colors duration-300 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {article.lead}
                    </p>

                    {isExpanded && (
                      <div className="mt-6 grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs tracking-[0.15em] uppercase text-text-muted font-medium mb-3">
                            Dados relevantes
                          </h4>
                          <ul className="space-y-2.5">
                            {article.highlights.map((h, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-l border-warm-border pl-8">
                          <h4 className="text-xs tracking-[0.15em] uppercase text-gold font-medium mb-3">
                            Visão AINOVA
                          </h4>
                          <p className="text-sm text-text-primary leading-relaxed italic">
                            &ldquo;{article.insight}&rdquo;
                          </p>
                        </div>
                      </div>
                    )}

                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted group-hover:text-gold transition-colors mt-4">
                      {isExpanded ? 'Fechar' : 'Ler mais'}
                      <ArrowRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-warm-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            Dados baseados em pesquisas IBR, Brasscom, Gartner, Adobe e Microsoft (2024–2026).
          </p>
          <button
            onClick={() => scrollToSection('cta')}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
          >
            Quer entender como isso se aplica ao seu negócio?
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
