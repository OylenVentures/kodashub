import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('domain')
@Index(['name', 'user'], { unique: true })
export class Domain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  registrationPeriod: number;

  @Column({ nullable: false })
  registrationPrice: number;

  @Column({ nullable: true })
  renewalPrice?: number;

  @Column({
    enum: [
      'active',
      'failed',
      'suspended',
      'grace',
      'redemption',
      'expired',
      'cancelled',
    ],
    default: 'active',
  })
  status: string;

  @Column({ nullable: true })
  registrarOrderId?: string; // Go54 or provider order ID for tracking

  @Column({ nullable: true })
  expiryDate?: Date;

  @ManyToOne(() => User, (user) => user.domains, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
