import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

export type SiteLanguage = "sl" | "en";

type SiteLanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
};

const STORAGE_KEY = "calendra-site-language";

const SiteLanguageContext = createContext<SiteLanguageContextValue | undefined>(undefined);

export const SiteLanguageProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useState<SiteLanguage>(() => {
    if (typeof window === "undefined") return "sl";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" ? "en" : "sl";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <SiteLanguageContext.Provider value={value}>{children}</SiteLanguageContext.Provider>;
};

export const useSiteLanguage = () => {
  const context = useContext(SiteLanguageContext);
  if (!context) {
    throw new Error("useSiteLanguage must be used within SiteLanguageProvider.");
  }
  return context;
};
