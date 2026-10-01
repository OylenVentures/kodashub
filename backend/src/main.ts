import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import setupApiDocs from './apidocs.js';
// import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  // app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const allowedCors: string[] = process.env.ALLOWED_CORS
    ? process.env.ALLOWED_CORS.split(',').map((origin) => origin.trim())
    : [];

  // if (!allowedCors || allowedCors.length === 0) {
  //   console.warn(
  //     'ALLOWED_CORS environment variable is not set. CORS will be enabled for all origins.',
  //   );
  //   exit(1);
  // }
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

  setupApiDocs(app);

  app.use('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
await bootstrap();
