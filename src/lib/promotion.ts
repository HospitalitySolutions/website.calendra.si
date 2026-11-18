import type {
  PublicPricingCatalog,
  PublicPricingPlan,
  PublicPricingPlanKey,
  PublicPricingPromotion,
  PublicPricingPromotionPlan,
} from "@/lib/pricing-catalog";
import { roundPrice } from "@/lib/pricing-tax";
import type { SiteLanguage } from "@/lib/site-language";

/** Offer dates are stated in the company's time zone, whatever the visitor's clock says. */
export const PROMOTION_TIME_ZONE = "Europe/Ljubljana";

/** The app publishes a promotion only while it runs; the end date is still checked on every read. */
export const isPromotionActive = (
  promotion: PublicPricingPromotion | null | undefined,
  now = Date.now(),
): promotion is PublicPricingPromotion => Boolean(promotion) && now < Date.parse(promotion!.validUntil);

export const getActivePromotion = (catalog: PublicPricingCatalog, now = Date.now()): PublicPricingPromotion | null =>
  isPromotionActive(catalog.promotion, now) ? catalog.promotion! : null;

export const getPromotionPlan = (
  promotion: PublicPricingPromotion | null | undefined,
  key: PublicPricingPlanKey | undefined,
): PublicPricingPromotionPlan | null => (key && promotion?.plans.find((plan) => plan.key === key)) || null;

/** Codes are compared trimmed and case-insensitively; the catalog stores them upper-case. */
export const normalizePromotionCode = (value: string | null | undefined): string => (value ?? "").trim().toUpperCase();

export const isPromotionCode = (value: string | null | undefined, promotion: PublicPricingPromotion | null | undefined): boolean =>
  Boolean(promotion) && normalizePromotionCode(value) !== "" && normalizePromotionCode(value) === normalizePromotionCode(promotion!.code);

/**
 * Plan discount for one billing period: monthly is the cut on one month, annual is
 * the regular yearly plan price minus the yearly price with the code. Never negative.
 */
export const getPromotionPlanDiscount = (
  plan: Pick<PublicPricingPlan, "monthlyGross" | "annualGross">,
  promotionPlan: PublicPricingPromotionPlan | null,
  annual: boolean,
): number => {
  if (!promotionPlan) return 0;
  const discount = annual ? plan.annualGross - promotionPlan.annualPrice : plan.monthlyGross - promotionPlan.monthlyPrice;
  return roundPrice(Math.max(0, discount));
};

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Calendar date of the last moment of the offer in Ljubljana. */
export const getPromotionEndDate = (validUntil: string) => {
  // One millisecond earlier, so an end at local midnight names the last valid day.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PROMOTION_TIME_ZONE, day: "numeric", month: "numeric", year: "numeric",
  }).formatToParts(new Date(Date.parse(validUntil) - 1));
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
  return { day: part("day"), month: part("month"), year: part("year") };
};

/** "31. 12. 2026" in Slovenian, "31 Dec 2026" in English. */
export const formatPromotionDate = (validUntil: string, language: SiteLanguage): string => {
  const { day, month, year } = getPromotionEndDate(validUntil);
  return language === "sl" ? `${day}. ${month}. ${year}` : `${day} ${EN_MONTHS[month - 1]} ${year}`;
};

/** "50 %" in Slovenian, "50%" in English, as the rest of the site writes percentages. */
export const formatPromotionPercent = (value: number, language: SiteLanguage): string => {
  const number = new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-IE", { maximumFractionDigits: 1 }).format(value);
  return language === "sl" ? `${number} %` : `${number}%`;
};

/** "prvih 6 mesecev", "prva 2 meseca", "prvi plačani mesec" ... */
export const firstMonthsSl = (count: number, paid = false) => {
  if (count === 1) return paid ? "prvi plačani mesec" : "prvi mesec";
  if (count === 2) return paid ? "prva 2 plačana meseca" : "prva 2 meseca";
  if (count <= 4) return paid ? `prve ${count} plačane mesece` : `prve ${count} mesece`;
  return paid ? `prvih ${count} plačanih mesecev` : `prvih ${count} mesecev`;
};
/** "6 mesecev", "2 meseca", "3 mesece", "1 mesec" (as an object). */
export const monthsSl = (count: number) => {
  const rest = count % 100;
  return `${count} ${rest === 1 ? "mesec" : rest === 2 ? "meseca" : rest === 3 || rest === 4 ? "mesece" : "mesecev"}`;
};
export const afterMonthsSl = (count: number) => `po ${count} ${count % 100 === 1 ? "mesecu" : "mesecih"}`;
export const firstMonthsEn = (count: number, paid = false) =>
  count === 1 ? (paid ? "first paid month" : "first month") : `first ${count}${paid ? " paid" : ""} months`;
export const monthsEn = (count: number) => `${count} ${count === 1 ? "month" : "months"}`;

/** The homepage pricing teaser line (the rest of the copy is in promotion-copy.ts). */
export const getPromotionTeaser = (promotion: PublicPricingPromotion, language: SiteLanguage) => {
  const percent = formatPromotionPercent(promotion.percentOff, language);
  return {
    label: "Black Friday",
    text: language === "sl"
      ? `−${percent} ${firstMonthsSl(promotion.discountedMonths)} s kodo ${promotion.code}`
      : `${percent} off for ${monthsEn(promotion.discountedMonths)} with code ${promotion.code}`,
  };
};
