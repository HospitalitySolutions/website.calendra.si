import type { CanonicalRouteKey } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";

export type LegacyIndustryRouteKey = Extract<
  CanonicalRouteKey,
  "beautyHair" | "consultantsEducators" | "healthWellbeing" | "fitnessGroups"
>;

export type BusinessTypeIndustryRouteKey = Extract<
  CanonicalRouteKey,
  | "hairSalons"
  | "beautySalons"
  | "massage"
  | "spaSauna"
  | "tattooPiercing"
  | "fitnessPersonalTraining"
  | "physiotherapy"
  | "psychologyCounselling"
  | "yogaPilates"
  | "petServices"
  | "educationCoaching"
  | "otherServices"
>;

export type IndustryRouteKey = LegacyIndustryRouteKey | BusinessTypeIndustryRouteKey;

/** Broad solution hubs retained for navigation and existing indexed URLs. */
export const INDUSTRY_ROUTE_KEYS: LegacyIndustryRouteKey[] = [
  "beautyHair",
  "consultantsEducators",
  "healthWellbeing",
  "fitnessGroups",
];

/** One destination page for every business-type card shown on the homepage. */
export const BUSINESS_TYPE_ROUTE_KEYS: BusinessTypeIndustryRouteKey[] = [
  "hairSalons",
  "beautySalons",
  "massage",
  "spaSauna",
  "tattooPiercing",
  "fitnessPersonalTraining",
  "physiotherapy",
  "psychologyCounselling",
  "yogaPilates",
  "petServices",
  "educationCoaching",
  "otherServices",
];

export const ALL_INDUSTRY_ROUTE_KEYS: IndustryRouteKey[] = [...INDUSTRY_ROUTE_KEYS, ...BUSINESS_TYPE_ROUTE_KEYS];

type IndustryFeature = {
  title: string;
  description: string;
};

export type IndustryContent = {
  navLabel: string;
  cardCta: string;
  eyebrow: string;
  title: string;
  intro: string;
  heroPoints: string[];
  problemsEyebrow: string;
  problemsTitle: string;
  problemsIntro: string;
  problems: IndustryFeature[];
  featuresEyebrow: string;
  featuresTitle: string;
  featuresIntro: string;
  features: IndustryFeature[];
  workflowEyebrow: string;
  workflowTitle: string;
  workflow: string[];
  screenshotEyebrow: string;
  screenshotTitle: string;
  screenshotDescription: string;
  audienceEyebrow: string;
  audienceTitle: string;
  audiences: string[];
  faqEyebrow: string;
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalDescription: string;
};

const legacyContent: Record<LegacyIndustryRouteKey, Record<SiteLanguage, IndustryContent>> = {
  beautyHair: {
    sl: {
      navLabel: "Lepotni in frizerski saloni",
      cardCta: "Rešitve za salone",
      eyebrow: "Pregled rešitev za lepotne dejavnosti",
      title: "Calendra za lepotne in frizerske dejavnosti",
      intro: "Ta stran je pregled rešitev Calendra za frizerske, kozmetične in druge lepotne dejavnosti. Povezuje ključne možnosti za naročanje, urnike, prostore, opomnike, plačila in račune ter vas usmeri na podrobnejšo rešitev za posamezen tip salona.",
      heroPoints: ["Koledar po zaposlenih, storitvah, lokacijah in prostorih", "Spletno naročanje za frizerske, kozmetične in druge lepotne storitve", "Opomniki, plačila, računi, paketi in ugodnosti na istem profilu stranke"],
      problemsEyebrow: "Vsakdan v salonu",
      problemsTitle: "Manj usklajevanja, več časa za stranke",
      problemsIntro: "Calendra poveže rezervacije, urnike in podatke o strankah, da se vaša ekipa lahko osredotoči na izvedbo storitev.",
      problems: [
        { title: "Telefonsko naročanje", description: "Stranke lahko prost termin izberejo tudi takrat, ko se ne morete oglasiti na telefon." },
        { title: "Prekrivanje zaposlenih in prostorov", description: "Razpoložljivost zaposlenih, kabin, stolov in opreme je vidna v enem koledarju." },
        { title: "Odpovedi v zadnjem trenutku", description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume." },
        { title: "Razpršene evidence", description: "Storitve, obiski, opombe, plačila in računi ostanejo povezani s profilom stranke." },
      ],
      featuresEyebrow: "Funkcionalnosti za salone",
      featuresTitle: "Vse, kar potrebujete za urejen urnik salona",
      featuresIntro: "Izpostavite samo funkcionalnosti, ki jih vaša ekipa res uporablja, in jih prilagodite svojemu načinu dela.",
      features: [
        { title: "Koledar po zaposlenih", description: "Preglejte dnevni, tedenski ali delovni teden za posameznika ali celotno ekipo." },
        { title: "Storitve z različnim trajanjem", description: "Striženje, barvanje, depilacija ali nega imajo lahko svojo ceno, trajanje, pripravljalni čas in nabor izvajalcev." },
        { title: "Prostori in oprema", description: "Pri rezervaciji upoštevajte kabine, stole, naprave ali druge omejene vire." },
        { title: "Spletno naročanje", description: "Dodajte javno povezavo ali rezervacijski vtičnik na svojo spletno stran." },
        { title: "Opomniki in spremembe", description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje in odpoved." },
        { title: "Plačila, računi in ugodnosti", description: "Po obisku povežite storitev s plačilom in računom, pri rednih strankah pa uporabite pakete, članstva, bone ali druge ugodnosti." },
      ],
      workflowEyebrow: "Od izbire do obiska",
      workflowTitle: "Kako poteka naročanje v salonu",
      workflow: ["Stranka izbere storitev, na primer striženje, barvanje, depilacijo ali nego.", "Izbere zaposlenega ali prvi prost termin.", "Calendra preveri delovni čas, odsotnosti ter razpoložljivost prostora in ekipe.", "Stranka prejme potrditev in opomnik ter po potrebi sama spremeni ali odpove termin.", "Po obisku se storitve obračunajo, račun in zgodovina pa ostanejo povezani s profilom stranke."],
      screenshotEyebrow: "Pregled za celotno ekipo",
      screenshotTitle: "Vsi termini salona v enem koledarju",
      screenshotDescription: "Zaposleni hitro vidijo, kdo prihaja, katera storitev je rezervirana in kateri prostor ali oprema sta potrebna. Barve storitev in različni pogledi pomagajo ohraniti pregled tudi v najbolj zasedenih dneh.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za samostojne izvajalce in salone z več zaposlenimi",
      audiences: ["Frizerski saloni", "Kozmetični saloni", "Depilacijski saloni", "Nohtni studii", "Barber shopi", "Masažni saloni", "Lepotni centri", "Saloni z več lokacijami"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra v lepotnem in frizerskem salonu",
      faq: [
        { question: "Ali lahko stranka sama izbere zaposlenega?", answer: "Da. Pri posamezni storitvi določite, kateri zaposleni jo izvajajo, stranki pa lahko omogočite izbiro zaposlenega ali prvega prostega termina." },
        { question: "Ali lahko nastavim različno trajanje in ceno storitev?", answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, pripravljalni čas, barvo in pravila rezervacije." },
        { question: "Ali lahko isti prostor uporablja več zaposlenih?", answer: "Da. Calendra pri rezervaciji preveri razpoložljivost prostora ali opreme in s tem prepreči prekrivanje." },
        { question: "Ali lahko stranke termin prestavijo ali odpovejo same?", answer: "Da. V potrditvena sporočila lahko vključite varne povezave za prestavljanje in odpoved, pri čemer sami določite časovne omejitve." },
        { question: "Ali Calendra podpira več lokacij?", answer: "Da. Storitve, zaposlene, prostore in termine lahko organizirate glede na posamezne lokacije podjetja." },
      ],
      finalTitle: "Začnite z bolj preglednim upravljanjem terminov v salonu",
      finalDescription: "Preizkusite Calendro 14 dni brez kreditne kartice in nastavite urnik glede na svoje zaposlene, storitve in prostore.",
    },
    en: {
      navLabel: "Beauty and hair salons",
      cardCta: "Solutions for salons",
      eyebrow: "Solutions overview for beauty businesses",
      title: "Calendra for beauty and hair businesses",
      intro: "This page is an overview of Calendra solutions for hair, beauty and related service businesses. It brings together the main options for booking, schedules, rooms, reminders, payments and invoices and links to more specific solutions for each salon type.",
      heroPoints: ["Calendar by employee, service, location and room", "Online booking for hair, cosmetic and other beauty services", "Reminders, payments, invoices, packages and benefits on the same client profile"],
      problemsEyebrow: "Everyday salon work",
      problemsTitle: "Less coordination, more time for customers",
      problemsIntro: "Calendra connects bookings, schedules and customer information so your team can focus on delivering services.",
      problems: [
        { title: "Telephone booking", description: "Customers can choose an available appointment even when you cannot answer the phone." },
        { title: "Employee and room overlaps", description: "Availability of employees, treatment rooms, chairs and equipment is visible in one calendar." },
        { title: "Last-minute cancellations", description: "Confirmations, reminders and change or cancellation links reduce misunderstandings." },
        { title: "Scattered records", description: "Services, visits, notes, payments and invoices remain connected to the customer profile." },
      ],
      featuresEyebrow: "Features for salons",
      featuresTitle: "Everything you need for a well-organised salon schedule",
      featuresIntro: "Enable the features your team actually uses and adapt them to the way your salon works.",
      features: [
        { title: "Calendar by employee", description: "View daily, weekly or work-week schedules for one employee or the whole team." },
        { title: "Flexible service duration", description: "Haircuts, colouring, depilation or treatments can each have their own price, duration, preparation time and eligible employees." },
        { title: "Rooms and equipment", description: "Include treatment rooms, chairs, devices or other limited resources in availability checks." },
        { title: "Online booking", description: "Add a public booking link or place the booking widget on your website." },
        { title: "Reminders and changes", description: "Send email or SMS notifications and allow secure rescheduling and cancellation." },
        { title: "Payments, invoices and benefits", description: "Connect a completed service to its payment and invoice, then use packages, memberships, vouchers or other benefits for returning customers." },
      ],
      workflowEyebrow: "From selection to visit",
      workflowTitle: "How salon booking works",
      workflow: ["The customer chooses a service such as a haircut, colouring, depilation or treatment.", "They select an employee or the first available time.", "Calendra checks working hours, absences and the availability of the team and room.", "The customer receives a confirmation and reminder and can reschedule or cancel when allowed.", "After the visit, services are billed and the invoice and history stay connected to the client profile."],
      screenshotEyebrow: "A clear team overview",
      screenshotTitle: "Every salon appointment in one calendar",
      screenshotDescription: "Employees can quickly see who is arriving, which service is booked and which room or equipment is required. Service colours and multiple calendar views keep busy days easy to understand.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For independent professionals and multi-employee salons",
      audiences: ["Hair salons", "Beauty salons", "Depilation studios", "Nail studios", "Barber shops", "Massage salons", "Beauty centres", "Multi-location salons"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Using Calendra in a beauty or hair salon",
      faq: [
        { question: "Can customers choose an employee?", answer: "Yes. Choose which employees can deliver each service and let customers select an employee or the first available appointment." },
        { question: "Can I set different service durations and prices?", answer: "Yes. Each service can have its own duration, price, preparation time, colour and booking rules." },
        { question: "Can several employees share the same room?", answer: "Yes. Calendra checks the availability of rooms or equipment and prevents overlapping reservations." },
        { question: "Can customers reschedule or cancel by themselves?", answer: "Yes. Confirmation messages can contain secure rescheduling and cancellation links, with time limits controlled by you." },
        { question: "Does Calendra support multiple locations?", answer: "Yes. Services, employees, resources and appointments can be organised by business location." },
      ],
      finalTitle: "Start managing salon appointments more clearly",
      finalDescription: "Try Calendra free for 14 days without a credit card and configure the schedule around your employees, services and rooms.",
    },
  },
  consultantsEducators: {
    sl: {
      navLabel: "Svetovalci in izobraževalci",
      cardCta: "Rešitve za svetovanje in izobraževanje",
      eyebrow: "Pregled rešitev za svetovanje in izobraževanje",
      title: "Calendra za svetovanje, coaching in izobraževanje",
      intro: "Pregled rešitev Calendra za svetovalce, coache, mentorje in izobraževalce. Na enem mestu združuje individualne in skupinske termine, spletna srečanja, ponovitve, komunikacijo, pakete in plačila ter vas usmeri na podrobnejše rešitve po tipu dejavnosti.",
      heroPoints: ["Osebni, spletni in ponavljajoči se termini", "Povezava z Zoomom in Google Koledarjem", "Paketi srečanj, dokumenti in komunikacija"],
      problemsEyebrow: "Urejen potek sodelovanja",
      problemsTitle: "Manj usklajevanja terminov in manj razpršenih informacij",
      problemsIntro: "Od prve rezervacije do zadnjega srečanja ostanejo termini, sporočila in pomembni podatki povezani.",
      problems: [
        { title: "Dolgo iskanje prostega termina", description: "Stranka sama izbere termin znotraj razpoložljivosti, ki jo določite vi." },
        { title: "Osebni in spletni termini v različnih orodjih", description: "Lokacijo ali spletno povezavo vključite neposredno v rezervacijo in obvestila." },
        { title: "Ponavljajoča se srečanja", description: "Ustvarite serijo terminov in po potrebi uredite en termin ali vse naslednje." },
        { title: "Dokumenti in komunikacija po e-pošti", description: "Pomembne informacije, opombe in dokumenti ostanejo vezani na stranko in termin." },
      ],
      featuresEyebrow: "Funkcionalnosti za strokovno delo",
      featuresTitle: "Jasen sistem za individualna srečanja, skupine in izobraževanja",
      featuresIntro: "Calendra podpira preprost rezervacijski tok za posameznike ter bolj kompleksne urnike ekip in programov.",
      features: [
        { title: "Osebni in spletni termini", description: "Pri storitvi določite lokacijo, način izvedbe ali spletno povezavo." },
        { title: "Zoom integracija", description: "Za spletno srečanje ustvarite povezavo in jo samodejno vključite v obvestila." },
        { title: "Ponavljajoče se rezervacije", description: "Načrtujte redna srečanja brez ročnega ustvarjanja vsakega termina posebej." },
        { title: "Dokumenti in opombe", description: "Ohranite pomembne datoteke in interne informacije ob profilu stranke." },
        { title: "Paketi več srečanj", description: "Spremljajte porabo kupljenih obiskov, programov ali drugih ugodnosti." },
        { title: "Računi in plačila", description: "Povežite izvedeno srečanje z načinom plačila in izdajo računa." },
      ],
      workflowEyebrow: "Preprost proces",
      workflowTitle: "Od rezervacije do izvedenega srečanja",
      workflow: ["Stranka izbere vrsto srečanja.", "Izbere prost osebni ali spletni termin.", "Calendra pošlje potrditev in podatke za udeležbo.", "Pred srečanjem pošlje opomnik.", "Po izvedbi ostanejo dokumenti, plačilo in naslednji termin povezani."],
      screenshotEyebrow: "Pregled individualnega in skupinskega dela",
      screenshotTitle: "En koledar za osebna srečanja, spletne termine in programe",
      screenshotDescription: "V koledarju hitro ločite vrste srečanj, zaposlene, lokacije in ponavljajoče se termine. Tako je urnik razumljiv tudi takrat, ko izvajate več različnih programov hkrati.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za samostojne strokovnjake, ekipe in izvajalce programov",
      audiences: ["Poslovni svetovalci", "Coachi in mentorji", "Predavatelji", "Izvajalci delavnic", "Jezikovne šole", "Inštruktorji", "Izobraževalni centri", "Izvajalci individualnih programov"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za svetovanje in izobraževanje",
      faq: [
        { question: "Ali lahko vodim osebne in spletne termine?", answer: "Da. Pri posamezni storitvi ali terminu določite lokacijo, način izvedbe in spletno povezavo." },
        { question: "Ali se Calendra poveže z Zoomom?", answer: "Da. Zoom integracija lahko pripravi povezavo za spletno srečanje, ki jo nato vključite v sporočila udeležencem." },
        { question: "Ali lahko nastavim ponavljajoča se srečanja?", answer: "Da. Ustvarite serijo terminov ter pozneje spremenite en termin, celotno serijo ali vse prihodnje termine." },
        { question: "Ali lahko vodim skupinske delavnice?", answer: "Da. Nastavite skupinski termin, največje število udeležencev in pravila prijave oziroma odjave." },
        { question: "Ali lahko spremljam paket več srečanj?", answer: "Da. Paketi, vstopnice in druge ugodnosti omogočajo spremljanje preostalih obiskov ali pravic stranke." },
      ],
      finalTitle: "Uredite termine, komunikacijo in programe v enem sistemu",
      finalDescription: "Začnite s 14-dnevnim brezplačnim preizkusom in prilagodite Calendro svojemu načinu svetovanja ali izobraževanja.",
    },
    en: {
      navLabel: "Consultants and educators",
      cardCta: "Solutions for consulting and education",
      eyebrow: "Solutions overview for consulting and education",
      title: "Calendra for consulting, coaching and education",
      intro: "An overview of Calendra solutions for consultants, coaches, mentors and educators. It brings together individual and group appointments, online meetings, recurrence, communication, packages and payments and points to more specific solutions by business type.",
      heroPoints: ["In-person, online and recurring appointments", "Zoom and Google Calendar integrations", "Meeting packages, documents and communication"],
      problemsEyebrow: "An organised client journey",
      problemsTitle: "Less appointment coordination and fewer scattered records",
      problemsIntro: "From the first booking to the final meeting, appointments, messages and important information remain connected.",
      problems: [
        { title: "Time-consuming scheduling", description: "Customers choose an available appointment within the availability rules you define." },
        { title: "In-person and online meetings in separate tools", description: "Include a location or online meeting link directly in the booking and notifications." },
        { title: "Recurring meetings", description: "Create an appointment series and edit one occurrence or all following appointments when needed." },
        { title: "Documents and communication in email threads", description: "Important information, notes and files remain connected to the customer and appointment." },
      ],
      featuresEyebrow: "Features for professional services",
      featuresTitle: "A clear system for individual meetings, groups and education",
      featuresIntro: "Calendra supports a simple booking journey for independent professionals and more complex schedules for teams and programmes.",
      features: [
        { title: "In-person and online appointments", description: "Set a location, delivery method or online meeting link for each service." },
        { title: "Zoom integration", description: "Create an online meeting link and include it automatically in notifications." },
        { title: "Recurring bookings", description: "Plan regular meetings without creating every appointment manually." },
        { title: "Documents and notes", description: "Keep important files and internal information on the customer profile." },
        { title: "Multi-session packages", description: "Track the use of purchased visits, programmes or other entitlements." },
        { title: "Invoices and payments", description: "Connect the completed meeting with a payment method and invoice." },
      ],
      workflowEyebrow: "A simple process",
      workflowTitle: "From booking to completed meeting",
      workflow: ["The customer chooses a meeting type.", "They select an available in-person or online appointment.", "Calendra sends confirmation and participation details.", "A reminder is sent before the meeting.", "Documents, payment and the next appointment remain connected afterwards."],
      screenshotEyebrow: "Individual and group work in one view",
      screenshotTitle: "One calendar for in-person meetings, online appointments and programmes",
      screenshotDescription: "Quickly distinguish meeting types, employees, locations and recurring appointments. The schedule remains understandable even when several programmes are running at the same time.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For independent experts, teams and programme providers",
      audiences: ["Business consultants", "Coaches and mentors", "Lecturers", "Workshop providers", "Language schools", "Tutors", "Education centres", "Individual programme providers"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for consulting and education",
      faq: [
        { question: "Can I manage in-person and online appointments?", answer: "Yes. Set the location, delivery method and online meeting link for each service or appointment." },
        { question: "Does Calendra connect with Zoom?", answer: "Yes. The Zoom integration can create a meeting link that you include in participant messages." },
        { question: "Can I create recurring meetings?", answer: "Yes. Create a series and later change one appointment, the whole series or all future appointments." },
        { question: "Can I organise group workshops?", answer: "Yes. Set a group appointment, maximum capacity and registration or cancellation rules." },
        { question: "Can I track a multi-session package?", answer: "Yes. Packages, tickets and other benefits can track the customer’s remaining visits or entitlements." },
      ],
      finalTitle: "Manage appointments, communication and programmes in one system",
      finalDescription: "Start a 14-day free trial and adapt Calendra to your consulting or education workflow.",
    },
  },
  healthWellbeing: {
    sl: {
      navLabel: "Zdravje in dobro počutje",
      cardCta: "Rešitve za zdravje in dobro počutje",
      eyebrow: "Pregled rešitev za zdravje in dobro počutje",
      title: "Calendra za zdravje, dobro počutje in individualne obravnave",
      intro: "Pregled rešitev Calendra za izvajalce individualnih obravnav in storitev dobrega počutja. Združuje naročanje, izvajalce, prostore, ponavljajoče obiske, opomnike, poslovne podatke o strankah, plačila in račune ter vodi do podrobnejših rešitev za posamezne dejavnosti.",
      heroPoints: ["Naročanje pri izbranem izvajalcu", "Urejena zgodovina obiskov in interne opombe", "Vloge uporabnikov in nadzor dostopa"],
      problemsEyebrow: "Zanesljiv vsakodnevni proces",
      problemsTitle: "Manj administracije okoli obiska in več jasnosti za stranko",
      problemsIntro: "Calendra je namenjena upravljanju terminov in poslovnega procesa. Ne nadomešča namenskih sistemov za zdravstveno dokumentacijo.",
      problems: [
        { title: "Ročno potrjevanje terminov", description: "Stranka prejme jasno potrditev, lokacijo, navodila in opomnik brez dodatnega ročnega pošiljanja." },
        { title: "Neusklajeni izvajalci in prostori", description: "Delovni čas, odsotnosti, zaposleni in prostori se preverijo pred potrditvijo termina." },
        { title: "Pozabljeni ali napačno razumljeni termini", description: "Samodejna obvestila zmanjšajo nesporazume in pomagajo stranki pravočasno ukrepati." },
        { title: "Nepregledna zgodovina obiskov", description: "Pretekli in prihodnji termini, opombe ter dokumenti so dostopni v urejenem profilu stranke." },
      ],
      featuresEyebrow: "Funkcionalnosti za urejeno naročanje",
      featuresTitle: "Pregledni termini, obvestila in podatki o strankah",
      featuresIntro: "Določite, katere podatke potrebujete, kdo jih lahko vidi in kako lahko stranka upravlja svoj termin.",
      features: [
        { title: "Izbira izvajalca", description: "Stranka lahko izbere izvajalca ali prvi prost termin glede na vaše nastavitve." },
        { title: "Delovni čas in odsotnosti", description: "Razpoložljivost upošteva urnike zaposlenih, dopuste, osebne dogodke in obstoječe termine." },
        { title: "Ponavljajoči se termini", description: "Uredite redne obiske ter po potrebi spremenite posamezno izvedbo ali prihodnjo serijo." },
        { title: "Opomniki in odpovedi", description: "Pošljite e-pošto ali SMS ter omogočite spremembe znotraj pravil, ki jih določite sami." },
        { title: "Profil stranke", description: "Kontaktni podatki, zgodovina terminov, dokumenti, opombe in polja po meri ostanejo skupaj." },
        { title: "Vloge in dovoljenja", description: "Omejite dostop do posameznih funkcij in podatkov glede na vlogo zaposlenega." },
      ],
      workflowEyebrow: "Od naročila do naslednjega obiska",
      workflowTitle: "Jasen potek za izvajalca in stranko",
      workflow: ["Stranka izbere storitev in izvajalca.", "Calendra ponudi samo razpoložljive termine.", "Stranka prejme potrditev in morebitna navodila.", "Pred obiskom prejme opomnik.", "Po obisku lahko zaposleni pripravi naslednji termin, plačilo ali račun."],
      screenshotEyebrow: "Pregledna organizacija dela",
      screenshotTitle: "Koledar, ki upošteva izvajalce, prostore in ponovitve",
      screenshotDescription: "Vsak termin vsebuje ključne poslovne informacije za izvedbo, koledar pa pomaga preprečiti prekrivanja. Dostop zaposlenih do funkcij in podatkov lahko prilagodite z vlogami ter dovoljenji.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za izvajalce individualnih obravnav in storitev dobrega počutja",
      audiences: ["Fizioterapevti", "Masažni terapevti", "Nutricionisti", "Psihološko svetovanje", "Logopedi", "Delovni terapevti", "Centri dobrega počutja", "Drugi izvajalci individualnih storitev"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za zdravje in dobro počutje",
      faq: [
        { question: "Ali je Calendra zdravstveni informacijski sistem?", answer: "Ne. Calendra je platforma za naročanje, upravljanje terminov, strank, komunikacije, plačil in računov. Za zakonsko zahtevano zdravstveno dokumentacijo uporabite temu namenjen sistem." },
        { question: "Ali lahko omejim dostop zaposlenih do podatkov?", answer: "Da. Z vlogami in dovoljenji določite, katere funkcije ter podatke lahko posamezni zaposleni vidi ali ureja." },
        { question: "Ali lahko stranka izbere izvajalca?", answer: "Da. Pri storitvi določite razpoložljive izvajalce in izberete, ali stranka vidi izbiro zaposlenega ali samo proste termine." },
        { question: "Ali lahko nastavim redne obiske?", answer: "Da. Ponavljajoči se termini omogočajo ustvarjanje serij, ki jih lahko pozneje urejate po posameznem obisku ali za prihodnje termine." },
        { question: "Ali Calendra pošilja SMS-opomnike?", answer: "Da, če so SMS obvestila vključena v izbranem paketu in konfigurirana za vaše podjetje. Podprta so tudi e-poštna obvestila." },
      ],
      finalTitle: "Vzpostavite zanesljiv in pregleden proces naročanja",
      finalDescription: "Preizkusite Calendro 14 dni in prilagodite termine, obvestila ter pravice zaposlenih svojemu načinu dela.",
    },
    en: {
      navLabel: "Health and wellbeing",
      cardCta: "Solutions for health and wellbeing",
      eyebrow: "Solutions overview for health and wellbeing",
      title: "Calendra for health, wellbeing and individual services",
      intro: "An overview of Calendra solutions for providers of individual treatments and wellbeing services. It combines booking, providers, rooms, recurring visits, reminders, business client information, payments and invoices and links to more specific industry solutions.",
      heroPoints: ["Booking with a selected provider", "Organised appointment history and internal notes", "User roles and access control"],
      problemsEyebrow: "A reliable everyday process",
      problemsTitle: "Less administration around each visit and greater clarity for customers",
      problemsIntro: "Calendra manages appointments and business workflows. It does not replace specialist medical-record systems.",
      problems: [
        { title: "Manual appointment confirmations", description: "Customers receive a clear confirmation, location, instructions and reminder without additional manual messages." },
        { title: "Uncoordinated providers and rooms", description: "Working hours, absences, employees and rooms are checked before an appointment is confirmed." },
        { title: "Forgotten or misunderstood appointments", description: "Automatic notifications reduce misunderstandings and help customers act in time." },
        { title: "Unclear visit history", description: "Past and future appointments, notes and documents are available in an organised customer profile." },
      ],
      featuresEyebrow: "Features for organised booking",
      featuresTitle: "Clear appointments, notifications and customer information",
      featuresIntro: "Choose what information you need, who may access it and how customers can manage their appointments.",
      features: [
        { title: "Provider selection", description: "Customers can choose a provider or the first available time according to your settings." },
        { title: "Working hours and absences", description: "Availability considers employee schedules, leave, personal events and existing appointments." },
        { title: "Recurring appointments", description: "Manage regular visits and change one occurrence or a future series when needed." },
        { title: "Reminders and cancellation", description: "Send email or SMS and allow changes within the rules you define." },
        { title: "Customer profile", description: "Contact information, appointment history, documents, notes and custom fields stay together." },
        { title: "Roles and permissions", description: "Limit access to features and information according to each employee’s role." },
      ],
      workflowEyebrow: "From booking to the next visit",
      workflowTitle: "A clear journey for provider and customer",
      workflow: ["The customer chooses a service and provider.", "Calendra offers only available appointments.", "The customer receives confirmation and any instructions.", "A reminder is sent before the visit.", "Afterwards, the employee can prepare the next appointment, payment or invoice."],
      screenshotEyebrow: "Organised service delivery",
      screenshotTitle: "A calendar that considers providers, rooms and recurring visits",
      screenshotDescription: "Each appointment contains the key business information needed for delivery while the calendar helps prevent overlaps. Employee access can be adapted with roles and permissions.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For individual treatment and wellbeing service providers",
      audiences: ["Physiotherapists", "Massage therapists", "Nutritionists", "Psychological counselling", "Speech therapists", "Occupational therapists", "Wellbeing centres", "Other individual service providers"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for health and wellbeing",
      faq: [
        { question: "Is Calendra a medical information system?", answer: "No. Calendra is a platform for booking, appointments, customers, communication, payments and invoices. Use a dedicated system for legally required medical records." },
        { question: "Can I restrict employee access to information?", answer: "Yes. Roles and permissions control which features and information each employee can view or edit." },
        { question: "Can customers choose a provider?", answer: "Yes. Select the providers available for each service and decide whether customers see employee selection or only available times." },
        { question: "Can I create regular visits?", answer: "Yes. Recurring appointments create a series that can later be edited for one visit or for future appointments." },
        { question: "Does Calendra send SMS reminders?", answer: "Yes, when SMS notifications are included in your plan and configured for your business. Email notifications are also supported." },
      ],
      finalTitle: "Create a reliable and clear booking process",
      finalDescription: "Try Calendra for 14 days and adapt appointments, notifications and employee access to your way of working.",
    },
  },
  fitnessGroups: {
    sl: {
      navLabel: "Fitnes in skupinske storitve",
      cardCta: "Rešitve za vadbene dejavnosti",
      eyebrow: "Pregled rešitev za fitnes in skupinske programe",
      title: "Calendra za fitnes, jogo, pilates in skupinske programe",
      intro: "Calendra poveže urnik fitnesa ali studia, spletne prijave na skupinske vadbe, kapacitete, čakalno vrsto, članstva, pakete obiskov in evidenco dejanskih obiskov. Individualni treningi in skupine ostanejo v istem sistemu.",
      heroPoints: ["Skupinske vadbe z omejeno kapaciteto in prikazom prostih mest", "Čakalna vrsta, spletne prijave in obvestila ob spremembah", "Članstva, paketi obiskov in evidenca dejanskih obiskov"],
      problemsEyebrow: "Urejene prijave",
      problemsTitle: "Jasen pregled nad skupinami, kapaciteto in udeleženci",
      problemsIntro: "Calendra združi urnik, prijave in pravice udeležencev, da vam ni treba voditi ločenih seznamov.",
      problems: [
        { title: "Ročni seznami prijav", description: "Udeleženci se prijavijo sami, seznam pa se samodejno posodablja ob spremembah." },
        { title: "Polne skupine in čakalna vrsta", description: "Kapaciteta je vidna pri vsaki izvedbi. Ko se skupina zapolni, lahko dodatni interesenti uporabijo čakalno vrsto in dobijo mesto, ko se sprosti." },
        { title: "Ponavljajoč urnik", description: "Redne vadbe ustvarite kot serijo in spremembo izvedete samo enkrat." },
        { title: "Nepregledna poraba članstev in paketov", description: "Članstva, paketi in druge ugodnosti ostanejo na profilu udeleženca, obiski pa se povežejo z dejansko izvedenimi termini." },
      ],
      featuresEyebrow: "Funkcionalnosti za individualne in skupinske storitve",
      featuresTitle: "Od spletne prijave do evidence obiska",
      featuresIntro: "Z isto platformo upravljajte individualne treninge, redni urnik skupin, prosta mesta, čakalno vrsto, članstva in porabo obiskov.",
      features: [
        { title: "Skupinski termini in kapaciteta", description: "Določite največje število udeležencev, spremljajte zasedenost posamezne izvedbe in takoj vidite, koliko mest je še prostih." },
        { title: "Spletne prijave in čakalna vrsta", description: "Udeleženci se prijavijo sami. Ko je skupina polna, čakalna vrsta ohrani interesente povezane s terminom in sproščenimi mesti." },
        { title: "Trenerji in prostori", description: "Dodelite izvajalca, dvorano, studio ali drugo lokacijo ter preverite razpoložljivost." },
        { title: "Članstva in paketi obiskov", description: "Prodajte ali dodelite članstvo oziroma paket ter določite, za katere vadbe ali skupine velja." },
        { title: "Evidenca obiskov", description: "Obisk se zabeleži ob dejansko izvedenem oziroma zaključenem terminu, zato število obiskov odraža realno udeležbo in ne samo rezervacij." },
        { title: "Obvestila o spremembah", description: "Samodejno obvestite prijavljene udeležence o prestavitvi, odpovedi ali drugih spremembah." },
      ],
      workflowEyebrow: "Od urnika do prijave",
      workflowTitle: "Kako poteka rezervacija skupinske storitve",
      workflow: ["Ustvarite posamezno vadbo ali ponavljajočo se skupino ter določite trenerja, lokacijo in kapaciteto.", "Udeleženci se prijavijo prek spleta ali aplikacije in takoj vidijo število prostih mest.", "Ko je termin poln, čakalna vrsta ohrani dodatne interesente povezane s skupino.", "Pred vadbo Calendra pošlje potrditev oziroma opomnik, spremembe pa sporoči prijavljenim.", "Po izvedbi se dejanski obisk poveže s članstvom ali paketom in ostane v zgodovini udeleženca."],
      screenshotEyebrow: "Urnik pod nadzorom",
      screenshotTitle: "Kapaciteta, prijave in članstva v enem delovnem toku",
      screenshotDescription: "Stranka pri spletni prijavi vidi odprte skupinske ure in prosta mesta, ekipa pa v Calendri spremlja kapaciteto, seznam udeležencev ter aktivna članstva ali pakete obiskov.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za vadbene centre, studije, trenerje in organizatorje skupin",
      audiences: ["Fitnes studii", "Osebni trenerji", "Joga studii", "Pilates studii", "Plesne šole", "Športni klubi", "Vadbeni centri", "Skupinske delavnice in tečaji"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za fitnes in skupinske storitve",
      faq: [
        { question: "Ali lahko nastavim največje število udeležencev?", answer: "Da. Pri skupinskem terminu določite kapaciteto, Calendra pa prepreči nove prijave, ko so vsa mesta zapolnjena." },
        { question: "Ali lahko vodim individualne in skupinske termine?", answer: "Da. V istem koledarju lahko uporabljate individualne storitve, skupinske rezervacije in termine z več strankami." },
        { question: "Ali lahko ustvarim tedenski urnik vadb?", answer: "Da. Ponavljajoči se termini omogočajo redne urnike, pri katerih lahko spremenite eno izvedbo ali vse prihodnje termine." },
        { question: "Ali lahko udeleženci uporabljajo pakete obiskov?", answer: "Da. Paketi, ugodnosti in vstopnice omogočajo spremljanje pravic ter preostalega števila obiskov." },
        { question: "Ali Calendra podpira čakalno vrsto?", answer: "Da. Ko je skupinski termin zapolnjen, lahko dodatni interesenti ostanejo povezani prek čakalne vrste. Ko se mesto sprosti, ga je mogoče ponuditi naslednjemu interesentu glede na nastavljen potek." },
      ],
      finalTitle: "Poenostavite prijave in ohranite popoln pregled nad skupinami",
      finalDescription: "Začnite s 14-dnevnim brezplačnim preizkusom ter nastavite kapacitete, ponovitve, pakete in obvestila.",
    },
    en: {
      navLabel: "Fitness and group services",
      cardCta: "Solutions for training businesses",
      eyebrow: "Solutions overview for fitness and group programmes",
      title: "Calendra for fitness, yoga, pilates and group programmes",
      intro: "Calendra connects fitness or studio schedules, online group-class registration, capacity, waiting lists, memberships, visit packages and actual attendance records. Personal training and group classes stay in the same system.",
      heroPoints: ["Capacity-limited group classes with live remaining-place counts", "Waiting lists, online registration and change notifications", "Memberships, visit packages and actual attendance records"],
      problemsEyebrow: "Organised registration",
      problemsTitle: "A clear view of groups, capacity and participants",
      problemsIntro: "Calendra combines schedules, registration and participant entitlements so you do not need separate lists.",
      problems: [
        { title: "Manual registration lists", description: "Participants register themselves and the list updates automatically when changes occur." },
        { title: "Full classes and waiting lists", description: "Capacity is visible for every occurrence. Once a class fills up, additional interest can stay on the waiting list and move into a place when one becomes available." },
        { title: "Recurring schedules", description: "Create regular classes as a series and apply schedule changes only once." },
        { title: "Unclear membership and package usage", description: "Memberships, packages and other benefits stay on the participant profile, while visits connect to appointments that were actually completed." },
      ],
      featuresEyebrow: "Features for individual and group services",
      featuresTitle: "From online registration to attendance tracking",
      featuresIntro: "Use one platform for personal training, recurring group schedules, remaining places, waiting lists, memberships and visit usage.",
      features: [
        { title: "Group classes and capacity", description: "Set the maximum number of participants, follow occupancy for each occurrence and see the number of remaining places immediately." },
        { title: "Online registration and waiting lists", description: "Participants register themselves. When a class is full, the waiting list keeps additional interest connected to the class and newly released places." },
        { title: "Trainers and rooms", description: "Assign an instructor, hall, studio or other location and check availability." },
        { title: "Memberships and visit packages", description: "Sell or assign a membership or package and define which classes, services or groups it can be used for." },
        { title: "Attendance records", description: "A visit is counted when the appointment is actually completed, so visit totals reflect real attendance rather than bookings alone." },
        { title: "Change notifications", description: "Automatically notify registered participants about rescheduling, cancellation or other changes." },
      ],
      workflowEyebrow: "From schedule to registration",
      workflowTitle: "How group service booking works",
      workflow: ["Create a one-off or recurring class and set its instructor, location and capacity.", "Participants register online or in the app and immediately see the number of remaining places.", "When a class is full, the waiting list keeps additional interest connected to the group.", "Calendra sends confirmations and reminders and notifies registered participants about changes.", "After completion, actual attendance connects to the participant’s membership or package and stays in their history."],
      screenshotEyebrow: "The schedule under control",
      screenshotTitle: "Capacity, registrations and memberships in one workflow",
      screenshotDescription: "During online booking participants see open class times and remaining places, while the team tracks capacity, the participant list and active memberships or visit packages in Calendra.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For training centres, studios, instructors and group organisers",
      audiences: ["Fitness studios", "Personal trainers", "Yoga studios", "Pilates studios", "Dance schools", "Sports clubs", "Training centres", "Group workshops and courses"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for fitness and group services",
      faq: [
        { question: "Can I set a maximum number of participants?", answer: "Yes. Set capacity for a group appointment and Calendra prevents further registration when all places are filled." },
        { question: "Can I manage individual and group appointments?", answer: "Yes. The same calendar supports individual services, group bookings and appointments with multiple customers." },
        { question: "Can I create a weekly class schedule?", answer: "Yes. Recurring appointments support regular schedules where one occurrence or all future appointments can be changed." },
        { question: "Can participants use visit packages?", answer: "Yes. Packages, benefits and tickets track entitlements and the remaining number of visits." },
        { question: "Does Calendra support a waiting list?", answer: "Yes. When a group appointment is full, additional interest can remain connected through the waiting list. When a place becomes available, it can be offered to the next interested participant according to your configured workflow." },
      ],
      finalTitle: "Simplify registration and keep complete control of your groups",
      finalDescription: "Start a 14-day free trial and configure capacity, recurrence, packages and notifications.",
    },
  },
};

const businessTypeContent: Record<BusinessTypeIndustryRouteKey, Record<SiteLanguage, IndustryContent>> = {
  hairSalons: {
    sl: {
      navLabel: "Frizerski saloni",
      cardCta: "Calendra za frizerske salone",
      eyebrow: "Calendra za frizerske salone",
      title: "Program za naročanje strank za frizerske salone",
      intro: "Calendra poveže spletno naročanje, urnike frizerjev, različna trajanja storitev, delovna mesta, opomnike, plačila in račune. Tako je manj telefonskega usklajevanja in več časa za stranke v salonu.",
      heroPoints: ["Urnik po frizerjih, storitvah in delovnih mestih", "Spletno naročanje za striženje, barvanje, feniranje in druge storitve", "Opomniki, paketi, boni, plačila in računi na profilu stranke"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za striženje, barvanje, feniranje ali nego las vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost frizerjev ter po potrebi stolov, delovnih mest in opreme, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po frizerjev, storitvah, lokacijah in po potrebi stolov, delovnih mest in opreme."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite striženje, barvanje, feniranje ali nego las z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Delovna mesta, paketi in boni",
          description: "Pri razpoložljivosti upoštevajte stole ali druga omejena delovna mesta, rednim strankam pa ponudite pakete ali darilne bone."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere striženje, barvanje, feniranje ali nego las.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Vsi frizerski termini v enem koledarju",
      screenshotDescription: "Ekipa vidi, kdo prihaja, katera storitev je rezervirana, koliko časa traja in kateri izvajalec ali delovno mesto sta potrebna.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za samostojne frizerje, brivnice in salone z ekipami",
      audiences: ["Frizerski saloni", "Brivnice", "Barber shopi", "Samostojni frizerji", "Saloni z več zaposlenimi", "Saloni z več lokacijami", "Specialisti za barvanje", "Stilistične ekipe"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za frizerski saloni",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko ista storitev poteka različno dolgo pri različnih frizerjih?",
          answer: "Da. Storitve imajo svoje trajanje in izvajalce, pri organizaciji dela pa lahko nastavite pravila, ki ustrezajo vašemu salonu."
        }
      ],
      finalTitle: "Uredite naročanje v frizerskem salonu na enem mestu",
      finalDescription: "Začnite s 14-dnevnim brezplačnim preizkusom ter nastavite frizerje, storitve, delovni čas in spletno naročanje."
    },
    en: {
      navLabel: "Hair salons",
      cardCta: "Calendra for hair salons",
      eyebrow: "Calendra for hair salons",
      title: "Booking software for hair salons and barbershops",
      intro: "Calendra connects online booking, stylist schedules, flexible service durations, workstations, reminders, payments and invoices. That means less phone coordination and more time for clients in the salon.",
      heroPoints: ["Schedules by stylist, service and workstation", "Online booking for cuts, colour, styling and other salon services", "Reminders, packages, vouchers, payments and invoices on the client profile"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a haircut, colour service, blow-dry or hair treatment take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of stylists and, where needed, chairs, workstations and equipment to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by stylists, services, locations and, where relevant, chairs, workstations and equipment."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a haircut, colour service, blow-dry or hair treatment with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Workstations, packages and vouchers",
          description: "Include chairs or other limited workstations in availability and offer packages or gift vouchers to returning clients."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a haircut, colour service, blow-dry or hair treatment.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Every hair appointment in one calendar",
      screenshotDescription: "The team can see who is coming, the booked service, its duration and which stylist or workstation is required.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For independent stylists, barbershops and multi-employee salons",
      audiences: ["Hair salons", "Barbershops", "Independent stylists", "Multi-employee salons", "Multi-location salons", "Colour specialists", "Hair studios", "Styling teams"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for hair salons",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can service duration differ between stylists?",
          answer: "Yes. Services can have their own duration and eligible providers, while your booking setup can reflect how your salon actually works."
        }
      ],
      finalTitle: "Bring your hair-salon bookings into one clear workflow",
      finalDescription: "Start a 14-day free trial and configure stylists, services, working hours and online booking."
    }
  },
  beautySalons: {
    sl: {
      navLabel: "Kozmetični saloni",
      cardCta: "Calendra za kozmetične salone",
      eyebrow: "Calendra za kozmetične salone",
      title: "Program za naročanje za kozmetične in lepotne salone",
      intro: "Calendra pomaga kozmetičnim salonom organizirati tretmaje, zaposlene, kabine, opomnike, pakete, plačila in račune. Stranke se lahko naročijo prek spleta, ekipa pa ohrani jasen pregled nad dnevom.",
      heroPoints: ["Različna trajanja tretmajev in izvajalci", "Kabine, naprave in drugi omejeni viri v istem urniku", "Spletno naročanje, opomniki, paketi in plačila"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za nego obraza, depilacijo, manikuro ali drug tretma vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost kozmetičark in drugih izvajalcev ter po potrebi kabin, naprav in delovnih mest, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po kozmetičark in drugih izvajalcev, storitvah, lokacijah in po potrebi kabin, naprav in delovnih mest."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite nego obraza, depilacijo, manikuro ali drug tretma z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Kabine, naprave in paketi",
          description: "Pri rezervaciji preverite razpoložljivost kabine ali naprave ter prodajajte pakete obiskov, članstva ali bone."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere nego obraza, depilacijo, manikuro ali drug tretma.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Pregleden dan za celoten lepotni salon",
      screenshotDescription: "Na enem koledarju so izvajalci, tretmaji, kabine in stranke, zato je manj prekrivanja in ročnega preverjanja.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za kozmetične salone in lepotne studie vseh velikosti",
      audiences: ["Kozmetični saloni", "Lepotni centri", "Nohtni studii", "Depilacijski saloni", "Studii za obrvi in trepalnice", "Make-up studii", "Saloni z napravami", "Saloni z več lokacijami"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za kozmetični saloni",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko omejim storitev na določeno kabino ali napravo?",
          answer: "Da. Pri organizaciji razpoložljivosti lahko upoštevate prostore in druge omejene vire, ki jih storitev potrebuje."
        }
      ],
      finalTitle: "Poenostavite naročanje in organizacijo lepotnega salona",
      finalDescription: "Preizkusite Calendro 14 dni ter povežite storitve, ekipo, kabine, opomnike in plačila."
    },
    en: {
      navLabel: "Beauty salons",
      cardCta: "Calendra for beauty salons",
      eyebrow: "Calendra for beauty salons",
      title: "Booking software for beauty and cosmetic salons",
      intro: "Calendra helps beauty salons organise treatments, employees, treatment rooms, reminders, packages, payments and invoices. Clients can book online while the team keeps a clear view of the day.",
      heroPoints: ["Flexible treatment durations and eligible providers", "Treatment rooms, devices and other limited resources in one schedule", "Online booking, reminders, packages and payments"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a facial, depilation, manicure or another treatment take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of beauticians and other providers and, where needed, treatment rooms, devices and workstations to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by beauticians and other providers, services, locations and, where relevant, treatment rooms, devices and workstations."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a facial, depilation, manicure or another treatment with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Rooms, devices and packages",
          description: "Check the availability of a treatment room or device and sell visit packages, memberships or vouchers."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a facial, depilation, manicure or another treatment.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "A clear day for the whole beauty salon",
      screenshotDescription: "Providers, treatments, rooms and clients stay in one calendar, reducing overlap and manual checks.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For beauty salons and studios of every size",
      audiences: ["Beauty salons", "Cosmetic salons", "Nail studios", "Depilation studios", "Brow and lash studios", "Make-up studios", "Device-based treatment salons", "Multi-location salons"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for beauty salons",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can a service require a specific room or device?",
          answer: "Yes. Availability can include rooms and other limited resources that are required to deliver a service."
        }
      ],
      finalTitle: "Simplify booking and organisation in your beauty salon",
      finalDescription: "Try Calendra for 14 days and connect services, staff, rooms, reminders and payments."
    }
  },
  massage: {
    sl: {
      navLabel: "Masaža",
      cardCta: "Calendra za masažo",
      eyebrow: "Calendra za masažne salone",
      title: "Program za naročanje za masažne salone in terapevte",
      intro: "Calendra združi termine masaž, razpoložljivost terapevtov in sob, opomnike, pakete obiskov, predplačila ter račune. Stranka lažje najde prost termin, vi pa imate manj administracije.",
      heroPoints: ["Urniki terapevtov in masažnih sob", "Spletno naročanje za različne vrste in trajanja masaž", "Opomniki, paketi obiskov, predplačila in računi"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za klasično, športno, sprostitveno ali drugo masažo vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost maserjev in terapevtov ter po potrebi masažnih sob in miz, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po maserjev in terapevtov, storitvah, lokacijah in po potrebi masažnih sob in miz."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite klasično, športno, sprostitveno ali drugo masažo z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Sobe, paketi in predplačila",
          description: "Upoštevajte razpoložljivost masažne sobe ter rednim strankam ponudite paket obiskov ali predplačilo."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere klasično, športno, sprostitveno ali drugo masažo.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Termini terapevtov in sob brez prekrivanja",
      screenshotDescription: "Koledar poveže vrsto masaže, terapevta, trajanje in prostor, zato lahko hitro preverite celotno razpoložljivost.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za masažne salone, terapevte in wellness izvajalce",
      audiences: ["Masažni saloni", "Samostojni maserji", "Športni maserji", "Wellness terapevti", "Centri dobrega počutja", "Hoteli z masažami", "Saloni z več terapevti", "Izvajalci na več lokacijah"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za masaža",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko prodajam pakete več masaž?",
          answer: "Da. Paketi in druge ugodnosti se lahko povežejo s profilom stranke in porabo obiskov."
        }
      ],
      finalTitle: "Naj bo naročanje na masažo enostavno za stranke in ekipo",
      finalDescription: "Začnite s 14-dnevnim preizkusom ter uredite terapevte, sobe, storitve, opomnike in pakete."
    },
    en: {
      navLabel: "Massage",
      cardCta: "Calendra for massage",
      eyebrow: "Calendra for massage businesses",
      title: "Booking software for massage salons and therapists",
      intro: "Calendra brings together massage appointments, therapist and room availability, reminders, visit packages, prepayments and invoices. Clients find available times more easily and you spend less time on administration.",
      heroPoints: ["Therapist and massage-room schedules", "Online booking for different massage types and durations", "Reminders, visit packages, prepayments and invoices"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a classic, sports, relaxation or other massage take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of massage therapists and, where needed, massage rooms and tables to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by massage therapists, services, locations and, where relevant, massage rooms and tables."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a classic, sports, relaxation or other massage with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Rooms, packages and prepayments",
          description: "Include massage-room availability and offer returning clients visit packages or prepayments."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a classic, sports, relaxation or other massage.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Therapist and room schedules without overlap",
      screenshotDescription: "The calendar connects massage type, therapist, duration and room so the full availability picture is easy to check.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For massage salons, therapists and wellbeing providers",
      audiences: ["Massage salons", "Independent massage therapists", "Sports massage providers", "Wellness therapists", "Wellbeing centres", "Hotels offering massage", "Multi-therapist practices", "Multi-location providers"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for massage",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can I sell packages of several massages?",
          answer: "Yes. Packages and other benefits can be connected to the client profile and visit usage."
        }
      ],
      finalTitle: "Make massage booking simple for clients and your team",
      finalDescription: "Start a 14-day trial and configure therapists, rooms, services, reminders and packages."
    }
  },
  spaSauna: {
    sl: {
      navLabel: "Spa & savna",
      cardCta: "Calendra za spa & savne",
      eyebrow: "Calendra za spa in savne",
      title: "Rezervacijski sistem za spa, savne in wellness centre",
      intro: "Calendra pomaga organizirati rezervacije spa storitev, savn, terminov, izvajalcev in omejenih kapacitet. Spletne rezervacije, obvestila, paketi in plačila ostanejo povezani v istem sistemu.",
      heroPoints: ["Rezervacije po storitvah, prostorih in kapacitetah", "Spletno naročanje in jasen prikaz prostih terminov", "Paketi, članstva, boni, predplačila in obvestila"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za savno, zasebni spa termin, wellness tretma ali paket vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost izvajalcev in receptorjev ter po potrebi savn, prostorov in omejenih kapacitet, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po izvajalcev in receptorjev, storitvah, lokacijah in po potrebi savn, prostorov in omejenih kapacitet."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite savno, zasebni spa termin, wellness tretma ali paket z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Kapacitete, prostori in paketi",
          description: "Določite, koliko oseb ali rezervacij je mogoče sprejeti, ter povežite termine s prostori, paketi, članstvi ali boni."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere savno, zasebni spa termin, wellness tretma ali paket.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Kapaciteta in rezervacije wellnessa na enem mestu",
      screenshotDescription: "Ekipa vidi, kateri prostori so zasedeni, koliko kapacitete je še na voljo in katere storitve ali paketi so rezervirani.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za spa centre, savne, wellness in hotelske storitve",
      audiences: ["Spa centri", "Savne", "Wellness centri", "Hotelski wellness", "Zasebni spa prostori", "Termalni ponudniki", "Centri z več prostori", "Ponudniki wellness paketov"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za spa & savna",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko omejim število rezervacij za isti termin?",
          answer: "Da. Pri skupinskih ali kapacitetno omejenih storitvah lahko nastavite največje število udeležencev oziroma mest."
        }
      ],
      finalTitle: "Uredite rezervacije spa in wellness storitev brez ročnih seznamov",
      finalDescription: "Preizkusite Calendro 14 dni ter nastavite prostore, kapacitete, pakete in spletne rezervacije."
    },
    en: {
      navLabel: "Spa & sauna",
      cardCta: "Calendra for spa & sauna",
      eyebrow: "Calendra for spas and saunas",
      title: "Reservation software for spas, saunas and wellness centres",
      intro: "Calendra helps organise spa treatments, sauna reservations, providers and limited capacity. Online reservations, notifications, packages and payments stay connected in the same system.",
      heroPoints: ["Reservations by service, room and capacity", "Online booking with clear availability", "Packages, memberships, vouchers, prepayments and notifications"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a sauna session, private spa slot, wellness treatment or package take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of providers and reception staff and, where needed, saunas, rooms and limited capacity to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by providers and reception staff, services, locations and, where relevant, saunas, rooms and limited capacity."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a sauna session, private spa slot, wellness treatment or package with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Capacity, rooms and packages",
          description: "Set how many people or bookings can be accepted and connect appointments with rooms, packages, memberships or vouchers."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a sauna session, private spa slot, wellness treatment or package.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Wellness capacity and reservations in one view",
      screenshotDescription: "The team can see which rooms are occupied, how much capacity remains and which services or packages are booked.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For spas, saunas, wellness centres and hotel services",
      audiences: ["Spa centres", "Saunas", "Wellness centres", "Hotel wellness", "Private spa rooms", "Thermal providers", "Multi-room centres", "Wellness package providers"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for spa & sauna",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can I limit the number of bookings at the same time?",
          answer: "Yes. Group or capacity-limited services can have a maximum number of participants or places."
        }
      ],
      finalTitle: "Manage spa and wellness reservations without manual lists",
      finalDescription: "Try Calendra for 14 days and configure rooms, capacity, packages and online reservations."
    }
  },
  tattooPiercing: {
    sl: {
      navLabel: "Tetoviranje & piercing",
      cardCta: "Calendra za tattoo & piercing studie",
      eyebrow: "Calendra za tattoo in piercing studie",
      title: "Program za naročanje za tattoo in piercing studie",
      intro: "Calendra uredi termine umetnikov, posvete, različna trajanja storitev, opomnike, predplačila in podatke strank. Ekipa lahko vodi individualna naročila brez nepreglednega usklajevanja po sporočilih.",
      heroPoints: ["Koledar po umetnikih in vrstah storitev", "Ločeni termini za posvet, izvedbo ali kontrolo", "Opomniki, predplačila, opombe in zgodovina stranke"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za posvet, tetoviranje, piercing ali kontrolni termin vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost tattoo umetnikov in piercerjev ter po potrebi delovnih mest in prostorov, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po tattoo umetnikov in piercerjev, storitvah, lokacijah in po potrebi delovnih mest in prostorov."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite posvet, tetoviranje, piercing ali kontrolni termin z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Posveti, predplačila in opombe",
          description: "Ločite posvet od izvedbe, zabeležite dogovorjene podatke ter po potrebi uporabite predplačilo za rezervacijo termina."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere posvet, tetoviranje, piercing ali kontrolni termin.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Jasen urnik za vsakega umetnika",
      screenshotDescription: "Koledar pokaže trajanje, vrsto termina in izvajalca, zato je lažje načrtovati daljše posege in kratke kontrole.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za tattoo studie, piercing studie in samostojne umetnike",
      audiences: ["Tattoo studii", "Piercing studii", "Samostojni tattoo umetniki", "Samostojni piercerji", "Studii z več umetniki", "Gostujoči umetniki", "Studii z več lokacijami", "Kombinirani tattoo & piercing studii"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za tetoviranje & piercing",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko vodim posvet kot ločeno storitev?",
          answer: "Da. Posvet, izvedba in kontrola so lahko ločene storitve z lastnim trajanjem, ceno in pravili rezervacije."
        }
      ],
      finalTitle: "Naj bodo naročila studia pregledna od posveta do izvedbe",
      finalDescription: "Začnite s 14-dnevnim preizkusom in nastavite umetnike, storitve, opomnike ter predplačila."
    },
    en: {
      navLabel: "Tattooing & piercing",
      cardCta: "Calendra for tattoo & piercing",
      eyebrow: "Calendra for tattoo and piercing studios",
      title: "Booking software for tattoo and piercing studios",
      intro: "Calendra organises artist schedules, consultations, flexible service durations, reminders, prepayments and client information. Your team can manage individual bookings without scattered message threads.",
      heroPoints: ["Calendar by artist and service type", "Separate appointments for consultation, procedure or follow-up", "Reminders, prepayments, notes and client history"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a consultation, tattoo session, piercing or follow-up take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of tattoo artists and piercers and, where needed, workstations and rooms to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by tattoo artists and piercers, services, locations and, where relevant, workstations and rooms."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a consultation, tattoo session, piercing or follow-up with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Consultations, prepayments and notes",
          description: "Separate consultation from delivery, keep agreed information together and use prepayment when appropriate for the booking."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a consultation, tattoo session, piercing or follow-up.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "A clear schedule for every artist",
      screenshotDescription: "The calendar shows duration, appointment type and provider, making long sessions and short follow-ups easier to plan.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For tattoo studios, piercing studios and independent artists",
      audiences: ["Tattoo studios", "Piercing studios", "Independent tattoo artists", "Independent piercers", "Multi-artist studios", "Guest artists", "Multi-location studios", "Combined tattoo & piercing studios"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for tattooing & piercing",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can I manage consultations as a separate service?",
          answer: "Yes. Consultation, delivery and follow-up can be separate services with their own duration, price and booking rules."
        }
      ],
      finalTitle: "Keep studio bookings clear from consultation to delivery",
      finalDescription: "Start a 14-day trial and configure artists, services, reminders and prepayments."
    }
  },
  fitnessPersonalTraining: {
    sl: {
      navLabel: "Fitnes & osebno trenerstvo",
      cardCta: "Calendra za fitnes & trenerje",
      eyebrow: "Calendra za fitnes in osebne trenerje",
      title: "Program za fitnes centre in osebne trenerje",
      intro: "Calendra združi individualne treninge, skupinske vadbe, trenerje, kapacitete, članstva in pakete obiskov. Udeleženci se prijavijo prek spleta, ekipa pa spremlja dejanske obiske in razpoložljivost.",
      heroPoints: ["Individualni in skupinski termini v istem koledarju", "Kapaciteta, spletne prijave in čakalna vrsta", "Članstva, paketi obiskov in evidenca udeležbe"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za osebni trening, skupinsko vadbo ali uvodni termin vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost trenerjev in vaditeljev ter po potrebi dvoran, vadbenih prostorov in kapacitet, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po trenerjev in vaditeljev, storitvah, lokacijah in po potrebi dvoran, vadbenih prostorov in kapacitet."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite osebni trening, skupinsko vadbo ali uvodni termin z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Skupine, članstva in paketi",
          description: "Določite kapaciteto vadbe, uporabljajte čakalno vrsto ter povežite članstva ali pakete obiskov z dejansko udeležbo."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere osebni trening, skupinsko vadbo ali uvodni termin.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Kapaciteta, prijave in članstva v istem toku",
      screenshotDescription: "Udeleženec vidi prosta mesta, ekipa pa spremlja seznam prijavljenih, dejanske obiske in veljavne pakete ali članstva.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za fitnes centre, osebne trenerje in vadbene studie",
      audiences: ["Fitnes centri", "Osebni trenerji", "Funkcionalni trening", "Cross training studii", "Mali vadbeni centri", "Trenerji na več lokacijah", "Skupinske vadbe", "Studii z članstvi"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za fitnes & osebno trenerstvo",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko vodim osebne treninge in skupine hkrati?",
          answer: "Da. V istem koledarju lahko kombinirate individualne termine in skupinske vadbe z omejeno kapaciteto."
        }
      ],
      finalTitle: "Poenostavite urnike trenerjev, prijave in članstva",
      finalDescription: "Preizkusite Calendro 14 dni ter nastavite treninge, skupine, kapacitete in pakete obiskov."
    },
    en: {
      navLabel: "Fitness & personal training",
      cardCta: "Calendra for fitness & trainers",
      eyebrow: "Calendra for fitness and personal training",
      title: "Booking software for fitness centres and personal trainers",
      intro: "Calendra brings together personal training, group classes, trainers, capacity, memberships and visit packages. Participants register online while your team tracks attendance and availability.",
      heroPoints: ["Individual and group appointments in the same calendar", "Capacity, online registration and waiting lists", "Memberships, visit packages and attendance tracking"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a personal training session, group class or introductory appointment take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of trainers and instructors and, where needed, studios, training spaces and capacity to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by trainers and instructors, services, locations and, where relevant, studios, training spaces and capacity."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a personal training session, group class or introductory appointment with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Groups, memberships and packages",
          description: "Set class capacity, use a waiting list and connect memberships or visit packages to actual attendance."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a personal training session, group class or introductory appointment.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Capacity, registrations and memberships in one workflow",
      screenshotDescription: "Participants see remaining places while the team tracks registration lists, actual attendance and active packages or memberships.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For fitness centres, personal trainers and training studios",
      audiences: ["Fitness centres", "Personal trainers", "Functional training studios", "Cross-training studios", "Small training centres", "Multi-location trainers", "Group classes", "Membership-based studios"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for fitness & personal training",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can I manage personal training and group classes together?",
          answer: "Yes. The same calendar can combine individual appointments and capacity-limited group classes."
        }
      ],
      finalTitle: "Simplify trainer schedules, registrations and memberships",
      finalDescription: "Try Calendra for 14 days and configure sessions, groups, capacity and visit packages."
    }
  },
  physiotherapy: {
    sl: {
      navLabel: "Fizioterapija",
      cardCta: "Calendra za fizioterapijo",
      eyebrow: "Calendra za fizioterapijo",
      title: "Program za naročanje za fizioterapevte in fizioterapijo",
      intro: "Calendra organizira termine, fizioterapevte, prostore, ponavljajoče obiske, opomnike, plačila in račune. Namenjena je organizaciji naročanja in poslovnega procesa, ne nadomešča pa medicinskega informacijskega sistema.",
      heroPoints: ["Urniki fizioterapevtov, prostorov in ponavljajočih obiskov", "Spletno naročanje ter samodejne potrditve in opomniki", "Profil stranke, plačila, računi in nadzor uporabniških dostopov"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za prvi pregled, fizioterapevtsko obravnavo ali kontrolni obisk vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost fizioterapevtov ter po potrebi ordinacij, prostorov in opreme, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po fizioterapevtov, storitvah, lokacijah in po potrebi ordinacij, prostorov in opreme."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite prvi pregled, fizioterapevtsko obravnavo ali kontrolni obisk z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Ponavljajoči obiski in dostopi",
          description: "Ustvarite serijo rednih terminov in omejite dostop zaposlenih do funkcionalnosti glede na njihove vloge."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere prvi pregled, fizioterapevtsko obravnavo ali kontrolni obisk.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Ponavljajoče obravnave in razpoložljivost v enem pogledu",
      screenshotDescription: "Koledar pomaga uskladiti izvajalca, prostor in zaporedne obiske, medtem ko poslovni podatki ostanejo povezani s stranko.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za samostojne fizioterapevte in centre z več izvajalci",
      audiences: ["Fizioterapevti", "Fizioterapevtski centri", "Rehabilitacijski studii", "Športna fizioterapija", "Manualna terapija", "Centri z več izvajalci", "Izvajalci na več lokacijah", "Zasebne prakse"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za fizioterapija",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali je Calendra medicinski informacijski sistem?",
          answer: "Ne. Calendra je namenjena naročanju, terminom, strankam, komunikaciji, plačilom in računom. Za zakonsko zahtevano zdravstveno dokumentacijo uporabite namenski sistem."
        }
      ],
      finalTitle: "Vzpostavite zanesljiv proces naročanja v fizioterapiji",
      finalDescription: "Začnite s 14-dnevnim preizkusom ter prilagodite termine, ponovitve, opomnike in dostope ekipe."
    },
    en: {
      navLabel: "Physiotherapy",
      cardCta: "Calendra for physiotherapy",
      eyebrow: "Calendra for physiotherapy",
      title: "Booking software for physiotherapists and physiotherapy practices",
      intro: "Calendra organises appointments, physiotherapists, rooms, recurring visits, reminders, payments and invoices. It is designed for scheduling and business workflows and does not replace a medical information system.",
      heroPoints: ["Physiotherapist, room and recurring-visit schedules", "Online booking with automatic confirmations and reminders", "Client profiles, payments, invoices and role-based access"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around an initial assessment, physiotherapy session or follow-up visit take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of physiotherapists and, where needed, treatment rooms, spaces and equipment to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by physiotherapists, services, locations and, where relevant, treatment rooms, spaces and equipment."
        },
        {
          title: "Services with flexible duration",
          description: "Configure an initial assessment, physiotherapy session or follow-up visit with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Recurring visits and access control",
          description: "Create a series of regular appointments and limit employee access to features according to their roles."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses an initial assessment, physiotherapy session or follow-up visit.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Recurring treatment appointments and availability in one view",
      screenshotDescription: "The calendar helps coordinate provider, room and follow-up visits while business information stays connected to the client.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For independent physiotherapists and multi-provider practices",
      audiences: ["Physiotherapists", "Physiotherapy centres", "Rehabilitation studios", "Sports physiotherapy", "Manual therapy practices", "Multi-provider centres", "Multi-location providers", "Private practices"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for physiotherapy",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Is Calendra a medical information system?",
          answer: "No. Calendra is for booking, appointments, clients, communication, payments and invoices. Use a dedicated system for legally required medical records."
        }
      ],
      finalTitle: "Build a reliable physiotherapy booking process",
      finalDescription: "Start a 14-day trial and adapt appointments, recurrence, reminders and team access."
    }
  },
  psychologyCounselling: {
    sl: {
      navLabel: "Psihologija & svetovanje",
      cardCta: "Calendra za psihologe & svetovalce",
      eyebrow: "Calendra za psihologijo in svetovanje",
      title: "Program za naročanje za psihologe in svetovalce",
      intro: "Calendra pomaga pri organizaciji individualnih terminov, spletnih srečanj, ponavljajočih se obiskov, opomnikov, profilov strank, plačil in računov. Dostopi zaposlenih se lahko prilagodijo vlogam ekipe.",
      heroPoints: ["Individualni, ponavljajoči in spletni termini", "Opomniki, Zoom povezave in urejen profil stranke", "Vloge in dovoljenja, plačila ter računi"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za uvodni pogovor, svetovalni termin ali spletno srečanje vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost psihologov in svetovalcev ter po potrebi izvajalcev, prostorov in spletnih terminov, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po psihologov in svetovalcev, storitvah, lokacijah in po potrebi izvajalcev, prostorov in spletnih terminov."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite uvodni pogovor, svetovalni termin ali spletno srečanje z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Spletni termini, vloge in dovoljenja",
          description: "Povežite spletna srečanja z Zoomom ter prilagodite dostop do funkcionalnosti glede na vlogo posameznega člana ekipe."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere uvodni pogovor, svetovalni termin ali spletno srečanje.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Individualni in spletni termini v enem koledarju",
      screenshotDescription: "Izvajalci hitro vidijo svoje termine in razpoložljivost, podatki poslovnega procesa pa ostanejo urejeni na profilu stranke.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za psihologe, svetovalce in centre z več izvajalci",
      audiences: ["Psihološko svetovanje", "Karierno svetovanje", "Partnersko svetovanje", "Coaching ena na ena", "Centri z več svetovalci", "Spletno svetovanje", "Samostojni svetovalci", "Izvajalci na več lokacijah"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za psihologija & svetovanje",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali je Calendra namenjena vodenju klinične dokumentacije?",
          answer: "Ne. Calendra je platforma za naročanje, termine, poslovne podatke o strankah, komunikacijo, plačila in račune. Za zakonsko zahtevano zdravstveno dokumentacijo uporabite ustrezen namenski sistem."
        }
      ],
      finalTitle: "Uredite naročanje za svetovalno prakso na miren in pregleden način",
      finalDescription: "Preizkusite Calendro 14 dni ter nastavite izvajalce, spletne termine, opomnike in pravice dostopa."
    },
    en: {
      navLabel: "Psychology & counselling",
      cardCta: "Calendra for psychologists & counsellors",
      eyebrow: "Calendra for psychology and counselling",
      title: "Booking software for psychologists and counsellors",
      intro: "Calendra helps organise individual appointments, online meetings, recurring visits, reminders, client profiles, payments and invoices. Employee access can be adapted to team roles.",
      heroPoints: ["Individual, recurring and online appointments", "Reminders, Zoom links and organised client profiles", "Roles and permissions, payments and invoices"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around an introductory call, counselling appointment or online meeting take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of psychologists and counsellors and, where needed, providers, rooms and online availability to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by psychologists and counsellors, services, locations and, where relevant, providers, rooms and online availability."
        },
        {
          title: "Services with flexible duration",
          description: "Configure an introductory call, counselling appointment or online meeting with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Online appointments, roles and permissions",
          description: "Connect online meetings with Zoom and adapt access to features according to each team member’s role."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses an introductory call, counselling appointment or online meeting.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Individual and online appointments in one calendar",
      screenshotDescription: "Providers can quickly see their appointments and availability while business-process information stays organised on the client profile.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For psychologists, counsellors and multi-provider centres",
      audiences: ["Psychological counselling", "Career counselling", "Relationship counselling", "One-to-one coaching", "Multi-counsellor centres", "Online counselling", "Independent counsellors", "Multi-location providers"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for psychology & counselling",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Is Calendra intended for clinical records?",
          answer: "No. Calendra is a platform for booking, appointments, business client information, communication, payments and invoices. Use an appropriate dedicated system for legally required medical records."
        }
      ],
      finalTitle: "Organise counselling bookings in a calm, clear workflow",
      finalDescription: "Try Calendra for 14 days and configure providers, online appointments, reminders and access permissions."
    }
  },
  yogaPilates: {
    sl: {
      navLabel: "Joga & pilates",
      cardCta: "Calendra za jogo & pilates",
      eyebrow: "Calendra za jogo in pilates",
      title: "Program za jogo, pilates in skupinske vadbe",
      intro: "Calendra združi urnik vadb, inštruktorje, kapaciteto, spletne prijave, čakalno vrsto, članstva in pakete obiskov. Redne tedenske skupine in individualni termini ostanejo v istem sistemu.",
      heroPoints: ["Ponavljajoče vadbe z omejeno kapaciteto", "Spletne prijave, prosta mesta in čakalna vrsta", "Članstva, paketi obiskov in evidenca udeležbe"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za jogo, pilates, reformer vadbo ali individualni termin vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost inštruktorjev in vaditeljev ter po potrebi studiev, dvoran in kapacitet, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po inštruktorjev in vaditeljev, storitvah, lokacijah in po potrebi studiev, dvoran in kapacitet."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite jogo, pilates, reformer vadbo ali individualni termin z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Kapaciteta, članstva in čakalna vrsta",
          description: "Določite število mest, uporabite čakalno vrsto ter povežite prijave z članstvi ali paketi obiskov."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere jogo, pilates, reformer vadbo ali individualni termin.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Prosta mesta, prijave in paketi v istem toku",
      screenshotDescription: "Udeleženec pri prijavi vidi razpoložljive ure in mesta, ekipa pa spremlja seznam skupine ter veljavna članstva ali pakete.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za joga studie, pilates studie in vadbene centre",
      audiences: ["Joga studii", "Pilates studii", "Reformer pilates", "Samostojni inštruktorji", "Vadbeni centri", "Skupinske vadbe", "Studii z članstvi", "Studii z več lokacijami"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za joga & pilates",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko nastavim ponavljajoč tedenski urnik vadb?",
          answer: "Da. Ponavljajoči se termini omogočajo redne skupine, pri katerih lahko spremenite eno izvedbo ali vse prihodnje termine."
        }
      ],
      finalTitle: "Poenostavite prijave na jogo in pilates ter spremljanje članstev",
      finalDescription: "Začnite s 14-dnevnim preizkusom ter nastavite skupine, kapacitete, ponovitve in pakete."
    },
    en: {
      navLabel: "Yoga & pilates",
      cardCta: "Calendra for yoga & pilates",
      eyebrow: "Calendra for yoga and pilates",
      title: "Booking software for yoga, pilates and group classes",
      intro: "Calendra brings together class schedules, instructors, capacity, online registration, waiting lists, memberships and visit packages. Regular weekly groups and individual appointments stay in the same system.",
      heroPoints: ["Recurring classes with limited capacity", "Online registration, remaining places and waiting lists", "Memberships, visit packages and attendance tracking"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a yoga class, pilates class, reformer session or private appointment take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of instructors and trainers and, where needed, studios, rooms and capacity to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by instructors and trainers, services, locations and, where relevant, studios, rooms and capacity."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a yoga class, pilates class, reformer session or private appointment with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Capacity, memberships and waiting lists",
          description: "Set available places, use a waiting list and connect registration with memberships or visit packages."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a yoga class, pilates class, reformer session or private appointment.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Remaining places, registrations and packages in one workflow",
      screenshotDescription: "Participants see available classes and places while the team tracks the group list and active memberships or packages.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For yoga studios, pilates studios and class-based businesses",
      audiences: ["Yoga studios", "Pilates studios", "Reformer pilates", "Independent instructors", "Training centres", "Group classes", "Membership studios", "Multi-location studios"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for yoga & pilates",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can I create a recurring weekly class schedule?",
          answer: "Yes. Recurring appointments support regular groups where you can change one occurrence or all future appointments."
        }
      ],
      finalTitle: "Simplify yoga and pilates registration and membership tracking",
      finalDescription: "Start a 14-day trial and configure groups, capacity, recurrence and packages."
    }
  },
  petServices: {
    sl: {
      navLabel: "Storitve za hišne ljubljenčke",
      cardCta: "Calendra za pet storitve",
      eyebrow: "Calendra za storitve za hišne ljubljenčke",
      title: "Program za naročanje za pasje salone in storitve za hišne ljubljenčke",
      intro: "Calendra pomaga organizirati termine za nego, striženje, varstvo, trening ali druge storitve za hišne ljubljenčke. Urniki izvajalcev, opomniki, podatki skrbnikov, plačila in računi so povezani na enem mestu.",
      heroPoints: ["Termini po izvajalcih, lokacijah in vrstah storitev", "Spletno naročanje ter opomniki za skrbnike", "Zgodovina obiskov, opombe, plačila in računi"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za nego psa, striženje, trening, varstvo ali drugo storitev vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost negovalcev, trenerjev in drugih izvajalcev ter po potrebi delovnih mest, prostorov in lokacij, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po negovalcev, trenerjev in drugih izvajalcev, storitvah, lokacijah in po potrebi delovnih mest, prostorov in lokacij."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite nego psa, striženje, trening, varstvo ali drugo storitev z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Skrbniki, živali in zgodovina storitev",
          description: "Organizirajte kontakt skrbnika skupaj z informacijami, ki jih potrebujete za naslednjo rezervacijo in zgodovino storitev."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere nego psa, striženje, trening, varstvo ali drugo storitev.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Termini in storitve za ljubljenčke v enem koledarju",
      screenshotDescription: "Izvajalci vidijo vrsto storitve, trajanje, stranko oziroma skrbnika in razpoložljivost ekipe ali prostora.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za pasje salone, groomerje, trenerje in druge pet storitve",
      audiences: ["Pasji saloni", "Pet grooming", "Trenerji psov", "Varstvo živali", "Sprehajalci psov", "Pet spa", "Mobilni groomerji", "Ponudniki z več lokacijami"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za storitve za hišne ljubljenčke",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko hranim podatke o skrbniku in opombe za naslednji obisk?",
          answer: "Da. Profil stranke lahko vsebuje kontaktne podatke, zgodovino terminov, opombe in polja po meri za vaš delovni proces."
        }
      ],
      finalTitle: "Poenostavite naročanje za pet storitve",
      finalDescription: "Preizkusite Calendro 14 dni ter nastavite izvajalce, storitve, lokacije in opomnike."
    },
    en: {
      navLabel: "Pet services",
      cardCta: "Calendra for pet services",
      eyebrow: "Calendra for pet services",
      title: "Booking software for pet grooming and pet-service businesses",
      intro: "Calendra helps organise appointments for grooming, training, pet care and other pet services. Provider schedules, reminders, owner information, payments and invoices stay connected in one place.",
      heroPoints: ["Appointments by provider, location and service type", "Online booking and reminders for pet owners", "Visit history, notes, payments and invoices"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around pet grooming, clipping, training, pet care or another service take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of groomers, trainers and other providers and, where needed, workstations, rooms and locations to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by groomers, trainers and other providers, services, locations and, where relevant, workstations, rooms and locations."
        },
        {
          title: "Services with flexible duration",
          description: "Configure pet grooming, clipping, training, pet care or another service with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Owners, pets and service history",
          description: "Keep owner contact details together with information useful for the next booking and the service history."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses pet grooming, clipping, training, pet care or another service.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "Pet-service appointments in one calendar",
      screenshotDescription: "Providers can see the service type, duration, client or owner and the availability of the team or workspace.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For groomers, dog trainers and other pet-service businesses",
      audiences: ["Pet grooming salons", "Dog groomers", "Dog trainers", "Pet sitting", "Dog walkers", "Pet spas", "Mobile groomers", "Multi-location pet services"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for pet services",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can I keep owner details and notes for the next visit?",
          answer: "Yes. Client profiles can include contact details, appointment history, notes and custom fields for your workflow."
        }
      ],
      finalTitle: "Simplify booking for your pet-service business",
      finalDescription: "Try Calendra for 14 days and configure providers, services, locations and reminders."
    }
  },
  educationCoaching: {
    sl: {
      navLabel: "Izobraževanje & coaching",
      cardCta: "Calendra za izobraževanje & coaching",
      eyebrow: "Calendra za izobraževanje in coaching",
      title: "Program za naročanje za coachinge, tečaje in izobraževanja",
      intro: "Calendra poveže individualna svetovanja, tečaje, skupinske termine, spletna srečanja, ponovitve, udeležence, pakete in plačila. Primerna je za delo ena na ena in za programe z omejenim številom mest.",
      heroPoints: ["Individualni termini, tečaji in skupinske izvedbe", "Zoom, ponavljajoči termini in spletne prijave", "Kapaciteta, paketi, plačila in evidenca udeležencev"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za coaching srečanje, individualno uro, delavnico ali tečaj vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost coachev, mentorjev in predavateljev ter po potrebi učilnic, spletnih srečanj in kapacitet, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po coachev, mentorjev in predavateljev, storitvah, lokacijah in po potrebi učilnic, spletnih srečanj in kapacitet."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite coaching srečanje, individualno uro, delavnico ali tečaj z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Skupine, Zoom in paketi",
          description: "Upravljajte omejeno število mest, povežite spletna srečanja z Zoomom in ponudite pakete individualnih ali skupinskih obiskov."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere coaching srečanje, individualno uro, delavnico ali tečaj.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Individualna srečanja in skupine v istem urniku",
      screenshotDescription: "Koledar poveže izvajalca, udeležence, prostor ali spletno izvedbo ter po potrebi kapaciteto posameznega termina.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za coache, mentorje, učitelje in ponudnike tečajev",
      audiences: ["Poslovni coaching", "Life coaching", "Mentorstvo", "Jezikovni tečaji", "Individualne ure", "Delavnice", "Izobraževalni centri", "Spletna izobraževanja"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za izobraževanje & coaching",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Ali lahko istočasno vodim individualne ure in skupinske tečaje?",
          answer: "Da. Calendra podpira individualne termine in skupine, zato lahko oba načina izvajanja vodite v istem urniku."
        }
      ],
      finalTitle: "Uredite termine, tečaje in coaching brez ločenih seznamov",
      finalDescription: "Začnite s 14-dnevnim preizkusom ter nastavite individualne termine, skupine, Zoom in pakete."
    },
    en: {
      navLabel: "Education & coaching",
      cardCta: "Calendra for education & coaching",
      eyebrow: "Calendra for education and coaching",
      title: "Booking software for coaching, courses and education",
      intro: "Calendra connects one-to-one sessions, courses, group appointments, online meetings, recurrence, participants, packages and payments. It works for individual delivery as well as programmes with limited places.",
      heroPoints: ["Individual appointments, courses and group sessions", "Zoom, recurring appointments and online registration", "Capacity, packages, payments and participant records"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around a coaching session, private lesson, workshop or course take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of coaches, mentors and educators and, where needed, classrooms, online meetings and capacity to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by coaches, mentors and educators, services, locations and, where relevant, classrooms, online meetings and capacity."
        },
        {
          title: "Services with flexible duration",
          description: "Configure a coaching session, private lesson, workshop or course with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Groups, Zoom and packages",
          description: "Manage limited places, connect online meetings with Zoom and offer packages for individual or group sessions."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses a coaching session, private lesson, workshop or course.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "One-to-one sessions and groups in the same schedule",
      screenshotDescription: "The calendar connects provider, participants, room or online delivery and, when needed, appointment capacity.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For coaches, mentors, teachers and course providers",
      audiences: ["Business coaching", "Life coaching", "Mentoring", "Language courses", "Private lessons", "Workshops", "Education centres", "Online education"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for education & coaching",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "Can I manage private lessons and group courses at the same time?",
          answer: "Yes. Calendra supports individual appointments and groups, so both delivery models can stay in the same schedule."
        }
      ],
      finalTitle: "Organise appointments, courses and coaching without separate lists",
      finalDescription: "Start a 14-day trial and configure private sessions, groups, Zoom and packages."
    }
  },
  otherServices: {
    sl: {
      navLabel: "Druge storitvene dejavnosti",
      cardCta: "Calendra za druge storitve",
      eyebrow: "Calendra za druge storitvene dejavnosti",
      title: "Program za naročanje za druge storitvene dejavnosti",
      intro: "Če vaše dejavnosti ni med izpostavljenimi primeri, lahko Calendro prilagodite svojemu načinu dela. Kombinirajte termine, zaposlene, lokacije, prostore, spletno naročanje, opomnike, plačila in račune glede na storitve, ki jih izvajate.",
      heroPoints: ["Prilagodljive storitve, trajanja in pravila naročanja", "Zaposleni, lokacije, prostori in omejeni viri", "Spletno naročanje, opomniki, plačila in računi"],
      problemsEyebrow: "Manj administracije",
      problemsTitle: "Manj usklajevanja, boljši pregled nad termini",
      problemsIntro: "Calendra poveže naročanje, razpoložljivost in podatke o strankah v en delovni tok.",
      problems: [
        {
          title: "Ročno usklajevanje terminov",
          description: "Klici in sporočila za izbrano storitev ali termin vzamejo čas. Spletno naročanje omogoči izbiro prostega termina tudi takrat, ko se ne morete oglasiti."
        },
        {
          title: "Prekrivanje razpoložljivosti",
          description: "Calendra pri terminu poveže razpoložljivost zaposlenih in izvajalcev ter po potrebi lokacij, prostorov in drugih virov, da je urnik bolj zanesljiv."
        },
        {
          title: "Odpovedi in pozabljeni termini",
          description: "Potrditve, opomniki ter povezave za spremembo ali odpoved zmanjšajo nesporazume in ročno komunikacijo."
        },
        {
          title: "Razpršeni podatki",
          description: "Zgodovina terminov, opombe, plačila in računi ostanejo povezani s profilom stranke namesto v več ločenih orodjih."
        }
      ],
      featuresEyebrow: "Funkcionalnosti za vašo dejavnost",
      featuresTitle: "Vse potrebno za urejen proces naročanja",
      featuresIntro: "Uporabite samo funkcionalnosti, ki jih potrebujete, in jih prilagodite načinu dela svoje ekipe.",
      features: [
        {
          title: "Koledar in razpoložljivost",
          description: "Preglejte termine po zaposlenih in izvajalcev, storitvah, lokacijah in po potrebi lokacij, prostorov in drugih virov."
        },
        {
          title: "Storitve z različnim trajanjem",
          description: "Nastavite izbrano storitev ali termin z ustreznim trajanjem, ceno, izvajalci in pravili naročanja."
        },
        {
          title: "Spletno naročanje",
          description: "Strankam ponudite javno povezavo ali rezervacijski vtičnik na svoji spletni strani."
        },
        {
          title: "Opomniki in spremembe",
          description: "Pošljite e-poštna ali SMS obvestila ter omogočite varno prestavljanje oziroma odpoved v okviru svojih pravil."
        },
        {
          title: "Profil stranke",
          description: "Kontaktni podatki, zgodovina terminov, opombe, dokumenti in polja po meri ostanejo na enem mestu."
        },
        {
          title: "Modularne funkcionalnosti",
          description: "Vključite funkcionalnosti, ki jih potrebujete, ter organizirajte storitve, pravila in procese glede na svoj način dela."
        }
      ],
      workflowEyebrow: "Od rezervacije do izvedbe",
      workflowTitle: "Kako poteka naročanje v Calendri",
      workflow: ["Stranka izbere izbrano storitev ali termin.", "Calendra ponudi samo termine, ki ustrezajo nastavljenemu delovnemu času in razpoložljivosti.", "Stranka izbere prost termin in po potrebi izvajalca ali lokacijo.", "Po rezervaciji prejme potrditev in opomnik ter lahko termin spremeni ali odpove, če to omogočite.", "Po izvedbi ostanejo obisk, plačilo, račun in naslednji koraki povezani s profilom stranke."],
      screenshotEyebrow: "Pregleden urnik",
      screenshotTitle: "Prilagodljiv koledar za različne storitvene procese",
      screenshotDescription: "Koledar je mogoče organizirati po izvajalcih, storitvah in lokacijah, dodatne funkcionalnosti pa vključite glede na potrebe podjetja.",
      audienceEyebrow: "Primerno za",
      audienceTitle: "Za storitvena podjetja, ki potrebujejo prilagodljiv urnik",
      audiences: ["Samostojni podjetniki", "Storitvene ekipe", "Podjetja z več lokacijami", "Terenske storitve", "Studii in centri", "Individualne storitve", "Skupinske storitve", "Druge dejavnosti po naročilu"],
      faqEyebrow: "Pogosta vprašanja",
      faqTitle: "Calendra za druge storitvene dejavnosti",
      faq: [
        {
          question: "Ali se lahko stranke naročijo same prek spleta?",
          answer: "Da. Uporabite lahko javno povezavo ali rezervacijski vtičnik. Sami določite, katere storitve, izvajalci in termini so na voljo."
        },
        {
          question: "Ali lahko storitve trajajo različno dolgo?",
          answer: "Da. Vsaka storitev ima lahko svoje trajanje, ceno, izvajalce in pravila razpoložljivosti."
        },
        {
          question: "Ali lahko Calendro uporablja več zaposlenih?",
          answer: "Da. Dodate lahko več uporabnikov in njihove urnike, lokacije ter vloge prilagodite organizaciji podjetja."
        },
        {
          question: "Ali Calendra pošilja opomnike?",
          answer: "Da. Podprta so e-poštna in SMS obvestila glede na izbrani paket in nastavitve."
        },
        {
          question: "Kaj če moje dejavnosti ni na seznamu?",
          answer: "To ni težava. Če delo temelji na terminih, strankah, zaposlenih ali rezervacijah, lahko večino procesov nastavite z obstoječimi funkcionalnostmi Calendre. Za posebne potrebe se lahko pogovorimo o ustrezni konfiguraciji."
        }
      ],
      finalTitle: "Prilagodite Calendro svojemu storitvenemu podjetju",
      finalDescription: "Začnite s 14-dnevnim preizkusom ali nas kontaktirajte, če želite preveriti najboljši način nastavitve za svojo dejavnost."
    },
    en: {
      navLabel: "Other service businesses",
      cardCta: "Calendra for other services",
      eyebrow: "Calendra for other service businesses",
      title: "Booking software for other service businesses",
      intro: "If your industry is not one of the highlighted examples, Calendra can still adapt to the way you work. Combine appointments, employees, locations, rooms, online booking, reminders, payments and invoices around the services you deliver.",
      heroPoints: ["Flexible services, durations and booking rules", "Employees, locations, rooms and limited resources", "Online booking, reminders, payments and invoices"],
      problemsEyebrow: "Less administration",
      problemsTitle: "Less coordination and a clearer appointment workflow",
      problemsIntro: "Calendra connects booking, availability and client information in one workflow.",
      problems: [
        {
          title: "Manual appointment coordination",
          description: "Calls and messages around your chosen service or appointment take time. Online booking lets clients choose an available appointment even when you cannot answer immediately."
        },
        {
          title: "Availability overlaps",
          description: "Calendra connects the availability of employees and providers and, where needed, locations, rooms and other resources to keep the schedule reliable."
        },
        {
          title: "Cancellations and missed appointments",
          description: "Confirmations, reminders and rescheduling or cancellation links reduce misunderstandings and manual communication."
        },
        {
          title: "Scattered information",
          description: "Appointment history, notes, payments and invoices stay connected to the client profile instead of being spread across several tools."
        }
      ],
      featuresEyebrow: "Features for your industry",
      featuresTitle: "Everything needed for an organised booking process",
      featuresIntro: "Use the features you need and adapt them to the way your team works.",
      features: [
        {
          title: "Calendar and availability",
          description: "View appointments by employees and providers, services, locations and, where relevant, locations, rooms and other resources."
        },
        {
          title: "Services with flexible duration",
          description: "Configure your chosen service or appointment with the right duration, price, eligible providers and booking rules."
        },
        {
          title: "Online booking",
          description: "Offer clients a public booking link or embed the booking widget on your own website."
        },
        {
          title: "Reminders and changes",
          description: "Send email or SMS notifications and allow secure rescheduling or cancellation within your rules."
        },
        {
          title: "Client profile",
          description: "Contact details, appointment history, notes, documents and custom fields stay together."
        },
        {
          title: "Modular features",
          description: "Enable the features you need and organise services, rules and workflows around the way your business operates."
        }
      ],
      workflowEyebrow: "From booking to delivery",
      workflowTitle: "How booking works in Calendra",
      workflow: ["The client chooses your chosen service or appointment.", "Calendra offers only times that match working hours and configured availability.", "The client selects an available time and, when relevant, a provider or location.", "After booking they receive a confirmation and reminder and can reschedule or cancel when you allow it.", "After delivery, the visit, payment, invoice and next steps remain connected to the client profile."],
      screenshotEyebrow: "A clear schedule",
      screenshotTitle: "A flexible calendar for different service workflows",
      screenshotDescription: "The calendar can be organised by provider, service and location while additional features are enabled according to your business needs.",
      audienceEyebrow: "Suitable for",
      audienceTitle: "For service businesses that need a flexible schedule",
      audiences: ["Independent professionals", "Service teams", "Multi-location businesses", "Field services", "Studios and centres", "Individual services", "Group services", "Other appointment-based businesses"],
      faqEyebrow: "Frequently asked questions",
      faqTitle: "Calendra for other service businesses",
      faq: [
        {
          question: "Can clients book themselves online?",
          answer: "Yes. Use a public booking link or website widget and decide which services, providers and times are available."
        },
        {
          question: "Can services have different durations?",
          answer: "Yes. Every service can have its own duration, price, eligible providers and availability rules."
        },
        {
          question: "Can several employees use Calendra?",
          answer: "Yes. Add multiple users and configure their schedules, locations and roles around your organisation."
        },
        {
          question: "Does Calendra send reminders?",
          answer: "Yes. Email and SMS notifications are supported depending on the selected plan and configuration."
        },
        {
          question: "What if my industry is not listed?",
          answer: "That is not a problem. If your work involves appointments, clients, employees or reservations, many workflows can be configured with Calendra’s existing features. For unusual requirements, contact us to discuss the right setup."
        }
      ],
      finalTitle: "Adapt Calendra to your service business",
      finalDescription: "Start a 14-day trial or contact us if you want to confirm the best setup for your industry."
    }
  }
};

const content: Record<IndustryRouteKey, Record<SiteLanguage, IndustryContent>> = {
  ...legacyContent,
  ...businessTypeContent,
};

export const getIndustryContent = (routeKey: IndustryRouteKey, language: SiteLanguage) => content[routeKey][language];

export const isIndustryRouteKey = (routeKey: CanonicalRouteKey | undefined): routeKey is IndustryRouteKey =>
  Boolean(routeKey && ALL_INDUSTRY_ROUTE_KEYS.includes(routeKey as IndustryRouteKey));
