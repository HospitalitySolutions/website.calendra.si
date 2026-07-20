import type { DirectoryClient } from "@/lib/company-directory";
import type { SiteLanguage } from "@/lib/site-language";

export type LocalizedValue = Record<SiteLanguage, string>;

export type PublicCompanyReview = {
  author: string;
  rating: number;
  text: LocalizedValue;
  source: string;
};

export type PublicCompanyProfile = DirectoryClient & {
  publicEnabled: boolean;
  allowIndexing: boolean;
  city: string;
  countryCode: string;
  localizedDescription: LocalizedValue;
  serviceCategories: Record<SiteLanguage, string[]>;
  review?: PublicCompanyReview;
  lastModified?: string;
};

export const publicCompanyProfiles: PublicCompanyProfile[] = [
  {
    slug: "beauty-lounge",
    tenantCode: "beauty-lounge",
    tenantSlug: "beauty-lounge",
    name: "Beauty Lounge",
    description:
      "Beauty Lounge is a beauty-services business in Ireland that uses Calendra to keep appointments organised and make booking easier for clients.",
    localizedDescription: {
      sl: "Beauty Lounge je ponudnik lepotnih storitev na Irskem, ki s Calendro organizira termine in strankam omogoča enostavnejše naročanje.",
      en: "Beauty Lounge is a beauty-services business in Ireland that uses Calendra to keep appointments organised and make booking easier for clients.",
    },
    address: "Ireland",
    city: "",
    countryCode: "IE",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Beauty%20Lounge%20Ireland",
    category: "salon",
    publicEnabled: true,
    allowIndexing: true,
    serviceCategories: {
      sl: ["Lepotne storitve", "Nega", "Rezervacija terminov"],
      en: ["Beauty services", "Treatments", "Appointment booking"],
    },
    review: {
      author: "Latanya Powell",
      rating: 5,
      source: "Google",
      text: {
        sl: "Calendro uporabljam na Irskem. Je preprosta, zanesljiva in mi pomaga, da so termini dobro organizirani.",
        en: "I use Calendra in Ireland. It is simple, reliable and helps me keep appointments well organised.",
      },
    },
    lastModified: "2026-07-15",
  },
  {
    slug: "institut-avisensa",
    tenantCode: "institut-avisensa",
    tenantSlug: "institut-avisensa",
    name: "Inštitut Avisensa",
    description:
      "Inštitut Avisensa in Maribor provides psychological counselling and uses Calendra to organise appointments and simplify client booking.",
    localizedDescription: {
      sl: "Inštitut Avisensa v Mariboru nudi psihološko svetovanje ter s Calendro ureja termine in poenostavlja naročanje strank.",
      en: "Avisensa Institute in Maribor provides psychological counselling and uses Calendra to organise appointments and simplify client booking.",
    },
    address: "Maribor, Slovenija",
    city: "Maribor",
    countryCode: "SI",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=In%C5%A1titut%20Avisensa%20Maribor",
    category: "consulting",
    publicEnabled: true,
    allowIndexing: true,
    serviceCategories: {
      sl: ["Psihološko svetovanje", "Podpora posameznikom", "Storitve za institucije"],
      en: ["Psychological counselling", "Individual support", "Services for institutions"],
    },
    review: {
      author: "Nina",
      rating: 5,
      source: "Google",
      text: {
        sl: "Sistem je zelo pregleden in vsebuje pomembne funkcionalnosti, s katerimi prihranimo čas in energijo.",
        en: "The system is very clear and includes important features that help us save time and energy.",
      },
    },
    lastModified: "2026-07-15",
  },
];

export const isIndexablePublicProfile = (profile: PublicCompanyProfile) =>
  profile.publicEnabled &&
  profile.allowIndexing &&
  profile.name.trim().length >= 3 &&
  profile.localizedDescription.sl.trim().length >= 80 &&
  profile.localizedDescription.en.trim().length >= 80 &&
  profile.address.trim().length >= 3 &&
  profile.serviceCategories.sl.length > 0 &&
  profile.serviceCategories.en.length > 0;

export const indexablePublicCompanyProfiles = publicCompanyProfiles.filter(isIndexablePublicProfile);

export const getPublicCompanyProfile = (slug: string) =>
  publicCompanyProfiles.find((profile) => profile.slug === slug);

export const getPublicCompanyProfilePath = (slug: string, language: SiteLanguage) =>
  language === "sl" ? `/podjetja/${slug}` : `/en/businesses/${slug}`;

export const getPublicCompanyProfileFromPathname = (pathname: string) => {
  const normalized = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const match = normalized.match(/^\/(?:podjetja|en\/businesses)\/([^/]+)$/);
  if (!match) return undefined;
  return getPublicCompanyProfile(decodeURIComponent(match[1]));
};
