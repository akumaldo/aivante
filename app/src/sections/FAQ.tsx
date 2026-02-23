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
    question: 'Como funciona o processo? Preciso começar pela Fase 1?',
    answer:
      'Você entra pela fase que faz sentido para o seu momento. Quem está explorando IA começa pelo Entendimento (Fase 1). Quem já tem um caso de uso definido pode ir direto para o Piloto (Fase 2). Na conversa inicial, mapeamos seu cenário e definimos juntos o ponto de entrada.',
  },
  {
    question: 'Quando o AI Performance Framework é aplicado?',
    answer:
      'O Framework é aplicado quando a IA já está em produção — após o piloto. Ele mede o resultado real nos 5 pilares (vazão, custo por resultado, conversão em valor, confiabilidade e governança) e gera o scorecard que orienta a decisão de escalar. Não é um diagnóstico inicial, é uma avaliação de IA operando.',
  },
  {
    question: 'Quanto tempo leva para ter um workflow em produção?',
    answer:
      'O ciclo do piloto é de aproximadamente 6 semanas: 2 semanas de arquitetura e MVP, 2 de testes e travas de segurança, e 2 de deploy e integração. O tempo pode variar dependendo da complexidade do processo e das integrações necessárias.',
  },
  {
    question: 'Como vocês garantem que a IA não vai "alucinar"?',
    answer:
      'Implementamos Trust Architecture com Human-in-the-Loop (HITL): em fluxos críticos, a IA pesquisa, analisa e rascunha, mas o sistema exige um gate de aprovação humana antes de avançar. Além disso, usamos LLM Evals — testes automatizados que verificam a qualidade das saídas antes de ir para produção.',
  },
  {
    question: 'Como controlamos os custos de API?',
    answer:
      'Usamos Token Economics: roteamento inteligente onde modelos menores e econômicos filtram e estruturam dados, enquanto modelos premium atuam apenas no raciocínio complexo. O custo é monitorado por resultado entregue (Cost per Outcome), não apenas por token consumido.',
  },
  {
    question: 'Quais sistemas vocês integram?',
    answer:
      'Integramos com os principais sistemas corporativos: ERPs (SAP, Oracle), CRMs (Salesforce, HubSpot), plataformas de dados (Snowflake, Databricks), clouds (AWS, Azure, GCP), e ferramentas de produtividade (Slack, Teams, Jira). Cada integração é avaliada durante a fase de entendimento.',
  },
  {
    question: 'Serve para empresas que ainda não têm IA?',
    answer:
      'Sim. O processo foi desenhado para isso. A Fase 1 (Entendimento) mapeia seu cenário e identifica o melhor caso de uso para começar. A Fase 2 (Piloto) coloca o primeiro workflow em produção. Você avalia o resultado concreto antes de decidir qualquer expansão.',
  },
  {
    question: 'O que acontece depois do piloto?',
    answer:
      'Após o deploy, aplicamos o AI Performance Framework para medir os resultados. Com o scorecard em mãos, discutimos se faz sentido escalar para novos processos. A expansão é um próximo passo com escopo e investimento definidos separadamente — baseados em dados reais, não em suposições.',
  },
];

export default function FAQ() {
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
      id="faq"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Perguntas frequentes
          </h2>
        </div>

        <div ref={contentRef} className="max-w-3xl mx-auto opacity-0">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl border-0 px-6 data-[state=open]:border-cyan-500/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-white hover:text-cyan-400 py-5 text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
