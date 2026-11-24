"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Language } from "@/lib/i18n";
import type {
  TransactionInsightResult,
  TransactionInsight,
} from "@/lib/services/transaction-insights";

type TransactionInsightsProps = {
  language: Language;
};

const toneStyles: Record<TransactionInsight["tone"], string> = {
  positive: "bg-green-50 text-green-700 border-green-100",
  neutral: "bg-white text-gray-700 border-gray-100",
  attention: "bg-amber-50 text-amber-800 border-amber-100",
};

async function fetchInsights(language: Language) {
  const response = await fetch(`/api/insights?language=${language}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Insight request failed");
  return (await response.json()) as TransactionInsightResult;
}

export default function TransactionInsights({
  language,
}: TransactionInsightsProps) {
  const [result, setResult] = useState<TransactionInsightResult | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFrench = language === "fr";

  async function loadInsights() {
    setLoading(true);
    try {
      setResult(await fetchInsights(language));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    void fetchInsights(language)
      .then((nextResult) => {
        if (!active) return;
        setResult(nextResult);
        setError(false);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [language]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-purple-200 bg-linear-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-purple-200/40 blur-2xl" />
      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
              <span className="material-icons-outlined text-lg" aria-hidden="true">
                insights
              </span>
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {isFrench ? "Aperçus financiers en direct" : "Live Financial Insights"}
              </h3>
              <p className="text-xs text-gray-500">
                {isFrench
                  ? "Calculés à partir de vos transactions"
                  : "Calculated from your transactions"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            {isFrench ? "Direct" : "Live"}
          </span>
        </div>

        {loading ? (
          <div className="space-y-2" aria-label="Loading financial insights">
            <div className="h-16 animate-pulse rounded-xl bg-white/80" />
            <div className="h-16 animate-pulse rounded-xl bg-white/60" />
          </div>
        ) : error || !result ? (
          <div className="rounded-xl border border-gray-100 bg-white p-3">
            <p className="text-sm font-semibold text-gray-900">
              {isFrench ? "Analyse indisponible" : "Insights unavailable"}
            </p>
            <button
              type="button"
              onClick={() => void loadInsights()}
              className="mt-2 text-xs font-semibold text-purple-700 hover:text-purple-800"
            >
              {isFrench ? "Réessayer" : "Try again"}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {result.insights.map((insight) => (
              <article
                key={`${insight.title}-${insight.detail}`}
                className={`rounded-xl border p-3 ${toneStyles[insight.tone]}`}
              >
                <h4 className="text-xs font-bold">{insight.title}</h4>
                <p className="mt-1 text-xs leading-relaxed">{insight.detail}</p>
              </article>
            ))}

            <div className="flex items-center justify-between gap-3 pt-1 text-[11px] text-gray-500">
              <span>
                {result.metrics.transactionCount} {isFrench ? "transactions analysées" : "transactions analyzed"}
              </span>
              <button
                type="button"
                onClick={() => void loadInsights()}
                className="font-semibold text-purple-700 hover:text-purple-800"
              >
                {isFrench ? "Actualiser" : "Refresh"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <Link
            href="/wallets"
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-800"
          >
            {isFrench ? "Voir les transactions" : "View transactions"}
            <span className="material-icons-outlined text-sm" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
          <span className="text-[10px] text-gray-400">
            {isFrench ? "À titre informatif" : "For informational use"}
          </span>
        </div>
      </div>
    </section>
  );
}
