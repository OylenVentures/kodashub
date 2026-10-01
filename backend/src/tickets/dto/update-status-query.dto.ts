import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../entities/ticket.enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusQueryDto {
  @ApiProperty({
    description: 'The status of the tickets',
    enum: TicketStatus,
  })
  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
