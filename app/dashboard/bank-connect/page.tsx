
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Landmark,
  Loader2,
  LockKeyhole,
  Search,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Country = "all" | "US" | "CA";
type Step = "select" | "confirm" | "connecting" | "success";

type Bank = {
  id: string;
  name: string;
  country: "US" | "CA";
  initials: string;
  color: string;
  currency: "USD" | "CAD";
};

type LinkedAccount = {
  id: string;
  bankId: string;
  institution: string;
  title: string;
  accountNumber: string;
  balance: number;
  currency: string;
  country: string;
  method: string;
  mode: "demo";
  connectedAt: string;
};

const STORAGE_KEY = "kimance_connected_banks";

const BANKS: Bank[] = [
  {
    id: "chase",
    name: "Chase",
    country: "US",
    initials: "C",
    color: "#174EA6",
    currency: "USD",
  },
  {
    id: "bofa",
    name: "Bank of America",
    country: "US",
    initials: "B",
    color: "#D32F2F",
    currency: "USD",
  },
  {
    id: "wells",
    name: "Wells Fargo",
    country: "US",
    initials: "W",
    color: "#B71C1C",
    currency: "USD",
  },
  {
    id: "citi",
    name: "Citibank",
    country: "US",
    initials: "C",
    color: "#056DAE",
    currency: "USD",
  },
  {
    id: "capitalone",
    name: "Capital One",
    country: "US",
    initials: "C",
    color: "#004977",
    currency: "USD",
  },
  {
    id: "usbank",
    name: "U.S. Bank",
    country: "US",
    initials: "U",
    color: "#173F75",
    currency: "USD",
  },
  {
    id: "td",
    name: "TD Bank",
    country: "CA",
    initials: "TD",
    color: "#2E7D32",
    currency: "CAD",
  },
  {
    id: "rbc",
    name: "RBC Royal Bank",
    country: "CA",
    initials: "R",
    color: "#0051A5",
    currency: "CAD",
  },
  {
    id: "scotia",
    name: "Scotiabank",
    country: "CA",
    initials: "S",
    color: "#C62828",
    currency: "CAD",
  },
  {
    id: "bmo",
    name: "BMO",
    country: "CA",
    initials: "B",
    color: "#1565C0",
    currency: "CAD",
  },
  {
    id: "cibc",
    name: "CIBC",
    country: "CA",
    initials: "C",
    color: "#B71C1C",
    currency: "CAD",
  },
  {
    id: "national",
    name: "National Bank of Canada",
    country: "CA",
    initials: "N",
    color: "#C62828",
    currency: "CAD",
  },
];

const DEMO_BALANCES: Record<string, number> = {
  chase: 2450.75,
  bofa: 3820.5,
  wells: 1650.25,
  citi: 4200,
  capitalone: 1950.8,
  usbank: 3100,
  td: 5250.75,
  rbc: 6750.2,
  scotia: 2850,
  bmo: 4100.6,
  cibc: 3500,
  national: 2300.4,
};

function readAccounts(): LinkedAccount[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is LinkedAccount =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.institution === "string" &&
        typeof item.balance === "number"
    );
  } catch {
    return [];
  }
}

function saveAccounts(accounts: LinkedAccount[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(accounts)
  );

  window.dispatchEvent(
    new Event("kimance-banks-updated")
  );
}

function createDemoAccount(bank: Bank): LinkedAccount {
  const lastFour = String(
    1000 + Math.floor(Math.random() * 9000)
  );

  return {
    id: `demo_${bank.id}_${Date.now()}`,
    bankId: bank.id,
    institution: bank.name,
    title: "Checking Account",
    accountNumber: `****${lastFour}`,
    balance: DEMO_BALANCES[bank.id] ?? 1500,
    currency: bank.currency,
    country: bank.country,
    method: bank.country === "CA" ? "flinks" : "plaid",
    mode: "demo",
    connectedAt: new Date().toISOString(),
  };
}

export default function BankConnectPage() {
  const router = useRouter();

  const [country, setCountry] = useState<Country>("all");
  const [search, setSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(
    null
  );
  const [step, setStep] = useState<Step>("select");
  const [linkedAccounts, setLinkedAccounts] = useState<
    LinkedAccount[]
  >([]);
  const [newAccount, setNewAccount] =
    useState<LinkedAccount | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLinkedAccounts(readAccounts());
  }, []);

  const filteredBanks = useMemo(() => {
    return BANKS.filter((bank) => {
      const matchesCountry =
        country === "all" || bank.country === country;

      const matchesSearch = bank.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      return matchesCountry && matchesSearch;
    });
  }, [country, search]);

  const isAlreadyConnected = (bankId: string) =>
    linkedAccounts.some(
      (account) => account.bankId === bankId
    );

  function selectBank(bank: Bank) {
    setError("");
    setSelectedBank(bank);
    setStep("confirm");
  }

  function startConnection() {
    if (!selectedBank) return;

    setError("");
    setStep("connecting");

    // Demo connection only.
    // No bank credentials or real banking APIs are used.
    window.setTimeout(() => {
      try {
        const bank = selectedBank;

        const existing = readAccounts().find(
          (account) => account.bankId === bank.id
        );

        if (existing) {
          setNewAccount(existing);
          setLinkedAccounts(readAccounts());
          setStep("success");
          return;
        }

        const account = createDemoAccount(bank);

        const updated = [...readAccounts(), account];

        saveAccounts(updated);
        setLinkedAccounts(updated);
        setNewAccount(account);
        setStep("success");
      } catch {
        setError(
          "Unable to save the demo account. Please try again."
        );
        setStep("confirm");
      }
    }, 850);
  }

  function reset() {
    setSelectedBank(null);
    setNewAccount(null);
    setError("");
    setStep("select");
  }

  const currencyFormat = (
    amount: number,
    currency: string
  ) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  return (
    <main className="min-h-screen bg-[#F8F7FC] text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              step === "select"
                ? router.push("/wallets")
                : reset()
            }
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-700"
          >
            <ArrowLeft size={18} />
            {step === "select" ? "Back to Wallets" : "Back"}
          </button>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            DEMO MODE
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
            <Landmark
              size={30}
              className="text-purple-700"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Connect Your Bank
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Link a bank account to view it alongside your
            Kimance wallets.
          </p>
        </div>

        {/* Demo information */}
        <div className="mb-7 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Bank connection demonstration
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              This feature currently uses simulated bank
              accounts. No real bank is connected and no
              money is transferred.
            </p>
          </div>
        </div>

        {step === "select" && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5">
                <h2 className="text-lg font-bold">
                  Select your bank
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Search for a financial institution to
                  begin connecting.
                </p>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search for your bank..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Country filters */}
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Banks" },
                  { id: "US", label: "United States" },
                  { id: "CA", label: "Canada" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setCountry(item.id as Country)
                    }
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      country === item.id
                        ? "bg-purple-700 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Bank list */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredBanks.map((bank) => {
                  const connected =
                    isAlreadyConnected(bank.id);

                  return (
                    <button
                      type="button"
                      key={bank.id}
                      onClick={() => selectBank(bank)}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-400 hover:bg-purple-50"
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{
                          backgroundColor: bank.color,
                        }}
                      >
                        {bank.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {bank.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {bank.country === "US"
                            ? "United States"
                            : "Canada"}
                        </p>

                        {connected && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-green-700">
                            <Check size={12} />
                            Demo connected
                          </p>
                        )}
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-gray-400"
                      />
                    </button>
                  );
                })}
              </div>

              {filteredBanks.length === 0 && (
                <div className="py-12 text-center">
                  <Building2
                    size={32}
                    className="mx-auto text-gray-300"
                  />
                  <p className="mt-3 text-sm text-gray-500">
                    No matching banks found.
                  </p>
                </div>
              )}
            </section>

            {/* Already connected accounts */}
            {linkedAccounts.length > 0 && (
              <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold">
                    Connected Demo Accounts
                  </h2>

                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {linkedAccounts.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {linkedAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Landmark
                          size={20}
                          className="text-purple-700"
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            {account.institution}
                          </p>
                          <p className="text-xs text-gray-500">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-green-700">
                        Connected
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/wallets")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-800"
                >
                  <Wallet size={17} />
                  View My Wallets
                </button>
              </section>
            )}
          </div>
        )}

        {/* Confirm selected bank */}
        {step === "confirm" && selectedBank && (
          <section className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white"
                style={{
                  backgroundColor: selectedBank.color,
                }}
              >
                {selectedBank.initials}
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Connect {selectedBank.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Continue to create a simulated bank account
                for demonstration purposes.
              </p>
            </div>

            <div className="mt-7 space-y-4 rounded-xl bg-gray-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="text-green-600"
                />
                <p className="text-sm text-gray-700">
                  Preview account information
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="text-green-600"
                />
                <p className="text-sm text-gray-700">
                  Display the account in your wallet
                </p>
              </div>

              <div className="flex items-center gap-3">
                <LockKeyhole
                  size={19}
                  className="text-purple-600"
                />
                <p className="text-sm text-gray-700">
                  No real banking credentials required
                </p>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={startConnection}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Connect Demo Account
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={reset}
              className="mt-3 w-full rounded-xl px-5 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Choose Another Bank
            </button>
          </section>
        )}

        {/* Connecting */}
        {step === "connecting" && (
          <section className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <Loader2
              size={42}
              className="mx-auto animate-spin text-purple-700"
            />

            <h2 className="mt-6 text-xl font-bold">
              Preparing Demo Account
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Creating your simulated account...
            </p>
          </section>
        )}

        {/* Success */}
        {step === "success" && newAccount && (
          <section className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={42}
                className="text-green-600"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Demo Account Connected!
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your simulated bank account has been saved.
              You can view it in your wallet.
            </p>

            <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <CreditCard
                    size={24}
                    className="text-purple-700"
                  />
                </div>

                <div>
                  <p className="font-bold">
                    {newAccount.institution}
                  </p>
                  <p className="text-xs text-gray-500">
                    {newAccount.title} ·{" "}
                    {newAccount.accountNumber}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <p className="text-xs text-gray-500">
                  Demo Account Balance
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {currencyFormat(
                    newAccount.balance,
                    newAccount.currency
                  )}
                </p>

                <p className="mt-2 text-xs text-amber-700">
                  Simulated balance — not real funds
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/wallets")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 py-3.5 text-sm font-semibold text-white hover:bg-purple-800"
            >
              <Wallet size={18} />
              View in Wallet
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={reset}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <X size={16} />
              Connect Another Bank
            </button>
          </section>
        )}

        {/* Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
          <ShieldCheck size={15} />
          <span>
            Kimance Bank Connection · Demonstration
          </span>
        </div>
      </div>
    </main>
  );
}
