import Link from "next/link";
import React from "react";
import { SmoothScrollProvider } from "@/app/providers/SmoothScrollProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <span className="font-display text-xl font-bold">K</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-gray-900">
                Kimance
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-gray-600 hover:text-emerald-600 sm:block transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md"
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
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-gray-600">
                <span className="font-display text-xs font-bold">K</span>
              </div>
              <span className="text-sm font-medium text-gray-500">
                © {new Date().getFullYear()} Kimance. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
