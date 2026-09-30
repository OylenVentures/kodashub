import { Cart } from '../../cart/entities/cart.entity';
import { Domain } from '../../domain/entities/domain.entity';
import { Log } from '../../log/entities/log.entity';
import { Payment } from '../../payment/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: true })
  company_name?: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: false })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: false })
  password: string;

  @Column({ enum: ['HOST', 'ADMIN', 'CUSTOMER'], default: 'CUSTOMER' })
  role: string;

  @Column({ nullable: true })
  verification_code?: string;

  @Column({ nullable: true })
  verification_time?: Date;

  @Column({ nullable: true })
  reset_code?: string;

  @Column({ nullable: true })
  reset_time?: Date;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart[];

  @OneToMany(() => Domain, (domain) => domain.user, { cascade: true })
  domains: Domain[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments: Payment[];

  @OneToMany(() => Log, (log) => log.user, { cascade: true })
  logs: Log[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
