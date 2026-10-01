# KodasHub API

---

## Features

### Auth & User Module

A complete, production-grade authentication module for a NestJS + TypeORM backend
(Postgres assumed — swap the driver in `app.module.ts` if you use something else).

#### What's included

- **Registration** with email verification (token hashed at rest, 24h expiry, no
  plaintext token ever stored in the DB).
- **Login** via email/password, with account lockout after repeated failed
  attempts (`MAX_FAILED_LOGIN_ATTEMPTS`, `ACCOUNT_LOCK_MINUTES`) and a generic
  "invalid email or password" error so accounts can't be enumerated.
- **JWT access tokens** (short-lived, 15m default) sent in the response body —
  the frontend keeps these in memory, not localStorage.
- **Rotating refresh tokens** (7d default) delivered as an `httpOnly`,
  `Secure`, `SameSite=Strict` cookie scoped to `/auth`. Each refresh token is
  backed by a DB row (`refresh_tokens`) so sessions can be revoked server-side.
  Reusing an already-rotated/revoked token triggers automatic revocation of
  **all** of that user's sessions (theft-detection pattern).
- **Forgot / reset password**, and **change password** (both revoke all other
  sessions and email a "your password changed" notice).
- **Global auth by default**: `JwtAuthGuard` is registered as an `APP_GUARD`,
  so every route requires a valid access token unless explicitly marked
  `@Public()`. This is deliberately fail-closed — you can't forget to protect
  a new controller.
- **Role-based access control** scaffolding (`UserRole`, `@Roles()`,
  `RolesGuard`) ready for your support / developer / devops / admin split,
  and for gating the future domain-reseller endpoints (e.g. only `ADMIN` can
  push nameserver changes to Blesta on someone else's behalf).
- **Rate limiting** via `@nestjs/throttler`, tightened further on
  register/login/forgot-password/reset-password.
- **Password policy**: argon2, min 8 chars, upper+lower+number+symbol.
- **`helmet`**, strict CORS with credentials, global `ValidationPipe`
  (whitelist + forbid unknown fields), and automatic stripping of
  sensitive fields (password hash, tokens) from every JSON response via
  `class-transformer`'s `@Exclude()` + `ClassSerializerInterceptor`.

### Support Tickets Module

Lets clients open support requests and any staff/admin respond, with status
tracking the back-and-forth automatically.

#### Status flow

```
Client creates ticket        -> OPEN
Staff/admin replies          -> ANSWERED   (+ email sent to the client)
Client replies               -> CUSTOMER_REPLY
Saff working on ticket       -> IN_PROGRESS
Staff/admin closes           -> CLOSED
```

The status always reflects "whose turn it is to respond" — `ANSWERED` means
the client has something new to read, `CUSTOMER_REPLY` means staff do.

#### Design notes

- **The opening message is the first reply, not a separate field.** A
  ticket's conversation thread (`TicketReply`, ordered by `createdAt`) holds everything, including the original request — simpler than juggling a `ticket.description` field plus a separate replies list, and it's how most helpdesk systems (Zendesk, WHMCS, Blesta) model it.
- **Any staff role can answer any ticket** — `isStaffRole()` (from
  `common/enums/role.enum.ts`) covers `ADMIN`, `SUPPORT_AGENT`,
  `DEVELOPER`, and `DEVOPS_ENGINEER`, matching the three service lines.
  There's no hard assignment/routing — `assignedStaffId` is set
  automatically to whoever answers first, purely for visibility (e.g "who's been handling this"), and never restricts who else can reply.
- **A closed ticket can be replied to directly** — `addReply` reopens a ticket and update the status.
- **No attachments**, per the current spec — `CreateReplyDto`/`CreateTicketDto` are plain text.
- **Email only fires in one direction right now**: client gets notified when staff answers/status updated (per the spec). Staff are _not_ currently emailed when a client replies (`CUSTOMER_REPLY`) — see "Suggested next steps".

### Domains Module (Blesta integration)

Wraps Blesta as the billing/registrar backend for domain search, purchase,
transfer, nameserver updates, and DNS management.

#### How it fits together

```md
Client → NestJS API → BlestaApiService → Blesta REST API → Registrar module → Registry
↘ DnsProvider (adapter) → either a Blesta plugin OR the registrar's own API
```

- **BlestaApiService** (`blesta/blesta-api.service.ts`) is a thin, generic caller for `{model}/{method}.json` with Basic Auth, timeouts, and retry on network/5xx errors only (never retries a 4xx). Everything else builds on it.
- **DomainsService** owns the business logic: it calls Blesta for the parts that are genuinely standard (clients, services/packages/pricing), persists a local `Domain` row per purchase for fast ownership checks and listing, and delegates DNS record CRUD to a swappable `DnsProvider`.
- **TldPackageResolver** maps a TLD to the Blesta package + pricing IDs an admin configures in Blesta itself (Packages > a package per TLD/registrar, with register/renew/transfer pricing terms).

#### Important: read this before wiring up nameservers/DNS in production

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

Nameserver updates (as opposed to DNS _records_) are more standardized:
Blesta's official registrar modules store `ns1`–`ns5` as service fields, so
`Services::edit` with those keys is a safe, working pattern across most
modules — that's what `DomainsService.updateNameservers` uses. Availability
search has the same gap as DNS records and follows path 1 or 2 above.

#### Blesta admin setup checklist

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

---

## Setup

```bash
npm install
cp .env.template .env   # fill in real secrets — see below
```

Generate strong secrets:

```bash
openssl rand -hex 64   # run 3x for JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET
```

With `NODE_ENV=development`, `synchronize: true` will create tables
automatically for local dev. **Switch to TypeORM migrations before
production** — never run `synchronize` against a prod database.

```bash
npm run start:dev
```

---

## Endpoints (prefixed `/api/v1`)

| Method | Route                                | Auth            | Notes                                                                                                         |
| ------ | ------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/register`                     | Public          | Sends verification email                                                                                      |
| POST   | `/auth/verify-email`                 | Public          | Body: `{ token }`                                                                                             |
| POST   | `/auth/resend-verification`          | Public          | Body: `{ email }`                                                                                             |
| POST   | `/auth/login`                        | Public          | Sets refresh cookie, returns access token                                                                     |
| POST   | `/auth/refresh`                      | Public (cookie) | Rotates refresh token                                                                                         |
| POST   | `/auth/logout`                       | Public (cookie) | Revokes current session                                                                                       |
| POST   | `/auth/logout-all`                   | **Protected**   | Revokes every session                                                                                         |
| POST   | `/auth/forgot-password`              | Public          | Always returns a generic message                                                                              |
| POST   | `/auth/reset-password`               | Public          | Body: `{ token, password, confirmPassword }`                                                                  |
| POST   | `/auth/change-password`              | **Protected**   | Revokes other sessions                                                                                        |
| GET    | `/auth/me`                           | **Protected**   | Current user                                                                                                  |
| GET    | `/users/me`                          | **Protected**   | Current user profile                                                                                          |
| PATCH  | `/users/me`                          | **Protected**   | Update name/phone                                                                                             |
| POST   | `/mail/contact`                      | Public          | Send contact form                                                                                             |
| POST   | `/mail/request-service`              | Public          | Send new request ticket                                                                                       |
| POST   | `/support-tickets`                   | **Protected**   | Creates ticket, status `OPEN`                                                                                 |
| GET    | `/support-tickets`                   | **Protected**   | Clients see only their own; staff/admin see all. Filters: `status`, `department`, `priority`, `page`, `limit` |
| GET    | `/support-tickets/:id`               | **Protected**   | Full thread, oldest first                                                                                     |
| POST   | `/support-tickets/:id/reply`         | **Protected**   | Staff reply → `ANSWERED` + client email; client reply → `CUSTOMER_REPLY`                                      |
| POST   | `/support-tickets/:id/status`        | **Protected**   | Staff update → `STATUS` + client email; client reply → `CUSTOMER_REPLY`                                       |
| GET    | `/domains/search?query=&tlds=`       | **Protected**   | Availability across configured/given TLDs                                                                     |
| GET    | `/domains`                           | **Protected**   | Current user's domains                                                                                        |
| GET    | `/domains/:id`                       | **Protected**   | One domain (owner or staff)                                                                                   |
| POST   | `/domains/purchase`                  | **Protected**   | Register a new domain                                                                                         |
| POST   | `/domains/transfer`                  | **Protected**   | Transfer a domain in (needs EPP/auth code)                                                                    |
| PATCH  | `/domains/:id/nameservers`           | **Protected**   | Update nameservers                                                                                            |
| GET    | `/domains/:id/dns-records`           | **Protected**   | List DNS records                                                                                              |
| POST   | `/domains/:id/dns-records`           | **Protected**   | Create a DNS record                                                                                           |
| PATCH  | `/domains/:id/dns-records/:recordId` | **Protected**   | Update a DNS record                                                                                           |
| DELETE | `/domains/:id/dns-records/:recordId` | **Protected**   | Delete a DNS record                                                                                           |
| POST   | `/domains/:id/sync`                  | **Protected**   | **Staff only** — re-pull status from Blesta                                                                   |

---

## Field names you should double-check against your setup

A few parameter names in `domains.service.ts` (`clients/add` fields,
`auth_code` for transfers, `ns1`–`ns5`) are the conventional names used by
Blesta's officially maintained registrar modules, but they're not
enforced by Blesta core — they're whatever the module you install defines
as its service fields. Before going live, open your chosen module's package
edit screen in Blesta admin (or its source on github.com/blesta/module-*)
and confirm the exact field keys, then adjust the marked spots in
`domains.service.ts`.

---

## Frontend integration notes

- Send `credentials: 'include'` (fetch) or `withCredentials: true` (axios) on
  every request so the refresh cookie is sent/received.
- Store the access token in memory (e.g. a module-level variable or React
  context), not `localStorage`/`sessionStorage` — mitigates XSS token theft.
- On a 401 from an access-token-protected route, call `/auth/refresh` once,
  then retry the original request; if refresh also fails, redirect to login.

---

## Suggested next steps for your platform

1. **Auth module**:
   - Consider adding optional **2FA (TOTP)** on top of this — the `User` entity and login flow are structured so a `twoFactorEnabled` / `twoFactorSecret` field and an extra verification step can be dropped in without touching the token/rotation logic.

2. **Support tickets module**:
   - Add a `GET /support-tickets/:id/replies` count or "unread" flag if you want
     the ticket list to show at-a-glance which tickets need attention.

3. Add `@nestjs/schedule` to run `AuthService.purgeExpiredTokens()` daily.

4. **Domains module**:
   - Add a webhook receiver (or a scheduled job calling `syncFromBlesta`) so
     domain status/expiry stays current without polling from the client.
   - Add a `DomainRenewalService` calling `services/edit` with the renewal
     pricing term, or `services/renew` if your Blesta version exposes it.
   - Extend `TldPackageResolver` to read from a DB table once you're selling
     more than a handful of TLDs, so admins can manage it without redeploying.

---
