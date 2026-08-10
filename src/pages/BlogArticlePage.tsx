import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { getArticleBody } from "@/components/blog/article-bodies";
import { mdxComponents } from "@/components/blog/mdx-components";
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
  BLOG_INDEX_PATH,
  formatArticleDate,
  getArticleFromPathname,
  getBlogArticlePath,
  getRelatedArticles,
} from "@/lib/blog";
import { AUTHOR_PATH } from "@/lib/blog";
import { getRoutePath } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { AUTHOR } from "@/lib/seo";
import { ArrowRight, CalendarDays, Clock3, ListTree, Tag } from "lucide-react";
import { useLocation } from "react-router-dom";

const copy = {
  sl: {
    blog: "Blog",
    toc: "Vsebina članka",
    published: "Objavljeno",
    updated: "Posodobljeno",
    readingTime: (minutes: number) => `${minutes} min branja`,
    author: "Avtor",
    related: "Sorodni članki",
    ctaTitle: "Preizkusite Calendro brezplačno 14 dni",
    ctaBody:
      "Spletno naročanje, koledar terminov, opomniki in računi na enem mestu. Brez kreditne kartice in brez obveznosti.",
    ctaButton: "Začnite brezplačno",
    ctaSecondary: "Oglejte si cenik",
    readMore: "Preberite članek",
  },
  en: {
    blog: "Blog",
    toc: "In this article",
    published: "Published",
    updated: "Updated",
    readingTime: (minutes: number) => `${minutes} min read`,
    author: "Author",
    related: "Related articles",
    ctaTitle: "Try Calendra free for 14 days",
    ctaBody:
      "Online booking, an appointment calendar, reminders and invoicing in one place. No credit card and no commitment.",
    ctaButton: "Start for free",
    ctaSecondary: "View pricing",
    readMore: "Read the article",
  },
} as const;

const BlogArticlePage = () => {
  const { pathname } = useLocation();
  const article = getArticleFromPathname(pathname);

  if (!article) return <NotFound />;

  const text = copy[article.language];
  const Body = getArticleBody(article.slug, article.language);
  const related = getRelatedArticles(article);
  const tocHeadings = article.headings.filter((heading) => heading.depth === 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <article>
          <header className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-12 md:py-16">
            <div className="container mx-auto max-w-4xl px-4 lg:px-8">
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={getRoutePath("home", article.language)}>
                      {article.language === "sl" ? "Domov" : "Home"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={BLOG_INDEX_PATH[article.language]}>{text.blog}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{article.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <a
                href={`${BLOG_INDEX_PATH[article.language]}?kategorija=${encodeURIComponent(article.category)}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary"
              >
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                {article.category}
              </a>

              <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {article.title}
              </h1>

              <p
                className="mt-6 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 text-base leading-8 text-foreground sm:text-lg"
              >
                {article.answer}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <a href={AUTHOR_PATH[article.language]} className="font-semibold text-foreground transition hover:text-primary">
                  {text.author}: {AUTHOR.name}
                </a>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={article.datePublished}>
                    {text.published} {formatArticleDate(article.datePublished, article.language)}
                  </time>
                </span>
                {article.dateModified !== article.datePublished ? (
                  <span className="inline-flex items-center gap-2">
                    <time dateTime={article.dateModified}>
                      {text.updated} {formatArticleDate(article.dateModified, article.language)}
                    </time>
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {text.readingTime(article.readingMinutes)}
                </span>
              </div>
            </div>
          </header>

          <div className="container mx-auto grid max-w-6xl gap-12 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_16rem] lg:px-8">
            <div className="max-w-3xl">
              {Body ? <Body components={mdxComponents} /> : null}

              <div className="mt-14 overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/[0.10] via-card to-accent/[0.08] p-7 md:p-9">
                <h2 className="font-display text-2xl font-bold text-foreground">{text.ctaTitle}</h2>
                <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{text.ctaBody}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button variant="hero" size="lg" className="rounded-xl" asChild>
                    <a href={TRIAL_SIGNUP_ROUTE}>
                      {text.ctaButton}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-xl" asChild>
                    <a href={getRoutePath("pricing", article.language)}>{text.ctaSecondary}</a>
                  </Button>
                </div>
              </div>
            </div>

            {tocHeadings.length > 1 ? (
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <nav aria-label={text.toc} className="rounded-2xl border border-border/60 bg-card p-5">
                  <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                    <ListTree className="h-4 w-4 text-primary" aria-hidden="true" />
                    {text.toc}
                  </p>
                  <ol className="mt-4 grid gap-2.5 text-sm">
                    {tocHeadings.map((heading, index) => (
                      <li key={heading.id} className="flex gap-2.5 leading-6">
                        <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                        <a href={`#${heading.id}`} className="text-muted-foreground transition hover:text-primary">
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>
            ) : null}
          </div>
        </article>

        {related.length > 0 ? (
          <section className="border-t border-border/60 bg-card py-16 md:py-20">
            <div className="container mx-auto max-w-6xl px-4 lg:px-8">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{text.related}</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <article key={item.slug} className="flex flex-col rounded-3xl border border-border/60 bg-background p-6 shadow-soft">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{item.category}</p>
                    <h3 className="mt-3 font-display text-lg font-bold leading-7 text-foreground">
                      <a href={getBlogArticlePath(item.slug, item.language)} className="transition hover:text-primary">
                        {item.title}
                      </a>
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    <a
                      href={getBlogArticlePath(item.slug, item.language)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      {text.readMore}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default BlogArticlePage;
