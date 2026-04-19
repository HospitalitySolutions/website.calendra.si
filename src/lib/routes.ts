import { APP_BASE_URL } from "@/lib/site";

/**
 * Central route & URL configuration for CTA buttons.
 *
 * LOGIN_ROUTE — points to your Calendra app login page.
 *   If your app is on the same domain, use a relative path like "/login".
 *   If it's on a different domain, use the full URL.
 *
 * You can override APP_BASE_URL during Docker build with VITE_APP_BASE_URL.
 */

export const LOGIN_ROUTE = `${APP_BASE_URL}/login`;
export const REGISTER_ROUTE = `${APP_BASE_URL}/signup`;
export const TRIAL_SIGNUP_ROUTE = `${REGISTER_ROUTE}?flow=trial`;

export type PricingSignupSummary = {
  totalUsers: number;
  additionalSms: number;
  fiscalCashRegister: boolean;
  websiteCreation: boolean;
  businessPremises: boolean;
  monthlyTotal: number;
  oneTimeTotal: number;
  firstInvoiceEstimate: number;
};

export const buildPackageSignupRoute = (packageType: string, summary?: PricingSignupSummary) => {
  const params = new URLSearchParams({
    flow: "register",
    package: packageType.toUpperCase(),
  });

  if (summary) {
    params.set("summary", JSON.stringify(summary));
  }

  return `${REGISTER_ROUTE}?${params.toString()}`;
};

export const FEATURES_SECTION = "/#funkcionalnosti";
export const PRICING_SECTION = "/cenik";
export const BOOKING_PAGE = "/narocanje";
