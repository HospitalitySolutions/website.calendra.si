import { calendraConnectCopy } from "@/lib/calendra-connect";
import { FEATURE_ROUTE_KEYS, getFeatureContent } from "@/lib/feature-pages";
import { ALL_INDUSTRY_ROUTE_KEYS, getIndustryContent } from "@/lib/industry-pages";
import { itServicesCopy, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import type { CanonicalRouteKey } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";

export type FaqItem = {
  question: string;
  answer: string;
};

type LocalizedFaq = Record<SiteLanguage, FaqItem[]>;

/**
 * FAQ content that is rendered inline by a single page. Content owned by a
 * shared module (industries, IT services, Calendra Connect) is pulled from that
 * module below instead of being duplicated here.
 */
const inlineFaqs: Partial<Record<CanonicalRouteKey, LocalizedFaq>> = {
  home: {
    sl: [
      { question: "Komu je Calendra namenjena?", answer: "Storitvenim podjetjem in posameznikom, ki upravljajo termine, stranke, zaposlene, opomnike, plačila ali račune." },
      { question: "Ali lahko stranke rezervirajo same?", answer: "Da. Uporabite lahko javno povezavo, vtičnik na svoji spletni strani ali gostujočo aplikacijo. Pravila naročanja določite sami." },
      { question: "Ali Calendra preprečuje dvojne rezervacije?", answer: "Calendra pri razpoložljivosti upošteva delovni čas, odsotnosti, obstoječe termine, zaposlene in po potrebi prostore ali naprave." },
      { question: "Ali so opomniki vključeni?", answer: "E-poštna in SMS obvestila so odvisna od izbranega paketa in nastavitev. SMS poraba je jasno prikazana v ceniku." },
      { question: "Kako dolgo traja brezplačni preizkus?", answer: "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice." },
    ],
    en: [
      { question: "Who is Calendra for?", answer: "Service businesses and independent professionals who manage appointments, clients, employees, reminders, payments or invoices." },
      { question: "Can customers book by themselves?", answer: "Yes. You can use a public link, a widget on your own website or the guest app. You define the booking rules." },
      { question: "Does Calendra prevent double bookings?", answer: "Calendra checks working hours, absences, existing appointments, employees and, where relevant, rooms or equipment when calculating availability." },
      { question: "Are reminders included?", answer: "Email and SMS notifications depend on the selected plan and configuration. SMS usage is shown transparently in the pricing." },
      { question: "How long is the free trial?", answer: "The free trial lasts 14 days and does not require a credit card." },
    ],
  },
  pricing: {
    sl: [
      { question: "Ali je v ceni vključen uporabnik?", answer: "Da. Vsak paket vključuje enega uporabnika. Dodatne uporabnike lahko dodate po objavljeni mesečni ceni." },
      { question: "Kako se obračunajo SMS sporočila?", answer: "SMS sporočila se obračunajo glede na izbrano količino oziroma porabo po ceni, prikazani v konfiguratorju." },
      { question: "Ali lahko paket pozneje spremenim?", answer: "Da. Paket, število uporabnikov in dodatke lahko prilagodite glede na razvoj poslovanja." },
      { question: "Ali potrebujem kreditno kartico za preizkus?", answer: "Ne. Za 14-dnevni brezplačni preizkus kreditna kartica ni potrebna." },
      { question: "Ali podpira skupinske termine, tečaje ali vadbe?", answer: "Da. Od paketa Profesionalno naprej lahko omogočite skupinske rezervacije z omejenim številom mest za tečaje, delavnice in vadbe. Stranke vidijo trenutno zasedenost in se prijavijo same, brez ročnega usklajevanja." },
    ],
    en: [
      { question: "Is one user included?", answer: "Yes. Every plan includes one user. Additional users can be added at the published monthly price." },
      { question: "How are SMS messages charged?", answer: "SMS messages are charged based on the selected quantity or usage at the price shown in the configurator." },
      { question: "Can I change plans later?", answer: "Yes. You can adjust the plan, user count and add-ons as your business develops." },
      { question: "Do I need a credit card for the trial?", answer: "No. A credit card is not required for the 14-day free trial." },
      { question: "Does it support group classes, courses or sessions?", answer: "Yes. From the Professional plan upward you can enable group bookings with a capacity limit for classes, workshops and sessions. Customers see current availability and book themselves, without manual coordination." },
    ],
  },
  booking: {
    sl: [
      { question: "Ali potrebujem novo spletno stran?", answer: "Ne. Uporabite lahko javno povezavo ali pa Calendra vtičnik dodate na obstoječo spletno stran." },
      { question: "Kaj se zgodi, če storitev izvaja več zaposlenih?", answer: "Podjetje določi, ali stranka izbere zaposlenega, ali Calendra ponudi prvega razpoložljivega izvajalca." },
      { question: "Ali lahko zahtevam plačilo pred rezervacijo?", answer: "Da. Glede na nastavitve je mogoče zahtevati delno ali celotno plačilo ali dovoliti plačilo na lokaciji." },
      { question: "Ali lahko stranka spremeni ali odpove termin?", answer: "Da, kadar podjetje to omogoči. Varne povezave v potrditvenem sporočilu vodijo do spremembe ali odpovedi." },
      { question: "Ali se rezervacija takoj prikaže v koledarju?", answer: "Da. Po uspešni potrditvi se termin zapiše neposredno v koledar Calendra." },
    ],
    en: [
      { question: "Do I need a new website?", answer: "No. You can use a public link or add the Calendra widget to your existing website." },
      { question: "What happens when several employees provide a service?", answer: "The business decides whether customers select an employee or Calendra offers the first available provider." },
      { question: "Can payment be required before booking?", answer: "Yes. Depending on configuration, the business can require a deposit, full payment or payment on site." },
      { question: "Can a customer reschedule or cancel?", answer: "Yes, when enabled by the business. Secure links in the confirmation message open the change or cancellation flow." },
      { question: "Does the booking appear immediately in the calendar?", answer: "Yes. After successful confirmation, the appointment is added directly to the Calendra calendar." },
    ],
  },
  itServices: {
    sl: [
      { question: "Ali delate samo z uporabniki Calendre?", answer: "Ne. IT storitve so samostojna ponudba za mala podjetja in niso vezane na uporabo aplikacije Calendra." },
      { question: "Ali je možna pomoč na daljavo?", answer: "Da. Velik del podpore, nastavitev in diagnostike izvedemo oddaljeno. Obiske na lokaciji dogovorimo glede na kraj in obseg dela." },
      { question: "Kako določite ceno?", answer: "Po kratkem uvodnem pogovoru predlagamo projektno ceno, urno sodelovanje ali mesečni obseg podpore. IT storitve niso vključene v naročnino Calendra." },
      { question: "Ali lahko prevzamete obstoječo spletno stran ali IT-okolje?", answer: "Da, po začetnem tehničnem pregledu, s katerim ugotovimo stanje, odprta tveganja in realen obseg prevzema." },
    ],
    en: [
      { question: "Do you work only with Calendra customers?", answer: "No. IT services are a standalone offer for small businesses and do not require use of the Calendra application." },
      { question: "Can support be remote?", answer: "Yes. A large share of support, configuration and diagnosis can be completed remotely. On-site work is agreed based on location and scope." },
      { question: "How is pricing determined?", answer: "After a short discussion, we propose a project price, hourly work or a monthly support scope. IT services are not included in a Calendra subscription." },
      { question: "Can you take over an existing website or IT environment?", answer: "Yes, following an initial technical review of its condition, open risks and the realistic takeover scope." },
    ],
  },
};

const buildRegistry = (): Partial<Record<CanonicalRouteKey, LocalizedFaq>> => {
  const registry: Partial<Record<CanonicalRouteKey, LocalizedFaq>> = { ...inlineFaqs };

  registry.connect = {
    sl: calendraConnectCopy.sl.faq.items.map((item) => ({ question: item.q, answer: item.a })),
    en: calendraConnectCopy.en.faq.items.map((item) => ({ question: item.q, answer: item.a })),
  };

  for (const routeKey of FEATURE_ROUTE_KEYS) {
    registry[routeKey] = {
      sl: getFeatureContent(routeKey, "sl").faq,
      en: getFeatureContent(routeKey, "en").faq,
    };
  }

  for (const routeKey of ALL_INDUSTRY_ROUTE_KEYS) {
    registry[routeKey] = {
      sl: getIndustryContent(routeKey, "sl").faq,
      en: getIndustryContent(routeKey, "en").faq,
    };
  }

  for (const routeKey of IT_SERVICE_ROUTE_KEYS) {
    registry[routeKey] = {
      sl: itServicesCopy.sl[routeKey].faq,
      en: itServicesCopy.en[routeKey].faq,
    };
  }

  return registry;
};

/**
 * Single registry of every FAQ on the site so visible question-and-answer
 * sections stay consistent across pages and generated summaries.
 */
export const faqByRouteKey = buildRegistry();

export const getFaqForRoute = (
  routeKey: CanonicalRouteKey | undefined,
  language: SiteLanguage,
): FaqItem[] | undefined => {
  if (!routeKey) return undefined;
  const entry = faqByRouteKey[routeKey];
  if (!entry) return undefined;

  const items = entry[language];
  return items.length > 0 ? items : undefined;
};

export const FAQ_ROUTE_KEYS = Object.keys(faqByRouteKey) as CanonicalRouteKey[];
