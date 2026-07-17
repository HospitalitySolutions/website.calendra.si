import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Check, Minus, ShieldCheck, Sparkles, Users } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { APP_BASE_URL } from "@/lib/site";
import { useSiteLanguage } from "@/lib/site-language";
import {
  FALLBACK_PUBLIC_PRICING,
  fetchPublicPricingCatalog,
  type PublicPricingCatalog,
  type PublicPricingFeature,
  type PublicPricingPlan,
  type PublicPricingPlanKey,
} from "@/lib/public-pricing";

type BillingCycle = "monthly" | "annual";

const planDescriptions = {
  sl: {
    basic: "Za posameznike in samostojne izvajalce, ki začenjajo.",
    pro: "Za rastoča podjetja, ki želijo več avtomatizacije in podpore.",
    business: "Za večje ekipe, ki želijo najboljšo uporabniško izkušnjo.",
    enterprise: "Za več lokacij, posebne procese in integracije po meri.",
  },
  en: {
    basic: "For individuals and solo providers getting started.",
    pro: "For growing businesses that need more automation and support.",
    business: "For larger teams that want the best customer experience.",
    enterprise: "For multiple locations, custom processes, and tailored integrations.",
  },
} as const;

const copy = {
  sl: {
    eyebrow: "Cenik",
    title: "Izberite paket, ki ustreza vašemu poslovanju",
    intro:
      "Vse prikazane cene vključujejo DDV. En uporabnik je vključen v vsak paket, pri letnem plačilu pa prihranite dva meseca.",
    monthly: "Mesečno",
    annual: "Letno",
    saveTwoMonths: "Prihranite 2 meseca",
    vatIncluded: "DDV vključen",
    popular: "Priljubljeno",
    perMonth: "/ mesec",
    billedAnnually: (amount: string) => `Obračunano ${amount} na leto`,
    includedUser: "1 uporabnik vključen",
    select: (name: string) => `Izberi ${name}`,
    contact: "Kontaktirajte nas",
    customPrice: "Po meri",
    customPriceNote: "Cena glede na obseg in zahteve",
    comparisonTitle: "Primerjava paketov",
    comparisonIntro:
      "Vrstice se samodejno berejo iz razdelka »What's included in this plan« v Platform Adminu.",
    functionality: "Funkcionalnost",
    enterprise: "Enterprise",
    usersTitle: "Dodatni uporabniki",
    usersIntro:
      "Prvi uporabnik je vključen v paket. Cena dodatnih uporabnikov se z rastjo ekipe zniža.",
    userRange: (from: number, to: number | null) =>
      to == null
        ? `Od ${from}. uporabnika dalje`
        : `Od ${from}. do ${to}. uporabnika`,
    perUserMonth: "/ uporabnika / mesec",
    allPricesVat: "Vsi zneski vključujejo DDV.",
    ctaTitle: "Preizkusite Calendro brezplačno 14 dni",
    ctaBody:
      "Začnite z enim uporabnikom in brez obveznosti. Paket lahko spremenite kadarkoli.",
    ctaButton: "Preizkusite brezplačno",
    recommendationTitle: "Kateri paket je pravi za vaše podjetje?",
    recommendations: {
      basic: "Za enostavno vodenje terminov in strank.",
      pro: "Za račune, opomnike, plačila in rast ekipe.",
      business: "Za napredne procese, več lokacij in analitiko.",
      enterprise: "Za posebne zahteve in razvoj po meri.",
    },
    allFeatures: "Vse aktivne funkcionalnosti",
    customBenefits: [
      "Prilagoditve in razvoj po meri",
      "Povezave z vašimi obstoječimi sistemi",
      "Namenska pomoč pri uvedbi",
      "Dogovorjeni pogoji podpore",
    ],
  },
  en: {
    eyebrow: "Pricing",
    title: "Choose the plan that fits your business",
    intro:
      "All displayed prices include VAT. One user is included with every plan, and annual billing saves two months.",
    monthly: "Monthly",
    annual: "Annual",
    saveTwoMonths: "Save 2 months",
    vatIncluded: "VAT included",
    popular: "Popular",
    perMonth: "/ month",
    billedAnnually: (amount: string) => `Billed ${amount} per year`,
    includedUser: "1 user included",
    select: (name: string) => `Choose ${name}`,
    contact: "Contact us",
    customPrice: "Custom",
    customPriceNote: "Pricing based on scope and requirements",
    comparisonTitle: "Compare plans",
    comparisonIntro:
      "Rows are automatically read from the “What's included in this plan” section in Platform Admin.",
    functionality: "Feature",
    enterprise: "Enterprise",
    usersTitle: "Additional users",
    usersIntro:
      "The first user is included. The price per additional user decreases as your team grows.",
    userRange: (from: number, to: number | null) =>
      to == null ? `From user ${from} onward` : `Users ${from}–${to}`,
    perUserMonth: "/ user / month",
    allPricesVat: "All amounts include VAT.",
    ctaTitle: "Try Calendra free for 14 days",
    ctaBody:
      "Start with one user and no commitment. You can change your plan at any time.",
    ctaButton: "Start free trial",
    recommendationTitle: "Which plan is right for your business?",
    recommendations: {
      basic: "For straightforward appointment and client management.",
      pro: "For invoicing, reminders, payments, and team growth.",
      business: "For advanced processes, multiple locations, and analytics.",
      enterprise: "For custom requirements and tailored development.",
    },
    allFeatures: "All active features",
    customBenefits: [
      "Tailored development and configuration",
      "Connections with your existing systems",
      "Dedicated onboarding assistance",
      "Agreed support conditions",
    ],
  },
} as const;

const planOrder: PublicPricingPlanKey[] = ["basic", "pro", "business"];

const priceFormatter = (language: "sl" | "en", currency = "EUR") =>
  new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const buildRegisterUrl = (plan: PublicPricingPlan, billing: BillingCycle) => {
  const params = new URLSearchParams({
    plan: plan.key,
    package: plan.packageCode,
    billing,
    interval: billing === "annual" ? "YEARLY" : "MONTHLY",
    users: "1",
    sms: "0",
  });
  return `${APP_BASE_URL}/register?${params.toString()}`;
};

const Pricing = () => {
  const { language } = useSiteLanguage();
  const locale = language === "en" ? "en" : "sl";
  const text = copy[locale];
  const [catalog, setCatalog] = useState<PublicPricingCatalog>(
    FALLBACK_PUBLIC_PRICING,
  );
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicPricingCatalog(controller.signal)
      .then((nextCatalog) => {
        setCatalog(nextCatalog);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Could not load public pricing catalog", error);
        setCatalog(FALLBACK_PUBLIC_PRICING);
      });
    return () => controller.abort();
  }, []);

  const formatter = useMemo(
    () => priceFormatter(locale, catalog.currency || "EUR"),
    [catalog.currency, locale],
  );

  const featuresByKey = useMemo(
    () => new Map(catalog.features.map((feature) => [feature.key, feature])),
    [catalog.features],
  );

  const plans = useMemo(
    () =>
      planOrder
        .map((key) => catalog.plans.find((plan) => plan.key === key))
        .filter((plan): plan is PublicPricingPlan => Boolean(plan)),
    [catalog.plans],
  );

  const featureTitle = (feature: PublicPricingFeature) =>
    locale === "sl" ? feature.nameSl || feature.name : feature.name;

  const featureDescription = (feature: PublicPricingFeature) =>
    locale === "sl"
      ? feature.descriptionSl || feature.description
      : feature.description;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <section className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            {text.eyebrow}
          </span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {text.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {text.intro}
          </p>

          <div className="mt-7 inline-flex rounded-2xl border border-border/70 bg-card p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
                billing === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {text.monthly}
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition ${
                billing === "annual"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {text.annual}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                  billing === "annual"
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {text.saveTwoMonths}
              </span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {text.vatIncluded}
          </div>
        </section>

        <section className="mt-12 rounded-[1.75rem] border border-border/70 bg-muted/35 p-5 sm:p-7">
          <h2 className="text-lg font-extrabold">{text.recommendationTitle}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {plans.map((plan) => (
              <div key={`recommendation-${plan.key}`} className="rounded-2xl bg-background p-4 shadow-sm">
                <strong className="text-sm">
                  {locale === "sl" ? plan.nameSl || plan.name : plan.name}
                </strong>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {text.recommendations[plan.key]}
                </p>
              </div>
            ))}
            <div className="rounded-2xl bg-background p-4 shadow-sm">
              <strong className="text-sm">{text.enterprise}</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {text.recommendations.enterprise}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid items-stretch gap-4 lg:grid-cols-4">
          {plans.map((plan) => {
            const planName = locale === "sl" ? plan.nameSl || plan.name : plan.name;
            const annualMonthly = plan.annualGross / 12;
            const displayedPrice =
              billing === "monthly" ? plan.monthlyGross : annualMonthly;
            const includedFeatures = plan.featureKeys
              .map((key) => featuresByKey.get(key))
              .filter((feature): feature is PublicPricingFeature => Boolean(feature));

            return (
              <article
                key={plan.key}
                className={`relative flex min-h-[590px] flex-col rounded-[1.65rem] border p-5 shadow-sm transition sm:p-6 ${
                  plan.popular
                    ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/20 lg:-translate-y-1"
                    : "border-border/75 bg-card"
                }`}
              >
                {plan.popular ? (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-950">
                    <Sparkles className="h-3 w-3" />
                    {text.popular}
                  </span>
                ) : null}

                <div className={plan.popular ? "pr-24" : ""}>
                  <h2 className="text-lg font-extrabold">{planName}</h2>
                  <p
                    className={`mt-2 min-h-[48px] text-sm leading-6 ${
                      plan.popular ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {planDescriptions[locale][plan.key]}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-black tracking-tight">
                      {formatter.format(displayedPrice)}
                    </span>
                    <span
                      className={`pb-1 text-xs font-bold ${
                        plan.popular ? "text-white/75" : "text-muted-foreground"
                      }`}
                    >
                      {text.perMonth}
                    </span>
                  </div>
                  {billing === "annual" ? (
                    <p
                      className={`mt-2 text-xs font-bold ${
                        plan.popular ? "text-white/75" : "text-muted-foreground"
                      }`}
                    >
                      {text.billedAnnually(formatter.format(plan.annualGross))}
                    </p>
                  ) : null}
                  <div
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                      plan.popular
                        ? "bg-white/15 text-white"
                        : "bg-primary/8 text-primary"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {text.includedUser}
                  </div>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {includedFeatures.slice(0, 8).map((feature) => (
                    <li key={`${plan.key}-${feature.key}`} className="flex gap-2.5 text-sm leading-5">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.popular ? "text-white" : "text-primary"
                        }`}
                      />
                      <span>{featureTitle(feature)}</span>
                    </li>
                  ))}
                  {includedFeatures.length > 8 ? (
                    <li
                      className={`text-xs font-extrabold ${
                        plan.popular ? "text-white/75" : "text-primary"
                      }`}
                    >
                      + {includedFeatures.length - 8} {text.allFeatures.toLowerCase()}
                    </li>
                  ) : null}
                </ul>

                <a
                  href={buildRegisterUrl(plan, billing)}
                  className={`mt-7 inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    plan.popular
                      ? "border border-white/35 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white"
                      : "bg-primary text-primary-foreground shadow-md shadow-primary/15 hover:brightness-105 focus-visible:ring-primary"
                  }`}
                >
                  {text.select(planName)}
                </a>
              </article>
            );
          })}

          <article className="flex min-h-[590px] flex-col rounded-[1.65rem] border-2 border-primary/75 bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-extrabold">{text.enterprise}</h2>
            <p className="mt-2 min-h-[48px] text-sm leading-6 text-muted-foreground">
              {planDescriptions[locale].enterprise}
            </p>
            <div className="mt-6">
              <span className="text-4xl font-black tracking-tight">
                {text.customPrice}
              </span>
              <p className="mt-2 text-xs font-bold text-muted-foreground">
                {text.customPriceNote}
              </p>
            </div>
            <ul className="mt-8 flex-1 space-y-3">
              {text.customBenefits.map((benefit) => (
                <li key={benefit} className="flex gap-2.5 text-sm leading-5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
              <li className="flex gap-2.5 text-sm font-extrabold leading-5 text-primary">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{text.allFeatures}</span>
              </li>
            </ul>
            <a
              href="mailto:info@calendra.si?subject=Calendra%20Enterprise"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground shadow-md shadow-primary/15 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {text.contact}
            </a>
          </article>
        </section>

        <section className="mt-16">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight">
              {text.comparisonTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {text.comparisonIntro}
            </p>
          </div>

          <div className="mt-7 overflow-x-auto rounded-[1.5rem] border border-border/70 bg-card shadow-sm">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-muted/35">
                  <th className="px-5 py-4 text-left font-extrabold">
                    {text.functionality}
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={`head-${plan.key}`}
                      className={`px-4 py-4 text-center font-extrabold ${
                        plan.popular ? "text-primary" : ""
                      }`}
                    >
                      {locale === "sl" ? plan.nameSl || plan.name : plan.name}
                    </th>
                  ))}
                  <th className="px-4 py-4 text-center font-extrabold">
                    {text.enterprise}
                  </th>
                </tr>
              </thead>
              <tbody>
                {catalog.features.map((feature) => (
                  <tr
                    key={`comparison-${feature.key}`}
                    className="border-b border-border/55 last:border-0 hover:bg-muted/20"
                  >
                    <th className="px-5 py-4 text-left font-bold">
                      <span>{featureTitle(feature)}</span>
                      {featureDescription(feature) ? (
                        <span className="mt-1 block max-w-md text-xs font-medium leading-5 text-muted-foreground">
                          {featureDescription(feature)}
                        </span>
                      ) : null}
                    </th>
                    {plans.map((plan) => {
                      const included = feature.includedPlans.includes(plan.key);
                      return (
                        <td key={`${feature.key}-${plan.key}`} className="px-4 py-4 text-center">
                          {included ? (
                            <Check className="mx-auto h-4 w-4 text-primary" aria-label="Included" />
                          ) : (
                            <Minus className="mx-auto h-4 w-4 text-muted-foreground/45" aria-label="Not included" />
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-center">
                      <Check className="mx-auto h-4 w-4 text-primary" aria-label="Included" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[1.5rem] border border-primary/15 bg-primary/[0.055] p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold">{text.usersTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {text.usersIntro}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {catalog.additionalUserRules.map((rule) => (
                <div
                  key={`${rule.fromUser}-${rule.toUser ?? "plus"}`}
                  className="rounded-2xl border border-border/65 bg-background p-4"
                >
                  <strong className="block text-sm">
                    {text.userRange(rule.fromUser, rule.toUser)}
                  </strong>
                  <div className="mt-2 flex items-end gap-1.5">
                    <span className="text-2xl font-black text-primary">
                      {formatter.format(rule.monthlyGrossPerUser)}
                    </span>
                    <span className="pb-0.5 text-xs font-bold text-muted-foreground">
                      {text.perUserMonth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold text-muted-foreground">
              {text.allPricesVat}
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-[1.5rem] border border-border/70 bg-card p-6 sm:p-8">
            <div>
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary">
                14 dni
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">{text.ctaTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {text.ctaBody}
              </p>
            </div>
            <a
              href={`${APP_BASE_URL}/register`}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {text.ctaButton}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
