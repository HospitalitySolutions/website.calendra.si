import { describe, expect, it } from "vitest";
import { normalizePublicStorefront } from "@/lib/public-storefront";

describe("normalizePublicStorefront", () => {
  it("normalizes location services commerce products and team without leaking unknown product types", () => {
    const storefront = normalizePublicStorefront({
      location: {
        locationId: 31,
        slug: "studio-lux-31",
        tenantSlug: "STUDIO-LUX",
        publiclyDiscoverable: true,
        publicName: "Studio LUX Ljubljana",
        publicAddress: "Slovenska 10, Ljubljana",
        publicBookingEnabled: true,
      },
      services: [{ id: 10, name: "Striženje", durationMinutes: 45, priceLabel: "35,00 €", groupBooking: false }],
      products: [
        { productId: "501", name: "Paket 5 obiskov", productType: "PACK", priceGross: 150, currency: "EUR", usageLimit: 5, bookable: true },
        { productId: "service-10", name: "Striženje", productType: "SESSION_SINGLE", priceGross: 35, currency: "EUR" },
      ],
      team: [{ id: 1, name: "Ana Novak" }],
    }, "https://app.calendra.si");

    expect(storefront?.location.slug).toBe("studio-lux-31");
    expect(storefront?.services).toHaveLength(1);
    expect(storefront?.products.map((product) => product.productType)).toEqual(["PACK"]);
    expect(storefront?.team[0]?.name).toBe("Ana Novak");
  });
});
