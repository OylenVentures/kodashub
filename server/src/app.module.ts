import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    ThrottlerModule.forRootAsync({
      useFactory: () =>
        ({
          ttl: 3600, // Time to live in seconds
          limit: 5, // Maximum number of requests per ttl
          throttlers: [{ ttl: 60000, limit: 10 }], // Add the throttlers property here
        }) as ThrottlerModuleOptions,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [createKeyv(process.env.REDIS_URL)],
        };
      },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
