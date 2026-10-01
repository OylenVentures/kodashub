import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactDto {
  @ApiProperty({
    description: 'Name of the person sending the message',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of the person sending the message',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Subject of the message',
    example: 'DNS Support',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'The inquiry type of the message',
    example: 'General Query.',
  })
  @IsString()
  @IsNotEmpty()
  inquiry: string;

  @ApiProperty({
    description: 'The body of the message',
    example: 'I need help with my account.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
