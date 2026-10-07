"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import {
  cancelPayLink,
  createPayLink,
} from "@/app/pay-link/actions";
import {
  formatPayLinkStatus,
  isPayLinkExpired,
  generatePayLinkCode,
  generatePayLinkOtp,
  type PayLinkPayload,
} from "@/lib/services/pay-links";

type WalletRecord = {
  id: string;
  currency: string;
  balance: number;
};

type PayLinkHistoryRecord = {
  id: string;
  createdAt: string;
  payload: PayLinkPayload;
};

type PayLinkClientProps = {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
  wallets: WalletRecord[];
  payLinks: Array<PayLinkHistoryRecord | null>;
  baseUrl: string;
  demoMode?: boolean;
};

const DEMO_PAY_LINKS_STORAGE_KEY = "kimance-demo-pay-links";

const DESTINATION_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "CAD", label: "CAD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "NGN", label: "NGN" },
  { value: "KES", label: "KES" },
  { value: "GHS", label: "GHS" },
  { value: "TZS", label: "TZS" },
  { value: "CDF", label: "CDF" },
];

function loadDemoHistory() {
  try {
    const stored = window.localStorage.getItem(DEMO_PAY_LINKS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Array<PayLinkHistoryRecord | null>;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PayLinkClient({
  userName,
  userEmail,
  isAdmin = false,
  wallets,
  payLinks,
  baseUrl,
  demoMode = false,
}: PayLinkClientProps) {
  const router = useRouter();
  const [sourceWalletId, setSourceWalletId] = useState(wallets[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [destinationCurrency, setDestinationCurrency] = useState("USD");
  const [error, setError] = useState<string | null>(null);
  const [historyLinks, setHistoryLinks] = useState<Array<PayLinkHistoryRecord | null>>(
    payLinks
  );
  const [createdLink, setCreatedLink] = useState<{
    id: string;
    shareUrl: string;
    payload: PayLinkPayload;
  } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedWallet = useMemo(
    () => wallets.find((wallet) => wallet.id === sourceWalletId),
    [sourceWalletId, wallets]
  );

  const amountValue = Number(amount || 0);
  const exchangeRate = useMemo(() => {
    if (!selectedWallet) return 1;
    const rateMap: Record<string, number> = {
      USD: 1,
      CAD: 0.73,
      EUR: 1.09,
      GBP: 1.27,
      AUD: 0.66,
      BTC: 95000,
      ETH: 3500,
      NGN: 0.00073,
      KES: 0.0077,
      GHS: 0.074,
      TZS: 0.00039,
      CDF: 0.00035,
    };
    const fromRate = rateMap[selectedWallet.currency] ?? 1;
    const toRate = rateMap[destinationCurrency] ?? 1;
    return fromRate / toRate;
  }, [destinationCurrency, selectedWallet]);

  const destinationAmount = useMemo(
    () => Number.isFinite(amountValue) ? amountValue * exchangeRate : 0,
    [amountValue, exchangeRate]
  );

  useEffect(() => {
    if (demoMode) {
      const syncDemoHistory = () => {
        setHistoryLinks(loadDemoHistory());
      };

      const initialSync = window.setTimeout(syncDemoHistory, 0);

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          syncDemoHistory();
        }
      };

      window.addEventListener("storage", syncDemoHistory);
      window.addEventListener("focus", syncDemoHistory);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.clearTimeout(initialSync);
        window.removeEventListener("storage", syncDemoHistory);
        window.removeEventListener("focus", syncDemoHistory);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    const syncServerHistory = window.setTimeout(() => {
      setHistoryLinks(payLinks);
    }, 0);

    const refreshHistory = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    const interval = window.setInterval(refreshHistory, 10000);
    window.addEventListener("focus", refreshHistory);
    document.addEventListener("visibilitychange", refreshHistory);

    return () => {
      window.clearTimeout(syncServerHistory);
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshHistory);
      document.removeEventListener("visibilitychange", refreshHistory);
    };
  }, [demoMode, payLinks, router]);

  const persistDemoHistory = (nextHistory: Array<PayLinkHistoryRecord | null>) => {
    setHistoryLinks(nextHistory);

    if (!demoMode) return;

    try {
      window.localStorage.setItem(
        DEMO_PAY_LINKS_STORAGE_KEY,
        JSON.stringify(nextHistory)
      );
    } catch {
      // Ignore local storage issues in preview mode.
    }
  };

  const mobileHeader = (
    <div className="flex flex-col">
      <span className="font-serif text-lg font-bold text-gray-900 leading-tight">
        Pay Link
      </span>
      <span className="text-xs text-purple-600">
        Send money globally with one secure link
      </span>
    </div>
  );

  const handleCreate = () => {
    setError(null);
    if (!selectedWallet) {
      setError("Select a wallet to continue.");
      return;
    }

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (demoMode) {
      const linkId = generatePayLinkCode().toLowerCase();
      const payload: PayLinkPayload = {
        version: 1,
        code: linkId.toUpperCase(),
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(),
        otp: generatePayLinkOtp(),
        senderName: userName,
        sourceWalletId: selectedWallet.id,
        sourceCurrency: selectedWallet.currency,
        sourceAmount: Number(amountValue.toFixed(2)),
        fundingMethod: "wallet_balance",
        destinationCurrency,
        destinationAmount: Number(destinationAmount.toFixed(2)),
        exchangeRate,
        allowedMethods: ["wallet", "bank", "mobile_money", "crypto"],
      };
      const preview = encodeURIComponent(JSON.stringify(payload));
      const nextRecord: PayLinkHistoryRecord = {
        id: linkId,
        createdAt: payload.createdAt,
        payload,
      };

      persistDemoHistory([nextRecord, ...historyLinks.filter(Boolean)]);
      setCreatedLink({
        id: linkId,
        shareUrl: `${baseUrl.replace(/\/$/, "")}/pay/${linkId}?preview=${preview}`,
        payload,
      });
      setAmount("");
      return;
    }

    startTransition(async () => {
      const result = await createPayLink({
        sourceWalletId,
        sourceCurrency: selectedWallet?.currency || "USD",
        destinationCurrency,
        amount: amountValue,
        fundingMethod: "wallet_balance",
        note: undefined,
        expiresInHours: 24,
      });

      if (!result.success) {
        setCreatedLink(null);
        setError(result.error);
        return;
      }

      setCreatedLink({
        id: result.id,
        shareUrl: `${baseUrl.replace(/\/$/, "")}/pay/${result.id}`,
        payload: result.payload,
      });
      setHistoryLinks([
        {
          id: result.id,
          createdAt: result.payload.createdAt,
          payload: result.payload,
        },
        ...payLinks.filter(Boolean),
      ]);
      setAmount("");
    });
  };

  const handleCancel = (id: string) => {
    setError(null);

    if (demoMode) {
      const nextHistory = historyLinks.map((link) => {
        if (!link || link.id !== id) return link;
        return {
          ...link,
          payload: {
            ...link.payload,
            status: "canceled",
            canceledAt: new Date().toISOString(),
          },
        };
      });
      persistDemoHistory(nextHistory);
      if (createdLink?.id === id) {
        const nextLink = nextHistory.find((link) => link?.id === id);
        if (nextLink) {
          setCreatedLink({
            id: nextLink.id,
            shareUrl: `${baseUrl.replace(/\/$/, "")}/pay/${nextLink.id}?preview=${encodeURIComponent(
              JSON.stringify(nextLink.payload)
            )}`,
            payload: nextLink.payload,
          });
        }
      }
      return;
    }

    setPendingId(id);
    startTransition(async () => {
      const result = await cancelPayLink(id);
      setPendingId(null);
      if (!result.success) {
        setError(result.error);
        return;
      }

      setHistoryLinks((current) =>
        current.map((link) => {
          if (!link || link.id !== id) return link;
          return {
            ...link,
            payload: result.payload,
          };
        })
      );
    });
  };

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  const shareLink = async () => {
    if (!createdLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kimance Pay Link",
          text: `Claim your money securely with Kimance. OTP: ${createdLink.payload.otp}`,
          url: createdLink.shareUrl,
        });
        return;
      } catch {
        return;
      }
    }

    await copyText(createdLink.shareUrl);
  };

  const shareLinkLabel = createdLink
    ? `${baseUrl.replace(/\/$/, "")}/pay/${createdLink.payload.code.toLowerCase()}`
    : "";

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar
        userName={userName}
        userEmail={userEmail}
        isAdmin={isAdmin}
        mobileHeader={mobileHeader}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              Kimance Pay Link
            </h1>
            <p className="text-sm text-purple-600">
              Create a secure transfer link and share it anywhere
            </p>
          </div>
          <Link
            href="/send-money"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Send Money
          </Link>
        </header>

        <div className="p-5 max-w-5xl mx-auto w-full space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-5">
            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Create Pay Link
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Choose the amount and payout currency. Each link expires in 24 hours.
              </p>
            </div>

            <div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Funding wallet
                </label>
                <select
                  value={sourceWalletId}
                  onChange={(event) => setSourceWalletId(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.currency} • {wallet.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  You send
                </label>
                <div className="flex gap-3">
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="100.00"
                  />
                  <div className="min-w-24 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700">
                    {selectedWallet?.currency || "USD"}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Recipient receives
                </label>
                <select
                  value={destinationCurrency}
                  onChange={(event) => setDestinationCurrency(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {DESTINATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Exchange rate
                  </p>
                  <p className="mt-1.5 text-2xl font-serif font-bold text-gray-900">
                    1 {selectedWallet?.currency || "USD"} = {exchangeRate.toFixed(4)} {destinationCurrency}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-2.5 border border-gray-200 min-w-40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Recipient gets
                  </p>
                  <p className="mt-1 text-lg font-semibold text-purple-700">
                    {destinationCurrency} {destinationAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isPending || !selectedWallet}
              onClick={handleCreate}
              className="w-full rounded-2xl bg-purple-600 px-5 py-3.5 text-white font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 disabled:bg-purple-400"
            >
              {isPending ? "Creating secure pay link..." : "Create Pay Link"}
            </button>
          </div>

          {createdLink && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900">
                    Link Ready
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Copy the link and share the OTP separately.
                  </p>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Ready to share
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Share link
                </p>
                <p className="mt-2 break-all text-sm text-gray-800">
                  {shareLinkLabel}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                    OTP
                  </p>
                  <p className="mt-2 font-serif text-3xl font-bold text-purple-800">
                    {createdLink.payload.otp}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Expires
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {new Date(createdLink.payload.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => copyText(createdLink.shareUrl)}
                  className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={shareLink}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Share link
                </button>
                <button
                  type="button"
                  onClick={() => copyText(createdLink.payload.otp)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Copy OTP
                </button>
                {!demoMode && (
                  <Link
                    href={`/pay/${createdLink.id}`}
                    className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                  >
                    Open claim page
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
              Link history
            </h3>
            <div className="space-y-3">
              {historyLinks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500">
                  No pay links yet.
                </div>
              )}

              {historyLinks.filter(Boolean).map((link) => {
                if (!link) return null;
                const status = formatPayLinkStatus(link.payload);
                const expired = isPayLinkExpired(link.payload);

                return (
                  <div
                    key={link.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {link.payload.destinationCurrency}{" "}
                          {link.payload.destinationAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {link.payload.code} • {new Date(link.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            status === "Active"
                              ? "bg-green-100 text-green-700"
                              : status === "Claimed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {status}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyText(`${baseUrl.replace(/\/$/, "")}/pay/${link.id}`)
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Copy
                        </button>
                        {link.payload.status === "pending" && (
                          <button
                            type="button"
                            disabled={isPending && pendingId === link.id}
                            onClick={() => handleCancel(link.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                          >
                            {expired
                              ? isPending && pendingId === link.id
                                ? "Releasing..."
                                : "Release"
                              : isPending && pendingId === link.id
                              ? "Canceling..."
                              : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
