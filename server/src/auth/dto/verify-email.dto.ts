import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'The token of the user',
    example: 'eyJhbGciOi',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
