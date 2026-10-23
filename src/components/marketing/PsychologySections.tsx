import type { RefObject } from "react";
import { ArrowRight, BellRing, CalendarDays, Check, Clock3, CreditCard, FileText, ShieldCheck, UsersRound, BarChart3 } from "lucide-react";
import { TrialSignupLink } from "@/components/TrialSignupLink";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { trackMarketingEvent } from "@/lib/marketing-events";
import type { IndustryContent } from "@/lib/industry-pages";
import type { SiteLanguage } from "@/lib/site-language";
import PsychologyVideo from "./PsychologyVideo";
import "@/styles/group-bookings.css";

type PsychologyHeroProps = {
  page: IndustryContent;
  language: SiteLanguage;
  ctaRef: RefObject<HTMLDivElement>;
};

export const PsychologyHero = ({ page, language, ctaRef }: PsychologyHeroProps) => {
  const sl = language === "sl";
  const titleLines = sl
    ? ["Program za naročanje", "in upravljanje terminov", "za psihologe"]
    : ["Appointment booking", "and team scheduling", "for psychologists"];

  return (
    <section className="group-bookings-hero psychology-hero" aria-labelledby="psychology-hero-title">
      <div className="container">
        <PageBreadcrumbs routeKey="psychologyCounselling" />
        <div className="group-bookings-hero-layout">
          <div className="group-bookings-hero-copy">
            <span className="marketing-eyebrow">{page.eyebrow}</span>
            <h1 id="psychology-hero-title" className="font-display text-3xl font-bold tracking-tight">
              {titleLines.map((line, index) => (
                <span key={line} className={index === 2 ? "text-primary" : undefined}>
                  {index > 0 ? " " : ""}{line}
                </span>
              ))}
            </h1>
            <p className="group-bookings-intro">{page.intro}</p>
            <ul className="group-bookings-points">
              {page.heroPoints.map((point) => (
                <li key={point}>
                  <span><Check aria-hidden="true" /></span>
                  {point}
                </li>
              ))}
            </ul>
            <div ref={ctaRef} className="group-bookings-actions mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button variant="hero" size="lg" asChild>
                <TrialSignupLink onClick={() => trackMarketingEvent("trial_cta_click", { placement: "industry_page", language })}>
                  {sl ? "Preizkusite brezplačno" : "Try it free"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </TrialSignupLink>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#funkcionalnosti-panoge">
                  {sl ? "Odkrijte funkcionalnosti" : "Explore features"}
                </a>
              </Button>
            </div>
          </div>
          <PsychologyVideo language={language} />
        </div>
      </div>
    </section>
  );
};

export const PsychologyUseCases = ({ language }: { language: SiteLanguage }) => {
  const sl = language === "sl";
  const cards = sl ? [
    { title: "Individualni in spletni termini", body: "Enostavno upravljanje osebnih srečanj in spletnih terminov (Google Meet, Zoom)." },
    { title: "Več izvajalcev in prostorov", body: "Primerno za samostojne prakse in svetovalne centre z več psihologi." },
    { title: "Plačila in računi", body: "Predplačila, paketi, članarine ter enostavno izdajanje računov." },
    { title: "Opomniki in avtomatizacija", body: "Samodejni opomniki za stranke in notranja obvestila za izvajalce." },
  ] : [
    { title: "In-person and online appointments", body: "Manage office visits and online sessions (Google Meet, Zoom)." },
    { title: "Multiple practitioners and rooms", body: "Built for independent practices and centres with several psychologists." },
    { title: "Payments and invoicing", body: "Advance payments, packages, memberships and straightforward invoices." },
    { title: "Reminders and automation", body: "Automatic appointment reminders and team notifications." },
  ];
  const icons = [CalendarDays, UsersRound, CreditCard, BellRing];
  return (
    <section className="group-bookings-use-cases" aria-labelledby="psychology-why-title">
      <div className="container">
        <h2 id="psychology-why-title" className="font-display text-3xl font-bold tracking-tight">
          {sl ? "Zakaj psihologi in svetovalci izberejo Calendro?" : "Why do psychologists and counsellors choose Calendra?"}
        </h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {sl ? "Vse, kar potrebujete za učinkovito vodenje terminov in strank – na enem mestu." : "Everything you need to manage appointments and clients in one place."}
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((item, index) => {
            const Icon = icons[index];
            return (
              <article key={item.title} className="rounded-xl border border-border bg-white p-5">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="font-display text-base font-bold leading-6 tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const PsychologyBenefits = ({ language }: { language: SiteLanguage }) => {
  const sl = language === "sl";
  const cards = sl ? [
    { title: "Manj usklajevanja", body: "Stranke se po vaši izbiri naročajo same ali jih v koledar vnese osebje. Manj klicev in e-pošte." },
    { title: "Vse na enem mestu", body: "Termini, stranke, administrativni podatki, plačila in računi – pregledno v enem sistemu." },
    { title: "Varno in zaupno", body: "Nastavljive pravice dostopa in varno upravljanje administrativnih podatkov. Ni namenjeno klinični dokumentaciji." },
    { title: "Profesionalen vtis", body: "Urejeno naročanje, samodejni opomniki in jasna komunikacija s strankami." },
  ] : [
    { title: "Less coordination", body: "Clients can self-book or your team can manage appointments. Fewer calls and emails." },
    { title: "Everything in one place", body: "Appointments, clients, administrative details, payments and invoices in one system." },
    { title: "Privacy-conscious workflows", body: "Role-based access for administrative data. Not intended for clinical records." },
    { title: "A professional experience", body: "Organised booking, automatic reminders and clear client communication." },
  ];
  const icons = [Clock3, FileText, ShieldCheck, BarChart3];
  return (
    <section className="psychology-benefits bg-background py-12 md:py-14" aria-labelledby="psychology-benefits-title">
      <div className="container">
        <h2 id="psychology-benefits-title" className="font-display text-3xl font-bold tracking-tight">
          {sl ? "Kaj pridobite z urejenimi termini in strankami?" : "What do you gain from better organised appointments?"}
        </h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {sl ? "Calendra vam pomaga pri vsakdanjem delu, da se lahko osredotočite na to, kar je najpomembnejše – na svoje stranke." : "Calendra simplifies administration so you can focus on what matters most: your clients."}
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((item, index) => {
            const Icon = icons[index];
            return (
              <article key={item.title} className="rounded-xl border border-border bg-white p-5">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="font-display text-base font-bold leading-6 tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
