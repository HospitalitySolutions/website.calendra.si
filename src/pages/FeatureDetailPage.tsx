import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StickySalesCtaBar from "@/components/landing/StickySalesCtaBar";
import AnswerSummary from "@/components/seo/AnswerSummary";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedPages from "@/components/seo/RelatedPages";
import { Button } from "@/components/ui/button";
import { getFaqForRoute } from "@/lib/faq";
import { getFeatureContent, isFeatureRouteKey } from "@/lib/feature-pages";
import { getRoutePath, getRouteKeyFromPathname } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Check, CheckCircle2, Link2, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

const FeatureDetailPage = () => {
  const { pathname } = useLocation();
  const { language } = useSiteLanguage();
  const routeKey = getRouteKeyFromPathname(pathname);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);

  if (!isFeatureRouteKey(routeKey)) return null;

  const page = getFeatureContent(routeKey, language);
  const faq = getFaqForRoute(routeKey, language) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <PageBreadcrumbs routeKey={routeKey} />
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{page.eyebrow}</span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{page.intro}</p>
            <AnswerSummary routeKey={routeKey} className="mt-6" />

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

            <div ref={heroCtaRef} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="lg" className="rounded-xl" asChild>
                <a href={TRIAL_SIGNUP_ROUTE}>
                  {language === "sl" ? "Preizkusite brezplačno" : "Try it free"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-xl" asChild>
                <a href={getRoutePath("pricing", language)}>
                  {language === "sl" ? "Oglejte si pakete Calendra" : "Explore Calendra plans"}
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.useCasesTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{page.useCasesIntro}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {page.useCases.map((useCase) => (
              <article key={useCase.title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                <h3 className="font-display text-xl font-bold text-foreground">{useCase.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{useCase.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.benefitsTitle}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {page.benefits.map((benefit) => (
                <article key={benefit.title} className="rounded-3xl border border-border/60 bg-background p-7 shadow-soft">
                  <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-bold text-foreground">{benefit.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{benefit.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.comparisonTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{page.comparisonIntro}</p>

          <div className="mt-10 overflow-x-auto rounded-3xl border border-border/60 shadow-soft">
            <table className="w-full min-w-[640px] border-collapse bg-card text-left">
              <thead>
                <tr className="border-b border-border/60 bg-background">
                  <th scope="col" className="px-5 py-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                    {language === "sl" ? "Kaj primerjamo" : "What we compare"}
                  </th>
                  <th scope="col" className="px-5 py-4 text-sm font-bold text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {page.comparisonManualLabel}
                    </span>
                  </th>
                  <th scope="col" className="px-5 py-4 text-sm font-bold text-primary">
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {page.comparisonCalendraLabel}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.comparisonRows.map((row) => (
                  <tr key={row.aspect} className="border-b border-border/40 last:border-b-0">
                    <th scope="row" className="px-5 py-4 align-top text-sm font-semibold text-foreground">
                      {row.aspect}
                    </th>
                    <td className="px-5 py-4 align-top text-sm leading-6 text-muted-foreground">{row.manual}</td>
                    <td className="px-5 py-4 align-top text-sm leading-6 text-foreground">{row.calendra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <Link2 className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground">{page.processTitle}</h2>
            </div>
            <ol className="grid gap-4">
              {page.process.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-border/60 bg-background p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="pt-1.5 font-medium leading-6 text-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {page.screenshot ? (
          <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
            <figure className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
              <img
                src={page.screenshot.src}
                alt={page.screenshot.alt}
                width={page.screenshot.width}
                height={page.screenshot.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
              <figcaption className="border-t border-border/60 px-5 py-4 text-sm text-muted-foreground">
                {page.screenshot.caption}
              </figcaption>
            </figure>
          </section>
        ) : null}

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.detailsTitle}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {page.details.map((detail) => (
                <article key={detail.title} className="rounded-3xl border border-border/60 bg-background p-7 shadow-soft">
                  <h3 className="font-display text-xl font-bold text-foreground">{detail.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{detail.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{page.faqTitle}</h2>
          <div className="mt-8 grid gap-3" data-speakable="faq">
            {faq.map((item) => (
              <details key={item.question} className="rounded-2xl border border-border/60 bg-card p-5">
                <summary className="cursor-pointer list-none font-semibold text-foreground">
                  <h3 className="inline text-base font-semibold">{item.question}</h3>
                </summary>
                <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedPages routeKey={routeKey} />

        <section className="container mx-auto max-w-6xl px-4 py-16 text-center lg:px-8 md:py-24">
          <h2 className="font-display text-3xl font-bold text-foreground">{page.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{page.finalBody}</p>
          <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild>
            <a href={TRIAL_SIGNUP_ROUTE}>
              {language === "sl" ? "Začnite brezplačno" : "Start free"}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </section>
      </main>
      <Footer />
      <StickySalesCtaBar anchorRef={heroCtaRef} placement={`feature_${routeKey}`} />
    </div>
  );
};

export default FeatureDetailPage;
