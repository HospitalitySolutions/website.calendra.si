import { FEATURE_ROUTE_KEYS } from "@/lib/feature-pages";
import { INDUSTRY_ROUTE_KEYS } from "@/lib/industry-pages";
import { IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { canonicalRoutes, type CanonicalRouteKey } from "@/lib/localized-routes";
import { pageSeo } from "@/lib/seo";
import type { SiteLanguage } from "@/lib/site-language";

/**
 * Short link labels, kept separate from `pageSeo` titles because a title reads
 * as a page heading ("Koledar terminov za storitvena podjetja") while a link
 * needs to read as a destination ("Koledar terminov").
 */
const linkLabels: Record<SiteLanguage, Partial<Record<CanonicalRouteKey, string>>> = {
  sl: {
    home: "Calendra",
    pricing: "Cenik in paketi",
    booking: "Spletno naročanje",
    businesses: "Podjetja",
    customerStories: "Zgodbe strank",
    demo: "Rezervirajte predstavitev",
    calendar: "Koledar terminov",
    invoicing: "Računi in plačila",
    clientManagement: "Upravljanje strank",
    reminders: "SMS in e-poštni opomniki",
    integrations: "Integracije",
    beautyHair: "Za kozmetične in frizerske salone",
    consultantsEducators: "Za svetovalce in izobraževalce",
    healthWellbeing: "Za zdravje in dobro počutje",
    fitnessGroups: "Za fitnes in skupinske vadbe",
    connect: "Calendra Connect",
    zoom: "Zoom integracija",
    itServices: "IT storitve",
    itSupport: "IT-podpora za mala podjetja",
    websiteDesign: "Izdelava spletnih strani",
    websiteMaintenance: "Vzdrževanje spletnih strani",
    businessEmail: "Poslovna e-pošta",
    backupsSecurity: "Varnostne kopije in IT-varnost",
    automation: "Avtomatizacije in integracije",
    contact: "Kontakt",
    support: "Podpora",
    security: "Varnost",
    privacy: "Zasebnost",
    blog: "Nasveti in vodniki",
    author: "David Mirc",
  },
  en: {
    home: "Calendra",
    pricing: "Pricing and plans",
    booking: "Online booking",
    businesses: "Businesses",
    customerStories: "Customer stories",
    demo: "Book a demo",
    calendar: "Appointment calendar",
    invoicing: "Invoicing and payments",
    clientManagement: "Client management",
    reminders: "SMS and email reminders",
    integrations: "Integrations",
    beautyHair: "For beauty, hair and cosmetic salons",
    consultantsEducators: "For consultants and educators",
    healthWellbeing: "For health and wellbeing",
    fitnessGroups: "For fitness and group classes",
    connect: "Calendra Connect",
    zoom: "Zoom integration",
    itServices: "IT services",
    itSupport: "Small business IT support",
    websiteDesign: "Website design",
    websiteMaintenance: "Website maintenance",
    businessEmail: "Business email",
    backupsSecurity: "Backups and IT security",
    automation: "Automation and integrations",
    contact: "Contact",
    support: "Support",
    security: "Security",
    privacy: "Privacy",
    blog: "Guides and advice",
    author: "David Mirc",
  },
};

/**
 * Explicit related-page graph. Before this existed each page template
 * hand-rolled its own inline list, and features and industries only ever
 * connected through the navigation, leaving the two most commercially valuable
 * page clusters unlinked.
 */
const relatedByRouteKey: Partial<Record<CanonicalRouteKey, CanonicalRouteKey[]>> = {
  pricing: ["booking", "calendar", "reminders", "invoicing", "blog"],
  booking: ["businesses", "customerStories", "calendar", "reminders", "connect", "pricing"],
  businesses: ["booking", "customerStories", "connect", "pricing"],
  demo: ["pricing", "booking", "calendar"],

  calendar: ["booking", "reminders", "clientManagement", "beautyHair", "healthWellbeing", "pricing"],
  invoicing: ["clientManagement", "booking", "integrations", "beautyHair", "consultantsEducators", "pricing"],
  clientManagement: ["calendar", "invoicing", "booking", "healthWellbeing", "beautyHair", "pricing"],
  reminders: ["calendar", "booking", "clientManagement", "beautyHair", "fitnessGroups", "pricing"],
  integrations: ["zoom", "calendar", "invoicing", "consultantsEducators", "booking", "pricing"],

  beautyHair: ["customerStories", "calendar", "reminders", "clientManagement", "invoicing", "booking"],
  consultantsEducators: ["calendar", "integrations", "zoom", "invoicing", "booking", "pricing"],
  healthWellbeing: ["customerStories", "calendar", "clientManagement", "reminders", "invoicing", "booking"],
  fitnessGroups: ["calendar", "reminders", "clientManagement", "booking", "connect", "pricing"],

  connect: ["booking", "reminders", "calendar", "support"],
  zoom: ["integrations", "calendar", "consultantsEducators", "booking"],

  blog: ["customerStories", "booking", "reminders", "invoicing", "pricing", "author"],
  customerStories: ["beautyHair", "healthWellbeing", "booking", "clientManagement", "reminders", "pricing"],
  author: ["blog", "itServices", "booking", "contact"],

  itServices: [...IT_SERVICE_ROUTE_KEYS],
  itSupport: ["backupsSecurity", "businessEmail", "automation", "itServices"],
  websiteDesign: ["websiteMaintenance", "automation", "businessEmail", "itServices"],
  websiteMaintenance: ["websiteDesign", "backupsSecurity", "itSupport", "itServices"],
  businessEmail: ["itSupport", "backupsSecurity", "automation", "itServices"],
  backupsSecurity: ["itSupport", "websiteMaintenance", "businessEmail", "itServices"],
  automation: ["integrations", "itSupport", "websiteDesign", "itServices"],
};

export type RelatedPageLink = {
  routeKey: CanonicalRouteKey;
  href: string;
  label: string;
  description: string;
};

export const getRelatedPages = (
  routeKey: CanonicalRouteKey | undefined,
  language: SiteLanguage,
  limit = 6,
): RelatedPageLink[] => {
  if (!routeKey) return [];

  return (relatedByRouteKey[routeKey] ?? [])
    .filter((relatedKey) => relatedKey !== routeKey)
    .slice(0, limit)
    .map((relatedKey) => ({
      routeKey: relatedKey,
      href: canonicalRoutes[relatedKey][language],
      label: linkLabels[language][relatedKey] ?? pageSeo[relatedKey][language].title.split("|")[0].trim(),
      description: pageSeo[relatedKey][language].description,
    }));
};

export const getRouteLinkLabel = (routeKey: CanonicalRouteKey, language: SiteLanguage) =>
  linkLabels[language][routeKey] ?? pageSeo[routeKey][language].title.split("|")[0].trim();

export const FEATURE_LINK_KEYS = FEATURE_ROUTE_KEYS;
export const INDUSTRY_LINK_KEYS = INDUSTRY_ROUTE_KEYS;
