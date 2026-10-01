import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DnsProvider,
  DnsRecord,
} from '../interfaces/dns-provider.interface.js';
import {
  BlestaUnavailableException,
  BlestaValidationException,
} from '../blesta.exceptions.js';

/**
 * Worked example of the "call the registrar directly" path described in
 * DnsProvider's doc comment. NameSilo's DNS API is a simple authenticated
 * GET-based REST API — no Blesta involvement needed for DNS once a domain
 * is registered there. Swap this for your actual registrar's equivalent.
 *
 * https://www.namesilo.com/api_reference.php#dnsListRecords / dnsAddRecord /
 * dnsUpdateRecord / dnsDeleteRecord
 */
@Injectable()
export class NamesiloDnsProvider implements DnsProvider {
  private readonly logger = new Logger(NamesiloDnsProvider.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.namesilo.com/api';

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('NAMESILO_API_KEY') ?? '';
  }

  async listRecords(domain: string): Promise<DnsRecord[]> {
    const data = await this.request('dnsListRecords', { domain });
    const records = this.asArray(data?.reply?.resource_record);
    return records.map((r) => ({
      id: r.record_id,
      type: r.type,
      name: r.host,
      value: r.value,
      ttl: Number(r.ttl),
      priority: r.distance !== undefined ? Number(r.distance) : undefined,
    }));
  }

  async createRecord(domain: string, record: DnsRecord): Promise<DnsRecord> {
    const data = await this.request('dnsAddRecord', {
      domain,
      rrtype: record.type,
      rrhost: record.name,
      rrvalue: record.value,
      rrttl: record.ttl ?? 3600,
      rrdistance: record.priority,
    });
    return { ...record, id: data?.reply?.record_id };
  }

  async updateRecord(
    domain: string,
    recordId: string,
    record: DnsRecord,
  ): Promise<DnsRecord> {
    await this.request('dnsUpdateRecord', {
      domain,
      rrid: recordId,
      rrhost: record.name,
      rrvalue: record.value,
      rrttl: record.ttl ?? 3600,
      rrdistance: record.priority,
    });
    return { ...record, id: recordId };
  }

  async deleteRecord(domain: string, recordId: string): Promise<void> {
    await this.request('dnsDeleteRecord', { domain, rrid: recordId });
  }

  private async request(
    operation: string,
    params: Record<string, unknown>,
  ): Promise<any> {
    const query = new URLSearchParams({
      version: '1',
      type: 'json',
      key: this.apiKey,
      ...Object.fromEntries(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ),
    });

    let response: Response;
    try {
      response = await fetch(
        `${this.baseUrl}/${operation}?${query.toString()}`,
      );
    } catch (err) {
      this.logger.error(
        `NameSilo API network error: ${(err as Error).message}`,
      );
      throw new BlestaUnavailableException(
        'DNS provider is temporarily unavailable',
      );
    }

    const json = await response.json();
    const code = json?.reply?.code;

    // NameSilo uses 300 for success; other 2xx/3xx codes are documented error states.
    if (code !== 300) {
      throw new BlestaValidationException(
        json?.reply?.detail ?? 'DNS provider rejected the request',
      );
    }

    return json;
  }

  private asArray(value: unknown): any[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }
}
