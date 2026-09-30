import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();

let initialized = false;

async function bootstrap() {
  if (!initialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    await app.init();
    initialized = true;
  }

  return server;
}

export default bootstrap();
