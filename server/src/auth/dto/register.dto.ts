import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SendEmailDto } from './send-email.dto.js';

export class RegisterDto extends SendEmailDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Phone number is invalid' })
  phone?: string;
}
