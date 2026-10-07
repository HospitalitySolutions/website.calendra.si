import { describe, expect, it } from "vitest";
import { inferPreferredSiteLanguage } from "@/lib/site-language";

describe("site language detection", () => {
  it("prefers Slovenian for visitors using the Slovenia time zone", () => {
    expect(inferPreferredSiteLanguage(["en-GB"], "Europe/Ljubljana")).toBe("sl");
  });

  it("prefers Slovenian when the browser's primary language is Slovenian", () => {
    expect(inferPreferredSiteLanguage(["sl-SI", "en-GB"], "Europe/Vienna")).toBe("sl");
  });

  it("defaults to English for visitors outside Slovenia with a non-Slovenian browser", () => {
    expect(inferPreferredSiteLanguage(["de-DE", "en-GB"], "Europe/Berlin")).toBe("en");
  });

  it("does not use a secondary Slovenian browser language to override an English primary language", () => {
    expect(inferPreferredSiteLanguage(["en-GB", "sl-SI"], "Europe/Vienna")).toBe("en");
  });
});
