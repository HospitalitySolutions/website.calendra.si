import { describe, expect, it } from "vitest";
import {
  getDirectoryClientBookingPath,
  isDirectoryClientBookingEnabled,
  mergeDirectoryClients,
  normalizeDirectoryClients,
  type DirectoryClient,
} from "@/lib/company-directory";

describe("normalizeDirectoryClients", () => {
  it("maps public location data, presentation address, logo, Google review fields, and booking metadata", () => {
    const clients = normalizeDirectoryClients([
      {
        locationId: 31,
        locationCode: "LUX-LJ",
        slug: "studio-lux-31",
        tenantSlug: "STUDIO-LUX",
        publiclyDiscoverable: true,
        publicName: "Studio LUX Ljubljana",
        publicDescription: "Frizerski studio z vrhunskimi storitvami.",
        logoUrl: "/api/public/files/studio-lux-logo.png",
        publicAddress: "Slovenska cesta 10, 1000 Ljubljana",
        physicalAddress: {
          address: "Ignored fallback street",
          postalCode: "1000",
          city: "Ljubljana",
        },
        publicBookingEnabled: true,
        bookingUrl: "/narocanje/STUDIO-LUX?locationId=31",
        googleRating: 4.9,
        googleReviewCount: 128,
      },
    ], "https://app.calendra.si");

    expect(clients).toEqual([
      expect.objectContaining({
        locationId: 31,
        locationCode: "LUX-LJ",
        slug: "studio-lux-31",
        tenantCode: "STUDIO-LUX",
        tenantSlug: "STUDIO-LUX",
        name: "Studio LUX Ljubljana",
        description: "Frizerski studio z vrhunskimi storitvami.",
        logoUrl: "https://app.calendra.si/api/public/files/studio-lux-logo.png",
        address: "Slovenska cesta 10, 1000 Ljubljana",
        publicBookingEnabled: true,
        bookingUrl: "/narocanje/STUDIO-LUX?locationId=31",
        googleRating: 4.9,
        googleReviewCount: 128,
        googleMapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Slovenska%20cesta%2010%2C%201000%20Ljubljana",
      }),
    ]);
  });

  it("prefers the location-specific booking URL returned by the API", () => {
    const [client] = normalizeDirectoryClients([
      {
        locationId: 31,
        tenantSlug: "STUDIO-LUX",
        slug: "studio-lux-31",
        publiclyDiscoverable: true,
        publicName: "Studio LUX Ljubljana",
        bookingUrl: "/narocanje/STUDIO-LUX?locationId=31",
      },
    ], "https://app.calendra.si");

    expect(getDirectoryClientBookingPath(client)).toBe("/narocanje/STUDIO-LUX?locationId=31");
  });

  it("keeps locationId in the fallback booking route when bookingUrl is missing", () => {
    const [client] = normalizeDirectoryClients([
      {
        locationId: 57,
        tenantSlug: "tenant 001",
        slug: "tenant-001-57",
        publiclyDiscoverable: true,
        publicName: "Main location",
      },
    ], "https://app.calendra.si");

    expect(getDirectoryClientBookingPath(client)).toBe("/narocanje/tenant%20001?locationId=57");
  });

  it("supports snake_case tenant codes returned by compatible public APIs", () => {
    const [client] = normalizeDirectoryClients([
      {
        tenant_code: "avisensa-si",
        publicSlug: "institut-avisensa",
        publiclyDiscoverable: true,
        publicName: "Inštitut Avisensa",
      },
    ], "https://app.calendra.si");

    expect(client.tenantCode).toBe("avisensa-si");
    expect(getDirectoryClientBookingPath(client)).toBe("/narocanje/avisensa-si");
  });

  it("keeps the public location code for customer profile URLs", () => {
    const [client] = normalizeDirectoryClients([
      {
        locationId: 3,
        code: "3DAV",
        slug: "3dav-3",
        publiclyDiscoverable: true,
        publicName: "UG depilation",
      },
    ], "https://app.calendra.si");

    expect(client.locationCode).toBe("3DAV");
  });

  it("does not expose locations explicitly marked as not publicly discoverable", () => {
    const clients = normalizeDirectoryClients([
      { publicName: "Hidden location", publiclyDiscoverable: false },
    ], "https://app.calendra.si");

    expect(clients).toEqual([]);
  });

  it("keeps two public locations from the same tenant as two independent entries", () => {
    const clients = normalizeDirectoryClients([
      {
        locationId: 31,
        slug: "studio-lux-31",
        tenantSlug: "STUDIO-LUX",
        publiclyDiscoverable: true,
        publicName: "Studio LUX Ljubljana",
      },
      {
        locationId: 32,
        slug: "studio-lux-32",
        tenantSlug: "STUDIO-LUX",
        publiclyDiscoverable: true,
        publicName: "Studio LUX Maribor",
      },
    ], "https://app.calendra.si");

    expect(clients).toHaveLength(2);
    expect(clients.map((client) => client.locationId)).toEqual([31, 32]);
    expect(clients.map((client) => client.slug)).toEqual(["studio-lux-31", "studio-lux-32"]);
  });
});

describe("mergeDirectoryClients", () => {
  const staticClient: DirectoryClient = {
    slug: "studio-lux",
    profileSlug: "studio-lux",
    tenantCode: "STUDIO-LUX",
    tenantSlug: "STUDIO-LUX",
    name: "Studio LUX",
    description: "Curated fallback description",
    address: "Slovenia",
    googleMapsUrl: "https://maps.example/static",
    category: "salon",
  };

  it("does not collapse multiple live locations that belong to the same curated company profile", () => {
    const liveClients: DirectoryClient[] = [
      {
        slug: "studio-lux-31",
        tenantCode: "STUDIO-LUX",
        tenantSlug: "STUDIO-LUX",
        locationId: 31,
        bookingUrl: "/narocanje/STUDIO-LUX?locationId=31",
        publicBookingEnabled: true,
        name: "Studio LUX Ljubljana",
        description: "",
        address: "Ljubljana",
        googleMapsUrl: "https://maps.example/lj",
      },
      {
        slug: "studio-lux-32",
        tenantCode: "STUDIO-LUX",
        tenantSlug: "STUDIO-LUX",
        locationId: 32,
        bookingUrl: "/narocanje/STUDIO-LUX?locationId=32",
        publicBookingEnabled: true,
        name: "Studio LUX Maribor",
        description: "",
        address: "Maribor",
        googleMapsUrl: "https://maps.example/mb",
      },
    ];

    const merged = mergeDirectoryClients(liveClients, [staticClient]);

    expect(merged).toHaveLength(2);
    expect(merged.map((client) => client.slug)).toEqual(["studio-lux-31", "studio-lux-32"]);
    expect(merged.map((client) => client.locationId)).toEqual([31, 32]);
    expect(merged.map((client) => client.profileSlug)).toEqual(["studio-lux", "studio-lux"]);
    expect(merged.every((client) => client.category === "salon")).toBe(true);
  });
});

describe("isDirectoryClientBookingEnabled", () => {
  it("respects the location-level public booking flag", () => {
    expect(isDirectoryClientBookingEnabled({ publicBookingEnabled: false })).toBe(false);
    expect(isDirectoryClientBookingEnabled({ publicBookingEnabled: true })).toBe(true);
    expect(isDirectoryClientBookingEnabled({ publicBookingEnabled: undefined })).toBe(true);
  });
});
