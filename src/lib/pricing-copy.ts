import { getInitialPricingCatalog, type PublicPricingCatalog } from "@/lib/public-pricing";
import type { SiteLanguage } from "@/lib/site-language";

export const getPricingTaxNote = (language: SiteLanguage): string => language === "sl"
  ? "Vse navedene cene na spletnem mestu in v aplikaciji so brez DDV. Skladno z Zakonom o davku na dodano vrednost (ZDDV-1) se tako na vse cene obračuna DDV v višini 22,00 %."
  : "All prices listed on the website and in the application exclude VAT. In accordance with the Slovenian Value Added Tax Act (ZDDV-1), VAT at a rate of 22.00% is added to all prices.";

/** Pricing prose uses the same catalog as the cards and structured offers. */
export const getPricingSummary = (
  language: SiteLanguage,
  catalog: PublicPricingCatalog = getInitialPricingCatalog(),
): string => {
  const amount = (value: number) => `${new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ${catalog.currency}`;
  const plans = catalog.plans.map((plan) =>
    `${language === "sl" ? plan.nameSl : plan.name} ${amount(plan.monthlyGross)}`,
  ).join(", ");
  const userPrices = catalog.additionalUserRules.map((rule) => language === "sl"
    ? `${rule.fromUser}–${rule.toUser ?? "∞"}: ${amount(rule.monthlyGrossPerUser)} / uporabnik / mesec`
    : `${rule.fromUser}–${rule.toUser ?? "∞"}: ${amount(rule.monthlyGrossPerUser)} / user / month`).join("; ");

  if (language === "sl") {
    return [
      `Mesečne cene paketov Calendra: ${plans}.`,
      getPricingTaxNote(language),
      `Število uporabnikov v osnovni ceni: ${catalog.includedUsers}.`,
      `Cene dodatnih uporabnikov: ${userPrices}.`,
      `Pri letnem plačilu plačate ${catalog.annualBilledMonths} mesecev za 12 mesecev uporabe.`,
      "Brezplačni preizkus traja 14 dni brez kreditne kartice.",
    ].join(" ");
  }

  return [
    `Calendra monthly plan prices: ${plans}.`,
    getPricingTaxNote(language),
    `Users included in the base price: ${catalog.includedUsers}.`,
    `Additional-user prices: ${userPrices}.`,
    `Annual billing charges ${catalog.annualBilledMonths} months for 12 months of use.`,
    "The free trial lasts 14 days with no credit card.",
  ].join(" ");
};
