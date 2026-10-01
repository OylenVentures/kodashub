import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResellerClubHttpClient } from './resellerclub-http.client.js';
import { RegistrarAccount } from '../../entities/registrar-account.entity.js';
import {
  DnsRecord,
  DnsRecordType,
  DomainAvailability,
  DomainRegistrar,
  RegisterDomainParams,
  RegistrantContact,
  RegistrarDomainStatus,
  RegistrarOrderResult,
  RegistrarProvider,
  TransferDomainParams,
} from '../interfaces/registrar-provider.interface.js';
import { RegistrarValidationException } from '../registrar.exceptions.js';

export const RESELLERCLUB_PROVIDER = Symbol('RESELLERCLUB_PROVIDER');

// ResellerClub's DNS management API splits create/update/delete by record
// type into separate endpoints rather than one generic CRUD call.
const DNS_TYPE_PATH: Record<DnsRecordType, string> = {
  A: 'ipv4-record',
  AAAA: 'ipv6-record',
  CNAME: 'cname-record',
  MX: 'mx-record',
  TXT: 'txt-record',
  NS: 'ns-record',
  SRV: 'srv-record', // NOTE: verify support — not all ResellerClub DNS plans expose SRV via this API
};

/**
 * https://manage.resellerclub.com/kb/servlet/KBServlet/cat-140.html
 * Real, documented endpoints — verified against ResellerClub/LogicBoxes' public KB.
 */
@Injectable()
export class ResellerClubProvider implements RegistrarProvider {
  readonly name = DomainRegistrar.RESELLERCLUB;
  private readonly logger = new Logger(ResellerClubProvider.name);

  constructor(
    private http: ResellerClubHttpClient,
    @InjectRepository(RegistrarAccount)
    private accountsRepository: Repository<RegistrarAccount>,
  ) {}

  async checkAvailability(domainName: string): Promise<DomainAvailability> {
    const { name, tld } = this.splitDomain(domainName);

    const result = await this.http.call<
      Record<string, { status: string; classkey?: string }>
    >('domains/available.json', {
      'domain-name': [name],
      tlds: [tld],
    });

    const entry = result[`${name}.${tld}`] ?? result[domainName.toLowerCase()];
    const available = entry?.status === 'available';

    return {
      domain: domainName,
      available,
      isPremium: entry?.classkey?.includes('premium'),
    };
  }

  async registerDomain(
    params: RegisterDomainParams,
  ): Promise<RegistrarOrderResult> {
    const { customerId, contactId } = await this.ensureAccount(
      params.registrant,
      params.userId,
    );

    const result = await this.http.call<{
      entityid: string;
      actionstatus?: string;
    }>('domains/register.json', {
      'domain-name': params.domainName,
      years: params.years,
      ns: params.nameservers,
      'customer-id': customerId,
      'reg-contact-id': contactId,
      'admin-contact-id': contactId,
      'tech-contact-id': contactId,
      'billing-contact-id': contactId,
      'invoice-option': 'NoInvoice', // we handle billing ourselves
      'protect-privacy': params.idProtection ?? false,
    });

    return {
      externalOrderId: result.entityid,
      status: result.actionstatus ?? 'InProgress',
    };
  }

  async transferDomain(
    params: TransferDomainParams,
  ): Promise<RegistrarOrderResult> {
    const { customerId, contactId } = await this.ensureAccount(
      params.registrant,
      params.userId,
    );

    const result = await this.http.call<{
      entityid: string;
      actionstatus?: string;
    }>('domains/transfer.json', {
      'domain-name': params.domainName,
      'auth-code': params.authCode,
      'customer-id': customerId,
      'reg-contact-id': contactId,
      'admin-contact-id': contactId,
      'tech-contact-id': contactId,
      'billing-contact-id': contactId,
      ns: params.nameservers,
      'invoice-option': 'NoInvoice',
    });

    return {
      externalOrderId: result.entityid,
      status: result.actionstatus ?? 'InProgress',
    };
  }

  async updateNameservers(
    domainName: string,
    nameservers: string[],
  ): Promise<void> {
    const orderId = await this.getOrderId(domainName);
    await this.http.call('domains/modify-ns.json', {
      'order-id': orderId,
      ns: nameservers,
    });
  }

  async getDomainStatus(domainName: string): Promise<RegistrarDomainStatus> {
    const orderId = await this.getOrderId(domainName);
    const details = await this.http.call<{
      currentstatus?: string;
      endtime?: string; // unix seconds
    }>('domains/details.json', { 'order-id': orderId, options: ['All'] });

    return {
      status: details.currentstatus ?? 'unknown',
      expiresAt: details.endtime
        ? new Date(Number(details.endtime) * 1000)
        : undefined,
    };
  }

  // ---------- DNS ----------

  async listDnsRecords(domainName: string): Promise<DnsRecord[]> {
    const result = await this.http.call<{
      recs?:
        | { recshttp?: Array<Record<string, string>> }
        | Array<Record<string, string>>;
    }>('dns/manage/search-records.json', {
      'domain-name': domainName,
      type: 'ALL',
      'no-of-records': 100,
      'page-no': 1,
    });

    const raw = Array.isArray(result.recs)
      ? result.recs
      : ((result.recs as any)?.recshttp ?? []);

    return raw.map((r: any) => ({
      id: r.id,
      type: (r.type as DnsRecordType) ?? 'A',
      name: r.host,
      value: r.value,
      ttl: r.ttl ? Number(r.ttl) : undefined,
      priority: r.distance ? Number(r.distance) : undefined,
    }));
  }

  async createDnsRecord(
    domainName: string,
    record: DnsRecord,
  ): Promise<DnsRecord> {
    const path = `dns/manage/add-${DNS_TYPE_PATH[record.type]}.json`;
    const result = await this.http.call<{ recid?: string }>(path, {
      'domain-name': domainName,
      host: record.name,
      value: record.value,
      ttl: record.ttl ?? 14400,
      ...(record.type === 'MX' ? { distance: record.priority ?? 10 } : {}),
    });
    return { ...record, id: result.recid };
  }

  async updateDnsRecord(
    domainName: string,
    record: DnsRecord,
  ): Promise<DnsRecord> {
    if (!record.id) {
      throw new RegistrarValidationException(
        'A record id is required to update a DNS record',
      );
    }
    const path = `dns/manage/update-${DNS_TYPE_PATH[record.type]}.json`;
    await this.http.call(path, {
      'domain-name': domainName,
      'record-id': record.id,
      value: record.value,
      ttl: record.ttl ?? 14400,
      ...(record.type === 'MX' ? { distance: record.priority ?? 10 } : {}),
    });
    return record;
  }

  async deleteDnsRecord(domainName: string, record: DnsRecord): Promise<void> {
    if (!record.id) {
      throw new RegistrarValidationException(
        'A record id is required to delete a DNS record',
      );
    }
    const path = `dns/manage/delete-${DNS_TYPE_PATH[record.type]}.json`;
    await this.http.call(path, {
      'domain-name': domainName,
      'record-id': record.id,
      value: record.value,
    });
  }

  // ---------- Tlds ----------
  async getTldPrices(): Promise<any> {
    const result = await this.http.call<any>('domains/tld-info.json');
    const data = Object.entries(result).sort((a, b) => {
      const nameA = a[0].toLowerCase();
      const nameB = b[0].toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return data;
  }

  // ---------- Helpers ----------

  /**
   * ResellerClub requires a Customer + Contact to exist before it will
   * register/transfer a domain. We cache the resulting IDs per user in
   * RegistrarAccount so repeat orders don't create duplicate customers.
   */
  private async ensureAccount(
    registrant: RegistrantContact,
    userId: string,
  ): Promise<{ customerId: string; contactId: string }> {
    const existing = await this.accountsRepository.findOne({
      where: { userId, registrar: DomainRegistrar.RESELLERCLUB },
    });
    if (existing?.externalContactId) {
      return {
        customerId: existing.externalCustomerId,
        contactId: existing.externalContactId,
      };
    }

    const customerId = await this.createCustomer(registrant);
    const contactId = await this.createContact(registrant);

    await this.accountsRepository.save(
      this.accountsRepository.create({
        userId,
        registrar: DomainRegistrar.RESELLERCLUB,
        externalCustomerId: customerId,
        externalContactId: contactId,
      }),
    );

    return { customerId, contactId };
  }

  private async createCustomer(registrant: RegistrantContact): Promise<string> {
    // customers/signup.json creates a ResellerClub sub-account for this WHOIS
    // identity. `passwd` must meet ResellerClub's complexity rules — generate
    // one rather than exposing it to the end user (they never log into
    // ResellerClub directly).
    const result = await this.http.call<string | number>(
      'customers/signup.json',
      {
        username: registrant.email,
        passwd: this.generateInternalPassword(),
        name: registrant.fullName,
        company: registrant.company || registrant.fullName,
        'address-line-1': registrant.addressLine1,
        city: registrant.city,
        state: registrant.state,
        country: registrant.country,
        zipcode: registrant.zipCode,
        'phone-cc': registrant.phoneCountryCode,
        phone: registrant.phone,
        'lang-pref': 'en',
      },
    );
    return String(result);
  }

  private async createContact(registrant: RegistrantContact): Promise<string> {
    const result = await this.http.call<string | number>('contacts/add.json', {
      name: registrant.fullName,
      company: registrant.company || registrant.fullName,
      email: registrant.email,
      'address-line-1': registrant.addressLine1,
      city: registrant.city,
      state: registrant.state,
      country: registrant.country,
      zipcode: registrant.zipCode,
      'phone-cc': registrant.phoneCountryCode,
      phone: registrant.phone,
      type: 'Contact',
    });
    return String(result);
  }

  /** domains/orderid.json — resolves a domain name to the order-id most other calls require. */
  private async getOrderId(domainName: string): Promise<string> {
    const result = await this.http.call<string | number>(
      'domains/orderid.json',
      {
        'domain-name': domainName,
      },
    );
    return String(result);
  }

  private splitDomain(domainName: string): { name: string; tld: string } {
    const [name, ...rest] = domainName.toLowerCase().split('.');
    return { name, tld: rest.join('.') };
  }

  private generateInternalPassword(): string {
    // Meets typical complexity requirements (upper/lower/digit/symbol, 8+ chars).
    return `Aa1!${Math.random().toString(36).slice(2, 12)}`;
  }
}
