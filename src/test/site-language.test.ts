import { createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteLanguageProvider, useSiteLanguage } from "@/lib/site-language";

const realWindow = window;

const LanguageControls = () => {
  const { language, setLanguage } = useSiteLanguage();
  return createElement("div", null,
    createElement("output", { "data-testid": "language" }, language),
    createElement("button", { onClick: () => setLanguage("en") }, "English"),
    createElement("button", { onClick: () => setLanguage("sl") }, "Slovenščina"),
  );
};

const visit = (pathname: string) => {
  const location = {
    pathname,
    search: "?utm_source=chatgpt.com",
    hash: "#plans",
    assign: vi.fn(),
    replace: vi.fn(),
  };
  vi.stubGlobal("window", new Proxy(realWindow, {
    get(target, key) {
      return key === "location" ? location : Reflect.get(target, key, target);
    },
  }));
  render(createElement(SiteLanguageProvider, null, createElement(LanguageControls)));
  return location;
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  realWindow.localStorage.clear();
});

describe("localized page navigation", () => {
  it.each([
    ["/", "sl"],
    ["/en", "en"],
    ["/cenik", "sl"],
    ["/en/pricing", "en"],
  ])("keeps %s in its requested language after mounting", (pathname, language) => {
    realWindow.localStorage.setItem("calendra-site-language", language === "sl" ? "en" : "sl");
    const location = visit(pathname);
    expect(screen.getByTestId("language").textContent).toBe(language);
    expect(document.documentElement.lang).toBe(language);
    expect(location.replace).not.toHaveBeenCalled();
    expect(location.assign).not.toHaveBeenCalled();
  });

  it("preserves campaign parameters and the fragment when switching to English", () => {
    const location = visit("/cenik");
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(location.assign).toHaveBeenCalledExactlyOnceWith("/en/pricing?utm_source=chatgpt.com#plans");
  });

  it("returns to the corresponding Slovenian page on an explicit choice", () => {
    const location = visit("/en/pricing");
    fireEvent.click(screen.getByRole("button", { name: "Slovenščina" }));
    expect(location.assign).toHaveBeenCalledExactlyOnceWith("/cenik?utm_source=chatgpt.com#plans");
  });
});
