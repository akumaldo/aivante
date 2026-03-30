# LocalFood MVP — Spec de Design

**Data**: 2026-03-12
**Objetivo**: App de delivery demo-first para rodada de investimento
**Timeline**: 6 semanas (deadline: ~2026-04-23)
**Cidade**: Taubaté-SP

---

## 1. Contexto

### Situacao atual

- Operacao real rodando em Taubate via plataforma whitelabel
- **250 restaurantes** cadastrados
- **2.400 entregadores** ativos
- Dados exportaveis em CSV (restaurantes, cardapios, entregadores)
- Motivacao para migrar: controle total do produto

### Objetivo do MVP

Construir um app de delivery visualmente polido com dados reais de Taubate para apresentar a investidores. O app demonstra a visao do produto e a base existente (250 restaurantes, 2.400 entregadores). Pagamento e tracking sao simulados — a operacao continua no whitelabel durante o desenvolvimento da plataforma completa.

### Dois publicos

1. **Investidor**: ve um produto que parece valer milhoes, com dados reais
2. **Time tecnico**: base de codigo real (monorepo, NestJS, React Native) que evolui direto para producao

---

## 2. Escopo

### O que ENTRA

| Entregavel | Descricao |
|---|---|
| **App Cliente** (React Native/Expo) | Browse restaurantes, cardapio, carrinho, checkout simulado, tracking simulado, perfil |
| **App Entregador** (React Native/Expo) | Dashboard com ganhos, feed de pedidos, fluxo de entrega com mapa, perfil |
| **App Restaurante** (React Native/Expo) | Dashboard, fila de pedidos, gestao de cardapio, horarios, perfil |
| **Backend API** (NestJS/Fastify) | Auth, restaurantes, cardapio, pedidos (mock), seed de dados |
| **Import CSV** | Script para importar 250 restaurantes + 2.400 entregadores do whitelabel |
| **Design System** | Componentes UI compartilhados entre os 3 apps, identidade visual propria |
| **Landing Page** | Pagina web com numeros, screenshots, visao do produto para investidor |

### O que FICA DE FORA (fase 2+)

| Item | Motivo |
|---|---|
| Pagamento real (Pagar.me, Pix, split) | Complexidade desproporcional para demo |
| Socket.IO / tracking real | Animacao simulada impressiona igual, custa 5% do esforco |
| Redis / BullMQ / filas | Nao necessario sem operacao real |
| Push notifications reais | Simulado na UI |
| Background geolocation | Sem operacao real de entregadores |
| OTP por SMS | Mock no MVP — login por email/senha |
| Upload de imagens | Fotos importadas do CSV ou placeholders |

---

## 3. Arquitetura Tecnica

### Monorepo

```
localfood/
├── apps/
│   ├── customer-app/          # React Native (Expo) — Cliente
│   ├── driver-app/            # React Native (Expo) — Entregador
│   ├── restaurant-app/        # React Native (Expo) — Restaurante
│   ├── api/                   # NestJS (Fastify) — Backend
│   └── landing/               # Astro ou Next.js — Landing page
├── packages/
│   ├── shared/                # Tipos TS, schemas Zod, constantes
│   ├── ui/                    # Design system (NativeWind)
│   └── config/                # ESLint, TSConfig, Prettier
├── scripts/
│   └── import-csv/            # Importacao do whitelabel
├── turbo.json
├── pnpm-workspace.yaml
└── CLAUDE.md
```

### Stack

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Mobile (3 apps) | React Native + Expo (SDK 52+) | Compartilhamento maximo de codigo, OTA updates, EAS Build |
| Estilizacao | NativeWind (Tailwind p/ RN) | Produtividade sem designer, consistencia |
| State (client) | Zustand v5 | Leve (~3KB), persiste carrinho com MMKV |
| State (server) | TanStack React Query v5 | Cache, refetch, loading states |
| Navegacao | Expo Router v4 | File-based routing, deep linking automatico |
| Backend | NestJS + Fastify | Modular, DI nativa, alta performance |
| Banco | PostgreSQL + PostGIS | Dados relacionais + geo queries |
| ORM | Prisma | Type-safe, migrations, seed |
| Validacao | Zod | Compartilhada client + server via packages/shared |
| Mapas | Mapbox | Free tier generoso, mapas offline, melhor custo |
| Landing | Astro | Estatico, rapido, zero JS desnecessario |
| Monorepo | Turborepo + pnpm | Cache, workspace protocol, zero overhead |

### Backend — Modulos MVP

```
api/src/modules/
├── auth/           # Login email/senha, JWT (access 15min + refresh 7d)
├── users/          # Perfil basico (cliente, entregador, restaurante)
├── restaurants/    # Listagem, busca por proximidade (PostGIS), cardapio
├── orders/         # Criar pedido, listar, status (state machine simplificada)
└── seed/           # Import CSV → banco
```

**Sem**: payments, delivery/dispatch, notifications, reviews, admin.

### Schema Prisma (MVP)

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis]
}

enum Role {
  CUSTOMER
  DRIVER
  RESTAURANT
}

enum OrderStatus {
  PLACED
  CONFIRMED
  PREPARING
  READY_FOR_PICKUP
  PICKED_UP
  EN_ROUTE
  DELIVERED
  CANCELLED
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   @unique
  name          String
  role          Role      @default(CUSTOMER)
  passwordHash  String
  avatarUrl     String?
  createdAt     DateTime  @default(now())

  addresses     Address[]
  orders        Order[]   @relation("CustomerOrders")
  driverProfile DriverProfile?
  restaurant    Restaurant?
}

model Address {
  id        String   @id @default(cuid())
  label     String   // "Casa", "Trabalho"
  street    String
  number    String
  complement String?
  neighborhood String
  city      String   @default("Taubate")
  state     String   @default("SP")
  zipCode   String
  location  Unsupported("geometry(Point, 4326)")
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

model DriverProfile {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  vehicleType   String   // "moto", "bicicleta"
  licensePlate  String?
  isOnline      Boolean  @default(false)
  rating        Float    @default(5.0)
  totalDeliveries Int    @default(0)
  totalEarnings Int      @default(0) // centavos
  createdAt     DateTime @default(now())

  orders        Order[]
}

model Restaurant {
  id             String   @id @default(cuid())
  ownerId        String   @unique
  owner          User     @relation(fields: [ownerId], references: [id])
  name           String
  slug           String   @unique
  description    String?
  phone          String
  imageUrl       String?
  location       Unsupported("geometry(Point, 4326)")
  deliveryRadius Float    @default(5000)
  isActive       Boolean  @default(true)
  isOpen         Boolean  @default(true)
  minOrderValue  Int      @default(0)
  avgPrepTime    Int      @default(30)
  deliveryFee    Int      @default(500)
  rating         Float    @default(4.5)
  totalOrders    Int      @default(0)
  createdAt      DateTime @default(now())

  categories     Category[]
  orders         Order[]
  hours          BusinessHours[]
}

model BusinessHours {
  id           String     @id @default(cuid())
  dayOfWeek    Int        // 0=domingo, 6=sabado
  openTime     String     // "08:00"
  closeTime    String     // "23:00"
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
}

model Category {
  id           String     @id @default(cuid())
  name         String
  sortOrder    Int        @default(0)
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  items        MenuItem[]
}

model MenuItem {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Int       // centavos
  imageUrl    String?
  isAvailable Boolean   @default(true)
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
}

model Order {
  id             String      @id @default(cuid())
  code           String      @unique // "A1B2C3"
  status         OrderStatus @default(PLACED)
  customerId     String
  customer       User        @relation("CustomerOrders", fields: [customerId], references: [id])
  restaurantId   String
  restaurant     Restaurant  @relation(fields: [restaurantId], references: [id])
  driverId       String?
  driver         DriverProfile? @relation(fields: [driverId], references: [id])
  deliveryAddress Json
  subtotal       Int
  deliveryFee    Int
  total          Int
  customerNote   String?
  placedAt       DateTime    @default(now())
  confirmedAt    DateTime?
  preparingAt    DateTime?
  readyAt        DateTime?
  pickedUpAt     DateTime?
  deliveredAt    DateTime?
  cancelledAt    DateTime?

  items          OrderItem[]
}

model OrderItem {
  id         String   @id @default(cuid())
  quantity   Int
  unitPrice  Int      // centavos — snapshot do preco no momento
  notes      String?  // "sem cebola"
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id])
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
}
```

---

## 4. Fluxos dos 3 Apps

### 4.1 Customer App — Telas

```
(auth)
├── onboarding.tsx          # 3 telas de boas-vindas com ilustracoes
├── login.tsx               # Email + senha
└── register.tsx            # Nome, email, phone, senha

(tabs)
├── index.tsx               # Home: restaurantes proximos, categorias, busca
├── search.tsx              # Busca por nome/categoria
├── orders.tsx              # Historico de pedidos
└── profile.tsx             # Perfil, enderecos, configuracoes

restaurant/
└── [id].tsx                # Cardapio: categorias, itens, adicionar ao carrinho

checkout/
└── index.tsx               # Resumo, endereco, pagamento (simulado), confirmar

tracking/
└── [id].tsx                # Mapa com entregador animado + status do pedido

order/
└── [id].tsx                # Detalhe do pedido + avaliacao (pos-entrega)
```

**Fluxo principal (demo):**
1. Abre app → onboarding (3 slides bonitos)
2. Login com conta demo pre-criada
3. Home mostra restaurantes reais de Taubate ordenados por distancia
4. Toca em restaurante → cardapio com categorias e itens
5. Adiciona itens ao carrinho (Zustand + MMKV persist)
6. Checkout: seleciona endereco, escolhe "Pix" → confirma
7. Tela de tracking: mapa Mapbox com animacao de entregador se movendo na rota
8. Apos animacao completar: "Pedido entregue!" → tela de avaliacao
9. Pedido aparece no historico

### 4.2 Driver App — Telas

```
(auth)
├── login.tsx               # Email + senha

(tabs)
├── index.tsx               # Dashboard: ganhos do dia, entregas feitas, toggle online
├── available.tsx           # Pedidos disponiveis (mock — aparecem periodicamente)
├── earnings.tsx            # Ganhos: dia/semana/mes (dados simulados)
└── profile.tsx             # Perfil, veiculo, dados bancarios (visual)

delivery/
└── [id].tsx                # Fluxo: ir ao restaurante → coletar → entregar
```

**Fluxo principal (demo):**
1. Login com conta de entregador demo
2. Dashboard: "Voce ganhou R$127,50 hoje" (simulado)
3. Toggle "Estou disponivel" → pedidos comecam a aparecer
4. Aceita pedido → mapa com rota ate o restaurante
5. Chega no restaurante → "Marcar como coletado"
6. Mapa com rota ate o cliente → "Confirmar entrega"
7. Volta ao dashboard com ganhos atualizados

### 4.3 Restaurant App — Telas

```
(auth)
├── login.tsx               # Email + senha

(tabs)
├── index.tsx               # Dashboard: pedidos do dia, faturamento, itens populares
├── orders.tsx              # Fila de pedidos: novos, preparando, prontos
├── menu.tsx                # Gestao de cardapio: categorias, itens, toggle disponibilidade
└── profile.tsx             # Perfil restaurante, horarios, configuracoes

order/
└── [id].tsx                # Detalhe do pedido: itens, cliente, aceitar/rejeitar
```

**Fluxo principal (demo):**
1. Login com conta de restaurante demo
2. Dashboard: "12 pedidos hoje, R$1.840 faturamento" (simulado)
3. Novo pedido aparece com som/vibra → toca para ver detalhes
4. Aceita pedido → status muda para "Preparando"
5. Marca como pronto → "Aguardando entregador"
6. Gestao de cardapio: desativa item, muda preco
7. Configura horarios de funcionamento

---

## 5. Design System

### Identidade visual

- **Nome**: LocalFood
- **Referência visual**: iFood (familiaridade brasileira) + Uber Eats (clean, premium)
- **Logo**: `logo_localfood.svg` — tipografia estilizada em laranja (#ED5D21)
- **Favicon**: `favicon-32x32.png` — ícone circular laranja

#### Cores

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#F15A24` | Botões, CTAs, elementos de destaque |
| `accent` | `#ED5C21` | Variação do primary, hover states |
| `background` | `#FFFFFF` | Fundo principal |
| `text-primary` | `#ED5C21` | Títulos, texto de destaque |
| `text-body` | `#1A1A1A` | Texto corpo (definir tom escuro) |
| `link` | `#ED5C21` | Links |

#### Tipografia

| Token | Fonte | Uso |
|---|---|---|
| `font-display` | **Cheese Sauce** | Headings, logo, títulos de seção |
| `font-body` | **Plus Jakarta Sans** | Body text, labels, inputs |

| Escala | Tamanho |
|---|---|
| `h1` | 48px |
| `h2` | 28.8px |
| `body` | 24px |

> **Nota**: Cheese Sauce é uma fonte custom — precisa ser bundled nos apps (expo-font) e na landing page. Plus Jakarta Sans está disponível no Google Fonts.

#### Spacing & Shape

- **Base unit**: 4px (escala: 4, 8, 12, 16, 20, 24, 32, 40, 48)
- **Border radius**: 0px — visual angular, moderno, sem cantos arredondados
- **Sombras**: sutis, sem exagero — profundidade sem "poluição visual"

#### Personalidade

- **Tom**: moderno
- **Energia**: média
- **Público**: food enthusiasts e negócios locais

- **Ícones**: Lucide Icons (leve, consistente, open-source)

### Componentes compartilhados (packages/ui)

```
packages/ui/src/
├── Button.tsx              # Primary, secondary, outline, ghost, sizes
├── Card.tsx                # Restaurant card, order card, menu item card
├── Input.tsx               # Text, phone, password, search
├── Badge.tsx               # Status badges (aberto, fechado, novo pedido)
├── BottomSheet.tsx          # Carrinho, filtros, detalhes
├── Avatar.tsx              # Foto do restaurante, entregador, cliente
├── Rating.tsx              # Estrelas (display + input)
├── StatusTimeline.tsx      # Timeline vertical de status do pedido
├── MapView.tsx             # Wrapper Mapbox com marker e rota animada
├── EmptyState.tsx          # "Nenhum pedido ainda" com ilustracao
├── Skeleton.tsx            # Loading placeholders
├── theme/
│   ├── colors.ts           # primary:#F15A24, accent:#ED5C21, bg:#FFF, text:#ED5C21
│   ├── spacing.ts          # Base 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48
│   ├── typography.ts       # Cheese Sauce (display), Plus Jakarta Sans (body)
│   └── shadows.ts          # sm, md, lg
└── index.ts                # Export barrel
```

---

## 6. Import de Dados (CSV → Banco)

### O que importar

| Entidade | Campos esperados | Volume |
|---|---|---|
| Restaurantes | nome, endereco, telefone, categoria, foto_url, horarios | 250 |
| Cardapios | restaurante_id, categoria, item, descricao, preco, foto_url | ~2.500-5.000 itens |
| Entregadores | nome, telefone, tipo_veiculo, placa | 2.400 |

### Script de importacao

```
scripts/import-csv/
├── import-restaurants.ts    # Le CSV → cria Restaurant + User (role: RESTAURANT)
├── import-menu.ts           # Le CSV → cria Category + MenuItem
├── import-drivers.ts        # Le CSV → cria User (role: DRIVER) + DriverProfile
├── geocode-addresses.ts     # Converte enderecos em coordenadas (Mapbox Geocoding)
└── generate-demo-accounts.ts # Cria contas demo para apresentacao
```

**Contas demo pre-criadas:**
- `cliente@demo.localfood.com.br` — cliente com endereco em Taubate
- `entregador@demo.localfood.com.br` — entregador com perfil completo
- `restaurante@demo.localfood.com.br` — restaurante com cardapio real

### Dados simulados complementares

Para a demo, alem dos dados reais, gerar:
- **Pedidos historicos**: 50-100 pedidos fake para popular historico e dashboards
- **Ganhos do entregador**: dados de ganhos dos ultimos 30 dias
- **Metricas do restaurante**: pedidos/dia, faturamento, itens populares
- **Avaliacoes**: ratings e comentarios nos restaurantes e entregadores

---

## 7. Tracking Simulado

### Como funciona (sem Socket.IO)

O tracking eh 100% client-side:

1. Ao confirmar pedido, app calcula rota entre restaurante e endereco de entrega (Mapbox Directions API)
2. Recebe polyline da rota (array de coordenadas)
3. Anima um marker ao longo da polyline usando `requestAnimationFrame`
4. Status muda automaticamente: "Restaurante confirmou" → "Preparando" → "Saiu para entrega" → "Entregue"
5. Cada etapa tem delay temporal simulado (ex: 3s confirmacao, 5s preparando, 15s entrega)

### No app do entregador

Fluxo inverso: entregador ve a rota e "percorre" ao tocar nos botoes de transicao (coletar, entregar). O mapa mostra a rota real entre os pontos.

### No app do restaurante

Pedidos "aparecem" via polling simulado ou timer. Restaurante aceita/rejeita e muda status.

---

## 8. Landing Page

### Estrutura

1. **Hero**: nome do app + tagline + mockup do app no celular + CTA
2. **Numeros**: "250 restaurantes | 2.400 entregadores | Taubate-SP"
3. **3 telas**: Cliente pede → Restaurante prepara → Entregador entrega (screenshots reais do app)
4. **Diferenciais**: "Taxa justa para restaurantes", "Entrega rapida", "Suporte local"
5. **Roadmap visual**: timeline mostrando expansao planejada
6. **CTA final**: "Baixe o app" com QR codes (TestFlight + Play Store internal)

### Tech

Astro (site estatico, zero JS, deploy no Cloudflare Pages gratuitamente).

---

## 9. Plano Executivo de Apresentacao

### Narrativa para investidor (3 atos)

**Ato 1 — "O problema eh real e ja resolvemos operacionalmente"**
- Taubate: 250 restaurantes, 2.400 entregadores, operacao rodando
- Dependemos de whitelabel → sem controle, sem margem, sem diferenciacao
- Mercado de delivery em cidades medias brasileiras eh mal atendido (iFood cobra taxas altas, suporte ruim)

**Ato 2 — "Estamos construindo nossa propria plataforma"**
- Demo ao vivo: abre app cliente no celular do investidor
- Navega restaurantes reais de Taubate, monta pedido, ve tracking
- Abre app entregador: dashboard, aceita pedido, fluxo de entrega
- Abre app restaurante: recebe pedido, gerencia cardapio
- "Tudo isso com nossa base real de 250 restaurantes e 2.400 entregadores"

**Ato 3 — "O investimento acelera a migracao e expansao"**
- Roadmap: pagamento real → migracao completa → cidades vizinhas
- Unit economics: taxa whitelabel vs plataforma propria
- O que o dinheiro compra: time, infraestrutura, marketing, expansao

### Demo flow (passo a passo)

| Passo | Acao | Impacto |
|---|---|---|
| 1 | Abre app cliente | Splash bonito, identidade propria |
| 2 | Home com 250 restaurantes | "Ja tem massa critica" |
| 3 | Busca "pizza" | Filtra em tempo real |
| 4 | Abre restaurante real | Cardapio com precos reais |
| 5 | Monta pedido, checkout | UX fluida |
| 6 | Tracking com entregador no mapa | "Tem tracking!" |
| 7 | Pedido entregue, avaliacao | Ciclo completo |
| 8 | Abre app entregador | Dashboard com ganhos |
| 9 | Aceita e entrega pedido | Dois lados funcionando |
| 10 | Abre app restaurante | Recebe pedido, gerencia cardapio |
| 11 | Landing page | Numeros e visao — material para compartilhar |

### Materiais de apoio

| Material | Formato | Proposito |
|---|---|---|
| Pitch deck | 10-12 slides | Apresentar ou enviar antes |
| Landing page | URL publica | Investidor acessa depois |
| App cliente | TestFlight + Play Internal | Testar no proprio celular |
| App entregador | TestFlight + Play Internal | Demonstrar os dois lados |
| App restaurante | TestFlight + Play Internal | Ecossistema completo |
| One-pager | PDF 1 pagina | Resumo para deixar com investidor |

---

## 10. Cronograma — 6 Semanas

| Semana | Foco | Entregaveis |
|---|---|---|
| **1** | Fundacao | Monorepo configurado, design system (tokens + 5 componentes core), schema Prisma, script de import CSV rodando, dados de Taubate no banco, auth basico (JWT) |
| **2** | App Cliente (browse) | Home com restaurantes reais, busca, pagina de restaurante com cardapio, visual polido |
| **3** | App Cliente (pedido) | Carrinho (Zustand + MMKV), checkout simulado, tracking animado no mapa, historico, avaliacao |
| **4** | App Entregador | Dashboard, toggle online, feed de pedidos, fluxo completo de entrega com mapa, perfil, ganhos |
| **5** | App Restaurante | Dashboard, fila de pedidos (aceitar/preparar/pronto), gestao de cardapio, horarios |
| **6** | Polish + Lancamento | Landing page, bug fixes, performance, testes em devices reais (iOS + Android), builds TestFlight/Play Store, ensaio da demo |

### Riscos e mitigacoes

| Risco | Probabilidade | Mitigacao |
|---|---|---|
| CSVs com dados sujos/incompletos | Alta | Semana 1: validar e limpar dados antes de importar. Gerar placeholders para campos faltantes |
| Mapbox com cobertura ruim em Taubate | Media | Testar na semana 1. Fallback: Google Maps se necessario |
| 3 apps em 6 semanas eh apertado | Media | Compartilhamento maximo via packages/ui. Se apertar, restaurant-app vira web responsivo (Next.js) |
| Sem designer — visual pode ficar generico | Media | Referencias fortes (iFood, Rappi), NativeWind com tokens bem definidos, componentes de alta qualidade |
| Builds para stores demoram | Baixa | EAS Build desde semana 1. TestFlight review pode levar 1-2 dias |

---

## 11. Infraestrutura MVP

| Componente | Servico | Custo/mes |
|---|---|---|
| Backend | Railway (NestJS) | R$25-50 |
| PostgreSQL + PostGIS | Railway plugin | R$25-35 |
| Imagens | Cloudflare R2 | R$0 |
| Landing | Cloudflare Pages | R$0 |
| Mapas | Mapbox free tier | R$0 |
| Builds | EAS Build free tier | R$0 |
| Dominio | Cloudflare | ~R$5 |
| **Total** | | **~R$55-90/mes** |

---

## 12. Contrato de API (endpoints MVP)

### Auth

| Metodo | Rota | Body/Params | Resposta | Roles |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | `{ name, email, phone, password, role }` | `{ accessToken, refreshToken, user }` | Public |
| POST | `/api/v1/auth/login` | `{ email, password }` | `{ accessToken, refreshToken, user }` | Public |
| POST | `/api/v1/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken }` | Public |
| GET | `/api/v1/auth/me` | — | `{ user }` | Authenticated |

**Access token**: JWT RS256, 15min, payload `{ sub, role, iat, exp }`.
**Refresh token**: opaque string, 7 dias, hash SHA-256 armazenado em banco (tabela `RefreshToken`). Rotation: cada refresh emite novo par e invalida anterior.
**Role enforcement**: NestJS Guard `@Roles('CUSTOMER')` em cada controller. Customer nao acessa endpoints de restaurant/driver e vice-versa.

### Restaurants

| Metodo | Rota | Params | Resposta | Roles |
|---|---|---|---|---|
| GET | `/api/v1/restaurants` | `?lat=&lng=&radius=5000&search=&category=` | `{ restaurants: [...], total }` | CUSTOMER |
| GET | `/api/v1/restaurants/:id` | — | `{ restaurant, categories, items }` | CUSTOMER |
| GET | `/api/v1/restaurants/:id/menu` | — | `{ categories: [{ items: [...] }] }` | CUSTOMER |
| PATCH | `/api/v1/restaurant/profile` | `{ name, description, phone, ... }` | `{ restaurant }` | RESTAURANT |
| PATCH | `/api/v1/restaurant/menu/items/:id` | `{ isAvailable, price, ... }` | `{ item }` | RESTAURANT |
| PATCH | `/api/v1/restaurant/hours` | `{ hours: [...] }` | `{ hours }` | RESTAURANT |

### Orders

| Metodo | Rota | Body/Params | Resposta | Roles |
|---|---|---|---|---|
| POST | `/api/v1/orders` | `{ restaurantId, items: [{menuItemId, quantity, notes}], deliveryAddress }` | `{ order }` | CUSTOMER |
| GET | `/api/v1/orders` | — | `{ orders: [...] }` | CUSTOMER, DRIVER, RESTAURANT (filtrado por role) |
| GET | `/api/v1/orders/:id` | — | `{ order, items, restaurant, driver }` | Owner do pedido |
| PATCH | `/api/v1/orders/:id/status` | `{ action: 'confirm'|'prepare'|'ready'|'pickup'|'deliver'|'cancel' }` | `{ order }` | Ver state machine abaixo |

### Drivers

| Metodo | Rota | Body | Resposta | Roles |
|---|---|---|---|---|
| GET | `/api/v1/driver/profile` | — | `{ driverProfile, stats }` | DRIVER |
| PATCH | `/api/v1/driver/status` | `{ isOnline: boolean }` | `{ driverProfile }` | DRIVER |
| GET | `/api/v1/driver/earnings` | `?period=day|week|month` | `{ total, deliveries, breakdown }` | DRIVER |

### Error format padrao

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Acao 'confirm' nao permitida no estado 'DELIVERED'"
}
```

---

## 13. Order State Machine — Transicoes validas

| De | Para | Acao | Quem pode | Condicao |
|---|---|---|---|---|
| PLACED | CONFIRMED | `confirm` | RESTAURANT | — |
| PLACED | CANCELLED | `cancel` | CUSTOMER, RESTAURANT | — |
| CONFIRMED | PREPARING | `prepare` | RESTAURANT | — |
| CONFIRMED | CANCELLED | `cancel` | RESTAURANT | — |
| PREPARING | READY_FOR_PICKUP | `ready` | RESTAURANT | — |
| PREPARING | CANCELLED | `cancel` | RESTAURANT | — |
| READY_FOR_PICKUP | PICKED_UP | `pickup` | DRIVER | — |
| PICKED_UP | EN_ROUTE | (automatico ao pickup) | DRIVER | — |
| EN_ROUTE | DELIVERED | `deliver` | DRIVER | — |

**Regras:**
- Cliente so cancela em PLACED.
- Restaurante cancela ate PREPARING.
- Ninguem cancela apos READY_FOR_PICKUP (no MVP).
- PICKED_UP → EN_ROUTE eh automatico (simplificacao MVP).
- Cada transicao grava timestamp no campo correspondente (confirmedAt, preparingAt, etc).

**No MVP (demo)**: as transicoes sao disparadas manualmente pelo usuario de cada app, ou automaticamente por timers para simular o fluxo completo no app do cliente.

---

## 14. Contrato de Importacao CSV

### Formato esperado

- **Encoding**: UTF-8
- **Delimitador**: ponto-e-virgula (`;`) — padrao brasileiro
- **Cabecalho**: primeira linha

### restaurants.csv

| Coluna | Tipo | Mapeia para | Obrigatorio |
|---|---|---|---|
| nome | string | Restaurant.name | Sim |
| descricao | string | Restaurant.description | Nao |
| endereco | string | Geocodificar → Restaurant.location | Sim |
| telefone | string | Restaurant.phone | Sim |
| categoria | string | Tag para filtro (ex: "Pizza", "Japonesa") | Nao |
| foto_url | string | Restaurant.imageUrl | Nao |
| taxa_entrega | number | Restaurant.deliveryFee (converter para centavos) | Nao (default: 500) |
| tempo_medio | number | Restaurant.avgPrepTime (minutos) | Nao (default: 30) |
| pedido_minimo | number | Restaurant.minOrderValue (converter para centavos) | Nao (default: 0) |

### menu_items.csv

| Coluna | Tipo | Mapeia para | Obrigatorio |
|---|---|---|---|
| restaurante_nome | string | Lookup → Restaurant.id | Sim |
| categoria | string | Category.name | Sim |
| item_nome | string | MenuItem.name | Sim |
| descricao | string | MenuItem.description | Nao |
| preco | number | MenuItem.price (converter para centavos) | Sim |
| foto_url | string | MenuItem.imageUrl | Nao |

### drivers.csv

| Coluna | Tipo | Mapeia para | Obrigatorio |
|---|---|---|---|
| nome | string | User.name | Sim |
| email | string | User.email | Nao (gerar se ausente) |
| telefone | string | User.phone | Sim |
| tipo_veiculo | string | DriverProfile.vehicleType | Nao (default: "moto") |
| placa | string | DriverProfile.licensePlate | Nao |

### Tratamento de dados ausentes

- **foto_url vazia**: usar placeholder por categoria (pizza.jpg, japonesa.jpg, etc)
- **email ausente em drivers**: gerar `driver_{phone}@localfood.temp`
- **endereco sem geocode**: logar warning, atribuir coordenada central de Taubate (-23.0226, -45.5557)
- **preco invalido**: logar erro, pular item

### Geocodificacao

- **API**: Mapbox Geocoding (free tier: 100.000 requests/mes)
- **Volume**: ~2.650 enderecos (250 restaurantes + 2.400 entregadores)
- **Rate limit**: 600 req/min → batch completo em ~5 minutos
- **Execucao**: uma vez no import, coordenadas salvas no banco
- **Retry**: 3 tentativas com backoff exponencial por endereco
- **Fallback**: se geocode falha apos retries, usar coordenada central de Taubate + logar para correcao manual

---

## 15. Estrategia de Deploy e Ambientes

| Ambiente | Proposito | Banco | URL |
|---|---|---|---|
| **dev** | Desenvolvimento local | PostgreSQL local (Docker) | localhost:3000 |
| **staging** | Testes pre-demo, validacao | Railway (separado) | api-staging.localfood.com.br |
| **prod** | Demo para investidor | Railway | api.localfood.com.br |

### CI/CD

- **GitHub Actions** (free tier: 2.000 min/mes)
- PR → lint + typecheck + testes unitarios
- Push para `main` → deploy automatico para staging
- Tag `v*` → deploy para prod
- EAS Build para apps mobile (triggered manualmente ou por tag)

### Variaveis de ambiente

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
MAPBOX_ACCESS_TOKEN=...
```

Gerenciadas via Railway dashboard (nao commitadas no repo).

---

## 16. Estrategia de Testes (MVP)

### Testes automatizados (minimo)

| Tipo | Escopo | Ferramenta |
|---|---|---|
| Unit | Order state machine (transicoes validas/invalidas) | Vitest |
| Unit | Import CSV (parsing, validacao, mapeamento) | Vitest |
| Integration | Auth flow (register, login, refresh, role guard) | Vitest + Supertest |
| Integration | Restaurants API (listagem, busca por proximidade) | Vitest + Supertest |
| Integration | Orders API (criar, listar, transicoes de status) | Vitest + Supertest |

### Checklist manual pre-demo

- [ ] App cliente: fluxo completo (onboarding → pedido → tracking → entregue)
- [ ] App entregador: login → dashboard → aceitar → entregar
- [ ] App restaurante: login → dashboard → aceitar pedido → gerenciar cardapio
- [ ] Testar em iPhone real (iOS 16+)
- [ ] Testar em Android real (Android 10+)
- [ ] Landing page carrega rapido e responsiva
- [ ] Contas demo funcionam sem erro
- [ ] Mapa carrega com tiles corretos para Taubate
- [ ] Nenhuma tela mostra "undefined", erro ou loading infinito
- [ ] Animacao de tracking roda suave (60fps)

---

## 17. Premissas

- **Time**: 1-2 desenvolvedores full-time dedicados ao MVP
- **Idioma**: Portugues (BR) apenas, sem internacionalizacao
- **Acessibilidade**: defaults da plataforma (sem investimento adicional no MVP)
- **Versoes fixadas**: Expo SDK 52, NestJS 11.x, Prisma 6.x, Zustand 5.x, TanStack Query 5.x, NativeWind 4.x
- **Landing page**: Astro (decisao final — nao Next.js)

---

## 18. Evolucao pos-MVP (fase 2+)

Apos a rodada de investimento, o roadmap para tornar o app funcional:

| Fase | Escopo | Estimativa |
|---|---|---|
| **Fase 2** — Pagamento | Integracao Pagar.me (Pix + cartao + split), webhooks, checkout real | 3-4 semanas |
| **Fase 3** — Real-time | Redis, Socket.IO, tracking real do entregador, dispatch | 3-4 semanas |
| **Fase 4** — Notificacoes | Push real (Expo Notifications), templates por evento | 1-2 semanas |
| **Fase 5** — Migracao | Migrar operacao do whitelabel para plataforma propria, beta com 10 restaurantes | 2-3 semanas |
| **Fase 6** — Producao | Onboarding completo, LGPD, SAC, monitoring, launch | 3-4 semanas |
| **Fase 7** — Expansao | Cidades vizinhas, marketing, analytics | Ongoing |

**Total ate producao completa: ~14-19 semanas apos o MVP** (alinhado com o estudo v2 de 18-20 semanas total).
