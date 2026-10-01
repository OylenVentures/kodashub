import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import {
  TicketStatus,
  TicketDepartment,
  TicketPriority,
} from './ticket.enums.js';
import { TicketReply } from './ticket-reply.entity.js';

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // The client who opened the ticket. A client can have many tickets.
  @Index()
  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Set to the first staff member who responds; informational only — any
  // staff/admin can still respond regardless of who's "assigned".
  @Column({ nullable: true })
  assignedStaffId?: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedStaffId' })
  assignedStaff?: User | null;

  @Column({ length: 200 })
  subject: string;

  @Column({
    type: 'enum',
    enum: TicketDepartment,
    default: TicketDepartment.TECHNICAL_SUPPORT,
  })
  department: TicketDepartment;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Index()
  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @OneToMany(() => TicketReply, (reply) => reply.ticket)
  replies: TicketReply[];

  @Column({ type: 'timestamp', nullable: true })
  lastRepliedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  closedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
