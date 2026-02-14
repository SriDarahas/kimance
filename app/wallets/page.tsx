import { createClient } from "@/lib/supabase/server";
import WalletsPageClient from "./WalletsPageClient";
import NotAuthClient from "@/app/components/NotAuthClient";

async function getUserWallets(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return data || [];
}

async function getOrCreateDefaultWallets(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, email: string) {
  const { data: existingWallets } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId);

  if (existingWallets && existingWallets.length > 0) {
    return existingWallets;
  }

  // Create default wallets if none exist
  const defaultWallets = [
    { user_id: userId, email, currency: 'USD', balance: 1000, type: 'fiat' },
    { user_id: userId, email, currency: 'EUR', balance: 850, type: 'fiat' },
    { user_id: userId, email, currency: 'BTC', balance: 0.15, type: 'crypto' },
  ];

  const { data: newWallets } = await supabase
    .from('wallets')
    .insert(defaultWallets)
    .select();

  return newWallets || [];
}

async function getTransactionHistory(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, limit = 10) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export default async function WalletsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <NotAuthClient />;
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  
  const wallets = await getOrCreateDefaultWallets(supabase, user.id, userEmail);
  const transactions = await getTransactionHistory(supabase, user.id);

  const totalBalance = wallets.reduce((sum, wallet) => {
    // Simple conversion - in production you'd use real exchange rates
    const multiplier = wallet.currency === 'BTC' ? 95000 : wallet.currency === 'EUR' ? 1.1 : 1;
    return sum + (wallet.balance * multiplier);
  }, 0);

  return (
    <WalletsPageClient
      userName={userName}
      userEmail={userEmail}
      wallets={wallets}
      transactions={transactions}
      totalBalance={totalBalance}
      userId={user.id}
    />
  );
}
