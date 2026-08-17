import { describe, expect, it } from "vitest";
import { BUSINESS_TYPE_ROUTE_KEYS, getIndustryContent } from "@/lib/industry-pages";
import { canonicalRoutes } from "@/lib/localized-routes";

describe("business type industry pages", () => {
  it("defines one localized page for every homepage business type", () => {
    expect(BUSINESS_TYPE_ROUTE_KEYS).toHaveLength(12);

    for (const routeKey of BUSINESS_TYPE_ROUTE_KEYS) {
      const sl = getIndustryContent(routeKey, "sl");
      const en = getIndustryContent(routeKey, "en");

      expect(sl.title.length).toBeGreaterThan(20);
      expect(en.title.length).toBeGreaterThan(20);
      expect(sl.features).toHaveLength(6);
      expect(en.features).toHaveLength(6);
      expect(sl.faq).toHaveLength(5);
      expect(en.faq).toHaveLength(5);
      expect(canonicalRoutes[routeKey].sl).toMatch(/^\/za-/);
      expect(canonicalRoutes[routeKey].en).toMatch(/^\/en\/for-/);
    }
  });

  it("uses unique canonical paths for the 12 pages", () => {
    const paths = BUSINESS_TYPE_ROUTE_KEYS.flatMap((routeKey) => [
      canonicalRoutes[routeKey].sl,
      canonicalRoutes[routeKey].en,
    ]);

    expect(new Set(paths).size).toBe(paths.length);
  });
});
