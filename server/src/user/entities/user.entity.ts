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
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: false })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: false })
  password: string;

  @Column({ enum: ['super_admin', 'admin', 'user'], default: 'user' })
  role: string;

  @Column({ nullable: true })
  verificationCode?: string;

  @Column({ nullable: true })
  verificationTime?: Date;

  @Column({ nullable: true })
  resetPasswordCode?: string;

  @Column({ nullable: true })
  resetPasswordTime?: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart[];

  @OneToMany(() => Domain, (domain) => domain.user, { cascade: true })
  domains: Domain[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments: Payment[];

  @OneToMany(() => Log, (log) => log.user, { cascade: true })
  logs: Log[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
