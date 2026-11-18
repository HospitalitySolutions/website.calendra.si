import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  getInitialPricingCatalog,
  hasPrerenderedPromotion,
  normalizePublicPricingCatalog,
  PRICING_CATALOG_UPDATED_EVENT,
  PUBLIC_PRICING_ENDPOINT,
  type PublicPricingCatalog,
  type PublicPricingPromotion,
} from "@/lib/public-pricing";
import { getActivePromotion } from "@/lib/promotion";

// setTimeout fires immediately for delays above 2^31 - 1 ms (about 24.8 days).
const MAX_TIMER_MS = 2_147_483_647;
const PROMOTION_WITHDRAWN_EVENT = "calendra:promotion-withdrawn";
const serverSnapshot = () => null;
// Set when the app no longer publishes the offer the page was built with.
let withdrawn = false;

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

/**
 * The app's current promotion, or null. Always null on the server and on the
 * first client render, so prerendered pages hydrate without a mismatch and no
 * offer wording reaches static HTML; it appears after mount while the catalog
 * carries a promotion and `validUntil` is still ahead, and disappears at that
 * moment without a reload or a deploy.
 *
 * Pass the component's own catalog state where it has one (pricing pages);
 * otherwise the shared catalog (prerendered snapshot, then any app refresh) is used.
 */
export function useActivePromotion(catalog?: PublicPricingCatalog): PublicPricingPromotion | null {
  const mounted = useMounted();

  const getSnapshot = useCallback(
    () => withdrawn ? null : getActivePromotion(catalog ?? getInitialPricingCatalog()),
    [catalog],
  );
  const subscribe = useCallback((onChange: () => void) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Re-check when the current offer ends; long waits are re-armed in steps.
    const arm = () => {
      clearTimeout(timer);
      const promotion = (catalog ?? getInitialPricingCatalog()).promotion;
      const remaining = promotion ? Date.parse(promotion.validUntil) - Date.now() : Number.NaN;
      if (!(remaining > 0)) return;
      timer = setTimeout(() => { onChange(); arm(); }, Math.min(remaining + 1, MAX_TIMER_MS));
    };
    const onCatalog = () => { arm(); onChange(); };
    arm();
    window.addEventListener(PRICING_CATALOG_UPDATED_EVENT, onCatalog);
    window.addEventListener(PROMOTION_WITHDRAWN_EVENT, onChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(PRICING_CATALOG_UPDATED_EVENT, onCatalog);
      window.removeEventListener(PROMOTION_WITHDRAWN_EVENT, onChange);
    };
  }, [catalog]);

  const promotion = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return mounted ? promotion : null;
}

/**
 * Whether to render an empty slot where an offer element will go. True on the
 * server and in the first client render when the page was prerendered with an
 * offer, so the element can later take exactly that space instead of pushing
 * the page down. After mount the caller shows the real element or nothing.
 */
export function usePromotionSlot(): boolean {
  const mounted = useMounted();
  return !mounted && hasPrerenderedPromotion();
}

let confirmation: Promise<void> | undefined;

/**
 * Pages that do not load prices themselves show the banner from the prerendered
 * snapshot. While that snapshot carries an offer, ask the app once per page load
 * whether it still does, so an offer withdrawn in the app disappears everywhere.
 * The answer only switches the offer off: the shared price catalog is left alone,
 * so routes that hydrate later still match their prerendered prices.
 */
export const confirmPromotionWithApp = (): Promise<void> => {
  confirmation ??= fetch(PUBLIC_PRICING_ENDPOINT, {
    method: "GET", headers: { Accept: "application/json" }, credentials: "omit", cache: "no-cache",
  })
    .then(async (response) => {
      if (!response.ok) return;
      if (normalizePublicPricingCatalog(await response.json()).promotion) return;
      withdrawn = true;
      window.dispatchEvent(new Event(PROMOTION_WITHDRAWN_EVENT));
    })
    .catch(() => undefined);
  return confirmation;
};

/** Test hook: forget the per-page confirmation and its answer. */
export const resetPromotionConfirmation = () => {
  confirmation = undefined;
  withdrawn = false;
};
