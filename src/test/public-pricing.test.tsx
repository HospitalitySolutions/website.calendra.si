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
    <MemoryRouter><SiteLanguageProvider initialLanguage={language}>
      <Pricing standalone />
      <div id="pricing-answer"><AnswerSummary routeKey="pricing" /></div>
    </SiteLanguageProvider></MemoryRouter>,
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
  for (const rule of catalog.additionalUserRules) expect(page.querySelector(".pricing-control-header p")?.textContent).toContain(currency.format(rule.monthlyGrossPerUser));

  const summary = page.querySelector("#pricing-answer")?.textContent;
  expect(summary).toBe(getPricingSummary(language));
  for (const plan of catalog.plans) {
    const name = language === "sl" ? plan.nameSl : plan.name;
    expect(summary).toContain(`${name} ${decimal.format(plan.monthlyGross)} ${catalog.currency}`);
  }
  for (const rule of catalog.additionalUserRules) expect(summary).toContain(`${decimal.format(rule.monthlyGrossPerUser)} ${catalog.currency}`);
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
  expect(JSON.stringify(pricingGraph)).toContain('"valueAddedTaxIncluded":false');
  expect(JSON.stringify(pricingGraph)).toContain('"vatID":"SI10550631"');
  const product = pricingGraph.find((node) => node["@type"] === "Product");
  const software = pricingGraph.find((node) => node["@type"] === "SoftwareApplication");
  expect(product).toMatchObject({ offers: expectedOffers });
  expect(software).toMatchObject({ offers: expectedOffers });
  expect(software?.offers).toEqual(product?.offers);
  expect(schemaGraph(getRoutePath("home", language))).toContainEqual(expect.objectContaining({
    "@type": "SoftwareApplication",
    offers: expect.objectContaining({
      price: Math.min(...prices).toFixed(2), priceCurrency: catalog.currency,
      priceSpecification: expect.objectContaining({ valueAddedTaxIncluded: false }),
    }),
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

describe("app-owned pricing contract", () => {
  it("starts from an API snapshot rather than a production price table", () => {
    expect(getInitialPricingCatalog()).toEqual(FALLBACK_PUBLIC_PRICING);
  });
  it.each([legacyCatalog, apiCatalog])("preserves provider rates, including zero", (catalog) => {
    expect(normalizePublicPricingCatalog(catalog).additionalUserRules).toEqual(catalog.additionalUserRules);
  });
  it("sorts valid tiers without replacing their prices", () => {
    expect(normalizePublicPricingCatalog({ ...legacyCatalog, additionalUserRules: [...legacyCatalog.additionalUserRules].reverse() }).additionalUserRules).toEqual(legacyCatalog.additionalUserRules);
  });
  it("rejects missing or corrupt price fields instead of filling in website values", () => {
    for (const raw of [undefined, {}, { ...apiCatalog, additionalUserRules: undefined }, { ...apiCatalog, plans: [] }, { ...apiCatalog, smsPerMessageGross: null }]) expect(() => normalizePublicPricingCatalog(raw)).toThrow();
  });
  it("preserves empty add-ons, zero annual savings and SMS unit precision", () => {
    const result = normalizePublicPricingCatalog({ ...apiCatalog, addOns: [], annualSavingsMonths: 0, smsPerMessageGross: 0.0485, vatIncluded: false });
    expect(result.addOns).toEqual([]);
    expect(result.annualSavingsMonths).toBe(0);
    expect(result.smsPerMessageGross).toBe(0.0485);
    expect(result.vatIncluded).toBe(false);
  });
  it.each(["sl", "en"] as const)("uses the verified initial snapshot in %s", (language) => {
    setPrerenderedPricingCatalog(legacyCatalog);
    expectPublishedCatalog(language, legacyCatalog);
  });
});

describe("admin-managed annual discount and rooms", () => {
  // Shape of the app's catalog once the admin set a 15 % annual discount and room pricing.
  const adminCatalog = {
    ...apiCatalog, annualBilledMonths: 10.2, annualSavingsMonths: 1.8, annualDiscountPercent: 15,
    includedSpacesPerLocation: 1, additionalSpaceMonthlyGross: 2.9,
  };
  const renderPricing = (catalog: PublicPricingCatalog) => {
    setPrerenderedPricingCatalog(catalog);
    const html = renderToStaticMarkup(
      <MemoryRouter><SiteLanguageProvider initialLanguage="sl"><Pricing standalone /></SiteLanguageProvider></MemoryRouter>,
    );
    return new DOMParser().parseFromString(html, "text/html");
  };
  it("accepts fractional annual months and reads the discount and room price", () => {
    const result = normalizePublicPricingCatalog(adminCatalog);
    expect(result).toMatchObject({ annualBilledMonths: 10.2, annualSavingsMonths: 1.8, annualDiscountPercent: 15, spacePricing: { includedPerLocation: 1, monthlyGross: 2.9 } });
    expect(normalizePublicPricingCatalog(result)).toEqual(result);
    expect(normalizePublicPricingCatalog(apiCatalog).spacePricing).toBeNull();
  });
  it("rejects impossible annual months and a room price without its included count", () => {
    for (const raw of [{ ...adminCatalog, annualBilledMonths: 0 }, { ...adminCatalog, annualBilledMonths: 13 }, { ...adminCatalog, includedSpacesPerLocation: undefined }]) expect(() => normalizePublicPricingCatalog(raw)).toThrow();
  });
  it("shows the discount and a rooms step, summary row and charges row for plans with rooms", () => {
    const page = renderPricing(normalizePublicPricingCatalog(adminCatalog));
    expect(page.querySelector(".pricing-savings")?.textContent).toBe("Pri letnem obračunu prihranite 15 %");
    const legends = Array.from(page.querySelectorAll(".pricing-control legend")).map((legend) => legend.textContent);
    expect(legends.slice(1, 4)).toEqual(["2. Uporabniki", "3. Prostori", "4. Dodatna SMS sporočila"]);
    expect(page.querySelector(".pricing-controls")?.textContent?.replace(/\s+/g, " ")).toContain("1 prostor na lokacijo je vključen. Vsak dodatni prostor: 2,90 € / mesec.");
    expect(page.querySelector(".pricing-breakdown")?.textContent).toContain("Dodatni prostori");
    expect(page.querySelector(".pricing-cost-list")?.textContent?.replace(/\s+/g, " ")).toContain("Dodatni prostorOd 2. prostora na lokacijo dalje.2,90 € / mesec");
  });
  it("hides rooms for a plan without the rooms feature", () => {
    const catalog = normalizePublicPricingCatalog({ ...adminCatalog, plans: adminCatalog.plans.map((plan) => ({ ...plan, featureKeys: plan.featureKeys.filter((key) => key !== "integrations") })) });
    const page = renderPricing(catalog);
    const legends = Array.from(page.querySelectorAll(".pricing-control legend")).map((legend) => legend.textContent);
    expect(legends.slice(1, 3)).toEqual(["2. Uporabniki", "3. Dodatna SMS sporočila"]);
    expect(page.querySelector(".pricing-breakdown")?.textContent).not.toContain("Dodatni prostori");
  });
});

describe("current public API snapshot", () => {
  it.each(["sl", "en"] as const)("uses changed API prices across rendered and machine-readable content in %s", async (language) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => apiCatalog }));
    const catalog = await fetchPublicPricingCatalog();
    expect(catalog.plans).toEqual(apiCatalog.plans);
    expect(catalog.additionalUserRules).toEqual(apiCatalog.additionalUserRules);
    expect(getInitialPricingCatalog()).toBe(catalog);
    expectPublishedCatalog(language, catalog);
  });

  it.each(["HTTP", "network", "invalid catalog"] as const)("keeps the last successful snapshot when the %s request fails", async (failure) => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => apiCatalog });
    if (failure === "HTTP") fetchMock.mockResolvedValueOnce({ ok: false, status: 503 });
    else if (failure === "invalid catalog") fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    else fetchMock.mockRejectedValueOnce(new TypeError("Network unavailable"));
    vi.stubGlobal("fetch", fetchMock);

    const savedCatalog = await fetchPublicPricingCatalog();
    await expect(fetchPublicPricingCatalog()).rejects.toThrow(failure === "HTTP" ? "503" : failure === "invalid catalog" ? "Invalid app pricing catalog" : "Network unavailable");
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
      .mockResolvedValueOnce({ ok: true, json: async () => FALLBACK_PUBLIC_PRICING })
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
