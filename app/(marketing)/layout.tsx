"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SmoothScrollProvider } from "@/app/providers/SmoothScrollProvider";
import { Twitter, Linkedin, Facebook } from "lucide-react";

function AnchorLinkHandler() {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      
      e.preventDefault();
      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };
    
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  
  return null;
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <AnchorLinkHandler />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="flex h-24 w-full items-center justify-between">
          <div className="flex items-center pl-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-transparent.png"
                alt="Kimance"
                width={280}
                height={70}
                className="h-[70px] w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-lg font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-lg font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#trust"
              className="text-lg font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="#marketplace"
              className="text-lg font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              Marketplace
            </Link>
          </nav>

          <div className="flex items-center gap-6 pr-4 lg:pr-8">
            <Link
              href="/login"
              className="hidden text-lg font-medium text-gray-600 hover:text-violet-600 sm:block transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-violet-500 px-6 py-3 text-lg font-medium text-white hover:bg-violet-600 transition-colors shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <SmoothScrollProvider>
        <main className="flex-1">{children}</main>
      </SmoothScrollProvider>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Column 1: Brand */}
            <div className="md:col-span-1">
              <Image
                src="/logo-transparent.png"
                alt="Kimance"
                width={140}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert mb-4"
              />
              <p className="text-base text-gray-400 leading-relaxed">
                The AI-powered global fintech platform for seamless international transactions.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-base text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-base text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#marketplace" className="text-base text-gray-400 hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="#exchange" className="text-base text-gray-400 hover:text-white transition-colors">Exchange Rates</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#trust" className="text-base text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-base text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-base text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-base text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Column 4: Connect */}
            <div>
              <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                © {new Date().getFullYear()} Kimance. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
