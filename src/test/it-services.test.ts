import { describe, expect, it } from "vitest";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { canonicalRoutes } from "@/lib/localized-routes";
import { getSeoForPathname } from "@/lib/seo";

describe("IT services website section", () => {
  it("publishes exactly the six selected standalone services in both languages", () => {
    expect(IT_SERVICE_ROUTE_KEYS).toEqual([
      "itSupport",
      "websiteDesign",
      "websiteMaintenance",
      "businessEmail",
      "backupsSecurity",
      "automation",
    ]);

    for (const routeKey of IT_SERVICE_ROUTE_KEYS) {
      expect(canonicalRoutes[routeKey].sl).toMatch(/^\//);
      expect(canonicalRoutes[routeKey].en).toMatch(/^\/en\//);
      expect(getItServiceContent(routeKey, "sl").title.length).toBeGreaterThan(10);
      expect(getItServiceContent(routeKey, "en").title.length).toBeGreaterThan(10);
    }
  });

  it("keeps IT services separate from the Calendra subscription and exposes Service schema", () => {
    const overviewSeo = getSeoForPathname(canonicalRoutes.itServices.sl);
    const detailSeo = getSeoForPathname(canonicalRoutes.websiteDesign.sl);
    const overviewGraph = overviewSeo.structuredData?.["@graph"] ?? [];
    const detailGraph = detailSeo.structuredData?.["@graph"] ?? [];

    expect(overviewGraph.some((entry: { "@type"?: string }) => entry["@type"] === "Service")).toBe(true);
    expect(detailGraph.some((entry: { "@type"?: string }) => entry["@type"] === "Service")).toBe(true);
    expect(detailGraph.some((entry: { "@type"?: string }) => entry["@type"] === "SoftwareApplication")).toBe(false);
  });
});
