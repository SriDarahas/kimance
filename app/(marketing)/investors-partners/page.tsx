"use client";

import Link from "next/link";
import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";
import { Handshake, Building2, Store, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";

function InvestorsPartnersSection() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const sectorRef = useStaggerReveal({ stagger: 0.1, duration: 0.6, selector: ".sector-item" });
  const cardsRef = useStaggerReveal({ stagger: 0.15, duration: 0.7, selector: ".partner-card" });
  const { t } = useLang();
  const p = t.about.partners;

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Handshake className="w-4 h-4" />{p.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {p.heading} <span className="text-violet-400">{p.headingHighlight}</span>
          </h2>
          <p className="text-gray-400 text-xl leading-relaxed">{p.subheading}</p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Building2, title: p.card1Title, desc: p.card1Desc },
            { icon: Store, title: p.card2Title, desc: p.card2Desc },
            { icon: TrendingUp, title: p.card3Title, desc: p.card3Desc },
          ].map((card, i) => (
            <div key={i} className="partner-card bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider font-medium">{p.sectorsLabel}</p>
          <div ref={sectorRef} className="flex flex-wrap justify-center gap-3">
            {p.sectors.map((sector, i) => (
              <span key={i} className="sector-item inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />{sector}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-violet-600/20 to-violet-800/20 border border-violet-500/20 rounded-3xl p-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{p.ctaTitle}</h3>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">{p.ctaDesc}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5">
            {p.ctaBtn}<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function InvestorsPartnersPage() {
  return <InvestorsPartnersSection />;
}
