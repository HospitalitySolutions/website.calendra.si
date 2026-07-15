import { describe, expect, it } from "vitest";
import { canonicalRoutes, getCanonicalPathname, getLocalizedPathname } from "@/lib/localized-routes";
import { getSeoForPathname } from "@/lib/seo";

const graphTypes = (pathname: string) => {
  const seo = getSeoForPathname(pathname);
  const graph = seo.structuredData && "@graph" in seo.structuredData ? seo.structuredData["@graph"] : [];
  return Array.isArray(graph) ? graph.map((item) => item?.["@type"]) : [];
};

describe("Calendra Connect landing page", () => {
  it("uses localized canonical routes and preserves the old mobile-app alias", () => {
    expect(canonicalRoutes.connect.sl).toBe("/calendra-connect");
    expect(canonicalRoutes.connect.en).toBe("/en/calendra-connect");
    expect(getCanonicalPathname("/mobilna-aplikacija")).toBe("/calendra-connect");
    expect(getCanonicalPathname("/mobile-app")).toBe("/en/calendra-connect");
    expect(getLocalizedPathname("/calendra-connect", "en")).toBe("/en/calendra-connect");
  });

  it("publishes indexable localized SEO metadata and MobileApplication schema", () => {
    const sl = getSeoForPathname("/calendra-connect");
    const en = getSeoForPathname("/en/calendra-connect");

    expect(sl.noindex).not.toBe(true);
    expect(en.noindex).not.toBe(true);
    expect(sl.title).toContain("Calendra Connect");
    expect(en.title).toContain("Calendra Connect");
    expect(sl.ogImage).toContain("/connect/og-calendra-connect.png");
    expect(graphTypes("/calendra-connect")).toContain("MobileApplication");
  });
});
