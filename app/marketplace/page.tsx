import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MarketplaceClient from "./MarketplaceClient";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';

  return <MarketplaceClient userName={userName} userEmail={userEmail} />;
}
