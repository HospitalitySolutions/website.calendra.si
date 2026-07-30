import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SeoDescriptor = ReturnType<typeof import("@/lib/seo").getSeoForPathname>;

const upsertMeta = (selector: string, attribute: "name" | "property", value: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertLink = (selector: string, rel: string, href: string, hreflang?: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) element.setAttribute("hreflang", hreflang);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const removeElement = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const applySeo = (seo: SeoDescriptor, defaultOgImage: string) => {
  const articleDates = "articleDates" in seo ? seo.articleDates : undefined;

  document.documentElement.lang = seo.language;
  document.title = seo.title;

  upsertMeta('meta[name="description"]', "name", "description", seo.description);
  upsertMeta('meta[name="author"]', "name", "author", articleDates ? "David Mirc" : "Calendra");
  upsertMeta('meta[name="robots"]', "name", "robots", seo.noindex ? "noindex, follow" : "index, follow");
  upsertMeta('meta[property="og:title"]', "property", "og:title", seo.ogTitle || seo.title);
  upsertMeta('meta[property="og:description"]', "property", "og:description", seo.ogDescription || seo.description);
  upsertMeta('meta[property="og:type"]', "property", "og:type", articleDates ? "article" : "website");

  if (articleDates) {
    upsertMeta('meta[property="article:published_time"]', "property", "article:published_time", articleDates.published);
    upsertMeta('meta[property="article:modified_time"]', "property", "article:modified_time", articleDates.modified);
    upsertMeta('meta[property="article:author"]', "property", "article:author", "David Mirc");
  } else {
    removeElement('meta[property="article:published_time"]');
    removeElement('meta[property="article:modified_time"]');
    removeElement('meta[property="article:author"]');
  }

  upsertMeta('meta[property="og:url"]', "property", "og:url", seo.canonicalUrl);
  upsertMeta('meta[property="og:image"]', "property", "og:image", seo.ogImage || defaultOgImage);
  upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", "1200");
  upsertMeta('meta[property="og:image:height"]', "property", "og:image:height", "630");
  upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", seo.ogTitle || seo.title);
  upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Calendra");
  upsertMeta('meta[property="og:locale"]', "property", "og:locale", seo.language === "sl" ? "sl_SI" : "en_US");
  upsertMeta(
    'meta[property="og:locale:alternate"]',
    "property",
    "og:locale:alternate",
    seo.language === "sl" ? "en_US" : "sl_SI",
  );
  upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.ogTitle || seo.title);
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", seo.ogDescription || seo.description);
  upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", seo.ogImage || defaultOgImage);

  upsertLink('link[rel="canonical"]', "canonical", seo.canonicalUrl);

  if (seo.alternateUrls) {
    upsertLink('link[rel="alternate"][hreflang="sl-SI"]', "alternate", seo.alternateUrls.sl, "sl-SI");
    upsertLink('link[rel="alternate"][hreflang="en"]', "alternate", seo.alternateUrls.en, "en");
    upsertLink('link[rel="alternate"][hreflang="x-default"]', "alternate", seo.alternateUrls.xDefault, "x-default");
  } else {
    removeElement('link[rel="alternate"][hreflang="sl-SI"]');
    removeElement('link[rel="alternate"][hreflang="en"]');
    removeElement('link[rel="alternate"][hreflang="x-default"]');
  }

  removeElement('script[type="application/ld+json"][data-seo="calendra"]');
  if (seo.structuredData) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "calendra";
    script.textContent = JSON.stringify(seo.structuredData);
    document.head.appendChild(script);
  }
};

/**
 * The prerendered document already carries the correct head for the route it was
 * built for, and `scripts/prerender.mjs` records which route that was. On that
 * first paint there is nothing to change, so the metadata registry — which
 * transitively pulls in the copy of every page, article and comparison — is
 * loaded only once the visitor actually navigates inside the SPA.
 */
const isServerRenderedRoute = (pathname: string) =>
  document.head.querySelector<HTMLScriptElement>('script[data-seo="calendra"]')?.dataset.seoRoute === pathname;

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (isServerRenderedRoute(location.pathname)) return;

    let cancelled = false;

    void import("@/lib/seo").then(({ DEFAULT_OG_IMAGE, getSeoForPathname }) => {
      if (!cancelled) applySeo(getSeoForPathname(location.pathname), DEFAULT_OG_IMAGE);
    });

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return null;
};

export default SeoManager;
