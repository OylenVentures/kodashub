import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../common/enums/role.enum.js';
import { UserStatus } from '../../common/enums/user-status.enum.js';
import { RefreshToken } from '../../auth/entities/refresh-token.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Index({ unique: true })
  @Column({ length: 255, unique: true })
  email: string;

  // select: false -> never returned by default queries; must opt in with .addSelect()
  @Column({ type: 'varchar', select: false, nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  @Exclude({ toPlainOnly: true })
  passwordExpires?: Date | null;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'char', length: 64, nullable: true })
  @Exclude({ toPlainOnly: true })
  emailVerificationTokenHash?: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  @Exclude({ toPlainOnly: true })
  emailVerificationExpires?: Date | null;

  @Column({ default: 0 })
  @Exclude({ toPlainOnly: true })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude({ toPlainOnly: true })
  lockUntil?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date | null;

  @Column({
    type: 'char',
    length: 64,
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  lastLoginIp?: string | null;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  // Set lazily the first time this user buys/transfers a domain (see
  // DomainsService.ensureBlestaClient). Lets us reuse one Blesta client
  // record across all of a user's domain orders instead of creating a new
  // one every time.
  @Column({ type: 'integer', nullable: true })
  blestaClientId?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /** Helper: is the account currently locked out due to failed login attempts? */
  isLocked(): boolean {
    return !!this.lockUntil && this.lockUntil.getTime() > Date.now();
  }
}
