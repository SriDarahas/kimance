"use client";

import { useState } from "react";
import Link from "next/link";
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

interface WalletsClientProps {
  initialWallets: Wallet[];
  userId: string;
}

const getCurrencyIcon = (currency: string) => {
  const icons: Record<string, string> = {
    'USD': 'payments',
    'EUR': 'euro',
    'GBP': 'attach_money',
    'BTC': 'currency_bitcoin',
    'ETH': 'currency_ethereum',
    'CAD': 'attach_money',
  };
  return icons[currency] || 'wallet';
};

const getCurrencyColor = (currency: string) => {
  const colors: Record<string, string> = {
    'USD': 'bg-blue-100 text-blue-600',
    'EUR': 'bg-purple-100 text-purple-600',
    'GBP': 'bg-green-100 text-green-600',
    'BTC': 'bg-orange-100 text-orange-600',
    'ETH': 'bg-indigo-100 text-indigo-600',
    'CAD': 'bg-red-100 text-red-600',
  };
  return colors[currency] || 'bg-gray-100 text-gray-600';
};

const getBalanceInUSD = (balance: number, currency: string) => {
  const rates: Record<string, number> = {
    'USD': 1,
    'EUR': 1.1,
    'GBP': 1.27,
    'BTC': 95000,
    'ETH': 3500,
    'CAD': 0.72,
  };
  return balance * (rates[currency] || 1);
};

export default function WalletsClient({ initialWallets, userId }: WalletsClientProps) {
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);

  const availableCurrencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH', 'CAD'];
  const existingCurrencies = wallets.map(w => w.currency);
  const unusedCurrencies = availableCurrencies.filter(c => !existingCurrencies.includes(c));

  const handleAddWallet = async () => {
    if (!selectedCurrency) return;

    try {
      const response = await fetch('/api/wallets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency: selectedCurrency,
          type: ['BTC', 'ETH'].includes(selectedCurrency) ? 'crypto' : 'fiat',
        }),
      });

      if (response.ok) {
        const newWallet = await response.json();
        setWallets([newWallet, ...wallets]);
        setIsAddingWallet(false);
        setSelectedCurrency(unusedCurrencies[0] || 'USD');
      }
    } catch (error) {
      console.error('Failed to add wallet:', error);
    }
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm(t('confirmDeleteWallet'))) return;

    try {
      const response = await fetch(`/api/wallets/${walletId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWallets(wallets.filter(w => w.id !== walletId));
      }
    } catch (error) {
      console.error('Failed to delete wallet:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-gray-900">{t('myWalletsSection')}</h2>
          <button
            onClick={() => setIsAddingWallet(!isAddingWallet)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <span className="material-icons-outlined text-sm">add</span>
            {t('addWallet')}
          </button>
        </div>

        {/* Add Wallet Form */}
        {isAddingWallet && (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">{t('addWallet')}</h3>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('selectCurrency')}</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  {unusedCurrencies.map(currency => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-end">
                <button
                  onClick={handleAddWallet}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t('createWallet')}
                </button>
                <button
                  onClick={() => setIsAddingWallet(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wallets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => {
            const usdValue = getBalanceInUSD(wallet.balance, wallet.currency);
            const isLowBalance = wallet.type === 'crypto' ? wallet.balance < 0.01 : wallet.balance < 100;

            return (
              <div
                key={wallet.id}
                className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCurrencyColor(wallet.currency)}`}>
                    <span className="material-icons-outlined text-xl">{getCurrencyIcon(wallet.currency)}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteWallet(wallet.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full hover:bg-red-100 text-red-600 flex items-center justify-center"
                    title={t('delete')}
                  >
                    <span className="material-icons-outlined text-sm">close</span>
                  </button>
                </div>

                {/* Currency Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{wallet.currency} {t('walletType')}</h3>
                  <p className="text-xs text-gray-500 mt-1">{wallet.type === 'crypto' ? t('cryptoCurrency') : t('fiatCurrency')}</p>
                </div>

                {/* Balance */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-600 mb-1">{t('balance')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {wallet.balance.toFixed(wallet.type === 'crypto' ? 4 : 2)} {wallet.currency}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">≈ ${usdValue.toFixed(2)} {t('USD')}</p>
                </div>

                {/* Status Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    isLowBalance
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isLowBalance ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                    {isLowBalance ? t('lowBalance') : t('active')}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                    <span className="material-icons-outlined text-sm">download</span>
                    <span className="hidden sm:inline">{t('deposit')}</span>
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                    <span className="material-icons-outlined text-sm">upload</span>
                    <span className="hidden sm:inline">{t('withdraw')}</span>
                  </button>
                </div>

                {/* View Details Link */}
                <button className="w-full mt-3 py-2 text-purple-600 font-medium text-sm rounded-lg hover:bg-purple-50 transition-colors">
                  {t('viewDetails')} →
                </button>
              </div>
            );
          })}
        </div>

        {wallets.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons-outlined text-4xl text-gray-300 mb-2 inline-block">
              account_balance_wallet
            </span>
            <p className="text-gray-500 mb-4">{t('noWallets')}</p>
            <button
              onClick={() => setIsAddingWallet(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t('createFirstWallet')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
