export const PAY_LINK_NOTE_PREFIX = "PAY_LINK::";

export function hasPayLinkSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export type PayLinkMethod = "wallet" | "bank" | "mobile_money" | "crypto";
export type PayLinkStatus = "pending" | "claimed" | "canceled";
export type PayLinkFundingMethod =
  | "wallet_balance"
  | "bank_account"
  | "debit_card"
  | "credit_card"
  | "mobile_money"
  | "crypto_wallet";

export interface PayLinkPayload {
  version: 1;
  code: string;
  status: PayLinkStatus;
  createdAt: string;
  expiresAt: string;
  otp: string;
  senderName: string;
  sourceWalletId: string;
  sourceCurrency: string;
  sourceAmount: number;
  fundingMethod?: PayLinkFundingMethod;
  destinationCurrency: string;
  destinationAmount: number;
  exchangeRate: number;
  note?: string;
  allowedMethods: PayLinkMethod[];
  claimedAt?: string;
  claimMethod?: PayLinkMethod;
  claimedBy?: string;
  claimReference?: string;
  canceledAt?: string;
}

export const PAY_LINK_METHOD_LABELS: Record<PayLinkMethod, string> = {
  wallet: "Kimance Wallet",
  bank: "Bank Transfer",
  mobile_money: "Mobile Money",
  crypto: "Crypto Wallet",
};

export const PAY_LINK_FUNDING_METHOD_LABELS: Record<
  PayLinkFundingMethod,
  string
> = {
  wallet_balance: "Wallet Balance",
  bank_account: "Bank Account",
  debit_card: "Debit Card",
  credit_card: "Credit Card",
  mobile_money: "Mobile Money",
  crypto_wallet: "Crypto Wallet",
};

const USD_RATES: Record<string, number> = {
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

function randomDigits(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function generatePayLinkCode() {
  const segment = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KM${segment}`;
}

export function generatePayLinkOtp() {
  return randomDigits(6);
}

export function getExchangeRate(fromCurrency: string, toCurrency: string) {
  const fromRate = USD_RATES[fromCurrency] ?? 1;
  const toRate = USD_RATES[toCurrency] ?? 1;
  return fromRate / toRate;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
) {
  const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
  const converted = amount * exchangeRate;
  return {
    exchangeRate,
    convertedAmount: Number(converted.toFixed(2)),
  };
}

export function buildPayLinkNote(payload: PayLinkPayload) {
  return `${PAY_LINK_NOTE_PREFIX}${JSON.stringify(payload)}`;
}

export function parsePayLinkNote(note: string | null | undefined) {
  if (!note || !note.startsWith(PAY_LINK_NOTE_PREFIX)) {
    return null;
  }

  try {
    return JSON.parse(
      note.slice(PAY_LINK_NOTE_PREFIX.length)
    ) as PayLinkPayload;
  } catch {
    return null;
  }
}

export function isPayLinkNote(note: string | null | undefined) {
  return Boolean(parsePayLinkNote(note));
}

export function isPayLinkExpired(payload: PayLinkPayload) {
  return new Date(payload.expiresAt).getTime() < Date.now();
}

export function formatPayLinkStatus(payload: PayLinkPayload) {
  if (payload.status === "canceled") return "Canceled";
  if (payload.status === "claimed") return "Claimed";
  if (isPayLinkExpired(payload)) return "Expired";
  return "Active";
}

export function getPayLinkTransactionLabel(note: string | null | undefined) {
  const payload = parsePayLinkNote(note);
  if (!payload) return note;

  const status = formatPayLinkStatus(payload);
  return `Pay Link • ${status} • ${payload.destinationCurrency} ${payload.destinationAmount.toFixed(2)}`;
}

export function buildClaimReference(
  method: PayLinkMethod,
  details: {
    email?: string;
    bankName?: string;
    accountName?: string;
    mobileProvider?: string;
    mobileNumber?: string;
    walletAddress?: string;
  }
) {
  switch (method) {
    case "wallet":
      return details.email || "Kimance wallet payout";
    case "bank":
      return `${details.bankName || "Bank"} • ${details.accountName || "Recipient"}`;
    case "mobile_money":
      return `${details.mobileProvider || "Mobile Money"} • ${details.mobileNumber || ""}`.trim();
    case "crypto":
      return details.walletAddress || "Crypto wallet";
    default:
      return "Claim request";
  }
}
