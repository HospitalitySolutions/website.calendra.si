import type { SiteLanguage } from "@/lib/site-language";

export const languageNames: Record<SiteLanguage, Record<SiteLanguage, string>> = {
  sl: { sl: "Slovenščina", en: "English" },
  en: { sl: "Slovenian", en: "English" },
};

export const siteCopy = {
  sl: {
    nav: {
      features: "Funkcionalnosti",
      aboutApp: "O aplikaciji",
      pricing: "Cenik",
      clients: "Stranke",
      booking: "Spletno naročanje",
      connect: "Calendra Connect",
      itServices: "IT storitve",
      blog: "Nasveti",
      contact: "Kontakt",
      language: "Jezik",
      login: "Prijava",
      trial: "Preizkusi brezplačno",
    },
    hero: {
      badge: "Pametno. Enostavno. Učinkovito.",
      title1: "Program za naročanje strank,",
      title2: "termine in račune na enem mestu",
      supportingTitle: "Enostavnejše upravljanje terminov. Popolna organizacija.",
      description:
        "Calendra je namenjen salonom, svetovalcem, terapevtom, trenerjem in drugim storitvenim podjetjem, ki želijo izboljšati poslovanje ter prihraniti čas sebi in svojim strankam.",
      primaryCta: "Preizkusi brezplačno",
      secondaryCta: "Rezerviraj predstavitev",
      freeTrial: "14 dni brezplačno",
      noCard: "Brez kreditne kartice",
      cancelAnytime: "Preklic kadar koli",
      trustPrefix: "Zaupa nam več kot",
      trustedCompanies: "50+ podjetij",
      reviewRating: "5/5 na podlagi 40+ ocen",
      savedTimeValue: "6h+",
      savedTimeLabel: "Prihranjeno na teden",
      savedTimeDetail: "z avtomatizacijo terminov",
      appointmentsValue: "2.500+",
      appointmentsLabel: "Opravljenih terminov",
      appointmentsDetail: "vsak mesec",
      teamsValue: "50+",
      teamsLabel: "Zadovoljnih ekip",
      teamsDetail: "po vsej Sloveniji",
      screenshotAlt: "Tedenski koledar terminov v aplikaciji Calendra",
    },
    features: {
      eyebrow: "Funkcionalnosti",
      title: "Ključne funkcionalnosti Calendre",
      description: "Od prve rezervacije do zadnjega računa — Calendra pokriva celoten proces.",
      items: [
        {
          title: "Spletno naročanje",
          description: "Stranke izberejo storitev, zaposlenega in prost termin prek javne povezave ali vtičnika na vaši spletni strani.",
          linkLabel: "Oglejte si spletno naročanje",
        },
        {
          title: "Koledar terminov",
          description: "Dnevni, tedenski in mesečni pogled omogoča jasen pregled zaposlenih, prostorov in razpoložljivosti.",
          linkLabel: "Spoznajte koledar terminov",
        },
        {
          title: "Računi in plačila",
          description: "Pripravite račune ob zaključku termina, spremljajte plačila in izvozite podatke za računovodstvo.",
          linkLabel: "Preverite račune in plačila",
        },
        {
          title: "Upravljanje strank",
          description: "Centraliziran pregled strank z zgodovino terminov, zapiski in kontaktnimi podatki.",
          linkLabel: "Spoznajte upravljanje strank",
        },
        {
          title: "SMS in e-poštni opomniki",
          description: "Avtomatski SMS in e-poštni opomniki za termine in neplačane račune.",
          linkLabel: "Preberite, kako delujejo opomniki",
        },
        {
          title: "Integracije",
          description: "Google Calendar, Stripe plačila, Zoom video klici in še več — vse povezano.",
          linkLabel: "Preglejte integracije",
        },
      ],
    },
    finalCta: {
      title: "Pripravljeni na spremembo?",
      description: "Začnite brezplačno in odkrijte, zakaj nas izbirajo podjetniki po vsej Sloveniji.",
      button: "Začni 14-dnevni preizkus",
    },
    footer: {
      rights: "Vse pravice pridržane.",
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
      aboutApp: "About the app",
      pricing: "Pricing",
      clients: "Clients",
      booking: "Online booking",
      connect: "Calendra Connect",
      itServices: "IT services",
      blog: "Guides",
      contact: "Contact",
      language: "Language",
      login: "Login",
      trial: "Try it free",
    },
    hero: {
      badge: "Smart. Simple. Effective.",
      title1: "Appointment booking, scheduling",
      title2: "and invoicing in one place",
      supportingTitle: "Easier appointment management. Complete organisation.",
      description:
        "Calendra brings appointment booking, scheduling and invoicing together in one place. It is built for salons, consultants, therapists, trainers and other service businesses that want to reduce phone calls, double bookings, missed appointments and administration.",
      primaryCta: "Try it free",
      secondaryCta: "Book a demo",
      freeTrial: "14-day free trial",
      noCard: "No credit card required",
      cancelAnytime: "Cancel anytime",
      trustPrefix: "Trusted by more than",
      trustedCompanies: "50+ businesses",
      reviewRating: "5/5 based on 40+ reviews",
      savedTimeValue: "6h+",
      savedTimeLabel: "Saved every week",
      savedTimeDetail: "through appointment automation",
      appointmentsValue: "2,500+",
      appointmentsLabel: "Completed appointments",
      appointmentsDetail: "every month",
      teamsValue: "50+",
      teamsLabel: "Satisfied teams",
      teamsDetail: "across Slovenia",
      screenshotAlt: "Weekly appointment calendar in the Calendra app",
    },
    features: {
      eyebrow: "Features",
      title: "Key Calendra features",
      description: "From the first booking to the final invoice — Calendra covers the whole flow.",
      items: [
        {
          title: "Online booking",
          description: "Customers choose a service, employee and available time through a public link or a widget on your website.",
          linkLabel: "Explore online booking",
        },
        {
          title: "Appointment calendar",
          description: "Daily, weekly and monthly views give you a clear overview of employees, rooms and availability.",
          linkLabel: "Explore the appointment calendar",
        },
        {
          title: "Invoicing and payments",
          description: "Prepare invoices when appointments end, track payments and export data for accounting.",
          linkLabel: "Explore invoicing and payments",
        },
        {
          title: "Client management",
          description: "A central customer view with appointment history, notes, and contact details.",
          linkLabel: "Explore client management",
        },
        {
          title: "SMS and email reminders",
          description: "Automatic SMS and email reminders for appointments and unpaid invoices.",
          linkLabel: "Learn how appointment reminders work",
        },
        {
          title: "Integrations",
          description: "Google Calendar, Stripe payments, Zoom video calls, and more — all connected.",
          linkLabel: "Explore Calendra integrations",
        },
      ],
    },
    finalCta: {
      title: "Ready for a change?",
      description: "Start for free and discover why businesses across Slovenia choose us.",
      button: "Start a 14-day trial",
    },
    footer: {
      rights: "All rights reserved.",
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
