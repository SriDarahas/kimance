"use client";

import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";
import { Brain, Shield, Activity, Cloud, Cpu } from "lucide-react";

const techIcons = [Brain, Shield, Activity, Cloud, Cpu];

function TechnologySection() {
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const gridRef = useStaggerReveal({ stagger: 0.12, duration: 0.7, selector: ".tech-item" });
  const { t } = useLang();
  const tech = t.about.technology;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-violet-50/40 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Cpu className="w-4 h-4" />{tech.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            {tech.heading} <span className="text-violet-600">{tech.headingHighlight}</span>
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">{tech.subheading}</p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tech.items.map((item, i) => {
            const Icon = techIcons[i];
            return (
              <div key={i} className="tech-item flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all duration-300">
                <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-violet-200">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-gray-500 mt-10 max-w-2xl mx-auto text-base leading-relaxed">{tech.footer}</p>
      </div>
    </section>
  );
}

export default function TechnologyPage() {
  return <TechnologySection />;
}
