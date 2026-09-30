import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DnsRecord,
  DomainAvailability,
  DomainRegistrar,
  RegisterDomainParams,
  RegistrarDomainStatus,
  RegistrarOrderResult,
  RegistrarProvider,
  TransferDomainParams,
} from '../interfaces/registrar-provider.interface.js';
import {
  RegistrarUnavailableException,
  RegistrarValidationException,
} from '../registrar.exceptions.js';

export const WHOGOHOST_PROVIDER = Symbol('WHOGOHOST_PROVIDER');

/**
 * IMPORTANT - read before using this in production.
 *
 * Unlike ResellerClub, Whogohost does not publish a public, self-serve
 * reseller/partner API reference. This class is structured to the same
 * RegistrarProvider contract as ResellerClubProvider so DomainsService and
 * RegistrarRegistry don't care which one handles a given TLD - but the
 * request shapes below (paths, param names, auth header) are a reasonable
 * placeholder based on common registrar-API conventions (bearer/API-key
 * auth, REST-ish resource paths), not confirmed against real Whogohost
 * documentation.
 *
 * Before going live:
 *   1. Contact Whogohost partner/reseller support for their actual API
 *      reference (endpoints, auth scheme, required fields per operation).
 *   2. Replace the marked TODOs below with the real request/response shapes.
 *   3. If Whogohost's API turns out to be SOAP, XML-RPC, or otherwise
 *      non-REST, replace request() accordingly - everything else in this
 *      class (and the rest of the app) is unaffected since it only depends
 *      on the RegistrarProvider interface.
 *
 * Until then, every method below will throw clearly rather than silently
 * doing the wrong thing.
 */
@Injectable()
export class WhogohostProvider implements RegistrarProvider {
  readonly name = DomainRegistrar.WHOGOHOST;
  private readonly logger = new Logger(WhogohostProvider.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly configured: boolean;

  constructor(private config: ConfigService) {
    this.baseUrl = this.config.get<string>('WHOGOHOST_API_URL') ?? '';
    this.apiKey = this.config.get<string>('WHOGOHOST_API_KEY') ?? '';
    this.configured = !!this.baseUrl && !!this.apiKey;

    if (!this.configured) {
      this.logger.warn(
        'Whogohost is not configured (WHOGOHOST_API_URL / WHOGOHOST_API_KEY). ' +
          'This provider is a request-shape placeholder pending real API docs from Whogohost - see the class doc comment.',
      );
    }
  }

  async checkAvailability(domainName: string): Promise<DomainAvailability> {
    // TODO: confirm real endpoint/response shape with Whogohost.
    const result = await this.request<{
      available: boolean;
      premium?: boolean;
    }>('GET', `/domains/check?domain=${encodeURIComponent(domainName)}`);
    return {
      domain: domainName,
      available: !!result.available,
      isPremium: result.premium,
    };
  }

  async registerDomain(
    params: RegisterDomainParams,
  ): Promise<RegistrarOrderResult> {
    // TODO: confirm required fields - this mirrors common registrar conventions
    // (name/years/nameservers/registrant) but is unverified against Whogohost's actual API.
    const result = await this.request<{
      order_id?: string;
      id?: string;
      status?: string;
    }>('POST', '/domains/register', {
      domain: params.domainName,
      years: params.years,
      nameservers: params.nameservers,
      registrant: this.toRegistrantPayload(params),
      id_protection: params.idProtection ?? false,
    });
    return {
      externalOrderId: String(result.order_id ?? result.id),
      status: result.status ?? 'pending',
    };
  }

  async transferDomain(
    params: TransferDomainParams,
  ): Promise<RegistrarOrderResult> {
    const result = await this.request<{
      order_id?: string;
      id?: string;
      status?: string;
    }>('POST', '/domains/transfer', {
      domain: params.domainName,
      auth_code: params.authCode,
      nameservers: params.nameservers,
      registrant: this.toRegistrantPayload(params),
    });
    return {
      externalOrderId: String(result.order_id ?? result.id),
      status: result.status ?? 'pending',
    };
  }

  async updateNameservers(
    domainName: string,
    nameservers: string[],
  ): Promise<void> {
    await this.request(
      'PUT',
      `/domains/${encodeURIComponent(domainName)}/nameservers`,
      { nameservers },
    );
  }

  async getDomainStatus(domainName: string): Promise<RegistrarDomainStatus> {
    const result = await this.request<{ status?: string; expires_at?: string }>(
      'GET',
      `/domains/${encodeURIComponent(domainName)}`,
    );
    return {
      status: result.status ?? 'unknown',
      expiresAt: result.expires_at ? new Date(result.expires_at) : undefined,
    };
  }

  async listDnsRecords(domainName: string): Promise<DnsRecord[]> {
    const result = await this.request<{ records?: DnsRecord[] }>(
      'GET',
      `/domains/${encodeURIComponent(domainName)}/dns`,
    );
    return result.records ?? [];
  }

  async createDnsRecord(
    domainName: string,
    record: DnsRecord,
  ): Promise<DnsRecord> {
    return this.request<DnsRecord>(
      'POST',
      `/domains/${encodeURIComponent(domainName)}/dns`,
      record,
    );
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
    return this.request<DnsRecord>(
      'PUT',
      `/domains/${encodeURIComponent(domainName)}/dns/${record.id}`,
      record,
    );
  }

  async deleteDnsRecord(domainName: string, record: DnsRecord): Promise<void> {
    if (!record.id) {
      throw new RegistrarValidationException(
        'A record id is required to delete a DNS record',
      );
    }
    await this.request(
      'DELETE',
      `/domains/${encodeURIComponent(domainName)}/dns/${record.id}`,
    );
  }

  async getTldPrices(): Promise<any> {
    return this.request<any>('GET', `/tlds/prices`);
  }

  // ---------- Helpers ----------

  private toRegistrantPayload(
    params: RegisterDomainParams | TransferDomainParams,
  ) {
    const r = params.registrant;
    return {
      full_name: r.fullName,
      email: r.email,
      phone: `+${r.phoneCountryCode}${r.phone}`,
      address: r.addressLine1,
      city: r.city,
      state: r.state,
      country: r.country,
      zip: r.zipCode,
      company: r.company,
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    if (!this.configured) {
      throw new RegistrarUnavailableException(
        'Whogohost',
        'Whogohost is not configured yet - set WHOGOHOST_API_URL/WHOGOHOST_API_KEY once you have real ' +
          'partner API credentials, and confirm this provider request shapes against Whogohost docs.',
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          // TODO: confirm actual auth scheme (may be a custom header/query param, not Bearer)
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const json = await response.json().catch(() => ({}));

      if (response.status >= 500) {
        throw new RegistrarUnavailableException('Whogohost');
      }
      if (!response.ok) {
        throw new RegistrarValidationException(
          (json as any)?.message ?? 'Whogohost rejected the request',
          json,
        );
      }

      return json as T;
    } catch (err) {
      clearTimeout(timeout);
      if (
        err instanceof RegistrarValidationException ||
        err instanceof RegistrarUnavailableException
      ) {
        throw err;
      }
      this.logger.error(
        `Whogohost request failed: ${method} ${path} - ${(err as Error).message}`,
      );
      throw new RegistrarUnavailableException('Whogohost');
    }
  }
}
