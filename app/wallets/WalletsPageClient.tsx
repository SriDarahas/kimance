"use client";

import Sidebar from "@/app/components/Sidebar";
import WalletsPageHeader from "./WalletsPageHeader";
import WalletsClient from "./WalletsClient";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

interface Wallet {
  id: string;
  user_id: string;
  email: string;
  currency: string;
  balance: number;
  type: 'fiat' | 'crypto';
  created_at: string;
}

interface Transaction {
  id: string;
  sender_id: string;
  sender_email: string;
  recipient_email: string;
  amount: number;
  note: string | null;
  created_at: string;
}

interface WalletsPageClientProps {
  userName: string;
  userEmail: string;
  wallets: Wallet[];
  transactions: Transaction[];
  totalBalance: number;
  userId: string;
}

export default function WalletsPageClient({
  userName,
  userEmail,
  wallets,
  transactions,
  totalBalance,
  userId,
}: WalletsPageClientProps) {
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);
  const mobileHeader = (
    <div className="flex flex-col">
      <span className="font-serif text-lg font-bold text-gray-900 leading-tight">{t('myWallets')}</span>
      <span className="text-xs text-purple-600">{t('manageWallets')}</span>
    </div>
  );
  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} mobileHeader={mobileHeader} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <WalletsPageHeader />

        {/* Wallets Content */}
        <div className="p-6 max-w-6xl mx-auto w-full space-y-6 mt-15">
          
          {/* Total Balance Card */}
          <div className="gradient-card h-48 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden ring-1 ring-black/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <p className="text-gray-400 font-medium mb-2 text-sm">{t('totalPortfolioValue')}</p>
              <h2 className="font-serif text-4xl font-medium tracking-tight">
                ${Number(totalBalance).toFixed(2)}
              </h2>
              <p className="text-gray-400 text-xs mt-1">{t('acrossAllWallets')}</p>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium flex items-center">
                <span className="material-icons-outlined text-sm mr-1">arrow_upward</span>
                +3.2%
              </span>
              <span className="text-xs text-gray-400">{t('today')}</span>
            </div>
          </div>

          {/* Wallets Grid */}
          <WalletsClient initialWallets={wallets} userId={userId} />

          {/* Bottom Section - Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-gray-900">
                  {t('transactionHistory')}
                </h3>
                <button className="text-purple-600 text-xs font-medium hover:underline flex items-center gap-1">
                  {t('viewAll')}
                  <span className="material-icons-outlined text-sm">arrow_forward</span>
                </button>
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
                      <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSent ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            <span className="material-icons-outlined text-lg">
                              {isSent ? 'arrow_outward' : 'arrow_inward'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {isSent ? t('sentTo') : t('receivedFrom')}
                            </p>
                            <p className="text-xs text-gray-500">{otherEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                            {isSent ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">{timeStr}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
                <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <span className="material-icons-outlined text-sm">wallet</span>
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm">{t('activeWallets')}</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">{wallets.length}</p>
                <p className="text-xs text-gray-600 mt-1">{t('multiCurrencySetup')}</p>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <span className="material-icons-outlined text-sm">trending_up</span>
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm">{t('monthGrowth')}</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">+$2,450</p>
                <p className="text-xs text-gray-600 mt-1">{t('vsLastMonth')}</p>
              </div>

              <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <span className="material-icons-outlined text-sm">check_circle</span>
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm">{t('transactionStatus')}</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-600 mt-1">{t('allVerified')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
