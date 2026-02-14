"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

type SettingsTab = "profile" | "security" | "billing" | "notifications";

interface SettingsClientProps {
  userName: string;
  userEmail: string;
}

export default function SettingsClient({ userName, userEmail }: SettingsClientProps) {
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [smartBudgeting, setSmartBudgeting] = useState(true);
  const [investmentTips, setInvestmentTips] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-serif text-xl font-semibold text-gray-900">
              {t('settings')}
            </h1>
            <p className="text-xs text-gray-500">{t('manageAccount')}</p>
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

        {/* Settings Content */}
        <div className="p-6 max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Sidebar */}
            <aside className="lg:w-64 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  {t('settings')}
                </p>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "profile"
                      ? "bg-purple-600/10 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">person</span>
                  {t('profileAccount')}
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "security"
                      ? "bg-purple-600/10 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">security</span>
                  {t('security')}
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "billing"
                      ? "bg-purple-600/10 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">account_balance_wallet</span>
                  {t('billingPlans')}
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "notifications"
                      ? "bg-purple-600/10 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">notifications_active</span>
                  {t('notifications')}
                </button>
              </div>

              {/* AI Coach Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-outlined text-yellow-300 text-lg">
                      auto_awesome
                    </span>
                    <h4 className="font-serif font-semibold text-base">
                      {t('aiCoach')}
                    </h4>
                  </div>
                  <p className="text-xs text-purple-100 mb-3 leading-relaxed">
                    {t('yourFinancialHealth')}
                  </p>
                  <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1">
                    {t('viewInsights')}
                    <span className="material-icons-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Settings Panel */}
            <div className="flex-1 space-y-6">
              {/* Header with Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                    {t('profileSettings')}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t('managePersonalInfo')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    {t('cancel')}
                  </button>
                  <button className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all">
                    {t('saveChanges')}
                  </button>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className="relative group cursor-pointer">
                  <Image
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-50"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbXr3DDLyxloYuvfePJxu5u_hv5Cs48XjznWxqit9UDCu3ZjK-6DvfuZpUVWckI1hULyWPmPiYiSljlJWnD4IjiTIh9A1r34OIX50pAiJfo0y_aHeaghYxBGWbr56WXXVKT9W9QXf76NVUJrFN6xVMIrdJ1tieKJwnv3btBt7elx5wSd-rpA1aMGe55bn_MzhWKVZBOwGzimrfK1uYadc4hPe-43-mO4aaoBlFaxDzJKuUu2hchBJrA8TqiATMsFxACVKb3EY0uwZZ"
                    width={80}
                    height={80}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-icons-outlined text-white">edit</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5">{userName}</h3>
                  <p className="text-sm text-gray-500 mb-3">{userEmail}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 flex items-center gap-1">
                      <span className="material-icons-outlined text-xs">verified</span> {t('verified')}
                    </span>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                      {t('premiumMember')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Account Tier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 font-serif">
                      {t('accountTier')}
                    </h3>
                    <Link href="#" className="text-purple-600 text-xs font-medium hover:underline">
                      {t('upgrade')}
                    </Link>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <span className="material-icons-outlined text-6xl text-purple-600">
                        diamond
                      </span>
                    </div>
                    <div className="relative z-10">
                      <div className="mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          {t('currentPlan')}
                        </span>
                        <h4 className="text-xl font-bold text-purple-600 mt-0.5">Kimance Gold</h4>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="material-icons-outlined text-green-500 text-sm">
                            check_circle
                          </span>
                          <span>{t('zeroTransactionFees')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="material-icons-outlined text-green-500 text-sm">
                            check_circle
                          </span>
                          <span>{t('prioritySupport')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="material-icons-outlined text-green-500 text-sm">
                            check_circle
                          </span>
                          <span>{t('cryptoAnalytics')}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                        <div className="bg-purple-600 h-1.5 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t('upgradeToPlatinum')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Financial Coach */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 font-serif">
                      {t('aiFinancialCoach')}
                    </h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          <span className="material-icons-outlined text-lg">analytics</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{t('smartBudgeting')}</p>
                          <p className="text-xs text-gray-500">{t('smartBudgetingDesc')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSmartBudgeting(!smartBudgeting)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          smartBudgeting ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            smartBudgeting ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                          <span className="material-icons-outlined text-lg">psychology</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{t('investmentTips')}</p>
                          <p className="text-xs text-gray-500">{t('investmentTipsDesc')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInvestmentTips(!investmentTips)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          investmentTips ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            investmentTips ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                          <span className="material-icons-outlined text-lg">savings</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{t('autoSave')}</p>
                          <p className="text-xs text-gray-500">{t('autoSaveDesc')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAutoSave(!autoSave)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          autoSave ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            autoSave ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 font-serif">
                    {t('connectedAccounts')}
                  </h3>
                  <button className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors">
                    <span className="material-icons-outlined text-sm">add</span> {t('addNew')}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3 hover:border-purple-600/50 transition-all shadow-sm hover:shadow-md text-left">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-icons-outlined text-gray-600 text-lg">
                        account_balance
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Chase Bank</p>
                      <p className="text-xs text-gray-500">**** 4829</p>
                    </div>
                    <span className="material-icons-outlined text-gray-400 group-hover:text-purple-600 text-lg">
                      navigate_next
                    </span>
                  </button>
                  <button className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3 hover:border-purple-600/50 transition-all shadow-sm hover:shadow-md text-left">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="material-icons-outlined text-orange-500 text-lg">
                        currency_bitcoin
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Metamask</p>
                      <p className="text-xs text-gray-500">0x71...8a92</p>
                    </div>
                    <span className="material-icons-outlined text-gray-400 group-hover:text-purple-600 text-lg">
                      navigate_next
                    </span>
                  </button>
                    <button className="border-2 border-dashed border-gray-200 p-4 rounded-2xl flex items-center justify-center gap-2 hover:border-purple-600/50 hover:bg-purple-600/5 transition-all text-gray-500 hover:text-purple-600">
                      <span className="material-icons-outlined text-lg">add_card</span>
                    <span className="text-sm font-medium">{t('linkCard')}</span>
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 font-serif">
                  {t('preferences')}
                </h3>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('primaryCurrency')}
                    </label>
                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-purple-600 focus:border-purple-600 py-2 px-3 text-sm transition-colors">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('languageLabel')}
                    </label>
                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-purple-600 focus:border-purple-600 py-2 px-3 text-sm transition-colors">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('timeZone')}
                    </label>
                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-purple-600 focus:border-purple-600 py-2 px-3 text-sm transition-colors">
                      <option>(GMT-05:00) Eastern Time</option>
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT+01:00) Paris</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('theme')}</label>
                    <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200">
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all bg-white shadow-sm text-gray-900">
                        <span className="material-icons-outlined text-sm">light_mode</span> {t('light')}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-gray-500 hover:text-gray-900">
                        <span className="material-icons-outlined text-sm">dark_mode</span> {t('dark')}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-gray-500 hover:text-gray-900">
                        <span className="material-icons-outlined text-sm">
                          settings_system_daydream
                        </span> {t('auto')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="pt-4 border-t border-gray-200">
                <button className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-2 transition-colors">
                  <span className="material-icons-outlined text-lg">delete_outline</span>
                  {t('deleteAccount')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
