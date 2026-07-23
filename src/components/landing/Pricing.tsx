import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { buildPackageSignupRoute, type PricingSignupSummary } from "@/lib/routes";
import { LEGAL } from "@/lib/legal";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { getRoutePath } from "@/lib/localized-routes";
import { BellRing, Building2, CalendarDays, Check, Link2, MessageSquareText, Receipt, Send, Star, Users, X as XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  FALLBACK_PUBLIC_PRICING,
  fetchPublicPricingCatalog,
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
    enterprisePanelResponse: "Odzovemo se v 24 urah.",
    usersLabel: "2. Dodatni uporabniki",
    usersHint: "Vsak dodatni uporabnik: 9,90€ / mesec",
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
    enterprisePanelResponse: "We respond within 24 hours.",
    usersLabel: "2. Additional users",
    usersHint: "Each additional user: €9.90 / month",
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
    extra: ["Dodatni uporabniki: 9,90 € / mesec", "Dodatna SMS sporočila: 0,06 € / sporočilo", "Izbrani dodatni moduli"],
    trialTitle: "Pogoji brezplačnega preizkusa",
    trialBody: "Brezplačni preizkus traja 14 dni in ne zahteva kreditne kartice. Pred potrditvijo plačljivega paketa vidite izbrani paket, dodatke ter ocenjeni mesečni in prvi račun.",
    relatedTitle: "Preverite povezane funkcionalnosti",
    related: [
      { key: "booking", label: "Spletno naročanje" },
      { key: "calendar", label: "Koledar terminov" },
      { key: "reminders", label: "SMS in e-poštni opomniki" },
      { key: "invoicing", label: "Računi in plačila" },
      { key: "integrations", label: "Integracije" },
    ],
    faqTitle: "Pogosta vprašanja o ceniku",
    faq: [
      { q: "Ali je v ceni vključen uporabnik?", a: "Da. Vsak paket vključuje enega uporabnika. Dodatne uporabnike lahko dodate po objavljeni mesečni ceni." },
      { q: "Kako se obračunajo SMS sporočila?", a: "SMS sporočila se obračunajo glede na izbrano količino oziroma porabo po ceni, prikazani v konfiguratorju." },
      { q: "Ali lahko paket pozneje spremenim?", a: "Da. Paket, število uporabnikov in dodatke lahko prilagodite glede na razvoj poslovanja." },
      { q: "Ali potrebujem kreditno kartico za preizkus?", a: "Ne. Za 14-dnevni brezplačni preizkus kreditna kartica ni potrebna." },
    ],
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
    extra: ["Additional users: €9.90 / month", "Additional SMS messages: €0.06 / message", "Selected add-on modules"],
    trialTitle: "Free-trial terms",
    trialBody: "The free trial lasts 14 days and does not require a credit card. Before confirming a paid plan, you can review the selected package, add-ons and estimated monthly and first invoice.",
    relatedTitle: "Explore related features",
    related: [
      { key: "booking", label: "Online booking" },
      { key: "calendar", label: "Appointment calendar" },
      { key: "reminders", label: "SMS and email reminders" },
      { key: "invoicing", label: "Invoicing and payments" },
      { key: "integrations", label: "Integrations" },
    ],
    faqTitle: "Pricing questions",
    faq: [
      { q: "Is one user included?", a: "Yes. Every plan includes one user. Additional users can be added at the published monthly price." },
      { q: "How are SMS messages charged?", a: "SMS messages are charged based on the selected quantity or usage at the price shown in the configurator." },
      { q: "Can I change plans later?", a: "Yes. You can adjust the plan, user count and add-ons as your business develops." },
      { q: "Do I need a credit card for the trial?", a: "No. A credit card is not required for the 14-day free trial." },
    ],
  },
} as const;

const USER_SLIDER_MAX = 20;
const SMS_SLIDER_MAX = 1000;
const SMS_SLIDER_STEP = 50;

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
  const baseContent = useMemo(() => translations[language], [language]);
  const [pricingCatalog, setPricingCatalog] = useState<PublicPricingCatalog>(FALLBACK_PUBLIC_PRICING);
  const [selectedTierKey, setSelectedTierKey] = useState<PlanKey>("professional");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [additionalUsers, setAdditionalUsers] = useState(FALLBACK_PUBLIC_PRICING.includedUsers);
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
      ? language === "sl"
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
          : "Vse vključeno iz Poslovnega paketa +"
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
  const visibleAddOns = useMemo(
    () => selectedApiPlanKey
      ? pricingCatalog.addOns.filter((addOn) => addOn.availablePlans.includes(selectedApiPlanKey))
      : [],
    [pricingCatalog.addOns, selectedApiPlanKey],
  );
  const selectedAddOns = useMemo(
    () => pricingCatalog.addOns.filter((addOn) => selectedAddOnKeys.includes(addOn.key)),
    [pricingCatalog.addOns, selectedAddOnKeys],
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
      fiscalCashRegister: selectedAddOns.some((addOn) => addOn.code === "FISCAL_CASH_REGISTER"),
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
      source: standalone ? "pricing_page" : "homepage",
    });

    if (!standalone) {
      const query = `plan=${tierKey}&billing=${billingPeriod}`;
      const target = tierKey === "enterprise" ? `/cenik?${query}#contact-form` : `/cenik?${query}#pricing-configurator`;
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
    const subject = `${language === "sl" ? "Povpraševanje" : "Pricing inquiry"} - ${selectedTier.name}`;
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

    const mailto = `mailto:${LEGAL.generalEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  };

  const additionalUserCostLines = pricingCatalog.additionalUserRules.map((rule) => {
    if (language === "sl") {
      const range = rule.toUser == null
        ? `Od ${rule.fromUser}. uporabnika dalje`
        : `Od ${rule.fromUser}. do ${rule.toUser}. uporabnika`;
      return `${range}: ${formatter.format(rule.monthlyGrossPerUser)} na uporabnika/mesec`;
    }
    const range = rule.toUser == null
      ? `From user ${rule.fromUser}`
      : `Users ${rule.fromUser}–${rule.toUser}`;
    return `${range}: ${formatter.format(rule.monthlyGrossPerUser)} per user/month`;
  });
  const extraCostItems = [
    ...additionalUserCostLines,
    language === "sl"
      ? `Dodatna SMS sporočila: ${formatter.format(pricingCatalog.smsPerMessageGross)} / sporočilo`
      : `Additional SMS messages: ${formatter.format(pricingCatalog.smsPerMessageGross)} / message`,
    language === "sl" ? "Izbrani dodatni moduli" : "Selected add-on modules",
  ];

  const HeadingTag = standalone ? "h1" : "h2";

  return (
    <section
      id={standalone ? undefined : "cenik"}
      className={`${standalone ? "pt-0 pb-36 md:pb-40" : "scroll-mt-20"} bg-card py-20 md:py-28`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">{content.sectionEyebrow}</span>
          <HeadingTag className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
            {standalone ? content.standaloneTitle : content.sectionTitle}
          </HeadingTag>
          <p className="mt-4 text-lg text-muted-foreground">{content.sectionDescription}</p>
        </div>

        <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex w-full max-w-max items-center rounded-full border border-border/70 bg-background p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                billingPeriod === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {content.billingMonthlyLabel}
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("annual")}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                billingPeriod === "annual"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {content.billingAnnualLabel}
            </button>
          </div>

          <div className="inline-flex max-w-full items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {content.billingAnnualSavingsLabel.replace("{months}", String(annualSavingsMonths))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packageTiers.map((tier, index) => {
            const isSelected = selectedTierKey === tier.key;
            return (
              <motion.div
                key={tier.name}
                className={`relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-all ${
                  tier.accent ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border/50 bg-background"
                } ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                {tier.popular && (
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    <Star className="h-3 w-3" /> {content.badge}
                  </span>
                )}

                <h3 className={`font-display text-lg font-bold ${tier.accent ? "" : "text-foreground"}`}>{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`font-display text-4xl font-extrabold ${tier.accent ? "" : "text-foreground"}`}>{tier.price}</span>
                  {tier.priceSuffix && (
                    <span className={`text-sm ${tier.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{tier.priceSuffix}</span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${tier.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{tier.description}</p>

                {tier.inheritedLabel && (
                  <p className={`mt-6 text-sm font-bold ${tier.accent ? "text-primary-foreground" : "text-foreground"}`}>
                    {tier.inheritedLabel}
                  </p>
                )}

                <ul className={`${tier.inheritedLabel ? "mt-4" : "mt-6"} flex flex-1 flex-col gap-2.5`}>
                  {tier.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-2 text-sm ${tier.accent ? "text-primary-foreground/90" : "text-foreground"}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.accent ? "text-accent" : "text-primary"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.accent ? "hero-outline" : "hero"}
                  size="lg"
                  className={`mt-8 w-full rounded-xl ${
                    tier.accent ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" : ""
                  }`}
                  onClick={() => handleTierSelect(tier.key)}
                >
                  {tier.cta}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {enterpriseTier && (
          <section className="mt-6 rounded-3xl border border-primary/20 bg-primary/[0.035] p-5 shadow-sm md:p-6" aria-label={enterpriseTier.name}>
            <div className="grid gap-5 lg:grid-cols-[1.25fr_2.2fr_auto] lg:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{content.enterprisePanelTitle}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{content.enterprisePanelDescription}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  enterpriseTier.features[0],
                  enterpriseTier.features[1],
                  enterpriseTier.features[3],
                  enterpriseTier.features[enterpriseTier.features.length - 1],
                ].filter(Boolean).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-stretch gap-2 lg:min-w-[190px]">
                <Button variant="hero" size="lg" className="rounded-xl" onClick={() => handleTierSelect("enterprise")}>
                  {content.enterprisePanelCta}
                </Button>
                <p className="text-center text-xs text-muted-foreground">{content.enterprisePanelResponse}</p>
              </div>
            </div>
          </section>
        )}

        <motion.div className="mt-16" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="mb-8 text-center font-display text-2xl font-bold" style={{ color: "hsl(var(--text-heading))" }}>
            {content.comparisonTitle}
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">{content.comparisonHeader}</th>
                  {packageTiers.map((tier) => (
                    <th key={tier.name} className={`px-4 py-4 text-center font-semibold ${tier.accent ? "text-primary" : "text-foreground"}`}>
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparisonRows.map((row, rowIndex) => (
                  <tr key={row.label} className={`border-b border-border/30 ${rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                    <td className="px-6 py-3 font-medium text-foreground">{row.label}</td>
                    {row.values.slice(0, packageTiers.length).map((value, valueIndex) => (
                      <td key={`${row.label}-${valueIndex}`} className="px-4 py-3 text-center">
                        {typeof value === "boolean" ? (
                          value ? <Check className="mx-auto h-4 w-4 text-primary" /> : <XIcon className="mx-auto h-4 w-4 text-muted-foreground/40" />
                        ) : (
                          <span className="font-medium text-foreground">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {standalone && (
          <section className="mt-16" aria-labelledby="charges-title">
            <h2 id="charges-title" className="text-center font-display text-2xl font-bold text-foreground">{standaloneExtras[language].chargesTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <article className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-7">
                <Check className="h-7 w-7 text-primary" />
                <h3 className="mt-5 text-xl font-bold text-foreground">{standaloneExtras[language].includedTitle}</h3>
                <ul className="mt-5 grid gap-3">{standaloneExtras[language].included.map((item, index) => { const label = index === 1 ? (language === "sl" ? `${includedUsers} uporabnik je vključen` : `${includedUsers} user included`) : item; return <li key={label} className="flex gap-3 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{label}</li>; })}</ul>
              </article>
              <article className="rounded-3xl border border-border/60 bg-background p-7">
                <Receipt className="h-7 w-7 text-primary" />
                <h3 className="mt-5 text-xl font-bold text-foreground">{standaloneExtras[language].extraTitle}</h3>
                <ul className="mt-5 grid gap-3">{extraCostItems.map((item) => <li key={item} className="flex gap-3 text-sm text-muted-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{item}</li>)}</ul>
              </article>
            </div>
          </section>
        )}

        {standalone && (
          <>
            <motion.div
              id="pricing-configurator"
              ref={configuratorRef}
              className="mt-20 rounded-3xl border border-border/50 bg-background p-6 shadow-sm md:p-8"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="max-w-3xl">
                <h3 className="font-display text-2xl font-bold text-foreground">{content.calculatorTitle}</h3>
                <p className="mt-3 text-muted-foreground">{content.calculatorDescription}</p>
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold text-foreground">{content.usersLabel}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{content.usersHint}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      {additionalUsers} {content.usersCountLabel}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Users className="h-6 w-6" />
                    </div>
                    <Slider value={[additionalUsers]} onValueChange={(value) => setAdditionalUsers(value[0] ?? includedUsers)} min={includedUsers} max={USER_SLIDER_MAX} step={1} />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold text-foreground">{content.smsLabel}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{content.smsHint}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                      {additionalSms} {content.smsCountLabel}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <MessageSquareText className="h-6 w-6" />
                    </div>
                    <Slider value={[additionalSms]} onValueChange={(value) => setAdditionalSms(value[0] ?? 0)} max={SMS_SLIDER_MAX} step={SMS_SLIDER_STEP} />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-5 md:p-6">
                  <p className="text-xl font-semibold text-foreground">{content.optionsLabel}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{content.addOnsTitle}</p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleAddOns.map((addOn) => {
                      const checked = selectedAddOnKeys.includes(addOn.key);
                      const description = addOnDescription(addOn);
                      return (
                        <label key={addOn.key} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 p-4 transition hover:border-primary/40">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(nextChecked) => {
                              setSelectedAddOnKeys((current) => {
                                if (Boolean(nextChecked)) {
                                  return current.includes(addOn.key) ? current : [...current, addOn.key];
                                }
                                return current.filter((key) => key !== addOn.key);
                              });
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-foreground">{addOnLabel(addOn)}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{formatter.format(addOn.monthlyGross)} / {language === "sl" ? "mesec" : "month"}</p>
                            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="contact-form"
              ref={contactRef}
              className="mt-20 rounded-3xl border border-border/50 bg-background p-6 shadow-sm md:p-8"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="max-w-3xl">
                <h3 className="font-display text-2xl font-bold text-foreground">{content.contactTitle}</h3>
                <p className="mt-3 text-muted-foreground">{content.contactDescription}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {content.directEmail}{" "}
                  <a className="font-medium text-primary underline underline-offset-4" href={`mailto:${LEGAL.generalEmail}`}>
                    {LEGAL.generalEmail}
                  </a>
                </p>
              </div>

              <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleInquirySubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">{content.contactCompany}</label>
                  <Input value={contactCompany} onChange={(event) => setContactCompany(event.target.value)} placeholder={content.contactCompany} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">{content.contactName}</label>
                  <Input value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder={content.contactName} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">{content.contactEmail}</label>
                  <Input type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder={content.contactEmail} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">{content.contactPhone}</label>
                  <Input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder={content.contactPhone} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-foreground">{content.contactMessage}</label>
                  <Textarea
                    value={contactMessage}
                    onChange={(event) => setContactMessage(event.target.value)}
                    placeholder={content.contactMessagePlaceholder}
                    className="min-h-[140px]"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                    {content.selectedPackageLabel}: <span className="font-semibold text-foreground">{selectedTier.name}</span>
                  </div>
                  <Button variant="hero" size="lg" className="rounded-xl" type="submit">
                    <Send className="h-4 w-4" /> {content.sendInquiry}
                  </Button>
                </div>
              </form>
            </motion.div>

            <section className="mt-16 grid gap-5 lg:grid-cols-2">
              <article className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-7">
                <CalendarDays className="h-7 w-7 text-primary" />
                <h2 className="mt-5 text-xl font-bold text-foreground">{standaloneExtras[language].trialTitle}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{standaloneExtras[language].trialBody}</p>
              </article>
              <article className="rounded-3xl border border-border/60 bg-background p-7">
                <Link2 className="h-7 w-7 text-primary" />
                <h2 className="mt-5 text-xl font-bold text-foreground">{standaloneExtras[language].relatedTitle}</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {standaloneExtras[language].related.map((item) => (
                    <a key={item.key} href={getRoutePath(item.key, language)} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">{item.label}</a>
                  ))}
                </div>
              </article>
            </section>

            <section className="mt-16" aria-labelledby="pricing-faq-title">
              <div className="flex items-center gap-3"><BellRing className="h-7 w-7 text-primary" /><h2 id="pricing-faq-title" className="font-display text-2xl font-bold text-foreground">{standaloneExtras[language].faqTitle}</h2></div>
              <div className="mt-6 grid gap-3">
                {standaloneExtras[language].faq.map((item) => (
                  <details key={item.q} className="rounded-2xl border border-border/60 bg-background p-5">
                    <summary className="cursor-pointer list-none font-semibold text-foreground">{item.q}</summary>
                    <p className="mt-3 leading-7 text-muted-foreground">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {standalone && showStickySummary && selectedTier.key !== "enterprise" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-background/95 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur supports-[backdrop-filter]:bg-background/88">
          <div className="container mx-auto px-4 py-4 lg:px-8">
            <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{content.summaryTitle}</p>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">{content.selectedItemsLabel}</p>
                    {selectedItems.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                          <span key={item} className="rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">{content.noExtras}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-background p-4">
                  <p className="text-xs text-muted-foreground">{content.monthlyLabel}</p>
                  <p className="font-display text-2xl font-bold text-primary">{formatter.format(monthlyTotal)}</p>
                </div>

                <Button variant="hero" size="lg" className="w-full rounded-xl lg:w-auto lg:min-w-[240px]" asChild>
                  <a href={signupRoute}>{content.continueToRegister}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Pricing;
