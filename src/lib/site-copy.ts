import type { SiteLanguage } from "@/lib/site-language";

export const languageNames: Record<SiteLanguage, Record<SiteLanguage, string>> = {
  sl: { sl: "Slovenščina", en: "English" },
  en: { sl: "Slovenian", en: "English" },
};

export const siteCopy = {
  sl: {
    nav: {
      features: "Funkcionalnosti",
      pricing: "Cenik",
      booking: "Naročanje",
      language: "Jezik",
      login: "Prijava",
      trial: "Preizkusi brezplačno",
    },
    hero: {
      badge: "Glasovni AI ukazi za hitrejše delo",
      title1: "Rezervacije,",
      title2: "brez komplikacij.",
      description:
        "Calendra je booking platforma, ki združuje upravljanje terminov, izdajanje računov, analitiko, podatke o strankah in glasovne AI ukaze — vse na enem mestu.",
      primaryCta: "Preizkusi brezplačno",
      freeTrial: "14 dni brezplačno",
      noCard: "Brez kreditne kartice",
      stats: [
        { label: "Rezervacije danes", value: "12" },
        { label: "Prihodek ta mesec", value: "€3.240" },
        { label: "Novih strank", value: "8" },
      ],
      schedule: [
        { time: "09:00", name: "Maja K.", status: "Potrjeno" },
        { time: "10:30", name: "Peter N.", status: "Čaka" },
        { time: "13:00", name: "Ana S.", status: "Potrjeno" },
      ],
      voiceHint: '"Rezerviraj Petru za petek ob 14h"',
    },
    features: {
      eyebrow: "Funkcionalnosti",
      title: "Vse kar potrebujete,\nna enem mestu.",
      description: "Od prve rezervacije do zadnjega računa — Calendra pokriva celoten proces.",
      items: [
        {
          title: "Upravljanje rezervacij",
          description: "Koledar z dnevnim, tedenskim in mesečnim pogledom. Avtomatska sinhronizacija z Google koledarjem.",
        },
        {
          title: "Izdajanje računov",
          description: "Samodejno generiranje računov ob zaključku termina. Izvoz za računovodstvo v enem kliku.",
        },
        {
          title: "Analitika",
          description: "Pregled prihodkov, zasedenosti, trendov in konverzij strank z vizualnimi poročili.",
        },
        {
          title: "Podatki o strankah",
          description: "Centraliziran pregled strank z zgodovino terminov, zapiski in kontaktnimi podatki.",
        },
        {
          title: "AI glasovni ukazi",
          description: "Ustvarjajte in upravljajte rezervacije z glasom. »Rezerviraj Ano za torek ob 10h« — in je narejeno.",
        },
        {
          title: "Opomniki",
          description: "Avtomatski SMS in e-poštni opomniki za termine in neplačane račune.",
        },
        {
          title: "Varnost in GDPR",
          description: "Šifrirani podatki, varno gostovanje v EU in skladnost z uredbo GDPR.",
        },
        {
          title: "Integracije",
          description: "Google Calendar, Stripe plačila, Zoom video klici in še več — vse povezano.",
        },
      ],
    },
    finalCta: {
      title: "Pripravljeni na spremembo?",
      description: "Začnite brezplačno in odkrijte, zakaj nas izbirajo podjetniki po vsej Sloveniji.",
      button: "Začni 7-dnevni preizkus",
    },
    footer: {
      rights: "Vse pravice pridržane.",
      booking: "Naročanje",
      privacy: "Politika zasebnosti",
      privacyContact: "Kontakt glede zasebnosti",
      terms: "Pogoji uporabe",
    },
    bookingPage: {
      back: "Nazaj na predstavitveno stran",
      badge: "Naročanje",
      title: "Rezervirajte termin neposredno na spletni strani.",
      description:
        "Gost izbere storitev, svetovalca, datum in uro, nato pa vnese ime, priimek, e-pošto in telefonsko številko. Če je za tenant aktivirana razpoložljivost, so prikazani samo prosti termini.",
      cards: [
        {
          title: "Izbira storitve",
          description: "Obiskovalec najprej izbere storitev, ki jo želi rezervirati.",
        },
        {
          title: "Izbira svetovalca",
          description: "Če je v tenant-u več svetovalcev, gost najprej izbere želeno osebo.",
        },
        {
          title: "Prosti termini",
          description: "Ko je availability vklopljen, se prikažejo le razpoložljivi sloti.",
        },
        {
          title: "Povezano z app.calendra.si",
          description: "Rezervacija se odda neposredno v vaš Calendra sistem.",
        },
      ],
      tenantInfoPrefix: "Ta stran uporablja tenant",
      tenantInfoMiddle: "in nalaga widget iz",
      openBooking: "Odpri naročanje",
      moreAbout: "Več o Calendri",
      widgetTitle: "Naročanje termina",
      widgetSubtitle: "Vgrajeni Calendra booking widget.",
      loadingWidget: "Nalagam booking widget ...",
      widgetLoadError: "Widgeta ni bilo mogoče naložiti. Preverite, ali je script dosegljiv na",
      tenantBadge: "Tenant 2TEN",
    },
  },
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      booking: "Booking",
      language: "Language",
      login: "Login",
      trial: "Try it free",
    },
    hero: {
      badge: "Voice AI commands for faster work",
      title1: "Reservations,",
      title2: "without the hassle.",
      description:
        "Calendra is a booking platform that brings together appointment management, invoicing, analytics, customer data, and voice AI commands — all in one place.",
      primaryCta: "Try it free",
      freeTrial: "14-day free trial",
      noCard: "No credit card required",
      stats: [
        { label: "Bookings today", value: "12" },
        { label: "Revenue this month", value: "€3,240" },
        { label: "New customers", value: "8" },
      ],
      schedule: [
        { time: "09:00", name: "Maja K.", status: "Confirmed" },
        { time: "10:30", name: "Peter N.", status: "Waiting" },
        { time: "13:00", name: "Ana S.", status: "Confirmed" },
      ],
      voiceHint: '"Book Peter for Friday at 2 PM"',
    },
    features: {
      eyebrow: "Features",
      title: "Everything you need,\nin one place.",
      description: "From the first booking to the final invoice — Calendra covers the whole flow.",
      items: [
        {
          title: "Booking management",
          description: "A calendar with daily, weekly, and monthly views. Automatic Google Calendar sync.",
        },
        {
          title: "Invoicing",
          description: "Automatically generate invoices when a session ends. Export for accounting in one click.",
        },
        {
          title: "Analytics",
          description: "Track revenue, utilization, trends, and customer conversions with visual reports.",
        },
        {
          title: "Customer data",
          description: "A central customer view with appointment history, notes, and contact details.",
        },
        {
          title: "AI voice commands",
          description: "Create and manage bookings with your voice. “Book Ana for Tuesday at 10 AM” — done.",
        },
        {
          title: "Reminders",
          description: "Automatic SMS and email reminders for appointments and unpaid invoices.",
        },
        {
          title: "Security and GDPR",
          description: "Encrypted data, secure EU hosting, and GDPR compliance.",
        },
        {
          title: "Integrations",
          description: "Google Calendar, Stripe payments, Zoom video calls, and more — all connected.",
        },
      ],
    },
    finalCta: {
      title: "Ready for a change?",
      description: "Start for free and discover why businesses across Slovenia choose us.",
      button: "Start a 7-day trial",
    },
    footer: {
      rights: "All rights reserved.",
      booking: "Booking",
      privacy: "Privacy policy",
      privacyContact: "Privacy contact",
      terms: "Terms of service",
    },
    bookingPage: {
      back: "Back to the landing page",
      badge: "Booking",
      title: "Let customers book directly on your website.",
      description:
        "Guests choose a service, consultant, date, and time, then enter their name, email, and phone number. When tenant availability is enabled, only free slots are shown.",
      cards: [
        {
          title: "Choose a service",
          description: "Visitors first select the service they want to book.",
        },
        {
          title: "Choose a consultant",
          description: "If the tenancy has multiple consultants, the guest first selects the preferred person.",
        },
        {
          title: "See open slots",
          description: "When availability is enabled, only bookable slots are shown.",
        },
        {
          title: "Connected to app.calendra.si",
          description: "The booking is submitted directly into your Calendra system.",
        },
      ],
      tenantInfoPrefix: "This page uses tenant",
      tenantInfoMiddle: "and loads the widget from",
      openBooking: "Open booking",
      moreAbout: "More about Calendra",
      widgetTitle: "Book a session",
      widgetSubtitle: "Embedded Calendra booking widget.",
      loadingWidget: "Loading booking widget ...",
      widgetLoadError: "The widget could not be loaded. Check whether the script is reachable at",
      tenantBadge: "Tenant 2TEN",
    },
  },
} as const;

export const getSiteCopy = (language: SiteLanguage) => siteCopy[language];
