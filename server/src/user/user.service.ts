import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAdminDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/user.dto';
import * as argon from 'argon2';
import { Otp } from '../utils/otp';
import { Mail } from '../utils/mail';
import { LogService } from '../log/log.service';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private logService: LogService,
  ) {}

  async createAdmin(dto: CreateAdminDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (user) throw new BadRequestException('User already exists');

    dto.email = dto.email.toLowerCase();
    const hashedPassword = await argon.hash(dto.password);
    const otp = new Otp().generateOTP();
    const createdUser = await this.userRepo.save({
      ...dto,
      password: hashedPassword,
      role: 'admin',
      verificationCode: otp.token,
      verificationTime: otp.expiration,
    });

    const messageBody = `
      <p>Dear ${createdUser.firstName}</p>
      <p>Your admin account has been created. Please verify your email address to complete your registration.</p>
      <p>Click the link <b>${process.env.FRONTEND_URL}/verify?token=${otp.token}</b>. This link will expire in 10 mins</p>
      <p>Please reset your password after verifying your account.</p>
      <p>Best regards,</p>
      <p><b>The KodasHub Team</b></p>
      `;
    const sendMail = await new Mail().sendMail(
      createdUser.email,
      'Admin account created',
      messageBody,
    );
    return {
      message: sendMail.message,
      result: { id: createdUser.id, email: createdUser.email },
    };
  }

  async findAll() {
    const users = await this.userRepo.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phoneNumber: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { message: 'Users retrieved successfully', result: users };
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException('Id is required');

    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phoneNumber: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return { message: 'User retrieved successfully', result: user };
  }

  async findMe(id: string) {
    if (!id) throw new BadRequestException('Id is required');

    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phoneNumber: true,
        companyName: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        role: true,
        isDeleted: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return { message: 'User retrieved successfully', result: user };
  }

  async updateUser(id: string, dto: UpdateUserDto, req: Request) {
    if (!id) throw new BadRequestException('Id is required');

    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phoneNumber: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.update(id, dto);
    await this.logService.create(
      {
        action: 'Update profile',
        description: 'User profile updated successfully',
      },
      user.id,
      req,
    );
    return { message: 'User profile updated successfully' };
  }

  async updatePassword(id: string, dto: UpdatePasswordDto, req: Request) {
    if (!id) throw new BadRequestException('Id is required');

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await argon.verify(
      user.password,
      dto.currentPasword,
    );
    if (!isPasswordValid)
      throw new BadRequestException('Invalid current password');
    if (dto.newPassword !== dto.confirmPassword)
      throw new BadRequestException(
        'New password and confirm password do not match',
      );

    const hashedPassword = await argon.hash(dto.newPassword);
    await this.userRepo.update(id, { password: hashedPassword });
    await this.logService.create(
      {
        action: 'Update password',
        description: 'User password updated successfully',
      },
      user.id,
      req,
    );
    return { message: 'Password updated successfully' };
  }

  async softDelete(id: string, req: Request) {
    if (!id) throw new BadRequestException('Id is required');

    const user = await this.userRepo.findOne({
      where: { id },
      select: { password: false },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.isDeleted) throw new BadRequestException('User already deleted');

    await this.userRepo.update(id, { isDeleted: true });
    await this.logService.create(
      { action: 'Delete user', description: 'User deleted successfully' },
      user.id,
      req,
    );
    return { message: 'User deleted successfully' };
  }

  async delete(id: string) {
    if (!id) throw new BadRequestException('Id is required');

    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phoneNumber: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.remove(user);
    return { message: 'User deleted successfully' };
  }

  async restore(id: string) {
    if (!id) throw new BadRequestException('Id is required');

    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        phoneNumber: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isDeleted)
      throw new BadRequestException('User is active, restoration not needed');

    await this.userRepo.update(id, { isDeleted: false });
    return { message: 'User restored successfully' };
  }
}
