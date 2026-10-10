import { getRelatedPages } from "@/lib/related-pages";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { buildPackageSignupRoute, type PricingSignupSummary } from "@/lib/routes";
import { LEGAL } from "@/lib/legal";
import { getPricingTaxNote } from "@/lib/pricing-copy";
import { useInquiry } from "@/lib/use-inquiry";
import { getFaqForRoute } from "@/lib/faq";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { getRoutePath, sitemapRouteMetadata } from "@/lib/localized-routes";
import { getCustomerStory, getCustomerStoryPath } from "@/lib/customer-stories";
import { ArrowRight, CalendarDays, Check, CreditCard, Link2, Minus, Plus, Quote, Receipt, Star, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  fetchPublicPricingCatalog,
  getInitialPricingCatalog,
  type PublicAdditionalUserRule,
  type PublicPricingAddOn,
  type PublicPricingCatalog,
  type PublicPricingFeature,
  type PublicPricingPlanKey,
} from "@/lib/public-pricing";

type CellValue = boolean | string;
type PlanKey = "basic" | "professional" | "premium" | "enterprise";
type BillingPeriod = "monthly" | "annual";

type Tier = {
  key: PlanKey;
  name: string;
  price: string;
  priceSuffix?: string;
  baseMonthly?: number;
  description: string;
  features: string[];
  popular?: boolean;
  accent?: boolean;
  cta: string;
};

type TranslationSet = {
  badge: string;
  sectionEyebrow: string;
  sectionTitle: string;
  standaloneTitle: string;
  sectionDescription: string;
  comparisonTitle: string;
  comparisonHeader: string;
  calculatorTitle: string;
  calculatorDescription: string;
  packageSelectorTitle: string;
  addOnsTitle: string;
  billingMonthlyLabel: string;
  billingAnnualLabel: string;
  billingAnnualSavingsLabel: string;
  enterprisePanelTitle: string;
  enterprisePanelDescription: string;
  enterprisePanelCta: string;
  enterprisePanelResponse: string;
  usersLabel: string;
  usersHint: string;
  usersCountLabel: string;
  smsLabel: string;
  smsHint: string;
  smsCountLabel: string;
  optionsLabel: string;
  optionFiscal: string;
  optionPremises: string;
  monthlyLabel: string;
  summaryTitle: string;
  selectedPackageLabel: string;
  selectedItemsLabel: string;
  noExtras: string;
  continueToRegister: string;
  enterpriseCta: string;
  contactTitle: string;
  contactDescription: string;
  contactCompany: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactMessage: string;
  contactMessagePlaceholder: string;
  sendInquiry: string;
  directEmail: string;
  directEmailLabel: string;
  comparisonRows: Array<{ label: string; values: CellValue[] }>;
  tiers: Tier[];
};

const translations: Record<SiteLanguage, TranslationSet> = {
  sl: {
    badge: "Priljubljeno",
    sectionEyebrow: "Cenik",
    sectionTitle: "Enostavno & transparentno",
    standaloneTitle: "Cenik programa za naročanje strank Calendra",
    sectionDescription: "Izberite paket, ki najbolj ustreza vašemu poslovanju.",
    comparisonTitle: "Primerjava paketov",
    comparisonHeader: "Funkcionalnost",
    calculatorTitle: "Izračunajte svoj mesečni paket",
    calculatorDescription: "Izberite paket, nastavite dodatne uporabnike in SMS sporočila ter vključite dodatne module.",
    packageSelectorTitle: "1. Izberite paket",
    addOnsTitle: "Dodatne možnosti",
    billingMonthlyLabel: "Mesečno",
    billingAnnualLabel: "Letno",
    billingAnnualSavingsLabel: "Pri letnem obračunu prihranite {months} meseca",
    enterprisePanelTitle: "Za večje ekipe ali posebne zahteve",
    enterprisePanelDescription: "Enterprise paket prilagodimo vašemu poslovanju.",
    enterprisePanelCta: "Pošljite povpraševanje",
    enterprisePanelResponse: "Skupaj določimo naslednje korake.",
    usersLabel: "2. Uporabniki",
    usersHint: "Vsak dodatni uporabnik: 5,90 € / mesec",
    usersCountLabel: "uporabnikov",
    smsLabel: "3. Dodatna SMS sporočila",
    smsHint: "Vsako dodatno SMS sporočilo: 0,06€",
    smsCountLabel: "SMS sporočil",
    optionsLabel: "4. Dodatni moduli",
    optionFiscal: "Davčna blagajna",
    optionPremises: "Poslovni prostor",
    monthlyLabel: "Mesečno skupaj",
    summaryTitle: "Povzetek izbire",
    selectedPackageLabel: "Izbran paket",
    selectedItemsLabel: "Izbrane možnosti",
    noExtras: "Brez dodatnih modulov",
    continueToRegister: "Nadaljuj na registracijo",
    enterpriseCta: "Kontaktirajte nas",
    contactTitle: "Kontaktni obrazec za Enterprise ali prilagojeno ponudbo",
    contactDescription: "Izpolnite spodnji obrazec in pripravili bomo ponudbo glede na vaše potrebe.",
    contactCompany: "Podjetje",
    contactName: "Ime in priimek",
    contactEmail: "E-pošta",
    contactPhone: "Telefon",
    contactMessage: "Sporočilo",
    contactMessagePlaceholder: "Opišite svoje potrebe, lokacije, število uporabnikov ali posebne zahteve.",
    sendInquiry: "Pošlji povpraševanje",
    directEmail: "Lahko nam tudi pišete neposredno na",
    directEmailLabel: "E-pošta",
    comparisonRows: [
      { label: "Koledar", values: [true, true, true, true] },
      { label: "Pregled strank", values: [true, true, true, true] },
      { label: "Analitika", values: [true, true, true, true] },
      { label: "E-mail sporočanje", values: ["Enosmerno", "Dvosmerno", "Dvosmerno", "Dvosmerno"] },
      { label: "Podpora", values: ["E-mail", "Telefon", "Prioritetna", "Account Manager"] },
      { label: "Shranjevanje datotek v oblak", values: [false, "do 2GB", true, true] },
      { label: "Izdajanje računov", values: [false, true, true, true] },
      { label: "SMS sporočanje", values: [false, true, true, true] },
      { label: "Whatsapp sporočanje", values: [false, "Enosmerno", "Dvosmerno", "Dvosmerno"] },
      { label: "AI pomočnik", values: [false, false, false, true] },
      { label: "Prostori", values: [false, false, true, true] },
    ],
    tiers: [
      {
        key: "basic",
        name: "Osnovno",
        price: "14,90€",
        priceSuffix: "/ mesec",
        baseMonthly: 14.9,
        description: "Za posameznike, ki začenjajo.",
        features: [
          "1 uporabnik (možen dokup dodatnih)",
          "Koledar",
          "Pregled strank",
          "Analitika",
          "Enosmerno e-mail sporočanje",
          "30-minutni predstavitveni klic",
          "E-poštna podpora",
        ],
        cta: "Izberi Osnovno",
      },
      {
        key: "professional",
        name: "Profesionalno",
        price: "24,90€",
        priceSuffix: "/ mesec",
        baseMonthly: 24.9,
        description: "Za rastoča podjetja.",
        features: [
          "Vse iz osnovnega paketa +",
          "Shranjevanje datotek v oblak (do 2GB)",
          "Izdajanje računov",
          "Masovna SMS sporočila",
          "Enosmerno SMS sporočanje (plačilo po porabi)",
          "Enosmerno Whatsapp sporočanje (plačilo po porabi)",
          "Telefonska podpora",
        ],
        cta: "Izberi Profesionalno",
      },
      {
        key: "premium",
        name: "Premium",
        price: "39,90€",
        priceSuffix: "/ mesec",
        baseMonthly: 39.9,
        description: "Vse funkcionalnosti za zahtevne.",
        features: [
          "Vse iz profesionalnega paketa +",
          "Neomejeno shranjevanje datotek v oblak",
          "CSV uvoz TRR računov",
          "Dvosmerno sporočanje (e-mail, Whatsapp)",
          "AI glasovni pomočnik za rezervacije",
          "Prostori in naprave",
          "Prioritetna podpora",
        ],
        popular: true,
        accent: true,
        cta: "Izberi Premium",
      },
      {
        key: "enterprise",
        name: "Enterprise",
        price: "Po meri",
        description: "Za manjša in večja podjetja s specifičnimi zahtevami.",
        features: [
          "Neomejeno uporabnikov",
          "Neomejeno lokacij",
          "Razvoj po meri",
          "Integracija z drugimi orodji",
          "Treningi v živo ali preko spleta",
          "Prednostna obdelava zahtev",
          "Namenski Account Manager",
        ],
        cta: "Kontaktirajte nas",
      },
    ],
  },
  en: {
    badge: "Popular",
    sectionEyebrow: "Pricing",
    sectionTitle: "Simple & transparent",
    standaloneTitle: "Pricing for Calendra appointment booking software",
    sectionDescription: "Choose the plan that best fits your business.",
    comparisonTitle: "Package comparison",
    comparisonHeader: "Feature",
    calculatorTitle: "Build your monthly plan",
    calculatorDescription: "Choose a package, set additional users and SMS messages, and include the modules you need.",
    packageSelectorTitle: "1. Choose a package",
    addOnsTitle: "Additional options",
    billingMonthlyLabel: "Monthly",
    billingAnnualLabel: "Yearly",
    billingAnnualSavingsLabel: "Save {months} months with annual billing",
    enterprisePanelTitle: "For larger teams or special requirements",
    enterprisePanelDescription: "We tailor the Enterprise plan to your business.",
    enterprisePanelCta: "Send an enquiry",
    enterprisePanelResponse: "Agree the next steps together.",
    usersLabel: "2. Additional users",
    usersHint: "Each additional user: €5.90 / month",
    usersCountLabel: "users",
    smsLabel: "3. Additional SMS messages",
    smsHint: "Each additional SMS message: €0.06",
    smsCountLabel: "SMS messages",
    optionsLabel: "4. Add-on modules",
    optionFiscal: "Fiscal cash register",
    optionPremises: "Business premises",
    monthlyLabel: "Monthly total",
    summaryTitle: "Selection summary",
    selectedPackageLabel: "Selected package",
    selectedItemsLabel: "Selected options",
    noExtras: "No add-ons selected",
    continueToRegister: "Continue to signup",
    enterpriseCta: "Contact us",
    contactTitle: "Contact form for Enterprise or a custom offer",
    contactDescription: "Fill out the form below and we will prepare an offer based on your needs.",
    contactCompany: "Company",
    contactName: "Full name",
    contactEmail: "Email",
    contactPhone: "Phone",
    contactMessage: "Message",
    contactMessagePlaceholder: "Describe your needs, locations, expected users, or any custom requirements.",
    sendInquiry: "Send inquiry",
    directEmail: "You can also contact us directly at",
    directEmailLabel: "Email",
    comparisonRows: [
      { label: "Calendar", values: [true, true, true, true] },
      { label: "Customer overview", values: [true, true, true, true] },
      { label: "Analytics", values: [true, true, true, true] },
      { label: "Email messaging", values: ["One-way", "Two-way", "Two-way", "Two-way"] },
      { label: "Support", values: ["Email", "Phone", "Priority", "Account Manager"] },
      { label: "Cloud file storage", values: [false, "up to 2GB", true, true] },
      { label: "Invoice issuing", values: [false, true, true, true] },
      { label: "SMS messaging", values: [false, true, true, true] },
      { label: "WhatsApp messaging", values: [false, "One-way", "Two-way", "Two-way"] },
      { label: "AI assistant", values: [false, false, false, true] },
      { label: "Rooms", values: [false, false, true, true] },
    ],
    tiers: [
      {
        key: "basic",
        name: "Basic",
        price: "14.90€",
        priceSuffix: "/ month",
        baseMonthly: 14.9,
        description: "For individuals who are just getting started.",
        features: [
          "1 user (additional users can be purchased)",
          "Calendar",
          "Customer overview",
          "Analytics",
          "One-way email messaging",
          "30-minute introductory call",
          "Email support",
        ],
        cta: "Choose Basic",
      },
      {
        key: "professional",
        name: "Professional",
        price: "24.90€",
        priceSuffix: "/ month",
        baseMonthly: 24.9,
        description: "For growing businesses.",
        features: [
          "Everything in the Basic plan +",
          "Cloud file storage (up to 2GB)",
          "Invoice issuing",
          "Bulk SMS messaging",
          "One-way SMS messaging (pay per use)",
          "One-way WhatsApp messaging (pay per use)",
          "Phone support",
        ],
        cta: "Choose Professional",
      },
      {
        key: "premium",
        name: "Premium",
        price: "39.90€",
        priceSuffix: "/ month",
        baseMonthly: 39.9,
        description: "All advanced features for demanding teams.",
        features: [
          "Everything in the Professional plan +",
          "Unlimited cloud file storage",
          "CSV import of bank account records",
          "Two-way messaging (email, WhatsApp)",
          "AI voice assistant for reservations",
          "Rooms and equipment",
          "Priority support",
        ],
        popular: true,
        accent: true,
        cta: "Choose Premium",
      },
      {
        key: "enterprise",
        name: "Enterprise",
        price: "Custom",
        description: "For small and large companies with specific requirements.",
        features: [
          "Unlimited users",
          "Unlimited locations",
          "Custom development",
          "Integration with other tools",
          "Live or online training",
          "Priority request processing",
          "Dedicated Account Manager",
        ],
        cta: "Contact us",
      },
    ],
  },
};

const standaloneExtras = {
  sl: {
    guideTitle: "Kateri paket je pravi za vaše podjetje?",
    guide: [
      { title: "Osnovno", body: "Za samostojne izvajalce, ki potrebujejo koledar, pregled strank in osnovno komunikacijo." },
      { title: "Profesionalno", body: "Za rastoča podjetja, ki poleg terminov potrebujejo račune, datoteke, SMS sporočila in telefonsko podporo." },
      { title: "Premium", body: "Za ekipe z zahtevnejšimi procesi, prostori, napravami, naprednimi sporočili in prioritetno podporo." },
      { title: "Enterprise", body: "Za več lokacij, večje ekipe, razvoj po meri in posebne integracije." },
    ],
    chargesTitle: "Kaj je vključeno in kaj se obračuna dodatno?",
    includedTitle: "Vključeno v mesečni paket",
    included: ["Funkcionalnosti izbranega paketa", "1 uporabnik", "14-dnevni brezplačni preizkus", "Posodobitve in varnostne izboljšave"],
    extraTitle: "Dodatni stroški po izbiri ali porabi",
    extra: ["Dodatni uporabniki: 5,90 € / mesec", "Dodatna SMS sporočila: 0,06 € / sporočilo", "Izbrani dodatni moduli"],
    trialTitle: "Pogoji brezplačnega preizkusa",
    trialBody: "Brezplačni preizkus traja 14 dni, začne se z Osnovnim paketom in ne zahteva kreditne kartice. Izbira na ceniku se prenese v registracijo, plačljivi dodatki pa s tem še niso aktivirani. Pred potrditvijo plačljivega paketa vidite izbrani paket, dodatke ter ocenjeni mesečni in prvi račun.",
    relatedTitle: "Preverite povezane funkcionalnosti",
    faqTitle: "Pogosta vprašanja o ceniku",
  },
  en: {
    guideTitle: "Which plan fits your business?",
    guide: [
      { title: "Basic", body: "For independent professionals who need a calendar, client overview and essential communication." },
      { title: "Professional", body: "For growing businesses that also need invoicing, files, SMS messaging and phone support." },
      { title: "Premium", body: "For teams with advanced workflows, rooms, equipment, richer messaging and priority support." },
      { title: "Enterprise", body: "For multiple locations, larger teams, custom development and specialised integrations." },
    ],
    chargesTitle: "What is included and what costs extra?",
    includedTitle: "Included in the monthly plan",
    included: ["Features in the selected plan", "1 user", "14-day free trial", "Product updates and security improvements"],
    extraTitle: "Optional or usage-based costs",
    extra: ["Additional users: €5.90 / month", "Additional SMS messages: €0.06 / message", "Selected add-on modules"],
    trialTitle: "Free-trial terms",
    trialBody: "The free trial lasts 14 days, starts on the Basic plan and does not require a credit card. Your pricing selection carries into registration; it does not activate paid add-ons. Before confirming a paid plan, you can review the selected package, add-ons and estimated monthly and first invoice.",
    relatedTitle: "Explore related features",
    faqTitle: "Pricing questions",
  },
} as const;

const USER_SLIDER_MAX = 20;
const SMS_SLIDER_MAX = 1000;
const SMS_SLIDER_STEP = 50;

const HIDDEN_PRICING_ADD_ON_CODES = new Set([
  "FISCAL_CASH_REGISTER",
  "BUSINESS_PREMISES",
]);

const API_PLAN_BY_TIER: Partial<Record<PlanKey, PublicPricingPlanKey>> = {
  basic: "basic",
  professional: "pro",
  premium: "business",
};

const isUserCoveredByRule = (userNumber: number, rule: PublicAdditionalUserRule) =>
  userNumber >= rule.fromUser && (rule.toUser == null || userNumber <= rule.toUser);

const calculateAdditionalUsersPrice = (
  totalUsers: number,
  includedUsers: number,
  rules: PublicAdditionalUserRule[],
) => {
  let total = 0;
  for (let userNumber = includedUsers + 1; userNumber <= totalUsers; userNumber += 1) {
    const rule = rules.find((candidate) => isUserCoveredByRule(userNumber, candidate));
    total += rule?.monthlyGrossPerUser ?? 0;
  }
  return Math.round(total * 100) / 100;
};

const scrollToElement = (element: HTMLElement | null) => {
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Pricing = ({ standalone = false }: { standalone?: boolean }) => {
  const { language } = useSiteLanguage();
  const inquiry = useInquiry(language);
  const baseContent = useMemo(() => translations[language], [language]);
  const [pricingCatalog, setPricingCatalog] = useState<PublicPricingCatalog>(getInitialPricingCatalog);
  const [selectedTierKey, setSelectedTierKey] = useState<PlanKey>("professional");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [additionalUsers, setAdditionalUsers] = useState(() => getInitialPricingCatalog().includedUsers);
  const [additionalSms, setAdditionalSms] = useState(0);
  const [selectedAddOnKeys, setSelectedAddOnKeys] = useState<string[]>([]);
  const [contactCompany, setContactCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [showStickySummary, setShowStickySummary] = useState(false);
  const configuratorRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Share the sitemap's recorded content-change date for this pricing page.
  const pricingUpdatedLabel = useMemo(() => {
    const date = new Date(`${sitemapRouteMetadata.pricing.contentLastModified}T00:00:00Z`);
    if (language !== "sl") {
      return new Intl.DateTimeFormat("en-IE", { year: "numeric", month: "long", day: "numeric" }).format(date);
    }
    // Intl only has the nominative month form ("julij"), but a date after
    // "posodobljen" takes the genitive ("julija") — there's no Intl option for Slovenian
    // grammatical case, so the genitive names are spelled out here instead.
    const genitiveMonths = ["januarja", "februarja", "marca", "aprila", "maja", "junija", "julija", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
    return `${date.getUTCDate()}. ${genitiveMonths[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  }, [language]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicPricingCatalog(controller.signal)
      .then(setPricingCatalog)
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Could not load the public pricing catalog; using the built-in fallback.", error);
      });
    return () => controller.abort();
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-IE", {
        style: "currency",
        currency: pricingCatalog.currency || "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [language, pricingCatalog.currency],
  );

  const annualBilledMonths = pricingCatalog.annualBilledMonths || 10;
  const annualSavingsMonths = pricingCatalog.annualSavingsMonths || Math.max(0, 12 - annualBilledMonths);

  const content = useMemo<TranslationSet>(() => {
    const featureLabel = (feature: PublicPricingFeature) =>
      language === "sl" ? feature.nameSl || feature.name : feature.name;
    const featureByKey = new Map(pricingCatalog.features.map((feature) => [feature.key, feature]));
    const tiers = baseContent.tiers.map((tier): Tier => {
      const apiPlanKey = API_PLAN_BY_TIER[tier.key];
      if (!apiPlanKey) return tier;
      const plan = pricingCatalog.plans.find((candidate) => candidate.key === apiPlanKey);
      if (!plan) return tier;
      const features = plan.featureKeys
        .map((key) => featureByKey.get(key))
        .filter((feature): feature is PublicPricingFeature => Boolean(feature))
        .map(featureLabel);
      const displayedMonthlyPrice = billingPeriod === "annual"
        ? Math.round((plan.annualGross / 12) * 100) / 100
        : plan.monthlyGross;
      return {
        ...tier,
        name: language === "sl" ? plan.nameSl || plan.name : plan.name,
        price: formatter.format(displayedMonthlyPrice),
        baseMonthly: displayedMonthlyPrice,
        features: features.length > 0 ? features : tier.features,
        popular: plan.popular,
        accent: plan.popular,
      };
    });

    const comparisonRows = pricingCatalog.features.length > 0
      ? pricingCatalog.features.map((feature) => ({
          label: featureLabel(feature),
          values: [
            feature.includedPlans.includes("basic"),
            feature.includedPlans.includes("pro"),
            feature.includedPlans.includes("business"),
            true,
          ] satisfies CellValue[],
        }))
      : baseContent.comparisonRows;

    const rules = pricingCatalog.additionalUserRules;
    const firstRule = rules[0];
    const secondRule = rules[1];
    const usersHint = firstRule
      ? !secondRule && firstRule.toUser == null
        ? language === "sl"
          ? `Vsak dodatni uporabnik: ${formatter.format(firstRule.monthlyGrossPerUser)} / mesec.`
          : `Each additional user: ${formatter.format(firstRule.monthlyGrossPerUser)} / month.`
        : language === "sl"
          ? `Od ${firstRule.fromUser}. do ${firstRule.toUser ?? "∞"}. uporabnika: ${formatter.format(firstRule.monthlyGrossPerUser)} na uporabnika/mesec${secondRule ? `; od ${secondRule.fromUser}. uporabnika dalje: ${formatter.format(secondRule.monthlyGrossPerUser)} na uporabnika/mesec` : ""}.`
          : `Users ${firstRule.fromUser}${firstRule.toUser ? `–${firstRule.toUser}` : "+"}: ${formatter.format(firstRule.monthlyGrossPerUser)} per user/month${secondRule ? `; from user ${secondRule.fromUser}: ${formatter.format(secondRule.monthlyGrossPerUser)} per user/month` : ""}.`
      : baseContent.usersHint;

    return {
      ...baseContent,
      tiers,
      comparisonRows,
      usersHint,
      smsHint: language === "sl"
        ? `Vsako dodatno SMS sporočilo: ${formatter.format(pricingCatalog.smsPerMessageGross)}`
        : `Each additional SMS message: ${formatter.format(pricingCatalog.smsPerMessageGross)}`,
    };
  }, [baseContent, billingPeriod, formatter, language, pricingCatalog]);

  const includedUsers = pricingCatalog.includedUsers || 1;

  useEffect(() => {
    setAdditionalUsers((current) => Math.max(current, includedUsers));
  }, [includedUsers]);

  const selectedTier = useMemo(
    () => content.tiers.find((tier) => tier.key === selectedTierKey) ?? content.tiers[0],
    [content, selectedTierKey],
  );
  const enterpriseTier = useMemo(
    () => content.tiers.find((tier) => tier.key === "enterprise"),
    [content],
  );
  const packageTiers = useMemo(() => {
    const standardTiers = content.tiers.filter((tier) => tier.key !== "enterprise");
    return standardTiers.map((tier, index) => {
      const isMiddlePackage = index === 1;
      if (index === 0) {
        return {
          ...tier,
          inheritedLabel: undefined,
          popular: false,
          accent: false,
        };
      }
      const previousTier = standardTiers[index - 1];
      const previousFeatures = new Set(previousTier.features);
      const incrementalFeatures = tier.features.filter((feature) => !previousFeatures.has(feature));
      const inheritedLabel = language === "sl"
        ? tier.key === "professional"
          ? "Vse vključeno iz Osnovnega paketa +"
          : "Vse vključeno iz Profesionalnega paketa +"
        : tier.key === "professional"
          ? "Everything included in the Basic plan +"
          : "Everything included in the Professional plan +";
      return {
        ...tier,
        features: incrementalFeatures.length > 0 ? incrementalFeatures : tier.features,
        inheritedLabel,
        popular: isMiddlePackage,
        accent: isMiddlePackage,
      };
    });
  }, [content, language]);

  const selectedApiPlanKey = API_PLAN_BY_TIER[selectedTier.key];
  const availableAddOns = useMemo(
    () => pricingCatalog.addOns.filter(
      (addOn) => !HIDDEN_PRICING_ADD_ON_CODES.has(addOn.code),
    ),
    [pricingCatalog.addOns],
  );
  const visibleAddOns = useMemo(
    () => selectedApiPlanKey
      ? availableAddOns.filter((addOn) => addOn.availablePlans.includes(selectedApiPlanKey))
      : [],
    [availableAddOns, selectedApiPlanKey],
  );
  const selectedAddOns = useMemo(
    () => visibleAddOns.filter((addOn) => selectedAddOnKeys.includes(addOn.key)),
    [visibleAddOns, selectedAddOnKeys],
  );
  const additionalUsersPrice = calculateAdditionalUsersPrice(
    additionalUsers,
    includedUsers,
    pricingCatalog.additionalUserRules,
  );

  useEffect(() => {
    setSelectedAddOnKeys((current) => current.filter((key) => visibleAddOns.some((addOn) => addOn.key === key)));
  }, [visibleAddOns]);

  useEffect(() => {
    if (!standalone || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan === "basic" || plan === "professional" || plan === "premium" || plan === "enterprise") {
      setSelectedTierKey(plan);
    }
    const billing = params.get("billing");
    if (billing === "annual" || billing === "monthly") {
      setBillingPeriod(billing);
    }

    const hash = window.location.hash;
    if (hash === "#pricing-configurator") {
      window.setTimeout(() => scrollToElement(configuratorRef.current), 60);
    }
    if (hash === "#contact-form") {
      window.setTimeout(() => scrollToElement(contactRef.current), 60);
    }
  }, [standalone]);

  useEffect(() => {
    if (!standalone || typeof window === "undefined") return;

    const onScroll = () => {
      const configuratorTop = configuratorRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const reachedConfigurator = configuratorTop <= 120;
      setShowStickySummary(reachedConfigurator && selectedTier.key !== "enterprise");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [standalone, selectedTier.key]);

  const monthlyTotal =
    (selectedTier.baseMonthly ?? 0) +
    additionalUsersPrice +
    additionalSms * pricingCatalog.smsPerMessageGross +
    selectedAddOns.reduce((total, addOn) => total + addOn.monthlyGross, 0);
  const oneTimeTotal = 0;
  const firstInvoiceEstimate = monthlyTotal;

  const addOnLabel = (addOn: PublicPricingAddOn) =>
    language === "sl" ? addOn.nameSl || addOn.name : addOn.name;
  const addOnDescription = (addOn: PublicPricingAddOn) =>
    language === "sl"
      ? addOn.descriptionSl || addOn.description
      : addOn.description;

  const selectedItems = [
    additionalUsers > includedUsers ? `${additionalUsers} ${content.usersCountLabel}` : null,
    additionalSms > 0 ? `${additionalSms} ${content.smsCountLabel}` : null,
    ...selectedAddOns.map((addOn) => `${addOnLabel(addOn)} (${content.monthlyLabel.toLowerCase()})`),
  ].filter(Boolean) as string[];

  const signupSummary = useMemo<PricingSignupSummary>(
    () => ({
      totalUsers: additionalUsers,
      additionalSms,
      fiscalCashRegister: selectedAddOns.some((addOn) => ["FISCAL", "FISCAL_CASH_REGISTER"].includes(addOn.code)),
      websiteCreation: false,
      businessPremises: selectedAddOns.some((addOn) => addOn.code === "BUSINESS_PREMISES"),
      selectedAddOnKeys: selectedAddOns.map((addOn) => addOn.key),
      selectedAddOnCodes: selectedAddOns.map((addOn) => addOn.code),
      monthlyTotal,
      oneTimeTotal,
      firstInvoiceEstimate,
    }),
    [
      additionalUsers,
      additionalSms,
      selectedAddOns,
      monthlyTotal,
      oneTimeTotal,
      firstInvoiceEstimate,
    ],
  );

  const signupRoute = `${buildPackageSignupRoute(selectedTier.key, signupSummary)}&billing=${billingPeriod}`;

  const handleTierSelect = (tierKey: PlanKey) => {
    const tier = content.tiers.find((item) => item.key === tierKey);
    trackMarketingEvent("pricing_package_selected", {
      package_key: tierKey,
      package_name: tier?.name,
      package_price: tier?.baseMonthly ?? null,
      currency: "EUR",
      language,
      placement: standalone ? "pricing_page" : "homepage",
    });

    if (!standalone) {
      const query = `plan=${tierKey}&billing=${billingPeriod}`;
      const target = `${getRoutePath("pricing", language)}?${query}${tierKey === "enterprise" ? "#contact-form" : "#pricing-configurator"}`;
      window.location.assign(target);
      return;
    }

    if (tierKey === "enterprise") {
      setSelectedTierKey("enterprise");
      scrollToElement(contactRef.current);
      return;
    }
    setSelectedTierKey(tierKey);
    scrollToElement(configuratorRef.current);
  };

  const handleInquirySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bodyLines = [
      `${content.selectedPackageLabel}: ${selectedTier.name}`,
      `${content.contactCompany}: ${contactCompany || "-"}`,
      `${content.contactName}: ${contactName || "-"}`,
      `${content.contactEmail}: ${contactEmail || "-"}`,
      `${content.contactPhone}: ${contactPhone || "-"}`,
      `${content.selectedItemsLabel}: ${selectedItems.length > 0 ? selectedItems.join(", ") : content.noExtras}`,
      `${content.monthlyLabel}: ${formatter.format(monthlyTotal)}`,
      "",
      `${content.contactMessage}:`,
      contactMessage || "-",
    ];

    void inquiry.submit({
      name: contactName, email: contactEmail, phone: contactPhone,
      message: bodyLines.join("\n"), locale: language,
      billing: billingPeriod,
    }, "enterprise");
  };

  const sl = language === "sl";
  const extra = standaloneExtras[language];
  const ui = sl ? {
    comparison: "Poiščite funkcionalnosti, ki jih potrebuje vaše podjetje.",
    trial: "14 dni brezplačno", noCard: "Brez kreditne kartice",
    configure: "Prilagodite svoj paket",
    calculatorDescription: "Izberite paket, uporabnike in dodatke. Končno ceno vidite takoj.",
    selected: "Vaš izbrani paket", package: "Paket", users: "Dodatni uporabniki",
    sms: "SMS sporočila", modules: "Dodatni moduli", included: "Vključeno",
    unavailable: "Ni vključeno", perMonth: "mesec", perMessage: "sporočilo",
    user: "Dodatni uporabnik", fromSecond: "Od 2. uporabnika dalje.",
    optional: "Dodatno po izbiri ali porabi", byPrice: "Po ceniku",
    custom: "Ponudba po meri", team: "Rešitev za vašo ekipo.",
    teamDescription: "Za večje ekipe, več lokacij ali posebne zahteve pripravimo ponudbo po meri.",
    benefits: ["Prilagoditev vašemu poslovanju", "Povezovanje z drugimi orodji", "Skupaj določimo naslednje korake."],
    inquiry: "Povpraševanje za Enterprise", removeUser: "Odstrani uporabnika", addUser: "Dodaj uporabnika",
    userCount: "Število uporabnikov", smsCount: "Število dodatnih SMS sporočil",
    monthlyBilling: "Mesečni obračun", annualBilling: "Letni obračun",
    annualPackage: "Letno za paket", enterprise: "Za Enterprise pripravimo izračun po meri.",
    readStory: "Preberite celotno zgodbo", swipe: "Za vse pakete podrsajte po tabeli.",
  } : {
    comparison: "Find the features your business needs.",
    trial: "14 days free", noCard: "No credit card required",
    configure: "Make it your plan",
    calculatorDescription: "Choose your plan, users and extras. See your total right away.",
    selected: "Your selected plan", package: "Plan", users: "Additional users",
    sms: "SMS messages", modules: "Add-on modules", included: "Included",
    unavailable: "Not included", perMonth: "month", perMessage: "message",
    user: "Additional user", fromSecond: "From the second user.",
    optional: "Optional or usage-based costs", byPrice: "As listed",
    custom: "A tailored offer", team: "A solution for your team.",
    teamDescription: "For larger teams, multiple locations or special requirements, we prepare a tailored offer.",
    benefits: ["Tailored to your business", "Connect your existing tools", "Agree the next steps together."],
    inquiry: "Enterprise enquiry", removeUser: "Remove a user", addUser: "Add a user",
    userCount: "Number of users", smsCount: "Number of additional SMS messages",
    monthlyBilling: "Monthly billing", annualBilling: "Annual billing",
    annualPackage: "Annual plan price", enterprise: "We prepare a custom estimate for Enterprise.",
    readStory: "Read the full story", swipe: "Scroll the table to compare all plans.",
  };
  const userCountLabel = sl
    ? `${additionalUsers} ${additionalUsers % 100 === 1 ? "uporabnik" : additionalUsers % 100 === 2 ? "uporabnika" : [3, 4].includes(additionalUsers % 100) ? "uporabniki" : "uporabnikov"}`
    : `${additionalUsers} ${additionalUsers === 1 ? "user" : "users"}`;
  const includedUserLabel = sl
    ? includedUsers === 1 ? "1 uporabnik je vključen." : `Vključeni uporabniki: ${includedUsers}.`
    : `${includedUsers} ${includedUsers === 1 ? "user is" : "users are"} included.`;
  const modulesPrice = selectedAddOns.reduce((total, addOn) => total + addOn.monthlyGross, 0);
  const story = getCustomerStory("institut-avisensa")!;
  const storyContent = story.content[language];
  const relatedPages = getRelatedPages("pricing", language, 8);
  const HeadingTag = standalone ? "h1" : "h2";
  const TierHeadingTag = standalone ? "h2" : "h3";
  const SectionHeading = standalone ? "h2" : "h3";
  const setUserCount = (value: number) => setAdditionalUsers(Math.min(USER_SLIDER_MAX, Math.max(includedUsers, Math.trunc(value) || includedUsers)));
  const setSmsCount = (value: number) => setAdditionalSms(Math.min(SMS_SLIDER_MAX, Math.max(0, Math.trunc(value) || 0)));

  const trustLine = (
    <div className="pricing-trust">
      <span><Check aria-hidden="true" />{ui.trial}</span>
      <span><CreditCard aria-hidden="true" />{ui.noCard}</span>
    </div>
  );
  const signupButton = (
    <Button variant="hero" size="lg" className="pricing-button" asChild>
      <a href={signupRoute} data-pricing-signup>
        {content.continueToRegister}<ArrowRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </Button>
  );

  return (
    <section id={standalone ? undefined : "cenik"} className="pricing-content">
      <div className="container mx-auto">
        <header className="pricing-intro">
          <span className="marketing-eyebrow">{content.sectionEyebrow}</span>
          <HeadingTag>{standalone ? content.standaloneTitle : content.sectionTitle}</HeadingTag>
          <p className="pricing-intro-description">{content.sectionDescription}</p>
          {standalone && <p className="pricing-updated">{sl ? "Cenik posodobljen " : "Pricing last updated "}{pricingUpdatedLabel}</p>}
          <div className="pricing-billing-row">
            <div className="pricing-billing-switch" role="group" aria-label={sl ? "Obračunsko obdobje" : "Billing period"}>
              {(["monthly", "annual"] as const).map((period) => (
                <button key={period} type="button" aria-pressed={billingPeriod === period} onClick={() => setBillingPeriod(period)}>
                  {period === "monthly" ? content.billingMonthlyLabel : content.billingAnnualLabel}
                </button>
              ))}
            </div>
            <span className="pricing-savings">{content.billingAnnualSavingsLabel.replace("{months}", String(annualSavingsMonths))}</span>
          </div>
          {trustLine}
          <p className="mt-4 text-sm text-muted-foreground">{getPricingTaxNote(language, pricingCatalog.vatIncluded)}</p>
        </header>

        <div className="pricing-plan-grid">
          {packageTiers.map((tier) => {
            const plan = pricingCatalog.plans.find((item) => item.key === API_PLAN_BY_TIER[tier.key]);
            return (
              <article key={tier.key} className={`pricing-plan${tier.popular ? " pricing-plan-popular" : ""}`} data-plan={tier.key}>
                <div className="pricing-plan-heading">
                  <TierHeadingTag>{tier.name}</TierHeadingTag>
                  {tier.popular && <span className="pricing-popular-badge"><Star aria-hidden="true" />{content.badge}</span>}
                </div>
                <p className="pricing-plan-price"><strong>{tier.price}</strong><span>{tier.priceSuffix}</span></p>
                {billingPeriod === "annual" && plan && <p className="pricing-annual-price">{ui.annualPackage}: {formatter.format(plan.annualGross)}</p>}
                <p className="pricing-plan-description">{tier.description}</p>
                {tier.inheritedLabel && <p className="pricing-inherited">{tier.inheritedLabel}</p>}
                <ul className="pricing-plan-features">
                  {tier.features.map((feature) => <li key={feature}><Check aria-hidden="true" /><span>{feature}</span></li>)}
                </ul>
                <Button variant="hero" size="lg" className="pricing-button" onClick={() => handleTierSelect(tier.key)}>{tier.cta}</Button>
              </article>
            );
          })}
        </div>

        {enterpriseTier && (
          <section className="pricing-enterprise-banner" aria-label={enterpriseTier.name}>
            <div className="pricing-enterprise-title"><span className="pricing-icon"><Users aria-hidden="true" /></span><div><TierHeadingTag>{content.enterprisePanelTitle}</TierHeadingTag><p>{content.enterprisePanelDescription}</p></div></div>
            <ul>{enterpriseTier.features.filter((_, index) => [0, 1, 3, 6].includes(index)).map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <div><Button variant="outline" size="lg" className="pricing-button" onClick={() => handleTierSelect("enterprise")}>{content.enterprisePanelCta}</Button><p className="pricing-response">{content.enterprisePanelResponse}</p></div>
          </section>
        )}

        <section className="pricing-section pricing-comparison" aria-labelledby="pricing-comparison-title">
          <div className="pricing-section-heading"><SectionHeading id="pricing-comparison-title" className="pricing-section-title">{content.comparisonTitle}</SectionHeading><p>{ui.comparison}</p></div>
          <p className="pricing-table-hint" id="pricing-table-hint">{ui.swipe}</p>
          <div className="pricing-table-scroll" role="region" aria-labelledby="pricing-comparison-title" aria-describedby="pricing-table-hint" tabIndex={0}>
            <table>
              <caption className="sr-only">{content.comparisonTitle}</caption>
              <colgroup><col className="pricing-feature-column" />{packageTiers.map((tier) => <col key={tier.key} className={tier.popular ? "pricing-highlight-column" : undefined} />)}</colgroup>
              <thead><tr><th scope="col">{content.comparisonHeader}</th>{packageTiers.map((tier) => <th key={tier.key} scope="col" className={tier.popular ? "pricing-highlight-label" : undefined}>{tier.name}</th>)}</tr></thead>
              <tbody>{content.comparisonRows.map((row) => (
                <tr key={row.label}><th scope="row">{row.label}</th>{row.values.slice(0, packageTiers.length).map((value, index) => (
                  <td key={index}>{typeof value === "boolean" ? <><span className="sr-only">{value ? ui.included : ui.unavailable}</span>{value ? <Check className="pricing-check" aria-hidden="true" /> : <Minus className="pricing-unavailable" aria-hidden="true" />}</> : value}</td>
                ))}</tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        {standalone && (
          <section className="pricing-section pricing-charges" aria-labelledby="charges-title">
            <h2 id="charges-title" className="pricing-section-title">{extra.chargesTitle}</h2>
            <div className="pricing-info-grid">
              <article className="pricing-info-card">
                <span className="pricing-icon"><Check aria-hidden="true" /></span><h3>{extra.includedTitle}</h3>
                <ul className="pricing-check-list">{extra.included.map((item, index) => <li key={item}><Check aria-hidden="true" /><span>{index === 1 ? includedUserLabel : item}</span></li>)}</ul>
              </article>
              <article className="pricing-info-card">
                <span className="pricing-icon"><Receipt aria-hidden="true" /></span><h3>{ui.optional}</h3>
                <dl className="pricing-cost-list">
                  {pricingCatalog.additionalUserRules.map((rule) => <div key={rule.fromUser}><dt>{ui.user}<small>{rule.fromUser === 2 && rule.toUser == null ? ui.fromSecond : sl ? `Uporabniki: ${rule.fromUser}–${rule.toUser ?? "+"}` : `Users: ${rule.fromUser}–${rule.toUser ?? "+"}`}</small></dt><dd><strong>{formatter.format(rule.monthlyGrossPerUser)}</strong> / {ui.perMonth}</dd></div>)}
                  <div><dt>{ui.sms}</dt><dd><strong>{formatter.format(pricingCatalog.smsPerMessageGross)}</strong> / {ui.perMessage}</dd></div>
                  {availableAddOns.length > 0 && <div><dt>{ui.modules}</dt><dd>{ui.byPrice}</dd></div>}
                </dl>
              </article>
            </div>
          </section>
        )}
      </div>

      {standalone && <>
        <section id="pricing-configurator" ref={configuratorRef} className="pricing-calculator-band" aria-labelledby="pricing-calculator-title">
          <div className="container mx-auto">
            <span className="marketing-eyebrow">{ui.configure}</span>
            <h2 id="pricing-calculator-title" className="pricing-section-title">{content.calculatorTitle}</h2>
            <p className="pricing-section-description">{ui.calculatorDescription}</p>
            <div className="pricing-calculator-layout">
              <div className="pricing-controls">
                <fieldset className="pricing-control">
                  <legend>{content.packageSelectorTitle}</legend>
                  <p>{billingPeriod === "annual" ? ui.annualBilling : ui.monthlyBilling}</p>
                  <div className="pricing-package-selector" role="group" aria-label={ui.package}>
                    {packageTiers.map((tier) => <button key={tier.key} type="button" aria-pressed={selectedTier.key === tier.key} onClick={() => handleTierSelect(tier.key)}>{tier.name}</button>)}
                  </div>
                </fieldset>
                {selectedTier.key === "enterprise" ? <p className="pricing-enterprise-note">{ui.enterprise}</p> : <>
                  <fieldset className="pricing-control">
                    <legend>{content.usersLabel}</legend>
                    <div className="pricing-control-header">
                      <p>{includedUserLabel} {content.usersHint}</p>
                      <div className="pricing-stepper">
                        <button type="button" aria-label={ui.removeUser} disabled={additionalUsers <= includedUsers} onClick={() => setUserCount(additionalUsers - 1)}><Minus aria-hidden="true" /></button>
                        <Input type="number" aria-label={ui.userCount} min={includedUsers} max={USER_SLIDER_MAX} step={1} value={additionalUsers} onChange={(event) => setUserCount(Number(event.target.value))} />
                        <button type="button" aria-label={ui.addUser} disabled={additionalUsers >= USER_SLIDER_MAX} onClick={() => setUserCount(additionalUsers + 1)}><Plus aria-hidden="true" /></button>
                      </div>
                    </div>
                    <Slider aria-label={ui.userCount} min={includedUsers} max={USER_SLIDER_MAX} step={1} value={[additionalUsers]} onValueChange={([value]) => setUserCount(value)} />
                  </fieldset>
                  <fieldset className="pricing-control">
                    <legend>{content.smsLabel}</legend>
                    <div className="pricing-control-header"><p>{content.smsHint}</p><Input className="pricing-sms-input" type="number" aria-label={ui.smsCount} min={0} max={SMS_SLIDER_MAX} step={1} value={additionalSms} onChange={(event) => setSmsCount(Number(event.target.value))} /></div>
                    <Slider aria-label={ui.smsCount} min={0} max={SMS_SLIDER_MAX} step={SMS_SLIDER_STEP} value={[additionalSms]} onValueChange={([value]) => setSmsCount(value)} />
                  </fieldset>
                  {visibleAddOns.length > 0 && <fieldset className="pricing-control">
                    <legend>{content.optionsLabel}</legend>
                    <div className="pricing-addons">{visibleAddOns.map((addOn) => (
                      <label key={addOn.key} className="pricing-addon">
                        <Checkbox checked={selectedAddOnKeys.includes(addOn.key)} onCheckedChange={(checked) => setSelectedAddOnKeys((current) => checked === true ? [...current.filter((key) => key !== addOn.key), addOn.key] : current.filter((key) => key !== addOn.key))} />
                        <span><span className="pricing-addon-heading"><strong>{addOnLabel(addOn)}</strong><span>{formatter.format(addOn.monthlyGross)} / {ui.perMonth}</span></span>{addOnDescription(addOn) && <small>{addOnDescription(addOn)}</small>}</span>
                      </label>
                    ))}</div>
                  </fieldset>}
                </>}
              </div>
              <aside className="pricing-summary-card" aria-label={content.summaryTitle}>
                <span className="marketing-eyebrow">{ui.selected}</span><h3>{selectedTier.name}</h3>
                {selectedTier.key === "enterprise" ? <><p>{ui.enterprise}</p><Button variant="hero" className="pricing-button" onClick={() => scrollToElement(contactRef.current)}>{content.enterprisePanelCta}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Button></> : <>
                  <dl className="pricing-breakdown">
                    <div><dt>{ui.package}</dt><dd>{formatter.format(selectedTier.baseMonthly ?? 0)}</dd></div>
                    <div><dt>{ui.users}</dt><dd>{formatter.format(additionalUsersPrice)}</dd></div>
                    <div><dt>{ui.sms}</dt><dd>{formatter.format(additionalSms * pricingCatalog.smsPerMessageGross)}</dd></div>
                    <div><dt>{ui.modules}</dt><dd>{formatter.format(modulesPrice)}</dd></div>
                  </dl>
                  <div className="pricing-total" aria-live="polite" aria-atomic="true"><span>{content.monthlyLabel}</span><strong data-pricing-total>{formatter.format(monthlyTotal)}</strong></div>
                  {signupButton}{trustLine}
                </>}
              </aside>
            </div>
          </div>
        </section>

        <div className="container mx-auto">
          <section id="contact-form" ref={contactRef} className="pricing-contact pricing-section" aria-labelledby="pricing-contact-title">
            <div className="pricing-contact-copy">
              <span className="marketing-eyebrow">{ui.custom}</span><h2 id="pricing-contact-title" className="pricing-section-title">{ui.team}</h2>
              <p>{ui.teamDescription}</p><a href={`mailto:${LEGAL.generalEmail}`}>{LEGAL.generalEmail}</a>
              <ul className="pricing-check-list">{ui.benefits.map((benefit) => <li key={benefit}><Check aria-hidden="true" /><span>{benefit}</span></li>)}</ul>
            </div>
            <form className="pricing-contact-form" onSubmit={handleInquirySubmit} aria-labelledby="pricing-form-title">
              <h3 id="pricing-form-title">{ui.inquiry}</h3>
              <div className="pricing-form-fields">
                <div><label htmlFor="pricing-company">{content.contactCompany}</label><Input id="pricing-company" maxLength={200} name="company" autoComplete="organization" placeholder={content.contactCompany} value={contactCompany} onChange={(event) => setContactCompany(event.target.value)} /></div>
                <div><label htmlFor="pricing-name">{content.contactName}</label><Input id="pricing-name" maxLength={120} name="name" autoComplete="name" placeholder={content.contactName} value={contactName} onChange={(event) => setContactName(event.target.value)} required /></div>
                <div><label htmlFor="pricing-email">{content.contactEmail}</label><Input id="pricing-email" maxLength={254} name="email" autoComplete="email" type="email" placeholder={content.contactEmail} value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} required /></div>
                <div><label htmlFor="pricing-phone">{content.contactPhone}</label><Input id="pricing-phone" maxLength={50} name="phone" autoComplete="tel" type="tel" placeholder={content.contactPhone} value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} /></div>
                <div className="pricing-form-message"><label htmlFor="pricing-message">{content.contactMessage}</label><Textarea id="pricing-message" maxLength={3000} name="message" placeholder={content.contactMessagePlaceholder} value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} rows={4} required /></div>
              </div>
              <div className="pricing-form-actions"><p>{content.selectedPackageLabel}: <strong>{selectedTier.name}</strong></p><Button variant="hero" size="lg" className="pricing-button" type="submit" disabled={inquiry.disabled}>{content.sendInquiry}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Button></div>
              <p role={inquiry.status === "error" ? "alert" : "status"}>{inquiry.message}</p>
            </form>
          </section>

          <section className="pricing-info-grid pricing-trial-links">
            <article className="pricing-info-card pricing-trial-card"><CalendarDays aria-hidden="true" className="pricing-line-icon" /><h2>{extra.trialTitle}</h2><p>{extra.trialBody}</p></article>
            <article className="pricing-info-card"><Link2 aria-hidden="true" className="pricing-line-icon" /><h2>{extra.relatedTitle}</h2><nav className="pricing-related-links" aria-label={extra.relatedTitle}>{relatedPages.map((link) => <a key={link.routeKey} href={link.href}>{link.label}<ArrowRight aria-hidden="true" /></a>)}</nav></article>
          </section>

          <section className="pricing-testimonial pricing-section" aria-label={sl ? "Kaj pravijo stranke o ceni" : "What customers say about the price"}>
            <figure><Quote className="pricing-line-icon" aria-hidden="true" /><blockquote>“{storyContent.testimonial}”</blockquote><figcaption><strong>{storyContent.representativeRole}</strong><a href={getCustomerStoryPath(story.slug, language)}>{ui.readStory}<ArrowRight aria-hidden="true" /></a></figcaption></figure>
          </section>

          <section className="pricing-faq pricing-section" aria-labelledby="pricing-faq-title">
            <h2 id="pricing-faq-title" className="pricing-section-title">{extra.faqTitle}</h2>
            <div>{(getFaqForRoute("pricing", language) ?? []).map((item, index) => (
              <details key={item.question} open={index === 0}><summary><h3>{item.question}</h3><span className="pricing-faq-symbol" aria-hidden="true"><Plus className="pricing-faq-plus" /><Minus className="pricing-faq-minus" /></span></summary><p>{item.answer}</p></details>
            ))}</div>
          </section>
        </div>
      </>}

      {standalone && showStickySummary && selectedTier.key !== "enterprise" && (
        <aside className="pricing-sticky-summary" aria-label={content.summaryTitle}>
          <div className="container mx-auto">
            <div className="pricing-sticky-selection"><span className="marketing-eyebrow">{content.selectedPackageLabel}</span><strong>{selectedTier.name}</strong><p>{userCountLabel} · {[additionalSms > 0 ? `${additionalSms} ${content.smsCountLabel}` : null, ...selectedAddOns.map(addOnLabel)].filter(Boolean).join(" · ") || content.noExtras}</p></div>
            <div className="pricing-sticky-total"><span>{content.monthlyLabel}</span><strong>{formatter.format(monthlyTotal)}</strong></div>
            {signupButton}
          </div>
        </aside>
      )}
    </section>
  );
};

export default Pricing;
