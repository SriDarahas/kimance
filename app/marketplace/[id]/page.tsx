import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MarketplaceDetailClient from "./MarketplaceDetailClient";

const offers = [
  {
    id: "1",
    slug: "sme-growth-capital",
    title: "SME Growth Capital",
    provider: "Sterling Horizon Bank",
    category: "Term Loan",
    description: "Flexible working capital loans for expanding businesses with minimal paperwork.",
    longDescription: "Designed specifically for established small businesses looking to expand inventory, purchase equipment, or refinance debt. SME Growth Capital offers competitive fixed rates and predictable monthly payments to help you manage cash flow effectively while scaling operations.",
    icon: "account_balance",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    rating: 4.5,
    stats: {
      apr: "5.5% - 8.2%",
      amount: "$10k - $50k",
      term: "12 - 24 Mo",
    },
    features: [
      { icon: "speed", title: "Fast Funding", description: "Decisions in as little as 24 hours, funding in 3 days." },
      { icon: "lock", title: "Fixed Rates", description: "Lock in your rate for the life of the loan so you can plan ahead." },
    ],
    eligibility: [
      { title: "Time in Business", requirement: "Minimum 1 Year required", status: "pass" },
      { title: "Annual Revenue", requirement: "$50k+ Annual Revenue", status: "pass" },
      { title: "Credit Score", requirement: "620+ FICO Recommended", status: "borderline" },
    ],
    aiScore: 95,
    aiInsights: [
      { positive: true, title: "Cash Flow Velocity", description: "Repayment schedule aligns perfectly with your projected monthly receivables." },
      { positive: true, title: "Low Risk Profile", description: "Your industry volatility is low compared to this lender's preferences." },
      { positive: false, title: "Collateral Requirement", description: "Requires UCC-1 lien, standard for this term length." },
    ],
  },
  {
    id: "2",
    slug: "eth-native-staking",
    title: "ETH Native Staking",
    provider: "CryptoVault Pro",
    category: "Crypto Staking",
    description: "Secure institutional-grade staking with daily rewards payout.",
    longDescription: "Earn passive income on your Ethereum holdings with our institutional-grade staking solution. Your assets are secured with multi-signature wallets and comprehensive insurance coverage, while you enjoy daily rewards directly to your account.",
    icon: "currency_bitcoin",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    rating: null,
    stats: {
      apr: "4.2% APY",
      amount: "No minimum",
      term: "Flexible",
    },
    features: [
      { icon: "security", title: "Insured Custody", description: "Your assets are protected with comprehensive insurance coverage." },
      { icon: "payments", title: "Daily Rewards", description: "Receive staking rewards directly to your wallet every 24 hours." },
    ],
    eligibility: [
      { title: "KYC Verification", requirement: "Identity verification required", status: "pass" },
      { title: "Minimum Stake", requirement: "0.1 ETH minimum", status: "pass" },
      { title: "Lock Period", requirement: "No lock-up required", status: "pass" },
    ],
    aiScore: 88,
    aiInsights: [
      { positive: true, title: "Portfolio Diversification", description: "Adds crypto exposure to your investment portfolio." },
      { positive: true, title: "Passive Income", description: "Generates consistent returns without active management." },
      { positive: false, title: "Market Volatility", description: "ETH price fluctuations may affect total returns." },
    ],
  },
  {
    id: "3",
    slug: "turbotax-integration",
    title: "TurboTax Integration",
    provider: "Intuit",
    category: "Tax Software",
    description: "Automated filing for small business owners. Sync your accounts instantly.",
    longDescription: "Streamline your tax preparation with seamless TurboTax integration. Automatically import your financial data, categorize expenses, and file your taxes with confidence. Perfect for freelancers and small business owners looking to save time and maximize deductions.",
    icon: "receipt_long",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    rating: 4.8,
    stats: {
      apr: "$0 Setup",
      amount: "From $89/year",
      term: "Annual",
    },
    features: [
      { icon: "sync", title: "Auto-Sync", description: "Automatically import transactions from connected bank accounts." },
      { icon: "calculate", title: "Smart Deductions", description: "AI-powered deduction finder to maximize your returns." },
    ],
    eligibility: [
      { title: "Account Type", requirement: "Individual or Business", status: "pass" },
      { title: "Region", requirement: "Canada & US supported", status: "pass" },
      { title: "Bank Connection", requirement: "Major banks supported", status: "pass" },
    ],
    aiScore: 92,
    aiInsights: [
      { positive: true, title: "Time Savings", description: "Reduces tax prep time by up to 80% with auto-import." },
      { positive: true, title: "Accuracy", description: "Built-in error checking minimizes audit risk." },
      { positive: false, title: "Learning Curve", description: "Some features require initial setup time." },
    ],
  },
  {
    id: "4",
    slug: "nova-business-checking",
    title: "Nova Business Checking",
    provider: "Nova Financial",
    category: "Business Banking",
    description: "Fee-free business banking with integrated invoicing and expense cards.",
    longDescription: "Modern business banking designed for the digital age. Nova Business Checking offers zero monthly fees, unlimited transactions, integrated invoicing, and expense management cards for your team. Built-in accounting integrations make bookkeeping effortless.",
    icon: "payments",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    rating: null,
    stats: {
      apr: "$0/month",
      amount: "No minimums",
      term: "1.5% Cashback",
    },
    features: [
      { icon: "credit_card", title: "Team Cards", description: "Issue expense cards to employees with custom spending limits." },
      { icon: "receipt", title: "Smart Invoicing", description: "Create and send professional invoices in seconds." },
    ],
    eligibility: [
      { title: "Business Type", requirement: "LLC, Corp, or Sole Prop", status: "pass" },
      { title: "Documentation", requirement: "EIN or SSN required", status: "pass" },
      { title: "Credit Check", requirement: "Soft pull only", status: "pass" },
    ],
    aiScore: 94,
    aiInsights: [
      { positive: true, title: "Cost Savings", description: "No monthly fees saves $200+ annually vs traditional banks." },
      { positive: true, title: "Cash Flow", description: "1.5% cashback improves your effective margins." },
      { positive: false, title: "Branch Access", description: "Online-only, no physical branch locations." },
    ],
  },
  {
    id: "5",
    slug: "rapid-invoice-factor",
    title: "Rapid Invoice Factor",
    provider: "FactorNow",
    category: "Invoice Factoring",
    description: "Get paid for your outstanding invoices today. Ideal for cash flow gaps.",
    longDescription: "Turn your unpaid invoices into immediate working capital. Rapid Invoice Factor advances up to 90% of your invoice value within hours, not weeks. Perfect for businesses with reliable customers but extended payment terms causing cash flow constraints.",
    icon: "request_quote",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    rating: 4.2,
    stats: {
      apr: "1.5% fee",
      amount: "Up to 90%",
      term: "Same Day",
    },
    features: [
      { icon: "bolt", title: "Same-Day Funding", description: "Get funds in your account within hours of approval." },
      { icon: "account_balance", title: "Non-Recourse", description: "We assume the risk if your customer doesn't pay." },
    ],
    eligibility: [
      { title: "Invoice Type", requirement: "B2B invoices only", status: "pass" },
      { title: "Invoice Age", requirement: "Less than 90 days old", status: "pass" },
      { title: "Customer Credit", requirement: "Creditworthy customers", status: "borderline" },
    ],
    aiScore: 87,
    aiInsights: [
      { positive: true, title: "Immediate Liquidity", description: "Converts receivables to cash within 24 hours." },
      { positive: true, title: "Growth Enabler", description: "Funds new projects without waiting for payment." },
      { positive: false, title: "Cost Consideration", description: "1.5% fee higher than traditional financing for long terms." },
    ],
  },
  {
    id: "6",
    slug: "brex-corporate-card",
    title: "Brex Corporate Card",
    provider: "Brex",
    category: "Corporate Card",
    description: "Higher limits, no personal guarantee, and rewards on software.",
    longDescription: "The corporate card built for startups and growing businesses. Brex offers 10-20x higher limits than traditional cards, requires no personal guarantee, and provides industry-leading rewards on the categories that matter most to your business.",
    icon: "credit_card",
    iconBg: "bg-gray-900",
    iconColor: "text-white",
    rating: 4.9,
    stats: {
      apr: "0% APR",
      amount: "Dynamic limits",
      term: "7x Points",
    },
    features: [
      { icon: "trending_up", title: "Dynamic Limits", description: "Credit limits grow automatically with your business." },
      { icon: "card_giftcard", title: "Premium Rewards", description: "7x points on rideshare, 4x on travel, 3x on restaurants." },
    ],
    eligibility: [
      { title: "Business Type", requirement: "C-Corp or LLC", status: "pass" },
      { title: "Bank Balance", requirement: "$50k+ in business bank", status: "borderline" },
      { title: "Revenue", requirement: "Some revenue preferred", status: "pass" },
    ],
    aiScore: 91,
    aiInsights: [
      { positive: true, title: "No Personal Guarantee", description: "Protects your personal credit and assets." },
      { positive: true, title: "Expense Management", description: "Built-in tools for receipt capture and categorization." },
      { positive: false, title: "Funding Requirement", description: "Requires maintaining minimum bank balance." },
    ],
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MarketplaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const offer = offers.find((o) => o.id === id || o.slug === id);
  
  if (!offer) {
    notFound();
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';

  return <MarketplaceDetailClient userName={userName} userEmail={userEmail} offer={offer as any} />;
}
