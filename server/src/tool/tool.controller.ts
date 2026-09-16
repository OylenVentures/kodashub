import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ToolService } from './tool.service';
import { StorageSyncDto, VoltCalcToolDto } from './dto/tool.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @ApiOperation({
    summary: 'Calculate electricity usage',
    description:
      'Calculate electricity usage based on current and previous meter readings and tariff band',
  })
  @ApiOkResponse({ description: 'Electricity usage calculated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @Post('voltcalc')
  @HttpCode(HttpStatus.OK)
  calculateVoltUsage(@Body() dto: VoltCalcToolDto) {
    return this.toolService.calculateVoltUsage(dto);
  }

  @ApiOperation({
    summary: 'Sync Cloudinary to S3',
    description: 'Sync Cloudinary to S3',
  })
  @ApiOkResponse({
    description: 'Cloudinary to S3 sync completed successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @Post('cloudinary-s3-sync')
  @HttpCode(HttpStatus.OK)
  cloudinaryS3Sync(@Body() dto: StorageSyncDto) {
    return this.toolService.cloudinaryS3Sync(dto);
  }

  @ApiOperation({
    summary: 'Sync Cloudflare to S3',
    description: 'Sync Cloudflare to S3',
  })
  @ApiOkResponse({
    description: 'Cloudflare to S3 sync completed successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @Post('cloudflare-s3-sync')
  @HttpCode(HttpStatus.OK)
  cloudflareS3Sync(@Body() dto: StorageSyncDto) {
    return this.toolService.cloudflareS3Sync(dto);
  }
}
