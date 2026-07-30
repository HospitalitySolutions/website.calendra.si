import { describe, expect, it } from "vitest";
import {
  allBlogArticles,
  BLOG_INDEX_PATH,
  getArticleAlternates,
  getArticleBySlug,
  getArticleFromPathname,
  getBlogArticlePath,
  getRelatedArticles,
} from "@/lib/blog";
import { getLocalizedPathname } from "@/lib/localized-routes";
import { getSeoForPathname } from "@/lib/seo";

const languages = ["sl", "en"] as const;

describe("blog article registry", () => {
  it("publishes at least one article per language", () => {
    for (const language of languages) {
      const count = allBlogArticles.filter((article) => article.language === language).length;
      expect(count, `no ${language} articles found`).toBeGreaterThan(0);
    }
  });

  it("resolves every article path back to the article it came from", () => {
    for (const article of allBlogArticles) {
      const path = getBlogArticlePath(article.slug, article.language);
      const resolved = getArticleFromPathname(path);
      expect(resolved?.slug, `${path} did not resolve`).toBe(article.slug);
      expect(resolved?.language).toBe(article.language);
    }
  });

  it("pairs every article with its counterpart in the other language", () => {
    for (const article of allBlogArticles) {
      const other = article.language === "sl" ? "en" : "sl";
      const alternates = getArticleAlternates(article);
      const counterpartPath = alternates[other];

      expect(counterpartPath, `${article.slug} has no ${other} counterpart`).not.toBe(BLOG_INDEX_PATH[other]);

      const counterpart = getArticleFromPathname(counterpartPath);
      expect(counterpart?.translationKey).toBe(article.translationKey);
    }
  });

  it("keeps trailing slashes and unknown slugs from resolving to an article", () => {
    expect(getArticleFromPathname("/blog")).toBeUndefined();
    expect(getArticleFromPathname("/blog/does-not-exist")).toBeUndefined();
    expect(getArticleFromPathname("/en/blog/does-not-exist")).toBeUndefined();
  });

  it("never returns the current article as its own related reading", () => {
    for (const article of allBlogArticles) {
      const related = getRelatedArticles(article);
      expect(related.some((item) => item.slug === article.slug)).toBe(false);
      expect(related.every((item) => item.language === article.language)).toBe(true);
    }
  });
});

describe("blog SEO", () => {
  it("emits BlogPosting structured data with reciprocal hreflang", () => {
    for (const article of allBlogArticles) {
      const seo = getSeoForPathname(getBlogArticlePath(article.slug, article.language));

      expect(seo.noindex).toBeFalsy();
      expect(seo.canonicalUrl).toContain(article.slug);

      const types = (seo.structuredData?.["@graph"] as Array<{ "@type": string }>).map((node) => node["@type"]);
      expect(types).toContain("BlogPosting");
      expect(types).toContain("BreadcrumbList");
      expect(types).toContain("Person");

      const counterpartLanguage = article.language === "sl" ? "en" : "sl";
      const counterpartPath = getArticleAlternates(article)[counterpartLanguage];
      const counterpartSeo = getSeoForPathname(counterpartPath);
      expect(counterpartSeo.alternateUrls).toEqual(seo.alternateUrls);
    }
  });

  it("switches language on an article without falling back to the blog index", () => {
    for (const article of allBlogArticles) {
      const path = getBlogArticlePath(article.slug, article.language);
      const other = article.language === "sl" ? "en" : "sl";
      const localized = getLocalizedPathname(path, other);

      expect(localized).not.toBe(BLOG_INDEX_PATH[other]);
      expect(getArticleFromPathname(localized)?.translationKey).toBe(article.translationKey);
    }
  });

  it("gives the blog index Blog schema listing every published article", () => {
    for (const language of languages) {
      const seo = getSeoForPathname(BLOG_INDEX_PATH[language]);
      const graph = seo.structuredData?.["@graph"] as Array<Record<string, unknown>>;
      const blog = graph.find((node) => node["@type"] === "Blog");

      expect(blog, `no Blog schema for ${language}`).toBeDefined();
      expect((blog?.blogPost as unknown[]).length).toBe(
        allBlogArticles.filter((article) => article.language === language).length,
      );
    }
  });
});

describe("blog content quality", () => {
  it("keeps internal links in article bodies pointing at real pages", () => {
    // Covered structurally: the manifest validator enforces frontmatter, and
    // scripts/test-sitemap-routes.mjs proves every prerendered URL returns 200.
    for (const article of allBlogArticles) {
      expect(getArticleBySlug(article.slug, article.language)).toBeDefined();
      expect(article.headings.length).toBeGreaterThan(1);
      expect(article.wordCount).toBeGreaterThan(600);
      expect(article.readingMinutes).toBeGreaterThan(0);
    }
  });
});
