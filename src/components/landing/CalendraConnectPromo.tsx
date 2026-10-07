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
    <section className="connect-promo-editorial relative overflow-hidden py-16 md:py-20 lg:py-28">
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

          <div className="home-connect-preview">
            <div className="home-connect-phone">
              <div className="flex items-center justify-between">
                <img src="/connect/calendra-connect-icon.png" alt="Calendra Connect" width="40" height="40" className="h-9 w-9 rounded-xl" loading="lazy" />
                <span className="text-xs font-semibold text-primary">Connect</span>
              </div>
              <p className="mt-6 text-base font-bold">{copy.appointments}</p>
              <div className="home-connect-next">
                <p>{copy.next}</p><strong>{copy.time}</strong>
                <span>{language === "sl" ? "Masaža" : "Massage"}</span>
              </div>
              <p className="mb-3 mt-5 text-xs font-semibold">{language === "sl" ? "Prihodnji termini" : "Upcoming appointments"}</p>
              {[{ date: language === "sl" ? "Pet, 9. okt 2026" : "Fri, 9 Oct 2026", time: "10:55–12:10", service: language === "sl" ? "Individualna vadba" : "Personal training" }, { date: language === "sl" ? "Sre, 14. okt 2026" : "Wed, 14 Oct 2026", time: "14:30–15:30", service: language === "sl" ? "Fizioterapija" : "Physiotherapy" }].map((appointment) => (
                <div key={appointment.date} className="home-connect-appointment"><strong>{appointment.date}</strong><span>{appointment.time}</span><span>{appointment.service}</span></div>
              ))}
            </div>
            <div className="home-connect-confirmation">
              <span className="home-connect-check"><Check aria-hidden="true" /></span>
              <strong>{language === "sl" ? "Rezervacija potrjena" : "Booking confirmed"}</strong>
              <span>{language === "sl" ? "Masaža" : "Massage"}</span>
              <span>{language === "sl" ? "Danes · 16:00" : "Today · 16:00"}</span>
              <small>{language === "sl" ? "Hvala za vašo rezervacijo! Se vidimo kmalu." : "Thank you for booking! See you soon."}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendraConnectPromo;
