import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Testimonials from "@/components/landing/Testimonials";
import { customerStories, getCustomerStoryPath } from "@/lib/customer-stories";
import { getLocalizedPathname } from "@/lib/localized-routes";
import { getSeoForPathname } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { SiteLanguageProvider } from "@/lib/site-language";

const testDir = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(testDir, "..");
const rootDir = resolve(srcDir, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(rootDir, relativePath), "utf8");

describe("Release 4 authority", () => {
  it("publishes all three approved customer stories with their source links and facts", () => {
    const approvedReferences = [
      { slug: "institut-avisensa", websiteUrl: "https://avisensa.com/", representative: "Nina Piberčnik" },
      { slug: "depilacije-ug", websiteUrl: "https://www.depilacijeug.si/", representative: "Urška Grmek" },
      { slug: "skreativa", websiteUrl: "https://www.skreativa.si/", representative: "Špela Kovačič" },
    ];
    expect(customerStories).toHaveLength(approvedReferences.length);
    expect(customerStories.map(({ slug, websiteUrl, representative }) => ({ slug, websiteUrl, representative })))
      .toEqual(expect.arrayContaining(approvedReferences));

    const avisensa = customerStories.find((story) => story.slug === "institut-avisensa");
    const depilacije = customerStories.find((story) => story.slug === "depilacije-ug");
    const skreativa = customerStories.find((story) => story.slug === "skreativa");

    expect(avisensa?.content.sl.facts).toContainEqual({ label: "Uporabniki", value: "5" });
    expect(avisensa?.content.sl.facts).toContainEqual({ label: "Spletno naročanje", value: "Ne" });
    expect(avisensa?.content.sl.facts).toContainEqual({ label: "Opomniki", value: "Da" });

    expect(depilacije?.content.sl.facts).toContainEqual({ label: "Spletno naročanje", value: "Da" });
    expect(depilacije?.content.sl.facts).toContainEqual({ label: "Računi in plačila", value: "Da" });

    expect(skreativa?.content.sl.facts).toContainEqual({ label: "Uporaba", value: "Sestanki in svetovalni termini" });
    expect(skreativa?.content.sl.facts).toContainEqual({ label: "Spletno naročanje", value: "Da" });
    expect(skreativa?.content.sl.facts).toContainEqual({ label: "Potrditve", value: "Samodejne" });
    expect(skreativa?.content.sl.facts).toContainEqual({ label: "Opomniki", value: "Da" });

    for (const story of customerStories) {
      for (const language of ["sl", "en"] as const) {
        expect(story.content[language].testimonial.trim()).not.toBe("");
      }
    }
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

  it.each(["sl", "en"] as const)("renders links from approved homepage testimonials to their full stories (%s)", (language) => {
    const html = renderToStaticMarkup(
      createElement(SiteLanguageProvider, { initialLanguage: language }, createElement(Testimonials)),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const cards = Array.from(document.querySelectorAll("article"));

    for (const story of customerStories) {
      const card = cards.find((item) => item.textContent?.includes(story.representative));
      expect(card).toBeDefined();
      expect(card?.querySelector(`a[href="${getCustomerStoryPath(story.slug, language)}"]`)).not.toBeNull();
    }
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
