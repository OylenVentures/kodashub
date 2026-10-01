import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TicketDepartment, TicketPriority } from '../entities/ticket.enums.js';
import { CreateReplyDto } from './create-reply.dto.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto extends CreateReplyDto {
  @ApiProperty({
    description: 'The subject of the ticket',
    example: 'Issue with my account login',
    type: 'string',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, {
    message: 'The subject cannot exceed 200 characters',
  })
  subject: string;

  @ApiPropertyOptional({
    description: 'The department to which the ticket should be assigned',
    enum: TicketDepartment,
    default: TicketDepartment.TECHNICAL_SUPPORT,
  })
  @IsOptional()
  @IsEnum(TicketDepartment)
  department?: TicketDepartment = TicketDepartment.TECHNICAL_SUPPORT;

  @ApiPropertyOptional({
    description: 'The priority level of the ticket',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority = TicketPriority.MEDIUM;
}
