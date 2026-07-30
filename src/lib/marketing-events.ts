import { trackAnalyticsEvent } from "@/lib/analytics";

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
  | "calendra_inquiry_submitted"
  | "it_service_inquiry_submitted";

type MarketingEventPayload = Record<string, string | number | boolean | null | undefined>;

export const trackMarketingEvent = (eventName: MarketingEventName, payload: MarketingEventPayload = {}) => {
  if (typeof window === "undefined") return;

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  trackAnalyticsEvent(eventName, cleanPayload);
  window.dispatchEvent(new CustomEvent("calendra:marketing-event", {
    detail: { event: eventName, ...cleanPayload },
  }));
};
