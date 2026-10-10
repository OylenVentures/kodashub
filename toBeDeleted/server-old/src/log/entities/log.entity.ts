import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  action: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  ipAddress: string;

  @Column({ nullable: false })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.logs, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
