import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MarketplaceClient from "./MarketplaceClient";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';

  return <MarketplaceClient userName={userName} userEmail={userEmail} isAdmin={isAdmin} />;
}
