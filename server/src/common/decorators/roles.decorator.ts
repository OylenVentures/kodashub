import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/role.enum.js';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to the given roles. Must be combined with RolesGuard.
 * Usage: @Roles(UserRole.ADMIN, UserRole.SUPPORT_AGENT)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
