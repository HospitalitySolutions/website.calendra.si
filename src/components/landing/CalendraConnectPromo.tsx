import { Button } from "@/components/ui/button";
import { ArrowRight, BellRing, CalendarCheck2, Check, TicketCheck } from "lucide-react";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

const icons = [CalendarCheck2, BellRing, TicketCheck] as const;

const promoCopy = {
  sl: {
    eyebrow: "Aplikacija za vaše stranke",
    title: "Calendra Connect poveže vaše stranke z vašim podjetjem",
    body: "Stranke lahko v aplikaciji rezervirajo in upravljajo termine, prejemajo obvestila, opravijo plačilo ter dostopajo do ugodnosti in vstopnic.",
    bullets: ["Rezervacije in spremembe termina", "Obvestila, plačila in sporočila", "Paketi, ugodnosti in QR vstopnice"],
    cta: "Spoznajte Calendra Connect",
    appointments: "Moji termini",
    next: "Naslednji termin",
    time: "Danes ob 16:00",
  },
  en: {
    eyebrow: "An app for your customers",
    title: "Calendra Connect links your customers with your business",
    body: "Customers can book and manage appointments, receive notifications, make payments and access benefits and tickets in the app.",
    bullets: ["Bookings and appointment changes", "Notifications, payments and messages", "Packages, benefits and QR tickets"],
    cta: "Discover Calendra Connect",
    appointments: "My appointments",
    next: "Next appointment",
    time: "Today at 4:00 PM",
  },
} as const;

const CalendraConnectPromo = () => {
  const { language } = useSiteLanguage();
  const copy = promoCopy[language];

  return (
    <section className="relative overflow-hidden bg-transparent py-16 md:py-20 lg:py-28">
      <div className="container relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.86fr] lg:items-center lg:gap-20">
          <div className="max-w-2xl">
            <span className="marketing-eyebrow">{copy.eyebrow}</span>
            <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[3rem]">{copy.title}</h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{copy.body}</p>
            <ul className="mt-7 grid gap-3">
              {copy.bullets.map((bullet, index) => {
                const Icon = icons[index];
                return (
                  <li key={bullet} className="flex items-center gap-3 text-sm font-semibold text-foreground sm:text-base">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/[0.075] text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                    {bullet}
                  </li>
                );
              })}
            </ul>
            <Button variant="hero" size="lg" className="mt-8 rounded-xl" asChild>
              <a href={getRoutePath("connect", language)}>{copy.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </Button>
          </div>

          <div className="relative mx-auto min-h-[470px] w-full max-w-[540px]">
            <div className="pointer-events-none absolute inset-8 rounded-[48%] bg-gradient-to-br from-primary/[0.14] via-violet-400/[0.08] to-accent/[0.11] blur-3xl" aria-hidden="true" />
            <div className="absolute left-[5%] top-[13%] hidden w-[46%] rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_30px_70px_-38px_rgba(15,23,42,0.42)] sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-primary">Connect</p>
              <p className="mt-3 font-display text-xl font-bold text-foreground">{language === "sl" ? "Rezervacija potrjena" : "Booking confirmed"}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/[0.11] text-emerald-600"><Check className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Masaža</p><p className="text-xs text-muted-foreground">Danes · 16:00</p></div></div>
              </div>
            </div>

            <div className="absolute right-[3%] top-0 w-[58%] min-w-[250px] rounded-[2.8rem] border-[7px] border-slate-900 bg-white p-3 shadow-[0_36px_80px_-34px_rgba(15,23,42,0.52)] sm:w-[52%]">
              <div className="rounded-[2rem] bg-white px-4 pb-5 pt-6">
                <div className="flex items-center justify-between">
                  <img src="/connect/calendra-connect-icon.png" alt="Calendra Connect" width="64" height="64" className="h-10 w-10 rounded-xl" loading="lazy" />
                  <span className="rounded-full bg-primary/[0.08] px-3 py-1 text-[10px] font-bold text-primary">Connect</span>
                </div>
                <p className="mt-6 font-display text-lg font-bold text-foreground">{copy.appointments}</p>
                <div className="mt-4 rounded-2xl bg-primary p-4 text-primary-foreground">
                  <p className="text-[10px] text-primary-foreground/80">{copy.next}</p>
                  <p className="mt-3 text-sm font-bold">{copy.time}</p>
                </div>
                {[0, 1, 2].map((item) => <div key={item} className="mt-2.5 flex items-center gap-3 rounded-xl border border-border/60 bg-slate-50 p-2.5"><Check className="h-3.5 w-3.5 text-primary" /><span className="h-2 flex-1 rounded-full bg-muted" /></div>)}
              </div>
            </div>

            <div className="absolute bottom-2 left-[3%] w-[48%] rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_28px_64px_-36px_rgba(15,23,42,0.40)]">
              <div className="flex items-center gap-3"><BellRing className="h-5 w-5 text-primary" /><p className="text-sm font-bold text-foreground">{language === "sl" ? "Samodejna obvestila" : "Automatic notifications"}</p></div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{language === "sl" ? "Opomniki in spremembe termina vedno pravočasno." : "Reminders and booking changes delivered on time."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendraConnectPromo;
