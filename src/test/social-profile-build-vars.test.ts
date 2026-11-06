import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The social profile constants are read once at module load, the same way Vite
 * inlines them at build time, so each case stubs the build variables first and
 * then imports a fresh copy of the modules.
 */
const loadProfiles = async (env: Record<string, string>) => {
  vi.resetModules();
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  const profiles = await import("@/lib/external-profiles");
  const { getSeoForPathname } = await import("@/lib/seo");
  const organization = getSeoForPathname("/").structuredData?.["@graph"].find(
    (node: { "@type": string }) => node["@type"] === "Organization",
  ) as { sameAs: string[] };
  return { profiles, sameAs: organization.sameAs };
};

const SOCIAL_VARIABLES = ["VITE_FACEBOOK_URL", "VITE_INSTAGRAM_URL", "VITE_LINKEDIN_URL", "VITE_TIKTOK_URL"];

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("social profile build variables", () => {
  it("uses Facebook, Instagram, LinkedIn and TikTok URLs supplied at build time", async () => {
    const { profiles, sameAs } = await loadProfiles({
      VITE_FACEBOOK_URL: "https://www.facebook.com/example-page",
      VITE_INSTAGRAM_URL: " https://www.instagram.com/example/ ",
      VITE_LINKEDIN_URL: "https://www.linkedin.com/company/example/",
      VITE_TIKTOK_URL: "https://www.tiktok.com/@example",
    });

    expect(profiles.FACEBOOK_PROFILE_URL).toBe("https://www.facebook.com/example-page");
    expect(profiles.INSTAGRAM_PROFILE_URL).toBe("https://www.instagram.com/example/");
    expect(profiles.LINKEDIN_PROFILE_URL).toBe("https://www.linkedin.com/company/example/");
    expect(profiles.TIKTOK_PROFILE_URL).toBe("https://www.tiktok.com/@example");
    expect(sameAs).toEqual(expect.arrayContaining([
      "https://www.facebook.com/example-page",
      "https://www.instagram.com/example/",
      "https://www.linkedin.com/company/example/",
      "https://www.tiktok.com/@example",
    ]));
  });

  it("keeps the committed official profiles when the variables are empty or invalid", async () => {
    const { profiles: defaults } = await loadProfiles({
      VITE_FACEBOOK_URL: "",
      VITE_INSTAGRAM_URL: "",
      VITE_LINKEDIN_URL: "",
      VITE_TIKTOK_URL: "",
    });
    const { profiles, sameAs } = await loadProfiles({
      VITE_FACEBOOK_URL: "not a url",
      VITE_INSTAGRAM_URL: "javascript:alert(1)",
      VITE_LINKEDIN_URL: "   ",
      VITE_TIKTOK_URL: "tiktok.com/@calendra",
    });

    expect(profiles.FACEBOOK_PROFILE_URL).toBe(defaults.FACEBOOK_PROFILE_URL);
    expect(profiles.INSTAGRAM_PROFILE_URL).toBe(defaults.INSTAGRAM_PROFILE_URL);
    expect(profiles.LINKEDIN_PROFILE_URL).toBe(defaults.LINKEDIN_PROFILE_URL);
    expect(profiles.TIKTOK_PROFILE_URL).toBe(defaults.TIKTOK_PROFILE_URL);
    expect([
      profiles.FACEBOOK_PROFILE_URL,
      profiles.INSTAGRAM_PROFILE_URL,
      profiles.LINKEDIN_PROFILE_URL,
      profiles.TIKTOK_PROFILE_URL,
    ]).toEqual([
      "https://www.facebook.com/calendraapp",
      "https://www.instagram.com/calendra.si",
      "https://www.linkedin.com/company/calendrabook",
      "https://www.tiktok.com/@calendra.si",
    ]);
    for (const url of [profiles.FACEBOOK_PROFILE_URL, profiles.INSTAGRAM_PROFILE_URL, profiles.LINKEDIN_PROFILE_URL, profiles.TIKTOK_PROFILE_URL]) {
      expect(sameAs).toContain(url);
    }
    expect(sameAs.some((url) => !/^https?:\/\//.test(url))).toBe(false);
  });

  it("passes every social variable through the Docker build", () => {
    const dockerfile = readFileSync("Dockerfile", "utf8");
    const compose = readFileSync("docker-compose.yml", "utf8");
    const envExample = readFileSync(".env.example", "utf8");
    for (const name of SOCIAL_VARIABLES) {
      expect(dockerfile).toMatch(new RegExp(`^ARG ${name}=\\r?$`, "m"));
      expect(dockerfile).toContain(`ENV ${name}=$${name}`);
      expect(compose).toContain(`${name}: \${${name}:-}`);
      expect(envExample).toMatch(new RegExp(`^${name}=\\r?$`, "m"));
    }
  });
});
