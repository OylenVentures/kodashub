import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity.js';

/**
 * Extracts the authenticated user (attached by JwtAuthGuard) from the request.
 * Usage: @CurrentUser() user: User  OR  @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
