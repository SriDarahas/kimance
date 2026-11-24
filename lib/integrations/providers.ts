import "server-only";

export type IntegrationProvider =
  | "thirdstream"
  | "stripe"
  | "wise"
  | "flinks"
  | "marqeta"
  | "twilio"
  | "thunes";

type ProviderDefinition = {
  label: string;
  purpose: string;
  requiredEnvironmentVariables: string[];
};

const PROVIDERS: Record<IntegrationProvider, ProviderDefinition> = {
  thirdstream: {
    label: "Thirdstream",
    purpose: "KYC, AML, and identity verification",
    requiredEnvironmentVariables: [
      "THIRDSTREAM_BASE_URL",
      "THIRDSTREAM_CLIENT_ID",
      "THIRDSTREAM_CLIENT_SECRET",
    ],
  },
  stripe: {
    label: "Stripe Connect",
    purpose: "Merchant onboarding, payments, and settlement",
    requiredEnvironmentVariables: [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
    ],
  },
  wise: {
    label: "Wise Platform",
    purpose: "Global transfers, FX quotes, and payouts",
    requiredEnvironmentVariables: [
      "WISE_BASE_URL",
      "WISE_CLIENT_ID",
      "WISE_CLIENT_SECRET",
    ],
  },
  flinks: {
    label: "Flinks",
    purpose: "Canadian bank linking and account verification",
    requiredEnvironmentVariables: [
      "FLINKS_BASE_URL",
      "FLINKS_CUSTOMER_ID",
      "FLINKS_INSTANCE",
      "FLINKS_SECRET",
    ],
  },
  marqeta: {
    label: "Marqeta",
    purpose: "Virtual and physical card issuing",
    requiredEnvironmentVariables: [
      "MARQETA_BASE_URL",
      "MARQETA_APPLICATION_TOKEN",
      "MARQETA_ADMIN_ACCESS_TOKEN",
    ],
  },
  twilio: {
    label: "Twilio",
    purpose: "OTP and transaction notifications",
    requiredEnvironmentVariables: [
      "TWILIO_ACCOUNT_SID",
      "TWILIO_AUTH_TOKEN",
      "TWILIO_VERIFY_SERVICE_SID",
    ],
  },
  thunes: {
    label: "Thunes",
    purpose: "African mobile-money payouts",
    requiredEnvironmentVariables: [
      "THUNES_BASE_URL",
      "THUNES_API_KEY",
      "THUNES_API_SECRET",
    ],
  },
};

export function getIntegrationReadiness() {
  return Object.entries(PROVIDERS).map(([id, definition]) => {
    const missingEnvironmentVariables =
      definition.requiredEnvironmentVariables.filter(
        (name) => !process.env[name]?.trim()
      );

    return {
      id: id as IntegrationProvider,
      label: definition.label,
      purpose: definition.purpose,
      configured: missingEnvironmentVariables.length === 0,
      missingEnvironmentVariables,
    };
  });
}

export function assertIntegrationConfigured(provider: IntegrationProvider) {
  const readiness = getIntegrationReadiness().find(
    (entry) => entry.id === provider
  );

  if (!readiness?.configured) {
    throw new Error(
      `${readiness?.label ?? provider} is not configured. Missing: ${
        readiness?.missingEnvironmentVariables.join(", ") || "configuration"
      }.`
    );
  }
}
