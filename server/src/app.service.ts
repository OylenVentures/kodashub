import { Injectable } from '@nestjs/common';
import { Seed } from './utils/seed';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';

@Injectable()
export class AppService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async onModuleInit() {
    await new Seed(this.userRepo).seedUsers();
  }
}
