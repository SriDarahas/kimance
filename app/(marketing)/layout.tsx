import Link from "next/link";
import Image from "next/image";
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
        <div className="flex h-24 w-full items-center justify-between">
          <div className="flex items-center pl-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-transparent.png"
                alt="Kimance"
                width={200}
                height={50}
                className="h-[45px] w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-base font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-base font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-6 pr-4 lg:pr-8">
            <Link
              href="/login"
              className="hidden text-base font-medium text-gray-600 hover:text-violet-600 sm:block transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-violet-500 px-6 py-3 text-base font-medium text-white hover:bg-violet-600 transition-colors shadow-sm hover:shadow-md"
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
              <Image
                src="/logo-transparent.png"
                alt="Kimance"
                width={64}
                height={16}
                className="h-9 w-auto object-contain"
              />
              <span className="text-sm font-medium text-gray-500">
                © {new Date().getFullYear()} Kimance. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-violet-600">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-violet-600">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-violet-600">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
