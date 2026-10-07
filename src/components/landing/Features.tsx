import { ArrowRight, Bell, CalendarCheck2, CalendarDays, CheckCheck, MessageCircle, Plug, Receipt, Users } from "lucide-react";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import IntegrationMark from "./IntegrationMark";

const features = [
  { copyIndex: 0, route: "booking", icon: CalendarCheck2, image: "booking", width: 1149, height: 856, tone: "landscape" },
  { copyIndex: 2, route: "invoicing", icon: Receipt, image: "billing", width: 367, height: 819, tone: "portrait" },
  { copyIndex: 4, route: "reminders", icon: Bell, image: "notifications", width: 363, height: 417, tone: "notifications" },
  { copyIndex: 1, route: "calendar", icon: CalendarDays, image: "calendar-mobile", width: 367, height: 819, tone: "portrait" },
  { copyIndex: 3, route: "clientManagement", icon: Users, image: "clients", width: 824, height: 913, tone: "clients" },
  { copyIndex: 5, route: "integrations", icon: Plug, image: null, width: 0, height: 0, tone: "integrations" },
] satisfies { copyIndex: number; route: CanonicalRouteKey; icon: typeof Plug; image: string | null; width: number; height: number; tone: string }[];

const screenshotAlt = {
  sl: ["Izbira datuma in ure s povzetkom spletne rezervacije", "Dodajanje storitev na račun s pregledom zneska", "Nastavitve obvestil ob rezervaciji, spremembi in preklicu termina", "Mobilni koledar z urniki zaposlenih in filtri prostorov", "Profil stranke s prihodnjimi termini in zgodovino obiskov"],
  en: ["Date and time selection with an online booking summary", "Adding services to an invoice with a total", "Notification settings for bookings, changes and cancellations", "Mobile calendar with employee schedules and room filters", "Client profile with upcoming appointments and visit history"],
};

const Features = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).features;

  return (
    <section id="funkcionalnosti" className="home-features home-section" aria-labelledby="features-heading">
      <div className="container">
        <div className="home-section-heading text-center">
          <span className="marketing-eyebrow">{copy.eyebrow}</span>
          <h2 id="features-heading" className="marketing-section-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="home-feature-grid">
          {features.map((feature, index) => {
            const item = copy.items[feature.copyIndex];
            const Icon = feature.icon;
            return (
              <article key={feature.route} className={`home-feature-card home-feature-${feature.tone}`}>
                <div className="home-feature-heading">
                  <span className="home-feature-icon"><Icon aria-hidden="true" /></span>
                  <div><h3>{item.title}</h3><p>{item.description}</p></div>
                </div>
                <div className="home-feature-visual">
                  {feature.image ? <div className="home-feature-screen"><img src={`/homepage/${feature.image}.webp`} width={feature.width} height={feature.height} alt={screenshotAlt[language][index]} loading="lazy" decoding="async" /></div> : (
                    <div className="home-feature-connections">
                      {["Google Calendar", "Zoom", "Stripe"].map((name, markIndex) => <div key={name}><IntegrationMark index={markIndex} /><span>{name}</span></div>)}
                    </div>
                  )}
                  {feature.tone === "notifications" && (
                    <div className="home-sms-preview">
                      <div className="home-sms-sender"><span className="home-sms-icon"><MessageCircle aria-hidden="true" /></span><strong>Calendra</strong><span className="home-sms-label">{language === "sl" ? "Primer SMS-a" : "Example SMS"}</span></div>
                      <p>{language === "sl" ? <>Vaš termin je potrjen.<br />Individualna vadba<br />9. 10. 2026 ob 10:55.<br />Se vidimo!</> : <>Your appointment is confirmed.<br />Personal training<br />9 Oct 2026 at 10:55.<br />See you soon!</>}</p>
                      <CheckCheck className="home-sms-delivered" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <a className="home-feature-link" href={getRoutePath(feature.route, language)}>{item.linkLabel}<ArrowRight aria-hidden="true" /></a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
