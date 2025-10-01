import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar quais roles podem acessar uma rota ou controller
 * @param roles - Array de roles permitidas (ADMIN, ADMIN_FAZENDA, AVALIADOR)
 * @example
 * ```typescript
 * @Roles(UserRole.ADMIN)
 * @Get('admin-only')
 * adminOnlyRoute() {
 *   return { message: 'Admin access' };
 * }
 *
 * @Roles(UserRole.ADMIN, UserRole.ADMIN_FAZENDA)
 * @Get('admin-or-farm-admin')
 * adminOrFarmAdminRoute() {
 *   return { message: 'Admin or Farm Admin access' };
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
