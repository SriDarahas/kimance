import "server-only";

import { isFundingTransaction } from "@/lib/services/wallets";

const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";
const DEFAULT_MODEL = "alibaba/qwen-3-14b";

export type InsightTransaction = {
  sender_id: string;
  amount: number | string;
  note: string | null;
  created_at: string;
};

export type TransactionMetrics = {
  transactionCount: number;
  moneyIn: number;
  moneyOut: number;
  netFlow: number;
  averageTransaction: number;
  largestOutflow: number;
  currentPeriodOutflow: number;
  previousPeriodOutflow: number;
  outflowChangePercent: number | null;
  periodDays: number;
  lastTransactionAt: string | null;
};

export type TransactionInsight = {
  title: string;
  detail: string;
  tone: "positive" | "neutral" | "attention";
};

export type TransactionInsightResult = {
  metrics: TransactionMetrics;
  insights: TransactionInsight[];
  generatedAt: string;
  source: "model" | "calculated";
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateTransactionMetrics(
  transactions: InsightTransaction[],
  userId: string,
  now = new Date()
): TransactionMetrics {
  const periodDays = 30;
  const currentStart = new Date(now);
  currentStart.setUTCDate(currentStart.getUTCDate() - periodDays);
  const previousStart = new Date(currentStart);
  previousStart.setUTCDate(previousStart.getUTCDate() - periodDays);

  let moneyIn = 0;
  let moneyOut = 0;
  let largestOutflow = 0;
  let currentPeriodOutflow = 0;
  let previousPeriodOutflow = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);
    if (!Number.isFinite(amount) || amount <= 0) continue;

    const isFunding = isFundingTransaction(transaction.note);
    const isOutgoing = transaction.sender_id === userId && !isFunding;

    if (isOutgoing) {
      moneyOut += amount;
      largestOutflow = Math.max(largestOutflow, amount);

      const createdAt = new Date(transaction.created_at);
      if (createdAt >= currentStart && createdAt <= now) {
        currentPeriodOutflow += amount;
      } else if (createdAt >= previousStart && createdAt < currentStart) {
        previousPeriodOutflow += amount;
      }
    } else {
      moneyIn += amount;
    }
  }

  const validCount = transactions.filter((transaction) => {
    const amount = Number(transaction.amount);
    return Number.isFinite(amount) && amount > 0;
  }).length;
  const outflowChangePercent =
    previousPeriodOutflow > 0
      ? ((currentPeriodOutflow - previousPeriodOutflow) /
          previousPeriodOutflow) *
        100
      : null;

  return {
    transactionCount: validCount,
    moneyIn: roundCurrency(moneyIn),
    moneyOut: roundCurrency(moneyOut),
    netFlow: roundCurrency(moneyIn - moneyOut),
    averageTransaction: roundCurrency(
      validCount > 0 ? (moneyIn + moneyOut) / validCount : 0
    ),
    largestOutflow: roundCurrency(largestOutflow),
    currentPeriodOutflow: roundCurrency(currentPeriodOutflow),
    previousPeriodOutflow: roundCurrency(previousPeriodOutflow),
    outflowChangePercent:
      outflowChangePercent === null
        ? null
        : Math.round(outflowChangePercent * 10) / 10,
    periodDays,
    lastTransactionAt: transactions[0]?.created_at ?? null,
  };
}

function formatCurrency(value: number, language: "en" | "fr") {
  return new Intl.NumberFormat(language === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildCalculatedInsights(
  metrics: TransactionMetrics,
  language: "en" | "fr"
): TransactionInsight[] {
  const isFrench = language === "fr";

  if (metrics.transactionCount === 0) {
    return [
      {
        title: isFrench ? "Analyse prête" : "Analysis ready",
        detail: isFrench
          ? "Ajoutez des fonds ou effectuez un transfert pour recevoir des aperçus personnalisés."
          : "Add funds or make a transfer to receive personalized insights.",
        tone: "neutral",
      },
    ];
  }

  const cashFlowInsight: TransactionInsight =
    metrics.netFlow >= 0
      ? {
          title: isFrench ? "Flux de trésorerie positif" : "Positive cash flow",
          detail: isFrench
            ? `Les entrées dépassent les sorties de ${formatCurrency(metrics.netFlow, language)} dans votre activité récente.`
            : `Money in exceeds money out by ${formatCurrency(metrics.netFlow, language)} across your recent activity.`,
          tone: "positive",
        }
      : {
          title: isFrench ? "Sorties supérieures aux entrées" : "Outflows exceed inflows",
          detail: isFrench
            ? `Les sorties dépassent les entrées de ${formatCurrency(Math.abs(metrics.netFlow), language)} dans votre activité récente.`
            : `Money out exceeds money in by ${formatCurrency(Math.abs(metrics.netFlow), language)} across your recent activity.`,
          tone: "attention",
        };

  const trendInsight: TransactionInsight =
    metrics.outflowChangePercent === null
      ? {
          title: isFrench ? "Tendance en formation" : "Trend developing",
          detail: isFrench
            ? `Vos sorties des ${metrics.periodDays} derniers jours totalisent ${formatCurrency(metrics.currentPeriodOutflow, language)}.`
            : `Your outgoing transfers over the last ${metrics.periodDays} days total ${formatCurrency(metrics.currentPeriodOutflow, language)}.`,
          tone: "neutral",
        }
      : {
          title:
            metrics.outflowChangePercent <= 0
              ? isFrench
                ? "Sorties en baisse"
                : "Outflows are down"
              : isFrench
                ? "Sorties en hausse"
                : "Outflows are up",
          detail: isFrench
            ? `Les sorties ont varié de ${Math.abs(metrics.outflowChangePercent).toFixed(1)} % par rapport aux ${metrics.periodDays} jours précédents.`
            : `Outgoing transfers changed ${Math.abs(metrics.outflowChangePercent).toFixed(1)}% compared with the previous ${metrics.periodDays} days.`,
          tone: metrics.outflowChangePercent <= 0 ? "positive" : "attention",
        };

  return [cashFlowInsight, trendInsight];
}

function isTransactionInsight(value: unknown): value is TransactionInsight {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.title === "string" &&
    candidate.title.length > 0 &&
    candidate.title.length <= 80 &&
    typeof candidate.detail === "string" &&
    candidate.detail.length > 0 &&
    candidate.detail.length <= 240 &&
    ["positive", "neutral", "attention"].includes(String(candidate.tone))
  );
}

async function generateModelInsights(
  metrics: TransactionMetrics,
  language: "en" | "fr"
) {
  const token =
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!token || metrics.transactionCount === 0) return null;

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.INSIGHTS_MODEL || DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You create concise educational financial observations from aggregate transaction metrics. Never give investment, tax, legal, credit, or debt advice. Never invent facts, categories, causes, or future outcomes. Return only the requested JSON.",
        },
        {
          role: "user",
          content: JSON.stringify({
            language,
            currency: "USD",
            metrics,
            task: "Return two short, factual observations grounded only in these metrics.",
          }),
        },
      ],
      max_tokens: 350,
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "transaction_insights",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              insights: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string", maxLength: 80 },
                    detail: { type: "string", maxLength: 240 },
                    tone: {
                      type: "string",
                      enum: ["positive", "neutral", "attention"],
                    },
                  },
                  required: ["title", "detail", "tone"],
                },
              },
            },
            required: ["insights"],
          },
        },
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content) as { insights?: unknown[] };
  const insights = parsed.insights?.filter(isTransactionInsight) ?? [];
  return insights.length === 2 ? insights : null;
}

export async function createTransactionInsights(
  metrics: TransactionMetrics,
  language: "en" | "fr"
): Promise<TransactionInsightResult> {
  let insights: TransactionInsight[] | null = null;

  try {
    insights = await generateModelInsights(metrics, language);
  } catch {
    insights = null;
  }

  return {
    metrics,
    insights: insights ?? buildCalculatedInsights(metrics, language),
    generatedAt: new Date().toISOString(),
    source: insights ? "model" : "calculated",
  };
}
