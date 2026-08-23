import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { StepWatermark } from "@/components/ui/step-watermark";
import { getRoutePath } from "@/lib/localized-routes";
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
  CalendarCheck2,
  Check,
  Clock3,
  MailCheck,
  PlugZap,
  Sparkles,
} from "lucide-react";

const copy = {
  sl: {
    audience: {
      eyebrow: "Storitvena podjetja",
      title: "Za koga je Calendra?",
      intro: "Calendra je primerna za storitvena podjetja vseh velikosti in različnih panog. Ne glede na vaše delovne procese vam pomaga prihraniti čas in navdušiti stranke.",
      items: [
        { title: "Frizerski salon", body: "Upravljajte termine, stiliste in storitve na enem mestu.", cta: "Calendra za frizerske salone" },
        { title: "Kozmetični salon", body: "Organizirajte tretmaje, kozmetičarke in stranke.", cta: "Calendra za kozmetične salone" },
        { title: "Masaža", body: "Poenostavite rezervacije masaž in upravljanje terapevtov.", cta: "Calendra za masažne salone" },
        { title: "Spa & savna", body: "Upravljajte rezervacije, termine in kapacitete brez zapletov.", cta: "Calendra za spa & savne" },
        { title: "Tetoviranje & piercing", body: "Vodite termine, umetnike in naročila pregledno.", cta: "Calendra za tetoviranje & piercing" },
        { title: "Fitnes & osebno trenerstvo", body: "Upravljajte vadbe, trenerje in člane učinkovito.", cta: "Calendra za fitnes centre" },
        { title: "Fizioterapija", body: "Organizirajte terapije, paciente in obravnave.", cta: "Calendra za fizioterapijo" },
        { title: "Psihologija & svetovanje", body: "Zaupni termini, opombe in urejena evidenca strank.", cta: "Calendra za svetovanje" },
        { title: "Joga & pilates", body: "Organizirajte vadbe, inštruktorje in udeležence.", cta: "Calendra za jogo & pilates" },
        { title: "Storitve za hišne ljubljenčke", body: "Upravljajte termine, nego in storitve za ljubljenčke.", cta: "Calendra za storitve za ljubljenčke" },
        { title: "Izobraževanje & coaching", body: "Upravljajte tečaje, mentorje in udeležence.", cta: "Calendra za izobraževanje" },
        { title: "Drugo", body: "Prilagodljivo za vse vrste storitev in delovnih procesov.", cta: "Calendra za druge storitve" },
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
    audience: {
      eyebrow: "Service businesses",
      title: "Who is Calendra for?",
      intro: "Calendra is built for service businesses of every size and across different industries. Whatever your workflow, it helps you save time and deliver a better customer experience.",
      items: [
        { title: "Hair salon", body: "Manage appointments, stylists and services in one place.", cta: "Calendra for hair salons" },
        { title: "Beauty salon", body: "Organise treatments, beauticians and customers.", cta: "Calendra for beauty salons" },
        { title: "Massage", body: "Simplify massage bookings and therapist schedules.", cta: "Calendra for massage" },
        { title: "Spa & sauna", body: "Manage bookings, appointments and capacity with ease.", cta: "Calendra for spa & sauna" },
        { title: "Tattooing & piercing", body: "Keep artists, appointments and bookings organised.", cta: "Calendra for tattoo & piercing" },
        { title: "Fitness & personal training", body: "Manage sessions, trainers and members efficiently.", cta: "Calendra for fitness" },
        { title: "Physiotherapy", body: "Organise treatments, clients and appointments.", cta: "Calendra for physiotherapy" },
        { title: "Psychology & counselling", body: "Keep appointments, notes and client records organised.", cta: "Calendra for counselling" },
        { title: "Yoga & pilates", body: "Organise classes, instructors and participants.", cta: "Calendra for yoga & pilates" },
        { title: "Pet services", body: "Manage appointments, care and services for pets.", cta: "Calendra for pet services" },
        { title: "Education & coaching", body: "Manage courses, mentors and participants.", cta: "Calendra for education" },
        { title: "Other", body: "Flexible for many service types and workflows.", cta: "Calendra for other services" },
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

const audienceCardBackgrounds = [
  "/industries/audience/hair-salon.webp",
  "/industries/audience/beauty-salon.webp",
  "/industries/audience/massage.webp",
  "/industries/audience/spa-sauna.webp",
  "/industries/audience/tattoo-piercing.webp",
  "/industries/audience/fitness-personal-training.webp",
  "/industries/audience/physiotherapy.webp",
  "/industries/audience/psychology-counselling.webp",
  "/industries/audience/yoga-pilates.webp",
  "/industries/audience/pet-services.webp",
  "/industries/audience/education-coaching.webp",
  "/industries/audience/other-services.webp",
] as const;

const audienceRoutes = [
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
] as const;
const howIcons = [Clock3, CalendarCheck2, MailCheck] as const;

export const AudienceSection = () => {
  const { language } = useSiteLanguage();
  const section = copy[language].audience;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    updateCurrent();
    api.on("select", updateCurrent);
    api.on("reInit", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCurrent);
    };
  }, [api]);

  return (
    <section id="za-koga" className="audience-carousel-section relative overflow-hidden py-16 md:py-20">
      <div className="container relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <Carousel setApi={setApi} opts={{ align: "start", loop: true, skipSnaps: false }}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <span className="marketing-eyebrow">{section.eyebrow}</span>
              <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[2.8rem]">{section.title}</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{section.intro}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <CarouselPrevious
                aria-label={language === "sl" ? "Prejšnje dejavnosti" : "Previous industries"}
                className="static h-11 w-11 translate-x-0 translate-y-0 border-border bg-white text-primary shadow-none hover:bg-primary hover:text-white"
              />
              <CarouselNext
                aria-label={language === "sl" ? "Naslednje dejavnosti" : "Next industries"}
                className="static h-11 w-11 translate-x-0 translate-y-0 border-primary bg-primary text-white shadow-none hover:bg-primary/90"
              />
            </div>
          </div>

          <CarouselContent className="mt-8 -ml-2 sm:-ml-3">
            {section.items.map((item, index) => (
              <CarouselItem
                key={item.title}
                className="basis-[82%] pl-2 sm:basis-[46%] sm:pl-3 md:basis-[33%] lg:basis-[24%] xl:basis-[16.666%]"
              >
                <a
                  href={getRoutePath(audienceRoutes[index], language)}
                  className="audience-carousel-card group relative block aspect-[1.04/1] overflow-hidden rounded-[10px] bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={item.cta}
                >
                  <img
                    src={audienceCardBackgrounds[index]}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#06142e]/95 via-[#06142e]/10 to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                    <span className="font-display text-[1.02rem] font-bold leading-tight text-white">{item.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-white/85 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  <span className="sr-only">{item.body}</span>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mx-auto mt-7 flex max-w-md items-center gap-1.5" aria-hidden="true">
            {section.items.map((item, index) => (
              <span
                key={item.title}
                className={`h-1 flex-1 rounded-full transition-colors ${index === current ? "bg-primary" : "bg-slate-200"}`}
              />
            ))}
          </div>
        </Carousel>
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
    <section id="cenik" className="editorial-pricing-band relative scroll-mt-20 overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="container relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-24">
          <div className="max-w-2xl">
            <span className="marketing-eyebrow">{section.eyebrow}</span>
            <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[3rem]">{section.title}</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {section.introPrefix} <strong className="font-semibold text-foreground">{basicMonthlyPrice}</strong> {section.introSuffix}
            </p>
            <Button variant="hero" size="lg" className="mt-7 h-12 rounded-[10px] px-7 shadow-none" asChild>
              <a href={getRoutePath("pricing", language)}>{section.cta}<ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>

          <div className="w-full max-w-[560px] lg:justify-self-end">
            <p className="font-display text-3xl font-extrabold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-[3.1rem]">
              {section.fromPrefix} <span className="text-primary">{basicMonthlyPrice}</span>{" "}
              <span className="text-base font-bold tracking-normal sm:text-lg">{section.perMonth}</span>
            </p>
            <ul className="mt-6 grid gap-4">
              {section.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base font-medium text-foreground sm:text-lg">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-primary text-primary">
                    <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm text-muted-foreground">
              {section.items.slice(0, 2).join("  ·  ")}
            </p>
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
    <section className="home-faq-editorial py-16 md:py-20 lg:py-28">
      <div className="container mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="marketing-eyebrow">{section.eyebrow}</span>
            <h2 className="marketing-section-title mt-3 max-w-md text-3xl sm:text-4xl lg:text-[2.8rem]">{section.title}</h2>
            <span className="mt-7 grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Sparkles className="h-6 w-6" /></span>
          </div>
          <div className="grid gap-3">
            {items.map((item) => (
              <details key={item.question} className="group rounded-[18px] border border-border/70 bg-white/70 px-5 py-4 shadow-[0_16px_44px_-40px_rgba(15,23,42,0.35)] open:bg-white open:shadow-[0_22px_52px_-40px_rgba(15,23,42,0.42)]">
                <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden"><h3 className="inline text-base font-semibold">{item.question}</h3></summary>
                <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomeTrialLink = ({ children }: { children: React.ReactNode }) => (
    <a href={TRIAL_SIGNUP_ROUTE}>{children}</a>
);
