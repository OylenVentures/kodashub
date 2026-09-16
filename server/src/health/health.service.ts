import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  status() {
    return {
      status: 'Ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
