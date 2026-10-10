import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as argon from 'argon2';

export class Seed {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async seedUsers() {
    const userData = {
      firstName: process.env.FIRSTNAME || '',
      lastName: process.env.LASTNAME || '',
      email: process.env.EMAIL || '',
      password: process.env.PASSWORD || '',
      companyName: 'KodasHub',
      address: '',
      phoneNumber: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      role: 'super_admin',
      isVerified: true,
      verificationTime: new Date(),
      verificationCode: '',
    };

    const existingUser = await this.userRepo.findOne({
      where: { email: userData.email },
    });
    const hash = await argon.hash(userData.password);
    userData.password = hash;

    if (!existingUser) {
      await this.userRepo.save(userData);
      console.log('Super Admin seeded successfully!');
    } else {
      console.log('Super Admin already exist, skipping seed.');
    }
  }
}
