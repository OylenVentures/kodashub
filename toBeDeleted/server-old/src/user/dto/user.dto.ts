import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';
import { RegisterUserDto } from '../../auth/dto/auth.dto';

export class CreateAdminDto extends RegisterUserDto {}

export class UpdateUserDto extends PartialType(RegisterUserDto) {}

export class UpdatePasswordDto {
  @ApiProperty({ example: 'password-123', description: 'Current password' })
  @IsString()
  @MinLength(6)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+[\]{};':",.<>/?\\|])\S{8,}$/,
    {
      message:
        'At least one uppercase, one lowercase, one number, and one special character, and no spaces',
    },
  )
  currentPasword: string;

  @ApiProperty({ example: 'passw0rd-123', description: 'New password' })
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

  @ApiProperty({ example: 'passw0rd-123', description: 'Confirm new password' })
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
