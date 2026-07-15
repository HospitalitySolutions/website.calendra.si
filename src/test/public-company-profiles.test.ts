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
    expect(getPublicCompanyProfilePath(profile.slug, "sl")).toBe(`/narocanje/${profile.slug}`);
    expect(getPublicCompanyProfilePath(profile.slug, "en")).toBe(`/en/booking/${profile.slug}`);
    expect(getPublicCompanyProfileFromPathname(`/narocanje/${profile.slug}`)?.slug).toBe(profile.slug);
    expect(getPublicCompanyProfileFromPathname(`/en/booking/${profile.slug}`)?.slug).toBe(profile.slug);
  });
});
