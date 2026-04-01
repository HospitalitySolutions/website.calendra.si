import { useState } from "react";
import { Button } from "@/components/ui/button";
import { REGISTER_ROUTE } from "@/lib/routes";
import { Check, X as XIcon, Star } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Osnovno",
    monthlyPrice: 0,
    description: "Za posameznike, ki začenjajo.",
    features: ["1 uporabnik", "Do 30 rezervacij/mesec", "Koledar", "E-poštna podpora"],
    popular: false,
    accent: false,
  },
  {
    name: "Profesionalno",
    monthlyPrice: 19,
    description: "Za rastočo prakso.",
    features: ["Do 3 uporabniki", "Neomejene rezervacije", "Izdajanje računov", "SMS opomniki", "Analitika", "Podatki o strankah"],
    popular: false,
    accent: false,
  },
  {
    name: "Premium",
    monthlyPrice: 39,
    description: "Vse funkcionalnosti za zahtevne.",
    features: ["Do 10 uporabnikov", "Vse iz Profesionalnega", "AI glasovni ukazi", "Integracije (Stripe, Zoom)", "Prioritetna podpora", "Izvoz podatkov"],
    popular: true,
    accent: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: -1,
    description: "Za organizacije po meri.",
    features: ["Neomejeni uporabniki", "Vse iz Premium", "Prilagojen onboarding", "SLA garancija", "API dostop", "Namenski account manager"],
    popular: false,
    accent: false,
  },
];

const YEARLY_DISCOUNT = 0.15;

// Comparison table data
const comparisonFeatures = [
  { label: "Uporabniki", values: ["1", "Do 3", "Do 10", "Neomejeno"] },
  { label: "Rezervacije / mesec", values: ["30", "∞", "∞", "∞"] },
  { label: "Koledar", values: [true, true, true, true] },
  { label: "Izdajanje računov", values: [false, true, true, true] },
  { label: "SMS opomniki", values: [false, true, true, true] },
  { label: "Analitika", values: [false, true, true, true] },
  { label: "Podatki o strankah", values: [false, true, true, true] },
  { label: "AI glasovni ukazi", values: [false, false, true, true] },
  { label: "Integracije (Stripe, Zoom)", values: [false, false, true, true] },
  { label: "Izvoz podatkov", values: [false, false, true, true] },
  { label: "Prioritetna podpora", values: [false, false, true, true] },
  { label: "API dostop", values: [false, false, false, true] },
  { label: "SLA garancija", values: [false, false, false, true] },
  { label: "Prilagojen onboarding", values: [false, false, false, true] },
  { label: "Namenski account manager", values: [false, false, false, true] },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

  const getPrice = (monthly: number) => {
    if (monthly <= 0) return null;
    const price = yearly ? Math.round(monthly * (1 - YEARLY_DISCOUNT)) : monthly;
    return price;
  };

  return (
    <section id="cenik" className="scroll-mt-20 bg-card py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Cenik</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
            Enostavno &amp; transparentno
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">14 dni brezplačno, brez obveznosti.</p>
        </div>

        {/* Monthly / Yearly toggle */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <span className={`text-sm font-medium transition-colors ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Mesečno</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              yearly ? "bg-primary" : "bg-muted"
            }`}
            aria-label="Preklopi med mesečnim in letnim obračunavanjem"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-card shadow-sm transition-transform ${
                yearly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
            Letno
          </span>
          {yearly && (
            <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              -15%
            </span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, i) => {
            const price = getPrice(t.monthlyPrice);
            const isCustom = t.monthlyPrice < 0;

            return (
              <motion.div
                key={t.name}
                className={`relative flex flex-col overflow-hidden rounded-2xl border p-7 ${
                  t.accent
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border-border/50 bg-background"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {t.popular && (
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    <Star className="h-3 w-3" /> Priljubljeno
                  </span>
                )}
                <h3 className={`font-display text-lg font-bold ${t.accent ? "" : "text-foreground"}`}>{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`font-display text-4xl font-extrabold ${t.accent ? "" : "text-foreground"}`}>
                    {isCustom ? "Po meri" : `${price} €`}
                  </span>
                  {!isCustom && price !== null && (
                    <span className={`text-sm ${t.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      / {yearly ? "mesec, letno" : "mesec"}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${t.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.description}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {t.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${t.accent ? "text-primary-foreground/90" : "text-foreground"}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.accent ? "text-accent" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={t.accent ? "hero-outline" : "hero"}
                  size="lg"
                  className={`mt-8 w-full rounded-xl ${
                    t.accent ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" : ""
                  }`}
                  asChild
                >
                  <a href={REGISTER_ROUTE}>
                    {isCustom ? "Kontaktirajte nas" : `Izberi ${t.name}`}
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature comparison table */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-8 text-center font-display text-2xl font-bold" style={{ color: "hsl(var(--text-heading))" }}>
            Primerjava paketov
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Funkcionalnost</th>
                  {tiers.map((t) => (
                    <th key={t.name} className={`px-4 py-4 text-center font-semibold ${t.accent ? "text-primary" : "text-foreground"}`}>
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.label} className={`border-b border-border/30 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                    <td className="px-6 py-3 font-medium text-foreground">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-4 py-3 text-center">
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="mx-auto h-4 w-4 text-primary" />
                          ) : (
                            <XIcon className="mx-auto h-4 w-4 text-muted-foreground/40" />
                          )
                        ) : (
                          <span className="font-medium text-foreground">{val}</span>
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
