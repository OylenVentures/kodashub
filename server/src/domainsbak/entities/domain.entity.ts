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

/**
 * Local record of a domain purchased/transferred through this platform.
 * Blesta remains the source of truth for billing/registrar state; this row
 * exists so we can (a) enforce ownership without round-tripping to Blesta on
 * every request, (b) query "my domains" quickly, and (c) survive if Blesta
 * is briefly unreachable when just displaying a list.
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

  @Column({ type: 'enum', enum: DomainOrderType })
  orderType: DomainOrderType;

  @Column({ type: 'enum', enum: DomainStatus, default: DomainStatus.PENDING })
  status: DomainStatus;

  // Blesta identifiers — how we look this domain up when calling the API again.
  @Column({ nullable: true })
  blestaServiceId?: number;

  @Column()
  blestaClientId: number;

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
