"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";
import NotificationBell from "@/app/components/NotificationBell";

export default function WalletsPageHeader() {
  const { language } = useLanguage();
  const t = (key: any, vars?: Record<string, string>) => getTranslation(language, key, vars);

  return (
    <header className="h-20 px-6 hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 py-10">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">{t('myWallets')}</h1>
        <p className="text-sm text-purple-600">{t('manageWallets')}</p>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
      </div>
    </header>
  );
}
