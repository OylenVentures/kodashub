# Domains Module (Blesta integration)

Wraps Blesta as the billing/registrar backend for domain search, purchase,
transfer, nameserver updates, and DNS management.

## How it fits together

```
Client → NestJS API → BlestaApiService → Blesta REST API → Registrar module → Registry
                    ↘ DnsProvider (adapter) → either a Blesta plugin OR the registrar's own API
```

- **BlestaApiService** (`blesta/blesta-api.service.ts`) is a thin, generic
  caller for `{model}/{method}.json` with Basic Auth, timeouts, and retry on
  network/5xx errors only (never retries a 4xx). Everything else builds on it.
- **DomainsService** owns the business logic: it calls Blesta for the parts
  that are genuinely standard (clients, services/packages/pricing), persists
  a local `Domain` row per purchase for fast ownership checks and listing,
  and delegates DNS record CRUD to a swappable `DnsProvider`.
- **TldPackageResolver** maps a TLD to the Blesta package + pricing IDs an
  admin configures in Blesta itself (Packages > a package per TLD/registrar,
  with register/renew/transfer pricing terms).

## Important: read this before wiring up nameservers/DNS in production

Blesta's public REST API is solid for core billing objects (clients,
packages, pricing, services) — but it does **not** uniformly expose registrar
-module-specific actions like domain availability search or DNS record CRUD
as clean REST endpoints. Those live inside each module's own admin/client
"tabs" (Namesilo, OpenSRS, ResellerClub, CentralNic, etc. each implement
these differently, and some don't support DNS editing at all — only
delete-and-recreate).

Two ways this module handles that gap, both already wired as an interface
(`DnsProvider` in `blesta/interfaces/dns-provider.interface.ts`) so you can
swap the implementation without touching `DomainsService`:

1. **Companion Blesta plugin (recommended if you support several
   registrars).** Build a small Blesta plugin exposing a model (e.g.
   `domain_tools.dns`) with `get`/`add`/`edit`/`delete` methods. Inside
   Blesta's own PHP code, that plugin can instantiate the registrar module's
   class directly and call its real methods — trivial there, painful from
   outside. Once it exists, it's reachable at your normal API base URL as
   `domain_tools.dns/get.json`, using the same Basic Auth you already have.
   Set `BLESTA_DNS_PLUGIN_MODEL` (and `BLESTA_AVAILABILITY_PLUGIN_MODEL` for
   search) once it's deployed — `BlestaPluginDnsProvider` is ready to call it.

2. **Call the registrar directly.** If you're only using one registrar and
   it has its own DNS API (many do — NameSilo, Cloudflare Registrar, etc.),
   skip Blesta entirely for DNS and call the registrar. `NamesiloDnsProvider`
   is a complete worked example. Point `DomainsModule`'s `DNS_PROVIDER` at it.

Nameserver updates (as opposed to DNS *records*) are more standardized:
Blesta's official registrar modules store `ns1`–`ns5` as service fields, so
`Services::edit` with those keys is a safe, working pattern across most
modules — that's what `DomainsService.updateNameservers` uses. Availability
search has the same gap as DNS records and follows path 1 or 2 above.

## Blesta admin setup checklist

1. Install and configure your registrar module (Settings > Company > Modules).
2. Create one Package per TLD (or per TLD group) using that module, with
   register/renew/transfer pricing terms.
3. Create API credentials: Settings > Company > API Access. Use Basic Auth
   over HTTPS only.
4. Fill `BLESTA_TLD_PACKAGE_MAP` in `.env` with each package's ID and its
   three pricing IDs (visible in the package's edit screen / via the
   `packages`/`get` API call).
5. (Optional but recommended) build and deploy the companion plugin described
   above, then set `BLESTA_DNS_PLUGIN_MODEL` / `BLESTA_AVAILABILITY_PLUGIN_MODEL`.

## Endpoints (prefixed `/api/v1`, all require auth)

| Method | Route                              | Notes |
|--------|-------------------------------------|-------|
| GET    | `/domains/search?query=&tlds=`      | Availability across configured/given TLDs |
| GET    | `/domains`                          | Current user's domains |
| GET    | `/domains/:id`                      | One domain (owner or staff) |
| POST   | `/domains/purchase`                 | Register a new domain |
| POST   | `/domains/transfer`                 | Transfer a domain in (needs EPP/auth code) |
| PATCH  | `/domains/:id/nameservers`          | Update nameservers |
| GET    | `/domains/:id/dns-records`          | List DNS records |
| POST   | `/domains/:id/dns-records`          | Create a DNS record |
| PATCH  | `/domains/:id/dns-records/:recordId`| Update a DNS record |
| DELETE | `/domains/:id/dns-records/:recordId`| Delete a DNS record |
| POST   | `/domains/:id/sync`                 | **Staff only** — re-pull status from Blesta |

## Field names you should double-check against your setup

A few parameter names in `domains.service.ts` (`clients/add` fields,
`auth_code` for transfers, `ns1`–`ns5`) are the conventional names used by
Blesta's officially maintained registrar modules, but they're not
enforced by Blesta core — they're whatever the module you install defines
as its service fields. Before going live, open your chosen module's package
edit screen in Blesta admin (or its source on github.com/blesta/module-*)
and confirm the exact field keys, then adjust the marked spots in
`domains.service.ts`.

## Suggested next steps

- Add a webhook receiver (or a scheduled job calling `syncFromBlesta`) so
  domain status/expiry stays current without polling from the client.
- Add a `DomainRenewalService` calling `services/edit` with the renewal
  pricing term, or `services/renew` if your Blesta version exposes it.
- Extend `TldPackageResolver` to read from a DB table once you're selling
  more than a handful of TLDs, so admins can manage it without redeploying.
