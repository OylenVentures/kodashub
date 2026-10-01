import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { UsersService } from '../users/users.service.js';
import { MailService } from '../mail/mail.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { UserStatus } from '../common/enums/user-status.enum.js';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './interfaces/jwt-payload.interface.js';

@Injectable()
export class AuthService {
  private readonly maxFailedAttempts: number;
  private readonly lockMinutes: number;

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.maxFailedAttempts = Number(
      this.config.get('MAX_FAILED_LOGIN_ATTEMPTS') ?? 5,
    );
    this.lockMinutes = Number(this.config.get('ACCOUNT_LOCK_MINUTES') ?? 15);
  }

  // ---------- Registration & email verification ----------

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
    });

    const rawToken = await this.setVerificationToken(user);
    await this.mailService.sendVerificationEmail(user, rawToken);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(rawToken: string): Promise<{ message: string }> {
    const hashed = this.hashToken(rawToken);

    const user = await this.usersRepository.findOne({
      where: {
        emailVerificationTokenHash: hashed,
      },
      select: {
        id: true,
        emailVerificationExpires: true,
        isEmailVerified: true,
        email: true,
        firstName: true,
      },
    });

    if (
      !user ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      throw new BadRequestException(
        'Verification link is invalid or has expired',
      );
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;
    await this.usersRepository.save(user);

    await this.mailService.sendWelcomeEmail(user);

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const genericResponse = {
      message:
        'If an account exists and is unverified, a new verification email has been sent.',
    };

    const user = await this.usersService.findByEmail(email);
    if (!user || user.isEmailVerified) return genericResponse; // don't leak account existence

    const rawToken = await this.setVerificationToken(user);
    await this.mailService.sendVerificationEmail(user, rawToken);

    return genericResponse;
  }

  private async setVerificationToken(user: User): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationTokenHash = this.hashToken(rawToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await this.usersRepository.save(user);
    return rawToken;
  }

  // ---------- Login ----------

  /** Called by LocalStrategy. Verifies credentials, enforces lockout policy. */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(email);

    const invalidCredsError = new UnauthorizedException(
      'Invalid email or password',
    );

    if (!user) throw invalidCredsError;

    if (user.isLocked()) {
      throw new ForbiddenException(
        `Account temporarily locked due to too many failed login attempts. Try again later.`,
      );
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(
        'This account is not active. Contact support.',
      );
    }

    if (!user.password) {
      throw new BadRequestException(
        'No password set for this account. Please generate your passcode to log in.',
      );
    }

    const passwordMatches = await argon.verify(user.password, password);

    if (!passwordMatches) {
      await this.registerFailedLogin(user);
      throw invalidCredsError;
    }

    if (user?.passwordExpires && user.passwordExpires < new Date()) {
      throw new BadRequestException(
        'Passcode has expired. Please generate a new passcode to log in.',
      );
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException(
        'Please verify your email address before logging in.',
      );
    }

    // Success — reset lockout counters.
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.password = null;
    user.passwordExpires = null;
    await this.usersRepository.save(user);

    return user;
  }

  private async registerFailedLogin(user: User): Promise<void> {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= this.maxFailedAttempts) {
      user.lockUntil = new Date(Date.now() + this.lockMinutes * 60 * 1000);
      user.failedLoginAttempts = 0;
    }

    await this.usersRepository.save(user);
  }

  async sendPasscode(email: string): Promise<{ message: string }> {
    const genericResponse = {
      message: 'If an account with that email exists, a passcode has been sent',
    };

    const user = await this.usersService.findByEmail(email);
    if (!user) return genericResponse;
    if (user.isEmailVerified === false) {
      throw new ForbiddenException(
        'Please verify your email address before login',
      );
    }

    // generate a 6 digit token
    const rawPasscode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPasscode = await argon.hash(rawPasscode);
    user.password = hashedPasscode;
    user.passwordExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.usersRepository.save(user);
    await this.mailService.sendPasscodeEmail(user, rawPasscode);

    return genericResponse;
  }

  async login(
    user: User,
    meta: { ip?: string; userAgent?: string },
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    user.lastLoginAt = new Date();
    user.lastLoginIp = meta.ip;
    await this.usersRepository.save(user);

    const { accessToken, refreshToken } = await this.issueTokenPair(user, meta);
    return { accessToken, refreshToken, user };
  }

  // ---------- Token issuance & rotation ----------

  private async issueTokenPair(
    user: User,
    meta: { ip?: string; userAgent?: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign<AccessTokenPayload>(
      accessPayload,
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
        // expiresIn: (this.config.get<string>('JWT_ACCESS_EXPIRY') ??'15m') as string,
      },
    );

    const refreshRecord = await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create({
        userId: user.id,
        expiresAt: this.parseExpiryToDate(
          this.config.get<string>('JWT_REFRESH_EXPIRY') ?? '7d',
        ),
        createdByIp: meta.ip,
        userAgent: meta.userAgent,
      }),
    );

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      jti: refreshRecord.id,
    };
    const refreshToken = this.jwtService.sign<RefreshTokenPayload>(
      refreshPayload,
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
        // expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRY') ?? '7d') as string,
      },
    );

    return { accessToken, refreshToken };
  }

  /**
   * Rotates a refresh token: validates it, revokes it, issues a fresh pair.
   * If a token that was ALREADY revoked/rotated is presented again, this is
   * treated as likely theft — every session for that user is revoked immediately.
   */
  async refreshTokens(
    rawRefreshToken: string,
    meta: { ip?: string; userAgent?: string },
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    let payload: RefreshTokenPayload;
    try {
      payload = this.jwtService.verify<RefreshTokenPayload>(rawRefreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const record = await this.refreshTokensRepository.findOne({
      where: { id: payload.jti },
    });

    if (!record || record.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (record.revoked) {
      // Reuse of a rotated/revoked token — possible theft. Nuke all sessions.
      await this.revokeAllUserTokens(record.userId);
      throw new UnauthorizedException(
        'Refresh token reuse detected. All sessions have been logged out for your security.',
      );
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException(
        'Refresh token has expired. Please log in again.',
      );
    }

    const user = await this.usersService.findById(payload.sub);
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('This account is not active.');
    }

    const { accessToken, refreshToken } = await this.issueTokenPair(user, meta);

    // Rotate: mark old token as revoked/replaced (fetch the new jti back out of it)
    const newPayload = this.jwtService.decode(
      refreshToken,
    ) as RefreshTokenPayload;
    record.revoked = true;
    record.replacedByTokenId = newPayload.jti;
    await this.refreshTokensRepository.save(record);

    return { accessToken, refreshToken, user };
  }

  async logout(rawRefreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(
        rawRefreshToken,
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        },
      );
      await this.refreshTokensRepository.update(
        { id: payload.jti },
        { revoked: true },
      );
    } catch {
      // Already invalid/expired — nothing to revoke. Logout should still succeed client-side.
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokensRepository.update(
      { userId, revoked: false },
      { revoked: true },
    );
  }

  // ---------- Helpers ----------

  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  private parseExpiryToDate(expiry: string): Date {
    const match = /^(\d+)([smhd])$/.exec(expiry);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // fallback: 7d
    const value = Number(match[1]);
    const unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[
      match[2]
    ] as number;
    return new Date(Date.now() + value * unitMs);
  }

  /** Optional maintenance task — wire up with @nestjs/schedule if desired. */
  async purgeExpiredTokens(): Promise<void> {
    await this.refreshTokensRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
