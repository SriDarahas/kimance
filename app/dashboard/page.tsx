import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

async function getOrCreateBalance(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, email: string) {
  const { data: balance } = await supabase
    .from('balances')
    .select('amount')
    .eq('user_id', userId)
    .single();

  if (balance) return balance.amount;

  // Create default balance
  const { data: newBalance } = await supabase
    .from('balances')
    .insert({ user_id: userId, email: email, amount: 100 })
    .select('amount')
    .single();

  return newBalance?.amount ?? 100;
}

async function getTransactions(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const balance = await getOrCreateBalance(supabase, user!.id, userEmail);
  const transactions = await getTransactions(supabase, user!.id);

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
