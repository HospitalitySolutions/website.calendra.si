import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Footer from "@/components/landing/Footer";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms-txt";
import { canonicalRoutes, getRouteKeyFromPathname } from "@/lib/localized-routes";
import { RETIRED_IT_SERVICE_PATHS } from "@/lib/retired-routes";
import { AUTHOR, getSeoForPathname, personSchema } from "@/lib/seo";
import { SiteLanguageProvider, type SiteLanguage } from "@/lib/site-language";

const caddyfile = readFileSync("Caddyfile", "utf8").replace(/\r\n/g, "\n");

describe("retired IT services pages", () => {
  it("no longer defines a canonical route for any retired URL", () => {
    const canonicalPaths = Object.values(canonicalRoutes).flatMap((paths) => [paths.sl, paths.en]);
    for (const retiredPath of RETIRED_IT_SERVICE_PATHS) {
      expect(canonicalPaths).not.toContain(retiredPath);
      expect(getRouteKeyFromPathname(retiredPath)).toBeUndefined();
    }
  });

  it("answers every retired URL with 410 Gone inside the single Caddy route block", () => {
    const routeBlock = caddyfile.slice(caddyfile.indexOf("\n  route {"));
    const matcher = /@retiredItServices \{\n([\s\S]*?)\n {4}\}/.exec(routeBlock);
    expect(matcher).not.toBeNull();
    const matchedPaths = matcher![1].split(/\s+/).filter((token) => token.startsWith("/"));
    for (const retiredPath of RETIRED_IT_SERVICE_PATHS) {
      expect(matchedPaths).toContain(retiredPath);
      expect(matchedPaths).toContain(`${retiredPath}/`);
    }
    expect(matchedPaths).toHaveLength(RETIRED_IT_SERVICE_PATHS.length * 2);

    const respond = routeBlock.indexOf("respond @retiredItServices 410");
    expect(respond).toBeGreaterThan(0);
    // The 410 must run before any handler that could serve a stale prerendered file.
    expect(respond).toBeLessThan(routeBlock.indexOf("handle /stats/*"));
    expect(respond).toBeLessThan(routeBlock.indexOf("try_files {path}/index.html {path}"));
  });

  it("keeps the Caddy HTTP test list in sync with the retired paths", () => {
    const script = readFileSync("scripts/test-caddy-seo.mjs", "utf8");
    const list = /const retiredItServicePaths = \[([\s\S]*?)\];/.exec(script);
    expect(list).not.toBeNull();
    expect(Array.from(list![1].matchAll(/"([^"]+)"/g), ([, value]) => value)).toEqual([...RETIRED_IT_SERVICE_PATHS]);
  });

  it.each(["sl", "en"] as const)("removes IT services from the footer (%s)", (language: SiteLanguage) => {
    const html = renderToStaticMarkup(
      <SiteLanguageProvider initialLanguage={language}>
        <Footer />
      </SiteLanguageProvider>,
    );
    for (const retiredPath of RETIRED_IT_SERVICE_PATHS) {
      expect(html).not.toContain(`href="${retiredPath}"`);
    }
    expect(html).not.toMatch(/IT storitve|IT services/);
  });

  it("removes IT services from llms.txt and llms-full.txt", () => {
    const llms = `${buildLlmsTxt()}\n${buildLlmsFullTxt()}`;
    for (const retiredPath of RETIRED_IT_SERVICE_PATHS) {
      expect(llms).not.toContain(`calendra.si${retiredPath})`);
      expect(llms).not.toContain(`calendra.si${retiredPath}\n`);
    }
    expect(llms).not.toMatch(/IT storitve|IT services/);
  });

  it("drops IT services from the author and contact descriptions", () => {
    for (const language of ["sl", "en"] as const) {
      expect(AUTHOR.bio[language]).not.toMatch(/\bIT\b/);
      expect(personSchema(language).knowsAbout.join(" ")).not.toMatch(/\bIT\b/);
      const contactSeo = getSeoForPathname(canonicalRoutes.contact[language]);
      expect(`${contactSeo.title} ${contactSeo.description}`).not.toMatch(/\bIT\b/);
    }
  });
});
