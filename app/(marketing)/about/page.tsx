"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  Globe, Wallet, ArrowLeftRight, Store, CreditCard, Zap, Target, Eye, CheckCircle2,
  TrendingUp, Receipt,
} from "lucide-react";
import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";

const featureIcons = [CreditCard, Store, Receipt, TrendingUp, Wallet, ArrowLeftRight];

// ─── Sections ─────────────────────────────────────────────────────────────────

function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useFadeIn({ delay: 0.8, duration: 1, y: 30 });
  const ctaRef = useFadeIn({ delay: 1.2, duration: 1, y: 20 });
  const { t } = useLang();
  const a = t.about.hero;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll(".word");
      if (words && words.length > 0) {
        gsap.fromTo(words, { opacity: 0, y: 50, rotateX: -20 }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 1, ease: "power3.out" });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white px-4 min-h-[70vh]">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30" style={{ backgroundImage: `url('/banner.png')` }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-800/90" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full py-20">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
          <Zap className="w-4 h-4" />{a.badge}
        </div>
        <h1 ref={headlineRef} className="font-bold leading-tight tracking-tight perspective-1000 text-4xl md:text-6xl lg:text-7xl mb-6">
          {a.heading1.split(" ").map((word, i) => (
            <span key={i} className="word inline-block mr-3 will-change-transform">{word}</span>
          ))}
          <br />
          <span className="text-violet-400">
            {a.heading2.split(" ").map((word, i) => (
              <span key={i} className="word inline-block will-change-transform">{word}</span>
            ))}
          </span>
        </h1>
        <div ref={subRef as React.RefObject<HTMLDivElement>}>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">{a.subheading}</p>
        </div>
        <div ref={ctaRef as React.RefObject<HTMLDivElement>} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="group px-8 py-4 bg-violet-500 text-white font-semibold rounded-full hover:bg-violet-400 hover:shadow-[0_0_30px_rgba(109,40,217,0.4)] hover:scale-105 transition-all active:scale-95">
            {a.cta}
          </Link>
          <a href="#mission" onClick={(e) => { e.preventDefault(); document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" }); }} className="px-8 py-4 border border-white/30 hover:border-white text-white font-medium rounded-full transition-all hover:bg-white/10 backdrop-blur-sm cursor-pointer">
            {a.learnMore}
          </a>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-gradient-to-r from-violet-600 to-violet-700 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {t.about.stats.map((stat, i) => (
            <div key={i} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-violet-200 text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MissionVision() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const missionRef = useFadeIn({ delay: 0.1, y: 40, start: "top 80%" });
  const visionRef = useFadeIn({ delay: 0.25, y: 40, start: "top 80%" });
  const { t } = useLang();
  const m = t.about.mission;

  return (
    <section id="mission" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Target className="w-4 h-4" />{m.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {m.heading} <span className="text-violet-600">{m.headingHighlight}</span>
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">{m.subheading}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div ref={missionRef as React.RefObject<HTMLDivElement>} className="group relative bg-gradient-to-br from-violet-600 to-violet-800 rounded-3xl p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6"><Target className="w-7 h-7 text-white" /></div>
              <h3 className="text-3xl font-bold mb-4">{m.missionTitle}</h3>
              <p className="text-violet-100 text-lg leading-relaxed mb-6">{m.missionP1}</p>
              <p className="text-violet-200 text-base leading-relaxed">{m.missionP2}</p>
            </div>
          </div>
          <div ref={visionRef as React.RefObject<HTMLDivElement>} className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full translate-y-1/3 -translate-x-1/3" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-violet-500/30 rounded-2xl flex items-center justify-center mb-6"><Eye className="w-7 h-7 text-violet-300" /></div>
              <h3 className="text-3xl font-bold mb-4">{m.visionTitle}</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">{m.visionP1}</p>
              <p className="text-gray-400 text-base leading-relaxed">{m.visionP2}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyKimance() {
  const textRef = useFadeIn({ delay: 0.2, y: 30, start: "top 80%" });
  const listRef = useStaggerReveal({ stagger: 0.1, duration: 0.6, selector: ".why-item" });
  const { t } = useLang();
  const w = t.about.why;

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef as React.RefObject<HTMLDivElement>}>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-4 h-4" />{w.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {w.heading} <span className="text-violet-400">{w.headingHighlight}</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{w.p1}</p>
            <p className="text-gray-300 text-lg leading-relaxed">{w.p2}</p>
          </div>
          <div ref={listRef} className="space-y-4">
            {w.items.map((item, i) => (
              <div key={i} className="why-item flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 group">
                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-violet-500/40 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-gray-200 text-base font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformFeatures() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.12, duration: 0.7, selector: ".feat-card" });
  const { t } = useLang();
  const pf = t.about.platformFeatures;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Globe className="w-4 h-4" />{pf.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {pf.heading} <span className="text-violet-600">{pf.headingHighlight}</span>
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">{pf.subheading}</p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pf.items.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <div key={i} className="feat-card group bg-violet-600 rounded-2xl p-8 border border-violet-500 hover:border-violet-400 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/30 hover:scale-[1.02] hover:bg-violet-500">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-violet-100 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GlobalImpact() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useStaggerReveal({ stagger: 0.1, duration: 0.6, selector: ".impact-item" });
  const { t } = useLang();
  const imp = t.about.impact;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-400 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Globe className="w-4 h-4" />{imp.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {imp.heading} <span className="text-violet-400">{imp.headingHighlight}</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{imp.p1}</p>
            <p className="text-gray-400 text-lg leading-relaxed">{imp.p2}</p>
          </div>
          <div ref={listRef} className="space-y-3">
            {imp.items.map((item, i) => (
              <div key={i} className="impact-item flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-300 group">
                <div className="w-8 h-8 bg-violet-500/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-gray-200 text-base font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLang();
  const c = t.about.cta;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-400 rounded-full blur-[100px]" />
      </div>
      <div className={`max-w-3xl mx-auto px-4 text-center text-white relative z-10 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{c.heading}</h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">{c.subheading}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="inline-block bg-violet-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-violet-400 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">{c.cta}</Link>
          <Link href="/contact" className="inline-block border border-white/30 hover:border-white text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-all duration-300">{c.secondary}</Link>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  useLayoutEffect(() => { gsap.registerPlugin(ScrollTrigger); }, []);

  return (
    <div className="flex flex-col">
      <AboutHero />
      <StatsBar />
      <MissionVision />
      <WhyKimance />
      <PlatformFeatures />
      <GlobalImpact />
      <AboutCTA />
    </div>
  );
}
