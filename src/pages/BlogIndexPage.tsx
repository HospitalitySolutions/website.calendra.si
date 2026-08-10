import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedPages from "@/components/seo/RelatedPages";
import {
  AUTHOR_PATH,
  blogCategories,
  formatArticleDate,
  getArticlesForLanguage,
  getBlogArticlePath,
} from "@/lib/blog";
import { AUTHOR, pageSeo } from "@/lib/seo";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const copy = {
  sl: {
    eyebrow: "Calendra blog",
    allCategories: "Vse teme",
    readingTime: (minutes: number) => `${minutes} min branja`,
    readMore: "Preberite članek",
    authorLine: "Vsebine piše",
    empty: "V tej temi še ni objavljenih člankov.",
    categoryParam: "kategorija",
  },
  en: {
    eyebrow: "Calendra blog",
    allCategories: "All topics",
    readingTime: (minutes: number) => `${minutes} min read`,
    readMore: "Read the article",
    authorLine: "Written by",
    empty: "No articles have been published in this topic yet.",
    categoryParam: "category",
  },
} as const;

const BlogIndexPage = () => {
  const { language } = useSiteLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const text = copy[language];
  const seo = pageSeo.blog[language];

  const articles = useMemo(() => getArticlesForLanguage(language), [language]);
  const categories = useMemo(() => blogCategories(language), [language]);

  const paramCategory = searchParams.get(text.categoryParam) ?? searchParams.get("kategorija") ?? searchParams.get("category");
  const [fallbackCategory, setFallbackCategory] = useState<string | null>(null);
  const activeCategory = paramCategory ?? fallbackCategory;

  const selectCategory = (category: string | null) => {
    setFallbackCategory(category);
    const next = new URLSearchParams(searchParams);
    next.delete("kategorija");
    next.delete("category");
    if (category) next.set(text.categoryParam, category);
    setSearchParams(next, { replace: true });
  };

  const visible = activeCategory ? articles.filter((article) => article.category === activeCategory) : articles;
  const [lead, ...rest] = visible;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <PageBreadcrumbs routeKey="blog" />
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.eyebrow}</span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {seo.title.split("|")[0].trim()}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {seo.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {text.authorLine}{" "}
              <a href={AUTHOR_PATH[language]} className="font-semibold text-foreground transition hover:text-primary">
                {AUTHOR.name}
              </a>
              , {AUTHOR.jobTitle[language]}.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => selectCategory(null)}
                aria-pressed={!activeCategory}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory
                    ? "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    : "border-primary/20 bg-primary/[0.10] text-primary shadow-sm"
                }`}
              >
                {text.allCategories} ({articles.length})
              </button>
              {categories.map(({ category, count }) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => selectCategory(category)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-primary/20 bg-primary/[0.10] text-primary shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-14 lg:px-8 md:py-20">
          {visible.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              {text.empty}
            </p>
          ) : (
            <>
              {lead ? (
                <article className="grid gap-8 rounded-[2rem] border border-border/60 bg-card p-7 shadow-soft md:p-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{lead.category}</p>
                    <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
                      <a href={getBlogArticlePath(lead.slug, lead.language)} className="transition hover:text-primary">
                        {lead.title}
                      </a>
                    </h2>
                    <p className="mt-4 leading-7 text-muted-foreground">{lead.description}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <time dateTime={lead.datePublished}>{formatArticleDate(lead.datePublished, lead.language)}</time>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4" aria-hidden="true" />
                        {text.readingTime(lead.readingMinutes)}
                      </span>
                    </div>
                    <a
                      href={getBlogArticlePath(lead.slug, lead.language)}
                      className="mt-6 inline-flex items-center gap-2 font-semibold text-primary"
                    >
                      {text.readMore}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-6 leading-8 text-foreground">
                    {lead.answer}
                  </p>
                </article>
              ) : null}

              {rest.length > 0 ? (
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <article
                      key={article.slug}
                      className="flex flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:border-primary/25"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{article.category}</p>
                      <h2 className="mt-3 font-display text-lg font-bold leading-7 text-foreground">
                        <a href={getBlogArticlePath(article.slug, article.language)} className="transition hover:text-primary">
                          {article.title}
                        </a>
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{article.description}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <time dateTime={article.datePublished}>{formatArticleDate(article.datePublished, article.language)}</time>
                        <span>{text.readingTime(article.readingMinutes)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </section>

        <RelatedPages routeKey="blog" />
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndexPage;
