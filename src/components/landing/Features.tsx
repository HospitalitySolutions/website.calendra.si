import {
  ArrowRight,
  Bell,
  CalendarCheck2,
  CalendarDays,
  Check,
  CircleDollarSign,
  Plug,
  Receipt,
  Users,
} from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";

const featureIcons = [CalendarCheck2, CalendarDays, Receipt, Users, Bell, Plug] as const;
const detailRouteKeys: CanonicalRouteKey[] = ["booking", "calendar", "invoicing", "clientManagement", "reminders", "integrations"];
const featurePairs = [[0, 1], [2, 3], [4, 5]] as const;

const Features = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).features;

  return (
    <section id="funkcionalnosti" className="scroll-mt-20 bg-transparent py-16 md:py-20 lg:py-28">
      <div className="container mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="marketing-eyebrow">{copy.eyebrow}</span>
          <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[3rem]">{copy.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.description}</p>
        </div>

        <div className="mt-14 grid gap-20 md:mt-[4.5rem] lg:gap-28">
          {featurePairs.map(([firstIndex, secondIndex], pairIndex) => {
            const first = copy.items[firstIndex];
            const second = copy.items[secondIndex];
            const FirstIcon = featureIcons[firstIndex];
            const SecondIcon = featureIcons[secondIndex];
            const reversed = pairIndex % 2 === 1;

            return (
              <div key={first.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
                <div className={reversed ? "lg:order-2" : ""}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.075] text-primary">
                    <FirstIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.035em] text-foreground sm:text-[2.35rem] sm:leading-[1.08]">
                    {first.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{first.description}</p>
                  <a
                    href={getRoutePath(detailRouteKeys[firstIndex], language)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                  >
                    {first.linkLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>

                  <div className="mt-8 flex max-w-xl gap-4 border-t border-border/60 pt-6">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/[0.10] text-orange-600">
                      <SecondIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold text-foreground">{second.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{second.description}</p>
                      <a
                        href={getRoutePath(detailRouteKeys[secondIndex], language)}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                      >
                        {second.linkLabel}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className={reversed ? "lg:order-1" : ""}>
                  <FeatureVisual index={pairIndex} language={language} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeatureVisual = ({ index, language }: { index: number; language: "sl" | "en" }) => {
  if (index === 0) {
    const days = language === "sl" ? ["PON", "TOR", "SRE", "ČET", "PET"] : ["MON", "TUE", "WED", "THU", "FRI"];
    return (
      <div className="relative mx-auto min-h-[390px] max-w-[620px] sm:min-h-[430px]">
        <div className="absolute inset-8 rounded-[48%] bg-gradient-to-br from-blue-500/[0.16] via-violet-400/[0.09] to-cyan-300/[0.11] blur-3xl" aria-hidden="true" />
        <div className="absolute left-0 top-4 w-[86%] overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_34px_80px_-38px_rgba(15,23,42,0.42)]">
          <div className="flex h-11 items-center justify-between border-b border-slate-200/70 px-4">
            <span className="font-semibold text-foreground">{language === "sl" ? "Koledar terminov" : "Appointment calendar"}</span>
            <span className="rounded-lg bg-primary/[0.07] px-3 py-1 text-xs font-semibold text-primary">{language === "sl" ? "Teden" : "Week"}</span>
          </div>
          <div className="grid grid-cols-5 border-b border-slate-100 bg-slate-50/70 px-3 py-2 text-center text-[10px] font-bold text-slate-500">
            {days.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="relative h-64 bg-[linear-gradient(to_bottom,#eef2f7_1px,transparent_1px)] bg-[length:100%_42px] px-4 py-3">
            <div className="absolute left-[8%] top-8 w-[18%] rounded-lg border border-blue-200 bg-blue-100 px-2 py-2 text-[10px] font-semibold text-blue-900">08:30 · Nina</div>
            <div className="absolute left-[31%] top-[74px] w-[18%] rounded-lg border border-emerald-200 bg-emerald-100 px-2 py-2 text-[10px] font-semibold text-emerald-900">10:00 · Ana</div>
            <div className="absolute left-[53%] top-5 w-[18%] rounded-lg border border-amber-200 bg-amber-100 px-2 py-2 text-[10px] font-semibold text-amber-900">08:00 · Maja</div>
            <div className="absolute left-[70%] top-[116px] w-[20%] rounded-lg border border-violet-200 bg-violet-100 px-2 py-2 text-[10px] font-semibold text-violet-900">12:00 · Petra</div>
            <div className="absolute left-[19%] top-[168px] w-[20%] rounded-lg border border-pink-200 bg-pink-100 px-2 py-2 text-[10px] font-semibold text-pink-900">14:30 · Sara</div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-[47%] rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_28px_64px_-34px_rgba(15,23,42,0.44)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{language === "sl" ? "Spletno naročanje" : "Online booking"}</p>
          <p className="mt-3 font-display text-lg font-bold text-foreground">{language === "sl" ? "Izberite termin" : "Choose a time"}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {["09:00", "10:30", "13:00", "16:30"].map((time, i) => <span key={time} className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold ${i === 1 ? "border-primary bg-primary text-white" : "border-border bg-slate-50 text-foreground"}`}>{time}</span>)}
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="relative mx-auto min-h-[390px] max-w-[600px] sm:min-h-[430px]">
        <div className="absolute inset-12 rounded-[50%] bg-gradient-to-br from-emerald-400/[0.13] via-blue-400/[0.09] to-orange-300/[0.10] blur-3xl" aria-hidden="true" />
        <div className="absolute right-0 top-5 w-[68%] rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_32px_76px_-38px_rgba(15,23,42,0.40)]">
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/[0.10] text-emerald-600"><Receipt className="h-5 w-5" /></span>
            <span className="text-xs font-semibold text-muted-foreground">#2026-0184</span>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{language === "sl" ? "Račun za termin" : "Appointment invoice"}</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-foreground">61,00 €</p>
          <div className="mt-5 grid gap-3 border-t border-border/60 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{language === "sl" ? "Storitev" : "Service"}</span><span className="font-semibold">Masaža</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">DDV</span><span className="font-semibold">22 %</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{language === "sl" ? "Status" : "Status"}</span><span className="font-semibold text-emerald-600">{language === "sl" ? "Plačano" : "Paid"}</span></div>
          </div>
        </div>
        <div className="absolute bottom-3 left-0 w-[60%] rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_28px_64px_-34px_rgba(15,23,42,0.40)]">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-violet-500/[0.11] text-violet-600"><Users className="h-5 w-5" /></span>
            <div><p className="font-bold text-foreground">Ana Novak</p><p className="text-xs text-muted-foreground">ana@example.com</p></div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{language === "sl" ? "Obiski" : "Visits"}</p><p className="mt-1 text-xl font-bold">18</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{language === "sl" ? "Poraba" : "Spend"}</p><p className="mt-1 text-xl font-bold">680 €</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-[390px] max-w-[600px] sm:min-h-[430px]">
      <div className="absolute inset-10 rounded-[50%] bg-gradient-to-br from-cyan-400/[0.14] via-blue-400/[0.09] to-orange-300/[0.11] blur-3xl" aria-hidden="true" />
      <div className="absolute left-[5%] top-5 w-[78%] rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_32px_76px_-38px_rgba(15,23,42,0.40)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/[0.10] text-cyan-600"><Bell className="h-5 w-5" /></span>
          <div><p className="font-bold text-foreground">{language === "sl" ? "Opomnik za termin" : "Appointment reminder"}</p><p className="text-xs text-muted-foreground">SMS + e-mail</p></div>
        </div>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-muted-foreground">
          {language === "sl" ? "Pozdravljeni, jutri ob 10:30 imate rezerviran termin. Veselimo se vašega obiska." : "Hello, you have an appointment tomorrow at 10:30. We look forward to seeing you."}
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-600"><Check className="h-4 w-4" />{language === "sl" ? "Samodejno poslano" : "Sent automatically"}</div>
      </div>
      <div className="absolute bottom-3 right-0 w-[62%] rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_28px_64px_-34px_rgba(15,23,42,0.40)]">
        <div className="flex items-center justify-between"><p className="font-bold text-foreground">{language === "sl" ? "Povezane storitve" : "Connected services"}</p><Plug className="h-5 w-5 text-orange-500" /></div>
        <div className="mt-4 grid gap-2">
          {["Google Calendar", "Stripe", "Zoom"].map((name, i) => <div key={name} className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2.5 text-sm"><span className="font-medium">{name}</span><span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-blue-500" : i === 1 ? "bg-violet-500" : "bg-sky-500"}`} /></div>)}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><CircleDollarSign className="h-4 w-4 text-primary" />{language === "sl" ? "Vse na enem mestu" : "Everything in one place"}</div>
      </div>
    </div>
  );
};

export default Features;
