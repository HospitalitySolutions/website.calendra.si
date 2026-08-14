import { describe, expect, it } from "vitest";
import {
  getPublicCompanyProfileFromPathname,
  getPublicCompanyProfilePath,
  indexablePublicCompanyProfiles,
  isIndexablePublicProfile,
  publicCompanyProfiles,
} from "@/lib/public-company-profiles";

describe("public company profiles", () => {
  it("only exposes complete and explicitly enabled profiles to the sitemap", () => {
    expect(indexablePublicCompanyProfiles.length).toBeGreaterThan(0);
    expect(indexablePublicCompanyProfiles.every(isIndexablePublicProfile)).toBe(true);
    expect(indexablePublicCompanyProfiles.map((profile) => profile.slug)).toEqual(
      expect.arrayContaining(["beauty-lounge", "institut-avisensa"]),
    );
  });

  it("creates reciprocal Slovenian and English profile routes", () => {
    const profile = publicCompanyProfiles[0];
    expect(getPublicCompanyProfilePath(profile.slug, "sl")).toBe(`/za-stranke/${profile.slug}`);
    expect(getPublicCompanyProfilePath(profile.slug, "en")).toBe(`/en/for-customers/${profile.slug}`);
    expect(getPublicCompanyProfileFromPathname(`/za-stranke/${profile.slug}`)?.slug).toBe(profile.slug);
    expect(getPublicCompanyProfileFromPathname(`/ponudniki/${profile.slug}`)?.slug).toBe(profile.slug);
    expect(getPublicCompanyProfileFromPathname(`/en/for-customers/${profile.slug}`)?.slug).toBe(profile.slug);
    expect(getPublicCompanyProfileFromPathname(`/en/providers/${profile.slug}`)?.slug).toBe(profile.slug);
    expect(getPublicCompanyProfileFromPathname(`/podjetja/${profile.slug}`)?.slug).toBe(profile.slug);
    expect(getPublicCompanyProfileFromPathname(`/en/businesses/${profile.slug}`)?.slug).toBe(profile.slug);
    expect(getPublicCompanyProfileFromPathname(`/narocanje/${profile.slug}`)).toBeUndefined();
    expect(getPublicCompanyProfileFromPathname(`/en/booking/${profile.slug}`)).toBeUndefined();
  });
});
