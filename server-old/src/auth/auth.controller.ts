import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailDto,
  LogInUserDto,
  RegisterUserDto,
  ResetPasswordDto,
  TokenDto,
} from './dto/auth.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('register')
  createUser(@Body() dto: RegisterUserDto) {
    return this.authService.createUser(dto);
  }

  @ApiOkResponse({ description: 'Verification code resent successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('resend-verification-code')
  @HttpCode(HttpStatus.OK)
  resendVerificationCode(@Body() dto: EmailDto) {
    return this.authService.resendVerificationCode(dto.email);
  }

  @ApiOkResponse({ description: 'User verified successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyUser(@Body() dto: TokenDto) {
    return this.authService.verifyUser(dto.token);
  }

  @ApiOkResponse({ description: 'User authenticated' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() dto: LogInUserDto, @Req() req: any) {
    return this.authService.loginUser(dto, req);
  }

  @ApiOkResponse({ description: 'Password reset code sent successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: EmailDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto, @Req() req: any) {
    return this.authService.resetPassword(dto, req);
  }

  // @ApiOkResponse({ description: 'User authenticated' })
  // @ApiBadRequestResponse({ description: 'Bad request' })
  // @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  // @Post('google')
  // @HttpCode(HttpStatus.OK)
  // googleAuth(@Body() dto: LogInUserDto, @Req() req: any) {
  //   return this.authService.googleAuth(dto.idToken, req);
  // }

  // @ApiOkResponse({ description: 'User authenticated' })
  // @ApiBadRequestResponse({ description: 'Bad request' })
  // @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  // @Post('apple')
  // @HttpCode(HttpStatus.OK)
  // appleAuth(@Body() dto: LogInUserDto, @Req() req: any) {
  //   return this.authService.appleAuth(dto, req);
  // }
}
