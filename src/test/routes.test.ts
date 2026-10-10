import { describe, expect, it } from "vitest";
import { buildPackageSignupRoute, REGISTER_ROUTE, TRIAL_SIGNUP_ROUTE, type PricingSignupSummary } from "@/lib/routes";
import { APP_BASE_URL } from "@/lib/site";

const summary: PricingSignupSummary = {
  totalUsers: 7,
  additionalSms: 350,
  fiscalCashRegister: false,
  websiteCreation: false,
  businessPremises: false,
  selectedAddOnKeys: ["voice", "custom-catalog-addon"],
  selectedAddOnCodes: ["VOICE_BILLING_CODE", "CUSTOM_BILLING_CODE"],
  monthlyTotal: 87.3,
  oneTimeTotal: 20,
  firstInvoiceEstimate: 107.3,
};

describe("business registration handoff", () => {
  it("opens the canonical app entry without the query-dropping signup redirect", () => {
    expect(REGISTER_ROUTE).toBe(`${APP_BASE_URL}/register`);
    const trial = new URL(TRIAL_SIGNUP_ROUTE);
    expect(trial.pathname).toBe(new URL(REGISTER_ROUTE).pathname);
    expect(trial.searchParams.get("flow")).toBe("trial");
  });

  it.each(["basic", "professional", "premium"])("retains the selected %s package", (packageType) => {
    const target = new URL(buildPackageSignupRoute(packageType));
    expect(target.pathname).toBe(new URL(REGISTER_ROUTE).pathname);
    expect(target.searchParams.get("flow")).toBe("register");
    expect(target.searchParams.get("package")).toBe(packageType.toUpperCase());
    expect(target.searchParams.has("summary")).toBe(false);
  });

  it("passes configured selections in the app's accepted fields and retains annual billing", () => {
    // Pricing.tsx appends its current billing choice to this shared route.
    const target = new URL(`${buildPackageSignupRoute("professional", summary)}&billing=annual`);
    expect(target.searchParams.get("package")).toBe("PROFESSIONAL");
    expect(target.searchParams.get("billing")).toBe("annual");
    expect(target.searchParams.get("users")).toBe("7");
    expect(target.searchParams.get("sms")).toBe("350");
    expect(target.searchParams.getAll("addon")).toEqual(["voice", "custom-catalog-addon"]);
    expect(JSON.parse(target.searchParams.get("summary") ?? "null")).toEqual(summary);
    expect(target.searchParams.has("price")).toBe(false);
    expect(target.searchParams.has("monthlyTotal")).toBe(false);
  });

  it("normalizes and deduplicates catalog keys without substituting billing codes", () => {
    const target = new URL(buildPackageSignupRoute("premium", {
      ...summary,
      selectedAddOnKeys: [" Voice ", "voice", " Custom_Catalog.Addon ", "---"],
    }));
    expect(target.searchParams.getAll("addon")).toEqual(["voice", "custom-catalog-addon"]);
  });

  it("does not invent catalog keys from legacy flags or billing codes", () => {
    const target = new URL(buildPackageSignupRoute("premium", {
      ...summary,
      fiscalCashRegister: true,
      businessPremises: true,
      selectedAddOnKeys: undefined,
    }));
    expect(target.searchParams.getAll("addon")).toEqual([]);
  });

  it.each([
    { users: 25, sms: 1250, expectedUsers: "20", expectedSms: "1000" },
    { users: -3, sms: -50, expectedUsers: "1", expectedSms: "0" },
    { users: 3.8, sms: 126, expectedUsers: "3", expectedSms: "150" },
    { users: Number.NaN, sms: Number.NaN, expectedUsers: "1", expectedSms: "0" },
  ])("sends supported count values for users=$users and sms=$sms", ({ users, sms, expectedUsers, expectedSms }) => {
    const target = new URL(buildPackageSignupRoute("professional", {
      ...summary, totalUsers: users, additionalSms: sms,
    }));
    expect(target.searchParams.get("users")).toBe(expectedUsers);
    expect(target.searchParams.get("sms")).toBe(expectedSms);
  });
});
