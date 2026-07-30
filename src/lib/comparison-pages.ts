import type { SiteLanguage } from "@/lib/site-language";
import { COMPARISON_SLUGS, type ComparisonSlug } from "@/lib/comparison-routes";

/**
 * Slugs, paths and pathname matching live in `comparison-routes.ts` so the
 * router can resolve a comparison URL without loading every competitor's prose.
 * They are re-exported here because most callers want both halves.
 */
export * from "@/lib/comparison-routes";

/**
 * A single row of the comparison table. `competitor` is written as a statement
 * about how that product is positioned rather than a feature tick, because a
 * tick goes stale the week the other vendor ships something and a reader cannot
 * tell whether a missing tick means "absent" or "not checked".
 */
type ComparisonRow = {
  dimension: string;
  calendra: string;
  competitor: string;
};

type ComparisonContent = {
  /** Short label for navigation, cards and the comparison index. */
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Answer-first paragraph, also used for the speakable region. */
  answer: string;
  intro: string;
  positioningTitle: string;
  positioning: string;
  tableTitle: string;
  tableIntro: string;
  rows: ComparisonRow[];
  chooseThemTitle: string;
  chooseThemIntro: string;
  chooseThem: string[];
  chooseUsTitle: string;
  chooseUsIntro: string;
  chooseUs: string[];
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalDescription: string;
};

type Comparison = {
  slug: ComparisonSlug;
  competitorName: string;
  /**
   * Date the competitor's public positioning was last reviewed. Rendered on the
   * page: a comparison with no review date is the kind of page readers and
   * search engines are right to distrust.
   */
  lastReviewed: string;
  competitorUrl: string;
  content: Record<SiteLanguage, ComparisonContent>;
};

const comparisons: Record<ComparisonSlug, Comparison> = {
  calendly: {
    slug: "calendly",
    competitorName: "Calendly",
    lastReviewed: "2026-07-29",
    competitorUrl: "https://calendly.com",
    content: {
      sl: {
        navLabel: "Calendly",
        title: "Calendra ali Calendly",
        metaTitle: "Calendra ali Calendly: primerjava za storitvena podjetja | Calendra",
        metaDescription:
          "Iskrena primerjava Calendre in Calendlyja: kdaj je pravi izbor orodje za usklajevanje sestankov in kdaj program za vodenje storitvenega podjetja.",
        answer:
          "Calendly je orodje za usklajevanje sestankov: odlično reši iskanje skupnega termina med dvema koledarjema. Calendra je program za vodenje storitvenega podjetja, ki poleg terminov pokriva zaposlene, prostore, račune in slovensko davčno potrjevanje. Če prodajate svoj čas na daljavo, je Calendly pogosto dovolj.",
        intro:
          "Calendly in Calendra se pogosto pojavita v isti primerjavi, čeprav rešujeta različni nalogi. Ta stran pojasni, kje je meja, da ne boste plačevali za sistem, ki ga ne potrebujete, in ne bo obratno.",
        positioningTitle: "Kaj je Calendly",
        positioning:
          "Calendly je namenjen usklajevanju sestankov. Poveže se z vašim koledarjem, pokaže proste termine in odpravi izmenjavo sporočil o tem, kdaj se dobiva. V tem je zelo dober in za mnoge poklice je to celotna potreba.",
        tableTitle: "Kje se razlikujeta",
        tableIntro:
          "Vrstice so zapisane kot izhodišče za vaše preverjanje, ne kot dokončna trditev. Oba ponudnika funkcionalnosti redno spreminjata.",
        rows: [
          { dimension: "Osnovni namen", calendra: "Vodenje storitvenega podjetja od termina do računa", competitor: "Usklajevanje sestankov med koledarji" },
          { dimension: "Zaposleni in prostori", calendra: "Razpoložljivost upošteva zaposlene, prostore in opremo", competitor: "Osredotočeno na koledar posameznika in ekipne razporeditve" },
          { dimension: "Izdaja računov", calendra: "Račun nastane iz izvedenega termina", competitor: "Ni namenjeno izdaji računov" },
          { dimension: "Slovensko davčno potrjevanje", calendra: "Na voljo kot dodatek", competitor: "Ni predvideno" },
          { dimension: "SMS opomniki", calendra: "Vključeni v izvedbo rezervacije", competitor: "Odvisno od paketa" },
          { dimension: "Jezik vmesnika", calendra: "Slovensko in angleško", competitor: "Angleško in izbrani jeziki" },
          { dimension: "Podpora", calendra: "V slovenščini, ista ekipa, ki razvija izdelek", competitor: "Mednarodna podpora" },
        ],
        chooseThemTitle: "Kdaj izberite Calendly",
        chooseThemIntro: "Trije primeri, v katerih je Calendly boljša izbira in vam Calendre ne priporočamo.",
        chooseThem: [
          "Vaše delo so sestanki na daljavo in ne storitve na lokaciji.",
          "Ne izdajate računov iz sistema za naročanje, ker to počne računovodstvo ali drug program.",
          "Potrebujete predvsem povezavo s svojim osebnim koledarjem in nič drugega.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra ima smisel, ko naročanje ni ločeno od poslovanja.",
        chooseUs: [
          "Storitve izvajate na lokaciji, z zaposlenimi, kabinami ali opremo.",
          "Iz termina morate izdati račun in prejemate plačila na lokaciji.",
          "Potrebujete slovenski vmesnik za ekipo in slovensko podporo.",
          "Želite en sistem za termine, stranke, opomnike in račune.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali lahko Calendro uporabljam samo za sestanke, kot Calendly?", answer: "Da. Če potrebujete le javno povezavo za rezervacijo in opomnike, drugih delov sistema ni treba nastaviti. Vendar bo v tem primeru Calendly za vaš namen enostavnejši." },
          { question: "Ali Calendra podpira videoklice?", answer: "Da, prek povezave z Zoomom se ob rezervaciji videotermina samodejno ustvari povezava do srečanja." },
          { question: "Ali lahko podatke preselim iz Calendlyja?", answer: "Termine in stranke lahko uvozite iz izvoženih datotek. Ker je struktura podatkov pri obeh orodjih drugačna, uvoz običajno pregledamo skupaj." },
          { question: "Kdaj Calendly ni dovolj?", answer: "Ko potrebujete izdajo računov, davčno potrjevanje, razpoložljivost po prostorih ali evidenco strank z zgodovino storitev." },
        ],
        finalTitle: "Preizkusite Calendro na svojih storitvah",
        finalDescription: "Nastavitev traja približno 15 minut. Če želite, jo opravimo skupaj na predstavitvi.",
      },
      en: {
        navLabel: "Calendly",
        title: "Calendra or Calendly",
        metaTitle: "Calendra or Calendly: a comparison for service businesses | Calendra",
        metaDescription:
          "An honest comparison of Calendra and Calendly: when a meeting scheduler is the right tool and when you need software to run a service business.",
        answer:
          "Calendly is a meeting scheduler: it solves finding a shared slot between two calendars very well. Calendra is software for running a service business, covering employees, rooms, invoicing and Slovenian fiscal verification alongside appointments. If you sell your time remotely, Calendly is often enough.",
        intro:
          "Calendly and Calendra turn up in the same comparison often, even though they solve different problems. This page explains where the line falls, so you neither pay for a system you do not need nor outgrow one in a month.",
        positioningTitle: "What Calendly is",
        positioning:
          "Calendly exists to coordinate meetings. It connects to your calendar, shows free slots and removes the back-and-forth about when to meet. It is very good at that, and for many professions that is the entire requirement.",
        tableTitle: "Where they differ",
        tableIntro:
          "These rows are a starting point for your own checks rather than a final claim. Both vendors change their feature sets regularly.",
        rows: [
          { dimension: "Core purpose", calendra: "Running a service business from appointment to invoice", competitor: "Coordinating meetings between calendars" },
          { dimension: "Employees and rooms", calendra: "Availability accounts for employees, rooms and equipment", competitor: "Focused on individual calendars and team routing" },
          { dimension: "Invoicing", calendra: "An invoice is created from the completed appointment", competitor: "Not intended for invoicing" },
          { dimension: "Slovenian fiscal verification", calendra: "Available as an add-on", competitor: "Not in scope" },
          { dimension: "SMS reminders", calendra: "Part of delivering the booking", competitor: "Depends on the plan" },
          { dimension: "Interface language", calendra: "Slovenian and English", competitor: "English and selected languages" },
          { dimension: "Support", calendra: "In Slovenian, from the team that builds the product", competitor: "International support" },
        ],
        chooseThemTitle: "When to choose Calendly",
        chooseThemIntro: "Three cases where Calendly is the better choice and we would not recommend Calendra.",
        chooseThem: [
          "Your work is remote meetings rather than services delivered on site.",
          "You do not invoice from your booking system, because accounting or another tool does that.",
          "You mainly need a connection to your own calendar and nothing else.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense once booking is not separate from running the business.",
        chooseUs: [
          "You deliver services on site, with employees, treatment rooms or equipment.",
          "You need to invoice from the appointment and you take payment on site.",
          "Your team needs a Slovenian interface and Slovenian-language support.",
          "You want one system for appointments, clients, reminders and invoices.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Can I use Calendra only for meetings, like Calendly?", answer: "Yes. If all you need is a public booking link and reminders, the other parts of the system can stay unconfigured. That said, Calendly will be simpler for that particular purpose." },
          { question: "Does Calendra support video calls?", answer: "Yes. With the Zoom connection, a meeting link is created automatically when a video appointment is booked." },
          { question: "Can I migrate my data from Calendly?", answer: "Appointments and contacts can be imported from exported files. Because the two tools structure data differently, we usually review the import together." },
          { question: "When is Calendly not enough?", answer: "When you need invoicing, fiscal verification, room-level availability, or a client record with service history." },
        ],
        finalTitle: "Try Calendra against your own services",
        finalDescription: "Setup takes about 15 minutes. If you prefer, we will do it together on a demo call.",
      },
    },
  },

  booksy: {
    slug: "booksy",
    competitorName: "Booksy",
    lastReviewed: "2026-07-29",
    competitorUrl: "https://booksy.com",
    content: {
      sl: {
        navLabel: "Booksy",
        title: "Calendra ali Booksy",
        metaTitle: "Calendra ali Booksy: primerjava za salone | Calendra",
        metaDescription:
          "Primerjava Calendre in Booksyja: razlika med tržnico za iskanje novih strank in lastnim sistemom za naročanje, ki ga nadzirate sami.",
        answer:
          "Booksy je tržnica: poleg programa za naročanje prinaša aplikacijo, v kateri stranke iščejo salone in odkrijejo tudi vas. Calendra je vaš lastni sistem brez tržnice, zato ne prinaša novih strank, prinaša pa nadzor nad podatki, izdajo računov in slovensko davčno potrjevanje.",
        intro:
          "Odločitev med tržnico in lastnim sistemom ni odločitev o funkcionalnostih, ampak o tem, čigave so stranke. Ta stran predstavi obe strani, da izberete zavestno.",
        positioningTitle: "Kaj je Booksy",
        positioning:
          "Booksy združuje program za salone in potrošniško aplikacijo, v kateri uporabniki iščejo bližnje salone in rezervirajo. Za nov salon brez baze strank je to lahko zelo koristno, saj vas nekdo najde, ne da bi vas iskal.",
        tableTitle: "Kje se razlikujeta",
        tableIntro: "Vrstice preverite pri obeh ponudnikih; oba pogosto spreminjata pakete in cene.",
        rows: [
          { dimension: "Model", calendra: "Lastni sistem, brez tržnice", competitor: "Program in potrošniška tržnica" },
          { dimension: "Pridobivanje novih strank", calendra: "Prek vaše spletne strani, profilov in Google Business Profila", competitor: "Tudi prek iskanja v aplikaciji" },
          { dimension: "Čigava je stranka", calendra: "Vaša, s celotnim izvozom podatkov", competitor: "Stranka pogosto najprej pripada tržnici" },
          { dimension: "Izdaja računov", calendra: "Račun iz izvedenega termina", competitor: "Odvisno od trga in paketa" },
          { dimension: "Slovensko davčno potrjevanje", calendra: "Na voljo kot dodatek", competitor: "Preverite za slovenski trg" },
          { dimension: "Struktura cene", calendra: "Paket, dodatni uporabniki, SMS po porabi", competitor: "Naročnina in možne provizije za rezervacije iz tržnice" },
          { dimension: "Jezik in podpora", calendra: "Slovensko, lokalna ekipa", competitor: "Mednarodna platforma" },
        ],
        chooseThemTitle: "Kdaj izberite Booksy",
        chooseThemIntro: "Booksy je smiseln izbor v teh primerih in tega ne poskušamo zavijati v vato.",
        chooseThem: [
          "Odpirate nov salon in nimate baze strank, zato vam tržnica prinese prvi obisk.",
          "Delujete v mestu, kjer stranke aktivno iščejo prek aplikacij za rezervacije.",
          "Pripravljeni ste na provizijo v zamenjavo za nove stranke.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra je smiselna, ko stranke že imate in želite nadzor.",
        chooseUs: [
          "Imate stalne stranke in ne potrebujete tržnice, ki vas oglašuje ob konkurenci.",
          "Prejemate plačila na lokaciji in potrebujete davčno potrjevanje računov.",
          "Želite, da so podatki o strankah vaši in izvozljivi brez pogajanj.",
          "Potrebujete slovenski vmesnik in podporo v slovenščini.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali lahko uporabljam oboje?", answer: "Tehnično je mogoče, vendar dvojno vodenje terminov skoraj vedno pripelje do dvojnih rezervacij. Če se odločate za obe poti, naj bo eden sistem vodilni." },
          { question: "Ali Calendra prinaša nove stranke?", answer: "Ne prek tržnice. Calendra vam olajša, da stranke rezervirajo tam, kjer vas že najdejo: na vaši strani, v profilih in v Google Business Profilu." },
          { question: "Kako prenesem stranke iz Booksyja?", answer: "Iz izvoženega seznama strank in prihodnjih terminov. Priporočamo prenos stalnih strank in terminov za naslednja dva do štiri tedne." },
          { question: "Ali plačam provizijo od rezervacije?", answer: "Pri Calendri ne. Cena je naročnina po paketu, dodatni uporabniki in SMS po porabi." },
        ],
        finalTitle: "Prevzemite nadzor nad svojim koledarjem",
        finalDescription: "Preizkusite Calendro s svojimi storitvami in zaposlenimi, brez provizij od rezervacij.",
      },
      en: {
        navLabel: "Booksy",
        title: "Calendra or Booksy",
        metaTitle: "Calendra or Booksy: a comparison for salons | Calendra",
        metaDescription:
          "Comparing Calendra and Booksy: the difference between a marketplace that finds you new customers and your own booking system that you control.",
        answer:
          "Booksy is a marketplace: alongside booking software it brings a consumer app where customers search for salons and may discover you. Calendra is your own system with no marketplace, so it does not bring new customers, but it does give you control of your data, invoicing and Slovenian fiscal verification.",
        intro:
          "Choosing between a marketplace and your own system is not a decision about features. It is a decision about whose customers they are. This page sets out both sides so you choose deliberately.",
        positioningTitle: "What Booksy is",
        positioning:
          "Booksy combines salon software with a consumer app where users search for nearby salons and book. For a new salon with no client base that can be genuinely valuable, because someone finds you without having looked for you.",
        tableTitle: "Where they differ",
        tableIntro: "Verify these rows with both vendors; both change plans and pricing regularly.",
        rows: [
          { dimension: "Model", calendra: "Your own system, no marketplace", competitor: "Software plus a consumer marketplace" },
          { dimension: "Acquiring new customers", calendra: "Through your website, profiles and Google Business Profile", competitor: "Also through in-app search" },
          { dimension: "Whose customer it is", calendra: "Yours, with full data export", competitor: "The customer often belongs to the marketplace first" },
          { dimension: "Invoicing", calendra: "An invoice from the completed appointment", competitor: "Depends on the market and plan" },
          { dimension: "Slovenian fiscal verification", calendra: "Available as an add-on", competitor: "Check for the Slovenian market" },
          { dimension: "Price structure", calendra: "Plan, additional users, SMS by usage", competitor: "Subscription plus possible commission on marketplace bookings" },
          { dimension: "Language and support", calendra: "Slovenian, local team", competitor: "International platform" },
        ],
        chooseThemTitle: "When to choose Booksy",
        chooseThemIntro: "Booksy is the sensible choice in these cases, and we are not going to soften that.",
        chooseThem: [
          "You are opening a new salon with no client base, so a marketplace brings the first visit.",
          "You operate in a city where customers actively search through booking apps.",
          "You are willing to pay commission in exchange for new customers.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense once you already have customers and want control.",
        chooseUs: [
          "You have regular customers and do not need a marketplace listing you next to competitors.",
          "You take payment on site and need fiscal verification of invoices.",
          "You want client data to be yours and exportable without negotiation.",
          "You need a Slovenian interface and Slovenian-language support.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Can I use both?", answer: "Technically yes, but running two calendars almost always produces double bookings. If you do use both, keep one as the system of record." },
          { question: "Does Calendra bring new customers?", answer: "Not through a marketplace. Calendra makes it easy for customers to book where they already find you: your website, your profiles and your Google Business Profile." },
          { question: "How do I move my clients from Booksy?", answer: "From an exported client list and upcoming appointments. We recommend moving regular clients and the next two to four weeks of appointments." },
          { question: "Do I pay commission per booking?", answer: "Not with Calendra. The cost is a plan subscription, additional users and SMS by usage." },
        ],
        finalTitle: "Take control of your own calendar",
        finalDescription: "Try Calendra with your own services and employees, with no commission on bookings.",
      },
    },
  },

  fresha: {
    slug: "fresha",
    competitorName: "Fresha",
    lastReviewed: "2026-07-29",
    competitorUrl: "https://www.fresha.com",
    content: {
      sl: {
        navLabel: "Fresha",
        title: "Calendra ali Fresha",
        metaTitle: "Calendra ali Fresha: primerjava za storitvena podjetja | Calendra",
        metaDescription:
          "Primerjava Calendre in Freshe: kaj pomeni brezplačen paket s provizijami in kdaj je predvidljiva naročnina za slovenski salon ugodnejša.",
        answer:
          "Fresha je brezplačna za osnovno naročanje, prihodek pa ustvarja s provizijami pri plačilih in rezervacijah iz svoje tržnice. Calendra ima naročnino brez provizij od rezervacij in pokriva slovensko izdajo računov ter davčno potrjevanje. Kaj je ceneje, je odvisno od tega, kolikšen del vašega prometa gre prek spletnih plačil.",
        intro:
          "Fresha je pogosto predstavljena kot brezplačna možnost, kar je delno res. Da bo primerjava uporabna, je treba pogledati, kje je prihodek in kaj to pomeni pri vašem obsegu.",
        positioningTitle: "Kaj je Fresha",
        positioning:
          "Fresha ponuja koledar in naročanje brez naročnine, k temu pa tržnico in plačilno storitev. Model je razumljiv: uporaba programa je brezplačna, plačate pri plačilnih storitvah in pri novih strankah iz tržnice.",
        tableTitle: "Kje se razlikujeta",
        tableIntro: "Preverite aktualne provizije in pakete pri obeh ponudnikih, preden se odločite.",
        rows: [
          { dimension: "Model plačila", calendra: "Naročnina po paketu, brez provizije od rezervacij", competitor: "Brez naročnine za osnovo, provizije pri plačilih in tržnici" },
          { dimension: "Predvidljivost stroška", calendra: "Znan mesečni znesek", competitor: "Odvisen od deleža spletnih plačil" },
          { dimension: "Tržnica", calendra: "Ni je", competitor: "Del platforme" },
          { dimension: "Izdaja računov", calendra: "Račun iz izvedenega termina", competitor: "Odvisno od trga" },
          { dimension: "Slovensko davčno potrjevanje", calendra: "Na voljo kot dodatek", competitor: "Preverite za slovenski trg" },
          { dimension: "SMS opomniki", calendra: "Po porabi, cena na sporočilo", competitor: "Odvisno od paketa in trga" },
          { dimension: "Jezik in podpora", calendra: "Slovensko, lokalna ekipa", competitor: "Mednarodna platforma" },
        ],
        chooseThemTitle: "Kdaj izberite Fresho",
        chooseThemIntro: "Fresha je za nekatere salone boljša izbira in to je treba povedati jasno.",
        chooseThem: [
          "Želite začeti brez mesečnega stroška in vam provizija pri plačilih ni težava.",
          "Večina strank plača na lokaciji, zato provizij skoraj ne bo.",
          "Tržnica vam prinaša dovolj novih strank, da provizijo upraviči.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra je smiselna, ko potrebujete predvidljiv strošek in slovenske račune.",
        chooseUs: [
          "Zbirate predplačila in ne želite, da strošek raste s prometom.",
          "Potrebujete izdajo računov in davčno potrjevanje po slovenskih pravilih.",
          "Želite podporo in vmesnik v slovenščini za celotno ekipo.",
          "Naročanje želite povezati z upravljanjem strank in računi v enem sistemu.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali je brezplačno vedno ceneje?", answer: "Ne nujno. Če velik del prometa poteka prek spletnih plačil, provizije lahko presežejo naročnino. Če pretežno prejemate plačila na lokaciji, je brezplačna osnova res cenejša." },
          { question: "Ali Calendra zaračuna provizijo od rezervacij?", answer: "Ne. Plačate paket, dodatne uporabnike in SMS po porabi. Provizijo za spletna plačila zadrži plačilni ponudnik." },
          { question: "Kaj se zgodi s podatki, če zamenjam program?", answer: "Pri Calendri lahko stranke, termine in račune izvozite sami. Pri izbiri katerega koli ponudnika to preverite vnaprej." },
          { question: "Kako primerjam skupni strošek?", answer: "Vzemite mesečno število terminov, delež spletnih plačil in povprečno vrednost storitve, nato preračunajte provizije in naročnino na isti mesec." },
        ],
        finalTitle: "Izračunajmo skupaj, kaj je za vas ugodneje",
        finalDescription: "Na predstavitvi preračunamo vaš primer z vašimi številkami, brez obveznosti.",
      },
      en: {
        navLabel: "Fresha",
        title: "Calendra or Fresha",
        metaTitle: "Calendra or Fresha: a comparison for service businesses | Calendra",
        metaDescription:
          "Comparing Calendra and Fresha: what a free plan with commissions really costs, and when a predictable subscription works out cheaper.",
        answer:
          "Fresha is free for basic booking and earns revenue through commissions on payments and marketplace bookings. Calendra charges a subscription with no commission on bookings and covers Slovenian invoicing and fiscal verification. Which is cheaper depends on what share of your revenue runs through online payments.",
        intro:
          "Fresha is often described as the free option, which is partly true. For the comparison to be useful, you have to look at where the revenue comes from and what that means at your volume.",
        positioningTitle: "What Fresha is",
        positioning:
          "Fresha offers a calendar and booking with no subscription, plus a marketplace and a payments service. The model is transparent: using the software is free, and you pay through payment processing and through new customers from the marketplace.",
        tableTitle: "Where they differ",
        tableIntro: "Check current commissions and plans with both vendors before deciding.",
        rows: [
          { dimension: "Payment model", calendra: "Plan subscription, no commission on bookings", competitor: "No subscription for the basics, commission on payments and marketplace" },
          { dimension: "Cost predictability", calendra: "A known monthly amount", competitor: "Varies with your share of online payments" },
          { dimension: "Marketplace", calendra: "None", competitor: "Part of the platform" },
          { dimension: "Invoicing", calendra: "An invoice from the completed appointment", competitor: "Depends on the market" },
          { dimension: "Slovenian fiscal verification", calendra: "Available as an add-on", competitor: "Check for the Slovenian market" },
          { dimension: "SMS reminders", calendra: "By usage, priced per message", competitor: "Depends on plan and market" },
          { dimension: "Language and support", calendra: "Slovenian, local team", competitor: "International platform" },
        ],
        chooseThemTitle: "When to choose Fresha",
        chooseThemIntro: "Fresha is the better choice for some salons, and that deserves to be said plainly.",
        chooseThem: [
          "You want to start with no monthly cost and are comfortable with payment commissions.",
          "Most customers pay on site, so commissions will barely apply.",
          "The marketplace brings you enough new customers to justify the commission.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense when you need a predictable cost and Slovenian invoices.",
        chooseUs: [
          "You collect deposits and do not want your cost to rise with revenue.",
          "You need invoicing and fiscal verification under Slovenian rules.",
          "You want support and an interface in Slovenian for the whole team.",
          "You want booking connected to client management and invoicing in one system.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Is free always cheaper?", answer: "Not necessarily. If a large share of revenue runs through online payments, commissions can exceed a subscription. If you mostly take payment on site, a free base plan genuinely is cheaper." },
          { question: "Does Calendra charge commission on bookings?", answer: "No. You pay for the plan, additional users and SMS by usage. The online payment fee is retained by the payment provider." },
          { question: "What happens to my data if I switch?", answer: "With Calendra you can export clients, appointments and invoices yourself. Whichever vendor you choose, check this before you commit." },
          { question: "How do I compare total cost?", answer: "Take your monthly appointment count, your share of online payments and your average service value, then work out commissions and subscription over the same month." },
        ],
        finalTitle: "Let us work out which is cheaper for you",
        finalDescription: "On a demo call we run the calculation on your numbers, with no obligation.",
      },
    },
  },

  treatwell: {
    slug: "treatwell",
    competitorName: "Treatwell",
    lastReviewed: "2026-07-29",
    competitorUrl: "https://www.treatwell.com",
    content: {
      sl: {
        navLabel: "Treatwell",
        title: "Calendra ali Treatwell",
        metaTitle: "Calendra ali Treatwell: primerjava za salone | Calendra",
        metaDescription:
          "Primerjava Calendre in Treatwella: kdaj je tržnica s prepoznavno znamko pravi kanal in kdaj potrebujete lastni sistem za naročanje.",
        answer:
          "Treatwell je predvsem tržnica lepotnih storitev z močno prepoznavnostjo med potrošniki v več evropskih državah. Calendra je lastni sistem za vodenje salona brez tržnice. Odločitev je odvisna od tega, ali potrebujete kanal za nove stranke ali orodje za obvladovanje obstoječih.",
        intro:
          "Treatwell in Calendra nista neposredna nadomestka. Prvi je predvsem prodajni kanal, druga je operativni sistem. Ta stran razloži, kdaj potrebujete katerega in kdaj oboje.",
        positioningTitle: "Kaj je Treatwell",
        positioning:
          "Treatwell je platforma, na kateri potrošniki iščejo in rezervirajo lepotne storitve, s programsko opremo za salone kot dopolnitvijo. Njegova največja prednost je prepoznavnost znamke pri strankah, ki še ne vedo, kam bi šle.",
        tableTitle: "Kje se razlikujeta",
        tableIntro: "Pogoje, provizije in razpoložljivost v Sloveniji preverite neposredno pri ponudniku.",
        rows: [
          { dimension: "Primarna vloga", calendra: "Operativni sistem salona", competitor: "Tržnica in prodajni kanal" },
          { dimension: "Vidnost pri novih strankah", calendra: "Prek vaših kanalov in Googla", competitor: "Prek prepoznavne potrošniške znamke" },
          { dimension: "Strošek na rezervacijo", calendra: "Brez provizije od rezervacij", competitor: "Provizija za rezervacije iz tržnice" },
          { dimension: "Lastništvo odnosa s stranko", calendra: "Vaše, z izvozom podatkov", competitor: "Deljeno s platformo" },
          { dimension: "Izdaja računov in davčno potrjevanje", calendra: "V sistemu, potrjevanje kot dodatek", competitor: "Preverite za slovenski trg" },
          { dimension: "Prostori, oprema in zaposleni", calendra: "Del izračuna razpoložljivosti", competitor: "Odvisno od paketa" },
          { dimension: "Jezik in podpora", calendra: "Slovensko, lokalna ekipa", competitor: "Mednarodna platforma" },
        ],
        chooseThemTitle: "Kdaj izberite Treatwell",
        chooseThemIntro: "Treatwell je smiseln, kadar je vaša glavna težava vidnost, ne organizacija.",
        chooseThem: [
          "Vaša prva težava so nove stranke, ne urnik.",
          "Delujete v okolju, kjer je platforma med potrošniki uveljavljena.",
          "Provizijo obravnavate kot strošek oglaševanja in vam je sprejemljiva.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra je smiselna, kadar je težava v organizaciji dela in v evidencah.",
        chooseUs: [
          "Imate dovolj strank, potrebujete pa red v koledarju, prostorih in ekipi.",
          "Prejemate plačila na lokaciji in potrebujete slovenske račune.",
          "Ne želite, da strošek raste s številom rezervacij.",
          "Želite, da termini, stranke in računi živijo v enem sistemu.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali lahko tržnico uporabljam za pridobivanje strank, Calendro pa za vodenje?", answer: "Da, vendar potrebujete jasno pravilo, kateri koledar je vodilni, sicer se pojavijo dvojne rezervacije. Najpogostejša rešitev je, da rezervacije iz tržnice ročno vnesete v vodilni koledar." },
          { question: "Ali Calendra oglašuje moj salon?", answer: "Ne. Calendra vam olajša rezervacijo tam, kjer vas stranke že iščejo, oglaševanja pa ne izvaja." },
          { question: "Kaj se zgodi s strankami, če zapustim tržnico?", answer: "Odvisno od pogojev platforme. To je vprašanje, ki ga je vredno razčistiti, preden na tržnico pripeljete večji del prometa." },
          { question: "Ali Calendra podpira več lokacij?", answer: "Da. Storitve, zaposlene, prostore in termine lahko organizirate po lokacijah." },
        ],
        finalTitle: "Uredite delo v salonu, ne le vidnost",
        finalDescription: "Preizkusite Calendro s svojimi storitvami, zaposlenimi in prostori.",
      },
      en: {
        navLabel: "Treatwell",
        title: "Calendra or Treatwell",
        metaTitle: "Calendra or Treatwell: a comparison for salons | Calendra",
        metaDescription:
          "Comparing Calendra and Treatwell: when a marketplace with consumer brand recognition is the right channel and when you need your own booking system.",
        answer:
          "Treatwell is primarily a beauty services marketplace with strong consumer recognition across several European countries. Calendra is your own system for running a salon, with no marketplace. The decision depends on whether you need a channel for new customers or a tool for managing existing ones.",
        intro:
          "Treatwell and Calendra are not direct substitutes. One is primarily a sales channel, the other an operational system. This page explains when you need which, and when you need both.",
        positioningTitle: "What Treatwell is",
        positioning:
          "Treatwell is a platform where consumers search for and book beauty services, with salon software alongside it. Its main strength is brand recognition among customers who do not yet know where to go.",
        tableTitle: "Where they differ",
        tableIntro: "Check terms, commissions and Slovenian availability directly with the vendor.",
        rows: [
          { dimension: "Primary role", calendra: "A salon's operational system", competitor: "A marketplace and sales channel" },
          { dimension: "Visibility to new customers", calendra: "Through your own channels and Google", competitor: "Through a recognised consumer brand" },
          { dimension: "Cost per booking", calendra: "No commission on bookings", competitor: "Commission on marketplace bookings" },
          { dimension: "Ownership of the customer relationship", calendra: "Yours, with data export", competitor: "Shared with the platform" },
          { dimension: "Invoicing and fiscal verification", calendra: "In the system, verification as an add-on", competitor: "Check for the Slovenian market" },
          { dimension: "Rooms, equipment and employees", calendra: "Part of availability logic", competitor: "Depends on the plan" },
          { dimension: "Language and support", calendra: "Slovenian, local team", competitor: "International platform" },
        ],
        chooseThemTitle: "When to choose Treatwell",
        chooseThemIntro: "Treatwell makes sense when your main problem is visibility rather than organisation.",
        chooseThem: [
          "Your first problem is new customers, not your schedule.",
          "You operate somewhere the platform is well established with consumers.",
          "You treat the commission as an advertising cost and find it acceptable.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense when the problem is how the work is organised and recorded.",
        chooseUs: [
          "You have enough customers but need order in the calendar, rooms and team.",
          "You take payment on site and need Slovenian invoices.",
          "You do not want your cost to grow with the number of bookings.",
          "You want appointments, clients and invoices in one system.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Can I use a marketplace to acquire customers and Calendra to run the business?", answer: "Yes, but you need a clear rule about which calendar is authoritative, otherwise double bookings appear. The usual solution is to enter marketplace bookings into the authoritative calendar." },
          { question: "Does Calendra advertise my salon?", answer: "No. Calendra makes booking easy where customers already look for you, but it does not run advertising." },
          { question: "What happens to my customers if I leave a marketplace?", answer: "That depends on the platform's terms. It is worth settling before you route a large share of your revenue through one." },
          { question: "Does Calendra support multiple locations?", answer: "Yes. Services, employees, rooms and appointments can be organised per location." },
        ],
        finalTitle: "Fix how the salon runs, not only how visible it is",
        finalDescription: "Try Calendra with your own services, employees and rooms.",
      },
    },
  },

  setmore: {
    slug: "setmore",
    competitorName: "Setmore",
    lastReviewed: "2026-07-29",
    competitorUrl: "https://www.setmore.com",
    content: {
      sl: {
        navLabel: "Setmore",
        title: "Calendra ali Setmore",
        metaTitle: "Calendra ali Setmore: primerjava za storitvena podjetja | Calendra",
        metaDescription:
          "Primerjava Calendre in Setmora: splošno mednarodno orodje za naročanje proti sistemu, prilagojenemu slovenskim računom in davčnemu potrjevanju.",
        answer:
          "Setmore je splošno mednarodno orodje za naročanje s pregledno ceno in velikodušnim brezplačnim paketom. Calendra je zasnovana za slovensko storitveno podjetje, zato pokriva izdajo računov, davčno potrjevanje in slovenski vmesnik. Za osnovno naročanje brez računov je Setmore pogosto dovolj.",
        intro:
          "Setmore in Calendra sta si po namenu bližje kot večina drugih primerjav na tej strani. Razlika je predvsem v tem, kako daleč gre sistem po tem, ko je termin izveden.",
        positioningTitle: "Kaj je Setmore",
        positioning:
          "Setmore je orodje za naročanje z javno stranjo za rezervacije, koledarjem in povezavami z drugimi orodji. Za mednarodne uporabnike je privlačen zaradi enostavnosti in brezplačnega paketa za manjše ekipe.",
        tableTitle: "Kje se razlikujeta",
        tableIntro: "Pakete in vključene količine preverite pri obeh ponudnikih; oba jih spreminjata.",
        rows: [
          { dimension: "Obseg", calendra: "Termini, stranke, računi, plačila", competitor: "Predvsem termini in stranke" },
          { dimension: "Slovenski računi", calendra: "Račun iz izvedenega termina", competitor: "Ni prilagojeno slovenskim pravilom" },
          { dimension: "Davčno potrjevanje", calendra: "Na voljo kot dodatek", competitor: "Ni predvideno" },
          { dimension: "Prostori in oprema", calendra: "Del izračuna razpoložljivosti", competitor: "Osredotočeno na zaposlene in storitve" },
          { dimension: "Jezik vmesnika", calendra: "Slovensko in angleško", competitor: "Angleško in izbrani jeziki" },
          { dimension: "Podpora", calendra: "V slovenščini, lokalna ekipa", competitor: "Mednarodna podpora" },
          { dimension: "Brezplačni paket", calendra: "14-dnevni preizkus", competitor: "Brezplačen paket za manjše ekipe" },
        ],
        chooseThemTitle: "Kdaj izberite Setmore",
        chooseThemIntro: "Setmore je za nekatere primere boljša izbira.",
        chooseThem: [
          "Potrebujete le naročanje in ne izdajate računov iz sistema.",
          "Delate pretežno z angleško govorečimi strankami in ekipo.",
          "Iščete brezplačen paket za majhno ekipo in vam slovenska specifika ni pomembna.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra je smiselna, ko naročanje ne sme biti ločeno od računov.",
        chooseUs: [
          "Prejemate plačila na lokaciji in potrebujete davčno potrjevanje računov.",
          "Ekipa dela v slovenščini in potrebuje podporo v slovenščini.",
          "Razpoložljivost mora upoštevati kabine, prostore ali opremo.",
          "Želite en sistem od rezervacije do izdanega računa.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali je Calendra dražja od brezplačnega paketa?", answer: "Da, Calendra je naročniška. Primerjava je smiselna le, če v izračun vključite tudi to, kar bi za račune in davčno potrjevanje potrebovali poleg brezplačnega orodja." },
          { question: "Ali lahko prenesem stranke iz Setmora?", answer: "Da, iz izvoženega seznama strank in prihodnjih terminov." },
          { question: "Ali Calendra deluje tudi v angleščini?", answer: "Da. Vmesnik in sporočila strankam so na voljo v slovenščini in angleščini." },
          { question: "Kaj če potrebujem samo naročanje?", answer: "Calendro lahko uporabljate samo za naročanje, vendar boste v tem primeru plačevali za dele sistema, ki jih ne uporabljate." },
        ],
        finalTitle: "Preverite, ali potrebujete več kot naročanje",
        finalDescription: "Če izdajate račune in prejemate plačila na lokaciji, se pogovorimo o vašem primeru.",
      },
      en: {
        navLabel: "Setmore",
        title: "Calendra or Setmore",
        metaTitle: "Calendra or Setmore: a comparison for service businesses | Calendra",
        metaDescription:
          "Comparing Calendra and Setmore: a general international booking tool versus a system built for Slovenian invoicing and fiscal verification.",
        answer:
          "Setmore is a general international booking tool with transparent pricing and a generous free plan. Calendra is built for a Slovenian service business, so it covers invoicing, fiscal verification and a Slovenian interface. For basic booking without invoices, Setmore is often enough.",
        intro:
          "Setmore and Calendra are closer in purpose than most pairings on this site. The difference is mainly in how far the system goes after the appointment has happened.",
        positioningTitle: "What Setmore is",
        positioning:
          "Setmore is a booking tool with a public booking page, a calendar and integrations with other tools. Its appeal internationally is simplicity plus a free plan for smaller teams.",
        tableTitle: "Where they differ",
        tableIntro: "Check plans and included volumes with both vendors; both change them.",
        rows: [
          { dimension: "Scope", calendra: "Appointments, clients, invoices, payments", competitor: "Primarily appointments and clients" },
          { dimension: "Slovenian invoices", calendra: "An invoice from the completed appointment", competitor: "Not adapted to Slovenian rules" },
          { dimension: "Fiscal verification", calendra: "Available as an add-on", competitor: "Not in scope" },
          { dimension: "Rooms and equipment", calendra: "Part of availability logic", competitor: "Focused on employees and services" },
          { dimension: "Interface language", calendra: "Slovenian and English", competitor: "English and selected languages" },
          { dimension: "Support", calendra: "In Slovenian, local team", competitor: "International support" },
          { dimension: "Free plan", calendra: "14-day trial", competitor: "Free plan for smaller teams" },
        ],
        chooseThemTitle: "When to choose Setmore",
        chooseThemIntro: "Setmore is the better choice in some situations.",
        chooseThem: [
          "You only need booking and do not invoice from the system.",
          "You work mainly with English-speaking customers and staff.",
          "You want a free plan for a small team and Slovenian specifics do not matter to you.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense when booking cannot be separate from invoicing.",
        chooseUs: [
          "You take payment on site and need fiscal verification of invoices.",
          "Your team works in Slovenian and needs support in Slovenian.",
          "Availability has to account for treatment rooms or equipment.",
          "You want one system from booking to issued invoice.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Is Calendra more expensive than a free plan?", answer: "Yes, Calendra is subscription-based. The comparison is only meaningful if you also include what you would need alongside a free tool to handle invoicing and fiscal verification." },
          { question: "Can I move my clients from Setmore?", answer: "Yes, from an exported client list and upcoming appointments." },
          { question: "Does Calendra work in English?", answer: "Yes. The interface and customer messages are available in Slovenian and English." },
          { question: "What if I only need booking?", answer: "You can use Calendra for booking alone, but you would be paying for parts of the system you do not use." },
        ],
        finalTitle: "Check whether you need more than booking",
        finalDescription: "If you issue invoices and take payment on site, let us talk through your case.",
      },
    },
  },

  simplybook: {
    slug: "simplybook",
    competitorName: "SimplyBook.me",
    lastReviewed: "2026-07-29",
    competitorUrl: "https://simplybook.me",
    content: {
      sl: {
        navLabel: "SimplyBook.me",
        title: "Calendra ali SimplyBook.me",
        metaTitle: "Calendra ali SimplyBook.me: primerjava | Calendra",
        metaDescription:
          "Primerjava Calendre in SimplyBook.me: modularen sistem z veliko dodatkov proti sistemu, v katerem je slovenska specifika vključena v osnovo.",
        answer:
          "SimplyBook.me je modularen: osnovni sistem je enostaven, funkcionalnosti pa dodajate kot posamezne module, kar daje veliko prilagodljivosti in zahteva nekaj nastavljanja. Calendra ima manj modulov, vendar so slovenski računi, davčno potrjevanje in slovenski vmesnik del izdelka, ne dodatek.",
        intro:
          "Oba sistema pokrivata naročanje za storitvena podjetja. Razlikujeta se po filozofiji: prilagodljivost prek modulov na eni strani, manjše število odločitev na drugi.",
        positioningTitle: "Kaj je SimplyBook.me",
        positioning:
          "SimplyBook.me je platforma za naročanje z obsežnim naborom modulov, od članstev in kuponov do prodajnih mest in prilagojenih obrazcev. Če imate nenavadno zahtevo, obstaja precejšnja verjetnost, da zanjo obstaja modul.",
        tableTitle: "Kje se razlikujeta",
        tableIntro: "Katere module potrebujete in kaj to pomeni za ceno, preverite pri ponudniku.",
        rows: [
          { dimension: "Zasnova", calendra: "Vključene funkcionalnosti brez sestavljanja modulov", competitor: "Modularna, funkcionalnosti dodajate po potrebi" },
          { dimension: "Prilagodljivost", calendra: "Osredotočena na storitvena podjetja", competitor: "Zelo široka, tudi za neobičajne primere" },
          { dimension: "Nastavitev", calendra: "Manj odločitev pri zagonu", competitor: "Več odločitev in več možnosti" },
          { dimension: "Slovenski računi in davčno potrjevanje", calendra: "V sistemu, potrjevanje kot dodatek", competitor: "Preverite za slovenski trg" },
          { dimension: "Cena", calendra: "Paket, dodatni uporabniki, SMS po porabi", competitor: "Paket z omejitvami in izbranimi moduli" },
          { dimension: "Jezik in podpora", calendra: "Slovensko, lokalna ekipa", competitor: "Mednarodna platforma z več jeziki" },
        ],
        chooseThemTitle: "Kdaj izberite SimplyBook.me",
        chooseThemIntro: "Modularnost je prava izbira v teh primerih.",
        chooseThem: [
          "Imate nenavadno zahtevo, za katero potrebujete točno določen modul.",
          "Radi sami sestavljate sistem in vam večje število nastavitev ni ovira.",
          "Slovenska davčna specifika za vas ni pomembna, ker prejemate le nakazila.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra je smiselna, ko želite manj sestavljanja in slovensko specifiko v osnovi.",
        chooseUs: [
          "Želite delujoč sistem v pol dneva, brez izbiranja med desetinami modulov.",
          "Potrebujete slovenske račune in davčno potrjevanje.",
          "Ekipa dela v slovenščini in potrebuje podporo v slovenščini.",
          "Naročanje, stranke in računi naj bodo povezani brez dodatnega modula.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali ima Calendra module?", answer: "Nekatere funkcionalnosti so na voljo kot dodatki, na primer davčna blagajna in poslovni prostor. Osnovni tok od rezervacije do računa je vključen." },
          { question: "Kaj je hitreje nastaviti?", answer: "Odvisno od zahtev. Če potrebujete standarden tok za storitveno podjetje, je manj odločitev prednost. Če potrebujete nenavadno funkcionalnost, je modularnost prednost." },
          { question: "Ali lahko prenesem podatke?", answer: "Da, iz izvoženega seznama strank in prihodnjih terminov." },
          { question: "Kako primerjam ceno?", answer: "Sestavite seznam modulov, ki jih res potrebujete, in ga primerjajte s paketom ter dodatki, ne z osnovno ceno." },
        ],
        finalTitle: "Manj sestavljanja, hitrejši zagon",
        finalDescription: "Preizkusite Calendro s svojimi storitvami in preverite, kaj vam manjka.",
      },
      en: {
        navLabel: "SimplyBook.me",
        title: "Calendra or SimplyBook.me",
        metaTitle: "Calendra or SimplyBook.me: a comparison | Calendra",
        metaDescription:
          "Comparing Calendra and SimplyBook.me: a modular system with many add-ons versus one where Slovenian specifics are built in rather than bolted on.",
        answer:
          "SimplyBook.me is modular: the base system is simple and you add capabilities as individual modules, which gives a lot of flexibility and requires some configuration. Calendra has fewer modules, but Slovenian invoicing, fiscal verification and a Slovenian interface are part of the product rather than add-ons.",
        intro:
          "Both systems cover booking for service businesses. They differ in philosophy: flexibility through modules on one side, fewer decisions on the other.",
        positioningTitle: "What SimplyBook.me is",
        positioning:
          "SimplyBook.me is a booking platform with an extensive set of modules, from memberships and coupons to point of sale and custom intake forms. If you have an unusual requirement, there is a decent chance a module exists for it.",
        tableTitle: "Where they differ",
        tableIntro: "Which modules you need, and what that does to the price, is worth checking with the vendor.",
        rows: [
          { dimension: "Design", calendra: "Capabilities included without assembling modules", competitor: "Modular, capabilities added as needed" },
          { dimension: "Flexibility", calendra: "Focused on service businesses", competitor: "Very broad, including unusual cases" },
          { dimension: "Setup", calendra: "Fewer decisions to get started", competitor: "More decisions and more options" },
          { dimension: "Slovenian invoicing and fiscal verification", calendra: "In the system, verification as an add-on", competitor: "Check for the Slovenian market" },
          { dimension: "Price", calendra: "Plan, additional users, SMS by usage", competitor: "Plan with limits and selected modules" },
          { dimension: "Language and support", calendra: "Slovenian, local team", competitor: "International platform with many languages" },
        ],
        chooseThemTitle: "When to choose SimplyBook.me",
        chooseThemIntro: "Modularity is the right choice in these cases.",
        chooseThem: [
          "You have an unusual requirement that needs one specific module.",
          "You enjoy assembling your own system and do not mind more settings.",
          "Slovenian tax specifics do not matter to you because you only take bank transfers.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense when you want less assembly and Slovenian specifics built in.",
        chooseUs: [
          "You want a working system in half a day, without choosing among dozens of modules.",
          "You need Slovenian invoices and fiscal verification.",
          "Your team works in Slovenian and needs Slovenian-language support.",
          "You want booking, clients and invoices connected without an extra module.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Does Calendra have modules?", answer: "Some capabilities are available as add-ons, for example the fiscal cash register and business premises. The core flow from booking to invoice is included." },
          { question: "Which is faster to set up?", answer: "It depends on your requirements. For a standard service business flow, fewer decisions is an advantage. For an unusual requirement, modularity is." },
          { question: "Can I migrate my data?", answer: "Yes, from an exported client list and upcoming appointments." },
          { question: "How do I compare price?", answer: "List the modules you genuinely need and compare that against a plan plus add-ons, rather than comparing base prices." },
        ],
        finalTitle: "Less assembly, faster start",
        finalDescription: "Try Calendra with your own services and see what you would miss.",
      },
    },
  },

  "lime-booking": {
    slug: "lime-booking",
    competitorName: "Lime Booking",
    lastReviewed: "2026-07-30",
    competitorUrl: "https://lime-booking.si",
    content: {
      sl: {
        navLabel: "Lime Booking",
        title: "Calendra ali Lime Booking",
        metaTitle: "Calendra ali Lime Booking: primerjava dveh slovenskih sistemov | Calendra",
        metaDescription:
          "Iskrena primerjava Calendre in Lime Bookinga. Oba sta slovenska, oba pokrivata davčno blagajno. Kje je Lime Booking boljša izbira in kje Calendra.",
        answer:
          "Lime Booking je slovenska aplikacija, osredotočena na lepotno panogo, z več kot 1500 podjetji in davčno blagajno v osnovi. Calendra pokriva širši nabor dejavnosti in dodaja videotermine ter razporejanje prostorov in opreme. Za manjši salon, ki potrebuje naročanje, SMS in račune, je Lime Booking pogosto cenejši.",
        intro:
          "To je primerjava dveh slovenskih izdelkov, ne domačega proti tujemu. Oba razumeta davčno potrjevanje, oba delujeta v slovenščini in oba imata slovensko podporo. Razlika je v tem, za koga sta narejena, zato je spodaj tudi odsek o tem, kdaj Calendre ne priporočamo.",
        positioningTitle: "Kaj je Lime Booking",
        positioning:
          "Lime Booking je slovenska aplikacija za naročanje in obveščanje strank, ki jo po njihovih javnih podatkih uporablja več kot 1500 podjetij, pretežno frizerskih in kozmetičnih salonov, brivnic, masažnih studiev in wellness centrov. Pokriva spletni koledar, samopostrežno naročanje, opomnike prek SMS, e-pošte, WhatsAppa in Viberja, davčno blagajno s potrjevanjem pri FURS, spletna plačila, zaloge, darilne bone in analitiko. Uporabljajo ga tudi saloni na Hrvaškem, v Srbiji, BiH, Avstriji in Švici.",
        tableTitle: "Kje se razlikujeta",
        tableIntro:
          "Vrstice so izhodišče za vaše preverjanje, ne dokončna trditev, in odražajo javno dostopne informacije na dan pregleda. Oba ponudnika funkcionalnosti in cene redno spreminjata, zato pred odločitvijo preverite aktualno ponudbo pri obeh.",
        rows: [
          { dimension: "Ciljna panoga", calendra: "Storitvena podjetja širše: lepota, zdravje, svetovanje, izobraževanje, fitnes", competitor: "Poudarek na lepotni panogi: saloni, brivnice, masaže, wellness" },
          { dimension: "Velikost skupnosti", calendra: "Mlajši izdelek z manjšo bazo uporabnikov", competitor: "Objavljeno več kot 1500 podjetij" },
          { dimension: "Davčna blagajna", calendra: "Dodatek k paketu", competitor: "Vključena v sistem" },
          { dimension: "Kanali obveščanja", calendra: "SMS in e-pošta", competitor: "SMS, e-pošta, WhatsApp in Viber" },
          { dimension: "Videotermini", calendra: "Povezava z Zoomom ustvari povezavo do srečanja ob rezervaciji", competitor: "Usmerjeno v termine na lokaciji" },
          { dimension: "Prostori in oprema", calendra: "Razpoložljivost upošteva prostore in opremo, ne le zaposlene", competitor: "Filtriranje po lokacijah, storitvah in zaposlenih" },
          { dimension: "Zaloge in darilni boni", calendra: "Ni v osnovnem obsegu", competitor: "Vodenje zalog, inventur, dobavnic in darilnih bonov" },
          { dimension: "Objavljena vstopna cena", calendra: "Osnovni paket 17,90 € z DDV, SMS opomniki od paketa Profesionalno, davčna blagajna +9,90 €", competitor: "Osnovni paket od 14,90 €, naprednejši paketi od 29,90 €" },
        ],
        chooseThemTitle: "Kdaj izberite Lime Booking",
        chooseThemIntro:
          "Ti primeri so pogosti in v njih vam Calendre ne priporočamo. Raje izgubimo prijavo kot da bi plačevali za sistem, ki vam ne ustreza.",
        chooseThem: [
          "Vodite manjši salon in potrebujete naročanje, SMS opomnike in davčno blagajno po najnižji možni ceni. Pri Calendri SMS opomniki pridejo šele s paketom Profesionalno, davčna blagajna pa je dodatek, zato bo skupni račun praviloma višji.",
          "Strankam želite pošiljati opomnike prek WhatsAppa ali Viberja. Calendra pošilja SMS in e-pošto.",
          "Potrebujete vodenje zalog izdelkov, inventure in darilne bone kot del sistema.",
          "Pomembna vam je velika baza slovenskih salonov, ki izdelek že uporablja, in znanje, ki se je okoli njega nabralo.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra je smiselna, ko naročanje ni omejeno na lepotno panogo ali na termine na lokaciji.",
        chooseUs: [
          "Vaša dejavnost ni salon: svetovanje, izobraževanje, zdravstvo, fitnes ali storitve na terenu.",
          "Del terminov izvajate na daljavo in želite, da se povezava do videosrečanja ustvari sama.",
          "Razpoložljivost je odvisna od prostorov ali opreme, ne le od tega, kdo je prost.",
          "Potrebujete en sistem tudi za IT in spletni del poslovanja, ki ga pokrivamo z istim računom.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali sta oba izdelka slovenska?", answer: "Da. Oba razvijata slovenski ekipi, oba delujeta v slovenščini in oba podpirata slovensko davčno potrjevanje računov. Pri tej primerjavi torej ne gre za izbiro med domačim in tujim ponudnikom." },
          { question: "Kateri je cenejši?", answer: "Za manjši salon, ki potrebuje naročanje, SMS opomnike in davčno blagajno, je po javno objavljenih cenah praviloma cenejši Lime Booking. Pri Calendri so SMS opomniki vključeni od paketa Profesionalno, davčna blagajna pa je dodatek za 9,90 € mesečno. Sestavite seznam funkcionalnosti, ki jih res potrebujete, in primerjajte končni mesečni znesek, ne vstopne cene." },
          { question: "Ali Calendra podpira davčno potrjevanje kot Lime Booking?", answer: "Da, prek dodatka Davčna blagajna. Razlika je v tem, da je pri Lime Bookingu to del sistema, pri Calendri pa dodatek, ki ga vklopite po potrebi." },
          { question: "Ali lahko podatke preselim iz Lime Bookinga?", answer: "Stranke in prihodnje termine lahko uvozite iz izvožene datoteke. Ker se struktura podatkov med sistemoma razlikuje, uvoz običajno pregledamo skupaj, preden ga potrdite." },
          { question: "Zakaj na svoji strani navajate primere, ko je konkurent boljši?", answer: "Ker je to hitreje za obe strani. Če vam Calendra ne ustreza, boste to ugotovili v prvem tednu uporabe, mi pa bomo porabili čas za podporo, ki ne vodi nikamor." },
        ],
        finalTitle: "Niste prepričani, kateri sistem ustreza vaši dejavnosti?",
        finalDescription: "Na predstavitvi gremo skozi vaš primer. Če ocenimo, da vam bolj ustreza drug sistem, vam bomo to povedali.",
      },
      en: {
        navLabel: "Lime Booking",
        title: "Calendra or Lime Booking",
        metaTitle: "Calendra or Lime Booking: comparing two Slovenian systems | Calendra",
        metaDescription:
          "An honest comparison of Calendra and Lime Booking. Both are Slovenian and both handle fiscal verification. Where Lime Booking is the better choice and where Calendra is.",
        answer:
          "Lime Booking is a Slovenian application focused on the beauty sector, with more than 1,500 businesses and a fiscal cash register built in. Calendra covers a wider range of industries and adds video appointments plus room and equipment scheduling. For a small salon that needs booking, SMS and invoices, Lime Booking is often cheaper.",
        intro:
          "This compares two Slovenian products rather than a local one against a foreign one. Both understand fiscal verification, both work in Slovenian and both offer Slovenian-language support. The difference is who they are built for, which is why there is a section below on when we would not recommend Calendra.",
        positioningTitle: "What Lime Booking is",
        positioning:
          "Lime Booking is a Slovenian booking and client-messaging application used, according to their published figures, by more than 1,500 businesses, mostly hair and beauty salons, barbershops, massage studios and wellness centres. It covers an online calendar, self-service booking, reminders over SMS, email, WhatsApp and Viber, a fiscal cash register with FURS verification, online payments, stock management, gift vouchers and analytics. Salons in Croatia, Serbia, Bosnia, Austria and Switzerland use it as well.",
        tableTitle: "Where they differ",
        tableIntro:
          "These rows are a starting point for your own checks rather than a final claim, and they reflect publicly available information on the review date. Both vendors change features and pricing regularly, so check the current offering with both before deciding.",
        rows: [
          { dimension: "Target industry", calendra: "Service businesses broadly: beauty, health, consulting, education, fitness", competitor: "Focused on beauty: salons, barbershops, massage, wellness" },
          { dimension: "Size of the user base", calendra: "A younger product with a smaller base", competitor: "More than 1,500 businesses published" },
          { dimension: "Fiscal cash register", calendra: "An add-on to the plan", competitor: "Included in the system" },
          { dimension: "Messaging channels", calendra: "SMS and email", competitor: "SMS, email, WhatsApp and Viber" },
          { dimension: "Video appointments", calendra: "The Zoom connection creates a meeting link at booking time", competitor: "Oriented towards on-site appointments" },
          { dimension: "Rooms and equipment", calendra: "Availability accounts for rooms and equipment, not only staff", competitor: "Filtering by location, service and employee" },
          { dimension: "Stock and gift vouchers", calendra: "Not in the core scope", competitor: "Stock, stocktaking, delivery notes and gift vouchers" },
          { dimension: "Published entry price", calendra: "Basic plan 17.90 EUR incl. VAT, SMS reminders from the Professional plan, fiscal cash register +9.90 EUR", competitor: "Basic plan from 14.90 EUR, advanced plans from 29.90 EUR" },
        ],
        chooseThemTitle: "When to choose Lime Booking",
        chooseThemIntro:
          "These cases are common, and in them we would not recommend Calendra. We would rather lose the signup than have you pay for a system that does not fit.",
        chooseThem: [
          "You run a smaller salon and need booking, SMS reminders and a fiscal cash register at the lowest possible cost. In Calendra, SMS reminders start with the Professional plan and the fiscal cash register is an add-on, so the total will usually be higher.",
          "You want to send reminders over WhatsApp or Viber. Calendra sends SMS and email.",
          "You need product stock management, stocktaking and gift vouchers as part of the system.",
          "A large base of Slovenian salons already using the product, and the know-how built up around it, matters to you.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense once booking is not limited to the beauty sector or to on-site appointments.",
        chooseUs: [
          "Your business is not a salon: consulting, education, healthcare, fitness or on-site field services.",
          "Some appointments are remote and you want the video meeting link created automatically.",
          "Availability depends on rooms or equipment, not only on who is free.",
          "You want one supplier for the IT and website side of the business too, which we cover under the same account.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Are both products Slovenian?", answer: "Yes. Both are built by Slovenian teams, both work in Slovenian and both support Slovenian fiscal verification of invoices. This comparison is therefore not about choosing between a local and a foreign vendor." },
          { question: "Which is cheaper?", answer: "For a smaller salon that needs booking, SMS reminders and a fiscal cash register, published prices generally make Lime Booking cheaper. In Calendra, SMS reminders are included from the Professional plan and the fiscal cash register is a 9.90 EUR monthly add-on. List the capabilities you genuinely need and compare the final monthly figure rather than the entry price." },
          { question: "Does Calendra support fiscal verification like Lime Booking?", answer: "Yes, through the fiscal cash register add-on. The difference is that in Lime Booking it is part of the system, whereas in Calendra it is an add-on you enable when you need it." },
          { question: "Can I migrate my data from Lime Booking?", answer: "Clients and upcoming appointments can be imported from an exported file. Because the two systems structure data differently, we usually review the import together before you confirm it." },
          { question: "Why list cases where a competitor is better on your own site?", answer: "Because it is faster for both sides. If Calendra does not fit, you will find out in the first week anyway, and we will have spent that time on support that leads nowhere." },
        ],
        finalTitle: "Not sure which system fits your business?",
        finalDescription: "We will walk through your case on a demo call. If we think another system suits you better, we will say so.",
      },
    },
  },

  myplanly: {
    slug: "myplanly",
    competitorName: "MyPlanly",
    lastReviewed: "2026-07-30",
    competitorUrl: "https://www.myplanly.com",
    content: {
      sl: {
        navLabel: "MyPlanly",
        title: "Calendra ali MyPlanly",
        metaTitle: "Calendra ali MyPlanly: primerjava dveh slovenskih sistemov | Calendra",
        metaDescription:
          "Iskrena primerjava Calendre in MyPlanlyja. Oba sta slovenska in oba pokrivata davčno blagajno. Kje je MyPlanly boljša izbira in kje Calendra.",
        answer:
          "MyPlanly je slovenska aplikacija podjetja Intensio z različicami po dejavnostih, vključenimi SMS paketi, davčno blagajno s skladiščnim poslovanjem in lastnimi mobilnimi aplikacijami za podjetje in stranke. Calendra dodaja videotermine, razporejanje prostorov in opreme ter AI pomočnika. Za dejavnosti, kjer je pomembno skladiščno poslovanje ali mobilna aplikacija za stranke, je MyPlanly pogosto ustreznejši.",
        intro:
          "Tudi to je primerjava dveh slovenskih izdelkov. Oba obvladata davčno potrjevanje, oba imata slovenski vmesnik in slovensko podporo. Spodaj je najprej odsek o tem, kdaj Calendre ne priporočamo, ker je to za vas hitrejša pot do odločitve.",
        positioningTitle: "Kaj je MyPlanly",
        positioning:
          "MyPlanly razvija podjetje Intensio d.o.o. Aplikacija je razdeljena na različice po dejavnostih, od salonov do športnih in fitnes centrov, vsaka s svojimi funkcionalnostmi in cenikom. Pokriva samopostrežno naročanje, urnike zaposlenih, kartico stranke, davčno blagajno s skladiščnim poslovanjem, darilne in vrednostne bone, program zvestobe ter marketinška sporočila prek SMS, e-pošte in potisnih obvestil. Ponuja brezplačne aplikacije za iOS, Android in Huawei ter ločeno aplikacijo za stranke. V športni različici sta na voljo tudi odpiranje vrat prek aplikacije in beleženje prihodov.",
        tableTitle: "Kje se razlikujeta",
        tableIntro:
          "Vrstice odražajo javno dostopne informacije na dan pregleda in so izhodišče za vaše preverjanje. MyPlanly ima ločene cenike po dejavnostih, zato preverite tistega, ki velja za vašo.",
        rows: [
          { dimension: "Zasnova ponudbe", calendra: "En izdelek s paketi in dodatki za vse dejavnosti", competitor: "Ločene različice in ceniki po dejavnostih" },
          { dimension: "Davčna blagajna", calendra: "Dodatek k paketu, brez skladiščnega poslovanja", competitor: "Vključena, s skladiščnim poslovanjem in boni" },
          { dimension: "Mobilne aplikacije", calendra: "Spletna aplikacija in Calendra Connect", competitor: "Aplikacije za iOS, Android in Huawei ter ločena aplikacija za stranke" },
          { dimension: "SMS", calendra: "Opomniki od paketa Profesionalno, sporočila po porabi", competitor: "Vključeni paketi sporočil, dodatna po porabi" },
          { dimension: "Videotermini", calendra: "Povezava z Zoomom ustvari povezavo do srečanja ob rezervaciji", competitor: "Usmerjeno v termine na lokaciji" },
          { dimension: "Prostori in oprema", calendra: "Razpoložljivost upošteva prostore in opremo", competitor: "Prostori in naprave, v osnovnem paketu omejeno število" },
          { dimension: "Program zvestobe", calendra: "Ni v osnovnem obsegu", competitor: "Na voljo skupaj z marketinškimi orodji" },
          { dimension: "Objavljena vstopna cena", calendra: "Osnovni paket 17,90 € z DDV, davčna blagajna +9,90 €", competitor: "Od 14,90 € ob letnem plačilu, odvisno od dejavnosti in paketa" },
        ],
        chooseThemTitle: "Kdaj izberite MyPlanly",
        chooseThemIntro: "V teh primerih vam Calendre ne priporočamo.",
        chooseThem: [
          "Poleg storitev prodajate izdelke in potrebujete skladiščno poslovanje, inventure ter vrednostne bone v istem sistemu.",
          "Želite, da imajo vaše stranke namensko mobilno aplikacijo za naročanje, ne le spletnega obrazca.",
          "Vodite fitnes ali športni center in potrebujete beleženje prihodov ali odpiranje vrat prek aplikacije.",
          "Iščete najnižji možni mesečni strošek za osnovno naročanje z vključenim paketom SMS sporočil.",
        ],
        chooseUsTitle: "Kdaj izberite Calendro",
        chooseUsIntro: "Calendra je smiselna, ko potrebujete manj panožnih posebnosti in več povezanosti s poslovanjem.",
        chooseUs: [
          "Delate v več dejavnostih hkrati ali vaša dejavnost ne ustreza nobeni od pripravljenih različic.",
          "Del terminov izvajate na daljavo prek videoklica.",
          "Razpoložljivost je odvisna od prostorov in opreme, ne le od zaposlenih.",
          "Poleg naročanja potrebujete tudi IT podporo, spletno stran ali avtomatizacije pri istem ponudniku.",
        ],
        faqTitle: "Pogosta vprašanja",
        faq: [
          { question: "Ali sta oba izdelka slovenska?", answer: "Da. MyPlanly razvija Intensio d.o.o., Calendro pa naša ekipa. Oba delujeta v slovenščini, imata slovensko podporo in podpirata davčno potrjevanje računov." },
          { question: "Kateri je cenejši?", answer: "Odvisno od dejavnosti in obsega. MyPlanly ima ločene cenike po dejavnostih z vključenimi paketi SMS sporočil, kar je pri manjšem obsegu pogosto ugodneje. Pri Calendri je davčna blagajna dodatek za 9,90 € mesečno. Primerjajte končni mesečni znesek za funkcionalnosti, ki jih res potrebujete." },
          { question: "Ali ima Calendra mobilno aplikacijo?", answer: "Calendra Connect je naša mobilna aplikacija. Spletna aplikacija deluje na telefonu, tablici in računalniku. Če potrebujete namensko aplikacijo, ki jo namestijo vaše stranke, preverite obseg pri obeh ponudnikih." },
          { question: "Ali Calendra podpira skladiščno poslovanje?", answer: "Ne v osnovnem obsegu. Če prodajate izdelke in potrebujete zaloge ter inventure v istem sistemu, je to razlog za izbiro drugega ponudnika." },
          { question: "Ali lahko podatke preselim iz MyPlanlyja?", answer: "Stranke in prihodnje termine lahko uvozite iz izvožene datoteke. Uvoz običajno pregledamo skupaj, ker se struktura podatkov med sistemoma razlikuje." },
        ],
        finalTitle: "Preverimo skupaj, kateri sistem ustreza vaši dejavnosti",
        finalDescription: "Na predstavitvi gremo skozi vaš primer. Če vam bolj ustreza drug sistem, vam bomo to povedali.",
      },
      en: {
        navLabel: "MyPlanly",
        title: "Calendra or MyPlanly",
        metaTitle: "Calendra or MyPlanly: comparing two Slovenian systems | Calendra",
        metaDescription:
          "An honest comparison of Calendra and MyPlanly. Both are Slovenian and both handle fiscal verification. Where MyPlanly is the better choice and where Calendra is.",
        answer:
          "MyPlanly is a Slovenian application from Intensio with industry-specific editions, bundled SMS allowances, a fiscal cash register with stock management, and native apps for both the business and its clients. Calendra adds video appointments, room and equipment scheduling and an AI assistant. Where stock management or a client-facing mobile app matters, MyPlanly is often the better fit.",
        intro:
          "This also compares two Slovenian products. Both handle fiscal verification, both have a Slovenian interface and Slovenian support. The section on when we would not recommend Calendra comes first, because it is the faster route to a decision.",
        positioningTitle: "What MyPlanly is",
        positioning:
          "MyPlanly is built by Intensio d.o.o. The application is split into industry-specific editions, from salons to sports and fitness centres, each with its own features and price list. It covers self-service booking, staff schedules, a client record, a fiscal cash register with stock management, gift and value vouchers, a loyalty programme, and marketing messages over SMS, email and push notifications. It offers free iOS, Android and Huawei apps plus a separate app for clients. The sports edition also includes app-based door opening and check-in logging.",
        tableTitle: "Where they differ",
        tableIntro:
          "These rows reflect publicly available information on the review date and are a starting point for your own checks. MyPlanly prices by industry, so check the list that applies to yours.",
        rows: [
          { dimension: "Product structure", calendra: "One product with plans and add-ons across all industries", competitor: "Separate editions and price lists per industry" },
          { dimension: "Fiscal cash register", calendra: "An add-on to the plan, without stock management", competitor: "Included, with stock management and vouchers" },
          { dimension: "Mobile apps", calendra: "Web application plus Calendra Connect", competitor: "iOS, Android and Huawei apps plus a separate client app" },
          { dimension: "SMS", calendra: "Reminders from the Professional plan, messages charged by usage", competitor: "Bundled message allowances, extras by usage" },
          { dimension: "Video appointments", calendra: "The Zoom connection creates a meeting link at booking time", competitor: "Oriented towards on-site appointments" },
          { dimension: "Rooms and equipment", calendra: "Availability accounts for rooms and equipment", competitor: "Rooms and devices, with a capped number on the entry plan" },
          { dimension: "Loyalty programme", calendra: "Not in the core scope", competitor: "Available alongside the marketing tools" },
          { dimension: "Published entry price", calendra: "Basic plan 17.90 EUR incl. VAT, fiscal cash register +9.90 EUR", competitor: "From 14.90 EUR with annual billing, depending on industry and plan" },
        ],
        chooseThemTitle: "When to choose MyPlanly",
        chooseThemIntro: "In these cases we would not recommend Calendra.",
        chooseThem: [
          "You sell products alongside services and need stock management, stocktaking and value vouchers in the same system.",
          "You want your clients to have a dedicated mobile app for booking rather than only a web form.",
          "You run a fitness or sports centre and need check-in logging or app-based door access.",
          "You are looking for the lowest possible monthly cost for basic booking with an SMS allowance included.",
        ],
        chooseUsTitle: "When to choose Calendra",
        chooseUsIntro: "Calendra makes sense when you need fewer industry specifics and more connection to the rest of the business.",
        chooseUs: [
          "You operate across several industries at once, or yours does not match any of the prepared editions.",
          "Some of your appointments are delivered remotely over video.",
          "Availability depends on rooms and equipment, not only on staff.",
          "You also need IT support, a website or automations from the same supplier.",
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { question: "Are both products Slovenian?", answer: "Yes. MyPlanly is built by Intensio d.o.o. and Calendra by our team. Both work in Slovenian, both offer Slovenian-language support and both support fiscal verification of invoices." },
          { question: "Which is cheaper?", answer: "It depends on your industry and scale. MyPlanly prices by industry and bundles SMS allowances, which is often better value at smaller volumes. In Calendra the fiscal cash register is a 9.90 EUR monthly add-on. Compare the final monthly figure for the capabilities you genuinely need." },
          { question: "Does Calendra have a mobile app?", answer: "Calendra Connect is our mobile app, and the web application works on phone, tablet and desktop. If you need a dedicated app that your clients install, check the scope with both vendors." },
          { question: "Does Calendra support stock management?", answer: "Not in the core scope. If you sell products and need stock and stocktaking in the same system, that is a reason to choose another vendor." },
          { question: "Can I migrate my data from MyPlanly?", answer: "Clients and upcoming appointments can be imported from an exported file. We usually review the import together, because the two systems structure data differently." },
        ],
        finalTitle: "Let us work out which system fits your business",
        finalDescription: "We will walk through your case on a demo call. If another system suits you better, we will say so.",
      },
    },
  },
};

export const getComparison = (slug: ComparisonSlug) => comparisons[slug];

export const getComparisonContent = (slug: ComparisonSlug, language: SiteLanguage) =>
  comparisons[slug].content[language];

export const allComparisons = COMPARISON_SLUGS.map((slug) => comparisons[slug]);
