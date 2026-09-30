import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The first name of the user',
    maxLength: 100,
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'The last name of the user',
    maxLength: 100,
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    maxLength: 20,
    example: '+1 (555) 123-4567',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, { message: 'Phone number is invalid' })
  phone?: string;
}
