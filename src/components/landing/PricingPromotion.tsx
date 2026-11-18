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
    <div className={`pricing-promo-chip flex items-center justify-between gap-2 rounded-xl bg-white${copied ? " is-copied" : ""}`}>
      <span>{promotion.code}</span>
      <button type="button" className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold tracking-normal text-white" onClick={onCopy} aria-label={copy.offer.copyLabel}>
        {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
        <span aria-hidden="true">{copied ? copy.offer.copied : copy.offer.copy}</span>
      </button>
      <span className="sr-only" role="status">{copied ? copy.offer.copiedStatus : ""}</span>
    </div>
  );
};

/**
 * The /cenik offer block between the page intro and the plan cards. Pricing.tsx
 * prerenders an empty `.pricing-offer` slot of the same height in its place while
 * the build snapshot carries an offer.
 */
export const PromotionOffer = ({ promotion, copy }: { promotion: PublicPricingPromotion; copy: PromotionCopy }) => (
  <section id="black-friday" className="pricing-offer" aria-labelledby="black-friday-title">
    <p className="pricing-promo-badge" aria-hidden="true">−{copy.offer.badge}<span>%</span></p>
    <div>
      <h2 id="black-friday-title" className="mb-2">{copy.offer.headline}</h2>
      <p>{copy.offer.terms}</p>
    </div>
    <div className="pricing-promo-side">
      <PromotionCodeChip promotion={promotion} copy={copy} />
      <p className="mt-2 flex items-center gap-2 text-xs"><Clock3 aria-hidden="true" className="h-4 w-4 text-amber-400" />{copy.offer.valid}</p>
    </div>
  </section>
);
