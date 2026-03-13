"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

interface MarketplaceClientProps {
  userName: string;
  userEmail: string;
  isAdmin?: boolean;
}

const categories = [
  { id: "all", label: "All Offers" },
  { id: "insurance", label: "Insurance" },
  { id: "loans", label: "Loans" },
  { id: "crypto", label: "Crypto" },
  { id: "taxes", label: "Taxes" },
  { id: "payments", label: "Payments" },
  { id: "business", label: "Business Tools" },
];

interface OfferStat {
  label: string;
  value: string;
  valueClass?: string;
  labelKey?: string;
}

interface Offer {
  id: number;
  title: string;
  titleKey?: string;
  description: string;
  descriptionKey?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  rating: number | null;
  badge: string | null;
  badgeKey?: string;
  stats: OfferStat[];
  cta: string;
  ctaKey?: string;
  category: string;
}

const offers: Offer[] = [
  {
    id: 1,
    title: "SME Growth Capital",
    titleKey: "smgGrowthCapital",
    description: "Flexible working capital loans for expanding businesses with minimal paperwork.",
    descriptionKey: "smgDescription",
    icon: "account_balance",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    rating: 4.5,
    badge: null,
    stats: [
      { label: "Limit", labelKey: "limit", value: "Up to $50k" },
      { label: "Speed", labelKey: "speed", value: "24h Approval" },
    ],
    cta: "Apply Now",
    ctaKey: "applyNow",
    category: "loans",
  },
  {
    id: 2,
    title: "ETH Native Staking",
    titleKey: "ethStaking",
    description: "Secure institutional-grade staking with daily rewards payout.",
    descriptionKey: "ethDescription",
    icon: "currency_bitcoin",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    rating: null,
    badge: "Trending",
    badgeKey: "trending",
    stats: [
      { label: "APY", labelKey: "apy", value: "4.2%", valueClass: "text-emerald-500" },
      { label: "Custody", labelKey: "custody", value: "Insured" },
    ],
    cta: "Start Staking",
    ctaKey: "startStaking",
    category: "crypto",
  },
  {
    id: 3,
    title: "TurboTax Integration",
    titleKey: "turbotax",
    description: "Automated filing for small business owners. Sync your accounts instantly.",
    descriptionKey: "turbotaxDescription",
    icon: "receipt_long",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    rating: 4.8,
    badge: null,
    stats: [
      { label: "Cost", labelKey: "cost", value: "$0 Setup" },
      { label: "Type", labelKey: "type", value: "SaaS" },
    ],
    cta: "Connect",
    ctaKey: "connect",
    category: "taxes",
  },
  {
    id: 4,
    title: "Nova Business Checking",
    titleKey: "nova",
    description: "Fee-free business banking with integrated invoicing and expense cards.",
    descriptionKey: "novaDescription",
    icon: "payments",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    rating: null,
    badge: "New",
    badgeKey: "new",
    stats: [
      { label: "Fees", labelKey: "fees", value: "$0/mo", valueClass: "text-emerald-500" },
      { label: "Cashback", labelKey: "cashback", value: "1.5%" },
    ],
    cta: "Open Account",
    ctaKey: "openAccount",
    category: "payments",
  },
  {
    id: 5,
    title: "Rapid Invoice Factor",
    titleKey: "rapidInvoice",
    description: "Get paid for your outstanding invoices today. Ideal for cash flow gaps.",
    descriptionKey: "rapidInvoiceDescription",
    icon: "request_quote",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    rating: 4.2,
    badge: null,
    stats: [
      { label: "Rate", labelKey: "rate", value: "1.5% fee" },
      { label: "Funding", labelKey: "funding", value: "Same Day" },
    ],
    cta: "Factor Now",
    ctaKey: "factorNow",
    category: "loans",
  },
  {
    id: 6,
    title: "Brex Corporate Card",
    titleKey: "brex",
    description: "Higher limits, no personal guarantee, and rewards on software.",
    descriptionKey: "brexDescription",
    icon: "credit_card",
    iconBg: "bg-gray-900",
    iconColor: "text-white",
    rating: 4.9,
    badge: null,
    stats: [
      { label: "Credit", labelKey: "credit", value: "Dynamic" },
      { label: "Rewards", labelKey: "rewards", value: "7x Points" },
    ],
    cta: "Apply",
    ctaKey: "applyNow",
    category: "business",
  },
];

export default function MarketplaceClient({ userName, userEmail, isAdmin = false }: MarketplaceClientProps) {
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);
  const mobileHeader = (
    <div className="flex flex-col">
      <span className="font-serif text-lg font-bold text-gray-900 leading-tight">{t('marketplace')}</span>
      <span className="text-purple-600 text-xs font-normal">{t('exploreFinancialTools')}</span>
    </div>
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = offers.filter((offer) => {
    const matchesCategory = activeCategory === "all" || offer.category === activeCategory;
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen flex overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} isAdmin={isAdmin} mobileHeader={mobileHeader} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 py-10">
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {t('marketplace')}
            </h1>
            <p className="text-purple-600 text-sm font-normal">{t('exploreFinancialTools')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-purple-600 transition-colors relative shadow-sm">
              <span className="material-icons-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Marketplace Content */}
        <div className="p-6 max-w-6xl mx-auto w-full space-y-8 mt-15">
          {/* Hero Search Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              {t('findBestTools')}
            </h2>
            <p className="text-purple-600 text-sm font-normal mb-6">
              {t('exploreTailored')}
            </p>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-icons-outlined text-gray-400">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 shadow-lg shadow-purple-500/5 focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                placeholder={t('searchPlaceholder')}
              />
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100 overflow-hidden relative">
            {/* Decorative gradient blob */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
              <div className="shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wide mb-3">
                  <span className="material-icons-outlined text-sm">auto_awesome</span>
                  {t('aiRecommendation')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('bestOfferProfile')}</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  {t('profileAnalysis')}
                </p>
              </div>
              {/* Recommended Card */}
              <div className="grow w-full md:w-auto">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-icons-outlined text-blue-600">shield</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{t('termLifeProtect')}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Allianz</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>$500k {t('coverage')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 font-medium uppercase">{t('aiFitScore')}</div>
                      <div className="text-xl font-bold text-purple-600">92%</div>
                    </div>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                    <div className="text-center hidden sm:block">
                      <div className="text-xs text-gray-400 font-medium uppercase">{t('monthly')}</div>
                      <div className="text-xl font-bold text-gray-900">$24</div>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-purple-500/20">
                      {t('viewOffer')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Navigation — #36: Full-width buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all text-center ${
                  activeCategory === category.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600"
                }`}
              >
                {t(category.id === 'all' ? 'allOffers' : category.id === 'business' ? 'businessTools' : category.id)}
              </button>
            ))}
          </div>

          {/* Featured Offers Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{t('featuredOffers')}</h3>
            <div className="flex gap-2">
              <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-purple-600">
                <span className="material-icons-outlined">grid_view</span>
              </button>
              <button className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-purple-600">
                <span className="material-icons-outlined">list</span>
              </button>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <Link
                key={offer.id}
                href={`/marketplace/${offer.id}`}
                className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-purple-500/5 hover:border-purple-200 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${offer.iconBg} rounded-lg flex items-center justify-center`}>
                    <span className={`material-icons-outlined ${offer.iconColor}`}>{offer.icon}</span>
                  </div>
                  {offer.rating && (
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                      <span>{offer.rating}</span>
                      <span className="material-icons text-xs text-yellow-500">star</span>
                    </div>
                  )}
                  {offer.badge && (
                    <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded text-xs font-semibold text-purple-600">
                      <span>{offer.badgeKey ? t(offer.badgeKey) : offer.badge}</span>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {offer.titleKey ? t(offer.titleKey) : offer.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{offer.descriptionKey ? t(offer.descriptionKey) : offer.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
                  {offer.stats.map((stat, index) => (
                    <div key={index}>
                      <p className="text-xs text-gray-400 uppercase font-medium">{stat.labelKey ? t(stat.labelKey) : stat.label}</p>
                      <p className={`font-bold ${stat.valueClass || "text-gray-900"}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <span className="w-full block text-center bg-white border border-gray-200 text-gray-900 py-2.5 rounded-lg font-semibold group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all">
                    {offer.ctaKey ? t(offer.ctaKey) : offer.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-4">
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Load More Offers
              <span className="material-icons-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link 
        href="/marketplace/post"
        className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-full shadow-lg shadow-purple-500/30 flex items-center gap-2 font-semibold transition-all hover:scale-105"
      >
        <span className="material-icons-outlined text-xl">add</span>
        <span>Post a Listing</span>
      </Link>
    </div>
  );
}
