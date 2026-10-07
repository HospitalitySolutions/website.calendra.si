import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { getLanguageFromPathname, getLocalizedPathname, normalizePathname } from "@/lib/localized-routes";

export type SiteLanguage = "sl" | "en";

type SiteLanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
};

const STORAGE_KEY = "calendra-site-language";
const SLOVENIA_TIME_ZONE = "Europe/Ljubljana";

const isSiteLanguage = (value: string | null): value is SiteLanguage => value === "sl" || value === "en";

export const inferPreferredSiteLanguage = (languages: readonly string[], timeZone?: string): SiteLanguage => {
  if (timeZone === SLOVENIA_TIME_ZONE) return "sl";

  const primaryLanguage = languages.find(Boolean)?.toLowerCase();
  return primaryLanguage === "sl" || primaryLanguage?.startsWith("sl-") ? "sl" : "en";
};

const getCurrentPathLanguage = (): SiteLanguage => {
  if (typeof window === "undefined") return "sl";
  return getLanguageFromPathname(window.location.pathname);
};

const getStoredLanguage = (): SiteLanguage | undefined => {
  if (typeof window === "undefined") return undefined;

  try {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
    return isSiteLanguage(storedLanguage) ? storedLanguage : undefined;
  } catch {
    return undefined;
  }
};

const storeLanguage = (language: SiteLanguage) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage can be unavailable in locked-down/private browsing contexts.
  }
};

const detectBrowserLanguage = (): SiteLanguage => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "sl";

  const languages =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];

  let timeZone: string | undefined;
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    timeZone = undefined;
  }

  return inferPreferredSiteLanguage(languages, timeZone);
};

const SiteLanguageContext = createContext<SiteLanguageContextValue | undefined>(undefined);

export const SiteLanguageProvider = ({ children, initialLanguage }: PropsWithChildren<{ initialLanguage?: SiteLanguage }>) => {
  const [language, setLanguageState] = useState<SiteLanguage>(() => initialLanguage ?? getCurrentPathLanguage());

  const setLanguage = (nextLanguage: SiteLanguage) => {
    if (typeof window === "undefined") {
      setLanguageState(nextLanguage);
      return;
    }

    storeLanguage(nextLanguage);

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
    const pathLanguage = getCurrentPathLanguage();
    const normalizedPath = normalizePathname(window.location.pathname);

    if (normalizedPath === "/") {
      const preferredLanguage = getStoredLanguage() ?? detectBrowserLanguage();
      storeLanguage(preferredLanguage);

      if (preferredLanguage === "en") {
        window.location.replace(`/en${window.location.search}${window.location.hash}`);
        return;
      }
    }

    setLanguageState(pathLanguage);
    document.documentElement.lang = pathLanguage;
    storeLanguage(pathLanguage);
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
