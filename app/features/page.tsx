"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: "payments",
    title: "Kimance Pay",
    description:
      "Send and receive money instantly across borders with zero hassle. Fast, secure peer-to-peer payments powered by modern infrastructure.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: "storefront",
    title: "Marketplace",
    description:
      "Buy and sell goods & services within the Kimance ecosystem. List items, browse deals, and transact safely with built-in buyer protection.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: "gavel",
    title: "Tax Expert Finder",
    description:
      "Connect with verified tax professionals worldwide. Get personalized advice for cross-border taxation, compliance, and financial planning.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: "currency_bitcoin",
    title: "Crypto",
    description:
      "Track and manage your cryptocurrency portfolio alongside traditional currencies. Real-time prices, watchlists, and market insights all in one place.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: "account_balance_wallet",
    title: "Multi-Currency Wallets",
    description:
      "Hold, convert, and manage balances in multiple currencies. From USD to EUR, GBP, CAD, and beyond — all from a single unified dashboard.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: "currency_exchange",
    title: "Live Exchange Rates",
    description:
      "Access real-time foreign exchange rates powered by global market data. Convert between 150+ currencies instantly with competitive rates.",
    color: "bg-cyan-100 text-cyan-600",
  },
];

export default function FeaturesPage() {
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 font-[family-name:var(--font-playfair)]">
            Explore Our Features
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
            Powerful tools designed to make global finance simple, secure, and accessible.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#6D28D9]/20 transition-all"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${feature.color}`}>
                <span className="material-icons-outlined text-2xl">{feature.icon}</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-gray-900 text-lg font-bold">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-12 px-10 rounded-full bg-[#6D28D9] hover:bg-[#5A24B3] text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-[#6D28D9]/30"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
