import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { REGISTER_ROUTE } from "@/lib/routes";
import { LEGAL } from "@/lib/legal";
import { Building2, Check, Globe2, MessageSquareText, Send, Star, Users, X as XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";

type CellValue = boolean | string;
type PlanKey = "basic" | "professional" | "premium" | "enterprise";

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
  sectionDescription: string;
  comparisonTitle: string;
  comparisonHeader: string;
  calculatorTitle: string;
  calculatorDescription: string;
  packageSelectorTitle: string;
  addOnsTitle: string;
  usersLabel: string;
  usersHint: string;
  usersCountLabel: string;
  smsLabel: string;
  smsHint: string;
  smsCountLabel: string;
  optionsLabel: string;
  optionFiscal: string;
  optionWebsite: string;
  optionPremises: string;
  monthlyLabel: string;
  oneTimeLabel: string;
  firstInvoiceLabel: string;
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
    sectionDescription: "Izberite paket, ki najbolj ustreza vašemu poslovanju.",
    comparisonTitle: "Primerjava paketov",
    comparisonHeader: "Funkcionalnost",
    calculatorTitle: "Izračunajte svoj mesečni paket",
    calculatorDescription: "Izberite paket, nastavite dodatne uporabnike in SMS sporočila ter vključite dodatne module.",
    packageSelectorTitle: "1. Izberite paket",
    addOnsTitle: "Dodatne možnosti",
    usersLabel: "2. Dodatni uporabniki",
    usersHint: "Vsak dodatni uporabnik: 9,90€ / mesec",
    usersCountLabel: "uporabnikov",
    smsLabel: "3. Dodatna SMS sporočila",
    smsHint: "Vsako dodatno SMS sporočilo: 0,06€",
    smsCountLabel: "SMS sporočil",
    optionsLabel: "4. Dodatni moduli",
    optionFiscal: "Davčna blagajna",
    optionWebsite: "Izdelava spletne strani",
    optionPremises: "Poslovni prostor",
    monthlyLabel: "Mesečno skupaj",
    oneTimeLabel: "Enkratni strošek",
    firstInvoiceLabel: "Predviden prvi račun",
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
    sectionDescription: "Choose the plan that best fits your business.",
    comparisonTitle: "Package comparison",
    comparisonHeader: "Feature",
    calculatorTitle: "Build your monthly plan",
    calculatorDescription: "Choose a package, set additional users and SMS messages, and include the modules you need.",
    packageSelectorTitle: "1. Choose a package",
    addOnsTitle: "Additional options",
    usersLabel: "2. Additional users",
    usersHint: "Each additional user: €9.90 / month",
    usersCountLabel: "users",
    smsLabel: "3. Additional SMS messages",
    smsHint: "Each additional SMS message: €0.06",
    smsCountLabel: "SMS messages",
    optionsLabel: "4. Add-on modules",
    optionFiscal: "Fiscal cash register",
    optionWebsite: "Website creation",
    optionPremises: "Business premises",
    monthlyLabel: "Monthly total",
    oneTimeLabel: "One-time cost",
    firstInvoiceLabel: "Estimated first invoice",
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

const USERS_PRICE = 9.9;
const SMS_PRICE = 0.06;
const FISCAL_PRICE = 9.9;
const WEBSITE_BUILD_PRICE = 49.9;
const PREMISES_PRICE = 19.9;
const USER_SLIDER_MAX = 20;
const SMS_SLIDER_MAX = 1000;
const SMS_SLIDER_STEP = 50;
const INCLUDED_USERS = 1;

const scrollToElement = (element: HTMLElement | null) => {
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Pricing = ({ standalone = false }: { standalone?: boolean }) => {
  const { language } = useSiteLanguage();
  const content = useMemo(() => translations[language], [language]);
  const [selectedTierKey, setSelectedTierKey] = useState<PlanKey>("premium");
  const [additionalUsers, setAdditionalUsers] = useState(INCLUDED_USERS);
  const [additionalSms, setAdditionalSms] = useState(0);
  const [fiscalCashRegister, setFiscalCashRegister] = useState(false);
  const [websiteCreation, setWebsiteCreation] = useState(false);
  const [businessPremises, setBusinessPremises] = useState(false);
  const [contactCompany, setContactCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [showStickySummary, setShowStickySummary] = useState(false);
  const configuratorRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-US", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [language],
  );

  const selectedTier = useMemo(
    () => content.tiers.find((tier) => tier.key === selectedTierKey) ?? content.tiers[0],
    [content, selectedTierKey],
  );
  const supportsPremises = selectedTier.key === "professional" || selectedTier.key === "premium";
  const billableUsers = Math.max(0, additionalUsers - INCLUDED_USERS);

  useEffect(() => {
    if (!supportsPremises) {
      setBusinessPremises(false);
    }
  }, [supportsPremises]);

  useEffect(() => {
    if (!standalone || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan === "basic" || plan === "professional" || plan === "premium" || plan === "enterprise") {
      setSelectedTierKey(plan);
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
    billableUsers * USERS_PRICE +
    additionalSms * SMS_PRICE +
    (fiscalCashRegister ? FISCAL_PRICE : 0) +
    (businessPremises && supportsPremises ? PREMISES_PRICE : 0);
  const oneTimeTotal = websiteCreation ? WEBSITE_BUILD_PRICE : 0;
  const firstInvoiceEstimate = monthlyTotal + oneTimeTotal;

  const selectedItems = [
    additionalUsers > INCLUDED_USERS ? `${additionalUsers} ${content.usersCountLabel}` : null,
    additionalSms > 0 ? `${additionalSms} ${content.smsCountLabel}` : null,
    fiscalCashRegister ? `${content.optionFiscal} (${content.monthlyLabel.toLowerCase()})` : null,
    websiteCreation ? `${content.optionWebsite} (${content.oneTimeLabel.toLowerCase()})` : null,
    businessPremises && supportsPremises ? `${content.optionPremises} (${content.monthlyLabel.toLowerCase()})` : null,
  ].filter(Boolean) as string[];

  const handleTierSelect = (tierKey: PlanKey) => {
    if (!standalone) {
      const target = tierKey === "enterprise" ? `/cenik?plan=${tierKey}#contact-form` : `/cenik?plan=${tierKey}#pricing-configurator`;
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
      `${content.oneTimeLabel}: ${formatter.format(oneTimeTotal)}`,
      "",
      `${content.contactMessage}:`,
      contactMessage || "-",
    ];

    const mailto = `mailto:${LEGAL.generalEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  };

  return (
    <section
      id={standalone ? undefined : "cenik"}
      className={`${standalone ? "pt-0 pb-36 md:pb-40" : "scroll-mt-20"} bg-card py-20 md:py-28`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">{content.sectionEyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
            {content.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{content.sectionDescription}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.tiers.map((tier, index) => {
            const isSelected = selectedTierKey === tier.key;
            return (
              <motion.div
                key={tier.name}
                className={`relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-all ${
                  tier.accent ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border/50 bg-background"
                } ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                initial={{ opacity: 0, y: 20 }}
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

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
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

        <motion.div className="mt-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="mb-8 text-center font-display text-2xl font-bold" style={{ color: "hsl(var(--text-heading))" }}>
            {content.comparisonTitle}
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">{content.comparisonHeader}</th>
                  {content.tiers.map((tier) => (
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
                    {row.values.map((value, valueIndex) => (
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
          <>
            <motion.div
              id="pricing-configurator"
              ref={configuratorRef}
              className="mt-20 rounded-3xl border border-border/50 bg-background p-6 shadow-sm md:p-8"
              initial={{ opacity: 0, y: 20 }}
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
                    <Slider value={[additionalUsers]} onValueChange={(value) => setAdditionalUsers(value[0] ?? INCLUDED_USERS)} min={INCLUDED_USERS} max={USER_SLIDER_MAX} step={1} />
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
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 p-4 transition hover:border-primary/40">
                      <Checkbox checked={fiscalCashRegister} onCheckedChange={(checked) => setFiscalCashRegister(Boolean(checked))} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">{content.optionFiscal}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{formatter.format(FISCAL_PRICE)} / {language === "sl" ? "mesec" : "month"}</p>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 p-4 transition hover:border-primary/40">
                      <Checkbox checked={websiteCreation} onCheckedChange={(checked) => setWebsiteCreation(Boolean(checked))} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">{content.optionWebsite}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{formatter.format(WEBSITE_BUILD_PRICE)}</p>
                      </div>
                    </label>

                    {supportsPremises && (
                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 p-4 transition hover:border-primary/40">
                        <Checkbox checked={businessPremises} onCheckedChange={(checked) => setBusinessPremises(Boolean(checked))} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-foreground">{content.optionPremises}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{formatter.format(PREMISES_PRICE)} / {language === "sl" ? "mesec" : "month"}</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="contact-form"
              ref={contactRef}
              className="mt-20 rounded-3xl border border-border/50 bg-background p-6 shadow-sm md:p-8"
              initial={{ opacity: 0, y: 20 }}
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

                <div className="grid gap-2 rounded-2xl border border-border/60 bg-background p-4 sm:grid-cols-3 sm:items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{content.monthlyLabel}</p>
                    <p className="text-lg font-semibold text-foreground">{formatter.format(monthlyTotal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{content.oneTimeLabel}</p>
                    <p className="text-lg font-semibold text-foreground">{formatter.format(oneTimeTotal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{content.firstInvoiceLabel}</p>
                    <p className="font-display text-2xl font-bold text-primary">{formatter.format(firstInvoiceEstimate)}</p>
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full rounded-xl lg:w-auto lg:min-w-[240px]" asChild>
                  <a href={REGISTER_ROUTE}>{content.continueToRegister}</a>
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
