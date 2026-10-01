import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { DomainsService } from './domains.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserRole } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import { SearchDomainDto } from './dto/search-domain.dto.js';
import { PurchaseDomainDto } from './dto/purchase-domain.dto.js';
import { TransferDomainDto } from './dto/transfer-domain.dto.js';
import { NameserversDto } from './dto/nameservers.dto.js';
import {
  CreateDnsRecordDto,
  UpdateDnsRecordDto,
} from './dto/dns-record.dto.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Global JwtAuthGuard already applies — every route here requires a logged-in user.
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'Bad request error occurred.',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized error occurred.',
})
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred.',
})
@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @ApiOperation({
    summary: 'Search for domain availability',
    description:
      'Search for domain availability. Returns a list of TLDs and their availability status.',
  })
  @ApiOkResponse({
    description: 'Returns a list of TLDs and their availability status.',
  })
  @Get('search')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  search(@Query() dto: SearchDomainDto): unknown {
    return this.domainsService.checkAvailability(dto.query, dto.tlds);
  }

  @ApiOperation({
    summary: 'List my domains',
    description: 'List all domains associated with the current user.',
  })
  @ApiOkResponse({
    description: 'Returns a list of domains associated with the current user.',
  })
  @Get()
  listMine(@CurrentUser() user: User) {
    return this.domainsService.listMyDomains(user);
  }

  @ApiOperation({
    summary: 'Get a single domain',
    description: 'Get a single domain by its ID.',
  })
  @ApiOkResponse({
    description: 'Returns the domain with the specified ID.',
  })
  @Get(':id')
  getOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.domainsService.getDomain(user, id);
  }

  @ApiOperation({
    summary: 'Purchase a domain',
    description: 'Purchase a domain and associate it with the current user.',
  })
  @ApiCreatedResponse({
    description: 'Returns the purchased domain.',
  })
  @Post('purchase')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  purchase(@CurrentUser() user: User, @Body() dto: PurchaseDomainDto) {
    return this.domainsService.purchaseDomain(user, dto);
  }

  @ApiOperation({
    summary: 'Transfer a domain',
    description: 'Transfer a domain to the current user.',
  })
  @ApiOkResponse({
    description: 'Returns the transferred domain.',
  })
  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  transfer(@CurrentUser() user: User, @Body() dto: TransferDomainDto) {
    return this.domainsService.transferDomain(user, dto);
  }

  @ApiOperation({
    summary: 'Update nameservers for a domain',
    description: 'Update the nameservers for a specific domain.',
  })
  @ApiOkResponse({
    description: 'Returns the updated domain with the new nameservers.',
  })
  @Patch(':id/nameservers')
  @HttpCode(HttpStatus.OK)
  updateNameservers(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: NameserversDto,
  ) {
    return this.domainsService.updateNameservers(user, id, dto.nameservers);
  }

  @ApiOperation({
    summary: 'List DNS records for a domain',
    description: 'List all DNS records for a specific domain.',
  })
  @ApiOkResponse({
    description: 'Returns a list of DNS records for the specified domain.',
  })
  @Get(':id/dns-records')
  listDnsRecords(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.domainsService.listDnsRecords(user, id);
  }

  @ApiOperation({
    summary: 'Create a DNS record for a domain',
    description: 'Create a new DNS record for a specific domain.',
  })
  @ApiCreatedResponse({
    description: 'Returns the newly created DNS record.',
  })
  @Post(':id/dns-records')
  createDnsRecord(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateDnsRecordDto,
  ) {
    return this.domainsService.createDnsRecord(user, id, dto);
  }

  @ApiOperation({
    summary: 'Update a DNS record for a domain',
    description: 'Update a specific DNS record for a domain.',
  })
  @ApiOkResponse({
    description: 'Returns the updated DNS record.',
  })
  @Patch(':id/dns-records/:recordId')
  @HttpCode(HttpStatus.OK)
  updateDnsRecord(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('recordId') recordId: string,
    @Body() dto: UpdateDnsRecordDto,
  ) {
    return this.domainsService.updateDnsRecord(user, id, recordId, dto);
  }

  @ApiOperation({
    summary: 'Delete a DNS record for a domain',
    description: 'Delete a specific DNS record for a domain.',
  })
  @ApiNoContentResponse({
    description: 'The DNS record was successfully deleted.',
  })
  @Delete(':id/dns-records/:recordId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteDnsRecord(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('recordId') recordId: string,
  ) {
    return this.domainsService.deleteDnsRecord(user, id, recordId);
  }

  // Staff-only: force a fresh pull of status/expiry from Blesta.
  @ApiOperation({
    summary: 'Sync domain from Blesta (staff only)',
    description:
      'Force a fresh pull of status/expiry from Blesta. Staff-only operation.',
  })
  @ApiOkResponse({
    description: 'Returns the updated domain information after syncing.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden. Only staff members can perform this operation.',
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPORT_AGENT)
  @Post(':id/sync')
  @HttpCode(HttpStatus.OK)
  sync(@Param('id', ParseUUIDPipe) id: string) {
    return this.domainsService.syncFromBlesta(id);
  }
}
