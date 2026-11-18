import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { isCustomerNavigationPath } from "@/lib/customer-navigation";
import { getRoutePath } from "@/lib/localized-routes";
import { getPromotionBannerCopy } from "@/lib/promotion";
import { dismissPromotionBanner, isPromotionBannerDismissed } from "@/lib/promotion-banner";
import { useSiteLanguage } from "@/lib/site-language";
import { confirmPromotionWithApp, useActivePromotion, usePromotionSlot } from "@/lib/use-active-promotion";

/**
 * Site-wide offer banner above the page, rendered from App and prerendered by
 * entry-server at the same place. While the build snapshot carries an offer the
 * static page holds an empty slot of the banner's height (no wording); after
 * hydration the banner takes that space, or the slot closes when the offer has
 * ended, the visitor closed the banner or the app withdrew the offer.
 */
export default function PromotionBanner() {
  const { pathname } = useLocation();
  const { language } = useSiteLanguage();
  const slot = usePromotionSlot();
  const promotion = useActivePromotion();
  const [dismissed, setDismissed] = useState(false);

  // Storage is read after hydration, in the same update that replaces the slot.
  useEffect(() => setDismissed(isPromotionBannerDismissed()), []);
  useEffect(() => {
    if (promotion) void confirmPromotionWithApp();
  }, [promotion]);

  if (isCustomerNavigationPath(pathname)) return null;
  if (slot) return <div className="site-notice" aria-hidden="true" />;
  if (!promotion || dismissed) return null;

  const copy = getPromotionBannerCopy(promotion, language);
  const href = `${getRoutePath("pricing", language)}?code=${encodeURIComponent(promotion.code)}`;
  return (
    <div className="site-notice bf-banner" role="region" aria-label={copy.label}>
      <p>
        <b>{copy.label}:</b> {copy.beforeCode}{" "}
        <span className="bf-banner-code font-bold tracking-wide whitespace-nowrap">{promotion.code}</span>. {copy.afterCode}{" "}
        <a className="ml-1 font-semibold underline underline-offset-4 whitespace-nowrap" href={href}>{copy.link}<span aria-hidden="true"> →</span></a>
      </p>
      <button
        type="button"
        className="absolute grid h-9 w-9 place-items-center rounded-lg"
        aria-label={copy.close}
        onClick={() => {
          dismissPromotionBanner();
          setDismissed(true);
        }}
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
