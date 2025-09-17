# Documentação da API - Autenticação JWT

## Visão Geral

Esta API utiliza autenticação JWT (JSON Web Tokens) com sistema de roles para controle de acesso. A documentação completa está disponível via Swagger em `/api`.

## Autenticação

### Fluxo de Autenticação

1. **Cadastro**: Crie uma conta em `POST /auth/register`
2. **Login**: Obtenha tokens de acesso e refresh
3. **Uso**: Utilize o access token para acessar recursos protegidos
4. **Refresh**: Renove o access token quando expirar

### Tokens

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias

## Endpoints de Autenticação

### POST /auth/register

Cadastra um novo usuário e retorna tokens JWT automaticamente.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "user@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Campos:**
- `name` (obrigatório): Nome completo do usuário
- `email` (obrigatório): Email único do usuário
- `password` (obrigatório): Senha com mínimo 6 caracteres
- `role` (opcional): Nível de acesso (USER ou ADMIN, padrão: USER)

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "USER"
  }
}
```

**Erros possíveis:**
- `409 Conflict`: Email já está em uso
- `400 Bad Request`: Dados inválidos (senha muito curta, email inválido, etc.)

### POST /auth/login

Realiza login e retorna tokens JWT.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "USER"
  }
}
```

### POST /auth/refresh

Renova o token de acesso usando o refresh token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200):** Mesmo formato do login.

## Níveis de Acesso

### USER
- Acesso básico à aplicação
- Pode acessar rotas marcadas com `@Roles(UserRole.USER)`

### ADMIN
- Acesso administrativo completo
- Pode acessar todas as rotas USER + rotas ADMIN
- Pode acessar rotas marcadas com `@Roles(UserRole.ADMIN)`

## Como Usar nos Controllers

### Protegendo Rotas

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { User } from './auth/user.decorator';
import { UserRole } from '@prisma/client';

@Controller('protected')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica guards globalmente
export class ProtectedController {

  // Acesso para USER e ADMIN
  @Get('user')
  @Roles(UserRole.USER, UserRole.ADMIN)
  getUserData(@User() user: any) {
    return { message: 'Dados do usuário', user };
  }

  // Acesso apenas para ADMIN
  @Get('admin')
  @Roles(UserRole.ADMIN)
  getAdminData(@User() user: any) {
    return { message: 'Dados administrativos', user };
  }
}
```

### Acessando Dados do Usuário

Use o decorator `@User()` para injetar o usuário autenticado:

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@User() user: any) {
  // user contém: id, email, name, role
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}
```

## Testando a API

### 1. Cadastro (opcional se já tem usuário)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "user@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### 3. Acessar Rota Protegida
```bash
curl -X GET http://localhost:3000/protected/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN"
```

## Estrutura de Respostas de Erro

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Credenciais inválidas",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Segurança

- Senhas são hashadas com bcrypt (10 salt rounds)
- Tokens são validados em cada requisição
- Refresh tokens são armazenados no banco de dados
- Controle de expiração automática dos tokens
- Validação de roles nas rotas protegidas

## Expansão de Roles

Para adicionar novos níveis de usuário:

1. Atualize o enum `UserRole` no `schema.prisma`
2. Execute migração: `npx prisma migrate dev`
3. Use o novo role nos decorators `@Roles()`

```prisma
enum UserRole {
  USER
  ADMIN
  MODERATOR  // Novo nível
}
```

```typescript
@Roles(UserRole.MODERATOR)
getModeratorData() {
  // Apenas moderadores podem acessar
}
```