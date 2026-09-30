import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { UserRole } from '../common/enums/role.enum.js';
import { UserStatus } from '../common/enums/user-status.enum.js';
import { Logger } from '@nestjs/common';

export class Seed {
  private readonly logger = new Logger(Seed.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async seedUsers() {
    const userData = {
      firstName: process.env.FIRSTNAME || '',
      lastName: process.env.LASTNAME || '',
      email: process.env.EMAIL || '',
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
      isEmailVerified: true,
    };

    const existingUser = await this.userRepo.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (!existingUser) {
      await this.userRepo.save(userData);
      this.logger.log('Super Admin seeded successfully!');
    } else {
      this.logger.log('Super Admin already exist, skipping seed.');
    }
  }
}
