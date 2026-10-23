import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import IndustryDetailPage from "@/pages/IndustryDetailPage";
import LegalPolicyPage from "@/components/legal/LegalPolicyPage";
import { SiteLanguageProvider } from "@/lib/site-language";
import { APP_PRICING_SNAPSHOT, additionalUsersTotal, normalizePublicPricingCatalog, setPrerenderedPricingCatalog } from "@/lib/public-pricing";
import { getPricingTaxNote } from "@/lib/pricing-copy";

const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), file), "utf8");
afterEach(() => setPrerenderedPricingCatalog(APP_PRICING_SNAPSHOT));

describe("application-owned pricing", () => {
  it.each(["sl", "en"] as const)("renders a psychology example using updated app prices and included users in %s", (language) => {
    const catalog = normalizePublicPricingCatalog({
      ...APP_PRICING_SNAPSHOT,
      plans: APP_PRICING_SNAPSHOT.plans.map((plan) => plan.key === "pro" ? { ...plan, monthlyGross: 31.27, annualGross: 280.25, includedUsers: 2 } : plan),
      additionalUserRules: [
        { fromUser: 2, toUser: 3, monthlyGrossPerUser: 1.45 },
        { fromUser: 4, toUser: null, monthlyGrossPerUser: 2.35 },
      ],
      vatIncluded: false,
    });
    setPrerenderedPricingCatalog(catalog);
    const route = language === "sl" ? "/za-psihologijo-in-svetovanje" : "/en/for-psychology-and-counselling";
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={[route]}><SiteLanguageProvider initialLanguage={language}><IndustryDetailPage /></SiteLanguageProvider></MemoryRouter>);
    const page = new DOMParser().parseFromString(html, "text/html");
    const section = page.querySelector('[aria-labelledby="psychology-price-title"]');
    const format = new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-IE", { style: "currency", currency: catalog.currency });
    expect(additionalUsersTotal(5, 2, catalog.additionalUserRules)).toBeCloseTo(6.15);
    expect(section?.textContent).toContain(format.format(31.27));
    expect(section?.textContent).toContain(format.format(6.15));
    expect(section?.textContent).toContain(format.format(37.42));
    expect(section?.textContent).toContain(getPricingTaxNote(language, false));
    expect(section?.textContent).not.toContain(format.format(52.5));
  });

  it("does not invent an annual price or ignore a zero extra-user rate", () => {
    const catalog = normalizePublicPricingCatalog({
      ...APP_PRICING_SNAPSHOT,
      plans: APP_PRICING_SNAPSHOT.plans.map((plan) => ({ ...plan, annualGross: 123.45 })),
      additionalUserRules: [{ fromUser: 2, toUser: null, monthlyGrossPerUser: 0 }],
    });
    expect(catalog.plans.every((plan) => plan.annualGross === 123.45)).toBe(true);
    expect(additionalUsersTotal(5, 1, catalog.additionalUserRules)).toBe(0);
  });

  it.each(["sl", "en"] as const)("links %s terms to current pricing without duplicating monetary amounts", (language) => {
    const html = renderToStaticMarkup(<MemoryRouter><SiteLanguageProvider initialLanguage={language}><LegalPolicyPage policy="terms" /></SiteLanguageProvider></MemoryRouter>);
    const page = new DOMParser().parseFromString(html, "text/html");
    const section = page.querySelector("#ddv");
    expect(section?.textContent).not.toMatch(/15[.,]90|17[.,]90|19[.,]40/);
    expect(section?.textContent).toMatch(/aplikacije|application/);
    expect(page.querySelector(`a[href="${language === "sl" ? "/cenik" : "/en/pricing"}"]`)).not.toBeNull();
  });

  it("keeps synthetic prices out of production sources and never overrides app amounts", () => {
    for (const file of ["src/lib/public-pricing.ts", "src/lib/pricing-catalog.ts"]) {
      expect(read(file)).not.toMatch(/monthlyGross\s*:\s*\d|annualGross\s*:\s*\d|monthlyGrossPerUser\s*:\s*\d/);
    }
    expect(read("src/components/landing/Pricing.tsx")).not.toMatch(/price:\s*"[0-9€]/);
    expect(read("vite.config.ts")).toContain("pricingSnapshotPlugin()");
    expect(read("vite.config.ts")).not.toContain("test/fixtures");
    expect(read("vitest.config.ts")).toContain("test/fixtures/public-pricing-snapshot.ts");
  });
});
