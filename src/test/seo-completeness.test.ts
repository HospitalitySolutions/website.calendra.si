import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { canonicalRoutes, type CanonicalRouteKey, sitemapRouteMetadata } from "@/lib/localized-routes";
import { ENTRY_PLAN_MONTHLY_PRICE, getSeoForPathname, pageSeo } from "@/lib/seo";
import { HERO_IMAGE } from "@/lib/hero-media";

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

  it("preloads the image the hero actually renders", () => {
    const html = readIndexHtml();
    expect(html).toContain(`rel="preload" as="image" href="${HERO_IMAGE.src}"`);
  });

  it("preloads the same candidate set the hero offers, so the browser fetches one file", () => {
    const html = readIndexHtml();
    expect(html).toContain(`imagesrcset="${HERO_IMAGE.srcSet}"`);
    expect(html).toContain(`imagesizes="${HERO_IMAGE.sizes}"`);
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
