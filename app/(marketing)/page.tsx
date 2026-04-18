import { Metadata } from "next";
import Hero from "@/app/sections/Hero";
import CurrencyExchange from "@/app/sections/CurrencyExchange";
import Features from "@/app/sections/Features";
import HowItWorks from "@/app/sections/HowItWorks";
import GlobalReach from "@/app/sections/GlobalReach";
import Trust from "@/app/sections/Trust";
import Testimonials from "@/app/sections/Testimonials";
import Pricing from "@/app/sections/Pricing";
import CTA from "@/app/sections/CTA";
import MarketplaceSection from "@/app/sections/Marketplace";
import RateTicker from "@/app/components/RateTicker";

export const metadata: Metadata = {
  title: "Kimance - Global Financial Platform | Send, Store, Exchange",
  description: "Send. Store. Exchange. Protect. Grow. Money without borders. Kimance is the AI-powered global fintech platform for seamless international transactions.",
  keywords: ["fintech", "money transfer", "global payments", "crypto", "multi-currency", "remittance"],
  openGraph: {
    title: "Kimance - Money Without Borders",
    description: "Global financial platform for seamless international transactions",
    type: "website",
  },
};

export default function MarketingPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <RateTicker />
      <CurrencyExchange />
      <Features />
      <MarketplaceSection />
      <HowItWorks />
      <GlobalReach />
      <Trust />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  );
}
