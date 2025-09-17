# Autenticação JWT

Este sistema implementa autenticação JWT com tokens de acesso e refresh, suportando dois níveis de usuários (USER e ADMIN) e possibilidade de expansão para mais níveis.

## Funcionalidades

- **Login**: Autenticação com email e senha
- **Refresh Token**: Renovação automática de tokens de acesso
- **Níveis de Usuário**: USER e ADMIN (expansível)
- **Proteção de Rotas**: Guards para autenticação e autorização
- **Decorator @User()**: Acesso fácil ao usuário autenticado nos controllers

## Endpoints

### POST /auth/login
Realiza login e retorna tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
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

**Response:** Mesmo formato do login.

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
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProtectedController {
  @Get('user')
  @Roles(UserRole.USER, UserRole.ADMIN)
  getUserProfile(@User() user: any) {
    return {
      message: 'Perfil do usuário',
      user: user,
    };
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  getAdminData(@User() user: any) {
    return {
      message: 'Dados administrativos',
      user: user,
    };
  }
}
```

### Acessando o Usuário
Use o decorator `@User()` para injetar o usuário autenticado:

```typescript
@Get('profile')
getProfile(@User() user: any) {
  // user contém: id, email, name, role
  return user;
}
```

## Estrutura de Arquivos

```
src/auth/
├── auth.controller.ts      # Endpoints de login/refresh
├── auth.module.ts          # Módulo de autenticação
├── auth.service.ts         # Lógica de autenticação
├── jwt.strategy.ts         # Estratégia JWT para acesso
├── jwt-refresh.strategy.ts # Estratégia JWT para refresh
├── jwt-auth.guard.ts       # Guard de autenticação
├── jwt-refresh.guard.ts    # Guard de refresh
├── roles.guard.ts          # Guard de roles
├── user.decorator.ts       # Decorator @User()
└── roles.decorator.ts      # Decorator @Roles()
```

## Configuração

### Variáveis de Ambiente (.env)
```env
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### Expansão de Roles
Para adicionar mais níveis de usuário:

1. Atualize o enum `UserRole` no schema.prisma:
```prisma
enum UserRole {
  USER
  ADMIN
  MODERATOR  // Novo nível
}
```

2. Execute a migração:
```bash
npx prisma migrate dev --name add-moderator-role
```

3. Use o novo role nos decorators:
```typescript
@Roles(UserRole.MODERATOR, UserRole.ADMIN)
```

## Segurança

- Tokens de acesso expiram em 15 minutos
- Tokens de refresh expiram em 7 dias
- Senhas são hashadas com bcrypt (10 salt rounds)
- Refresh tokens são armazenados no banco de dados
- Validação de roles nas rotas protegidas