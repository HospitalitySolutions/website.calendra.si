import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { customerStories, getCustomerStoryPath } from "@/lib/customer-stories";
import { getLocalizedPathname } from "@/lib/localized-routes";
import { getSeoForPathname } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const testDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(testDir, "..");
const rootDir = resolve(srcDir, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(rootDir, relativePath), "utf8");

describe("Release 4 authority", () => {
  it("publishes two real customer stories with approved source links and facts", () => {
    expect(customerStories.map((story) => story.slug)).toEqual(["institut-avisensa", "depilacije-ug"]);

    const avisensa = customerStories.find((story) => story.slug === "institut-avisensa");
    const depilacije = customerStories.find((story) => story.slug === "depilacije-ug");

    expect(avisensa?.websiteUrl).toBe("https://avisensa.com/");
    expect(avisensa?.representative).toBe("Nina Piberčnik");
    expect(avisensa?.content.sl.facts).toContainEqual({ label: "Uporabniki", value: "5" });
    expect(avisensa?.content.sl.facts).toContainEqual({ label: "Spletno naročanje", value: "Ne" });
    expect(avisensa?.content.sl.testimonial).toContain("vse na enem mestu");

    expect(depilacije?.websiteUrl).toBe("https://www.depilacijeug.si/");
    expect(depilacije?.representative).toBe("Urška Grmek");
    expect(depilacije?.content.sl.facts).toContainEqual({ label: "Spletno naročanje", value: "Da" });
    expect(depilacije?.content.sl.facts).toContainEqual({ label: "Računi in plačila", value: "Da" });
    expect(depilacije?.content.sl.testimonial).toContain("manj usklajevanja");
  });

  it("gives every customer story reciprocal canonical and hreflang URLs", () => {
    for (const story of customerStories) {
      const slPath = getCustomerStoryPath(story.slug, "sl");
      const enPath = getCustomerStoryPath(story.slug, "en");
      const slSeo = getSeoForPathname(slPath);
      const enSeo = getSeoForPathname(enPath);

      expect(getLocalizedPathname(slPath, "en")).toBe(enPath);
      expect(getLocalizedPathname(enPath, "sl")).toBe(slPath);
      expect(slSeo.canonicalUrl).toBe(`${SITE_URL}${slPath}`);
      expect(enSeo.canonicalUrl).toBe(`${SITE_URL}${enPath}`);
      expect(slSeo.alternateUrls).toEqual(enSeo.alternateUrls);
      expect(slSeo.noindex).toBe(false);
      expect(enSeo.noindex).toBe(false);
    }
  });

  it("uses Article and Organization schema without fabricating Review ratings", () => {
    for (const story of customerStories) {
      const seo = getSeoForPathname(getCustomerStoryPath(story.slug, "sl"));
      const schema = JSON.stringify(seo.structuredData ?? {});

      expect(schema).toContain('"@type":"Article"');
      expect(schema).toContain('"@type":"Organization"');
      expect(schema).not.toContain('"@type":"Review"');
      expect(schema).not.toContain('"aggregateRating"');
    }
  });

  it("links approved homepage testimonials to the full customer stories", () => {
    const testimonials = readProjectFile("src/components/landing/Testimonials.tsx");
    expect(testimonials).toContain('storySlug: "institut-avisensa"');
    expect(testimonials).toContain('storySlug: "depilacije-ug"');
    expect(testimonials).toContain("getCustomerStoryPath(review.storySlug, language)");
  });

  it("adds authoritative sources and removes unsupported no-show promises", () => {
    const sourcedArticles = [
      "content/blog/sl/gdpr-za-salone-in-storitvena-podjetja.mdx",
      "content/blog/en/gdpr-for-salons-and-service-businesses.mdx",
      "content/blog/sl/davcno-potrjevanje-racunov.mdx",
      "content/blog/en/fiscal-verification-of-invoices-slovenia.mdx",
      "content/blog/sl/kako-zmanjsati-pozabljene-termine.mdx",
      "content/blog/en/how-to-reduce-no-shows.mdx",
      "content/blog/sl/sms-ali-e-posta-za-opomnike-na-termin.mdx",
      "content/blog/en/sms-vs-email-appointment-reminders.mdx",
    ];

    for (const article of sourcedArticles) {
      const source = readProjectFile(article);
      expect(source).toContain('dateModified: "2026-08-11"');
      expect(source).toMatch(/https:\/\//);
    }

    const slNoShows = readProjectFile("content/blog/sl/kako-zmanjsati-pozabljene-termine.mdx");
    const enNoShows = readProjectFile("content/blog/en/how-to-reduce-no-shows.mdx");
    const slSms = readProjectFile("content/blog/sl/sms-ali-e-posta-za-opomnike-na-termin.mdx");
    const enSms = readProjectFile("content/blog/en/sms-vs-email-appointment-reminders.mdx");

    expect(slNoShows).not.toContain("običajno prepolovi");
    expect(slNoShows).not.toContain("15 odstotkov na 5 do 8 odstotkov");
    expect(enNoShows).not.toContain("typically halve");
    expect(enNoShows).not.toContain("15 percent to between 5 and 8 percent");
    expect(slSms).not.toContain("SMS je pri opomnikih zanesljivejši od e-pošte");
    expect(enSms).not.toContain("SMS is more reliable than email");
  });
});
