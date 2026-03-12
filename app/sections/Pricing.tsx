"use client";

import Link from "next/link";
import { useFadeIn } from "../hooks/useFadeIn";
import { useStaggerReveal } from "../hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";

export default function Pricing() {
  const headerRef = useFadeIn({ delay: 0.2, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.15, y: 40 });
  const { t } = useLang();

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{t.pricing.heading}</h2>
          <p className="text-xl text-gray-600 leading-relaxed">{t.pricing.subheading}</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {t.pricing.items.map((fee, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 border border-transparent hover:border-violet-100 text-center">
              <div className="text-3xl md:text-4xl font-bold text-violet-600 mb-3 group-hover:scale-105 transition-transform duration-300">{fee.value}</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">{fee.label}</div>
              <div className="text-base text-gray-500 leading-relaxed">{fee.description}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-violet-500 rounded-full hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
            {t.pricing.cta}
          </Link>
          <p className="mt-4 text-base text-gray-500">{t.pricing.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
