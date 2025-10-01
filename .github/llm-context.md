# Contexto Completo do Projeto IrrigaAi

> **Documento de contexto para LLMs**  
> Este arquivo fornece informações essenciais sobre a estrutura, tecnologias e convenções do projeto completo (Backend + Frontend) para facilitar a compreensão e geração de código adequado.

---

## 📋 Visão Geral do Sistema

**Nome do Projeto:** IrrigaAi - Sistema de Avaliação de Irrigação Inteligente  
**Domínio:** Gestão e avaliação de sistemas de irrigação agrícola  
**Arquitetura:** Aplicação Full-Stack separada (Backend API REST + Frontend SPA)

### Repositórios
- **Backend:** douglasnobree/avalia-irriga-backend (Branch: master)
- **Frontend:** douglasnobree/avaliafront (Branch: master)

---

# BACKEND - API REST

## 🛠️ Stack Tecnológico

### Framework & Runtime
- **NestJS 11.x** (Framework Node.js)
- **Node.js** (Target: ES2023)
- **TypeScript 5.7.3**
- **Express** (Platform)

### Banco de Dados & ORM
- **Prisma 6.16.2** (ORM)
- **MySQL** (Database)
- **@prisma/client 6.16.2**

### Autenticação & Autorização
- **Better Auth 1.3.18**
- **@thallesp/nestjs-better-auth 2.0.0**
- **Passport 0.7.0** + **passport-jwt 4.0.1**
- **@nestjs/jwt 11.0.0**
- **bcrypt 6.0.0** (hash de senhas)

### Validação & Transformação
- **class-validator 0.14.2**
- **class-transformer 0.5.1**
- **Zod** (via Better Auth)

### Documentação
- **@nestjs/swagger 11.2.0** (OpenAPI/Swagger)
- Documentação interativa disponível em `/api`

### Serviços Externos
- **Nodemailer 7.0.6** (envio de emails)
  - Configuração SMTP
  - Templates para reset de senha e verificação

### Testing
- **Jest 30.0.0**
- **Supertest 7.0.0** (testes E2E)
- **@nestjs/testing 11.0.1**

---

## 📁 Estrutura de Diretórios (Backend)

```
avalia-irriga-backend/
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   └── migrations/                # Histórico de migrações
│       ├── migration_lock.toml
│       ├── 20250917144305_startup/
│       ├── 20250917150353_add_refresh_token/
│       ├── 20250917151454_update_refresh_token_type/
│       ├── 20250928151229_test/
│       ├── 20250928153611_better_auth/
│       └── 20250928163223_better_auth_plugins/
│
├── src/
│   ├── main.ts                    # Entry point da aplicação
│   ├── app.module.ts              # Módulo raiz
│   ├── protected.controller.ts    # Controller de rotas protegidas
│   │
│   ├── common/                    # Utilitários compartilhados
│   │   ├── index.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts # Decorator @Roles()
│   │   └── guards/
│   │       └── roles.guard.ts     # Guard de autorização por roles
│   │
│   ├── infra/                     # Infraestrutura
│   │   ├── email/
│   │   │   ├── email.service.ts   # Serviço de envio de emails
│   │   │   └── test-email.ts      # Script de teste de email
│   │   ├── logger/
│   │   │   └── logger.service.ts  # Serviço de logging
│   │   └── prisma/
│   │       ├── prisma.module.ts   # Módulo Prisma
│   │       └── prisma.service.ts  # Serviço Prisma
│   │
│   ├── lib/
│   │   └── auth.ts                # Configuração Better Auth
│   │
│   ├── property/                  # Módulo de Propriedades
│   │   ├── property.controller.ts
│   │   ├── property.module.ts
│   │   ├── property.service.ts
│   │   ├── dto/
│   │   │   ├── create-property.dto.ts
│   │   │   └── update-property.dto.ts
│   │   └── entities/
│   │       └── property.entity.ts
│   │
│   └── hydraulic-sector/          # Módulo de Setores Hidráulicos
│       ├── hydraulic-sector.controller.ts
│       ├── hydraulic-sector.module.ts
│       ├── hydraulic-sector.service.ts
│       ├── dto/
│       │   ├── create-hydraulic-sector.dto.ts
│       │   └── update-hydraulic-sector.dto.ts
│       └── entities/
│           └── hydraulic-sector.entity.ts
│
├── test/                          # Testes E2E
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── eslint.config.mjs
└── README.md
```

---

## 🗄️ Modelo de Dados (Prisma Schema)

### Autenticação & Usuários
```prisma
model User {
  id            String        @id
  name          String
  email         String        @unique
  emailVerified Boolean       @default(false)
  image         String?
  role          String?       @default("USER")
  banned        Boolean?      @default(false)
  banReason     String?
  banExpires    DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  sessions      Session[]
  accounts      Account[]
  members       Member[]
  invitations   Invitation[]
  Propriedade   Propriedade[]
}

model Session {
  id                   String   @id
  token                String   @unique
  expiresAt            DateTime
  userId               String
  ipAddress            String?
  userAgent            String?
  impersonatedBy       String?
  activeOrganizationId String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### Organizações (Multi-tenant)
```prisma
model Organization {
  id          String       @id
  name        String
  slug        String?      @unique
  logo        String?
  createdAt   DateTime
  metadata    String?
  
  members     Member[]
  invitations Invitation[]
}

model Member {
  id             String       @id
  organizationId String
  userId         String
  role           String
  createdAt      DateTime
  
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Invitation {
  id             String       @id
  organizationId String
  email          String
  role           String?
  status         String
  expiresAt      DateTime
  inviterId      String
  
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [inviterId], references: [id], onDelete: Cascade)
}
```

### Domínio de Irrigação
```prisma
model Propriedade {
  id               String   @id @unique @default(uuid())
  nome             String
  proprietario     String
  telefone         String
  email            String
  municipio        String
  estado           String
  latitude         Float
  longitude        Float
  area_total       Float
  area_irrigada    Float
  observacoes      String
  userId           String
  
  user             User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  Unidade_avaliada Unidade_avaliada[]
}

model Unidade_avaliada {
  id             String      @id @default(uuid())
  indentificacao String
  area_ha        Float
  propriedade_id String
  
  avaliacoes     Avaliacao[]
  propiedade     Propriedade @relation(fields: [propriedade_id], references: [id], onDelete: Cascade)
}

model Avaliacao {
  id               String            @id @default(uuid())
  data             DateTime          @default(now())
  area_irrigada    Float
  volume_agua      Float
  tempo_irrigacao  Float
  cud              Float
  cuc              Float
  offline_status   Boolean
  avaliador_id     String
  unidade_type     UnitModel
  unidade_id       String
  setor_id         String?
  pivo_id          String?
  
  pivo             Pivo_Central?     @relation(fields: [pivo_id], references: [id])
  setor            Setor_Hidraulico? @relation(fields: [setor_id], references: [id])
  unidade          Unidade_avaliada  @relation(fields: [unidade_id], references: [id])
  Comentario       Comentario[]
  Ponto_localizada Ponto_localizada[]
  Ponto_pivo       Ponto_pivo[]
}

model Setor_Hidraulico {
  id                     String      @id @default(uuid())
  fabricante             String
  modelo                 String
  vazao_nominal          Float
  pressao_trabalho       Float
  pressao_recomendada    Float
  dist_emissores         Float
  dist_laterais          Float
  filtro_tipo            String
  malha_filtro           String
  pressao_entrada        Float
  valvula_tipo           String
  energia_tipo           String
  condicoes_gerais       String
  num_emissores          Int
  freq_manutencao        String
  data_ultima_manutencao DateTime
  emissor_type           EmissorType
  
  avaliacoes             Avaliacao[]
}

model Pivo_Central {
  id                     String      @id @default(uuid())
  num_torres             Int
  comprimento            Float
  fabricante             String
  modelo                 String
  emissor_type           EmissorType
  energia_tipo           String
  potencia_motor         Float
  vazao_operacao         Float
  controle_tipo          String
  fertirrigacao          Boolean
  fonte_hidrica          String
  tempo_funcionamento    Float
  velocidade             Float
  bocal_tipo             String
  pressao_bocal          Float
  data_ultima_manutencao DateTime
  freq_manutencao        String
  problemas_observados   String
  data_ultima_avaliacoes DateTime
  
  avaliacoes             Avaliacao[]
}

model Comentario {
  id           String    @id @default(uuid())
  comentario   String
  avaliacao_id String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  avaliacao    Avaliacao @relation(fields: [avaliacao_id], references: [id], onDelete: Cascade)
  Foto         Foto[]
}

model Foto {
  id            String     @id @default(uuid())
  url           String
  descricao     String
  comentario_id String
  
  comentario    Comentario @relation(fields: [comentario_id], references: [id], onDelete: Cascade)
}

model Ponto_localizada {
  id           String    @id @default(uuid())
  eixo_x       Float
  eixo_y       Float
  volume_ml    Float
  tempo_seg    Int
  vazao_l_h    Float
  avaliacao_id String
  
  avaliacao    Avaliacao @relation(fields: [avaliacao_id], references: [id], onDelete: Cascade)
}

model Ponto_pivo {
  id               String    @id @default(uuid())
  sequencia        Int
  distancia        Float
  diametro_coletor Float
  volume_ml        Float
  tempo_seg        Int
  vazao_l_h        Float
  avaliacao_id     String
  
  avaliacao        Avaliacao @relation(fields: [avaliacao_id], references: [id], onDelete: Cascade)
}
```

### Enums
```prisma
enum UserRole {
  USER
  ADMIN_FAZENDA
  AVALIADOR
  ADMIN
}

enum UnitType {
  LOCALIZADA
  PIVO
}

enum EmissorType {
  MICROMICROASPERSOR
  GOTEJAMENTO
}

enum UnitModel {
  SETOR_HIDRAULICO
  PIVO_CENTRAL
}
```

---

## 🔐 Autenticação & Autorização

### Better Auth Configuration
```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3333',
  trustedOrigins: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3333'],
  
  plugins: [
    openAPI(),        // OpenAPI documentation
    admin(),          // Admin features
    organization(),   // Multi-tenant support
  ],
  
  database: prismaAdapter(prisma, { provider: 'mysql' }),
  
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await emailService.sendResetPasswordEmail(user.email, url, token);
    },
  },
  
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await emailService.sendVerificationEmail(user.email, url, token);
    },
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      prompt: 'select_account'
    }
  },
  
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
        defaultValue: 'USER',
      },
    },
  },
});
```

### Roles & Guards
```typescript
// Decorator @Roles()
@Roles(UserRole.ADMIN, UserRole.ADMIN_FAZENDA)
async adminOnlyEndpoint() { ... }

// RolesGuard verifica permissões baseadas em roles
// Deve ser usado com AuthGuard
```

### Níveis de Acesso
- **USER**: Acesso básico ao sistema
- **AVALIADOR**: Pode criar e gerenciar avaliações
- **ADMIN_FAZENDA**: Admin de uma fazenda/propriedade específica
- **ADMIN**: Acesso administrativo completo

---

## 🌐 Configuração da API

### Main Configuration (src/main.ts)
```typescript
- Port: 3333 (padrão NestJS)
- CORS: Habilitado para http://localhost:3000
- Credentials: true
- Global Validation Pipe: whitelist, transform, forbidNonWhitelisted
- Swagger UI: /api
- Body Parser: Desabilitado (Better Auth requer controle manual)
```

### Swagger Documentation
```typescript
Title: 'Avalia Irriga API'
Version: '1.0'
Tags:
  - Autenticação
  - Rotas Protegidas
  - avalia-irriga
Bearer Auth: Habilitado
```

---

## 🔧 Variáveis de Ambiente (Backend)

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/avalia_irriga"

# Better Auth
BETTER_AUTH_URL="http://localhost:3333"
BETTER_AUTH_SECRET="your-secret-key"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM_NAME="Avalia Irriga"
```

---

## 📦 Scripts Disponíveis (Backend)

```bash
npm run start:dev        # Desenvolvimento com hot reload
npm run start:prod       # Produção
npm run build            # Build
npm run lint             # ESLint
npm run format           # Prettier
npm run test             # Testes unitários
npm run test:e2e         # Testes end-to-end
npm run test:cov         # Coverage
npm run test:email       # Testar envio de email
```

---

## 🎨 Convenções de Código (Backend)

### NestJS Patterns
- **Módulos**: Feature modules organizados por domínio
- **Controllers**: Handlers HTTP com decorators
- **Services**: Lógica de negócio injetável
- **DTOs**: class-validator + class-transformer
- **Entities**: Representações Swagger dos modelos

### TypeScript
- **Target**: ES2023
- **Module**: NodeNext
- **Decorators**: Habilitados (experimentalDecorators)
- **Strict**: Parcialmente habilitado

### Estrutura de Módulos
```typescript
feature/
├── feature.module.ts        # Módulo NestJS
├── feature.controller.ts    # Controller HTTP
├── feature.service.ts       # Business logic
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
└── entities/
    └── feature.entity.ts    # Swagger entity
```

### Validação
```typescript
// DTOs com class-validator
export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
  
  @IsEmail()
  email: string;
  
  @IsNumber()
  @Min(0)
  area_total: number;
}
```

---

## 📡 Endpoints Principais

### Autenticação (Better Auth)
```
POST   /api/auth/sign-up                 # Criar conta
POST   /api/auth/sign-in/email           # Login
POST   /api/auth/sign-out                # Logout
GET    /api/auth/get-session             # Obter sessão atual
POST   /api/auth/forgot-password         # Reset de senha
POST   /api/auth/reset-password          # Confirmar reset
POST   /api/auth/verify-email            # Verificar email
```

### Propriedades
```
POST   /property                         # Criar propriedade
GET    /property                         # Listar propriedades
GET    /property/:id                     # Buscar por ID
PATCH  /property/:nome                   # Atualizar
DELETE /property/:nome                   # Deletar
```

### Setores Hidráulicos
```
POST   /hydraulic-sector                 # Criar setor
GET    /hydraulic-sector                 # Listar setores
GET    /hydraulic-sector/:id             # Buscar por ID
PATCH  /hydraulic-sector/:id             # Atualizar
DELETE /hydraulic-sector/:id             # Deletar
```

---

# FRONTEND - APLICAÇÃO WEB

## 🛠️ Stack Tecnológico (Frontend)

### Framework & Runtime
- **Next.js 15.5.3** (App Router)
- **React 19.1.0**
- **TypeScript 5.x**
- **Node.js** (ES2017 target)

### Estilização & UI
- **Tailwind CSS 4.x** (PostCSS)
- **shadcn/ui** (New York style)
  - BaseColor: neutral
  - CSS Variables habilitadas
- **Radix UI** (primitivos de componentes)
- **Lucide React** (ícones)
- **class-variance-authority** (variantes)
- **clsx** + **tailwind-merge**
- **tw-animate-css** (animações)

### Gerenciamento de Estado & Dados
- **TanStack Query (React Query) 5.90.2**
  - DevTools habilitadas
- **Axios 1.12.2** (cliente HTTP)
  - Base URL: `http://localhost:3333`
  - Credenciais: habilitadas

### Autenticação
- **Better Auth 1.3.18**
  - Plugins: organization, admin
  - Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL`

### Formulários & Validação
- **React Hook Form 7.63.0**
- **Zod 4.1.11**
- **@hookform/resolvers 5.2.2**

### Notificações
- **Sonner 2.0.7** (toast notifications)

---

## 📁 Estrutura de Diretórios (Frontend)

```
avaliafront/
├── public/                          # Assets estáticos
│   └── *.svg
│
├── src/
│   ├── app/                         # App Router (Next.js 15)
│   │   ├── layout.tsx              # Layout raiz (QueryProvider, fontes)
│   │   ├── page.tsx                # Página inicial
│   │   ├── globals.css             # Estilos globais
│   │   │
│   │   ├── (authenticated)/        # Grupo de rotas autenticadas
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   └── criar-conta/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   │
│   │   ├── layouts/
│   │   │   └── header.tsx
│   │   │
│   │   ├── providers/
│   │   │   └── query-provider.tsx
│   │   │
│   │   ├── logo.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   │
│   ├── hooks/
│   │   └── use-query-examples.ts
│   │
│   └── lib/
│       ├── api.ts                  # Axios config
│       ├── auth-client.ts          # Better Auth client
│       └── utils.ts                # cn(), etc
│
├── components.json                  # shadcn/ui config
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## 🔐 Autenticação (Frontend)

### Better Auth Client
```typescript
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { organizationClient, adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333",
  plugins: [
    organizationClient(),
    adminClient(),
  ],
})

export const { 
  signIn, 
  signOut, 
  signUp, 
  useSession 
} = authClient
```

### Uso em Componentes
```typescript
import { useSession } from '@/lib/auth-client'

function ProtectedComponent() {
  const { data: session, isPending } = useSession()
  
  if (isPending) return <div>Loading...</div>
  if (!session) return <div>Não autenticado</div>
  
  return <div>Olá, {session.user.name}</div>
}
```

---

## 🌐 Integração com API

### Axios Configuration
```typescript
// src/lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
})
```

### React Query Pattern
```typescript
// src/hooks/use-query-examples.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users')
      return data
    },
  })
}
```

---

## 🎨 Convenções de Código (Frontend)

### TypeScript
- **Target:** ES2017
- **Module Resolution:** bundler
- **Path Aliases:** `@/*` → `./src/*`

### Componentes
```typescript
// Padrão de componente
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'default' | 'outline'
  children: React.ReactNode
}

export function Button({ variant = 'default', children }: ButtonProps) {
  return (
    <button className={cn('px-4 py-2', variant === 'outline' && 'border')}>
      {children}
    </button>
  )
}
```

### Rotas Protegidas
```typescript
// app/(authenticated)/layout.tsx
import { useSession } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

export default function AuthenticatedLayout({ children }) {
  const { data: session } = useSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return <>{children}</>
}
```

---

## 🔧 Variáveis de Ambiente (Frontend)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

---

## 📦 Scripts Disponíveis (Frontend)

```bash
npm run dev    # Servidor de desenvolvimento
npm run build  # Build de produção
npm run start  # Servidor de produção
```

---

## 🔄 Fluxo de Autenticação Completo

### 1. Cadastro
```typescript
// Frontend
import { signUp } from '@/lib/auth-client'

await signUp.email({
  email: 'user@example.com',
  password: 'senha123',
  name: 'João Silva',
})
```

### 2. Login
```typescript
// Frontend
import { signIn } from '@/lib/auth-client'

await signIn.email({
  email: 'user@example.com',
  password: 'senha123',
})
```

### 3. Verificar Sessão
```typescript
// Frontend
import { useSession } from '@/lib/auth-client'

const { data: session, isPending } = useSession()
```

### 4. Requisições Autenticadas
```typescript
// Frontend
import { api } from '@/lib/api'

// Cookies são enviados automaticamente (withCredentials: true)
const response = await api.get('/property')
```

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   Frontend      │◄───────►│    Backend      │
│   (Next.js)     │  HTTP   │   (NestJS)      │
│   Port: 3000    │ CORS OK │   Port: 3333    │
│                 │         │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                            ┌────────▼────────┐
                            │                 │
                            │   MySQL DB      │
                            │   (Prisma)      │
                            │                 │
                            └─────────────────┘
```

### Fluxo de Dados
1. **Cliente** → Requisição HTTP → **Backend API**
2. **Backend** → Valida autenticação (Better Auth) → Verifica sessão
3. **Backend** → Autorização (RolesGuard) → Verifica permissões
4. **Backend** → Prisma → **Database**
5. **Backend** → Resposta JSON → **Cliente**

---

## 💡 Dicas para LLMs

### Ao criar endpoints no Backend:
- Use decorators do NestJS (`@Controller`, `@Get`, `@Post`, etc)
- Implemente DTOs com `class-validator`
- Documente com `@nestjs/swagger` decorators
- Injete serviços via constructor
- Use `PrismaService` para acesso ao banco

### Ao criar componentes no Frontend:
- Use TypeScript com tipagem estrita
- Aplique Tailwind CSS com `cn()`
- Prefira componentes shadcn/ui
- Use path alias `@/`
- Crie hooks customizados para queries

### Ao trabalhar com autenticação:
- **Backend**: Better Auth configurado em `src/lib/auth.ts`
- **Frontend**: `useSession()` de `@/lib/auth-client`
- Sessions são gerenciadas via cookies (httpOnly)
- Multi-tenant via organizações (Better Auth plugin)

### Ao fazer integrações:
- Frontend usa `api` instance de `@/lib/api`
- Credenciais habilitadas (`withCredentials: true`)
- React Query para cache e estado
- Tratamento de erros em ambos os lados

---

## 🌐 Contexto do Domínio

**IrrigaAi** é um sistema inteligente de avaliação e irrigação agrícola que permite:

### Funcionalidades Principais
1. **Gestão de Propriedades Rurais**
   - Cadastro de fazendas com localização (lat/long)
   - Controle de áreas totais e irrigadas
   - Informações de contato e observações

2. **Sistemas de Irrigação**
   - **Setor Hidráulico**: Irrigação localizada (gotejamento, microaspersão)
   - **Pivô Central**: Irrigação por aspersão circular

3. **Avaliações de Campo**
   - Coleta de pontos de medição (vazão, volume, tempo)
   - Cálculo de coeficientes (CUD, CUC)
   - Avaliações online e offline
   - Comentários e fotos anexas

4. **Multi-tenant**
   - Organizações (fazendas, cooperativas)
   - Membros com diferentes roles
   - Convites e gerenciamento de equipes

5. **Usuários & Permissões**
   - **USER**: Acesso básico
   - **AVALIADOR**: Cria avaliações
   - **ADMIN_FAZENDA**: Gerencia propriedade
   - **ADMIN**: Controle total

---

## 📊 Métricas de Irrigação

### CUD (Coeficiente de Uniformidade de Distribuição)
Mede a uniformidade da distribuição de água no sistema de irrigação.

### CUC (Coeficiente de Uniformidade de Christiansen)
Avalia a uniformidade da aplicação de água em toda a área irrigada.

### Pontos de Coleta
- **Localizada**: Coordenadas X/Y, volume, tempo, vazão
- **Pivô**: Sequência, distância, diâmetro, volume, tempo, vazão

---

## 🔗 Dependências Críticas

### Backend ↔ Frontend
- Same Better Auth version (1.3.18)
- Compatible session management
- CORS configurado para localhost:3000
- Cookies compartilhados (credentials: true)

### Database ↔ Backend
- Prisma Client gerado do schema
- Migrations sincronizadas
- MySQL como provider

---

## 📝 Padrões de Importação

### Backend
```typescript
import { Injectable, Controller, Get } from '@nestjs/common'
import { PrismaService } from './infra/prisma/prisma.service'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
```

### Frontend
```typescript
import { useSession } from '@/lib/auth-client'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
```

---

## 🚀 Getting Started

### Backend
```bash
cd avalia-irriga-backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
# API: http://localhost:3333
# Swagger: http://localhost:3333/api
```

### Frontend
```bash
cd avaliafront
npm install
npm run dev
# App: http://localhost:3000
```

---

**Última atualização:** 1 de outubro de 2025  
**Versão do Documento:** 1.0.0
