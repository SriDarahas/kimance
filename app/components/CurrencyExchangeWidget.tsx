"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRightLeft, ChevronDown, TrendingUp } from "lucide-react";
import { createPortal } from "react-dom";

const CURRENCIES = [
  { code: "USD", name: "US Dollar",         countryCode: "us" },
  { code: "EUR", name: "Euro",              countryCode: "eu" },
  { code: "GBP", name: "British Pound",     countryCode: "gb" },
  { code: "CAD", name: "Canadian Dollar",    countryCode: "ca" },
  { code: "AUD", name: "Australian Dollar", countryCode: "au" },
  { code: "NGN", name: "Nigerian Naira",   countryCode: "ng" },
  { code: "KES", name: "Kenyan Shilling",  countryCode: "ke" },
  { code: "GHS", name: "Ghanaian Cedi",    countryCode: "gh" },
  { code: "ZAR", name: "South African Rand", countryCode: "za" },
  { code: "INR", name: "Indian Rupee",     countryCode: "in" },
  { code: "MXN", name: "Mexican Peso",     countryCode: "mx" },
  { code: "PKR", name: "Pakistani Rupee",  countryCode: "pk" },
  { code: "BDT", name: "Bangladeshi Taka", countryCode: "bd" },
  { code: "PHP", name: "Philippine Peso",  countryCode: "ph" },
  { code: "JPY", name: "Japanese Yen",      countryCode: "jp" },
  { code: "CNY", name: "Chinese Yuan",      countryCode: "cn" },
  { code: "AED", name: "UAE Dirham",        countryCode: "ae" },
];

// SVG Flag component using flagcdn.com
function Flag({ code, size = 24 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`
        https://flagcdn.com/w40/${code.toLowerCase()}.png 1x,
        https://flagcdn.com/w80/${code.toLowerCase()}.png 2x
      `}
      alt=""
      width={size}
      height={(size * 3) / 4}
      className="object-cover rounded-sm"
      loading="lazy"
    />
  );
}

interface CurrencyExchangeWidgetProps {
  /** Compact mode for dashboard use — hides the section heading & tagline */
  compact?: boolean;
  className?: string;
}

interface RateCache {
  [key: string]: { rates: Record<string, number>; ts: number };
}

const rateCache: RateCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 min

// Renders via portal so it escapes any overflow-hidden ancestor
function CurrencySelect({
  value,
  onChange,
  exclude,
}: {
  value: string;
  onChange: (v: string) => void;
  exclude?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const btnRef      = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const current = CURRENCIES.find((c) => c.code === value)!;

  const openDropdown = () => {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen(true);
  };

  // Close only when clicking outside BOTH the button AND the dropdown
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const insideBtn      = btnRef.current?.contains(e.target as Node);
      const insideDropdown = dropdownRef.current?.contains(e.target as Node);
      if (!insideBtn && !insideDropdown) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reposition on page scroll/resize — but IGNORE scroll events that originate
  // inside the dropdown itself (otherwise scrolling the list causes jitter)
  useEffect(() => {
    if (!open) return;
    const update = (e: Event) => {
      if (dropdownRef.current?.contains(e.target as Node)) return;
      if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const dropdown =
    open && rect
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: rect.bottom + 4,
              left: rect.left,
              width: 224,
              zIndex: 9999,
            }}
            className="rounded-xl border border-gray-100 bg-white shadow-2xl overflow-hidden"
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="max-h-60 overflow-y-auto overscroll-contain">
              {CURRENCIES.filter((c) => c.code !== exclude).map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(c.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-violet-50 transition-colors ${
                    c.code === value
                      ? "bg-violet-50 text-violet-700 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  <Flag code={c.countryCode} size={24} />
                  <span className="font-medium">{c.code}</span>
                  <span className="text-gray-400 text-xs ml-auto">{c.name}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={openDropdown}
        className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-violet-400 transition-colors shadow-sm min-w-[120px]"
      >
        <Flag code={current.countryCode} size={24} />
        <span>{current.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {dropdown}
    </div>
  );
}

export default function CurrencyExchangeWidget({ compact = false, className = "" }: CurrencyExchangeWidgetProps) {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency]     = useState("NGN");
  const [sendAmount, setSendAmount]     = useState("100");
  const [rate, setRate]                 = useState<number | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const fetchRate = useCallback(async (from: string, to: string) => {
    const key = from;
    const cached = rateCache[key];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      const r = cached.rates[to];
      setRate(r !== undefined ? r : null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/exchange-rate?from=${from}`);
      if (!res.ok) throw new Error("bad response");
      const data: { result: string; conversion_rates: Record<string, number> } =
        await res.json();
      if (data.result !== "success") throw new Error("api error");
      rateCache[key] = { rates: data.conversion_rates, ts: Date.now() };
      const r = data.conversion_rates[to];
      setRate(r !== undefined ? r : null);
    } catch {
      setError("Couldn't load rate. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency, fetchRate]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const numericSend = parseFloat(sendAmount) || 0;
  const receiveAmount = rate !== null ? (numericSend * rate).toFixed(2) : null;

  const fromMeta = CURRENCIES.find((c) => c.code === fromCurrency)!;
  const toMeta   = CURRENCIES.find((c) => c.code === toCurrency)!;

  return (
    <div className={`${className}`}>
      {!compact && (
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            Live Exchange Rates
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-display">
            See how far your money goes
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Real-time rates. No hidden fees. Just honest, transparent transfers.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
        {/* Rate banner */}
        <div className="bg-violet-600 px-6 py-3 flex items-center justify-between rounded-t-2xl">
          <span className="text-violet-200 text-sm font-medium">Today&apos;s rate</span>
          <span className="text-white text-sm font-bold tracking-wide">
            {loading
              ? "Loading..."
              : error
              ? "—"
              : rate !== null
              ? `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`
              : "—"}
          </span>
        </div>

        <div className="p-6 md:p-8">
          {/* You send row */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              You send
            </label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
              <CurrencySelect
                value={fromCurrency}
                onChange={setFromCurrency}
                exclude={toCurrency}
              />
              <input
                type="number"
                min="0"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-bold text-gray-900 outline-none text-right placeholder:text-gray-300 min-w-0"
                placeholder="0"
              />
              <Flag code={fromMeta.countryCode} size={20} />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex items-center justify-center my-4">
            <button
              type="button"
              onClick={swap}
              className="w-10 h-10 rounded-full bg-violet-50 border-2 border-white shadow-md flex items-center justify-center hover:bg-violet-100 hover:scale-110 active:scale-95 transition-all text-violet-600"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* They receive row */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              They receive
            </label>
            <div className="flex items-center gap-3 bg-violet-50 rounded-xl p-3 border border-violet-100">
              <CurrencySelect
                value={toCurrency}
                onChange={setToCurrency}
                exclude={fromCurrency}
              />
              <div className="flex-1 text-right">
                {loading ? (
                  <div className="inline-block h-7 w-28 rounded-lg bg-violet-100 animate-pulse" />
                ) : error ? (
                  <span className="text-red-400 text-sm">{error}</span>
                ) : (
                  <span className="text-2xl font-bold text-violet-700">
                    {receiveAmount ?? "—"}
                  </span>
                )}
              </div>
              <Flag code={toMeta.countryCode} size={20} />
            </div>
          </div>

          {/* Fee note + CTA */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              No hidden fees · Instant transfer
            </div>
            <a
              href="/register"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Send Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
