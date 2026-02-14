"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { sendMoney, getBalance, checkRecipient } from "./actions";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

interface SendMoneyClientProps {
  userName: string;
  userEmail: string;
}

export default function SendMoneyClient({ userName, userEmail }: SendMoneyClientProps) {
  const [step, setStep] = useState(1);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);

  useEffect(() => {
    getBalance().then(res => {
      if (res.balance) setBalance(res.balance);
    });
  }, []);

  const handleStep1 = async () => {
    setLoading(true);
    setError(null);
    const result = await checkRecipient(recipientEmail);
    if (result.error) {
      setError(result.error);
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  const handleStep2 = () => {
    if (parseFloat(amount) <= 0) {
      setError(t('amountMustBeGreater'));
      return;
    }
    if (balance !== null && parseFloat(amount) > balance) {
      setError(t('insufficientBalance'));
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    const result = await sendMoney(recipientEmail, parseFloat(amount), note);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setBalance(result.newBalance ?? null);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep(1);
    setRecipientEmail("");
    setAmount("");
    setNote("");
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-serif text-xl font-semibold text-gray-900">
              {t('sendMoneyTitle')}
            </h1>
            <p className="text-xs text-gray-500">{t('fastSecureTransfers')}</p>
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

        {/* Send Money Content */}
        <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
          {/* Balance Card - matching dashboard style */}
          <div className="gradient-card h-40 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <p className="text-gray-400 font-medium mb-1 text-sm">{t('availableBalance')}</p>
              <h2 className="font-serif text-4xl font-medium tracking-tight">
                ${balance !== null ? balance.toFixed(2) : '...'}
              </h2>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Step Indicator */}
            {!success && (
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-4 w-full h-0.5 bg-gray-200 -z-10"></div>
                <div 
                  className="absolute left-0 top-4 h-0.5 bg-purple-600 -z-10 transition-all duration-300" 
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
                {[
                  { num: 1, label: t('recipient'), icon: "person" },
                  { num: 2, label: t('amount'), icon: "attach_money" },
                  { num: 3, label: t('review'), icon: "check_circle" },
                ].map((s) => (
                  <div key={s.num} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      s.num <= step 
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-200" 
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {s.num < step ? (
                        <span className="material-icons-outlined text-lg">check</span>
                      ) : (
                        <span className="material-icons-outlined text-lg">{s.icon}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${s.num <= step ? "text-purple-600" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                <span className="material-icons-outlined text-red-500">error</span>
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                  <span className="material-icons-outlined text-green-600 text-4xl">check</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{t('moneySent')}</h3>
                <p className="text-gray-600 mb-2">{t('successfullySent')} <span className="font-bold text-purple-600">${amount}</span></p>
                <p className="text-gray-500 text-sm mb-8">{t('to')} {recipientEmail}</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors">
                    {t('backToDashboard')}
                  </Link>
                  <button 
                    onClick={handleReset} 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-200 transition-all"
                  >
                    {t('sendAgain')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Recipient */}
            {!success && step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('whoAreYouSendingTo')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-outlined text-gray-400">
                      email
                    </span>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => { setRecipientEmail(e.target.value); setError(null); }}
                      placeholder={t('enterRecipientEmail')}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={handleStep1}
                  disabled={loading || !recipientEmail}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-icons-outlined animate-spin">refresh</span>
                      {t('checking')}
                    </>
                  ) : (
                    <>
                      {t('continue')}
                      <span className="material-icons-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Amount & Note */}
            {!success && step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('howMuchToSend')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(null); }}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-3xl font-bold transition-all"
                    />
                  </div>
                  {balance !== null && (
                    <p className="text-sm text-gray-500 mt-2">
                      {t('available')}: <span className="font-medium text-purple-600">${balance.toFixed(2)}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('addNote')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 material-icons-outlined text-gray-400">
                      notes
                    </span>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={t('whatsThisFor')}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(1)} 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-icons-outlined">arrow_back</span>
                    {t('back')}
                  </button>
                  <button 
                    onClick={handleStep2} 
                    disabled={!amount || parseFloat(amount) <= 0} 
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {t('continue')}
                    <span className="material-icons-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {!success && step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-500 text-sm">{t('recipient')}</span>
                    <span className="font-medium text-gray-900">{recipientEmail}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-500 text-sm">{t('amount')}</span>
                    <span className="font-bold text-2xl text-purple-600">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  {note && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm">{t('note')}</span>
                      <span className="font-medium text-gray-900">{note}</span>
                    </div>
                  )}
                </div>
                <div className="bg-purple-50 rounded-xl p-4 flex gap-3 items-start">
                  <span className="material-icons-outlined text-purple-600 mt-0.5">verified_user</span>
                  <p className="text-sm text-purple-800">
                    {t('transactionProtected')}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(2)} 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-icons-outlined">arrow_back</span>
                    {t('back')}
                  </button>
                  <button 
                    onClick={handleSend} 
                    disabled={loading} 
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="material-icons-outlined animate-spin">refresh</span>
                        {t('sending')}
                      </>
                    ) : (
                      <>
                        <span className="material-icons-outlined">send</span>
                        {t('confirmSend')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
