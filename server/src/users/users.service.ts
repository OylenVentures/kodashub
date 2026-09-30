import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
