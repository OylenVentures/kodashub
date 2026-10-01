import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BlestaApiService } from './blesta/blesta-api.service.js';
import { TldPackageResolver } from './blesta/tld-package-resolver.service.js';
import {
  DNS_PROVIDER,
  type DnsProvider,
  DnsRecord,
} from './blesta/interfaces/dns-provider.interface.js';
import {
  BlestaClient,
  BlestaService,
} from './blesta/interfaces/blesta-api.interface.js';
import { Domain } from './entities/domain.entity.js';
import {
  DomainOrderType,
  DomainStatus,
} from './entities/domain-status.enum.js';
import { User } from '../users/entities/user.entity.js';
import { UserRole } from '../common/enums/role.enum.js';
import { PurchaseDomainDto } from './dto/purchase-domain.dto.js';
import { TransferDomainDto } from './dto/transfer-domain.dto.js';
import {
  CreateDnsRecordDto,
  UpdateDnsRecordDto,
} from './dto/dns-record.dto.js';

interface DomainAvailabilityResult {
  domain: string;
  available: boolean;
  price?: number;
  currency?: string;
}

@Injectable()
export class DomainsService {
  private readonly logger = new Logger(DomainsService.name);

  constructor(
    @InjectRepository(Domain) private domainsRepository: Repository<Domain>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private blesta: BlestaApiService,
    private tldResolver: TldPackageResolver,
    private config: ConfigService,
    @Inject(DNS_PROVIDER) private dnsProvider: DnsProvider,
  ) {}

  // ---------- Availability search ----------

  /**
   * Checks availability across the given TLDs (or every configured TLD).
   *
   * NOTE: Blesta's core REST API does not universally expose a registrar
   * module's `checkAvailability` method — it's invoked internally by the
   * order-form controller. In practice this means one of:
   *   (a) a companion Blesta plugin model (see BLESTA_AVAILABILITY_PLUGIN_MODEL,
   *       same pattern as the DNS plugin — recommended for multi-registrar setups), or
   *   (b) calling your registrar's own availability API directly.
   * This method tries (a) if configured; otherwise it throws a clear error
   * rather than silently returning fabricated results.
   */
  async checkAvailability(
    baseName: string,
    tlds?: string[],
  ): Promise<DomainAvailabilityResult[]> {
    const targetTlds = tlds?.length ? tlds : this.tldResolver.supportedTlds();
    if (targetTlds.length === 0) {
      throw new BadRequestException(
        'No TLDs are currently configured for sale',
      );
    }

    const pluginModel = this.config.get<string>(
      'BLESTA_AVAILABILITY_PLUGIN_MODEL',
    );
    if (!pluginModel) {
      throw new BadRequestException(
        'Domain availability lookup is not configured. Set BLESTA_AVAILABILITY_PLUGIN_MODEL ' +
          'to a companion Blesta plugin model, or implement a direct registrar lookup here.',
      );
    }

    const domainsToCheck = targetTlds.map(
      (tld) => `${baseName}.${tld.replace(/^\./, '')}`,
    );

    const result = await this.blesta.call<{
      results: Array<{
        domain: string;
        available: boolean;
        price?: number;
        currency?: string;
      }>;
    }>(pluginModel, 'checkAvailability', { domains: domainsToCheck });

    return (
      result.results ??
      domainsToCheck.map((domain) => ({ domain, available: false }))
    );
  }

  // ---------- Purchase (register) ----------

  async purchaseDomain(user: User, dto: PurchaseDomainDto): Promise<Domain> {
    await this.assertNotAlreadyTracked(dto.domainName);

    const mapping = this.tldResolver.resolve(dto.domainName);
    const clientId = await this.ensureBlestaClient(user);

    const service = await this.blesta.call<BlestaService>('services', 'add', {
      client_id: clientId,
      pricing_id: mapping.registerPricingId,
      status: 'pending',
      use_module: true,
      // Standard registrar-module service fields — field *names* are module
      // dependent; ns1-ns5 and "domain" are the near-universal convention
      // used by Blesta's official registrar modules (Namesilo, OpenSRS,
      // ResellerClub, etc.). Verify against your specific module's
      // "Service Fields" if you're using a different one.
      domain: dto.domainName,
      ...this.nameserversToFields(dto.nameservers),
      id_protection: dto.idProtection ?? false,
    });

    const domain = this.domainsRepository.create({
      userId: user.id,
      domainName: dto.domainName.toLowerCase(),
      tld: mapping ? this.tldFromDomain(dto.domainName) : '',
      orderType: DomainOrderType.REGISTER,
      status: DomainStatus.PENDING,
      blestaServiceId: service.id,
      blestaClientId: clientId,
      nameservers: dto.nameservers,
      autoRenew: dto.autoRenew ?? true,
    });

    return this.domainsRepository.save(domain);
  }

  // ---------- Transfer ----------

  async transferDomain(user: User, dto: TransferDomainDto): Promise<Domain> {
    await this.assertNotAlreadyTracked(dto.domainName);

    const mapping = this.tldResolver.resolve(dto.domainName);
    const clientId = await this.ensureBlestaClient(user);

    const service = await this.blesta.call<BlestaService>('services', 'add', {
      client_id: clientId,
      pricing_id: mapping.transferPricingId,
      status: 'pending',
      use_module: true,
      domain: dto.domainName,
      transfer: true,
      auth_code: dto.eppCode, // "auth"/"eppcode" field name varies by module — check yours
      ...this.nameserversToFields(dto.nameservers),
    });

    const domain = this.domainsRepository.create({
      userId: user.id,
      domainName: dto.domainName.toLowerCase(),
      tld: this.tldFromDomain(dto.domainName),
      orderType: DomainOrderType.TRANSFER,
      status: DomainStatus.TRANSFERRING,
      blestaServiceId: service.id,
      blestaClientId: clientId,
      nameservers: dto.nameservers,
      autoRenew: true,
    });

    return this.domainsRepository.save(domain);
  }

  // ---------- Nameservers ----------

  async updateNameservers(
    user: User,
    domainId: string,
    nameservers: string[],
  ): Promise<Domain> {
    const domain = await this.getOwnedDomain(user, domainId);

    await this.blesta.call('services', 'edit', {
      service_id: domain.blestaServiceId,
      vars: this.nameserversToFields(nameservers),
    });

    domain.nameservers = nameservers;
    return this.domainsRepository.save(domain);
  }

  // ---------- DNS ----------

  async listDnsRecords(user: User, domainId: string): Promise<DnsRecord[]> {
    const domain = await this.getOwnedDomain(user, domainId);
    return this.dnsProvider.listRecords(domain.domainName);
  }

  async createDnsRecord(
    user: User,
    domainId: string,
    dto: CreateDnsRecordDto,
  ): Promise<DnsRecord> {
    const domain = await this.getOwnedDomain(user, domainId);
    this.assertValidRecord(dto);
    return this.dnsProvider.createRecord(domain.domainName, dto);
  }

  async updateDnsRecord(
    user: User,
    domainId: string,
    recordId: string,
    dto: UpdateDnsRecordDto,
  ): Promise<DnsRecord> {
    const domain = await this.getOwnedDomain(user, domainId);
    this.assertValidRecord(dto);
    return this.dnsProvider.updateRecord(domain.domainName, recordId, dto);
  }

  async deleteDnsRecord(
    user: User,
    domainId: string,
    recordId: string,
  ): Promise<void> {
    const domain = await this.getOwnedDomain(user, domainId);
    return this.dnsProvider.deleteRecord(domain.domainName, recordId);
  }

  // ---------- Listing / lookups ----------

  async listMyDomains(user: User): Promise<Domain[]> {
    return this.domainsRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  async getDomain(user: User, domainId: string): Promise<Domain> {
    return this.getOwnedDomain(user, domainId);
  }

  /**
   * Pulls the latest status/expiry directly from Blesta and updates our
   * local copy. Call this from a webhook handler (Blesta can POST on service
   * status changes via its Event system) or a scheduled sync job — domain
   * registration is asynchronous on the registrar's end, so our local
   * "pending" status needs to be reconciled once Blesta confirms it.
   */
  async syncFromBlesta(domainId: string): Promise<Domain> {
    const domain = await this.domainsRepository.findOne({
      where: { id: domainId },
    });
    if (!domain) throw new NotFoundException('Domain not found');
    if (!domain.blestaServiceId) return domain;

    const service = await this.blesta.call<BlestaService>('services', 'get', {
      service_id: domain.blestaServiceId,
    });

    domain.status = this.mapBlestaStatus(service.status);
    domain.expiresAt = service.date_renews
      ? new Date(service.date_renews)
      : domain.expiresAt;
    if (domain.status === DomainStatus.ACTIVE && !domain.registeredAt) {
      domain.registeredAt = new Date();
    }

    return this.domainsRepository.save(domain);
  }

  // ---------- Helpers ----------

  /** Reuses an existing Blesta client for this user, or creates one on first purchase. */
  private async ensureBlestaClient(user: User): Promise<number> {
    if (user.blestaClientId) return user.blestaClientId;

    // NOTE: verify these field names against Settings > Company > API in your
    // Blesta admin — Clients::add typically creates both the client record
    // and its portal login in one call; exact required fields vary slightly
    // by Blesta version.
    const client = await this.blesta.call<BlestaClient>('clients', 'add', {
      client_group_id:
        this.config.get<number>('BLESTA_DEFAULT_CLIENT_GROUP_ID') ?? 1,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      status: 'active',
    });

    user.blestaClientId = client.id;
    await this.usersRepository.save(user);

    return client.id;
  }

  private async getOwnedDomain(user: User, domainId: string): Promise<Domain> {
    const domain = await this.domainsRepository.findOne({
      where: { id: domainId },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const isOwner = domain.userId === user.id;
    const isStaff = [UserRole.ADMIN, UserRole.SUPPORT_AGENT].includes(
      user.role,
    );

    if (!isOwner && !isStaff) {
      throw new ForbiddenException('You do not have access to this domain');
    }

    return domain;
  }

  private async assertNotAlreadyTracked(domainName: string): Promise<void> {
    const existing = await this.domainsRepository.findOne({
      where: { domainName: domainName.toLowerCase() },
    });
    if (existing) {
      throw new BadRequestException(
        'This domain has already been ordered on this platform',
      );
    }
  }

  private nameserversToFields(nameservers?: string[]): Record<string, string> {
    if (!nameservers?.length) return {};
    const fields: Record<string, string> = {};
    nameservers.slice(0, 5).forEach((ns, i) => {
      fields[`ns${i + 1}`] = ns;
    });
    return fields;
  }

  private assertValidRecord(dto: CreateDnsRecordDto): void {
    if (
      (dto.type === 'MX' || dto.type === 'SRV') &&
      dto.priority === undefined
    ) {
      throw new BadRequestException(
        `A priority is required for ${dto.type} records`,
      );
    }
  }

  private tldFromDomain(domain: string): string {
    return domain.toLowerCase().split('.').slice(1).join('.');
  }

  private mapBlestaStatus(blestaStatus: string): DomainStatus {
    switch (blestaStatus) {
      case 'active':
        return DomainStatus.ACTIVE;
      case 'canceled':
        return DomainStatus.CANCELED;
      case 'suspended':
      case 'in_review':
      case 'pending':
        return DomainStatus.PENDING;
      default:
        this.logger.warn(
          `Unmapped Blesta service status "${blestaStatus}" — defaulting to pending`,
        );
        return DomainStatus.PENDING;
    }
  }
}
