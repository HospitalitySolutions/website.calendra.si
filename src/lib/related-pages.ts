import { FEATURE_ROUTE_KEYS } from "@/lib/feature-pages";
import { ALL_INDUSTRY_ROUTE_KEYS } from "@/lib/industry-pages";
import { IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { canonicalRoutes, type CanonicalRouteKey } from "@/lib/localized-routes";
import { pageSeo } from "@/lib/seo";
import type { SiteLanguage } from "@/lib/site-language";
import { CUSTOMER_MARKETPLACE_PUBLIC } from "@/lib/customer-marketplace";

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
    customers: "Za stranke",
    businesses: "Ponudniki",
    customerStories: "Zgodbe strank",
    demo: "Rezervirajte predstavitev",
    calendar: "Koledar terminov",
    invoicing: "Računi in plačila",
    clientManagement: "Upravljanje strank",
    reminders: "SMS in e-poštni opomniki",
    integrations: "Integracije",
    materialManagement: "Materialno poslovanje",
    fiscalCashRegister: "Davčna blagajna",
    groupBookings: "Skupinske rezervacije",
    beautyHair: "Za kozmetične in frizerske salone",
    consultantsEducators: "Za svetovalce in izobraževalce",
    healthWellbeing: "Za zdravje in dobro počutje",
    fitnessGroups: "Za fitnes in skupinske vadbe",
    hairSalons: "Za frizerske salone",
    beautySalons: "Za kozmetične salone",
    massage: "Za masažne salone",
    spaSauna: "Za spa in savne",
    tattooPiercing: "Za tattoo in piercing studie",
    fitnessPersonalTraining: "Za fitnes in osebne trenerje",
    physiotherapy: "Za fizioterapijo",
    psychologyCounselling: "Za psihologijo in svetovanje",
    yogaPilates: "Za jogo in pilates",
    petServices: "Za storitve za hišne ljubljenčke",
    educationCoaching: "Za izobraževanje in coaching",
    otherServices: "Za druge storitvene dejavnosti",
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
    customers: "For customers",
    businesses: "Providers",
    customerStories: "Customer stories",
    demo: "Book a demo",
    calendar: "Appointment calendar",
    invoicing: "Invoicing and payments",
    clientManagement: "Client management",
    reminders: "SMS and email reminders",
    integrations: "Integrations",
    materialManagement: "Inventory management",
    fiscalCashRegister: "Fiscal cash register",
    groupBookings: "Group bookings",
    beautyHair: "For beauty, hair and cosmetic salons",
    consultantsEducators: "For consultants and educators",
    healthWellbeing: "For health and wellbeing",
    fitnessGroups: "For fitness and group classes",
    hairSalons: "For hair salons",
    beautySalons: "For beauty salons",
    massage: "For massage businesses",
    spaSauna: "For spas and saunas",
    tattooPiercing: "For tattoo and piercing studios",
    fitnessPersonalTraining: "For fitness and personal training",
    physiotherapy: "For physiotherapy",
    psychologyCounselling: "For psychology and counselling",
    yogaPilates: "For yoga and pilates",
    petServices: "For pet services",
    educationCoaching: "For education and coaching",
    otherServices: "For other service businesses",
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
  // Feature/industry hybrid: the SXO audit found this page competing with
  // Calendra's own homepage for head-term booking queries, while carrying no
  // link path into the industry verticals that make it a genuinely broader
  // page than a single-feature one. beautyHair/healthWellbeing/fitnessGroups
  // give it that breadth instead of only linking within the feature cluster.
  booking: ["customers", "customerStories", "beautyHair", "healthWellbeing", "fitnessGroups", "calendar", "reminders", "pricing"],
  customers: ["connect", "booking"],
  businesses: ["customers", "connect", "booking", "customerStories"],
  demo: ["pricing", "booking", "calendar"],

  calendar: ["booking", "groupBookings", "reminders", "clientManagement", "beautyHair", "pricing"],
  invoicing: ["fiscalCashRegister", "clientManagement", "booking", "integrations", "beautyHair", "pricing"],
  clientManagement: ["calendar", "invoicing", "booking", "healthWellbeing", "beautyHair", "pricing"],
  reminders: ["calendar", "booking", "clientManagement", "beautyHair", "fitnessGroups", "pricing"],
  integrations: ["zoom", "calendar", "invoicing", "consultantsEducators", "booking", "pricing"],
  materialManagement: ["beautyHair", "invoicing", "calendar", "clientManagement", "pricing", "booking"],
  fiscalCashRegister: ["invoicing", "calendar", "clientManagement", "booking", "beautyHair", "pricing"],
  groupBookings: ["fitnessGroups", "calendar", "booking", "reminders", "clientManagement", "pricing"],

  beautyHair: ["customerStories", "calendar", "reminders", "clientManagement", "materialManagement", "invoicing"],
  consultantsEducators: ["calendar", "integrations", "zoom", "invoicing", "booking", "pricing"],
  healthWellbeing: ["customerStories", "calendar", "clientManagement", "reminders", "invoicing", "booking"],
  fitnessGroups: ["groupBookings", "calendar", "reminders", "booking", "clientManagement", "pricing"],

  hairSalons: ["beautySalons", "calendar", "booking", "reminders", "materialManagement", "pricing"],
  beautySalons: ["hairSalons", "massage", "calendar", "booking", "materialManagement", "pricing"],
  massage: ["spaSauna", "physiotherapy", "calendar", "booking", "reminders", "pricing"],
  spaSauna: ["massage", "yogaPilates", "calendar", "booking", "fitnessPersonalTraining", "pricing"],
  tattooPiercing: ["hairSalons", "beautySalons", "calendar", "booking", "reminders", "pricing"],
  fitnessPersonalTraining: ["yogaPilates", "calendar", "booking", "reminders", "clientManagement", "pricing"],
  physiotherapy: ["massage", "psychologyCounselling", "calendar", "clientManagement", "reminders", "pricing"],
  psychologyCounselling: ["educationCoaching", "physiotherapy", "calendar", "booking", "integrations", "pricing"],
  yogaPilates: ["fitnessPersonalTraining", "educationCoaching", "calendar", "booking", "reminders", "pricing"],
  petServices: ["calendar", "booking", "clientManagement", "reminders", "invoicing", "pricing"],
  educationCoaching: ["psychologyCounselling", "yogaPilates", "calendar", "integrations", "zoom", "pricing"],
  otherServices: ["booking", "calendar", "clientManagement", "invoicing", "integrations", "pricing"],

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
    .filter((relatedKey) => CUSTOMER_MARKETPLACE_PUBLIC || (relatedKey !== "customers" && relatedKey !== "businesses"))
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
export const INDUSTRY_LINK_KEYS = ALL_INDUSTRY_ROUTE_KEYS;
