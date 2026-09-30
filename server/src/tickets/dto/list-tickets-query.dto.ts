import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketDepartment, TicketPriority } from '../entities/ticket.enums.js';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { UpdateStatusQueryDto } from './update-status-query.dto.js';

export class ListTicketsQueryDto extends PartialType(UpdateStatusQueryDto) {
  @ApiPropertyOptional({
    description: 'The department of the tickets to filter by',
    enum: TicketDepartment,
  })
  @IsOptional()
  @IsEnum(TicketDepartment)
  department?: TicketDepartment;

  @ApiPropertyOptional({
    description: 'The priority of the tickets to filter by',
    enum: TicketPriority,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({
    description: 'The page number to display',
    type: 'number',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'The number of tickets to display per page (1-100)',
    type: 'number',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;
}
