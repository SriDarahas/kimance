import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  calculateTransactionMetrics,
  createTransactionInsights,
  type InsightTransaction,
} from "@/lib/services/transaction-insights";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sentResult, receivedResult] = await Promise.all([
    supabase
      .from("transactions")
      .select("id, sender_id, amount, note, created_at")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("transactions")
      .select("id, sender_id, amount, note, created_at")
      .eq("recipient_email", user.email)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (sentResult.error || receivedResult.error) {
    return NextResponse.json(
      { error: "Unable to analyze transactions." },
      { status: 503 }
    );
  }

  const transactions = new Map<
    string,
    InsightTransaction & { id: string }
  >();
  for (const transaction of [
    ...(sentResult.data ?? []),
    ...(receivedResult.data ?? []),
  ]) {
    transactions.set(transaction.id, transaction);
  }
  const data = Array.from(transactions.values())
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime()
    )
    .slice(0, 100);

  const language = request.nextUrl.searchParams.get("language") === "fr" ? "fr" : "en";
  const metrics = calculateTransactionMetrics(
    data,
    user.id
  );
  const result = await createTransactionInsights(metrics, language);

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
