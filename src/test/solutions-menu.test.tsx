import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "@/components/landing/Navbar";
import { SiteLanguageProvider } from "@/lib/site-language";
import { getRoutePath } from "@/lib/localized-routes";

describe("solutions menu", () => {
  it.each(["sl", "en"] as const)("lists tattoo studios instead of a duplicate barbershop link in %s", (language) => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={[getRoutePath("home", language)]}>
        <SiteLanguageProvider initialLanguage={language}><Navbar /></SiteLanguageProvider>
      </MemoryRouter>,
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/Brivnice|Barbershops/);
    const label = language === "sl" ? "Tattoo in piercing studii" : "Tattoo & piercing studios";
    const tattooLinks = Array.from(document.querySelectorAll("a")).filter((link) => link.textContent?.includes(label));
    expect(tattooLinks.length).toBeGreaterThan(0);
    for (const link of tattooLinks) expect(link.getAttribute("href")).toBe(getRoutePath("tattooPiercing", language));
  });
});

