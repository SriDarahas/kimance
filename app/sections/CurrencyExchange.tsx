"use client";

import CurrencyExchangeWidget from "@/app/components/CurrencyExchangeWidget";

export default function CurrencyExchange() {
  return (
    <section id="exchange" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CurrencyExchangeWidget />
      </div>
    </section>
  );
}
