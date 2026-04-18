"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { useFadeIn } from "@/app/hooks/useFadeIn";
import { useStaggerReveal } from "@/app/hooks/useStaggerReveal";
import { useLang } from "@/app/providers/LanguageContext";

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`faq-item border rounded-2xl overflow-hidden transition-all duration-300 ${
        open ? "border-violet-300 shadow-md shadow-violet-100" : "border-gray-100 hover:border-violet-200"
      } bg-white`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-7 py-5 text-left gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-violet-400 w-6 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-base font-semibold text-gray-900">{faq.q}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-violet-500 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-7 pb-6 text-gray-500 leading-relaxed text-base pl-16">
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const headerRef = useFadeIn({ delay: 0.1, y: 30 });
  const listRef = useStaggerReveal({ stagger: 0.06, duration: 0.5, selector: ".faq-item" });

  const faqs = t.faq.items;

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div ref={headerRef} className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <HelpCircle className="w-4 h-4" />
            {t.faq.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {t.faq.heading}
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed mb-10">
            {t.faq.subheading}
          </p>
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.faq.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-full pl-12 pr-5 py-3.5 text-base focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        {filtered.length > 0 ? (
          <div ref={listRef} className="space-y-3">
            {filtered.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={faqs.indexOf(faq)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">{t.faq.noResults(search)}</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-violet-600 font-medium hover:underline"
            >
              {t.faq.clearSearch}
            </button>
          </div>
        )}

        {/* Still have questions */}
        <div className="mt-16 bg-gradient-to-br from-violet-600 to-violet-800 rounded-3xl p-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">{t.faq.stillHaveQuestions}</h3>
          <p className="text-violet-200 mb-6 leading-relaxed">
            {t.faq.stillHaveQuestionsDesc}
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-violet-700 font-semibold px-8 py-3 rounded-full hover:bg-violet-50 transition-colors"
          >
            {t.faq.contactSupport}
          </a>
        </div>
      </div>
    </div>
  );
}
