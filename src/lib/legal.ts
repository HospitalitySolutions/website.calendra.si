export const LEGAL = {
  entityName: "Hospit, David Mirc s.p.",
  businessAddress: "Cesta Toneta Tomšiča 78a",
  postalCode: "4270",
  city: "Jesenice",
  country: "Slovenia",
  generalEmail: "info@calendra.si",
  privacyEmail: "info@calendra.si",
  supportEmail: "info@calendra.si",
  supportPhone: "(+386) 40 641 644",
  supportPhoneTel: "+38640641644",
  websiteAndAppSameEntity: true,
  audience: "B2B",
  governingLaw: "Republic of Slovenia",
  hostingRegion: "AWS EU region",
  websiteAnalyticsEnabled: false,
  aiEnabledAtProductionLaunch: false,
  tenantSignupRequiresTermsAndDpa: true,
} as const;

export const LEGAL_FULL_ADDRESS = `${LEGAL.businessAddress}, ${LEGAL.postalCode} ${LEGAL.city}, ${LEGAL.country}`;

export type Subprocessor = {
  name: string;
  purpose: {
    sl: string;
    en: string;
  };
  dataCategories: {
    sl: string;
    en: string;
  };
  region: string;
  safeguard: {
    sl: string;
    en: string;
  };
};

export const SUBPROCESSORS: Subprocessor[] = [
  {
    name: "Amazon Web Services (AWS)",
    purpose: {
      sl: "Gostovanje, strežniška infrastruktura, podatkovna baza, shranjevanje datotek in varnostne kopije.",
      en: "Hosting, server infrastructure, database, file storage and backups.",
    },
    dataCategories: {
      sl: "Podatki najemnikov, uporabnikov, gostov, naročil, računov, terminov, sporočil, datotek in operativni dnevniki.",
      en: "Tenant, user, guest, order, invoice, appointment, message, file and operational log data.",
    },
    region: "AWS EU region",
    safeguard: {
      sl: "Obdelava v EU regiji oziroma ustrezni pogodbeni in tehnični zaščitni ukrepi, kadar je to potrebno.",
      en: "Processing in the EU region or appropriate contractual and technical safeguards where required.",
    },
  },
  {
    name: "Firebase / Google",
    purpose: {
      sl: "Mobilna infrastruktura, potisna obvestila, prijava ali druge Google integracije, kadar jih omogoči uporabnik oziroma najemnik.",
      en: "Mobile infrastructure, push notifications, sign-in or other Google integrations where enabled by the user or tenant.",
    },
    dataCategories: {
      sl: "Identifikatorji naprav, tehnični podatki, obvestila, Google povezovalni podatki in integracijski metapodatki.",
      en: "Device identifiers, technical data, notifications, Google connection data and integration metadata.",
    },
    region: "EU / global provider infrastructure",
    safeguard: {
      sl: "Ponudnikovi pogoji obdelave podatkov in ustrezni mehanizmi prenosa, kadar pride do prenosa izven EGP.",
      en: "Provider data processing terms and appropriate transfer mechanisms where transfers outside the EEA occur.",
    },
  },
  {
    name: "Stripe",
    purpose: {
      sl: "Obdelava spletnih plačil, povezani plačilni računi in plačilna skladnost.",
      en: "Online payment processing, connected payment accounts and payment compliance.",
    },
    dataCategories: {
      sl: "Plačilni metapodatki, podatki o naročilih, podatki o povezavah s Stripe računom in omejeni podatki kupcev za plačilo.",
      en: "Payment metadata, order data, Stripe account connection data and limited payer data required for payment.",
    },
    region: "EU / global provider infrastructure",
    safeguard: {
      sl: "Ponudnikovi pogoji obdelave podatkov in ustrezni mehanizmi prenosa za plačilno obdelavo.",
      en: "Provider data processing terms and appropriate transfer mechanisms for payment processing.",
    },
  },
  {
    name: "Apple",
    purpose: {
      sl: "Distribucija iOS aplikacije, Apple prijava ali plačilni/app-store postopki, kadar so uporabljeni.",
      en: "iOS app distribution, Apple sign-in or payment/app-store flows where used.",
    },
    dataCategories: {
      sl: "Apple identifikatorji, app-store metapodatki in tehnični podatki, potrebni za delovanje iOS aplikacije.",
      en: "Apple identifiers, app-store metadata and technical data required for iOS app operation.",
    },
    region: "EU / global provider infrastructure",
    safeguard: {
      sl: "Ponudnikovi pogoji, varnostni ukrepi in ustrezni prenosni mehanizmi, kjer je potrebno.",
      en: "Provider terms, security measures and appropriate transfer mechanisms where required.",
    },
  },
  {
    name: "Zoom",
    purpose: {
      sl: "Ustvarjanje in upravljanje spletnih terminov ter povezav za video srečanja, kadar je integracija omogočena.",
      en: "Creating and managing online appointments and video meeting links where the integration is enabled.",
    },
    dataCategories: {
      sl: "Podatki o terminih, udeležencih, povezavah in integracijski metapodatki.",
      en: "Appointment, participant, meeting link and integration metadata.",
    },
    region: "EU / global provider infrastructure",
    safeguard: {
      sl: "Ponudnikovi pogoji obdelave in ustrezni prenosni mehanizmi za mednarodne prenose.",
      en: "Provider processing terms and appropriate transfer mechanisms for international transfers.",
    },
  },
  {
    name: "OpenAI",
    purpose: {
      sl: "Izbrane AI funkcionalnosti, kadar bodo omogočene. AI funkcije niso omogočene ob začetku produkcije.",
      en: "Selected AI features when enabled. AI features are not enabled at production launch.",
    },
    dataCategories: {
      sl: "Uporabniški vnosi in izhodi AI funkcij, kadar najemnik ali uporabnik omogoči takšno funkcionalnost.",
      en: "User inputs and AI feature outputs where a tenant or user enables such functionality.",
    },
    region: "EU / global provider infrastructure",
    safeguard: {
      sl: "Uporaba le za omogočene funkcije z ustreznimi pogodbenimi, tehničnimi in konfiguracijskimi zaščitami.",
      en: "Used only for enabled features with appropriate contractual, technical and configuration safeguards.",
    },
  },
  {
    name: "A1",
    purpose: {
      sl: "Pošiljanje SMS sporočil in drugih komunikacijskih storitev, kadar so omogočene.",
      en: "SMS delivery and other communication services where enabled.",
    },
    dataCategories: {
      sl: "Telefonske številke, vsebina oziroma metapodatki sporočil in dnevniki dostave.",
      en: "Phone numbers, message content or metadata and delivery logs.",
    },
    region: "EU / provider infrastructure",
    safeguard: {
      sl: "Pogodbeni in tehnični ukrepi ponudnika komunikacijskih storitev.",
      en: "Contractual and technical measures of the communications provider.",
    },
  },
  {
    name: "Bunny.net",
    purpose: {
      sl: "CDN, dostava statičnih vsebin ali medijskih datotek, kadar je uporabljeno.",
      en: "CDN, static asset or media file delivery where used.",
    },
    dataCategories: {
      sl: "Tehnični podatki zahtevkov, IP naslovi, metapodatki dostave vsebin in datoteke, ki se dostavljajo prek CDN.",
      en: "Request technical data, IP addresses, content delivery metadata and files delivered through the CDN.",
    },
    region: "EU / global CDN infrastructure",
    safeguard: {
      sl: "Ponudnikovi pogoji obdelave in tehnične zaščite CDN omrežja.",
      en: "Provider processing terms and technical safeguards of the CDN network.",
    },
  },
];

export type RetentionCategory = {
  label: {
    sl: string;
    en: string;
  };
  summary: {
    sl: string;
    en: string;
  };
};

export const RETENTION_CATEGORIES: RetentionCategory[] = [
  {
    label: { sl: "Računi, plačila in poslovne evidence", en: "Invoices, payments and business records" },
    summary: {
      sl: "Hranijo se toliko časa, kot to zahtevajo računovodski, davčni, dokazni ali drugi zakonski roki.",
      en: "Kept for as long as required by accounting, tax, evidentiary or other statutory periods.",
    },
  },
  {
    label: { sl: "Računi najemnikov in uporabnikov", en: "Tenant and user accounts" },
    summary: {
      sl: "Hranijo se za čas uporabe storitve in omejeno obdobje po prenehanju, razen kadar je daljša hramba potrebna zaradi zakonskih obveznosti, varnosti ali zahtevkov.",
      en: "Kept for the duration of service use and a limited period after termination, unless longer retention is required for law, security or claims.",
    },
  },
  {
    label: { sl: "Podatki gostov in strank najemnika", en: "Guest and tenant customer data" },
    summary: {
      sl: "Obdelujejo se po navodilih najemnika. Ob izbrisu računa se podatki izbrišejo ali anonimizirajo, razen kadar je hramba potrebna za zakonske ali legitimne razloge.",
      en: "Processed on the tenant's instructions. On account deletion, data is deleted or anonymised unless retention is needed for legal or legitimate reasons.",
    },
  },
  {
    label: { sl: "Varnostni in tehnični dnevniki", en: "Security and technical logs" },
    summary: {
      sl: "Hranijo se omejeno obdobje zaradi varnosti, preprečevanja zlorab, diagnostike in dokazovanja dogodkov.",
      en: "Kept for a limited period for security, abuse prevention, diagnostics and event evidence.",
    },
  },
  {
    label: { sl: "Varnostne kopije", en: "Backups" },
    summary: {
      sl: "Podatki v varnostnih kopijah se odstranijo po redni rotaciji varnostnih kopij; obnovitev varnostne kopije lahko začasno ponovno vzpostavi starejše podatke, ki se nato ponovno obravnavajo po veljavnih pravilih.",
      en: "Data in backups is removed according to backup rotation; restoring a backup may temporarily restore older data, which is then handled again under the applicable rules.",
    },
  },
];
