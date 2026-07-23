import { APP_BASE_URL } from "@/lib/site";

export type PublicPricingPlanKey = "basic" | "pro" | "business";

export type PublicPricingPlan = {
  key: PublicPricingPlanKey;
  packageCode: "BASIC" | "PROFESSIONAL" | "PREMIUM";
  name: string;
  nameSl: string;
  monthlyGross: number;
  annualGross: number;
  includedUsers: number;
  popular: boolean;
  featureKeys: string[];
};

export type PublicPricingFeature = {
  key: string;
  name: string;
  nameSl: string;
  description: string;
  descriptionSl: string;
  minimumPlan: PublicPricingPlanKey;
  includedPlans: PublicPricingPlanKey[];
};

export type PublicAdditionalUserRule = {
  fromUser: number;
  toUser: number | null;
  monthlyGrossPerUser: number;
};

export type PublicPricingAddOn = {
  key: string;
  code: string;
  name: string;
  nameSl: string;
  description: string;
  descriptionSl: string;
  monthlyGross: number;
  availablePlans: PublicPricingPlanKey[];
};

export type PublicPricingCatalog = {
  catalogVersion: number;
  currency: "EUR" | string;
  vatIncluded: boolean;
  includedUsers: number;
  annualBilledMonths: number;
  annualSavingsMonths: number;
  plans: PublicPricingPlan[];
  features: PublicPricingFeature[];
  additionalUserRules: PublicAdditionalUserRule[];
  addOns: PublicPricingAddOn[];
  smsPerMessageGross: number;
};

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
      monthlyGross: 34.9,
      annualGross: 349,
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
      monthlyGross: 54.9,
      annualGross: 549,
      includedUsers: 1,
      popular: true,
      featureKeys: fallbackFeatures
        .filter((feature) => feature.includedPlans.includes("business"))
        .map((feature) => feature.key),
    },
  ],
  features: fallbackFeatures,
  additionalUserRules: [
    { fromUser: 2, toUser: 5, monthlyGrossPerUser: 9.9 },
    { fromUser: 6, toUser: null, monthlyGrossPerUser: 6.9 },
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

const finiteMoney = (value: unknown, fallback: number) => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0
    ? Math.round(number * 100) / 100
    : fallback;
};

const text = (value: unknown, fallback: string) => {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
};

const isPlanKey = (value: unknown): value is PublicPricingPlanKey =>
  value === "basic" || value === "pro" || value === "business";

const planRank: Record<PublicPricingPlanKey, number> = {
  basic: 0,
  pro: 1,
  business: 2,
};

export const normalizePublicPricingCatalog = (
  raw: Partial<PublicPricingCatalog> | null | undefined,
): PublicPricingCatalog => {
  if (!raw) return FALLBACK_PUBLIC_PRICING;

  const fallbackPlans = new Map(
    FALLBACK_PUBLIC_PRICING.plans.map((plan) => [plan.key, plan]),
  );
  const incomingPlans = Array.isArray(raw.plans) ? raw.plans : [];
  const plans = (["basic", "pro", "business"] as const).map((key) => {
    const fallback = fallbackPlans.get(key)!;
    const incoming = incomingPlans.find((plan) => plan?.key === key);
    return {
      key,
      packageCode: fallback.packageCode,
      name: text(incoming?.name, fallback.name),
      nameSl: text(incoming?.nameSl, fallback.nameSl),
      monthlyGross: finiteMoney(incoming?.monthlyGross, fallback.monthlyGross),
      annualGross: finiteMoney(incoming?.annualGross, fallback.annualGross),
      includedUsers: Math.max(
        1,
        Math.trunc(Number(incoming?.includedUsers) || fallback.includedUsers),
      ),
      popular: Boolean(incoming?.popular ?? fallback.popular),
      featureKeys: Array.isArray(incoming?.featureKeys)
        ? incoming.featureKeys.map(String).filter(Boolean)
        : fallback.featureKeys,
    } satisfies PublicPricingPlan;
  });

  const features = Array.isArray(raw.features)
    ? raw.features
        .map((feature, index): PublicPricingFeature | null => {
          if (!feature) return null;
          const key = text(feature.key, `feature-${index + 1}`);
          const minimumPlan = isPlanKey(feature.minimumPlan)
            ? feature.minimumPlan
            : "pro";
          const includedPlans = Array.isArray(feature.includedPlans)
            ? feature.includedPlans.filter(isPlanKey)
            : [];
          return {
            key,
            name: text(feature.name, key),
            nameSl: text(feature.nameSl, text(feature.name, key)),
            description: text(feature.description, ""),
            descriptionSl: text(
              feature.descriptionSl,
              text(feature.description, ""),
            ),
            minimumPlan,
            includedPlans:
              includedPlans.length > 0
                ? includedPlans
                : (["basic", "pro", "business"] as const).filter((plan) => {
                    const rank = { basic: 0, pro: 1, business: 2 };
                    return rank[plan] >= rank[minimumPlan];
                  }),
          };
        })
        .filter((feature): feature is PublicPricingFeature => feature !== null)
    : FALLBACK_PUBLIC_PRICING.features;

  const rules = Array.isArray(raw.additionalUserRules)
    ? raw.additionalUserRules
        .map((rule): PublicAdditionalUserRule | null => {
          if (!rule) return null;
          const fromUser = Math.max(2, Math.trunc(Number(rule.fromUser) || 2));
          const toValue = rule.toUser == null ? null : Math.trunc(Number(rule.toUser));
          const toUser = toValue != null && toValue >= fromUser ? toValue : null;
          return {
            fromUser,
            toUser,
            monthlyGrossPerUser: finiteMoney(rule.monthlyGrossPerUser, 0),
          };
        })
        .filter((rule): rule is PublicAdditionalUserRule => rule !== null)
    : FALLBACK_PUBLIC_PRICING.additionalUserRules;

  const rawRecord = raw as Record<string, unknown>;
  const incomingAddOns = Array.isArray(rawRecord.addOns)
    ? rawRecord.addOns
    : Array.isArray(rawRecord.addons)
      ? rawRecord.addons
      : [];

  const addOns = incomingAddOns
    .map((item, index): PublicPricingAddOn | null => {
      if (!item || typeof item !== "object") return null;
      const addOn = item as Record<string, unknown>;
      const fallbackKey = `addon-${index + 1}`;
      const key = text(addOn.key ?? addOn.code ?? addOn.addOnCode, fallbackKey)
        .replace(/\s+/g, "-")
        .toLowerCase();
      const code = text(addOn.code ?? addOn.key ?? addOn.addOnCode, key)
        .replace(/\s+/g, "_")
        .toUpperCase();
      const name = text(addOn.name ?? addOn.title, key);
      const nameSl = text(addOn.nameSl ?? addOn.titleSl ?? addOn.name, name);
      const description = text(addOn.description, "");
      const descriptionSl = text(addOn.descriptionSl ?? addOn.description, "");
      const monthlyGross = finiteMoney(
        addOn.monthlyGross ?? addOn.priceGross ?? addOn.monthlyPriceGross ?? addOn.monthlyPrice ?? addOn.price,
        0,
      );

      const availablePlansSource = Array.isArray(addOn.availablePlans)
        ? addOn.availablePlans
        : Array.isArray(addOn.includedPlans)
          ? addOn.includedPlans
          : Array.isArray(addOn.eligiblePlans)
            ? addOn.eligiblePlans
            : [];
      const availablePlans = availablePlansSource.filter(isPlanKey);
      const minimumPlan = isPlanKey(addOn.minimumPlan) ? addOn.minimumPlan : "basic";

      return {
        key,
        code,
        name,
        nameSl,
        description,
        descriptionSl,
        monthlyGross,
        availablePlans:
          availablePlans.length > 0
            ? availablePlans
            : (["basic", "pro", "business"] as const).filter((plan) => planRank[plan] >= planRank[minimumPlan]),
      } satisfies PublicPricingAddOn;
    })
    .filter((addOn): addOn is PublicPricingAddOn => addOn !== null);

  return {
    catalogVersion: Math.max(1, Math.trunc(Number(raw.catalogVersion) || 2)),
    currency: text(raw.currency, "EUR"),
    vatIncluded: raw.vatIncluded !== false,
    includedUsers: Math.max(1, Math.trunc(Number(raw.includedUsers) || 1)),
    annualBilledMonths: Math.max(
      1,
      Math.trunc(Number(raw.annualBilledMonths) || 10),
    ),
    annualSavingsMonths: Math.max(
      0,
      Math.trunc(Number(raw.annualSavingsMonths) || 2),
    ),
    plans,
    features,
    additionalUserRules: rules.length
      ? rules
      : FALLBACK_PUBLIC_PRICING.additionalUserRules,
    addOns: addOns.length ? addOns : FALLBACK_PUBLIC_PRICING.addOns,
    smsPerMessageGross: finiteMoney(
      raw.smsPerMessageGross,
      FALLBACK_PUBLIC_PRICING.smsPerMessageGross,
    ),
  };
};

export const fetchPublicPricingCatalog = async (
  signal?: AbortSignal,
): Promise<PublicPricingCatalog> => {
  const response = await fetch(`${APP_BASE_URL}/api/register/public-pricing`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error(`Pricing endpoint returned ${response.status}`);
  }

  return normalizePublicPricingCatalog(
    (await response.json()) as Partial<PublicPricingCatalog>,
  );
};
