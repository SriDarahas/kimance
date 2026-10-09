"use client";

import { useEffect, useState } from "react";

type StripeConnectionStatus =
  | "not_started"
  | "onboarding"
  | "submitted"
  | "active";

type StripeStatusResponse = {
  connected: boolean;
  status: StripeConnectionStatus;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
};

type StripeConnectCardProps = {
  configured: boolean;
};

const STATUS_CONTENT: Record<
  StripeConnectionStatus,
  { label: string; description: string }
> = {
  not_started: {
    label: "Not connected",
    description: "Connect Stripe to complete merchant onboarding and enable payouts.",
  },
  onboarding: {
    label: "Setup in progress",
    description: "Continue the secure Stripe onboarding process to finish setup.",
  },
  submitted: {
    label: "Under review",
    description: "Stripe is reviewing the submitted merchant information.",
  },
  active: {
    label: "Connected",
    description: "Stripe onboarding is complete and payouts are enabled.",
  },
};

async function getErrorMessage(response: Response) {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;
  return payload?.error || "Stripe is temporarily unavailable.";
}

export default function StripeConnectCard({
  configured,
}: StripeConnectCardProps) {
  const [status, setStatus] =
    useState<StripeConnectionStatus>("not_started");
  const [loading, setLoading] = useState(configured);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) return;

    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/integrations/stripe/connect", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error(await getErrorMessage(response));

        const payload = (await response.json()) as StripeStatusResponse;
        if (!cancelled) setStatus(payload.status);
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Stripe status could not be loaded."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStatus();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  async function handleConnect() {
    setConnecting(true);
    setError(null);

    try {
      const response = await fetch("/api/integrations/stripe/connect", {
        method: "POST",
      });
      if (!response.ok) throw new Error(await getErrorMessage(response));

      const payload = (await response.json()) as { onboardingUrl?: string };
      if (!payload.onboardingUrl) {
        throw new Error("Stripe did not return an onboarding link.");
      }

      window.location.assign(payload.onboardingUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Stripe onboarding could not be started."
      );
      setConnecting(false);
    }
  }

  const content = STATUS_CONTENT[status];
  const isActive = status === "active";
  const actionLabel =
    status === "not_started" ? "Connect Stripe" : "Continue setup";

  return (
    <div className="md:col-span-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <span className="material-icons-outlined" aria-hidden="true">
              payments
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900">Stripe Connect</p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {!configured
                  ? "Setup required"
                  : loading
                    ? "Checking"
                    : content.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {!configured
                ? "Stripe test credentials must be added before merchant onboarding can begin."
                : content.description}
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleConnect}
          disabled={!configured || loading || connecting || isActive}
          className="shrink-0 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          {!configured
            ? "Admin setup required"
            : loading
              ? "Checking status..."
              : connecting
                ? "Opening Stripe..."
                : isActive
                  ? "Connected"
                  : actionLabel}
        </button>
      </div>
    </div>
  );
}
