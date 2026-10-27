import { useRef } from "react";
import { ArrowRight, BarChart3, CalendarDays, Check, ChevronDown, CircleX, Clock3, CreditCard, Database, Globe, Ticket, UserRound, UsersRound } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickySalesCtaBar from "@/components/landing/StickySalesCtaBar";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { TrialSignupLink } from "@/components/TrialSignupLink";
import { getIndustryContent } from "@/lib/industry-pages";
import { getRoutePath } from "@/lib/localized-routes";
import { MARKETING_IMAGES, type MarketingImage } from "@/lib/marketing-images";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import "@/styles/group-bookings.css";
import "@/styles/fitness-landing.css";

const content = {
  sl: {
    eyebrow: "Profesionalne rešitve za fitnes in osebne trenerje",
    title: ["Program za fitnes centre,", "osebne trenerje in", "skupinske vadbe"],
    intro: "Spletne rezervacije, skupinske vadbe, osebni treningi, članstva in paketi v enem sistemu. Stranke se naročijo same, vi pa imate več časa za vadbo in manj dela z organizacijo.",
    points: ["Spletne prijave za skupinske in individualne treninge", "Članstva, paketi obiskov in različne vrste vadb", "Evidenca obiskov, čakalna vrsta in samodejna obvestila", "Manj administracije, več časa za vaše stranke"],
    trial: "Preizkusite brezplačno", demo: "Rezervirajte predstavitev", trialNote: "14 dni brezplačno", cardNote: "Brez kreditne kartice",
    audienceEyebrow: "Za vsak tip vadbe in posla",
    audienceTitle: "Primerno za različne fitnes aktivnosti",
    audienceIntro: "Calendra se prilagodi vašemu načinu dela – ne glede na velikost studia, vrsto vadbe ali lokacijo.",
    audiences: [
      { title: "Fitnes studii", description: "Upravljajte skupinske vadbe, članstva in osebne treninge v enem sistemu." },
      { title: "Pilates in joga", description: "Uredite urnike, omejitve mest in čakalne vrste za vaše skupine." },
      { title: "Funkcionalna vadba", description: "Organizirajte krožne vadbe, HIIT in druge skupinske programe." },
      { title: "Osebni trenerji", description: "Upravljajte individualne termine, razpoložljivost in pakete obiskov." },
    ],
    featuresEyebrow: "Vse, kar potrebujete v enem sistemu",
    featuresTitle: "Funkcionalnosti za uspešen fitnes posel",
    featuresIntro: "Od prve prijave do evidence obiska – povežite vsakodnevno delo fitnes centra, studia ali osebnega trenerja.",
    features: [
      { title: "Skupinske vadbe", description: "Ustvarite urnik, omejite število mest in omogočite enostavne spletne prijave." },
      { title: "Osebni treningi", description: "Uredite individualne termine, trajanje treningov in razpoložljivost trenerjev." },
      { title: "Članstva in paketi", description: "Ponudite mesečna članstva, pakete obiskov in posamezne obiske." },
      { title: "Čakalna vrsta", description: "Zbirajte prijave na polne vadbe in obvestite čakajoče ob sprostitvi mesta." },
      { title: "Evidenca obiskov", description: "Spremljajte prisotnost ter porabljene, rezervirane in razpoložljive obiske." },
      { title: "Spletne prijave", description: "Stranke se naročijo same in prejmejo potrditve ter opomnike na termin." },
    ],
    challengesEyebrow: "Manj izzivov, več časa za vadbo",
    challengesTitle: "Znani izzivi v fitnes centrih in pri osebnih trenerjih?",
    challengesIntro: "Calendra poveže prijave, urnike in podatke o strankah, da je vsakodnevno delo preglednejše.",
    challenges: [
      { title: "Ročno usklajevanje", description: "Klici in sporočila za vsak termin? Stranke lahko prost termin izberejo in rezervirajo same." },
      { title: "Prepolne ali nezapolnjene vadbe", description: "Določite kapaciteto, spremljajte zasedenost in uporabite čakalno vrsto ob sprostitvi mesta." },
      { title: "Odpovedi in neprihodi", description: "Nastavite pravila odpovedi, pošiljajte opomnike in beležite udeležbo na vadbi." },
      { title: "Razpršeni podatki o strankah", description: "Termini, članstva, paketi in obiski so povezani s stranko, ne raztreseni po beležkah." },
    ],
    workflowEyebrow: "Preprosto do bolj urejenega poslovanja", workflowTitle: "Kako deluje?",
    workflowIntro: "Trije koraki od vašega urnika do pregledne evidence obiskov.",
    steps: [
      { title: "Nastavite urnik", description: "Dodajte skupinske vadbe in individualne termine. Določite trenerje, kapacitete in cene." },
      { title: "Stranke se naročijo", description: "Stranke izberejo prost termin in se naročijo prek vaše spletne strani ali povezave za naročanje." },
      { title: "Spremljajte obiske in pakete", description: "Imejte jasen pregled nad udeležbo, veljavnostjo paketov in preostalimi obiski." },
    ],
    calendarAlt: "Tedenski koledar Calendra z individualnimi in skupinskimi termini",
    bookingAlt: "Spletno naročanje v Calendri z izbiro termina in prikazom prostih mest",
    membershipAlt: "Pregled članstva in obiskov na profilu stranke v Calendri",
    calendarCaption: "Vaš urnik", bookingCaption: "Naročanje za stranke", membershipCaption: "Članstva in obiski",
    screenshotNote: "Primeri uporabniškega vmesnika Calendra.",
    finalEyebrow: "Začnite še danes", finalTitle: "Manj administracije. Več časa za vaše stranke.",
    finalIntro: "Oglejte si, kako lahko Calendra poveže vaše vadbe, spletne prijave in pakete obiskov.",
    pricing: "Oglejte si cenik", groupBookings: "Več o skupinskih rezervacijah",
  },
  en: {
    eyebrow: "Professional tools for fitness businesses and personal trainers",
    title: ["Software for fitness studios,", "personal trainers and", "group classes"],
    intro: "Online bookings, group classes, personal training, memberships and passes in one system. Clients book themselves, leaving you more time for training and less administration.",
    points: ["Online booking for group and individual sessions", "Memberships, visit passes and different class types", "Attendance, waiting lists and automatic notifications", "Less administration, more time for your clients"],
    trial: "Try it free", demo: "Book a demo", trialNote: "14 days free", cardNote: "No credit card required",
    audienceEyebrow: "For different training styles and businesses",
    audienceTitle: "Built for different fitness activities",
    audienceIntro: "Adapt Calendra to the way you work, whatever your studio size, class type or location.",
    audiences: [
      { title: "Fitness studios", description: "Manage group classes, memberships and personal training in one system." },
      { title: "Pilates and yoga", description: "Organise timetables, class capacity and waiting lists for your groups." },
      { title: "Functional training", description: "Organise circuit training, HIIT and other group programmes." },
      { title: "Personal trainers", description: "Manage individual appointments, availability and visit passes." },
    ],
    featuresEyebrow: "Everything connected in one system",
    featuresTitle: "Features for your fitness business",
    featuresIntro: "Connect the daily work of your gym, studio or personal training business, from booking to attendance.",
    features: [
      { title: "Group classes", description: "Create your timetable, set class capacity and enable simple online booking." },
      { title: "Personal training", description: "Manage individual sessions, training duration and trainer availability." },
      { title: "Memberships and passes", description: "Offer monthly memberships, multi-visit passes and single visits." },
      { title: "Waiting lists", description: "Collect interest in full classes and notify waiting clients when a place opens." },
      { title: "Attendance tracking", description: "Track attendance and used, reserved and available visits." },
      { title: "Online booking", description: "Clients book themselves and receive confirmations and appointment reminders." },
    ],
    challengesEyebrow: "Less coordination, more time for training",
    challengesTitle: "Familiar challenges in your fitness business?",
    challengesIntro: "Connect bookings, schedules and client information for a clearer view of daily operations.",
    challenges: [
      { title: "Manual coordination", description: "Calls and messages for every session? Clients can choose and book an available time themselves." },
      { title: "Overfilled or empty classes", description: "Set capacity, check availability and use waiting lists when a place becomes free." },
      { title: "Cancellations and no-shows", description: "Set cancellation rules, send reminders and record class attendance." },
      { title: "Scattered client information", description: "Appointments, memberships, passes and visits stay connected to the client." },
    ],
    workflowEyebrow: "A simpler way to organise your business", workflowTitle: "How does it work?",
    workflowIntro: "Three steps from your timetable to a clear attendance record.",
    steps: [
      { title: "Set up your schedule", description: "Add group classes and individual appointments. Set trainers, capacity and prices." },
      { title: "Clients book a session", description: "Clients choose an available time and book through your website or booking link." },
      { title: "Track visits and passes", description: "Keep a clear view of attendance, pass validity and remaining visits." },
    ],
    calendarAlt: "Calendra weekly calendar with individual appointments and group classes",
    bookingAlt: "Online booking in Calendra showing available times and remaining places",
    membershipAlt: "Calendra client membership and visit overview",
    calendarCaption: "Your schedule", bookingCaption: "Client booking", membershipCaption: "Memberships and visits",
    screenshotNote: "Examples of the Calendra interface.",
    finalEyebrow: "Get started today", finalTitle: "Less administration. More time for your clients.",
    finalIntro: "See how Calendra can connect your classes, online bookings and visit passes.",
    pricing: "View pricing", groupBookings: "Explore group bookings",
  },
} as const;

const audienceImages = [
  { src: "/industries/audience/fitness-personal-training.webp", position: "center" },
  { src: "/industries/audience/yoga-pilates.webp", position: "center" },
  { src: "/industries/fitness-groups-bg.png", position: "center" },
  { src: "/industries/audience/fitness-personal-training.webp", position: "70% center" },
];
const featureIcons = [UsersRound, UserRound, Ticket, UsersRound, BarChart3, Globe];
const challengeIcons = [Clock3, UsersRound, CircleX, Database];

const ProductImage = ({ image, alt, eager = false, sizes = "(min-width: 1024px) 360px, 92vw" }: {
  image: MarketingImage; alt: string; eager?: boolean; sizes?: string;
}) => (
  <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt={alt} width={image.width} height={image.height}
    loading={eager ? "eager" : "lazy"} decoding="async" className="h-auto w-full" />
);

const FitnessActions = ({ language }: { language: SiteLanguage }) => {
  const copy = content[language];
  return (
    <div className="group-bookings-actions flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button variant="hero" size="lg" asChild>
        <TrialSignupLink onClick={() => trackMarketingEvent("trial_cta_click", { placement: "industry_page", language })}>
          {copy.trial}<ArrowRight className="h-4 w-4" aria-hidden="true" />
        </TrialSignupLink>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <a href={getRoutePath("demo", language)} onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "industry_page", language })}>{copy.demo}</a>
      </Button>
    </div>
  );
};

const TrialNotes = ({ language }: { language: SiteLanguage }) => (
  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
    <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />{content[language].trialNote}</span>
    <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />{content[language].cardNote}</span>
  </div>
);

const FitnessLandingPage = () => {
  const { language } = useSiteLanguage();
  const copy = content[language];
  const page = getIndustryContent("fitnessPersonalTraining", language);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const stepImages = [MARKETING_IMAGES.calendar, MARKETING_IMAGES.bookingTime, MARKETING_IMAGES.membership];
  const stepAlts = [copy.calendarAlt, copy.bookingAlt, copy.membershipAlt];

  return (
    <div className="marketing-page marketing-redesign group-bookings-page fitness-page min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="fitness-hero" className="group-bookings-hero" aria-labelledby="fitness-title">
          <div className="container">
            <PageBreadcrumbs routeKey="fitnessPersonalTraining" />
            <div className="group-bookings-hero-layout">
              <div className="group-bookings-hero-copy">
                <span className="marketing-eyebrow">{copy.eyebrow}</span>
                <h1 id="fitness-title" className="font-display text-3xl font-bold tracking-tight">
                  {copy.title.map((line, index) => <span key={line} className={index === 2 ? "text-primary" : undefined}>{index > 0 ? " " : ""}{line}</span>)}
                </h1>
                <p className="group-bookings-intro">{copy.intro}</p>
                <ul className="group-bookings-points">
                  {copy.points.map((point) => <li key={point}><span><Check aria-hidden="true" /></span>{point}</li>)}
                </ul>
                <div ref={heroCtaRef} className="mt-8"><FitnessActions language={language} /></div>
                <TrialNotes language={language} />
              </div>
              <div className="fitness-product" aria-label={copy.screenshotNote}>
                <figure className="fitness-calendar rounded-2xl border border-border bg-white p-3 shadow-xl">
                  <figcaption className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />{copy.calendarCaption}</figcaption>
                  <ProductImage image={MARKETING_IMAGES.calendar} alt={copy.calendarAlt} eager sizes="(min-width: 1024px) 620px, 92vw" />
                </figure>
                <figure className="fitness-booking rounded-2xl border border-border bg-white p-3 shadow-lg">
                  <figcaption className="mb-3 text-xs font-semibold">{copy.bookingCaption}</figcaption>
                  <ProductImage image={MARKETING_IMAGES.bookingTime} alt={copy.bookingAlt} eager sizes="(min-width: 1024px) 240px, 44vw" />
                </figure>
                <figure className="fitness-membership rounded-2xl border border-border bg-white p-3 shadow-lg">
                  <figcaption className="mb-3 text-xs font-semibold">{copy.membershipCaption}</figcaption>
                  <ProductImage image={MARKETING_IMAGES.membership} alt={copy.membershipAlt} eager sizes="(min-width: 1024px) 160px, 38vw" />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section id="fitness-activities" className="group-bookings-use-cases" aria-labelledby="fitness-activities-title">
          <div className="container">
            <span className="marketing-eyebrow">{copy.audienceEyebrow}</span>
            <h2 id="fitness-activities-title" className="mt-3 font-display text-3xl font-bold tracking-tight">{copy.audienceTitle}</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{copy.audienceIntro}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {copy.audiences.map((item, index) => (
                <article key={item.title} className="overflow-hidden rounded-xl border border-border bg-white">
                  <img src={audienceImages[index].src} alt="" width="640" height="360" loading="lazy" decoding="async" className="fitness-audience-image w-full object-cover" style={{ objectPosition: audienceImages[index].position }} />
                  <div className="p-5"><h3 className="font-display text-base font-bold leading-6">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="funkcionalnosti-panoge" className="fitness-section scroll-mt-24" aria-labelledby="fitness-features-title">
          <div className="container">
            <span className="marketing-eyebrow">{copy.featuresEyebrow}</span>
            <h2 id="fitness-features-title" className="mt-3 font-display text-3xl font-bold tracking-tight">{copy.featuresTitle}</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{copy.featuresIntro}</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {copy.features.map((item, index) => {
                const Icon = featureIcons[index];
                return <article key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-white p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <div><h3 className="font-display text-base font-bold leading-6">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="fitness-challenges" className="fitness-section fitness-tint" aria-labelledby="fitness-challenges-title">
          <div className="container">
            <span className="marketing-eyebrow">{copy.challengesEyebrow}</span>
            <h2 id="fitness-challenges-title" className="mt-3 font-display text-3xl font-bold tracking-tight">{copy.challengesTitle}</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{copy.challengesIntro}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {copy.challenges.map((item, index) => {
                const Icon = challengeIcons[index];
                return <article key={item.title} className="rounded-xl border border-border bg-white p-5">
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <h3 className="font-display text-base font-bold leading-6">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="fitness-workflow" className="fitness-section" aria-labelledby="fitness-workflow-title">
          <div className="container">
            <span className="marketing-eyebrow">{copy.workflowEyebrow}</span>
            <h2 id="fitness-workflow-title" className="mt-3 font-display text-3xl font-bold tracking-tight">{copy.workflowTitle}</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{copy.workflowIntro}</p>
            <ol className="mt-7 grid gap-6 lg:grid-cols-3">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="fitness-step">
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground" aria-hidden="true">{index + 1}</span>
                    <div><h3 className="font-display text-base font-bold leading-6">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p></div>
                  </div>
                  <div className="fitness-step-visual mt-5 overflow-hidden rounded-xl border border-border bg-white p-3">
                    <ProductImage image={stepImages[index]} alt={stepAlts[index]} />
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">{copy.screenshotNote}</p>
          </div>
        </section>

        <section id="fitness-faq" className="fitness-section fitness-tint" aria-labelledby="fitness-faq-title">
          <div className="container">
            <h2 id="fitness-faq-title" className="font-display text-3xl font-bold tracking-tight">{page.faqTitle}</h2>
            <div className="mt-7 grid gap-3">
              {page.faq.map((item) => <details key={item.question} className="group rounded-xl border border-border bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden">{item.question}<ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">{item.answer}</p>
              </details>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-semibold text-primary">
              <a href={getRoutePath("pricing", language)} className="inline-flex items-center gap-2 hover:underline">{copy.pricing}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href={language === "sl" ? "/skupinske-rezervacije" : "/en/group-bookings"} className="inline-flex items-center gap-2 hover:underline">{copy.groupBookings}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section id="fitness-cta" className="fitness-section" aria-labelledby="fitness-cta-title">
          <div className="container">
            <div className="fitness-final rounded-2xl border border-border p-6 md:p-8">
              <div><span className="marketing-eyebrow">{copy.finalEyebrow}</span><h2 id="fitness-cta-title" className="mt-3 font-display text-3xl font-bold tracking-tight">{copy.finalTitle}</h2><p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{copy.finalIntro}</p></div>
              <div><FitnessActions language={language} /><TrialNotes language={language} /></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickySalesCtaBar anchorRef={heroCtaRef} placement="industry_fitnessPersonalTraining" />
    </div>
  );
};

export default FitnessLandingPage;
