import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
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

export class LogInUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'jd@xmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
  })
  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+[\]{};':",.<>/?\\|])\S{8,}$/,
    {
      message:
        'At least one uppercase, one lowercase, one number, and one special character, and no spaces',
    },
  )
  password: string;
}

export class RegisterUserDto extends LogInUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Kodashub',
  })
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: '123 Main St',
  })
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'User phone number with country code',
    example: '+2341234567890',
  })
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'User city',
    example: 'Lagos',
  })
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'User state',
    example: 'Lagos',
  })
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'User country code',
    example: 'NG',
  })
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'User zip code',
    example: '12345',
  })
  @IsString()
  zipCode?: string;
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
    example: 'securePassword@123',
  })
  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+[\]{};':",.<>/?\\|])\S{8,}$/,
    {
      message:
        'At least one uppercase, one lowercase, one number, and one special character, and no spaces',
    },
  )
  newPassword: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'securePassword@123',
  })
  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+[\]{};':",.<>/?\\|])\S{8,}$/,
    {
      message:
        'At least one uppercase, one lowercase, one number, and one special character, and no spaces',
    },
  )
  confirmPassword: string;
}
