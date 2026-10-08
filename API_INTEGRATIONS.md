# Kimance API Integrations

## Current state

| Capability | Provider | Repository status | Account status | Next requirement |
| --- | --- | --- | --- | --- |
| Authentication and data | Supabase | Integrated | Active | Maintain Vercel environment variables and RLS policies |
| Currency rates | CurrencyAPI | Integrated | Key required | Configure `CURRENCYAPI_KEY` in Vercel |
| Merchant onboarding | Stripe Connect | Server integration added | Existing account, MFA required | Add test API key and webhook secret, then apply the migration |
| KYC and AML | Thirdstream | Configuration contract added | Account exists with no product subscriptions | Thirdstream must activate a product and issue API credentials |
| Global transfers | Wise Platform | Configuration contract added | No account confirmed | Complete partner/sandbox onboarding and obtain OAuth credentials |
| Canadian bank linking | Flinks | Configuration contract added | No account confirmed | Create a sandbox account and obtain instance credentials |
| Card issuing | Marqeta | Configuration contract added | No account confirmed | Complete sandbox onboarding and obtain application tokens |
| OTP notifications | Twilio Verify | Configuration contract added | No account confirmed | Create an account and Verify service |
| African mobile money | Thunes | Configuration contract added | No account confirmed | Complete partner onboarding and obtain sandbox credentials |

## Safety boundaries

- Provider secrets are server-only and must be stored in Vercel, never committed.
- Live-money operations stay disabled until the corresponding sandbox flow and webhook handling pass end-to-end tests.
- Stripe webhooks are verified before any database update.
- Users cannot directly update provider status or capabilities; verified server webhooks use the Supabase service role.
- Stripe connected-account creation uses a stable idempotency key to prevent duplicate accounts during retries.
- Provider account IDs are stored in `integration_accounts`; secret keys are never stored in Supabase rows.
- The migration enables row-level security so users can access only their own provider mappings.

## Stripe Connect setup

1. Apply `supabase/migrations/20261008000000_create_integration_accounts.sql`.
2. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to Vercel Preview first.
3. Configure the Stripe test-mode webhook URL as `/api/integrations/stripe/webhook` and subscribe to `account.updated`.
4. Call `POST /api/integrations/stripe/connect` as an authenticated Kimance user to create or resume onboarding.
5. Verify onboarding status with `GET /api/integrations/stripe/connect`.
6. Promote the same configuration to Production only after test-mode validation.

## Provider readiness endpoint

Authenticated users can call `GET /api/integrations/status`. The endpoint returns provider names, purposes, and missing environment-variable names, but never returns secret values.
