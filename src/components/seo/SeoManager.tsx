import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_OG_IMAGE, getSeoForPathname } from "@/lib/seo";

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

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoForPathname(location.pathname);

    document.documentElement.lang = seo.language;
    document.title = seo.title;

    upsertMeta('meta[name="description"]', "name", "description", seo.description);
    upsertMeta('meta[name="robots"]', "name", "robots", seo.noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta('meta[property="og:title"]', "property", "og:title", seo.ogTitle || seo.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", seo.ogDescription || seo.description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:url"]', "property", "og:url", seo.canonicalUrl);
    upsertMeta('meta[property="og:image"]', "property", "og:image", DEFAULT_OG_IMAGE);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Calendra");
    upsertMeta('meta[property="og:locale"]', "property", "og:locale", seo.language === "sl" ? "sl_SI" : "en_US");
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.ogTitle || seo.title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", seo.ogDescription || seo.description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", DEFAULT_OG_IMAGE);

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
  }, [location.pathname]);

  return null;
};

export default SeoManager;
