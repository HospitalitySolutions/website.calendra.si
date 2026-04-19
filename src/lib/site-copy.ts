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
      support: "Podpora",
      aiTransparency: "AI transparentnost",
    },
    aiTransparencySection: {
      eyebrow: "AI transparentnost",
      title: "Jasno razkritje uporabe AI storitev",
      description:
        "Calendra uporablja OpenAI storitve za izbrane AI funkcionalnosti v aplikaciji. To razkritje je objavljeno javno, da lahko uporabniki in pregledniki hitro razumejo, katere AI storitve uporabljamo.",
      cards: {
        service: {
          title: "Katere AI storitve uporabljamo",
          body: "Calendra uporablja OpenAI za podporo izbranim AI funkcionalnostim, kot so glasovni AI ukazi in druge AI podprte izkušnje v aplikaciji.",
        },
        useCases: {
          title: "Kako se uporabljajo",
          body: "OpenAI storitve uporabljamo za obdelavo uporabniških vnosov in pomoč pri avtomatizaciji določenih delov delovnega toka znotraj aplikacije.",
        },
        review: {
          title: "Pomembno za uporabnike",
          body: "AI izhodi lahko vsebujejo napake ali nepopolnosti, zato jih je treba po potrebi pregledati, preden se uporabijo za poslovne odločitve ali komunikacijo.",
        },
      },
      linkTitle: "Več podrobnosti",
      linkBody: "Celotno javno razkritje je dostopno na namenski strani AI transparentnosti.",
      linkCta: "Odpri AI transparentnost",
    },
    aiTransparencyPage: {
      badge: "AI transparentnost",
      title: "AI transparentnost za Calendra",
      intro:
        "Ta javna stran pojasnjuje, katere AI storitve uporablja Calendra in kako so uporabljene v aplikaciji. Namenjena je uporabnikom, partnerjem in preglednikom skladnosti.",
      cards: [
        {
          title: "Ponudnik AI storitev",
          body: "Calendra uporablja OpenAI storitve za podporo določenim AI funkcionalnostim v aplikaciji.",
        },
        {
          title: "Podprte funkcionalnosti",
          body: "To lahko vključuje AI podprte funkcije, kot so glasovni ukazi, pomoč pri obdelavi vsebin in druge uporabniške izkušnje, kjer je AI izrecno del funkcionalnosti.",
        },
        {
          title: "Transparentnost do uporabnikov",
          body: "Na tej strani javno razkrivamo uporabo OpenAI, da so uporabniki jasno obveščeni o AI komponentah v storitvi.",
        },
      ],
      disclosureTitle: "Javno razkritje",
      disclosureBody1: "Calendra uporablja OpenAI storitve za podporo določenim AI funkcionalnostim v aplikaciji.",
      disclosureBody2: "AI funkcije lahko obdelujejo uporabniške vnose za ustvarjanje odgovorov, pomoč pri avtomatizaciji ali izboljšanje uporabniške izkušnje znotraj platforme.",
      disclosureBody3: "AI generirane vsebine ali predlogi so lahko netočni ali nepopolni in jih je treba po potrebi pregledati pred uporabo.",
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
    supportPage: {
      badge: "Podpora",
      title: "Podpora za Calendra",
      intro:
        "Na tej strani so navedeni načini za pomoč pri aplikaciji Calendra: odprtje zahtevka, e-pošta, telefon, delovni čas ekipe za podporo in pričakovani čas prvega odziva.",
      appAccessTitle: "Dostop do aplikacije Calendra",
      appAccessLine1: "Prijavite se v spletno aplikacijo Calendra na naslovu",
      appAccessLine2:
        ". Za vprašanja o računu, napakah v aplikaciji ali funkcionalnostih nas kontaktirajte po e-pošti ali telefonu (spodaj).",
      openCaseTitle: "Odprite zahtevek za podporo",
      openCaseBody:
        "Če še nimate prednostnega kanala, nam pošljite e-pošto z opisom težave. Uporabite gumb — odpre se vaš e-poštni program s predmetom in osnutkom sporočila.",
      openCaseCta: "Odpri e-pošto za zahtevek",
      mailtoSubject: "Calendra — zahtevek za podporo",
      mailtoBody: "Prosimo, opišite težavo ali vprašanje (lokacija v aplikaciji, koraki za ponovitev):\n\n",
      contactTitle: "E-pošta, telefon in delovni čas",
      contactEmailLabel: "E-pošta:",
      contactPhoneLabel: "Telefon:",
      contactHoursLabel: "Delovni čas podpore:",
      contactHoursValue: "09:00–17:00, lokalni čas Ljubljana (CET/CEST).",
      slaTitle: "Prvi odziv (SLA)",
      slaBody:
        "Ciljamo prvi odziv v roku 24 ur (koledarskih), vključno z vikendi. To pomeni začetni odgovor ali potrditev prejema vaše zahteve, ne nujno dokončno rešitev vseh težav.",
      liveTitle: "Živa podpora in drugi kanali",
      liveBody:
        "Med delovnim časom podpore je na voljo telefonska podpora (glasovni klic). Klepet v živo (chat) trenutno ni na voljo.",
      kbTitle: "Baza znanja in forum",
      kbBody:
        "Javna baza znanja in forum trenutno nista na voljo. Za vprašanja uporabite e-pošto ali telefon; to stran bomo posodobili, če dodamo dodatne vire.",
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
      support: "Support",
      aiTransparency: "AI Transparency",
    },
    aiTransparencySection: {
      eyebrow: "AI Transparency",
      title: "Clear disclosure of AI services",
      description:
        "Calendra uses OpenAI services for selected AI-powered features in the application. This public disclosure helps users and reviewers quickly understand which AI services are in use.",
      cards: {
        service: {
          title: "Which AI services we use",
          body: "Calendra uses OpenAI to support selected AI-powered functionality, including voice AI commands and other AI-assisted experiences in the product.",
        },
        useCases: {
          title: "How they are used",
          body: "OpenAI services are used to process user input and help automate specific parts of the workflow inside the application.",
        },
        review: {
          title: "What users should know",
          body: "AI output can contain errors or omissions, so it should be reviewed as appropriate before being relied on for business decisions or communications.",
        },
      },
      linkTitle: "More details",
      linkBody: "The full public disclosure is available on the dedicated AI Transparency page.",
      linkCta: "Open AI Transparency",
    },
    aiTransparencyPage: {
      badge: "AI Transparency",
      title: "AI transparency for Calendra",
      intro:
        "This public page explains which AI services Calendra uses and how they are used in the application. It is intended for users, partners, and compliance reviewers.",
      cards: [
        {
          title: "AI service provider",
          body: "Calendra uses OpenAI services to support certain AI-powered functionality in the application.",
        },
        {
          title: "Supported functionality",
          body: "This may include AI-assisted capabilities such as voice commands, content processing assistance, and other product experiences where AI is an explicit part of the feature.",
        },
        {
          title: "User transparency",
          body: "We publicly disclose the use of OpenAI on this page so users are clearly informed about AI components in the service.",
        },
      ],
      disclosureTitle: "Public disclosure",
      disclosureBody1: "Calendra uses OpenAI services to support certain AI-powered features in the application.",
      disclosureBody2: "These AI features may process user input to generate responses, assist with automation, or improve the user experience within the platform.",
      disclosureBody3: "AI-generated content or suggestions may be inaccurate or incomplete and should be reviewed as appropriate before use.",
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
    supportPage: {
      badge: "Support",
      title: "Calendra support",
      intro:
        "This page explains how to get help with the Calendra app: opening a support case, email, phone, support team hours, and our first-response commitment.",
      appAccessTitle: "Accessing the Calendra app",
      appAccessLine1: "Sign in to the Calendra web app at",
      appAccessLine2:
        ". For account questions, in-app errors, or feature questions, contact us by email or phone (below).",
      openCaseTitle: "Open a support case",
      openCaseBody:
        "If you do not already use a preferred channel, email us with details about the issue. Use the button — it opens your email client with a subject line and message draft.",
      openCaseCta: "Compose email for support case",
      mailtoSubject: "Calendra — support request",
      mailtoBody: "Please describe the issue or question (where in the app, steps to reproduce):\n\n",
      contactTitle: "Email, phone, and hours",
      contactEmailLabel: "Email:",
      contactPhoneLabel: "Phone:",
      contactHoursLabel: "Support hours:",
      contactHoursValue: "09:00–17:00, Ljubljana local time (CET/CEST).",
      slaTitle: "First response (SLA)",
      slaBody:
        "We aim to provide a first response within 24 hours (calendar time), including weekends. That means an initial reply or acknowledgement of your request, not necessarily a full resolution for every issue.",
      liveTitle: "Live support and other channels",
      liveBody:
        "During support hours, phone support (voice) is available. Live chat is not available at this time.",
      kbTitle: "Knowledge base and forum",
      kbBody:
        "A public knowledge base and community forum are not available yet. Please use email or phone; we will update this page if we add more resources.",
    },
  },
} as const;

export const getSiteCopy = (language: SiteLanguage) => siteCopy[language];
