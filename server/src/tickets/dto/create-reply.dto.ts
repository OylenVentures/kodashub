import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReplyDto {
  @ApiProperty({
    description: 'The message content of the reply',
    example: 'Thank you for your inquiry. We will get back to you shortly.',
    type: 'string',
    minLength: 10,
    maxLength: 10000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Please provide a bit more detail (at least 10 characters)',
  })
  @MaxLength(10000)
  message: string;
}
