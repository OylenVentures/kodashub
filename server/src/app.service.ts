import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { Seed } from './utils/seed.js';

@Injectable()
export class AppService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async onModuleInit() {
    await new Seed(this.userRepo).seedUsers();
  }
}
