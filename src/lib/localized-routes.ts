import type { SiteLanguage } from "@/lib/site-language";
import { getArticleAlternates, getArticleFromPathname, getBlogArticlePath } from "@/lib/blog";
import { getPublicCompanyProfilePath, getPublicProviderSlugFromPathname } from "@/lib/public-company-profiles";
import { getCustomerStoryFromPathname, getCustomerStoryPath } from "@/lib/customer-stories";

export type CanonicalRouteKey =
  | "home"
  | "pricing"
  | "booking"
  | "customers"
  | "businesses"
  | "customerStories"
  | "demo"
  | "calendar"
  | "invoicing"
  | "clientManagement"
  | "reminders"
  | "integrations"
  | "materialManagement"
  | "beautyHair"
  | "consultantsEducators"
  | "healthWellbeing"
  | "fitnessGroups"
  | "hairSalons"
  | "beautySalons"
  | "massage"
  | "spaSauna"
  | "tattooPiercing"
  | "fitnessPersonalTraining"
  | "physiotherapy"
  | "psychologyCounselling"
  | "yogaPilates"
  | "petServices"
  | "educationCoaching"
  | "otherServices"
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
  | "blog"
  | "author"
  | "aiTransparency"
  | "accountDeletion";

export const canonicalRoutes: Record<CanonicalRouteKey, Record<SiteLanguage, string>> = {
  home: { sl: "/", en: "/en" },
  pricing: { sl: "/cenik", en: "/en/pricing" },
  booking: { sl: "/narocanje", en: "/en/booking" },
  customers: { sl: "/za-stranke", en: "/en/for-customers" },
  businesses: { sl: "/ponudniki", en: "/en/providers" },
  customerStories: { sl: "/zgodbe-strank", en: "/en/customer-stories" },
  demo: { sl: "/predstavitev", en: "/en/demo" },
  calendar: { sl: "/koledar-terminov", en: "/en/appointment-calendar" },
  invoicing: { sl: "/racuni-in-placila", en: "/en/invoicing-and-payments" },
  clientManagement: { sl: "/upravljanje-strank", en: "/en/client-management" },
  reminders: { sl: "/sms-opomniki", en: "/en/appointment-reminders" },
  integrations: { sl: "/integracije", en: "/en/integrations" },
  materialManagement: { sl: "/materialno-poslovanje", en: "/en/inventory-management" },
  beautyHair: { sl: "/za-lepotne-in-frizerske-salone", en: "/en/for-beauty-and-hair-salons" },
  consultantsEducators: { sl: "/za-svetovalce-in-izobrazevalce", en: "/en/for-consultants-and-educators" },
  healthWellbeing: { sl: "/za-zdravje-in-dobro-pocutje", en: "/en/for-health-and-wellbeing" },
  fitnessGroups: { sl: "/za-fitnes-in-skupinske-storitve", en: "/en/for-fitness-and-group-services" },
  hairSalons: { sl: "/za-frizerske-salone", en: "/en/for-hair-salons" },
  beautySalons: { sl: "/za-kozmeticne-salone", en: "/en/for-beauty-salons" },
  massage: { sl: "/za-masazne-salone", en: "/en/for-massage-businesses" },
  spaSauna: { sl: "/za-spa-in-savne", en: "/en/for-spas-and-saunas" },
  tattooPiercing: { sl: "/za-tetoviranje-in-piercing", en: "/en/for-tattoo-and-piercing-studios" },
  fitnessPersonalTraining: { sl: "/za-fitnes-in-osebno-trenerstvo", en: "/en/for-fitness-and-personal-training" },
  physiotherapy: { sl: "/za-fizioterapijo", en: "/en/for-physiotherapy" },
  psychologyCounselling: { sl: "/za-psihologijo-in-svetovanje", en: "/en/for-psychology-and-counselling" },
  yogaPilates: { sl: "/za-jogo-in-pilates", en: "/en/for-yoga-and-pilates" },
  petServices: { sl: "/za-storitve-za-hisne-ljubljencke", en: "/en/for-pet-services" },
  educationCoaching: { sl: "/za-izobrazevanje-in-coaching", en: "/en/for-education-and-coaching" },
  otherServices: { sl: "/za-druge-storitve", en: "/en/for-other-service-businesses" },
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
  blog: { sl: "/blog", en: "/en/blog" },
  author: { sl: "/avtor/david-mirc", en: "/en/author/david-mirc" },
  aiTransparency: { sl: "/ai-transparentnost", en: "/en/ai-transparency" },
  accountDeletion: { sl: "/izbris-racuna", en: "/en/account-deletion" },
};

export type SitemapChangeFrequency = "weekly" | "monthly" | "yearly";

export type SitemapRouteMetadata = {
  changeFrequency: SitemapChangeFrequency;
  priority: Record<SiteLanguage, number>;
  contentLastModified?: string;
};

/**
 * Shared markup/navigation changes can materially change every indexable page.
 * Keep this explicit rather than using the build date: sitemap <lastmod> should
 * only move when a page (or shared page output) changes meaningfully.
 */
export const SHARED_SITE_LAST_MODIFIED = "2026-08-13";

export const getSitemapLastModified = (contentLastModified?: string) => {
  if (!contentLastModified) return SHARED_SITE_LAST_MODIFIED;
  return contentLastModified > SHARED_SITE_LAST_MODIFIED ? contentLastModified : SHARED_SITE_LAST_MODIFIED;
};

export const sitemapRouteMetadata: Record<CanonicalRouteKey, SitemapRouteMetadata> = {
  home: { changeFrequency: "weekly", priority: { sl: 1, en: 0.9 }, contentLastModified: "2026-07-15" },
  pricing: { changeFrequency: "weekly", priority: { sl: 0.9, en: 0.8 }, contentLastModified: "2026-07-15" },
  booking: { changeFrequency: "weekly", priority: { sl: 0.9, en: 0.8 }, contentLastModified: "2026-08-11" },
  customers: { changeFrequency: "weekly", priority: { sl: 0.9, en: 0.8 }, contentLastModified: "2026-08-13" },
  businesses: { changeFrequency: "weekly", priority: { sl: 0.75, en: 0.65 }, contentLastModified: "2026-08-11" },
  customerStories: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-08-11" },
  demo: { changeFrequency: "weekly", priority: { sl: 0.8, en: 0.75 }, contentLastModified: "2026-07-22" },
  calendar: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-08-11" },
  invoicing: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-08-11" },
  clientManagement: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-08-11" },
  reminders: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-08-11" },
  integrations: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-07-15" },
  materialManagement: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-08-12" },
  beautyHair: { changeFrequency: "monthly", priority: { sl: 0.85, en: 0.75 }, contentLastModified: "2026-08-11" },
  consultantsEducators: { changeFrequency: "monthly", priority: { sl: 0.85, en: 0.75 }, contentLastModified: "2026-07-15" },
  healthWellbeing: { changeFrequency: "monthly", priority: { sl: 0.85, en: 0.75 }, contentLastModified: "2026-07-15" },
  fitnessGroups: { changeFrequency: "monthly", priority: { sl: 0.85, en: 0.75 }, contentLastModified: "2026-08-11" },
  hairSalons: { changeFrequency: "monthly", priority: { sl: 0.84, en: 0.74 }, contentLastModified: "2026-08-17" },
  beautySalons: { changeFrequency: "monthly", priority: { sl: 0.84, en: 0.74 }, contentLastModified: "2026-08-17" },
  massage: { changeFrequency: "monthly", priority: { sl: 0.82, en: 0.72 }, contentLastModified: "2026-08-17" },
  spaSauna: { changeFrequency: "monthly", priority: { sl: 0.82, en: 0.72 }, contentLastModified: "2026-08-17" },
  tattooPiercing: { changeFrequency: "monthly", priority: { sl: 0.82, en: 0.72 }, contentLastModified: "2026-08-17" },
  fitnessPersonalTraining: { changeFrequency: "monthly", priority: { sl: 0.84, en: 0.74 }, contentLastModified: "2026-08-17" },
  physiotherapy: { changeFrequency: "monthly", priority: { sl: 0.84, en: 0.74 }, contentLastModified: "2026-08-17" },
  psychologyCounselling: { changeFrequency: "monthly", priority: { sl: 0.84, en: 0.74 }, contentLastModified: "2026-08-17" },
  yogaPilates: { changeFrequency: "monthly", priority: { sl: 0.84, en: 0.74 }, contentLastModified: "2026-08-17" },
  petServices: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-08-17" },
  educationCoaching: { changeFrequency: "monthly", priority: { sl: 0.82, en: 0.72 }, contentLastModified: "2026-08-17" },
  otherServices: { changeFrequency: "monthly", priority: { sl: 0.72, en: 0.62 }, contentLastModified: "2026-08-17" },
  connect: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-07-15" },
  itServices: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-07-15" },
  itSupport: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, contentLastModified: "2026-07-15" },
  websiteDesign: { changeFrequency: "monthly", priority: { sl: 0.8, en: 0.7 }, contentLastModified: "2026-07-15" },
  websiteMaintenance: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, contentLastModified: "2026-07-15" },
  businessEmail: { changeFrequency: "monthly", priority: { sl: 0.7, en: 0.6 }, contentLastModified: "2026-07-15" },
  backupsSecurity: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, contentLastModified: "2026-07-15" },
  automation: { changeFrequency: "monthly", priority: { sl: 0.75, en: 0.65 }, contentLastModified: "2026-07-15" },
  contact: { changeFrequency: "monthly", priority: { sl: 0.6, en: 0.5 }, contentLastModified: "2026-07-15" },
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
  blog: { changeFrequency: "weekly", priority: { sl: 0.8, en: 0.7 } },
  author: { changeFrequency: "monthly", priority: { sl: 0.4, en: 0.3 } },
  aiTransparency: { changeFrequency: "yearly", priority: { sl: 0.3, en: 0.3 } },
  accountDeletion: { changeFrequency: "yearly", priority: { sl: 0.1, en: 0.1 } },
};

const routeEntries = Object.entries(canonicalRoutes) as Array<[CanonicalRouteKey, Record<SiteLanguage, string>]>;

const legacyAliases: Record<string, string> = {
  "/pricing": canonicalRoutes.pricing.en,
  "/mobilna-aplikacija": canonicalRoutes.connect.sl,
  "/mobile-app": canonicalRoutes.connect.en,
  "/en/mobile-app": canonicalRoutes.connect.en,
  "/podjetja": canonicalRoutes.customers.sl,
  "/en/businesses": canonicalRoutes.customers.en,
  "/stranke": canonicalRoutes.customers.sl,
  "/clients": canonicalRoutes.customers.en,
  "/en/clients": canonicalRoutes.customers.en,
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
  const providerSlug = getPublicProviderSlugFromPathname(normalized);
  if (providerSlug) return getPublicCompanyProfilePath(providerSlug, getLanguageFromPathname(normalized));

  const story = getCustomerStoryFromPathname(normalized);
  if (story) return getCustomerStoryPath(story.slug, getLanguageFromPathname(normalized));

  const article = getArticleFromPathname(normalized);
  if (article) return getBlogArticlePath(article.slug, article.language);

  const legacyTarget = legacyAliases[normalized];
  if (legacyTarget) return legacyTarget;

  const key = getRouteKeyFromPathname(normalized);
  if (!key) return normalized;

  const language = getLanguageFromPathname(normalized);
  return canonicalRoutes[key][language];
};

export const getLocalizedPathname = (pathname: string, language: SiteLanguage) => {
  const providerSlug = getPublicProviderSlugFromPathname(pathname);
  if (providerSlug) return getPublicCompanyProfilePath(providerSlug, language);

  const story = getCustomerStoryFromPathname(pathname);
  if (story) return getCustomerStoryPath(story.slug, language);

  const article = getArticleFromPathname(pathname);
  if (article) return getArticleAlternates(article)[language];

  const key = getRouteKeyFromPathname(pathname);
  if (!key) return language === "en" ? "/en" : "/";
  return canonicalRoutes[key][language];
};

export const getRoutePath = (key: CanonicalRouteKey, language: SiteLanguage) => canonicalRoutes[key][language];

export const getLegacyRedirectTarget = (pathname: string) => legacyAliases[normalizePathname(pathname)];

export const canonicalPathnames = routeEntries.flatMap(([, paths]) => [paths.sl, paths.en]);
