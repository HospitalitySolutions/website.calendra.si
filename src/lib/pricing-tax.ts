import { LEGAL_POLICY } from "./legal-policy";

/** Owner-confirmed public B2B price basis from 1 November 2026.
 * The app still uses legacy *Gross field names. Its numeric catalogue rates
 * remain the single price source; this policy does not rewrite invoices.
 */
export const PRICING_TAX = {
  effectiveFrom: LEGAL_POLICY.vatEffectiveFrom,
  vatId: LEGAL_POLICY.vatId,
  ratePercent: 22,
  included: false,
} as const;

export const roundPrice = (amount: number): number => Math.round((amount + Number.EPSILON) * 100) / 100;

/** Round the net subtotal, then VAT once; preserve sub-cent SMS unit rates. */
export const priceWithVat = (amount: number) => {
  const net = roundPrice(amount);
  const vat = roundPrice(net * PRICING_TAX.ratePercent / 100);
  return { net, vat, gross: roundPrice(net + vat) };
};

export const calculatePricingQuote = (input: {
  annual: boolean; monthlyPlan: number; annualPlan: number; annualBilledMonths: number;
  monthlyUsers: number; monthlyAddOns: number; smsCount: number; smsUnit: number;
}) => {
  const factor = input.annual ? input.annualBilledMonths : 1;
  const plan = roundPrice(input.annual ? input.annualPlan : input.monthlyPlan);
  const users = roundPrice(input.monthlyUsers * factor);
  const addOns = roundPrice(input.monthlyAddOns * factor);
  const sms = priceWithVat(input.smsCount * input.smsUnit);
  // Annual subscriptions do not prebill twelve months of SMS usage.
  const total = priceWithVat(plan + users + addOns + (input.annual ? 0 : sms.net));
  return { plan, users, addOns, sms, total, monthlyEquivalent: input.annual ? roundPrice(total.gross / 12) : total.gross };
};

export const pricingTaxLabels = (language: "sl" | "en") => language === "sl" ? {
  net: "brez DDV", subtotal: "Skupaj brez DDV", vat: "DDV (22 %)",
  monthlyTotal: "Mesečno skupaj z DDV", annualTotal: "Letno skupaj z DDV",
  monthlyEquivalent: "Povprečno na mesec z DDV",
  annualUsage: "SMS se obračunajo mesečno po porabi; prikazan je mesečni izračun z DDV.",
} : {
  net: "excl. VAT", subtotal: "Subtotal excl. VAT", vat: "VAT (22%)",
  monthlyTotal: "Monthly total incl. VAT", annualTotal: "Annual total incl. VAT",
  monthlyEquivalent: "Monthly equivalent incl. VAT",
  annualUsage: "SMS are billed monthly based on usage; the monthly estimate includes VAT.",
};
