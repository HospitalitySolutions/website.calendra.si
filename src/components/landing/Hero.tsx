import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  LayoutGrid,
  Menu,
  ShieldCheck,
  Star,
} from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { trackMarketingEvent } from "@/lib/marketing-events";

const DESKTOP_APPOINTMENTS = [
  { day: 1, row: 2, time: "09:30–10:00", client: "Tina Novak", service: "Masaža", tone: "lime" },
  { day: 1, row: 4, time: "14:30–15:30", client: "Sara V.", service: "Joga", tone: "pink" },
  { day: 2, row: 1, time: "08:00–09:00", client: "Ana K.", service: "Fizioterapija", tone: "orange" },
  { day: 2, row: 3, time: "11:00–12:00", client: "Luka B.", service: "Osebni trening", tone: "mint" },
  { day: 2, row: 5, time: "16:00–17:00", client: "Miha B.", service: "Masaža", tone: "orange" },
  { day: 3, row: 2, time: "09:00–10:00", client: "Marko P.", service: "Svetovanje", tone: "blue" },
  { day: 3, row: 4, time: "13:30–14:30", client: "Nete K.", service: "Manikura", tone: "violet" },
  { day: 4, row: 3, time: "11:00–12:00", client: "David R.", service: "Frizer", tone: "amber" },
  { day: 5, row: 2, time: "09:30–10:30", client: "Nejc R.", service: "Masaža", tone: "cyan" },
] as const;

const MOBILE_APPOINTMENTS = [
  { time: "09:30", client: "Tina Novak", service: "Masaža", tone: "lime" },
  { time: "10:00", client: "Marko P.", service: "Svetovanje", tone: "blue" },
  { time: "11:30", client: "Sara V.", service: "Joga", tone: "pink" },
  { time: "13:00", client: "Nejc R.", service: "Masaža", tone: "mint" },
  { time: "15:00", client: "Miha B.", service: "Osebni trening", tone: "orange" },
] as const;

const toneClasses = {
  lime: "border-lime-300 bg-lime-100 text-lime-950",
  pink: "border-pink-300 bg-pink-100 text-pink-950",
  orange: "border-orange-300 bg-orange-100 text-orange-950",
  mint: "border-emerald-300 bg-emerald-100 text-emerald-950",
  blue: "border-sky-300 bg-sky-100 text-sky-950",
  violet: "border-violet-300 bg-violet-100 text-violet-950",
  amber: "border-amber-300 bg-amber-100 text-amber-950",
  cyan: "border-cyan-300 bg-cyan-100 text-cyan-950",
} as const;

const Hero = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).hero;

  return (
    <section className="relative overflow-hidden bg-transparent pb-16 pt-10 sm:pt-12 md:pb-20 lg:pb-24 lg:pt-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-[9%] top-2 h-[500px] w-[680px] rounded-full bg-blue-500/[0.06] blur-[105px]" />
        <div className="absolute right-[-5%] top-[20%] h-[330px] w-[400px] rounded-full bg-violet-500/[0.05] blur-[100px]" />
        <div className="absolute left-[-12%] top-[20%] h-[300px] w-[340px] rounded-full bg-orange-400/[0.04] blur-[100px]" />
      </div>

      <div className="container relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-11 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-10 xl:gap-14">
          <div className="relative z-20 max-w-[620px] text-left">
            <h1 className="font-display text-[2.6rem] font-extrabold leading-[0.99] tracking-[-0.052em] text-foreground sm:text-[3.25rem] lg:text-[3.65rem] xl:text-[4.05rem]">
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
            <p className="mt-3 max-w-[590px] text-base leading-7 text-muted-foreground sm:text-[1.02rem] sm:leading-8">
              {copy.description}
            </p>

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
              <Button variant="outline" size="lg" className="h-[52px] rounded-[12px] border-primary/25 bg-white/90 px-7 text-sm font-semibold text-primary shadow-sm backdrop-blur hover:bg-white sm:text-base" asChild>
                <a
                  href={language === "sl" ? "/predstavitev" : "/en/demo"}
                  onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "homepage_hero", language })}
                >
                  <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
                  {copy.secondaryCta}
                </a>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-foreground/75 sm:text-sm">
              {[
                { label: copy.freeTrial, icon: ShieldCheck },
                { label: copy.noCard, icon: CreditCard },
                { label: copy.cancelAnytime, icon: Check },
              ].map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-primary/20 bg-primary/[0.055] text-primary">
                    <Icon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-w-0 lg:pt-1">
            <div className="pointer-events-none absolute inset-x-[4%] bottom-[5%] top-[3%] rounded-[42%] bg-gradient-to-br from-primary/[0.13] via-violet-400/[0.08] to-accent/[0.08] blur-[52px]" aria-hidden="true" />

            <HeroProductMockup language={language} />
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-6 text-sm lg:mt-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/[0.075] text-primary">
              <CircleUserRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[12px] text-muted-foreground">{copy.trustPrefix}</span>
              <span className="font-display text-lg font-extrabold text-foreground">{copy.trustedCompanies}</span>
            </span>
          </div>
          <span className="hidden h-11 w-px bg-border/80 sm:block" aria-hidden="true" />
          <div>
            <div className="flex gap-0.5" aria-label={copy.reviewRating}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-[18px] w-[18px] fill-accent text-accent" aria-hidden="true" />
              ))}
            </div>
            <span className="mt-1 block text-[12px] text-muted-foreground">{copy.reviewRating}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroProductMockup = ({ language }: { language: "sl" | "en" }) => {
  const weekDays = language === "sl"
    ? ["PON", "TOR", "SRE", "ČET", "PET", "SOB", "NED"]
    : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const dates = [19, 20, 21, 22, 23, 24, 25];

  return (
    <div className="relative mx-auto w-full max-w-[860px] pb-7 pr-[10%] sm:pb-8 sm:pr-[12%] lg:pb-3 lg:pr-[10%]">
      <div className="relative overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_34px_82px_-34px_rgba(36,72,130,0.38)]">
        <div className="relative flex h-10 items-center border-b border-slate-200/80 bg-white px-3 sm:h-11 sm:px-4">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="absolute left-1/2 flex h-6 w-[40%] -translate-x-1/2 items-center justify-center rounded-lg bg-slate-100/90 text-[8px] font-semibold text-slate-500 sm:h-7 sm:text-[10px]">
            app.calendra.si
          </div>
        </div>

        <div className="flex h-[310px] bg-white sm:h-[380px] lg:h-[420px]">
          <div className="flex w-10 shrink-0 flex-col items-center gap-4 bg-[#092c67] py-4 text-white/65 sm:w-12">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white sm:h-8 sm:w-8">
              <span className="font-display text-xs font-black">C</span>
            </span>
            <LayoutGrid className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            <CircleUserRound className="h-3.5 w-3.5" aria-hidden="true" />
            <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex h-11 items-center justify-between border-b border-slate-200/80 px-3 text-[8px] text-slate-600 sm:h-12 sm:px-4 sm:text-[10px]">
              <div className="flex items-center gap-2">
                <button className="rounded-md border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-700" type="button">{language === "sl" ? "Teden" : "Week"}</button>
                <button className="hidden rounded-md border border-slate-200 p-1 sm:block" type="button"><Menu className="h-3 w-3" /></button>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <ChevronLeft className="h-3 w-3" />
                <span>19 – 25. maj 2025</span>
                <ChevronRight className="h-3 w-3" />
              </div>
              <div className="hidden gap-1 md:flex">
                <span className="rounded-md border border-slate-200 px-2 py-1">{language === "sl" ? "Dan" : "Day"}</span>
                <span className="rounded-md bg-primary/10 px-2 py-1 font-bold text-primary">{language === "sl" ? "Teden" : "Week"}</span>
                <span className="rounded-md border border-slate-200 px-2 py-1">{language === "sl" ? "Mesec" : "Month"}</span>
              </div>
            </div>

            <div className="grid grid-cols-[34px_1fr] sm:grid-cols-[42px_1fr]">
              <div className="border-r border-slate-200/80 bg-slate-50/30 pt-[45px] text-right text-[7px] font-medium text-slate-400 sm:pt-[50px] sm:text-[8px]">
                {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"].map((time) => (
                  <div key={time} className="h-[42px] pr-1 sm:h-[52px] sm:pr-2 lg:h-[58px]">{time}</div>
                ))}
              </div>
              <div className="relative min-w-0">
                <div className="grid h-[44px] grid-cols-7 border-b border-slate-200/80 bg-white sm:h-[49px]">
                  {weekDays.map((day, index) => (
                    <div key={day} className="flex flex-col items-center justify-center border-r border-slate-200/70 text-[6px] font-bold text-slate-500 last:border-r-0 sm:text-[7px]">
                      <span>{day}</span>
                      <span className={`mt-0.5 text-[8px] sm:text-[10px] ${index === 2 ? "text-primary" : "text-slate-700"}`}>{dates[index]}</span>
                    </div>
                  ))}
                </div>
                <div className="hero-schedule-grid relative grid h-[252px] grid-cols-7 grid-rows-6 sm:h-[312px] lg:h-[359px]">
                  {Array.from({ length: 42 }).map((_, index) => (
                    <div key={index} className="border-b border-r border-slate-200/60 last:border-r-0" aria-hidden="true" />
                  ))}
                  {DESKTOP_APPOINTMENTS.map((appointment) => (
                    <div
                      key={`${appointment.day}-${appointment.row}-${appointment.client}`}
                      className={`relative z-10 m-1 overflow-hidden rounded-[5px] border px-1 py-1 text-[5px] leading-tight shadow-sm sm:m-1.5 sm:px-1.5 sm:text-[7px] lg:text-[8px] ${toneClasses[appointment.tone]}`}
                      style={{ gridColumn: appointment.day, gridRow: appointment.row }}
                    >
                      <span className="block font-bold opacity-70">{appointment.time}</span>
                      <span className="mt-0.5 block font-extrabold">{appointment.client}</span>
                      <span className="block opacity-75">{appointment.service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-[27%] min-w-[106px] max-w-[190px] sm:w-[25%] lg:-right-1 lg:bottom-[-18px]">
        <div className="rounded-[26px] border-[5px] border-slate-700 bg-white p-1.5 shadow-[0_28px_60px_-24px_rgba(15,23,42,0.45)] sm:rounded-[32px] sm:border-[6px] sm:p-2">
          <div className="mx-auto mb-1 h-1.5 w-8 rounded-full bg-slate-800/90 sm:mb-2 sm:h-2 sm:w-10" />
          <div className="flex items-center justify-between px-1 pb-1 text-[5px] font-semibold text-slate-700 sm:text-[7px]">
            <ChevronLeft className="h-2.5 w-2.5" />
            <span>{language === "sl" ? "Maj 2025" : "May 2025"}</span>
            <Menu className="h-2.5 w-2.5" />
          </div>
          <div className="grid grid-cols-5 gap-0.5 border-b border-slate-100 pb-1 text-center text-[4px] text-slate-400 sm:text-[6px]">
            {[19, 20, 21, 22, 23].map((date) => (
              <span key={date} className={date === 21 ? "rounded-full bg-primary py-0.5 font-bold text-white" : "py-0.5"}>{date}</span>
            ))}
          </div>
          <div className="space-y-1.5 px-0.5 py-1.5 sm:space-y-2 sm:px-1 sm:py-2">
            {MOBILE_APPOINTMENTS.map((appointment) => (
              <div key={`${appointment.time}-${appointment.client}`} className={`rounded-[5px] border px-1 py-1 text-[4px] leading-tight sm:px-1.5 sm:text-[6px] ${toneClasses[appointment.tone]}`}>
                <div className="flex gap-1">
                  <span className="font-extrabold">{appointment.time}</span>
                  <span className="font-bold">{appointment.client}</span>
                </div>
                <span className="opacity-75">{appointment.service}</span>
              </div>
            ))}
          </div>
          <div className="mt-0.5 grid grid-cols-4 border-t border-slate-100 pt-1.5 text-slate-400">
            <LayoutGrid className="mx-auto h-2.5 w-2.5 text-primary" />
            <CalendarClock className="mx-auto h-2.5 w-2.5" />
            <CircleUserRound className="mx-auto h-2.5 w-2.5" />
            <CreditCard className="mx-auto h-2.5 w-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
