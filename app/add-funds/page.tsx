import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserWallets } from "@/lib/services/wallets";
import AddFundsClient from "./AddFundsClient";

export default async function AddFundsPage() {
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
  const wallets = await getUserWallets(supabase, user.id);

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";

  return (
    <AddFundsClient
      userName={userName}
      userEmail={userEmail}
      isAdmin={isAdmin}
      wallets={wallets}
    />
  );
}