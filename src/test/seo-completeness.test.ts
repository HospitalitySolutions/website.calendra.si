import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { canonicalRoutes, getSitemapLastModified, SHARED_SITE_LAST_MODIFIED, type CanonicalRouteKey, sitemapRouteMetadata } from "@/lib/localized-routes";
import { ENTRY_PLAN_MONTHLY_PRICE, getSeoForPathname, pageSeo } from "@/lib/seo";

const routeKeys = Object.keys(canonicalRoutes) as CanonicalRouteKey[];
const languages = ["sl", "en"] as const;

const readIndexHtml = () => fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");

describe("SEO registry completeness", () => {
  it("defines title and description for every canonical route in both languages", () => {
    for (const routeKey of routeKeys) {
      for (const language of languages) {
        const entry = pageSeo[routeKey]?.[language];
        expect(entry, `missing pageSeo entry for ${routeKey}.${language}`).toBeDefined();
        expect(entry.title.length, `empty title for ${routeKey}.${language}`).toBeGreaterThan(10);
        expect(entry.description.length, `empty description for ${routeKey}.${language}`).toBeGreaterThan(50);
      }
    }
  });

  it("defines sitemap metadata for every canonical route", () => {
    for (const routeKey of routeKeys) {
      expect(sitemapRouteMetadata[routeKey], `missing sitemap metadata for ${routeKey}`).toBeDefined();
    }
  });

  it("uses the latest meaningful page or shared-site date for sitemap lastmod", () => {
    expect(getSitemapLastModified("2026-07-15")).toBe(SHARED_SITE_LAST_MODIFIED);
    expect(getSitemapLastModified("2099-01-01")).toBe("2099-01-01");
    expect(getSitemapLastModified()).toBe(SHARED_SITE_LAST_MODIFIED);
  });

  it("does not emit deprecated FAQ or irrelevant speakable schema", () => {
    for (const routeKey of routeKeys) {
      for (const language of languages) {
        const seo = getSeoForPathname(canonicalRoutes[routeKey][language]);
        const schema = JSON.stringify(seo.structuredData ?? {});
        expect(schema).not.toContain('"@type":"FAQPage"');
        expect(schema).not.toContain('"@type":"SpeakableSpecification"');
      }
    }
  });

  it("resolves every canonical path to its own route key rather than the 404 fallback", () => {
    for (const routeKey of routeKeys) {
      for (const language of languages) {
        const seo = getSeoForPathname(canonicalRoutes[routeKey][language]);
        expect("routeKey" in seo && seo.routeKey, `${routeKey}.${language} fell through to the 404 fallback`).toBe(
          routeKey,
        );
        expect(seo.language).toBe(language);
      }
    }
  });

  it("emits reciprocal hreflang alternates for every indexable route", () => {
    for (const routeKey of routeKeys) {
      const slSeo = getSeoForPathname(canonicalRoutes[routeKey].sl);
      if (slSeo.noindex) continue;

      const enSeo = getSeoForPathname(canonicalRoutes[routeKey].en);
      expect(slSeo.alternateUrls).toEqual(enSeo.alternateUrls);
      expect(slSeo.alternateUrls?.xDefault).toBe(slSeo.alternateUrls?.sl);
    }
  });
});

describe("index.html fallback shell", () => {
  it("mirrors the homepage entry in the SEO registry", () => {
    const html = readIndexHtml();
    const home = pageSeo.home.sl;

    expect(html).toContain(`<title>${home.title}</title>`);
    expect(html).toContain(home.description);
    expect(html).not.toContain("AI pomočnik");
  });

  it("preloads the fonts the above-the-fold heading and lede actually render in", () => {
    const html = readIndexHtml();
    expect(html).toContain('rel="preload" as="font" type="font/woff2" href="/fonts/dm-sans-latin.woff2"');
    expect(html).toContain('rel="preload" as="font" type="font/woff2" href="/fonts/plus-jakarta-sans-latin.woff2"');
    expect(html).toContain('rel="preload" as="font" type="font/woff2" href="/fonts/dm-sans-latin-ext.woff2"');
    expect(html).toContain('rel="preload" as="font" type="font/woff2" href="/fonts/plus-jakarta-sans-latin-ext.woff2"');
  });

  it("marks preloaded fonts crossorigin, since woff2 requests are CORS mode", () => {
    const html = readIndexHtml();
    const preloadBlock = html.slice(
      html.indexOf("<!-- CALENDRA_ROUTE_PRELOADS_START -->"),
      html.indexOf("<!-- CALENDRA_ROUTE_PRELOADS_END -->"),
    );
    const fontPreloadCount = (preloadBlock.match(/rel="preload" as="font"/g) ?? []).length;
    const crossoriginCount = (preloadBlock.match(/crossorigin="anonymous"/g) ?? []).length;
    expect(fontPreloadCount).toBeGreaterThan(0);
    expect(crossoriginCount).toBe(fontPreloadCount);
  });

  it("keeps the prerender placeholders outside the SEO block that is replaced last", () => {
    const html = readIndexHtml();
    const seoBlock = html.slice(html.indexOf("<!-- CALENDRA_SEO_START -->"), html.indexOf("<!-- CALENDRA_SEO_END -->"));

    for (const marker of ["CALENDRA_ANALYTICS_START", "CALENDRA_PRICING_START", "CALENDRA_ROUTE_PRELOADS_START"]) {
      expect(html, `${marker} placeholder is missing`).toContain(`<!-- ${marker} -->`);
      expect(seoBlock, `${marker} is nested inside the SEO block and would be discarded`).not.toContain(marker);
    }
  });

  it("advertises the same entry price as the pricing catalog", () => {
    const html = readIndexHtml();
    expect(html).toContain(`"price":"${ENTRY_PLAN_MONTHLY_PRICE}"`);
  });
});
