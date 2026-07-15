import { CalendarDays, Receipt, BarChart3, Users, Mic, Shield, Bell, Plug, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";

const featureIcons = [CalendarDays, Receipt, BarChart3, Users, Mic, Bell, Shield, Plug] as const;
const featureColors = [
  "bg-blue-50 text-blue-600",
  "bg-amber-50 text-amber-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
  "bg-rose-50 text-rose-600",
  "bg-cyan-50 text-cyan-600",
  "bg-slate-100 text-slate-600",
  "bg-orange-50 text-orange-600",
] as const;

const detailRouteKeys: Array<CanonicalRouteKey | undefined> = [
  "calendar",
  "invoicing",
  undefined,
  "clientManagement",
  undefined,
  "reminders",
  undefined,
  "integrations",
];

const Features = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).features;
  const detailLabel = language === "sl" ? "Preberite več" : "Learn more";

  return (
    <section id="funkcionalnosti" className="scroll-mt-20 bg-card py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 max-w-xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">{copy.eyebrow}</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
            {copy.title.split("\n").map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{copy.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.items.map((item, index) => {
            const Icon = featureIcons[index];
            const color = featureColors[index];
            const routeKey = detailRouteKeys[index];
            return (
              <motion.article
                key={item.title}
                className="group relative flex min-h-[260px] flex-col rounded-2xl border border-border/50 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                {routeKey ? (
                  <a
                    href={getRoutePath(routeKey, language)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                  >
                    {detailLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
