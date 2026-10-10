import { trackAnalyticsEvent } from "@/lib/analytics";
import { isMarketingPath, sanitizeAnalyticsEvent } from "@/lib/analytics-policy";

export type MarketingEventName =
  | "pricing_package_selected"
  | "trial_cta_click"
  | "public_profile_viewed"
  | "public_booking_started"
  | "demo_booking_cta_clicked"
  | "demo_booking_page_viewed"
  | "demo_booking_slot_selected"
  | "demo_booking_form_started"
  | "demo_booking_confirmed"
  | "demo_booking_cancelled"
  | "demo_booking_rescheduled"
  | "contact_path_selected"
  | "generate_lead";

type MarketingEventPayload = Record<string, string | number | boolean | null | undefined>;

export const trackMarketingEvent = (eventName: MarketingEventName, payload: MarketingEventPayload = {}) => {
  if (typeof window === "undefined") return;
  if (!isMarketingPath(window.location.pathname)) return;
  const sanitized = sanitizeAnalyticsEvent(eventName, payload);
  if (!sanitized) return;
  const cleanPayload = sanitized.data;

  // Optional measurement must never interrupt navigation or turn a confirmed
  // booking/inquiry into a retryable business failure.
  try {
    trackAnalyticsEvent(eventName, cleanPayload);
  } catch { /* The application outcome remains authoritative. */ }
  window.dispatchEvent(new CustomEvent("calendra:marketing-event", {
    detail: { event: eventName, ...cleanPayload },
  }));
};
