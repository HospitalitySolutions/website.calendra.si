import { blogArticles } from "virtual:blog-manifest";
import type { SiteLanguage } from "@/lib/site-language";

export type BlogHeading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type BlogArticleMeta = {
  language: SiteLanguage;
  slug: string;
  translationKey: string;
  title: string;
  description: string;
  answer: string;
  category: string;
  tags: string[];
  datePublished: string;
  dateModified: string;
  heroImageAlt: string;
  draft: boolean;
  readingMinutes: number;
  wordCount: number;
  headings: BlogHeading[];
};

/**
 * Drafts are excluded everywhere except local development, so an unfinished
 * article can live in the repository without appearing in the index, the
 * sitemap or the prerendered output.
 */
const isVisible = (article: BlogArticleMeta) => import.meta.env.DEV || !article.draft;

export const allBlogArticles: BlogArticleMeta[] = (blogArticles as BlogArticleMeta[]).filter(isVisible);

export const BLOG_INDEX_PATH: Record<SiteLanguage, string> = {
  sl: "/blog",
  en: "/en/blog",
};

export const AUTHOR_PATH: Record<SiteLanguage, string> = {
  sl: "/avtor/david-mirc",
  en: "/en/author/david-mirc",
};

export const getBlogArticlePath = (slug: string, language: SiteLanguage) =>
  `${BLOG_INDEX_PATH[language]}/${slug}`;

export const getArticlesForLanguage = (language: SiteLanguage) =>
  allBlogArticles.filter((article) => article.language === language);

export const getArticleBySlug = (slug: string, language: SiteLanguage) =>
  allBlogArticles.find((article) => article.language === language && article.slug === slug);

export const getArticleByTranslationKey = (translationKey: string, language: SiteLanguage) =>
  allBlogArticles.find((article) => article.language === language && article.translationKey === translationKey);

const BLOG_PATH_PATTERN = /^\/(?:en\/)?blog\/([^/]+)$/;

export const getArticleFromPathname = (pathname: string): BlogArticleMeta | undefined => {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const match = BLOG_PATH_PATTERN.exec(normalized);
  if (!match) return undefined;

  const language: SiteLanguage = normalized.startsWith("/en/") ? "en" : "sl";
  return getArticleBySlug(decodeURIComponent(match[1]), language);
};

export const isBlogIndexPathname = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return normalized === BLOG_INDEX_PATH.sl || normalized === BLOG_INDEX_PATH.en;
};

export const isAuthorPathname = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return normalized === AUTHOR_PATH.sl || normalized === AUTHOR_PATH.en;
};

/**
 * Both language versions of an article, used for hreflang and the language
 * switcher. An article without a counterpart cannot exist: the build-time
 * validation in `plugins/blog-manifest.ts` rejects unpaired content.
 */
export const getArticleAlternates = (article: BlogArticleMeta) => {
  const counterpart = getArticleByTranslationKey(
    article.translationKey,
    article.language === "sl" ? "en" : "sl",
  );

  const sl = article.language === "sl" ? article : counterpart;
  const en = article.language === "en" ? article : counterpart;

  return {
    sl: sl ? getBlogArticlePath(sl.slug, "sl") : BLOG_INDEX_PATH.sl,
    en: en ? getBlogArticlePath(en.slug, "en") : BLOG_INDEX_PATH.en,
  };
};

export const blogCategories = (language: SiteLanguage) => {
  const counts = new Map<string, number>();
  for (const article of getArticlesForLanguage(language)) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return [...counts.entries()].map(([category, count]) => ({ category, count }));
};

/**
 * Related reading, preferring the same category and falling back to recency so
 * every article ends with somewhere to go next.
 */
export const getRelatedArticles = (article: BlogArticleMeta, limit = 3) => {
  const pool = getArticlesForLanguage(article.language).filter((item) => item.slug !== article.slug);
  const sameCategory = pool.filter((item) => item.category === article.category);
  const rest = pool.filter((item) => item.category !== article.category);
  return [...sameCategory, ...rest].slice(0, limit);
};

export const formatArticleDate = (isoDate: string, language: SiteLanguage) =>
  new Intl.DateTimeFormat(language === "sl" ? "sl-SI" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00Z`));

export const blogArticlePathnames = allBlogArticles.map((article) =>
  getBlogArticlePath(article.slug, article.language),
);
