import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getCustomerStoryFromPathname } from "@/lib/customer-stories";
import { getRoutePath } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, CheckCircle2, ExternalLink, Quote } from "lucide-react";
import { useLocation } from "react-router-dom";
import NotFound from "./NotFound";

const copy = {
  sl: {
    home: "Domov",
    stories: "Zgodbe strank",
    verified: "Dejanski način uporabe Calendre",
    testimonial: "Izkušnja stranke",
    website: "Spletna stran podjetja",
    nextTitle: "Bi podoben potek dela koristil tudi vašemu podjetju?",
    nextBody: "Calendra se prilagodi različnim načinom naročanja — od notranjega koledarja do popolnoma samostojnih spletnih rezervacij, opomnikov in računov.",
    trial: "Preizkusite brezplačno",
    storiesLink: "Vse zgodbe strank",
  },
  en: {
    home: "Home",
    stories: "Customer stories",
    verified: "Real Calendra workflow",
    testimonial: "Customer experience",
    website: "Company website",
    nextTitle: "Could a similar workflow help your business?",
    nextBody: "Calendra adapts to different booking workflows — from an internal calendar to fully self-service online booking, reminders and invoicing.",
    trial: "Try it free",
    storiesLink: "All customer stories",
  },
} as const;

const CustomerStoryDetailPage = () => {
  const { pathname } = useLocation();
  const { language } = useSiteLanguage();
  const story = getCustomerStoryFromPathname(pathname);

  if (!story) return <NotFound />;

  const content = story.content[language];
  const text = copy[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.07] py-12 md:py-18 lg:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href={getRoutePath("home", language)}>{text.home}</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href={getRoutePath("customerStories", language)}>{text.stories}</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{story.name}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_19rem] lg:items-center">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{content.eyebrow}</p>
                <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {content.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{content.description}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-sm font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {text.verified}
                  </span>
                  <a href={story.websiteUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">
                    {text.website}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="flex min-h-64 items-center justify-center rounded-[2rem] border border-border/60 bg-background p-8 shadow-soft">
                <img
                  src={story.logo.src}
                  alt={story.logo.alt}
                  width={story.logo.width}
                  height={story.logo.height}
                  loading="eager"
                  decoding="async"
                  className="max-h-40 w-auto max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">{content.challengeTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{content.businessDescription}</p>
              <ul className="mt-7 grid gap-4">
                {content.challenge.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-5 text-base leading-7 text-foreground/90">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.05] p-7 md:p-8">
              <h2 className="font-display text-2xl font-bold text-foreground">{content.setupTitle}</h2>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {content.facts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl border border-border/60 bg-background p-5">
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{fact.label}</dt>
                    <dd className="mt-2 text-base font-bold text-foreground">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{content.workflowTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{content.workflowIntro}</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {content.features.map((feature, index) => (
                <article key={feature.title} className="rounded-3xl border border-border/60 bg-background p-6 shadow-soft">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/[0.08] font-mono text-sm font-bold text-primary">0{index + 1}</span>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="rounded-[2rem] border border-border/60 bg-card p-7 md:p-8">
              <h2 className="font-display text-3xl font-bold text-foreground">{content.outcomeTitle}</h2>
              <ul className="mt-6 grid gap-4">
                {content.outcomes.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-7 text-foreground/90">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.05] p-7 md:p-9">
              <Quote className="h-8 w-8 text-primary" aria-hidden="true" />
              <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.16em] text-primary">{text.testimonial}</p>
              <blockquote className="mt-4 font-display text-2xl font-semibold leading-relaxed text-foreground">“{content.testimonial}”</blockquote>
              <figcaption className="mt-7 border-t border-border/60 pt-5">
                <p className="font-bold text-foreground">{story.representative}</p>
                <p className="mt-1 text-sm text-muted-foreground">{content.representativeRole}</p>
                <a href={story.websiteUrl} target="_blank" rel="noreferrer noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {content.websiteLabel}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-t border-border/60 bg-card py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="grid gap-5 md:grid-cols-2">
              <a href={getRoutePath(story.industryRouteKey, language)} className="group flex items-center justify-between gap-5 rounded-3xl border border-border/60 bg-background p-7 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Calendra</p>
                  <h2 className="mt-2 text-xl font-bold text-foreground">{content.industryCta}</h2>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a href={getRoutePath("customerStories", language)} className="group flex items-center justify-between gap-5 rounded-3xl border border-border/60 bg-background p-7 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Calendra</p>
                  <h2 className="mt-2 text-xl font-bold text-foreground">{text.storiesLink}</h2>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-xl md:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="font-display text-3xl font-bold sm:text-4xl">{text.nextTitle}</h2>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-primary-foreground/85">{text.nextBody}</p>
                </div>
                <Button variant="secondary" size="lg" className="rounded-xl" asChild>
                  <a href={TRIAL_SIGNUP_ROUTE}>{text.trial}<ArrowRight className="h-4 w-4" /></a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerStoryDetailPage;
