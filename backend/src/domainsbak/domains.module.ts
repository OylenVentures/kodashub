import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity.js';
import { User } from '../users/entities/user.entity.js';
import { DomainsService } from './domains.service.js';
import { DomainsController } from './domains.controller.js';
import { BlestaApiService } from './blesta/blesta-api.service.js';
import { TldPackageResolver } from './blesta/tld-package-resolver.service.js';
import { DNS_PROVIDER } from './blesta/interfaces/dns-provider.interface.js';
import { BlestaPluginDnsProvider } from './blesta/dns-providers/blesta-plugin-dns.provider.js';
// import { NamesiloDnsProvider } from './blesta/dns-providers/namesilo-dns.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Domain, User])],
  controllers: [DomainsController],
  providers: [
    DomainsService,
    BlestaApiService,
    TldPackageResolver,
    // Swap the `useClass` below to pick which DNS backend DomainsService uses.
    // Default: proxy through a companion Blesta plugin (see the DnsProvider
    // interface doc comment). To call a registrar's API directly instead,
    // use NamesiloDnsProvider (uncomment the import above) or write your own
    // class implementing DnsProvider — nothing else in this module changes.
    { provide: DNS_PROVIDER, useClass: BlestaPluginDnsProvider },
  ],
  exports: [DomainsService],
})
export class DomainsModule {}
