import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Footer from "@/components/landing/Footer";
import { WORDMARK, LOGO_SQUARE } from "@/lib/brand-assets";
import { SiteLanguageProvider, type SiteLanguage } from "@/lib/site-language";

describe("website branding", () => {
  it.each(["sl", "en"] as const)("renders the shared footer and wordmark in %s", (language: SiteLanguage) => {
    const html = renderToStaticMarkup(
      <SiteLanguageProvider initialLanguage={language}>
        <Footer />
      </SiteLanguageProvider>,
    );
    expect(html).toContain('class="site-footer-editorial border-t py-14 md:py-20"');
    expect(html).toContain(`src="${WORDMARK.src}"`);
    expect(html).toContain('class="site-brand-wordmark h-10 w-auto"');
    expect(html).not.toContain("site-footer-light");
  });

  it("uses the shared transparent icon for both browser-tab links", () => {
    const html = readFileSync("index.html", "utf8");
    const tags = Array.from(html.matchAll(/<link rel="(?:icon|shortcut icon)"[^>]*>/g), ([tag]) => tag);
    expect(tags).toHaveLength(2);
    expect(tags.every((tag) => tag.includes(`href="${LOGO_SQUARE.src}"`))).toBe(true);
    expect(html).not.toContain('href="/favicon.ico"');
  });

  it("keeps footer links readable with blue hover and keyboard focus", () => {
    const css = readFileSync("src/components/landing/footer.css", "utf8");
    expect(css).toContain("site-footer-editorial nav a:is(:hover, :focus-visible)");
    expect(css).toContain("color: hsl(var(--primary));");
    expect(css).toContain("text-decoration: underline");
  });
});
