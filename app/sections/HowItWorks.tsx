"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserPlus, Link as LinkIcon, ArrowRightLeft, TrendingUp } from "lucide-react";
import { useLang } from "@/app/providers/LanguageContext";

const icons = [UserPlus, LinkIcon, ArrowRightLeft, TrendingUp];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLang();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.howItWorks.heading}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.howItWorks.subheading}</p>
        </div>
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
          <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-gray-300 -z-10 transform -translate-y-1/2 max-w-[85%] mx-auto right-0" />
          {t.howItWorks.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                ref={(el) => { stepsRef.current[index] = el; }}
                className="step-item flex-1 flex flex-col items-center text-center relative w-full md:w-auto"
              >
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 text-white text-xl font-bold mb-6 shadow-lg z-10 ring-4 ring-white">
                  {index + 1}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                    <Icon className="w-6 h-6 text-violet-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                {index !== t.howItWorks.steps.length - 1 && (
                  <div className="md:hidden absolute top-16 bottom-0 left-1/2 w-px bg-gray-300 -translate-x-1/2 h-12 -mb-8" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
