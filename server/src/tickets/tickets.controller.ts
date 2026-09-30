import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TicketsService } from './tickets.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { STAFF_ROLES } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { CreateReplyDto } from './dto/create-reply.dto.js';
import { ListTicketsQueryDto } from './dto/list-tickets-query.dto.js';
import { SupportTicket } from './entities/support-ticket.entity.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateStatusQueryDto } from './dto/update-status-query.dto.js';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Global JwtAuthGuard already applies - every route here requires a logged-in user.
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiTooManyRequestsResponse({ description: 'Too many requests' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @ApiOperation({
    summary: 'Create a new ticket',
    description:
      'Creates a new support ticket and adds the opening message as the first reply.',
  })
  @ApiCreatedResponse({
    description: 'The support ticket has been successfully created.',
    type: SupportTicket,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data. Please check the request body.',
  })
  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  create(@CurrentUser() user: User, @Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(user, dto);
  }

  // Clients see only their own tickets; staff/admin see everything, filterable below.
  @ApiOperation({
    summary: 'List tickets',
    description:
      'Retrieves a paginated list of support tickets. Clients see only their own tickets; staff/admin can see all tickets.',
  })
  @ApiOkResponse({
    description: 'A paginated list of support tickets.',
    type: [SupportTicket],
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters. Please check the request.',
  })
  @Get()
  list(
    @CurrentUser() user: User,
    @Query() query: ListTicketsQueryDto,
  ): Promise<PaginatedResult<SupportTicket>> {
    return this.ticketsService.listTickets(user, query);
  }

  @ApiOperation({
    summary: 'Get a specific ticket',
    description:
      'Retrieves a specific support ticket by its ID. Clients can access only their own tickets; staff/admin can access any ticket.',
  })
  @ApiOkResponse({
    description: 'The requested support ticket.',
    type: SupportTicket,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ticket ID. Please check the request parameters.',
  })
  @Get(':id')
  getOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.getTicket(user, id);
  }

  // Open to both the ticket owner and staff/admin - the service decides the
  // resulting status (CUSTOMER_REPLY vs ANSWERED) based on who's replying.
  @ApiOperation({
    summary: 'Reply to a ticket',
    description:
      'Adds a reply to a specific support ticket. Both the ticket owner and staff/admin can add replies.',
  })
  @ApiOkResponse({
    description: 'The reply has been successfully added to the support ticket.',
    type: SupportTicket,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or ticket ID. Please check the request.',
  })
  @Post(':id/reply')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  reply(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.ticketsService.addReply(user, id, dto);
  }

  @ApiOperation({
    summary: 'Update a ticket status',
    description:
      'Updates the status of a specific support ticket. Only staff/admin can update ticket statuses.',
  })
  @ApiOkResponse({
    description: 'The support ticket has been successfully updated.',
    type: SupportTicket,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ticket ID. Please check the request parameters.',
  })
  @UseGuards(RolesGuard)
  @Roles(...STAFF_ROLES)
  @Post(':id/status')
  @HttpCode(HttpStatus.OK)
  status(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusQueryDto,
  ) {
    return this.ticketsService.statusTicket(id, dto);
  }
}
