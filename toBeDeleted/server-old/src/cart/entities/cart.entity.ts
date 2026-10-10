import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Generic cart item for any service type
 * - serviceType: 'domain', 'hosting', 'ssl', 'email', etc.
 * - metadata: Service-specific configuration
 */
@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  serviceType: string; // 'domain', 'hosting', 'ssl', 'email', etc.

  @Column({ nullable: false })
  price: number; // Amount in NGN (not cents)

  @Column({ type: 'jsonb', nullable: false })
  metadata: Record<string, any>; // Service-specific data (name, regPeriod, etc.)

  @ManyToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
