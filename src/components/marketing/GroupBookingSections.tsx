import type { RefObject } from "react";
import { ArrowRight, CalendarDays, Check, CreditCard, Dumbbell, GraduationCap, Ticket, Users } from "lucide-react";
import { TrialSignupLink } from "@/components/TrialSignupLink";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import type { FeaturePageContent } from "@/lib/feature-pages";
import { getRoutePath } from "@/lib/localized-routes";
import { trackMarketingEvent } from "@/lib/marketing-events";
import type { SiteLanguage } from "@/lib/site-language";
import GroupBookingVideo from "./GroupBookingVideo";
import "@/styles/group-bookings.css";

type GroupBookingHeroProps = {
  page: FeaturePageContent;
  language: SiteLanguage;
  ctaRef: RefObject<HTMLDivElement>;
};

export const GroupBookingHero = ({ page, language, ctaRef }: GroupBookingHeroProps) => {
  const sl = language === "sl";
  const titleLines = sl
    ? ["Skupinske rezervacije", "in termini", "na enem mestu."]
    : ["Group bookings", "and appointments", "in one place."];

  return (
    <section className="group-bookings-hero" aria-labelledby="group-bookings-heading">
      <div className="container">
        <PageBreadcrumbs routeKey="groupBookings" />
        <div className="group-bookings-hero-layout">
          <div className="group-bookings-hero-copy">
            <span className="marketing-eyebrow">{page.eyebrow}</span>
            <h1 id="group-bookings-heading" className="font-display">
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
                <TrialSignupLink onClick={() => trackMarketingEvent("trial_cta_click", { placement: "feature_page", language })}>
                  {sl ? "Preizkusite brezplačno" : "Try it free"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </TrialSignupLink>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href={getRoutePath("demo", language)}
                  onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "feature_page", language })}
                >
                  {sl ? "Rezervirajte predstavitev" : "Book a demo"}
                </a>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />{sl ? "14 dni brezplačno" : "14-day free trial"}</li>
              <li className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" aria-hidden="true" />{sl ? "Brez kreditne kartice" : "No credit card required"}</li>
            </ul>
          </div>
          <GroupBookingVideo language={language} />
        </div>
      </div>
    </section>
  );
};

const useCaseIcons = [Dumbbell, GraduationCap, Ticket, Users];

export const GroupBookingUseCases = ({ page }: { page: FeaturePageContent }) => (
  <section className="group-bookings-use-cases" aria-labelledby="group-bookings-use-cases-heading">
    <div className="container">
      <h2 id="group-bookings-use-cases-heading" className="font-display">{page.useCasesTitle}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{page.useCasesIntro}</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {page.useCases.map((useCase, index) => {
          const Icon = useCaseIcons[index] ?? Users;
          return (
            <article key={useCase.title} className="flex items-start gap-4 rounded-xl border border-border bg-white p-5">
              <Icon className="h-7 w-7 shrink-0 text-primary" strokeWidth={1.65} aria-hidden="true" />
              <div>
                <h3 className="font-display text-base font-bold leading-6 tracking-tight">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{useCase.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
