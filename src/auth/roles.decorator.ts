import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'prisma/generated/prisma';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
