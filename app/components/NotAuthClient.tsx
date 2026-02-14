"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { getTranslation } from "@/lib/i18n";

export default function NotAuthClient() {
  const { language } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

  return <div className="p-6 text-center text-gray-700">{t('notAuthenticated')}</div>;
}
