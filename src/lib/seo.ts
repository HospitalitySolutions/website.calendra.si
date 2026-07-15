import { SITE_URL } from "@/lib/site";
import { canonicalRoutes, getCanonicalPathname, getLanguageFromPathname, getLocalizedPathname, getRouteKeyFromPathname, type CanonicalRouteKey } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";
import { LEGAL } from "@/lib/legal";
import { OFFICIAL_PROFILE_URLS } from "@/lib/external-profiles";

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
        "Odkrijte podjetja, ki uporabljajo Calendro za spletno naročanje terminov, in rezervirajte termin neposredno v Calendri.",
    },
    en: {
      title: "Clients | Businesses using Calendra",
      description:
        "Explore businesses using Calendra for online appointment booking and book directly through Calendra.",
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
        "Politika zasebnosti Calendra za spletno stran, platformo, goste, najemnike, integracije, pravice posameznikov in razmerje upravljavec/obdelovalec.",
    },
    en: {
      title: "Privacy Policy | Calendra",
      description:
        "Calendra privacy policy for the website, platform, guests, tenants, integrations, user rights and controller/processor roles.",
    },
  },
  terms: {
    sl: {
      title: "Pogoji uporabe | Calendra",
      description:
        "Pogoji uporabe Calendra za spletno stran, SaaS platformo, naročnine, mobilno aplikacijo za goste, integracije in poslovne uporabnike.",
    },
    en: {
      title: "Terms of Service | Calendra",
      description:
        "Calendra terms of service for the website, SaaS platform, subscriptions, guest mobile app, integrations and business users.",
    },
  },
  legal: {
    sl: {
      title: "Pravno in zaupanje | Calendra",
      description:
        "Zbrani pravni dokumenti Calendra: zasebnost, pogoji uporabe, DPA, podobdelovalci, piškotki, varnost, pravice in izbris računa.",
    },
    en: {
      title: "Legal & Trust | Calendra",
      description:
        "Calendra legal and trust documents: privacy, terms, DPA, subprocessors, cookies, security, data rights and account deletion.",
    },
  },
  dpa: {
    sl: {
      title: "Pogodba o obdelavi podatkov | Calendra",
      description:
        "Pogodba o obdelavi osebnih podatkov za najemnike Calendra, kadar Calendra obdeluje osebne podatke kot obdelovalec.",
    },
    en: {
      title: "Data Processing Agreement | Calendra",
      description:
        "Data Processing Agreement for Calendra tenants where Calendra processes personal data as processor on behalf of the tenant.",
    },
  },
  subprocessors: {
    sl: {
      title: "Podobdelovalci | Calendra",
      description:
        "Seznam podobdelovalcev in integracijskih ponudnikov, ki lahko pomagajo pri zagotavljanju storitve Calendra.",
    },
    en: {
      title: "Subprocessors | Calendra",
      description:
        "List of subprocessors and integration providers that may help Calendra deliver the service.",
    },
  },
  cookies: {
    sl: {
      title: "Politika piškotkov | Calendra",
      description:
        "Politika piškotkov Calendra z informacijami o nujnih piškotkih, nastavitvah, analitiki in upravljanju piškotkov.",
    },
    en: {
      title: "Cookie Policy | Calendra",
      description:
        "Calendra cookie policy covering necessary cookies, preferences, analytics and managing cookies.",
    },
  },
  security: {
    sl: {
      title: "Varnost | Calendra",
      description:
        "Javni povzetek varnostnih ukrepov Calendra za zaščito platforme, najemnikov, gostov in osebnih podatkov.",
    },
    en: {
      title: "Security | Calendra",
      description:
        "Public summary of Calendra security measures used to protect the platform, tenants, guests and personal data.",
    },
  },
  dataRights: {
    sl: {
      title: "Pravice posameznikov | Calendra",
      description:
        "Kako lahko posamezniki uveljavljajo pravice glede osebnih podatkov pri Calendri ali pri najemniku, ki uporablja Calendro.",
    },
    en: {
      title: "Data Rights | Calendra",
      description:
        "How individuals can exercise personal data rights with Calendra or with a tenant using Calendra.",
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
        "Javno razkritje uporabe AI funkcionalnosti v Calendri, vključno s statusom produkcijskega zagona in ponudnikom OpenAI, če bodo AI funkcije omogočene.",
    },
    en: {
      title: "AI transparency | Calendra",
      description:
        "Public disclosure of Calendra AI features, including production launch status and OpenAI provider information if AI features are enabled.",
    },
  },
  accountDeletion: {
    sl: {
      title: "Izbris računa | Calendra Guest App",
      description:
        "Navodila za izbris računa Calendra Guest App v aplikaciji ali prek javne zahteve za izbris računa.",
      noindex: true,
    },
    en: {
      title: "Account deletion | Calendra Guest App",
      description:
        "Instructions for deleting a Calendra Guest App account in the app or through a public account deletion request.",
      noindex: true,
    },
  },
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Calendra",
  legalName: LEGAL.entityName,
  url: SITE_URL,
  email: LEGAL.generalEmail,
  telephone: LEGAL.supportPhoneTel,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/calendra-logo.png`,
    width: 512,
    height: 512,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: LEGAL.businessAddress,
    postalCode: LEGAL.postalCode,
    addressLocality: LEGAL.city,
    addressCountry: "SI",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: LEGAL.supportEmail,
    telephone: LEGAL.supportPhoneTel,
    availableLanguage: ["Slovenian", "English"],
  },
  sameAs: OFFICIAL_PROFILE_URLS,
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
    price: "14.90",
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
