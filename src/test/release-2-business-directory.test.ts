import { describe, expect, it } from "vitest";
import { canonicalRoutes, getLegacyRedirectTarget, getLocalizedPathname, getRouteKeyFromPathname } from "@/lib/localized-routes";
import { getSeoForPathname } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { indexablePublicCompanyProfiles } from "@/lib/public-company-profiles";

describe("Customer search consolidation", () => {
  it("keeps old directory URLs available while consolidating legacy aliases onto the customer page", () => {
    expect(getRouteKeyFromPathname("/ponudniki")).toBe("businesses");
    expect(getRouteKeyFromPathname("/en/providers")).toBe("businesses");
    expect(getRouteKeyFromPathname("/podjetja")).toBe("customers");
    expect(getLocalizedPathname("/ponudniki", "en")).toBe("/en/providers");
    expect(getLocalizedPathname("/en/providers", "sl")).toBe("/ponudniki");
    expect(getLegacyRedirectTarget("/podjetja")).toBe("/za-stranke");
    expect(getLegacyRedirectTarget("/stranke")).toBe("/za-stranke");
    expect(getLegacyRedirectTarget("/clients")).toBe("/en/for-customers");
    expect(getLegacyRedirectTarget("/en/clients")).toBe("/en/for-customers");
  });

  it("keeps the booking page focused on the product instead of the directory", () => {
    const slBooking = getSeoForPathname(canonicalRoutes.booking.sl);
    const enBooking = getSeoForPathname(canonicalRoutes.booking.en);
    expect(slBooking.title.toLowerCase()).not.toContain("imenik");
    expect(enBooking.title.toLowerCase()).not.toContain("directory");
    expect(slBooking.canonicalUrl).toBe(`${SITE_URL}/narocanje`);
    expect(enBooking.canonicalUrl).toBe(`${SITE_URL}/en/booking`);
  });

  it("uses the customer search page as the parent breadcrumb for public business profiles", () => {
    const profile = indexablePublicCompanyProfiles[0];
    expect(profile).toBeDefined();

    for (const language of ["sl", "en"] as const) {
      const pathname = language === "sl" ? `/ponudniki/${profile.slug}` : `/en/providers/${profile.slug}`;
      const seo = getSeoForPathname(pathname);
      const graph = seo.structuredData?.["@graph"] ?? [];
      const breadcrumb = graph.find((node: { "@type"?: string }) => node["@type"] === "BreadcrumbList") as
        | { itemListElement: Array<{ position: number; item: string }> }
        | undefined;

      expect(breadcrumb).toBeDefined();
      expect(breadcrumb?.itemListElement[1]?.item).toBe(`${SITE_URL}${canonicalRoutes.customers[language]}`);
      expect(breadcrumb?.itemListElement[2]?.item).toBe(`${SITE_URL}${pathname}`);
      expect(breadcrumb?.itemListElement).toHaveLength(3);
    }
  });
});
