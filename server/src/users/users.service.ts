import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from './entities/user.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { MailService } from '../mail/mail.service.js';
import { ListUserQueryDto } from './dto/list-user.dto.js';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  /** Same as findByEmail but also selects the password hash (needed for login). */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.passwordExpires')
      .addSelect('user.failedLoginAttempts')
      .addSelect('user.lockUntil')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async create(data: Partial<User>): Promise<User> {
    const existing = await this.findByEmail(data.email as string);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }
    const user = this.usersRepository.create({
      ...data,
      email: (data.email as string).toLowerCase(),
    });
    return this.usersRepository.save(user);
  }

  async listUsers(query: ListUserQueryDto): Promise<PaginatedResult<User>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .where('user.firstName != :root', { root: 'Root' })
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.email) qb.andWhere('user.email = :email', { email: query.email });
    if (query.role) qb.andWhere('user.role = :role', { role: query.role });

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async createUser(dto: CreateUserDto): Promise<{ message: string }> {
    const user = await this.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      role: dto.role,
    });

    const rawToken = await this.setVerificationToken(user);
    await this.mailService.sendOpsVerificationEmail(user, rawToken);

    return {
      message:
        'User created successfully. Verification email sent to the user.',
    };
  }

  async delete(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (user && user.role === 'admin') {
      throw new ConflictException('Cannot delete an admin user');
    }

    await this.usersRepository.remove(user);

    return { message: 'User deleted successfully.' };
  }

  private async setVerificationToken(user: User): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationTokenHash = this.hashToken(rawToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await this.usersRepository.save(user);
    return rawToken;
  }

  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }
}
