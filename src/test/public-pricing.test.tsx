import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Pricing from "@/components/landing/Pricing";
import { SiteLanguageProvider } from "@/lib/site-language";
import {
  calculateAdditionalUsersMonthlyPrice,
  calculatePublicPricingTotals,
  FALLBACK_PUBLIC_PRICING,
  fetchPublicPricingCatalog,
  getInitialPricingCatalog,
  normalizePublicPricingCatalog,
  setPrerenderedPricingCatalog,
  type PublicPricingCatalog,
} from "@/lib/public-pricing";

const legacyCatalog: PublicPricingCatalog = {
  ...FALLBACK_PUBLIC_PRICING,
  additionalUserRules: [
    { fromUser: 2, toUser: 5, monthlyGrossPerUser: 5.9 },
    { fromUser: 6, toUser: null, monthlyGrossPerUser: 3.9 },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
  setPrerenderedPricingCatalog(FALLBACK_PUBLIC_PRICING);
});

describe("one price for every additional user", () => {
  it.each([
    [1, 0], [2, 5.9], [5, 23.6], [6, 29.5], [10, 53.1], [20, 112.1],
  ])("charges %i total users €%s per month, including legacy catalogs", (users, expected) => {
    expect(calculateAdditionalUsersMonthlyPrice(users, legacyCatalog)).toBe(expected);
    expect(calculateAdditionalUsersMonthlyPrice(users, normalizePublicPricingCatalog(legacyCatalog))).toBe(expected);
  });

  it("preserves the configured standard price and removes the legacy tier regardless of order", () => {
    const catalog = normalizePublicPricingCatalog({
      ...legacyCatalog,
      additionalUserRules: [...legacyCatalog.additionalUserRules].reverse(),
    });
    expect(catalog.additionalUserRules).toEqual([
      { fromUser: 2, toUser: null, monthlyGrossPerUser: 5.9 },
    ]);
  });

  it("preserves an explicitly free additional-user rate", () => {
    const catalog = normalizePublicPricingCatalog({
      additionalUserRules: [{ fromUser: 2, toUser: null, monthlyGrossPerUser: 0 }],
    });
    expect(calculateAdditionalUsersMonthlyPrice(20, catalog)).toBe(0);
  });

  it.each([
    { rules: undefined },
    { rules: [] },
    { rules: [{ fromUser: 6, toUser: null, monthlyGrossPerUser: 3.9 }] },
    { rules: [{ fromUser: 2, toUser: null, monthlyGrossPerUser: Number.NaN }] },
    { rules: [{ fromUser: 2, toUser: null, monthlyGrossPerUser: -1 }] },
  ])("uses a single fallback rate when the standard rate is missing or invalid: $rules", ({ rules }) => {
    const catalog = normalizePublicPricingCatalog({ additionalUserRules: rules });
    expect(catalog.additionalUserRules).toEqual(FALLBACK_PUBLIC_PRICING.additionalUserRules);
    expect(calculateAdditionalUsersMonthlyPrice(6, catalog)).toBe(49.5);
  });

  it("does not charge for included users or invalid user counts", () => {
    for (const users of [-1, 0, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(calculateAdditionalUsersMonthlyPrice(users, legacyCatalog)).toBe(0);
    }
  });

  it("normalizes live API results and preserves the single-rate fallback on an outage", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => legacyCatalog }));
    expect((await fetchPublicPricingCatalog()).additionalUserRules).toEqual([
      { fromUser: 2, toUser: null, monthlyGrossPerUser: 5.9 },
    ]);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchPublicPricingCatalog()).rejects.toThrow("503");
    expect(calculateAdditionalUsersMonthlyPrice(6, getInitialPricingCatalog())).toBe(49.5);
  });
});

describe("monthly and annual pricing agreement with the app", () => {
  const catalog = normalizePublicPricingCatalog(legacyCatalog);
  const selection = { planKey: "basic" as const, totalUsers: 6, additionalSms: 50, selectedAddOnKeys: [] };

  it("adds the package, five additional users and SMS for monthly billing", () => {
    expect(calculatePublicPricingTotals(catalog, { ...selection, billingPeriod: "monthly" }))
      .toEqual({ monthlyTotal: 49.9, billingPeriodTotal: 49.9 });
  });

  it("charges ten months for seats annually and twelve months of estimated SMS usage", () => {
    expect(calculatePublicPricingTotals(catalog, { ...selection, billingPeriod: "annual" }))
      .toEqual({ monthlyTotal: 42, billingPeriodTotal: 504 });
  });

  it("applies the same annual rule to selected recurring modules", () => {
    expect(calculatePublicPricingTotals(catalog, {
      ...selection, billingPeriod: "annual", selectedAddOnKeys: ["fiscal-cash-register"],
    })).toEqual({ monthlyTotal: 50.25, billingPeriodTotal: 603 });
  });

  it("rounds the final monthly average instead of rounding the plan before adding seats", () => {
    expect(calculatePublicPricingTotals(catalog, {
      ...selection, totalUsers: 2, additionalSms: 0, billingPeriod: "annual",
    })).toEqual({ monthlyTotal: 19.83, billingPeriodTotal: 238 });
  });
});

describe("pre-rendered pricing copy", () => {
  it.each(["sl", "en"] as const)("shows the configured single price in %s, including an old build snapshot", (language) => {
    setPrerenderedPricingCatalog(legacyCatalog);
    const html = renderToStaticMarkup(
      <SiteLanguageProvider initialLanguage={language}><Pricing standalone /></SiteLanguageProvider>,
    );
    expect(html).toContain(language === "sl" ? "Prvi uporabnik je vključen" : "The first user is included");
    expect(html).toContain(language === "sl" ? "Vsak dodatni uporabnik:" : "Each additional user:");
    expect(html).toMatch(/5[,.]90/);
    expect(html).not.toMatch(/3[,.]90|Od 6\.|from user 6|Users 2[–-]5|∞/);
    expect(getInitialPricingCatalog().additionalUserRules).toHaveLength(1);
  });
});
