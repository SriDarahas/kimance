"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import CurrencyExchangeWidget from "@/app/components/CurrencyExchangeWidget";

export default function ExchangeRatePage() {
  const router = useRouter();

  return (
    <div className="font-[family-name:var(--font-inter)] bg-gray-50 text-gray-900 min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#6D28D9] transition-colors group"
          >
            <span className="material-icons-outlined text-xl group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            <span className="text-sm font-medium">Back</span>
          </button>
          <Image src="/logo-crop.png" alt="Kimance Logo" width={120} height={36} className="h-9 w-auto" />
          <div className="w-16" />
        </div>
      </header>

      {/* Widget */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <CurrencyExchangeWidget />
      </section>
    </div>
  );
}
