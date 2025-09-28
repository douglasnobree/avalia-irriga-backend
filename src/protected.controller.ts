import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { User } from './auth/user.decorator';
import { UserRole } from 'prisma/generated/prisma';

@Controller('protected')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Rotas Protegidas')
@ApiBearerAuth()
export class ProtectedController {
  @Get('user')
  @Roles(UserRole.USER, UserRole.ADMIN)
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
  getUserProfile(@User() user: any) {
    return {
      message: 'Perfil do usuário',
      user: user,
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
  getAdminData(@User() user: any) {
    return {
      message: 'Dados administrativos',
      user: user,
    };
  }
}
