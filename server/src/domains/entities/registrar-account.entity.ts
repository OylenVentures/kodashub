import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { DomainRegistrar } from '../registrars/interfaces/registrar-provider.interface.js';

/**
 * Caches the external customer/contact identifiers a registrar assigns once
 * we register a user with them, so we don't create a duplicate customer
 * record on every single order. One row per (user, registrar) pair.
 */
@Entity('registrar_accounts')
@Unique(['userId', 'registrar'])
export class RegistrarAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column({ type: 'enum', enum: DomainRegistrar })
  registrar: DomainRegistrar;

  @Column()
  externalCustomerId: string;

  @Column({ nullable: true })
  externalContactId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
