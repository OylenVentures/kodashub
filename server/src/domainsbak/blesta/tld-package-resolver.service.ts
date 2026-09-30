import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

export interface TldPackageMapping {
  packageId: number;
  registerPricingId: number;
  renewPricingId: number;
  transferPricingId: number;
}

/**
 * Blesta requires a Package to exist (configured with a registrar module and
 * TLD-specific pricing terms) before a domain of that TLD can be sold. This
 * resolver maps a TLD (e.g. "com", "io") to the Blesta package/pricing IDs
 * an admin has already set up in the Blesta admin panel.
 *
 * Implemented as a JSON env var for simplicity (BLESTA_TLD_PACKAGE_MAP).
 * Swap this out for a DB-backed admin-editable table once you have more
 * than a handful of TLDs — the DomainsService only depends on this
 * interface's shape.
 *
 * Example env value:
 * BLESTA_TLD_PACKAGE_MAP={"com":{"packageId":12,"registerPricingId":101,"renewPricingId":102,"transferPricingId":103},"io":{"packageId":13,"registerPricingId":111,"renewPricingId":112,"transferPricingId":113}}
 */
@Injectable()
export class TldPackageResolver {
  private readonly map: Record<string, TldPackageMapping>;

  constructor(config: ConfigService) {
    const raw = config.get<string>('BLESTA_TLD_PACKAGE_MAP') ?? '{}';
    try {
      this.map = JSON.parse(raw);
    } catch {
      this.map = {};
    }
  }

  resolve(domain: string): TldPackageMapping {
    const tld = this.extractTld(domain);
    const mapping = this.map[tld];
    if (!mapping) {
      throw new BadRequestException(`The .${tld} TLD is not currently offered`);
    }
    return mapping;
  }

  isSupported(tld: string): boolean {
    return !!this.map[tld.replace(/^\./, '').toLowerCase()];
  }

  supportedTlds(): string[] {
    return Object.keys(this.map);
  }

  private extractTld(domain: string): string {
    const parts = domain.toLowerCase().split('.');
    return parts.slice(1).join('.'); // handles multi-part TLDs like co.uk
  }
}
