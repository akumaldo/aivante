# LocalFood MVP — Especificacao Aprofundada

> **Next step:** Use `superpowers:writing-plans` to convert this spec into an implementation plan.

**Data**: 2026-03-12
**Baseado em**: Spec original + pesquisa tecnica + entrevista com o fundador

---

## Goal

Construir 3 apps mobile (cliente, entregador, restaurante) + backend + landing page + pitch deck + one-pager para a LocalFood, plataforma de delivery operando em Taubate-SP com 250 restaurantes e 2.400 entregadores. O produto sera demonstrado no celular de investidores durante rodada de investimento. Deadline: 6 semanas (~23 abril 2026).

## Architecture Overview

Monorepo Turborepo com pnpm. 3 apps React Native (Expo SDK 52 com expo-dev-client — NAO Expo Go, por causa do Mapbox). Backend NestJS com Fastify. PostgreSQL com PostGIS para geolocalizacao. Prisma como ORM com camada GeoService customizada para queries espaciais ($queryRaw). Design system compartilhado via packages/ui com NativeWind v4 (Metro plugin). Tracking e pagamento simulados — demo-first.

**Decisao critica: expo-dev-client obrigatorio desde o dia 1.** O Mapbox (@rnmapbox/maps) requer modulos nativos e nao roda no Expo Go. Todos os devs precisam de builds customizados (EAS Build ou local com `expo run:ios/android`).

---

## Contingencia de Dados: CSV vs Dados Gerados

### Situacao

Os CSVs do whitelabel podem **nao chegar a tempo**. A empresa pode nao disponibilizar os dados antes do deadline. O plano precisa funcionar em ambos cenarios.

### Plano A: CSV disponivel

- Importar dados reais (restaurantes, cardapios, entregadores)
- Geocodificar enderecos via Mapbox
- Dados reais na demo impressionam mais

### Plano B: CSV nao disponivel (contingencia)

- Gerar dados realistas de Taubate usando fontes publicas:
  - Restaurantes: scraping do Google Maps/iFood para nomes, enderecos, categorias e fotos de restaurantes reais de Taubate
  - Cardapios: gerar cardapios por categoria (pizzaria tem X itens, japonesa tem Y) com precos realistas para Taubate
  - Entregadores: gerar 2.400 nomes brasileiros com dados ficticios
  - Coordenadas: usar enderecos reais de Taubate geocodificados
- **O investidor NAO saberá a diferenca** — os dados parecem reais, os numeros sao reais (250 restaurantes, 2.400 entregadores)

### Implementacao

O script de importacao (Task 8) deve suportar ambos:

```
scripts/import-csv/
├── src/
│   ├── import-from-csv.ts      # Plano A: le CSVs reais
│   ├── generate-fake-data.ts   # Plano B: gera dados realistas
│   ├── geocode.ts              # Compartilhado
│   ├── generate-demo.ts        # Contas demo + pedidos historicos
│   └── index.ts                # Flag: --source=csv ou --source=generated
```

**Decisao no inicio da semana 2**: se CSV nao chegou, ativar Plano B imediatamente. Nao esperar.

---

## Contas e Acessos Necessarios (bloqueia builds)

Estes itens devem ser resolvidos na **semana 1**, idealmente nos primeiros 2 dias:

| Conta | Custo | Quem cria | Bloqueia |
|---|---|---|---|
| **Apple Developer Program** | $99/ano (~R$500) | Fundador | Builds iOS, TestFlight |
| **Google Play Developer** | $25 one-time (~R$130) | Fundador | Builds Android, Play Store |
| **Mapbox** | Gratuito | Dev | Mapas nos apps, geocodificacao |
| **Expo (expo.dev)** | Gratuito (free tier) | Dev | EAS Build, distribuicao |
| **Railway** | Gratuito (trial) | Dev | Backend + PostgreSQL |
| **Cloudflare** | Gratuito | Dev | Landing page, dominio |

### Mapbox: dois tokens necessarios

1. **Public token (pk.xxx)**: usado no runtime dos apps para carregar mapas
2. **Secret token (sk.xxx)**: usado apenas no build iOS para baixar o SDK nativo. NAO commitar no repo — usar variavel de ambiente no EAS Build.

### EAS Build: free tier e limitacoes

- 30 builds/mes total
- 3 apps x 2 plataformas = 6 builds por ciclo de release
- ~5 ciclos/mes no free tier — **apertado mas viavel para o MVP**
- Se precisar de mais: plano Production ($99/mes)
- Build time: ~15-25min iOS, ~10-20min Android

---

## Ajustes Tecnicos Baseados na Pesquisa

### 1. .npmrc obrigatorio (pnpm + Expo)

```ini
# raiz do monorepo
node-linker=hoisted
auto-install-peers=true
strict-peer-dependencies=false
```

Sem `node-linker=hoisted`, Metro e modulos nativos do React Native quebram com symlinks do pnpm.

### 2. Metro config para monorepo + NativeWind + Mapbox

Cada app precisa de metro.config.js identico:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const monorepoRoot = path.resolve(__dirname, '../..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = withNativeWind(config, {
  input: './global.css',
  configPath: './tailwind.config.ts',
});
```

### 3. tailwind.config.ts deve incluir packages/

```typescript
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
};
```

### 4. Babel config com NativeWind

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

### 5. NestJS auth: sem @nestjs/passport

Usar `@nestjs/jwt` diretamente com guards customizados. Mais simples com Fastify, mais controle:

- `AccessTokenGuard`: global via APP_GUARD, verifica JWT no header Authorization
- `RolesGuard`: global via APP_GUARD, verifica @Roles() decorator
- `@Public()` decorator: bypassa auth para rotas publicas (login, register)
- `@CurrentUser()` decorator: extrai user do request
- Refresh token: hash bcrypt armazenado na tabela User (sem Redis)

### 6. Prisma + PostGIS: GeoService obrigatorio

Campos `Unsupported("geometry(Point, 4326)")` NAO aparecem no Prisma Client. Toda operacao geo precisa de raw SQL.

Criar `apps/api/src/common/services/geo.service.ts`:

```typescript
@Injectable()
export class GeoService {
  constructor(private prisma: PrismaService) {}

  async findRestaurantsNearby(lat: number, lng: number, radiusMeters: number) {
    return this.prisma.$queryRaw<RestaurantWithDistance[]>`
      SELECT r.*, u."name" as "ownerName",
        ST_Y(r.location::geometry) AS lat,
        ST_X(r.location::geometry) AS lng,
        ST_Distance(
          r.location::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
        ) AS "distanceMeters"
      FROM "Restaurant" r
      JOIN "User" u ON r."ownerId" = u.id
      WHERE ST_DWithin(
        r.location::geography,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusMeters}
      )
      AND r."isActive" = true
      ORDER BY "distanceMeters";
    `;
  }

  async insertLocation(table: string, id: string, lat: number, lng: number) {
    return this.prisma.$executeRaw`
      UPDATE ${Prisma.raw(`"${table}"`)}
      SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      WHERE id = ${id};
    `;
  }
}
```

### 7. Mapbox no Expo: config plugin

```json
// app.config.ts plugins
[
  "@rnmapbox/maps",
  {
    "RNMapboxMapsImpl": "mapbox",
    "RNMapboxMapsDownloadToken": "process.env.MAPBOX_SECRET_TOKEN"
  }
]
```

Requer `expo-dev-client`. NAO funciona no Expo Go.

### 8. Tracking animado: ShapeSource + requestAnimationFrame

NAO usar `PointAnnotation` para marker animado (re-mount causa jank). Usar:

```typescript
// Hook: useAnimatedRoute
// 1. Buscar rota: Mapbox Directions API (geometries=geojson)
// 2. Extrair coordinates da polyline
// 3. requestAnimationFrame: interpolar entre pontos consecutivos
// 4. Atualizar GeoJSON Point no ShapeSource

// Render: ShapeSource + SymbolLayer (icone de moto)
// Camera seguindo a posicao animada
```

Subsampling: para rotas longas, manter cada N-esimo ponto para reduzir re-renders.

---

## Demo no Celular do Investidor

### Riscos e mitigacoes

Demonstrar no device do investidor eh mais impactante mas mais arriscado. Mitigacoes:

| Risco | Mitigacao |
|---|---|
| Internet do local da reuniao eh ruim | Pre-carregar dados no app (TanStack Query prefetch + cache longo). Mapbox tiles offline para Taubate. |
| Backend Railway cai durante demo | Cache agressivo no app. Se possivel, modo "offline demo" com dados locais. |
| Investidor tem celular Android antigo | Testar em Android API 29+ (Android 10). APK funciona em qualquer Android. |
| Investidor tem iPhone sem TestFlight | Alternativa: build ad-hoc com `distribution: internal` (link direto, sem TestFlight) |
| App crasheia durante demo | Error boundaries em todas as telas. Fallback gracioso (nunca tela branca). |
| Mapa nao carrega | Placeholder com imagem estatica do mapa + "Carregando..." |

### Preparacao pre-demo

- [ ] Instalar app nos devices de todos os socios para teste
- [ ] Ter um celular backup (Android) com app instalado
- [ ] Testar na conexao do local da reuniao (se possivel)
- [ ] Dados pre-carregados no cache do app
- [ ] Screenshot de cada tela salvo offline como fallback absoluto

### Modo "demo offline" (seguranca extra)

Implementar flag `DEMO_MODE=true` no app que:
- Usa dados hardcoded locais (JSON) ao inves de chamar a API
- Tracking animado roda com rota pre-calculada (sem Directions API)
- Tudo funciona sem internet
- Ativar caso internet do local seja ruim

---

## Materiais de Apresentacao (no escopo)

### Pitch Deck (10-12 slides)

| Slide | Conteudo |
|---|---|
| 1. Capa | Logo LocalFood + tagline |
| 2. Problema | Delivery em cidades medias: taxas altas, suporte ruim, sem opcao local |
| 3. Solucao | Plataforma propria, taxa justa, suporte local, tecnologia moderna |
| 4. Tracao | 250 restaurantes, 2.400 entregadores, Taubate operando |
| 5. Produto | Screenshots dos 3 apps (tiradas do app real) |
| 6. Demo | "Vamos ver o app funcionando" (pausa para demo ao vivo) |
| 7. Modelo de negocio | Comissao por pedido, taxa de entrega, possibilidade de ads |
| 8. Mercado | TAM/SAM/SOM para delivery em cidades medias brasileiras |
| 9. Roadmap | Pagamento real → migracao → expansao para cidades vizinhas |
| 10. Time | Fundadores + time tecnico |
| 11. Ask | Quanto estao pedindo e para que (time, infra, marketing, expansao) |
| 12. Contato | Logo + email + QR code do app |

**Formato**: Google Slides ou Figma (exportar PDF). Design alinhado com identidade LocalFood.

### One-pager (PDF 1 pagina)

Layout em 1 pagina A4:
- Logo + tagline
- O problema (2 linhas)
- A solucao (2 linhas)
- Numeros: 250 restaurantes, 2.400 entregadores
- Screenshot do app
- Modelo de negocio (1 paragrafo)
- Roadmap (3 bullets)
- Contato

---

## Affected Files & Modules

### Novos (a criar)

**Monorepo root:**
- `localfood/package.json`
- `localfood/pnpm-workspace.yaml`
- `localfood/turbo.json`
- `localfood/.npmrc` — CRITICO: `node-linker=hoisted`
- `localfood/.gitignore`
- `localfood/.nvmrc`
- `localfood/CLAUDE.md`

**packages/config/**: ESLint, TSConfig (base, react-native, nestjs), Prettier
**packages/shared/**: Tipos (User, Restaurant, Order, Driver), Schemas Zod, Constantes, Utils
**packages/ui/**: Theme tokens, Button, Card, Input, Badge, Avatar, Rating, Skeleton, EmptyState, StatusTimeline, MapView wrapper

**apps/api/**: NestJS bootstrap, Prisma schema, modules (auth, users, restaurants, orders, drivers), GeoService, ZodValidationPipe
**apps/customer-app/**: Expo Router (onboarding, auth, tabs, restaurant, checkout, tracking, order), stores (auth, cart), services (api, restaurants)
**apps/driver-app/**: Expo Router (auth, tabs, delivery), stores (auth), services (api), hooks (useSimulatedOrders)
**apps/restaurant-app/**: Expo Router (auth, tabs, order), stores (auth), services (api), hooks (useSimulatedNewOrders)
**apps/landing/**: Astro pages (index), components (Hero, Stats, Features, Roadmap, CTA)

**scripts/import-csv/**: import-from-csv, generate-fake-data, geocode, generate-demo

---

## Data Model

Schema Prisma completo definido na spec original (secao 3). Ajuste critico:

- Campos `location` (geometry) sao `Unsupported` — manipulados via GeoService com $queryRaw
- Adicionar `@@index([location], type: Gist)` para performance espacial
- Migration deve incluir `CREATE EXTENSION IF NOT EXISTS "postgis"` como primeiro statement
- Usar feature `postgresqlExtensions` no Prisma schema:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [postgis]
}
```

---

## Business Logic

### Order State Machine

Transicoes definidas na spec original secao 13. Implementar como transition map puro TypeScript (sem xstate).

### Tracking Simulado

1. Ao confirmar pedido, buscar rota Mapbox Directions API (restaurante → endereco)
2. Receber GeoJSON LineString com coordinates
3. Animar marker via requestAnimationFrame + interpolacao entre pontos
4. Status muda por timers: PLACED(0s) → CONFIRMED(3s) → PREPARING(6s) → READY(12s) → PICKED_UP(15s) → EN_ROUTE(15-45s, animacao) → DELIVERED(45s)
5. Usar ShapeSource + SymbolLayer (nao PointAnnotation)

### Dados Simulados nos Apps

**Driver app**: pedidos aparecem via timer (setInterval 10-15s) quando online. Dados de restaurantes reais do banco.
**Restaurant app**: pedidos aparecem via timer (setInterval 15-20s). Haptics + som ao receber.
**Customer app**: historico pre-populado com pedidos seed.

---

## Error Handling

| Cenario | Comportamento |
|---|---|
| API fora do ar | Toast "Sem conexao com o servidor. Tentando novamente..." + retry automatico (TanStack Query) |
| Mapa nao carrega | Placeholder com "Carregando mapa..." + retry. Se DEMO_MODE, usar mapa estatico |
| Login falha | Mensagem clara: "Email ou senha incorretos" |
| Token expirado | Refresh automatico transparente. Se refresh falhar, redirecionar para login |
| Tela sem dados | EmptyState com ilustracao + mensagem amigavel |
| Crash geral | Error boundary no root _layout.tsx. Tela de "Algo deu errado" com botao "Tentar novamente" |

---

## Security & Authorization

### MVP (demo):
- JWT access token (15min) + refresh token (7d) com rotacao
- Role-based: CUSTOMER, DRIVER, RESTAURANT — guards globais
- Senhas: bcrypt cost 12
- CORS: aberto no MVP (origin: *)

### Nao necessario no MVP:
- Rate limiting, OTP, device fingerprinting, LGPD endpoints

---

## Testing Strategy

### Testes automatizados (minimo):
- Unit: order state machine, currency utils, schema validation
- Integration: auth flow, restaurants API (com PostGIS), orders API

### Testes manuais (checklist pre-demo):
- Fluxo completo em cada app (iOS + Android)
- Testar no celular mais antigo disponivel
- Testar com internet lenta (throttle)
- Testar DEMO_MODE offline

---

## Dependencies & Risks

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| CSV nao chega a tempo | **Alta** | Medio | Plano B: dados gerados realistas |
| ~~Paleta de cores atrasa~~ | ~~Media~~ | ~~Baixo~~ | **RESOLVIDO**: Identidade visual definida — primary #F15A24, accent #ED5C21, fontes Cheese Sauce (display) + Plus Jakarta Sans (body), border-radius 0px |
| Apple Developer Account demora | Media | **Alto** | Criar conta HOJE. Review pode levar 24-48h |
| 3 apps + pitch deck em 6 semanas | Media | Alto | Compartilhamento maximo via packages/ui. Se apertar, pitch deck simplificado |
| Mapbox com cobertura ruim em Taubate | Baixa | Alto | Testar semana 1. Fallback: Google Maps |
| EAS Build free tier insuficiente | Baixa | Medio | Upgrade para $99/mes se necessario |

---

## Out of Scope

- Pagamento real (Pagar.me, Pix, split)
- Tracking real (Socket.IO, Redis, GPS)
- Push notifications reais
- Background geolocation
- Upload de imagens
- OTP por SMS
- LGPD endpoints
- Admin panel
- Analytics
- i18n (apenas PT-BR)
- Acessibilidade alem dos defaults da plataforma

---

## Cronograma Revisado (6 semanas)

| Semana | Foco | Detalhes |
|---|---|---|
| **1** | Fundacao + contas | Criar contas (Apple, Google, Mapbox, Expo). Monorepo. Design system base. Backend (auth + restaurants + orders). Import/geração de dados. **Decisao CSV vs dados gerados no final da semana.** |
| **2** | App Cliente (browse) | Login, home, busca, restaurante + cardapio. Visual polido desde o inicio. |
| **3** | App Cliente (pedido) | Carrinho, checkout, tracking animado, historico, onboarding. DEMO_MODE. |
| **4** | App Entregador | Login, dashboard, feed pedidos, fluxo entrega com mapa, ganhos, perfil. |
| **5** | App Restaurante | Login, dashboard, fila pedidos, gestao cardapio, horarios. |
| **6** | Polish + materiais | Landing page. Pitch deck. One-pager. Bug fixes. Builds TestFlight/APK. Teste em devices. Ensaio da demo. |
