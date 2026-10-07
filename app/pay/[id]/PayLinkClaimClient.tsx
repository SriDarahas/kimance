"use client";

import { useMemo, useState, useTransition } from "react";
import { claimPayLink } from "./actions";
import {
  isPayLinkExpired,
  PAY_LINK_METHOD_LABELS,
  type PayLinkMethod,
  type PayLinkPayload,
} from "@/lib/services/pay-links";

type PayLinkClaimClientProps = {
  payLinkId: string;
  payload: PayLinkPayload;
  demoMode?: boolean;
};

const DEMO_PAY_LINKS_STORAGE_KEY = "kimance-demo-pay-links";

function formatAmount(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PayLinkClaimClient({
  payLinkId,
  payload,
  demoMode = false,
}: PayLinkClaimClientProps) {
  const [currentPayload, setCurrentPayload] = useState(payload);
  const [selectedMethod, setSelectedMethod] = useState<PayLinkMethod>("wallet");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [mobileProvider, setMobileProvider] = useState("Orange Money");
  const [mobileNumber, setMobileNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const expired = useMemo(() => isPayLinkExpired(currentPayload), [currentPayload]);
  const isClosed = currentPayload.status !== "pending" || expired;

  const saveDemoClaim = (nextPayload: PayLinkPayload) => {
    try {
      const stored = window.localStorage.getItem(DEMO_PAY_LINKS_STORAGE_KEY);
      const parsed = stored ? (JSON.parse(stored) as Array<{ id: string; createdAt: string; payload: PayLinkPayload }>) : [];
      const nextHistory = parsed.map((link) =>
        link.id === payLinkId || link.payload.code.toLowerCase() === payLinkId
          ? { ...link, payload: nextPayload }
          : link
      );
      window.localStorage.setItem(
        DEMO_PAY_LINKS_STORAGE_KEY,
        JSON.stringify(nextHistory)
      );
    } catch {
      // Ignore local preview storage issues.
    }
  };

  const handleClaim = () => {
    setError(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setError("Enter your full name to continue.");
      return;
    }

    if (!otp.trim()) {
      setError("Enter the 6-digit OTP shared with the pay link.");
      return;
    }

    if (selectedMethod === "wallet" && !email.trim()) {
      setError("Enter the email address for your Kimance account.");
      return;
    }

    if (selectedMethod === "bank" && (!bankName.trim() || !accountName.trim())) {
      setError("Enter the bank name and account holder name.");
      return;
    }

    if (selectedMethod === "mobile_money" && !mobileNumber.trim()) {
      setError("Enter the mobile money phone number.");
      return;
    }

    if (selectedMethod === "crypto" && !walletAddress.trim()) {
      setError("Enter the crypto wallet address.");
      return;
    }

    if (demoMode) {
      const nextPayload: PayLinkPayload = {
        ...currentPayload,
        status: "claimed",
        claimedAt: new Date().toISOString(),
        claimMethod: selectedMethod,
        claimedBy: fullName.trim(),
        claimReference:
          selectedMethod === "wallet"
            ? email.trim() || "Kimance wallet payout"
            : PAY_LINK_METHOD_LABELS[selectedMethod],
      };
      setCurrentPayload(nextPayload);
      saveDemoClaim(nextPayload);
      setSuccessMessage(
        selectedMethod === "wallet"
          ? `${formatAmount(
              currentPayload.destinationCurrency,
              currentPayload.destinationAmount
            )} has been added to your Kimance wallet.`
          : `${formatAmount(
              currentPayload.destinationCurrency,
              currentPayload.destinationAmount
            )} will be sent by ${PAY_LINK_METHOD_LABELS[
              selectedMethod
            ].toLowerCase()}. This link is now closed.`
      );
      return;
    }

    startTransition(async () => {
      const result = await claimPayLink({
        payLinkId,
        otp,
        method: selectedMethod,
        fullName,
        email,
        bankName,
        accountName,
        mobileProvider,
        mobileNumber,
        walletAddress,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setCurrentPayload(result.payload);
      setSuccessMessage(result.message);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">You received money via Kimance</p>
              <h1 className="font-serif text-4xl font-bold text-gray-900 mt-2">
                {currentPayload.destinationCurrency} {currentPayload.destinationAmount.toFixed(2)}
              </h1>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 min-w-44">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Expires
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {new Date(currentPayload.expiresAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Claim Money
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the OTP and choose where to receive the funds.
            </p>
          </div>

          {isClosed && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700">
              {currentPayload.status === "claimed"
                ? "This pay link has already been claimed."
                : currentPayload.status === "canceled"
                ? "This pay link was canceled by the sender."
                : "This pay link expired. Ask the sender to create a new one."}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-4">
              <p className="text-sm font-semibold text-green-800">
                Money received
              </p>
              <p className="mt-1 text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your full name
              </label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Recipient name"
                disabled={isClosed || !!successMessage}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OTP
              </label>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 tracking-[0.25em] font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="123456"
                maxLength={6}
                disabled={isClosed || !!successMessage}
              />
            </div>
          </div>

          <div>
            <p className="block text-sm font-semibold text-gray-700 mb-3">
              Receive money with
            </p>
            <div className="flex flex-wrap gap-2">
              {currentPayload.allowedMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  disabled={isClosed || !!successMessage}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    selectedMethod === method
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {PAY_LINK_METHOD_LABELS[method]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Transfer summary
                </p>
                <p className="mt-2 text-xl font-serif font-bold text-gray-900">
                  {currentPayload.sourceCurrency} {currentPayload.sourceAmount.toFixed(2)} → {currentPayload.destinationCurrency}{" "}
                  {currentPayload.destinationAmount.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                1 {currentPayload.sourceCurrency} = {currentPayload.exchangeRate.toFixed(4)} {currentPayload.destinationCurrency}
              </p>
            </div>
          </div>

          {selectedMethod === "wallet" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kimance account email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
                disabled={isClosed || !!successMessage}
              />
            </div>
          )}

          {selectedMethod === "bank" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank name
                </label>
                <input
                  value={bankName}
                  onChange={(event) => setBankName(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your bank"
                  disabled={isClosed || !!successMessage}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account holder name
                </label>
                <input
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Account name"
                  disabled={isClosed || !!successMessage}
                />
              </div>
            </div>
          )}

          {selectedMethod === "mobile_money" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile money provider
                </label>
                <select
                  value={mobileProvider}
                  onChange={(event) => setMobileProvider(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isClosed || !!successMessage}
                >
                  <option>Orange Money</option>
                  <option>M-Pesa</option>
                  <option>Airtel Money</option>
                  <option>MTN Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile wallet number
                </label>
                <input
                  value={mobileNumber}
                  onChange={(event) => setMobileNumber(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+243..."
                  disabled={isClosed || !!successMessage}
                />
              </div>
            </div>
          )}

          {selectedMethod === "crypto" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crypto wallet address
              </label>
              <textarea
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Paste your wallet address"
                disabled={isClosed || !!successMessage}
              />
            </div>
          )}

          {!successMessage && (
            <button
              type="button"
              onClick={handleClaim}
              disabled={isClosed || isPending}
              className="w-full rounded-2xl bg-purple-600 px-5 py-4 text-white font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 disabled:bg-purple-400"
            >
              {isPending ? "Securing payout..." : "Claim Money"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
