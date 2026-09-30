import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DomainRegistrar,
  type RegistrarProvider,
} from './interfaces/registrar-provider.interface.js';
import { UnsupportedTldException } from './registrar.exceptions.js';
import { RESELLERCLUB_PROVIDER } from './resellerclub/resellerclub.provider.js';
import { WHOGOHOST_PROVIDER } from './whogohost/whogohost.provider.js';

/**
 * Maps a TLD to the registrar that should handle it, e.g. Whogohost for
 * .ng domains (they're the local registry's accredited registrar) and
 * ResellerClub for everything else. Configure via TLD_REGISTRAR_MAP (JSON)
 * plus a DEFAULT_REGISTRAR fallback.
 *
 * Example env value:
 * TLD_REGISTRAR_MAP={"ng":"whogohost","com.ng":"whogohost","org.ng":"whogohost"}
 * DEFAULT_REGISTRAR=resellerclub
 */
@Injectable()
export class RegistrarRegistry {
  private readonly tldMap: Record<string, DomainRegistrar>;
  private readonly defaultRegistrar: DomainRegistrar;

  constructor(
    private config: ConfigService,
    @Inject(RESELLERCLUB_PROVIDER) private resellerClub: RegistrarProvider,
    @Inject(WHOGOHOST_PROVIDER) private whogohost: RegistrarProvider,
  ) {
    const raw = this.config.get<string>('TLD_REGISTRAR_MAP') ?? '{}';
    try {
      this.tldMap = JSON.parse(raw);
    } catch {
      this.tldMap = {};
    }
    this.defaultRegistrar =
      (this.config.get<string>('DEFAULT_REGISTRAR') as DomainRegistrar) ??
      DomainRegistrar.RESELLERCLUB;
  }

  /** Resolves the provider for a full domain name (e.g. "example.com.ng"). */
  forDomain(domainName: string): RegistrarProvider {
    return this.forTld(this.extractTld(domainName));
  }

  forTld(tld: string): RegistrarProvider {
    const normalized = tld.replace(/^\./, '').toLowerCase();
    const registrarName = this.tldMap[normalized] ?? this.defaultRegistrar;
    return this.forRegistrar(registrarName);
  }

  forRegistrar(registrar: DomainRegistrar): RegistrarProvider {
    switch (registrar) {
      case DomainRegistrar.RESELLERCLUB:
        return this.resellerClub;
      case DomainRegistrar.WHOGOHOST:
        return this.whogohost;
      default:
        throw new UnsupportedTldException(registrar);
    }
  }

  forPrices(): RegistrarProvider {
    // For now, we just use the default registrar for price lookups.
    return this.forRegistrar(this.defaultRegistrar);
  }

  private extractTld(domain: string): string {
    // handles multi-part TLDs like "co.uk" / "com.ng" by checking the map's
    // longest match first, falling back to the last label.
    const labels = domain.toLowerCase().split('.');
    for (let i = 1; i < labels.length; i++) {
      const candidate = labels.slice(i).join('.');
      if (this.tldMap[candidate]) return candidate;
    }
    return labels.slice(1).join('.');
  }
}
