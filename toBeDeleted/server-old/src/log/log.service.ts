import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class LogService {
  constructor(@InjectRepository(Log) private logRepo: Repository<Log>) {}

  async create(dto: CreateLogDto, userId: string, req: Request) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    const ipAddress =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const newLog = this.logRepo.create({
      ...dto,
      user: { id: userId },
      ipAddress: ipAddress as string,
      userAgent,
    });

    await this.logRepo.save(newLog);
    return { message: 'Log created successfully', result: newLog };
  }

  async findAll(userId: string) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    const logs = await this.logRepo.find({ where: { user: { id: userId } } });
    return { message: 'Logs retrieved successfully', result: logs };
  }
}
