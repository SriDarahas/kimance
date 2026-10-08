import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const STRIPE_API_URL = "https://api.stripe.com/v1";

type StripeAccount = {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
};

type StripeAccountLink = {
  url: string;
  expires_at: number;
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
    idempotencyKey?: string;
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
      ...(options.idempotencyKey
        ? { "Idempotency-Key": options.idempotencyKey }
        : {}),
    },
    body: options.form,
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
  const form = new URLSearchParams();
  appendFormValue(form, "type", "express");
  appendFormValue(form, "country", "CA");
  appendFormValue(form, "email", input.email);
  appendFormValue(form, "capabilities[card_payments][requested]", true);
  appendFormValue(form, "capabilities[transfers][requested]", true);
  appendFormValue(form, "metadata[kimance_user_id]", input.kimanceUserId);

  return stripeRequest<StripeAccount>("/accounts", {
    method: "POST",
    form,
    idempotencyKey: `kimance-connect-${input.kimanceUserId}`,
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

  return stripeRequest<StripeAccountLink>("/account_links", {
    method: "POST",
    form,
  });
}

export async function getStripeConnectedAccount(accountId: string) {
  return stripeRequest<StripeAccount>(`/accounts/${accountId}`);
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
    data: { object: StripeAccount };
  };
}
