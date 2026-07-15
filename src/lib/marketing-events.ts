export type MarketingEventName =
  | "pricing_package_selected"
  | "trial_cta_click"
  | "public_profile_viewed"
  | "public_booking_started";

type MarketingEventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackMarketingEvent = (eventName: MarketingEventName, payload: MarketingEventPayload = {}) => {
  if (typeof window === "undefined") return;

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...cleanPayload });
  window.gtag?.("event", eventName, cleanPayload);
  window.dispatchEvent(new CustomEvent("calendra:marketing-event", {
    detail: { event: eventName, ...cleanPayload },
  }));
};
