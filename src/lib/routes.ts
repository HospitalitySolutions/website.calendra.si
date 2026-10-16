import type { SiteLanguage } from "@/lib/site-language";
import { APP_BASE_URL, SITE_URL } from "@/lib/site";

/**
 * Central route & URL configuration for CTA buttons.
 *
 * LOGIN_ROUTE — points to your Calendra app login page.
 *   If your app is on the same domain, use a relative path like "/login".
 *   If it's on a different domain, use the full URL.
 *
 * You can override APP_BASE_URL during Docker build with VITE_APP_BASE_URL.
 */

export const BUSINESS_LOGIN_ROUTE = `${APP_BASE_URL}/login`;
export const CUSTOMER_ACCOUNT_ROUTE = "/racun";
export const CUSTOMER_LOGIN_ROUTE = `${CUSTOMER_ACCOUNT_ROUTE}/prijava`;
export const CUSTOMER_REGISTER_ROUTE = `${CUSTOMER_ACCOUNT_ROUTE}/registracija`;

/** @deprecated Prefer BUSINESS_LOGIN_ROUTE or CUSTOMER_LOGIN_ROUTE for audience-specific CTAs. */
export const LOGIN_ROUTE = BUSINESS_LOGIN_ROUTE;
// Business signup is hosted on the public site; staff login remains on APP_BASE_URL.
export const REGISTER_ROUTE = `${SITE_URL}/registriraj`;
const attributionKeys = ["via", "ref", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"];

function registrationTarget(language: SiteLanguage, search = "") {
  const target = new URL(language === "sl" ? "/registriraj" : "/register", SITE_URL);
  const incoming = new URLSearchParams(search);
  for (const key of attributionKeys) {
    const value = incoming.get(key);
    if (value) target.searchParams.set(key, value);
  }
  target.searchParams.set("locale", language);
  return target;
}

export function buildTrialSignupRoute(language: SiteLanguage = "sl", search = "") {
  const target = registrationTarget(language, search);
  target.searchParams.set("flow", "trial");
  return target.toString();
}

export function isBusinessRegistrationUrl(href: string) {
  try {
    const target = new URL(href, SITE_URL);
    return target.origin === new URL(SITE_URL).origin && ["/registriraj", "/register"].includes(target.pathname);
  } catch { return false; }
}

export type PricingSignupSummary = {
  totalUsers: number;
  additionalSms: number;
  fiscalCashRegister: boolean;
  websiteCreation: boolean;
  businessPremises: boolean;
  selectedAddOnKeys?: string[];
  selectedAddOnCodes?: string[];
  monthlyTotal: number;
  oneTimeTotal: number;
  firstInvoiceEstimate: number;
};

const clampRegistrationCount = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.trunc(value))) : fallback;

export const buildPackageSignupRoute = (packageType: string, summary?: PricingSignupSummary, language: SiteLanguage = "sl", search = "") => {
  const params = new URLSearchParams({
    flow: "register",
    package: packageType.toUpperCase(),
  });

  if (summary) {
    // Match the app's registerFlow query contract: users means total seats,
    // SMS is a message count, and add-ons use catalog keys rather than codes.
    params.set("users", String(clampRegistrationCount(summary.totalUsers, 1, 20, 1)));
    const sms = clampRegistrationCount(summary.additionalSms, 0, 1000, 0);
    params.set("sms", String(Math.round(sms / 50) * 50));
    const addOnKeys = new Set((summary.selectedAddOnKeys ?? [])
      .map((key) => key.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
      .filter(Boolean));
    for (const key of addOnKeys) params.append("addon", key);

    // Preserve the existing estimate payload; the app must calculate payable
    // prices from its own catalog, not treat these client totals as authority.
    params.set("summary", JSON.stringify(summary));
  }

  const target = registrationTarget(language, search);
  params.forEach((value, key) => target.searchParams.append(key, value));
  return target.toString();
};

export const FEATURES_SECTION = "/#funkcionalnosti";
export const PRICING_SECTION = "/cenik";
export const CLIENTS_PAGE = "/stranke";
export const BOOKING_PAGE = "/narocanje";
