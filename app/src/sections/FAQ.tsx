import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Como funciona o processo?',
    answer:
      'Nossa jornada segue três fases: Entendimento, Piloto e Escala. Na conversa inicial, mapeamos seu cenário e definimos juntos o ponto de entrada — você entra pela fase que faz sentido para o seu momento.',
  },
  {
    question: 'Quando o AI Performance Framework é aplicado?',
    answer:
      'O Framework é aplicado após o piloto, quando a IA já está em produção. Ele mede o resultado real e gera um scorecard que orienta a decisão de escalar — com dados, não com suposições.',
  },
  {
    question: 'Quanto tempo leva para ter um resultado?',
    answer:
      'O piloto leva aproximadamente 6 semanas, da arquitetura ao deploy. O tempo pode variar dependendo da complexidade do processo e das integrações necessárias.',
  },
  {
    question: 'Como vocês garantem a qualidade das respostas da IA?',
    answer:
      'Usamos uma arquitetura de validação com gates de aprovação humana em fluxos críticos. A IA pesquisa, analisa e rascunha, mas o sistema exige verificação antes de avançar.',
  },
  {
    question: 'Como controlam os custos?',
    answer:
      'Otimizamos o custo por resultado — não por token. Usamos roteamento inteligente entre modelos para que cada tarefa use o recurso adequado à sua complexidade.',
  },
  {
    question: 'Quais sistemas vocês integram?',
    answer:
      'Integramos com os principais sistemas corporativos: ERPs (SAP, Oracle), CRMs (Salesforce, HubSpot), plataformas de dados (Snowflake, Databricks), clouds (AWS, Azure, GCP) e ferramentas de produtividade (Slack, Teams, Jira). Cada integração é avaliada durante a fase de entendimento.',
  },
  {
    question: 'Serve para empresas que ainda não têm IA?',
    answer:
      'Sim. O processo foi desenhado para isso. A fase de Entendimento mapeia seu cenário e identifica o melhor caso de uso para começar. Você avalia o resultado concreto antes de decidir qualquer expansão.',
  },
  {
    question: 'O que acontece depois do piloto?',
    answer:
      'Aplicamos o AI Performance Framework para medir os resultados. Com o scorecard em mãos, decidimos juntos se faz sentido escalar para novos processos — sempre baseados em dados reais.',
  },
];

export default function FAQ() {
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
      id="faq"
      ref={sectionRef}
      className="py-20 md:py-28 border-b border-warm-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-gold font-medium mb-6">
              <span className="w-8 h-px bg-gold" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white leading-tight">
              Perguntas frequentes
            </h2>
          </div>

          <div ref={contentRef} className="opacity-0">
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-t border-warm-border border-b-0 rounded-none px-0"
                >
                  <AccordionTrigger className="text-left text-text-primary hover:text-gold py-6 text-base font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-text-secondary pb-6 leading-relaxed text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
