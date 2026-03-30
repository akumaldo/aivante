# LocalFood — Plano Executivo para Sócios

**Data**: 12 de março de 2026
**Documento**: Plano de desenvolvimento do app próprio + preparação para rodada de investimento
**Deadline**: ~7 de maio de 2026 (8 semanas)

---

## Situação Atual

Operamos uma plataforma de delivery em **Taubaté-SP** com:

- **250 restaurantes** cadastrados
- **2.400 entregadores** ativos
- Operação rodando sobre plataforma **whitelabel** (terceirizada)

### Por que migrar para app próprio

| Whitelabel | App Próprio |
|---|---|
| Sem controle sobre o produto | Controle total de features e roadmap |
| Mesma cara de outros apps que usam a mesma plataforma | Identidade própria, marca forte |
| Limitado ao que o fornecedor oferece | Podemos criar diferenciais competitivos |
| Margens comprimidas pela taxa da plataforma | Margens saudáveis |
| Dados no servidor de terceiros | Dados nossos, LGPD compliant |
| Dependência total do fornecedor | Autonomia tecnológica |

---

## O Plano: Duas Etapas

### ETAPA 1 — App Demo para Investidores (agora → 8 semanas)

**Objetivo**: Construir um app visualmente polido com nossos dados reais de Taubaté para apresentar na rodada de investimento.

**O que o investidor vai ver:**

1. **App do Cliente** — abre o app, vê 250 restaurantes reais de Taubaté com fotos e cardápios, monta um pedido, faz checkout, acompanha entregador se movendo no mapa
2. **App do Entregador** — dashboard com ganhos, aceita pedido, faz a entrega com rota no mapa
3. **App do Restaurante** — recebe pedido, gerencia cardápio, vê faturamento do dia
4. **Landing Page** — página web com números da operação, screenshots, visão do produto

**A mensagem para o investidor**: "Já temos 250 restaurantes e 2.400 entregadores operando. Agora estamos construindo nossa própria plataforma para ter controle total e escalar para outras cidades."

#### O que estamos entregando nesta etapa

| Entregável | Status | Descrição |
|---|---|---|
| App do Cliente (celular) | A construir | Navegar restaurantes, montar pedido, acompanhar entrega |
| App do Entregador (celular) | A construir | Dashboard de ganhos, aceitar e realizar entregas |
| App do Restaurante (celular) | A construir | Receber pedidos, gerenciar cardápio |
| Backend (servidor) | A construir | Sistema que conecta os 3 apps |
| Importação de dados | A construir | Migrar 250 restaurantes e 2.400 entregadores para o novo sistema |
| Landing Page | A construir | Página web para investidores |
| Design/Identidade Visual | A construir | Marca própria, visual premium |

#### O que esta etapa NÃO inclui (e por quê)

| Item | Por que fica pra depois | Risco de não ter? |
|---|---|---|
| Pagamento real (Pix, cartão) | Integração complexa, investidor não vai testar pagamento | Nenhum — operação continua no whitelabel |
| Rastreamento real do entregador | Animação simulada impressiona igualmente | Nenhum — visual é idêntico |
| Notificações no celular | Não necessário para demo | Nenhum |
| Suporte/SAC no app | Não necessário para demo | Nenhum |

**Ponto importante**: nada é jogado fora. Toda a base técnica (código, banco de dados, estrutura) evolui direto para o app de produção. Não estamos construindo um protótipo descartável — estamos construindo a fundação real do produto.

#### Cronograma desta etapa

| Semana | Período | O que acontece |
|---|---|---|
| **Semana 1** | mar 12–18 | Estrutura do projeto, contas (Apple, Google, Mapbox), identidade visual |
| **Semana 2** | mar 19–25 | Importação dos dados de Taubaté, backend base (auth, API) |
| **Semana 3** | mar 26 – abr 1 | App do cliente: tela inicial com restaurantes, busca, cardápio |
| **Semana 4** | abr 2–8 | App do cliente: carrinho, pedido, rastreamento animado |
| **Semana 5** | abr 9–15 | App do entregador completo |
| **Semana 6** | abr 16–22 | App do restaurante completo |
| **Semana 7** | abr 23–29 | Landing page, pitch deck, one-pager, publicação nas lojas (TestFlight/Play Store) |
| **Semana 8** | abr 30 – mai 6 | Ajustes finais, polimento visual, ensaio da demo, contingência |

> **Nota**: as semanas 7 e 8 incluem gordura para ajustes, imprevistos e polimento. O desenvolvimento principal é concluído na semana 6. As duas semanas adicionais garantem que a demo esteja impecável para a apresentação aos investidores.

#### Custo de infraestrutura

**~R$55-90/mês** para manter tudo rodando. Sem custos surpresa.

---

### ETAPA 2 — App Funcional + Migração (após investimento)

Após captar o investimento, o roadmap para substituir completamente o whitelabel:

| Fase | O que entra | Prazo estimado |
|---|---|---|
| **Pagamento real** | Pix, cartão de crédito, split automático (restaurante recebe a parte dele, nós recebemos a nossa) | 3-4 semanas |
| **Rastreamento real** | Entregador rastreado em tempo real pelo GPS, cliente acompanha no mapa | 3-4 semanas |
| **Notificações** | Push no celular: "Pedido confirmado", "Saiu para entrega", etc. | 1-2 semanas |
| **Migração piloto** | 10 restaurantes migram do whitelabel para nosso app. Validar tudo funcionando. | 2-3 semanas |
| **Lançamento Taubaté** | Todos os 250 restaurantes migrados. Operação 100% no app próprio. | 3-4 semanas |
| **Expansão** | Novas cidades, marketing, analytics avançado | Contínuo |

**Prazo total até operação completa no app próprio: ~14-19 semanas após o MVP.**

---

## Tecnologia Escolhida

Não é necessário entender os detalhes técnicos, mas é importante saber que as escolhas foram feitas pensando em:

| Princípio | O que significa |
|---|---|
| **Código único, 3 apps** | Os 3 apps (cliente, entregador, restaurante) compartilham a mesma base de código e visual. Mudar uma cor ou botão muda nos 3 ao mesmo tempo. |
| **iOS e Android ao mesmo tempo** | Uma única equipe de desenvolvimento entrega para as duas plataformas. Não precisamos de times separados. |
| **Atualização instantânea** | Podemos corrigir bugs e lançar funcionalidades novas sem esperar aprovação da App Store (até 7 dias). Correções críticas em minutos. |
| **Escalável** | A arquitetura suporta crescimento de 250 para 2.500+ restaurantes sem precisar reescrever nada. |
| **Dados são nossos** | Banco de dados próprio, servidores próprios, conformidade com LGPD. |
| **Custo controlado** | Infraestrutura começa em ~R$60/mês e escala proporcionalmente ao uso. |

### Stack resumida

| Componente | Tecnologia | Por quê |
|---|---|---|
| Apps (3) | React Native + Expo | Uma base de código → iOS + Android. Padrão de mercado. |
| Servidor | NestJS | Robusto, modular, usado por empresas como Adidas e Roche. |
| Banco de dados | PostgreSQL | O banco mais confiável do mundo. Suporta geolocalização nativa. |
| Mapas | Mapbox | Custo menor que Google Maps, suporta mapas offline para entregadores. |
| Hospedagem | Railway + Cloudflare | Confiável, escalável, custo acessível. |

---

## Materiais para a Rodada de Investimento

| Material | Formato | Quando fica pronto |
|---|---|---|
| App do Cliente | Celular (iOS + Android) | Semana 6 |
| App do Entregador | Celular (iOS + Android) | Semana 6 |
| App do Restaurante | Celular (iOS + Android) | Semana 6 |
| Landing Page | Site (URL) | Semana 7 |
| Pitch Deck | 10-12 slides | Semana 7 |
| One-pager | PDF 1 página | Semana 7 |
| **Demo polida e ensaiada** | **Celular do investidor** | **Semana 8** |

### Roteiro da demo para investidor

| Passo | O que mostrar | O que o investidor pensa |
|---|---|---|
| 1 | Abre app, tela bonita de boas-vindas | "Tem cara de produto sério" |
| 2 | Home com 250 restaurantes reais | "Já tem base de clientes" |
| 3 | Busca "pizza", encontra opções | "Funciona de verdade" |
| 4 | Abre restaurante, vê cardápio real com preços | "Os dados são reais" |
| 5 | Monta pedido, faz checkout | Experiência fluida |
| 6 | Vê entregador se movendo no mapa | "Tem rastreamento!" |
| 7 | Pedido entregue, avalia com estrelas | Ciclo completo |
| 8 | Mostra app do entregador com dashboard | "Tem os dois lados" |
| 9 | Mostra app do restaurante recebendo pedido | "Ecossistema completo" |
| 10 | Abre landing page com números | Material para compartilhar depois |

---

## Riscos e Como Estamos Lidando

| Risco | Como mitigamos |
|---|---|
| Prazo apertado | Os 3 apps compartilham 80% do código visual. 2 semanas de gordura no cronograma para imprevistos. |
| Sem designer no time | Usamos como referência os melhores apps de delivery do Brasil (iFood, Rappi). Ferramentas modernas permitem resultado profissional sem designer dedicado. |
| Dados do whitelabel podem não chegar a tempo | Temos plano B: geramos dados realistas baseados nos restaurantes reais de Taubaté caso os CSVs não sejam disponibilizados. |
| Investidor pode querer testar pagamento | Explicamos que é a próxima fase (3-4 semanas após investimento). A base está pronta. |
| Falha na demo ao vivo | App tem modo offline (DEMO_MODE) que funciona sem internet — demo à prova de falhas. |

---

## Resumo Executivo

1. **Temos**: 250 restaurantes + 2.400 entregadores operando em Taubaté
2. **Precisamos**: sair do whitelabel e ter app próprio para controlar o produto e escalar
3. **Estamos fazendo**: app demo com dados reais para impressionar investidores (8 semanas, com gordura)
4. **Após investimento**: ativamos pagamento real e migramos a operação (~14-19 semanas)
5. **Custo de infra**: ~R$60/mês agora, escala proporcionalmente
6. **Nada é descartável**: toda a base técnica do demo evolui para o produto final
