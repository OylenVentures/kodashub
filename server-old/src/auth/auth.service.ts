import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LogInUserDto,
  RegisterUserDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as argon from 'argon2';
import { Otp } from '../utils/otp';
import * as jwt from 'jsonwebtoken';
import { Mail } from '../utils/mail';
import { LogService } from '../log/log.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private logService: LogService,
  ) {}

  async createUser(dto: RegisterUserDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    dto.email = dto.email.toLowerCase();
    const hashedPassword = await argon.hash(dto.password);
    const otp = new Otp().generateOTP();
    const newUser = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
      verificationCode: otp.token,
      verificationTime: otp.expiration,
    });
    const saveUser = await this.usersRepo.save(newUser);

    const messageBody = `
      <p>Dear ${saveUser.firstName}</p>
      <p>Thank you for registering on KodasHub. Please verify your email address to complete your registration.</p>
      <p>Your verification code is <b>${otp.token}</b>. This code will expire in 10 mins</p>
      <p>If you did not create this account, please ignore this email</p>
      <p>Thank you for using KodasHub</p>
      <p>Best regards,</p>
      <p><b>The KodasHub Team</b></p>
      `;
    const sendMail = await new Mail().sendMail(
      saveUser.email,
      'Verify your email',
      messageBody,
    );
    return {
      message: sendMail.message,
      result: { id: saveUser.id, email: saveUser.email },
    };
  }

  async resendVerificationCode(email: string) {
    const user = await this.usersRepo.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }

    const otp = new Otp().generateOTP();
    user.verificationCode = otp.token;
    user.verificationTime = otp.expiration;
    await this.usersRepo.save(user);

    const messageBody = `
      <p>Dear ${user.firstName}</p>
      <p>Thank you for registering on KodasHub. Please verify your email address to complete your registration.</p>
      <p>Your verification code is <b>${otp.token}</b>. This code will expire in 10 mins</p>
      <p>If you did not create this account, please ignore this email</p>
      <p>Thank you for using KodasHub</p>
      <p>Best regards,</p>
      <p><b>The KodasHub Team</b></p>
      `;
    await new Mail().sendMail(user.email, 'Verify your email', messageBody);
    return { message: 'Verification code resent successfully' };
  }

  async verifyUser(token: string) {
    const user = await this.usersRepo.findOne({
      where: { verificationCode: token },
    });
    if (!user) {
      throw new BadRequestException('Invalid verification code');
    }
    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }
    if (user.verificationTime && user.verificationTime < new Date()) {
      throw new BadRequestException('Verification code expired');
    }

    user.isVerified = true;
    user.verificationCode = '';
    user.verificationTime = undefined;
    await this.usersRepo.save(user);

    return { message: 'User verified successfully' };
  }

  async loginUser(dto: LogInUserDto, req: Request) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('User not verified');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('User not found, contact admin');
    }

    const isPasswordValid = await argon.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.logService.create(
      { action: 'login', description: 'User logged in successfully' },
      user.id,
      req,
    );

    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (jwtSecret === undefined || jwtSecret === null) {
      throw new BadRequestException(
        'JWT_SECRET_KEY·environment·variable·is·not·configured',
      );
    }

    const payload = { sub: user.id, email: user.email };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '1h',
    });
    return {
      message: 'User logged in successfully',
      result: { id: user.id, email: user.email, token },
    };
  }

  async forgotPassword(email: string) {
    if (!email) throw new BadRequestException('Email is required');

    const user = await this.usersRepo.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.isDeleted)
      throw new NotFoundException('User not found, contact admin');

    const otp = new Otp().generateOTP();
    user.resetPasswordCode = otp.token;
    user.resetPasswordTime = otp.expiration;
    await this.usersRepo.save(user);

    const messageBody = `
      <p>Dear ${user.firstName}</p>
      <p>Thank you for using KodasHub. Please use the code below to reset your password.</p>
      <p>Your verification code is <b>${otp.token}</b>. This code will expire in 10 mins</p>
      <p>If you did not request this, please ignore this email</p>
      <p>Thank you for using KodasHub</p>
      <p>Best regards,</p>
      <p><b>The KodasHub Team</b></p>
      `;
    await new Mail().sendMail(user.email, 'Reset your password', messageBody);
    return { message: 'Password reset code sent successfully' };
  }

  async resetPassword(dto: ResetPasswordDto, req: Request) {
    if (!dto.token) throw new BadRequestException('Token is required');

    const user = await this.usersRepo.findOne({
      where: { resetPasswordCode: dto.token },
    });
    if (!user) {
      throw new BadRequestException('Invalid verification code');
    }
    if (user.isDeleted) {
      throw new NotFoundException('User not found, contact admin');
    }
    if (user.resetPasswordTime && user.resetPasswordTime < new Date()) {
      throw new BadRequestException('Verification code expired');
    }
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    user.password = await argon.hash(dto.newPassword);
    user.resetPasswordCode = '';
    user.resetPasswordTime = new Date();

    await this.usersRepo.save(user);
    await this.logService.create(
      {
        action: 'Reset password',
        description: 'Password reset successfully',
      },
      user.id,
      req,
    );
    return { message: 'Password reset successfully' };
  }

  // async googleAuth(idToken: string, req: Request) {
  //   if (!idToken) throw new BadRequestException('idToken is required');

  //   let decodedToken: any;
  //   let newUser: any;

  //   try {
  //     decodedToken = await admin.auth().verifyIdToken(idToken);

  //     const { uid, email, name = '', email_verified } = decodedToken;
  //     if (!email) {
  //       throw new BadRequestException('Google account has no email');
  //     }

  //     let user = await this.usersRepo.findOne({ where: { email } });
  //     if (!user) {
  //       newUser = this.usersRepo.create({
  //         firstName: name.split(' ')[0] || '',
  //         lastName: name.split(' ').slice(1).join(' ') || '',
  //         email,
  //         googleId: uid || undefined,
  //         firebaseUid: uid || undefined,
  //         role: 'user',
  //         isVerified: email_verified ?? true,
  //       });

  //       await this.usersRepo.save(newUser);
  //       user = newUser;
  //     }

  //     await this.logService.create(
  //       {
  //         action: 'login',
  //         description: 'User logged in successfully via google',
  //       },
  //       user.id,
  //       req,
  //     );
  //     const token = jwt.sign(
  //       { sub: user.id, email: user.email },
  //       process.env.JWT_SECRET_KEY,
  //       { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
  //     );

  //     return {
  //       message: 'Authentication successful',
  //       result: { token, user },
  //     };
  //   } catch (error) {
  //     console.error('Google auth error:', error);
  //     if (newUser?.id) {
  //       await this.usersRepo.delete(newUser.id);
  //       console.log('Rolled back partially created Google user');
  //     }
  //     throw error;
  //   }
  // }

  // async appleAuth(dto: object, req: Request) {
  //   const { identityToken, fullName, email: emailFromClient } = dto;

  //   if (!identityToken) {
  //     throw new BadRequestException('identityToken is required');
  //   }

  //   let decodedToken: any;
  //   let newUser: any;

  //   try {
  //     decodedToken = await verifyAppleIdentityToken(identityToken);

  //     const { sub: appleId, email: emailFromApple } = decodedToken;
  //     const email = emailFromApple || emailFromClient || null;

  //     let user = await this.usersRepo.findOne({ where: { appleId } });

  //     if (!user) {
  //       if (!email) {
  //         throw new BadRequestException(
  //           'Apple sign-in did not provide an email. Please re-authenticate and allow email sharing.',
  //         );
  //       }

  //       // Link by email if user exists
  //       user = await this.usersRepo.findOne({ where: { email } });

  //       if (user) {
  //         if (user.appleId && user.appleId !== appleId) {
  //           throw new ConflictException(
  //             'This email is already linked to another Apple account.',
  //             'APPLE_ACCOUNT_CONFLICT',
  //           );
  //         }

  //         if (!user.appleId) {
  //           user.appleId = appleId;
  //           await this.usersRepo.save(user);
  //         }
  //       }
  //     }

  //     if (!user) {
  //       newUser = this.usersRepo.create({
  //         firstName: fullName?.givenName || '',
  //         lastName: fullName?.familyName || '',
  //         email,
  //         appleId,
  //         role: 'user',
  //         isVerified: true,
  //       });

  //       await this.usersRepo.save(newUser);
  //       user = newUser;
  //     }

  //     await this.logService.create(
  //       {
  //         action: 'login',
  //         description: 'User logged in successfully via apple',
  //       },
  //       user.id,
  //       req,
  //     );
  //     const token = jwt.sign(
  //       { sub: user.id, email: user.email },
  //       process.env.JWT_SECRET_KEY,
  //       { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
  //     );

  //     return {
  //       message: 'Authentication successful',
  //       result: { token, user },
  //     };
  //   } catch (error) {
  //     console.error('Apple auth error:', error);
  //     if (newUser?._id) {
  //       await this.usersRepo.delete(newUser._id);
  //     }

  //     throw new UnauthorizedException('Invalid Apple token');
  //   }
  // }
}
