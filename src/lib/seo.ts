import { SITE_URL } from "@/lib/site";
import { canonicalRoutes, getCanonicalPathname, getLanguageFromPathname, getLocalizedPathname, getRouteKeyFromPathname, type CanonicalRouteKey } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";

type PageSeo = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  noindex?: boolean;
};

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-calendra.png`;

export const pageSeo: Record<CanonicalRouteKey, Record<SiteLanguage, PageSeo>> = {
  home: {
    sl: {
      title: "Calendra | Program za naročanje strank, termine in račune",
      description:
        "Calendra je slovenska platforma za storitvena podjetja: spletno naročanje, koledar terminov, računi, opomniki, plačila, analitika in AI pomočnik.",
    },
    en: {
      title: "Calendra | Booking, appointments, invoicing and reminders",
      description:
        "Calendra helps service businesses manage online booking, appointment calendars, invoices, reminders, payments, analytics and client data in one platform.",
    },
  },
  pricing: {
    sl: {
      title: "Cenik | Calendra program za naročanje strank",
      description:
        "Preverite cenik platforme Calendra za spletno naročanje, koledar terminov, opomnike, račune, plačila, analitiko in dodatne uporabnike.",
    },
    en: {
      title: "Pricing | Calendra booking and appointment software",
      description:
        "See Calendra pricing for online booking, appointment calendars, reminders, invoicing, payments, analytics and additional users.",
    },
  },
  clients: {
    sl: {
      title: "Stranke | Podjetja, ki uporabljajo Calendro",
      description:
        "Odkrijte podjetja, ki uporabljajo Calendro za spletno naročanje terminov, in rezervirajte termin neposredno prek njihovega spletnega widgeta.",
    },
    en: {
      title: "Clients | Businesses using Calendra",
      description:
        "Explore businesses using Calendra for online appointment booking and book directly through their website booking widget.",
    },
  },
  booking: {
    sl: {
      title: "Spletno naročanje strank | Calendra booking widget",
      description:
        "Calendra booking widget omogoča, da stranke izberejo storitev, izvajalca, datum in uro ter rezervirajo termin neposredno na vaši spletni strani.",
    },
    en: {
      title: "Online appointment booking | Calendra booking widget",
      description:
        "The Calendra booking widget lets customers choose a service, provider, date and time, then book directly on your website.",
    },
  },
  support: {
    sl: {
      title: "Podpora | Calendra pomoč uporabnikom",
      description:
        "Podpora za uporabnike Calendra: dostop do aplikacije, kontakt, e-pošta, telefon, delovni čas in pričakovani prvi odziv ekipe za podporo.",
    },
    en: {
      title: "Support | Calendra customer help",
      description:
        "Calendra support information: app access, contact email, phone, support hours and expected first response time.",
    },
  },
  privacy: {
    sl: {
      title: "Politika zasebnosti | Calendra",
      description:
        "Politika zasebnosti za spletno stran in storitve Calendra, vključno z obdelavo osebnih podatkov, pravicami posameznikov in kontaktnimi podatki.",
    },
    en: {
      title: "Privacy Policy | Calendra",
      description:
        "Calendra privacy policy covering personal data processing, user rights, Google Limited Use and privacy contact details.",
    },
  },
  terms: {
    sl: {
      title: "Pogoji uporabe | Calendra",
      description:
        "Pogoji uporabe javne spletne strani Calendra, namenjene predstavitvi platforme in poslovni komunikaciji z zainteresiranimi podjetji.",
    },
    en: {
      title: "Terms of Service | Calendra",
      description:
        "Terms of service for the public Calendra website and information about permitted use, intellectual property, liability and contact details.",
    },
  },
  zoom: {
    sl: {
      title: "Zoom integracija | Calendra navodila",
      description:
        "Navodila za povezavo, uporabo in odstranitev Zoom integracije v Calendri za ustvarjanje spletnih terminov in Zoom povezav.",
    },
    en: {
      title: "Zoom integration | Calendra setup guide",
      description:
        "How to connect, use and remove the Zoom integration in Calendra for online appointments and automatically generated Zoom links.",
    },
  },
  aiTransparency: {
    sl: {
      title: "AI transparentnost | Calendra",
      description:
        "Javno razkritje uporabe OpenAI storitev v Calendri za izbrane AI funkcionalnosti, kot so glasovni ukazi in avtomatizacija delovnega toka.",
    },
    en: {
      title: "AI transparency | Calendra",
      description:
        "Public disclosure of how Calendra uses OpenAI services for selected AI features, including voice commands and workflow support.",
    },
  },
  accountDeletion: {
    sl: {
      title: "Izbris računa | Calendra Guest App",
      description:
        "Navodila za zahtevo za izbris računa Calendra Guest App in povezanih osebnih podatkov.",
      noindex: true,
    },
    en: {
      title: "Account deletion | Calendra Guest App",
      description:
        "Instructions for requesting deletion of a Calendra Guest App account and associated personal data.",
      noindex: true,
    },
  },
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Calendra",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  sameAs: [] as string[],
};

const websiteSchema = (language: SiteLanguage) => ({
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Calendra",
  url: SITE_URL,
  inLanguage: language === "sl" ? "sl-SI" : "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
});

const softwareSchema = (language: SiteLanguage) => ({
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "Calendra",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  url: SITE_URL,
  inLanguage: language === "sl" ? "sl-SI" : "en",
  description:
    language === "sl"
      ? "Slovenska platforma za spletno naročanje, koledar terminov, opomnike, račune, plačila, analitiko in upravljanje strank."
      : "A booking and appointment management platform for service businesses, including reminders, invoicing, payments, analytics and client management.",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: absoluteUrl(canonicalRoutes.pricing[language]),
  },
  publisher: { "@id": `${SITE_URL}/#organization` },
});

const breadcrumbSchema = (routeKey: CanonicalRouteKey, language: SiteLanguage, canonicalPath: string) => {
  const isHome = routeKey === "home";
  const pageName = pageSeo[routeKey][language].title.split("|")[0].trim();

  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: language === "sl" ? "Domov" : "Home",
        item: absoluteUrl(canonicalRoutes.home[language]),
      },
      ...(isHome
        ? []
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: pageName,
              item: absoluteUrl(canonicalPath),
            },
          ]),
    ],
  };
};

export const getSeoForPathname = (pathname: string) => {
  const routeKey = getRouteKeyFromPathname(pathname);
  const language = getLanguageFromPathname(pathname);
  const canonicalPath = getCanonicalPathname(pathname);

  if (!routeKey || !pageSeo[routeKey]) {
    return {
      language,
      title: language === "sl" ? "Stran ni najdena | Calendra" : "Page not found | Calendra",
      description:
        language === "sl"
          ? "Zahtevana stran ne obstaja ali je bila premaknjena."
          : "The requested page does not exist or has been moved.",
      canonicalUrl: absoluteUrl(canonicalPath),
      alternateUrls: undefined,
      noindex: true,
      structuredData: undefined,
    };
  }

  const seo = pageSeo[routeKey][language];
  const slPath = getLocalizedPathname(canonicalPath, "sl");
  const enPath = getLocalizedPathname(canonicalPath, "en");

  return {
    routeKey,
    language,
    title: seo.title,
    description: seo.description,
    ogTitle: seo.ogTitle || seo.title,
    ogDescription: seo.ogDescription || seo.description,
    canonicalUrl: absoluteUrl(canonicalPath),
    alternateUrls: {
      sl: absoluteUrl(slPath),
      en: absoluteUrl(enPath),
      xDefault: absoluteUrl(slPath),
    },
    noindex: seo.noindex,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [organizationSchema, websiteSchema(language), softwareSchema(language), breadcrumbSchema(routeKey, language, canonicalPath)],
    },
  };
};
