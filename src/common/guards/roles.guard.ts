import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard que verifica se o usuário autenticado possui uma das roles necessárias
 * Deve ser usado em conjunto com o decorator @Roles()
 * O AuthGuard já deve estar ativo (globalmente ou via @UseGuards)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Busca as roles necessárias definidas pelo decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não há roles definidas, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtém a requisição do contexto (suporta HTTP e GraphQL)
    const request = this.getRequestFromContext(context);

    // Obtém a sessão que foi anexada pelo AuthGuard
    const session = request.session;

    // Se não há sessão, o usuário não está autenticado
    // (isso não deveria acontecer se o AuthGuard estiver ativo)
    if (!session || !session.user) {
      throw new ForbiddenException({
        message: 'Acesso negado. Usuário não autenticado.',
        code: 'FORBIDDEN',
      });
    }

    // Obtém a role do usuário
    const userRole = session.user.role as string | null;

    // Se o usuário não tem role definida
    if (!userRole) {
      throw new ForbiddenException({
        message: 'Acesso negado. Usuário não possui permissões definidas.',
        code: 'FORBIDDEN',
      });
    }

    // Normaliza as roles para comparação case-insensitive (ignora maiúsculas/minúsculas)
    const normalizedUserRole = userRole.toUpperCase();
    const normalizedRequiredRoles = requiredRoles.map((role) =>
      String(role).toUpperCase(),
    );

    // Verifica se a role do usuário está na lista de roles permitidas
    const hasRole = normalizedRequiredRoles.includes(normalizedUserRole);

    if (!hasRole) {
      throw new ForbiddenException({
        message: `Acesso negado. Requer uma das seguintes permissões: ${requiredRoles.join(', ')}`,
        code: 'FORBIDDEN',
        requiredRoles,
        normalizedUserRole,
      });
    }

    return true;
  }

  /**
   * Extrai o objeto de requisição do contexto de execução
   * Suporta tanto HTTP quanto GraphQL
   */
  private getRequestFromContext(context: ExecutionContext) {
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }

    return context.switchToHttp().getRequest();
  }
}
