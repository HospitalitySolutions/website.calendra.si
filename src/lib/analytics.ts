import { GOOGLE_ANALYTICS_ID, trackGoogleAnalyticsEvent } from "@/lib/google-analytics";

/**
 * Cookieless analytics configuration.
 *
 * The tracker is served first-party from `/stats/*` (proxied by Caddy to the
 * self-hosted Umami container) so that content blockers, which match on
 * third-party analytics hostnames, do not silently drop the majority of traffic.
 *
 * Umami stays disabled unless its website id is supplied at build time. GA4 is
 * configured separately and remains consent-gated in the browser.
 */
const trimUrl = (value: string) => value.replace(/\/+$/, "");

export const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? "";
export const UMAMI_SCRIPT_URL = import.meta.env.VITE_UMAMI_SCRIPT_URL ?? "/stats/script.js";
export const UMAMI_HOST_URL = trimUrl(import.meta.env.VITE_UMAMI_HOST_URL ?? "/stats");

export const UMAMI_ANALYTICS_ENABLED = Boolean(UMAMI_WEBSITE_ID);
export const ANALYTICS_ENABLED = UMAMI_ANALYTICS_ENABLED || Boolean(GOOGLE_ANALYTICS_ID);

type UmamiTracker = {
  track: ((eventName: string, data?: Record<string, unknown>) => void) &
    ((payload: Record<string, unknown>) => void);
  identify?: (data: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

/**
 * Umami loads asynchronously, so events fired during the first moments of a
 * page view would otherwise be lost. They are buffered here and flushed once the
 * tracker appears.
 */
const pendingEvents: Array<{ name: string; data: Record<string, unknown> }> = [];
const MAX_PENDING_EVENTS = 50;
let flushTimer: ReturnType<typeof setInterval> | undefined;

const flushPendingEvents = () => {
  if (typeof window === "undefined" || !window.umami) return false;

  while (pendingEvents.length > 0) {
    const event = pendingEvents.shift();
    if (event) window.umami.track(event.name, event.data);
  }

  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = undefined;
  }

  return true;
};

const scheduleFlush = () => {
  if (flushTimer || typeof window === "undefined") return;

  let attempts = 0;
  flushTimer = setInterval(() => {
    attempts += 1;
    if (flushPendingEvents() || attempts > 40) {
      if (flushTimer) {
        clearInterval(flushTimer);
        flushTimer = undefined;
      }
    }
  }, 250);
};

export const trackAnalyticsEvent = (eventName: string, data: Record<string, unknown> = {}) => {
  if (typeof window === "undefined" || !ANALYTICS_ENABLED) return;

  trackGoogleAnalyticsEvent(eventName, data);

  if (!UMAMI_ANALYTICS_ENABLED) return;

  if (window.umami) {
    window.umami.track(eventName, data);
    return;
  }

  if (pendingEvents.length < MAX_PENDING_EVENTS) {
    pendingEvents.push({ name: eventName, data });
  }
  scheduleFlush();
};
