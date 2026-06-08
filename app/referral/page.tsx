"use client";

import { useState, useEffect } from "react";

interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  qualifiedReferrals: number;
  earnings: number;
  pendingRewards: number;
}

export default function ReferralPage() {
  const [stats, setStats] = useState<ReferralStats>({
    referralCode: "",
    referralLink: "",
    totalReferrals: 0,
    qualifiedReferrals: 0,
    earnings: 0,
    pendingRewards: 0,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          ...data,
          referralLink: `${window.location.origin}/register?ref=${data.referralCode}`,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(stats.referralLink)}`, "_blank");
  };

  const shareViaEmail = () => {
    window.open(`mailto:?subject=Join me on Kimance&body=${stats.referralLink}`, "_blank");
  };

  const progressPercent = (stats.qualifiedReferrals / 100) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 mb-8 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎁</span>
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">Referral Program</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Invite & Earn $10</h1>
            <p className="text-white/80 text-sm">Your friend also gets $10 after their first $100+ transfer</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold">$10</p>
            <p className="text-xs">per referral</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Your Referral Link</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={stats.referralLink}
            readOnly
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-mono text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
          >
            {copied ? "Copied! ✓" : "Copy Link"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your referral code: <span className="font-mono font-semibold text-purple-600">{stats.referralCode}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <button onClick={shareViaWhatsApp} className="py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition">
          📱 WhatsApp
        </button>
        <button onClick={shareViaEmail} className="py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition">
          ✉️ Email
        </button>
        <button onClick={copyToClipboard} className="py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition">
          🔗 Copy Link
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.totalReferrals}</p>
          <p className="text-xs text-gray-500">Total Referrals</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.qualifiedReferrals}</p>
          <p className="text-xs text-gray-500">Qualified</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">${stats.earnings}</p>
          <p className="text-xs text-gray-500">Earned</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">${stats.pendingRewards}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">Milestone Bonus</h3>
            <p className="text-sm text-gray-500">Get $100 bonus when you reach 100 qualified referrals</p>
          </div>
          <span className="text-sm font-medium text-purple-600">{stats.qualifiedReferrals}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">How to Earn $10 per Referral</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <p className="text-gray-600">Share your referral link with friends</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <p className="text-gray-600">Friend signs up using your link</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <p className="text-gray-600">Friend completes KYC verification</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <p className="text-gray-600">Friend sends first transfer of $100+</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
            <p className="text-gray-700 font-medium">You both get <span className="text-green-600 font-bold">$10 each</span>!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
