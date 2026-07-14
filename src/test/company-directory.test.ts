import { describe, expect, it } from "vitest";
import { normalizeDirectoryClients } from "@/lib/company-directory";

describe("normalizeDirectoryClients", () => {
  it("maps public company data, physical address, logo, and Google review fields", () => {
    const clients = normalizeDirectoryClients([
      {
        tenantSlug: "studio-lux",
        publiclyDiscoverable: true,
        publicName: "Studio LUX",
        publicDescription: "Frizerski studio z vrhunskimi storitvami.",
        logoUrl: "/api/public/files/studio-lux-logo.png",
        physicalAddress: {
          address: "Slovenska cesta 10",
          postalCode: "1000",
          city: "Ljubljana",
        },
        googleRating: 4.9,
        googleReviewCount: 128,
      },
    ], "https://app.calendra.si");

    expect(clients).toEqual([
      expect.objectContaining({
        tenantSlug: "studio-lux",
        name: "Studio LUX",
        description: "Frizerski studio z vrhunskimi storitvami.",
        logoUrl: "https://app.calendra.si/api/public/files/studio-lux-logo.png",
        address: "Slovenska cesta 10, 1000 Ljubljana",
        googleRating: 4.9,
        googleReviewCount: 128,
        googleMapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Slovenska%20cesta%2010%2C%201000%20Ljubljana",
      }),
    ]);
  });

  it("does not expose companies explicitly marked as not publicly discoverable", () => {
    const clients = normalizeDirectoryClients([
      { publicName: "Hidden company", publiclyDiscoverable: false },
    ], "https://app.calendra.si");

    expect(clients).toEqual([]);
  });
});
