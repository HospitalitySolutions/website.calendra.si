import { Button } from "@/components/ui/button";
import { REGISTER_ROUTE } from "@/lib/routes";
import { Check, Star, X as XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";

type CellValue = boolean | string;

type Tier = {
  name: string;
  price: string;
  priceSuffix?: string;
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
  tiers: Tier[];
  comparisonRows: Array<{ label: string; values: CellValue[] }>;
};

const translations: Record<SiteLanguage, TranslationSet> = {
  sl: {
    badge: "Priljubljeno",
    sectionEyebrow: "Cenik",
    sectionTitle: "Enostavno & transparentno",
    sectionDescription: "Izberite paket, ki najbolj ustreza vašemu poslovanju.",
    comparisonTitle: "Primerjava paketov",
    comparisonHeader: "Funkcionalnost",
    tiers: [
      {
        name: "Osnovno",
        price: "14,90€",
        priceSuffix: "/ mesec",
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
        name: "Profesionalno",
        price: "24,90€",
        priceSuffix: "/ mesec",
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
        name: "Premium",
        price: "39,90€",
        priceSuffix: "/ mesec",
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
  },
  en: {
    badge: "Popular",
    sectionEyebrow: "Pricing",
    sectionTitle: "Simple & transparent",
    sectionDescription: "Choose the plan that best fits your business.",
    comparisonTitle: "Package comparison",
    comparisonHeader: "Feature",
    tiers: [
      {
        name: "Basic",
        price: "14.90€",
        priceSuffix: "/ month",
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
        name: "Professional",
        price: "24.90€",
        priceSuffix: "/ month",
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
        name: "Premium",
        price: "39.90€",
        priceSuffix: "/ month",
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
  },
};

const Pricing = ({ standalone = false }: { standalone?: boolean }) => {
  const { language } = useSiteLanguage();
  const content = useMemo(() => translations[language], [language]);

  return (
    <section id={standalone ? undefined : "cenik"} className={`${standalone ? "pt-0" : "scroll-mt-20"} bg-card py-20 md:py-28`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">{content.sectionEyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
            {content.sectionTitle}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{content.sectionDescription}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-7 ${
                tier.accent ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border/50 bg-background"
              }`}
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
                asChild
              >
                <a href={REGISTER_ROUTE}>{tier.cta}</a>
              </Button>
            </motion.div>
          ))}
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
      </div>
    </section>
  );
};

export default Pricing;
