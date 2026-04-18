import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = 'force-dynamic';

async function getUserTotalBalance(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: wallets } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('user_id', userId);

  if (!wallets || wallets.length === 0) return 0;

  // Convert all balances to USD using fixed rates
  const rates: Record<string, number> = {
    'USD': 1,
    'EUR': 1.1,
    'GBP': 1.27,
    'BTC': 95000,
    'ETH': 3500,
    'CAD': 0.72,
  };

  return wallets.reduce((sum, wallet) => {
    const rate = rates[wallet.currency] || 1;
    return sum + (Number(wallet.balance) * rate);
  }, 0);
}

async function getTransactions(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, userEmail: string) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_email.eq.${userEmail}`)
    .order('created_at', { ascending: false })
    .limit(10);
  return data || [];
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const balance = await getUserTotalBalance(supabase, user!.id);
  const transactions = await getTransactions(supabase, user!.id, userEmail);

  return (
    <DashboardClient 
      userName={userName}
      userEmail={userEmail}
      balance={balance}
      transactions={transactions}
      userId={user!.id}
    />
  );
}
