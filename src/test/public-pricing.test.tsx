import { cleanup, render, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Pricing from "@/components/landing/Pricing";
import AnswerSummary from "@/components/seo/AnswerSummary";
import SeoManager from "@/components/seo/SeoManager";
import { buildLlmsTxt } from "@/lib/llms-txt";
import { getRoutePath } from "@/lib/localized-routes";
import { getPricingSummary } from "@/lib/pricing-copy";
import {
  FALLBACK_PUBLIC_PRICING,
  fetchPublicPricingCatalog,
  getInitialPricingCatalog,
  normalizePublicPricingCatalog,
  PRICING_CATALOG_UPDATED_EVENT,
  setPrerenderedPricingCatalog,
  type PublicPricingCatalog,
} from "@/lib/public-pricing";
import { getSeoForPathname } from "@/lib/seo";
import { SiteLanguageProvider, type SiteLanguage } from "@/lib/site-language";

const additionalUserRule = [{ fromUser: 2, toUser: null, monthlyGrossPerUser: 5.9 }];
const legacyCatalog: PublicPricingCatalog = {
  ...FALLBACK_PUBLIC_PRICING,
  additionalUserRules: [
    { fromUser: 2, toUser: 5, monthlyGrossPerUser: 5.9 },
    { fromUser: 6, toUser: null, monthlyGrossPerUser: 3.9 },
  ],
};

// Deliberately different API prices prove the published surfaces read the
// current catalog instead of agreeing only because they hardcode the fallback.
const apiCatalog: PublicPricingCatalog = {
  ...legacyCatalog,
  catalogVersion: FALLBACK_PUBLIC_PRICING.catalogVersion + 1,
  plans: FALLBACK_PUBLIC_PRICING.plans.map((plan, index) => ({
    ...plan,
    monthlyGross: [21.25, 32.5, 54.75][index],
    annualGross: [212.5, 325, 547.5][index],
  })),
  additionalUserRules: [{ fromUser: 2, toUser: null, monthlyGrossPerUser: 0 }],
};

const originalHead = document.head.innerHTML;
const originalLanguage = document.documentElement.lang;
const schemaGraph = (pathname: string) =>
  (getSeoForPathname(pathname).structuredData as { "@graph": Record<string, unknown>[] })["@graph"];

const expectPublishedCatalog = (language: SiteLanguage, catalog: PublicPricingCatalog) => {
  const locale = language === "sl" ? "sl-SI" : "en-IE";
  const currency = new Intl.NumberFormat(locale, {
    style: "currency", currency: catalog.currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
  const decimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const html = renderToStaticMarkup(
    <SiteLanguageProvider initialLanguage={language}>
      <Pricing standalone />
      <div id="pricing-answer"><AnswerSummary routeKey="pricing" /></div>
    </SiteLanguageProvider>,
  );
  const page = new DOMParser().parseFromString(html, "text/html");
  const cards = Array.from(page.querySelectorAll(".pricing-plan-grid article"));

  expect(cards.map((card) => ({
    name: card.querySelector("h2")?.textContent,
    price: card.querySelector(".pricing-plan-price strong")?.textContent,
  }))).toEqual(catalog.plans.map((plan) => ({
    name: language === "sl" ? plan.nameSl : plan.name,
    price: currency.format(plan.monthlyGross),
  })));
  expect(page.querySelector(".pricing-control-header p")?.textContent).toContain(currency.format(5.9));
  expect(page.querySelector(".pricing-control-header p")?.textContent).not.toContain(currency.format(3.9));

  const summary = page.querySelector("#pricing-answer")?.textContent;
  expect(summary).toBe(getPricingSummary(language));
  for (const plan of catalog.plans) {
    const name = language === "sl" ? plan.nameSl : plan.name;
    expect(summary).toContain(`${name} ${decimal.format(plan.monthlyGross)} ${catalog.currency}`);
  }
  expect(summary).toContain(`${decimal.format(5.9)} ${catalog.currency}`);
  expect(buildLlmsTxt()).toContain(summary);

  const prices = catalog.plans.map((plan) => plan.monthlyGross);
  const expectedOffers = {
    "@type": "AggregateOffer",
    priceCurrency: catalog.currency,
    lowPrice: Math.min(...prices).toFixed(2),
    highPrice: Math.max(...prices).toFixed(2),
    offerCount: catalog.plans.length,
    offers: catalog.plans.map((plan) => expect.objectContaining({
      "@type": "Offer",
      name: language === "sl" ? plan.nameSl : plan.name,
      price: plan.monthlyGross.toFixed(2),
      priceCurrency: catalog.currency,
      priceSpecification: expect.objectContaining({
        price: plan.monthlyGross.toFixed(2),
        priceCurrency: catalog.currency,
        unitCode: "MON",
      }),
    })),
  };
  const pricingGraph = schemaGraph(getRoutePath("pricing", language));
  expect(JSON.stringify(pricingGraph)).not.toContain("valueAddedTaxIncluded");
  expect(JSON.stringify(pricingGraph)).not.toContain('"vatID"');
  const product = pricingGraph.find((node) => node["@type"] === "Product");
  const software = pricingGraph.find((node) => node["@type"] === "SoftwareApplication");
  expect(product).toMatchObject({ offers: expectedOffers });
  expect(software).toMatchObject({ offers: expectedOffers });
  expect(software?.offers).toEqual(product?.offers);
  expect(schemaGraph(getRoutePath("home", language))).toContainEqual(expect.objectContaining({
    "@type": "SoftwareApplication",
    offers: expect.objectContaining({ price: Math.min(...prices).toFixed(2), priceCurrency: catalog.currency }),
  }));
};

beforeEach(() => setPrerenderedPricingCatalog(FALLBACK_PUBLIC_PRICING));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  setPrerenderedPricingCatalog(FALLBACK_PUBLIC_PRICING);
  document.head.innerHTML = originalHead;
  document.documentElement.lang = originalLanguage;
});

describe("confirmed public pricing", () => {
  it("keeps the confirmed monthly and annual prices available without an API response", () => {
    expect(getInitialPricingCatalog().plans.map(({ key, monthlyGross, annualGross }) => ({ key, monthlyGross, annualGross })))
      .toEqual([
        { key: "basic", monthlyGross: 17.9, annualGross: 179 },
        { key: "pro", monthlyGross: 28.9, annualGross: 289 },
        { key: "business", monthlyGross: 47.9, annualGross: 479 },
      ]);
    expect(getInitialPricingCatalog()).toMatchObject({ currency: "EUR", vatIncluded: true, includedUsers: 1 });
  });

  it.each([
    { label: "legacy tiers", rules: legacyCatalog.additionalUserRules },
    { label: "reversed legacy tiers", rules: [...legacyCatalog.additionalUserRules].reverse() },
    { label: "a stale free rate", rules: apiCatalog.additionalUserRules },
    { label: "missing rules", rules: undefined },
  ])("preserves the confirmed €5.90 rate when normalizing $label", ({ rules }) => {
    const catalog = normalizePublicPricingCatalog({ ...apiCatalog, additionalUserRules: rules });
    expect(catalog.additionalUserRules).toEqual(additionalUserRule);
    expect(catalog.plans).toEqual(apiCatalog.plans);
  });

  it.each(["sl", "en"] as const)("renders matching cards, answers and structured offers from an old snapshot in %s", (language) => {
    setPrerenderedPricingCatalog(legacyCatalog);
    expect(getInitialPricingCatalog().additionalUserRules).toEqual(additionalUserRule);
    expectPublishedCatalog(language, FALLBACK_PUBLIC_PRICING);
  });
});

describe("current public API snapshot", () => {
  it.each(["sl", "en"] as const)("uses changed API prices across rendered and machine-readable content in %s", async (language) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => apiCatalog }));
    const catalog = await fetchPublicPricingCatalog();
    expect(catalog.plans).toEqual(apiCatalog.plans);
    expect(catalog.additionalUserRules).toEqual(additionalUserRule);
    expect(getInitialPricingCatalog()).toBe(catalog);
    expectPublishedCatalog(language, catalog);
  });

  it.each(["HTTP", "network"] as const)("keeps the last successful snapshot when the %s request fails", async (failure) => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => apiCatalog });
    if (failure === "HTTP") fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });
    else fetchMock.mockRejectedValueOnce(new TypeError("Network unavailable"));
    vi.stubGlobal("fetch", fetchMock);

    const savedCatalog = await fetchPublicPricingCatalog();
    await expect(fetchPublicPricingCatalog()).rejects.toThrow(failure === "HTTP" ? "503" : "Network unavailable");
    expect(getInitialPricingCatalog()).toBe(savedCatalog);
    expectPublishedCatalog("sl", savedCatalog);
  });

  it("refreshes prerendered offer markup only after the normalized catalog changes", async () => {
    const pathname = getRoutePath("pricing", "sl");
    const initialScript = document.createElement("script");
    initialScript.type = "application/ld+json";
    initialScript.dataset.seo = "calendra";
    initialScript.dataset.seoRoute = pathname;
    initialScript.textContent = JSON.stringify(getSeoForPathname(pathname).structuredData);
    document.head.appendChild(initialScript);
    render(
      <MemoryRouter initialEntries={[pathname]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SeoManager />
      </MemoryRouter>,
    );

    const catalogAtRefresh = vi.fn(() => getInitialPricingCatalog());
    window.addEventListener(PRICING_CATALOG_UPDATED_EVENT, catalogAtRefresh);
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => legacyCatalog })
      .mockResolvedValueOnce({ ok: true, json: async () => apiCatalog })
      .mockResolvedValueOnce({ ok: true, json: async () => apiCatalog }));

    try {
      await fetchPublicPricingCatalog();
      expect(catalogAtRefresh).not.toHaveBeenCalled();
      expect(document.head.querySelector('script[data-seo="calendra"]')).toBe(initialScript);

      const currentCatalog = await fetchPublicPricingCatalog();
      expect(catalogAtRefresh).toHaveBeenCalledTimes(1);
      expect(catalogAtRefresh.mock.results[0].value).toBe(currentCatalog);
      await waitFor(() => {
        const updatedScript = document.head.querySelector('script[data-seo="calendra"]');
        expect(updatedScript).not.toBe(initialScript);
        expect(JSON.parse(updatedScript?.textContent ?? "{}"))
          .toEqual(getSeoForPathname(pathname).structuredData);
      });

      const updatedScript = document.head.querySelector('script[data-seo="calendra"]');
      await fetchPublicPricingCatalog();
      expect(catalogAtRefresh).toHaveBeenCalledTimes(1);
      expect(document.head.querySelector('script[data-seo="calendra"]')).toBe(updatedScript);
    } finally {
      window.removeEventListener(PRICING_CATALOG_UPDATED_EVENT, catalogAtRefresh);
    }
  });
});
