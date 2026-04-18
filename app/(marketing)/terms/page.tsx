"use client";

import { Scale, UserCheck, Settings, Users, CreditCard, ArrowLeftRight, Fingerprint, FileText, Cpu, Lock, AlertTriangle, XCircle, Globe, RefreshCw, Mail } from "lucide-react";
import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";
import type { LucideIcon } from "lucide-react";

// Icon map keyed by section id
const iconMap: Record<string, LucideIcon> = {
  eligibility: UserCheck,
  account: Lock,
  services: Settings,
  responsibilities: Users,
  fees: CreditCard,
  transactions: ArrowLeftRight,
  kyc: Fingerprint,
  content: FileText,
  ip: Cpu,
  privacy: Lock,
  security: Lock,
  disclaimers: AlertTriangle,
  liability: Scale,
  termination: XCircle,
  "governing-law": Globe,
  amendments: RefreshCw,
  contact: Mail,
};

export default function TermsPage() {
  const { t } = useLang();
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const sectionsRef = useStaggerReveal({ stagger: 0.07, duration: 0.6, selector: ".terms-section" });

  const sections = t.terms.sections;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div ref={headerRef} className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Scale className="w-4 h-4" />
            {t.terms.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t.terms.heading}</h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            {t.terms.subheading}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>
              {t.terms.effectiveDate.startsWith("1") ? "Date d'entrée en vigueur : " : "Effective Date: "}
              <span className="text-gray-300 font-medium">{t.terms.effectiveDate}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>
              {t.terms.lastUpdated.startsWith("Avril") ? "Dernière mise à jour : " : "Last Updated: "}
              <span className="text-gray-300 font-medium">{t.terms.lastUpdated}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Agreement notice */}
      <div className="bg-violet-50 border-b border-violet-100">
        <div className="max-w-3xl mx-auto px-4 py-4 text-sm text-violet-700 text-center">
          {t.terms.notice}
        </div>
      </div>

      {/* TOC */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-2">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t.terms.toc}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600 transition-colors py-1"
              >
                <span className="text-violet-400 font-bold text-xs w-5">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div ref={sectionsRef} className="space-y-6">
          {sections.map((section, i) => {
            const Icon = iconMap[section.id] ?? Scale;
            return (
              <div
                key={section.id}
                id={section.id}
                className="terms-section bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300 scroll-mt-20"
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

                {/* Intro paragraph / content */}
                {"content" in section && section.content && (
                  <p className="text-gray-600 leading-relaxed mb-4">{section.content as string}</p>
                )}

                {/* Items */}
                {"items" in section && section.items && (
                  <ul className="space-y-2.5 mb-4">
                    {(section.items as string[]).map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Groups */}
                {"groups" in section && section.groups && (
                  <div className="space-y-3 mb-4">
                    {(section.groups as Array<{ title: string; description: string }>).map((g, j) => (
                      <div key={j} className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">{g.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{g.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Note */}
                {"note" in section && section.note && (
                  <div className="bg-violet-50 border border-violet-100 rounded-xl px-5 py-3 text-sm text-violet-700 mt-2">
                    {section.note as string}
                  </div>
                )}

                {/* Contact block */}
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
          {t.terms.footer}
        </p>
      </div>
    </div>
  );
}
