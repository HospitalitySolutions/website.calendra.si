import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedPages from "@/components/seo/RelatedPages";
import ResponsiveScreenshot from "@/components/marketing/ResponsiveScreenshot";
import { Button } from "@/components/ui/button";
import {
  getIndustryContent,
  INDUSTRY_ROUTE_KEYS,
  isIndustryRouteKey,
  type IndustryRouteKey,
} from "@/lib/industry-pages";
import { getRouteKeyFromPathname, getRoutePath } from "@/lib/localized-routes";
import { MARKETING_IMAGES } from "@/lib/marketing-images";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  BellRing,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Link2,
  MapPin,
  Repeat2,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import StickySalesCtaBar from "@/components/landing/StickySalesCtaBar";

const problemIcons = [Clock3, CalendarCheck2, BellRing, FileText] as const;
const featureIcons = [CalendarCheck2, Repeat2, MapPin, BellRing, UsersRound, ShieldCheck] as const;

const IndustryDetailPage = () => {
  const { pathname } = useLocation();
  const { language } = useSiteLanguage();
  const routeKey = getRouteKeyFromPathname(pathname);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);

  if (!isIndustryRouteKey(routeKey)) return null;

  const page = getIndustryContent(routeKey, language);
  const otherIndustries = INDUSTRY_ROUTE_KEYS.filter((key) => key !== routeKey);
  const primaryLabel = language === "sl" ? "Preizkusite brezplačno" : "Try it free";
  const featuresLabel = language === "sl" ? "Oglejte si funkcionalnosti" : "Explore features";
  const pricingLabel = language === "sl" ? "Oglejte si cenik" : "View pricing";
  const otherSolutionsLabel = language === "sl" ? "Druge rešitve Calendra" : "Other Calendra solutions";
  const heroImage = routeKey === "fitnessGroups" ? MARKETING_IMAGES.bookingTime : MARKETING_IMAGES.calendar;
  const heroImageAlt = routeKey === "fitnessGroups"
    ? language === "sl"
      ? "Spletna prijava na skupinsko vadbo v Calendri z izbiro datuma, ure in prikazom prostih mest"
      : "Online group-class booking in Calendra with date, time and remaining-place selection"
    : language === "sl"
      ? "Tedenski koledar terminov v aplikaciji Calendra z individualnimi in skupinskimi storitvami"
      : "Weekly Calendra appointment calendar with individual and group services";
  const customerProof = routeKey === "beautyHair"
    ? {
        quote: language === "sl"
          ? "S Calendro je organizacija terminov precej enostavnejša. Stranke se lahko naročijo same, mi pa imamo ves čas jasen pregled nad urnikom in manj usklajevanja po telefonu ali sporočilih."
          : "Calendra makes appointment organisation much simpler. Customers can book themselves, while we always have a clear view of the schedule and spend less time coordinating by phone or messages.",
        name: "Urška Grmek",
        role: language === "sl" ? "Lastnik, Depilacije UG" : "Owner, Depilacije UG",
        href: "https://www.depilacijeug.si/",
        translated: language === "en",
      }
    : routeKey === "healthWellbeing"
      ? {
          quote: language === "sl"
            ? "Calendra nam omogoča, da imamo termine, stranke in organizacijo dela pregledno na enem mestu. Posebej nam je pomembno, da je sistem enostaven za uporabo tako za našo ekipo kot za stranke, ki se naročajo na termine."
            : "Calendra lets us keep appointments, clients and work organisation clearly in one place. It is especially important to us that the system is easy to use both for our team and for clients booking appointments.",
          name: "Nina Piberčnik",
          role: language === "sl" ? "Direktor, Inštitut Avisensa" : "Director, Inštitut Avisensa",
          href: "https://avisensa.com/",
          translated: language === "en",
        }
      : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="overflow-hidden border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.07] py-14 md:py-20 lg:py-24">
          <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
            <div>
              <PageBreadcrumbs routeKey={routeKey} />
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.eyebrow}</span>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{page.intro}</p>
              <ul className="mt-7 grid gap-3">
                {page.heroPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm font-semibold leading-6 text-foreground sm:text-base">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/[0.1] text-primary">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div ref={heroCtaRef} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" className="rounded-xl" asChild>
                  <a href={TRIAL_SIGNUP_ROUTE}>{primaryLabel}<ArrowRight className="h-4 w-4" /></a>
                </Button>
                <Button variant="outline" size="lg" className="rounded-xl" asChild>
                  <a href="#funkcionalnosti-panoge">{featuresLabel}</a>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background p-3 shadow-2xl shadow-primary/10 md:p-4">
                <div className="flex items-center gap-2 border-b border-border/60 px-2 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="ml-2 rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">Calendra</span>
                </div>
                <img
                  src={heroImage.src}
                  srcSet={heroImage.srcSet}
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  alt={heroImageAlt}
                  width={heroImage.width}
                  height={heroImage.height}
                  loading="eager"
                  decoding="async"
                  className="mt-3 h-auto w-full rounded-2xl object-left-top"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.problemsEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.problemsTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{page.problemsIntro}</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.problems.map((problem, index) => {
                const Icon = problemIcons[index];
                return (
                  <article key={problem.title} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-foreground">{problem.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{problem.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="funkcionalnosti-panoge" className="scroll-mt-24 bg-card py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.featuresEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.featuresTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{page.featuresIntro}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {page.features.map((feature, index) => {
                const Icon = featureIcons[index];
                return (
                  <article key={feature.title} className="group rounded-3xl border border-border/60 bg-background p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8">
            <div className="lg:sticky lg:top-28">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.workflowEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.workflowTitle}</h2>
              <Link2 className="mt-7 h-9 w-9 text-primary" aria-hidden="true" />
            </div>
            <ol className="grid gap-4">
              {page.workflow.map((step, index) => (
                <li key={step} className="flex gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:items-center">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground">{index + 1}</span>
                  <p className="font-semibold leading-7 text-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {routeKey === "fitnessGroups" ? (
          <section className="bg-card py-20 md:py-28">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.screenshotEyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.screenshotTitle}</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">{page.screenshotDescription}</p>
              </div>
              <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <ResponsiveScreenshot
                  image={MARKETING_IMAGES.bookingTime}
                  alt={language === "sl" ? "Izbira skupinske vadbe v Calendri z odprtimi termini in številom prostih mest" : "Group class selection in Calendra with open times and remaining places"}
                  caption={language === "sl" ? "Udeleženec vidi aktualno kapaciteto še preden potrdi prijavo." : "Participants see live capacity before confirming their booking."}
                />
                <div className="grid gap-6">
                  <ResponsiveScreenshot
                    image={MARKETING_IMAGES.groupParticipants}
                    alt={language === "sl" ? "Podrobnosti skupine v Calendri s kapaciteto 4 od 16 in seznamom prijavljenih udeležencev" : "Calendra group details showing 4 of 16 places filled and the participant list"}
                    caption={language === "sl" ? "Na enem mestu so kapaciteta, prosta mesta in seznam prijavljenih." : "Capacity, remaining places and the participant list stay together."}
                  />
                  <ResponsiveScreenshot
                    image={MARKETING_IMAGES.membership}
                    alt={language === "sl" ? "Denarnica stranke v Calendri z aktivnim mesečnim članstvom za Pilates" : "Calendra client wallet with an active monthly Pilates membership"}
                    caption={language === "sl" ? "Članstva, paketi, tečaji in boni so povezani s profilom udeleženca." : "Memberships, packages, courses and vouchers connect to the participant profile."}
                  />
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg" className="rounded-xl" asChild>
                  <a href={getRoutePath("booking", language)}>{language === "sl" ? "Oglejte si spletno naročanje" : "Explore online booking"}<ArrowRight className="h-4 w-4" /></a>
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-card py-20 md:py-28">
            <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
              <ResponsiveScreenshot
                image={MARKETING_IMAGES.calendar}
                alt={language === "sl" ? "Tedenski pregled individualnih in skupinskih terminov v Calendri" : "Weekly view of individual and group appointments in Calendra"}
                caption={language === "sl" ? "Tedenski pogled poveže različne storitve, odsotnosti in skupinske termine." : "The weekly view combines services, absences and group appointments."}
              />
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.screenshotEyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.screenshotTitle}</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">{page.screenshotDescription}</p>
                <Button variant="outline" size="lg" className="mt-7 rounded-xl" asChild>
                  <a href={getRoutePath("calendar", language)}>{language === "sl" ? "Spoznajte koledar terminov" : "Explore the appointment calendar"}<ArrowRight className="h-4 w-4" /></a>
                </Button>
              </div>
            </div>
          </section>
        )}

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-card to-accent/[0.06] p-8 shadow-soft md:p-12">
              <div className="max-w-3xl">
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.audienceEyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.audienceTitle}</h2>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {page.audiences.map((audience) => (
                  <span key={audience} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {customerProof ? (
          <section className="bg-background py-16 md:py-20">
            <div className="container mx-auto max-w-5xl px-4 lg:px-8">
              <figure className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-card to-accent/[0.05] p-8 shadow-soft md:p-10">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{language === "sl" ? "Izkušnja uporabnika" : "Customer experience"}</p>
                <blockquote className="mt-5 font-display text-2xl font-semibold leading-relaxed text-foreground md:text-3xl">“{customerProof.quote}”</blockquote>
                <figcaption className="mt-7 flex flex-col gap-1 text-sm text-muted-foreground">
                  <a href={customerProof.href} target="_blank" rel="noreferrer noopener" className="w-fit font-bold text-foreground transition hover:text-primary">{customerProof.name}</a>
                  <span>{customerProof.role}</span>
                  {customerProof.translated ? <span className="text-xs">Translated from Slovenian.</span> : null}
                </figcaption>
              </figure>
            </div>
          </section>
        ) : null}

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.faqEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.faqTitle}</h2>
              <Sparkles className="mt-7 h-9 w-9 text-primary" aria-hidden="true" />
            </div>
            <div className="grid gap-3">
              {page.faq.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-border/60 bg-background p-5 open:border-primary/25 open:shadow-sm">
                  <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">{item.question}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <RelatedPages routeKey={routeKey} />

        <section className="border-t border-border/60 bg-background py-16 md:py-20">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-foreground">{otherSolutionsLabel}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {otherIndustries.map((key: IndustryRouteKey) => {
                const other = getIndustryContent(key, language);
                return (
                  <a key={key} href={getRoutePath(key, language)} className="group flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <span className="font-semibold text-foreground">{other.navLabel}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-card pb-20 pt-6 md:pb-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground shadow-xl md:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{page.finalTitle}</h2>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-primary-foreground/85">{page.finalDescription}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Button size="lg" variant="secondary" className="rounded-xl" asChild>
                    <a href={TRIAL_SIGNUP_ROUTE}>{primaryLabel}<ArrowRight className="h-4 w-4" /></a>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                    <a href={getRoutePath("pricing", language)}>{pricingLabel}</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickySalesCtaBar anchorRef={heroCtaRef} placement={`industry_${routeKey}`} />
    </div>
  );
};

export default IndustryDetailPage;
