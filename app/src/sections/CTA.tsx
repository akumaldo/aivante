import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  Building2,
  Wrench,
  BarChart3,
  Users,
  Lightbulb,
  Rocket,
  ShieldCheck,
  DollarSign,
  Gauge,
  AlertTriangle,
} from 'lucide-react';

// --- Step data ---

const areas = [
  { id: 'operacoes', label: 'Operações', icon: Wrench },
  { id: 'atendimento', label: 'Atendimento', icon: Users },
  { id: 'comercial', label: 'Comercial', icon: BarChart3 },
  { id: 'juridico', label: 'Jurídico / Compliance', icon: ShieldCheck },
  { id: 'financeiro', label: 'Financeiro / Backoffice', icon: DollarSign },
  { id: 'tecnologia', label: 'Tecnologia / Dados', icon: Lightbulb },
];

const stages = [
  {
    id: 'explorando',
    label: 'Explorando',
    description: 'Ainda avaliando se e como usar IA',
  },
  {
    id: 'pilotos',
    label: 'Pilotos',
    description: 'Testes pontuais, sem processo estruturado',
  },
  {
    id: 'producao',
    label: 'Em produção',
    description: 'IA ativa em workflows, mas sem métricas claras',
  },
  {
    id: 'escala',
    label: 'Escala',
    description: 'Múltiplas áreas usando IA, buscando governança',
  },
];

const challenges = [
  { id: 'custos', label: 'Custo de IA sem visibilidade de retorno', icon: DollarSign },
  { id: 'confiabilidade', label: 'Operação instável em produção', icon: AlertTriangle },
  { id: 'governanca', label: 'Falta de governança e rastreabilidade', icon: ShieldCheck },
  { id: 'roi', label: 'Dificuldade em provar ROI', icon: BarChart3 },
  { id: 'lentidao', label: 'Processo lento, IA não acelerou', icon: Gauge },
  { id: 'integracao', label: 'Integração com sistemas legados', icon: Building2 },
];

const TOTAL_STEPS = 4;

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step data
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
  });

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

  const canAdvance = () => {
    switch (step) {
      case 1:
        return selectedArea !== '';
      case 2:
        return selectedStage !== '';
      case 3:
        return selectedChallenge !== '';
      case 4:
        return contactData.name && contactData.email && contactData.company;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      area: selectedArea,
      stage: selectedStage,
      challenge: selectedChallenge,
      ...contactData,
    };

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const subject = encodeURIComponent('[AIPF] Solicitação via wizard');
        const body = encodeURIComponent(
          `Nome: ${contactData.name}\nEmpresa: ${contactData.company}\nCargo: ${contactData.role}\nÁrea: ${selectedArea}\nEstágio: ${selectedStage}\nDesafio: ${selectedChallenge}\nMensagem: ${contactData.message}`
        );
        window.open(
          `mailto:contato@aipf.com.br?subject=${subject}&body=${body}`,
          '_blank'
        );
        setSubmitted(true);
      }
    } catch {
      const subject = encodeURIComponent('[AIPF] Solicitação via wizard');
      const body = encodeURIComponent(
        `Nome: ${contactData.name}\nEmpresa: ${contactData.company}\nCargo: ${contactData.role}\nÁrea: ${selectedArea}\nEstágio: ${selectedStage}\nDesafio: ${selectedChallenge}\nMensagem: ${contactData.message}`
      );
      window.open(
        `mailto:contato@aipf.com.br?subject=${subject}&body=${body}`,
        '_blank'
      );
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="text-center mb-10">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Primeiro Passo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Vamos entender seu cenário
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Responda 3 perguntas rápidas para que possamos preparar uma conversa
            relevante para o seu contexto.
          </p>
        </div>

        <div
          ref={cardRef}
          className="glass rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto opacity-0"
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Solicitação enviada!
              </h3>
              <p className="text-slate-400">
                Entraremos em contato em até 24 horas úteis com uma proposta
                personalizada para o seu cenário.
              </p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-8">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <div key={i} className="flex-1 flex items-center gap-2">
                    <div
                      className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                        i + 1 <= step
                          ? 'bg-cyan-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  </div>
                ))}
                <span className="text-xs text-slate-500 ml-2">
                  {step}/{TOTAL_STEPS}
                </span>
              </div>

              {/* Step 1: Área */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Qual a principal área envolvida?
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Selecione a área onde IA tem (ou teria) maior impacto.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {areas.map((area) => {
                      const Icon = area.icon;
                      const isSelected = selectedArea === area.id;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => setSelectedArea(area.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-cyan-500/50 bg-cyan-500/10'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 mb-2 ${
                              isSelected ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                          />
                          <span
                            className={`text-sm font-medium block ${
                              isSelected ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {area.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Estágio */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Qual o estágio atual com IA?
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Isso nos ajuda a calibrar a conversa para o seu momento.
                  </p>
                  <div className="space-y-3">
                    {stages.map((stage) => {
                      const isSelected = selectedStage === stage.id;
                      return (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => setSelectedStage(stage.id)}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                            isSelected
                              ? 'border-cyan-500/50 bg-cyan-500/10'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <Rocket
                            className={`w-5 h-5 flex-shrink-0 ${
                              isSelected ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                          />
                          <div>
                            <span
                              className={`text-sm font-medium block ${
                                isSelected ? 'text-white' : 'text-slate-300'
                              }`}
                            >
                              {stage.label}
                            </span>
                            <span className="text-xs text-slate-500">
                              {stage.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Desafio */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Qual o maior desafio hoje?
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    O que mais incomoda ou bloqueia a evolução com IA.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {challenges.map((challenge) => {
                      const Icon = challenge.icon;
                      const isSelected = selectedChallenge === challenge.id;
                      return (
                        <button
                          key={challenge.id}
                          type="button"
                          onClick={() => setSelectedChallenge(challenge.id)}
                          className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'border-cyan-500/50 bg-cyan-500/10'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              isSelected ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isSelected
                                ? 'text-white font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {challenge.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Contato */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Como podemos entrar em contato?
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Retornamos em até 24h com uma proposta personalizada.
                  </p>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">
                          Nome *
                        </label>
                        <Input
                          placeholder="Seu nome"
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                          required
                          value={contactData.name}
                          onChange={(e) =>
                            setContactData({ ...contactData, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">
                          E-mail corporativo *
                        </label>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                          required
                          value={contactData.email}
                          onChange={(e) =>
                            setContactData({
                              ...contactData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">
                          Empresa *
                        </label>
                        <Input
                          placeholder="Nome da empresa"
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                          required
                          value={contactData.company}
                          onChange={(e) =>
                            setContactData({
                              ...contactData,
                              company: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-1 block">
                          Cargo / Área
                        </label>
                        <Input
                          placeholder="Seu cargo"
                          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                          value={contactData.role}
                          onChange={(e) =>
                            setContactData({
                              ...contactData,
                              role: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-1 block">
                        Contexto adicional (opcional)
                      </label>
                      <Textarea
                        placeholder="Conte mais sobre o processo que quer melhorar..."
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[80px]"
                        value={contactData.message}
                        onChange={(e) =>
                          setContactData({
                            ...contactData,
                            message: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Voltar
                  </Button>
                ) : (
                  <div />
                )}

                {step < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    disabled={!canAdvance()}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => setStep(step + 1)}
                  >
                    Próximo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={!canAdvance() || isSubmitting}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 glow-cyan transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {step === TOTAL_STEPS && (
                <p className="text-xs text-slate-500 text-center mt-4">
                  Ao enviar, você concorda com o uso das informações para contato
                  e entendimento do seu contexto profissional.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
