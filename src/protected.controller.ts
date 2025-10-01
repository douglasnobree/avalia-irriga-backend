import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
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
import { PrismaService } from './infra/prisma/prisma.service';

@Controller('protected')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Rotas Protegidas')
@ApiBearerAuth()
export class ProtectedController {
  constructor(private readonly prisma: PrismaService) {}
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

  @Get('active-organization')
  @Roles(
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ADMIN_FAZENDA,
    UserRole.AVALIADOR,
  )
  @ApiOperation({
    summary: 'Obter organização ativa',
    description: 'Retorna a organização atualmente ativa para o usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Organização ativa retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        activeOrganization: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string', nullable: true },
            logo: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async getActiveOrganization(@Session() session: any) {
    const sessionData = await this.prisma.session.findUnique({
      where: { id: session.id },
      select: { activeOrganizationId: true },
    });

    if (!sessionData?.activeOrganizationId) {
      return {
        activeOrganization: null,
      };
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: sessionData.activeOrganizationId },
    });

    return {
      activeOrganization: organization,
    };
  }

  @Post('set-active-organization')
  @Roles(
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ADMIN_FAZENDA,
    UserRole.AVALIADOR,
  )
  @ApiOperation({
    summary: 'Definir organização ativa',
    description:
      'Define uma organização como ativa para a sessão atual do usuário. Use organizationId: null para desativar a organização ativa.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organização ativa definida com sucesso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        activeOrganizationId: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Organização não encontrada ou usuário não é membro',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async setActiveOrganization(
    @Session() session: any,
    @Body() body: { organizationId?: string | null; organizationSlug?: string },
  ) {
    const userId = session.user.id;

    // Permite desativar a organização ativa
    if (body.organizationId === null) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { activeOrganizationId: null },
      });

      return {
        success: true,
        message: 'Organização ativa removida com sucesso',
        activeOrganizationId: null,
      };
    }

    let organizationId = body.organizationId;

    // Se foi fornecido slug em vez de ID, busca pelo slug
    if (!organizationId && body.organizationSlug) {
      const org = await this.prisma.organization.findUnique({
        where: { slug: body.organizationSlug },
      });

      if (!org) {
        return {
          success: false,
          message: 'Organização não encontrada',
        };
      }

      organizationId = org.id;
    }

    if (!organizationId) {
      return {
        success: false,
        message: 'organizationId ou organizationSlug é obrigatório',
      };
    }

    // Verifica se o usuário é membro da organização
    const member = await this.prisma.member.findFirst({
      where: {
        userId,
        organizationId,
      },
    });

    if (!member) {
      return {
        success: false,
        message: 'Você não é membro desta organização',
      };
    }

    // Atualiza a sessão com a organização ativa
    await this.prisma.session.update({
      where: { id: session.id },
      data: { activeOrganizationId: organizationId },
    });

    return {
      success: true,
      message: 'Organização ativa definida com sucesso',
      activeOrganizationId: organizationId,
    };
  }

  @Get('my-organizations')
  @Roles(
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.ADMIN_FAZENDA,
    UserRole.AVALIADOR,
  )
  @ApiOperation({
    summary: 'Listar minhas organizações',
    description: 'Retorna todas as organizações das quais o usuário é membro',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de organizações retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        organizations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              slug: { type: 'string', nullable: true },
              logo: { type: 'string', nullable: true },
              role: { type: 'string' },
              isActive: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async getMyOrganizations(@Session() session: any) {
    const userId = session.user.id;

    // Busca a sessão atual para saber qual organização está ativa
    const sessionData = await this.prisma.session.findUnique({
      where: { id: session.id },
      select: { activeOrganizationId: true },
    });

    // Busca todas as organizações do usuário
    const memberships = await this.prisma.member.findMany({
      where: { userId },
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const organizations = memberships.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      logo: membership.organization.logo,
      role: membership.role,
      isActive: membership.organizationId === sessionData?.activeOrganizationId,
    }));

    return {
      organizations,
    };
  }
}
