"use client";

import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";
import CurrencyDashboard from "@/app/components/CurrencyDashboard";

interface Transaction {
  id: string;
  sender_id: string;
  sender_email: string;
  recipient_email: string;
  amount: number;
  note: string | null;
  created_at: string;
}

interface DashboardClientProps {
  userName: string;
  userEmail: string;
  balance: number;
  transactions: Transaction[];
  userId: string;
}

export default function DashboardClient({ 
  userName, 
  userEmail, 
  balance, 
  transactions,
  userId 
}: DashboardClientProps) {
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);

  return (
    <>
      {/* Header — #35: Bigger text */}
      <header className="h-20 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 py-10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            {t('welcome', { name: userName || 'Ethan' })}
          </h1>
          <p className="text-sm text-purple-600">{t('welcomeBack')}</p>
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
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6 mt-15">
        {/* #34: REARRANGED — Row 1: Currency Rates (top-left) + Balance (top-right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* #37: Currency Dashboard — Rate is now first/prominent */}
          <div className="lg:col-span-7">
            <CurrencyDashboard />
          </div>

          {/* Balance Card — moved to right side */}
          <div className="lg:col-span-5 relative group">
            <div className="gradient-card h-64 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden ring-1 ring-black/5 transition-transform transform hover:scale-[1.01] duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-gray-400 font-medium mb-1 text-sm">{t('globalBalance')}</p>
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
                  <span className="text-xs text-gray-400">{t('vsLastMonth')}</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 border border-white/10"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-600/40 border border-white/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* #34: Quick Actions — now underneath as a full-width row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="#" className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-blue-100 hover:bg-blue-200 transition-colors group border border-blue-200">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
              <span className="material-icons-outlined text-2xl">add</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">{t('addFunds')}</span>
          </Link>
          <Link href="/send-money" className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-purple-100 hover:bg-purple-200 transition-colors group border border-purple-200">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
              <span className="material-icons-outlined text-2xl">arrow_forward</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">{t('sendMoney')}</span>
          </Link>
          <Link href="/exchange-rate" className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-orange-100 hover:bg-orange-200 transition-colors group border border-orange-200">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
              <span className="material-icons-outlined text-2xl">currency_exchange</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">{t('exchange')}</span>
          </Link>
          <Link href="#" className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-green-100 hover:bg-green-200 transition-colors group border border-green-200">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shadow-sm">
              <span className="material-icons-outlined text-2xl">currency_bitcoin</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">{t('crypto')}</span>
          </Link>
        </div>

        {/* Bottom Row - Transactions + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions — #35: Bigger titles */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {t('recentTransactions')}
              </h3>
              <Link href="#" className="text-purple-600 text-sm font-medium hover:underline">
                {t('viewAll')}
              </Link>
            </div>
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">{t('noTransactions')}</p>
              ) : (
                transactions.map((tx) => {
                  const isSent = tx.sender_id === userId;
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
                          <p className="font-semibold text-gray-900 text-sm">
                            {isSent ? `${t('to')}: ${otherEmail}` : `${t('from')}: ${otherEmail}`}
                          </p>
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

          {/* Right Column - Insights + Exchange Widget — #35: Bigger titles */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Insights */}
            <div className="bg-linear-to-br from-purple-600/10 to-blue-500/10 rounded-2xl p-4 border border-purple-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="material-icons-outlined text-5xl text-purple-600">psychology</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded">AI</span>
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  {t('smartInsights')}
                </h3>
              </div>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-purple-600">{t('goodJob')}</span> {t('youSpent')}{" "}
                    <span className="font-semibold text-green-600">15% {t('lessOnDiningOut')}</span>
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 opacity-80">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t('projectedSavings')}{" "}
                    <span className="font-semibold text-gray-900">$450.00</span> {t('basedOnCurrentTrends')}
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full py-2 bg-white text-purple-600 font-medium text-xs rounded-xl shadow-sm hover:shadow-md transition-shadow">
                {t('viewFullReport')}
              </button>
            </div>

            {/* Quick Convert Link */}
            <Link href="/exchange-rate" className="block bg-linear-to-r from-purple-600 to-violet-600 rounded-2xl p-4 text-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold">Convert Currency</h3>
                  <p className="text-white/70 text-xs mt-1">Real-time rates, no hidden fees</p>
                </div>
                <span className="material-icons-outlined text-2xl">arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
