import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Pricing from "@/components/landing/Pricing";
import { calculatePricingQuote } from "@/lib/pricing-tax";
import { buildPackageSignupRoute } from "@/lib/routes";
import {
  FALLBACK_PUBLIC_PRICING,
  normalizePublicPricingCatalog,
  setPrerenderedPricingCatalog,
  type PublicPricingCatalog,
} from "@/lib/public-pricing";
import { SiteLanguageProvider } from "@/lib/site-language";

const customPrices: Record<string, number> = {
  group: 2.9, resources: 2.9, payments: 3.9, reminders: 2.9, ai: 3.9, integrations: 2.9, reporting: 3.9, multilocation: 5.9,
};
// Shape of the app's public catalog once an admin switches "Po meri" on.
const customCatalog = normalizePublicPricingCatalog({
  ...FALLBACK_PUBLIC_PRICING,
  features: FALLBACK_PUBLIC_PRICING.features.map((feature) => ({
    ...feature, customMonthlyGross: feature.minimumPlan === "basic" ? null : customPrices[feature.key] ?? null,
  })),
  customPackage: { enabled: true, packageCode: "CUSTOM", basePlan: "basic", name: "Custom", nameSl: "Po meri" },
  includedSpacesPerLocation: 1, additionalSpaceMonthlyGross: 2.9,
});
const text = (element: Element | null | undefined) => element?.textContent?.replace(/\s+/g, " ").trim() ?? "";

const staticPage = (catalog: PublicPricingCatalog) => {
  setPrerenderedPricingCatalog(catalog);
  const html = renderToStaticMarkup(
    <MemoryRouter><SiteLanguageProvider initialLanguage="sl"><Pricing standalone /></SiteLanguageProvider></MemoryRouter>,
  );
  return new DOMParser().parseFromString(html, "text/html");
};

beforeEach(() => {
  // The calculator's sliders need ResizeObserver; the live catalog refresh stays offline.
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
  setPrerenderedPricingCatalog(FALLBACK_PUBLIC_PRICING);
});

describe("Po meri price data", () => {
  it("reads the custom package and per-feature prices, and survives re-normalization", () => {
    expect(customCatalog.customPackage).toEqual({ enabled: true, name: "Custom", nameSl: "Po meri" });
    expect(customCatalog.features.find((feature) => feature.key === "payments")?.customMonthlyGross).toBe(3.9);
    expect(customCatalog.features.find((feature) => feature.key === "appointments")?.customMonthlyGross).toBeNull();
    expect(normalizePublicPricingCatalog(customCatalog)).toEqual(customCatalog);
  });
  it("treats a catalog without the new fields as having no custom package", () => {
    const catalog = normalizePublicPricingCatalog(FALLBACK_PUBLIC_PRICING);
    expect(catalog.customPackage).toBeNull();
    expect(catalog.features.every((feature) => feature.customMonthlyGross === null)).toBe(true);
  });
  it("rejects a corrupt feature price instead of inventing one", () => {
    const features = customCatalog.features.map((feature) => feature.key === "payments" ? { ...feature, customMonthlyGross: "abc" } : feature);
    expect(() => normalizePublicPricingCatalog({ ...customCatalog, features })).toThrow();
  });
  it("charges picked features monthly, and for the billed months on annual billing", () => {
    const base = { monthlyPlan: 17.9, annualPlan: 182.58, annualBilledMonths: 10.2, monthlyUsers: 0, monthlyFeatures: 6.8, monthlyAddOns: 0, smsCount: 0, smsUnit: .05 };
    expect(calculatePricingQuote({ ...base, annual: false })).toMatchObject({ features: 6.8, total: { net: 24.7, vat: 5.43, gross: 30.13 } });
    expect(calculatePricingQuote({ ...base, annual: true })).toMatchObject({ features: 69.36, total: { net: 251.94 } });
  });
  it("sends the package and each picked feature in the signup link", () => {
    const summary = { totalUsers: 1, additionalSms: 0, fiscalCashRegister: false, websiteCreation: false, businessPremises: false, monthlyTotal: 0, oneTimeTotal: 0, firstInvoiceEstimate: 0, selectedFeatureKeys: ["payments", "integrations", "payments"] };
    const url = new URL(buildPackageSignupRoute("custom", summary));
    expect(url.searchParams.get("package")).toBe("CUSTOM");
    expect(url.searchParams.getAll("feature")).toEqual(["payments", "integrations"]);
  });
});

describe("Po meri on the price list", () => {
  it("adds a fourth card from the Basic price and a comparison column with feature prices", () => {
    const page = staticPage(customCatalog);
    const card = page.querySelector('[data-plan="custom"]');
    expect(page.querySelectorAll(".pricing-plan-grid article")).toHaveLength(4);
    expect(text(card?.querySelector("h2"))).toBe("Po meri");
    expect(text(card?.querySelector(".pricing-plan-from"))).toBe("od");
    expect(text(card?.querySelector(".pricing-plan-price strong"))).toBe("17,90 €");
    expect(text(card)).toContain("+3,90 €");
    expect(text(card)).toContain("… in še 3 funkcije po izbiri");
    const headers = Array.from(page.querySelectorAll(".pricing-comparison thead th")).map(text);
    expect(headers.at(-1)).toBe("Po meri");
    const paymentsRow = Array.from(page.querySelectorAll(".pricing-comparison tbody tr")).find((row) => text(row.querySelector("th")) === "Spletna plačila");
    expect(text(paymentsRow?.querySelector("td:last-child"))).toBe("+3,90 €");
  });
  it("stays hidden while the app has not switched it on", () => {
    const page = staticPage(normalizePublicPricingCatalog({ ...customCatalog, customPackage: { ...customCatalog.customPackage, enabled: false } }));
    expect(page.querySelector('[data-plan="custom"]')).toBeNull();
    expect(page.querySelectorAll(".pricing-comparison thead th")).toHaveLength(4);
  });
});

describe("Po meri in the calculator", () => {
  const renderCustom = () => {
    setPrerenderedPricingCatalog(customCatalog);
    window.history.replaceState(null, "", "/cenik?plan=custom");
    return render(<MemoryRouter><SiteLanguageProvider initialLanguage="sl"><Pricing standalone /></SiteLanguageProvider></MemoryRouter>);
  };
  const pick = (container: HTMLElement, name: string) => {
    const row = Array.from(container.querySelectorAll(".pricing-feature-group .pricing-addon")).find((item) => text(item.querySelector("strong")) === name);
    fireEvent.click(row!.querySelector('button[role="checkbox"]')!);
  };

  it("prices picked features on top of the Basic plan and shows rooms only with Prostori", async () => {
    const { container } = renderCustom();
    await waitFor(() => expect(text(container.querySelector(".pricing-summary-card h3"))).toBe("Po meri"));
    const legends = () => Array.from(container.querySelectorAll(".pricing-control legend")).map(text);
    expect(legends().slice(1, 3)).toEqual(["2. Izberite funkcije", "3. Uporabniki"]);
    expect(legends()).not.toContain("4. Prostori");

    pick(container, "Spletna plačila");
    pick(container, "Integracije");
    await waitFor(() => expect(text(container.querySelector("[data-pricing-features]"))).toBe("6,80 €"));
    expect(text(container.querySelector("[data-pricing-total]"))).toBe("30,13 €");
    expect(legends()).toContain("4. Prostori");
    expect(container.querySelector(".pricing-upgrade-hint")).toBeNull();

    const href = new URL(container.querySelector<HTMLAnchorElement>("[data-pricing-signup]")!.href);
    expect(href.searchParams.get("package")).toBe("CUSTOM");
    expect(href.searchParams.getAll("feature").sort()).toEqual(["integrations", "payments"]);
  });

  it("points to a fixed plan that covers the picked features for less", async () => {
    const { container } = renderCustom();
    await waitFor(() => expect(container.querySelector(".pricing-feature-group")).not.toBeNull());
    for (const name of ["Skupinske rezervacije", "Spletna plačila", "Integracije"]) pick(container, name);
    // 17,90 + 2,90 + 3,90 + 2,90 = 27,60 € is still below Profesionalno (28,90 €).
    await waitFor(() => expect(text(container.querySelector("[data-pricing-features]"))).toBe("9,70 €"));
    expect(container.querySelector(".pricing-upgrade-hint")).toBeNull();
    pick(container, "AI pomočnik za rezervacije");
    await waitFor(() => expect(text(container.querySelector(".pricing-upgrade-hint strong"))).toBe("Paket Profesionalno je ugodnejši"));
    expect(text(container.querySelector(".pricing-upgrade-hint p"))).toBe("Za 28,90 € / mesec vključuje vse izbrane funkcije in še 2 več.");
    fireEvent.click(container.querySelector(".pricing-upgrade-hint button")!);
    await waitFor(() => expect(text(container.querySelector(".pricing-summary-card h3"))).toBe("Profesionalno"));
  });
});
