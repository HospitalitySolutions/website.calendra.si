import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedPages from "@/components/seo/RelatedPages";
import { Button } from "@/components/ui/button";
import { allComparisons, getComparisonPath } from "@/lib/comparison-pages";
import { canonicalRoutes } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight } from "lucide-react";

const copy = {
  sl: {
    eyebrow: "Primerjave",
    title: "Primerjave programov za naročanje strank",
    answer:
      "Te strani primerjajo Calendro s šestimi znanimi ponudniki in za vsakega navedejo, kdaj je boljša izbira on in ne mi. Merila so povsod enaka: obseg sistema, izdaja računov, slovensko davčno potrjevanje, struktura cene, lastništvo podatkov ter jezik vmesnika in podpore.",
    intro:
      "Primerjava, ki jo napiše ponudnik, je vedno pristranska. Zato ima vsaka od teh strani razdelek o tem, kdaj priporočamo drugega, in datum, ko smo javno predstavitev konkurenta nazadnje preverili.",
    listTitle: "Vse primerjave",
    criteriaTitle: "Po katerih merilih primerjamo",
    criteria: [
      "Obseg sistema: ali se konča pri terminu ali gre do izdanega računa.",
      "Slovenska specifika: računi in davčno potrjevanje za plačila na lokaciji.",
      "Struktura cene: naročnina, dodatni uporabniki, SMS in provizije.",
      "Lastništvo podatkov: ali stranke in zgodovino lahko izvozite sami.",
      "Jezik vmesnika in podpore za vašo ekipo.",
      "Razpoložljivost: ali izračun upošteva zaposlene, prostore in opremo.",
    ],
    finalTitle: "Preizkusite na svojih storitvah",
    finalDescription:
      "Najbolj zanesljiva primerjava je teden dni uporabe z vašimi resničnimi storitvami in zaposlenimi.",
    trial: "Začnite brezplačno",
    demo: "Rezervirajte predstavitev",
  },
  en: {
    eyebrow: "Comparisons",
    title: "Appointment booking software comparisons",
    answer:
      "These pages compare Calendra with six well-known products and state, for each one, when it is the better choice rather than us. The criteria are the same throughout: scope of the system, invoicing, Slovenian fiscal verification, price structure, data ownership, and the language of the interface and support.",
    intro:
      "A comparison written by a vendor is always partial. So each of these pages carries a section on when we recommend the other product, and the date we last reviewed that vendor's public positioning.",
    listTitle: "All comparisons",
    criteriaTitle: "The criteria we compare on",
    criteria: [
      "Scope: whether the system stops at the appointment or runs through to an issued invoice.",
      "Slovenian specifics: invoicing and fiscal verification for payments taken on site.",
      "Price structure: subscription, additional users, SMS and commissions.",
      "Data ownership: whether you can export clients and history yourself.",
      "Interface and support language for your team.",
      "Availability: whether the calculation accounts for employees, rooms and equipment.",
    ],
    finalTitle: "Test it against your own services",
    finalDescription:
      "The most reliable comparison is a week of use with your real services and employees.",
    trial: "Start for free",
    demo: "Book a demo",
  },
} as const;

const ComparisonIndexPage = () => {
  const { language } = useSiteLanguage();
  const text = copy[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="container mx-auto max-w-6xl px-4 pt-10 lg:px-8">
          <PageBreadcrumbs routeKey="comparisons" />

          <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.eyebrow}</span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {text.title}
          </h1>

          <p
            data-speakable="answer"
            className="mt-6 max-w-3xl rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 text-base leading-7 text-foreground sm:text-lg sm:leading-8"
          >
            {text.answer}
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{text.intro}</p>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-14 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {text.listTitle}
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {allComparisons.map((comparison) => {
              const content = comparison.content[language];
              return (
                <article
                  key={comparison.slug}
                  className="flex flex-col rounded-3xl border border-border/60 bg-card p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/20"
                >
                  <h3 className="font-display text-xl font-bold text-foreground">
                    <a href={getComparisonPath(comparison.slug, language)} className="transition hover:text-primary">
                      {content.title}
                    </a>
                  </h3>
                  <p className="mt-3 flex-1 leading-7 text-muted-foreground">{content.metaDescription}</p>
                  <a
                    href={getComparisonPath(comparison.slug, language)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    {language === "sl" ? "Preberite primerjavo" : "Read the comparison"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-card py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {text.criteriaTitle}
            </h2>
            <ul className="mt-7 grid gap-3 md:grid-cols-2">
              {text.criteria.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-border/60 bg-background p-5 leading-7 text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <RelatedPages routeKey="comparisons" />

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
          <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {text.finalTitle}
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">{text.finalDescription}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <a href={TRIAL_SIGNUP_ROUTE}>
                  {text.trial}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={canonicalRoutes.demo[language]}>{text.demo}</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ComparisonIndexPage;
