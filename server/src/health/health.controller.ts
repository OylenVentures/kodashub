import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'App is not healthy' })
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Check app health',
    description: 'Returns the health status of the app',
  })
  @ApiOkResponse({ description: 'App is healthy' })
  @Get()
  status() {
    return this.healthService.status();
  }
}
