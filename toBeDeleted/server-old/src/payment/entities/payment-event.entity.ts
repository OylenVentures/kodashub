import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payment_event')
@Index(['paystackEventId'], { unique: true })
@Index(['transactionRef'])
export class PaymentEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  paystackEventId: string; // Paystack event ID for deduplication

  @Column({ nullable: true })
  transactionRef?: string; // Paystack transaction reference

  @Column()
  eventType: string; // charge.success, transfer.failed, etc.

  @Column({ type: 'jsonb', nullable: false })
  payload: any; // Full webhook payload for audit

  @Column({ enum: ['success', 'failed', 'processing'], default: 'processing' })
  processingStatus: string;

  @Column({ nullable: true })
  processingError?: string; // Error message if processing failed

  @CreateDateColumn()
  receivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;
}
