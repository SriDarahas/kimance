"use client";

import { useEffect, useState } from "react";

type RatesResponse = {
  result?: string;
  mode?: "demo" | "live";
  base_code?: string;
  conversion_rates?: Record<string, number>;
  error?: string;
};

type DisplayMode = "loading" | "demo" | "live" | "error";

const CURRENCY_INFO: {
  code: string;
  name: string;
  flag: string;
  region: string;
}[] = [
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", region: "North America" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", region: "Europe" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", region: "Europe" },
  { code: "CDF", name: "Congolese Franc", flag: "🇨🇩", region: "Africa" },
  { code: "XAF", name: "CFA Franc (CEMAC)", flag: "🇨🇲", region: "Africa" },
  { code: "XOF", name: "CFA Franc (UEMOA)", flag: "🇨🇮", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", region: "Africa" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", region: "Africa" },
  { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼", region: "Africa" },
  { code: "BIF", name: "Burundian Franc", flag: "🇧🇮", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", region: "Africa" },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬", region: "Africa" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", region: "Africa" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭", region: "Africa" },
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹", region: "Africa" },
  { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦", region: "Africa" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬", region: "Africa" },
  { code: "MZN", name: "Mozambican Metical", flag: "🇲🇿", region: "Africa" },
  { code: "AOA", name: "Angolan Kwanza", flag: "🇦🇴", region: "Africa" },
];

function formatRate(rate: number): string {
  if (!Number.isFinite(rate)) return "—";

  const digits = rate > 100
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 4 };

  return rate.toLocaleString("en-US", digits);
}

export default function CurrencyDashboard() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<DisplayMode>("loading");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let active = true;

    async function loadRates() {
      try {
        const response = await fetch(
          "/api/exchange-rate?from=USD",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }

        const data = (await response.json()) as RatesResponse;

        if (
          data.result !== "success" ||
          !data.conversion_rates
        ) {
          throw new Error(
            data.error || "Invalid exchange rate response"
          );
        }

        if (!active) return;

        setRates(data.conversion_rates);
        setMode(data.mode === "live" ? "live" : "demo");
      } catch (error) {
        console.error("Exchange rate error:", error);

        if (!active) return;

        setRates({});
        setMode("error");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRates();

    const interval = setInterval(
      loadRates,
      5 * 60 * 1000
    );

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = CURRENCY_INFO.filter((currency) => {
    if (filter === "all") return true;
    return currency.region === filter;
  });

  const statusText =
    mode === "live"
      ? "LIVE"
      : mode === "demo"
      ? "DEMO"
      : mode === "error"
      ? "UNAVAILABLE"
      : "LOADING";

  const statusColor =
    mode === "live"
      ? "bg-green-400"
      : mode === "demo"
      ? "bg-amber-400"
      : mode === "error"
      ? "bg-red-400"
      : "bg-gray-300";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-64 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-icons-outlined text-purple-600">
            currency_exchange
          </span>

          <h3 className="font-serif text-xl font-bold text-gray-900">
            Today&apos;s Rates
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${statusColor} ${
              mode === "live" ? "animate-pulse" : ""
            }`}
          />

          <span className="text-xs text-gray-400 font-medium">
            {statusText}
          </span>
        </div>
      </div>

      {/* Region Filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All" },
          { id: "Africa", label: "Africa" },
          { id: "Europe", label: "Europe" },
          { id: "North America", label: "Americas" },
        ].map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === item.id
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Horizontal Currency Cards */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "thin" }}
      >
        {loading ? (
          <p className="text-xs text-gray-400 py-4 w-full text-center">
            Loading rates…
          </p>
        ) : (
          filtered.map((currency) => {
            const rate = rates[currency.code];

            const hasRate =
              typeof rate === "number" &&
              Number.isFinite(rate);

            return (
              <div
                key={currency.code}
                className="shrink-0 w-30 flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <span className="text-2xl">
                  {currency.flag}
                </span>

                <span className="text-sm font-bold text-gray-900">
                  {currency.code}
                </span>

                <span className="text-[10px] text-gray-400 leading-tight text-center truncate w-full">
                  {currency.name}
                </span>

                <span className="text-sm font-bold text-purple-700 mt-1">
                  {hasRate ? formatRate(rate) : "—"}
                </span>

                <span className="text-[10px] text-gray-400">
                  per USD
                </span>
              </div>
            );
          })
        )}
      </div>

      {mode === "demo" && (
        <p className="text-[10px] text-amber-600 mt-1">
          Demo rates for demonstration only.
        </p>
      )}

      {mode === "error" && (
        <p className="text-[10px] text-red-500 mt-1">
          Exchange rates are temporarily unavailable.
        </p>
      )}
    </div>
  );
}
