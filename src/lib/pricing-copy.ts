import { getInitialPricingCatalog, type PublicPricingCatalog } from "@/lib/public-pricing";
import type { SiteLanguage } from "@/lib/site-language";
import { LEGAL } from "@/lib/legal";

export const getPricingTaxNote = (language: SiteLanguage, vatIncluded = true): string => {
  if (!LEGAL.vatRegistered) return language === "sl"
    ? "DDV se ne obračunava. Ponudnik ni zavezanec za DDV."
    : "VAT is not charged. The provider is not VAT registered.";
  return language === "sl"
    ? vatIncluded ? "Cene vključujejo DDV." : "Cene ne vključujejo DDV."
    : vatIncluded ? "Prices include VAT." : "Prices exclude VAT.";
};

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
  const additionalUserPrice = amount(catalog.additionalUserRules[0].monthlyGrossPerUser);

  if (language === "sl") {
    return [
      `Mesečne cene paketov Calendra: ${plans}.`,
      getPricingTaxNote(language, catalog.vatIncluded),
      `Število uporabnikov v osnovni ceni: ${catalog.includedUsers}.`,
      `Vsak dodatni uporabnik stane ${additionalUserPrice} mesečno.`,
      `Pri letnem plačilu plačate ${catalog.annualBilledMonths} mesecev za 12 mesecev uporabe.`,
      "Brezplačni preizkus traja 14 dni brez kreditne kartice.",
    ].join(" ");
  }

  return [
    `Calendra monthly plan prices: ${plans}.`,
    getPricingTaxNote(language, catalog.vatIncluded),
    `Users included in the base price: ${catalog.includedUsers}.`,
    `Each additional user costs ${additionalUserPrice} per month.`,
    `Annual billing charges ${catalog.annualBilledMonths} months for 12 months of use.`,
    "The free trial lasts 14 days with no credit card.",
  ].join(" ");
};
