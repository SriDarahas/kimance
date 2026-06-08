"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/app/translations/en";
import { fr } from "@/app/translations/fr";

export type Lang = "en" | "fr";
// Use a loose record type so EN and FR strings are both assignable
export type Translations = typeof en;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kimance-lang") as Lang | null;
    if (saved === "en" || saved === "fr") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("kimance-lang", l);
  };

  const t = lang === "fr" ? fr : en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
