import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LogService } from './log.service';
import { JwtGuard } from '../auth/jwt.guard';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(JwtGuard)
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiOperation({
    summary: 'Get all logs for the authenticated user',
    description: 'Returns all logs for the authenticated user',
  })
  @ApiOkResponse({ description: 'Logs retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'You are not logged in' })
  @Get('me')
  findAll(@Req() req: any) {
    if (!req.user.id) {
      throw new UnauthorizedException('You are not logged in');
    }
    return this.logService.findAll(req.user.id);
  }
}
