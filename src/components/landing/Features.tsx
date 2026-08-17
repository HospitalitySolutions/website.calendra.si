import { CalendarCheck2, CalendarDays, Receipt, Users, Bell, Plug, ArrowRight } from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";

const featureIcons = [CalendarCheck2, CalendarDays, Receipt, Users, Bell, Plug] as const;
const featureColors = [
  "bg-blue-500/[0.09] text-blue-600",
  "bg-amber-500/[0.11] text-amber-600",
  "bg-emerald-500/[0.10] text-emerald-600",
  "bg-violet-500/[0.09] text-violet-600",
  "bg-cyan-500/[0.09] text-cyan-600",
  "bg-orange-500/[0.10] text-orange-600",
] as const;
const detailRouteKeys: CanonicalRouteKey[] = ["booking", "calendar", "invoicing", "clientManagement", "reminders", "integrations"];

const Features = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).features;
  return (
    <section id="funkcionalnosti" className="scroll-mt-20 bg-transparent py-16 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="marketing-eyebrow">{copy.eyebrow}</span>
          <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[2.8rem]">{copy.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.description}</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {copy.items.map((item, index) => {
            const Icon = featureIcons[index]; const color = featureColors[index]; const routeKey = detailRouteKeys[index];
            return (
              <article key={item.title} className="marketing-card marketing-card-hover group relative flex min-h-[260px] flex-col overflow-hidden rounded-[24px] bg-white/94 p-6 sm:p-7">
                <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-32 w-32 rounded-full bg-primary/[0.035] blur-2xl" aria-hidden="true" />
                <span className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}><Icon className="h-5 w-5" /></span>
                <h3 className="relative mt-5 font-display text-lg font-bold tracking-[-0.015em] text-foreground">{item.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">{item.description}</p>
                <a href={getRoutePath(routeKey, language)} className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">{item.linkLabel}<ArrowRight className="h-4 w-4" /></a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Features;
