import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { describe, expect, it } from "vitest";
import Navbar from "@/components/landing/Navbar";
import Testimonials from "@/components/landing/Testimonials";
import { getFeatureContent } from "@/lib/feature-pages";
import { getIndustryContent } from "@/lib/industry-pages";
import { IT_SERVICE_CANONICAL_KEYS } from "@/lib/it-services";
import { getRoutePath } from "@/lib/localized-routes";
import { SiteLanguageProvider, type SiteLanguage } from "@/lib/site-language";

const renderMarketingComponent = (component: ComponentType, language: SiteLanguage) => {
  const html = renderToStaticMarkup(
    createElement(
      StaticRouter,
      { location: getRoutePath("home", language) },
      createElement(SiteLanguageProvider, { initialLanguage: language }, createElement(component)),
    ),
  );
  return new DOMParser().parseFromString(html, "text/html");
};

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

    expect(sl.title).toMatch(/lepot|kozmet/i);
    expect(sl.title).toMatch(/frizersk/i);
    expect(sl.audiences.some((audience) => /kozmet.*salon/i.test(audience))).toBe(true);
    expect(sl.audiences.some((audience) => /frizersk.*salon/i.test(audience))).toBe(true);
    expect(en.title).toMatch(/beauty/i);
    expect(en.title).toMatch(/hair/i);
    expect(en.audiences.some((audience) => /beauty.*salon/i.test(audience))).toBe(true);
    expect(en.audiences.some((audience) => /hair.*salon/i.test(audience))).toBe(true);
  });

  it("gives fitness and group services a genuinely distinct workflow", () => {
    const sl = getIndustryContent("fitnessGroups", "sl");
    const en = getIndustryContent("fitnessGroups", "en");
    const slWorkflow = sl.workflow.join(" ").toLowerCase();
    const enWorkflow = en.workflow.join(" ").toLowerCase();

    expect(sl.title).toMatch(/skupinsk/i);
    expect(slWorkflow).toContain("kapacitet");
    expect(slWorkflow).toContain("čakaln");
    expect(slWorkflow).toContain("članstv");
    expect(slWorkflow).toContain("obisk");

    expect(en.title).toMatch(/group/i);
    expect(enWorkflow).toContain("capacity");
    expect(enWorkflow).toContain("waiting list");
    expect(enWorkflow).toContain("membership");
    expect(enWorkflow).toContain("attendance");
  });

  it.each(["sl", "en"] as const)("renders product navigation links without IT services (%s)", (language) => {
    const document = renderMarketingComponent(Navbar, language);
    const links = Array.from(document.querySelectorAll("nav a[href]"), (link) => link.getAttribute("href"));

    for (const routeKey of ["beautySalons", "hairSalons", "spaSauna", "fitnessPersonalTraining", "groupBookings", "booking", "pricing"] as const) {
      expect(links).toContain(getRoutePath(routeKey, language));
    }
    for (const routeKey of IT_SERVICE_CANONICAL_KEYS) {
      expect(links).not.toContain(getRoutePath(routeKey, language));
    }
  });

  it.each(["sl", "en"] as const)("renders all three approved customer references with their source sites (%s)", (language) => {
    const document = renderMarketingComponent(Testimonials, language);
    const cards = Array.from(document.querySelectorAll("article"));
    const approvedReferences = [
      { name: "Nina Piberčnik", website: "https://avisensa.com/" },
      { name: "Urška Grmek", website: "https://www.depilacijeug.si/" },
      { name: "Špela Kovačič", website: "https://www.skreativa.si/" },
    ];

    expect(cards).toHaveLength(approvedReferences.length);
    for (const reference of approvedReferences) {
      const card = cards.find((item) => item.textContent?.includes(reference.name));
      expect(card).toBeDefined();
      expect(card?.querySelector(`a[href="${reference.website}"]`)).not.toBeNull();
      expect(card?.querySelector("blockquote")?.textContent?.trim()).toBeTruthy();
    }
  });
});
