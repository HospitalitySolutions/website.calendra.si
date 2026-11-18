import { getRouteKeyFromPathname } from "@/lib/localized-routes";
import { getArticleFromPathname } from "@/lib/blog";
import { getCustomerStoryFromPathname } from "@/lib/customer-stories";

const customerRoutes = new Set(["customers", "businesses", "accountDeletion"]);

// Enhanced site search can inspect the raw URL independently of page_location.
// Keep it disabled in GA Admin, and fail closed on search-bearing URLs even
// while a cached Google tag still has the previous configuration.
export const hasSearchQuery = (search: string) => {
  const params = new URLSearchParams(search);
  return ["q", "s", "search", "query", "keyword"].some(key => params.has(key));
};

/** Only editorial/business pages. Unknown routes and tenant flows fail closed. */
export const isMarketingPath = (pathname: string): boolean => {
  const key = getRouteKeyFromPathname(pathname);
  if (key) return !customerRoutes.has(key);
  return Boolean(getArticleFromPathname(pathname) || getCustomerStoryFromPathname(pathname));
};

const planKeys = ["basic", "pro", "professional", "premium", "business", "custom", "enterprise"] as const;
const enumFields: Record<string, readonly string[]> = {
  language: ["sl", "en"],
  placement: ["homepage", "homepage_hero", "homepage_final", "pricing_page", "pricing_page_sticky", "navbar", "footer", "feature_page", "feature_page_sticky", "industry_page", "industry_page_sticky", "demo_popup_desktop", "demo_banner_mobile"],
  entry_point: ["popup_desktop", "banner_mobile"],
  // Pricing.tsx sends its tier keys (professional, premium, custom); other callers use the app keys.
  package_key: planKeys,
  plan: planKeys,
  billing: ["monthly", "annual"],
  step: ["pricing_calculator"],
  reason: ["unknown_code"],
  currency: ["EUR"],
  lead_type: ["calendra", "it", "enterprise"],
  contact_type: ["calendra", "it"],
  delivery_method: ["api"],
  meeting_provider: ["GOOGLE_MEET", "ZOOM"],
  metric: ["CLS", "INP", "LCP", "FCP", "TTFB"],
  rating: ["good", "needs-improvement", "poor"],
};
const events = new Set([
  "trial_cta_click", "pricing_package_selected", "contact_path_selected", "generate_lead",
  "demo_booking_cta_clicked", "demo_booking_page_viewed", "demo_booking_slot_selected",
  "demo_booking_form_started", "demo_booking_confirmed", "demo_booking_cancelled", "demo_booking_rescheduled",
  "demo_prompt_impression", "demo_prompt_dismissed", "newsletter_signup_completed",
  "promo_code_copied", "coupon_applied", "coupon_rejected",
  "web_vitals",
]);
/**
 * Promotion codes are upper-cased by the caller and must contain a letter, so an
 * email address, phone number or other free text typed into the code field is
 * dropped rather than sent.
 */
const patternFields: Record<string, RegExp> = {
  coupon: /^(?=[A-Z0-9_-]*[A-Z])[A-Z0-9_-]{3,40}$/,
};

/** Strict values, not just key filtering: arbitrary labels can contain PII. */
export const sanitizeAnalyticsEvent = (name: string, payload: Record<string, unknown>) => {
  const event = name.replace(/-/g, "_");
  if (!events.has(event)) return null;
  const data: Record<string, string | number> = {};
  for (const [key, values] of Object.entries(enumFields)) {
    if (typeof payload[key] === "string" && values.includes(payload[key] as string)) data[key] = payload[key] as string;
  }
  for (const [key, pattern] of Object.entries(patternFields)) {
    if (typeof payload[key] === "string" && pattern.test(payload[key] as string)) data[key] = payload[key] as string;
  }
  for (const key of ["package_price", "value"]) {
    if (typeof payload[key] === "number" && Number.isFinite(payload[key]) && payload[key] >= 0) data[key] = payload[key];
  }
  if (typeof payload.path === "string" && !/[?#]/.test(payload.path) && isMarketingPath(payload.path)) data.path = payload.path;
  return { event, data };
};
