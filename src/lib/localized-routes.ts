import type { SiteLanguage } from "@/lib/site-language";

export type CanonicalRouteKey =
  | "home"
  | "pricing"
  | "clients"
  | "booking"
  | "support"
  | "privacy"
  | "terms"
  | "legal"
  | "dpa"
  | "subprocessors"
  | "cookies"
  | "security"
  | "dataRights"
  | "zoom"
  | "aiTransparency"
  | "accountDeletion";

export const canonicalRoutes: Record<CanonicalRouteKey, Record<SiteLanguage, string>> = {
  home: { sl: "/", en: "/en" },
  pricing: { sl: "/cenik", en: "/en/pricing" },
  clients: { sl: "/stranke", en: "/en/clients" },
  booking: { sl: "/narocanje", en: "/en/booking" },
  support: { sl: "/podpora", en: "/en/support" },
  privacy: { sl: "/zasebnost", en: "/en/privacy-policy" },
  terms: { sl: "/pogoji-uporabe", en: "/en/terms-of-service" },
  legal: { sl: "/pravno", en: "/en/legal" },
  dpa: { sl: "/pogodba-o-obdelavi-podatkov", en: "/en/data-processing-agreement" },
  subprocessors: { sl: "/podobdelovalci", en: "/en/subprocessors" },
  cookies: { sl: "/piskotki", en: "/en/cookie-policy" },
  security: { sl: "/varnost", en: "/en/security" },
  dataRights: { sl: "/pravice-posameznikov", en: "/en/data-rights" },
  zoom: { sl: "/zoom-integracija", en: "/en/zoom-integration" },
  aiTransparency: { sl: "/ai-transparentnost", en: "/en/ai-transparency" },
  accountDeletion: { sl: "/izbris-racuna", en: "/en/account-deletion" },
};

export type SitemapChangeFrequency = "weekly" | "monthly" | "yearly";

export type SitemapRouteMetadata = {
  changeFrequency: SitemapChangeFrequency;
  priority: Record<SiteLanguage, number>;
  /**
   * Set this only when the visible page content or other search-relevant page
   * information changes meaningfully. The sitemap generator omits lastmod
   * when no accurate date is available.
   */
  lastModified?: string;
};

export const sitemapRouteMetadata: Record<CanonicalRouteKey, SitemapRouteMetadata> = {
  home: { changeFrequency: "weekly", priority: { sl: 1, en: 0.9 }, lastModified: "2026-07-15" },
  pricing: { changeFrequency: "weekly", priority: { sl: 0.9, en: 0.8 }, lastModified: "2026-07-15" },
  clients: { changeFrequency: "weekly", priority: { sl: 0.8, en: 0.7 } },
  booking: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  support: { changeFrequency: "monthly", priority: { sl: 0.6, en: 0.5 } },
  privacy: { changeFrequency: "yearly", priority: { sl: 0.4, en: 0.4 } },
  terms: { changeFrequency: "yearly", priority: { sl: 0.4, en: 0.4 } },
  legal: { changeFrequency: "yearly", priority: { sl: 0.4, en: 0.4 } },
  dpa: { changeFrequency: "yearly", priority: { sl: 0.3, en: 0.3 } },
  subprocessors: { changeFrequency: "yearly", priority: { sl: 0.3, en: 0.3 } },
  cookies: { changeFrequency: "yearly", priority: { sl: 0.3, en: 0.3 } },
  security: { changeFrequency: "yearly", priority: { sl: 0.3, en: 0.3 } },
  dataRights: { changeFrequency: "yearly", priority: { sl: 0.3, en: 0.3 } },
  zoom: { changeFrequency: "yearly", priority: { sl: 0.4, en: 0.4 } },
  aiTransparency: { changeFrequency: "yearly", priority: { sl: 0.3, en: 0.3 } },
  accountDeletion: { changeFrequency: "yearly", priority: { sl: 0.1, en: 0.1 } },
};

const routeEntries = Object.entries(canonicalRoutes) as Array<[CanonicalRouteKey, Record<SiteLanguage, string>]>;

const legacyAliases: Record<string, string> = {
  "/pricing": canonicalRoutes.pricing.en,
  "/clients": canonicalRoutes.clients.en,
  "/booking": canonicalRoutes.booking.en,
  "/support": canonicalRoutes.support.en,
  "/privacy-policy": canonicalRoutes.privacy.en,
  "/terms-of-service": canonicalRoutes.terms.en,
  "/legal": canonicalRoutes.legal.en,
  "/data-processing-agreement": canonicalRoutes.dpa.en,
  "/dpa": canonicalRoutes.dpa.en,
  "/subprocessors": canonicalRoutes.subprocessors.en,
  "/cookie-policy": canonicalRoutes.cookies.en,
  "/cookies": canonicalRoutes.cookies.en,
  "/security": canonicalRoutes.security.en,
  "/data-rights": canonicalRoutes.dataRights.en,
  "/zoom": canonicalRoutes.zoom.en,
  "/zoom-integration": canonicalRoutes.zoom.en,
  "/ai-transparency": canonicalRoutes.aiTransparency.en,
  "/account-deletion": canonicalRoutes.accountDeletion.en,
};

export const stripTrailingSlash = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

export const normalizePathname = (pathname: string) => stripTrailingSlash(pathname.split("?")[0].split("#")[0] || "/");

export const getLanguageFromPathname = (pathname: string): SiteLanguage => {
  const normalized = normalizePathname(pathname);
  return normalized === "/en" || normalized.startsWith("/en/") ? "en" : "sl";
};

export const getRouteKeyFromPathname = (pathname: string): CanonicalRouteKey | undefined => {
  const normalized = normalizePathname(pathname);
  const canonicalMatch = routeEntries.find(([, paths]) => paths.sl === normalized || paths.en === normalized);
  if (canonicalMatch) return canonicalMatch[0];

  const legacyTarget = legacyAliases[normalized];
  if (!legacyTarget) return undefined;
  return routeEntries.find(([, paths]) => paths.sl === legacyTarget || paths.en === legacyTarget)?.[0];
};

export const getCanonicalPathname = (pathname: string) => {
  const normalized = normalizePathname(pathname);
  const legacyTarget = legacyAliases[normalized];
  if (legacyTarget) return legacyTarget;

  const key = getRouteKeyFromPathname(normalized);
  if (!key) return normalized;

  const language = getLanguageFromPathname(normalized);
  return canonicalRoutes[key][language];
};

export const getLocalizedPathname = (pathname: string, language: SiteLanguage) => {
  const key = getRouteKeyFromPathname(pathname);
  if (!key) return language === "en" ? "/en" : "/";
  return canonicalRoutes[key][language];
};

export const getRoutePath = (key: CanonicalRouteKey, language: SiteLanguage) => canonicalRoutes[key][language];

export const getLegacyRedirectTarget = (pathname: string) => legacyAliases[normalizePathname(pathname)];

export const canonicalPathnames = routeEntries.flatMap(([, paths]) => [paths.sl, paths.en]);
