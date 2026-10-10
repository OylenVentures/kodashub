import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class EmailDto {
  @ApiProperty({ description: 'User email', example: 'jd@xmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class TokenDto {
  @ApiProperty({ description: 'Verification token', example: 'a1b2c3d4e5f6' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class LogInUserDto extends EmailDto {
  @ApiProperty({
    description: 'User password',
    example: 'Password!23',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class RegisterUserDto extends LogInUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Kodashub',
  })
  @IsString()
  company_name?: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'User phone number with country code',
    example: '+2341234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: 'User city',
    example: 'Lagos',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'User state',
    example: 'Lagos',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'User country code',
    example: 'NG',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'User zip code',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  zip_code: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset password token',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'Password@123',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  new_password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'Password@123',
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  confirm_password: string;
}
