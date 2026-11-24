import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const STRIPE_API_URL = "https://api.stripe.com";
const STRIPE_V2_API_VERSION = "2026-09-30.endive";

type StripeAccount = {
  id: string;
  configuration?: {
    merchant?: {
      capabilities?: {
        card_payments?: { status: string };
        stripe_balance?: { payouts?: { status: string } };
      };
    };
  };
  requirements?: {
    entries?: Array<{
      awaiting_action_from: "stripe" | "user";
      minimum_deadline?: {
        status: "currently_due" | "eventually_due" | "past_due";
      };
    }>;
  };
};

type StripeAccountLink = {
  url: string;
  expires_at: number;
};

type StripeAccountUpdate = {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
};

type StripeErrorResponse = {
  error?: {
    message?: string;
  };
};

function appendFormValue(
  form: URLSearchParams,
  key: string,
  value: string | boolean | undefined
) {
  if (value !== undefined) form.set(key, String(value));
}

async function stripeRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    form?: URLSearchParams;
    json?: unknown;
    idempotencyKey?: string;
    apiVersion?: string;
  } = {}
) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Stripe is not configured. Missing STRIPE_SECRET_KEY.");
  }

  const response = await fetch(`${STRIPE_API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(options.form
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : {}),
      ...(options.json ? { "Content-Type": "application/json" } : {}),
      ...(options.idempotencyKey
        ? { "Idempotency-Key": options.idempotencyKey }
        : {}),
      ...(options.apiVersion
        ? { "Stripe-Version": options.apiVersion }
        : {}),
    },
    body: options.json ? JSON.stringify(options.json) : options.form,
    cache: "no-store",
  });

  const payload = (await response.json()) as T & StripeErrorResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message || "Stripe request failed.");
  }

  return payload;
}

export async function createStripeConnectedAccount(input: {
  email?: string;
  kimanceUserId: string;
}) {
  return stripeRequest<StripeAccount>("/v2/core/accounts", {
    method: "POST",
    json: {
      contact_email: input.email,
      display_name: input.email?.split("@")[0] || "Kimance merchant",
      identity: { country: "ca" },
      configuration: {
        merchant: {
          capabilities: { card_payments: { requested: true } },
        },
      },
      defaults: {
        responsibilities: {
          fees_collector: "stripe",
          losses_collector: "stripe",
        },
      },
      dashboard: "full",
      metadata: { kimance_user_id: input.kimanceUserId },
      include: ["configuration.merchant", "defaults", "requirements"],
    },
    idempotencyKey: `kimance-connect-${input.kimanceUserId}`,
    apiVersion: STRIPE_V2_API_VERSION,
  });
}

export async function createStripeAccountLink(input: {
  accountId: string;
  refreshUrl: string;
  returnUrl: string;
}) {
  const form = new URLSearchParams();
  appendFormValue(form, "account", input.accountId);
  appendFormValue(form, "refresh_url", input.refreshUrl);
  appendFormValue(form, "return_url", input.returnUrl);
  appendFormValue(form, "type", "account_onboarding");

  return stripeRequest<StripeAccountLink>("/v1/account_links", {
    method: "POST",
    form,
  });
}

export async function getStripeConnectedAccount(accountId: string) {
  const include = new URLSearchParams();
  include.append("include[0]", "configuration.merchant");
  include.append("include[1]", "requirements");

  const account = await stripeRequest<StripeAccount>(
    `/v2/core/accounts/${accountId}?${include.toString()}`,
    { apiVersion: STRIPE_V2_API_VERSION }
  );
  const cardStatus =
    account.configuration?.merchant?.capabilities?.card_payments?.status;
  const payoutStatus =
    account.configuration?.merchant?.capabilities?.stripe_balance?.payouts
      ?.status;
  const hasOutstandingUserRequirements = account.requirements?.entries?.some(
    (entry) =>
      entry.awaiting_action_from === "user" &&
      entry.minimum_deadline?.status !== "eventually_due"
  );

  return {
    id: account.id,
    charges_enabled: cardStatus === "active",
    payouts_enabled: payoutStatus === "active",
    details_submitted: !hasOutstandingUserRequirements,
  };
}

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function verifyStripeWebhook(rawBody: string, signatureHeader: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error(
      "Stripe webhooks are not configured. Missing STRIPE_WEBHOOK_SECRET."
    );
  }

  const parts = signatureHeader.split(",").map((part) => part.split("="));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts
    .filter(([key]) => key === "v1")
    .map(([, value]) => value);

  if (!timestamp || signatures.length === 0) {
    throw new Error("Invalid Stripe signature header.");
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) {
    throw new Error("Stripe webhook timestamp is outside the allowed window.");
  }

  const expected = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  if (!signatures.some((signature) => signaturesMatch(expected, signature))) {
    throw new Error("Stripe webhook signature verification failed.");
  }

  return JSON.parse(rawBody) as {
    id: string;
    type: string;
    data: { object: StripeAccountUpdate };
  };
}
