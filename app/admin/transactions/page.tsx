import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TransactionsClient from "./TransactionsClient";

export default async function AdminTransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: transactions, error } = await adminClient
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin: failed to fetch transactions", error);
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
  const userEmail = user.email || "";

  return (
    <TransactionsClient
      transactions={transactions || []}
      userName={userName}
      userEmail={userEmail}
    />
  );
}
