import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { customerStories, getCustomerStoryPath } from "@/lib/customer-stories";
import { getRoutePath } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, ExternalLink, Quote, Sparkles } from "lucide-react";

const copy = {
  sl: {
    eyebrow: "Resnične uporabe Calendre",
    title: "Zgodbe strank",
    intro:
      "Kako različna storitvena podjetja uporabljajo Calendro v vsakodnevnem delu — brez izmišljenih odstotkov in brez generičnih primerov. Vsaka zgodba temelji na dejanski uporabi in potrjeni izjavi stranke.",
    readStory: "Preberite zgodbo",
    visitWebsite: "Spletna stran stranke",
    proofTitle: "Različni načini dela, isti cilj: manj administracije",
    proofBody:
      "Nekatera podjetja želijo javno spletno naročanje, druga termine še vedno vnašajo sama. Calendra je zasnovana tako, da lahko organizacija uporablja samo tisti del procesa, ki ji dejansko koristi.",
    ctaTitle: "Preverite, kako bi Calendra delovala pri vas",
    ctaBody: "Začnite s 14-dnevnim preizkusom ali si najprej oglejte rešitve po dejavnostih.",
    ctaPrimary: "Preizkusite brezplačno",
    ctaSecondary: "Rešitve po dejavnostih",
  },
  en: {
    eyebrow: "Real Calendra use cases",
    title: "Customer stories",
    intro:
      "See how different service businesses use Calendra in day-to-day work — without invented percentages or generic examples. Every story is based on real usage and an approved customer statement.",
    readStory: "Read the story",
    visitWebsite: "Customer website",
    proofTitle: "Different workflows, one goal: less administration",
    proofBody:
      "Some businesses want public self-service booking, while others still enter appointments themselves. Calendra is designed so each organisation can use the parts of the workflow that actually help it.",
    ctaTitle: "See how Calendra could work for your business",
    ctaBody: "Start a 14-day trial or first explore solutions by industry.",
    ctaPrimary: "Try it free",
    ctaSecondary: "Solutions by industry",
  },
} as const;

const CustomerStoriesPage = () => {
  const { language } = useSiteLanguage();
  const text = copy[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.07] py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <PageBreadcrumbs routeKey="customerStories" />
            <div className="mt-8 max-w-3xl">
              <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.eyebrow}</span>
              <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {text.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground md:text-xl">{text.intro}</p>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 lg:px-8">
            {customerStories.map((story) => {
              const content = story.content[language];
              return (
                <article key={story.slug} className="flex flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-soft">
                  <div className="flex min-h-48 items-center justify-center border-b border-border/60 bg-gradient-to-br from-background to-primary/[0.04] p-8">
                    <img
                      src={story.logo.src}
                      alt={story.logo.alt}
                      width={story.logo.width}
                      height={story.logo.height}
                      loading="lazy"
                      decoding="async"
                      className="max-h-28 w-auto max-w-[78%] object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7 md:p-8">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{content.eyebrow}</p>
                    <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground">{content.title}</h2>
                    <p className="mt-4 flex-1 text-base leading-7 text-muted-foreground">{content.description}</p>

                    <blockquote className="mt-7 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 text-sm leading-7 text-foreground/90">
                      <Quote className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
                      “{content.testimonial}”
                      <footer className="mt-3 font-semibold text-foreground">{story.representative}</footer>
                    </blockquote>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Button variant="hero" className="rounded-xl" asChild>
                        <a href={getCustomerStoryPath(story.slug, language)}>
                          {text.readStory}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </Button>
                      <Button variant="outline" className="rounded-xl" asChild>
                        <a href={story.websiteUrl} target="_blank" rel="noreferrer noopener">
                          {text.visitWebsite}
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-card py-16 md:py-20">
          <div className="container mx-auto max-w-5xl px-4 lg:px-8">
            <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-background to-accent/[0.05] p-8 md:p-10">
              <Sparkles className="h-9 w-9 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground">{text.proofTitle}</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{text.proofBody}</p>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-xl md:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <h2 className="font-display text-3xl font-bold sm:text-4xl">{text.ctaTitle}</h2>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-primary-foreground/85">{text.ctaBody}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Button variant="secondary" size="lg" className="rounded-xl" asChild>
                    <a href={TRIAL_SIGNUP_ROUTE}>{text.ctaPrimary}<ArrowRight className="h-4 w-4" /></a>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-xl border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                    <a href={getRoutePath("beautyHair", language)}>{text.ctaSecondary}</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerStoriesPage;
