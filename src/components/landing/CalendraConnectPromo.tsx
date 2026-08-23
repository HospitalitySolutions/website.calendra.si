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
  const appCopy = language === "sl"
    ? {
        greeting: "Pozdravljena, Maja",
        next: "Naslednji termin",
        service: "Masaža",
        date: "Petek, 24. maj 2024",
        manage: "Upravljaj rezervacijo",
        add: "Dodaj v koledar",
        quick: "Hitre akcije",
        actions: ["Moje rezervacije", "Zgodovina in računi", "Plačila in predplačila"],
        confirmed: "Rezervacija potrjena",
        notifications: "Samodejna obvestila",
      }
    : {
        greeting: "Welcome, Maya",
        next: "Next appointment",
        service: "Massage",
        date: "Friday, 24 May 2024",
        manage: "Manage booking",
        add: "Add to calendar",
        quick: "Quick actions",
        actions: ["My bookings", "History and invoices", "Payments and deposits"],
        confirmed: "Booking confirmed",
        notifications: "Automatic notifications",
      };

  return (
    <section className="relative overflow-hidden bg-[#fff9f2] py-16 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-2 bg-orange-500" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-28 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-orange-100/50 blur-3xl" aria-hidden="true" />
      <div className="container relative mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.48fr_0.52fr] lg:items-center lg:gap-14 xl:gap-20">
          <div className="max-w-2xl py-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.19em] text-orange-600 sm:text-sm">{copy.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.045em] text-[#071b3a] sm:text-5xl lg:text-[3.65rem] lg:leading-[1.03]">{copy.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{copy.body}</p>
            <ul className="mt-7 divide-y divide-slate-200/80 border-y border-slate-200/80">
              {copy.bullets.map((bullet, index) => {
                const Icon = icons[index];
                return (
                  <li key={bullet} className="flex items-center gap-3 py-3.5 text-sm font-semibold text-[#071b3a] sm:text-base">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                    {bullet}
                  </li>
                );
              })}
            </ul>
            <Button variant="hero" size="lg" className="mt-8 h-12 rounded-[9px] px-6 shadow-[0_16px_30px_-16px_rgba(13,99,229,0.58)]" asChild>
              <a href={getRoutePath("connect", language)}>{copy.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </Button>
          </div>

          <div className="relative mx-auto min-h-[590px] w-full max-w-[650px] sm:min-h-[650px] lg:min-h-[620px]">
            <div className="pointer-events-none absolute left-[13%] top-[38%] h-px w-[46%] bg-orange-400" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-[20%] left-[21%] h-px w-[34%] bg-orange-400" aria-hidden="true" />

            <div className="absolute left-[4%] top-[34%] z-20 hidden w-[43%] rounded-[14px] border border-slate-200 bg-white p-4 shadow-[0_26px_60px_-28px_rgba(15,23,42,0.4)] sm:block">
              <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-4 w-4" /></span><p className="text-sm font-extrabold text-[#071b3a]">{appCopy.confirmed}</p></div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3"><div><p className="text-sm font-bold text-slate-900">{appCopy.service}</p><p className="mt-0.5 text-[11px] text-slate-500">{appCopy.date}</p></div><span className="text-xs font-bold text-primary">14:00</span></div>
            </div>

            <div className="absolute right-[-1%] top-0 z-10 w-[70%] min-w-[285px] rounded-[3.25rem] border-[7px] border-[#071b3a] bg-white p-2 shadow-[0_40px_90px_-32px_rgba(7,27,58,0.48)] sm:w-[61%] lg:right-[2%]">
              <div className="overflow-hidden rounded-[2.6rem] bg-white px-4 pb-6 pt-5 sm:px-5">
                <div className="mx-auto mb-4 h-5 w-24 rounded-full bg-[#071b3a]" aria-hidden="true" />
                <div className="flex items-center justify-between"><img src="/connect/calendra-connect-icon.png" alt="Calendra Connect" width="48" height="48" className="h-8 w-8 rounded-lg object-contain" loading="lazy" /><BellRing className="h-4 w-4 text-primary" aria-hidden="true" /></div>
                <p className="mt-5 font-display text-xl font-extrabold text-[#071b3a]">{appCopy.greeting}</p>
                <div className="mt-4 rounded-[14px] border border-blue-100 bg-blue-50/60 p-3">
                  <p className="text-[10px] font-medium text-slate-500">{appCopy.next}</p>
                  <div className="mt-2 flex items-start justify-between"><div><p className="text-sm font-extrabold text-[#071b3a]">{appCopy.service}</p><p className="mt-0.5 text-[10px] text-slate-500">{appCopy.date} · 14:00</p></div><CalendarCheck2 className="h-4 w-4 text-primary" aria-hidden="true" /></div>
                  <button type="button" className="mt-3 h-8 w-full rounded-lg bg-primary text-[10px] font-bold text-white">{appCopy.manage}</button>
                  <button type="button" className="mt-2 h-8 w-full rounded-lg border border-blue-200 bg-white text-[10px] font-bold text-primary">{appCopy.add}</button>
                </div>
                <p className="mt-5 text-xs font-extrabold text-[#071b3a]">{appCopy.quick}</p>
                <div className="mt-2 divide-y divide-slate-100 rounded-[14px] border border-slate-200">
                  {appCopy.actions.map((action) => <div key={action} className="flex items-center justify-between px-3 py-3 text-[11px] font-semibold text-slate-700"><span>{action}</span><ArrowRight className="h-3 w-3 text-primary" aria-hidden="true" /></div>)}
                </div>
              </div>
            </div>

            <div className="absolute bottom-[7%] left-[12%] z-20 hidden w-[42%] rounded-[14px] border border-slate-200 bg-white p-4 shadow-[0_26px_60px_-28px_rgba(15,23,42,0.4)] sm:block">
              <div className="flex items-center gap-3"><BellRing className="h-5 w-5 text-primary" /><p className="text-sm font-extrabold text-[#071b3a]">{appCopy.notifications}</p></div>
              <p className="mt-2 text-xs leading-5 text-slate-500">{language === "sl" ? "Opomniki in spremembe termina vedno pravočasno." : "Reminders and booking changes, always on time."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendraConnectPromo;
