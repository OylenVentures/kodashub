import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  ValidationPipe,
  VersioningType,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { exit } from 'process';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import setupSwagger from './swagger.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const allowedCors: string[] = process.env.ALLOWED_CORS
    ? process.env.ALLOWED_CORS.split(',').map((origin) => origin.trim())
    : [];

  if (!allowedCors || allowedCors.length === 0) {
    console.warn(
      'ALLOWED_CORS environment variable is not set. CORS will be enabled for all origins.',
    );
    exit(1);
  }
  app.enableCors({
    origin: allowedCors.length > 0 ? allowedCors : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });
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

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 4001, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

await bootstrap();
