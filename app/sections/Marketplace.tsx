"use client";

import Link from "next/link";
import { Shield, TrendingUp, Building2, CreditCard, Receipt, Briefcase, ArrowRight, Star } from "lucide-react";
import { useFadeIn } from "../hooks/useFadeIn";
import { useStaggerReveal } from "../hooks/useStaggerReveal";

const offerings = [
  {
    icon: Building2,
    title: "Business Loans",
    description: "Flexible working capital for growing SMEs — fast approvals, minimal paperwork.",
    badge: "Popular",
    badgeColor: "bg-violet-100 text-violet-700",
    rating: 4.5,
  },
  {
    icon: Shield,
    title: "Insurance",
    description: "Travel, health, and business insurance from top-rated global providers.",
    badge: null,
    badgeColor: "",
    rating: 4.3,
  },
  {
    icon: TrendingUp,
    title: "Crypto & Investments",
    description: "Buy, sell, and hold crypto. Access investment products tailored to your goals.",
    badge: "New",
    badgeColor: "bg-emerald-100 text-emerald-700",
    rating: 4.6,
  },
  {
    icon: Receipt,
    title: "Tax Services",
    description: "Expert tax filing and advisory from certified professionals across 50+ countries.",
    badge: null,
    badgeColor: "",
    rating: 4.4,
  },
  {
    icon: CreditCard,
    title: "Payments & Cards",
    description: "Virtual and physical cards, NFC payments, and seamless merchant integrations.",
    badge: null,
    badgeColor: "",
    rating: 4.7,
  },
  {
    icon: Briefcase,
    title: "Business Tools",
    description: "Invoicing, payroll, expense tracking, and accounting integrations for teams.",
    badge: null,
    badgeColor: "",
    rating: 4.2,
  },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-xs ${
            i < full
              ? "text-yellow-400"
              : i === full && half
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function Marketplace() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.1, duration: 0.7, selector: ".mp-card" });

  return (
    <section id="marketplace" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-base font-semibold px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4" />
            Financial Marketplace
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Every financial service,{" "}
            <span className="text-violet-400">one platform</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Access a curated marketplace of insurance, loans, crypto, tax services, and business tools — all vetted, trusted, and integrated directly into your Kimance account.
          </p>
        </div>

        {/* Offerings Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {offerings.map((item, i) => (
            <div
              key={i}
              className="mp-card group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20"
            >
              {/* Badge */}
              {item.badge && (
                <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}

              {/* Icon */}
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                <item.icon className="w-6 h-6 text-violet-400" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-base text-gray-400 leading-relaxed mb-4">{item.description}</p>
              <StarRating rating={item.rating} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5"
          >
            Explore the Marketplace
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-base text-gray-500 mt-4">Sign up to unlock all services — free account, no card required.</p>
        </div>
      </div>
    </section>
  );
}
