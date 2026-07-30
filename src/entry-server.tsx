import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import AppRoutes from "./AppRoutes.tsx";
import { allBlogArticles, blogArticlePathnames } from "@/lib/blog";
import { comparisonPathnames, getComparison } from "@/lib/comparison-pages";
import { canonicalPathnames, getLanguageFromPathname, sitemapRouteMetadata } from "@/lib/localized-routes";
import { SiteLanguageProvider } from "@/lib/site-language";
import { DEFAULT_OG_IMAGE, getSeoForPathname } from "@/lib/seo";
import { HERO_IMAGE } from "@/lib/hero-media";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms-txt";
import { getPublicCompanyProfilePath, indexablePublicCompanyProfiles } from "@/lib/public-company-profiles";
import {
  PRICING_CATALOG_SCRIPT_ID,
  PUBLIC_PRICING_ENDPOINT,
  normalizePublicPricingCatalog,
  setPrerenderedPricingCatalog,
} from "@/lib/public-pricing";

const publicProfilePathnames = indexablePublicCompanyProfiles.flatMap((profile) => [
  getPublicCompanyProfilePath(profile.slug, "sl"),
  getPublicCompanyProfilePath(profile.slug, "en"),
]);

export const routesToPrerender = [
  ...canonicalPathnames,
  ...publicProfilePathnames,
  ...blogArticlePathnames,
  ...comparisonPathnames,
];
export {
  DEFAULT_OG_IMAGE,
  HERO_IMAGE,
  PRICING_CATALOG_SCRIPT_ID,
  PUBLIC_PRICING_ENDPOINT,
  buildLlmsFullTxt,
  buildLlmsTxt,
  normalizePublicPricingCatalog,
  setPrerenderedPricingCatalog,
};

/** Consumed by `scripts/generate-og-images.mjs` to render one card per article. */
export const ogImageJobs = allBlogArticles.map((article) => ({
  language: article.language,
  slug: article.slug,
  title: article.title,
  category: article.category,
  readingMinutes: article.readingMinutes,
  outputPath: `og/blog/${article.language}/${article.slug}.png`,
}));

export const getSitemapEntries = () =>
  routesToPrerender
    .map((pathname) => {
      const seo = getSeoForPathname(pathname);
      if (seo.noindex || !seo.alternateUrls) return undefined;

      if ("routeKey" in seo && seo.routeKey) {
        const metadata = sitemapRouteMetadata[seo.routeKey];
        return {
          pathname,
          location: seo.canonicalUrl,
          language: seo.language,
          alternateUrls: seo.alternateUrls,
          changeFrequency: metadata.changeFrequency,
          priority: metadata.priority[seo.language],
          lastModified: metadata.lastModified,
        };
      }

      if ("articleSlug" in seo && seo.articleSlug) {
        return {
          pathname,
          location: seo.canonicalUrl,
          language: seo.language,
          alternateUrls: seo.alternateUrls,
          changeFrequency: "monthly" as const,
          priority: seo.language === "sl" ? 0.7 : 0.6,
          lastModified: seo.articleDates?.modified,
        };
      }

      if ("comparisonSlug" in seo && seo.comparisonSlug) {
        return {
          pathname,
          location: seo.canonicalUrl,
          language: seo.language,
          alternateUrls: seo.alternateUrls,
          changeFrequency: "monthly" as const,
          priority: seo.language === "sl" ? 0.7 : 0.6,
          lastModified: getComparison(seo.comparisonSlug).lastReviewed,
        };
      }

      if ("profileSlug" in seo && seo.profileSlug) {
        const profile = indexablePublicCompanyProfiles.find((item) => item.slug === seo.profileSlug);
        return {
          pathname,
          location: seo.canonicalUrl,
          language: seo.language,
          alternateUrls: seo.alternateUrls,
          changeFrequency: "weekly" as const,
          priority: seo.language === "sl" ? 0.7 : 0.6,
          lastModified: profile?.lastModified,
        };
      }

      return undefined;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

export const renderPage = (pathname: string) => {
  const language = getLanguageFromPathname(pathname);

  const appHtml = renderToString(
    <SiteLanguageProvider initialLanguage={language}>
      <StaticRouter location={pathname}>
        <AppRoutes />
      </StaticRouter>
    </SiteLanguageProvider>,
  );

  return { appHtml, seo: getSeoForPathname(pathname) };
};
