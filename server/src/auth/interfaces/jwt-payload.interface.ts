import { UserRole } from '../../common/enums/role.enum.js';

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sub: string; // user id
  jti: string; // refresh_tokens.id — the DB-backed session identifier
}
