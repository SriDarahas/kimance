"use client";

import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface EligibilityItem {
  title: string;
  requirement: string;
  status: "pass" | "borderline" | "fail";
}

interface AiInsight {
  positive: boolean;
  title: string;
  description: string;
}

interface Offer {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: string;
  description: string;
  longDescription: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  rating: number | null;
  stats: {
    apr: string;
    amount: string;
    term: string;
  };
  features: Feature[];
  eligibility: EligibilityItem[];
  aiScore: number;
  aiInsights: AiInsight[];
}

interface MarketplaceDetailClientProps {
  userName: string;
  userEmail: string;
  offer: Offer;
}

export default function MarketplaceDetailClient({ userName, userEmail, offer }: MarketplaceDetailClientProps) {
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (offer.aiScore / 100) * circumference;

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="font-serif text-xl font-semibold text-gray-900">
              Marketplace
            </h1>
            <p className="text-xs text-gray-500">Product Details</p>
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

        {/* Page Content */}
        <div className="p-6 max-w-6xl mx-auto w-full">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/marketplace" className="hover:text-purple-600">Marketplace</Link>
            <span className="material-icons-outlined text-base mx-2">chevron_right</span>
            <span className="text-gray-900 font-medium">{offer.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Product Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Hero Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className={`material-icons-outlined text-9xl text-purple-600 transform rotate-12`}>{offer.icon}</span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  <div className={`w-20 h-20 rounded-xl ${offer.iconBg} flex items-center justify-center shrink-0`}>
                    <span className={`material-icons-outlined text-4xl ${offer.iconColor}`}>{offer.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                        {offer.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="material-icons text-sm text-green-500">verified</span>
                        Partner Verified
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      Provided by <span className="font-semibold text-gray-900">{offer.provider}</span>
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Rate / APR</p>
                        <p className="font-bold text-xl text-gray-900">{offer.stats.apr}</p>
                      </div>
                      <div className="w-px bg-gray-200 h-10 hidden sm:block"></div>
                      <div>
                        <p className="text-gray-500 mb-1">Amount / Limit</p>
                        <p className="font-bold text-xl text-gray-900">{offer.stats.amount}</p>
                      </div>
                      <div className="w-px bg-gray-200 h-10 hidden sm:block"></div>
                      <div>
                        <p className="text-gray-500 mb-1">Term / Rewards</p>
                        <p className="font-bold text-xl text-gray-900">{offer.stats.term}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Overview */}
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Product Overview</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {offer.longDescription}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offer.features.map((feature, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                      <span className="material-icons-outlined text-purple-600 mt-1">{feature.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Eligibility */}
              <div className="bg-white rounded-xl p-8 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Eligibility Requirements</h2>
                <div className="space-y-4">
                  {offer.eligibility.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          item.status === "pass" 
                            ? "bg-green-100 text-green-600" 
                            : item.status === "borderline"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          <span className="material-icons-outlined">
                            {item.status === "pass" ? "check" : item.status === "borderline" ? "priority_high" : "close"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.requirement}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          item.status === "pass"
                            ? "bg-green-100 text-green-700"
                            : item.status === "borderline"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {item.status === "pass" ? "You Pass" : item.status === "borderline" ? "Borderline" : "Not Met"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky AI Fit Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Main AI Fit Card */}
              <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-purple-200 p-6 overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
                
                <div className="relative z-10 text-center mb-6">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Kimance AI Fit Score</p>
                  {/* Circular Progress Indicator */}
                  <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-gray-100"
                        cx="80"
                        cy="80"
                        fill="transparent"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                      />
                      <circle
                        className="text-purple-600 transition-all duration-1000 ease-out"
                        cx="80"
                        cy="80"
                        fill="transparent"
                        r="70"
                        stroke="currentColor"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        strokeWidth="12"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-purple-600">{offer.aiScore}%</span>
                      <span className="text-xs text-gray-500 font-medium mt-1">
                        {offer.aiScore >= 90 ? "Excellent Match" : offer.aiScore >= 80 ? "Good Match" : "Fair Match"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Insights List */}
                <div className="space-y-4 mb-8">
                  {offer.aiInsights.map((insight, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <span className={`material-icons text-sm mt-1 rounded-full p-0.5 ${
                        insight.positive 
                          ? "text-green-500 bg-green-100" 
                          : "text-gray-400 bg-gray-100"
                      }`}>
                        {insight.positive ? "check" : "remove"}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                        <p className="text-xs text-gray-500 leading-snug">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-md shadow-purple-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                    <span>Apply Now</span>
                    <span className="material-icons-outlined text-lg">arrow_forward</span>
                  </button>
                  <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-2">
                    <span className="material-icons-outlined text-lg">bookmark_border</span>
                    <span>Save for Later</span>
                  </button>
                </div>

                {/* Trust Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <span className="material-icons-outlined text-sm">lock</span>
                    Secure SSL Application • No Impact to Credit Score
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
