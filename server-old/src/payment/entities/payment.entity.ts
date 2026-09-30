import { User } from '../../user/entities/user.entity';
import { Cart } from '../../cart/entities/cart.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('payment')
@Index(['transactionRef'], {
  unique: true,
})
@Index(['idempotencyKey'], { unique: true })
@Index(['status'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  idempotencyKey: string;

  @Column({ nullable: false })
  amount: number; // in cents (e.g., 50000 for ₦500)

  @Column({ nullable: false })
  currency: string; // NGN

  @Column({ nullable: false })
  serviceType: string; // 'domain', 'hosting', 'ssl', 'email', etc.

  @Column({
    enum: ['pending', 'paid', 'fulfilled', 'failed', 'refunded'],
    default: 'pending',
  })
  status: string;

  @Column({ nullable: true })
  transactionRef?: string; // Paystack reference (unique)

  @Column({ nullable: true })
  authorizationUrl?: string; // Checkout URL from Paystack

  @Column({ nullable: true })
  paystackResponse?: string; // JSON stringified response for audit

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // Service-specific metadata for fulfillment

  @Column({ type: 'jsonb', nullable: true })
  cartItemsSnapshot?: Array<{
    id: string;
    serviceType: string;
    price: number;
    metadata: Record<string, any>;
  }>;

  @Column({ type: 'int', nullable: true })
  cartCount?: number;

  @Column({ nullable: true })
  failureReason?: string; // Reason if payment failed

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date; // When payment was confirmed

  @Column({ type: 'timestamp', nullable: true })
  fulfilledAt?: Date; // When domain was registered

  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date; // When payment failed

  @ManyToOne(() => Cart, { nullable: true, onDelete: 'SET NULL' })
  cart?: Cart;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
