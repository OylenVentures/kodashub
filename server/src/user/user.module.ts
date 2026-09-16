import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LogService } from '../log/log.service';
import { Log } from '../log/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Log])],
  controllers: [UserController],
  providers: [UserService, LogService],
})
export class UserModule {}
