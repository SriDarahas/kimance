import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  hasPayLinkSupabaseEnv,
  parsePayLinkNote,
} from "@/lib/services/pay-links";
import PayLinkClient from "./PayLinkClient";

type WalletRecord = {
  id: string;
  currency: string;
  balance: number;
};

type PayLinkRecord = {
  id: string;
  amount: number;
  created_at: string;
  note: string | null;
};

export default async function PayLinkPage() {
  const supabaseConfigured = hasPayLinkSupabaseEnv();

  if (!supabaseConfigured) {
    return (
      <PayLinkClient
        userName="Demo User"
        userEmail="demo@kimance.com"
        isAdmin={false}
        wallets={[
          { id: "demo-usd", currency: "USD", balance: 1670.55 },
          { id: "demo-eur", currency: "EUR", balance: 820.4 },
        ]}
        payLinks={[]}
        baseUrl={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}
        demoMode
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let isAdmin = false;
  try {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  } catch {
    isAdmin = false;
  }

  const { data: wallets } = await supabase
    .from("wallets")
    .select("id, currency, balance")
    .eq("user_id", user.id)
    .order("balance", { ascending: false });

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount, created_at, note")
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const payLinks = ((transactions ?? []) as PayLinkRecord[])
    .map((transaction) => {
      const payload = parsePayLinkNote(transaction.note);
      if (!payload) return null;
      return {
        id: transaction.id,
        createdAt: transaction.created_at,
        payload,
      };
    })
    .filter(Boolean);

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kimance.vercel.app";

  return (
    <PayLinkClient
      userName={userName}
      userEmail={userEmail}
      isAdmin={isAdmin}
      wallets={(wallets ?? []) as WalletRecord[]}
      payLinks={payLinks}
      baseUrl={baseUrl}
    />
  );
}
