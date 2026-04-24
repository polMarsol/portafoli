"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Locale } from "@/data/translations";

type TranslationValue = string | string[] | object | object[];

function getNestedValue(obj: object, path: string): TranslationValue {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return path;
  }, obj) as TranslationValue;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  tArr: (key: string) => string[];
  tObj: <T>(key: string) => T;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  tArr: () => [],
  tObj: () => ({} as never),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && ["en", "es", "ca"].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    const val = getNestedValue(translations[locale], key);
    return typeof val === "string" ? val : key;
  };

  const tArr = (key: string): string[] => {
    const val = getNestedValue(translations[locale], key);
    return Array.isArray(val) ? (val as string[]) : [];
  };

  const tObj = <T,>(key: string): T => {
    const val = getNestedValue(translations[locale], key);
    return val as T;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tArr, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
