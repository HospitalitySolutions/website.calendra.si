export const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID ?? "G-DVDT4W7BYS";

export const GOOGLE_ANALYTICS_CONSENT_KEY = "calendra-google-analytics-consent";
export const GOOGLE_ANALYTICS_CONSENT_EVENT = "calendra:google-analytics-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "calendra:open-cookie-settings";

export type GoogleAnalyticsConsent = "granted" | "denied";

type GtagCommand = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagCommand;
  }
}

let scriptRequested = false;
let configured = false;

const ensureGtag = () => {
  if (typeof window === "undefined") return undefined;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(..._args: unknown[]) {
    window.dataLayer?.push(arguments);
  };

  return window.gtag;
};

const setDefaultConsent = () => {
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });

  // Calendra currently uses GA4 only for site measurement, not advertising.
  gtag("set", "ads_data_redaction", true);
};

export const getGoogleAnalyticsConsent = (): GoogleAnalyticsConsent | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(GOOGLE_ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
};

const updateConsentMode = (consent: GoogleAnalyticsConsent) => {
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: consent,
  });
};

const clearGoogleAnalyticsCookies = () => {
  if (typeof document === "undefined") return;

  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name && (name === "_ga" || name.startsWith("_ga_"))));

  const hostname = window.location.hostname;
  const domainCandidates = [...new Set<string | undefined>([
    undefined,
    hostname,
    hostname.includes(".") ? `.${hostname}` : undefined,
  ])];

  for (const name of cookieNames) {
    for (const domain of domainCandidates) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    }
  }
};

export const loadGoogleAnalytics = () => {
  if (typeof document === "undefined" || !GOOGLE_ANALYTICS_ID || scriptRequested) return;

  const gtag = ensureGtag();
  if (!gtag) return;

  scriptRequested = true;

  const existing = document.querySelector<HTMLScriptElement>("script[data-calendra-google-analytics]");
  if (!existing) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ANALYTICS_ID)}`;
    script.dataset.calendraGoogleAnalytics = "true";
    document.head.appendChild(script);
  }

  if (!configured) {
    configured = true;
    gtag("js", new Date());
    gtag("config", GOOGLE_ANALYTICS_ID);
  }
};

export const initializeGoogleAnalytics = () => {
  if (typeof window === "undefined" || !GOOGLE_ANALYTICS_ID) return;

  // Advanced Consent Mode: establish a denied default before the Google tag
  // is requested. The tag may then send limited cookieless measurement pings,
  // but analytics cookies are unavailable until the visitor grants consent.
  setDefaultConsent();

  const consent = getGoogleAnalyticsConsent();
  if (consent) updateConsentMode(consent);

  // Unlike Basic Consent Mode, Advanced Consent Mode loads the Google tag even
  // while analytics_storage is denied. This also lets Google/Tag Assistant
  // detect the installation without needing to interact with the consent UI.
  loadGoogleAnalytics();
};

export const setGoogleAnalyticsConsent = (consent: GoogleAnalyticsConsent) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, consent);
  } catch {
    // Consent still applies for the current page even if browser storage is unavailable.
  }

  updateConsentMode(consent);
  loadGoogleAnalytics();

  if (consent === "denied") {
    clearGoogleAnalyticsCookies();
  }

  window.dispatchEvent(new CustomEvent<GoogleAnalyticsConsent>(GOOGLE_ANALYTICS_CONSENT_EVENT, { detail: consent }));
};

export const trackGoogleAnalyticsEvent = (eventName: string, data: Record<string, unknown> = {}) => {
  if (typeof window === "undefined" || !GOOGLE_ANALYTICS_ID || getGoogleAnalyticsConsent() !== "granted") return;

  loadGoogleAnalytics();
  const googleEventName = eventName.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 40);
  if (!googleEventName) return;

  ensureGtag()?.("event", googleEventName, data);
};
