import type { SiteLanguage } from "@/lib/site-language";

export type CanonicalRouteKey =
  | "home"
  | "pricing"
  | "clients"
  | "booking"
  | "support"
  | "privacy"
  | "terms"
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
  zoom: { sl: "/zoom-integracija", en: "/en/zoom-integration" },
  aiTransparency: { sl: "/ai-transparentnost", en: "/en/ai-transparency" },
  accountDeletion: { sl: "/izbris-racuna", en: "/en/account-deletion" },
};

const routeEntries = Object.entries(canonicalRoutes) as Array<[CanonicalRouteKey, Record<SiteLanguage, string>]>;

const legacyAliases: Record<string, string> = {
  "/pricing": canonicalRoutes.pricing.en,
  "/clients": canonicalRoutes.clients.en,
  "/booking": canonicalRoutes.booking.en,
  "/support": canonicalRoutes.support.en,
  "/privacy-policy": canonicalRoutes.privacy.en,
  "/terms-of-service": canonicalRoutes.terms.en,
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
