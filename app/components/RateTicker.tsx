"use client";

import { useState, useEffect } from "react";

interface Rates {
  [key: string]: number;
}

const DISPLAY_PAIRS = [
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  { from: "USD", to: "NGN" },
  { from: "USD", to: "KES" },
  { from: "USD", to: "GHS" },
];

export default function RateTicker() {
  const [rates, setRates] = useState<Rates | null>(null);

  useEffect(() => {
    fetch("/api/exchange-rate?from=USD")
      .then((res) => res.json())
      .then((data) => {
        if (data.result === "success") {
          setRates(data.conversion_rates);
        }
      })
      .catch(() => {
        // Silently fail — ticker won't render
      });
  }, []);

  if (!rates) return null;

  const items = DISPLAY_PAIRS.map((pair) => {
    const rate = rates[pair.to];
    if (!rate) return null;
    const decimals =
      pair.to === "NGN" || pair.to === "KES" || pair.to === "GHS" ? 2 : 4;
    return `${pair.from}/${pair.to} ${rate.toFixed(decimals)}`;
  }).filter(Boolean) as string[];

  if (items.length === 0) return null;

  // Triple the items for a seamless infinite loop
  const tickerContent = [...items, ...items, ...items];

  return (
    <div className="w-full bg-slate-900 border-y border-slate-700/50 py-3 overflow-hidden">
      <div className="animate-ticker flex whitespace-nowrap">
        {tickerContent.map((item, i) => (
          <span key={i} className="mx-8 text-sm font-medium text-gray-300">
            <span className="text-violet-400 mr-1">●</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
