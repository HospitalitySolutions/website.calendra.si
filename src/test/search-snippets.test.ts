import { describe, expect, it } from "vitest";
import { FALLBACK_PUBLIC_PRICING } from "@/lib/public-pricing";
import { pageSeo } from "@/lib/seo";

const ROUTES = ["booking", "pricing", "invoicing"] as const;

describe("search snippets for booking, pricing and invoicing", () => {
  it.each(ROUTES)("keeps the %s title and description within search result limits", (routeKey) => {
    for (const language of ["sl", "en"] as const) {
      const { title, description } = pageSeo[routeKey][language];
      expect(title.length, `${routeKey}.${language} title`).toBeLessThanOrEqual(60);
      expect(description.length, `${routeKey}.${language} description`).toBeLessThanOrEqual(160);
      expect(title.endsWith(" | Calendra")).toBe(true);
    }
  });

  it("names the plans exactly as the pricing catalog does", () => {
    const plans = FALLBACK_PUBLIC_PRICING.plans;
    expect(plans.length).toBe(3);
    for (const plan of plans) {
      expect(pageSeo.pricing.sl.description).toContain(plan.nameSl);
      expect(pageSeo.pricing.en.description).toContain(plan.name);
    }
  });

  it("promises the same free trial the rest of the site describes", () => {
    for (const routeKey of ROUTES) {
      expect(pageSeo[routeKey].sl.description).toMatch(/14 dni brezplačno/);
      expect(pageSeo[routeKey].en.description).toMatch(/[Ff]ree for 14 days/);
    }
  });
});
