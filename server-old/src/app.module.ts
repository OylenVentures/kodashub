import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DomainModule } from './domain/domain.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
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
      entities: [],
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: 3600, // Time to live in seconds
        limit: 5, // Maximum number of requests per ttl
        throttlers: [
          { ttl: 60000, limit: 10 }, // Global: 10 req per 60s
        ],
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [createKeyv(process.env.REDIS_URL)],
        };
      },
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
