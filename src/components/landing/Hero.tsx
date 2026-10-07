import { ArrowRight, CalendarClock, Check, CreditCard, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { trackMarketingEvent } from "@/lib/marketing-events";

const Hero = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).hero;

  return (
    <section className="home-hero" aria-labelledby="home-heading">
      <div className="container home-hero-layout">
        <div className="home-hero-copy">
          <h1 id="home-heading" className="font-display">
            {language === "sl" ? <>Program za naročanje strank, termine in račune <span className="text-primary">na enem mestu</span></> : <>Appointment booking, scheduling and invoicing <span className="text-primary">in one place</span></>}
            <span className="text-accent">.</span>
          </h1>
          <p className="home-hero-supporting">{copy.supportingTitle}</p>
          <p className="home-hero-description">{copy.description}</p>
          <div className="home-hero-actions">
            <Button variant="hero" size="lg" asChild>
              <a href={TRIAL_SIGNUP_ROUTE} onClick={() => trackMarketingEvent("trial_cta_click", { placement: "homepage_hero", language })}>
                {copy.primaryCta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={language === "sl" ? "/predstavitev" : "/en/demo"} onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: "homepage_hero", language })}>
                <CalendarClock className="h-4 w-4" aria-hidden="true" />{copy.secondaryCta}
              </a>
            </Button>
          </div>
          <ul className="home-reassurance">
            {[{ label: copy.freeTrial, icon: ShieldCheck }, { label: copy.noCard, icon: CreditCard }, { label: copy.cancelAnytime, icon: Check }].map(({ label, icon: Icon }) => (
              <li key={label}><Icon aria-hidden="true" />{label}</li>
            ))}
          </ul>
        </div>
        <div className="home-hero-product">
          <div className="home-product-devices">
            <div className="home-desktop-frame">
              <div className="home-browser-bar" aria-hidden="true"><span /><span /><span /><small>app.calendra.si</small></div>
              <img
                src="/homepage/calendar-desktop.webp"
                srcSet="/homepage/calendar-desktop-640.webp 640w, /homepage/calendar-desktop-960.webp 960w, /homepage/calendar-desktop-1280.webp 1280w, /homepage/calendar-desktop.webp 1912w"
                sizes="(min-width: 1400px) 670px, (min-width: 1024px) 52vw, 88vw"
                width={1912} height={914} {...{ fetchpriority: "high" }} decoding="async"
                alt={language === "sl" ? "Dnevni koledar Calendra s termini treh zaposlenih" : "Calendra daily calendar with appointments for three employees"}
              />
            </div>
            <div className="home-mobile-frame">
              <img src="/homepage/calendar-mobile.webp" width={367} height={819} decoding="async" alt={language === "sl" ? "Mobilni koledar Calendra s pregledom ekipe in prostorov" : "Calendra mobile calendar with team and room filters"} />
            </div>
          </div>
          <div className="home-review-rating">
            <span className="flex gap-0.5" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-4 w-4 fill-accent text-accent" />)}</span>
            <span>{copy.reviewRating}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
