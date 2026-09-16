import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DomainModule } from './domain/domain.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { LogModule } from './log/log.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { ToolModule } from './tool/tool.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () =>
        ({
          throttlers: [
            { ttl: 60000, limit: 10 }, // Global: 10 req per 60s
          ],
        }) as ThrottlerModuleOptions,
    }),
    DomainModule,
    HealthModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
    LogModule,
    CartModule,
    PaymentModule,
    ToolModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
