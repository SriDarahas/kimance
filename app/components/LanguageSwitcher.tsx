"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { languages, Language, getTranslation } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center gap-1 bg-white/50 backdrop-blur rounded-full p-1 border border-gray-200">
      {(Object.keys(languages) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            language === lang
              ? "bg-purple-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {languages[lang]}
        </button>
      ))}
      </div>
    </div>
  );
}

export function useTranslation() {
  const { language } = useLanguage();
  return (key: keyof typeof language, vars?: Record<string, string>) => {
    return getTranslation(language, key as any, vars);
  };
}
