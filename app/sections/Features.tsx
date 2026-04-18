"use client";

import { Globe, Wallet, ArrowLeftRight, CreditCard, Brain, Store } from "lucide-react";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";

const icons = [Globe, Wallet, ArrowLeftRight, CreditCard, Brain, Store];

export default function Features() {
  const containerRef = useStaggerReveal({ stagger: 0.15, duration: 0.8, selector: ".feature-card" });
  const { t } = useLang();

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">{t.features.heading}</h2>
          <p className="text-xl text-gray-600">{t.features.subheading}</p>
        </div>
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.features.items.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="feature-card group bg-violet-600 rounded-2xl p-8 border border-violet-500 hover:border-violet-400 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/30 hover:scale-[1.02] hover:bg-violet-500">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-lg text-violet-100 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
