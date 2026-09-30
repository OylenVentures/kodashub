# Domains Module (direct registrar integration)

Talks to domain registrars directly — no billing platform in between. Two
registrars are wired up now (ResellerClub, Whogohost), routed per-TLD, behind
one shared interface so adding a third later is a new provider class, not a
rewrite.

## How it fits together

```md
Client → NestJS API → RegistrarRegistry → RegistrarProvider (per TLD)
├─ ResellerClubProvider → httpapi.com REST API
└─ WhogohostProvider → (pending real API docs)
↘ WhoisService → raw port-43 WHOIS (registrar-independent availability check)
```

- **`RegistrarProvider`** (`registrars/interfaces/registrar-provider.interface.ts`)
  is the contract every registrar integration implements: availability,
  register, transfer, nameserver updates, DNS record CRUD, status lookup.
  `DomainsService` only ever talks to this interface.
- **`RegistrarRegistry`** decides which provider handles a given domain,
  based on its TLD (`TLD_REGISTRAR_MAP` env var, e.g. `.ng` → Whogohost,
  everything else → `DEFAULT_REGISTRAR`).
- **`ResellerClubProvider`** is a complete implementation against
  ResellerClub's real, documented HTTP API (verified against their public KB
  at manage.resellerclub.com). It also creates and caches a ResellerClub
  Customer + Contact per platform user (`RegistrarAccount` entity) since
  ResellerClub requires both before it will register or transfer anything.
- **`WhogohostProvider`** is a structurally-complete adapter to the same
  interface, but — read the next section before using it for real.
- **`WhoisService`** answers "is this domain registered, anywhere" via a raw
  WHOIS (port 43) query, with no registrar account needed at all.

## Important: Whogohost's API is not publicly documented

Unlike ResellerClub, Whogohost doesn't publish a self-serve reseller/partner
API reference. `WhogohostProvider` is written to the same
`RegistrarProvider` contract and has working error handling, timeouts, and
request plumbing — but the actual endpoint paths, parameter names, and auth
scheme in it are a **placeholder** based on common registrar-API
conventions, not confirmed against real Whogohost documentation.

Before using it in production:

1. Contact Whogohost's partner/reseller support for their actual API
   reference (endpoints, auth scheme, required fields per operation).
2. Replace the `TODO`-marked spots in
   `registrars/whogohost/whogohost.provider.ts` with the real request/response
   shapes.
3. If their API turns out to be SOAP, XML-RPC, or something else entirely,
   only `request()` in that one file needs to change — `DomainsService`,
   `RegistrarRegistry`, and everything else are unaffected, since they only
   depend on the `RegistrarProvider` interface.

Until it's configured (`WHOGOHOST_API_URL` / `WHOGOHOST_API_KEY` unset),
every call through it throws a clear, explicit error rather than silently
doing the wrong thing.

## WHOIS availability checker

`GET /domains/whois?domain=example.com` queries the domain's authoritative
WHOIS server directly (bootstrapping unknown TLDs through IANA) and pattern-
matches the response for "no match"/"available" phrasing. It's genuinely
useful as a fast, unauthenticated first pass, but has real limits, stated in
`whois/whois.service.ts`'s doc comment:

- Response formats aren't standardized across every registry — the pattern
  list covers the common cases (Verisign, PIR, Google Registry, etc.) but
  isn't guaranteed for every ccTLD.
- **Some ccTLD registries don't run a public port-43 WHOIS service at all —
  Nigeria's `.ng` registry is one of them.** For domains under TLDs like
  that, this endpoint returns `available: null` with a `reason` rather than
  guessing. Use the registrar-backed `/domains/search` endpoint for `.ng`
  availability instead — Whogohost's own availability check (once wired up)
  is the authoritative source for that TLD anyway.
- WHOIS servers rate-limit by source IP. Don't use this for bulk/batch
  checking — use a registrar's `checkAvailability` for that.

`GET /domains/search?query=mybrand&tlds=com&tlds=io` is the registrar-backed
equivalent — it answers "can I actually sell you this" rather than just "is
it taken", and is what the purchase flow should be gated on.

## Registrant / WHOIS contact data

Domain registration and transfer both require full WHOIS registrant contact
details (name, email, phone, address) by ICANN/registry policy — there's no
way around collecting this. `PurchaseDomainDto` and `TransferDomainDto` both
require a nested `registrant` object (`RegistrantContactDto`). Consider
prefilling this from the user's profile in your frontend once you collect
that data at signup, so they're not re-typing it on every domain order.

## Endpoints (prefixed `/api/v1`, all require auth)

| Method | Route                                | Notes                                              |
| ------ | ------------------------------------ | -------------------------------------------------- |
| GET    | `/domains/whois?domain=`             | Raw WHOIS check, any single domain                 |
| GET    | `/domains/search?query=&tlds=`       | Registrar-backed availability across given TLDs    |
| GET    | `/domains`                           | Current user's domains                             |
| GET    | `/domains/:id`                       | One domain (owner or staff)                        |
| POST   | `/domains/purchase`                  | Register a new domain                              |
| POST   | `/domains/transfer`                  | Transfer a domain in (needs EPP/auth code)         |
| PATCH  | `/domains/:id/nameservers`           | Update nameservers                                 |
| GET    | `/domains/:id/dns-records`           | List DNS records                                   |
| POST   | `/domains/:id/dns-records`           | Create a DNS record                                |
| PATCH  | `/domains/:id/dns-records/:recordId` | Update a DNS record                                |
| DELETE | `/domains/:id/dns-records/:recordId` | Delete a DNS record (body: `{ type, value? }`)     |
| POST   | `/domains/:id/sync`                  | **Staff only** — re-pull status from the registrar |

## Setup checklist

1. **ResellerClub**: sign up as a reseller, whitelist your server's outgoing
   IP (Settings > API), copy your Reseller ID and API key into
   `RESELLERCLUB_USER_ID` / `RESELLERCLUB_API_KEY`. Start with
   `RESELLERCLUB_TEST_MODE=true` against `test.httpapi.com` before going live.
2. **Whogohost**: get partner/reseller API access and real documentation
   from them directly, then fill in `whogohost.provider.ts` per the section
   above.
3. Set `TLD_REGISTRAR_MAP` and `DEFAULT_REGISTRAR` to route TLDs to the
   right provider.
4. Fund your ResellerClub reseller account balance — `register.json` /
   `transfer.json` calls fail if there isn't enough balance to cover the
   registry fee (we pass `invoice-option: NoInvoice` since billing is handled
   by your own platform, not ResellerClub's invoicing).

## Suggested next steps

- Add a scheduled job calling `syncFromRegistrar` for domains in `pending`/
  `transferring` status, so state catches up without the client polling.
- Add a `DomainRenewalService` — ResellerClub has a `domains/renew.json`
  endpoint (same auth/param conventions as `register.json`); wire it into
  `ResellerClubProvider` the same way.
- Once Whogohost's real API is confirmed, consider whether ID protection,
  premium domain pricing, and multi-year transfer support need provider-
  specific handling — `RegistrarProvider`'s interface can grow optional
  fields without breaking `ResellerClubProvider`'s existing implementation.
