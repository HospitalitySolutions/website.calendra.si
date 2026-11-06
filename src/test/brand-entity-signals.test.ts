import { afterEach, describe, expect, it, vi } from "vitest";

type Node = Record<string, unknown> & { "@type": string };

/** Import fresh modules so build variables are read the way Vite inlines them. */
const loadGraph = async (pathname: string, env: Record<string, string> = {}) => {
  vi.resetModules();
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  const seo = await import("@/lib/seo");
  const result = seo.getSeoForPathname(pathname);
  const graph = (result.structuredData?.["@graph"] ?? []) as Node[];
  const find = (type: string) => graph.find((node) => node["@type"] === type);
  return { seo, result, organization: find("Organization"), website: find("WebSite"), graph };
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("brand entity signals", () => {
  it("adds review and directory listings from VITE_ENTITY_PROFILE_URLS to Organization.sameAs", async () => {
    const { organization } = await loadGraph("/", {
      VITE_ENTITY_PROFILE_URLS: "https://www.g2.com/products/calendra/reviews, https://www.capterra.com/p/000000/Calendra/\nnot-a-url",
    });
    const sameAs = organization?.sameAs as string[];
    expect(sameAs).toContain("https://www.g2.com/products/calendra/reviews");
    expect(sameAs).toContain("https://www.capterra.com/p/000000/Calendra/");
    expect(sameAs).not.toContain("not-a-url");
  });

  it.each(["sl", "en"] as const)("uses one brand phrase in the Organization description and homepage title (%s)", async (language) => {
    const { seo, result, organization, website } = await loadGraph(language === "sl" ? "/" : "/en");
    const phrase = seo.BRAND_PHRASE[language];

    expect(result.title.startsWith(phrase)).toBe(true);
    expect(result.title.length).toBeLessThanOrEqual(60);
    expect(String(organization?.description).startsWith(phrase)).toBe(true);
    // Google reads the site name from WebSite.name, which must stay the bare brand.
    expect(website?.name).toBe("Calendra");
    expect(organization?.name).toBe("Calendra");
    expect(organization?.alternateName).toEqual(["Calendra.si"]);
    expect(website?.alternateName).toEqual(["Calendra.si"]);
  });

  it("keeps Calendra Book as the former name of the Calendra Connect app only", async () => {
    const { organization, graph } = await loadGraph("/calendra-connect");
    const app = graph.find((node) => node["@type"] === "MobileApplication");
    expect(app?.name).toBe("Calendra Connect");
    expect(app?.alternateName).toBe("Calendra Book");
    expect(organization?.alternateName).not.toContain("Calendra Book");
  });
});
