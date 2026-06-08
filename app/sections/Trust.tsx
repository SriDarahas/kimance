"use client";

import { Shield, KeyRound, Fingerprint, Activity } from "lucide-react";
import { useFadeIn } from "../hooks/useFadeIn";
import { useLang } from "@/app/providers/LanguageContext";

const icons = [Shield, KeyRound, Fingerprint, Activity];

export default function Trust() {
  const sectionRef = useFadeIn({ y: 30, duration: 0.8, start: "top 75%" });
  const { t } = useLang();

  return (
    <section id="trust" className="py-20 bg-gradient-to-br from-slate-50 via-violet-50/40 to-white">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t.trust.heading}</h2>
          <p className="text-black mt-4 max-w-2xl mx-auto text-xl leading-relaxed">{t.trust.subheading}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {t.trust.items.map((feature, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="flex items-start gap-4">
                <div className="w-14 h-14 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-200">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-lg mt-1 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12 text-base text-gray-500 font-medium">{t.trust.badge}</div>
      </div>
    </section>
  );
}
