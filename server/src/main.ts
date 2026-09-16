import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { exit } from 'process';
import { NextFunction, Request, Response } from 'express';
import setupSwagger from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

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
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 4001, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
