import type { CanonicalRouteKey } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";

export type ItServiceRouteKey =
  | "itSupport"
  | "websiteDesign"
  | "websiteMaintenance"
  | "businessEmail"
  | "backupsSecurity"
  | "automation";

export type ItServiceContent = {
  routeKey: ItServiceRouteKey;
  navLabel: string;
  title: string;
  shortDescription: string;
  intro: string;
  benefits: string[];
  deliverables: string[];
  process: Array<{ title: string; body: string }>;
  outcomes: Array<{ title: string; body: string }>;
  faq: Array<{ question: string; answer: string }>;
  related: ItServiceRouteKey[];
};

export const IT_SERVICE_ROUTE_KEYS: ItServiceRouteKey[] = [
  "itSupport",
  "websiteDesign",
  "websiteMaintenance",
  "businessEmail",
  "backupsSecurity",
  "automation",
];

export const IT_SERVICE_CANONICAL_KEYS: CanonicalRouteKey[] = ["itServices", ...IT_SERVICE_ROUTE_KEYS];

export const itServicesCopy: Record<SiteLanguage, Record<ItServiceRouteKey, ItServiceContent>> = {
  sl: {
    itSupport: {
      routeKey: "itSupport",
      navLabel: "IT-podpora za mala podjetja",
      title: "IT-podpora za mala podjetja",
      shortDescription: "Zanesljiva pomoč pri vsakodnevnih težavah z napravami, uporabniki, programsko opremo in ponudniki.",
      intro:
        "Mala podjetja pogosto nimajo lastnega IT-oddelka, vendar vseeno potrebujejo hiter in razumljiv odziv. Prevzamemo oddaljeno ali dogovorjeno pomoč, ureditev uporabnikov in naprav ter koordinacijo z zunanjimi ponudniki.",
      benefits: [
        "Manj prekinitev dela zaradi tehničnih težav",
        "Ena kontaktna točka za različne IT-zahteve",
        "Bolj urejeni dostopi, naprave in uporabniški računi",
      ],
      deliverables: [
        "Oddaljena diagnostika in odpravljanje težav",
        "Nastavitev računalnikov, tiskalnikov in poslovnih aplikacij",
        "Ustvarjanje, spreminjanje in ukinjanje uporabniških dostopov",
        "Pomoč pri Microsoft 365, Google Workspace in drugih orodjih",
        "Koordinacija z internetnimi, gostiteljskimi in programskimi ponudniki",
        "Osnovna dokumentacija IT-okolja in priporočila za izboljšave",
      ],
      process: [
        { title: "Pregled potreb", body: "Spoznamo vaše naprave, uporabnike, programe in najpogostejše težave." },
        { title: "Dogovor o podpori", body: "Določimo način sodelovanja, prioritete in kanale za prijavo zahtev." },
        { title: "Reševanje in izboljšave", body: "Odpravljamo težave ter sproti zmanjšujemo vzroke za njihovo ponavljanje." },
      ],
      outcomes: [
        { title: "Manj zastojev", body: "Težave se rešujejo hitreje in z manj prelaganja med ponudniki." },
        { title: "Več nadzora", body: "Veste, kdo ima dostop do katerih naprav, računov in podatkov." },
        { title: "Predvidljiva pomoč", body: "Izberete pomoč po potrebi ali redno mesečno sodelovanje." },
      ],
      faq: [
        { question: "Ali je podpora lahko oddaljena?", answer: "Da. Večino težav lahko rešimo oddaljeno, za posege na lokaciji pa se dogovorimo glede na kraj in obseg dela." },
        { question: "Ali podpirate podjetja brez lastnega IT-oddelka?", answer: "Da. Storitev je namenjena predvsem malim podjetjem, ki potrebujejo zunanjo kontaktno točko za vsakodnevne IT-zadeve." },
        { question: "Ali je mogoče skleniti mesečno podporo?", answer: "Da. Sodelovanje je lahko po urah, po posameznem projektu ali v obliki dogovorjenega mesečnega obsega podpore." },
      ],
      related: ["businessEmail", "backupsSecurity"],
    },
    websiteDesign: {
      routeKey: "websiteDesign",
      navLabel: "Izdelava in prenova spletnih strani",
      title: "Izdelava in prenova spletnih strani",
      shortDescription: "Hitre, pregledne in merljive spletne strani, ki podpirajo povpraševanja, prodajo in naročanje.",
      intro:
        "Spletno stran načrtujemo kot poslovno orodje, ne le kot vizualno predstavitev. Poskrbimo za jasno strukturo, mobilno uporabo, osnovno tehnično SEO-pripravo, analitiko ter povezave z obrazci, rezervacijami in drugimi sistemi.",
      benefits: [
        "Jasnejša predstavitev ponudbe in boljša uporabniška izkušnja",
        "Več možnosti za kakovostna povpraševanja in konverzije",
        "Tehnično urejena osnova za SEO, hitrost in nadaljnjo rast",
      ],
      deliverables: [
        "Načrt strukture, vsebine in uporabniških poti",
        "Sodoben odziven dizajn za mobilne in namizne naprave",
        "Izdelava nove strani ali prenova obstoječe",
        "Osnovna tehnična SEO-priprava, metapodatki in indeksiranje",
        "Povezava analitike, obrazcev, koledarjev ali rezervacij",
        "Objava, migracija, preusmeritve in osnovno usposabljanje",
      ],
      process: [
        { title: "Cilji in vsebina", body: "Opredelimo ciljne skupine, ključne storitve, konverzije in potrebne vsebine." },
        { title: "Oblikovanje in izdelava", body: "Pripravimo strukturo, obliko in funkcionalnosti ter jih uskladimo z vami." },
        { title: "Objava in merjenje", body: "Stran tehnično preverimo, objavimo in uredimo osnovno spremljanje rezultatov." },
      ],
      outcomes: [
        { title: "Bolj jasna ponudba", body: "Obiskovalec hitreje razume, kaj ponujate in kateri je naslednji korak." },
        { title: "Več konverzij", body: "Obrazci, klici, e-pošta in rezervacije so vključeni v premišljeno pot uporabnika." },
        { title: "Lažje vzdrževanje", body: "Stran je pripravljena za redne posodobitve in nadaljnje vsebinske izboljšave." },
      ],
      faq: [
        { question: "Ali lahko prenovite obstoječo spletno stran?", answer: "Da. Najprej pregledamo obstoječo vsebino, tehnologijo, SEO-tveganja in možnosti, nato predlagamo prenovo ali postopne izboljšave." },
        { question: "Ali vključite analitiko in Search Console?", answer: "Da. Po dogovoru uredimo tehnično povezavo merjenja, ključne dogodke in osnovno pripravo za Google Search Console." },
        { question: "Ali lahko spletno stran povežete s Calendro?", answer: "Da. Calendra vtičnik ali javno povezavo za naročanje lahko vključimo kot eno od funkcionalnosti, vendar je izdelava spletne strani ločena IT-storitev." },
      ],
      related: ["websiteMaintenance", "automation"],
    },
    websiteMaintenance: {
      routeKey: "websiteMaintenance",
      navLabel: "Vzdrževanje spletnih strani",
      title: "Vzdrževanje spletnih strani",
      shortDescription: "Posodobitve, varnost, varnostne kopije, spremljanje delovanja in manjše vsebinske spremembe.",
      intro:
        "Spletna stran po objavi potrebuje redne posodobitve, nadzor in preverjanje. Prevzamemo tehnično vzdrževanje, varnostne kopije, spremljanje dosegljivosti, odpravljanje napak ter dogovorjene vsebinske spremembe.",
      benefits: [
        "Manj varnostnih in tehničnih tveganj",
        "Hitrejše odpravljanje napak in težav po posodobitvah",
        "Redno posodobljena vsebina in bolj stabilno delovanje",
      ],
      deliverables: [
        "Posodobitve sistema, vtičnikov in odvisnosti",
        "Redne varnostne kopije in dogovorjeno preverjanje obnovitve",
        "Spremljanje dosegljivosti in ključnih napak",
        "Odpravljanje tehničnih težav in manjših napak",
        "Optimizacija hitrosti in osnovnih Core Web Vitals težav",
        "Dogovorjene vsebinske spremembe in mesečno poročilo",
      ],
      process: [
        { title: "Začetni pregled", body: "Pregledamo tehnologijo, gostovanje, posodobitve, varnostne kopije in odprte težave." },
        { title: "Načrt vzdrževanja", body: "Določimo pogostost pregledov, vključene naloge in odzivni način." },
        { title: "Redno spremljanje", body: "Izvajamo dogovorjene posodobitve, nadzor in izboljšave ter vas obveščamo o pomembnih ugotovitvah." },
      ],
      outcomes: [
        { title: "Stabilnejša stran", body: "Redne posodobitve zmanjšujejo možnost nepričakovanih izpadov in konfliktov." },
        { title: "Boljša varnost", body: "Zmanjšamo tveganja zastarelih komponent, šibkih dostopov in neurejenih kopij." },
        { title: "Manj skrbi", body: "Tehnične naloge so načrtovane in imajo jasno odgovorno osebo." },
      ],
      faq: [
        { question: "Ali vzdržujete tudi strani, ki jih niste izdelali?", answer: "Da, če je tehnologija podprta in po začetnem pregledu lahko varno prevzamemo odgovornost za vzdrževanje." },
        { question: "Ali vzdrževanje vključuje vsebinske spremembe?", answer: "Lahko. Obseg manjših vsebinskih sprememb določimo v ponudbi ali mesečnem paketu." },
        { question: "Ali preverjate obnovitev varnostnih kopij?", answer: "Po dogovoru vključimo tudi testiranje obnovitve, saj sama izdelava kopije še ne zagotavlja, da je obnovitev izvedljiva." },
      ],
      related: ["websiteDesign", "backupsSecurity"],
    },
    businessEmail: {
      routeKey: "businessEmail",
      navLabel: "Poslovna e-pošta",
      title: "Poslovna e-pošta za mala podjetja",
      shortDescription: "Nastavitev domen, predalov, migracij, skupnih naslovov, koledarjev in varnejšega dostopa.",
      intro:
        "Uredimo poslovno e-pošto na vaši domeni ter pomagamo izbrati in nastaviti primerno rešitev, kot sta Microsoft 365 ali Google Workspace. Poskrbimo za migracijo, uporabnike, skupne naslove, koledarje in osnovno zaščito računov.",
      benefits: [
        "Profesionalni naslovi na lastni domeni",
        "Bolj urejeno sodelovanje, koledarji in skupni predali",
        "Manj težav z dostavo pošte in izgubljenimi dostopi",
      ],
      deliverables: [
        "Izbira ustrezne e-poštne in oblačne rešitve",
        "Nastavitev domene, DNS-zapisov in e-poštnih predalov",
        "Migracija obstoječe pošte, kontaktov in koledarjev",
        "Skupni naslovi, skupine, aliasi in koledarji",
        "Večfaktorska prijava in osnovne varnostne nastavitve",
        "Navodila za uporabnike in nadaljnja administracija",
      ],
      process: [
        { title: "Pregled obstoječega stanja", body: "Preverimo domeno, predale, količino podatkov, naprave in posebne potrebe." },
        { title: "Priprava in migracija", body: "Nastavimo novo okolje ter izvedemo prehod z načrtom za čim manj motenj." },
        { title: "Predaja in podpora", body: "Uporabnike povežemo, preverimo dostavo in uredimo osnovna navodila ter podporo." },
      ],
      outcomes: [
        { title: "Profesionalen nastop", body: "Vsak uporabnik komunicira z naslovom na poslovni domeni." },
        { title: "Varnejši dostop", body: "Račune zaščitimo z večfaktorsko prijavo in urejenim upravljanjem uporabnikov." },
        { title: "Lažje sodelovanje", body: "Skupni predali in koledarji zmanjšajo podvajanje in izgubo informacij." },
      ],
      faq: [
        { question: "Ali pomagate pri izbiri med Microsoft 365 in Google Workspace?", answer: "Da. Priporočilo pripravimo glede na obstoječa orodja, način dela, število uporabnikov in želene funkcionalnosti." },
        { question: "Ali je mogoče prenesti staro pošto?", answer: "V večini primerov da. Pred migracijo preverimo izvorni sistem, količino podatkov in omejitve, nato pripravimo načrt prenosa." },
        { question: "Ali urejate tudi SPF, DKIM in DMARC?", answer: "Da. Uredimo ključne DNS-zapise za boljšo dostavljivost in zaščito domene, obseg pa prilagodimo izbrani platformi." },
      ],
      related: ["itSupport", "backupsSecurity"],
    },
    backupsSecurity: {
      routeKey: "backupsSecurity",
      navLabel: "Varnostne kopije in osnovna IT-varnost",
      title: "Varnostne kopije in osnovna IT-varnost",
      shortDescription: "Praktični ukrepi za zaščito računov, naprav, spletnih strani in ključnih poslovnih podatkov.",
      intro:
        "Osnovna IT-varnost se začne z urejenimi dostopi, posodobitvami, večfaktorsko prijavo in obnovljivimi varnostnimi kopijami. Pregledamo najpomembnejša tveganja ter uvedemo ukrepe, ki so razumni za velikost in način dela vašega podjetja.",
      benefits: [
        "Manjša verjetnost izgube podatkov in prevzema računov",
        "Jasnejši dostopi in odgovornosti uporabnikov",
        "Boljša pripravljenost na napako, krajo naprave ali incident",
      ],
      deliverables: [
        "Pregled ključnih računov, naprav, podatkov in dostopov",
        "Vzpostavitev večfaktorske prijave in osnovnih pravil dostopa",
        "Načrt varnostnih kopij za naprave, oblak ali spletno stran",
        "Preverjanje, ali je kopije mogoče dejansko obnoviti",
        "Osnovne posodobitve, zaščita naprav in priporočila za gesla",
        "Kratka navodila za zaposlene in postopek ob incidentu",
      ],
      process: [
        { title: "Pregled tveganj", body: "Določimo najpomembnejše sisteme, podatke, dostope in možne posledice izpada." },
        { title: "Prednostni ukrepi", body: "Najprej uredimo ukrepe z največjim učinkom: MFA, kopije, posodobitve in dostopi." },
        { title: "Preverjanje", body: "Preverimo delovanje kopij in redno pregledamo ključne nastavitve." },
      ],
      outcomes: [
        { title: "Obnovljivi podatki", body: "Varnostne kopije so načrtovane glede na pomembnost podatkov in čas obnove." },
        { title: "Manj zlorab računov", body: "MFA in urejeni dostopi zmanjšajo tveganje ob kraji ali ugibanju gesla." },
        { title: "Jasnejši odziv", body: "Ob težavi veste, koga obvestiti in katere korake izvesti najprej." },
      ],
      faq: [
        { question: "Ali je dovolj, da podatke shranjujemo v oblaku?", answer: "Sinhronizacija v oblaku ni vedno enaka neodvisni varnostni kopiji. Preveriti je treba brisanje, verzije, obnovitev in ločenost kopij." },
        { question: "Ali izvajate penetracijske teste?", answer: "Ta storitev je namenjena osnovni varnostni ureditvi malih podjetij. Za specializirane teste po potrebi vključimo ustreznega zunanjega strokovnjaka." },
        { question: "Ali lahko preverite obstoječe varnostne kopije?", answer: "Da. Pregledamo, kaj se kopira, kam, kako pogosto in ali je mogoče podatke v dogovorjenem času obnoviti." },
      ],
      related: ["itSupport", "websiteMaintenance"],
    },
    automation: {
      routeKey: "automation",
      navLabel: "Avtomatizacije in povezovanje poslovnih sistemov",
      title: "Avtomatizacije in povezovanje poslovnih sistemov",
      shortDescription: "Povezovanje obrazcev, e-pošte, koledarjev, CRM-jev, računovodstva in drugih orodij.",
      intro:
        "Kadar zaposleni iste podatke prepisujejo med več sistemi ali ročno izvajajo ponavljajoče korake, lahko proces pogosto poenostavimo. Pregledamo tok podatkov, izberemo primerno integracijo ali avtomatizacijo ter poskrbimo za nadzor napak.",
      benefits: [
        "Manj ročnega prepisovanja in administracije",
        "Manj napak zaradi podvajanja podatkov",
        "Hitrejši pretok informacij med zaposlenimi in sistemi",
      ],
      deliverables: [
        "Pregled procesa in točk, kjer se delo ponavlja",
        "Povezovanje prek API-jev, spletnih kavljev ali avtomatizacijskih orodij",
        "Avtomatski prenosi podatkov med obrazci, CRM-jem in e-pošto",
        "Povezovanje koledarjev, rezervacij, plačil ali računovodskih tokov",
        "Obvestila, potrditve in naloge ob pomembnih dogodkih",
        "Dnevniki, nadzor napak, dokumentacija in predaja rešitve",
      ],
      process: [
        { title: "Popis procesa", body: "Narišemo trenutni potek, vhodne podatke, odgovorne osebe in ponavljajoče naloge." },
        { title: "Prototip povezave", body: "Najprej preverimo izvedljivost in podatkovni tok na omejenem primeru." },
        { title: "Uvedba in nadzor", body: "Rešitev objavimo, dokumentiramo ter uredimo opozorila ob napakah ali prekinitvah." },
      ],
      outcomes: [
        { title: "Prihranek časa", body: "Ponavljajoči koraki se izvajajo samodejno ali z manj ročnimi posegi." },
        { title: "Boljši podatki", body: "Zmanjšamo podvajanje, izpuščene vnose in neusklajene različice informacij." },
        { title: "Merljiv proces", body: "Avtomatizacija ima jasne sprožilce, rezultate in nadzor nad napakami." },
      ],
      faq: [
        { question: "Katere sisteme lahko povežete?", answer: "Možnosti so odvisne od API-jev, izvozov in dovoljenj posameznega sistema. Po kratkem tehničnem pregledu potrdimo izvedljivost in predlagamo najbolj varno rešitev." },
        { question: "Ali uporabljate Make, n8n ali podobna orodja?", answer: "Da, kadar so primerna. Pri zahtevnejših ali občutljivejših povezavah lahko uporabimo neposreden API ali rešitev po meri." },
        { question: "Kako se spremljajo napake?", answer: "Vključimo dnevnike, obvestila in dogovorjen postopek za obravnavo neuspelih prenosov ali sprememb v povezanih sistemih." },
      ],
      related: ["websiteDesign", "businessEmail"],
    },
  },
  en: {
    itSupport: {
      routeKey: "itSupport",
      navLabel: "Small-business IT support",
      title: "IT support for small businesses",
      shortDescription: "Reliable help with devices, users, software and coordination with technology providers.",
      intro:
        "Small businesses may not need an internal IT department, but they still need clear and dependable support. We provide remote or agreed on-site help, user and device administration, troubleshooting and coordination with external suppliers.",
      benefits: ["Fewer interruptions caused by technical issues", "One contact for different IT requests", "Better organised devices, accounts and access"],
      deliverables: [
        "Remote diagnosis and troubleshooting",
        "Computer, printer and business software setup",
        "User onboarding, access changes and offboarding",
        "Help with Microsoft 365, Google Workspace and other tools",
        "Coordination with internet, hosting and software providers",
        "Basic IT-environment documentation and improvement recommendations",
      ],
      process: [
        { title: "Needs review", body: "We learn about your devices, users, applications and recurring problems." },
        { title: "Support agreement", body: "We define the cooperation model, priorities and request channels." },
        { title: "Resolution and improvement", body: "We solve incidents and reduce the causes behind recurring issues." },
      ],
      outcomes: [
        { title: "Less downtime", body: "Problems are resolved faster with less hand-off between suppliers." },
        { title: "Better control", body: "You know who has access to devices, accounts and business data." },
        { title: "Predictable support", body: "Choose ad-hoc help, a project or an agreed monthly support scope." },
      ],
      faq: [
        { question: "Can support be provided remotely?", answer: "Yes. Most issues can be handled remotely. On-site work can be agreed depending on location and scope." },
        { question: "Do you support companies without an IT department?", answer: "Yes. The service is designed primarily for small businesses that need an external contact for everyday IT matters." },
        { question: "Is monthly support available?", answer: "Yes. Work can be billed by the hour, as a project or through an agreed monthly support allowance." },
      ],
      related: ["businessEmail", "backupsSecurity"],
    },
    websiteDesign: {
      routeKey: "websiteDesign",
      navLabel: "Website design and redesign",
      title: "Website design and redesign",
      shortDescription: "Fast, clear and measurable websites that support enquiries, sales and online booking.",
      intro:
        "We plan a website as a business tool, not only as a visual presentation. The work can include content structure, responsive design, technical SEO foundations, analytics and connections to forms, booking and other systems.",
      benefits: ["Clearer positioning and a better user experience", "More opportunities for qualified enquiries and conversions", "A sound foundation for SEO, speed and future growth"],
      deliverables: [
        "Site structure, content and user-journey planning",
        "Responsive design for mobile and desktop",
        "New website development or redesign",
        "Technical SEO foundations, metadata and indexing setup",
        "Analytics, forms, calendar or booking integrations",
        "Launch, migration, redirects and basic training",
      ],
      process: [
        { title: "Goals and content", body: "We define audiences, key services, conversions and required content." },
        { title: "Design and development", body: "We prepare the structure, design and functionality and review them with you." },
        { title: "Launch and measurement", body: "We complete technical checks, publish the site and set up essential measurement." },
      ],
      outcomes: [
        { title: "A clearer offer", body: "Visitors understand what you provide and what to do next." },
        { title: "More conversions", body: "Forms, calls, email and bookings are part of a deliberate user journey." },
        { title: "Easier maintenance", body: "The site is ready for regular updates and content improvements." },
      ],
      faq: [
        { question: "Can you redesign an existing website?", answer: "Yes. We review the existing content, technology, SEO risks and options before recommending a redesign or phased improvements." },
        { question: "Do you include analytics and Search Console?", answer: "Yes, when included in scope. We can connect measurement, key events and the technical foundation for Google Search Console." },
        { question: "Can you connect the website to Calendra?", answer: "Yes. The Calendra widget or public booking link can be included, while website development remains a separate IT service." },
      ],
      related: ["websiteMaintenance", "automation"],
    },
    websiteMaintenance: {
      routeKey: "websiteMaintenance",
      navLabel: "Website maintenance",
      title: "Website maintenance",
      shortDescription: "Updates, security, backups, availability monitoring and agreed content changes.",
      intro:
        "A website needs regular updates, monitoring and checks after launch. We can manage technical maintenance, backups, uptime monitoring, troubleshooting and agreed content changes.",
      benefits: ["Lower security and technical risk", "Faster resolution after updates or incidents", "More stable operation and up-to-date content"],
      deliverables: [
        "System, plugin and dependency updates",
        "Regular backups and agreed restore checks",
        "Uptime and critical-error monitoring",
        "Technical troubleshooting and minor fixes",
        "Performance and basic Core Web Vitals improvements",
        "Agreed content updates and a monthly summary",
      ],
      process: [
        { title: "Initial review", body: "We review the technology, hosting, updates, backups and open issues." },
        { title: "Maintenance plan", body: "We define review frequency, included tasks and response arrangements." },
        { title: "Ongoing monitoring", body: "We carry out updates, checks and improvements and report important findings." },
      ],
      outcomes: [
        { title: "A more stable site", body: "Regular updates reduce the chance of conflicts and unexpected downtime." },
        { title: "Better security", body: "We reduce risks from outdated components, weak access and unmanaged backups." },
        { title: "Less worry", body: "Technical work is planned and has a clear owner." },
      ],
      faq: [
        { question: "Do you maintain websites you did not build?", answer: "Yes, when the technology is supported and an initial review confirms that we can take over maintenance safely." },
        { question: "Can maintenance include content changes?", answer: "Yes. The allowance for smaller content changes can be defined in the proposal or monthly plan." },
        { question: "Do you test backup restoration?", answer: "It can be included. A backup alone does not prove that the site or data can be restored successfully." },
      ],
      related: ["websiteDesign", "backupsSecurity"],
    },
    businessEmail: {
      routeKey: "businessEmail",
      navLabel: "Business email",
      title: "Business email for small companies",
      shortDescription: "Domain, mailbox, migration, shared-address, calendar and secure-access setup.",
      intro:
        "We set up business email on your domain and help select an appropriate service such as Microsoft 365 or Google Workspace. The work can include migration, users, shared mailboxes, calendars and essential account protection.",
      benefits: ["Professional addresses on your own domain", "Better organised collaboration, calendars and shared mailboxes", "Fewer delivery and account-access problems"],
      deliverables: [
        "Selection of an appropriate email and cloud solution",
        "Domain, DNS and mailbox configuration",
        "Migration of existing email, contacts and calendars",
        "Shared addresses, groups, aliases and calendars",
        "Multi-factor authentication and essential security settings",
        "User instructions and ongoing administration",
      ],
      process: [
        { title: "Current-state review", body: "We review the domain, mailboxes, data volume, devices and special requirements." },
        { title: "Preparation and migration", body: "We configure the new environment and plan a transition with minimal interruption." },
        { title: "Handover and support", body: "We connect users, verify delivery and provide essential guidance and support." },
      ],
      outcomes: [
        { title: "Professional communication", body: "Every user communicates using an address on the company domain." },
        { title: "Safer access", body: "Accounts are protected with MFA and organised user administration." },
        { title: "Easier teamwork", body: "Shared mailboxes and calendars reduce duplication and lost information." },
      ],
      faq: [
        { question: "Can you help choose between Microsoft 365 and Google Workspace?", answer: "Yes. We base the recommendation on your existing tools, working style, user count and required functionality." },
        { question: "Can existing email be migrated?", answer: "Usually, yes. We first review the source system, data volume and limitations and then prepare a migration plan." },
        { question: "Do you configure SPF, DKIM and DMARC?", answer: "Yes. We can configure the core DNS records for delivery and domain protection, adjusted to the selected platform." },
      ],
      related: ["itSupport", "backupsSecurity"],
    },
    backupsSecurity: {
      routeKey: "backupsSecurity",
      navLabel: "Backups and essential IT security",
      title: "Backups and essential IT security",
      shortDescription: "Practical protection for accounts, devices, websites and essential business data.",
      intro:
        "Essential security begins with organised access, updates, multi-factor authentication and restorable backups. We identify the most important risks and implement controls appropriate for the size and working style of your company.",
      benefits: ["Lower risk of data loss and account takeover", "Clearer user access and responsibilities", "Better preparation for failure, theft or an incident"],
      deliverables: [
        "Review of important accounts, devices, data and access",
        "Multi-factor authentication and essential access policies",
        "Backup plan for devices, cloud data or websites",
        "Checks that backups can actually be restored",
        "Essential updates, device protection and password guidance",
        "Short staff guidance and an incident-response checklist",
      ],
      process: [
        { title: "Risk review", body: "We identify critical systems, data, access and the likely impact of disruption." },
        { title: "Priority controls", body: "We first implement high-impact measures such as MFA, backups, updates and access cleanup." },
        { title: "Verification", body: "We check restoration and periodically review important settings." },
      ],
      outcomes: [
        { title: "Restorable data", body: "Backups are designed around data importance and required recovery time." },
        { title: "Fewer account compromises", body: "MFA and organised access reduce the impact of a stolen or guessed password." },
        { title: "A clearer response", body: "You know who to contact and which steps to take first when something happens." },
      ],
      faq: [
        { question: "Is cloud storage itself a backup?", answer: "Cloud synchronisation is not always an independent backup. Deletion, versions, recovery and separation must be reviewed." },
        { question: "Do you provide penetration testing?", answer: "This service focuses on essential security for small businesses. When specialised testing is needed, we can involve an appropriate external specialist." },
        { question: "Can you review existing backups?", answer: "Yes. We review what is copied, where, how often and whether the data can be restored within the required time." },
      ],
      related: ["itSupport", "websiteMaintenance"],
    },
    automation: {
      routeKey: "automation",
      navLabel: "Business automation and system integration",
      title: "Business automation and system integration",
      shortDescription: "Connecting forms, email, calendars, CRM, accounting and other business tools.",
      intro:
        "When employees repeatedly copy the same data between systems or perform recurring manual steps, the process can often be simplified. We review the data flow, select an appropriate integration or automation and include error monitoring.",
      benefits: ["Less repetitive administration and data entry", "Fewer errors caused by duplicate information", "Faster movement of information between people and systems"],
      deliverables: [
        "Process review and identification of repetitive work",
        "Connections through APIs, webhooks or automation platforms",
        "Automated data transfer between forms, CRM and email",
        "Calendar, booking, payment or accounting-flow integrations",
        "Notifications, confirmations and tasks triggered by important events",
        "Logs, error monitoring, documentation and handover",
      ],
      process: [
        { title: "Process mapping", body: "We map the current flow, input data, owners and recurring steps." },
        { title: "Connection prototype", body: "We test feasibility and the data flow on a limited example first." },
        { title: "Release and monitoring", body: "We publish and document the solution and configure alerts for failures or changes." },
      ],
      outcomes: [
        { title: "Time savings", body: "Repetitive steps run automatically or require fewer manual actions." },
        { title: "Better data", body: "We reduce duplication, missing entries and inconsistent versions of information." },
        { title: "A measurable process", body: "The automation has defined triggers, outcomes and error monitoring." },
      ],
      faq: [
        { question: "Which systems can you connect?", answer: "It depends on each system's APIs, exports and permissions. After a short technical review, we confirm feasibility and propose the safest approach." },
        { question: "Do you use Make, n8n or similar tools?", answer: "Yes, where appropriate. More complex or sensitive integrations may use a direct API or custom solution." },
        { question: "How are errors monitored?", answer: "We include logs, alerts and an agreed process for failed transfers or changes in connected systems." },
      ],
      related: ["websiteDesign", "businessEmail"],
    },
  },
};

export const getItServiceContent = (routeKey: ItServiceRouteKey, language: SiteLanguage) =>
  itServicesCopy[language][routeKey];

export const isItServiceRouteKey = (value: CanonicalRouteKey | undefined): value is ItServiceRouteKey =>
  Boolean(value && IT_SERVICE_ROUTE_KEYS.includes(value as ItServiceRouteKey));
