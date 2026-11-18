import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isCustomerNavigationPath } from "@/lib/customer-navigation";
import { dismissPromotionBanner, isPromotionBannerDismissed } from "@/lib/promotion-banner";
import { confirmPromotionWithApp, useActivePromotion } from "@/lib/use-active-promotion";

// The banner's markup and styles are only fetched while an offer runs.
const BlackFridayBanner = lazy(() => import("./BlackFridayBanner"));

/**
 * Site-wide offer banner above the page. Rendered from App, outside the
 * prerendered routes, and only after mount: nothing of it is in static HTML.
 */
export default function PromotionBanner() {
  const { pathname } = useLocation();
  const promotion = useActivePromotion();
  // Closed until storage has been read after mount.
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => setDismissed(isPromotionBannerDismissed()), []);
  useEffect(() => {
    if (promotion) void confirmPromotionWithApp();
  }, [promotion]);

  if (!promotion || dismissed || isCustomerNavigationPath(pathname)) return null;

  return (
    <Suspense fallback={null}>
      <BlackFridayBanner
        promotion={promotion}
        onClose={() => {
          dismissPromotionBanner();
          setDismissed(true);
        }}
      />
    </Suspense>
  );
}
