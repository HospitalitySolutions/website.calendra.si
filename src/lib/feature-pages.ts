import { HERO_IMAGE } from "@/lib/hero-media";
import type { CanonicalRouteKey } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";

export type FeatureRouteKey = Extract<
  CanonicalRouteKey,
  "calendar" | "invoicing" | "clientManagement" | "reminders" | "integrations"
>;

export const FEATURE_ROUTE_KEYS: FeatureRouteKey[] = [
  "calendar",
  "invoicing",
  "clientManagement",
  "reminders",
  "integrations",
];

type TitledBody = {
  title: string;
  body: string;
};

/**
 * Comparison against the workflow these pages actually replace. Prospects arrive
 * from a paper diary or a spreadsheet, not from a competitor, so this is the
 * comparison that answers their real question.
 */
type ComparisonRow = {
  aspect: string;
  manual: string;
  calendra: string;
};

export type FeaturePageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  heroPoints: string[];
  useCasesTitle: string;
  useCasesIntro: string;
  useCases: TitledBody[];
  benefitsTitle: string;
  benefits: TitledBody[];
  comparisonTitle: string;
  comparisonIntro: string;
  comparisonManualLabel: string;
  comparisonCalendraLabel: string;
  comparisonRows: ComparisonRow[];
  processTitle: string;
  process: string[];
  /**
   * Only set where a real screenshot of that exact screen exists. Reusing the
   * calendar shot under alt text describing a different screen would be a lie to
   * both screen-reader users and to image search, so those pages ship without a
   * figure until the screenshot is taken.
   */
  screenshot?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
  detailsTitle: string;
  details: TitledBody[];
  faqTitle: string;
  finalTitle: string;
  finalBody: string;
  /** Also consumed by `src/lib/faq.ts` so the schema and the UI share one source. */
  faq: Array<{ question: string; answer: string }>;
};

const calendarScreenshot = {
  src: HERO_IMAGE.src,
  width: HERO_IMAGE.width,
  height: HERO_IMAGE.height,
};

const content: Record<FeatureRouteKey, Record<SiteLanguage, FeaturePageContent>> = {
  calendar: {
    sl: {
      eyebrow: "Koledar terminov",
      title: "Koledar terminov za storitvena podjetja",
      intro:
        "Calendra združi termine vseh zaposlenih, storitev in prostorov v enem koledarju, ki pri vsaki rezervaciji sam preveri delovni čas, odsotnosti in obstoječe termine.",
      heroPoints: [
        "Dnevni, tedenski, delovni teden in mesečni pogled",
        "Razpoložljivost po zaposlenih, prostorih in opremi",
        "Ponavljajoči se termini in skupinske rezervacije",
      ],
      useCasesTitle: "Kako koledar uporabljajo storitvena podjetja",
      useCasesIntro:
        "Vsaka dejavnost ima drugačen ritem. Spodaj so štirje najpogostejši vzorci uporabe med slovenskimi uporabniki Calendre.",
      useCases: [
        {
          title: "Salon s štirimi frizerkami in dvema kabinama",
          body:
            "Vodja salona vidi vse štiri urnike vzporedno v tedenskem pogledu. Ko stranka rezervira barvanje, ki traja 120 minut, Calendra rezervira frizerko in kabino za celoten čas ter samodejno umakne ta interval iz spletne ponudbe prostih terminov. Umivalnik ali sušilna kapa se lahko vodita kot ločen vir, kadar sta ozko grlo.",
        },
        {
          title: "Fizioterapevt z terapijami različnih dolžin",
          body:
            "Prvi pregled traja 60 minut, kontrolni obisk 30. Vsaka storitev ima svoje trajanje in po potrebi pripravljalni ali čistilni čas, ki ga Calendra dodaja samodejno, zato med obiski ni prekrivanja in ne izgubljate časa z ročnim zamikanjem.",
        },
        {
          title: "Fitnes s skupinskimi vadbami",
          body:
            "Skupinska vadba ima omejeno kapaciteto. Calendra šteje prijave, zapre termin ob zapolnitvi in vodi čakalno vrsto, sam termin pa se v koledarju prikaže kot en dogodek z seznamom prijavljenih namesto kot deset ločenih rezervacij.",
        },
        {
          title: "Svetovalec s ponavljajočimi se srečanji",
          body:
            "Mesečna srečanja za celo leto nastavite kot serijo. Posamezen termin lahko prestavite, ne da bi vplivali na ostale, ali pa spremenite vse prihodnje termine hkrati, kadar se dogovor spremeni.",
        },
      ],
      benefitsTitle: "Kaj koledar reši",
      benefits: [
        {
          title: "Dvojne rezervacije niso mogoče",
          body:
            "Razpoložljivost se izračuna iz delovnega časa, odsotnosti, praznikov, obstoječih terminov in izbranih virov. Prost termin, ki ga stranka vidi na spletu, je zato res prost.",
        },
        {
          title: "Ena resnica namesto treh evidenc",
          body:
            "Namesto zvezka na recepciji, koledarja v telefonu in preglednice za obračun vodite en zapis, ki je hkrati podlaga za opomnike, račun in zgodovino stranke.",
        },
        {
          title: "Pregled nad izkoriščenostjo",
          body:
            "V koledarju je takoj vidno, kateri dnevi in kateri zaposleni imajo največ prostih mest, kar je uporabna podlaga za odločitve o urniku, akcijah in zaposlovanju.",
        },
      ],
      comparisonTitle: "Papirnati koledar in Excel v primerjavi s Calendro",
      comparisonIntro:
        "Večina podjetij pred Calendro uporablja zvezek, Google Koledar ali Excel. Vsak od teh načinov deluje, dokler ne pride do prve odpovedi v zadnjem trenutku.",
      comparisonManualLabel: "Zvezek, Google Koledar ali Excel",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "Rezervacija zvečer ali med praznikom",
          manual: "Stranka pusti sporočilo, termin potrdite naslednji delovni dan.",
          calendra: "Stranka rezervira sama v katerem koli trenutku, potrditev je takojšnja.",
        },
        {
          aspect: "Preverjanje razpoložljivosti",
          manual: "Ročno primerjate urnike zaposlenih in zasedenost prostorov.",
          calendra: "Sistem preveri zaposlenega, prostor in opremo pred potrditvijo.",
        },
        {
          aspect: "Odpoved ali prestavitev",
          manual: "Telefonsko usklajevanje, prosti termin pogosto ostane neizkoriščen.",
          calendra: "Stranka uporabi povezavo v sporočilu, termin se sprosti samodejno.",
        },
        {
          aspect: "Opomniki pred terminom",
          manual: "Pošiljate jih ročno ali pa jih ne pošiljate.",
          calendra: "SMS ali e-pošta gre samodejno ob nastavljenem času.",
        },
        {
          aspect: "Zgodovina stranke",
          manual: "Razpršena med zvezek, sporočila in spomin zaposlenega.",
          calendra: "Vsi pretekli termini, opombe in računi so na profilu stranke.",
        },
        {
          aspect: "Priprava računa",
          manual: "Podatke prepišete v ločen program ali obrazec.",
          calendra: "Storitev, cena in stranka se prenesejo iz termina.",
        },
      ],
      processTitle: "Od rezervacije do izvedbe",
      process: [
        "Stranka ali zaposleni ustvari termin prek spleta, aplikacije ali koledarja.",
        "Calendra preveri delovni čas, odsotnosti, obstoječe termine in izbrane vire.",
        "Termin se prikaže celotni ekipi in sproži potrditev ter opomnik.",
        "Po izvedbi termin ostane v zgodovini stranke kot podlaga za račun in poročila.",
      ],
      screenshot: {
        ...calendarScreenshot,
        alt: "Tedenski pogled koledarja terminov v Calendri s termini več zaposlenih, označenimi storitvami in prostimi mesti",
        caption: "Tedenski pogled koledarja z vzporednimi urniki zaposlenih.",
      },
      detailsTitle: "Pogosta vprašanja o delovanju koledarja",
      details: [
        {
          title: "Kako Calendra izračuna proste termine?",
          body:
            "Izhodišče je delovni čas zaposlenega, od katerega se odštejejo odsotnosti, obstoječi termini, pripravljalni in čistilni čas izbrane storitve ter zasedenost potrebnih prostorov ali opreme. Šele preostali intervali se ponudijo stranki, zato med prikazanim in dejansko razpoložljivim terminom ni razlike.",
        },
        {
          title: "Ali lahko vsak zaposleni ureja samo svoj koledar?",
          body:
            "Da. Vloge in dovoljenja določajo, ali zaposleni vidi in ureja samo svoje termine ali celoten koledar ekipe. Recepcija običajno dobi pregled nad vsemi urniki, izvajalec storitve pa samo nad svojim.",
        },
        {
          title: "Kako koledar obravnava prostore in opremo?",
          body:
            "Prostor, kabino, stol ali napravo lahko vodite kot vir, ki ga posamezna storitev zahteva. Termin se potrdi le, kadar sta hkrati prosta zaposleni in zahtevani vir, kar prepreči dva posega v isti kabini.",
        },
        {
          title: "Ali se koledar sinhronizira z Google Koledarjem?",
          body:
            "Da. Integracija z Google Koledarjem prikaže Calendra termine v osebnem ali službenem koledarju zaposlenega, obveznosti iz Google Koledarja pa se lahko upoštevajo pri izračunu razpoložljivosti.",
        },
      ],
      faqTitle: "Pogosta vprašanja o koledarju terminov",
      finalTitle: "Poskusite koledar na svojih terminih",
      finalBody:
        "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice. Nastavitev storitev, zaposlenih in delovnega časa običajno vzame manj kot 15 minut.",
      faq: [
        {
          question: "Ali Calendra prepreči dvojne rezervacije?",
          answer:
            "Da. Pri vsaki rezervaciji se preverijo delovni čas, odsotnosti, obstoječi termini ter razpoložljivost zaposlenega in zahtevanih prostorov, zato dva termina ne moreta zasesti istega vira.",
        },
        {
          question: "Kateri pogledi koledarja so na voljo?",
          answer:
            "Na voljo so dnevni, tedenski, pogled delovnega tedna in mesečni pogled. V dnevnem in tedenskem pogledu so urniki več zaposlenih prikazani vzporedno.",
        },
        {
          question: "Ali lahko vodim termine za več lokacij?",
          answer:
            "Da. Več poslovalnic lahko upravljate iz enega računa, pri čemer ima vsaka lokacija svoj delovni čas, zaposlene in prostore. Podpora za več lokacij je vključena v paket Premium.",
        },
        {
          question: "Kako uredim ponavljajoče se termine?",
          answer:
            "Termin nastavite kot serijo z izbranim intervalom. Pri urejanju izberete, ali sprememba velja samo za izbrani termin ali za vse prihodnje termine v seriji.",
        },
        {
          question: "Ali se termini samodejno izbrišejo po odpovedi?",
          answer:
            "Odpovedan termin sprosti mesto v koledarju, hkrati pa ostane zapisan v zgodovini stranke s statusom odpovedi, tako da so pogosti neprihodi vidni ob naslednjem naročilu.",
        },
      ],
    },
    en: {
      eyebrow: "Appointment calendar",
      title: "Appointment calendar for service businesses",
      intro:
        "Calendra brings appointments for every employee, service and room into one calendar that automatically checks working hours, absences and existing bookings before confirming anything.",
      heroPoints: [
        "Daily, weekly, work-week and monthly views",
        "Availability across employees, rooms and equipment",
        "Recurring appointments and group bookings",
      ],
      useCasesTitle: "How service businesses use the calendar",
      useCasesIntro:
        "Every trade has a different rhythm. These are the four most common patterns among Calendra customers.",
      useCases: [
        {
          title: "A salon with four stylists and two treatment rooms",
          body:
            "The manager sees all four schedules side by side in the weekly view. When a customer books a 120-minute colour service, Calendra reserves both the stylist and the room for the full duration and removes that interval from the online availability. A wash station or dryer can be tracked as a separate resource when it is the bottleneck.",
        },
        {
          title: "A physiotherapist with different treatment lengths",
          body:
            "A first assessment takes 60 minutes, a follow-up 30. Each service carries its own duration plus optional preparation or cleanup time that Calendra adds automatically, so consecutive appointments never overlap and nobody has to shift bookings by hand.",
        },
        {
          title: "A gym running group classes",
          body:
            "A group class has limited capacity. Calendra counts sign-ups, closes the class when it fills and maintains a waiting list. The class appears in the calendar as a single event with its attendee list rather than ten separate bookings.",
        },
        {
          title: "A consultant with recurring sessions",
          body:
            "Monthly sessions for a whole year are created as one series. A single session can be moved without touching the rest, or every future session can be updated at once when the arrangement changes.",
        },
      ],
      benefitsTitle: "What the calendar solves",
      benefits: [
        {
          title: "Double bookings become impossible",
          body:
            "Availability is calculated from working hours, absences, holidays, existing appointments and the selected resources. A slot a customer sees online is therefore genuinely free.",
        },
        {
          title: "One record instead of three",
          body:
            "Instead of a diary at reception, a calendar on a phone and a spreadsheet for billing, you keep one record that also drives reminders, invoices and client history.",
        },
        {
          title: "Visible utilisation",
          body:
            "The calendar immediately shows which days and which employees carry the most empty slots, which is a practical basis for schedule, promotion and hiring decisions.",
        },
      ],
      comparisonTitle: "Paper diary and Excel compared with Calendra",
      comparisonIntro:
        "Most businesses use a notebook, Google Calendar or Excel before Calendra. Each works fine until the first last-minute cancellation.",
      comparisonManualLabel: "Notebook, Google Calendar or Excel",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "A booking request in the evening or on a holiday",
          manual: "The customer leaves a message and you confirm on the next working day.",
          calendra: "The customer books at any hour and the confirmation is immediate.",
        },
        {
          aspect: "Checking availability",
          manual: "You compare employee schedules and room usage manually.",
          calendra: "The system checks the employee, room and equipment before confirming.",
        },
        {
          aspect: "Cancellation or reschedule",
          manual: "Phone coordination, and the freed slot often stays empty.",
          calendra: "The customer uses the link in their message and the slot is released automatically.",
        },
        {
          aspect: "Reminders before an appointment",
          manual: "Sent by hand, or not sent at all.",
          calendra: "SMS or email goes out automatically at the configured time.",
        },
        {
          aspect: "Client history",
          manual: "Spread across a diary, chat messages and staff memory.",
          calendra: "Every past appointment, note and invoice sits on the client profile.",
        },
        {
          aspect: "Preparing an invoice",
          manual: "Details are retyped into a separate program or form.",
          calendra: "Service, price and client carry over from the appointment.",
        },
      ],
      processTitle: "From booking to delivery",
      process: [
        "A customer or employee creates an appointment on the web, in the app or in the calendar.",
        "Calendra checks working hours, absences, existing appointments and the required resources.",
        "The appointment appears for the whole team and triggers the confirmation and reminder.",
        "After delivery it stays in the client's history as the basis for the invoice and reporting.",
      ],
      screenshot: {
        ...calendarScreenshot,
        alt: "Weekly appointment calendar view in Calendra showing several employees' appointments with labelled services and free slots",
        caption: "The weekly view with employee schedules side by side.",
      },
      detailsTitle: "How the calendar works in detail",
      details: [
        {
          title: "How does Calendra calculate free slots?",
          body:
            "It starts from the employee's working hours, then subtracts absences, existing appointments, the selected service's preparation and cleanup time and any required room or equipment. Only the remaining intervals are offered, so what a customer sees matches what is actually available.",
        },
        {
          title: "Can each employee edit only their own calendar?",
          body:
            "Yes. Roles and permissions decide whether an employee sees and edits only their own appointments or the whole team calendar. Reception typically gets the full overview while a provider sees only their own schedule.",
        },
        {
          title: "How does the calendar handle rooms and equipment?",
          body:
            "A room, treatment booth, chair or device can be tracked as a resource that a service requires. An appointment is only confirmed when the employee and the required resource are both free, which prevents two treatments in the same room.",
        },
        {
          title: "Does the calendar sync with Google Calendar?",
          body:
            "Yes. The Google Calendar integration shows Calendra appointments in an employee's personal or work calendar, and commitments from Google Calendar can be taken into account when calculating availability.",
        },
      ],
      faqTitle: "Appointment calendar questions",
      finalTitle: "Try the calendar on your own appointments",
      finalBody:
        "The free trial lasts 14 days and requires no credit card. Setting up services, employees and working hours usually takes under 15 minutes.",
      faq: [
        {
          question: "Does Calendra prevent double bookings?",
          answer:
            "Yes. Every booking checks working hours, absences, existing appointments and the availability of the employee and required rooms, so two appointments cannot occupy the same resource.",
        },
        {
          question: "Which calendar views are available?",
          answer:
            "Daily, weekly, work-week and monthly views are available. The daily and weekly views show several employees' schedules side by side.",
        },
        {
          question: "Can I manage appointments for multiple locations?",
          answer:
            "Yes. Several branches can be managed from one account, each with its own working hours, employees and rooms. Multi-location support is included in the Premium plan.",
        },
        {
          question: "How do I set up recurring appointments?",
          answer:
            "Create the appointment as a series with the interval you need. When editing, you choose whether the change applies to that occurrence only or to all future appointments in the series.",
        },
        {
          question: "Are appointments deleted after a cancellation?",
          answer:
            "A cancelled appointment frees the slot in the calendar but stays in the client's history with a cancelled status, so repeated no-shows are visible at the next booking.",
        },
      ],
    },
  },
  invoicing: {
    sl: {
      eyebrow: "Računi in plačila",
      title: "Program za račune, termine in plačila",
      intro:
        "Calendra iz izvedenega termina pripravi račun, saj storitev, ceno in podatke stranke prevzame iz rezervacije. Podpira gotovino, kartice, nakazila in spletna plačila.",
      heroPoints: [
        "Račun iz termina brez ponovnega vnašanja podatkov",
        "Predplačila in akontacije ob rezervaciji",
        "Davčno potrjevanje računov z dodatkom Davčna blagajna",
      ],
      useCasesTitle: "Kako podjetja obračunavajo storitve",
      useCasesIntro:
        "Način obračuna se razlikuje glede na to, kdaj stranka plača in ali je plačilo pogoj za rezervacijo.",
      useCases: [
        {
          title: "Plačilo na lokaciji po opravljeni storitvi",
          body:
            "Najpogostejši primer v salonih in pri zdravstvenih storitvah. Po zaključku termina zaposleni odpre termin, potrdi izvedene storitve in izda račun. Znesek in stranka sta že vpisana, zato izdaja računa vzame nekaj klikov namesto ponovnega vnosa.",
        },
        {
          title: "Predplačilo ob rezervaciji",
          body:
            "Kadar odpovedi v zadnjem trenutku pomenijo izgubljen prihodek, lahko zahtevate akontacijo ali celotno plačilo že ob rezervaciji. Termin se potrdi šele po uspešnem plačilu, kar bistveno zmanjša število neprihodov.",
        },
        {
          title: "Paketi in obiski v naprej",
          body:
            "Stranka kupi paket več obiskov, ki se nato porablja skozi čas. Vsak obisk se odšteje od paketa, na profilu stranke pa je vidno, koliko obiskov je še na voljo, brez ločene evidence v preglednici.",
        },
        {
          title: "Podjetje kot plačnik",
          body:
            "Pri poslovnih strankah je plačnik podjetje, ne oseba, ki se je udeležila termina. Račun izdate na podatke podjetja, termin pa ostane povezan s konkretno osebo, ki je storitev prejela.",
        },
      ],
      benefitsTitle: "Kaj poenoten obračun prinese",
      benefits: [
        {
          title: "Nič dvojnega vnašanja",
          body:
            "Podatki, ki so bili vneseni ob rezervaciji, se uporabijo tudi na računu. Manj prepisovanja pomeni manj napak v znesku, imenu ali davčni številki.",
        },
        {
          title: "Realen finančni pregled",
          body:
            "Ker so termini in računi povezani, je razvidno, katere storitve prinašajo največ prihodka in koliko je odprtih obveznosti, ne le koliko je bilo terminov.",
        },
        {
          title: "Skladnost s slovenskimi predpisi",
          body:
            "Z dodatkom Davčna blagajna (9,90 EUR mesečno) Calendra podpira davčno potrjevanje računov, kot ga zahteva slovenska zakonodaja za plačila v gotovini.",
        },
      ],
      comparisonTitle: "Ločen program za račune v primerjavi s Calendro",
      comparisonIntro:
        "Kombinacija koledarja in ločenega programa za račune deluje, vendar zahteva, da vsak podatek vnesete dvakrat.",
      comparisonManualLabel: "Koledar in ločen program za račune",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "Vnos podatkov stranke",
          manual: "Enkrat v koledar, drugič v program za račune.",
          calendra: "Enkrat ob prvi rezervaciji, nato se uporabljajo naprej.",
        },
        {
          aspect: "Povezava računa s terminom",
          manual: "Ročno iskanje, kateri račun sodi h kateremu obisku.",
          calendra: "Račun je pripet k terminu in profilu stranke.",
        },
        {
          aspect: "Predplačilo ob rezervaciji",
          manual: "Ni mogoče brez dodatnega plačilnega orodja.",
          calendra: "Akontacija ali celotno plačilo je pogoj za potrditev termina.",
        },
        {
          aspect: "Pregled prihodkov po storitvah",
          manual: "Zahteva ročno združevanje dveh virov podatkov.",
          calendra: "Poročilo nastane iz istih zapisov, ki so nastali ob terminih.",
        },
        {
          aspect: "Davčno potrjevanje",
          manual: "Ločena davčna blagajna ali zunanja storitev.",
          calendra: "Dodatek Davčna blagajna deluje znotraj istega sistema.",
        },
        {
          aspect: "Priprava za računovodstvo",
          manual: "Izvoz iz dveh sistemov in ročno usklajevanje.",
          calendra: "Enoten izvoz računov in plačil za obračunsko obdobje.",
        },
      ],
      processTitle: "Od termina do plačanega računa",
      process: [
        "Termin že vsebuje izbrane storitve, cene in podatke stranke.",
        "Po izvedbi potrdite dejansko opravljene storitve in morebitne popravke.",
        "Calendra pripravi račun, ki ga po potrebi davčno potrdite.",
        "Plačilo se evidentira, račun in termin pa ostaneta povezana na profilu stranke.",
      ],
      detailsTitle: "Kako obračun deluje v praksi",
      details: [
        {
          title: "Ali Calendra podpira davčno potrjevanje računov?",
          body:
            "Da, prek dodatka Davčna blagajna, ki je na voljo pri vseh paketih za 9,90 EUR mesečno. Dodatek pokriva davčno potrjevanje računov, kot ga za gotovinsko poslovanje zahteva slovenska zakonodaja. Če izdajate izključno račune za nakazila, dodatka ne potrebujete.",
        },
        {
          title: "Kateri načini plačila so podprti?",
          body:
            "Plačilo na lokaciji v gotovini ali s kartico, bančno nakazilo in spletno plačilo prek povezanega ponudnika. Za posamezno storitev lahko določite, ali je spletno plačilo neobvezno, priporočeno ali pogoj za rezervacijo.",
        },
        {
          title: "Kako delujejo akontacije in predplačila?",
          body:
            "Pri storitvi določite delež ali fiksni znesek, ki ga mora stranka plačati ob rezervaciji. Termin se potrdi po uspešnem plačilu, znesek pa se ob obračunu odšteje od končnega računa. Spletna plačila so na voljo od paketa Profesionalno naprej.",
        },
        {
          title: "Ali lahko podatke prenesem v računovodstvo?",
          body:
            "Da. Račune in plačila za izbrano obdobje lahko izvozite in posredujete računovodskemu servisu, brez ročnega prepisovanja iz koledarja v preglednico.",
        },
      ],
      faqTitle: "Pogosta vprašanja o računih in plačilih",
      finalTitle: "Povežite termine in obračun",
      finalBody:
        "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice. Dodatek Davčna blagajna lahko vklopite kadar koli pozneje.",
      faq: [
        {
          question: "Ali Calendra omogoča davčno potrjevanje računov?",
          answer:
            "Da, z dodatkom Davčna blagajna za 9,90 EUR mesečno, ki je na voljo pri vseh treh paketih in pokriva davčno potrjevanje računov po slovenski zakonodaji.",
        },
        {
          question: "Ali lahko zahtevam plačilo pred rezervacijo?",
          answer:
            "Da. Pri posamezni storitvi lahko določite akontacijo ali celotno plačilo kot pogoj za potrditev termina. Spletna plačila so vključena od paketa Profesionalno naprej.",
        },
        {
          question: "Ali se račun samodejno poveže s terminom?",
          answer:
            "Da. Račun nastane iz termina, zato ostaneta povezana na profilu stranke skupaj z opravljenimi storitvami in evidentiranim plačilom.",
        },
        {
          question: "Katere valute in davčne stopnje so podprte?",
          answer:
            "Calendra je namenjena slovenskemu trgu in deluje v evrih. Davčne stopnje nastavite na ravni storitve, kar omogoča različne stopnje za različne vrste storitev.",
        },
        {
          question: "Kaj se zgodi, če stranka odpove plačan termin?",
          answer:
            "Termin se sprosti, plačilo pa ostane evidentirano, zato se lahko odločite za vračilo, prenos na nov termin ali zadržanje v skladu s svojimi pogoji odpovedi.",
        },
      ],
    },
    en: {
      eyebrow: "Invoicing and payments",
      title: "Invoicing, appointments and payments in one place",
      intro:
        "Calendra turns a completed appointment into an invoice, carrying the service, price and client details over from the booking. It supports cash, card, bank transfer and online payments.",
      heroPoints: [
        "Invoice from an appointment with no re-entry",
        "Deposits and prepayments at booking time",
        "Fiscal verification through the Fiscal cash register add-on",
      ],
      useCasesTitle: "How businesses bill for services",
      useCasesIntro:
        "Billing differs mainly by when the customer pays and whether payment is a condition for the booking.",
      useCases: [
        {
          title: "Payment on site after the service",
          body:
            "The most common case in salons and health services. When the appointment ends, the employee opens it, confirms the services delivered and issues the invoice. The amount and the client are already filled in, so invoicing takes a few clicks instead of a fresh data entry.",
        },
        {
          title: "Prepayment at booking",
          body:
            "Where last-minute cancellations mean lost revenue, you can require a deposit or full payment at booking. The appointment is only confirmed after successful payment, which substantially reduces no-shows.",
        },
        {
          title: "Packages and prepaid visits",
          body:
            "A customer buys a package of visits and uses it over time. Each visit is deducted from the package and the remaining balance is visible on the client profile, with no separate spreadsheet to maintain.",
        },
        {
          title: "A company as the payer",
          body:
            "With business clients the payer is the company rather than the person who attended. The invoice is issued to the company's details while the appointment stays linked to the individual who received the service.",
        },
      ],
      benefitsTitle: "What unified billing gives you",
      benefits: [
        {
          title: "No duplicate data entry",
          body:
            "Details captured at booking are reused on the invoice. Less retyping means fewer mistakes in amounts, names and tax numbers.",
        },
        {
          title: "A revenue picture you can act on",
          body:
            "Because appointments and invoices are linked, you can see which services generate the most revenue and how much is outstanding, not just how many appointments happened.",
        },
        {
          title: "Compliance with Slovenian rules",
          body:
            "With the Fiscal cash register add-on (9.90 EUR per month) Calendra supports the fiscal verification of invoices that Slovenian law requires for cash payments.",
        },
      ],
      comparisonTitle: "A separate invoicing program compared with Calendra",
      comparisonIntro:
        "A calendar plus a separate invoicing program works, but it requires entering every detail twice.",
      comparisonManualLabel: "Calendar plus separate invoicing program",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "Entering client details",
          manual: "Once in the calendar, again in the invoicing program.",
          calendra: "Once at the first booking, reused from then on.",
        },
        {
          aspect: "Linking an invoice to an appointment",
          manual: "Manual lookup of which invoice belongs to which visit.",
          calendra: "The invoice is attached to the appointment and client profile.",
        },
        {
          aspect: "Prepayment at booking",
          manual: "Not possible without an extra payment tool.",
          calendra: "A deposit or full payment can be a condition for confirmation.",
        },
        {
          aspect: "Revenue by service",
          manual: "Requires merging two data sources by hand.",
          calendra: "Reporting comes from the same records the appointments created.",
        },
        {
          aspect: "Fiscal verification",
          manual: "A separate fiscal register or external service.",
          calendra: "The Fiscal cash register add-on works inside the same system.",
        },
        {
          aspect: "Preparing data for accounting",
          manual: "Export from two systems and reconcile manually.",
          calendra: "One export of invoices and payments for the period.",
        },
      ],
      processTitle: "From appointment to paid invoice",
      process: [
        "The appointment already carries the selected services, prices and client details.",
        "After delivery you confirm what was actually done and adjust if needed.",
        "Calendra prepares the invoice, with fiscal verification where required.",
        "The payment is recorded and invoice and appointment stay linked on the client profile.",
      ],
      detailsTitle: "How billing works in practice",
      details: [
        {
          title: "Does Calendra support fiscal verification of invoices?",
          body:
            "Yes, through the Fiscal cash register add-on, available on every plan for 9.90 EUR per month. It covers the fiscal verification of invoices that Slovenian law requires for cash transactions. If you only invoice for bank transfers, you do not need the add-on.",
        },
        {
          title: "Which payment methods are supported?",
          body:
            "Cash or card on site, bank transfer and online payment through a connected provider. For each service you can decide whether online payment is optional, recommended or required to book.",
        },
        {
          title: "How do deposits and prepayments work?",
          body:
            "On a service you set a percentage or fixed amount the customer pays at booking. The appointment is confirmed after successful payment and the amount is deducted from the final invoice. Online payments are available from the Professional plan onwards.",
        },
        {
          title: "Can I hand data over to my accountant?",
          body:
            "Yes. Invoices and payments for a chosen period can be exported and passed to your accounting service, without copying figures from a calendar into a spreadsheet.",
        },
      ],
      faqTitle: "Invoicing and payment questions",
      finalTitle: "Connect appointments and billing",
      finalBody:
        "The free trial lasts 14 days and requires no credit card. The Fiscal cash register add-on can be switched on at any time later.",
      faq: [
        {
          question: "Does Calendra support fiscal verification of invoices?",
          answer:
            "Yes, through the Fiscal cash register add-on at 9.90 EUR per month, available on all three plans and covering fiscal verification under Slovenian law.",
        },
        {
          question: "Can I require payment before a booking?",
          answer:
            "Yes. On each service you can set a deposit or full payment as a condition for confirming the appointment. Online payments are included from the Professional plan onwards.",
        },
        {
          question: "Is an invoice linked to its appointment automatically?",
          answer:
            "Yes. The invoice is created from the appointment, so both stay linked on the client profile together with the services delivered and the recorded payment.",
        },
        {
          question: "Which currencies and tax rates are supported?",
          answer:
            "Calendra targets the Slovenian market and works in euros. Tax rates are configured per service, which allows different rates for different service types.",
        },
        {
          question: "What happens if a customer cancels a paid appointment?",
          answer:
            "The slot is released and the payment stays recorded, so you can refund it, move it to a new appointment or retain it according to your own cancellation terms.",
        },
      ],
    },
  },
  clientManagement: {
    sl: {
      eyebrow: "Upravljanje strank",
      title: "Upravljanje strank in evidenca terminov",
      intro:
        "Profil stranke v Calendri združi kontaktne podatke, celotno zgodovino terminov, opombe, dokumente, izdane račune in polja po meri, dostopna glede na vloge zaposlenih.",
      heroPoints: [
        "Celotna zgodovina terminov in izdanih računov",
        "Opombe, dokumenti in polja po meri",
        "Dostop, omejen z vlogami in dovoljenji",
      ],
      useCasesTitle: "Kje evidenca strank največ prinese",
      useCasesIntro:
        "Vrednost urejene evidence je največja pri storitvah, kjer je pomembno, kaj se je zgodilo ob prejšnjem obisku.",
      useCases: [
        {
          title: "Barvanje las in kozmetični posegi",
          body:
            "Formula barve, čas delovanja, uporabljeni izdelki in reakcija stranke se zapišejo v opombe. Ob naslednjem obisku ni ugibanja, tudi če storitev izvaja druga frizerka, kar je pogosto razlika med zadovoljno in izgubljeno stranko.",
        },
        {
          title: "Fizioterapija in zdravstvene storitve",
          body:
            "Zgodovina terapij, napotnice in izvidi ostanejo pri profilu stranke. Ker je dostop omejen z vlogami, občutljive opombe vidi samo osebje, ki jih potrebuje za izvedbo storitve.",
        },
        {
          title: "Ponavljajoče se stranke pri svetovanju",
          body:
            "Pred vsakim srečanjem lahko pregledate zapiske s prejšnjega, dogovorjene naloge in poslane dokumente, brez iskanja po e-pošti in ločenih mapah.",
        },
        {
          title: "Prepoznavanje pogostih neprihodov",
          body:
            "Ker se odpovedi in neprihodi zapisujejo v zgodovino, je pred potrditvijo termina vidno, ali gre za stranko, pri kateri je smiselno zahtevati predplačilo.",
        },
      ],
      benefitsTitle: "Kaj urejena evidenca strank omogoča",
      benefits: [
        {
          title: "Kontekst ob pravem trenutku",
          body:
            "Vse, kar je pomembno za izvedbo storitve, je vidno ob odprtju termina, ne pa razpršeno med zvezke, sporočila in spomin posameznega zaposlenega.",
        },
        {
          title: "Podatki, ki ostanejo v podjetju",
          body:
            "Ko zaposleni odide, zgodovina strank ostane v sistemu podjetja. Pri evidencah v osebnih telefonih ali zvezkih to pogosto ne velja.",
        },
        {
          title: "Podlaga za skladnost z GDPR",
          body:
            "Podatki so na enem mestu z nadzorovanim dostopom, zato je lažje odgovoriti na zahtevo po dostopu, popravku ali izbrisu osebnih podatkov.",
        },
      ],
      comparisonTitle: "Excel in zvezek v primerjavi s Calendro",
      comparisonIntro:
        "Preglednica strank je pogosto prvi korak od zvezka naprej, vendar ni povezana s koledarjem in ne pozna dovoljenj.",
      comparisonManualLabel: "Excel ali zvezek",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "Povezava s termini",
          manual: "Zgodovino obiskov iščete ročno po datumih.",
          calendra: "Vsi pretekli in prihodnji termini so na profilu stranke.",
        },
        {
          aspect: "Dostop več zaposlenih hkrati",
          manual: "Datoteka je pri enem uporabniku ali obstaja v več različicah.",
          calendra: "Vsi vidijo iste podatke, urejanje je zabeleženo.",
        },
        {
          aspect: "Občutljive opombe",
          manual: "Vidi jih vsak, ki ima dostop do datoteke.",
          calendra: "Vloge in dovoljenja omejijo dostop na potrebno osebje.",
        },
        {
          aspect: "Iskanje stranke",
          manual: "Odvisno od doslednosti vnosa in pravopisa.",
          calendra: "Iskanje po imenu, telefonu, e-pošti ali storitvi.",
        },
        {
          aspect: "Zahteva po izbrisu podatkov",
          manual: "Podatki so lahko v več datotekah in kopijah.",
          calendra: "Ena evidenca, ki jo je mogoče urediti ali anonimizirati.",
        },
        {
          aspect: "Odhod zaposlenega",
          manual: "Del znanja o strankah odide z njim.",
          calendra: "Zapisi ostanejo v sistemu podjetja.",
        },
      ],
      processTitle: "Kako nastane in raste profil stranke",
      process: [
        "Stranka se ustvari samodejno ob prvi spletni rezervaciji ali ročno ob klicu.",
        "Vsak naslednji termin se poveže z istim profilom brez ponovnega vnosa.",
        "Zaposleni med izvedbo dodajo opombe, dokumente ali podatke v polja po meri.",
        "Računi, plačila in poslana obvestila se sami zbirajo v zgodovini stranke.",
      ],
      detailsTitle: "Kako deluje evidenca strank",
      details: [
        {
          title: "Kdo lahko vidi podatke o strankah?",
          body:
            "Dostop določajo vloge in dovoljenja. Recepcija običajno vidi kontaktne podatke in termine, izvajalec storitve pa tudi strokovne opombe, ki jih potrebuje. Občutljive kategorije podatkov lahko omejite na ožji krog zaposlenih.",
        },
        {
          title: "Kaj lahko zajamem s polji po meri?",
          body:
            "Polja po meri pokrijejo podatke, ki so specifični za vašo dejavnost: uporabljena formula barve, alergije, velikost opreme, številka napotnice ali vir, prek katerega je stranka prišla. Tako se izognete zbiranju teh podatkov v ločeni preglednici.",
        },
        {
          title: "Ali lahko uvozim obstoječi seznam strank?",
          body:
            "Da. Obstoječi seznam iz preglednice lahko prenesete v Calendro, da se zgodovina in kontaktni podatki ne začnejo z ničle. Pri prenosu je smiselno najprej odstraniti podvojene vnose.",
        },
        {
          title: "Kako je z GDPR in privolitvami?",
          body:
            "Podatki se obdelujejo po navodilih podjetja kot upravljavca, Calendra pa nastopa kot obdelovalec. Ker so zapisi na enem mestu, je zahtevo po dostopu, popravku ali izbrisu mogoče izpolniti brez iskanja po več sistemih.",
        },
      ],
      faqTitle: "Pogosta vprašanja o upravljanju strank",
      finalTitle: "Uredite evidenco strank",
      finalBody:
        "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice. Obstoječi seznam strank lahko prenesete iz preglednice.",
      faq: [
        {
          question: "Ali lahko uvozim obstoječe stranke iz Excela?",
          answer:
            "Da. Seznam strank iz preglednice lahko prenesete v Calendro, da so kontaktni podatki in zgodovina takoj na voljo. Pred prenosom priporočamo odstranitev podvojenih vnosov.",
        },
        {
          question: "Ali lahko omejim, kdo vidi opombe o stranki?",
          answer:
            "Da. Vloge in dovoljenja določajo, kateri zaposleni lahko vidi ali ureja posamezne podatke, zato lahko občutljive opombe omejite na ožji krog osebja.",
        },
        {
          question: "Kaj so polja po meri in kdaj so uporabna?",
          answer:
            "Polja po meri so dodatna polja na profilu stranke za podatke, ki so značilni za vašo dejavnost, na primer formula barve, alergije ali številka napotnice.",
        },
        {
          question: "Ali stranka vidi svoje podatke?",
          answer:
            "Stranka prek aplikacije Calendra Connect vidi svoje termine, obvestila in plačila. Interne strokovne opombe zaposlenih niso vidne stranki.",
        },
        {
          question: "Kako izpolnim zahtevo za izbris osebnih podatkov?",
          answer:
            "Ker so podatki v eni evidenci, jih je mogoče izbrisati ali anonimizirati, razen kadar je hramba potrebna zaradi računovodskih, davčnih ali pravnih obveznosti.",
        },
      ],
    },
    en: {
      eyebrow: "Client management",
      title: "Client management and appointment records",
      intro:
        "A client profile in Calendra brings together contact details, the full appointment history, notes, documents, issued invoices and custom fields, with access controlled by employee role.",
      heroPoints: [
        "Complete appointment and invoice history",
        "Notes, documents and custom fields",
        "Access limited by roles and permissions",
      ],
      useCasesTitle: "Where client records matter most",
      useCasesIntro:
        "Organised records pay off most in services where what happened at the last visit matters.",
      useCases: [
        {
          title: "Hair colouring and beauty treatments",
          body:
            "The colour formula, processing time, products used and how the client reacted go into the notes. At the next visit nothing has to be guessed, even if a different stylist takes over, which is often the difference between a returning and a lost client.",
        },
        {
          title: "Physiotherapy and health services",
          body:
            "Treatment history, referrals and findings stay on the client profile. Because access is role-based, sensitive notes are visible only to the staff who need them to deliver the service.",
        },
        {
          title: "Returning consulting clients",
          body:
            "Before each session you can review notes from the previous one, agreed actions and documents already sent, without digging through email and separate folders.",
        },
        {
          title: "Spotting repeat no-shows",
          body:
            "Because cancellations and no-shows are recorded in the history, you can see before confirming whether this is a client for whom requiring a prepayment makes sense.",
        },
      ],
      benefitsTitle: "What organised client records enable",
      benefits: [
        {
          title: "Context at the right moment",
          body:
            "Everything relevant to delivering the service is visible when the appointment is opened, instead of being spread across notebooks, chat messages and one employee's memory.",
        },
        {
          title: "Data that stays with the business",
          body:
            "When an employee leaves, the client history stays in the company's system. With records kept in personal phones or notebooks that is often not the case.",
        },
        {
          title: "A basis for GDPR compliance",
          body:
            "Data sits in one place with controlled access, which makes it far easier to answer a request for access, correction or erasure of personal data.",
        },
      ],
      comparisonTitle: "Excel and notebooks compared with Calendra",
      comparisonIntro:
        "A client spreadsheet is usually the first step beyond a notebook, but it is not connected to the calendar and has no concept of permissions.",
      comparisonManualLabel: "Excel or a notebook",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "Link to appointments",
          manual: "Visit history has to be looked up by date by hand.",
          calendra: "Every past and upcoming appointment sits on the client profile.",
        },
        {
          aspect: "Several employees at once",
          manual: "The file lives with one person or exists in several versions.",
          calendra: "Everyone sees the same record and edits are tracked.",
        },
        {
          aspect: "Sensitive notes",
          manual: "Visible to anyone who can open the file.",
          calendra: "Roles and permissions restrict access to the staff who need it.",
        },
        {
          aspect: "Finding a client",
          manual: "Depends on consistent entry and spelling.",
          calendra: "Search by name, phone, email or service.",
        },
        {
          aspect: "A request to erase data",
          manual: "Data may exist across several files and copies.",
          calendra: "One record that can be edited or anonymised.",
        },
        {
          aspect: "An employee leaving",
          manual: "Part of the client knowledge leaves with them.",
          calendra: "The records stay in the company's system.",
        },
      ],
      processTitle: "How a client profile is created and grows",
      process: [
        "The client is created automatically at the first online booking, or manually during a call.",
        "Every later appointment attaches to the same profile without re-entry.",
        "Employees add notes, documents or custom field values while delivering the service.",
        "Invoices, payments and sent notifications collect themselves in the client history.",
      ],
      detailsTitle: "How client records work",
      details: [
        {
          title: "Who can see client data?",
          body:
            "Access is set by roles and permissions. Reception typically sees contact details and appointments, while the provider also sees the professional notes they need. Sensitive categories can be restricted to a narrower group of staff.",
        },
        {
          title: "What can custom fields capture?",
          body:
            "Custom fields cover data specific to your trade: the colour formula used, allergies, equipment size, a referral number or the channel the client came from. That keeps this information out of a separate spreadsheet.",
        },
        {
          title: "Can I import an existing client list?",
          body:
            "Yes. An existing spreadsheet list can be imported into Calendra so history and contact details do not start from zero. It is worth removing duplicate entries before importing.",
        },
        {
          title: "How does this relate to GDPR and consent?",
          body:
            "Data is processed on the business's instructions as controller, with Calendra acting as processor. Because records sit in one place, a request for access, correction or erasure can be handled without searching multiple systems.",
        },
      ],
      faqTitle: "Client management questions",
      finalTitle: "Get your client records in order",
      finalBody:
        "The free trial lasts 14 days and requires no credit card. An existing client list can be imported from a spreadsheet.",
      faq: [
        {
          question: "Can I import existing clients from Excel?",
          answer:
            "Yes. A client list from a spreadsheet can be imported into Calendra so contact details and history are available immediately. Removing duplicates before importing is recommended.",
        },
        {
          question: "Can I restrict who sees a client's notes?",
          answer:
            "Yes. Roles and permissions determine which employees can view or edit particular data, so sensitive notes can be limited to a narrower group of staff.",
        },
        {
          question: "What are custom fields and when are they useful?",
          answer:
            "Custom fields are additional profile fields for data specific to your trade, such as a colour formula, allergies or a referral number.",
        },
        {
          question: "Can clients see their own data?",
          answer:
            "Through the Calendra Connect app clients see their appointments, notifications and payments. Internal professional notes written by staff are not visible to them.",
        },
        {
          question: "How do I handle a request to erase personal data?",
          answer:
            "Because the data is in one record, it can be deleted or anonymised, except where retention is required by accounting, tax or legal obligations.",
        },
      ],
    },
  },
  reminders: {
    sl: {
      eyebrow: "SMS in e-poštni opomniki",
      title: "SMS in e-poštni opomniki za termine",
      intro:
        "Calendra samodejno pošlje potrditev ob rezervaciji in opomnik pred terminom po SMS ali e-pošti. Vsako sporočilo vsebuje povezavo za prestavitev ali odpoved.",
      heroPoints: [
        "Potrditev, opomnik, sprememba in odpoved brez ročnega dela",
        "Čas pošiljanja in kanal določite sami",
        "Povezave za samostojno prestavitev ali odpoved termina",
      ],
      useCasesTitle: "Kdaj se opomniki najbolj obrestujejo",
      useCasesIntro:
        "Vrednost opomnika je sorazmerna s ceno praznega termina. Spodaj so primeri, kjer je razlika največja.",
      useCases: [
        {
          title: "Dolge in drage storitve",
          body:
            "Barvanje las ali daljša terapija zaseda dve uri, ki jih po neprihodu ni mogoče nadomestiti. Opomnik dan pred terminom da stranki dovolj časa, da pravočasno sporoči spremembo, vi pa lahko mesto ponudite drugi stranki.",
        },
        {
          title: "Termini, rezervirani več tednov vnaprej",
          body:
            "Pri terminih, dogovorjenih mesec ali več vnaprej, je verjetnost pozabe največja. Kombinacija potrditve ob rezervaciji in opomnika 24 ur pred terminom bistveno zmanjša število neprihodov.",
        },
        {
          title: "Skupinske vadbe z omejeno kapaciteto",
          body:
            "Če prijavljena oseba ne pride in tega ne sporoči, mesto ostane prazno, čeprav so bili na čakalni listi drugi. Opomnik s povezavo za odpoved sprosti mesto dovolj zgodaj, da ga sistem lahko ponudi naprej.",
        },
        {
          title: "Prvi obisk nove stranke",
          body:
            "Nove stranke pogosteje ne pridejo kot redne. Potrditev z naslovom, časom in navodili za prihod zmanjša negotovost in verjetnost, da termin tiho odpade.",
        },
      ],
      benefitsTitle: "Kaj avtomatski opomniki spremenijo",
      benefits: [
        {
          title: "Manj praznih terminov",
          body:
            "Opomnik ne prepreči vseh odpovedi, poskrbi pa, da o njih izveste dovolj zgodaj, da termin lahko zapolnite z drugo stranko.",
        },
        {
          title: "Nič ročnega pošiljanja",
          body:
            "Sporočila se pripravijo iz podatkov o terminu in pošljejo ob nastavljenem času, tudi ob koncu tedna in v najbolj zasedenih dneh, ko bi ročno pošiljanje odpadlo prvo.",
        },
        {
          title: "Manj telefonskega usklajevanja",
          body:
            "Povezava za prestavitev ali odpoved v sporočilu prenese spremembo termina na stranko, zato je klicev in usklajevanja med delom manj.",
        },
      ],
      comparisonTitle: "Ročno obveščanje v primerjavi s Calendro",
      comparisonIntro:
        "Ročno pošiljanje sporočil deluje pri nekaj terminih na dan, vendar prvo izpade takrat, ko je največ dela.",
      comparisonManualLabel: "Ročna sporočila ali klici",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "Doslednost",
          manual: "Odvisna od tega, koliko časa ostane med termini.",
          calendra: "Vsak termin dobi enaka obvestila po istih pravilih.",
        },
        {
          aspect: "Čas pošiljanja",
          manual: "Kadar se zaposleni spomni.",
          calendra: "Točno ob nastavljenem času pred terminom.",
        },
        {
          aspect: "Vsebina sporočila",
          manual: "Vsakič nekoliko drugačna, pogosto brez naslova ali navodil.",
          calendra: "Predloga z podatki o storitvi, zaposlenem, času in lokaciji.",
        },
        {
          aspect: "Odpoved s strani stranke",
          manual: "Klic v delovnem času, sicer sporočilo brez potrditve.",
          calendra: "Povezava v sporočilu, ki takoj sprosti termin.",
        },
        {
          aspect: "Sledljivost",
          manual: "Ni zapisa, ali je bilo sporočilo poslano.",
          calendra: "Poslana obvestila so zapisana v zgodovini termina.",
        },
        {
          aspect: "Strošek",
          manual: "Čas zaposlenega, ki bi ga lahko namenil strankam.",
          calendra: "E-pošta je vključena, SMS se obračuna po prikazani ceni.",
        },
      ],
      processTitle: "Kako nastane in se pošlje obvestilo",
      process: [
        "Izberete aktivne predloge, kanale in čas pošiljanja pred terminom.",
        "Calendra zazna novo rezervacijo, prestavitev ali odpoved.",
        "Sporočilo se sestavi iz podatkov o terminu, storitvi, zaposlenem in lokaciji.",
        "Stranka prejme sporočilo s povezavo za spremembo ali odpoved, poslano obvestilo pa ostane v zgodovini.",
      ],
      detailsTitle: "Kako opomniki delujejo",
      details: [
        {
          title: "Kdaj se opomnik pošlje?",
          body:
            "Čas pošiljanja določite sami, najpogostejša izbira pa je 24 ur pred terminom, saj ostane dovolj časa za prestavitev, hkrati pa je termin še dovolj blizu, da si ga stranka zapomni. Za daljše ali dražje storitve je pogosta kombinacija opomnika en teden in en dan pred terminom.",
        },
        {
          title: "SMS ali e-pošta: kaj izbrati?",
          body:
            "E-pošta je vključena in primerna za potrditve z več podrobnostmi, priponkami ali navodili. SMS ima bistveno višjo stopnjo branja in je zato boljša izbira za opomnik neposredno pred terminom. Veliko podjetij uporablja oboje: e-pošto za potrditev in SMS za opomnik.",
        },
        {
          title: "Koliko stanejo SMS sporočila?",
          body:
            "SMS in e-poštni opomniki so vključeni od paketa Profesionalno naprej, poraba SMS pa se obračuna po ceni na sporočilo, prikazani v konfiguratorju cenika. Ker je cena na sporočilo vidna, je mesečni strošek mogoče oceniti glede na število terminov.",
        },
        {
          title: "Ali lahko prilagodim besedilo sporočil?",
          body:
            "Da. Predloge lahko uredite in vanje vstavite podatke o stranki, storitvi, zaposlenem, lokaciji in času termina. Tako sporočila zvenijo v vašem tonu in vsebujejo točno tiste informacije, ki jih vaše stranke potrebujejo.",
        },
      ],
      faqTitle: "Pogosta vprašanja o opomnikih",
      finalTitle: "Zmanjšajte število pozabljenih terminov",
      finalBody:
        "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice. Opomnike lahko vklopite in preizkusite na svojih terminih.",
      faq: [
        {
          question: "Kdaj Calendra pošlje opomnik?",
          answer:
            "Čas pošiljanja določite sami. Najpogostejša nastavitev je 24 ur pred terminom, pri daljših storitvah pa kombinacija opomnika en teden in en dan pred terminom.",
        },
        {
          question: "Ali so SMS opomniki vključeni v ceno paketa?",
          answer:
            "SMS in e-poštni opomniki so vključeni od paketa Profesionalno naprej. Poraba SMS se obračuna po ceni na sporočilo, ki je prikazana v konfiguratorju cenika.",
        },
        {
          question: "Ali lahko stranka prek opomnika odpove termin?",
          answer:
            "Da. Vsako sporočilo lahko vsebuje varno povezavo za prestavitev ali odpoved. Termin se sprosti takoj, pravila glede roka za odpoved pa določite sami.",
        },
        {
          question: "Ali lahko spremenim besedilo opomnika?",
          answer:
            "Da. Predloge sporočil lahko uredite in vključite podatke o stranki, storitvi, zaposlenem, lokaciji in času termina.",
        },
        {
          question: "Kaj se zgodi, če stranka ne navede telefonske številke?",
          answer:
            "Če telefonska številka ni na voljo, se obvestilo pošlje po e-pošti. Katera polja so ob rezervaciji obvezna, določite v nastavitvah naročanja.",
        },
      ],
    },
    en: {
      eyebrow: "SMS and email reminders",
      title: "SMS and email appointment reminders",
      intro:
        "Calendra automatically sends a confirmation when a booking is made and a reminder before the appointment, by SMS or email. Every message includes a link to reschedule or cancel.",
      heroPoints: [
        "Confirmations, reminders, changes and cancellations without manual work",
        "You choose the channel and how far ahead they are sent",
        "Self-service reschedule and cancellation links",
      ],
      useCasesTitle: "When reminders pay off most",
      useCasesIntro:
        "A reminder is worth roughly what an empty slot costs. These are the cases where the difference is largest.",
      useCases: [
        {
          title: "Long, high-value services",
          body:
            "A colour service or an extended treatment occupies two hours that cannot be recovered after a no-show. A reminder the day before gives the client enough time to tell you about a change, and gives you enough time to offer the slot to someone else.",
        },
        {
          title: "Appointments booked weeks ahead",
          body:
            "Appointments agreed a month or more in advance are the most likely to be forgotten. A confirmation at booking combined with a reminder 24 hours before substantially reduces no-shows.",
        },
        {
          title: "Group classes with limited capacity",
          body:
            "If someone who signed up does not arrive and says nothing, the place stays empty even though others were on the waiting list. A reminder with a cancellation link frees the place early enough for the system to offer it on.",
        },
        {
          title: "A new client's first visit",
          body:
            "New clients miss appointments more often than regulars. A confirmation with the address, time and arrival instructions removes uncertainty and the chance of the appointment quietly falling through.",
        },
      ],
      benefitsTitle: "What automatic reminders change",
      benefits: [
        {
          title: "Fewer empty slots",
          body:
            "A reminder will not prevent every cancellation, but it does make sure you hear about them early enough to fill the slot with another client.",
        },
        {
          title: "No manual sending",
          body:
            "Messages are built from the appointment data and sent at the configured time, including weekends and the busiest days, when manual sending would be the first thing to slip.",
        },
        {
          title: "Less phone coordination",
          body:
            "A reschedule or cancellation link hands the change back to the client, which cuts down calls and coordination in the middle of the working day.",
        },
      ],
      comparisonTitle: "Manual notifications compared with Calendra",
      comparisonIntro:
        "Sending messages by hand works with a few appointments a day, but it is the first thing to fail when you are busiest.",
      comparisonManualLabel: "Manual messages or calls",
      comparisonCalendraLabel: "Calendra",
      comparisonRows: [
        {
          aspect: "Consistency",
          manual: "Depends on how much time is left between appointments.",
          calendra: "Every appointment gets the same notifications under the same rules.",
        },
        {
          aspect: "Timing",
          manual: "Whenever someone remembers.",
          calendra: "Exactly at the configured time before the appointment.",
        },
        {
          aspect: "Message content",
          manual: "Slightly different each time, often without address or instructions.",
          calendra: "A template with the service, employee, time and location.",
        },
        {
          aspect: "Client-initiated cancellation",
          manual: "A call during opening hours, otherwise an unconfirmed message.",
          calendra: "A link in the message that frees the slot immediately.",
        },
        {
          aspect: "Traceability",
          manual: "No record of whether a message was sent.",
          calendra: "Sent notifications are recorded in the appointment history.",
        },
        {
          aspect: "Cost",
          manual: "Staff time that could have gone to clients.",
          calendra: "Email is included; SMS is charged at the published rate.",
        },
      ],
      processTitle: "How a notification is built and sent",
      process: [
        "You choose the active templates, the channels and how far ahead to send.",
        "Calendra detects a new booking, a reschedule or a cancellation.",
        "The message is assembled from the appointment, service, employee and location.",
        "The client receives it with reschedule and cancellation links, and the sent notification stays in the history.",
      ],
      detailsTitle: "How reminders work",
      details: [
        {
          title: "When is the reminder sent?",
          body:
            "You set the timing. The most common choice is 24 hours before, which leaves enough time to reschedule while keeping the appointment close enough to remember. For longer or higher-value services, a reminder one week and one day before is a common combination.",
        },
        {
          title: "SMS or email: which should you use?",
          body:
            "Email is included and suits confirmations with more detail, attachments or instructions. SMS has a considerably higher read rate and is the better choice for the reminder immediately before the appointment. Many businesses use both: email to confirm, SMS to remind.",
        },
        {
          title: "How much do SMS messages cost?",
          body:
            "SMS and email reminders are included from the Professional plan onwards, and SMS usage is charged per message at the rate shown in the pricing configurator. Because the per-message price is visible, the monthly cost can be estimated from your appointment volume.",
        },
        {
          title: "Can I change the message wording?",
          body:
            "Yes. Templates can be edited and can include the client, service, employee, location and appointment time. That keeps messages in your own tone and carrying exactly the information your clients need.",
        },
      ],
      faqTitle: "Reminder questions",
      finalTitle: "Cut down on missed appointments",
      finalBody:
        "The free trial lasts 14 days and requires no credit card. You can switch reminders on and test them on your own appointments.",
      faq: [
        {
          question: "When does Calendra send a reminder?",
          answer:
            "You choose the timing. The most common setting is 24 hours before the appointment, while longer services often use a reminder one week and one day before.",
        },
        {
          question: "Are SMS reminders included in the plan price?",
          answer:
            "SMS and email reminders are included from the Professional plan onwards. SMS usage is charged per message at the rate shown in the pricing configurator.",
        },
        {
          question: "Can a client cancel from the reminder?",
          answer:
            "Yes. Every message can carry a secure reschedule or cancellation link. The slot is released immediately, and you set the rules for how late a cancellation is allowed.",
        },
        {
          question: "Can I edit the reminder text?",
          answer:
            "Yes. Message templates can be edited and can include the client, service, employee, location and appointment time.",
        },
        {
          question: "What happens if a client gives no phone number?",
          answer:
            "If no phone number is available, the notification is sent by email. Which fields are required at booking is configured in your booking settings.",
        },
      ],
    },
  },
  integrations: {
    sl: {
      eyebrow: "Integracije",
      title: "Integracije za naročanje: Google Koledar, Zoom in plačila",
      intro:
        "Calendra se poveže z Google Koledarjem, Zoomom in spletnimi plačili ter ponuja vtičnik za rezervacije, ki ga dodate na obstoječo spletno stran brez programiranja.",
      heroPoints: [
        "Dvosmerna sinhronizacija z Google Koledarjem",
        "Samodejne Zoom povezave za spletne termine",
        "Spletna plačila in rezervacijski vtičnik za vašo spletno stran",
      ],
      useCasesTitle: "Katere povezave podjetja vzpostavijo najprej",
      useCasesIntro:
        "Integracije rešujejo dve vrsti težav: podvajanje dela med orodji in vrzeli v rezervacijskem toku.",
      useCases: [
        {
          title: "Zaposleni, ki že živi v Google Koledarju",
          body:
            "Frizerka ali svetovalec ima osebne obveznosti v Google Koledarju in poslovne termine v Calendri. Po povezavi so Calendra termini vidni v Google Koledarju, obveznosti iz Google Koledarja pa lahko blokirajo razpoložljivost, zato se osebni in poslovni urnik ne prekrivata.",
        },
        {
          title: "Svetovanje in izobraževanje na daljavo",
          body:
            "Za storitve, ki potekajo prek videa, Calendra ob potrditvi termina samodejno ustvari Zoom povezavo in jo vključi v potrditveno sporočilo ter opomnik. Nihče ne ustvarja srečanj ročno in ne pošilja povezav posebej.",
        },
        {
          title: "Rezervacije neposredno s spletne strani",
          body:
            "Namesto preusmeritve na drugo domeno dodate na obstoječo spletno stran rezervacijski vtičnik. Stranka opravi celotno rezervacijo na vaši strani, kar zmanjša število opustitev med postopkom.",
        },
        {
          title: "Storitve, kjer je potrebno predplačilo",
          body:
            "Povezava s ponudnikom spletnih plačil omogoča, da je akontacija ali celotno plačilo pogoj za potrditev termina, kar je najbolj neposreden ukrep proti odpovedim v zadnjem trenutku.",
        },
      ],
      benefitsTitle: "Kaj integracije prihranijo",
      benefits: [
        {
          title: "En vnos namesto dveh",
          body:
            "Termin, ustvarjen v Calendri, se pojavi v Google Koledarju zaposlenega. Ni ročnega prepisovanja in ni tveganja, da je eden od koledarjev zastarel.",
        },
        {
          title: "Spletni termini brez priprave",
          body:
            "Povezava do video srečanja nastane samodejno ob potrditvi termina in je vključena v vsa obvestila, zato pred srečanjem ni iskanja povezave.",
        },
        {
          title: "Rezervacija ostane na vaši strani",
          body:
            "Vtičnik pomeni, da stranka ne zapusti vaše spletne strani. Manj korakov in manj preusmeritev pomeni več zaključenih rezervacij.",
        },
      ],
      comparisonTitle: "Ločena orodja v primerjavi s povezano Calendro",
      comparisonIntro:
        "Kombinacija koledarja, orodja za video srečanja in plačilne povezave deluje, vendar zahteva, da vsak korak sprožite ročno.",
      comparisonManualLabel: "Ločena orodja",
      comparisonCalendraLabel: "Calendra z integracijami",
      comparisonRows: [
        {
          aspect: "Termin v osebnem koledarju",
          manual: "Zaposleni ga vnese še enkrat, ali pa ga pozabi.",
          calendra: "Sinhronizacija z Google Koledarjem poteka samodejno.",
        },
        {
          aspect: "Povezava do video srečanja",
          manual: "Ustvarite jo ročno in jo pošljete v ločenem sporočilu.",
          calendra: "Zoom povezava nastane ob potrditvi in je v vseh obvestilih.",
        },
        {
          aspect: "Rezervacija na spletni strani",
          manual: "Preusmeritev na drugo domeno ali kontaktni obrazec.",
          calendra: "Vtičnik omogoča celotno rezervacijo na vaši strani.",
        },
        {
          aspect: "Predplačilo",
          manual: "Ročno poslana plačilna povezava, brez povezave s terminom.",
          calendra: "Plačilo je vgrajen korak v rezervacijskem toku.",
        },
        {
          aspect: "Osebne obveznosti zaposlenega",
          manual: "Niso vidne v poslovnem koledarju.",
          calendra: "Lahko blokirajo razpoložljivost prek Google Koledarja.",
        },
        {
          aspect: "Vzdrževanje",
          manual: "Več orodij, več računov, več mest za napako.",
          calendra: "Ena nastavitev, ki jo administrator omogoči enkrat.",
        },
      ],
      processTitle: "Kako vzpostavite integracijo",
      process: [
        "Administrator v nastavitvah omogoči izbrano integracijo.",
        "Zaposleni ali podjetje poveže svoj račun prek uradne prijave ponudnika.",
        "Pri storitvah določite, kje naj se integracija uporabi, na primer spletno srečanje ali predplačilo.",
        "Calendra povezane podatke uporablja v rezervacijskem toku, koledarju in obvestilih.",
      ],
      detailsTitle: "Kako integracije delujejo",
      details: [
        {
          title: "Kako deluje sinhronizacija z Google Koledarjem?",
          body:
            "Po povezavi računa se Calendra termini prikažejo v Google Koledarju zaposlenega, obveznosti iz Google Koledarja pa se lahko upoštevajo pri izračunu razpoložljivosti. Vsak zaposleni poveže svoj račun sam, zato dostop do koledarjev ostane pod njegovim nadzorom.",
        },
        {
          title: "Kdaj Calendra ustvari Zoom povezavo?",
          body:
            "Kadar je pri storitvi vklopljena možnost spletnega srečanja, se Zoom povezava ustvari ob potrditvi termina in vključi v potrditveno sporočilo ter opomnike. Ob prestavitvi termina se povezava ohrani, ob odpovedi pa se srečanje odstrani. Podroben potek je opisan na strani Zoom integracija.",
        },
        {
          title: "Ali za vtičnik potrebujem novo spletno stran?",
          body:
            "Ne. Rezervacijski vtičnik lahko dodate na obstoječo spletno stran, ne glede na to, ali je narejena v WordPressu, Wixu, Squarespaceu ali po meri. Če spletne strani še ni, lahko uporabite javno rezervacijsko povezavo.",
        },
        {
          title: "V katerih paketih so integracije na voljo?",
          body:
            "Integracije in spletna plačila so vključeni od paketa Profesionalno naprej. Rezervacijska povezava in javni profil delujeta v vseh paketih, vključno z Osnovnim.",
        },
      ],
      faqTitle: "Pogosta vprašanja o integracijah",
      finalTitle: "Povežite orodja, ki jih že uporabljate",
      finalBody:
        "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice. Integracijo lahko vzpostavite med preizkusom in preverite celoten potek.",
      faq: [
        {
          question: "Ali se Calendra sinhronizira z Google Koledarjem?",
          answer:
            "Da. Po povezavi računa so Calendra termini vidni v Google Koledarju zaposlenega, obveznosti iz Google Koledarja pa lahko blokirajo razpoložljivost za nove rezervacije.",
        },
        {
          question: "Ali Calendra samodejno ustvari Zoom povezavo?",
          answer:
            "Da. Če je pri storitvi vklopljeno spletno srečanje, Calendra ob potrditvi termina ustvari Zoom povezavo in jo vključi v potrditev ter opomnike.",
        },
        {
          question: "Ali lahko rezervacije dodam na obstoječo spletno stran?",
          answer:
            "Da. Rezervacijski vtičnik lahko vstavite na obstoječo spletno stran brez programiranja. Če spletne strani nimate, uporabite javno rezervacijsko povezavo.",
        },
        {
          question: "Kateri ponudniki plačil so podprti?",
          answer:
            "Spletna plačila potekajo prek povezanega ponudnika plačil, ki omogoča kartična plačila, akontacije in predplačila kot pogoj za potrditev termina.",
        },
        {
          question: "V katerem paketu so integracije vključene?",
          answer:
            "Integracije in spletna plačila so vključeni od paketa Profesionalno (34,90 EUR mesečno) naprej. Javna rezervacijska povezava deluje v vseh paketih.",
        },
      ],
    },
    en: {
      eyebrow: "Integrations",
      title: "Booking integrations: Google Calendar, Zoom and payments",
      intro:
        "Calendra connects to Google Calendar, Zoom and online payments, and offers a booking widget you can add to an existing website without writing code.",
      heroPoints: [
        "Two-way Google Calendar synchronisation",
        "Automatic Zoom links for online appointments",
        "Online payments and a booking widget for your website",
      ],
      useCasesTitle: "Which connections businesses set up first",
      useCasesIntro:
        "Integrations solve two kinds of problem: duplicated work across tools, and gaps in the booking flow.",
      useCases: [
        {
          title: "An employee who already lives in Google Calendar",
          body:
            "A stylist or consultant keeps personal commitments in Google Calendar and business appointments in Calendra. Once connected, Calendra appointments appear in Google Calendar, and Google Calendar commitments can block availability, so the personal and business schedules stop colliding.",
        },
        {
          title: "Remote consulting and teaching",
          body:
            "For services delivered over video, Calendra creates the Zoom link when the appointment is confirmed and includes it in the confirmation and the reminders. Nobody creates meetings by hand or sends links separately.",
        },
        {
          title: "Booking directly from your website",
          body:
            "Instead of redirecting to another domain, you add the booking widget to your existing site. The client completes the whole booking on your page, which reduces drop-off mid-process.",
        },
        {
          title: "Services that require prepayment",
          body:
            "Connecting an online payment provider lets a deposit or full payment be a condition for confirming the appointment, which is the most direct measure against last-minute cancellations.",
        },
      ],
      benefitsTitle: "What integrations save",
      benefits: [
        {
          title: "One entry instead of two",
          body:
            "An appointment created in Calendra appears in the employee's Google Calendar. There is no retyping and no risk that one of the calendars is out of date.",
        },
        {
          title: "Online appointments with no preparation",
          body:
            "The video meeting link is created when the appointment is confirmed and included in every notification, so nobody hunts for a link before the meeting.",
        },
        {
          title: "The booking stays on your site",
          body:
            "The widget means the client never leaves your website. Fewer steps and fewer redirects mean more completed bookings.",
        },
      ],
      comparisonTitle: "Separate tools compared with a connected Calendra",
      comparisonIntro:
        "A calendar plus a video tool plus a payment link works, but every step has to be triggered by hand.",
      comparisonManualLabel: "Separate tools",
      comparisonCalendraLabel: "Calendra with integrations",
      comparisonRows: [
        {
          aspect: "Appointment in a personal calendar",
          manual: "The employee enters it again, or forgets to.",
          calendra: "Google Calendar synchronisation happens automatically.",
        },
        {
          aspect: "Video meeting link",
          manual: "Created by hand and sent in a separate message.",
          calendra: "The Zoom link is created on confirmation and included everywhere.",
        },
        {
          aspect: "Booking on your website",
          manual: "A redirect to another domain, or a contact form.",
          calendra: "The widget allows the whole booking on your own page.",
        },
        {
          aspect: "Prepayment",
          manual: "A payment link sent manually, unconnected to the appointment.",
          calendra: "Payment is a built-in step in the booking flow.",
        },
        {
          aspect: "An employee's personal commitments",
          manual: "Invisible to the business calendar.",
          calendra: "Can block availability through Google Calendar.",
        },
        {
          aspect: "Maintenance",
          manual: "More tools, more accounts, more places to break.",
          calendra: "One setup an administrator enables once.",
        },
      ],
      processTitle: "How to set up an integration",
      process: [
        "An administrator enables the integration in settings.",
        "The employee or business connects their account through the provider's official sign-in.",
        "On each service you decide where the integration applies, such as online meetings or prepayment.",
        "Calendra uses the connected data in the booking flow, the calendar and notifications.",
      ],
      detailsTitle: "How the integrations work",
      details: [
        {
          title: "How does Google Calendar synchronisation work?",
          body:
            "Once an account is connected, Calendra appointments appear in the employee's Google Calendar and Google Calendar commitments can be taken into account when calculating availability. Each employee connects their own account, so calendar access stays under their control.",
        },
        {
          title: "When does Calendra create a Zoom link?",
          body:
            "When a service has the online meeting option enabled, the Zoom link is created as the appointment is confirmed and included in the confirmation and reminders. Rescheduling keeps the link, and cancelling removes the meeting. The full flow is documented on the Zoom integration page.",
        },
        {
          title: "Do I need a new website for the widget?",
          body:
            "No. The booking widget can be added to an existing website, whether it is built on WordPress, Wix, Squarespace or custom code. If you do not have a website yet, you can use the public booking link instead.",
        },
        {
          title: "Which plans include integrations?",
          body:
            "Integrations and online payments are included from the Professional plan onwards. The booking link and public profile work on every plan, including Basic.",
        },
      ],
      faqTitle: "Integration questions",
      finalTitle: "Connect the tools you already use",
      finalBody:
        "The free trial lasts 14 days and requires no credit card. You can set up an integration during the trial and test the whole flow.",
      faq: [
        {
          question: "Does Calendra sync with Google Calendar?",
          answer:
            "Yes. Once an account is connected, Calendra appointments appear in the employee's Google Calendar and Google Calendar commitments can block availability for new bookings.",
        },
        {
          question: "Does Calendra create Zoom links automatically?",
          answer:
            "Yes. If a service has online meetings enabled, Calendra creates the Zoom link when the appointment is confirmed and includes it in the confirmation and reminders.",
        },
        {
          question: "Can I add booking to my existing website?",
          answer:
            "Yes. The booking widget can be embedded in an existing website without writing code. If you have no website, use the public booking link.",
        },
        {
          question: "Which payment providers are supported?",
          answer:
            "Online payments run through a connected payment provider supporting card payments, deposits and prepayment as a condition for confirming an appointment.",
        },
        {
          question: "Which plan includes integrations?",
          answer:
            "Integrations and online payments are included from the Professional plan (34.90 EUR per month) onwards. The public booking link works on every plan.",
        },
      ],
    },
  },
};

export const getFeatureContent = (routeKey: FeatureRouteKey, language: SiteLanguage) =>
  content[routeKey][language];

export const isFeatureRouteKey = (routeKey: CanonicalRouteKey | undefined): routeKey is FeatureRouteKey =>
  Boolean(routeKey) && FEATURE_ROUTE_KEYS.includes(routeKey as FeatureRouteKey);
