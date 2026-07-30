import type { CanonicalRouteKey } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";

/**
 * Short, self-contained answers rendered directly beneath each page's H1.
 *
 * AI assistants extract passages, not pages. A paragraph that names the entity
 * in its first sentence, answers the page's implied question outright and
 * carries concrete numbers is far more likely to be quoted than one that builds
 * up to the point. Each entry is deliberately kept to roughly 40-60 words.
 */
const answers: Partial<Record<CanonicalRouteKey, Record<SiteLanguage, string>>> = {
  pricing: {
    sl: "Calendra stane od 17,90 EUR na mesec z DDV za paket Osnovno, 34,90 EUR za Profesionalno in 54,90 EUR za Premium. Vsak paket vključuje enega uporabnika, dodatni stanejo od 9,90 EUR mesečno. Pri letnem plačilu plačate 10 mesecev za 12. Preizkus traja 14 dni brez kreditne kartice.",
    en: "Calendra costs from 17.90 EUR per month including VAT for the Basic plan, 34.90 EUR for Professional and 54.90 EUR for Premium. Every plan includes one user, and additional users start at 9.90 EUR per month. Annual billing charges 10 months for 12. The trial lasts 14 days with no credit card.",
  },
  booking: {
    sl: "Spletno naročanje v Calendri strankam omogoča, da 24 ur na dan same izberejo storitev, zaposlenega in prost termin. Rezervacija se takoj zapiše v koledar, stranka pa prejme potrditev ter povezavo za spremembo ali odpoved. Nove spletne strani ne potrebujete: uporabite javno povezavo ali vtičnik.",
    en: "Online booking in Calendra lets customers choose a service, an employee and a free time slot themselves, 24 hours a day. The booking is written straight into the calendar, and the customer receives a confirmation plus links to reschedule or cancel. You do not need a new website: use a public link or the widget.",
  },
  calendar: {
    sl: "Koledar terminov v Calendri prikaže termine vseh zaposlenih, prostorov in storitev na enem zaslonu. Pri vsaki rezervaciji samodejno preveri delovni čas, odsotnosti in obstoječe termine, zato dvojne rezervacije niso mogoče. Na voljo so dnevni, tedenski in mesečni pogled ter ponavljajoči se termini.",
    en: "The Calendra appointment calendar shows appointments for every employee, room and service on one screen. Each booking automatically checks working hours, absences and existing appointments, so double bookings cannot happen. Daily, weekly and monthly views are available, along with recurring appointments.",
  },
  invoicing: {
    sl: "Calendra iz izvedenega termina ustvari račun v nekaj klikih, saj storitev, ceno in podatke stranke prevzame iz rezervacije. Podpira gotovino, kartice in spletna plačila, z dodatkom za davčno blagajno pa tudi davčno potrjevanje računov po slovenski zakonodaji.",
    en: "Calendra turns a completed appointment into an invoice in a few clicks, because the service, price and client details carry over from the booking. It supports cash, card and online payments, and with the fiscal cash register add-on it also handles fiscal verification under Slovenian law.",
  },
  clientManagement: {
    sl: "Profil stranke v Calendri na enem mestu združi kontaktne podatke, celotno zgodovino terminov, opombe, dokumente, izdane račune in polja po meri. Ob vsakem naslednjem naročilu vidite pretekle storitve in dogovore, zato ni treba iskati po zvezkih, e-pošti ali sporočilih.",
    en: "A client profile in Calendra brings contact details, the full appointment history, notes, documents, issued invoices and custom fields together in one place. At every following booking you can see past services and agreements, so there is no need to search notebooks, email or messages.",
  },
  reminders: {
    sl: "Calendra samodejno pošlje potrditev ob rezervaciji in opomnik pred terminom po SMS ali e-pošti, čas pošiljanja pa določite sami. Vsako sporočilo vsebuje povezavo za prestavitev ali odpoved, kar zmanjša število pozabljenih terminov in sprosti mesta za druge stranke.",
    en: "Calendra automatically sends a confirmation when a booking is made and a reminder before the appointment by SMS or email, with the timing set by you. Every message includes a link to reschedule or cancel, which reduces missed appointments and frees the slot for another customer.",
  },
  integrations: {
    sl: "Calendra se poveže z Google Koledarjem za dvosmerno sinhronizacijo, z Zoomom za samodejno ustvarjanje povezav do video srečanj in s Stripom za spletna plačila ter predplačila. Na svojo obstoječo spletno stran lahko dodate rezervacijski vtičnik brez programiranja.",
    en: "Calendra connects to Google Calendar for two-way sync, to Zoom for automatically generated video meeting links and to Stripe for online payments and deposits. You can add the booking widget to your existing website without writing any code.",
  },
  connect: {
    sl: "Calendra Connect je brezplačna mobilna aplikacija za stranke, na voljo za iOS in Android. V njej rezervirate, prestavite ali odpoveste termin, prejemate obvestila ter na enem mestu spremljate termine pri vseh ponudnikih, ki uporabljajo Calendro.",
    en: "Calendra Connect is a free mobile app for customers, available for iOS and Android. Use it to book, reschedule or cancel appointments, receive notifications and follow appointments with every provider that uses Calendra from one place.",
  },
  itServices: {
    sl: "IT storitve Calendre so samostojna ponudba za mala podjetja v Sloveniji in niso vezane na naročnino Calendra. Pokrivamo IT-podporo, izdelavo in vzdrževanje spletnih strani, poslovno e-pošto, varnostne kopije ter avtomatizacije. Delo poteka projektno, po urah ali kot mesečna podpora.",
    en: "Calendra's IT services are a standalone offer for small businesses in Slovenia and do not require a Calendra subscription. They cover IT support, website design and maintenance, business email, backups and automation. Work is delivered as a project, hourly or as monthly support.",
  },
  demo: {
    sl: "Predstavitev Calendre je 30-minutni video klic, na katerem skupaj pregledamo vaš način dela in nastavitve, ki jih potrebujete. Prost termin izberete sami, potrditev in povezavo do klica pa prejmete po e-pošti. Predstavitev je brezplačna in ne zahteva odločitve o nakupu.",
    en: "A Calendra demo is a 30-minute video call where we review how you work today and the setup you need. You pick an available slot yourself and receive the confirmation and the call link by email. The demo is free and requires no purchase decision.",
  },
};

export const getAnswerForRoute = (
  routeKey: CanonicalRouteKey | undefined,
  language: SiteLanguage,
): string | undefined => (routeKey ? answers[routeKey]?.[language] : undefined);

export const ANSWER_ROUTE_KEYS = Object.keys(answers) as CanonicalRouteKey[];
