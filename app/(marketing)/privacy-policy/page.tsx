"use client";

import { Shield, Lock, Eye, Database, Globe, UserCheck, Bell, Cookie, Baby, Server, RefreshCw, Mail } from "lucide-react";
import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";
import type { LucideIcon } from "lucide-react";

// Icon map — keyed by section id so icons stay in the component, text comes from translations
const iconMap: Record<string, LucideIcon> = {
  about: Shield,
  collect: Database,
  use: Eye,
  share: Globe,
  security: Lock,
  retention: Database,
  international: Globe,
  rights: UserCheck,
  cookies: Cookie,
  children: Baby,
  "third-party": Server,
  architecture: Server,
  updates: RefreshCw,
  contact: Mail,
};

export default function PrivacyPolicyPage() {
  const { t } = useLang();
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const sectionsRef = useStaggerReveal({ stagger: 0.08, duration: 0.6, selector: ".policy-section" });

  const sections = t.privacy.sections;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div ref={headerRef} className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            {t.privacy.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t.privacy.heading}</h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            {t.privacy.subheading}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>
              {t.privacy.effectiveDate.includes("Effective") || !t.privacy.effectiveDate.startsWith("1")
                ? "Effective Date: "
                : "Date d'entrée en vigueur : "}
              <span className="text-gray-300 font-medium">{t.privacy.effectiveDate}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>
              {t.privacy.lastUpdated.startsWith("April") ? "Last Updated: " : "Dernière mise à jour : "}
              <span className="text-gray-300 font-medium">{t.privacy.lastUpdated}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Acceptance notice */}
      <div className="bg-violet-50 border-b border-violet-100">
        <div className="max-w-3xl mx-auto px-4 py-4 text-sm text-violet-700 text-center">
          {t.privacy.notice}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div ref={sectionsRef} className="space-y-8">
          {sections.map((section, i) => {
            const Icon = iconMap[section.id] ?? Shield;
            return (
              <div
                key={section.id}
                id={section.id}
                className="policy-section bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300"
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-violet-200">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-violet-400 block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                </div>

                {/* Plain paragraphs */}
                {"content" in section && section.content && (
                  <div className="space-y-3 mb-4">
                    {(section.content as string[]).map((p, j) => (
                      <p key={j} className="text-gray-600 leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}

                {/* Simple items list */}
                {"items" in section && section.items && (
                  <ul className="space-y-2 mb-4">
                    {(section.items as string[]).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Subsections */}
                {"subsections" in section && section.subsections && (
                  <div className="space-y-5">
                    {(section.subsections as Array<{ title: string; items: string[]; note?: string }>).map((sub, j) => (
                      <div key={j} className="bg-gray-50 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">{sub.title}</h3>
                        <ul className="space-y-1.5 mb-2">
                          {sub.items.map((item, k) => (
                            <li key={k} className="flex items-start gap-2 text-gray-600 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {sub.note && (
                          <p className="text-xs text-violet-600 font-medium mt-2">{sub.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Groups */}
                {"groups" in section && section.groups && (
                  <div className="space-y-4">
                    {(section.groups as Array<{ title: string; items: string[]; note?: string }>).map((group, j) => (
                      <div key={j} className="bg-gray-50 rounded-xl p-5">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">{group.title}</h3>
                        <ul className="space-y-1.5">
                          {group.items.map((item, k) => (
                            <li key={k} className="flex items-start gap-2 text-gray-600 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        {group.note && (
                          <p className="text-xs text-violet-600 font-medium mt-2">{group.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Contact */}
                {"contact" in section && section.contact && (
                  <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl px-5 py-4 text-sm text-violet-700 whitespace-pre-line">
                    {section.contact as string}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-400 mt-12">
          {t.privacy.footer}
        </p>
      </div>
    </div>
  );
}
