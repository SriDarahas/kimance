"use client";

import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";
import { Shield, Lock, Fingerprint, Activity, BadgeCheck } from "lucide-react";

const trustIcons = [Shield, Lock, Fingerprint, Activity];

function TrustSecuritySection() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.12, duration: 0.7, selector: ".trust-item" });
  const { t } = useLang();
  const ts = t.about.trustSecurity;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-violet-50/40 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Shield className="w-4 h-4" />{ts.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {ts.heading} <span className="text-violet-600">{ts.headingHighlight}</span>
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">{ts.subheading}</p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ts.items.map((item, i) => {
            const Icon = trustIcons[i];
            return (
              <div key={i} className="trust-item flex items-start gap-5 bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all duration-300">
                <div className="w-14 h-14 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-200">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-sm border border-gray-100">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-600"><BadgeCheck className="w-5 h-5 text-violet-500" />{ts.badge1}</span>
            <div className="w-px h-5 bg-gray-200" />
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-600"><BadgeCheck className="w-5 h-5 text-violet-500" />{ts.badge2}</span>
            <div className="w-px h-5 bg-gray-200" />
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-600"><BadgeCheck className="w-5 h-5 text-violet-500" />{ts.badge3}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TrustSecurityPage() {
  return <TrustSecuritySection />;
}
