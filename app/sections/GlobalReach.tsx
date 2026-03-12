"use client";

import dynamic from "next/dynamic";
import { useLang } from "@/app/providers/LanguageContext";

const Globe = dynamic(() => import("../components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center bg-gray-900 text-gray-500">
      <div className="animate-pulse">Loading Globe...</div>
    </div>
  ),
});

export default function GlobalReach() {
  const { t } = useLang();

  return (
    <section className="w-full py-20 bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{t.globalReach.heading}</h2>
          <p className="text-white text-xl max-w-2xl mx-auto">{t.globalReach.subheading}</p>
        </div>
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="w-full flex justify-center items-center overflow-hidden">
            <Globe />
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-gray-800 pt-8">
            {t.globalReach.stats.map((stat, i) => (
              <div key={i} className={`p-4 ${i > 0 ? "border-l-0 md:border-l border-gray-800" : ""}`}>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-base uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
