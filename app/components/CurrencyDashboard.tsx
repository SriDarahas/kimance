"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

type Rate = { code: string; value: number };
type RatesResponse = { data?: Record<string, Rate>; error?: string };

const CURRENCY_INFO: { code: string; name: string; flag: string; region: string }[] = [
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

const ALL_CODES = CURRENCY_INFO.map((c) => c.code);

export default function CurrencyDashboard() {
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);
  const [rates, setRates] = useState<Record<string, Rate> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function loadRates() {
    try {
      const res = await fetch(`/api/currency?base=USD&symbols=${ALL_CODES.join(",")}`);
      const json = (await res.json()) as RatesResponse;
      if (res.ok && json.data) setRates(json.data);
    } catch {
      /* silent — we still show cards without rates */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRates();
    const id = setInterval(loadRates, 5 * 60 * 1000); // poll every 5 min to match server cache TTL
    return () => clearInterval(id);
  }, []);

  const filtered = CURRENCY_INFO.filter((c) => {
    if (filter === "all") return true;
    return c.region === filter;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-64 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-icons-outlined text-purple-600">currency_exchange</span>
          <h3 className="font-serif text-xl font-bold text-gray-900">
            Today&apos;s Rates
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-400 font-medium">LIVE</span>
        </div>
      </div>

      {/* Region Filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All" },
          { id: "Africa", label: "Africa" },
          { id: "Europe", label: "Europe" },
          { id: "North America", label: "Americas" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f.id
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Horizontal scrollable currency cards */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {loading ? (
          <p className="text-xs text-gray-400 py-4 w-full text-center">Loading rates…</p>
        ) : (
          filtered.map((curr) => {
            const rate = rates?.[curr.code];
            return (
              <div
                key={curr.code}
                className="shrink-0 w-30 flex flex-col items-center gap-1 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <span className="text-2xl">{curr.flag}</span>
                <span className="text-sm font-bold text-gray-900">{curr.code}</span>
                <span className="text-[10px] text-gray-400 leading-tight text-center truncate w-full">{curr.name}</span>
                <span className="text-sm font-bold text-purple-700 mt-1">
                  {rate
                    ? rate.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: rate.value > 100 ? 0 : 4,
                      })
                    : "—"}
                </span>
                <span className="text-[10px] text-gray-400">per USD</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
