import { Button } from "@/components/ui/button";
import { getRoutePath } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  BadgeEuro,
  BellRing,
  CalendarCheck2,
  CalendarX2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Dumbbell,
  FileText,
  HeartHandshake,
  MailCheck,
  MessageSquareMore,
  PlugZap,
  Scissors,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";

const copy = {
  sl: {
    problems: {
      eyebrow: "Manj administracije",
      title: "Težave, ki jih Calendra spremeni v urejen proces",
      intro: "Ko termini, sporočila, stranke in računi živijo v različnih sistemih, ekipa izgublja čas in informacije. Calendra poveže celoten potek dela.",
      items: [
        { title: "Preveč telefonskih klicev", body: "Stranke lahko termin rezervirajo, spremenijo ali odpovejo prek spleta.", before: "Klici in ročno usklajevanje", after: "Samostojno spletno naročanje" },
        { title: "Dvojne rezervacije", body: "Razpoložljivost zaposlenih, prostorov in obstoječih terminov se preverja na enem mestu.", before: "Ločeni koledarji", after: "Enoten koledar ekipe" },
        { title: "Pozabljeni termini", body: "Samodejni SMS in e-poštni opomniki zmanjšajo nesporazume in neprihode.", before: "Ročno opominjanje", after: "Pravočasna obvestila" },
        { title: "Preveč administracije", body: "Podatki o stranki, terminu, storitvi in računu ostanejo povezani.", before: "Prepisovanje podatkov", after: "Povezan delovni tok" },
      ],
    },
    audience: {
      eyebrow: "Za koga je Calendra?",
      title: "Za storitvena podjetja, ki delajo po terminih",
      intro: "Calendra je primerna za samostojne izvajalce in ekipe z več zaposlenimi, lokacijami, prostori ali načini plačila.",
      items: [
        { title: "Lepotni in frizerski saloni", body: "Pregleden urnik zaposlenih, storitev in prostorov." },
        { title: "Svetovalci in izobraževalci", body: "Osebni in spletni termini, dokumenti ter komunikacija." },
        { title: "Zdravje in dobro počutje", body: "Zanesljivo naročanje, opomniki in urejena evidenca strank." },
        { title: "Fitnes in skupinske storitve", body: "Posamezni in skupinski termini z omejitvami kapacitete." },
      ],
    },
    how: {
      eyebrow: "Kako deluje",
      title: "Od prve rezervacije do računa v treh korakih",
      items: [
        { title: "Nastavite storitve in razpoložljivost", body: "Dodajte zaposlene, delovni čas, storitve, lokacije, prostore in pravila naročanja." },
        { title: "Stranke rezervirajo, vi imate pregled", body: "Termin nastane prek javne povezave, spletnega vtičnika, aplikacije ali neposredno v koledarju." },
        { title: "Calendra poskrbi za nadaljnje korake", body: "Pošlje potrditve in opomnike, poveže plačilo ter pripravi podatke za račun in analitiko." },
      ],
    },
    integrations: {
      eyebrow: "Integracije",
      title: "Povežite koledar, spletne sestanke in plačila",
      intro: "Calendra se vključuje v obstoječe delo, da vam ni treba podvajati podatkov med več orodji.",
      items: ["Google Koledar", "Zoom", "Stripe", "PayPal", "E-pošta in SMS", "Spletni vtičnik"],
      cta: "Več o integracijah",
    },
    pricing: {
      eyebrow: "Cenik",
      title: "Začnite z osnovami in razširite, ko jih potrebujete",
      intro: "Paketi se začnejo pri 14,90 € na mesec. Izberite raven funkcionalnosti, nato dodajte uporabnike, SMS sporočila ali dodatne module.",
      from: "od 14,90 € / mesec",
      items: ["14-dnevni brezplačni preizkus", "Brez kreditne kartice", "Jasno prikazani dodatni stroški"],
      cta: "Primerjajte pakete",
    },
    faq: {
      eyebrow: "Pogosta vprašanja",
      title: "Preden začnete",
      items: [
        { q: "Komu je Calendra namenjena?", a: "Storitvenim podjetjem in posameznikom, ki upravljajo termine, stranke, zaposlene, opomnike, plačila ali račune." },
        { q: "Ali lahko stranke rezervirajo same?", a: "Da. Uporabite lahko javno povezavo, vtičnik na svoji spletni strani ali gostujočo aplikacijo. Pravila naročanja določite sami." },
        { q: "Ali Calendra preprečuje dvojne rezervacije?", a: "Calendra pri razpoložljivosti upošteva delovni čas, odsotnosti, obstoječe termine, zaposlene in po potrebi prostore ali naprave." },
        { q: "Ali so opomniki vključeni?", a: "E-poštna in SMS obvestila so odvisna od izbranega paketa in nastavitev. SMS poraba je jasno prikazana v ceniku." },
        { q: "Kako dolgo traja brezplačni preizkus?", a: "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice." },
      ],
    },
  },
  en: {
    problems: {
      eyebrow: "Less administration",
      title: "Turn common appointment problems into an organised process",
      intro: "When appointments, messages, clients and invoices live in separate systems, teams lose time and information. Calendra connects the workflow.",
      items: [
        { title: "Too many phone calls", body: "Customers can book, change or cancel appointments online.", before: "Calls and manual coordination", after: "Self-service online booking" },
        { title: "Double bookings", body: "Employee, resource and appointment availability is checked in one place.", before: "Separate calendars", after: "One team calendar" },
        { title: "Missed appointments", body: "Automatic SMS and email reminders reduce misunderstandings and no-shows.", before: "Manual reminders", after: "Timely notifications" },
        { title: "Too much administration", body: "Client, appointment, service and invoice information stays connected.", before: "Re-entering data", after: "Connected workflow" },
      ],
    },
    audience: {
      eyebrow: "Who is Calendra for?",
      title: "For service businesses that work by appointment",
      intro: "Calendra works for independent professionals and teams with multiple employees, locations, rooms or payment methods.",
      items: [
        { title: "Beauty and hair salons", body: "A clear schedule for employees, services and rooms." },
        { title: "Consultants and educators", body: "In-person and online appointments, documents and communication." },
        { title: "Health and wellbeing", body: "Reliable booking, reminders and organised client records." },
        { title: "Fitness and group services", body: "Individual and group appointments with capacity limits." },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "From first booking to invoice in three steps",
      items: [
        { title: "Set services and availability", body: "Add employees, working hours, services, locations, rooms and booking rules." },
        { title: "Customers book and you keep control", body: "Appointments are created through a public link, website widget, app or directly in the calendar." },
        { title: "Calendra handles the next steps", body: "It sends confirmations and reminders, connects payments and prepares invoice and analytics data." },
      ],
    },
    integrations: {
      eyebrow: "Integrations",
      title: "Connect calendars, online meetings and payments",
      intro: "Calendra fits into your existing workflow so information does not need to be copied between tools.",
      items: ["Google Calendar", "Zoom", "Stripe", "PayPal", "Email and SMS", "Website widget"],
      cta: "Explore integrations",
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Start with the essentials and expand when needed",
      intro: "Plans start at €14.90 per month. Choose the right feature level, then add users, SMS messages or optional modules.",
      from: "from €14.90 / month",
      items: ["14-day free trial", "No credit card required", "Clearly shown additional costs"],
      cta: "Compare plans",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      title: "Before you start",
      items: [
        { q: "Who is Calendra for?", a: "Service businesses and professionals managing appointments, clients, employees, reminders, payments or invoices." },
        { q: "Can customers book by themselves?", a: "Yes. Use a public link, a widget on your website or the guest app. You control the booking rules." },
        { q: "Does Calendra prevent double bookings?", a: "Availability considers working hours, absences, existing appointments, employees and, when needed, rooms or equipment." },
        { q: "Are reminders included?", a: "Email and SMS notifications depend on the selected plan and configuration. SMS usage is shown clearly in pricing." },
        { q: "How long is the free trial?", a: "The free trial lasts 14 days and does not require a credit card." },
      ],
    },
  },
} as const satisfies Record<SiteLanguage, unknown>;

const audienceIcons = [Scissors, HeartHandshake, Stethoscope, Dumbbell] as const;
const problemIcons = [MessageSquareMore, CalendarX2, BellRing, FileText] as const;
const howIcons = [Clock3, CalendarCheck2, MailCheck] as const;

export const ProblemsAndOutcomes = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].problems;
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{section.intro}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {section.items.map((item, index) => {
            const Icon = problemIcons[index];
            return (
              <article key={item.title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-6 w-6" /></span>
                  <div><h3 className="text-xl font-bold text-foreground">{item.title}</h3><p className="mt-2 leading-7 text-muted-foreground">{item.body}</p></div>
                </div>
                <div className="mt-6 grid gap-2 rounded-2xl bg-background p-4 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <span className="text-muted-foreground line-through decoration-destructive/50">{item.before}</span>
                  <ChevronRight className="hidden h-4 w-4 text-primary sm:block" />
                  <span className="font-semibold text-foreground">{item.after}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const AudienceSection = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].audience;
  return (
    <section id="za-koga" className="bg-card py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl"><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">{section.intro}</p></div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item, index) => { const Icon = audienceIcons[index]; return <article key={item.title} className="rounded-3xl border border-border/60 bg-background p-6"><Icon className="h-7 w-7 text-primary" /><h3 className="mt-5 text-lg font-bold text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p></article>; })}
        </div>
      </div>
    </section>
  );
};

export const HowItWorksSection = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].how;
  return (
    <section id="kako-deluje" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2></div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {section.items.map((item, index) => { const Icon = howIcons[index]; return <article key={item.title} className="relative rounded-3xl border border-border/60 bg-card p-7 shadow-soft"><span className="absolute right-6 top-5 font-display text-5xl font-black text-primary/[0.08]">0{index + 1}</span><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-6 w-6" /></span><h3 className="mt-6 text-xl font-bold text-foreground">{item.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{item.body}</p></article>; })}
        </div>
      </div>
    </section>
  );
};

export const IntegrationsSection = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].integrations;
  return (
    <section className="bg-card py-20 md:py-28">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">{section.intro}</p><Button variant="outline" size="lg" className="mt-7 rounded-xl" asChild><a href={getRoutePath("integrations", language)}>{section.cta}<ArrowRight className="h-4 w-4" /></a></Button></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{section.items.map((item, index) => <div key={item} className="flex min-h-28 flex-col justify-between rounded-2xl border border-border/60 bg-background p-5 shadow-sm"><PlugZap className={`h-6 w-6 ${index % 2 === 0 ? "text-primary" : "text-accent"}`} /><span className="mt-4 font-semibold text-foreground">{item}</span></div>)}</div>
      </div>
    </section>
  );
};

export const PricingOverview = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].pricing;
  return (
    <section id="cenik" className="scroll-mt-20 bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.07] p-8 shadow-soft md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{section.intro}</p><Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild><a href={getRoutePath("pricing", language)}>{section.cta}<ArrowRight className="h-4 w-4" /></a></Button></div>
            <div className="rounded-3xl border border-border/70 bg-background p-7 shadow-soft"><BadgeEuro className="h-8 w-8 text-primary" /><p className="mt-5 font-display text-3xl font-extrabold text-foreground">{section.from}</p><ul className="mt-6 grid gap-3">{section.items.map((item) => <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground"><Check className="h-4 w-4 text-primary" />{item}</li>)}</ul></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomeFaq = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].faq;
  return (
    <section className="bg-card py-20 md:py-28">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <div><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2><Sparkles className="mt-6 h-9 w-9 text-primary" /></div>
        <div className="grid gap-3">{section.items.map((item) => <details key={item.q} className="group rounded-2xl border border-border/60 bg-background p-5"><summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">{item.q}</summary><p className="mt-3 leading-7 text-muted-foreground">{item.a}</p></details>)}</div>
      </div>
    </section>
  );
};

export const HomeTrialLink = ({ children }: { children: React.ReactNode }) => (
  <a href={TRIAL_SIGNUP_ROUTE}>{children}</a>
);
