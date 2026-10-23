/* Synthetic test fixture only. Never imported by a production build. */
import type { PublicPricingFeature, PublicPricingCatalog } from "@/lib/pricing-catalog";
const ADDITIONAL_USER_MONTHLY_GROSS = 5.9;
const fallbackFeatures: PublicPricingFeature[] = [
  {
    key: "appointments",
    name: "Unlimited appointments",
    nameSl: "Neomejeno terminov",
    description: "Accept bookings without monthly caps.",
    descriptionSl: "Sprejemajte rezervacije brez mesečne omejitve.",
    minimumPlan: "basic",
    includedPlans: ["basic", "pro", "business"],
  },
  {
    key: "staff",
    name: "Team members",
    nameSl: "Člani ekipe",
    description: "Manage staff schedules and availability.",
    descriptionSl: "Upravljajte urnike in razpoložljivost osebja.",
    minimumPlan: "basic",
    includedPlans: ["basic", "pro", "business"],
  },
  {
    key: "group",
    name: "Group bookings",
    nameSl: "Skupinske rezervacije",
    description: "Classes, workshops, and shared capacity.",
    descriptionSl: "Tečaji, delavnice in deljene kapacitete.",
    minimumPlan: "pro",
    includedPlans: ["pro", "business"],
  },
  {
    key: "resources",
    name: "Resource scheduling",
    nameSl: "Razporeditev virov",
    description: "Schedule rooms, equipment, and other resources.",
    descriptionSl: "Razporejajte prostore, opremo in druge vire.",
    minimumPlan: "pro",
    includedPlans: ["pro", "business"],
  },
  {
    key: "payments",
    name: "Online payments",
    nameSl: "Spletna plačila",
    description: "Collect deposits and prepayments while booking.",
    descriptionSl: "Prejemajte akontacije in predplačila ob rezervaciji.",
    minimumPlan: "pro",
    includedPlans: ["pro", "business"],
  },
  {
    key: "reminders",
    name: "SMS and email reminders",
    nameSl: "SMS in e-poštni opomniki",
    description: "Reduce no-shows with automatic reminders.",
    descriptionSl: "Z avtomatskimi opomniki zmanjšajte število neprihodov.",
    minimumPlan: "pro",
    includedPlans: ["pro", "business"],
  },
  {
    key: "ai",
    name: "AI booking assistant",
    nameSl: "AI pomočnik za rezervacije",
    description: "Voice booking and intelligent scheduling help.",
    descriptionSl: "Glasovne rezervacije in pametna pomoč pri urniku.",
    minimumPlan: "pro",
    includedPlans: ["pro", "business"],
  },
  {
    key: "integrations",
    name: "Integrations",
    nameSl: "Integracije",
    description: "Connect calendars, meetings, payments, and automations.",
    descriptionSl: "Povežite koledarje, sestanke, plačila in avtomatizacije.",
    minimumPlan: "pro",
    includedPlans: ["pro", "business"],
  },
  {
    key: "reporting",
    name: "Advanced reporting",
    nameSl: "Napredno poročanje",
    description: "Revenue, utilization, and booking analytics.",
    descriptionSl: "Analitika prihodkov, izkoriščenosti in rezervacij.",
    minimumPlan: "business",
    includedPlans: ["business"],
  },
  {
    key: "multilocation",
    name: "Multi-location support",
    nameSl: "Več lokacij",
    description: "Manage multiple branches from one account.",
    descriptionSl: "Upravljajte več poslovalnic iz enega računa.",
    minimumPlan: "business",
    includedPlans: ["business"],
  },
];

export const FALLBACK_PUBLIC_PRICING: PublicPricingCatalog = {
  catalogVersion: 2,
  currency: "EUR",
  vatIncluded: true,
  includedUsers: 1,
  annualBilledMonths: 10,
  annualSavingsMonths: 2,
  plans: [
    {
      key: "basic",
      packageCode: "BASIC",
      name: "Basic",
      nameSl: "Osnovno",
      monthlyGross: 17.9,
      annualGross: 179,
      includedUsers: 1,
      popular: false,
      featureKeys: fallbackFeatures
        .filter((feature) => feature.includedPlans.includes("basic"))
        .map((feature) => feature.key),
    },
    {
      key: "pro",
      packageCode: "PROFESSIONAL",
      name: "Professional",
      nameSl: "Profesionalno",
      monthlyGross: 28.9,
      annualGross: 289,
      includedUsers: 1,
      popular: false,
      featureKeys: fallbackFeatures
        .filter((feature) => feature.includedPlans.includes("pro"))
        .map((feature) => feature.key),
    },
    {
      key: "business",
      packageCode: "PREMIUM",
      name: "Premium",
      nameSl: "Premium",
      monthlyGross: 47.9,
      annualGross: 479,
      includedUsers: 1,
      popular: true,
      featureKeys: fallbackFeatures
        .filter((feature) => feature.includedPlans.includes("business"))
        .map((feature) => feature.key),
    },
  ],
  features: fallbackFeatures,
  additionalUserRules: [
    { fromUser: 2, toUser: null, monthlyGrossPerUser: ADDITIONAL_USER_MONTHLY_GROSS },
  ],
  addOns: [
    {
      key: "fiscal-cash-register",
      code: "FISCAL_CASH_REGISTER",
      name: "Fiscal cash register",
      nameSl: "Davčna blagajna",
      description: "Fiscalisation add-on for compliant invoicing.",
      descriptionSl: "Dodatek za davčno potrjevanje računov.",
      monthlyGross: 9.9,
      availablePlans: ["basic", "pro", "business"],
    },
    {
      key: "business-premises",
      code: "BUSINESS_PREMISES",
      name: "Business premises",
      nameSl: "Poslovni prostor",
      description: "Manage business premises and related setup.",
      descriptionSl: "Upravljanje poslovnega prostora in povezanih nastavitev.",
      monthlyGross: 19.9,
      availablePlans: ["pro", "business"],
    },
  ],
  smsPerMessageGross: 0.05,
};


export const appPricingSnapshot = FALLBACK_PUBLIC_PRICING;
