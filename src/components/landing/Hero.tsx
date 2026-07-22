import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  Clock3,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { getSiteCopy } from "@/lib/site-copy";
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
      iconClass: "bg-primary/[0.09] text-primary",
    },
    {
      value: copy.appointmentsValue,
      label: copy.appointmentsLabel,
      detail: copy.appointmentsDetail,
      icon: CalendarCheck2,
      iconClass: "bg-emerald-500/[0.11] text-emerald-600",
    },
    {
      value: copy.teamsValue,
      label: copy.teamsLabel,
      detail: copy.teamsDetail,
      icon: UsersRound,
      iconClass: "bg-violet-500/[0.10] text-violet-600",
    },
  ] as const;

  return (
    <>
      <section className="relative overflow-hidden bg-background pb-16 pt-16 sm:pt-20 md:pb-20 lg:pb-24 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-40 top-4 h-[620px] w-[620px] rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="absolute bottom-[-220px] right-[8%] h-[500px] w-[860px] rounded-[50%] bg-primary/[0.07] blur-3xl" />
        <div className="absolute -left-32 top-[38%] h-[320px] w-[320px] rounded-full bg-accent/[0.05] blur-3xl" />
        <div className="absolute right-[3%] top-[17%] hidden h-44 w-44 opacity-35 lg:block [background-image:radial-gradient(hsl(var(--primary)/0.35)_1.2px,transparent_1.2px)] [background-size:18px_18px]" />
      </div>

      <div className="container relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-8 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="relative z-20 max-w-[610px]">
            <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {copy.badge}
              </span>
            </motion.div>

            <motion.h1
              className="mt-7 font-display text-[2.65rem] font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-[3.35rem] lg:text-[3.8rem] xl:text-[4.25rem]"
              style={{ color: "hsl(var(--text-heading))" }}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              {copy.title1}
              <br />
              {copy.title2.replace(/\.$/, "")}
              <span className="text-primary">.</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl font-display text-xl font-bold leading-8 text-foreground md:text-[1.35rem]"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
            >
              {copy.supportingTitle}
            </motion.p>

            <motion.p
              className="mt-3 max-w-xl text-base leading-7 sm:text-lg sm:leading-8"
              style={{ color: "hsl(var(--text-body))" }}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              {copy.description}
            </motion.p>

            <motion.div
              ref={heroCtaRef}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
            >
              <Button
                variant="hero"
                size="lg"
                className="h-14 rounded-xl px-7 text-base font-semibold shadow-xl shadow-primary/25 sm:px-8"
                asChild
              >
                <a
                  href={TRIAL_SIGNUP_ROUTE}
                  onClick={() => trackMarketingEvent("trial_cta_click", { placement: "homepage_hero", language })}
                >
                  {copy.primaryCta}
                  <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-xl border-border/80 bg-card/90 px-6 text-base font-semibold text-primary shadow-soft hover:border-primary/30 hover:bg-card hover:text-primary"
                asChild
              >
                <a
                  href={language === "sl" ? "/predstavitev" : "/en/demo"}
                  onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "homepage_hero", language })}
                >
                  <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.06]">
                    <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                  </span>
                  {copy.secondaryCta}
                </a>
              </Button>
            </motion.div>

            <motion.div
              className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.3 }}
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                {copy.freeTrial}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/50" aria-hidden="true" />
                {copy.noCard}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/50" aria-hidden="true" />
                {copy.cancelAnytime}
              </span>
            </motion.div>

            <motion.div
              className="mt-9 flex flex-col gap-5 text-sm sm:flex-row sm:items-center sm:gap-7"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.38 }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.07] text-primary">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{copy.trustPrefix}</p>
                  <p className="font-display text-lg font-bold text-primary">{copy.trustedCompanies}</p>
                </div>
              </div>

              <div className="hidden h-11 w-px bg-border sm:block" aria-hidden="true" />

              <div>
                <div className="flex items-center gap-0.5" aria-label={copy.reviewRating}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-1 font-medium text-muted-foreground">{copy.reviewRating}</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative z-10 mx-auto w-full max-w-[1040px] pb-6 pt-2 md:pb-20 lg:-mr-5 lg:pb-14 xl:-mr-8"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            <div className="pointer-events-none absolute inset-x-[4%] bottom-[7%] top-[4%] rounded-[42%] bg-primary/[0.11] blur-3xl" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/90 p-2.5 shadow-[0_34px_90px_-30px_hsl(var(--primary)/0.38)] backdrop-blur sm:p-3">
              <div className="rounded-[1.25rem] border border-border/60 bg-white">
                <div className="relative flex h-10 items-center border-b border-border/50 bg-gradient-to-b from-white to-slate-50 px-4 sm:h-11">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="absolute left-1/2 flex h-6 w-[42%] -translate-x-1/2 items-center justify-center rounded-md bg-slate-100 text-[10px] font-medium text-slate-400 sm:text-xs">
                    app.calendra.si
                  </div>
                </div>
                <div className="overflow-hidden rounded-b-[1.2rem] bg-white">
                  <img
                    src="/hero/calendra-calendar-aug-2026.webp"
                    alt={copy.screenshotAlt}
                    className="block h-auto w-full"
                    width="2400"
                    height="920"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <motion.div
              className="absolute bottom-[1%] left-[-1%] hidden w-[235px] rounded-2xl border border-border/60 bg-card/95 p-4 shadow-[0_22px_55px_-28px_hsl(220_25%_10%/0.35)] backdrop-blur md:block xl:left-[-4%]"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.48 }}
            >
              <MetricCard {...metricCards[0]} />
            </motion.div>

            <motion.div
              className="absolute bottom-[-2%] right-[2%] hidden w-[260px] rounded-2xl border border-border/60 bg-card/95 p-4 shadow-[0_22px_55px_-28px_hsl(220_25%_10%/0.35)] backdrop-blur md:block"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.66 }}
            >
              <MetricCard {...metricCards[1]} />
            </motion.div>

            <motion.div
              className="absolute right-[-1%] top-[20%] hidden w-[250px] rounded-2xl border border-border/60 bg-card/95 p-4 shadow-[0_22px_55px_-28px_hsl(220_25%_10%/0.35)] backdrop-blur lg:block xl:right-[-6%]"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.58 }}
            >
              <MetricCard {...metricCards[2]} />
            </motion.div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 md:hidden">
              {metricCards.map((metric) => (
                <div key={metric.value} className="rounded-2xl border border-border/60 bg-card/95 p-4 shadow-soft">
                  <MetricCard {...metric} compact />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      </section>

      {showStickyCtas ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto grid max-w-[720px] gap-2 rounded-2xl border border-border/70 bg-background/95 p-2.5 shadow-[0_24px_70px_-24px_hsl(220_35%_10%/0.45)] backdrop-blur-xl sm:grid-cols-2">
            <Button
              variant="hero"
              size="lg"
              className="h-12 w-full rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/20 sm:text-base"
              asChild
            >
              <a
                href={TRIAL_SIGNUP_ROUTE}
                onClick={() => trackMarketingEvent("trial_cta_click", { placement: "homepage_sticky", language })}
              >
                {copy.primaryCta}
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-xl border-border/80 bg-card px-5 text-sm font-semibold text-primary shadow-sm hover:border-primary/30 hover:bg-card hover:text-primary sm:text-base"
              asChild
            >
              <a
                href={language === "sl" ? "/predstavitev" : "/en/demo"}
                onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "homepage_sticky", language })}
              >
                <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
                {copy.secondaryCta}
              </a>
            </Button>
          </div>
        </motion.div>
      ) : null}
    </>
  );
};

type MetricCardProps = {
  value: string;
  label: string;
  detail: string;
  icon: typeof Clock3;
  iconClass: string;
  compact?: boolean;
};

const MetricCard = ({ value, label, detail, icon: Icon, iconClass, compact = false }: MetricCardProps) => (
  <div className="flex items-center gap-3.5">
    <span className={`flex shrink-0 items-center justify-center rounded-full ${iconClass} ${compact ? "h-10 w-10" : "h-11 w-11"}`}>
      <Icon className={compact ? "h-5 w-5" : "h-[22px] w-[22px]"} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className={`font-display font-extrabold leading-none text-foreground ${compact ? "text-2xl" : "text-[1.7rem]"}`}>{value}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-foreground">{label}</p>
      <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{detail}</p>
    </div>
  </div>
);

export default Hero;
