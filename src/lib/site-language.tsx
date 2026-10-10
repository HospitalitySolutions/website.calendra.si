import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { getLanguageFromPathname, getLocalizedPathname } from "@/lib/localized-routes";

export type SiteLanguage = "sl" | "en";

type SiteLanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
};

const getCurrentPathLanguage = (): SiteLanguage => {
  if (typeof window === "undefined") return "sl";
  return getLanguageFromPathname(window.location.pathname);
};

const SiteLanguageContext = createContext<SiteLanguageContextValue | undefined>(undefined);

export const SiteLanguageProvider = ({ children, initialLanguage }: PropsWithChildren<{ initialLanguage?: SiteLanguage }>) => {
  const [language, setLanguageState] = useState<SiteLanguage>(() => initialLanguage ?? getCurrentPathLanguage());

  const setLanguage = (nextLanguage: SiteLanguage) => {
    if (typeof window === "undefined") {
      setLanguageState(nextLanguage);
      return;
    }

    const nextPath = getLocalizedPathname(window.location.pathname, nextLanguage);
    const nextUrl = `${nextPath}${window.location.search}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl !== currentUrl) {
      window.location.assign(nextUrl);
      return;
    }

    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    // Keep each localized URL stable after its prerendered content is painted.
    // The language selector performs explicit navigation to the other version.
    const pathLanguage = getCurrentPathLanguage();
    setLanguageState(pathLanguage);
    document.documentElement.lang = pathLanguage;
  }, []);

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
