import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getFeatureContent } from "@/lib/feature-pages";
import { getIndustryContent } from "@/lib/industry-pages";

const testDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(testDir, "..");

const readSource = (relativePath: string) => readFileSync(resolve(srcDir, relativePath), "utf8");

describe("Release 3 commercial visibility", () => {
  it("uses real product screenshots on the main commercial feature pages", () => {
    for (const routeKey of ["calendar", "invoicing", "clientManagement", "reminders"] as const) {
      const sl = getFeatureContent(routeKey, "sl");
      const en = getFeatureContent(routeKey, "en");

      expect(sl.screenshot?.src).toMatch(/^\/screenshots\/.+\.webp$/);
      expect(en.screenshot?.src).toMatch(/^\/screenshots\/.+\.webp$/);
      expect(sl.screenshot?.srcSet).toContain("/screenshots/");
      expect(en.screenshot?.srcSet).toContain("/screenshots/");
      expect(sl.screenshot?.alt.length).toBeGreaterThan(20);
      expect(en.screenshot?.alt.length).toBeGreaterThan(20);
    }
  });

  it("makes the beauty and hair page specifically relevant to salons", () => {
    const sl = getIndustryContent("beautyHair", "sl");
    const en = getIndustryContent("beautyHair", "en");

    expect(sl.title.toLowerCase()).toContain("kozmetične");
    expect(sl.title.toLowerCase()).toContain("frizerske");
    expect(sl.intro.toLowerCase()).toContain("salon");
    expect(en.title.toLowerCase()).toContain("beauty");
    expect(en.title.toLowerCase()).toContain("hair");
  });

  it("gives fitness and group services a genuinely distinct workflow", () => {
    const sl = getIndustryContent("fitnessGroups", "sl");
    const en = getIndustryContent("fitnessGroups", "en");
    const slText = JSON.stringify(sl).toLowerCase();
    const enText = JSON.stringify(en).toLowerCase();

    expect(sl.title.toLowerCase()).toContain("skupinske vadbe");
    expect(slText).toContain("kapacitet");
    expect(slText).toContain("čakaln");
    expect(slText).toContain("članstv");
    expect(slText).toContain("obisk");
    expect(slText).not.toContain("načrtovana");

    expect(en.title.toLowerCase()).toContain("group");
    expect(enText).toContain("capacity");
    expect(enText).toContain("waiting list");
    expect(enText).toContain("membership");
    expect(enText).toContain("attendance");
  });

  it("keeps IT services out of the primary navigation while preserving product solutions", () => {
    const navbar = readSource("components/landing/Navbar.tsx");

    expect(navbar).not.toContain("IT_SERVICE_ROUTE_KEYS");
    expect(navbar).not.toContain("copy.nav.itServices");
    expect(navbar).toContain('getRoutePath("beautyHair", language)');
    expect(navbar).toContain('getRoutePath("fitnessGroups", language)');
  });

  it("publishes the two approved customer references with their source sites", () => {
    const testimonials = readSource("components/landing/Testimonials.tsx");

    expect(testimonials).toContain("Nina Piberčnik");
    expect(testimonials).toContain("https://avisensa.com/");
    expect(testimonials).toContain("Urška Grmek");
    expect(testimonials).toContain("https://www.depilacijeug.si/");
  });
});
