import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import RelatedPages from "@/components/seo/RelatedPages";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";
import {
  COMPARISON_INDEX_PATH,
  COMPARISON_SLUGS,
  getComparison,
  getComparisonPath,
  getComparisonSlugFromPathname,
} from "@/lib/comparison-pages";
import { canonicalRoutes } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Check, ExternalLink, ThumbsUp } from "lucide-react";
import { useLocation } from "react-router-dom";

const ComparisonPage = () => {
  const { pathname } = useLocation();
  const { language } = useSiteLanguage();
  const slug = getComparisonSlugFromPathname(pathname);

  if (!slug) return <NotFound />;

  const comparison = getComparison(slug);
  const copy = comparison.content[language];
  const others = COMPARISON_SLUGS.filter((other) => other !== slug);

  const reviewedLabel = new Intl.DateTimeFormat(language === "sl" ? "sl-SI" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${comparison.lastReviewed}T00:00:00Z`));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="container mx-auto max-w-6xl px-4 pt-10 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={canonicalRoutes.home[language]}>
                  {language === "sl" ? "Domov" : "Home"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={COMPARISON_INDEX_PATH[language]}>
                  {language === "sl" ? "Primerjave" : "Comparisons"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{comparison.competitorName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            {language === "sl" ? "Primerjava" : "Comparison"}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {copy.title}
          </h1>

          <p
            data-speakable="answer"
            className="mt-6 max-w-3xl rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 text-base leading-7 text-foreground sm:text-lg sm:leading-8"
          >
            {copy.answer}
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.intro}</p>

          <p className="mt-6 text-sm text-muted-foreground">
            {language === "sl"
              ? `Podatki o ${comparison.competitorName} so bili nazadnje preverjeni ${reviewedLabel}. Pred odločitvijo jih preverite še pri ponudniku.`
              : `${comparison.competitorName} details were last reviewed on ${reviewedLabel}. Please verify them with the vendor before deciding.`}{" "}
            <a
              href={comparison.competitorUrl}
              target="_blank"
              rel="noreferrer noopener nofollow"
              className="inline-flex items-center gap-1 font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              {comparison.competitorName}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </p>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-14 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {copy.positioningTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.positioning}</p>
        </section>

        <section className="bg-card py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {copy.tableTitle}
            </h2>
            <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">{copy.tableIntro}</p>

            <div className="mt-8 overflow-x-auto rounded-3xl border border-border/60 bg-background shadow-soft">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="border-b border-border/60 px-5 py-4 font-bold text-foreground">
                      {language === "sl" ? "Merilo" : "Criterion"}
                    </th>
                    <th scope="col" className="border-b border-border/60 px-5 py-4 font-bold text-primary">
                      Calendra
                    </th>
                    <th scope="col" className="border-b border-border/60 px-5 py-4 font-bold text-foreground">
                      {comparison.competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {copy.rows.map((row) => (
                    <tr key={row.dimension}>
                      <th scope="row" className="border-b border-border/40 px-5 py-4 align-top font-semibold text-foreground">
                        {row.dimension}
                      </th>
                      <td className="border-b border-border/40 px-5 py-4 align-top leading-6 text-muted-foreground">
                        {row.calendra}
                      </td>
                      <td className="border-b border-border/40 px-5 py-4 align-top leading-6 text-muted-foreground">
                        {row.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid max-w-6xl gap-6 px-4 py-16 lg:grid-cols-2 lg:px-8 md:py-20">
          <article className="rounded-3xl border border-border/60 bg-background p-7">
            <ThumbsUp className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">{copy.chooseThemTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{copy.chooseThemIntro}</p>
            <ul className="mt-5 grid gap-3">
              {copy.chooseThem.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-muted-foreground">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-7">
            <ThumbsUp className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">{copy.chooseUsTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{copy.chooseUsIntro}</p>
            <ul className="mt-5 grid gap-3">
              {copy.chooseUs.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-foreground/90">
                  <Check className="mt-1.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="bg-card py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {copy.faqTitle}
            </h2>
            <div className="mt-8 grid gap-3" data-speakable="faq">
              {copy.faq.map((item) => (
                <details key={item.question} className="rounded-2xl border border-border/60 bg-background p-5">
                  <summary className="cursor-pointer list-none font-semibold text-foreground">
                    <h3 className="inline text-base font-semibold">{item.question}</h3>
                  </summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {language === "sl" ? "Druge primerjave" : "Other comparisons"}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {others.map((other) => (
              <a
                key={other}
                href={getComparisonPath(other, language)}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
              >
                {getComparison(other).content[language].navLabel}
              </a>
            ))}
          </div>
        </section>

        <RelatedPages routeKey="comparisons" className="bg-card" />

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
          <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {copy.finalTitle}
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">{copy.finalDescription}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <a href={TRIAL_SIGNUP_ROUTE}>
                  {language === "sl" ? "Začnite brezplačno" : "Start for free"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={canonicalRoutes.demo[language]}>
                  {language === "sl" ? "Rezervirajte predstavitev" : "Book a demo"}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ComparisonPage;
