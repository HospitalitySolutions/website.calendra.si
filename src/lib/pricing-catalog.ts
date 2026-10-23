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
export type PublicAdditionalUserRule = { fromUser: number; toUser: number | null; monthlyGrossPerUser: number };
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
  currency: string;
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

/** Missing monetary fields are errors, never instructions to invent a website price. */
const fail = (field: string): never => { throw new Error(`Invalid app pricing catalog: ${field}`); };
const record = (value: unknown, field: string): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : fail(field);
const money = (value: unknown, field: string): number => {
  if ((typeof value !== "number" && typeof value !== "string") || String(value).trim() === "") return fail(field);
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : fail(field);
};
const integer = (value: unknown, field: string, min = 0): number => {
  const number = money(value, field);
  return Number.isSafeInteger(number) && number >= min ? number : fail(field);
};
const text = (value: unknown, fallback = ""): string => typeof value === "string" ? value.trim() || fallback : fallback;
const array = (value: unknown, field: string): unknown[] => Array.isArray(value) ? value : fail(field);
const isPlanKey = (value: unknown): value is PublicPricingPlanKey => value === "basic" || value === "pro" || value === "business";
const keys = ["basic", "pro", "business"] as const;
const codes = { basic: "BASIC", pro: "PROFESSIONAL", business: "PREMIUM" } as const;

export const normalizePublicPricingCatalog = (input: unknown): PublicPricingCatalog => {
  const raw = record(input, "root");
  const currency = text(raw.currency);
  if (!/^[A-Z]{3}$/.test(currency)) return fail("currency");
  if (typeof raw.vatIncluded !== "boolean") return fail("vatIncluded");
  const includedUsers = integer(raw.includedUsers, "includedUsers", 1);
  const incoming = array(raw.plans, "plans").map((item) => record(item, "plan"));
  if (incoming.length !== keys.length || new Set(incoming.map((item) => item.key)).size !== keys.length) return fail("plans: expected one of each supported plan");
  const plans: PublicPricingPlan[] = keys.map((key) => {
    const plan = incoming.find((item) => item.key === key);
    if (!plan) return fail(`plans.${key}`);
    return {
      key, packageCode: codes[key], name: text(plan.name, key), nameSl: text(plan.nameSl, text(plan.name, key)),
      monthlyGross: money(plan.monthlyGross, `${key}.monthlyGross`),
      annualGross: money(plan.annualGross, `${key}.annualGross`),
      includedUsers: integer(plan.includedUsers, `${key}.includedUsers`, 1),
      popular: plan.popular === true,
      featureKeys: Array.isArray(plan.featureKeys) ? plan.featureKeys.map(String) : [],
    };
  });
  const features: PublicPricingFeature[] = array(raw.features, "features").map((item) => {
    const feature = record(item, "feature");
    const key = text(feature.key);
    if (!key || !isPlanKey(feature.minimumPlan)) return fail("feature key/minimumPlan");
    return {
      key, name: text(feature.name, key), nameSl: text(feature.nameSl, text(feature.name, key)),
      description: text(feature.description), descriptionSl: text(feature.descriptionSl, text(feature.description)),
      minimumPlan: feature.minimumPlan,
      includedPlans: array(feature.includedPlans, "feature.includedPlans").filter(isPlanKey),
    };
  });
  const additionalUserRules: PublicAdditionalUserRule[] = array(raw.additionalUserRules, "additionalUserRules").map((item) => {
    const rule = record(item, "user rule");
    const fromUser = integer(rule.fromUser, "fromUser", 1);
    const toUser = rule.toUser === null ? null : integer(rule.toUser, "toUser", fromUser);
    return { fromUser, toUser, monthlyGrossPerUser: money(rule.monthlyGrossPerUser, "monthlyGrossPerUser") };
  }).sort((a, b) => a.fromUser - b.fromUser);
  if (!additionalUserRules.length || additionalUserRules[0].fromUser !== includedUsers + 1 || additionalUserRules[additionalUserRules.length - 1].toUser !== null) return fail("user rules must cover all additional users");
  additionalUserRules.forEach((rule, index) => {
    if (index && additionalUserRules[index - 1].toUser !== rule.fromUser - 1) fail("user rules overlap or contain gaps");
  });
  // Empty/absent add-ons must not resurrect discontinued website add-ons.
  const addOns: PublicPricingAddOn[] = array(raw.addOns ?? raw.addons ?? [], "addOns").map((item) => {
    const addOn = record(item, "addOn");
    const key = text(addOn.key ?? addOn.code ?? addOn.addOnCode);
    if (!key) return fail("addOn.key");
    return {
      key, code: text(addOn.code ?? addOn.addOnCode, key.toUpperCase().replace(/[^A-Z0-9]+/g, "_")),
      name: text(addOn.name ?? addOn.title, key), nameSl: text(addOn.nameSl ?? addOn.titleSl, text(addOn.name ?? addOn.title, key)),
      description: text(addOn.description), descriptionSl: text(addOn.descriptionSl, text(addOn.description)),
      monthlyGross: money(addOn.monthlyGross ?? addOn.priceGross ?? addOn.monthlyPriceGross ?? addOn.monthlyPrice ?? addOn.price, "addOn.monthlyGross"),
      availablePlans: array(addOn.availablePlans ?? addOn.includedPlans ?? addOn.eligiblePlans ?? [], "addOn.availablePlans").filter(isPlanKey),
    };
  });
  return {
    catalogVersion: integer(raw.catalogVersion, "catalogVersion", 1), currency, vatIncluded: raw.vatIncluded,
    includedUsers, annualBilledMonths: integer(raw.annualBilledMonths, "annualBilledMonths", 1),
    annualSavingsMonths: integer(raw.annualSavingsMonths, "annualSavingsMonths"),
    plans, features, additionalUserRules, addOns,
    // Preserve SMS unit precision. Currency rounding belongs on totals, not units.
    smsPerMessageGross: money(raw.smsPerMessageGross, "smsPerMessageGross"),
  };
};

export const additionalUsersTotal = (users: number, included: number, rules: PublicAdditionalUserRule[]): number => {
  let total = 0;
  for (let user = included + 1; user <= users; user++) {
    const rule = rules.find((item) => user >= item.fromUser && (item.toUser === null || user <= item.toUser));
    if (!rule) return fail(`missing price for user ${user}`);
    total += rule.monthlyGrossPerUser;
  }
  return Math.round(total * 100) / 100;
};
