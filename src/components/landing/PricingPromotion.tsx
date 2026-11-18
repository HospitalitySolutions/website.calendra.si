import { useEffect, useRef, useState } from "react";
import { Check, Clock3, Copy } from "lucide-react";
import { trackMarketingEvent } from "@/lib/marketing-events";
import type { PromotionCopy } from "@/lib/promotion-copy";
import type { PublicPricingPromotion } from "@/lib/pricing-catalog";

const COPIED_MS = 2500;

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* Fall through to the selection-based copy. */ }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  } catch {
    return false;
  }
};

/** The code with a copy button. Copying is optional: the code stays visible and selectable. */
export const PromotionCodeChip = ({ promotion, copy }: { promotion: PublicPricingPromotion; copy: PromotionCopy }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    if (!(await copyToClipboard(promotion.code))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    trackMarketingEvent("promo_code_copied", { coupon: promotion.code, placement: "pricing_page" });
  };

  return (
    <div className={`pricing-promo-chip${copied ? " is-copied" : ""}`}>
      <span className="pricing-promo-chip-code">{promotion.code}</span>
      <button type="button" onClick={onCopy} aria-label={copy.offer.copyLabel}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span aria-hidden="true">{copied ? copy.offer.copied : copy.offer.copy}</span>
      </button>
      <span className="sr-only" role="status">{copied ? copy.offer.copiedStatus : ""}</span>
    </div>
  );
};

/** The /cenik offer block between the page intro and the plan cards. */
export const PromotionOffer = ({ promotion, copy }: { promotion: PublicPricingPromotion; copy: PromotionCopy }) => (
  <section id="black-friday" className="pricing-promo-offer" aria-labelledby="black-friday-title">
    <p className="pricing-promo-badge" aria-hidden="true">−{copy.offer.badge}<span>%</span></p>
    <div className="pricing-promo-copy">
      <h2 id="black-friday-title">{copy.offer.headline}</h2>
      <p>{copy.offer.terms}</p>
    </div>
    <div className="pricing-promo-side">
      <PromotionCodeChip promotion={promotion} copy={copy} />
      <p className="pricing-promo-valid"><Clock3 aria-hidden="true" />{copy.offer.valid}</p>
    </div>
  </section>
);
