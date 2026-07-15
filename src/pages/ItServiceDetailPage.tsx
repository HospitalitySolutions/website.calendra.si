import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { getItServiceContent, isItServiceRouteKey } from "@/lib/it-services";
import { getRouteKeyFromPathname, getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  Lightbulb,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const commonCopy = {
  sl: {
    badge: "Calendra IT storitve",
    benefitsTitle: "Kaj s storitvijo izboljšate",
    includesEyebrow: "Obseg storitve",
    includesTitle: "Kaj lahko vključuje sodelovanje",
    processEyebrow: "Potek sodelovanja",
    processTitle: "Jasen proces od pregleda do predaje",
    outcomesEyebrow: "Rezultati",
    outcomesTitle: "Kaj lahko pričakujete",
    relatedEyebrow: "Povezane storitve",
    relatedTitle: "Morda potrebujete tudi",
    faqEyebrow: "Pogosta vprašanja",
    faqTitle: "Odgovori pred začetkom",
    ctaTitle: "Preverimo, kaj je smiselno za vaše podjetje",
    ctaBody: "Pošljite kratek opis trenutnega stanja, težave ali cilja. Pripravili bomo predlog naslednjih korakov in primeren način sodelovanja.",
    cta: "Pošljite povpraševanje",
    allServices: "Vse IT storitve",
  },
  en: {
    badge: "Calendra IT services",
    benefitsTitle: "What the service improves",
    includesEyebrow: "Service scope",
    includesTitle: "What the work can include",
    processEyebrow: "How we work",
    processTitle: "A clear process from review to handover",
    outcomesEyebrow: "Outcomes",
    outcomesTitle: "What you can expect",
    relatedEyebrow: "Related services",
    relatedTitle: "You may also need",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Answers before we start",
    ctaTitle: "Let us identify the sensible next step for your business",
    ctaBody: "Send a short description of your current situation, problem or goal. We will propose next steps and an appropriate cooperation model.",
    cta: "Send an enquiry",
    allServices: "All IT services",
  },
} as const;

const ItServiceDetailPage = () => {
  const { pathname } = useLocation();
  const { language } = useSiteLanguage();
  const routeKey = getRouteKeyFromPathname(pathname);
  const copy = commonCopy[language];

  if (!isItServiceRouteKey(routeKey)) return null;

  const service = getItServiceContent(routeKey, language);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-background via-card to-primary/[0.07] py-20 md:py-28">
          <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/[0.09] blur-3xl" aria-hidden="true" />
          <div className="container relative mx-auto px-4 lg:px-8">
            <div className="max-w-4xl">
              <a href={getRoutePath("itServices", language)} className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3">
                ← {copy.allServices}
              </a>
              <span className="mt-6 block text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.badge}</span>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">{service.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{service.intro}</p>
              <Button variant="hero" size="lg" className="mt-8 rounded-xl" asChild>
                <a href={`${getRoutePath("contact", language)}?service=${routeKey}`}>{copy.cta}<ArrowRight className="h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="rounded-[2rem] border border-primary/15 bg-primary/[0.04] p-7 shadow-soft md:p-10">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-7 w-7 text-primary" aria-hidden="true" />
                <h2 className="font-display text-2xl font-bold text-foreground">{copy.benefitsTitle}</h2>
              </div>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {service.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background p-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <p className="font-medium leading-7 text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.includesEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.includesTitle}</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {service.deliverables.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background p-5">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="leading-7 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto grid gap-14 px-4 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.processEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.processTitle}</h2>
              <div className="mt-8 grid gap-4">
                {service.process.map((item, index) => (
                  <article key={item.title} className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                    <span className="absolute right-5 top-4 font-display text-4xl font-black text-primary/[0.08]" aria-hidden="true">0{index + 1}</span>
                    <ClipboardCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.outcomesEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.outcomesTitle}</h2>
              <div className="mt-8 grid gap-4">
                {service.outcomes.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-6">
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.relatedEyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.relatedTitle}</h2>
              </div>
              <a href={getRoutePath("itServices", language)} className="font-semibold text-primary">{copy.allServices} →</a>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {service.related.map((relatedKey) => {
                const related = getItServiceContent(relatedKey, language);
                return (
                  <article key={relatedKey} className="rounded-3xl border border-border/60 bg-background p-7">
                    <h3 className="text-xl font-bold text-foreground">{related.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{related.shortDescription}</p>
                    <a href={getRoutePath(relatedKey, language)} className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">
                      {language === "sl" ? "Preberite več" : "Learn more"}<ArrowRight className="h-4 w-4" />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.faqEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.faqTitle}</h2>
              <CircleHelp className="mt-6 h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <div className="grid gap-3">
              {service.faq.map((item) => (
                <details key={item.question} className="rounded-2xl border border-border/60 bg-card p-5">
                  <summary className="cursor-pointer list-none font-semibold text-foreground">{item.question}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card pb-20 md:pb-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.09] via-background to-accent/[0.08] p-8 text-center shadow-soft md:p-12">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.ctaTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.ctaBody}</p>
              <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild>
                <a href={`${getRoutePath("contact", language)}?service=${routeKey}`}>{copy.cta}<ArrowRight className="h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ItServiceDetailPage;
