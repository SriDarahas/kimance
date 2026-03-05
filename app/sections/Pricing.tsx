"use client";

import Link from "next/link";
import { useFadeIn } from "../hooks/useFadeIn";
import { useStaggerReveal } from "../hooks/useStaggerReveal";

const fees = [
  {
    label: "Transfer Fees",
    value: "0.5% - 1.5%",
    description: "Based on destination and amount",
  },
  {
    label: "FX Rates",
    value: "Mid-market",
    description: "Real-time rates with minimal spread",
  },
  {
    label: "Account Setup",
    value: "Free",
    description: "No cost to create your account",
  },
  {
    label: "Monthly Fee",
    value: "$0",
    description: "No subscription required",
  },
];

export default function Pricing() {
  const headerRef = useFadeIn({ delay: 0.2, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.15, y: 40 });

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We believe in complete transparency. No hidden fees, no surprise charges.
            Just fair rates for your global transfers.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {fees.map((fee) => (
            <div
              key={fee.label}
              className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 border border-transparent hover:border-violet-100 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-violet-600 mb-3 group-hover:scale-105 transition-transform duration-300">
                {fee.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {fee.label}
              </div>
              <div className="text-base text-gray-500 leading-relaxed">
                {fee.description}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-violet-500 rounded-full hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Get Started Free
          </Link>
          <p className="mt-4 text-base text-gray-500">
            No credit card required for setup
          </p>
        </div>
      </div>
    </section>
  );
}
