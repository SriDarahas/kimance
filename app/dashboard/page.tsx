import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import WatchlistClient from "@/app/components/WatchlistClient";

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
    <>
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-xl font-semibold text-gray-900">
            Hi, {userName}
          </h1>
          <p className="text-xs text-gray-500">Welcome back to your financial overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-purple-600 transition-colors relative shadow-sm">
            <span className="material-icons-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500">
            <span className="material-icons-outlined text-xl">menu</span>
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Top Row - Balance Card + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-5 relative group">
            <div className="gradient-card h-52 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden ring-1 ring-black/5 transition-transform transform hover:scale-[1.01] duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-gray-400 font-medium mb-1 text-sm">Global Balance</p>
                  <h2 className="font-serif text-4xl font-medium tracking-tight">
                    ${Number(balance).toFixed(2)}
                  </h2>
                </div>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <span className="material-icons-outlined text-xl">more_vert</span>
                </button>
              </div>
              <div className="relative z-10 flex items-end justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium flex items-center">
                    <span className="material-icons-outlined text-sm mr-0.5">arrow_upward</span>
                    2.5%
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 border border-white/10"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-600/40 border border-white/10"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="#" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-200 hover:bg-blue-300 transition-colors group border border-transparent">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-icons-outlined text-xl">add</span>
              </div>
              <span className="font-medium text-gray-800 text-xs">Add Funds</span>
            </Link>
            <Link href="/send-money" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-200 hover:bg-purple-300 transition-colors group border border-transparent">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-icons-outlined text-xl">arrow_forward</span>
              </div>
              <span className="font-medium text-gray-800 text-xs">Send Money</span>
            </Link>
            <Link href="#" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-orange-200 hover:bg-orange-300 transition-colors group border border-transparent">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-icons-outlined text-xl">currency_exchange</span>
              </div>
              <span className="font-medium text-gray-800 text-xs">Exchange</span>
            </Link>
            <Link href="#" className="h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-green-200 hover:bg-green-300 transition-colors group border border-transparent">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-icons-outlined text-xl">currency_bitcoin</span>
              </div>
              <span className="font-medium text-gray-800 text-xs">Crypto</span>
            </Link>
          </div>
        </div>

        {/* Bottom Row - Transactions + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <Link href="#" className="text-purple-600 text-xs font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No transactions yet</p>
              ) : (
                transactions.map((tx: { id: string; sender_id: string; sender_email: string; recipient_email: string; amount: number; note: string | null; created_at: string }) => {
                  const isSent = tx.sender_id === user!.id;
                  const otherEmail = isSent ? tx.recipient_email : tx.sender_email;
                  const date = new Date(tx.created_at);
                  const timeStr = date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSent ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          <span className="material-icons-outlined text-xl">{isSent ? 'arrow_upward' : 'arrow_downward'}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{isSent ? `To: ${otherEmail}` : `From: ${otherEmail}`}</p>
                          <p className="text-xs text-gray-500">{tx.note || timeStr}</p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                        {isSent ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column - Insights + Watchlist */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-600/10 to-blue-500/10 rounded-2xl p-4 border border-purple-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="material-icons-outlined text-5xl text-purple-600">psychology</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded">AI</span>
                <h3 className="font-serif text-base font-semibold text-gray-900">
                  Smart Insights
                </h3>
              </div>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-purple-600">Good job!</span> You spent{" "}
                    <span className="font-semibold text-green-600">15% less</span> on dining out
                    compared to last week.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 opacity-80">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Projected savings for this month:{" "}
                    <span className="font-semibold text-gray-900">$450.00</span> based on current
                    trends.
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full py-2 bg-white text-purple-600 font-medium text-xs rounded-xl shadow-sm hover:shadow-md transition-shadow">
                View Full Report
              </button>
            </div>

            {/* Watchlist (client) */}
            <WatchlistClient />
          </div>
        </div>
      </div>
    </>
  );
}
