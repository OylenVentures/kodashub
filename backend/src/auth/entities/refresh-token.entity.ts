import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity.js';

/**
 * Represents one issued refresh token "session".
 * The token's id (uuid) is embedded as the `jti` claim of the signed refresh JWT.
 * Possessing a validly-signed JWT is NOT enough to refresh — the jti must also
 * exist here, be unrevoked and unexpired. This lets us revoke sessions server-side
 * (logout, logout-all, password change, detected token reuse) even though JWTs
 * are otherwise stateless.
 */
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @ManyToOne('User', (user: User) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;

  // If this token was rotated, points to the token that replaced it.
  // Used to detect refresh-token reuse (a strong signal of theft).
  @Column({ type: 'uuid', nullable: true })
  replacedByTokenId?: string | null;

  @Column({ nullable: true })
  createdByIp?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;
}
