import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  fetchPublicPricingCatalog,
  getInitialPricingCatalog,
  PRICING_CATALOG_UPDATED_EVENT,
  type PublicPricingCatalog,
  type PublicPricingPromotion,
} from "@/lib/public-pricing";
import { getActivePromotion } from "@/lib/promotion";

// setTimeout fires immediately for delays above 2^31 - 1 ms (about 24.8 days).
const MAX_TIMER_MS = 2_147_483_647;
const serverSnapshot = () => null;

/**
 * The app's current promotion, or null. Always null on the server and on the
 * first client render, so prerendered pages hydrate without a mismatch and the
 * offer never reaches static HTML; it appears after mount while the catalog
 * carries a promotion and `validUntil` is still ahead, and disappears at that
 * moment without a reload or a deploy.
 *
 * Pass the component's own catalog state where it has one (pricing pages);
 * otherwise the shared catalog (prerendered snapshot, then any app refresh) is used.
 */
export function useActivePromotion(catalog?: PublicPricingCatalog): PublicPricingPromotion | null {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const getSnapshot = useCallback(() => getActivePromotion(catalog ?? getInitialPricingCatalog()), [catalog]);
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
    return () => {
      clearTimeout(timer);
      window.removeEventListener(PRICING_CATALOG_UPDATED_EVENT, onCatalog);
    };
  }, [catalog]);

  const promotion = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return mounted ? promotion : null;
}

let confirmation: Promise<unknown> | undefined;

/**
 * Pages that do not load prices themselves still show the banner from the
 * prerendered snapshot. While that snapshot carries an offer, ask the app once
 * per page load whether it still does, so an offer withdrawn in the app
 * disappears everywhere. Outside an offer this sends nothing.
 */
export const confirmPromotionWithApp = (): Promise<unknown> => {
  confirmation ??= fetchPublicPricingCatalog().catch(() => undefined);
  return confirmation;
};

/** Test hook: forget the per-page confirmation. */
export const resetPromotionConfirmation = () => { confirmation = undefined; };
