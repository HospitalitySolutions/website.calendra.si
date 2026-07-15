import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { getRoutePath, getRouteKeyFromPathname, type CanonicalRouteKey } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import { ArrowRight, CheckCircle2, Link2 } from "lucide-react";
import { useLocation } from "react-router-dom";

type FeatureKey = Extract<CanonicalRouteKey, "calendar" | "invoicing" | "clientManagement" | "reminders" | "integrations">;

type FeatureContent = {
  eyebrow: string;
  title: string;
  intro: string;
  benefits: Array<{ title: string; description: string }>;
  processTitle: string;
  process: string[];
};

const relatedRoutes: Record<FeatureKey, CanonicalRouteKey[]> = {
  calendar: ["booking", "reminders", "clientManagement"],
  invoicing: ["booking", "clientManagement", "integrations"],
  clientManagement: ["booking", "calendar", "invoicing"],
  reminders: ["booking", "calendar", "clientManagement"],
  integrations: ["booking", "calendar", "invoicing"],
};

const relatedLinkLabels: Record<SiteLanguage, Partial<Record<CanonicalRouteKey, string>>> = {
  sl: {
    booking: "Oglejte si spletno naročanje",
    calendar: "Spoznajte koledar terminov",
    invoicing: "Preverite račune in plačila",
    clientManagement: "Spoznajte upravljanje strank",
    reminders: "Preberite, kako delujejo opomniki",
    integrations: "Preglejte integracije",
  },
  en: {
    booking: "Explore online booking",
    calendar: "Explore the appointment calendar",
    invoicing: "Explore invoicing and payments",
    clientManagement: "Explore client management",
    reminders: "Learn how appointment reminders work",
    integrations: "Explore Calendra integrations",
  },
};

const content: Record<FeatureKey, Record<SiteLanguage, FeatureContent>> = {
  calendar: {
    sl: {
      eyebrow: "Koledar terminov",
      title: "Pregleden koledar terminov za celotno ekipo",
      intro: "Upravljajte rezervacije, delovni čas, odsotnosti, prostore in ponavljajoče se termine na enem mestu. Calendra zmanjša prepisovanje in možnost dvojnih rezervacij.",
      benefits: [
        { title: "Več pogledov koledarja", description: "Dnevni, tedenski, delovni teden in mesečni pogled pomagajo vsaki ekipi najti pravi pregled." },
        { title: "Zaposleni in prostori", description: "Preverite razpoložljivost zaposlenih, prostorov in naprav, preden potrdite termin." },
        { title: "Ponavljajoči se termini", description: "Uredite serije terminov in po potrebi spremenite posamezen termin ali vse naslednje." },
      ],
      processTitle: "Od rezervacije do izvedbe",
      process: ["Stranka ali zaposleni ustvari termin.", "Calendra preveri razpoložljivost in prepreči prekrivanje.", "Termin se prikaže ekipi in sproži izbrana obvestila."],
    },
    en: {
      eyebrow: "Appointment calendar",
      title: "A clear appointment calendar for your entire team",
      intro: "Manage bookings, working hours, absences, rooms and recurring appointments in one place. Calendra reduces duplicate work and double bookings.",
      benefits: [
        { title: "Multiple calendar views", description: "Daily, weekly, work-week and monthly views give each team the right overview." },
        { title: "Employees and resources", description: "Check employees, rooms and equipment before confirming an appointment." },
        { title: "Recurring appointments", description: "Manage appointment series and edit one occurrence or all future appointments." },
      ],
      processTitle: "From booking to delivery",
      process: ["A customer or employee creates an appointment.", "Calendra checks availability and prevents overlaps.", "The appointment appears for the team and triggers selected notifications."],
    },
  },
  invoicing: {
    sl: {
      eyebrow: "Računi in plačila",
      title: "Termini, računi in plačila v povezanem delovnem toku",
      intro: "Po izvedenem terminu pripravite račun, evidentirajte način plačila in ohranite jasen pregled nad prihodki brez ločenih evidenc.",
      benefits: [
        { title: "Račun iz termina", description: "Podatki o stranki in storitvi so že pripravljeni, zato je izdaja računa hitrejša." },
        { title: "Več načinov plačila", description: "Podprite plačilo na lokaciji, bančno nakazilo in spletna plačila glede na svoje nastavitve." },
        { title: "Jasen finančni pregled", description: "Spremljajte plačane in odprte obveznosti ter pripravite podatke za računovodstvo." },
      ],
      processTitle: "Enoten proces",
      process: ["Termin vsebuje izbrane storitve in cene.", "Po izvedbi pripravite račun ali potrdite plačilo.", "Podatki ostanejo povezani s stranko in terminom."],
    },
    en: {
      eyebrow: "Invoicing and payments",
      title: "Appointments, invoices and payments in one connected workflow",
      intro: "Create an invoice after an appointment, record the payment method and keep a clear revenue overview without separate records.",
      benefits: [
        { title: "Invoice from an appointment", description: "Customer and service data is already available, making invoicing faster." },
        { title: "Multiple payment methods", description: "Support payment at the location, bank transfer and online payments based on your setup." },
        { title: "Clear financial overview", description: "Track paid and outstanding amounts and prepare data for accounting." },
      ],
      processTitle: "One connected process",
      process: ["The appointment contains selected services and prices.", "After delivery, create the invoice or confirm payment.", "The records remain connected to the customer and appointment."],
    },
  },
  clientManagement: {
    sl: {
      eyebrow: "Upravljanje strank",
      title: "Vsi pomembni podatki o stranki na enem mestu",
      intro: "Ohranite kontaktne podatke, zgodovino terminov, opombe, dokumente in komunikacijo v urejeni evidenci, dostopni po pravicah uporabnikov.",
      benefits: [
        { title: "Celovit profil stranke", description: "Hitro preverite kontakte, pretekle in prihodnje termine ter pomembne opombe." },
        { title: "Polja po meri", description: "Zajemite podatke, ki so pomembni za vaš način dela, brez nepreglednih preglednic." },
        { title: "Nadzorovan dostop", description: "Vloge in dovoljenja določajo, kateri zaposleni lahko vidijo ali urejajo podatke." },
      ],
      processTitle: "Manj iskanja, več konteksta",
      process: ["Stranko ustvarite ob prvi rezervaciji ali ročno.", "Vsak naslednji termin se poveže z istim profilom.", "Ekipa ima ob pravem času dostop do pomembnih informacij."],
    },
    en: {
      eyebrow: "Client management",
      title: "All important client information in one place",
      intro: "Keep contact details, appointment history, notes, documents and communication in an organised record with role-based access.",
      benefits: [
        { title: "Complete client profile", description: "Quickly review contacts, previous and upcoming appointments and important notes." },
        { title: "Custom fields", description: "Capture the information your workflow needs without scattered spreadsheets." },
        { title: "Controlled access", description: "Roles and permissions determine which employees can view or edit information." },
      ],
      processTitle: "Less searching, more context",
      process: ["Create a client during the first booking or manually.", "Every future appointment is connected to the same profile.", "The team sees relevant information when it is needed."],
    },
  },
  reminders: {
    sl: {
      eyebrow: "SMS in e-poštni opomniki",
      title: "Manj pozabljenih terminov z avtomatskimi opomniki",
      intro: "Calendra po vaših pravilih pošlje potrditev, opomnik, spremembo ali odpoved termina, zato je komunikacija dosledna tudi v zasedenih dneh.",
      benefits: [
        { title: "Samodejno pošiljanje", description: "Nastavite čas pošiljanja in kanal, Calendra pa obvestila pripravi ob pravem dogodku." },
        { title: "Prilagojene predloge", description: "Uporabite podatke o stranki, storitvi, zaposlenem, lokaciji in terminu." },
        { title: "Spremembe brez zmede", description: "Povezave za spremembo ali odpoved termina zmanjšajo količino telefonskega usklajevanja." },
      ],
      processTitle: "Dosledna komunikacija",
      process: ["Izberete aktivne predloge in kanale.", "Calendra zazna novo rezervacijo ali spremembo.", "Stranka prejme ustrezno sporočilo ob nastavljenem času."],
    },
    en: {
      eyebrow: "SMS and email reminders",
      title: "Reduce missed appointments with automatic reminders",
      intro: "Calendra sends confirmations, reminders, changes and cancellations based on your rules, keeping communication consistent on busy days.",
      benefits: [
        { title: "Automatic delivery", description: "Set timing and channels, then Calendra prepares messages for the right event." },
        { title: "Custom templates", description: "Use customer, service, employee, location and appointment information." },
        { title: "Clear changes", description: "Reschedule and cancellation links reduce telephone coordination." },
      ],
      processTitle: "Consistent communication",
      process: ["Choose active templates and channels.", "Calendra detects a new booking or change.", "The customer receives the right message at the configured time."],
    },
  },
  integrations: {
    sl: {
      eyebrow: "Integracije",
      title: "Povežite Calendro z orodji, ki jih že uporabljate",
      intro: "Sinhronizirajte koledarje, pripravite spletne termine in sprejemajte plačila brez nepotrebnega preklapljanja med sistemi.",
      benefits: [
        { title: "Google Koledar", description: "Uskladite Calendra termine z osebnimi ali službenimi koledarji zaposlenih." },
        { title: "Zoom", description: "Za spletne termine ustvarite povezavo in jo vključite v obvestila strankam." },
        { title: "Spletna plačila", description: "Povežite podprte ponudnike plačil ter določite predplačilo ali celotno plačilo." },
      ],
      processTitle: "Povezava brez podvajanja dela",
      process: ["Administrator omogoči integracijo.", "Zaposleni ali podjetje poveže svoj račun.", "Calendra podatke uporablja v rezervacijskem toku in koledarju."],
    },
    en: {
      eyebrow: "Integrations",
      title: "Connect Calendra with the tools you already use",
      intro: "Synchronise calendars, prepare online appointments and accept payments without unnecessary switching between systems.",
      benefits: [
        { title: "Google Calendar", description: "Synchronise Calendra appointments with employees’ personal or work calendars." },
        { title: "Zoom", description: "Create a meeting link for online appointments and include it in customer notifications." },
        { title: "Online payments", description: "Connect supported payment providers and choose deposits or full payment." },
      ],
      processTitle: "Connect without duplicate work",
      process: ["An administrator enables the integration.", "The employee or business connects its account.", "Calendra uses the data in booking and calendar workflows."],
    },
  },
};

const FeatureDetailPage = () => {
  const { pathname } = useLocation();
  const { language } = useSiteLanguage();
  const routeKey = getRouteKeyFromPathname(pathname) as FeatureKey | undefined;
  const page = routeKey ? content[routeKey]?.[language] : undefined;

  if (!routeKey || !page) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.eyebrow}</span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{page.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="lg" className="rounded-xl" asChild>
                <a href={TRIAL_SIGNUP_ROUTE}>{language === "sl" ? "Preizkusite brezplačno" : "Try it free"}<ArrowRight className="h-4 w-4" /></a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl" asChild>
                <a href={getRoutePath("pricing", language)}>{language === "sl" ? "Oglejte si pakete Calendra" : "Explore Calendra plans"}</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
          <div className="grid gap-6 md:grid-cols-3">
            {page.benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                <CheckCircle2 className="h-7 w-7 text-primary" />
                <h2 className="mt-5 text-xl font-bold text-foreground">{benefit.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <Link2 className="h-8 w-8 text-primary" />
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground">{page.processTitle}</h2>
            </div>
            <ol className="grid gap-4">
              {page.process.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-border/60 bg-background p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                  <p className="pt-1.5 font-medium leading-6 text-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border/60 bg-background py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {language === "sl" ? "Povezane funkcionalnosti" : "Related features"}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedRoutes[routeKey].map((relatedRoute) => (
                <a
                  key={relatedRoute}
                  href={getRoutePath(relatedRoute, language)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  {relatedLinkLabels[language][relatedRoute]}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 text-center lg:px-8 md:py-24">
          <h2 className="font-display text-3xl font-bold text-foreground">{language === "sl" ? "Oglejte si Calendro v praksi" : "See Calendra in practice"}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{language === "sl" ? "Začnite s 14-dnevnim brezplačnim preizkusom brez kreditne kartice." : "Start with a 14-day free trial without a credit card."}</p>
          <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild>
            <a href={TRIAL_SIGNUP_ROUTE}>{language === "sl" ? "Začnite brezplačno" : "Start free"}<ArrowRight className="h-4 w-4" /></a>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeatureDetailPage;
