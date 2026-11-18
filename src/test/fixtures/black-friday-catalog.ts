/* Synthetic test fixture only. Never imported by a production build. */
import { FALLBACK_PUBLIC_PRICING } from "@/test/fixtures/public-pricing-snapshot";
import { normalizePublicPricingCatalog, type PublicPricingCatalog } from "@/lib/pricing-catalog";

/** The shape and amounts of the app's November 2026 catalog, as published to the website. */
const NOVEMBER_PLANS = { basic: [15.9, 162.18], pro: [26.9, 274.38], business: [39.9, 406.98] } as const;

export const BLACK_FRIDAY_VALID_UNTIL = "2026-12-31T22:59:59Z";

/** What `GET /api/register/public-pricing` returns while the offer runs. */
export const blackFridayPromotion = {
  code: "BLACKFRIDAY50",
  percentOff: 50,
  discountedMonths: 6,
  validUntil: BLACK_FRIDAY_VALID_UNTIL,
  plans: [
    { key: "basic", monthlyPrice: 7.95, annualPrice: 143.1 },
    { key: "pro", monthlyPrice: 13.45, annualPrice: 242.1 },
    { key: "business", monthlyPrice: 19.95, annualPrice: 359.1 },
  ],
};

const regularCatalog = {
  ...FALLBACK_PUBLIC_PRICING,
  annualBilledMonths: 10.2,
  annualSavingsMonths: 1.8,
  annualDiscountPercent: 15,
  plans: FALLBACK_PUBLIC_PRICING.plans.map((plan) => ({
    ...plan,
    monthlyGross: NOVEMBER_PLANS[plan.key][0],
    annualGross: NOVEMBER_PLANS[plan.key][1],
    featureKeys: plan.key === "business" ? [...plan.featureKeys, "no-show"] : plan.featureKeys,
  })),
  // The app's waiting-list feature (its legacy key is "no-show").
  features: [
    ...FALLBACK_PUBLIC_PRICING.features,
    {
      key: "no-show", name: "Waitlist", nameSl: "Čakalne vrste", description: "", descriptionSl: "",
      minimumPlan: "business" as const, includedPlans: ["business" as const], customMonthlyGross: null,
    },
  ],
};

/** November prices without an offer. */
export const novemberCatalog: PublicPricingCatalog = normalizePublicPricingCatalog(regularCatalog);
/** November prices with the Black Friday 2026 promotion. */
export const blackFridayCatalog: PublicPricingCatalog = normalizePublicPricingCatalog({ ...regularCatalog, promotion: blackFridayPromotion });

/** A moment while the offer runs; tests pin the clock so they do not depend on the real date. */
export const DURING_BLACK_FRIDAY = new Date("2026-11-27T09:00:00Z");
