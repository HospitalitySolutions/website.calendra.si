import { ArrowRight, BellRing, CalendarCheck2, Check, TicketCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="overflow-hidden bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.08] p-8 shadow-soft md:p-12">
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/[0.10] blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.title}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.body}</p>
              <ul className="mt-7 grid gap-3">
                {copy.bullets.map((bullet, index) => {
                  const Icon = icons[index];
                  return (
                    <li key={bullet} className="flex items-center gap-3 text-sm font-semibold text-foreground">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/[0.09] text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></span>
                      {bullet}
                    </li>
                  );
                })}
              </ul>
              <Button variant="hero" size="lg" className="mt-8 rounded-xl" asChild>
                <a href={getRoutePath("connect", language)}>{copy.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              </Button>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div className="mx-auto w-[72%] rounded-[2.8rem] border-[8px] border-foreground bg-background p-3 shadow-2xl">
                <div className="rounded-[2rem] bg-card px-5 pb-6 pt-8">
                  <div className="flex items-center justify-between">
                    <img src="/connect/calendra-connect-icon.png" alt="Calendra Connect" width="64" height="64" className="h-12 w-12 rounded-2xl" loading="lazy" />
                    <span className="rounded-full bg-primary/[0.09] px-3 py-1 text-xs font-bold text-primary">Connect</span>
                  </div>
                  <p className="mt-7 font-display text-xl font-bold text-foreground">{copy.appointments}</p>
                  <div className="mt-5 rounded-2xl bg-primary p-5 text-primary-foreground">
                    <p className="text-xs text-primary-foreground/75">{copy.next}</p>
                    <p className="mt-5 font-bold">{copy.time}</p>
                  </div>
                  {[0, 1, 2].map((item) => <div key={item} className="mt-3 flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3"><Check className="h-4 w-4 text-primary" /><span className="h-2 flex-1 rounded-full bg-muted" /></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendraConnectPromo;
