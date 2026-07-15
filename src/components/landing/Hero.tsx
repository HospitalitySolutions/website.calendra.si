import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import {
  ArrowRight,
  CalendarCheck2,
  Clock3,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const PRESENTATION_HREF = "#funkcionalnosti";

const Hero = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).hero;

  return (
    <section className="relative overflow-hidden bg-background pb-20 pt-20 md:pb-28 md:pt-28 lg:min-h-[780px] lg:pb-32 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-48 top-4 h-[680px] w-[680px] rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="absolute bottom-[-220px] right-[5%] h-[540px] w-[900px] rounded-[50%] bg-primary/[0.08] blur-3xl" />
        <div className="absolute -left-32 top-1/2 h-[340px] w-[340px] rounded-full bg-accent/[0.05] blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-[1720px] px-4 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.60fr_1.40fr] lg:gap-6 xl:grid-cols-[0.58fr_1.42fr]">
          <div className="relative z-20 max-w-[530px]">
            <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {copy.badge}
              </span>
            </motion.div>

            <motion.h1
              className="mt-7 font-display text-[2.5rem] font-extrabold leading-[1.07] tracking-[-0.04em] sm:text-[3.15rem] lg:text-[3.55rem] xl:text-[3.95rem]"
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
              className="mt-7 max-w-lg font-display text-xl font-bold leading-8 text-foreground md:text-2xl"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
            >
              {copy.supportingTitle}
            </motion.p>

            <motion.p
              className="mt-3 max-w-lg text-lg leading-8 md:text-xl"
              style={{ color: "hsl(var(--text-body))" }}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              {copy.description}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
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
                <a href={TRIAL_SIGNUP_ROUTE}>
                  {copy.primaryCta}
                  <ArrowRight className="ml-1 h-5 w-5" aria-hidden="true" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-xl border-border/80 bg-card/90 px-6 text-base font-semibold text-primary shadow-soft hover:border-primary/30 hover:bg-card"
                asChild
              >
                <a href={PRESENTATION_HREF}>
                  <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/[0.06]">
                    <Play className="ml-0.5 h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                  </span>
                  {copy.secondaryCta}
                </a>
              </Button>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col gap-5 text-sm sm:flex-row sm:items-center sm:gap-7"
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
            className="relative z-10 mx-auto w-full max-w-[1320px] pb-20 pt-8 lg:-mr-8 lg:pb-12 lg:pl-0 lg:pt-0 xl:-mr-16"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            <div className="pointer-events-none absolute inset-x-[2%] bottom-[1%] top-[8%] rounded-[45%] bg-primary/[0.09] blur-2xl" aria-hidden="true" />

            <div className="relative rounded-[1.8rem] border border-white/80 bg-white/75 p-2.5 shadow-[0_34px_90px_-32px_hsl(var(--primary)/0.35)] backdrop-blur-sm lg:-rotate-[0.7deg] lg:p-3.5">
              <div className="overflow-hidden rounded-[1.35rem] border border-border/60 bg-white">
                <img
                  src="/hero/calendra-calendar.webp"
                  alt={copy.screenshotAlt}
                  className="block h-auto w-full"
                  width="2000"
                  height="767"
                />
              </div>
            </div>

            <motion.div
              className="absolute left-[20%] top-[44%] hidden w-[250px] -translate-x-1/2 rounded-2xl border border-border/60 bg-card/95 p-5 shadow-[0_22px_55px_-28px_hsl(220_25%_10%/0.35)] backdrop-blur md:block xl:left-[17%]"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.48 }}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/[0.09] text-primary">
                  <Clock3 className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-3xl font-extrabold text-foreground">{copy.savedTimeValue}</p>
                  <p className="mt-1 font-semibold text-foreground">{copy.savedTimeLabel}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy.savedTimeDetail}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-0 right-[8%] w-[275px] rounded-2xl border border-border/60 bg-card/95 p-5 shadow-[0_22px_55px_-28px_hsl(220_25%_10%/0.35)] backdrop-blur sm:w-[300px] lg:bottom-[-4%] lg:right-[8%]"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.68 }}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/[0.1] text-emerald-600">
                  <CalendarCheck2 className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-3xl font-extrabold text-foreground">{copy.appointmentsValue}</p>
                  <p className="font-semibold text-foreground">{copy.appointmentsLabel}</p>
                  <p className="text-xs text-muted-foreground">{copy.appointmentsDetail}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
