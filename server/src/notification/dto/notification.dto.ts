import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestNotificationDto {
  @ApiProperty({
    description: 'Name of the person making the request',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of the person making the request',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Service for which the notification is being requested',
    example: 'DNS Support',
  })
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty({
    description: 'Affected domain or url',
    example: 'example.com',
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiPropertyOptional({
    description: 'Hosting provider or cPanel ',
    example: 'Whogohost',
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({
    description: 'Message for the notification',
    example: 'I need help with my account.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Priority level of the request',
    example: 'Medium',
  })
  @IsString()
  @IsNotEmpty()
  priority: string;
}

export class ContactNotificationDto {
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
