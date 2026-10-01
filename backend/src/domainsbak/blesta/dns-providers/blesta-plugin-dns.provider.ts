import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlestaApiService } from '../blesta-api.service.js';
import {
  DnsProvider,
  DnsRecord,
} from '../interfaces/dns-provider.interface.js';
import { BlestaCapabilityNotConfiguredException } from '../blesta.exceptions.js';

/**
 * Calls a companion Blesta plugin model (see the interface doc comment for
 * why this is the recommended approach). Configure the plugin's model name
 * via BLESTA_DNS_PLUGIN_MODEL — Blesta reaches plugin models at
 * "{plugin}.{model}/{method}.json", e.g. "domain_tools.dns/get.json".
 *
 * If you haven't built that plugin yet, every call here fails loudly with a
 * clear 501 rather than silently pretending to succeed.
 */
@Injectable()
export class BlestaPluginDnsProvider implements DnsProvider {
  private readonly pluginModel: string | undefined;

  constructor(
    private blesta: BlestaApiService,
    private config: ConfigService,
  ) {
    this.pluginModel = this.config.get<string>('BLESTA_DNS_PLUGIN_MODEL');
  }

  async listRecords(domain: string): Promise<DnsRecord[]> {
    this.assertConfigured();
    const result = await this.blesta.call<{ records: DnsRecord[] }>(
      this.pluginModel as string,
      'get',
      { domain },
    );
    return result.records ?? [];
  }

  async createRecord(domain: string, record: DnsRecord): Promise<DnsRecord> {
    this.assertConfigured();
    return this.blesta.call<DnsRecord>(this.pluginModel as string, 'add', {
      domain,
      ...record,
    });
  }

  async updateRecord(
    domain: string,
    recordId: string,
    record: DnsRecord,
  ): Promise<DnsRecord> {
    this.assertConfigured();
    return this.blesta.call<DnsRecord>(this.pluginModel as string, 'edit', {
      domain,
      record_id: recordId,
      ...record,
    });
  }

  async deleteRecord(domain: string, recordId: string): Promise<void> {
    this.assertConfigured();
    await this.blesta.call(this.pluginModel as string, 'delete', {
      domain,
      record_id: recordId,
    });
  }

  private assertConfigured(): void {
    if (!this.pluginModel) {
      throw new BlestaCapabilityNotConfiguredException(
        'DNS management is not configured yet. Set BLESTA_DNS_PLUGIN_MODEL once the companion ' +
          'Blesta plugin is installed, or switch DomainsModule to a registrar-specific DnsProvider.',
      );
    }
  }
}
