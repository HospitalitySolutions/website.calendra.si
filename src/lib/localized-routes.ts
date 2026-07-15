import type { SiteLanguage } from "@/lib/site-language";
import { getPublicCompanyProfileFromPathname, getPublicCompanyProfilePath } from "@/lib/public-company-profiles";

export type CanonicalRouteKey =
  | "home"
  | "pricing"
  | "booking"
  | "calendar"
  | "invoicing"
  | "clientManagement"
  | "reminders"
  | "integrations"
  | "connect"
  | "itServices"
  | "itSupport"
  | "websiteDesign"
  | "websiteMaintenance"
  | "businessEmail"
  | "backupsSecurity"
  | "automation"
  | "contact"
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
  booking: { sl: "/narocanje", en: "/en/booking" },
  calendar: { sl: "/koledar-terminov", en: "/en/appointment-calendar" },
  invoicing: { sl: "/racuni-in-placila", en: "/en/invoicing-and-payments" },
  clientManagement: { sl: "/upravljanje-strank", en: "/en/client-management" },
  reminders: { sl: "/sms-opomniki", en: "/en/appointment-reminders" },
  integrations: { sl: "/integracije", en: "/en/integrations" },
  connect: { sl: "/calendra-connect", en: "/en/calendra-connect" },
  itServices: { sl: "/it-storitve", en: "/en/it-services" },
  itSupport: { sl: "/it-podpora-malim-podjetjem", en: "/en/small-business-it-support" },
  websiteDesign: { sl: "/izdelava-spletnih-strani", en: "/en/website-design-and-redesign" },
  websiteMaintenance: { sl: "/vzdrzevanje-spletnih-strani", en: "/en/website-maintenance" },
  businessEmail: { sl: "/poslovna-e-posta", en: "/en/business-email" },
  backupsSecurity: { sl: "/varnostne-kopije-in-it-varnost", en: "/en/backups-and-it-security" },
  automation: { sl: "/avtomatizacije-in-integracije", en: "/en/business-automation-and-integrations" },
  contact: { sl: "/kontakt", en: "/en/contact" },
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
  lastModified?: string;
};

export const sitemapRouteMetadata: Record<CanonicalRouteKey, SitemapRouteMetadata> = {
  home: { changeFrequency: "weekly", priority: { sl: 1, en: 0.9 }, lastModified: "2026-07-15" },
  pricing: { changeFrequency: "weekly", priority: { sl: 0.9, en: 0.8 }, lastModified: "2026-07-15" },
  booking: { changeFrequency: "weekly", priority: { sl: 0.9, en: 0.8 }, lastModified: "2026-07-15" },
  calendar: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  invoicing: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  clientManagement: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  reminders: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  integrations: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  connect: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  itServices: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  itSupport: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, lastModified: "2026-07-15" },
  websiteDesign: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, lastModified: "2026-07-15" },
  websiteMaintenance: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, lastModified: "2026-07-15" },
  businessEmail: { changeFrequency: "monthly", priority: { sl: 0.7, en: 0.6 }, lastModified: "2026-07-15" },
  backupsSecurity: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, lastModified: "2026-07-15" },
  automation: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, lastModified: "2026-07-15" },
  contact: { changeFrequency: "monthly", priority: { sl: 0.6, en: 0.5 }, lastModified: "2026-07-15" },
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
  "/mobilna-aplikacija": canonicalRoutes.connect.sl,
  "/mobile-app": canonicalRoutes.connect.en,
  "/en/mobile-app": canonicalRoutes.connect.en,
  "/stranke": canonicalRoutes.booking.sl,
  "/clients": canonicalRoutes.booking.en,
  "/en/clients": canonicalRoutes.booking.en,
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
  const profile = getPublicCompanyProfileFromPathname(normalized);
  if (profile) return getPublicCompanyProfilePath(profile.slug, getLanguageFromPathname(normalized));

  const legacyTarget = legacyAliases[normalized];
  if (legacyTarget) return legacyTarget;

  const key = getRouteKeyFromPathname(normalized);
  if (!key) return normalized;

  const language = getLanguageFromPathname(normalized);
  return canonicalRoutes[key][language];
};

export const getLocalizedPathname = (pathname: string, language: SiteLanguage) => {
  const profile = getPublicCompanyProfileFromPathname(pathname);
  if (profile) return getPublicCompanyProfilePath(profile.slug, language);

  const key = getRouteKeyFromPathname(pathname);
  if (!key) return language === "en" ? "/en" : "/";
  return canonicalRoutes[key][language];
};

export const getRoutePath = (key: CanonicalRouteKey, language: SiteLanguage) => canonicalRoutes[key][language];

export const getLegacyRedirectTarget = (pathname: string) => legacyAliases[normalizePathname(pathname)];

export const canonicalPathnames = routeEntries.flatMap(([, paths]) => [paths.sl, paths.en]);
