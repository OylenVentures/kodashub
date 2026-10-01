import { IsString, IsStrongPassword } from 'class-validator';
import { SendEmailDto } from './send-email.dto.js';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto extends SendEmailDto {
  @ApiProperty({
    description: 'The password of the user',
    example: 'Password!23',
    type: 'string',
    minLength: 8,
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
