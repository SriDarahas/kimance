"use client";

import Link from "next/link";
import { Shield, TrendingUp, Building2, CreditCard, Receipt, Briefcase, ArrowRight, Star } from "lucide-react";
import { useFadeIn } from "../hooks/useFadeIn";
import { useStaggerReveal } from "../hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";

const icons = [Building2, Shield, TrendingUp, Receipt, CreditCard, Briefcase];
const badgeColors = [
  "bg-violet-100 text-violet-700",
  "",
  "bg-emerald-100 text-emerald-700",
  "",
  "",
  "",
];
const ratings = [4.5, 4.3, 4.6, 4.4, 4.7, 4.2];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-xs ${i < full ? "text-yellow-400" : i === full && half ? "text-yellow-300" : "text-gray-300"}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function Marketplace() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.1, duration: 0.7, selector: ".mp-card" });
  const { t } = useLang();

  return (
    <section id="marketplace" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-base font-semibold px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4" />
            {t.marketplace.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {t.marketplace.heading}{" "}
            <span className="text-violet-400">{t.marketplace.headingHighlight}</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">{t.marketplace.subheading}</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {t.marketplace.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="mp-card group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20">
                {item.badge && (
                  <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[i]}`}>{item.badge}</span>
                )}
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-base text-gray-400 leading-relaxed mb-4">{item.description}</p>
                <StarRating rating={ratings[i]} />
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/marketplace" className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5">
            {t.marketplace.cta}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-base text-white mt-4">{t.marketplace.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
