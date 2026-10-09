import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { RegisterDto } from './dto/register.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { SendEmailDto } from './dto/send-email.dto.js';
import { User } from '../users/entities/user.entity.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const REFRESH_COOKIE = 'refresh_token';

@ApiBadRequestResponse({
  description: 'Invalid request data',
})
@ApiTooManyRequestsResponse({
  description: 'Too many requests, please try again later',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error occurred while processing the request',
})
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account and send email verification',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: Object,
    example: {
      message:
        'User registered successfully. Please check your email to verify your account.',
    },
  })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Verify user email',
    description: "Verify a user's email address using a verification token",
  })
  @ApiOkResponse({
    description: 'Email verified successfully',
    type: Object,
    example: {
      message: 'Email verified successfully. You can now log in.',
    },
  })
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Resend email verification',
    description: 'Resend a new email verification token to the user',
  })
  @ApiOkResponse({
    description: 'Verification email resent successfully',
    type: Object,
    example: {
      message: 'Verification email resent successfully.',
    },
  })
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  resendVerification(@Body() dto: SendEmailDto) {
    return this.authService.resendVerification(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Login a user',
    description: 'Generate a passcode for the user and send it via email',
  })
  @ApiOkResponse({
    description: 'Passcode generated and sent successfully',
    type: Object,
    example: {
      message: 'Passcode generated and sent successfully',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiForbiddenResponse({
    description: 'Email not verified',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async sendPasscode(@Body() dto: SendEmailDto): Promise<{ message: string }> {
    return await this.authService.sendPasscode(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Verify passcode',
    description: 'Authenticate a user and return access and refresh tokens',
    requestBody: {
      description: 'User passcode',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'john.doe@example.com' },
              password: { type: 'string', example: '123456' },
            },
            required: ['email', 'password'],
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: Object,
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @Post('verify-passcode')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: User,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const {
      accessToken,
      refreshToken,
      user: loggedInUser,
    } = await this.authService.login(user, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    this.setRefreshCookie(res, refreshToken);

    return { accessToken, user: loggedInUser };
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Refresh the access token using a valid refresh token stored in cookies',
  })
  @ApiOkResponse({
    description: 'Access token refreshed successfully',
    type: Object,
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedException('Missing refresh token');

    const { accessToken, refreshToken, user } =
      await this.authService.refreshTokens(token, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

    this.setRefreshCookie(res, refreshToken);

    return { accessToken, user };
  }

  @Public()
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Log out the user by revoking the refresh token and clearing the cookie',
  })
  @ApiOkResponse({
    description: 'User logged out successfully',
    type: Object,
    example: {
      message: 'Logged out successfully',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) await this.authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions());
    return { message: 'Logged out successfully' };
  }

  // Protected (not @Public) — requires a valid access token, logs out every session.
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Log out of all devices',
    description:
      'Revoke all refresh tokens for the user and clear the refresh token cookie',
  })
  @ApiOkResponse({
    description: 'Logged out of all devices successfully',
    type: Object,
    example: {
      message: 'Logged out of all devices',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: any,
  ) {
    await this.authService.revokeAllUserTokens(userId);
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions());
    return { message: 'Logged out of all devices' };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, this.cookieOptions());
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      secure: this.config.get<string>('COOKIE_SECURE') !== 'false',
      sameSite: 'strict' as const,
      domain: this.config.get<string>('COOKIE_DOMAIN') || undefined,
      path: '/',
      maxAge: Number(
        this.config.get('JWT_REFRESH_EXPIRY_MS') ?? 7 * 24 * 60 * 60 * 1000,
      ),
    };
  }
}
