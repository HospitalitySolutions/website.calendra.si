import { Button } from "@/components/ui/button";
import { StepWatermark } from "@/components/ui/step-watermark";
import { getRoutePath } from "@/lib/localized-routes";
import { getIndustryContent, INDUSTRY_ROUTE_KEYS } from "@/lib/industry-pages";
import { getFaqForRoute } from "@/lib/faq";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  fetchPublicPricingCatalog,
  getInitialPricingCatalog,
  type PublicPricingCatalog,
} from "@/lib/public-pricing";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeEuro,
  BellRing,
  CalendarCheck2,
  Check,
  Clock3,
  Dumbbell,
  FileText,
  GraduationCap,
  Headphones,
  HeartPulse,
  MailCheck,
  MonitorSmartphone,
  PhoneCall,
  PlugZap,
  RefreshCw,
  Scissors,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const copy = {
  sl: {
    problems: {
      eyebrow: "Rešitve Calendra",
      title: "Manj klicev. Manj administracije. Več pregleda.",
      intro: "",
      items: [
        { title: "Manj telefonskih klicev", body: "Stranke lahko termin rezervirajo, spremenijo ali odpovejo same prek spleta ali aplikacije." },
        { title: "Brez dvojnih rezervacij", body: "Razpoložljivost zaposlenih, prostorov in terminov se preverja v enem sistemu." },
        { title: "Manj pozabljenih terminov", body: "Samodejni SMS in e-poštni opomniki zmanjšajo izostanke in nesporazume." },
        { title: "Manj administracije", body: "Podatki o strankah, terminih, storitvah in računih ostanejo povezani na enem mestu." },
      ],
    },
    audience: {
      eyebrow: "Storitvena podjetja",
      title: "Za koga je Calendra?",
      intro: "Calendra je primerna za samostojne izvajalce in ekipe z več zaposlenimi, lokacijami, prostori ali načini plačila.",
      items: [
        { title: "Lepotni in frizerski saloni", body: "Pregleden urnik zaposlenih, storitev in prostorov." },
        { title: "Svetovalci in izobraževalci", body: "Osebni in spletni termini, dokumenti ter komunikacija." },
        { title: "Zdravje in dobro počutje", body: "Zanesljivo naročanje, opomniki in urejena evidenca strank." },
        { title: "Fitnes in skupinske storitve", body: "Posamezni in skupinski termini z omejitvami kapacitete." },
      ],
    },
    how: {
      eyebrow: "Preprost začetek",
      title: "Kako deluje Calendra v treh korakih",
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
      eyebrow: "Prilagodljivi paketi",
      title: "Paketi in cenik Calendra",
      introPrefix: "Paketi se začnejo pri",
      introSuffix: "na mesec. Izberite raven funkcionalnosti, nato dodajte uporabnike, SMS sporočila ali dodatne module.",
      fromPrefix: "od",
      perMonth: "/ mesec",
      items: ["14-dnevni brezplačni preizkus", "Brez kreditne kartice", "Jasno prikazani dodatni stroški"],
      cta: "Primerjajte pakete",
    },
    faq: {
      eyebrow: "Dobro je vedeti",
      title: "Pogosta vprašanja o Calendri",
    },
  },
  en: {
    problems: {
      eyebrow: "Calendra solutions",
      title: "Fewer calls. Less administration. More control.",
      intro: "",
      items: [
        { title: "Fewer phone calls", body: "Customers can book, change or cancel appointments themselves online or in the app." },
        { title: "No double bookings", body: "Employee, room and appointment availability is checked in one connected system." },
        { title: "Fewer missed appointments", body: "Automatic SMS and email reminders reduce no-shows and misunderstandings." },
        { title: "Less administration", body: "Client, appointment, service and invoice information stays connected in one place." },
      ],
    },
    audience: {
      eyebrow: "Service businesses",
      title: "Who is Calendra for?",
      intro: "Calendra works for independent professionals and teams with multiple employees, locations, rooms or payment methods.",
      items: [
        { title: "Beauty and hair salons", body: "A clear schedule for employees, services and rooms." },
        { title: "Consultants and educators", body: "In-person and online appointments, documents and communication." },
        { title: "Health and wellbeing", body: "Reliable booking, reminders and organised client records." },
        { title: "Fitness and group services", body: "Individual and group appointments with capacity limits." },
      ],
    },
    how: {
      eyebrow: "A simple start",
      title: "How Calendra works in three steps",
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
      eyebrow: "Flexible plans",
      title: "Calendra plans and pricing",
      introPrefix: "Plans start at",
      introSuffix: "per month. Choose the right feature level, then add users, SMS messages or optional modules.",
      fromPrefix: "from",
      perMonth: "/ month",
      items: ["14-day free trial", "No credit card required", "Clearly shown additional costs"],
      cta: "Compare plans",
    },
    faq: {
      eyebrow: "Good to know",
      title: "Frequently asked questions about Calendra",
    },
  },
} as const satisfies Record<SiteLanguage, unknown>;

const audienceIcons = [Scissors, GraduationCap, HeartPulse, Dumbbell] as const;
const audienceCardBackgrounds = [
  "/industries/beauty-salon-bg.png",
  "/industries/consulting-education-bg.png",
  "/industries/wellbeing-bg.png",
  "/industries/fitness-groups-bg.png",
] as const;
const audienceCardImagePositions = [
  "78% center",
  "76% center",
  "74% center",
  "78% center",
] as const;
const problemIcons = [PhoneCall, CalendarCheck2, BellRing, FileText] as const;
const howIcons = [Clock3, CalendarCheck2, MailCheck] as const;

export const ProblemsAndOutcomes = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].problems;

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/[0.035] to-transparent" aria-hidden="true" />
      <div className="container relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary sm:text-sm">{section.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl lg:text-[2.8rem]">
            {section.title}
          </h2>
          {section.intro ? (
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {section.intro}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {section.items.map((item, index) => {
            const Icon = problemIcons[index];
            const accentClasses = [
              "bg-blue-500/[0.09] text-blue-600",
              "bg-emerald-500/[0.10] text-emerald-600",
              "bg-violet-500/[0.09] text-violet-600",
              "bg-amber-500/[0.11] text-amber-600",
            ];

            return (
              <article
                key={item.title}
                className="group rounded-2xl border border-border/60 bg-card/95 p-5 shadow-[0_16px_42px_-34px_hsl(220_25%_10%/0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_55px_-34px_hsl(var(--primary)/0.34)] sm:p-6"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${accentClasses[index]}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
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
  const trustItems = language === "sl"
    ? [
        { title: "Varnost in zanesljivost", body: "Vaši podatki so vedno varni", icon: ShieldCheck },
        { title: "Podpora, ki pomaga", body: "Odzivna slovenska podpora", icon: Headphones },
        { title: "Redne posodobitve", body: "Nenehno izboljšujemo funkcionalnosti", icon: RefreshCw },
        { title: "Deluje kjerkoli", body: "Spletna aplikacija za vse naprave", icon: MonitorSmartphone },
      ]
    : [
        { title: "Secure and reliable", body: "Your data stays protected", icon: ShieldCheck },
        { title: "Helpful support", body: "Responsive local assistance", icon: Headphones },
        { title: "Regular improvements", body: "Features keep getting better", icon: RefreshCw },
        { title: "Works everywhere", body: "A web app for every device", icon: MonitorSmartphone },
      ];

  return (
    <section id="za-koga" className="relative overflow-hidden bg-[#fbfaf8] py-16 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-40 top-12 h-96 w-96 rounded-full bg-primary/[0.055] blur-3xl" aria-hidden="true" />
      <div className="container relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-primary sm:text-sm">{section.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl">{section.title}</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{section.intro}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {section.items.map((item, index) => {
            const Icon = audienceIcons[index];
            const routeKey = INDUSTRY_ROUTE_KEYS[index];
            const industry = getIndustryContent(routeKey, language);
            const imageSrc = audienceCardBackgrounds[index];
            const imagePosition = audienceCardImagePositions[index];

            return (
              <a
                key={item.title}
                href={getRoutePath(routeKey, language)}
                className="group relative flex min-h-[330px] overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-[0_20px_46px_-36px_hsl(220_25%_10%/0.35)] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_26px_60px_-34px_hsl(var(--primary)/0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="absolute inset-0">
                  <img
                    src={imageSrc}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ objectPosition: imagePosition }}
                    aria-hidden="true"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.985) 0%, rgba(255,255,255,0.965) 44%, rgba(255,255,255,0.82) 60%, rgba(255,255,255,0.28) 100%)",
                    }}
                    aria-hidden="true"
                  />
                </div>

                <div className="relative z-10 flex w-full flex-col p-6 sm:p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.07] text-primary shadow-sm backdrop-blur-sm">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="max-w-[58%] sm:max-w-[56%] xl:max-w-[54%]">
                    <h3 className="mt-6 text-[1.05rem] font-bold leading-[1.45] tracking-[-0.01em] text-foreground sm:text-[1.12rem]">{item.title}</h3>
                    <p className="mt-3 text-[0.98rem] leading-8 text-muted-foreground">{item.body}</p>
                  </div>
                  <span className="mt-auto flex items-center gap-2 pt-6 text-base font-semibold text-primary">
                    {industry.cardCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 border-t border-border/55 pt-7 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ title, body, icon: Icon }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/[0.07] text-primary">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
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
            {section.items.map((item, index) => { const Icon = howIcons[index]; return <article key={item.title} className="relative rounded-3xl border border-border/60 bg-card p-7 shadow-soft"><StepWatermark index={index} className="right-6 top-5 text-5xl" /><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span><h3 className="mt-6 text-xl font-bold text-foreground">{item.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{item.body}</p></article>; })}
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
  const [pricingCatalog, setPricingCatalog] = useState<PublicPricingCatalog>(getInitialPricingCatalog);

  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicPricingCatalog(controller.signal)
      .then(setPricingCatalog)
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Could not load the public pricing catalog for the homepage; using the built-in fallback.", error);
      });
    return () => controller.abort();
  }, []);

  const basicMonthlyPrice = useMemo(() => {
    const basicPlan = pricingCatalog.plans.find((plan) => plan.key === "basic");
    const value = basicPlan?.monthlyGross ?? pricingCatalog.plans[0].monthlyGross;
    return new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-IE", {
      style: "currency",
      currency: pricingCatalog.currency || "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, [language, pricingCatalog]);

  return (
      <section id="cenik" className="scroll-mt-20 bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.07] p-8 shadow-soft md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                  {section.introPrefix} <strong className="font-semibold text-foreground">{basicMonthlyPrice}</strong> {section.introSuffix}
                </p>
                <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild>
                  <a href={getRoutePath("pricing", language)}>{section.cta}<ArrowRight className="h-4 w-4" /></a>
                </Button>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background p-7 shadow-soft">
                <BadgeEuro className="h-8 w-8 text-primary" />
                <p className="mt-5 font-display text-3xl font-extrabold text-foreground">
                  {section.fromPrefix} {basicMonthlyPrice} {section.perMonth}
                </p>
                <ul className="mt-6 grid gap-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <Check className="h-4 w-4 text-primary" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export const HomeFaq = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].faq;
  const items = getFaqForRoute("home", language) ?? [];
  return (
      <section className="bg-card py-20 md:py-28">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{section.eyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{section.title}</h2><Sparkles className="mt-6 h-9 w-9 text-primary" /></div>
          <div className="grid gap-3" data-speakable="faq">{items.map((item) => <details key={item.question} className="group rounded-2xl border border-border/60 bg-background p-5"><summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden"><h3 className="inline text-base font-semibold">{item.question}</h3></summary><p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div>
        </div>
      </section>
  );
};

export const HomeTrialLink = ({ children }: { children: React.ReactNode }) => (
    <a href={TRIAL_SIGNUP_ROUTE}>{children}</a>
);