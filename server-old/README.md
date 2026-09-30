# KodasHub API

KodasHub API is the backend service for the KodasHub platform. It is built with NestJS, TypeORM, and PostgreSQL, and currently powers authentication, profile management, audit logs, cart checkout, payment verification, webhook processing, and service fulfillment.

---

## Current Backend Scope

- Authentication and user management
- Profile and account management
- Audit logs
- Cart checkout for multiple service types
- One payment per cart checkout
- Paystack payment initialization and verification
- Paystack webhook processing with signature validation
- Payment event deduplication and idempotent fulfillment
- Extensible fulfillment handlers for services such as domain, hosting, SSL, and email
- Tool utilities: electricity calculator and cloud storage migration/sync

---

## Requirements

- Node.js 20+ recommended
- `pnpm`
- PostgreSQL
- Paystack secret key and callback URL
- Optional: cloud storage, email provider, WHOIS provider keys, depending on enabled features

---

## Environment Variables

Create a `.env` file in the `server` folder and set the values required by your deployment. You can use the `.env.template` as your guide.

If you are testing webhooks locally, `PAYSTACK_CALLBACK_URL` should point to your public proxy URL.

---

## Install

```bash
cd server
pnpm install
```

---

## Run Locally

Development mode with hot reload:

```bash
pnpm start:dev
```

Production build:

```bash
pnpm build
pnpm start:prod
```

Run tests:

```bash
pnpm test
```

Run TypeScript typecheck:

```bash
pnpm exec tsc --noEmit
```

---

## Database

If you use Docker Compose for local infrastructure, start it from the repository root or the `server` folder depending on your setup.

```bash
pnpm docker:up
```

Stop containers and remove volumes:

```bash
pnpm docker:down
```

---

## Payment Flow

The current payment design uses a single payment record for the full cart checkout.

1. The client adds one or more cart items.
2. `POST /payment/initialize` creates one Paystack transaction for the total cart amount.
3. The payment record stores a snapshot of the cart items for later fulfillment.
4. Paystack sends webhook events to `/payment/webhook`.
5. The webhook is verified with HMAC-SHA512, deduplicated, and then processed.
6. Fulfillment handlers provision each cart item after the payment is confirmed.

---

## Local Webhook Testing

Paystack webhooks need a public URL. For local development, use a proxy tunnel to forward requests to your local server.

The app exposes helpers for this in `package.json`:

```bash
pnpm proxy:lt
```

This opens a LocalTunnel public URL that forwards to port `4001`.

If you prefer Pinggy:

```bash
pnpm proxy:ping
```

This creates an SSH reverse tunnel that forwards your local server on port `4001`.

### Webhook endpoint

The webhook endpoint is:

```text
POST /payment/webhook
```

### Local webhook setup

1. Start the server locally.
2. Start one of the proxy commands above.
3. Copy the public proxy URL.
4. Set `PAYSTACK_CALLBACK_URL` to that public URL plus your payment callback path if needed.
5. Configure Paystack to send webhooks to the public proxy URL that forwards to `/payment/webhook`.

---

## Utility Tools

The application includes utility tools for common tasks:

### OTP (One-Time Password)

Located in `src/utils/otp.ts`, the OTP utility generates time-limited one-time password tokens for account verification, password reset, and authentication flows.

### Mail

Located in `src/utils/mail.ts`, the Mail utility sends emails using Postmark.

**Setup:**

Set the following environment variables:

- `POSTMARK_API_KEY`: Your Postmark API key
- `SMTP_USER`: The sender email address

### Seed

Located in `src/utils/seed.ts`, the Seed utility creates a super admin user in the database for initial setup.

**Setup:**

Set the following environment variables:

- `FIRSTNAME`: First name of the super admin
- `LASTNAME`: Last name of the super admin
- `EMAIL`: Email of the super admin
- `PASSWORD`: Password for the super admin

This will create the super admin user if it doesn't already exist, otherwise it will skip seeding.

---

## Tool Module

Located in `src/tool/`, the Tool module provides utility endpoints for electricity usage calculations and cloud storage migration.

### Electricity Usage Calculator

Calculates electricity consumption and cost based on meter readings and tariff bands. Includes 7.5% tax in the total cost.

### Cloud Storage Migration

The module provides endpoints to migrate files between cloud storage providers. Supports batch uploads with concurrent processing.

**Cloudinary to S3:** Migrates all files from Cloudinary to AWS S3.

**Cloudflare R2 to S3:** Migrates all files from Cloudflare R2 to AWS S3.

**Features:**

- Batch processing: migrates up to 500 files per API call
- Concurrent uploads: processes up to 10 files at a time
- Verification: compares source and destination counts after migration
- Error handling: logs failed uploads separately
- Timeout protection: 30-second timeout per file fetch

---

## Useful Commands

```bash
pnpm docker:up
pnpm start:dev
pnpm build
pnpm start:prod
pnpm test
pnpm proxy:lt
pnpm proxy:ping
```

---

## Notes

- The checkout flow is production-oriented and supports multiple service types through fulfillment handlers.
- Webhook requests are verified with the raw request body and the Paystack signature header.
- Payment events are stored so duplicate webhook deliveries do not trigger duplicate fulfillment.

---
