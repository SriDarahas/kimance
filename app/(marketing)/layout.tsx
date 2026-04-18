"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SmoothScrollProvider, useSmoothScroll } from "@/app/providers/SmoothScrollProvider";
import { LanguageProvider, useLang, type Lang } from "@/app/providers/LanguageContext";
import { Instagram, Linkedin, Facebook, Menu, X } from "lucide-react";

// ─── Scroll helper ────────────────────────────────────────────────────────────

function scrollToSection(id: string, lenis: import("lenis").default | null) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.2, offset: -64 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// ─── Section nav link ─────────────────────────────────────────────────────────

function SectionNavLink({
  section, children, className, onClick,
}: {
  section: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { lenis } = useSmoothScroll();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    if (pathname === "/") {
      scrollToSection(section, lenis);
    } else {
      router.push("/");
      const attempt = (tries: number) => {
        const el = document.getElementById(section);
        if (el) {
          scrollToSection(section, lenis);
        } else if (tries > 0) {
          setTimeout(() => attempt(tries - 1), 120);
        }
      };
      setTimeout(() => attempt(10), 300);
    }
  };

  return (
    <a href={`/#${section}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

// ─── Language toggle button ───────────────────────────────────────────────────

function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const next: Lang = lang === "en" ? "fr" : "en";

  return (
    <button
      onClick={() => setLang(next)}
      className={className}
      aria-label={`Switch to ${next === "fr" ? "French" : "English"}`}
    >
      <span className={lang === "en" ? "font-bold text-gray-900" : "text-gray-400"}>EN</span>
      <span className="text-gray-300 mx-1">|</span>
      <span className={lang === "fr" ? "font-bold text-gray-900" : "text-gray-400"}>FR</span>
    </button>
  );
}

// ─── Desktop nav ──────────────────────────────────────────────────────────────

function DesktopNav() {
  const { t } = useLang();

  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
        {t.nav.about}
      </Link>
      <SectionNavLink section="features" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors cursor-pointer">
        {t.nav.features}
      </SectionNavLink>
      <SectionNavLink section="marketplace" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors cursor-pointer">
        {t.nav.marketplace}
      </SectionNavLink>
      <SectionNavLink section="pricing" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors cursor-pointer">
        {t.nav.pricing}
      </SectionNavLink>
    </nav>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLang();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="flex md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col px-3 pt-4 pb-2 gap-0.5">
          <div className="flex items-center justify-between px-1 mb-2">
            {/* Language toggle inside drawer */}
            <LangToggle className="flex items-center px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition-colors" />
            <button
              onClick={close}
              aria-label="Close menu"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <Link href="/about" onClick={close} className="flex items-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            {t.nav.about}
          </Link>
          <SectionNavLink section="features" onClick={close} className="flex items-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            {t.nav.features}
          </SectionNavLink>
          <SectionNavLink section="marketplace" onClick={close} className="flex items-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            {t.nav.marketplace}
          </SectionNavLink>
          <SectionNavLink section="pricing" onClick={close} className="flex items-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            {t.nav.pricing}
          </SectionNavLink>

          <div className="my-3 mx-4 border-t border-gray-100" />

          <Link href="/login" onClick={close} className="flex items-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            {t.nav.login}
          </Link>
          <Link href="/register" onClick={close} className="flex items-center justify-center mx-1 mt-1 rounded-full bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
            {t.nav.getStarted}
          </Link>
        </nav>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="border-t border-violet-800 bg-violet-900 text-violet-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image src="/logo-transparent.png" alt="Kimance" width={140} height={48} className="h-12 w-auto object-contain brightness-0 invert mb-4" />
            <p className="text-base text-gray-400 leading-relaxed">{f.tagline}</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">{f.company}</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.about}</Link></li>
              <li><Link href="/contact" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.contact}</Link></li>
              <li><Link href="/faq" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.faq}</Link></li>
              <li><Link href="/privacy-policy" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.privacy}</Link></li>
              <li><Link href="/terms" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.terms}</Link></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">{f.product}</h4>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.features}</Link></li>
              <li><Link href="#pricing" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.pricing}</Link></li>
              <li><Link href="#marketplace" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.marketplace}</Link></li>
              <li><Link href="#exchange" className="text-base text-gray-400 hover:text-white transition-colors">{f.links.exchange}</Link></li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">PLATFORM & TRUST</h4>
            <ul className="space-y-3">
              <li><Link href="/technology" className="text-base text-gray-400 hover:text-white transition-colors">Our Technology</Link></li>
              <li><Link href="/trust-security" className="text-base text-gray-400 hover:text-white transition-colors">Trust & Security</Link></li>
              <li><Link href="/investors-partners" className="text-base text-gray-400 hover:text-white transition-colors">Investors & Partners</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-4">{f.connect}</h4>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/kimance_official" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/kimance_official" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/kimance" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-violet-300 mt-6">{f.copyright(new Date().getFullYear())}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
        <div className="flex h-16 w-full items-center justify-between">
          <div className="flex items-center pl-6">
            <Link href="/" className="flex items-center">
              <Image src="/logo-transparent.png" alt="Kimance" width={200} height={50} className="h-[40px] w-auto object-contain" priority />
            </Link>
          </div>

          <DesktopNav />

          <div className="flex items-center gap-2 pr-4">
            {/* Language toggle — desktop only */}
            <LangToggle className="hidden md:flex items-center text-sm px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors mr-1" />

            <Link href="/login" className="hidden md:block text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors mr-2">
              {t.nav.login}
            </Link>
            <Link href="/register" className="hidden md:block rounded-full bg-violet-500 px-5 py-2 text-sm font-medium text-white hover:bg-violet-600 transition-colors shadow-sm hover:shadow-md">
              {t.nav.getStarted}
            </Link>

            <MobileMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <LayoutInner>{children}</LayoutInner>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}
