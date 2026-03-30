# LocalFood MVP — Plano de Implementacao (v2 — atualizado com deep spec)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir 3 apps mobile (cliente, entregador, restaurante) + backend + landing page + pitch deck + one-pager para a LocalFood, com dados de Taubate, para rodada de investimento em 6 semanas.

**Architecture:** Monorepo Turborepo com 3 apps React Native (Expo SDK 52, expo-dev-client — NAO Expo Go). Backend NestJS (Fastify). PostgreSQL + PostGIS. Design system compartilhado via packages/ui com NativeWind v4 (Metro plugin). Tracking e pagamento simulados — demo-first. Modo DEMO_MODE offline para seguranca na apresentacao.

**Tech Stack:** Expo SDK 52, expo-dev-client, NestJS 11, Prisma 6, PostgreSQL + PostGIS, NativeWind 4, Zustand 5, TanStack Query 5, Mapbox (@rnmapbox/maps), Astro, Turborepo, pnpm

**Spec:** `docs/superpowers/specs/2026-03-12-localfood-mvp-deep-spec.md`

---

## Pre-requisitos (ANTES de comecar a codar)

### Task 0: Criar contas e acessos necessarios

Estes itens bloqueiam builds e devem ser feitos nos primeiros 2 dias:

- [ ] **Step 1: Criar Apple Developer Account**

Acessar https://developer.apple.com/programs/enroll/
Custo: $99/ano. Review pode levar 24-48h.
**Bloqueia**: builds iOS, TestFlight.

- [ ] **Step 2: Criar Google Play Developer Account**

Acessar https://play.google.com/console/signup
Custo: $25 one-time.
**Bloqueia**: publicacao Android.

- [ ] **Step 3: Criar conta Mapbox**

Acessar https://account.mapbox.com/auth/signup/
Gratuito. Anotar:
- Public token (pk.xxx) → usado nos apps em runtime
- Secret token (sk.xxx) → usado apenas no build iOS (NAO commitar)

- [ ] **Step 4: Criar conta Expo (expo.dev)**

Acessar https://expo.dev/signup
Gratuito. Necessario para EAS Build.

- [ ] **Step 5: Criar conta Railway**

Acessar https://railway.app/
Trial gratuito. Para backend + PostgreSQL.

- [ ] **Step 6: Criar conta Cloudflare**

Acessar https://dash.cloudflare.com/sign-up
Gratuito. Para landing page + dominio (opcional).

- [ ] **Step 7: Registrar dominio (opcional)**

`localfood.com.br` ou similar via Cloudflare/Registro.br.

---

## Chunk 1: Fundacao (Semana 1)

### Task 1: Inicializar monorepo com Turborepo + pnpm

**Files:**
- Create: `localfood/package.json`
- Create: `localfood/pnpm-workspace.yaml`
- Create: `localfood/turbo.json`
- Create: `localfood/.npmrc`
- Create: `localfood/.gitignore`
- Create: `localfood/.nvmrc`
- Create: `localfood/CLAUDE.md`

- [ ] **Step 1: Criar diretorio e inicializar**

```bash
mkdir localfood && cd localfood
git init
pnpm init
```

- [ ] **Step 2: Criar .npmrc (CRITICO)**

```ini
node-linker=hoisted
auto-install-peers=true
strict-peer-dependencies=false
```

**Sem `node-linker=hoisted`, Metro e modulos nativos do React Native quebram com symlinks do pnpm. Este eh o ajuste mais importante do monorepo.**

- [ ] **Step 3: Configurar pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "scripts/*"
```

- [ ] **Step 4: Configurar turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".expo/**"]
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 5: Criar .nvmrc**

```
22
```

- [ ] **Step 6: Criar .gitignore**

```
node_modules/
dist/
.turbo/
.expo/
*.env.local
.env
ios/
android/
```

- [ ] **Step 7: Criar CLAUDE.md**

```markdown
# LocalFood

Monorepo de plataforma de delivery para Taubate-SP.
Demo-first MVP para rodada de investimento.

## Comandos
- `pnpm install` — instalar deps
- `pnpm dev` — rodar todos os apps em paralelo
- `pnpm build` — build de todos os packages
- `pnpm lint` — lint em todos os packages
- `pnpm typecheck` — type check em todos os packages

## Estrutura
- `apps/customer-app` — App do cliente (React Native/Expo)
- `apps/driver-app` — App do entregador (React Native/Expo)
- `apps/restaurant-app` — App do restaurante (React Native/Expo)
- `apps/api` — Backend (NestJS/Fastify)
- `apps/landing` — Landing page (Astro)
- `packages/shared` — Tipos, schemas Zod, constantes
- `packages/ui` — Design system compartilhado (NativeWind)
- `packages/config` — ESLint, TSConfig, Prettier

## Convencoes
- Valores monetarios SEMPRE em centavos (Int), nunca Float
- Validacao com Zod compartilhada entre client e server via @repo/shared
- Componentes UI compartilhados via @repo/ui
- Portugues brasileiro para textos do usuario, ingles para codigo
- Queries PostGIS via GeoService ($queryRaw), NAO via Prisma Client (campos Unsupported)

## Importante
- Expo Go NAO funciona (Mapbox requer expo-dev-client)
- .npmrc com node-linker=hoisted eh obrigatorio
- Mapbox secret token (sk.xxx) NUNCA no repo — usar EAS secrets
```

- [ ] **Step 8: Instalar deps globais do monorepo**

```bash
pnpm add -D -w turbo typescript @types/node
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: initialize monorepo with turborepo + pnpm"
```

---

### Task 2: Configurar packages/config (ESLint, TSConfig, Prettier)

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig/base.json`
- Create: `packages/config/tsconfig/react-native.json`
- Create: `packages/config/tsconfig/nestjs.json`
- Create: `packages/config/prettier/index.mjs`
- Create: `packages/config/eslint/base.mjs`

- [ ] **Step 1: Criar package.json**

```json
{
  "name": "@repo/config",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./tsconfig/*": "./tsconfig/*.json",
    "./prettier": "./prettier/index.mjs",
    "./eslint/*": "./eslint/*.mjs"
  }
}
```

- [ ] **Step 2: Criar tsconfig/base.json**

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 3: Criar tsconfig/react-native.json**

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022"],
    "paths": {
      "@repo/shared": ["../../packages/shared/src"],
      "@repo/ui": ["../../packages/ui/src"]
    }
  }
}
```

- [ ] **Step 4: Criar tsconfig/nestjs.json**

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

- [ ] **Step 5: Criar prettier/index.mjs**

```javascript
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
};
```

- [ ] **Step 6: Criar eslint/base.mjs**

```javascript
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
```

- [ ] **Step 7: Instalar deps**

```bash
cd packages/config
pnpm add -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier
```

- [ ] **Step 8: Commit**

```bash
git add packages/config
git commit -m "chore: add shared config package (tsconfig, eslint, prettier)"
```

---

### Task 3: Criar packages/shared (tipos, schemas Zod, constantes)

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/types/user.ts`
- Create: `packages/shared/src/types/restaurant.ts`
- Create: `packages/shared/src/types/order.ts`
- Create: `packages/shared/src/types/driver.ts`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/schemas/auth.ts`
- Create: `packages/shared/src/schemas/order.ts`
- Create: `packages/shared/src/schemas/restaurant.ts`
- Create: `packages/shared/src/schemas/index.ts`
- Create: `packages/shared/src/constants/index.ts`
- Create: `packages/shared/src/utils/currency.ts`
- Create: `packages/shared/src/utils/index.ts`

- [ ] **Step 1: Criar package.json**

```json
{
  "name": "@repo/shared",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./schemas": "./src/schemas/index.ts",
    "./constants": "./src/constants/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "dependencies": {
    "zod": "^3.23.0"
  }
}
```

- [ ] **Step 2: Criar todos os tipos**

Implementar conforme spec original (types/user.ts, restaurant.ts, order.ts, driver.ts) com enums Role, OrderStatus, PaymentMethod e interfaces User, Address, Restaurant, Category, MenuItem, Order, OrderItem, DriverProfile, DriverEarnings.

**Regra**: valores monetarios sempre `number` em centavos com comentario `// centavos`.

- [ ] **Step 3: Criar schemas Zod**

schemas/auth.ts: loginSchema, registerSchema
schemas/order.ts: createOrderSchema, updateOrderStatusSchema
schemas/restaurant.ts: searchRestaurantsSchema

Todos com mensagens de erro em portugues.

- [ ] **Step 4: Criar constants/index.ts**

ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, TAUBATE_CENTER ({lat, lng}), DEFAULT_DELIVERY_RADIUS, DEFAULT_DELIVERY_FEE, DEFAULT_AVG_PREP_TIME.

- [ ] **Step 5: Criar utils/currency.ts**

formatCurrency(cents) → "R$ 12,50", toCents(reais) → 1250, toReais(cents) → 12.50.

- [ ] **Step 6: Criar barrel exports e instalar deps**

```bash
cd packages/shared && pnpm install
```

- [ ] **Step 7: Commit**

```bash
git add packages/shared
git commit -m "feat: add shared package with types, schemas, and constants"
```

---

### Task 4: Criar Backend NestJS — Bootstrap + Auth (SEM @nestjs/passport)

**Files:**
- Create: `apps/api/` (scaffold NestJS)
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/src/main.ts`
- Create: `apps/api/src/app.module.ts`
- Create: `apps/api/src/modules/auth/auth.module.ts`
- Create: `apps/api/src/modules/auth/auth.controller.ts`
- Create: `apps/api/src/modules/auth/auth.service.ts`
- Create: `apps/api/src/modules/auth/guards/access-token.guard.ts`
- Create: `apps/api/src/modules/auth/guards/refresh-token.guard.ts`
- Create: `apps/api/src/modules/auth/guards/roles.guard.ts`
- Create: `apps/api/src/modules/auth/decorators/roles.decorator.ts`
- Create: `apps/api/src/modules/auth/decorators/current-user.decorator.ts`
- Create: `apps/api/src/modules/auth/decorators/public.decorator.ts`
- Create: `apps/api/src/common/pipes/zod-validation.pipe.ts`
- Create: `apps/api/src/common/services/prisma.service.ts`
- Create: `apps/api/test/auth.e2e-spec.ts`

- [ ] **Step 1: Scaffold NestJS com Fastify**

```bash
cd apps
npx @nestjs/cli new api --package-manager pnpm --skip-git
cd api
pnpm add @nestjs/platform-fastify @fastify/helmet @fastify/cors
pnpm add @prisma/client @nestjs/jwt @nestjs/config
pnpm add bcrypt zod
pnpm add -D prisma @types/bcrypt vitest @nestjs/testing supertest @types/supertest
```

**NAO instalar @nestjs/passport, passport, passport-jwt.** Usar @nestjs/jwt diretamente com guards customizados.

- [ ] **Step 2: Configurar Fastify adapter em main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.enableCors({ origin: '*' }); // MVP: aberto
  app.setGlobalPrefix('api/v1');

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

- [ ] **Step 3: Criar schema Prisma com PostGIS**

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

Copiar todos os models da spec original. Adicionar indices espaciais:

```prisma
model Restaurant {
  // ... campos ...
  location Unsupported("geometry(Point, 4326)")

  @@index([location], type: Gist)
}
```

**Nota**: campos `Unsupported` NAO aparecem no Prisma Client. Queries geo via GeoService ($queryRaw).

- [ ] **Step 4: Rodar Prisma migrate**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Verificar que a migration gerada inclui `CREATE EXTENSION IF NOT EXISTS "postgis"`.

- [ ] **Step 5: Criar PrismaService**

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
}
```

- [ ] **Step 6: Criar ZodValidationPipe**

```typescript
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      });
    }
    return result.data;
  }
}
```

- [ ] **Step 7: Implementar Auth module (SEM passport)**

**auth.service.ts:**
- `register()`: hash bcrypt cost 12, criar user, gerar tokens
- `login()`: verificar email, comparar hash, gerar tokens
- `refreshTokens()`: verificar refresh token hash, rotacionar (novo par, invalidar anterior)
- `generateTokens()`: access (JWT RS256, 15min) + refresh (JWT, 7d). Refresh token hash armazenado na coluna `hashedRefreshToken` da tabela User.

**access-token.guard.ts:**
- Global via APP_GUARD
- Extrai Bearer token do header Authorization
- Verifica com @nestjs/jwt
- Seta `request.user = { sub, email, role }`
- Respeita `@Public()` decorator para rotas abertas

**roles.guard.ts:**
- Global via APP_GUARD
- Le metadata `@Roles('CUSTOMER')` via Reflector
- Compara com `request.user.role`

**Decorators:**
- `@Public()`: SetMetadata('isPublic', true)
- `@Roles(...roles)`: SetMetadata('roles', roles)
- `@CurrentUser()`: createParamDecorator que le request.user

**auth.controller.ts:**
- `POST /auth/register` — @Public()
- `POST /auth/login` — @Public()
- `POST /auth/refresh` — usa RefreshTokenGuard
- `GET /auth/me` — retorna user autenticado

- [ ] **Step 8: Registrar guards globais no app.module.ts**

```typescript
providers: [
  { provide: APP_GUARD, useClass: AccessTokenGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
],
```

- [ ] **Step 9: Escrever testes de integracao para auth**

Testar: register → login → me → refresh → me com novo token.
Testar: role guard (customer nao acessa endpoint de restaurant).
Testar: token expirado retorna 401.
Testar: refresh token rotation (token antigo invalido apos refresh).

Run: `pnpm test:e2e`
Expected: todos passam.

- [ ] **Step 10: Commit**

```bash
git add apps/api
git commit -m "feat: add NestJS API with auth module (JWT, no passport), Prisma + PostGIS"
```

---

### Task 5: Criar modulo Restaurants + GeoService

**Files:**
- Create: `apps/api/src/common/services/geo.service.ts`
- Create: `apps/api/src/modules/restaurants/restaurants.module.ts`
- Create: `apps/api/src/modules/restaurants/restaurants.controller.ts`
- Create: `apps/api/src/modules/restaurants/restaurants.service.ts`
- Create: `apps/api/test/restaurants.e2e-spec.ts`

- [ ] **Step 1: Criar GeoService**

Wrapper para todas as queries PostGIS via `$queryRaw`:

```typescript
@Injectable()
export class GeoService {
  constructor(private prisma: PrismaService) {}

  async findRestaurantsNearby(lat: number, lng: number, radiusMeters: number, search?: string) {
    return this.prisma.$queryRaw<RestaurantWithDistance[]>`
      SELECT r.id, r.name, r.slug, r.description, r.phone, r."imageUrl",
        r."deliveryRadius", r."isActive", r."isOpen", r."minOrderValue",
        r."avgPrepTime", r."deliveryFee", r.rating, r."totalOrders",
        ST_Y(r.location::geometry) AS lat,
        ST_X(r.location::geometry) AS lng,
        ST_Distance(
          r.location::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
        ) AS "distanceMeters"
      FROM "Restaurant" r
      WHERE ST_DWithin(
        r.location::geography,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusMeters}
      )
      AND r."isActive" = true
      ${search ? Prisma.sql`AND r.name ILIKE ${'%' + search + '%'}` : Prisma.empty}
      ORDER BY "distanceMeters";
    `;
  }

  async insertPoint(table: string, id: string, lat: number, lng: number) {
    return this.prisma.$executeRaw`
      UPDATE ${Prisma.raw(`"${table}"`)}
      SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      WHERE id = ${id};
    `;
  }
}
```

- [ ] **Step 2: Escrever testes**

Testar: GET /restaurants com lat/lng retorna restaurantes ordenados por distancia.
Testar: search=pizza filtra corretamente.
Testar: GET /restaurants/:id retorna restaurante com categorias e itens.
Testar: GET /restaurants/:id/menu retorna cardapio completo.

- [ ] **Step 3: Implementar RestaurantsService + Controller**

Conforme contrato da deep spec secao API.
GET /restaurants: usa GeoService.findRestaurantsNearby
GET /restaurants/:id: Prisma Client normal (sem geo)
GET /restaurants/:id/menu: Prisma Client com include categories → items

- [ ] **Step 4: Rodar testes**

Run: `pnpm test:e2e`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api
git commit -m "feat: add restaurants module with GeoService (PostGIS $queryRaw)"
```

---

### Task 6: Criar modulo Orders (state machine)

**Files:**
- Create: `apps/api/src/modules/orders/orders.module.ts`
- Create: `apps/api/src/modules/orders/orders.controller.ts`
- Create: `apps/api/src/modules/orders/orders.service.ts`
- Create: `apps/api/src/modules/orders/order-state-machine.ts`
- Create: `apps/api/test/order-state-machine.spec.ts`
- Create: `apps/api/test/orders.e2e-spec.ts`

- [ ] **Step 1: Escrever testes unitarios da state machine**

Testar todas transicoes validas:
PLACED→CONFIRMED (RESTAURANT), PLACED→CANCELLED (CUSTOMER/RESTAURANT), CONFIRMED→PREPARING (RESTAURANT), PREPARING→READY_FOR_PICKUP (RESTAURANT), READY_FOR_PICKUP→PICKED_UP (DRIVER), PICKED_UP→EN_ROUTE (auto), EN_ROUTE→DELIVERED (DRIVER).

Testar transicoes invalidas: DELIVERED→CANCELLED (erro), CUSTOMER fazendo confirm (erro).

- [ ] **Step 2: Implementar order-state-machine.ts**

Transition map: array de `{ from, to, action, allowedRoles }`.
Metodo `transition(currentStatus, action, userRole)` → newStatus ou throw BadRequestException.

- [ ] **Step 3: Rodar testes unitarios**

Run: `pnpm test -- order-state-machine`
Expected: PASS

- [ ] **Step 4: Implementar orders controller + service**

POST /orders: validar items, calcular subtotal/total, gerar code (6 chars), criar order.
GET /orders: filtrado por role.
PATCH /orders/:id/status: usar state machine, gravar timestamp.

- [ ] **Step 5: Escrever e rodar testes e2e**

Run: `pnpm test:e2e`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/api
git commit -m "feat: add orders module with state machine"
```

---

### Task 7: Criar modulo Drivers

**Files:**
- Create: `apps/api/src/modules/drivers/drivers.module.ts`
- Create: `apps/api/src/modules/drivers/drivers.controller.ts`
- Create: `apps/api/src/modules/drivers/drivers.service.ts`

- [ ] **Step 1: Implementar endpoints**

GET /driver/profile — perfil + stats.
PATCH /driver/status — toggle isOnline.
GET /driver/earnings?period=day|week|month — dados simulados (seed).

- [ ] **Step 2: Commit**

```bash
git add apps/api/src/modules/drivers
git commit -m "feat: add drivers module with profile and earnings"
```

---

### Task 8: Script de importacao/geracao de dados

**Files:**
- Create: `scripts/import-csv/package.json`
- Create: `scripts/import-csv/src/import-from-csv.ts`
- Create: `scripts/import-csv/src/generate-fake-data.ts`
- Create: `scripts/import-csv/src/geocode.ts`
- Create: `scripts/import-csv/src/generate-demo.ts`
- Create: `scripts/import-csv/src/index.ts`

- [ ] **Step 1: Criar package.json**

```json
{
  "name": "@repo/import-csv",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "import": "tsx src/index.ts --source=csv",
    "generate": "tsx src/index.ts --source=generated",
    "demo": "tsx src/generate-demo.ts"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "csv-parse": "^5.5.0",
    "tsx": "^4.0.0"
  }
}
```

- [ ] **Step 2: Implementar generate-fake-data.ts (Plano B — contingencia)**

Gera dados realistas de Taubate:
- 250 restaurantes com nomes, categorias (Pizza, Japonesa, Hamburger, Brasileira, etc), enderecos reais de Taubate
- ~3.000-5.000 itens de cardapio com precos realistas por categoria
- 2.400 entregadores com nomes brasileiros gerados
- Coordenadas distribuidas pela area urbana de Taubate (centro: -23.0226, -45.5557)
- Fotos: usar placeholders por categoria

- [ ] **Step 3: Implementar import-from-csv.ts (Plano A)**

Le CSVs (`;` delimitado, UTF-8).
Cria User + Restaurant/DriverProfile.
Mapeia colunas conforme contrato da spec.
Logar warnings para dados faltantes.

- [ ] **Step 4: Implementar geocode.ts**

Wrapper Mapbox Geocoding API.
Rate limit: max 10 requests concorrentes.
Retry: 3 tentativas com backoff exponencial.
Fallback: centro de Taubate.
Volume: ~2.650 enderecos em ~5 minutos.

- [ ] **Step 5: Implementar generate-demo.ts**

3 contas demo:
- `cliente@demo.localfood.com.br` (CUSTOMER)
- `entregador@demo.localfood.com.br` (DRIVER)
- `restaurante@demo.localfood.com.br` (RESTAURANT)

50-100 pedidos historicos (DELIVERED), ganhos do entregador (30 dias), metricas do restaurante.

- [ ] **Step 6: Implementar index.ts (runner com flag --source)**

```bash
# Plano A:
pnpm import -- --source=csv --dir=./data/

# Plano B:
pnpm generate -- --source=generated
```

- [ ] **Step 7: Rodar geracao e verificar dados**

Run: `pnpm generate`
Expected: "Gerados: 250 restaurantes, ~4.000 itens, 2.400 entregadores, 3 contas demo, 75 pedidos"

- [ ] **Step 8: Commit**

```bash
git add scripts/import-csv
git commit -m "feat: add data import/generation scripts with CSV and fake data support"
```

---

### Task 9: Criar packages/ui — Design System

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/src/theme/colors.ts`
- Create: `packages/ui/src/theme/spacing.ts`
- Create: `packages/ui/src/theme/typography.ts`
- Create: `packages/ui/src/theme/index.ts`
- Create: `packages/ui/src/Button.tsx`
- Create: `packages/ui/src/Card.tsx`
- Create: `packages/ui/src/Input.tsx`
- Create: `packages/ui/src/Badge.tsx`
- Create: `packages/ui/src/Avatar.tsx`
- Create: `packages/ui/src/Rating.tsx`
- Create: `packages/ui/src/Skeleton.tsx`
- Create: `packages/ui/src/EmptyState.tsx`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: Definir tokens de design**

Paleta provisoria (verde — trocar quando identidade visual chegar):
- Primary: verde emerald (#10B981 como base)
- Gray scale, success, warning, error
- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48
- Typography: Inter, sizes definidos
- Icones: lucide-react-native

**Tokens centralizados**: trocar paleta depois eh mudar 1 arquivo.

- [ ] **Step 2: Implementar componentes core**

Todos com NativeWind (className):
- Button: primary, secondary, outline, ghost. Sizes sm/md/lg. Loading state.
- Card: elevated, outlined. Padding, border-radius 12.
- Input: label, placeholder, error, icone. Variantes text/password/search.
- Badge: status badges com cores semanticas.
- Avatar: circular, fallback iniciais. Sizes sm/md/lg.
- Rating: estrelas (display + input).
- Skeleton: loading animado. Variantes text/card/avatar.
- EmptyState: icone + titulo + descricao.

- [ ] **Step 3: Commit**

```bash
git add packages/ui
git commit -m "feat: add UI design system with core components and theme tokens"
```

---

### Task 10: Scaffold 3 apps Expo (com expo-dev-client + Mapbox + NativeWind)

**Files:**
- Create: `apps/customer-app/`
- Create: `apps/driver-app/`
- Create: `apps/restaurant-app/`

- [ ] **Step 1: Criar customer-app**

```bash
cd apps
npx create-expo-app customer-app --template tabs
cd customer-app
pnpm add nativewind react-native-reanimated
pnpm add @repo/shared @repo/ui
pnpm add zustand @tanstack/react-query react-native-mmkv
pnpm add @rnmapbox/maps expo-location expo-haptics
pnpm add expo-dev-client
```

- [ ] **Step 2: Configurar metro.config.js (monorepo + NativeWind)**

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

- [ ] **Step 3: Configurar tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
} satisfies Config;
```

- [ ] **Step 4: Configurar babel.config.js**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

- [ ] **Step 5: Criar global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6: Configurar app.config.ts com Mapbox plugin**

```typescript
export default {
  name: 'LocalFood',
  slug: 'localfood-customer',
  scheme: 'localfood-customer',
  plugins: [
    ['@rnmapbox/maps', {
      RNMapboxMapsImpl: 'mapbox',
      RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET_TOKEN,
    }],
    'expo-router',
  ],
  ios: { bundleIdentifier: 'com.localfood.customer' },
  android: { package: 'com.localfood.customer' },
  extra: { eas: { projectId: '...' } },
};
```

- [ ] **Step 7: Criar estrutura Expo Router para customer-app**

```
app/
├── _layout.tsx          # Root: QueryClientProvider, auth check, import global.css
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx        # placeholder
│   └── register.tsx     # placeholder
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator
│   ├── index.tsx        # Home (placeholder)
│   ├── search.tsx       # placeholder
│   ├── orders.tsx       # placeholder
│   └── profile.tsx      # placeholder
├── restaurant/[id].tsx  # placeholder
├── checkout/index.tsx   # placeholder
├── tracking/[id].tsx    # placeholder
└── order/[id].tsx       # placeholder
```

- [ ] **Step 8: Repetir Steps 2-7 para driver-app**

Mesma config de metro, tailwind, babel, app.config (slug: localfood-driver, bundle: com.localfood.driver).

Estrutura Expo Router:
```
app/
├── _layout.tsx
├── (auth)/login.tsx
├── (tabs)/ index.tsx, available.tsx, earnings.tsx, profile.tsx
└── delivery/[id].tsx
```

- [ ] **Step 9: Repetir Steps 2-7 para restaurant-app**

slug: localfood-restaurant, bundle: com.localfood.restaurant.

Estrutura Expo Router:
```
app/
├── _layout.tsx
├── (auth)/login.tsx
├── (tabs)/ index.tsx, orders.tsx, menu.tsx, profile.tsx
└── order/[id].tsx
```

- [ ] **Step 10: Inicializar EAS em cada app**

```bash
cd apps/customer-app && eas init
cd apps/driver-app && eas init
cd apps/restaurant-app && eas init
```

- [ ] **Step 11: Verificar que os 3 apps compilam**

```bash
cd apps/customer-app && npx expo prebuild --clean && npx expo run:ios
```

Expected: app abre no simulador com tabs e placeholders. **NAO usar Expo Go.**

- [ ] **Step 12: Commit**

```bash
git add apps/customer-app apps/driver-app apps/restaurant-app
git commit -m "feat: scaffold 3 Expo apps with expo-dev-client, NativeWind, Mapbox"
```

---

## Chunk 2: App Cliente — Browse (Semana 2)

### Task 11: Login/Registro (customer-app)

**Files:**
- Create: `apps/customer-app/stores/auth.ts`
- Create: `apps/customer-app/services/api.ts`
- Create: `apps/customer-app/services/demo-data.ts`
- Modify: `apps/customer-app/app/(auth)/login.tsx`
- Modify: `apps/customer-app/app/(auth)/register.tsx`

- [ ] **Step 1: Criar API service com suporte a DEMO_MODE**

```typescript
// services/api.ts
const DEMO_MODE = __DEV__ && process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

async function apiCall<T>(path: string, options?: RequestInit): Promise<T> {
  if (DEMO_MODE) return getDemoData<T>(path);
  // ... fetch real com base URL, JWT header, refresh automatico
}
```

- [ ] **Step 2: Criar demo-data.ts**

Dados hardcoded locais para modo offline. Restaurantes, cardapios, pedidos — tudo em JSON.
Usado como fallback quando DEMO_MODE=true ou quando API nao responde.

- [ ] **Step 3: Criar auth store (Zustand + MMKV)**

login(), register(), logout(). Persistir tokens no MMKV.

- [ ] **Step 4: Implementar telas de login e registro**

Componentes @repo/ui. Validacao Zod. Design referencia iFood.

- [ ] **Step 5: Auth guard no _layout.tsx**

Nao autenticado → login. Autenticado → tabs.

- [ ] **Step 6: Commit**

```bash
git add apps/customer-app
git commit -m "feat(customer): add login/register with auth store and DEMO_MODE support"
```

---

### Task 12: Home — Restaurantes proximos

**Files:**
- Modify: `apps/customer-app/app/(tabs)/index.tsx`
- Create: `apps/customer-app/services/restaurants.ts`
- Create: `apps/customer-app/components/RestaurantCard.tsx`
- Create: `apps/customer-app/components/CategoryFilter.tsx`

- [ ] **Step 1: Hook useNearbyRestaurants (TanStack Query)**

GET /restaurants?lat=&lng=&radius=5000. Coordenadas de Taubate. staleTime 5min.

- [ ] **Step 2: RestaurantCard**

Imagem, nome, rating, tempo, taxa, distancia. @repo/ui/Card + Rating + Badge.

- [ ] **Step 3: CategoryFilter**

ScrollView horizontal com chips. Filtro por categoria.

- [ ] **Step 4: Montar Home**

Header "Taubate, SP" + busca + categorias + FlatList de cards + Skeleton loading.

- [ ] **Step 5: Commit**

```bash
git add apps/customer-app
git commit -m "feat(customer): add home screen with nearby restaurants"
```

---

### Task 13: Busca

- [ ] **Step 1: Input com debounce 300ms, resultados em FlatList**
- [ ] **Step 2: Commit**

---

### Task 14: Restaurante + Cardapio + Carrinho

**Files:**
- Modify: `apps/customer-app/app/restaurant/[id].tsx`
- Create: `apps/customer-app/stores/cart.ts`
- Create: `apps/customer-app/components/MenuItemCard.tsx`

- [ ] **Step 1: Cart store (Zustand + MMKV)** — items, addItem, removeItem, subtotal, itemCount. Bloquear mistura de restaurantes.
- [ ] **Step 2: MenuItemCard + tela do restaurante** — Hero image, SectionList com categorias, floating cart bar.
- [ ] **Step 3: Commit**

---

## Chunk 3: App Cliente — Pedido (Semana 3)

### Task 15: Checkout

- [ ] **Step 1: CartItemRow, AddressSelector (demo hardcoded), PaymentSelector (visual)**
- [ ] **Step 2: Tela checkout** — resumo, endereco, pagamento, observacoes, subtotal/taxa/total, botao confirmar → POST /orders → navegar para tracking.
- [ ] **Step 3: Commit**

---

### Task 16: Tracking simulado (ShapeSource + requestAnimationFrame)

**Files:**
- Modify: `apps/customer-app/app/tracking/[id].tsx`
- Create: `apps/customer-app/hooks/useSimulatedTracking.ts`
- Create: `apps/customer-app/components/TrackingMap.tsx`
- Create: `apps/customer-app/components/OrderStatusTimeline.tsx`

- [ ] **Step 1: useSimulatedTracking hook**

1. Buscar rota via Mapbox Directions API (`geometries=geojson&overview=full`)
2. Extrair coordinates da LineString
3. Animar posicao via requestAnimationFrame + interpolacao entre pontos
4. Mudar status por timers: PLACED(0s) → CONFIRMED(3s) → PREPARING(6s) → READY(12s) → PICKED_UP(15s) → EN_ROUTE(15-45s) → DELIVERED(45s)
5. Retornar: { currentPosition, currentStatus, progress }

- [ ] **Step 2: TrackingMap com ShapeSource (NAO PointAnnotation)**

```tsx
// Rota: ShapeSource + LineLayer
// Marker animado: ShapeSource (Point GeoJSON) + SymbolLayer (icone moto)
// Camera seguindo marker
```

Usar `ShapeSource` com GeoJSON Point atualizado a cada frame. Performa melhor que PointAnnotation em dispositivos antigos.

- [ ] **Step 3: OrderStatusTimeline** — Timeline vertical com bolinhas e linhas.

- [ ] **Step 4: Montar tela** — Mapa 60%, bottom sheet com timeline + info entregador + ETA.

- [ ] **Step 5: Modo DEMO_MODE** — rota pre-calculada hardcoded (sem Directions API).

- [ ] **Step 6: Commit**

```bash
git add apps/customer-app
git commit -m "feat(customer): add tracking screen with animated delivery simulation"
```

---

### Task 17: Historico + Avaliacao + Perfil

- [ ] **Step 1: Tela historico** — FlatList de OrderCards. GET /orders.
- [ ] **Step 2: Detalhe pedido + RatingModal** — BottomSheet com estrelas.
- [ ] **Step 3: Perfil** — Avatar, nome, enderecos (visual), logout.
- [ ] **Step 4: Commit**

---

### Task 18: Onboarding (3 slides)

- [ ] **Step 1: 3 slides** — "Restaurantes de Taubate", "Entrega rapida", "Apoie o comercio local"
- [ ] **Step 2: Integrar no _layout** — flag onboarding_done no MMKV.
- [ ] **Step 3: Commit**

---

## Chunk 4: App Entregador (Semana 4)

### Task 19: Login + Auth (driver-app)

- [ ] **Step 1: Copiar auth store + API service do customer-app** (role DRIVER)
- [ ] **Step 2: Tela login** — "Area do Entregador"
- [ ] **Step 3: Commit**

---

### Task 20: Dashboard do Entregador

- [ ] **Step 1: OnlineToggle** — switch grande, PATCH /driver/status
- [ ] **Step 2: EarningsSummary** — ganhos do dia, entregas, rating
- [ ] **Step 3: StatsCards** — semana, mes
- [ ] **Step 4: Montar dashboard** — header, toggle, earnings, stats
- [ ] **Step 5: Commit**

---

### Task 21: Feed de Pedidos + Fluxo de Entrega

- [ ] **Step 1: useSimulatedOrders** — pedidos mock a cada 10-15s quando online
- [ ] **Step 2: OrderOfferCard** — restaurante, endereco, valor, timer 30s, aceitar/recusar
- [ ] **Step 3: Tela pedidos disponiveis**
- [ ] **Step 4: Fluxo entrega (delivery/[id])** — 4 etapas: ir ao restaurante → coletar → entregar → concluido. Mapa com rota em cada etapa. PATCH /orders/:id/status.
- [ ] **Step 5: Commit**

---

### Task 22: Ganhos + Perfil

- [ ] **Step 1: Tela ganhos** — tabs dia/semana/mes, grafico simples, lista entregas
- [ ] **Step 2: Perfil** — avatar, rating, veiculo, placa, logout
- [ ] **Step 3: Commit**

---

## Chunk 5: App Restaurante (Semana 5)

### Task 23: Login + Dashboard (restaurant-app)

- [ ] **Step 1: Auth** (role RESTAURANT)
- [ ] **Step 2: Dashboard** — pedidos hoje, faturamento, avaliacao, toggle aberto/fechado
- [ ] **Step 3: Commit**

---

### Task 24: Fila de Pedidos

- [ ] **Step 1: useSimulatedNewOrders** — pedidos mock a cada 15-20s com Haptics + som
- [ ] **Step 2: OrderQueueCard** — codigo, hora, itens, total, badge status
- [ ] **Step 3: Fila** — 3 secoes (Novos, Em preparo, Prontos). Acoes: aceitar, preparar, pronto.
- [ ] **Step 4: Detalhe pedido** — itens completos, acoes conforme status
- [ ] **Step 5: Commit**

---

### Task 25: Gestao de Cardapio

- [ ] **Step 1: Listagem** — SectionList categorias + itens
- [ ] **Step 2: Toggle disponibilidade** — switch por item, optimistic update
- [ ] **Step 3: Edicao de preco** — input inline, salvar
- [ ] **Step 4: Commit**

---

### Task 26: Perfil + Horarios

- [ ] **Step 1: Perfil** — nome, foto, endereco, rating, logout
- [ ] **Step 2: Editor de horarios** — 7 linhas (dom-sab), toggle + time pickers
- [ ] **Step 3: Commit**

---

## Chunk 6: Polish + Materiais (Semana 6)

### Task 27: Landing Page

- [ ] **Step 1: Scaffold Astro**

```bash
cd apps && npm create astro@latest landing -- --template minimal
cd landing && pnpm add @astrojs/tailwind tailwindcss
```

- [ ] **Step 2: Implementar secoes** — Hero, Stats ("250 restaurantes | 2.400 entregadores"), Features, Roadmap, CTA com QR codes
- [ ] **Step 3: Deploy Cloudflare Pages**
- [ ] **Step 4: Commit**

---

### Task 28: Pitch Deck (10-12 slides)

- [ ] **Step 1: Criar slides no Google Slides ou Figma**

| Slide | Conteudo |
|---|---|
| 1 | Capa: logo LocalFood + tagline |
| 2 | Problema: delivery em cidades medias |
| 3 | Solucao: plataforma propria, taxa justa |
| 4 | Tracao: 250 restaurantes, 2.400 entregadores |
| 5 | Produto: screenshots dos 3 apps (reais) |
| 6 | Demo: pausa para demo ao vivo |
| 7 | Modelo de negocio |
| 8 | Mercado: TAM/SAM/SOM cidades medias BR |
| 9 | Roadmap |
| 10 | Time |
| 11 | Ask: quanto e para que |
| 12 | Contato + QR code |

- [ ] **Step 2: Capturar screenshots reais dos 3 apps para os slides**
- [ ] **Step 3: Exportar PDF**

---

### Task 29: One-pager (PDF 1 pagina)

- [ ] **Step 1: Layout 1 pagina A4** — logo, problema, solucao, numeros, screenshot, modelo, roadmap, contato
- [ ] **Step 2: Exportar PDF**

---

### Task 30: Polish Visual

- [ ] **Step 1: Consistencia visual** — todos os apps usando mesmos tokens @repo/ui
- [ ] **Step 2: Animacoes** — transicoes, skeletons, pull-to-refresh, micro-animacoes
- [ ] **Step 3: Splash screen + icone** — identidade LocalFood nos 3 apps
- [ ] **Step 4: Error boundaries** — em todas as telas, fallback gracioso (nunca tela branca)
- [ ] **Step 5: Commit**

---

### Task 31: Builds TestFlight + Play Store

- [ ] **Step 1: Configurar eas.json nos 3 apps**

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "testflight": {
      "distribution": "store"
    }
  }
}
```

- [ ] **Step 2: Build iOS (TestFlight)**

```bash
cd apps/customer-app && eas build --platform ios --profile testflight
cd apps/driver-app && eas build --platform ios --profile testflight
cd apps/restaurant-app && eas build --platform ios --profile testflight
```

Submit: `eas submit --platform ios`

- [ ] **Step 3: Build Android (APK)**

```bash
cd apps/customer-app && eas build --platform android --profile preview
cd apps/driver-app && eas build --platform android --profile preview
cd apps/restaurant-app && eas build --platform android --profile preview
```

- [ ] **Step 4: Testar builds em devices reais (iOS + Android)**

---

### Task 32: Ensaio da Demo + Checklist Final

- [ ] **Step 1: Executar checklist manual**

- [ ] App cliente: onboarding → login → home → restaurante → carrinho → checkout → tracking → entregue → avaliacao
- [ ] App entregador: login → dashboard → online → aceitar → coletar → entregar → concluido
- [ ] App restaurante: login → dashboard → aceitar pedido → preparar → pronto → cardapio → horarios
- [ ] Testar em iPhone real (iOS 16+)
- [ ] Testar em Android real (Android 10+)
- [ ] Landing page carrega rapido e responsiva
- [ ] Contas demo funcionam sem erro
- [ ] Mapa carrega tiles corretos para Taubate
- [ ] Nenhuma tela mostra "undefined", erro ou loading infinito
- [ ] Animacao de tracking roda suave
- [ ] DEMO_MODE funciona offline (testar com airplane mode)
- [ ] Error boundaries capturam erros sem tela branca

- [ ] **Step 2: Ensaiar demo flow (5-7 minutos)**

Praticar os 11 passos do roteiro. Transicoes rapidas entre apps.

- [ ] **Step 3: Preparar device do investidor**

Pre-instalar 3 apps. Pre-logar contas demo. Cache pre-carregado. Device backup (Android) pronto.

- [ ] **Step 4: Bug fixes finais**

- [ ] **Step 5: Commit e tag**

```bash
git add .
git commit -m "chore: final polish and demo preparation"
git tag v0.1.0-demo
```

---

## Resumo

| Semana | Tasks | Foco |
|---|---|---|
| Pre | 0 | Criar contas (Apple, Google, Mapbox, Expo, Railway) |
| 1 | 1-10 | Monorepo, config, shared, backend (auth+restaurants+orders+drivers), import/geração dados, design system, scaffold 3 apps |
| 2 | 11-14 | Customer: login, home, busca, restaurante + cardapio + carrinho |
| 3 | 15-18 | Customer: checkout, tracking simulado, historico, onboarding |
| 4 | 19-22 | Driver: login, dashboard, feed pedidos, fluxo entrega, ganhos |
| 5 | 23-26 | Restaurant: login, dashboard, fila pedidos, cardapio, horarios |
| 6 | 27-32 | Landing, pitch deck, one-pager, polish, builds, ensaio demo |

**Total: 33 tasks (incluindo Task 0), 6 semanas, deadline ~23 abril 2026.**
