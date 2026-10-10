import { GOOGLE_ANALYTICS_ID, trackGoogleAnalyticsEvent } from "@/lib/google-analytics";
import { isMarketingPath, sanitizeAnalyticsEvent } from "@/lib/analytics-policy";
import { sanitizeAcquisition, safeReferrer } from "@/lib/acquisition";

/**
 * Cookieless analytics configuration.
 *
 * The tracker is served first-party from `/stats/*` (proxied by Caddy to the
 * self-hosted Umami container) so that content blockers, which match on
 * third-party analytics hostnames, do not silently drop the majority of traffic.
 *
 * Umami stays disabled unless its website id is supplied at build time. GA4
 * custom events require consent; its denied-default tag uses Advanced Mode.
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
const pendingEvents: Array<Record<string, unknown>> = [];
const MAX_PENDING_EVENTS = 50;
let flushTimer: ReturnType<typeof setInterval> | undefined;

const flushPendingEvents = () => {
  if (typeof window === "undefined" || !window.umami) return false;
  if (!isMarketingPath(window.location.pathname)) pendingEvents.length = 0;

  while (pendingEvents.length > 0) {
    const event = pendingEvents.shift();
    if (event) window.umami.track(event);
  }

  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = undefined;
  }

  return true;
};

const safeUmamiPage = () => {
  const path = window.location.pathname;
  const query = sanitizeAcquisition(window.location.search).toString();
  return {
    website: UMAMI_WEBSITE_ID,
    hostname: window.location.hostname,
    url: `${path}${query ? `?${query}` : ""}`,
    title: `Calendra ${path}`,
    referrer: safeReferrer(document.referrer),
  };
};

const sendUmami = (payload: Record<string, unknown>) => {
  if (window.umami) {
    window.umami.track(payload);
    return;
  }
  if (pendingEvents.length < MAX_PENDING_EVENTS) pendingEvents.push(payload);
  if (!document.querySelector("script[data-calendra-umami]")) {
    const script = document.createElement("script");
    script.async = true;
    script.src = UMAMI_SCRIPT_URL;
    script.dataset.calendraUmami = "true";
    script.dataset.websiteId = UMAMI_WEBSITE_ID;
    script.dataset.hostUrl = UMAMI_HOST_URL;
    // v2+ supports explicit payloads with all automatic collection disabled.
    script.dataset.autoTrack = "false";
    document.head.appendChild(script);
  }
  scheduleFlush();
};

let lastPage: string | null = null;
export const trackUmamiPageView = () => {
  if (typeof window === "undefined" || !UMAMI_ANALYTICS_ENABLED) return;
  if (!isMarketingPath(window.location.pathname)) {
    lastPage = null;
    pendingEvents.length = 0;
    return;
  }
  if (lastPage === window.location.pathname) return;
  lastPage = window.location.pathname;
  sendUmami(safeUmamiPage());
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
  if (!isMarketingPath(window.location.pathname)) return;
  const sanitized = sanitizeAnalyticsEvent(eventName, data);
  if (!sanitized) return;
  eventName = sanitized.event;
  data = sanitized.data;

  trackGoogleAnalyticsEvent(eventName, data);

  if (!UMAMI_ANALYTICS_ENABLED) return;

  sendUmami({ ...safeUmamiPage(), name: eventName, data });
};
