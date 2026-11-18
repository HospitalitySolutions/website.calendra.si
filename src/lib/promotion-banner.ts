/** Versioned so a later offer, or a changed banner, can be shown again to everyone. */
export const PROMOTION_BANNER_DISMISS_KEY = "calendra:bf2026-banner:v1:dismissed-until";
export const PROMOTION_BANNER_DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

/** Storage may be missing, blocked or full; the banner then simply shows again on the next page. */
export const isPromotionBannerDismissed = (now = Date.now()): boolean => {
  try {
    const until = Number(window.localStorage.getItem(PROMOTION_BANNER_DISMISS_KEY));
    return Number.isFinite(until) && until > now;
  } catch {
    return false;
  }
};

export const dismissPromotionBanner = (now = Date.now()): void => {
  try {
    window.localStorage.setItem(PROMOTION_BANNER_DISMISS_KEY, String(now + PROMOTION_BANNER_DISMISS_MS));
  } catch {
    /* Closing still applies to the current page. */
  }
};
