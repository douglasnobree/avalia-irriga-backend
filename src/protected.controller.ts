import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';

@Controller('protected')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Rotas Protegidas')
@ApiBearerAuth()
export class ProtectedController {
  @Get('user')
  @ApiOperation({
    summary: 'Obter perfil do usuário',
    description:
      'Retorna os dados do usuário autenticado (requer USER ou ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Perfil do usuário',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'João Silva', nullable: true },
            role: { type: 'string', example: 'USER', enum: ['USER', 'ADMIN'] },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - nível de usuário insuficiente',
  })
  @Roles(UserRole.USER, UserRole.ADMIN)
  getUserProfile(@Session() session: any) {
    return {
      message: 'Perfil do usuário',
      user: session.user,
    };
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obter dados administrativos',
    description: 'Retorna dados administrativos (requer nível ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados administrativos retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Dados administrativos',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: { type: 'string', example: 'admin@example.com' },
            name: { type: 'string', example: 'Admin User', nullable: true },
            role: { type: 'string', example: 'ADMIN' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas administradores',
  })
  getAdminData(@Session() session: UserSession) {
    return {
      message: 'Dados administrativos',
      user: session.user,
    };
  }

  @Get('farm-admin')
  @Roles(UserRole.ADMIN, UserRole.ADMIN_FAZENDA)
  @ApiOperation({
    summary: 'Obter dados de administrador de fazenda',
    description:
      'Retorna dados para administradores de fazenda ou administradores gerais',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados retornados com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - requer permissão de administrador',
  })
  getFarmAdminData(@Session() session: UserSession) {
    return {
      message: 'Dados de administrador de fazenda',
      user: session.user,
    };
  }
}
