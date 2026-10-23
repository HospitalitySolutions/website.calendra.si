import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getIndustryContent } from "@/lib/industry-pages";
import { getSeoForPathname } from "@/lib/seo";
import { getCustomerStory } from "@/lib/customer-stories";
import { additionalUsersTotal, FALLBACK_PUBLIC_PRICING } from "@/lib/public-pricing";

describe("psychology search visibility", () => {
  it("has localized, indexable SEO with a concrete administrative product scope", () => {
    for (const [language, route] of [
      ["sl", "/za-psihologijo-in-svetovanje"],
      ["en", "/en/for-psychology-and-counselling"],
    ] as const) {
      const seo = getSeoForPathname(route);
      const content = getIndustryContent("psychologyCounselling", language);
      expect(seo.noindex).not.toBe(true);
      expect(seo.title.toLowerCase()).toMatch(/psiholog|psycholog/);
      expect(content.intro.toLowerCase()).toMatch(/kliničn|clinical/);
      expect(content.heroPoints).toHaveLength(3);
      expect(content.faq).toHaveLength(5);
      expect(JSON.stringify(seo.structuredData)).toContain('"@type":"SoftwareApplication"');
      expect(seo.alternateUrls?.sl).toContain("/za-psihologijo-in-svetovanje");
      expect(seo.alternateUrls?.en).toContain("/en/for-psychology-and-counselling");
    }
  });

  it("links the verified five-user Avisensa workflow to the psychology industry", () => {
    const avisensa = getCustomerStory("institut-avisensa");
    expect(avisensa?.industryRouteKey).toBe("psychologyCounselling");
    expect(avisensa?.content.sl.facts).toContainEqual({ label: "Uporabniki", value: "5" });
    expect(avisensa?.content.sl.facts).toContainEqual({ label: "Spletno naročanje", value: "Ne" });
  });

  it("derives the five-user pricing example from the same app-supplied catalog as pricing", () => {
    const plan = FALLBACK_PUBLIC_PRICING.plans.find((candidate) => candidate.key === "pro");
    expect(plan).toBeDefined();
    if (!plan) return;
    const example = plan.monthlyGross + additionalUsersTotal(5, plan.includedUsers, FALLBACK_PUBLIC_PRICING.additionalUserRules);
    expect(example).toBeGreaterThan(plan.monthlyGross);
    expect(Number.isFinite(example)).toBe(true);
  });

  it("allows OAI-SearchBot and links to the sitemap", () => {
    const robots = fs.readFileSync(path.resolve(process.cwd(), "public/robots.txt"), "utf8");
    expect(robots).toMatch(/User-agent: OAI-SearchBot\s+Allow: \/?/);
    expect(robots).toContain("Sitemap: https://calendra.si/sitemap.xml");
  });
});
