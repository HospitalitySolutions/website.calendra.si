from pathlib import Path
import re

ROOT = Path.cwd()
changed = []
def read(name):
    return (ROOT / name).read_text(encoding='utf-8')
def put(name, text):
    path = ROOT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8')
    changed.append(name)
def replace(name, old, new):
    text = read(name)
    if text.count(old) != 1:
        raise RuntimeError(f'{name}: expected one occurrence of {old[:100]!r}, got {text.count(old)}')
    put(name, text.replace(old, new))

old = read('src/lib/public-pricing.ts')
types = old[old.index('export type PublicPricingPlanKey'):old.index('const fallbackFeatures:')]
types = types.replace('export const ADDITIONAL_USER_MONTHLY_GROSS = 5.9;\n\n', '')
fixture = old[old.index('const fallbackFeatures:'):old.index('const finiteMoney =')]
put('src/test/fixtures/public-pricing-snapshot.ts', '/* Synthetic test fixture only. Never imported by a production build. */\nimport type { PublicPricingFeature, PublicPricingCatalog } from "@/lib/pricing-catalog";\nconst ADDITIONAL_USER_MONTHLY_GROSS = 5.9;\n' + fixture + '\nexport const appPricingSnapshot = FALLBACK_PUBLIC_PRICING;\n')

put('src/lib/pricing-catalog.ts', types + r'''
/** Validate the app contract. Missing money is an error, never a local price. */
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
    return { key, name: text(feature.name, key), nameSl: text(feature.nameSl, text(feature.name, key)),
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
  if (!additionalUserRules.length || additionalUserRules[0].fromUser !== includedUsers + 1 || additionalUserRules.at(-1)?.toUser !== null) return fail("user rules must cover all additional users");
  additionalUserRules.forEach((rule, index) => {
    if (index && additionalUserRules[index - 1].toUser !== rule.fromUser - 1) fail("user rules overlap or contain gaps");
  });
  // An empty or absent add-on list does NOT resurrect discontinued website add-ons.
  const addOns: PublicPricingAddOn[] = array(raw.addOns ?? raw.addons ?? [], "addOns").map((item) => {
    const addOn = record(item, "addOn");
    const key = text(addOn.key ?? addOn.code ?? addOn.addOnCode);
    if (!key) return fail("addOn.key");
    return { key, code: text(addOn.code ?? addOn.addOnCode, key.toUpperCase().replace(/[^A-Z0-9]+/g, "_")),
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
    // Preserve the API's SMS unit precision; round totals, not unit prices.
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
''')

put('plugins/pricing-snapshot.ts', r'''import fs from "node:fs/promises";
import path from "node:path";
import { loadEnv, type Plugin, type ResolvedConfig } from "vite";
import { normalizePublicPricingCatalog } from "../src/lib/pricing-catalog";

/** Only an app-provided catalog may supply production prices. */
export const pricingSnapshotPlugin = (): Plugin => {
  const id = "virtual:app-pricing-snapshot";
  let config: ResolvedConfig;
  return {
    name: "calendra:app-pricing-snapshot",
    configResolved(resolved) { config = resolved; },
    resolveId(source) { return source === id ? `\0${id}` : undefined; },
    async load(source) {
      if (source !== `\0${id}`) return undefined;
      const env = loadEnv(config.mode, config.root, "VITE_");
      const base = (env.VITE_APP_BASE_URL || process.env.VITE_APP_BASE_URL || "https://app.calendra.si").replace(/\/+$/, "");
      const endpoint = `${base}/api/register/public-pricing`;
      const cachePath = path.join(config.root, ".calendra-cache", "app-pricing-snapshot.json");
      let catalog;
      if (config.build.ssr) {
        try {
          const saved = JSON.parse(await fs.readFile(cachePath, "utf8"));
          if (saved.endpoint === endpoint && Date.now() - saved.fetchedAt < 300_000) catalog = normalizePublicPricingCatalog(saved.catalog);
        } catch { /* A standalone SSR build fetches its own verified snapshot. */ }
      }
      if (!catalog) {
        const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15_000), cache: "no-store" });
        if (!response.ok) throw new Error(`App pricing unavailable (${response.status}); refusing to publish invented prices.`);
        catalog = normalizePublicPricingCatalog(await response.json());
        await fs.mkdir(path.dirname(cachePath), { recursive: true });
        await fs.writeFile(cachePath, JSON.stringify({ endpoint, fetchedAt: Date.now(), catalog }));
      }
      return `export const appPricingSnapshot = ${JSON.stringify(catalog)};`;
    },
  };
};
''')
put('src/types/app-pricing-snapshot.d.ts', 'declare module "virtual:app-pricing-snapshot" { export const appPricingSnapshot: unknown; }\n')
replace('vite.config.ts', 'import { blogManifestPlugin } from "./plugins/blog-manifest";', 'import { blogManifestPlugin } from "./plugins/blog-manifest";\nimport { pricingSnapshotPlugin } from "./plugins/pricing-snapshot";')
replace('vite.config.ts', '    blogManifestPlugin(),', '    blogManifestPlugin(),\n    pricingSnapshotPlugin(),')
replace('vitest.config.ts', 'alias: { "@": path.resolve(__dirname, "./src") },', 'alias: { "@": path.resolve(__dirname, "./src"), "virtual:app-pricing-snapshot": path.resolve(__dirname, "./src/test/fixtures/public-pricing-snapshot.ts") },')
put('.gitignore', read('.gitignore').rstrip() + '\n\n# Generated, verified application catalog; never a committed price list.\n.calendra-cache/\n')

put('src/lib/public-pricing.ts', r'''import { APP_BASE_URL } from "@/lib/site";
import { appPricingSnapshot } from "virtual:app-pricing-snapshot";
import { normalizePublicPricingCatalog, type PublicPricingCatalog } from "@/lib/pricing-catalog";
export * from "@/lib/pricing-catalog";

export const PUBLIC_PRICING_ENDPOINT = `${APP_BASE_URL}/api/register/public-pricing`;
export const PRICING_CATALOG_SCRIPT_ID = "calendra-pricing-catalog";
export const PRICING_CATALOG_UPDATED_EVENT = "calendra:pricing-catalog-updated";
export const APP_PRICING_SNAPSHOT = normalizePublicPricingCatalog(appPricingSnapshot);
/** Compatibility alias: this is fetched from the app at build time, NOT a local price table. */
export const FALLBACK_PUBLIC_PRICING = APP_PRICING_SNAPSHOT;
let initialCatalog: PublicPricingCatalog | undefined;
export const setPrerenderedPricingCatalog = (catalog: PublicPricingCatalog) => {
  initialCatalog = normalizePublicPricingCatalog(catalog);
};
export const getInitialPricingCatalog = (): PublicPricingCatalog => {
  if (initialCatalog) return initialCatalog;
  if (typeof document !== "undefined") {
    const island = document.getElementById(PRICING_CATALOG_SCRIPT_ID);
    if (island?.textContent) {
      try { initialCatalog = normalizePublicPricingCatalog(JSON.parse(island.textContent)); }
      catch { /* Retain the verified build snapshot, never make up missing prices. */ }
    }
  }
  initialCatalog ??= APP_PRICING_SNAPSHOT;
  return initialCatalog;
};
export const fetchPublicPricingCatalog = async (signal?: AbortSignal): Promise<PublicPricingCatalog> => {
  const response = await fetch(PUBLIC_PRICING_ENDPOINT, {
    method: "GET", headers: { Accept: "application/json" }, signal, credentials: "omit", cache: "no-cache",
  });
  if (!response.ok) throw new Error(`Pricing endpoint returned ${response.status}`);
  const catalog = normalizePublicPricingCatalog(await response.json());
  const changed = JSON.stringify(catalog) !== JSON.stringify(getInitialPricingCatalog());
  initialCatalog = catalog;
  if (changed && typeof window !== "undefined") window.dispatchEvent(new Event(PRICING_CATALOG_UPDATED_EVENT));
  return catalog;
};
''')
put('src/hooks/use-public-pricing-catalog.ts', r'''import { useEffect, useSyncExternalStore } from "react";
import { fetchPublicPricingCatalog, getInitialPricingCatalog, PRICING_CATALOG_UPDATED_EVENT } from "@/lib/public-pricing";
const subscribe = (notify: () => void) => {
  window.addEventListener(PRICING_CATALOG_UPDATED_EVENT, notify);
  return () => window.removeEventListener(PRICING_CATALOG_UPDATED_EVENT, notify);
};
export const usePublicPricingCatalog = () => {
  const catalog = useSyncExternalStore(subscribe, getInitialPricingCatalog, getInitialPricingCatalog);
  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicPricingCatalog(controller.signal).catch(() => { /* Keep the last verified app snapshot. */ });
    return () => controller.abort();
  }, []);
  return catalog;
};
''')

# The client build and prerender share one app snapshot: no source-code prices, no extra fetch race.
prerender = read('scripts/prerender.mjs')
prerender = prerender.replace('  normalizePublicPricingCatalog,', '  getInitialPricingCatalog,')
prerender = prerender.replace('  PUBLIC_PRICING_ENDPOINT,\n', '').replace('  setPrerenderedPricingCatalog,\n', '')
start = prerender.index('/**\n * Snapshot the live pricing catalog')
end = prerender.index('\nconst pricingBlock =', start)
prerender = prerender[:start] + '// The Vite build already obtained and validated this app-owned catalog.\nconst pricingCatalog = getInitialPricingCatalog();\n' + prerender[end:]
put('scripts/prerender.mjs', prerender)

# Remove obsolete dormant translation amounts as well as the app-price override.
p = 'src/components/landing/Pricing.tsx'
s = read(p)
s = re.sub(r'price: "[0-9]+,[0-9]+\s*€",', 'price: "",', s)
s = re.sub(r'price: "€[0-9]+\.[0-9]+",', 'price: "",', s)
s = re.sub(r'^\s*baseMonthly: [0-9]+(?:\.[0-9]+)?,\n', '', s, flags=re.M)
s = re.sub(r'usersHint: "[^"]*",', 'usersHint: "",', s)
s = re.sub(r'smsHint: "[^"]*",', 'smsHint: "",', s)
put(p, s)

p = 'src/pages/IndustryDetailPage.tsx'
s = read(p)
s = s.replace('import { ADDITIONAL_USER_MONTHLY_GROSS, FALLBACK_PUBLIC_PRICING } from "@/lib/public-pricing";', 'import { additionalUsersTotal } from "@/lib/public-pricing";\nimport { usePublicPricingCatalog } from "@/hooks/use-public-pricing-catalog";\nimport { getPricingTaxNote } from "@/lib/pricing-copy";')
s = s.replace('  const heroCtaRef = useRef<HTMLDivElement | null>(null);', '  const heroCtaRef = useRef<HTMLDivElement | null>(null);\n  const pricingCatalog = usePublicPricingCatalog();')
start = s.index('  // An illustrative quote from the same committed baseline')
end = s.index('  const legacyChildren:', start)
s = s[:start] + '''  const professionalPlan = pricingCatalog.plans.find((plan) => plan.key === "pro");
  const teamAdditionalUsers = professionalPlan ? Math.max(0, 5 - professionalPlan.includedUsers) : 0;
  const teamAdditionalCost = professionalPlan ? additionalUsersTotal(5, professionalPlan.includedUsers, pricingCatalog.additionalUserRules) : 0;
  const psychologyMonthlyExample = professionalPlan ? Math.round((professionalPlan.monthlyGross + teamAdditionalCost) * 100) / 100 : null;
  const formatEuro = (amount: number) => new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-IE", { style: "currency", currency: pricingCatalog.currency }).format(amount);
''' + s[end:]
s = s.replace('Profesionalno ${formatEuro(professionalPlan.monthlyGross)} + 4 dodatni uporabniki × ${formatEuro(ADDITIONAL_USER_MONTHLY_GROSS)}', '${professionalPlan.nameSl} ${formatEuro(professionalPlan.monthlyGross)} + dodatni uporabniki (${teamAdditionalUsers}): ${formatEuro(teamAdditionalCost)}')
s = s.replace('Professional ${formatEuro(professionalPlan.monthlyGross)} + 4 additional users × ${formatEuro(ADDITIONAL_USER_MONTHLY_GROSS)}', '${professionalPlan.name} ${formatEuro(professionalPlan.monthlyGross)} + additional users (${teamAdditionalUsers}): ${formatEuro(teamAdditionalCost)}')
s = s.replace('"Primer temelji na osnovnem ceniku; za najnovejše pogoje uporabite kalkulator na strani Cenik."', '`Primer uporablja cenik aplikacije. ${getPricingTaxNote(language, pricingCatalog.vatIncluded)} Končni obseg preverite v kalkulatorju.`')
s = s.replace('"Based on the published baseline catalog; check the pricing calculator for current terms."', '`This example uses the application catalog. ${getPricingTaxNote(language, pricingCatalog.vatIncluded)} Confirm your requirements in the pricing calculator.`')
if 'ADDITIONAL_USER_MONTHLY_GROSS' in s or 'FALLBACK_PUBLIC_PRICING' in s: raise RuntimeError('Industry still has a fixed-price dependency')
put(p, s)

# Legal text describes the rule and links to pricing, not a duplicate commercial catalog.
p = 'src/lib/legal-documents.ts'
s = read(p)
start = s.index('      section("4. Cene in DDV')
end = s.index('      section("5. Plačilo', start)
s = s[:start] + '''      section("4. Veljavni cenik in DDV", "4. Current pricing and VAT", [p("Veljavne cene paketov, dodatnih uporabnikov, SMS in modulov objavlja cenik, ki prejema podatke iz aplikacije Calendra. Ti pogoji ne določajo fiksnih zneskov ali lastne različice cenika. Za posamezno naročnino velja cena v podpisani pogodbi oziroma sprejeti ponudbi. Mesečne in letne zneske preverite ločeno v aktualnem ceniku.", "Current plan, additional-user, SMS and module prices are published in the price list supplied by the Calendra application. These Terms do not set fixed amounts or maintain a separate price table. The price in the signed agreement or accepted offer applies to an individual subscription. Check monthly and annual amounts separately in the current price list."), p("Od 1. novembra 2026 so objavljene B2B naročniške cene brez DDV; kadar je DDV uporaben, se prišteje glede na konkretno transakcijo. Javna sprememba cene ne prepiše že sprejetih cen ali predplačanega obdobja. Davčna obravnava predplačil in prehodnih računov sledi veljavnim pravilom.", "From 1 November 2026, published B2B subscription prices exclude VAT; applicable VAT is added according to the transaction. A public price change does not rewrite accepted prices or prepaid periods. Advance payments and transition invoices follow applicable tax rules.")], "ddv"),
''' + s[end:]
put(p, s)
replace('src/lib/legal-policy.ts', '  basicMonthlyNetFromNovember: 15.9,\n', '')
replace('src/components/legal/LegalPolicyPage.tsx', '  { key: "terms", sl: "Pogoji uporabe", en: "Terms of Service" },', '  { key: "pricing", sl: "Aktualni cenik", en: "Current pricing" },\n  { key: "terms", sl: "Pogoji uporabe", en: "Terms of Service" },')

# Support any app-provided tier structure in prose; do not claim every seat has the first rate.
p = 'src/lib/pricing-copy.ts'
s = read(p)
s = s.replace('  const additionalUserPrice = amount(catalog.additionalUserRules[0].monthlyGrossPerUser);', '''  const userPrices = catalog.additionalUserRules.map((rule) => language === "sl"
    ? `${rule.fromUser}–${rule.toUser ?? "∞"}: ${amount(rule.monthlyGrossPerUser)} / uporabnik / mesec`
    : `${rule.fromUser}–${rule.toUser ?? "∞"}: ${amount(rule.monthlyGrossPerUser)} / user / month`).join("; ");''')
s = s.replace('`Vsak dodatni uporabnik stane ${additionalUserPrice} mesečno.`', '`Cene dodatnih uporabnikov: ${userPrices}.`')
s = s.replace('`Each additional user costs ${additionalUserPrice} per month.`', '`Additional-user prices: ${userPrices}.`')
# The API's explicit exclusion flag must never be overwritten by website tax defaults.
s = s.replace('  if (!LEGAL.vatRegistered)', '  if (!vatIncluded) return language === "sl" ? "Cene ne vključujejo DDV." : "Prices exclude VAT.";\n  if (!LEGAL.vatRegistered)')
put(p, s)

# Remove stale monetary offers from the unrendered HTML shell; prerender adds verified offers.
p = 'index.html'
s = read(p)
def strip_offers(match):
    import json
    block = match.group(0)
    content = re.search(r'>([\s\S]*)</script>', block).group(1)
    try: obj = json.loads(content)
    except ValueError: return block
    def walk(value):
        if isinstance(value, dict):
            value.pop('offers', None)
            for item in value.values(): walk(item)
        elif isinstance(value, list):
            for item in value: walk(item)
    walk(obj)
    return block[:block.index('>') + 1] + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '</script>'
s = re.sub(r'<script\b[^>]*type="application/ld\+json"[^>]*>[\s\S]*?</script>', strip_offers, s)
put(p, s)
p = 'src/test/seo-completeness.test.ts'
s = read(p).replace('ENTRY_PLAN_MONTHLY_PRICE, ', '')
s = s.replace('it("advertises the same entry price as the pricing catalog",', 'it("does not invent an offer price before app-backed prerendering",')
s = s.replace('expect(html).toContain(`"price":"${ENTRY_PLAN_MONTHLY_PRICE}"`);', 'expect(html).not.toMatch(/"price"\\s*:/);')
put(p, s)

# Update tests which previously enforced the obsolete website override.
p = 'src/test/public-pricing.test.tsx'
s = read(p)
s = s.replace('  expect(page.querySelector(".pricing-control-header p")?.textContent).toContain(currency.format(5.9));\n  expect(page.querySelector(".pricing-control-header p")?.textContent).not.toContain(currency.format(3.9));', '  for (const rule of catalog.additionalUserRules) expect(page.querySelector(".pricing-control-header p")?.textContent).toContain(currency.format(rule.monthlyGrossPerUser));')
s = s.replace('expect(summary).toContain(`${decimal.format(5.9)} ${catalog.currency}`);', 'for (const rule of catalog.additionalUserRules) expect(summary).toContain(`${decimal.format(rule.monthlyGrossPerUser)} ${catalog.currency}`);')
s = s.replace('const additionalUserRule = [{ fromUser: 2, toUser: null, monthlyGrossPerUser: 5.9 }];\n', '')
start = s.index('describe("confirmed public pricing",')
end = s.index('describe("current public API snapshot",', start)
s = s[:start] + '''describe("app-owned pricing contract", () => {
  it("starts from an API snapshot rather than a production price table", () => {
    expect(getInitialPricingCatalog()).toEqual(FALLBACK_PUBLIC_PRICING);
  });
  it.each([legacyCatalog, apiCatalog])("preserves provider rates, including zero", (catalog) => {
    expect(normalizePublicPricingCatalog(catalog).additionalUserRules).toEqual(catalog.additionalUserRules);
  });
  it("sorts valid tiers without replacing their prices", () => {
    expect(normalizePublicPricingCatalog({ ...legacyCatalog, additionalUserRules: [...legacyCatalog.additionalUserRules].reverse() }).additionalUserRules).toEqual(legacyCatalog.additionalUserRules);
  });
  it("rejects missing or corrupt price fields instead of filling in website values", () => {
    for (const raw of [undefined, {}, { ...apiCatalog, additionalUserRules: undefined }, { ...apiCatalog, plans: [] }, { ...apiCatalog, smsPerMessageGross: null }]) expect(() => normalizePublicPricingCatalog(raw)).toThrow();
  });
  it("preserves empty add-ons, zero annual savings and SMS unit precision", () => {
    const result = normalizePublicPricingCatalog({ ...apiCatalog, addOns: [], annualSavingsMonths: 0, smsPerMessageGross: 0.0485, vatIncluded: false });
    expect(result.addOns).toEqual([]);
    expect(result.annualSavingsMonths).toBe(0);
    expect(result.smsPerMessageGross).toBe(0.0485);
    expect(result.vatIncluded).toBe(false);
  });
  it.each(["sl", "en"] as const)("uses the verified initial snapshot in %s", (language) => {
    setPrerenderedPricingCatalog(legacyCatalog);
    expectPublishedCatalog(language, legacyCatalog);
  });
});

''' + s[end:]
s = s.replace('expect(catalog.additionalUserRules).toEqual(additionalUserRule);', 'expect(catalog.additionalUserRules).toEqual(apiCatalog.additionalUserRules);')
s = s.replace('.mockResolvedValueOnce({ ok: true, json: async () => legacyCatalog })', '.mockResolvedValueOnce({ ok: true, json: async () => FALLBACK_PUBLIC_PRICING })')
# A valid last snapshot must also survive malformed successful HTTP responses.
s = s.replace('it.each(["HTTP", "network"] as const)', 'it.each(["HTTP", "network", "invalid catalog"] as const)')
s = s.replace('    else fetchMock.mockRejectedValueOnce(new TypeError("Network unavailable"));', '    else if (failure === "invalid catalog") fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) });\n    else fetchMock.mockRejectedValueOnce(new TypeError("Network unavailable"));')
s = s.replace('failure === "HTTP" ? "503" : "Network unavailable"', 'failure === "HTTP" ? "503" : failure === "invalid catalog" ? "Invalid app pricing catalog" : "Network unavailable"')
put(p, s)
p = 'src/test/psychology-visibility.test.ts'
s = read(p).replace('ADDITIONAL_USER_MONTHLY_GROSS, FALLBACK_PUBLIC_PRICING', 'additionalUsersTotal, FALLBACK_PUBLIC_PRICING')
s = s.replace('(5 - plan.includedUsers) * ADDITIONAL_USER_MONTHLY_GROSS', 'additionalUsersTotal(5, plan.includedUsers, FALLBACK_PUBLIC_PRICING.additionalUserRules)')
s = s.replace('same baseline catalog as pricing', 'same app-supplied catalog as pricing')
put(p, s)
p = 'src/test/legal-policy.test.tsx'
s = read(p)
s = s.replace('    expect(LEGAL_POLICY.basicMonthlyNetFromNovember).toBe(15.9);\n    expect(Math.round(LEGAL_POLICY.basicMonthlyNetFromNovember * 1.22 * 100) / 100).toBe(19.4);', '    expect(LEGAL_POLICY).not.toHaveProperty("basicMonthlyNetFromNovember");\n    const prices = LEGAL_DOCUMENTS.terms.sections.find((section) => section.id === "ddv");\n    expect(JSON.stringify(prices)).not.toMatch(/15[.,]90|17[.,]90|19[.,]40/);')
put(p, s)

put('docs/app-owned-website-pricing.md', '''# Application-owned website pricing

The application public endpoint `/api/register/public-pricing` is the only production price source. The website does not maintain package, additional-user, SMS or add-on prices.

- Vite obtains and validates the public application catalog before building. The client and SSR builds share that snapshot. A missing/invalid catalog blocks a new build rather than publishing fabricated amounts; the already deployed website is not affected.
- Prerendered prices and structured offers use the same verified snapshot. Visitors refresh the catalog through the existing public API. On refresh failure the last verified application snapshot is retained. Static crawler HTML requires a website rebuild to reflect later app changes.
- The application owns additional-user rates, including zero and tiers, annual prices, annual saving metadata, SMS precision and add-ons. Empty add-ons stay empty.
- Legal terms link to current pricing without repeating monetary amounts. Signed offers and existing contract prices are not modified.
- Psychology team examples derive the package and additional users from the same API and refresh on load. They are not a second price table.
- Numeric sample catalogs live only under `src/test/fixtures` and are resolved only by Vitest. No backend prices, invoices, VAT configuration, permissions or production settings are modified by this change.
- The source API currently exposes `vatIncluded`; tax labels must reflect the actual published app catalog. Ensure the app exposes the correct price/tax basis for the November VAT transition.
''')
print('Changed files:')
for name in sorted(set(changed)): print(name)
