import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import { isFundingTransaction, isSendTransaction } from '@/lib/services/wallets';

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

async function getNotifications(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  userEmail: string
) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_email.eq.${userEmail}`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!data) return [];

  return data.map((tx: any) => {
    const isSender = tx.sender_id === userId;
    const isOwnFunding = isFundingTransaction(tx.note) && tx.sender_id === userId;

    const timeAgo = (() => {
      const diff = Date.now() - new Date(tx.created_at).getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    })();

    const amount = `$${Number(tx.amount).toFixed(2)}`;

    if (isOwnFunding) {
      return {
        id: tx.id,
        title: 'Funds added to wallet',
        body: `${amount} was added successfully.`,
        time: timeAgo,
        unread: false,
      };
    }

    if (isSender) {
      return {
        id: tx.id,
        title: `Money sent to ${tx.recipient_email}`,
        body: `You sent ${amount}${tx.note && !tx.note.startsWith('SEND:') ? ` — "${tx.note}"` : ''}`,
        time: timeAgo,
        unread: false,
      };
    }

    return {
      id: tx.id,
      title: `Money received`,
      body: `You received ${amount} from ${tx.sender_email}`,
      time: timeAgo,
      unread: true,
    };
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const balance = await getUserTotalBalance(supabase, user!.id);
  const transactions = await getTransactions(supabase, user!.id, userEmail);
  const notifications = await getNotifications(supabase, user!.id, userEmail);

  return (
    <DashboardClient 
      userName={userName}
      userEmail={userEmail}
      balance={balance}
      transactions={transactions}
      userId={user!.id}
      notifications={notifications}
    />
  );
}
