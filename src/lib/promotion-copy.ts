import type { PublicPricingCatalog, PublicPricingPromotion } from "@/lib/pricing-catalog";
import {
  afterMonthsSl,
  firstMonthsEn,
  firstMonthsSl,
  formatPromotionDate,
  formatPromotionPercent,
  getPromotionEndDate,
  monthsEn,
  monthsSl,
} from "@/lib/promotion";
import type { SiteLanguage } from "@/lib/site-language";
import type { FaqItem } from "@/lib/faq";

/**
 * Black Friday copy, SL and EN, for /cenik (lazily loaded) and llms.txt. The code,
 * percentage, number of months, end date and every amount come from the app's
 * promotion object and price catalog. The banner and homepage lines are in
 * promotion.ts so the bundle every page loads does not carry this module.
 */
type Money = (amount: number) => string;

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const getPromotionCopy = (promotion: PublicPricingPromotion, language: SiteLanguage) => {
  const { code, discountedMonths: months, percentOff } = promotion;
  const percent = formatPromotionPercent(percentOff, language);
  const payPercent = formatPromotionPercent(100 - percentOff, language);
  const cut = `−${percent}`;
  const date = formatPromotionDate(promotion.validUntil, language);
  const half = percentOff === 50;

  if (language === "sl") {
    return {
      label: "Black Friday",
      percent, cut, date, code,
      offer: {
        badge: formatPromotionPercent(percentOff, language).replace(/\s?%$/, ""),
        headline: `Black Friday: ${firstMonthsSl(months)} ${half ? "za pol cene" : `s ${percent} popusta`}`,
        terms: `Ob registraciji vnesite kodo ${code} in ${firstMonthsSl(months)} plačujete ${payPercent} cene paketa. Za nove stranke, mesečni ali letni obračun. Dodatki po rednem ceniku, ${afterMonthsSl(months)} redna cena. Velja do ${date}.`,
        copy: "Kopiraj",
        copied: "Kopirano",
        copyLabel: `Kopiraj kodo ${code}`,
        copiedStatus: `Koda ${code} je kopirana.`,
        valid: `Velja do ${date}`,
      },
      card: {
        regularLabel: "Redna cena",
        promoLabel: `S kodo ${code}`,
        then: (regular: string) => `${firstMonthsSl(months)}, nato ${regular}`,
        thenYear: (regularAnnual: string) => `prvo leto s kodo, nato ${regularAnnual} na leto`,
      },
      calculator: {
        label: "Koda za popust",
        remove: "Odstrani",
        applied: `Koda ${code} je upoštevana: ${cut} na paket ${firstMonthsSl(months, true)}.`,
        rejected: "Te kode ne poznamo. Preverite zapis ali nadaljujte brez nje.",
        discount: `Black Friday popust (${cut} na paket, ${firstMonthsSl(months)})`,
        thenMonthly: (regularTotal: string) => `${capitalize(firstMonthsSl(months))}. Nato ${regularTotal} na mesec z DDV.`,
        thenAnnual: (regularTotal: string) => `Prvo leto s kodo. Nato ${regularTotal} na leto z DDV.`,
      },
    };
  }

  return {
    label: "Black Friday",
    percent, cut, date, code,
    offer: {
      badge: formatPromotionPercent(percentOff, language).replace(/%$/, ""),
      headline: half ? `Black Friday: your ${firstMonthsEn(months)} at half price` : `Black Friday: ${percent} off your ${firstMonthsEn(months)}`,
      terms: `Enter code ${code} when you sign up and pay ${payPercent} of the plan price for the ${firstMonthsEn(months)}. For new customers, monthly or yearly billing. Add-ons at regular prices; regular price after ${monthsEn(months)}. Valid until ${date}.`,
      copy: "Copy",
      copied: "Copied",
      copyLabel: `Copy code ${code}`,
      copiedStatus: `Code ${code} copied.`,
      valid: `Valid until ${date}`,
    },
    card: {
      regularLabel: "Regular price",
      promoLabel: `With code ${code}`,
      then: (regular: string) => `${firstMonthsEn(months)}, then ${regular}`,
      thenYear: (regularAnnual: string) => `first year with the code, then ${regularAnnual} a year`,
    },
    calculator: {
      label: "Discount code",
      remove: "Remove",
      applied: `Code ${code} applied: ${percent} off your plan for the ${firstMonthsEn(months, true)}.`,
      rejected: "We don't recognise this code. Check the spelling or continue without it.",
      discount: `Black Friday discount (${percent} off plan, ${firstMonthsEn(months)})`,
      thenMonthly: (regularTotal: string) => `${capitalize(firstMonthsEn(months))}. Then ${regularTotal} a month incl. VAT.`,
      thenAnnual: (regularTotal: string) => `First year with the code. Then ${regularTotal} a year incl. VAT.`,
    },
  };
};

export type PromotionCopy = ReturnType<typeof getPromotionCopy>;

/**
 * The three Black Friday questions shown first in the /cenik FAQ while the offer runs.
 * Client-only: they are never part of llms-full.txt or the prerendered page.
 */
export const getPromotionFaq = (
  promotion: PublicPricingPromotion,
  catalog: PublicPricingCatalog,
  language: SiteLanguage,
  money: Money,
): FaqItem[] => {
  const { code, discountedMonths: months, percentOff } = promotion;
  const date = formatPromotionDate(promotion.validUntil, language);
  const annualPercent = formatPromotionPercent(catalog.annualDiscountPercent, language);
  const fullMonths = 12 - months;
  const half = percentOff === 50;
  // The yearly example uses the highest plan the offer covers (Premium).
  const example = [...catalog.plans].reverse()
    .map((plan) => ({ plan, promo: promotion.plans.find((item) => item.key === plan.key) }))
    .find((item) => item.promo && item.promo.annualPrice < item.plan.annualGross);

  if (language === "sl") {
    const yearlyExample = example
      ? `, a je cena s kodo nižja: ${example.plan.nameSl || example.plan.name} ${money(example.promo!.annualPrice)} namesto ${money(example.plan.annualGross)} na leto brez DDV`
      : "";
    return [
      {
        question: "Kako uveljavim Black Friday popust?",
        answer: `Ob registraciji ali do ${date} v Nastavitve → Naročnina vnesite kodo ${code}. Najprej imate 14 dni brezplačnega preizkusa, popust pa velja za ${firstMonthsSl(months, true)}.`,
      },
      {
        question: "Ali popust velja tudi za letni obračun?",
        answer: `Da. Plačate ${monthsSl(months)} ${half ? "za pol cene" : `s ${formatPromotionPercent(percentOff, language)} popusta`}${fullMonths > 0 ? ` in ${monthsSl(fullMonths)} po polni ceni paketa` : ""}. Letni popust ${annualPercent} se ne sešteva${yearlyExample}.`,
      },
      {
        question: "Za kaj popust ne velja?",
        answer: "Za dodatne uporabnike, prostore, SMS sporočila in dodatne module, kot je davčna blagajna. Ponudba velja za nove stranke, enkrat na podjetje.",
      },
    ];
  }

  const yearlyExample = example
    ? `, but the code price is lower: ${example.plan.name} ${money(example.promo!.annualPrice)} instead of ${money(example.plan.annualGross)} a year excl. VAT`
    : "";
  return [
    {
      question: "How do I get the Black Friday discount?",
      answer: `Enter ${code} when you sign up, or by ${date} in Settings → Subscription. Your 14-day free trial comes first; the discount covers your ${firstMonthsEn(months, true)}.`,
    },
    {
      question: "Does it work with yearly billing?",
      answer: `Yes: ${monthsEn(months)} at ${half ? "half price" : `${formatPromotionPercent(percentOff, language)} off`}${fullMonths > 0 ? ` and ${fullMonths} at full price` : ""}. The ${annualPercent} yearly discount does not stack${yearlyExample}.`,
    },
    {
      question: "What is not discounted?",
      answer: "Extra users, rooms, SMS and add-on modules such as the fiscal cash register. New customers only, once per company.",
    },
  ];
};

/** The Key facts line in llms.txt and llms-full.txt while the build snapshot carries an offer. */
export const getPromotionLlmsFact = (
  promotion: PublicPricingPromotion,
  catalog: PublicPricingCatalog,
  language: SiteLanguage,
): string => {
  const { code, discountedMonths: months, percentOff } = promotion;
  const { year } = getPromotionEndDate(promotion.validUntil);
  const date = formatPromotionDate(promotion.validUntil, language);
  const percent = formatPromotionPercent(percentOff, language);
  const annualPercent = formatPromotionPercent(catalog.annualDiscountPercent, language);
  return language === "sl"
    ? `Ponudba Black Friday ${year}: s kodo ${code} nove stranke do ${date} dobijo ${percent} popusta na ceno paketa za ${firstMonthsSl(months, true)} (mesečni ali letni obračun; letni popust ${annualPercent} se ne sešteva; dodatki po rednem ceniku).`
    : `Black Friday ${year} offer: with code ${code}, new customers who sign up by ${date} get ${percent} off the plan price for their ${firstMonthsEn(months, true)} (monthly or yearly billing; does not stack with the ${annualPercent} yearly discount; add-ons at regular prices).`;
};
