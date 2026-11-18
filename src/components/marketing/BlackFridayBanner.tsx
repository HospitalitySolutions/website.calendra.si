import { X } from "lucide-react";
import { getRoutePath } from "@/lib/localized-routes";
import { getPromotionCopy } from "@/lib/promotion-copy";
import type { PublicPricingPromotion } from "@/lib/pricing-catalog";
import { useSiteLanguage } from "@/lib/site-language";
import "@/styles/promotion-banner.css";

type BlackFridayBannerProps = { promotion: PublicPricingPromotion; onClose: () => void };

export default function BlackFridayBanner({ promotion, onClose }: BlackFridayBannerProps) {
  const { language } = useSiteLanguage();
  const copy = getPromotionCopy(promotion, language);
  const href = `${getRoutePath("pricing", language)}?code=${encodeURIComponent(promotion.code)}`;

  return (
    <div className="bf-banner" role="region" aria-label={copy.label} data-promotion-banner>
      <div className="bf-banner-inner">
        <p>
          <b className="bf-banner-label">{copy.label}:</b> {copy.banner.beforeCode}{" "}
          <span className="bf-banner-code">{promotion.code}</span>. {copy.banner.afterCode}{" "}
          <a href={href}>{copy.banner.link}<span aria-hidden="true"> →</span></a>
        </p>
      </div>
      <button type="button" className="bf-banner-close" aria-label={copy.banner.close} onClick={onClose}>
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
