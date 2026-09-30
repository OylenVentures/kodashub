import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrarRegistry } from './registrars/registrar-registry.service.js';
import {
  WhoisService,
  WhoisAvailabilityResult,
} from './whois/whois.service.js';
import {
  DnsRecord,
  DomainAvailability,
} from './registrars/interfaces/registrar-provider.interface.js';
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
  DeleteDnsRecordDto,
} from './dto/dns-record.dto.js';

@Injectable()
export class DomainsService {
  private readonly logger = new Logger(DomainsService.name);

  constructor(
    @InjectRepository(Domain) private domainsRepository: Repository<Domain>,
    private registrars: RegistrarRegistry,
    private whois: WhoisService,
  ) {}

  // ---------- Availability ----------

  /**
   * Registrar-backed availability check(s) — answers "can I actually
   * register/sell this through the registrar responsible for its TLD".
   * Routes each requested TLD to the correct provider via RegistrarRegistry.
   */
  async checkAvailability(
    baseName: string,
    tlds: string[],
  ): Promise<DomainAvailability[]> {
    if (!tlds?.length) {
      throw new BadRequestException('At least one TLD must be specified');
    }

    const results = await Promise.all(
      tlds.map(async (tld) => {
        const domain = `${baseName}.${tld.replace(/^\./, '')}`;
        try {
          const provider = this.registrars.forTld(tld);
          return await provider.checkAvailability(domain);
        } catch (err) {
          this.logger.warn(
            `Availability check failed for ${domain}: ${(err as Error).message}`,
          );
          return { domain, available: false } as DomainAvailability;
        }
      }),
    );

    return results;
  }

  /**
   * Raw WHOIS lookup — independent of registrar accounts/credentials, works
   * for any single fully-qualified domain. See WhoisService's doc comment
   * for accuracy caveats (not all ccTLDs are queryable this way).
   */
  async checkWhois(domainName: string): Promise<WhoisAvailabilityResult> {
    return this.whois.checkAvailability(domainName);
  }

  // ---------- Purchase (register) ----------

  async purchaseDomain(user: User, dto: PurchaseDomainDto): Promise<Domain> {
    await this.assertNotAlreadyTracked(dto.domainName);

    const provider = this.registrars.forDomain(dto.domainName);

    const result = await provider.registerDomain({
      domainName: dto.domainName,
      years: dto.years,
      nameservers: dto.nameservers,
      registrant: dto.registrant,
      idProtection: dto.idProtection,
      userId: user.id,
    });

    const domain = this.domainsRepository.create({
      userId: user.id,
      domainName: dto.domainName.toLowerCase(),
      tld: this.tldFromDomain(dto.domainName),
      registrar: provider.name,
      orderType: DomainOrderType.REGISTER,
      status: DomainStatus.PENDING,
      externalOrderId: result.externalOrderId,
      nameservers: dto.nameservers,
      autoRenew: dto.autoRenew ?? true,
    });

    return this.domainsRepository.save(domain);
  }

  // ---------- Transfer ----------

  async transferDomain(user: User, dto: TransferDomainDto): Promise<Domain> {
    await this.assertNotAlreadyTracked(dto.domainName);

    const provider = this.registrars.forDomain(dto.domainName);

    const result = await provider.transferDomain({
      domainName: dto.domainName,
      authCode: dto.eppCode,
      registrant: dto.registrant,
      nameservers: dto.nameservers,
      userId: user.id,
    });

    const domain = this.domainsRepository.create({
      userId: user.id,
      domainName: dto.domainName.toLowerCase(),
      tld: this.tldFromDomain(dto.domainName),
      registrar: provider.name,
      orderType: DomainOrderType.TRANSFER,
      status: DomainStatus.TRANSFERRING,
      externalOrderId: result.externalOrderId,
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
    const provider = this.registrars.forRegistrar(domain.registrar);

    await provider.updateNameservers(domain.domainName, nameservers);

    domain.nameservers = nameservers;
    return this.domainsRepository.save(domain);
  }

  // ---------- DNS ----------

  async listDnsRecords(user: User, domainId: string): Promise<DnsRecord[]> {
    const domain = await this.getOwnedDomain(user, domainId);
    const provider = this.registrars.forRegistrar(domain.registrar);
    return provider.listDnsRecords(domain.domainName);
  }

  async createDnsRecord(
    user: User,
    domainId: string,
    dto: CreateDnsRecordDto,
  ): Promise<DnsRecord> {
    const domain = await this.getOwnedDomain(user, domainId);
    this.assertValidRecord(dto);
    const provider = this.registrars.forRegistrar(domain.registrar);
    return provider.createDnsRecord(domain.domainName, dto);
  }

  async updateDnsRecord(
    user: User,
    domainId: string,
    dto: UpdateDnsRecordDto,
  ): Promise<DnsRecord> {
    const domain = await this.getOwnedDomain(user, domainId);
    this.assertValidRecord(dto);
    if (!dto.id) {
      throw new BadRequestException(
        'A record id is required to update a DNS record',
      );
    }
    const provider = this.registrars.forRegistrar(domain.registrar);
    return provider.updateDnsRecord(domain.domainName, { ...dto, id: dto.id });
  }

  async deleteDnsRecord(
    user: User,
    domainId: string,
    recordId: string,
    dto: DeleteDnsRecordDto,
  ): Promise<void> {
    const domain = await this.getOwnedDomain(user, domainId);
    const provider = this.registrars.forRegistrar(domain.registrar);
    return provider.deleteDnsRecord(domain.domainName, {
      id: recordId,
      type: dto.type,
      value: dto.value ?? '',
      name: '',
    });
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

  async getTldPrices() {
    const provider = this.registrars.forPrices();
    return provider.getTldPrices();
  }

  /**
   * Pulls the latest status/expiry directly from the registrar and updates
   * our local copy. Call this from a scheduled sync job — registration and
   * transfers are asynchronous on the registry's end, so our local
   * "pending"/"transferring" status needs reconciling once the registrar
   * confirms completion.
   */
  async syncFromRegistrar(domainId: string): Promise<Domain> {
    const domain = await this.domainsRepository.findOne({
      where: { id: domainId },
    });
    if (!domain) throw new NotFoundException('Domain not found');

    const provider = this.registrars.forRegistrar(domain.registrar);
    const status = await provider.getDomainStatus(domain.domainName);

    domain.status = this.mapRegistrarStatus(status.status);
    if (status.expiresAt) domain.expiresAt = status.expiresAt;
    if (status.nameservers?.length) domain.nameservers = status.nameservers;
    if (domain.status === DomainStatus.ACTIVE && !domain.registeredAt) {
      domain.registeredAt = new Date();
    }

    return this.domainsRepository.save(domain);
  }

  // ---------- Helpers ----------

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

  /** Normalizes each registrar's native status strings into our local enum. Extend as needed per provider. */
  private mapRegistrarStatus(nativeStatus: string): DomainStatus {
    const normalized = nativeStatus.toLowerCase();
    if (['active', 'success', 'completed', 'registered'].includes(normalized))
      return DomainStatus.ACTIVE;
    if (['cancelled', 'canceled'].includes(normalized))
      return DomainStatus.CANCELED;
    if (['failed', 'error'].includes(normalized)) return DomainStatus.FAILED;
    if (['expired'].includes(normalized)) return DomainStatus.EXPIRED;
    if (['transferring', 'inprogress', 'pending transfer'].includes(normalized))
      return DomainStatus.TRANSFERRING;
    this.logger.warn(
      `Unmapped registrar status "${nativeStatus}" - defaulting to pending`,
    );
    return DomainStatus.PENDING;
  }
}
