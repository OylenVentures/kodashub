import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { DomainStatus, DomainOrderType } from './domain-status.enum.js';
import { DomainRegistrar } from '../registrars/interfaces/registrar-provider.interface.js';

/**
 * Local record of a domain purchased/transferred through this platform.
 * The registrar (ResellerClub/Whogohost) remains the source of truth for
 * registry state; this row exists so we can (a) enforce ownership without
 * round-tripping to the registrar on every request, (b) query "my domains"
 * quickly, and (c) know which registrar + external order to talk to for
 * any given domain.
 */
@Entity('domains')
export class Domain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index({ unique: true })
  @Column()
  domainName: string;

  @Column()
  tld: string;

  @Column({ type: 'enum', enum: DomainRegistrar })
  registrar: DomainRegistrar;

  @Column({ type: 'enum', enum: DomainOrderType })
  orderType: DomainOrderType;

  @Column({ type: 'enum', enum: DomainStatus, default: DomainStatus.PENDING })
  status: DomainStatus;

  // The registrar's own identifier for this order (ResellerClub: entityid /
  // order-id; Whogohost: whatever their API returns) — how we look this
  // domain up when calling the registrar again.
  @Column({ nullable: true })
  externalOrderId?: string;

  @Column('simple-array', { nullable: true })
  nameservers?: string[];

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ type: 'timestamp', nullable: true })
  registeredAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
