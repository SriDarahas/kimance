import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SendMoneyClient from "./SendMoneyClient";

const SUPPORTED_SEND_CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP', 'AUD'];

export default async function SendMoneyPage() {
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

  const { data: wallets } = await supabase
    .from('wallets')
    .select('currency, balance')
    .eq('user_id', user.id)
    .order('balance', { ascending: false });

  const primaryWallet = wallets?.find(w => SUPPORTED_SEND_CURRENCIES.includes(w.currency));
  const primaryCurrency = primaryWallet?.currency || 'USD';

  return <SendMoneyClient userName={userName} userEmail={userEmail} isAdmin={isAdmin} primaryCurrency={primaryCurrency} />;
}
