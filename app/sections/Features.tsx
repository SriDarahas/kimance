"use client";

import { useRef } from "react";
import { 
  Globe, 
  Wallet, 
  ArrowLeftRight, 
  CreditCard, 
  Brain, 
  Store 
} from "lucide-react";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";

const features = [
  {
    icon: Globe,
    title: "Global Money Transfers",
    description: "Send money worldwide via ACH, SEPA, SWIFT, and mobile money networks like M-Pesa."
  },
  {
    icon: Wallet,
    title: "Multi-Currency Wallets",
    description: "Hold and manage USD, EUR, GBP, CAD, and cryptocurrencies in one place."
  },
  {
    icon: ArrowLeftRight,
    title: "Real-Time FX Exchange",
    description: "Get competitive rates and exchange currencies instantly with transparent pricing."
  },
  {
    icon: CreditCard,
    title: "Kimance Pay",
    description: "Tap-to-pay with NFC, virtual cards, and seamless merchant integrations."
  },
  {
    icon: Brain,
    title: "AI Financial Coach",
    description: "Personalized insights, budgeting tips, and smart savings recommendations."
  },
  {
    icon: Store,
    title: "Financial Marketplace",
    description: "Access insurance, tax services, loans, and business tools from trusted partners."
  }
];

export default function Features() {
  const containerRef = useStaggerReveal({ 
    stagger: 0.15,
    duration: 0.8,
    selector: ".feature-card"
  });

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Everything you need to manage your wealth
          </h2>
          <p className="text-lg text-gray-600">
            One platform for all your financial needs. From global transfers to AI-powered insights.
          </p>
        </div>

        <div 
          ref={containerRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
