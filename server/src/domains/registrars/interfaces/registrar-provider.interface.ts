export enum DomainRegistrar {
  RESELLERCLUB = 'resellerclub',
  WHOGOHOST = 'whogohost',
}

export interface RegistrantContact {
  fullName: string;
  email: string;
  phoneCountryCode: string; // e.g. "234" for Nigeria, without the "+"
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string; // ISO 3166-1 alpha-2, e.g. "NG"
  zipCode: string;
  company?: string;
}

export interface RegisterDomainParams {
  domainName: string;
  years: number;
  nameservers: string[];
  registrant: RegistrantContact;
  idProtection?: boolean;
  /** Local platform user id — providers use this to cache/reuse their own customer/contact records. */
  userId: string;
}

export interface TransferDomainParams {
  domainName: string;
  authCode: string;
  registrant: RegistrantContact;
  nameservers?: string[];
  userId: string;
}

export interface RegistrarOrderResult {
  externalOrderId: string;
  status: string; // provider-native status string, mapped by DomainsService
}

export interface RegistrarDomainStatus {
  status: string;
  expiresAt?: Date;
  nameservers?: string[];
}

export type DnsRecordType =
  'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';

export interface DnsRecord {
  id?: string; // provider-assigned id, required for update/delete where the provider supports it
  type: DnsRecordType;
  name: string; // host/subdomain part, e.g. "www" or "@" for root
  value: string;
  ttl?: number;
  priority?: number; // MX/SRV
}

export interface DomainAvailability {
  domain: string;
  available: boolean;
  isPremium?: boolean;
  price?: number;
  currency?: string;
}

/**
 * The contract every registrar integration implements. DomainsService only
 * ever talks to this interface — RegistrarRegistry picks which concrete
 * provider (ResellerClub, Whogohost, ...) handles a given TLD.
 */
export interface RegistrarProvider {
  readonly name: DomainRegistrar;

  getTldPrices(): any;

  checkAvailability(domainName: string): Promise<DomainAvailability>;

  registerDomain(params: RegisterDomainParams): Promise<RegistrarOrderResult>;

  transferDomain(params: TransferDomainParams): Promise<RegistrarOrderResult>;

  updateNameservers(domainName: string, nameservers: string[]): Promise<void>;

  getDomainStatus(domainName: string): Promise<RegistrarDomainStatus>;

  listDnsRecords(domainName: string): Promise<DnsRecord[]>;

  createDnsRecord(domainName: string, record: DnsRecord): Promise<DnsRecord>;

  updateDnsRecord(domainName: string, record: DnsRecord): Promise<DnsRecord>;

  deleteDnsRecord(domainName: string, record: DnsRecord): Promise<void>;
}
