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
import { WhoisCheckDto } from './dto/whois-check.dto.js';
import { PurchaseDomainDto } from './dto/purchase-domain.dto.js';
import { TransferDomainDto } from './dto/transfer-domain.dto.js';
import { NameserversDto } from './dto/nameservers.dto.js';
import {
  CreateDnsRecordDto,
  UpdateDnsRecordDto,
  DeleteDnsRecordDto,
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
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator.js';

// Global JwtAuthGuard already applies - every route here requires a logged-in user.
@ApiBearerAuth()
@ApiBadRequestResponse({
  description:
    'If the request is malformed or missing required parameters, this will be returned.',
})
@ApiUnauthorizedResponse({
  description: 'If the user is not authenticated, this will be returned.',
})
@ApiTooManyRequestsResponse({
  description:
    'If the user exceeds the rate limit for a given endpoint, this will be returned.',
})
@ApiInternalServerErrorResponse({
  description:
    'If the registrar API is down or returns an unexpected error, this will be returned.',
})
@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @ApiOperation({
    summary: 'Get TLD prices',
    description:
      'This endpoint retrieves the prices for all supported TLDs from the registrar. It returns a mapping of TLDs to their respective prices and currencies.',
  })
  @ApiOkResponse({
    description:
      'Returns a mapping of TLDs to their respective prices and currencies.',
  })
  @Public()
  @Get('tld-prices')
  getTldPrices() {
    return this.domainsService.getTldPrices();
  }

  // Raw WHOIS lookup - no registrar account needed, works for any single domain.
  @ApiOperation({
    summary: 'WHOIS lookup',
    description:
      'This endpoint performs a WHOIS lookup for the specified domain name and returns the availability status and other relevant information.',
  })
  @ApiOkResponse({
    description: 'Returns the WHOIS information for the specified domain.',
  })
  @Get('whois')
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  whois(@Query() dto: WhoisCheckDto) {
    return this.domainsService.checkWhois(dto.domainName);
  }

  // Registrar-backed search - tells you whether you can actually sell it, across TLDs.
  @ApiOperation({
    summary: 'Domain availability across multiple TLDs',
    description:
      'This endpoint checks the availability of a domain name across multiple TLDs and returns the availability status for each TLD.',
  })
  @ApiOkResponse({
    description:
      'Returns the availability status for the specified domain name across the provided TLDs.',
  })
  @Get('search')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  search(@Query() dto: SearchDomainDto) {
    return this.domainsService.checkAvailability(dto.query, dto.tlds);
  }

  @ApiOperation({
    summary: 'List all domains owned by the authenticated user',
    description:
      'This endpoint retrieves a list of all domains owned by the authenticated user, along with their details such as status, registrar, and expiration date.',
  })
  @ApiOkResponse({
    description: 'Returns a list of domains owned by the authenticated user.',
  })
  @Get()
  listMine(@CurrentUser() user: User) {
    return this.domainsService.listMyDomains(user);
  }

  @ApiOperation({
    summary: 'Get details of a specific domain owned by the authenticated user',
    description:
      'This endpoint retrieves the details of a specific domain owned by the authenticated user, including its status, registrar, expiration date, and other relevant information.',
  })
  @ApiOkResponse({
    description:
      'Returns the details of the specified domain owned by the authenticated user.',
  })
  @Get(':id')
  getOne(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.domainsService.getDomain(user, id);
  }

  @ApiOperation({
    summary: 'Purchase a new domain name',
    description:
      'This endpoint allows the authenticated user to purchase a new domain name. The user must provide the domain name, registration period, registrant contact information, and optional settings such as auto-renewal and ID protection.',
  })
  @ApiCreatedResponse({
    description: 'Returns the details of the newly purchased domain.',
  })
  @Post('purchase')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  purchase(@CurrentUser() user: User, @Body() dto: PurchaseDomainDto) {
    return this.domainsService.purchaseDomain(user, dto);
  }

  @ApiOperation({
    summary: 'Transfer an existing domain name to the authenticated user',
    description:
      'This endpoint allows the authenticated user to transfer an existing domain name to their account. The user must provide the domain name and the authorization code (EPP code) for the transfer.',
  })
  @ApiOkResponse({
    description:
      'Returns the details of the domain being transferred to the authenticated user.',
  })
  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  transfer(@CurrentUser() user: User, @Body() dto: TransferDomainDto) {
    return this.domainsService.transferDomain(user, dto);
  }

  @ApiOperation({
    summary:
      'Update the nameservers for a specific domain owned by the authenticated user',
    description:
      'This endpoint allows the authenticated user to update the nameservers for a specific domain they own. The user must provide the new nameserver information.',
  })
  @ApiOkResponse({
    description:
      'Returns the updated details of the domain after the nameservers have been changed.',
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
    summary:
      'List all DNS records for a specific domain owned by the authenticated user',
    description:
      'This endpoint retrieves a list of all DNS records for a specific domain owned by the authenticated user, including record type, name, value, TTL, and priority.',
  })
  @ApiOkResponse({
    description:
      'Returns a list of DNS records for the specified domain owned by the authenticated user.',
  })
  @Get(':id/dns-records')
  listDnsRecords(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.domainsService.listDnsRecords(user, id);
  }

  @ApiOperation({
    summary:
      'Create a new DNS record for a specific domain owned by the authenticated user',
    description:
      'This endpoint allows the authenticated user to create a new DNS record for a specific domain they own. The user must provide the record type, name, value, and optional settings such as TTL and priority.',
  })
  @ApiCreatedResponse({
    description:
      'Returns the details of the newly created DNS record for the specified domain.',
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
    summary:
      'Update an existing DNS record for a specific domain owned by the authenticated user',
    description:
      'This endpoint allows the authenticated user to update an existing DNS record for a specific domain they own. The user must provide the record ID and the updated record information, including type, name, value, and optional settings such as TTL and priority.',
  })
  @ApiOkResponse({
    description:
      'Returns the updated details of the DNS record for the specified domain.',
  })
  @Patch(':id/dns-records/:recordId')
  @HttpCode(HttpStatus.OK)
  updateDnsRecord(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('recordId') recordId: string,
    @Body() dto: UpdateDnsRecordDto,
  ) {
    return this.domainsService.updateDnsRecord(user, id, {
      ...dto,
      id: recordId,
    });
  }

  @ApiOperation({
    summary:
      'Delete an existing DNS record for a specific domain owned by the authenticated user',
    description:
      'This endpoint allows the authenticated user to delete an existing DNS record for a specific domain they own. The user must provide the record ID of the DNS record to be deleted.',
  })
  @ApiNoContentResponse({
    description:
      'Indicates that the DNS record has been successfully deleted for the specified domain.',
  })
  @Delete(':id/dns-records/:recordId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteDnsRecord(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('recordId') recordId: string,
    @Body() dto: DeleteDnsRecordDto,
  ) {
    return this.domainsService.deleteDnsRecord(user, id, recordId, dto);
  }

  // Staff-only: force a fresh pull of status/expiry from the registrar.
  @ApiOperation({
    summary:
      'Synchronize domain information with the registrar for a specific domain',
    description:
      'This endpoint allows staff members (admins and support agents) to synchronize the domain information with the registrar for a specific domain. It retrieves the latest status, expiration date, and other relevant information from the registrar.',
  })
  @ApiOkResponse({
    description:
      'Returns the updated details of the domain after synchronization with the registrar.',
  })
  @ApiForbiddenResponse({
    description:
      'If the user does not have the required role (admin or support agent), this will be returned.',
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPPORT_AGENT)
  @Post(':id/sync')
  @HttpCode(HttpStatus.OK)
  sync(@Param('id', ParseUUIDPipe) id: string) {
    return this.domainsService.syncFromRegistrar(id);
  }
}
