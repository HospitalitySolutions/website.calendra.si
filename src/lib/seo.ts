import { SITE_URL } from "@/lib/site";
import {
  canonicalRoutes,
  getCanonicalPathname,
  getLanguageFromPathname,
  getLocalizedPathname,
  getRouteKeyFromPathname,
  type CanonicalRouteKey,
} from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";
import { APP_STORE_APP_URL, CALENDRA_CONNECT_STORE_URLS, GOOGLE_PLAY_APP_URL } from "@/lib/calendra-connect-config";
import { LEGAL } from "@/lib/legal";
import {
  AUTHOR_PROFILE_URLS,
  COMPANY_REGISTRATION_NUMBER,
  COMPANY_VAT_ID,
  OFFICIAL_PROFILE_URLS,
  WIKIDATA_ENTITY_ID,
} from "@/lib/external-profiles";
import { getItServiceContent, isItServiceRouteKey, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { FALLBACK_PUBLIC_PRICING, getInitialPricingCatalog } from "@/lib/public-pricing";
import {
  type BlogArticleMeta,
  getArticleAlternates,
  getArticleFromPathname,
  getArticlesForLanguage,
  getBlogArticlePath,
} from "@/lib/blog";
import { getFaqForRoute } from "@/lib/faq";
import { getIndustryContent, isIndustryRouteKey, type IndustryRouteKey } from "@/lib/industry-pages";
import {
  getPublicCompanyProfileFromPathname,
  getPublicCompanyProfilePath,
  isIndexablePublicProfile,
} from "@/lib/public-company-profiles";

type PageSeo = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
};

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-calendra.png`;

export const pageSeo: Record<CanonicalRouteKey, Record<SiteLanguage, PageSeo>> = {
  home: {
    sl: { title: "Calendra | Program za naročanje strank, termine in račune", description: "Calendra je slovenska platforma za storitvena podjetja: spletno naročanje, koledar terminov, računi, opomniki, plačila, analitika in upravljanje strank." },
    en: { title: "Calendra | Booking, appointments, invoicing and reminders", description: "Calendra helps service businesses manage online booking, appointment calendars, invoices, reminders, payments, analytics and client data in one platform." },
  },
  pricing: {
    sl: { title: "Cenik programa za naročanje strank | Calendra", description: "Primerjajte pakete Calendra, vključene funkcionalnosti, dodatne uporabnike, SMS porabo in module. Začnite s 14-dnevnim brezplačnim preizkusom." },
    en: { title: "Appointment booking software pricing | Calendra", description: "Compare Calendra plans, included features, additional users, SMS usage and optional modules. Start with a 14-day free trial." },
  },
  booking: {
    sl: { title: "Spletno naročanje terminov in imenik podjetij | Calendra", description: "Rezervirajte termin pri podjetjih, ki uporabljajo Calendro, ali omogočite spletno naročanje z izbiro storitve, zaposlenega, plačila in opomnikov." },
    en: { title: "Online appointment booking and business directory | Calendra", description: "Book with businesses using Calendra or offer online booking with service and employee selection, payments, confirmations and reminders." },
  },
  demo: {
    sl: { title: "Rezervirajte predstavitev Calendre | 30-minutni video klic", description: "Izberite prost termin za 30-minutno spletno predstavitev Calendre in prejmite potrdilo ter povezavo do video klica po e-pošti." },
    en: { title: "Book a Calendra demo | 30-minute video call", description: "Choose an available time for a 30-minute Calendra demo and receive the confirmation and video-call link by email." },
  },
  calendar: {
    sl: { title: "Koledar terminov za storitvena podjetja | Calendra", description: "Pregleden koledar terminov za zaposlene, delovni čas, odsotnosti, prostore in ponavljajoče se rezervacije brez dvojnega vnašanja." },
    en: { title: "Appointment calendar for service businesses | Calendra", description: "Manage employees, working hours, absences, rooms and recurring appointments in one clear calendar without duplicate work." },
  },
  invoicing: {
    sl: { title: "Program za račune, termine in plačila | Calendra", description: "Povežite izvedene termine, račune, načine plačila in finančni pregled v enem delovnem toku za storitveno podjetje." },
    en: { title: "Appointments, invoicing and payments software | Calendra", description: "Connect completed appointments, invoices, payment methods and revenue tracking in one workflow for your service business." },
  },
  clientManagement: {
    sl: { title: "Upravljanje strank in evidenca terminov | Calendra", description: "Ohranite kontaktne podatke, zgodovino terminov, opombe, dokumente in polja po meri v urejenem profilu stranke." },
    en: { title: "Client management and appointment history | Calendra", description: "Keep contact details, appointment history, notes, documents and custom fields in one organised client profile." },
  },
  reminders: {
    sl: { title: "SMS in e-poštni opomniki za termine | Calendra", description: "Zmanjšajte pozabljene termine z avtomatskimi potrditvami, SMS in e-poštnimi opomniki ter povezavami za spremembo ali odpoved." },
    en: { title: "SMS and email appointment reminders | Calendra", description: "Reduce missed appointments with automatic confirmations, SMS and email reminders, rescheduling and cancellation links." },
  },
  integrations: {
    sl: { title: "Integracije za naročanje: Google Koledar, Zoom in plačila | Calendra", description: "Povežite Calendro z Google Koledarjem, Zoomom, spletnimi plačili, e-pošto, SMS sporočili in spletnim vtičnikom." },
    en: { title: "Booking integrations: Google Calendar, Zoom and payments | Calendra", description: "Connect Calendra with Google Calendar, Zoom, online payments, email, SMS and a website booking widget." },
  },
  beautyHair: {
    sl: { title: "Program za naročanje za lepotne in frizerske salone | Calendra", description: "Upravljajte termine, zaposlene, storitve, prostore, opomnike, plačila in spletno naročanje za lepotni ali frizerski salon." },
    en: { title: "Booking software for beauty and hair salons | Calendra", description: "Manage appointments, employees, services, rooms, reminders, payments and online booking for your beauty or hair salon." },
  },
  consultantsEducators: {
    sl: { title: "Naročanje za svetovalce in izobraževalce | Calendra", description: "Osebni in spletni termini, ponavljajoča se srečanja, Zoom, dokumenti, paketi obiskov, komunikacija, plačila in računi na enem mestu." },
    en: { title: "Booking for consultants and educators | Calendra", description: "Manage in-person and online appointments, recurring meetings, Zoom, documents, packages, communication, payments and invoices." },
  },
  healthWellbeing: {
    sl: { title: "Sistem za naročanje za zdravje in dobro počutje | Calendra", description: "Zanesljivo naročanje, opomniki, izvajalci, prostori, ponavljajoči se obiski, profil stranke ter nadzor dostopa za storitve dobrega počutja." },
    en: { title: "Booking for health and wellbeing providers | Calendra", description: "Reliable booking, reminders, providers, rooms, recurring visits, customer profiles and access control for wellbeing services." },
  },
  fitnessGroups: {
    sl: { title: "Rezervacije za fitnes in skupinske storitve | Calendra", description: "Upravljajte individualne vadbe, skupinske termine, kapacitete, ponovitve, prijave, pakete obiskov, vstopnice in obvestila." },
    en: { title: "Booking for fitness and group services | Calendra", description: "Manage individual sessions, group appointments, capacity, recurrence, registrations, visit packages, tickets and notifications." },
  },
  connect: {
    sl: { title: "Calendra Connect | Aplikacija za rezervacijo terminov", description: "Calendra Connect je brezplačna mobilna aplikacija za rezervacijo, prestavljanje in odpoved terminov, obvestila, plačila, ugodnosti in vstopnice.", ogImage: `${SITE_URL}/connect/og-calendra-connect.png` },
    en: { title: "Calendra Connect | Appointment booking app", description: "Calendra Connect is a free mobile app for booking, rescheduling and cancelling appointments, notifications, payments, benefits and tickets.", ogImage: `${SITE_URL}/connect/og-calendra-connect.png` },
  },
  itServices: {
    sl: { title: "IT storitve za mala podjetja | Calendra", description: "IT-podpora, izdelava in vzdrževanje spletnih strani, poslovna e-pošta, varnostne kopije, osnovna IT-varnost ter avtomatizacije za mala podjetja." },
    en: { title: "IT services for small businesses | Calendra", description: "IT support, website design and maintenance, business email, backups, essential security and business automation for small companies." },
  },
  itSupport: {
    sl: { title: "IT-podpora za mala podjetja | Calendra", description: "Oddaljena in dogovorjena IT-podpora za mala podjetja: naprave, uporabniki, programi, dostopi, ponudniki in vsakodnevno odpravljanje težav." },
    en: { title: "Small-business IT support | Calendra", description: "Remote and agreed on-site IT support for devices, users, software, access, suppliers and everyday troubleshooting." },
  },
  websiteDesign: {
    sl: { title: "Izdelava in prenova spletnih strani | Calendra", description: "Načrtovanje, izdelava in prenova hitrih, mobilnih in merljivih spletnih strani z osnovno SEO-pripravo, analitiko in integracijami." },
    en: { title: "Website design and redesign | Calendra", description: "Planning, development and redesign of fast, responsive and measurable websites with technical SEO foundations, analytics and integrations." },
  },
  websiteMaintenance: {
    sl: { title: "Vzdrževanje spletnih strani | Calendra", description: "Posodobitve, varnostne kopije, spremljanje delovanja, odpravljanje napak, optimizacija hitrosti in dogovorjene vsebinske spremembe." },
    en: { title: "Website maintenance | Calendra", description: "Updates, backups, uptime monitoring, troubleshooting, performance improvements and agreed content changes." },
  },
  businessEmail: {
    sl: { title: "Poslovna e-pošta za mala podjetja | Calendra", description: "Nastavitev poslovne e-pošte na lastni domeni, Microsoft 365 ali Google Workspace, migracija predalov, DNS, MFA in skupni koledarji." },
    en: { title: "Business email for small companies | Calendra", description: "Business email on your own domain, Microsoft 365 or Google Workspace setup, mailbox migration, DNS, MFA and shared calendars." },
  },
  backupsSecurity: {
    sl: { title: "Varnostne kopije in osnovna IT-varnost | Calendra", description: "Ureditev varnostnih kopij, preverjanje obnovitve, večfaktorska prijava, dostopi, posodobitve in osnovni varnostni ukrepi za mala podjetja." },
    en: { title: "Backups and essential IT security | Calendra", description: "Backup setup and restore checks, multi-factor authentication, access reviews, updates and essential security for small businesses." },
  },
  automation: {
    sl: { title: "Avtomatizacije in povezovanje poslovnih sistemov | Calendra", description: "Povezovanje obrazcev, e-pošte, koledarjev, CRM-jev, računovodstva in drugih poslovnih sistemov prek API-jev in avtomatizacij." },
    en: { title: "Business automation and system integration | Calendra", description: "Connect forms, email, calendars, CRM, accounting and other business systems through APIs and automation workflows." },
  },
  contact: {
    sl: { title: "Kontakt | Calendra in IT storitve", description: "Stopite v stik glede aplikacije Calendra, paketov, funkcionalnosti in podpore ali pošljite ločeno povpraševanje za IT storitve." },
    en: { title: "Contact | Calendra and IT services", description: "Contact us about the Calendra application, plans, features and support, or send a separate enquiry for IT services." },
  },
  support: {
    sl: { title: "Podpora | Calendra pomoč uporabnikom", description: "Podpora za uporabnike Calendra: dostop do aplikacije, kontakt, e-pošta, telefon, delovni čas in pričakovani prvi odziv ekipe za podporo." },
    en: { title: "Support | Calendra customer help", description: "Calendra support information: app access, contact email, phone, support hours and expected first response time." },
  },
  privacy: {
    sl: { title: "Politika zasebnosti | Calendra", description: "Politika zasebnosti Calendra za spletno stran, platformo, goste, najemnike, integracije, pravice posameznikov in razmerje upravljavec/obdelovalec." },
    en: { title: "Privacy Policy | Calendra", description: "Calendra privacy policy for the website, platform, guests, tenants, integrations, user rights and controller/processor roles." },
  },
  terms: {
    sl: { title: "Pogoji uporabe | Calendra", description: "Pogoji uporabe Calendra za spletno stran, SaaS platformo, naročnine, mobilno aplikacijo za goste, integracije in poslovne uporabnike." },
    en: { title: "Terms of Service | Calendra", description: "Calendra terms of service for the website, SaaS platform, subscriptions, guest mobile app, integrations and business users." },
  },
  legal: {
    sl: { title: "Pravno in zaupanje | Calendra", description: "Zbrani pravni dokumenti Calendra: zasebnost, pogoji uporabe, DPA, podobdelovalci, piškotki, varnost, pravice in izbris računa." },
    en: { title: "Legal & Trust | Calendra", description: "Calendra legal and trust documents: privacy, terms, DPA, subprocessors, cookies, security, data rights and account deletion." },
  },
  dpa: {
    sl: { title: "Pogodba o obdelavi podatkov | Calendra", description: "Pogodba o obdelavi osebnih podatkov za najemnike Calendra, kadar Calendra obdeluje osebne podatke kot obdelovalec." },
    en: { title: "Data Processing Agreement | Calendra", description: "Data Processing Agreement for Calendra tenants where Calendra processes personal data as processor on behalf of the tenant." },
  },
  subprocessors: {
    sl: { title: "Podobdelovalci | Calendra", description: "Seznam podobdelovalcev in integracijskih ponudnikov, ki lahko pomagajo pri zagotavljanju storitve Calendra." },
    en: { title: "Subprocessors | Calendra", description: "List of subprocessors and integration providers that may help Calendra deliver the service." },
  },
  cookies: {
    sl: { title: "Politika piškotkov | Calendra", description: "Politika piškotkov Calendra z informacijami o nujnih piškotkih, nastavitvah, analitiki in upravljanju piškotkov." },
    en: { title: "Cookie Policy | Calendra", description: "Calendra cookie policy covering necessary cookies, preferences, analytics and managing cookies." },
  },
  security: {
    sl: { title: "Varnost | Calendra", description: "Javni povzetek varnostnih ukrepov Calendra za zaščito platforme, najemnikov, gostov in osebnih podatkov." },
    en: { title: "Security | Calendra", description: "Public summary of Calendra security measures used to protect the platform, tenants, guests and personal data." },
  },
  dataRights: {
    sl: { title: "Pravice posameznikov | Calendra", description: "Kako lahko posamezniki uveljavljajo pravice glede osebnih podatkov pri Calendri ali pri najemniku, ki uporablja Calendro." },
    en: { title: "Data Rights | Calendra", description: "How individuals can exercise personal data rights with Calendra or with a tenant using Calendra." },
  },
  zoom: {
    sl: { title: "Zoom integracija | Calendra navodila", description: "Navodila za povezavo, uporabo in odstranitev Zoom integracije v Calendri za ustvarjanje spletnih terminov in Zoom povezav." },
    en: { title: "Zoom integration | Calendra setup guide", description: "How to connect, use and remove the Zoom integration in Calendra for online appointments and automatically generated Zoom links." },
  },
  blog: {
    sl: { title: "Nasveti za storitvena podjetja | Calendra blog", description: "Praktični vodniki o naročanju strank, zmanjševanju pozabljenih terminov, izdaji računov, davčnem potrjevanju in GDPR za slovenska storitvena podjetja." },
    en: { title: "Guides for service businesses | Calendra blog", description: "Practical guides on appointment booking, reducing no-shows, invoicing, fiscal verification and GDPR for service businesses in Slovenia." },
  },
  author: {
    sl: { title: "David Mirc | Avtor vsebin Calendra", description: "David Mirc je ustanovitelj Calendre in avtor vodnikov o naročanju strank, avtomatizaciji terminov in poslovanju storitvenih podjetij v Sloveniji." },
    en: { title: "David Mirc | Calendra content author", description: "David Mirc is the founder of Calendra and the author of guides on appointment booking, scheduling automation and running a service business in Slovenia." },
  },
  aiTransparency: {
    sl: { title: "AI transparentnost | Calendra", description: "Javno razkritje uporabe AI funkcionalnosti v Calendri, vključno s statusom produkcijskega zagona in ponudnikom OpenAI, če bodo AI funkcije omogočene." },
    en: { title: "AI transparency | Calendra", description: "Public disclosure of Calendra AI features, including production launch status and OpenAI provider information if AI features are enabled." },
  },
  accountDeletion: {
    sl: { title: "Izbris računa | Calendra Guest App", description: "Navodila za izbris računa Calendra Guest App v aplikaciji ali prek javne zahteve za izbris računa.", noindex: true },
    en: { title: "Account deletion | Calendra Guest App", description: "Instructions for deleting a Calendra Guest App account in the app or through a public account deletion request.", noindex: true },
  },
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

const formatPrice = (value: number) => value.toFixed(2);

/**
 * Schema prices are derived from the same catalog the pricing page renders, so
 * published markup cannot advertise a price the site never shows. Read lazily:
 * during a build the prerender script snapshots the live catalog first, and
 * these numbers have to follow it rather than the committed fallback.
 */
const cheapestPlan = () =>
  [...getInitialPricingCatalog().plans].sort((a, b) => a.monthlyGross - b.monthlyGross)[0];

/** Fallback-derived, because the static `index.html` shell is built without a catalog. */
export const ENTRY_PLAN_MONTHLY_PRICE = formatPrice(
  [...FALLBACK_PUBLIC_PRICING.plans].sort((a, b) => a.monthlyGross - b.monthlyGross)[0].monthlyGross,
);

const organizationSchema = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Calendra",
  legalName: LEGAL.entityName,
  url: SITE_URL,
  email: LEGAL.generalEmail,
  telephone: LEGAL.supportPhoneTel,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/calendra-logo.png`, width: 512, height: 512 },
  address: { "@type": "PostalAddress", streetAddress: LEGAL.businessAddress, postalCode: LEGAL.postalCode, addressLocality: LEGAL.city, addressCountry: "SI" },
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: LEGAL.supportEmail, telephone: LEGAL.supportPhoneTel, availableLanguage: ["Slovenian", "English"] },
  founder: { "@id": `${SITE_URL}/#author-david-mirc` },
  areaServed: { "@type": "Country", name: "Slovenia" },
  knowsLanguage: ["sl", "en"],
  vatID: COMPANY_VAT_ID,
  taxID: COMPANY_VAT_ID,
  identifier: COMPANY_REGISTRATION_NUMBER
    ? {
        "@type": "PropertyValue",
        propertyID: "AJPES",
        name: "Matična številka",
        value: COMPANY_REGISTRATION_NUMBER,
      }
    : undefined,
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
  description: language === "sl"
    ? "Slovenska platforma za spletno naročanje, koledar terminov, opomnike, račune, plačila, analitiko in upravljanje strank."
    : "A booking and appointment management platform for service businesses, including reminders, invoicing, payments, analytics and client management.",
  offers: {
    "@type": "Offer",
    price: formatPrice(cheapestPlan().monthlyGross),
    priceCurrency: getInitialPricingCatalog().currency,
    availability: "https://schema.org/InStock",
    url: absoluteUrl(canonicalRoutes.pricing[language]),
  },
  // Set once a Wikidata item for Calendra exists. A Wikidata identifier is the
  // reference most knowledge graphs and AI assistants reconcile entities
  // against, so it is the single highest-value off-site signal.
  sameAs: WIKIDATA_ENTITY_ID ? [`https://www.wikidata.org/wiki/${WIKIDATA_ENTITY_ID}`] : undefined,
  publisher: { "@id": `${SITE_URL}/#organization` },
});

const mobileApplicationSchema = (language: SiteLanguage) => ({
  "@type": "MobileApplication",
  "@id": `${SITE_URL}/calendra-connect#mobile-app`,
  name: "Calendra Connect",
  alternateName: "Calendra Book",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Android",
  url: absoluteUrl(canonicalRoutes.connect[language]),
  inLanguage: language === "sl" ? "sl-SI" : "en",
  description: language === "sl"
    ? "Mobilna aplikacija za rezervacijo, prestavljanje in odpoved terminov, obvestila, plačila, ugodnosti in vstopnice pri ponudnikih, ki uporabljajo Calendro."
    : "A mobile app for booking, rescheduling and cancelling appointments, notifications, payments, benefits and tickets with providers using Calendra.",
  image: `${SITE_URL}/connect/calendra-connect-icon.png`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  downloadUrl: CALENDRA_CONNECT_STORE_URLS.length > 0 ? CALENDRA_CONNECT_STORE_URLS : undefined,
  installUrl: GOOGLE_PLAY_APP_URL || APP_STORE_APP_URL || undefined,
  sameAs: CALENDRA_CONNECT_STORE_URLS.length > 0 ? CALENDRA_CONNECT_STORE_URLS : undefined,
  publisher: { "@id": `${SITE_URL}/#organization` },
});

const itServicesOverviewSchema = (language: SiteLanguage) => ({
  "@type": "Service",
  "@id": `${absoluteUrl(canonicalRoutes.itServices[language])}#service`,
  name: language === "sl" ? "IT storitve za mala podjetja" : "IT services for small businesses",
  serviceType: language === "sl" ? "IT storitve in digitalna podpora" : "IT services and digital support",
  description: pageSeo.itServices[language].description,
  url: absoluteUrl(canonicalRoutes.itServices[language]),
  areaServed: { "@type": "Country", name: "Slovenia" },
  provider: { "@id": `${SITE_URL}/#organization` },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: language === "sl" ? "IT storitve" : "IT services",
    itemListElement: IT_SERVICE_ROUTE_KEYS.map((routeKey) => {
      const service = getItServiceContent(routeKey, language);
      return {
        "@type": "Offer",
        url: absoluteUrl(canonicalRoutes[routeKey][language]),
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.shortDescription,
          provider: { "@id": `${SITE_URL}/#organization` },
        },
      };
    }),
  },
});

const itServiceSchema = (routeKey: Parameters<typeof getItServiceContent>[0], language: SiteLanguage) => {
  const service = getItServiceContent(routeKey, language);
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(canonicalRoutes[routeKey][language])}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.intro,
    url: absoluteUrl(canonicalRoutes[routeKey][language]),
    areaServed: { "@type": "Country", name: "Slovenia" },
    provider: { "@id": `${SITE_URL}/#organization` },
  };
};

const industryServiceSchema = (routeKey: IndustryRouteKey, language: SiteLanguage) => {
  const industry = getIndustryContent(routeKey, language);
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(canonicalRoutes[routeKey][language])}#service`,
    name: industry.title,
    serviceType: language === "sl" ? "Program za naročanje in upravljanje terminov" : "Booking and appointment management software",
    description: industry.intro,
    url: absoluteUrl(canonicalRoutes[routeKey][language]),
    areaServed: { "@type": "Country", name: "Slovenia" },
    audience: industry.audiences.map((audience) => ({ "@type": "Audience", audienceType: audience })),
    provider: { "@id": `${SITE_URL}/#organization` },
  };
};

/**
 * FAQ markup is one of the most frequently quoted sources in AI answers and
 * powers Google's expandable results, so every page that shows questions to a
 * visitor emits them as structured data too.
 */
const faqSchema = (routeKey: CanonicalRouteKey, language: SiteLanguage) => {
  const faq = getFaqForRoute(routeKey, language);
  if (!faq) return [];

  return [
    {
      "@type": "FAQPage",
      "@id": `${absoluteUrl(canonicalRoutes[routeKey][language])}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["[data-speakable='faq']"],
      },
    },
  ];
};

/**
 * Wikidata identifiers attach Calendra to entities that language models and
 * knowledge graphs already understand, rather than leaving "appointment
 * scheduling software" as an unlinked string.
 */
const WIKIDATA = {
  appointmentScheduling: "https://www.wikidata.org/wiki/Q4781294",
  saas: "https://www.wikidata.org/wiki/Q1254596",
  slovenia: "https://www.wikidata.org/wiki/Q215",
} as const;

/**
 * Named author and founder. Google's quality guidance and AI citation
 * behaviour both favour content attributable to an identifiable person.
 */
export const AUTHOR = {
  name: "David Mirc",
  slug: "david-mirc",
  jobTitle: { sl: "Ustanovitelj in razvijalec Calendre", en: "Founder and developer of Calendra" },
  bio: {
    sl: "David Mirc je ustanovitelj Calendre in vodi razvoj platforme za naročanje strank, upravljanje terminov ter izdajo računov za slovenska storitvena podjetja. Poleg tega izvaja IT storitve za mala podjetja.",
    en: "David Mirc is the founder of Calendra and leads development of its booking, appointment management and invoicing platform for Slovenian service businesses. He also delivers IT services for small businesses.",
  },
} as const;

export const personSchema = (language: SiteLanguage) => ({
  "@type": "Person",
  "@id": `${SITE_URL}/#author-${AUTHOR.slug}`,
  name: AUTHOR.name,
  jobTitle: AUTHOR.jobTitle[language],
  description: AUTHOR.bio[language],
  email: LEGAL.generalEmail,
  worksFor: { "@id": `${SITE_URL}/#organization` },
  url: absoluteUrl(canonicalRoutes.author[language]),
  sameAs: AUTHOR_PROFILE_URLS.length > 0 ? AUTHOR_PROFILE_URLS : undefined,
  knowsAbout:
    language === "sl"
      ? ["Spletno naročanje terminov", "Upravljanje storitvenih podjetij", "Izdaja računov in davčno potrjevanje", "IT podpora za mala podjetja"]
      : ["Online appointment booking", "Service business management", "Invoicing and fiscal verification", "Small business IT support"],
});

const pricingProductSchema = (language: SiteLanguage) => {
  const catalog = getInitialPricingCatalog();
  const prices = catalog.plans.map((plan) => plan.monthlyGross);

  return {
    "@type": "Product",
    "@id": `${absoluteUrl(canonicalRoutes.pricing[language])}#product`,
    name: "Calendra",
    description: pageSeo.pricing[language].description,
    url: absoluteUrl(canonicalRoutes.pricing[language]),
    brand: { "@id": `${SITE_URL}/#organization` },
    category: language === "sl" ? "Program za naročanje strank" : "Appointment booking software",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: catalog.currency,
      lowPrice: formatPrice(Math.min(...prices)),
      highPrice: formatPrice(Math.max(...prices)),
      offerCount: catalog.plans.length,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(canonicalRoutes.pricing[language]),
      offers: catalog.plans.map((plan) => ({
        "@type": "Offer",
        name: language === "sl" ? plan.nameSl : plan.name,
        price: formatPrice(plan.monthlyGross),
        priceCurrency: catalog.currency,
        availability: "https://schema.org/InStock",
        url: absoluteUrl(canonicalRoutes.pricing[language]),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: formatPrice(plan.monthlyGross),
          priceCurrency: catalog.currency,
          valueAddedTaxIncluded: catalog.vatIncluded,
          unitCode: "MON",
          billingIncrement: 1,
        },
      })),
    },
  };
};

const zoomHowToSchema = (language: SiteLanguage) => ({
  "@type": "HowTo",
  "@id": `${absoluteUrl(canonicalRoutes.zoom[language])}#howto`,
  name: language === "sl" ? "Kako povezati Zoom s Calendro" : "How to connect Zoom to Calendra",
  description: pageSeo.zoom[language].description,
  totalTime: "PT5M",
  step:
    language === "sl"
      ? [
          { "@type": "HowToStep", position: 1, name: "Odprite nastavitve integracij", text: "V Calendri odprite Nastavitve in izberite zavihek Integracije." },
          { "@type": "HowToStep", position: 2, name: "Povežite Zoom račun", text: "Kliknite Poveži pri Zoom in potrdite dostop v Zoom oknu za avtorizacijo." },
          { "@type": "HowToStep", position: 3, name: "Omogočite Zoom pri storitvah", text: "Pri storitvah, ki potekajo na daljavo, vklopite možnost spletnega srečanja." },
          { "@type": "HowToStep", position: 4, name: "Preverite delovanje", text: "Ustvarite testni termin. Calendra samodejno ustvari Zoom povezavo in jo pošlje v potrditvenem sporočilu." },
        ]
      : [
          { "@type": "HowToStep", position: 1, name: "Open integration settings", text: "In Calendra, open Settings and select the Integrations tab." },
          { "@type": "HowToStep", position: 2, name: "Connect your Zoom account", text: "Click Connect next to Zoom and approve access in the Zoom authorisation window." },
          { "@type": "HowToStep", position: 3, name: "Enable Zoom on services", text: "Turn on the online meeting option for the services you deliver remotely." },
          { "@type": "HowToStep", position: 4, name: "Verify the setup", text: "Create a test appointment. Calendra generates the Zoom link automatically and includes it in the confirmation message." },
        ],
});

const webPageSchema = (routeKey: CanonicalRouteKey, language: SiteLanguage, canonicalPath: string) => ({
  "@type": "WebPage",
  "@id": `${absoluteUrl(canonicalPath)}#webpage`,
  url: absoluteUrl(canonicalPath),
  name: pageSeo[routeKey][language].title,
  description: pageSeo[routeKey][language].description,
  inLanguage: language === "sl" ? "sl-SI" : "en",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": WIKIDATA.appointmentScheduling },
  mentions: [
    { "@type": "Thing", "@id": WIKIDATA.appointmentScheduling, name: "Appointment scheduling software" },
    { "@type": "Thing", "@id": WIKIDATA.saas, name: "Software as a service" },
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["[data-speakable='answer']", "[data-speakable='faq']"],
  },
});

/**
 * Intermediate breadcrumb hops. Only IT service detail pages sit under a real
 * hub page today; features and industries are linked from the navigation rather
 * than from an index page, so they stay one level below home.
 */
export const breadcrumbParentByRouteKey: Partial<Record<CanonicalRouteKey, CanonicalRouteKey>> = {
  itSupport: "itServices",
  websiteDesign: "itServices",
  websiteMaintenance: "itServices",
  businessEmail: "itServices",
  backupsSecurity: "itServices",
  automation: "itServices",
  dpa: "legal",
  subprocessors: "legal",
  cookies: "legal",
  dataRights: "legal",
  security: "legal",
  privacy: "legal",
  terms: "legal",
};

const breadcrumbSchema = (routeKey: CanonicalRouteKey, language: SiteLanguage, canonicalPath: string) => {
  if (routeKey === "home") {
    return {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: language === "sl" ? "Domov" : "Home", item: absoluteUrl(canonicalRoutes.home[language]) },
      ],
    };
  }

  const parentRouteKey = breadcrumbParentByRouteKey[routeKey];
  const trail: CanonicalRouteKey[] = parentRouteKey ? [parentRouteKey] : [];

  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: language === "sl" ? "Domov" : "Home", item: absoluteUrl(canonicalRoutes.home[language]) },
      ...trail.map((key, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: pageSeo[key][language].title.split("|")[0].trim(),
        item: absoluteUrl(canonicalRoutes[key][language]),
      })),
      {
        "@type": "ListItem",
        position: trail.length + 2,
        name: pageSeo[routeKey][language].title.split("|")[0].trim(),
        item: absoluteUrl(canonicalPath),
      },
    ],
  };
};

export const getArticleOgImage = (article: BlogArticleMeta) =>
  `${SITE_URL}/og/blog/${article.language}/${article.slug}.png`;

/**
 * `BlogPosting` is what makes an article eligible for Google's article
 * treatments and gives AI assistants an explicit author, publication date and
 * word count to weigh the source by. `speakable` points at the same
 * answer-first paragraph a human reads first.
 */
const blogPostingSchema = (article: BlogArticleMeta, canonicalUrl: string) => ({
  "@type": "BlogPosting",
  "@id": `${canonicalUrl}#article`,
  mainEntityOfPage: { "@id": `${canonicalUrl}#webpage` },
  headline: article.title,
  description: article.description,
  abstract: article.answer,
  url: canonicalUrl,
  inLanguage: article.language === "sl" ? "sl-SI" : "en",
  datePublished: article.datePublished,
  dateModified: article.dateModified,
  wordCount: article.wordCount,
  timeRequired: `PT${article.readingMinutes}M`,
  articleSection: article.category,
  keywords: article.tags.join(", "),
  author: { "@id": `${SITE_URL}/#author-${AUTHOR.slug}` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  image: {
    "@type": "ImageObject",
    url: getArticleOgImage(article),
    width: 1200,
    height: 630,
    caption: article.heroImageAlt,
  },
  isPartOf: { "@id": `${absoluteUrl(canonicalRoutes.blog[article.language])}#blog` },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["[data-speakable='answer']"],
  },
});

const blogSchema = (language: SiteLanguage) => ({
  "@type": "Blog",
  "@id": `${absoluteUrl(canonicalRoutes.blog[language])}#blog`,
  name: pageSeo.blog[language].title,
  description: pageSeo.blog[language].description,
  url: absoluteUrl(canonicalRoutes.blog[language]),
  inLanguage: language === "sl" ? "sl-SI" : "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
  author: { "@id": `${SITE_URL}/#author-${AUTHOR.slug}` },
  blogPost: getArticlesForLanguage(language).map((article) => ({
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(getBlogArticlePath(article.slug, language))}#article`,
    headline: article.title,
    url: absoluteUrl(getBlogArticlePath(article.slug, language)),
    datePublished: article.datePublished,
  })),
});

const articleBreadcrumbSchema = (article: BlogArticleMeta, canonicalUrl: string) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: article.language === "sl" ? "Domov" : "Home", item: absoluteUrl(canonicalRoutes.home[article.language]) },
    { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl(canonicalRoutes.blog[article.language]) },
    { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
  ],
});

const getArticleSeo = (pathname: string) => {
  const article = getArticleFromPathname(pathname);
  if (!article) return undefined;

  const alternates = getArticleAlternates(article);
  const canonicalUrl = absoluteUrl(getBlogArticlePath(article.slug, article.language));
  const ogImage = getArticleOgImage(article);

  return {
    articleSlug: article.slug,
    language: article.language,
    title: `${article.title} | Calendra`,
    description: article.description,
    ogTitle: article.title,
    ogDescription: article.description,
    ogImage,
    canonicalUrl,
    alternateUrls: {
      sl: absoluteUrl(alternates.sl),
      en: absoluteUrl(alternates.en),
      xDefault: absoluteUrl(alternates.sl),
    },
    noindex: false,
    articleDates: { published: article.datePublished, modified: article.dateModified },
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        organizationSchema,
        websiteSchema(article.language),
        {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: article.title,
          description: article.description,
          inLanguage: article.language === "sl" ? "sl-SI" : "en",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          datePublished: article.datePublished,
          dateModified: article.dateModified,
        },
        blogPostingSchema(article, canonicalUrl),
        personSchema(article.language),
        articleBreadcrumbSchema(article, canonicalUrl),
      ],
    },
  };
};

const getProfileSeo = (pathname: string, language: SiteLanguage) => {
  const profile = getPublicCompanyProfileFromPathname(pathname);
  if (!profile) return undefined;

  const canonicalPath = getPublicCompanyProfilePath(profile.slug, language);
  const slPath = getPublicCompanyProfilePath(profile.slug, "sl");
  const enPath = getPublicCompanyProfilePath(profile.slug, "en");
  const description = profile.localizedDescription[language];
  const title = language === "sl"
    ? `${profile.name} | Naročanje termina s Calendro`
    : `${profile.name} | Book an appointment with Calendra`;
  const noindex = !isIndexablePublicProfile(profile);
  const services = profile.serviceCategories[language];

  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl(canonicalPath)}#business`,
    name: profile.name,
    description,
    url: absoluteUrl(canonicalPath),
    image: profile.logoUrl || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.city || undefined,
      addressCountry: profile.countryCode,
      streetAddress: profile.city && profile.address !== profile.city ? profile.address : undefined,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: language === "sl" ? "Storitve" : "Services",
      itemListElement: services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service } })),
    },
    aggregateRating: profile.review ? { "@type": "AggregateRating", ratingValue: profile.review.rating, reviewCount: 1, bestRating: 5 } : undefined,
    review: profile.review ? {
      "@type": "Review",
      author: { "@type": "Person", name: profile.review.author },
      reviewRating: { "@type": "Rating", ratingValue: profile.review.rating, bestRating: 5 },
      reviewBody: profile.review.text[language],
    } : undefined,
  };

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: language === "sl" ? "Domov" : "Home", item: absoluteUrl(canonicalRoutes.home[language]) },
      { "@type": "ListItem", position: 2, name: language === "sl" ? "Naročanje" : "Booking", item: absoluteUrl(canonicalRoutes.booking[language]) },
      { "@type": "ListItem", position: 3, name: profile.name, item: absoluteUrl(canonicalPath) },
    ],
  };

  return {
    profileSlug: profile.slug,
    language,
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: DEFAULT_OG_IMAGE,
    canonicalUrl: absoluteUrl(canonicalPath),
    alternateUrls: { sl: absoluteUrl(slPath), en: absoluteUrl(enPath), xDefault: absoluteUrl(slPath) },
    noindex,
    structuredData: { "@context": "https://schema.org", "@graph": [organizationSchema, websiteSchema(language), localBusinessSchema, breadcrumbs] },
  };
};

export const getSeoForPathname = (pathname: string) => {
  const language = getLanguageFromPathname(pathname);
  const profileSeo = getProfileSeo(pathname, language);
  if (profileSeo) return profileSeo;

  const articleSeo = getArticleSeo(pathname);
  if (articleSeo) return articleSeo;

  const routeKey = getRouteKeyFromPathname(pathname);
  const canonicalPath = getCanonicalPathname(pathname);

  if (!routeKey || !pageSeo[routeKey]) {
    return {
      language,
      title: language === "sl" ? "Stran ni najdena | Calendra" : "Page not found | Calendra",
      description: language === "sl" ? "Zahtevana stran ne obstaja ali je bila premaknjena." : "The requested page does not exist or has been moved.",
      ogImage: DEFAULT_OG_IMAGE,
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
    ogImage: seo.ogImage || DEFAULT_OG_IMAGE,
    canonicalUrl: absoluteUrl(canonicalPath),
    alternateUrls: { sl: absoluteUrl(slPath), en: absoluteUrl(enPath), xDefault: absoluteUrl(slPath) },
    noindex: seo.noindex,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        organizationSchema,
        websiteSchema(language),
        webPageSchema(routeKey, language, canonicalPath),
        ...(routeKey === "blog"
          ? [blogSchema(language)]
          : routeKey === "author"
          ? [{
              "@type": "ProfilePage",
              "@id": `${absoluteUrl(canonicalRoutes.author[language])}#profile`,
              mainEntity: { "@id": `${SITE_URL}/#author-${AUTHOR.slug}` },
            }]
          : routeKey === "connect"
          ? [mobileApplicationSchema(language)]
          : routeKey === "itServices"
            ? [itServicesOverviewSchema(language)]
            : isItServiceRouteKey(routeKey)
              ? [itServiceSchema(routeKey, language)]
              : isIndustryRouteKey(routeKey)
                ? [softwareSchema(language), industryServiceSchema(routeKey, language)]
                : routeKey === "pricing"
                  ? [softwareSchema(language), pricingProductSchema(language)]
                  : routeKey === "zoom"
                    ? [softwareSchema(language), zoomHowToSchema(language)]
                    : routeKey === "contact"
                      ? []
                      : [softwareSchema(language)]),
        ...faqSchema(routeKey, language),
        personSchema(language),
        breadcrumbSchema(routeKey, language, canonicalPath),
      ],
    },
  };
};
