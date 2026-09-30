import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  ForbiddenException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { DomainService } from './domain.service';
import {
  CheckDomainDto,
  UpdateContactDetailsDto,
  UpdateDomainStatusDto,
  UpdateNameserverDto,
} from './dto/domain.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all domains',
    description: 'Retrieve all domains (admin only)',
  })
  @ApiOkResponse({ description: 'Domains retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UseGuards(JwtGuard)
  @Get('all')
  findAll(@Req() req: any) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to restore user');
    }
    return this.domainService.findAll();
  }

  @ApiOperation({
    summary: 'Check for domain availability',
    description: 'Check for domain availability',
  })
  @ApiOkResponse({ description: 'Domain retrieved successfully' })
  @Post('check')
  @HttpCode(HttpStatus.OK)
  whoisChecker(@Body() dto: CheckDomainDto) {
    return this.domainService.whoisChecker(dto);
  }

  @ApiOperation({
    summary: 'Search for a registered domain',
    description: 'Search for a registered domain',
  })
  @ApiOkResponse({ description: 'Domain retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get('search')
  search(@Query('domain') domain: string) {
    return this.domainService.search(domain);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register a domain',
    description: 'Register a domain',
  })
  @UseGuards(JwtGuard)
  @Post('register')
  register(
    @Body() dto: { name: string; regPeriod: string; status?: string },
    @Req() req: any,
  ) {
    return this.domainService.register(dto, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all domains',
    description: 'Retrieve all domains',
  })
  @ApiOkResponse({ description: 'Domains retrieved successfully' })
  @UseGuards(JwtGuard)
  @Get('user')
  findUserDomains(@Req() req: any) {
    return this.domainService.findUserDomains(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a domain', description: 'Retrieve a domain' })
  @ApiOkResponse({ description: 'Domain retrieved successfully' })
  @UseGuards(JwtGuard)
  @Get(':id')
  findOneDomain(@Param('id') domainId: string) {
    return this.domainService.findOneDomain(domainId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get EPP code', description: 'Retrieve EPP code' })
  @ApiOkResponse({ description: 'EPP code retrieved successfully' })
  @UseGuards(JwtGuard)
  @Get('epp-code')
  getEppCode(@Req() req: any, @Query('domainId') domainId: string) {
    return this.domainService.getEppCode(domainId, req.user?.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Lock Status',
    description: 'Retrieve Lock Status',
  })
  @ApiOkResponse({ description: 'Lock Status retrieved successfully' })
  @UseGuards(JwtGuard)
  @Get('lock')
  getLockStatus(@Req() req: any, @Query('domainId') domainId: string) {
    return this.domainService.getLockStatus(domainId, req.user?.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Lock Status',
    description: 'Update Lock Status (admin only)',
  })
  @ApiOkResponse({ description: 'Lock Status updated successfully' })
  @UseGuards(JwtGuard)
  @Post('lock')
  updateLockStatus(
    @Query('domainId') domainId: string,
    @Query('status') status: string,
    @Req() req: any,
  ) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException(
        'You are not authorized to update domain lock status',
      );
    }
    return this.domainService.updateLockStatus(domainId, status);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Contact Details',
    description: 'Retrieve Contact Details',
  })
  @ApiOkResponse({ description: 'Contact Details retrieved successfully' })
  @UseGuards(JwtGuard)
  @Get('contact')
  getContactDetails(@Req() req: any, @Query('domainId') domainId: string) {
    return this.domainService.getContactDetails(domainId, req.user?.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Contact Details',
    description: 'Update Contact Details (admin only)',
  })
  @ApiOkResponse({ description: 'Contact Details updated successfully' })
  @UseGuards(JwtGuard)
  @Post('contact')
  updateContacDetails(@Body() dto: UpdateContactDetailsDto, @Req() req: any) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException(
        'You are not authorized to update domain lock status',
      );
    }
    return this.domainService.updateContactDetails(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Nameservers',
    description: 'Retrieve Nameservers',
  })
  @ApiOkResponse({ description: 'Nameservers retrieved successfully' })
  @UseGuards(JwtGuard)
  @Get('nameservers')
  getNameservers(@Req() req: any, @Query('domainId') domainId: string) {
    return this.domainService.getNameservers(domainId, req.user?.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update nameservers',
    description: 'Update nameservers',
  })
  @ApiOkResponse({ description: 'Nameservers updated successfully' })
  @UseGuards(JwtGuard)
  @Patch('update/nameservers')
  @HttpCode(HttpStatus.OK)
  updateNameservers(@Body() dto: UpdateNameserverDto) {
    return this.domainService.updateNameservers(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update domain status',
    description: 'Update domain status (admin only)',
  })
  @ApiOkResponse({ description: 'Domain status updated successfully' })
  @UseGuards(JwtGuard)
  @Patch('update/status')
  @HttpCode(HttpStatus.OK)
  updateDomainStatus(@Body() dto: UpdateDomainStatusDto, @Req() req: any) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to restore user');
    }
    return this.domainService.updateDomainStatus(dto);
  }

  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Renew a domain', description: 'Renew a domain' })
  // @ApiOkResponse({ description: "Domain renewed successfully" })
  // @UseGuards(JwtGuard)
  // @Post('renew')
  // @HttpCode(HttpStatus.OK)
  // renew(@Body() dto: SearchDomainDto) {
  //   return this.domainService.renew(dto);
  // }
}
