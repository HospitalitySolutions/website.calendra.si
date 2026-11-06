import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import IndustryDetailPage from "@/pages/IndustryDetailPage";
import { SiteLanguageProvider, type SiteLanguage } from "@/lib/site-language";
import {
  BUSINESS_TYPE_ROUTE_KEYS,
  getIndustryContent,
  getIndustryHeroTitle,
  INDUSTRY_ROUTE_KEYS,
  type IndustryRouteKey,
} from "@/lib/industry-pages";
import { getRoutePath } from "@/lib/localized-routes";
import { buildLlmsTxt } from "@/lib/llms-txt";

// The hero is under test here; the navigation has its own test file.
vi.mock("@/components/landing/Navbar", () => ({ default: () => null }));
vi.mock("@/components/landing/Footer", () => ({ default: () => null }));

const renderMarkup = (element: JSX.Element, route: string, language: SiteLanguage) => {
  const html = renderToStaticMarkup(
    <MemoryRouter initialEntries={[route]}>
      <SiteLanguageProvider initialLanguage={language}>{element}</SiteLanguageProvider>
    </MemoryRouter>,
  );
  return new DOMParser().parseFromString(html, "text/html");
};

const renderIndustry = (routeKey: IndustryRouteKey, language: SiteLanguage) =>
  renderMarkup(<IndustryDetailPage />, getRoutePath(routeKey, language), language);

const approvedHeroes = {
  beautySalons: { sl: "Program za kozmetične in lepotne salone", en: "Booking software for beauty and cosmetic salons" },
  hairSalons: { sl: "Program za frizerske salone in brivnice", en: "Booking software for hair salons and barbershops" },
  tattooPiercing: { sl: "Program za tattoo in piercing studie", en: "Booking software for tattoo and piercing studios" },
} as const;

describe("shared industry hero", () => {
  it.each((Object.keys(approvedHeroes) as Array<keyof typeof approvedHeroes>).flatMap((key) => (["sl", "en"] as const).map((language) => [key, language] as const)))(
    "renders the approved %s hero in %s",
    (routeKey, language) => {
      const document = renderIndustry(routeKey, language);
      const hero = document.querySelector("#industry-hero") as HTMLElement;
      expect(hero).not.toBeNull();
      expect(document.querySelectorAll("h1")).toHaveLength(1);
      expect(hero.querySelector("h1")?.textContent).toBe(approvedHeroes[routeKey][language]);
      expect(hero.querySelector("h1 .text-primary")?.textContent?.trim()).toBe(getIndustryHeroTitle(getIndustryContent(routeKey, language), language).at(-1));
      expect(hero.querySelector(".marketing-eyebrow")?.textContent).toMatch(language === "sl" ? /^Profesionalne rešitve za / : /^Professional tools for /);
      expect(hero.querySelectorAll(".group-bookings-points li")).toHaveLength(4);

      const actions = Array.from(hero.querySelectorAll(".group-bookings-actions a"));
      expect(actions.map((link) => link.textContent)).toEqual(
        language === "sl" ? ["Preizkusite brezplačno", "Rezervirajte predstavitev"] : ["Try it free", "Book a demo"],
      );
      expect(actions[1].getAttribute("href")).toBe(getRoutePath("demo", language));
      expect(hero.textContent).toContain(language === "sl" ? "14 dni brezplačno" : "14 days free");
      expect(hero.textContent).toContain(language === "sl" ? "Brez kreditne kartice" : "No credit card required");
      expect(hero.textContent).not.toMatch(/Oglejte si funkcionalnosti|Explore features/);

      const images = Array.from(hero.querySelectorAll(".industry-hero-product figure img"));
      expect(images).toHaveLength(3);
      for (const image of images) {
        expect(image.getAttribute("src")).toMatch(/^\/screenshots\//);
        expect(image.getAttribute("alt")?.length).toBeGreaterThan(10);
        expect(image.getAttribute("width")).toMatch(/^\d+$/);
        expect(image.getAttribute("height")).toMatch(/^\d+$/);
      }
      expect(hero.querySelector(".industry-hero-calendar figcaption")?.textContent).toBe(language === "sl" ? "Vaš urnik" : "Your schedule");
    },
  );

  it("shows the booking summary card on the tattoo page and group booking on class-based pages", () => {
    const tattoo = renderIndustry("tattooPiercing", "sl");
    expect(tattoo.querySelector(".industry-hero-booking img")?.getAttribute("src")).toContain("booking-payment-review");
    const yoga = renderIndustry("yogaPilates", "sl");
    expect(yoga.querySelector(".industry-hero-booking img")?.getAttribute("src")).toContain("booking-group-time-selection");
    expect(yoga.querySelector(".industry-hero-client img")?.getAttribute("src")).toContain("membership-visit-pass");
  });

  it("uses the shared hero on every non-psychology industry page", () => {
    const keys = [...INDUSTRY_ROUTE_KEYS, ...BUSINESS_TYPE_ROUTE_KEYS].filter((key) => key !== "psychologyCounselling");
    // Alternate languages to cover both without rendering every page twice.
    for (const [index, routeKey] of keys.entries()) {
      const language: SiteLanguage = index % 2 === 0 ? "sl" : "en";
      const document = renderIndustry(routeKey, language);
      const heroId = routeKey === "fitnessPersonalTraining" ? "#fitness-hero" : "#industry-hero";
      const hero = document.querySelector(heroId);
      expect(hero, routeKey).not.toBeNull();
      expect(hero?.querySelector("h1 .text-primary")?.textContent?.trim().length, routeKey).toBeGreaterThan(3);
      expect(hero?.querySelectorAll(".industry-hero-product figure"), routeKey).toHaveLength(3);
    }
  });

  it("highlights the audience after the last 'za' / 'for' when no explicit hero title exists", () => {
    expect(getIndustryHeroTitle(getIndustryContent("massage", "sl"), "sl")).toEqual(["Program za naročanje\u00a0za", "masažne salone in terapevte"]);
    expect(getIndustryHeroTitle(getIndustryContent("massage", "en"), "en")).toEqual(["Booking software\u00a0for", "massage salons and therapists"]);
    for (const routeKey of [...INDUSTRY_ROUTE_KEYS, ...BUSINESS_TYPE_ROUTE_KEYS]) {
      for (const language of ["sl", "en"] as const) {
        const page = getIndustryContent(routeKey, language);
        const lines = getIndustryHeroTitle(page, language);
        if (!page.heroTitle) expect(lines.join(" ").replace(/\u00a0/g, " ")).toBe(page.title);
      }
    }
  });
});

describe("AI-search summary", () => {
  it("names barbershops and tattoo studios in the llms.txt introduction", () => {
    const llms = buildLlmsTxt();
    expect(llms).toContain("brivnicam, tattoo in piercing studiem");
    expect(llms).toContain("barbershops, tattoo and piercing studios");
    expect(llms).toContain("https://calendra.si/za-tetoviranje-in-piercing");
    expect(llms).toContain("https://calendra.si/en/for-tattoo-and-piercing-studios");
  });

  it.each(["sl", "en"] as const)("answers the tattoo software question directly in the %s FAQ", (language) => {
    const [first] = getIndustryContent("tattooPiercing", language).faq;
    expect(first.question).toMatch(language === "sl" ? /tattoo ali piercing studio\?$/ : /tattoo or piercing studio\?$/);
    expect(first.answer).toMatch(/^Calendra /);
  });
});
