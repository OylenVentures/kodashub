import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import type { SupportTicket } from './support-ticket.entity.js';

/**
 * One message in a ticket's conversation thread. The ticket's opening
 * description is stored as the first reply (authored by the client, not a
 * separate "message on ticket" field) so the whole conversation — including
 * the original request — is just one ordered list.
 */
@Entity('ticket_replies')
export class TicketReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  ticketId: string;

  @ManyToOne('SupportTicket', (ticket: SupportTicket) => ticket.replies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticketId' })
  ticket: SupportTicket;

  @Column()
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  // Snapshot at time of reply — whether this came from staff/admin or the
  // client. Kept as its own column (rather than inferred from author.role)
  // so the thread's history stays accurate even if the author's role
  // changes later.
  @Column({ default: false })
  isStaffReply: boolean;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
