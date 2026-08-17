import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  Check,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { HERO_IMAGE } from "@/lib/hero-media";
import { useSiteLanguage } from "@/lib/site-language";
import { trackMarketingEvent } from "@/lib/marketing-events";

const Hero = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).hero;

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
      accent: "violet",
    },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-transparent pb-14 pt-10 sm:pt-14 md:pb-[4.5rem] lg:pb-24 lg:pt-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-[7%] top-6 h-[520px] w-[720px] rounded-full bg-blue-500/[0.08] blur-[95px]" />
        <div className="absolute right-[-4%] top-[34%] h-[360px] w-[420px] rounded-full bg-violet-500/[0.08] blur-[90px]" />
        <div className="absolute left-[-8%] top-[35%] h-[320px] w-[360px] rounded-full bg-orange-400/[0.055] blur-[92px]" />
      </div>

      <div className="container relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-10 xl:gap-16">
          <div className="relative z-20 max-w-[650px] text-left">
            <span className="marketing-pill inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-primary sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.badge}
            </span>

            <h1 className="mt-5 font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-[-0.052em] text-foreground sm:text-[3.45rem] lg:text-[4.15rem] xl:text-[4.65rem]">
              {language === "sl" ? (
                <>
                  Program za naročanje strank, termine in račune <span className="text-primary">na enem mestu</span><span className="text-accent">.</span>
                </>
              ) : (
                <>
                  Appointment booking, scheduling and invoicing <span className="text-primary">in one place</span><span className="text-accent">.</span>
                </>
              )}
            </h1>

            <p className="mt-5 font-display text-lg font-bold leading-7 text-foreground sm:text-xl">
              {copy.supportingTitle}
            </p>
            <p className="mt-3 max-w-[620px] text-base leading-7 text-muted-foreground sm:text-[1.05rem] sm:leading-8">
              {copy.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-foreground/80 sm:text-sm">
              {[copy.freeTrial, copy.noCard, copy.cancelAnytime].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-primary/20 bg-primary/[0.06] text-primary">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="lg" className="h-[52px] rounded-[12px] px-7 text-sm font-semibold shadow-[0_16px_34px_-16px_hsl(var(--primary)/0.56)] sm:text-base" asChild>
                <a
                  href={TRIAL_SIGNUP_ROUTE}
                  onClick={() => trackMarketingEvent("trial_cta_click", { placement: "homepage_hero", language })}
                >
                  {copy.primaryCta}
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="h-[52px] rounded-[12px] border-primary/25 bg-white/80 px-7 text-sm font-semibold text-primary shadow-sm backdrop-blur hover:bg-white sm:text-base" asChild>
                <a
                  href={language === "sl" ? "/predstavitev" : "/en/demo"}
                  onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "homepage_hero", language })}
                >
                  <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
                  {copy.secondaryCta}
                </a>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/[0.07] text-primary">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[11px] text-muted-foreground">{copy.trustPrefix}</span>
                  <span className="font-bold text-primary">{copy.trustedCompanies}</span>
                </span>
              </div>
              <span className="hidden h-9 w-px bg-border/75 sm:block" aria-hidden="true" />
              <div>
                <div className="flex gap-0.5" aria-label={copy.reviewRating}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <span className="mt-1 block text-[11px] text-muted-foreground">{copy.reviewRating}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 min-w-0 pb-5 lg:pb-8 lg:pt-3">
            <div className="pointer-events-none absolute inset-x-[2%] bottom-[1%] top-[3%] rounded-[42%] bg-gradient-to-br from-primary/[0.16] via-violet-400/[0.11] to-accent/[0.13] blur-[48px]" aria-hidden="true" />

            <div className="relative ml-auto w-full max-w-[850px]">
              <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_38px_90px_-38px_rgba(35,73,135,0.40)]">
                <div className="relative flex h-10 items-center border-b border-slate-200/70 bg-white px-3 sm:h-11 sm:px-4">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="absolute left-1/2 flex h-6 w-[45%] -translate-x-1/2 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-semibold text-slate-500 sm:h-7 sm:text-[11px]">
                    app.calendra.si
                  </div>
                </div>
                <div className="hero-calendar-responsive overflow-hidden bg-white">
                  <img
                    src={HERO_IMAGE.src}
                    srcSet={HERO_IMAGE.srcSet}
                    sizes={HERO_IMAGE.sizes}
                    alt={copy.screenshotAlt}
                    className="hero-calendar-image block h-auto max-w-none saturate-[1.18] contrast-[1.025]"
                    width={HERO_IMAGE.width}
                    height={HERO_IMAGE.height}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="absolute -left-8 bottom-[10%] hidden w-[190px] lg:block xl:-left-16">
                <MetricCard {...metricCards[0]} />
              </div>
              <div className="absolute -right-5 top-[8%] hidden w-[205px] lg:block xl:-right-12">
                <MetricCard {...metricCards[2]} />
              </div>
              <div className="absolute -right-4 bottom-[-4%] hidden w-[210px] lg:block xl:right-4">
                <MetricCard {...metricCards[1]} />
              </div>
            </div>

            <div className="relative mt-4 grid gap-2 sm:grid-cols-3 lg:hidden">
              {metricCards.map((metric) => (
                <MetricCard key={metric.value} {...metric} compact />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type MetricCardProps = {
  value: string;
  label: string;
  detail: string;
  icon: typeof Clock3;
  accent: "blue" | "green" | "violet";
  compact?: boolean;
};

const accentStyles = {
  blue: { icon: "bg-blue-500/[0.10] text-blue-600", value: "text-blue-600" },
  green: { icon: "bg-emerald-500/[0.11] text-emerald-600", value: "text-emerald-600" },
  violet: { icon: "bg-violet-500/[0.10] text-violet-600", value: "text-violet-600" },
} as const;

const MetricCard = ({ value, label, detail, icon: Icon, accent, compact = false }: MetricCardProps) => {
  const styles = accentStyles[accent];
  return (
    <div className={`rounded-[18px] border border-white/90 bg-white/95 shadow-[0_22px_50px_-26px_rgba(15,23,42,0.34)] backdrop-blur ${compact ? "p-3.5" : "p-4"}`}>
      <div className="flex items-start gap-3">
        <span className={`grid shrink-0 place-items-center rounded-full ${styles.icon} ${compact ? "h-9 w-9" : "h-10 w-10"}`}>
          <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className={`font-display font-extrabold leading-none ${styles.value} ${compact ? "text-xl" : "text-2xl"}`}>{value}</p>
          <p className="mt-1 text-xs font-semibold leading-4 text-foreground sm:text-sm">{label}</p>
          <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{detail}</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
