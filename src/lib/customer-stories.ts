import type { SiteLanguage } from "@/lib/site-language";
import type { IndustryRouteKey } from "@/lib/industry-pages";

export type CustomerStoryFact = {
  label: string;
  value: string;
};

export type CustomerStoryFeature = {
  title: string;
  description: string;
};

export type CustomerStoryLocalizedContent = {
  title: string;
  description: string;
  eyebrow: string;
  businessDescription: string;
  challengeTitle: string;
  challenge: string[];
  setupTitle: string;
  facts: CustomerStoryFact[];
  workflowTitle: string;
  workflowIntro: string;
  features: CustomerStoryFeature[];
  outcomeTitle: string;
  outcomes: string[];
  testimonial: string;
  representativeRole: string;
  websiteLabel: string;
  industryCta: string;
};

export type CustomerStory = {
  slug: string;
  name: string;
  websiteUrl: string;
  representative: string;
  logo: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  industryRouteKey: IndustryRouteKey;
  lastModified: string;
  content: Record<SiteLanguage, CustomerStoryLocalizedContent>;
};

export const customerStories: CustomerStory[] = [
  {
    slug: "institut-avisensa",
    name: "Inštitut Avisensa",
    websiteUrl: "https://avisensa.com/",
    representative: "Nina Piberčnik",
    logo: {
      src: "/customer-stories/institut-avisensa.png",
      width: 217,
      height: 250,
      alt: "Inštitut Avisensa",
    },
    industryRouteKey: "healthWellbeing",
    lastModified: "2026-08-11",
    content: {
      sl: {
        eyebrow: "Zgodba stranke · psihološke storitve",
        title: "Kako Inštitut Avisensa s Calendro organizira termine petih uporabnikov",
        description:
          "Inštitut Avisensa je Google Koledar zamenjal s Calendro, da ima termine, stranke in opomnike pregledno na enem mestu za pet uporabnikov.",
        businessDescription:
          "Inštitut Avisensa v Mariboru izvaja psihološko svetovanje, psihološke programe ter storitve za podjetja in ustanove. Pri vsakodnevni organizaciji jim je pomemben zanesljiv pregled nad termini in podatki strank.",
        challengeTitle: "Pred Calendro: Google Koledar je pokrival čas, ne pa celotnega delovnega procesa",
        challenge: [
          "Termine so pred uvedbo Calendre vodili v Google Koledarju.",
          "Ko je sistem začelo uporabljati pet ljudi, je postalo pomembno, da so termini in podatki strank urejeni v istem okolju.",
          "Potrebovali so tudi samodejne opomnike, da komunikacije pred terminom ni treba izvajati ročno.",
        ],
        setupTitle: "Kako uporabljajo Calendro",
        facts: [
          { label: "Prejšnje orodje", value: "Google Koledar" },
          { label: "Uporabniki", value: "5" },
          { label: "Spletno naročanje", value: "Ne" },
          { label: "Opomniki", value: "Da" },
        ],
        workflowTitle: "Calendra kot notranji sistem za organizacijo terminov",
        workflowIntro:
          "Avisensa Calendre ne uporablja kot javnega sistema za samostojno spletno naročanje. Njihov primer pokaže, da je platforma uporabna tudi takrat, ko želi organizacija obdržati nadzor nad vnosom terminov, hkrati pa poenotiti delo ekipe.",
        features: [
          { title: "Skupen koledar terminov", description: "Pet uporabnikov dela z enotnim pregledom terminov namesto ločenega koledarskega zapisa brez povezanega profila stranke." },
          { title: "Profili strank", description: "Termini in podatki strank ostanejo povezani, zato je manj preklapljanja med različnimi orodji." },
          { title: "Samodejni opomniki", description: "Pred terminom se lahko pošljejo vnaprej pripravljena obvestila, brez ročnega opominjanja vsake stranke." },
        ],
        outcomeTitle: "Največja korist: prihranek časa in vse na enem mestu",
        outcomes: [
          "Ekipa ima enotnejši pregled nad organizacijo terminov.",
          "Podatki o strankah in termini niso več omejeni samo na koledarski zapis.",
          "Samodejni opomniki zmanjšajo količino ročne administracije pred terminom.",
        ],
        testimonial:
          "Calendra nam omogoča, da imamo termine, stranke in organizacijo dela pregledno na enem mestu. Posebej nam je pomembno, da je sistem enostaven za uporabo tako za našo ekipo kot za stranke, ki se naročajo na termine.",
        representativeRole: "Direktor, Inštitut Avisensa",
        websiteLabel: "Obiščite spletno stran Inštituta Avisensa",
        industryCta: "Calendra za zdravje in dobro počutje",
      },
      en: {
        eyebrow: "Customer story · psychological services",
        title: "How Inštitut Avisensa organises appointments for five Calendra users",
        description:
          "Inštitut Avisensa moved from Google Calendar to Calendra to keep appointments, client information and reminders organised in one place for five users.",
        businessDescription:
          "Inštitut Avisensa in Maribor provides psychological counselling, psychological programmes and services for companies and institutions. Reliable appointment and client organisation is an important part of their day-to-day work.",
        challengeTitle: "Before Calendra: Google Calendar covered time, but not the full workflow",
        challenge: [
          "Before adopting Calendra, appointments were managed in Google Calendar.",
          "With five people using the system, keeping appointments and client information in the same environment became more important.",
          "They also needed automated reminders so pre-appointment communication did not have to be handled manually.",
        ],
        setupTitle: "How they use Calendra",
        facts: [
          { label: "Previous tool", value: "Google Calendar" },
          { label: "Users", value: "5" },
          { label: "Online self-booking", value: "No" },
          { label: "Reminders", value: "Yes" },
        ],
        workflowTitle: "Calendra as an internal appointment-management system",
        workflowIntro:
          "Avisensa does not use Calendra as a public self-booking system. Their setup shows that the platform is also useful when an organisation wants to retain control over appointment entry while standardising how the team works.",
        features: [
          { title: "Shared appointment calendar", description: "Five users work from one appointment overview rather than calendar entries that are disconnected from client profiles." },
          { title: "Client profiles", description: "Appointments and client information stay connected, reducing the need to switch between separate tools." },
          { title: "Automated reminders", description: "Prepared notifications can be sent before appointments without manually reminding every client." },
        ],
        outcomeTitle: "Main benefit: saving time and keeping everything in one place",
        outcomes: [
          "The team has a more consistent overview of appointment organisation.",
          "Client and appointment information is no longer limited to a calendar entry alone.",
          "Automated reminders reduce repetitive administration before appointments.",
        ],
        testimonial:
          "Calendra lets us keep appointments, clients and work organisation clearly in one place. It is especially important to us that the system is easy to use both for our team and for clients booking appointments.",
        representativeRole: "Director, Inštitut Avisensa",
        websiteLabel: "Visit the Inštitut Avisensa website",
        industryCta: "Calendra for health and wellbeing",
      },
    },
  },
  {
    slug: "depilacije-ug",
    name: "Depilacije UG",
    websiteUrl: "https://www.depilacijeug.si/",
    representative: "Urška Grmek",
    logo: {
      src: "/customer-stories/depilacije-ug.svg",
      width: 734,
      height: 245,
      alt: "Depilacije UG",
    },
    industryRouteKey: "beautyHair",
    lastModified: "2026-08-11",
    content: {
      sl: {
        eyebrow: "Zgodba stranke · depilacije in masaže",
        title: "Kako Depilacije UG s Calendro zmanjša telefonsko usklajevanje terminov",
        description:
          "Depilacije UG je konkurenčno aplikacijo zamenjal s Calendro ter uporablja spletno naročanje, opomnike, račune in plačila za depilacije in masaže.",
        businessDescription:
          "Depilacije UG je salon Urške Grmek v Mariboru, kjer izvajajo depilacije z voskom in sladkorno pasto ter klasične masaže. Za enega izvajalca je ključno, da lahko stranke prost termin uredijo brez prekinitve dela s telefonskim klicem.",
        challengeTitle: "Pred Calendro: naročanje je že bilo digitalno, vendar so želeli boljši vsakodnevni potek",
        challenge: [
          "Pred Calendro so za rezervacije uporabljali konkurenčno aplikacijo.",
          "Ker delo poteka z eno izvajalko, vsak telefonski klic med storitvijo neposredno prekine delo s stranko.",
          "Želeli so povezati spletne rezervacije, opomnike ter zaključek obiska z računom in plačilom.",
        ],
        setupTitle: "Kako uporabljajo Calendro",
        facts: [
          { label: "Prejšnja rešitev", value: "Konkurenčna aplikacija" },
          { label: "Spletno naročanje", value: "Da" },
          { label: "Storitve", value: "Depilacije in masaže" },
          { label: "Računi in plačila", value: "Da" },
        ],
        workflowTitle: "Od samostojne rezervacije do zaključenega računa",
        workflowIntro:
          "Primer Depilacije UG poveže več delov Calendre v en tok. Stranka lahko rezervacijo uredi sama, sistem jo pred terminom opomni, po opravljeni storitvi pa se lahko obisk zaključi z obračunom in računom.",
        features: [
          { title: "Spletno naročanje", description: "Stranke same izberejo storitev in prost termin, zato ni treba vsake rezervacije uskladiti po telefonu." },
          { title: "SMS in e-poštni opomniki", description: "Potrditve in opomniki zmanjšajo potrebo po ročnem preverjanju, ali stranka ve za termin." },
          { title: "Računi in plačila", description: "Po izvedeni depilaciji ali masaži je obračun del istega delovnega procesa kot termin." },
        ],
        outcomeTitle: "Največja korist: manj telefonskih klicev in manj usklajevanja",
        outcomes: [
          "Stranke lahko rezervacijo opravijo same tudi takrat, ko izvajalka dela s stranko.",
          "Opomniki se pošiljajo brez ročnega dela.",
          "Termin, storitev, plačilo in račun so povezani v enem sistemu.",
        ],
        testimonial:
          "S Calendro je organizacija terminov precej enostavnejša. Stranke se lahko naročijo same, mi pa imamo ves čas jasen pregled nad urnikom in manj usklajevanja po telefonu ali sporočilih.",
        representativeRole: "Lastnik, Depilacije UG",
        websiteLabel: "Obiščite spletno stran Depilacije UG",
        industryCta: "Calendra za lepotne in frizerske salone",
      },
      en: {
        eyebrow: "Customer story · depilation and massage",
        title: "How Depilacije UG reduces appointment coordination by phone with Calendra",
        description:
          "Depilacije UG replaced a competing app with Calendra and uses online booking, reminders, invoicing and payments for depilation and massage services.",
        businessDescription:
          "Depilacije UG is Urška Grmek's salon in Maribor, providing waxing, sugar-paste depilation and classic massage. For a solo provider, it matters that clients can find and book an available time without interrupting a treatment with a phone call.",
        challengeTitle: "Before Calendra: booking was already digital, but the daily workflow needed to be better connected",
        challenge: [
          "Before Calendra, bookings were managed with a competing application.",
          "With a single provider, every phone call during a treatment directly interrupts the client session.",
          "They wanted online booking, reminders and the end-of-visit invoice and payment workflow to work together.",
        ],
        setupTitle: "How they use Calendra",
        facts: [
          { label: "Previous solution", value: "Competing application" },
          { label: "Online booking", value: "Yes" },
          { label: "Services", value: "Depilation and massage" },
          { label: "Invoices and payments", value: "Yes" },
        ],
        workflowTitle: "From self-service booking to a completed invoice",
        workflowIntro:
          "The Depilacije UG setup connects several parts of Calendra in one flow. A client can make their own booking, the system reminds them before the appointment, and the completed service can then move into billing and invoicing.",
        features: [
          { title: "Online booking", description: "Clients choose a service and available time themselves, reducing the need to coordinate every appointment by phone." },
          { title: "SMS and email reminders", description: "Confirmations and reminders reduce the amount of manual follow-up before each appointment." },
          { title: "Invoices and payments", description: "After a depilation or massage service, billing is part of the same workflow as the appointment." },
        ],
        outcomeTitle: "Main benefit: fewer phone calls and less appointment coordination",
        outcomes: [
          "Clients can book themselves even while the provider is busy with another client.",
          "Reminders are sent without repetitive manual work.",
          "The appointment, service, payment and invoice stay connected in one system.",
        ],
        testimonial:
          "Calendra makes appointment organisation much simpler. Customers can book themselves, while we always have a clear view of the schedule and spend less time coordinating by phone or messages.",
        representativeRole: "Owner, Depilacije UG",
        websiteLabel: "Visit the Depilacije UG website",
        industryCta: "Calendra for beauty and hair salons",
      },
    },
  },
];

export const getCustomerStory = (slug: string) => customerStories.find((story) => story.slug === slug);

export const getCustomerStoryPath = (slug: string, language: SiteLanguage) =>
  language === "sl" ? `/zgodbe-strank/${slug}` : `/en/customer-stories/${slug}`;

export const getCustomerStoryFromPathname = (pathname: string) => {
  const normalized = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const match = normalized.match(/^\/(?:zgodbe-strank|en\/customer-stories)\/([^/]+)$/);
  if (!match) return undefined;
  return getCustomerStory(decodeURIComponent(match[1]));
};

export const customerStoryPathnames = customerStories.flatMap((story) => [
  getCustomerStoryPath(story.slug, "sl"),
  getCustomerStoryPath(story.slug, "en"),
]);
