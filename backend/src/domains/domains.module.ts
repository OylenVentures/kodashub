import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './entities/domain.entity.js';
import { RegistrarAccount } from './entities/registrar-account.entity.js';
import { DomainsService } from './domains.service.js';
import { DomainsController } from './domains.controller.js';
import { RegistrarRegistry } from './registrars/registrar-registry.service.js';
import { ResellerClubHttpClient } from './registrars/resellerclub/resellerclub-http.client.js';
import {
  ResellerClubProvider,
  RESELLERCLUB_PROVIDER,
} from './registrars/resellerclub/resellerclub.provider.js';
import {
  WhogohostProvider,
  WHOGOHOST_PROVIDER,
} from './registrars/whogohost/whogohost.provider.js';
import { WhoisService } from './whois/whois.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Domain, RegistrarAccount])],
  controllers: [DomainsController],
  providers: [
    DomainsService,
    RegistrarRegistry,
    WhoisService,
    ResellerClubHttpClient,
    ResellerClubProvider,
    WhogohostProvider,
    { provide: RESELLERCLUB_PROVIDER, useExisting: ResellerClubProvider },
    { provide: WHOGOHOST_PROVIDER, useExisting: WhogohostProvider },
  ],
  exports: [DomainsService],
})
export class DomainsModule {}
