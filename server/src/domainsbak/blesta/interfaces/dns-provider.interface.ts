export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';

export interface DnsRecord {
  id?: string; // provider-assigned id, when the provider supports editing/deleting by id
  type: DnsRecordType;
  name: string; // host/subdomain part, e.g. "www" or "@" for root
  value: string;
  ttl?: number;
  priority?: number; // MX/SRV
}

/**
 * DNS record management is NOT uniformly exposed by Blesta's core REST API —
 * each registrar module (Namesilo, OpenSRS, ResellerClub, CentralNic, ...)
 * implements its own DNS tab differently, and most of those tabs are plain
 * authenticated web controllers, not REST-callable model methods.
 *
 * Two realistic ways to get real DNS CRUD behind this interface:
 *
 *  1. RECOMMENDED: build a small Blesta plugin (a "companion API plugin")
 *     that exposes a model, e.g. `domain_tools.dns`, with `get`/`add`/
 *     `edit`/`delete` methods. Inside Blesta, that plugin model can call the
 *     registrar module's own instantiated Module class directly (Blesta core
 *     code can do this trivially), and it becomes reachable at
 *     `{baseUrl}/domain_tools.dns/get.json` through the same Basic-Auth API
 *     you already use for everything else. See BlestaPluginDnsProvider below.
 *
 *  2. If your registrar (e.g. Namesilo, Cloudflare-fronted domains, etc.)
 *     offers its own DNS API, call it directly instead of proxying through
 *     Blesta. Often simpler and better documented than reverse-engineering a
 *     module's admin tab. See NamesiloDnsProvider for a worked example.
 *
 * DomainsService depends only on this interface, so swapping the
 * implementation is a one-line change in DomainsModule.
 */
export interface DnsProvider {
  listRecords(domain: string): Promise<DnsRecord[]>;
  createRecord(domain: string, record: DnsRecord): Promise<DnsRecord>;
  updateRecord(domain: string, recordId: string, record: DnsRecord): Promise<DnsRecord>;
  deleteRecord(domain: string, recordId: string): Promise<void>;
}

export const DNS_PROVIDER = Symbol('DNS_PROVIDER');
