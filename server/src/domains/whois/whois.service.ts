import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';
import {
  KNOWN_WHOIS_SERVERS,
  NOT_FOUND_PATTERNS,
} from './tld-whois-servers.js';

export interface WhoisAvailabilityResult {
  domain: string;
  /** true = looks available, false = looks registered, null = couldn't determine (see reason) */
  available: boolean | null;
  reason?: string;
  raw?: string;
}

const IANA_WHOIS_HOST = 'whois.iana.org';
const QUERY_TIMEOUT_MS = 30000;

/**
 * Checks domain availability by querying WHOIS (port 43) directly against
 * the registry - independent of any registrar account. This is a genuine
 * "is this domain taken, anywhere" check, as opposed to a registrar's own
 * availability endpoint (which really answers "can I register this through
 * this specific registrar right now" and may rate-limit or require an
 * account). Good as a fast, unauthenticated first pass before a real
 * registrar lookup/purchase flow.
 *
 * Limitations, stated plainly:
 *  - Response formats are NOT standardized across registries. The
 *    "not found" pattern matching below covers the common cases (Verisign,
 *    PIR, most Afilias/Identity Digital-run registries, Google Registry,
 *    etc.) but isn't guaranteed for every ccTLD.
 *  - Some ccTLD registries (including Nigeria's .ng, relevant given this
 *    platform's market) don't run a public port-43 WHOIS service at all, or
 *    heavily rate-limit/require web-only lookups. For those, this returns
 *    available: null with a reason rather than guessing.
 *  - WHOIS servers commonly rate-limit by source IP - don't use this as a
 *    high-volume bulk checker; for that, use a registrar's dedicated
 *    availability endpoint (RegistrarProvider.checkAvailability), which is
 *    built for exactly that.
 */
@Injectable()
export class WhoisService {
  private readonly logger = new Logger(WhoisService.name);
  private readonly serverCache = new Map<string, string | null>();

  async checkAvailability(
    domainName: string,
  ): Promise<WhoisAvailabilityResult> {
    const tld = this.extractTld(domainName);

    let server: string | null;
    try {
      server = await this.resolveServer(tld);
    } catch (err) {
      return {
        domain: domainName,
        available: null,
        reason: `Could not resolve a WHOIS server for .${tld}: ${(err as Error).message}`,
      };
    }

    if (!server) {
      return {
        domain: domainName,
        available: null,
        reason: `No public WHOIS server is known for .${tld}. Use a registrar-specific availability check instead.`,
      };
    }

    let response: string;
    try {
      response = await this.query(server, domainName);
    } catch (err) {
      const fallbackCheck = await this.checkFallback(
        domainName.split('.')[0],
        tld,
      ); // fallback to WHOIS API if available

      return (
        fallbackCheck || {
          domain: domainName,
          available: null,
          reason: `WHOIS query to ${server} failed: ${(err as Error).message}`,
        }
      );
    }

    // Thin registries (.com/.net and similar) return a referral to the
    // sponsoring registrar's own WHOIS server when the domain IS registered;
    // an unregistered domain gets a direct "no match" from the registry
    // itself, so we don't need to follow the referral just to answer
    // "is it available" - an early no-match short-circuits below.
    const isAvailable = NOT_FOUND_PATTERNS.some((pattern) =>
      pattern.test(response),
    );

    return { domain: domainName, available: isAvailable, raw: response };
  }

  /** Resolves the authoritative WHOIS server for a TLD, using IANA as a bootstrap for unknown ones. */
  private async resolveServer(tld: string): Promise<string | null> {
    if (KNOWN_WHOIS_SERVERS[tld]) return KNOWN_WHOIS_SERVERS[tld];
    if (this.serverCache.has(tld)) return this.serverCache.get(tld) ?? null;

    const referral = await this.query(IANA_WHOIS_HOST, tld);
    const match = /whois:\s*(\S+)/i.exec(referral);
    const server = match?.[1] ?? null;

    this.serverCache.set(tld, server);
    return server;
  }

  private query(server: string, query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const socket = net.createConnection({ host: server, port: 43 });
      let data = '';
      let settled = false;

      const finish = (fn: () => void) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        socket.destroy();
        fn();
      };

      const timer = setTimeout(() => {
        finish(() => reject(new Error('timed out')));
      }, QUERY_TIMEOUT_MS);

      socket.on('connect', () => socket.write(`${query}\r\n`));
      socket.on('data', (chunk) => (data += chunk.toString('utf8')));
      socket.on('end', () => finish(() => resolve(data)));
      socket.on('error', (err) => finish(() => reject(err)));
    });
  }

  private extractTld(domain: string): string {
    return domain.toLowerCase().split('.').slice(1).join('.');
  }

  private async checkFallback(name: string, tld: string) {
    const url = `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${process.env.WHOIS_API_KEY}&domainName=${name}.${tld}&credits=DA`;
    let result: any;

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(QUERY_TIMEOUT_MS),
      });
      result = await response.json();
    } catch (err) {
      return {
        domain: name + `.${tld}`,
        available: null,
        reason: `WHOIS query failed: ${(err as Error).message}`,
      };
    }

    if (
      !result.DomainInfo?.domainAvailability ||
      result.DomainInfo?.domainAvailability !== 'AVAILABLE'
    ) {
      return { domain: name + `.${tld}`, available: false, raw: result };
    }
    return { domain: name + `.${tld}`, available: true, raw: result };
  }
}
