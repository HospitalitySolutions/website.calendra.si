import { describe, expect, it } from "vitest";
import { calculatePricingQuote, priceWithVat, PRICING_TAX } from "@/lib/pricing-tax";
import { getPricingTaxNote } from "@/lib/pricing-copy";
import { LEGAL } from "@/lib/legal";
import { COMPANY_VAT_ID } from "@/lib/external-profiles";
import { APP_PRICING_SNAPSHOT, normalizePublicPricingCatalog } from "@/lib/public-pricing";

describe("November VAT transition", () => {
  it("uses the confirmed company identity and the exact approved Slovenian copy", () => {
    expect(LEGAL.vatRegistered).toBe(true);
    expect(COMPANY_VAT_ID).toBe("SI10550631");
    expect(PRICING_TAX.effectiveFrom).toBe("2026-11-01");
    expect(getPricingTaxNote("sl")).toBe("Vse navedene cene na spletnem mestu in v aplikaciji so brez DDV. Skladno z Zakonom o davku na dodano vrednost (ZDDV-1) se tako na vse cene obračuna DDV v višini 22,00 %.");
    expect(getPricingTaxNote("en")).toContain("exclude VAT");
  });

  it.each([[15.9, 3.5, 19.4], [28.9, 6.36, 35.26], [47.9, 10.54, 58.44], [0, 0, 0]])("adds VAT to net %s", (net, vat, gross) => {
    expect(priceWithVat(net)).toEqual({ net, vat, gross });
  });

  it.each([true, false])("does not let legacy API vatIncluded=%s revert the confirmed net basis or change amounts", vatIncluded => {
    const source = { ...APP_PRICING_SNAPSHOT, vatIncluded };
    const result = normalizePublicPricingCatalog(source);
    expect(result.vatIncluded).toBe(false);
    expect(result.plans).toEqual(source.plans);
    expect(result.additionalUserRules).toEqual(source.additionalUserRules);
    expect(result.smsPerMessageGross).toEqual(source.smsPerMessageGross);
  });

  const selection = { monthlyPlan: 28.9, annualPlan: 289, annualBilledMonths: 10, monthlyUsers: 5.9, monthlyAddOns: 9.9, smsCount: 100, smsUnit: .05 };
  it("includes users, add-ons and monthly SMS before calculating tax", () => {
    expect(calculatePricingQuote({ ...selection, annual: false }).total).toEqual({ net: 49.7, vat: 10.93, gross: 60.63 });
  });
  it("uses the exact annual price and recurring discount; keeps monthly SMS outside the annual invoice", () => {
    const quote = calculatePricingQuote({ ...selection, annual: true });
    expect(quote).toMatchObject({ plan: 289, users: 59, addOns: 99, sms: { net: 5, vat: 1.1, gross: 6.1 }, total: { net: 447, vat: 98.34, gross: 545.34 }, monthlyEquivalent: 45.45 });
    expect(calculatePricingQuote({ ...selection, annual: true, annualPlan: 280.25, monthlyUsers: 0, monthlyAddOns: 0 }).total).toEqual({ net: 280.25, vat: 61.66, gross: 341.91 });
  });
  it("charges additional rooms monthly, and by the fractional annual months on annual billing", () => {
    const rooms = { monthlyPlan: 26.9, annualPlan: 274.38, annualBilledMonths: 10.2, monthlyUsers: 0, monthlySpaces: 5.8, monthlyAddOns: 0, smsCount: 0, smsUnit: .05 };
    expect(calculatePricingQuote({ ...rooms, annual: false })).toMatchObject({ spaces: 5.8, total: { net: 32.7, vat: 7.19, gross: 39.89 } });
    expect(calculatePricingQuote({ ...rooms, annual: true })).toMatchObject({ spaces: 59.16, total: { net: 333.54, vat: 73.38, gross: 406.92 } });
  });
  it("retains SMS unit precision until the line total and handles cent rounding", () => {
    const quote = calculatePricingQuote({ ...selection, annual: false, monthlyPlan: 0, monthlyUsers: 0, monthlyAddOns: 0, smsCount: 100, smsUnit: .0485 });
    expect(quote.total).toEqual({ net: 4.85, vat: 1.07, gross: 5.92 });
    expect(priceWithVat(1.005)).toEqual({ net: 1.01, vat: .22, gross: 1.23 });
  });
});
