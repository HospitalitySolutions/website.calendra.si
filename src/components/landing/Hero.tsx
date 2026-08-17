import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  Check,
  Clock3,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { HERO_IMAGE } from "@/lib/hero-media";
import { useSiteLanguage } from "@/lib/site-language";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).hero;
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const [showStickyCtas, setShowStickyCtas] = useState(false);

  useEffect(() => {
    const heroCtas = heroCtaRef.current;
    if (!heroCtas) return;

    let frame = 0;
    const updateVisibility = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setShowStickyCtas(heroCtas.getBoundingClientRect().bottom < 0);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const metricCards = [
    {
      value: copy.savedTimeValue,
      label: copy.savedTimeLabel,
      detail: copy.savedTimeDetail,
      icon: Clock3,
      accent: "blue",
    },
    {
      value: copy.appointmentsValue,
      label: copy.appointmentsLabel,
      detail: copy.appointmentsDetail,
      icon: CalendarCheck2,
      accent: "green",
    },
    {
      value: copy.teamsValue,
      label: copy.teamsLabel,
      detail: copy.teamsDetail,
      icon: UsersRound,
      accent: "orange",
    },
  ] as const;

  const secondLine = language === "sl"
    ? { before: "termine in račune ", highlighted: "na enem mestu" }
    : { before: "and invoicing ", highlighted: "in one place" };

  const firstLine = language === "sl" ? "Naročanje strank," : "Appointment booking, scheduling";

  return (
    <>
      <section className="relative overflow-hidden bg-transparent pb-14 pt-14 sm:pt-16 md:pb-20 md:pt-20 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-[-180px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[90px]" />
          <div className="absolute -left-32 top-[50%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.08] blur-[100px]" />
          <div className="absolute -right-24 top-[46%] h-[400px] w-[400px] rounded-full bg-orange-400/[0.10] blur-[95px]" />
        </div>

        <div className="container relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1120px] text-center">
            <span className="marketing-pill inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {copy.badge}
            </span>

            <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.052em] text-foreground sm:text-[3.7rem] lg:text-[4.8rem] xl:text-[5.35rem]">
              <span className="block">{firstLine}</span>
              <span className="block">
                {secondLine.before}
                <span className="text-primary">{secondLine.highlighted}</span>
                <span className="text-primary">.</span>
              </span>
            </h1>

            <p className="mt-5 font-display text-lg font-bold leading-7 text-accent sm:text-xl md:text-[1.35rem]">
              {copy.supportingTitle}
            </p>
            <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {copy.description}
            </p>

            <div ref={heroCtaRef} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="lg" className="h-14 rounded-[14px] px-8 text-base font-semibold shadow-[0_16px_36px_-14px_hsl(var(--primary)/0.62)]" asChild>
                <a
                  href={TRIAL_SIGNUP_ROUTE}
                  onClick={() => trackMarketingEvent("trial_cta_click", { placement: "homepage_hero", language })}
                >
                  {copy.primaryCta}
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-[14px] border-primary/35 bg-white/85 px-8 text-base font-semibold text-primary shadow-sm backdrop-blur hover:bg-white" asChild>
                <a
                  href={language === "sl" ? "/predstavitev" : "/en/demo"}
                  onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "homepage_hero", language })}
                >
                  <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
                  {copy.secondaryCta}
                </a>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm">
              {[copy.freeTrial, copy.noCard, copy.cancelAnytime].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-primary/[0.09] text-primary">
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto mt-10 max-w-[1260px] pt-4 md:mt-12 md:px-16 lg:mt-14 lg:px-24">
            <div className="pointer-events-none absolute inset-x-[4%] bottom-[-4%] top-[8%] rounded-[48%] bg-gradient-to-r from-blue-500/[0.18] via-violet-400/[0.13] to-orange-400/[0.17] blur-[58px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-14 -left-12 h-52 w-80 rounded-[55%_45%_62%_38%] bg-gradient-to-br from-primary/50 to-violet-400/15 opacity-45 blur-xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-16 -right-8 h-48 w-80 rounded-[46%_54%_42%_58%] bg-gradient-to-br from-orange-300/55 to-accent/20 opacity-55 blur-xl" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/90 bg-white/92 p-2.5 shadow-[0_42px_100px_-40px_rgba(38,90,190,0.42)] backdrop-blur md:p-3">
              <div className="overflow-hidden rounded-[23px] border border-slate-200/80 bg-white">
                <div className="relative flex h-11 items-center border-b border-slate-200/70 bg-gradient-to-b from-white to-slate-50/90 px-4">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="absolute left-1/2 flex h-7 w-[42%] -translate-x-1/2 items-center justify-center rounded-lg bg-slate-100/90 text-[10px] font-semibold text-slate-500 sm:text-xs">
                    app.calendra.si
                  </div>
                </div>
                <img
                  src={HERO_IMAGE.src}
                  srcSet={HERO_IMAGE.srcSet}
                  sizes={HERO_IMAGE.sizes}
                  alt={copy.screenshotAlt}
                  className="block h-auto w-full saturate-[1.12] contrast-[1.02]"
                  width={HERO_IMAGE.width}
                  height={HERO_IMAGE.height}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            <div className="absolute left-0 top-[28%] hidden w-[215px] -rotate-1 md:block lg:left-[-1%]">
              <MetricCard {...metricCards[0]} />
            </div>
            <div className="absolute -right-1 top-[13%] hidden w-[230px] rotate-1 md:block lg:right-[-1%]">
              <MetricCard {...metricCards[1]} />
            </div>
            <div className="absolute -right-2 bottom-[6%] hidden w-[230px] -rotate-1 lg:block">
              <MetricCard {...metricCards[2]} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 md:hidden">
              {metricCards.map((metric) => (
                <MetricCard key={metric.value} {...metric} compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      {showStickyCtas ? (
        <div className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="mx-auto grid max-w-[720px] gap-2 rounded-[20px] border border-white/80 bg-white/92 p-2.5 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.36)] backdrop-blur-xl sm:grid-cols-2">
            <Button variant="hero" size="lg" className="h-12 w-full rounded-[13px] px-5 text-sm font-semibold sm:text-base" asChild>
              <a
                href={TRIAL_SIGNUP_ROUTE}
                onClick={() => trackMarketingEvent("trial_cta_click", { placement: "homepage_sticky", language })}
              >
                {copy.primaryCta}
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-12 w-full rounded-[13px] border-primary/25 bg-white px-5 text-sm font-semibold text-primary sm:text-base" asChild>
              <a
                href={language === "sl" ? "/predstavitev" : "/en/demo"}
                onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "homepage_sticky", language })}
              >
                <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
                {copy.secondaryCta}
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

type MetricCardProps = {
  value: string;
  label: string;
  detail: string;
  icon: typeof Clock3;
  accent: "blue" | "green" | "orange";
  compact?: boolean;
};

const accentStyles = {
  blue: {
    icon: "bg-blue-500/[0.10] text-blue-600",
    value: "text-blue-600",
    line: "from-blue-500 to-cyan-400",
  },
  green: {
    icon: "bg-emerald-500/[0.11] text-emerald-600",
    value: "text-emerald-600",
    line: "from-emerald-500 to-teal-400",
  },
  orange: {
    icon: "bg-orange-500/[0.11] text-orange-600",
    value: "text-orange-600",
    line: "from-orange-500 to-amber-400",
  },
} as const;

const MetricCard = ({ value, label, detail, icon: Icon, accent, compact = false }: MetricCardProps) => {
  const styles = accentStyles[accent];
  return (
    <div className={`relative overflow-hidden rounded-[22px] border border-white/90 bg-white/95 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.34)] backdrop-blur ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start gap-3.5">
        <span className={`grid shrink-0 place-items-center rounded-full ${styles.icon} ${compact ? "h-10 w-10" : "h-11 w-11"}`}>
          <Icon className={compact ? "h-5 w-5" : "h-[22px] w-[22px]"} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className={`font-display font-extrabold leading-none ${styles.value} ${compact ? "text-2xl" : "text-[1.75rem]"}`}>{value}</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-foreground">{label}</p>
          <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{detail}</p>
        </div>
      </div>
      <div className={`mt-4 h-1.5 w-full rounded-full bg-gradient-to-r ${styles.line} opacity-80`} aria-hidden="true" />
    </div>
  );
};

export default Hero;
