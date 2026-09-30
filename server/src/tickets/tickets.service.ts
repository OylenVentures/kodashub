import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity.js';
import { TicketReply } from './entities/ticket-reply.entity.js';
import { TicketStatus } from './entities/ticket.enums.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { CreateReplyDto } from './dto/create-reply.dto.js';
import { ListTicketsQueryDto } from './dto/list-tickets-query.dto.js';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { isStaffRole } from '../common/enums/role.enum.js';
import { MailService } from '../mail/mail.service.js';
import { UpdateStatusQueryDto } from './dto/update-status-query.dto.js';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketsRepository: Repository<SupportTicket>,
    @InjectRepository(TicketReply)
    private repliesRepository: Repository<TicketReply>,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  // ---------- Create ----------

  async createTicket(user: User, dto: CreateTicketDto): Promise<SupportTicket> {
    const ticket = await this.ticketsRepository.save(
      this.ticketsRepository.create({
        userId: user.id,
        subject: dto.subject,
        department: dto.department,
        priority: dto.priority,
        status: TicketStatus.OPEN,
      }),
    );

    const openingMessage = await this.repliesRepository.save(
      this.repliesRepository.create({
        ticketId: ticket.id,
        authorId: user.id,
        isStaffReply: false,
        message: dto.message,
      }),
    );

    ticket.lastRepliedAt = openingMessage.createdAt;
    await this.ticketsRepository.save(ticket);

    return this.getTicket(user, ticket.id);
  }

  // ---------- Reply ----------

  async addReply(
    user: User,
    ticketId: string,
    dto: CreateReplyDto,
  ): Promise<TicketReply> {
    const ticket = await this.findTicketOrThrow(ticketId);
    this.assertCanAccess(user, ticket);

    if (ticket.status === TicketStatus.CLOSED) {
      ticket.closedAt = null;
    }

    const staffReply = isStaffRole(user.role);

    const reply = await this.repliesRepository.save(
      this.repliesRepository.create({
        ticketId: ticket.id,
        authorId: user.id,
        isStaffReply: staffReply,
        message: dto.message,
      }),
    );

    ticket.status = staffReply
      ? TicketStatus.ANSWERED
      : TicketStatus.CUSTOMER_REPLY;
    ticket.lastRepliedAt = reply.createdAt;
    if (staffReply && !ticket.assignedStaffId) {
      ticket.assignedStaffId = user.id;
    }
    await this.ticketsRepository.save(ticket);

    if (staffReply) {
      // Fire-and-forget from the caller's perspective, but awaited here so a
      // mail failure is logged (MailService swallows send errors internally
      // rather than failing the request — see MailService.send).
      const client = await this.usersService.findById(ticket.userId);
      await this.mailService.sendTicketReplyNotification(
        client,
        ticket.id,
        ticket.subject,
      );
    }

    return reply;
  }

  // ---------- Status changes ----------

  async statusTicket(
    ticketId: string,
    dto: UpdateStatusQueryDto,
  ): Promise<SupportTicket> {
    const ticket = await this.findTicketOrThrow(ticketId);
    ticket.status = dto.status;

    if (dto.status === TicketStatus.CLOSED) {
      ticket.closedAt = new Date();
    }

    const client = await this.usersService.findById(ticket.userId);
    await this.mailService.sendTicketUpdateNotification(
      client,
      ticket.id,
      ticket.subject,
      ticket.status,
    );

    return this.ticketsRepository.save(ticket);
  }

  // ---------- Reads ----------

  async listTickets(
    user: User,
    query: ListTicketsQueryDto,
  ): Promise<PaginatedResult<SupportTicket>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.ticketsRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.assignedStaff', 'assignedStaff')
      .orderBy('ticket.lastRepliedAt', 'DESC', 'NULLS LAST')
      .addOrderBy('ticket.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // Clients only ever see their own tickets — staff/admin see everything,
    // optionally filtered below.
    if (!isStaffRole(user.role)) {
      qb.andWhere('ticket.userId = :userId', { userId: user.id });
    }

    if (query.status)
      qb.andWhere('ticket.status = :status', { status: query.status });
    if (query.department)
      qb.andWhere('ticket.department = :department', {
        department: query.department,
      });
    if (query.priority)
      qb.andWhere('ticket.priority = :priority', { priority: query.priority });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async getTicket(user: User, ticketId: string): Promise<SupportTicket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
      relations: { user: true, assignedStaff: true },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    this.assertCanAccess(user, ticket);

    ticket.replies = await this.repliesRepository.find({
      where: { ticketId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
    });

    return ticket;
  }

  // ---------- Helpers ----------

  private async findTicketOrThrow(ticketId: string): Promise<SupportTicket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  private assertCanAccess(user: User, ticket: SupportTicket): void {
    const isOwner = ticket.userId === user.id;
    if (!isOwner && !isStaffRole(user.role)) {
      throw new ForbiddenException('You do not have access to this ticket');
    }
  }
}
