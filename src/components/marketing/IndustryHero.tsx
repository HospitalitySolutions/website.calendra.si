import type { RefObject } from "react";
import { ArrowRight, CalendarDays, Check, CreditCard } from "lucide-react";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { TrialSignupLink } from "@/components/TrialSignupLink";
import type { CanonicalRouteKey } from "@/lib/localized-routes";
import { getRoutePath } from "@/lib/localized-routes";
import type { MarketingImage } from "@/lib/marketing-images";
import { trackMarketingEvent } from "@/lib/marketing-events";
import type { SiteLanguage } from "@/lib/site-language";
import "@/styles/group-bookings.css";
import "@/styles/industry-hero.css";

const labels = {
  sl: { trial: "Preizkusite brezplačno", demo: "Rezervirajte predstavitev", trialNote: "14 dni brezplačno", cardNote: "Brez kreditne kartice" },
  en: { trial: "Try it free", demo: "Book a demo", trialNote: "14 days free", cardNote: "No credit card required" },
} as const;

export type IndustryHeroCard = {
  image: MarketingImage;
  alt: string;
  caption: string;
};

const ProductImage = ({ image, alt, sizes }: { image: MarketingImage; alt: string; sizes: string }) => (
  <img src={image.src} srcSet={image.srcSet} sizes={sizes} alt={alt} width={image.width} height={image.height}
    loading="eager" decoding="async" className="h-auto w-full" />
);

/** Trial + demo buttons shared by every industry page hero and closing CTA. */
export const IndustryHeroActions = ({ language }: { language: SiteLanguage }) => {
  const copy = labels[language];
  return (
    <div className="group-bookings-actions flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button variant="hero" size="lg" asChild>
        <TrialSignupLink onClick={() => trackMarketingEvent("trial_cta_click", { placement: "industry_page", language })}>
          {copy.trial}<ArrowRight className="h-4 w-4" aria-hidden="true" />
        </TrialSignupLink>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <a href={getRoutePath("demo", language)} onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "industry_page", language })}>{copy.demo}</a>
      </Button>
    </div>
  );
};

export const IndustryTrialNotes = ({ language }: { language: SiteLanguage }) => (
  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
    <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />{labels[language].trialNote}</span>
    <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />{labels[language].cardNote}</span>
  </div>
);

type IndustryHeroProps = {
  id: string;
  titleId: string;
  routeKey: CanonicalRouteKey;
  language: SiteLanguage;
  eyebrow: string;
  /** Rendered as block lines; the last line carries the blue highlight. */
  titleLines: readonly string[];
  intro: string;
  points: readonly string[];
  /** Large schedule card, booking card and small client card, in that order. */
  cards: readonly [IndustryHeroCard, IndustryHeroCard, IndustryHeroCard];
  screenshotNote: string;
  ctaRef: RefObject<HTMLDivElement>;
};

/**
 * The approved industry hero: copy, check-mark points, trial/demo actions and a
 * layered composition of three real product screenshots.
 */
const IndustryHero = ({ id, titleId, routeKey, language, eyebrow, titleLines, intro, points, cards, screenshotNote, ctaRef }: IndustryHeroProps) => {
  const [calendar, booking, client] = cards;
  const highlightIndex = titleLines.length - 1;
  return (
    <section id={id} className="group-bookings-hero" aria-labelledby={titleId}>
      <div className="container">
        <PageBreadcrumbs routeKey={routeKey} />
        <div className="group-bookings-hero-layout">
          <div className="group-bookings-hero-copy">
            <span className="marketing-eyebrow">{eyebrow}</span>
            <h1 id={titleId} className="font-display text-3xl font-bold tracking-tight">
              {titleLines.map((line, index) => <span key={line} className={index === highlightIndex ? "text-primary" : undefined}>{index > 0 ? " " : ""}{line}</span>)}
            </h1>
            <p className="group-bookings-intro">{intro}</p>
            <ul className="group-bookings-points">
              {points.map((point) => <li key={point}><span><Check aria-hidden="true" /></span>{point}</li>)}
            </ul>
            <div ref={ctaRef} className="mt-8"><IndustryHeroActions language={language} /></div>
            <IndustryTrialNotes language={language} />
          </div>
          <div className="industry-hero-product" aria-label={screenshotNote}>
            <figure className="industry-hero-calendar rounded-2xl border border-border bg-white p-3 shadow-xl">
              <figcaption className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />{calendar.caption}</figcaption>
              <ProductImage image={calendar.image} alt={calendar.alt} sizes="(min-width: 1024px) 620px, 92vw" />
            </figure>
            <figure className="industry-hero-booking rounded-2xl border border-border bg-white p-3 shadow-lg">
              <figcaption className="mb-3 text-xs font-semibold">{booking.caption}</figcaption>
              <ProductImage image={booking.image} alt={booking.alt} sizes="(min-width: 1024px) 240px, 44vw" />
            </figure>
            <figure className="industry-hero-client rounded-2xl border border-border bg-white p-3 shadow-lg">
              <figcaption className="mb-3 text-xs font-semibold">{client.caption}</figcaption>
              <ProductImage image={client.image} alt={client.alt} sizes="(min-width: 1024px) 160px, 38vw" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryHero;
