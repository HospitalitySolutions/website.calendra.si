import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { BLOG_INDEX_PATH, formatArticleDate, getArticlesForLanguage, getBlogArticlePath } from "@/lib/blog";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { getRoutePath } from "@/lib/localized-routes";
import { AUTHOR } from "@/lib/seo";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Mail, MapPin, PenLine } from "lucide-react";

const copy = {
  sl: {
    eyebrow: "Avtor vsebin",
    expertiseTitle: "Področja, o katerih piše",
    articlesTitle: "Članki tega avtorja",
    contactTitle: "Stik z avtorjem",
    contactBody:
      "Za vprašanja o vsebinah, popravke ali predloge tem nas kontaktirajte po e-pošti. Odgovor prejmete v enem delovnem dnevu.",
    allArticles: "Vsi članki",
    aboutCalendra: "O Calendri",
    empty: "Trenutno še ni objavljenih člankov.",
  },
  en: {
    eyebrow: "Content author",
    expertiseTitle: "Topics he writes about",
    articlesTitle: "Articles by this author",
    contactTitle: "Contact the author",
    contactBody:
      "For questions about the content, corrections or topic suggestions, get in touch by email. You will receive a reply within one working day.",
    allArticles: "All articles",
    aboutCalendra: "About Calendra",
    empty: "No articles have been published yet.",
  },
} as const;

const expertise = {
  sl: [
    "Spletno naročanje terminov in preprečevanje dvojnih rezervacij",
    "Zmanjševanje pozabljenih terminov s SMS in e-poštnimi opomniki",
    "Izdaja računov, plačila in davčno potrjevanje računov v Sloveniji",
    "GDPR in obdelava podatkov strank v storitvenih podjetjih",
    "IT podpora, spletne strani in avtomatizacije za mala podjetja",
  ],
  en: [
    "Online appointment booking and preventing double bookings",
    "Reducing missed appointments with SMS and email reminders",
    "Invoicing, payments and fiscal verification of invoices in Slovenia",
    "GDPR and client data processing in service businesses",
    "IT support, websites and automation for small businesses",
  ],
} as const;

const AuthorPage = () => {
  const { language } = useSiteLanguage();
  const text = copy[language];
  const articles = getArticlesForLanguage(language);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-14 md:py-20">
          <div className="container mx-auto max-w-4xl px-4 lg:px-8">
            <PageBreadcrumbs routeKey="author" />
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.eyebrow}</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {AUTHOR.name}
            </h1>
            <p className="mt-3 text-lg font-semibold text-primary">{AUTHOR.jobTitle[language]}</p>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {AUTHOR.bio[language]}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href={`mailto:${LEGAL.generalEmail}`} className="transition hover:text-primary">
                  {LEGAL.generalEmail}
                </a>
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                {LEGAL_FULL_ADDRESS}
              </span>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 py-14 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{text.expertiseTitle}</h2>
          <ul className="mt-6 grid gap-3">
            {expertise[language].map((item) => (
              <li key={item} className="flex items-start gap-3 leading-7 text-foreground/90">
                <PenLine className="mt-1.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border/60 bg-card py-14 md:py-20">
          <div className="container mx-auto max-w-4xl px-4 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{text.articlesTitle}</h2>
            {articles.length === 0 ? (
              <p className="mt-6 text-muted-foreground">{text.empty}</p>
            ) : (
              <div className="mt-7 grid gap-4">
                {articles.map((article) => (
                  <article key={article.slug} className="rounded-2xl border border-border/60 bg-background p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{article.category}</p>
                    <h3 className="mt-2 font-display text-lg font-bold leading-7 text-foreground">
                      <a href={getBlogArticlePath(article.slug, article.language)} className="transition hover:text-primary">
                        {article.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{article.description}</p>
                    <time dateTime={article.datePublished} className="mt-3 block text-xs text-muted-foreground">
                      {formatArticleDate(article.datePublished, article.language)}
                    </time>
                  </article>
                ))}
              </div>
            )}
            <Button variant="outline" size="lg" className="mt-8 rounded-xl" asChild>
              <a href={BLOG_INDEX_PATH[language]}>
                {text.allArticles}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 py-14 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-foreground">{text.contactTitle}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{text.contactBody}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="lg" className="rounded-xl" asChild>
              <a href={getRoutePath("contact", language)}>
                {language === "sl" ? "Pošljite sporočilo" : "Send a message"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl" asChild>
              <a href={getRoutePath("home", language)}>{text.aboutCalendra}</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorPage;
