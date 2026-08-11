import { describe, expect, it } from "vitest";
import { canonicalRoutes, getLegacyRedirectTarget, getLocalizedPathname, getRouteKeyFromPathname } from "@/lib/localized-routes";
import { getSeoForPathname } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { indexablePublicCompanyProfiles } from "@/lib/public-company-profiles";

describe("Release 2 business directory split", () => {
  it("gives the directory its own reciprocal canonical routes", () => {
    expect(getRouteKeyFromPathname("/podjetja")).toBe("businesses");
    expect(getRouteKeyFromPathname("/en/businesses")).toBe("businesses");
    expect(getLocalizedPathname("/podjetja", "en")).toBe("/en/businesses");
    expect(getLocalizedPathname("/en/businesses", "sl")).toBe("/podjetja");
    expect(getLegacyRedirectTarget("/stranke")).toBe("/podjetja");
    expect(getLegacyRedirectTarget("/clients")).toBe("/en/businesses");
    expect(getLegacyRedirectTarget("/en/clients")).toBe("/en/businesses");
  });

  it("keeps the booking page focused on the product instead of the directory", () => {
    const slBooking = getSeoForPathname(canonicalRoutes.booking.sl);
    const enBooking = getSeoForPathname(canonicalRoutes.booking.en);
    expect(slBooking.title.toLowerCase()).not.toContain("imenik");
    expect(enBooking.title.toLowerCase()).not.toContain("directory");
    expect(slBooking.canonicalUrl).toBe(`${SITE_URL}/narocanje`);
    expect(enBooking.canonicalUrl).toBe(`${SITE_URL}/en/booking`);
  });

  it("uses the directory as the parent breadcrumb for public business profiles", () => {
    const profile = indexablePublicCompanyProfiles[0];
    expect(profile).toBeDefined();

    for (const language of ["sl", "en"] as const) {
      const pathname = language === "sl" ? `/podjetja/${profile.slug}` : `/en/businesses/${profile.slug}`;
      const seo = getSeoForPathname(pathname);
      const graph = seo.structuredData?.["@graph"] ?? [];
      const breadcrumb = graph.find((node: { "@type"?: string }) => node["@type"] === "BreadcrumbList") as
        | { itemListElement: Array<{ position: number; item: string }> }
        | undefined;

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb?.itemListElement[1]?.item).toBe(`${SITE_URL}${canonicalRoutes.businesses[language]}`);
      expect(breadcrumb?.itemListElement[2]?.item).toBe(`${SITE_URL}${pathname}`);
    }
  });
});
