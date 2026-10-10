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

const enumFields: Record<string, readonly string[]> = {
  language: ["sl", "en"],
  placement: ["homepage", "homepage_hero", "pricing_page", "navbar", "footer", "feature_page"],
  package_key: ["basic", "pro", "premium", "business", "enterprise"],
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
  "web_vitals",
]);

/** Strict values, not just key filtering: arbitrary labels can contain PII. */
export const sanitizeAnalyticsEvent = (name: string, payload: Record<string, unknown>) => {
  const event = name.replace(/-/g, "_");
  if (!events.has(event)) return null;
  const data: Record<string, string | number> = {};
  for (const [key, values] of Object.entries(enumFields)) {
    if (typeof payload[key] === "string" && values.includes(payload[key] as string)) data[key] = payload[key] as string;
  }
  for (const key of ["package_price", "value"]) {
    if (typeof payload[key] === "number" && Number.isFinite(payload[key]) && payload[key] >= 0) data[key] = payload[key];
  }
  if (typeof payload.path === "string" && !/[?#]/.test(payload.path) && isMarketingPath(payload.path)) data.path = payload.path;
  return { event, data };
};
