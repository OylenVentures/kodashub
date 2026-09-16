import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { LogService } from '../log/log.service';
import { Log } from '../log/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Log])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LogService],
})
export class AuthModule {}
