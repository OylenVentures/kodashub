import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import buildSwaggerConfig from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || [],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      // credentials: true, // optional — needed only if using cookies/auth headers
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  buildSwaggerConfig(app);
  await app.listen(process.env.PORT ?? 4001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
