"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/app/auth/actions";

type SettingsTab = "profile" | "security" | "billing" | "notifications";

interface SettingsClientProps {
  userName: string;
  userEmail: string;
}

export default function SettingsClient({ userName, userEmail }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [smartBudgeting, setSmartBudgeting] = useState(true);
  const [investmentTips, setInvestmentTips] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="bg-[#F3F4F6] text-gray-800 font-[family-name:var(--font-inter)] min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Kimance Logo"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#6D28D9] font-bold tracking-tight">
            Kimance
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">dashboard</span>
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">account_balance_wallet</span>
            My Wallets
          </Link>
          <Link
            href="/send-money"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">receipt_long</span>
            Transactions
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
          >
            <span className="material-icons-outlined text-xl">pie_chart</span>
            Budgeting
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              New
            </span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 bg-[#6D28D9]/10 text-[#6D28D9] rounded-xl font-medium text-sm"
          >
            <span className="material-icons-outlined text-xl">settings</span>
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group">
            <div className="w-9 h-9 rounded-full bg-[#6D28D9]/10 flex items-center justify-center text-[#6D28D9] font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">{userName}</span>
              <span className="text-xs text-gray-500 truncate">{userEmail}</span>
            </div>
            <form action={logout}>
              <button 
                type="submit"
                className="material-icons-outlined text-gray-400 hover:text-[#6D28D9] transition-colors text-xl"
                title="Sign out"
              >
                logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-gray-900">
              Settings
            </h1>
            <p className="text-xs text-gray-500">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#6D28D9] transition-colors relative shadow-sm">
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
                  Settings
                </p>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "profile"
                      ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">person</span>
                  Profile & Account
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "security"
                      ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">security</span>
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "billing"
                      ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">account_balance_wallet</span>
                  Billing & Plans
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    activeTab === "notifications"
                      ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons-outlined text-xl">notifications_active</span>
                  Notifications
                </button>
              </div>

              {/* AI Coach Card */}
              <div className="bg-gradient-to-br from-[#6D28D9] to-[#9F7AEA] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-outlined text-yellow-300 text-lg">
                      auto_awesome
                    </span>
                    <h4 className="font-[family-name:var(--font-playfair)] font-semibold text-base">
                      AI Coach
                    </h4>
                  </div>
                  <p className="text-xs text-purple-100 mb-3 leading-relaxed">
                    Your financial health score is up by 12% this month.
                  </p>
                  <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1">
                    View Insights
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
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gray-900 mb-1">
                    Profile Settings
                  </h2>
                  <p className="text-sm text-gray-500">
                    Manage your personal information and preferences.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button className="px-5 py-2 bg-[#6D28D9] text-white rounded-lg text-sm font-medium hover:bg-[#5A24B3] shadow-lg shadow-purple-200 transition-all">
                    Save Changes
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
                      <span className="material-icons-outlined text-xs">verified</span> Verified
                    </span>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
                      Premium Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Account Tier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
                      Account Tier
                    </h3>
                    <Link href="#" className="text-[#6D28D9] text-xs font-medium hover:underline">
                      Upgrade
                    </Link>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <span className="material-icons-outlined text-6xl text-[#6D28D9]">
                        diamond
                      </span>
                    </div>
                    <div className="relative z-10">
                      <div className="mb-3">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                          Current Plan
                        </span>
                        <h4 className="text-xl font-bold text-[#6D28D9] mt-0.5">Kimance Gold</h4>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="material-icons-outlined text-green-500 text-sm">
                            check_circle
                          </span>
                          <span>Zero transaction fees</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="material-icons-outlined text-green-500 text-sm">
                            check_circle
                          </span>
                          <span>Priority Support</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="material-icons-outlined text-green-500 text-sm">
                            check_circle
                          </span>
                          <span>Crypto Analytics Dashboard</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                        <div className="bg-[#6D28D9] h-1.5 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Upgrade to Platinum for exclusive metal card
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Financial Coach */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
                    AI Financial Coach
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          <span className="material-icons-outlined text-lg">analytics</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Smart Budgeting</p>
                          <p className="text-xs text-gray-500">Receive proactive spending alerts</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSmartBudgeting(!smartBudgeting)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          smartBudgeting ? "bg-[#6D28D9]" : "bg-gray-200"
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
                          <p className="font-medium text-gray-900 text-sm">Investment Tips</p>
                          <p className="text-xs text-gray-500">AI-driven portfolio suggestions</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInvestmentTips(!investmentTips)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          investmentTips ? "bg-[#6D28D9]" : "bg-gray-200"
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
                          <p className="font-medium text-gray-900 text-sm">Auto-Save</p>
                          <p className="text-xs text-gray-500">Round up purchases to savings</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAutoSave(!autoSave)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          autoSave ? "bg-[#6D28D9]" : "bg-gray-200"
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
                  <h3 className="text-base font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
                    Connected Accounts
                  </h3>
                  <button className="flex items-center gap-1 text-xs font-medium text-[#6D28D9] hover:text-[#5A24B3] transition-colors">
                    <span className="material-icons-outlined text-sm">add</span> Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3 hover:border-[#6D28D9]/50 transition-all shadow-sm hover:shadow-md text-left">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-icons-outlined text-gray-600 text-lg">
                        account_balance
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Chase Bank</p>
                      <p className="text-xs text-gray-500">**** 4829</p>
                    </div>
                    <span className="material-icons-outlined text-gray-400 group-hover:text-[#6D28D9] text-lg">
                      navigate_next
                    </span>
                  </button>
                  <button className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3 hover:border-[#6D28D9]/50 transition-all shadow-sm hover:shadow-md text-left">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="material-icons-outlined text-orange-500 text-lg">
                        currency_bitcoin
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Metamask</p>
                      <p className="text-xs text-gray-500">0x71...8a92</p>
                    </div>
                    <span className="material-icons-outlined text-gray-400 group-hover:text-[#6D28D9] text-lg">
                      navigate_next
                    </span>
                  </button>
                  <button className="border-2 border-dashed border-gray-200 p-4 rounded-2xl flex items-center justify-center gap-2 hover:border-[#6D28D9]/50 hover:bg-[#6D28D9]/5 transition-all text-gray-500 hover:text-[#6D28D9]">
                    <span className="material-icons-outlined text-lg">add_card</span>
                    <span className="text-sm font-medium">Link Card</span>
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
                  Preferences
                </h3>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Primary Currency
                    </label>
                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#6D28D9] focus:border-[#6D28D9] py-2 px-3 text-sm transition-colors">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Language
                    </label>
                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#6D28D9] focus:border-[#6D28D9] py-2 px-3 text-sm transition-colors">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Time Zone
                    </label>
                    <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#6D28D9] focus:border-[#6D28D9] py-2 px-3 text-sm transition-colors">
                      <option>(GMT-05:00) Eastern Time</option>
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT+01:00) Paris</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Theme</label>
                    <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-200">
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all bg-white shadow-sm text-gray-900">
                        <span className="material-icons-outlined text-sm">light_mode</span> Light
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-gray-500 hover:text-gray-900">
                        <span className="material-icons-outlined text-sm">dark_mode</span> Dark
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-gray-500 hover:text-gray-900">
                        <span className="material-icons-outlined text-sm">
                          settings_system_daydream
                        </span>{" "}
                        Auto
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="pt-4 border-t border-gray-200">
                <button className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-2 transition-colors">
                  <span className="material-icons-outlined text-lg">delete_outline</span>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
